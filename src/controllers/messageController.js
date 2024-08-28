import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "../services/authSlice";
import {
    useDeleteConversationMutation,
    useGetConversationDetailsQuery,
    useGetMessagesQuery,
    useSendMessageMutation,
    useUpdateNotificationStatusMutation,
    useUpdateRequestStatusMutation
} from "../services/posts/messagesApiSlice";
import { handleError } from "../utils/handleError";
import { toast } from "sonner";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storageDB } from "../utils/firestore";
import { randomId } from "../helpers/randomid";
import { allowedDocumentExtensions, combinedExtensions } from "../helpers/extensions";
import { getFileExtension } from "../helpers/getFileExtension";
import { useLocation, useNavigate } from "react-router-dom";
import Pusher from 'pusher-js';
import { formatDate } from "../utils/formatMessageDate";

export const useMessagesController = (currentChat, setCurrentChat) => {

    //hooks and variable declarations
    const navigate = useNavigate();
    const location = useLocation();
    const messagesEndRef = useRef();
    const token = useSelector(selectCurrentToken);
    const currentUser = useSelector(selectCurrentUser);
    const receiver = currentChat?.members?.find(member => member.id !== currentUser.id);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);

    const { data: chatMessages, isLoading: messageLoading, isError, error } = useGetMessagesQuery({
        id: currentChat?.id,
        search: "",
    }, { skip: !currentChat?.id, refetchOnMountOrArgChange: true });
    const [sendMessage, { isLoading: sendLoading }] = useSendMessageMutation();
    const [updateRequestStatus, { isLoading: requestLoading }] = useUpdateRequestStatusMutation();
    const { data: conversationdetails, isLoading: detailsLoading } = useGetConversationDetailsQuery(currentChat?.id, { skip: !currentChat?.id });
    const [deleteConversation, { isLoading: deleteLoading }] = useDeleteConversationMutation();
    const [updateNotificationStatus, { isLoading: notifyLoading }] = useUpdateNotificationStatusMutation()

    if (isError) {
        const errorMessage = handleError(error);
        toast.error(errorMessage)
    };

    //Functions
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView?.({ behavior: "instant", block: 'end', inline: 'nearest' });
    };

    const addDateIndicators = (messages) => {
        let newMessages = [];
        let currentDate = null;

        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            const messageDate = new Date(message.created_at).toDateString();
            const formattedDate = formatDate(message.created_at);

            // Add date indicator if the date has changed
            if (currentDate !== messageDate) {
                newMessages.push({
                    id: `date-${messageDate}`,
                    message_type: 'date',
                    date: formattedDate,
                });
                currentDate = messageDate;
            }
            newMessages.push(message);
        }
        return newMessages;
    };


    const updatedMessages = addDateIndicators(messages);

    const connectToPusher = () => {
        let pusherChannel; // Declare pusherChannel variable

        // Unsubscribe from the channel if it's already subscribed
        if (pusherChannel) {
            pusherChannel.unbind_all();
            pusher.unsubscribe('private-conversation.' + currentChat?.id);
        }

        const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
            cluster: import.meta.env.VITE_PUSHER_CLUSTER,
            encrypted: true,
            authEndpoint: `${import.meta.env.VITE_BASE_API_URL}/broadcasting/auth`,
            auth: {
                headers: {
                    'content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        });
        pusherChannel = pusher.subscribe('private-conversation.' + currentChat?.id); // Assign pusherChannel
        pusherChannel.bind('receive-message.' + currentUser?.id, (data) => {
            setMessages((prev) => [...prev, { ...data?.data }]);
            scrollToBottom();
        });
        return () => {
            pusherChannel.unbind_all();
            pusher.unsubscribe('private-conversation.' + currentChat?.id);
        };
    };

    const handleRequestStatus = async (action) => {
        try {
            const requestInfo = {
                status: action,
                conversation_id: currentChat?.id
            }
            const res = await updateRequestStatus({ ...requestInfo }).unwrap();
            if (res?.data?.status === "Declined") {
                setCurrentChat(() => null)
            }
            toast.success(res?.message);
            navigate({
                pathname: `${location.pathname}/`,
                search: `?messages=true`,
            }, { replace: true });
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage);
        }
    }

    const uploadFile = (event) => {
        event.preventDefault()
        const { files } = event.target;
        if (!files[0]) return;
        const document = files[0];
        if (!combinedExtensions.includes(getFileExtension(document?.type)?.toLowerCase())) {
            return toast.error("File has to be either ('pdf', 'jpg', 'jpeg', 'pdf', 'doc', 'webp' )")
        }
        const messageData = {
            conversation_id: currentChat?.id,
            receiver_id: receiver?.id,
            sender_id: currentUser?.id,
            message_type: allowedDocumentExtensions.includes((getFileExtension(document?.type)?.toLowerCase())) ? "file" : "media",
            message: text,
            asset_url: URL.createObjectURL(files[0]),
            imageLoading: imageLoading
        }
        setMessages((messages) => [...messages, messageData]);
        saveFileImage(files[0], allowedDocumentExtensions.includes((getFileExtension(document?.type)?.toLowerCase())) ? "file" : "media");
    };

    const saveFileImage = async (file, type) => {
        setImageLoading(true)
        const imageRef = ref(storageDB, `web-images/${randomId()}`);
        const snapshot = await uploadBytes(imageRef, file);
        const url = await getDownloadURL(
            ref(storageDB, snapshot.metadata.fullPath)
        );
        handleFileUpload(url, type)
        setImageLoading(false)
    }

    const handleFileUpload = async (file, type) => {
        try {
            const messageData = {
                conversation_id: currentChat?.id,
                receiver_id: receiver?.id,
                sender_id: currentUser?.id,
                message_type: type,
                message: text,
                asset_url: file,
            }
            const res = await sendMessage(messageData).unwrap();
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage);
        }
        setImagePreview(() => null)
    }

    const handleSubmit = async (event) => {
        event?.preventDefault?.();
        if (!text || text === "") {
            return;
        }
        try {
            const messageData = {
                conversation_id: currentChat?.id,
                receiver_id: receiver?.id,
                sender_id: currentUser?.id,
                message_type: "Text",
                message: text,
                asset_url: null,
            }
            setText("")
            setMessages((messages) => [...messages, messageData]);
            const res = await sendMessage(messageData).unwrap();
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage);
        }
    };

    const handleDeleteConversation = async () => {
        const toastId = toast("Deleting conversation...");
        try {
            const res = await deleteConversation(currentChat?.id).unwrap();
            toast.dismiss(toastId);
            toast.success(res?.message)
            setCurrentChat(null)
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage)
        }
    };

    const handleNotificationStatus = async (status) => {
        const toastId = toast("updating...");
        try {
            const res = await updateNotificationStatus({ id: currentChat?.id, status: { notification_status: status } })
            toast.dismiss(toastId);
            toast.success(res?.data?.message)
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage)
        }
    }

    //Effects
    useEffect(() => {
        messages && scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (currentChat)
            connectToPusher();
        scrollToBottom();
    }, [currentChat])

    useEffect(() => {
        (currentChat && chatMessages) && setMessages(() => [...chatMessages?.data?.data ?? []].reverse());
        scrollToBottom();
    }, [chatMessages]);

    return {
        text,
        setText,
        messages,
        setMessages,
        updatedMessages,
        handleSubmit,
        handleFileUpload,
        currentUser,
        scrollToBottom,
        messagesEndRef,
        chatMessages,
        messageLoading,
        handleRequestStatus,
        requestLoading,
        receiver,
        conversationdetails,
        detailsLoading,
        uploadFile,
        imageLoading,
        sendLoading,
        imagePreview,
        handleDeleteConversation,
        deleteLoading,
        handleNotificationStatus,
    }
}
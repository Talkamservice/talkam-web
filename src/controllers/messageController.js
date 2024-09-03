import { useCallback, useEffect, useRef, useState } from "react";
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
import { formatDate } from "../utils/formatMessageDate";
import { Storage } from "../app/storage";
import Pusher from 'pusher-js';

export const useMessagesController = (currentChat, setCurrentChat, page, setPage) => {

    //hooks and variable declarations
    const navigate = useNavigate();
    const location = useLocation();
    const isRestoringScroll = useRef(false);
    const scrollableRef = useRef(null);
    const messagesEndRef = useRef();
    const token = useSelector(selectCurrentToken);
    const currentUser = useSelector(selectCurrentUser);
    const receiver = currentChat?.members?.find(member => member.id !== currentUser.id);
    const [isFetching, setIsFetching] = useState(false)
    const [imagePreview, setImagePreview] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);
    //server hooks
    const { data: chatMessages, isLoading: messageLoading, isFetching: messageFetching, isError, error, isUninitialized, refetch } = useGetMessagesQuery({
        id: currentChat?.id,
        search: "",
        page: page
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
    const scrollToBottomSmooth = () => {
        messagesEndRef.current?.scrollIntoView?.({ behavior: "smooth", block: 'end', inline: 'nearest' });
    };
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
            if (data?.data) {
                if (data?.data?.conversation_id !== currentChat?.id) {
                    return;
                } else {
                    setMessages((prev) => [...prev, { ...data?.data }]);
                    scrollToBottomSmooth();
                }
            }
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
                search: `messages`,
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
            id: currentChat?.id,
            receiver_id: receiver?.id,
            sender_id: currentUser?.id,
            message_type: allowedDocumentExtensions.includes((getFileExtension(document?.type)?.toLowerCase())) ? "file" : "media",
            message: text,
            asset_url: URL.createObjectURL(files[0]),
            imageLoading: imageLoading,
            created_at: new Date()
        }
        setMessages((messages) => [...messages, messageData]);
        scrollToBottomSmooth();
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
                id: randomId(),
                receiver_id: receiver?.id,
                sender_id: currentUser?.id,
                message_type: "Text",
                message: text,
                asset_url: null,
                created_at: new Date()
            }
            setText("")
            setMessages((messages) => [...messages, messageData]);
            scrollToBottomSmooth();
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

    // //infinite scroll functions
    const messageIds = new Set();
    // Deduplicate new posts
    const newResults = (messages && messages).filter(message => {
        if (!messageIds.has(message.id)) {
            messageIds.add(message.id);
            return true;
        }
        return false;
    });

    const appendNewPageData = () => {
        if (chatMessages?.data?.data) {
            const latestMessages = [...chatMessages?.data?.data].reverse();
            setMessages((prevMessages) => {
                const newMessages = new Set([...latestMessages, ...prevMessages]);
                return Array.from(newMessages);
            });
            setIsFetching(false);
        }
    };

    const handleScroll = useCallback((event) => {
        if (isRestoringScroll.current) return;
        const { scrollTop } = event.target;
        const isAtTop = scrollTop <= 20;

        if (isAtTop && !isFetching && chatMessages?.data?.pagination_meta?.can_load_more) {
            setIsFetching(true);
            setPage((prevPage) => prevPage + 1);
        }
        Storage.setItem("scrollPosition_messages", scrollTop);
    }, [isFetching, chatMessages]);

    const updatedMessages = addDateIndicators(newResults);

    //Effects
    useEffect(() => {
        if (currentChat) {
            connectToPusher();
        }
    }, [chatMessages])

    useEffect(() => {
        if (page === 1 && chatMessages?.data?.data) {
            const newMessages = [...chatMessages?.data?.data].reverse()
            setMessages(() => [...newMessages ?? []]);
        }
    }, [chatMessages, currentChat]);

    useEffect(() => {
        if (page !== 1) {
            appendNewPageData();
        }
    }, [chatMessages]);

    useEffect(() => {
        if (page === 1) {
            scrollToBottom();
        }
    }, [chatMessages, messages, currentChat]);

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
        messageFetching,
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
        handleScroll,
        isFetching,
        scrollableRef,
        newResults,
        setPage,
    }
}
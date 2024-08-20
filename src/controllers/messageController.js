import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../services/authSlice";
import { randomId } from "../helpers/randomid";
import { useGetMessagesQuery } from "../services/posts/messagesApiSlice";

export const useMessagesController = (currentChat) => {

    //hooks and variable declarations
    const messagesEndRef = useRef();
    const receiver = randomId();
    const currentUser = useSelector(selectCurrentUser);
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);

    const { data: chatMessages, isLoading: messageLoading } = useGetMessagesQuery({
        id: currentChat?.id,
        search: "",
    }, { skip: !currentChat?.id });

    //Functions
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView?.({ behavior: "instant", block: 'end', inline: 'nearest' });
    }

    const handleFileUpload = async () => {
        const formData = new FormData();
        const fileField = document.querySelector('input[type="file"]');
        formData.append("files", fileField.files[0]);

        setMessages((messages) =>
            [...messages, {
                conversation_id: currentChat?.id,
                receiver_id: receiver,
                message_type: "media",
                message: text,
                asset_url: fileField.files[0],
            }]
        );
    }

    const handleSubmit = async (event) => {
        event?.preventDefault?.();

        const messageData = {
            conversation_id: currentChat?.id,
            receiver_id: receiver,
            message_type: "Text",
            message: text,
            asset_url: null,
        }

        if (!text || text === "") {
            return;
        }
        setMessages((messages) => [...messages, messageData]);
        setText("")
    };

    //Effects

    useEffect(() => {
        messages && scrollToBottom();
    }, [messages]);

    useEffect(() => {
        (currentChat && chatMessages) && setMessages(() => [...chatMessages?.data?.data ?? []].reverse());
        scrollToBottom();
    }, [chatMessages]);

    return {
        text,
        setText,
        messages,
        setMessages,
        handleSubmit,
        handleFileUpload,
        currentUser,
        scrollToBottom,
        messagesEndRef,
        chatMessages,
        messageLoading,
    }
}
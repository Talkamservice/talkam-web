import { useEffect, useState } from "react";
import { Tabs } from "../../../components/global/tabs";
import { ChatBox } from "./components/chatbox"
import { Conversations } from "./components/conversations";
import { Requests } from "./components/requests";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { useLocation, useNavigate } from "react-router-dom";
import { useCurrentConversationQuery, useGetAllConversationsBareQuery } from "../../../services/posts/messagesApiSlice";
import { useDebounceValue } from "../../../hooks/useDebounceValue";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "../../../services/authSlice";
import Pusher from 'pusher-js';

export const Messages = ({ onClose }) => {

    const currentUser = useSelector(selectCurrentUser)
    const token = useSelector(selectCurrentToken);
    const navigate = useNavigate();
    const { state: receiverId } = useLocation();
    const [search, setSearch] = useState("");
    const debounceValue = useDebounceValue(search);
    const { data: conversations, isLoading, refetch } = useGetAllConversationsBareQuery(
        debounceValue ?? ""
    );
    const { data: currentConvo, isLoading: currentLoading, isSuccess } = useCurrentConversationQuery(receiverId,
        { skip: !receiverId, refetchOnFocus: true, refetchOnMountOrArgChange: true }
    );
    const [currentChat, setCurrentChat] = useState(currentConvo && (currentConvo?.data ?? null));
    const isMobile = useMediaQuery("(max-width: 1024px)");
    let switchBoxView = currentChat && isMobile === true;

    const tabs = [
        {
            id: 0,
            title: "Messages",
            component: <Conversations
                setCurrentChat={setCurrentChat}
                currentChat={currentChat}
                conversations={conversations}
                isLoading={isLoading}
                setSearch={setSearch}
                currentUser={currentUser}
                refetchConvo={refetch}
            />
        },
        {
            id: 1,
            title: "Requests",
            component: <Requests
                setCurrentChat={setCurrentChat}
                currentChat={currentChat}
            />
        },
    ];

    const connectToPusher = () => {
        let pusherChannel; // Declare pusherChannel variable

        // Unsubscribe from the channel if it's already subscribed
        if (pusherChannel) {
            pusherChannel.unbind_all();
            pusher.unsubscribe('refresh-notification.' + currentUser?.id);
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
        pusherChannel = pusher.subscribe('refresh-notification.' + currentUser?.id); // Assign pusherChannel
        pusherChannel.bind('refresh', (data) => {
            console.log(data)
            refetch()
        });
        return () => {
            pusherChannel.unbind_all();
            pusher.unsubscribe('refresh-notification.' + currentUser?.id);
        };
    };

    //Effects
    useEffect(() => {
        if (isSuccess) {
            setCurrentChat(() => currentConvo?.data);
            refetch();
            navigate({
                pathname: `${location.pathname}`,
                search: `?messages=true`,
            }, { replace: true });
        }
    }, [isSuccess])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setCurrentChat(() => null)
            }
        }
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        connectToPusher();
    }, [])

    return (
        <div className="w-full h-[calc(100dvh-2dvh)] top-0 bottom-0 relative">
            <main className='w-full h-full flex flex-1 grow items-start justify-start border-r border-[#E2E4E9] divide-x divide-tgray-200 overflow-hidden'>

                <section className={`w-full h-full md:w-1/3 relative overflow-y-auto pt-5 ${!switchBoxView && isMobile ? 'md:w-full' : ''} ${switchBoxView ? 'hidden' : 'block'}`}>
                    <Tabs
                        tabs={tabs}
                        headerPadding="px-8"
                    />
                </section>

                <section className={`w-full h-full md:w-2/3 ${switchBoxView && 'w-full md:w-full block'} ${!switchBoxView && isMobile ? "hidden" : "block"}`}>
                    <ChatBox
                        setCurrentChat={setCurrentChat}
                        currentChat={currentChat}
                    />
                </section>
            </main>
        </div>
    )
}
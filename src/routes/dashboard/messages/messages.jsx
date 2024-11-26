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
import { X } from "react-feather";
import { useGetNotificationStatsQuery } from "../../../services/notificationsApiSlice";
import Pusher from 'pusher-js';
import Protected from "../../../utils/protected";

export const Messages = ({ onClose }) => {

    const currentUser = useSelector(selectCurrentUser)
    const token = useSelector(selectCurrentToken);
    const navigate = useNavigate();
    const location = useLocation();
    const userFrom = location?.search.split("u=")[1];
    const [search, setSearch] = useState("");
    const debounceValue = useDebounceValue(search);
    const { data: conversations, isLoading, refetch } = useGetAllConversationsBareQuery(
        debounceValue ?? ""
    );
    const { data: currentConvo, isLoading: currentLoading, isSuccess } = useCurrentConversationQuery((userFrom),
        { skip: !userFrom, refetchOnFocus: true, refetchOnMountOrArgChange: true }
    );
    const [currentChat, setCurrentChat] = useState(currentConvo && (currentConvo?.data ?? null));
    const { data: notificationStats, refetch: refetchNotification } = useGetNotificationStatsQuery();
    const [page, setPage] = useState(1);

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
                setPage={setPage}
            />
        },
        {
            id: 1,
            title: "Requests",
            component: <Requests
                setCurrentChat={setCurrentChat}
                currentChat={currentChat}
            />,
            rightIcon: <span
                className={`rounded-full bg-red-600 p-[2px] flex items-center justify-center
                    ${notificationStats?.data?.total_requests > 99 ? "" : "h-4 w-4"}
                    ${notificationStats?.data?.total_requests ? ' flex' : 'hidden'} text-[8px] text-twhite-100`
                }
            >
                {notificationStats?.data?.total_requests}
            </span>
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
            refetch();
            refetchNotification();
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
                search: `messages`,
            }, { replace: true }); //clearing url state in this location
        }
    }, [isSuccess])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setCurrentChat(() => null)
                setPage(1)
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
        <Protected>
            <div className="w-full h-[calc(100dvh-2dvh)] top-0 bottom-0 relative">
                <main className='w-full h-full flex flex-1 grow items-start justify-start border-r border-[#E2E4E9] divide-x divide-tgray-200 overflow-hidden'>

                    <section className={`w-full h-full md:w-1/3 relative overflow-y-auto pt-5 ${!switchBoxView && isMobile ? 'md:w-full' : ''} ${switchBoxView ? 'hidden' : 'block'}`}>
                        <section className="w-full relative">
                            <Tabs
                                tabs={tabs}
                                headerPadding="px-8"
                            />
                            {
                                isMobile ?
                                    <div onClick={() => navigate(-1)} className="absolute top-4 right-0 z-[12] px-5 flex items-center gap-1 cursor-pointer">
                                        <X color="#ff0000" size={18} />
                                        <span className="text-xs">Close</span>
                                    </div>
                                    :
                                    null
                            }
                        </section>
                    </section>

                    <section className={`w-full h-full md:w-2/3 ${switchBoxView && 'w-full md:w-full block'} ${!switchBoxView && isMobile ? "hidden" : "block"}`}>
                        <ChatBox
                            setCurrentChat={setCurrentChat}
                            currentChat={currentChat}
                            page={page}
                            setPage={setPage}
                        />
                    </section>
                </main>
            </div>
        </Protected>
    )
}
import { toast } from "sonner";
import { useGetAllNotificationsQuery } from "../../../services/notificationsApiSlice"
import { handleError } from "../../../utils/handleError";
import { EmptyState } from "../../../components/global/emptystate";
import { NotificationCard } from "../../../components/global/notificationcard";
import { NotificationLoader } from "../../../components/global/skeletons";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "../../../services/authSlice";
import { useEffect } from "react";
import EmptyListIcon from "../../../assets/images/emptylist.png"
import moment from "moment";
import Pusher from 'pusher-js';

export const ConversationNotifications = () => {

    const token = useSelector(selectCurrentToken)
    const currentUser = useSelector(selectCurrentUser)
    const { data: notifications, isLoading, isError, error, refetch: refetchNotification } = useGetAllNotificationsQuery("conversation");

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
            refetchNotification();
        });
        return () => {
            pusherChannel.unbind_all();
            pusher.unsubscribe('refresh-notification.' + currentUser?.id);
        };
    };

    if (isError) {
        const errorMessage = handleError(error);
        toast.error(errorMessage);
        return (
            <div className="w-full items-center justify-center m-auto text-center text-tgray-150">
                <p className="text-sm font-normal">Oops!!! Something has gone wrong.</p>
                <p className="text-sm font-normal">Notifications aren't loading right now.</p>
                <p className="text-xs font-normal">Try again.</p>
            </div>
        );
    }

    useEffect(() => {
        connectToPusher();
    }, [])

    return (
        <div>
            <section className="w-full py-3 flex flex-col items-center justify-center">
                {
                    isLoading ?
                        <NotificationLoader />
                        :
                        !notifications.data?.length ?
                            <section className="w-full py-4">
                                <EmptyState
                                    icon={EmptyListIcon}
                                    height="h-[50px]"
                                    width="h-[50px]"
                                    text="You have no notifications"
                                    subtext="When you have notifications they would appear here."
                                />
                            </section>
                            :
                            notifications.data?.map((notification, index) => (
                                <div className="w-full flex items-start border-b border-tgray-light py-2">
                                    <NotificationCard
                                        key={notification.id}
                                        title={notification.title}
                                        notification={notification.message}
                                        image={notification.attachment}
                                        time={moment(notification.created_at).format("lll")}
                                        notificationId={notification.data_id}
                                        type={notification?.type}
                                        id={notification?.data_id}
                                        extra={notification?.extra}
                                        read={notification?.read_at}
                                        notifyId={notification.id}
                                        refetch={refetchNotification}
                                    />
                                </div>
                            ))
                }
            </section>
        </div>
    )
}
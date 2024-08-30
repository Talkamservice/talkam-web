import { toast } from "sonner";
import { ColoredLoader } from "../../../components/global/loader"
import { useGetAllNotificationsQuery } from "../../../services/notificationsApiSlice"
import { handleError } from "../../../utils/handleError";
import { EmptyState } from "../../../components/global/emptystate";
import EmptyListIcon from "../../../assets/images/emptylist.png"
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { NotificationCard } from "../../../components/global/notificationcard";

export const AllNotifications = () => {

    const navigate = useNavigate();
    const { data: notifications, isLoading, isError, error } = useGetAllNotificationsQuery();

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

    return (
        <div>
            <section className="w-full py-3 flex flex-col items-center justify-center">
                {
                    isLoading ?
                        <ColoredLoader />
                        :
                        !notifications.data?.length ?
                            <section className="w-full py-4">
                                <EmptyState
                                    icon={EmptyListIcon}
                                    height="h-[50px]"
                                    width="h-[50px]"
                                    text="No notifications yet"
                                    subtext="You have no notifications."
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
                                    />
                                </div>
                            ))
                }
            </section>
        </div>
    )
}
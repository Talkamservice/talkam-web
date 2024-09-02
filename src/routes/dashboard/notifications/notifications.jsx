import { toast } from "sonner";
import { Button } from "../../../components/forms/button";
import { RouteTabs } from "../../../components/global/routetabs";
import { useClearAllNotificationsMutation, useGetNotificationStatsQuery, useMarkAllNotificationsAsReadMutation } from "../../../services/notificationsApiSlice";
import { handleError } from "../../../utils/handleError";

const colors = ["#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000"]

export const Notifications = () => {

    const tabs = [
        {
            id: 0,
            title: "All notifications",
            text: "all",
        },
        {
            id: 1,
            title: "Mentions",
            text: "mentions",
        },
    ];

    const { data: notificationStats } = useGetNotificationStatsQuery();
    const [markAllNotificationsAsRead, { isLoading: markAllLoading }] = useMarkAllNotificationsAsReadMutation();
    const [clearAllNotifications, { isLoading: clearLoading }] = useClearAllNotificationsMutation();

    const handleMarkAllRead = async () => {
        try {
            const res = await markAllNotificationsAsRead().unwrap();
            toast.success(res?.message)
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage)
        }
    }

    const handleClearAll = async () => {
        try {
            const res = await clearAllNotifications().unwrap();
            toast.success(res?.message)
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage)
        }
    }

    return (
        <div className="w-full flex flex-col gap-8 lg:w-4/6 h-full p-6">
            <header className="w-full flex items-center justify-between">
                <p className="text-lg font-medium">Notifications</p>
                <section className="flex items-center gap-2">
                    {
                        notificationStats?.data?.unread_notifications ?
                            <Button
                                isLoading={markAllLoading}
                                disabled={markAllLoading}
                                onClick={handleMarkAllRead}
                            >
                                Mark all as read
                            </Button>
                            :
                            null
                    }
                    {
                        notificationStats?.data?.notifications ?
                            <Button
                                isLoading={clearLoading}
                                disabled={clearLoading}
                                onClick={handleClearAll}
                                variant="error-outline"
                                loadColor={colors}
                            >
                                Clear all
                            </Button>
                            :
                            null
                    }
                </section>
            </header>

            <section className="relative overflow-y-auto w-full no-scrollbar">
                <RouteTabs tabs={tabs} />
            </section>
        </div>
    )
} 
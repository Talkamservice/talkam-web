import { toast } from "sonner";
import { Button } from "../../../components/forms/button";
import { RouteTabs } from "../../../components/global/routetabs";
import { useClearAllNotificationsMutation, useGetNotificationStatsQuery, useMarkAllNotificationsAsReadMutation } from "../../../services/notificationsApiSlice";
import { handleError } from "../../../utils/handleError";
import Protected from "../../../utils/protected";

const clearLoader = ["#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000"];
const markAllLoader = ["#017FC8", "#017FC8", "#017FC8", "#017FC8", "#017FC8"];

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
        <Protected>
            <div className="w-full flex flex-col gap-6 lg:w-4/6 h-full p-6">
                <header className="w-full flex flex-col gap-4  sm:flex-row sm:items-center justify-between">
                    <p className="text-lg font-bold">Notifications</p>
                    <section className="flex items-center gap-6">
                        {
                            notificationStats?.data?.unread_notifications ?
                                <Button
                                    isLoading={markAllLoading}
                                    disabled={markAllLoading}
                                    onClick={handleMarkAllRead}
                                    variant="link"
                                    loadColor={markAllLoader}
                                    className="!text-[#017FC8]"
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
                                    variant="link"
                                    loadColor={clearLoader}
                                    className="!text-[#ff0000]"
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
        </Protected>
    )
} 
import moment from "moment";
import { Avatar } from "../../../components/global/avatar"
import { ColoredLoader } from "../../../components/global/loader";
import { Button } from "../../../components/forms/button";
import { toast } from "sonner";
import { handleError } from "../../../utils/handleError";
import { EmptyState } from "../../../components/global/emptystate";
import { useBlockUserMutation, useGetBlockedListQuery } from "../../../services/posts/postsApiSlice";
import EmptyListIcon from "../../../assets/images/emptylist.png"

export const BlockedUserSettings = () => {

    const { data: blocked, isLoading } = useGetBlockedListQuery();
    const [blockUser, { isLoading: blockLoading }] = useBlockUserMutation();

    const handleUnBlockUser = async (id) => {
        const toastId = toast("Unblocking...");
        try {
            const blockRes = await blockUser({ blocked_user_id: id }).unwrap();
            toast.dismiss(toastId);
            toast.success(blockRes.message);

        } catch (error) {
            toast.dismiss(toastId);
            const errorMessage = handleError(error);
            toast.error(errorMessage)
        }
    }
    return (
        <main className="w-full flex flex-col gap-4 h-full py-3">
            <section className="w-full flex flex-col items-center justify-center overflow-auto gap-4">
                {
                    isLoading ?
                        <ColoredLoader />
                        :
                        !blocked?.data.length ?
                            <section className="w-full py-4">
                                <EmptyState
                                    icon={EmptyListIcon}
                                    height="h-[50px]"
                                    width="h-[50px]"
                                    text="No blocked user"
                                    subtext="When users are blocked they would appear here"
                                />
                            </section>
                            :
                            blocked && blocked?.data?.map((user) => (
                                <div key={user.blocked_user.id} className="w-full flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <Avatar src={user.blocked_user.avatar} size="sm" />
                                        <div className="flex flex-col">
                                            <span className="text-base font-medium">{user.blocked_user.username || user.blocked_user.username}</span>
                                            <span className="text-xs text-tgray-300 font-semibold">Member since {moment(user.blocked_user.created_at).format("MMMM YYYY")}</span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        children="Unblock"
                                        disabled={blockLoading}
                                        onClick={() => handleUnBlockUser(user.blocked_user.id)}
                                        className="!rounded-full !py-1 !px-2 !text-xs"
                                    />
                                </div>
                            ))
                }
            </section>
        </main>
    )
}
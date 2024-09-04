
import { UserReplyCard } from "../../../components/global/userprofilereplycard";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useGetUserCommentsQuery } from "../../../services/posts/postsApiSlice";
import { CommentsLoader } from "../../../components/global/skeletons";
import { EmptyState } from "../../../components/global/emptystate";
import { toast } from "sonner";
import { handleError } from "../../../utils/handleError";
import moment from "moment";
import EmptyListIcon from "../../../assets/images/emptylist.png"

export const ProfileComments = () => {

    const { userId } = useParams();
    const navigate = useNavigate()
    const { data: comments, isLoading, isError, error } = useGetUserCommentsQuery(userId);

    if (isError) {
        const errorMessage = handleError(error);
        toast.error(errorMessage);
        return (
            <div className="w-full items-center justify-center m-auto text-center text-tgray-150">
                <p className="text-sm font-normal">Comments aren't loading right now.</p>
                <p className="text-xs font-normal">Try again.</p>
            </div>
        );
    }

    return (
        <main className="flex px-6">
            <section className="w-full py-3 flex flex-col items-center justify-center gap-4">
                {
                    isLoading ?
                        <CommentsLoader />
                        :
                        !comments?.data?.length ?
                            <section className="w-full py-4">
                                <EmptyState
                                    icon={EmptyListIcon}
                                    height="h-[50px]"
                                    width="h-[50px]"
                                    text="No Comments yet"
                                    subtext="This user has no comments."
                                />
                            </section>
                            :
                            comments.data?.map((comment, index) => (
                                <div className="w-full flex items-start border-b border-tgray-light py-2">
                                    <UserReplyCard
                                        key={comment.id}
                                        comment={comment.comment}
                                        user={(comment.reply_to?.username ?? comment.reply_to?.name) ?? (comment.post?.user?.username ?? comment.post?.user?.name)}
                                        image={comment.attachment}
                                        onClick={() => navigate(`/comment/${comment.post.id}`)}
                                        time={moment(comment.created_at).fromNow()}
                                    />
                                </div>
                            ))
                }
            </section>
        </main>
    )
}
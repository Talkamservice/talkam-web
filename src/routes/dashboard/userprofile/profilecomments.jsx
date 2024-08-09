import { ColoredLoader } from "../../../components/global/loader";
import { UserReplyCard } from "../../../components/global/userprofilereplycard";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useGetUserCommentsQuery } from "../../../services/posts/postsApiSlice";
import { EmptyState } from "../../../components/global/emptystate";
import moment from "moment";
import EmptyListIcon from "../../../assets/images/emptylist.png"

export const ProfileComments = () => {

    const { userId } = useParams();
    const navigate = useNavigate()
    const { data: comments, isLoading } = useGetUserCommentsQuery(userId);

    return (
        <main className="flex">
            <section className="w-full py-3 flex flex-col items-center justify-center gap-4">
                {
                    isLoading ? 
                    <ColoredLoader />
                    :
                    !comments.data?.length ?
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
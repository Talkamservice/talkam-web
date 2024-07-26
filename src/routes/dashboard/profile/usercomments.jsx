import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../services/authSlice";
import { ColoredLoader } from "../../../components/global/loader";
import { UserReplyCard } from "../../../components/global/userprofilereplycard";
import { useNavigate } from "react-router-dom";
import { useGetUserCommentsQuery } from "../../../services/posts/postsApiSlice";
import moment from "moment";

export const UsersComments = () => {

    const currentUser = useSelector(selectCurrentUser);
    const navigate = useNavigate()
    const { data: comments, isLoading } = useGetUserCommentsQuery(currentUser?.id);

    return (
        <main className="flex">
            <section className="w-full py-3 flex flex-col items-center justify-center gap-8">
                {
                    isLoading ? 
                    <ColoredLoader />
                    :
                    comments.data?.map((comment, index) => (
                        <div className="w-full flex items-start border-b border-tgray-light py-2">
                            <UserReplyCard
                                key={comment.comment + index}
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
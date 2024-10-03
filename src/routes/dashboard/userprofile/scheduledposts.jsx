import { PostCard } from "../../../components/posts/postcard";
import { GallerySkeletons } from "../../../components/global/skeletons";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { handleError } from "../../../utils/handleError";
import { EmptyState } from "../../../components/global/emptystate";
import { useDeletePostMutation } from "../../../services/posts/postsApiSlice";
import { useGetScheduledPostsQuery } from "../../../services/posts/postsApiSlice";
import EmptyListIcon from "../../../assets/images/emptylist.png"
import { X } from "react-feather";

export const ScheduledPosts = ({ onClose }) => {

    const navigate = useNavigate();

    const { data: scheduled, isLoading, isError, error } = useGetScheduledPostsQuery();
    const [deletePost] = useDeletePostMutation();

    const handleDeletePost = async (id) => {
        try {
            const deleteRes = await deletePost(id);
            toast.success(deleteRes?.data?.message);
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage);
        }
    }

    if (isError) {
        const errorMessage = handleError(error);
        toast.error(errorMessage);
        return (
            <div className="w-full items-center justify-center m-auto text-center text-tgray-150 py-8">
                <p className="text-sm font-normal">Posts aren't loading right now.</p>
                <p className="text-xs font-normal">Try again.</p>
            </div>
        );
    }

    return (
        <main className="flex flex-col h-full relative gap-2 px-6">
            <header className="flex items-end justify-end w-full stich top-0 p-4">
                <X strokeWidth={4} onClick={onClose} className="cursor-pointer" />
            </header>
            <section className="w-full py-3 flex flex-col gap-3 overflow-y-auto no-scrollbar">
                {
                    isLoading ?
                        <GallerySkeletons />
                        :
                        scheduled?.data?.length > 0 ?
                            scheduled?.data?.map((post) => (
                                <PostCard
                                    key={post.id}
                                    type={post.type}
                                    user={post.user}
                                    polls={post.polls}
                                    avatar={post.user.avatar}
                                    category={post.category}
                                    author={post.user.username ?? post.user.name}
                                    title={post.title}
                                    comment={post.body}
                                    image={post.attachments?.[0]?.url}
                                    commentcount={post.comments_count}
                                    likes={post.likes_count}
                                    reaction={post.reaction}
                                    tags={post.tags}
                                    time={post.created_at}
                                    id={post.id}
                                    isAnon={post.is_anonymous}
                                    routeChange={() => navigate(`/comment/${post.id}`)}
                                    handleDeletePost={handleDeletePost}
                                    group={post?.group}
                                    parentCategory={post?.category?.parent_category}
                                    isReported={post?.is_reported}
                                    notification={post?.enabled_notification}
                                    published={post?.publish_at}
                                    home
                                />
                            ))
                            :
                            !isLoading && scheduled?.data?.length === 0 ?
                                <section className="w-full py-6">
                                    <EmptyState
                                        icon={EmptyListIcon}
                                        height="h-[30px]"
                                        width="h-[30px]"
                                        text="No Scheduled Posts"
                                        subtext="Scheduled posts would appear here"
                                    />
                                </section>
                                :
                                null
                }
            </section>
        </main>
    );
};
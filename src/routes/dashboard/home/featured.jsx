import { PostCard } from "../../../components/posts/postcard"
import { GallerySkeletons } from "../../../components/global/skeletons";
import { useGetAllPostsQuery } from "../../../services/posts/postsApiSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { handleError } from "../../../utils/handleError";

export const Featured = () => {

    const navigate = useNavigate();
    const { data:featured, isLoading, isError, error } = useGetAllPostsQuery({
        tab: 'featured'
    });

    if(isError){
        const errorMessage = handleError(error);
        toast.error(errorMessage)
        return <div className="w-full items-center justify-center m-auto text-center text-tgray-150">
            <p className="text-sm font-normal">Posts aren't loading right now.</p>
            <p className="text-xs font-normal">Try again.</p>
        </div>
    }

    return (
        <main className="flex">
            <section className="w-full py-3 flex flex-col gap-3">
                {
                    isLoading ? 
                    <GallerySkeletons />
                    :
                    featured?.data?.data.map((post) => (
                        <PostCard
                            key={post.id}
                            type={post.type}
                            polls={post.polls}
                            avatar={post.user.avatar}
                            category={post.category?.name}
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
                        />
                    ))
                }
            </section>
        </main>
    )
}
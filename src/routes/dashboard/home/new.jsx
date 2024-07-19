import { useCallback, useEffect, useRef, useState } from "react";
import { PostCard } from "../../../components/posts/postcard";
import { GallerySkeletons } from "../../../components/global/skeletons";
import { useGetAllPostsQuery } from "../../../services/posts/postsApiSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { handleError } from "../../../utils/handleError";
import { ColoredLoader } from "../../../components/global/loader";

export const New = () => {
    const scrollableRef = useRef(null);
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const { data: latests, isLoading, isError, error } = useGetAllPostsQuery({
        tab: 'latest',
        page: page
    });

    useEffect(() => {
        if (latests?.data?.data) {
            setPosts((prevPosts) => [...prevPosts, ...latests.data.data]);
            setIsFetching(false); // Reset the fetching flag after new data is loaded
        }
    }, [latests]);

    const handleScroll = useCallback((event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        const bottom = scrollHeight - scrollTop <= clientHeight + 50; // Add margin to bottom check
        if (bottom && !isFetching && latests?.data?.pagination_meta.can_load_more) {
            setIsFetching(true); // Set fetching flag to true to prevent multiple requests
            setPage((prevPage) => prevPage + 1);
        }
    }, [isFetching, latests]);

    if (isError) {
        const errorMessage = handleError(error);
        toast.error(errorMessage);
        return (
            <div className="w-full items-center justify-center m-auto text-center text-tgray-150">
                <p className="text-sm font-normal">Posts aren't loading right now.</p>
                <p className="text-xs font-normal">Try again.</p>
            </div>
        );
    }
    
    return (
        <main className="flex h-full">
            <section
                onScroll={handleScroll}
                ref={scrollableRef}
                className="w-full py-3 flex flex-col gap-3 overflow-y-auto no-scrollbar"
            >
                {
                    isLoading ?
                    <GallerySkeletons />
                    :
                    posts.map((post) => (
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
                { isFetching && <ColoredLoader /> }
            </section>
        </main>
    );
};

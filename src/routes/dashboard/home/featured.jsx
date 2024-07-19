import { useCallback, useEffect, useRef, useState } from "react";
import { PostCard } from "../../../components/posts/postcard";
import { GallerySkeletons } from "../../../components/global/skeletons";
import { useGetAllPostsQuery } from "../../../services/posts/postsApiSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { handleError } from "../../../utils/handleError";
import { ColoredLoader } from "../../../components/global/loader";
import { Storage } from "../../../app/storage";

export const Featured = () => {

    const isRestoringScroll = useRef(false);
    const scrollableRef = useRef(null);
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const { data: featured, isLoading, isError, error } = useGetAllPostsQuery({
        tab: 'featured',
        page: page
    });

    const appendNewPageData = () => {
        if (featured?.data?.data) {
            setPosts((prevPosts) => {
                const newPosts = new Set([...prevPosts, ...featured.data.data]);
                return Array.from(newPosts);
            });
            setIsFetching(false);
        }
    };

    const handleScroll = useCallback((event) => {
        if (isRestoringScroll.current) return;

        const { scrollTop, scrollHeight, clientHeight } = event.target;
        const bottom = scrollHeight - scrollTop <= clientHeight + 50;
        if (bottom && !isFetching && featured?.data?.pagination_meta.can_load_more) {
            setIsFetching(true);
            setPage((prevPage) => prevPage + 1);
        }
        Storage.setItem("scrollPosition", scrollTop);
    }, [isFetching, featured]);

    const restoreScrollPosition = () => {
        const savedScrollPosition = Storage.getItem("scrollPosition");
        if (savedScrollPosition && scrollableRef.current) {
            isRestoringScroll.current = true;
            scrollableRef.current.scrollTop = parseInt(savedScrollPosition, 10);
            setTimeout(() => {
                isRestoringScroll.current = false; // Allow the scroll handler to run again after a short delay
            }, 0);
        }
    };

    useEffect(() => {
        appendNewPageData();
    }, [featured]);

    useEffect(() => {
        restoreScrollPosition();
    }, [restoreScrollPosition, page]);

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
                {isLoading || isFetching && <GallerySkeletons />}
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

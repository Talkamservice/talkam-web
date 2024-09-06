import { useCallback, useEffect, useRef, useState } from "react";
import { PostCard } from "../../../../components/posts/postcard";
import { GallerySkeletons } from "../../../../components/global/skeletons";
import { useDeletePostMutation, useGetAllPostsQuery } from "../../../../services/posts/postsApiSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { handleError } from "../../../../utils/handleError";
import { ColoredLoader } from "../../../../components/global/loader";
import { Storage } from "../../../../app/storage";

export const Trending = () => {

    const isRestoringScroll = useRef(false);
    const scrollableRef = useRef(null);
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const { data: trending, isLoading, isError, error } = useGetAllPostsQuery({
        tab: 'trending',
        page: page
    }, { refetchOnFocus: true, refetchOnMountOrArgChange: true, refetchOnReconnect: true });
    const [deletePost] = useDeletePostMutation();

    const postIds = new Set();

    // Deduplicate new posts
    const newResults = (posts || []).filter(post => {
        if (!postIds.has(post.id)) {
            postIds.add(post.id);
            return true;
        }
        return false;
    });

    const appendNewPageData = () => {
        if (trending?.data?.data) {
            setPosts((prevPosts) => {
                const newPosts = new Set([...prevPosts, ...trending.data.data]);
                return Array.from(newPosts);
            });
            setIsFetching(false);
        }
    };

    const handleDeletePost = async (id) => {
        const newPage = 1
        const newPosts = posts.filter((post) => post.id !== id);
        setPosts(() => newPosts);

        try {
            const deleteRes = await deletePost(id);
            toast.success(deleteRes?.data?.message);
            setPage(() => newPage);
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage);
        }
        setPage(() => newPage);
    }

    const handleScroll = useCallback((event) => {
        if (isRestoringScroll.current) return;

        const { scrollTop, scrollHeight, clientHeight } = event.target;
        const bottom = scrollHeight - scrollTop <= clientHeight + 50;
        if (bottom && !isFetching && trending?.data?.pagination_meta.can_load_more) {
            setIsFetching(true);
            setPage((prevPage) => prevPage + 1);
        }
        Storage.setItem("scrollPosition_trending", scrollTop);
    }, [isFetching, trending]);

    const restoreScrollPosition = () => {
        const savedScrollPosition = Storage.getItem("scrollPosition_trending");
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
    }, [trending]);

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
                {
                    isLoading ?
                        <GallerySkeletons />
                        :
                        newResults.map((post) => (
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
                                home
                            />
                        ))
                }
                {isFetching ?
                    <div className="w-full flex items-center justify-center py-24">
                        <ColoredLoader />
                    </div>
                    :
                    null
                }
            </section>
        </main>
    );
};
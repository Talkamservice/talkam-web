import { useCallback, useEffect, useRef, useState } from "react";
import { PostCard } from "../../../../components/posts/postcard";
import { GallerySkeletons } from "../../../../components/global/skeletons";
import { useDeletePostMutation, useGetAllPostsQuery } from "../../../../services/posts/postsApiSlice";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { handleError } from "../../../../utils/handleError";
import { ColoredLoader } from "../../../../components/global/loader";
import { Storage } from "../../../../app/storage";
import { EmptyState } from "../../../../components/global/emptystate";
import EmptyListIcon from "../../../../assets/images/emptylist.png"

export const CategoryFeatured = () => {

    const { subCategoryId } = useParams();
    const isRestoringScroll = useRef(false);
    const scrollableRef = useRef(null);
    const navigate = useNavigate();
    const [currentParams, setCurrentParams] = useState(subCategoryId);
    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const { data: featured, isLoading, isError, error, refetch } = useGetAllPostsQuery({
        tab: 'featured',
        page: page,
        categoryId: subCategoryId,
        target: "",
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
        if (featured?.data?.data) {
            setPosts((prevPosts) => {
                const newPosts = new Set([...prevPosts, ...featured.data.data]);
                return Array.from(newPosts);
            });
            setIsFetching(false);
        }
    };
    const newPageData = () => {
        if (featured?.data?.data) {
            setPosts(() => {
                const newPosts = new Set([...featured.data.data]);
                return Array.from(newPosts);
            });
            setIsFetching(false);
        }
    }

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
        if (bottom && !isFetching && featured?.data?.pagination_meta.can_load_more) {
            setIsFetching(true);
            setPage((prevPage) => prevPage + 1);
        }
        Storage.setItem("scrollPosition_groupfeatured", scrollTop);
    }, [isFetching, featured]);

    const restoreScrollPosition = () => {
        const savedScrollPosition = Storage.getItem("scrollPosition_groupfeatured");
        if (savedScrollPosition && scrollableRef.current) {
            isRestoringScroll.current = true;
            scrollableRef.current.scrollTop = parseInt(savedScrollPosition, 10);
            setTimeout(() => {
                isRestoringScroll.current = false; // Allow the scroll handler to run again after a short delay
            }, 0);
        }
    };

    useEffect(() => {
        if (subCategoryId === currentParams) {
            appendNewPageData();
        } else {
            newPageData();
        }
    }, [featured, subCategoryId, currentParams]);

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
                        newResults?.length > 0 ?
                            newResults && newResults?.map((post) => (
                                <PostCard
                                    key={post.id}
                                    type={post.type}
                                    user={post?.user}
                                    polls={post.polls}
                                    avatar={post?.user?.avatar}
                                    category={post.category}
                                    author={post?.user?.username ?? post?.user?.name}
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
                                    isReported={post?.is_reported}
                                    notification={post?.enabled_notification}
                                    ad={post?.promotion}
                                    routeChange={() => navigate(`/comment/${post.id}`)}
                                    handleDeletePost={handleDeletePost}
                                />
                            ))
                            :
                            !isLoading && !isFetching && featured.data.data.length === 0 ?
                                <section className="w-full py-1">
                                    <EmptyState
                                        icon={EmptyListIcon}
                                        height="h-[30px]"
                                        width="h-[30px]"
                                        text="No Featured Posts"
                                        subtext="When posts are made they would appear here"
                                    />
                                </section>
                                :
                                null
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
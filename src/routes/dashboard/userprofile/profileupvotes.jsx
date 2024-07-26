import { useCallback, useEffect, useRef, useState } from "react";
import { PostCard } from "../../../components/posts/postcard";
import { GallerySkeletons } from "../../../components/global/skeletons";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { handleError } from "../../../utils/handleError";
import { ColoredLoader } from "../../../components/global/loader";
import { Storage } from "../../../app/storage";
import { useGetUserUpvotesQuery } from "../../../services/posts/postsApiSlice";
import { EmptyState } from "../../../components/global/emptystate";
import EmptyListIcon from "../../../assets/images/emptylist.png"

export const ProfileUpvotes = () => {

    const { userId } = useParams();
    const navigate = useNavigate();
    const isRestoringScroll = useRef(false);
    const scrollableRef = useRef(null);
    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const { data: userUpvotes, isLoading, isError, error } = useGetUserUpvotesQuery({
        id: userId,
        page: page
    });

    const appendNewPageData = () => {
        if (userUpvotes?.data?.data) {
            setPosts((prevPosts) => {
                const newPosts = new Set([...prevPosts, ...userUpvotes.data.data]);
                return Array.from(newPosts);
            });
            setIsFetching(false);
        }
    };

    const handleScroll = useCallback((event) => {
        if (isRestoringScroll.current) return;

        const { scrollTop, scrollHeight, clientHeight } = event.target;
        const bottom = scrollHeight - scrollTop <= clientHeight + 50;
        if (bottom && !isFetching && userUpvotes?.data?.pagination_meta.can_load_more) {
            setIsFetching(true);
            setPage((prevPage) => prevPage + 1);
        }
        Storage.setItem("scrollPosition_userUpvotes", scrollTop);
    }, [isFetching, userUpvotes]);

    const restoreScrollPosition = () => {
        const savedScrollPosition = Storage.getItem("scrollPosition_userUpvotes");
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
    }, [userUpvotes]);

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
                    !posts.length ?
                    <section className="w-full py-4">
                        <EmptyState
                            icon={EmptyListIcon}
                            height="h-[50px]"
                            width="h-[50px]"
                            text="No Upvotes yet"
                            subtext="This user has no upvotes or reactions"
                        />
                    </section>
                    :
                    posts.map((post) => (
                        <PostCard
                            key={post.id}
                            type={post.type}
                            polls={post.polls}
                            avatar={post.user.avatar}
                            category={post.category?.name}
                            user={post.user}
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

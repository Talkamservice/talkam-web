import { useCallback, useEffect, useRef, useState } from "react"
import { GallerySkeletons } from "../../../components/global/skeletons"
import { PostCard } from "../../../components/posts/postcard"
import { useSearchQuery } from "../../../services/seachApiSlice"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useDeletePostMutation } from "../../../services/posts/postsApiSlice"
import { Storage } from "../../../app/storage"
import { toast } from "sonner"
import { ColoredLoader } from "../../../components/global/loader"
import { EmptyState } from "../../../components/global/emptystate"
import { handleError } from "../../../utils/handleError"
import { skipToken } from "@reduxjs/toolkit/query"
import { motion } from "framer-motion"
import { PostCardVariants } from "../../../helpers/cardanimation"
import SearchIcon from '../../../assets/images/searchicon.jpg'


export const SearchPosts = () => {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('search') || '';
    const isRestoringScroll = useRef(false);
    const scrollableRef = useRef(null);
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const { data: searchResult, isLoading, isFetching: searchFetching, isError, error } = useSearchQuery({
        sort: 'post',
        search: searchTerm
    }, (searchTerm || searchTerm !== "") ?? skipToken);
    const [deletePost] = useDeletePostMutation();

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
        Storage.setItem("scrollPosition_searchResult", scrollTop);
    }, [searchResult]);

    const restoreScrollPosition = () => {
        const savedScrollPosition = Storage.getItem("scrollPosition_searchResult");
        if (savedScrollPosition && scrollableRef.current) {
            isRestoringScroll.current = true;
            scrollableRef.current.scrollTop = parseInt(savedScrollPosition, 10);
            setTimeout(() => {
                isRestoringScroll.current = false; // Allow the scroll handler to run again after a short delay
            }, 0);
        }
    };

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
        <motion.main
            key="chatbox"
            variants={PostCardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="flex h-full">
            <section
                onScroll={handleScroll}
                ref={scrollableRef}
                className="w-full py-3 flex flex-col gap-3 overflow-y-auto no-scrollbar"
            >
                {
                    isLoading || searchFetching ?
                        <GallerySkeletons />
                        :
                        !searchResult?.data?.data?.length ?
                            <section className="w-full py-12">
                                <EmptyState
                                    icon={SearchIcon}
                                    height="h-[50px]"
                                    width="h-[50px]"
                                    text={`No posts results for ${searchTerm}`}
                                    subtext="Try searching for something else"
                                />
                            </section>
                            :
                            searchResult?.data?.data?.map((post) => (
                                <PostCard
                                    key={post.id}
                                    type={post.type}
                                    user={post?.user}
                                    polls={post.polls}
                                    avatar={post?.user?.avatar}
                                    category={post.category?.name}
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
                                    routeChange={() => navigate(`/comment/${post.id}`)}
                                    handleDeletePost={handleDeletePost}
                                />
                            ))
                }
                {searchFetching ?
                    <div className="w-full flex items-center justify-center py-24">
                        <ColoredLoader />
                    </div>
                    :
                    null
                }
            </section>
        </motion.main>
    )
}
import { FeaturedFireIcon, NewBadgeIcon, TrendingIcon } from "../../../assets/icons/generated"
import { RouteTabs } from "../../../components/global/routetabs"
import { PostCard } from "../../../components/posts/postcard"
import { PostTags } from "../../../components/posts/posttags"
import { GallerySkeletons, PillSkeletonLoader } from "../../../components/global/skeletons"
import { useGetRecentPostsQuery } from "../../../services/posts/postsApiSlice"
import { useGetTrendingTagsQuery } from "../../../services/userApiSlice"
import { Carousel } from "../../../components/global/carousel"
import { randomId } from "../../../helpers/randomid"
import { AnnouncementCard } from "../../../components/global/announcementcard"


const tabs = [
    {
        id: 0,
        title: "Just In",
        text: "new",
        icon: <NewBadgeIcon />
    },
    {
        id: 1,
        title: "Featured",
        text: "featured",
        icon: <FeaturedFireIcon />
    },
    {
        id: 2,
        title: "Trending",
        text: "trending",
        icon: <TrendingIcon />
    },
];

export const Home = () => {

    const { data: recents, isLoading: recentLoading } = useGetRecentPostsQuery();
    const { data: tags, isLoading: trendLoad } = useGetTrendingTagsQuery();

    return (
        <div className="w-full flex divide-x divide-tgray-light h-full">
            <section className="relative w-full lg:w-4/6 overflow-y-auto no-scrollbar">
                <Carousel autoSlide autoSlideInterval={5000}>
                    {
                        [...Array(4)].map((_, index) => (
                            <AnnouncementCard key={index} />
                        ))
                    }
                </Carousel>
                <RouteTabs
                    headerPadding="px-6"
                    tabs={tabs}
                />
            </section>

            <section className="w-2/6 px-6 hidden lg:block py-4 space-y-8 overflow-y-auto no-scrollbar">
                {
                    trendLoad ?
                        <div className="flex items-center justify-center m-auto">
                            <PillSkeletonLoader num={8} />
                        </div>
                        :
                        <>
                            {
                                tags && tags.data.length ?
                                    <section className="flex flex-col gap-3">
                                        <h2 className="text-base font-bold leading-none">Trending Tags</h2>
                                        <ul className="flex items-center flex-wrap gap-1">
                                            {tags && tags.data.map((tag) => <PostTags key={tag.id} tag={tag.tag} />)}
                                        </ul>
                                    </section>
                                    :
                                    null
                            }
                        </>
                }
                <section className="flex flex-col gap-4">
                    <h2 className="text-base font-bold leading-none">Recently Viewed</h2>
                    <ul className="flex flex-col gap-2.5">
                        {
                            recentLoading ?
                                <GallerySkeletons side />
                                :
                                recents?.data?.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        type={post.type}
                                        user={post.user}
                                        polls={post.polls}
                                        avatar={post.user.avatar}
                                        category={post.category?.name}
                                        author={post.user.username ?? post.user.name}
                                        title={post.title}
                                        comment={post.body}
                                        image={post.attachments?.[0]?.url}
                                        commentcount={post.comments_count}
                                        likes={post.likes_count}
                                        tags={post.tags}
                                        time={post.created_at}
                                        id={post.id}
                                        isAnon={post.is_anonymous}
                                        side
                                    />
                                ))
                        }
                    </ul>
                </section>
            </section>
        </div>
    )
}
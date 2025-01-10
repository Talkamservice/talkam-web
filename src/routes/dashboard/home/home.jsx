import { FeaturedFireIcon, NewBadgeIcon, TrendingIcon } from "../../../assets/icons/generated"
import { RouteTabs } from "../../../components/global/routetabs"
import { PostCard } from "../../../components/posts/postcard"
import { PostTags } from "../../../components/posts/posttags"
import { GallerySkeletons, PillSkeletonLoader } from "../../../components/global/skeletons"
import { useGetRecentPostsQuery } from "../../../services/posts/postsApiSlice"
import { useGetTrendingTagsQuery, useGetUserProfileDetailsQuery } from "../../../services/userApiSlice"
import { Carousel } from "../../../components/global/carousel"
import { AnnouncementCard } from "../../../components/global/announcementcard"
import { useGetAnnouncementsQuery } from "../../../services/notificationsApiSlice"
import { useSelector } from "react-redux"
import { selectCurrentToken, selectCurrentUser } from "../../../services/authSlice"
import { EmptyState } from "../../../components/global/emptystate"
import { TalkAmPlusCard } from "../../../components/global/talkampluscard"
import EmptyListIcon from "../../../assets/images/emptylist.png"


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

    const currentUser = useSelector(selectCurrentUser);
    const token = useSelector(selectCurrentToken);
    const { data: recents, isLoading: recentLoading } = useGetRecentPostsQuery(null, { skip: !token });
    const { data: tags, isLoading: trendLoad } = useGetTrendingTagsQuery(null, { skip: !token });
    const { data: announcements } = useGetAnnouncementsQuery();
    const { data: user } = useGetUserProfileDetailsQuery(currentUser?.id, {
        refetchOnMountOrArgChange: true,
        // refetchOnFocus: true,
        pollingInterval: 300000,
        refetchOnReconnect: true
    });

    return (
        <div className="w-full flex divide-x divide-tgray-light h-full">
            <section className="relative w-full lg:w-4/6 overflow-y-auto no-scrollbar">
                <Carousel autoSlide={announcements && announcements?.data?.length > 1} autoSlideInterval={10000}>
                    {
                        announcements?.data?.map((info, index) => (
                            <AnnouncementCard
                                key={index}
                                title={info?.title}
                                subtitle={info?.description}
                            />
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
                    user && token && !user?.data?.active_subscription ?
                        <TalkAmPlusCard />
                        :
                        null

                }
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
                                            {tags && tags.data.map((tag, index) => <PostTags key={index} tag={tag.tag} />)}
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
                                !recents?.data.length ?
                                    <section className="w-full py-1">
                                        <EmptyState
                                            icon={EmptyListIcon}
                                            height="h-[30px]"
                                            width="h-[30px]"
                                            text="No Recently Viewed Posts"
                                            subtext="Recently viewed posts would appear here"
                                        />
                                    </section>
                                    :
                                    recents?.data?.map((post) => (
                                        <PostCard
                                            key={post.id}
                                            type={post.type}
                                            user={post.user}
                                            polls={post.polls}
                                            avatar={post?.user?.avatar}
                                            category={post.category?.name}
                                            author={post?.user?.username ?? post?.user?.name}
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
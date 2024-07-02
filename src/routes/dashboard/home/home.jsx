import { useEffect, useState } from "react"
import { FeaturedFireIcon, NewBadgeIcon, TrendingIcon } from "../../../assets/icons/generated"
import { RouteTabs } from "../../../components/global/routetabs"
import { PostCard } from "../../../components/posts/postcard"
import { PostTags } from "../../../components/posts/posttags"
import { getTrendingPosts } from "../../../fakedata/posts"
import { GallerySkeletons } from "../../../components/global/skeletons"

const tabs = [
    {
        id: 0,
        title: "Featured",
        text: "featured",
        icon: <FeaturedFireIcon />
    },
    {
        id: 1,
        title: "Trending",
        text: "trending",
        icon: <TrendingIcon />
    },
    {
        id: 2,
        title: "Just In",
        text: "new",
        icon: <NewBadgeIcon />
    },
];

const trending = [ "BBN", "Arsenal", "Champions League", "Dating", "Gaming PC", "PS6", "Programming" ];

export const Home = () => {


    const [ posts, setPosts ] = useState();

    useEffect(() => {
        setTimeout(() => {
            setPosts(() => getTrendingPosts())
        }, 500)
    },[])

    return (
        <div className="w-full flex divide-x divide-tgray-light">
            <section className="relative w-full h-[93dvh] min-h-[93dvh] md:w-4/6 overflow-y-auto no-scrollbar px-6">
                <RouteTabs tabs={tabs} />
            </section>

            <section className="w-2/6 px-6 hidden md:block py-4 space-y-8 h-[93dvh] min-h-[93dvh] overflow-y-auto no-scrollbar">
                <section className="flex flex-col gap-3">
                    <h2 className="text-base font-bold leading-none">Trending Tags</h2>
                    <ul className="flex items-center flex-wrap gap-1">
                        {trending.map((trend) => <PostTags key={trend} tag={trend} />)}
                    </ul>
                </section>
                <section className="flex flex-col gap-4">
                    <h2 className="text-base font-bold leading-none">Recently Viewed</h2>
                    <ul className="flex flex-col gap-2.5">
                        {
                            !posts ? 
                            <GallerySkeletons side />
                            :
                            posts?.map((post) => (
                                <PostCard
                                    key={post.id}
                                    category={post.category}
                                    author={post.author}
                                    comment={post.comment}
                                    image={post.image}
                                    commentcount={post.commentcount}
                                    likes={post.likes}
                                    tags={post.tag}
                                    time={post.time}
                                    id={post.id}
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
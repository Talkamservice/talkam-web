import { GallerySkeletons } from "../../../components/global/skeletons";
import { PostCard } from "../../../components/posts/postcard";
import { getFeaturedPosts } from "../../../fakedata/posts";

export const RecentGroups = () => {

    const featured = getFeaturedPosts()
    const categories = [ "BBN", "Arsenal", "Champions League", "Dating", "Gaming PC", "PS6", "Programming"];

    return (
        <div className="flex flex-col gap-4">
            <header className="flex items-start flex-col gap-2">
                <p className="text-base font-bold">Explore groups by category</p>
                <div className="flex items-center flex-wrap gap-2">
                    {
                        categories.map((item, index) => (
                            <span key={index} className="text-sm py-1 px-2 border border-tgray-50 rounded-full text whitespace-nowrap">
                                {item}
                            </span>
                        ))
                    }
                </div>
            </header>

            <section className="w-full py-3 flex flex-col gap-3">
                {
                    !featured ? 
                    <GallerySkeletons />
                    :
                    featured?.map((post) => (
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
                        />
                    ))
                }
            </section>
        </div>
    )
}
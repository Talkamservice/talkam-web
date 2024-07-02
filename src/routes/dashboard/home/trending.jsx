import { useEffect, useState } from "react";
import { GallerySkeletons } from "../../../components/global/skeletons";
import { PostCard } from "../../../components/posts/postcard"
import { getTrendingPosts } from "../../../fakedata/posts";


export const Trending = () => {

    const [ posts, setPosts ] = useState();

    useEffect(() => {
        setTimeout(() => {
            setPosts(() => getTrendingPosts())
        }, 500)
    },[])

    return (
        <main className="flex">
            <section className="w-full py-3 flex flex-col gap-3">
                {
                    !posts ? 
                    <GallerySkeletons />
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
                        />
                    ))
                }
            </section>
        </main>
    )
}
import { useParams } from "react-router-dom"
import { PostCard } from "../../../components/posts/postcard"
import { getPost } from "../../../fakedata/posts"
import { ReplyCard } from "../../../components/comments/replycard"
import { useState } from "react"

export const Comment = () => {

    const { commentId } = useParams()
    const [ anonChecked, setAnonChecked ] = useState(false);
    const [ comment, setComment ] = useState({
        image: "",
        comment: ""
    });

    const handleFileUpload = (event) => {
        event.preventDefault()
        const { files } = event.target;
        if(!files[0]) return;
        setComment({...comment, image: URL.createObjectURL(files[0])})
    };
    const postDetails = getPost(commentId);

    return (
        <main className="w-full flex">
            <section className="w-full md:w-4/6 overflow-y-auto no-scrollbar p-6 flex flex-col items-center gap-3 h-[93dvh] min-h-[93dvh]">
                <PostCard 
                    category={postDetails.category}
                    author={postDetails.author}
                    comment={postDetails.comment}
                    image={postDetails.image}
                    commentcount={postDetails.commentcount}
                    likes={postDetails.likes}
                    tags={postDetails.tag}
                    time={postDetails.time}
                    id={postDetails.id}
                />
                <section className="w-full">
                    <ReplyCard
                        anonChecked={anonChecked}
                        setAnonChecked={setAnonChecked}
                        comment={comment}
                        setComment={setComment}
                        onChange={handleFileUpload}
                        image={comment.image}
                    />
                </section>
            </section>
            <section className="hidden md:flex w-2/6 flex-col overflow-y-auto no-scrollbar h-[93dvh] min-h-[93dvh]">
                <p>Left section</p>
            </section>
        </main>
    )
}
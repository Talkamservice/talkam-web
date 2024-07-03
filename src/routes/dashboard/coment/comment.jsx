import { useParams } from "react-router-dom"
import { PostCard } from "../../../components/posts/postcard"
import { getPost } from "../../../fakedata/posts"
import { ReplyCard } from "../../../components/comments/replycard"
import { useState } from "react"
import { CommentCard } from "../../../components/comments/commentcard"
import { randomId } from "../../../helpers/randomid"

export const Comment = () => {

    const { commentId } = useParams();
    const postDetails = getPost(commentId);
    const [ anonChecked, setAnonChecked ] = useState(false);
    const [ allComments, setAllComments ] =  useState(postDetails?.comments);
    const [ commentBody, setCommentBody ] = useState({
        id: randomId(),
        image: "",
        comment: "",
        comments: []
    });
    
    const handleAddNewComment = (event) => {
        setCommentBody({...commentBody, comment: event.target.value });
    }

    const handleFileUpload = (event) => {
        event.preventDefault()
        const { files } = event.target;
        if(!files[0]) return;
        setCommentBody({...commentBody, image: URL.createObjectURL(files[0])})
    };

    const submitComment = () => {
        setAllComments((prev) => [ commentBody, ...prev ]);
        setCommentBody({
            id: randomId(),
            image: "",
            comment: "",
            comments: []
        })
    }
    console.log(allComments)

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
                        commentBody={commentBody}
                        setCommentBody={setCommentBody}
                        onChange={handleFileUpload}
                        handleCommentChange={handleAddNewComment}
                        image={commentBody?.image}
                        submitComment={submitComment}
                    />
                </section>
                
                <section className="w-full flex flex-col gap-4">
                   {
                        allComments?.map((comment) => (
                            <CommentCard
                                key={comment.id}
                                parentComment={comment}
                                setAllComments={setAllComments}
                                allComments={allComments}
                                setComment={setAllComments}
                            />
                        ))
                    }
                </section>
            </section>


            {/* right section */}
            <section className="hidden md:flex w-2/6 flex-col overflow-y-auto no-scrollbar h-[93dvh] min-h-[93dvh]">
                <p>Left section</p>
            </section>
        </main>
    )
}
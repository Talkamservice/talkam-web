import { useParams } from "react-router-dom"
import { PostCard } from "../../../components/posts/postcard"
import { getPost } from "../../../fakedata/posts"
import { CommentInput } from "../../../components/comments/commentinput"
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
            <section className="w-full md:w-4/6 overflow-auto no-scrollbar px-6 py-3 flex flex-col items-center gap-3">
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
                <section className="w-full flex flex-col gap-3">
                    <CommentInput
                        anonChecked={anonChecked}
                        setAnonChecked={setAnonChecked}
                        commentBody={commentBody}
                        setCommentBody={setCommentBody}
                        onChange={handleFileUpload}
                        handleCommentChange={handleAddNewComment}
                        image={commentBody?.image}
                        submitComment={submitComment}
                    />
                    <p className="text-xs text-[#676767] border-b border-tgray-50 py-1">
                        Please be respectful and follow the <span className="text-tprimary-50 font-bold">Community Guidelines</span>
                    </p>
                </section>
                
                <section className="w-full flex flex-col gap-4">
                   {
                        allComments?.map((comment) => (
                            <CommentCard
                                key={comment.id}
                                parentComment={comment}
                                commentBody={commentBody}
                                setCommentBody={setCommentBody}
                            />
                        ))
                    }
                </section>
            </section>


            {/* right section */}
            <section className="hidden md:flex w-2/6 flex-col overflow-auto no-scrollbar">
            </section>
        </main>
    )
}
import { useParams } from "react-router-dom"
import { PostCard } from "../../../components/posts/postcard"
import { CommentInput } from "../../../components/comments/commentinput"
import { useState } from "react"
import { CommentCard } from "../../../components/comments/commentcard"
import { useGetPostCommentsQuery, useGetSinglePostQuery, useMakeCommentMutation } from "../../../services/posts/postsApiSlice"
import { GallerySkeletons } from "../../../components/global/skeletons"
import { toast } from "sonner"
import { ColoredLoader } from "../../../components/global/loader"
import { handleError } from "../../../utils/handleError"
import { randomId } from "../../../helpers/randomid"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storageDB } from "../../../utils/firestore"

export const Comment = () => {

    let isValidComment = false
    const { commentId } = useParams();
    // SERVER HOOKS HERE
    const { data:postDetails, isLoading } = useGetSinglePostQuery(commentId)
    const { data:comments, isLoading: commentsLoading } = useGetPostCommentsQuery(commentId);
    const [ makeComment, { isLoading:newCommentLoading } ] = useMakeCommentMutation()

    // LOCAL STATE HERE
    const [ imagePreview, setImagePreview ] = useState(null)
    const [ anonChecked, setAnonChecked ] = useState(false);
    const [ commentBody, setCommentBody ] = useState({
        image: "",
        comment: "",
        comments: []
    });
    //LOCAL COMMENTCARD STATE HERE
    const [ commentAnonChecked, setCommentAnonChecked ] = useState(false);
    const [ comment, setComment ] = useState({
        image: "",
        comment: "",
    });
    const [ nestedCommentAnonChecked, setNestedCommentAnonChecked ] = useState(false);
    const [ nestedComment, setNestedComment ] = useState({
        image: "",
        comment: "",
    });
    
    // FUNCTIONS
    const handleAddNewComment = (event) => {
        setCommentBody({...commentBody, comment: event.target.value });
    }

    const handleFileUpload = (event) => {
        event.preventDefault()
        const { files } = event.target;
        if(!files[0]) return;
        setImagePreview(() => URL.createObjectURL(files[0]))
        savePostImage(files[0])
    };
    const savePostImage = async (file) => {
        const imageRef = ref(storageDB, `web-images/${randomId()}`);
        const snapshot = await uploadBytes(imageRef, file);
        const url = await getDownloadURL(
            ref(storageDB, snapshot.metadata.fullPath)
        );
        setCommentBody({...commentBody, image: url})
    }

    const submitComment = async() => {
        try {
            const newComment = {
                post_id: commentId,
                comment: commentBody.comment,
                attachment: commentBody.image,
                parent_id: null,
                reply_comment_id: null,
                is_anonymous: anonChecked ? 1 : 0
            }
            const comment = await makeComment(newComment).unwrap();
        } catch(error){
            const errorMessage = handleError(error)
            toast.error(errorMessage)
        }
        setImagePreview(null)
        setCommentBody({
            image: "",
            comment: "",
            comments: []
        })
    };

    const submitCommentResponse = async(replyId) => {
        try {
            const newComment = {
                post_id: commentId,
                comment: comment.comment,
                attachment: comment.image,
                parent_id: replyId,
                reply_comment_id: replyId,
                is_anonymous: commentAnonChecked ? 1 : 0
            }
            const response = await makeComment(newComment).unwrap();
        } catch(error){
            toast.error(error?.data?.message)
        }
        setComment({
            image: "",
            comment: "",
        });
    }

    const submitNestedCommentResponse = async(parentId, replyId) => {
        try {
            const newComment = {
                post_id: commentId,
                comment: nestedComment.comment,
                attachment: nestedComment.image,
                parent_id: parentId,
                reply_comment_id: replyId,
                is_anonymous: nestedCommentAnonChecked ? 1 : 0
            }
            const response = await makeComment(newComment).unwrap();
        } catch(error){
            toast.error(error?.data?.message)
        }
        setNestedComment({
            image: "",
            comment: "",
        });
    }

    if(commentBody.comment || commentBody.image){
        isValidComment = true
    }

    return (
        <main className="w-full flex">
            <section className="w-full md:w-4/6 overflow-auto no-scrollbar px-6 py-3 flex flex-col items-center gap-3">
            {
                 isLoading ? 
                 <GallerySkeletons num={1} />
                 :
                 postDetails &&
                <PostCard
                    type={postDetails.data.type}
                    polls={postDetails.data.polls}
                    category={postDetails.data?.category?.name}
                    avatar={postDetails.data?.user.avatar}
                    author={postDetails.data?.user.username ?? postDetails.data?.user.name}
                    title={postDetails.data?.title}
                    comment={postDetails.data?.body}
                    image={postDetails.data?.attachments?.[0]?.url}
                    commentcount={postDetails.data?.comments_count}
                    likes={postDetails.data?.likes_count}
                    tags={postDetails.data?.tags}
                    time={postDetails.data?.created_at}
                    id={postDetails.data?.id}
                    isAnon={postDetails.data?.is_anonymous}
                    reaction={postDetails?.data.reaction}
                    user={postDetails?.data.user}
                />
            }
                <section className="w-full flex flex-col">
                    <CommentInput
                        anonChecked={anonChecked}
                        setAnonChecked={setAnonChecked}
                        commentBody={commentBody}
                        setImagePreview={setImagePreview}
                        onChange={handleFileUpload}
                        handleCommentChange={handleAddNewComment}
                        image={imagePreview}
                        submitComment={submitComment}
                        isValidComment={isValidComment}
                        isLoading={newCommentLoading}
                    />
                    <p className="text-xs text-[#676767] border-b border-tgray-50 py-1 pt-3">
                        Please be respectful and follow the <span className="text-tprimary-50 font-bold">Community Guidelines</span>
                    </p>
                </section>
                
                <section className="w-full flex items-center justify-center flex-col gap-4">
                    {
                        commentsLoading ?
                        <ColoredLoader />
                        :
                        !comments?.data.length ?
                        <p className="w-full flex items-center justify-center py-5 text-[#858585] text-sm">Be the first to comment</p>
                        :
                        comments.data.map((parentcomment) => (
                            <CommentCard
                                key={parentcomment.id}
                                parentComment={parentcomment}
                                allComments={parentcomment.children ?? []}
                                avatar={parentcomment.user.avatar}
                                time={parentcomment.created_at}
                                submitCommentResponse={() => submitCommentResponse(parentcomment.id)}
                                submitNestedCommentResponse={submitNestedCommentResponse}
                                comment={comment}
                                setComment={setComment}
                                nestedComment={nestedComment}
                                setNestedComment={setNestedComment}
                                isLoading={newCommentLoading}
                                reaction={parentcomment.reaction?.action}
                                anonChecked={commentAnonChecked}
                                setAnonChecked={setCommentAnonChecked}
                                nestedAnonChecked={nestedCommentAnonChecked}
                                setNestedAnonChecked={setNestedCommentAnonChecked}
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
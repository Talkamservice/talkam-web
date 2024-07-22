import { useEffect, useState } from "react"
import { Button } from "../forms/button"
import { Avatar } from "../global/avatar"
import { CommentInput } from "./commentinput"
import { motion } from "framer-motion"
import { useCommentReactionMutation } from "../../services/posts/postsApiSlice"
import { handleError } from "../../utils/handleError"
import { toast } from "sonner"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storageDB } from "../../utils/firestore"
import { randomId } from "../../helpers/randomid"
import * as Icon from "react-feather"
import moment from "moment"

export const NestedCommentCard = ({
    parentComment,
    submitNestedCommentResponse,
    nestedComment,
    setNestedComment,
    isLoading,
    anonChecked,
    setAnonChecked
}) => {

    let isValidComment = false

    const [ action, setAction ] = useState(parentComment && parentComment.reaction?.action);
    const [ likeCount, setLikeCount ] = useState();
    const [ unlikeCount, setUnlikeCount ] = useState();
    const [ isReplying, setIsReplying ] = useState();
    const [ imagePreview, setImagePreview ] = useState(null);
    const [ commentReaction ] = useCommentReactionMutation();

   
    const handleAddNewComment = (event) => {
        setNestedComment({...nestedComment, comment: event.target.value });
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
        setNestedComment({...nestedComment, image: url})
    }

    const handlePostReaction = async (reaction) => {
        // Check if the new reaction is the same as the current action
        if (reaction === action) {
            setAction(() => null);
            if (reaction === "Like") {
                setLikeCount(() => likeCount - 1);
            } else if (reaction === "Dislike") {
                setUnlikeCount(() => unlikeCount - 1);
            }
        } else {
            // Update Optimistically for better UX
            if (reaction) {
                setAction(() => reaction);
                if (reaction === "Like") {
                    if (!action) {
                        setLikeCount(() => likeCount + 1);
                    } else if (action === "Dislike") {
                        setUnlikeCount(() => unlikeCount - 1);
                        setLikeCount(() => likeCount + 1);
                    }
                } else if (reaction === "Dislike") {
                    if (!action) {
                        setUnlikeCount(() => unlikeCount + 1);
                    } else if (action === "Like") {
                        setLikeCount(() => likeCount - 1);
                        setUnlikeCount(() => unlikeCount + 1);
                    }
                }
            }
        }
        try {
            const res = await commentReaction({ comment_id: parentComment.id, action: reaction }).unwrap()
            // setAction(() => res?.data?.action);
        } catch (error) {
            const errorMessage = handleError(error)
            toast.error(errorMessage)
            if (reaction === "Like") {
                setLikeCount(() => likeCount - 1);
            } else if (reaction === "Dislike") {
                setUnlikeCount(() => unlikeCount - 1);
            }
            setAction(reaction);
        }
    };

    if(nestedComment?.comment || nestedComment?.image){
        isValidComment= true
    }

    useEffect(() => {
        parentComment && setAction(() => parentComment.reaction?.action)
        setLikeCount(() => parentComment.likes)
        setUnlikeCount(() => parentComment.unlikes)
    }, [])

    return (
        <>
            <div className={`w-full border border-tgray-50 rounded-xl p-2 flex flex-col items-start justify-between gap-4`}>
                <section className="w-full flex gap-3">
                    <div className="flex items-start justify-start">
                        <Avatar size="xs" src={parentComment.is_anonymous ? null : parentComment.user.avatar} />
                    </div>
                    <section className="w-full flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold">{parentComment.is_anonymous ? "Anonymous" : (parentComment?.user.username ?? parentComment?.user.name)}</span>
                            <span className="p-0.5 rounded-full border border-[#F96C40]" />
                            <span className="text-xs text-tprimary-50 font-bold">{moment(parentComment.created_at).fromNow(true)}</span>
                        </div>

                        <pre className="text-sm font-normal text-wrap break-words whitespace-normal pr-2 w-full">
                            {parentComment.comment}
                        </pre>
                        <section className="">
                            { parentComment.attachment ? 
                                <section className="relative rounded-lg min-h-[170px] h-[250px]">
                                    <img
                                        className="border-none h-full w-full rounded-lg bg-[#444444]"
                                        src={parentComment.attachment ?? null}
                                        style={{
                                            backgroundRepeat: 'no-repeat',
                                            backgroundSize: "cover",
                                            objectFit: 'cover',
                                        }}
                                    />
                                </section>
                                : null
                            }
                        </section>

                        <section className="w-full flex items-center gap-6 sm:gap-12 pt-2">
                            <Button
                                variant="link"
                                children="Reply"
                                className="text-[#444444] !text-sm font-boldNunito"
                                onClick={() => setIsReplying(true)}
                            />
                            <div onClick={() =>handlePostReaction("Like")} className="flex items-center gap-2 cursor-pointer">
                                <span className="font-boldNunito text-sm text-[#444444]">{likeCount}</span>
                                <Icon.ThumbsUp size={20} fill={action === "Like" ? "#017FC8" : "#FFFFFF"} />
                            </div>
                            <div onClick={() =>handlePostReaction("Dislike")} className="flex items-center gap-2 cursor-pointer">
                                <span className="font-boldNunito text-sm text-[#444444]">{unlikeCount}</span>
                                <Icon.ThumbsDown size={20} fill={action === "Dislike" ? "#FF0000" : "#FFFFFF"} />
                            </div>
                        </section>
                    </section>
                </section>
                {    isReplying ?
                    <motion.section className="w-full">
                        <CommentInput
                            anonChecked={anonChecked}
                            setAnonChecked={setAnonChecked}
                            nestedComment={nestedComment}
                            setImagePreview={setImagePreview}
                            image={imagePreview}
                            onChange={handleFileUpload}
                            handleCommentChange={handleAddNewComment}
                            submitComment={() => {submitNestedCommentResponse(); setIsReplying(() => false)}}
                            setIsReplying={setIsReplying}
                            isValidComment={isValidComment}
                            isLoading={isLoading}
                            cancel
                        />
                    </motion.section>
                    :
                    null
                }
            </div>
        </>
    )
}
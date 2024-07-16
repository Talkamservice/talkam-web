import { act, useEffect, useState } from "react"
import { Button } from "../forms/button"
import { Avatar } from "../global/avatar"
import { CommentInput } from "./commentinput"
import { motion } from "framer-motion"
import { NestedCommentCard } from "./nestedcommentcard"
import { downVariants } from "../../helpers/cardanimation"
import { useCommentReactionMutation } from "../../services/posts/postsApiSlice"
import { toast } from "sonner"
import { handleError } from "../../utils/handleError"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { randomId } from "../../helpers/randomid"
import { storageDB } from "../../utils/firestore"
import * as Icon from "react-feather"
import moment from "moment"

export const CommentCard = ({
    parentComment,
    allComments,
    submitCommentResponse,
    submitNestedCommentResponse,
    comment,
    setComment,
    nestedComment,
    setNestedComment,
    time,
    reaction,
    avatar,
    isLoading,
}) => {

    let isValidComment = false

    const [ action, setAction ] = useState(reaction);
    const [ likeCount, setLikeCount ] = useState();
    const [ unlikeCount, setUnlikeCount ] = useState();
    const [ isReplying, setIsReplying ] = useState(false);
    const [ showMore, setShowMore ] = useState(false);
    const [ anonChecked, setAnonChecked ] = useState(false);
    const [ imagePreview, setImagePreview ] = useState(null);
    const [ commentReaction ] = useCommentReactionMutation();
    
    const handleAddNewComment = (event) => {
        setComment({...comment, comment: event.target.value });
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
        setComment({...comment, image: url})
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

    if(comment.comment || comment.image){
        isValidComment= true
    };

    useEffect(() => {
        reaction && setAction(() => reaction)
        setLikeCount(() => parentComment.likes)
        setUnlikeCount(() => parentComment.unlikes)
    }, [])

    return (
        <>
            <div className={`w-full border border-tgray-50 rounded-xl p-4 flex flex-col items-start justify-between gap-4 overflow-hidden`}>
                <section className="w-full flex gap-3">
                    <div className="flex items-start justify-start">
                        <Avatar size="xsm" src={avatar} />
                    </div>
                    <section className="w-full flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold">{parentComment?.user.username ?? parentComment?.user.name}</span>
                            <span className="p-0.5 rounded-full border border-[#F96C40]" />
                            <span className="text-xs text-tprimary-50 font-bold">{moment(time).fromNow(true)}</span>
                        </div>

                        <article className="text-sm font-normal text-wrap whitespace-pre-wrap break-words w-full">
                            {parentComment.comment}
                        </article>
                        <section className="w-full">
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
                        {   allComments?.length > 0 ?
                            <span onClick={() => setShowMore(prev => !prev)} className="text-tprimary-50 font-bold text-xs sm:text-sm cursor-pointer">
                                {` ${ showMore ? 'Hide' : 'View' } ${ allComments.length } ${ allComments?.length === 1 ? 'Reply' : 'Replies' } `}
                            </span> 
                            : 
                            null
                        }
                    </section>
                </section>
                {    isReplying ?
                    <motion.section
                        key="chatbox"
                        variants={downVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        className="w-full"
                    >
                        <CommentInput
                            anonChecked={anonChecked}
                            setAnonChecked={setAnonChecked}
                            comment={comment}
                            setImagePreview={setImagePreview}
                            image={imagePreview}
                            onChange={handleFileUpload}
                            handleCommentChange={handleAddNewComment}
                            submitComment={() => { submitCommentResponse(); setIsReplying(false); setShowMore(true)}}
                            setIsReplying={setIsReplying}
                            isValidComment={isValidComment}
                            isLoading={isLoading}
                            cancel
                        />
                    </motion.section>
                    :
                    null
                }
                {
                    showMore ?
                        <motion.section
                            // key="chatbox"
                            variants={downVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                            className="w-full flex flex-col gap-4"
                        >
                            {
                                allComments?.map((comment) => (
                                    <NestedCommentCard
                                        key={comment.id}
                                        parentComment={comment}
                                        nestedComment={nestedComment}
                                        setNestedComment={setNestedComment}
                                        submitNestedCommentResponse={() => { submitNestedCommentResponse( parentComment.id, comment.id ); setIsReplying(false); setShowMore(true)}}
                                        isLoading={isLoading}
                                    />
                                ))
                            }
                        </motion.section>
                        :
                        null
                }
            </div>
        </>
    )
}
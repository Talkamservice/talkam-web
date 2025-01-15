import { Fragment, useEffect, useRef, useState } from "react"
import { Button } from "../forms/button"
import { Avatar } from "../global/avatar"
import { CommentInput } from "./commentinput"
import { motion } from "framer-motion"
import { useBlockUserMutation, useCommentReactionMutation, useDeleteCommentMutation } from "../../services/posts/postsApiSlice"
import { useNavigate } from "react-router-dom"
import { handleError } from "../../utils/handleError"
import { toast } from "sonner"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storageDB } from "../../utils/firestore"
import { randomId } from "../../helpers/randomid"
import { NewNotificationIcon, TrashIcon } from "../../assets/icons/generated"
import { Modal } from "../global/modal"
import { CommentReportModal } from "./commentreportmodal"
import { BlockPromptModal } from "../global/blockpromptmodal"
import { useOnOutsideClick } from "../../hooks/useOnOutsideClick"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "../../services/authSlice"
import { PostCardVariants } from "../../helpers/cardanimation"
import { AuthWrapper } from "../../utils/authWrapper"
import { ImageModalView } from "../global/imagemodalview"
import { useLazyGetUserFromUsernameQuery } from "../../services/userApiSlice"
import moment from "moment"
import * as Icon from "react-feather"

export const NestedCommentCard = ({
    parentComment,
    submitNestedCommentResponse,
    nestedComment,
    setNestedComment,
    isLoading,
    anonChecked,
    setAnonChecked,
    originalPostId,
    internalImagePreview,
    setInternalImagePreview,
    isReported,
    notification,
    user,
}) => {

    let isValidComment = false
    const currentUser = useSelector(selectCurrentUser);
    const isCurrentUser = currentUser && currentUser?.id === parentComment?.user?.id;

    const navigate = useNavigate();
    const popUpRef = useRef();
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [showPopUp, setShowPopUp] = useState(false);
    const [openReport, setOpenReport] = useState(false);
    const [action, setAction] = useState(parentComment && parentComment.reaction?.action);
    const [likeCount, setLikeCount] = useState();
    const [unlikeCount, setUnlikeCount] = useState();
    const [isReplying, setIsReplying] = useState();
    const [imageModal, setImageModal] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);

    const [commentReaction] = useCommentReactionMutation();
    const [blockUser, { isLoading: blockLoading }] = useBlockUserMutation();
    const [deleteComment] = useDeleteCommentMutation();
    const [trigger, { isLoading: userLoading }] = useLazyGetUserFromUsernameQuery();

    useOnOutsideClick(popUpRef, () => {
        setShowPopUp(false);
    });

    const handleAddNewComment = (event) => {
        setNestedComment({ ...nestedComment, comment: event.target.value });
    }

    const handleFileUpload = (event) => {
        event.preventDefault()
        const { files } = event.target;
        if (!files[0]) return;
        setInternalImagePreview(() => URL.createObjectURL(files[0]))
        savePostImage(files[0])
    };
    const savePostImage = async (file) => {
        setImageLoading(true)
        const imageRef = ref(storageDB, `web-images/${randomId()}`);
        const snapshot = await uploadBytes(imageRef, file);
        const url = await getDownloadURL(
            ref(storageDB, snapshot.metadata.fullPath)
        );
        setNestedComment({ ...nestedComment, image: url });
        setImageLoading(false)
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

    const handleBlockUser = async () => {
        try {
            const blockRes = await blockUser({ blocked_user_id: parentComment?.user?.id }).unwrap();
            toast.success(blockRes.message);
            setShowBlockModal(() => false)
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage)
        }

    };

    const handleDeleteComment = async (postId) => {
        try {
            const deleteRes = await deleteComment(postId);
            toast.success(deleteRes?.data?.message)
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage);
        }
        setShowPopUp(() => false)
    }

    const copyTextToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(`https://web.talkam.prodevs.io/comment/${parentComment?.post?.id}`);
            toast.success("Copied to Clipboard")
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage);
        }
        setShowPopUp(() => false)
    }

    const handleNavigateToProfile = async (username) => {
        try {
            const res = await trigger(username);
            navigate(`/userprofile/${res?.data?.data?.username ?? res?.data?.data?.id}`)
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage)
        }
    }

    const toggleImageModal = () => {
        setImageModal(prev => !prev)
    }

    const handleShowBlockModal = () => {
        setShowBlockModal((prev) => !prev)
    }
    const handleReportModal = () => {
        setShowPopUp(() => false)
        setOpenReport((prev) => !prev)
    }

    const handleReply = () => {
        setIsReplying(true)
    }

    if ((nestedComment?.comment || nestedComment?.image) && !imageLoading) {
        isValidComment = true
    }

    useEffect(() => {
        parentComment && setAction(() => parentComment.reaction?.action)
        setLikeCount(() => parentComment.likes)
        setUnlikeCount(() => parentComment.unlikes)
    }, []);


    return (
        <>
            <div className={`w-full border border-tgray-50 rounded-xl p-2 flex flex-col items-start justify-between gap-4 relative`}>
                <section className="w-full flex gap-3">
                    <div onClick={() => navigate(`/userprofile/${parentComment?.user?.username ?? parentComment?.user?.id}`)}
                        className={`flex items-start justify-start ${parentComment?.is_anonymous ? "pointer-events-none" : "cursor-pointer"}`}>
                        <Avatar size="xs" src={parentComment.is_anonymous ? null : parentComment.user.avatar} />
                    </div>
                    <section className="w-full flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold">{parentComment.is_anonymous ? "Anonymous" : (parentComment?.user.username ?? parentComment?.user.name)}</span>
                            <span className="p-0.5 rounded-full border border-[#F96C40]" />
                            <span className="text-xs text-tprimary-50 font-bold">{moment(parentComment.created_at).fromNow(true)}</span>
                        </div>

                        <pre className="text-sm font-normal text-wrap break-words whitespace-normal pr-2 w-full">
                            <span className="text-xs font-bold pr-2">
                                Replying @{!parentComment.reply_to ? "Anonymous" : (parentComment?.reply_to?.username || parentComment?.reply_to?.name)}
                            </span>
                            <span className="text-sm font-normal text-wrap whitespace-pre-wrap break-words w-full">
                                {parentComment?.comment?.split(/(@\w+)/g).map((part, index) => {
                                    // Clean up any leading or trailing `$` character around mentions
                                    part = part.replace(/\$/g, ''); // Remove all occurrences of '$'

                                    // Check if the part is a mention
                                    if (part.startsWith('@')) {
                                        const username = part.substring(1); // Remove the '@'
                                        return (
                                            <span
                                                key={index}
                                                onClick={() => handleNavigateToProfile(username)} // Link to the user's profile
                                                className="text-blue-700 font-semibold cursor-pointer"
                                            >
                                                {part}
                                            </span>
                                        );
                                    }

                                    // Render regular text
                                    return <Fragment key={index}>{part}</Fragment>;
                                })}
                            </span>
                        </pre>
                        <section className="">
                            {parentComment.attachment ?
                                <section onClick={toggleImageModal} className="relative rounded-lg min-h-[170px] h-[250px] cursor-pointer">
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
                            <AuthWrapper onClick={handleReply}>
                                <Button
                                    variant="link"
                                    children="Reply"
                                    className="text-[#444444] !text-sm font-boldNunito"
                                />
                            </AuthWrapper>
                            <section className="flex items-center gap-8">
                                <AuthWrapper onClick={() => handlePostReaction("Like")}>
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <span className="font-boldNunito text-sm text-[#444444]">{likeCount}</span>
                                        <Icon.ThumbsUp size={20} fill={action === "Like" ? "#017FC8" : "#FFFFFF"} />
                                    </div>
                                </AuthWrapper>
                                <AuthWrapper onClick={() => handlePostReaction("Dislike")}>
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <span className="font-boldNunito text-sm text-[#444444]">{unlikeCount}</span>
                                        <Icon.ThumbsDown size={20} fill={action === "Dislike" ? "#FF0000" : "#FFFFFF"} />
                                    </div>
                                </AuthWrapper>
                            </section>

                            {/* more icon and popup */}
                            <section ref={popUpRef} className="cursor-pointer">
                                <Icon.MoreVertical onClick={() => setShowPopUp(prev => !prev)} color="#212121" />
                                {
                                    showPopUp ?
                                        <motion.div
                                            variants={PostCardVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                                            className="absolute -top-12 -right-5 z-10"
                                        >
                                            <ul className="w-full bg-white flex flex-col items-start divide-y divide-tgray-50 border border-tgray-50 overflow-hidden rounded-xl">
                                                <li onClick={() => copyTextToClipboard()}
                                                    className="bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight"
                                                >
                                                    <Icon.Link2 className='-rotate-45' size={15} color='#000000' strokeWidth={2} />
                                                    <p>Copy link</p>
                                                </li>
                                                <li className="w-full">
                                                    <AuthWrapper>
                                                        <li
                                                            className="bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight"
                                                        >
                                                            <NewNotificationIcon className="w-4 h-4" />
                                                            <p>{notification ? "Mute notifications for this thread" : "Get notifications for this thread"}</p>
                                                        </li>
                                                    </AuthWrapper>
                                                </li>
                                                {/* <li onClick={handleShowBlockModal}
                                                    className={`
                                                        bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight
                                                        ${(!parentComment.is_anonymous) ? "block" : 'hidden'}
                                                        ${(!isCurrentUser) ? "block" : 'hidden'}
                                                        
                                                    `}
                                                >
                                                    <Icon.Slash size={15} color='#000000' strokeWidth={2} />
                                                    <p>Block @{parentComment?.user?.username ?? parentComment?.user?.name}</p>
                                                </li> */}
                                                {
                                                    !isReported ?
                                                        <li className="w-full">
                                                            <AuthWrapper onClick={handleReportModal}>
                                                                <li
                                                                    className="bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight"
                                                                >
                                                                    <Icon.Flag size={15} color='#000000' strokeWidth={2} />
                                                                    <p>Report this post</p>
                                                                </li>
                                                            </AuthWrapper>
                                                        </li>
                                                        :
                                                        null
                                                }
                                                <li onClick={() => handleDeleteComment(parentComment?.id)}
                                                    className={` ${isCurrentUser ? 'block' : 'hidden'}  bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight `}
                                                >
                                                    <TrashIcon className="text-[#AC4242]" />
                                                    <p>Delete Comment</p>
                                                </li>
                                            </ul>
                                        </motion.div>
                                        :
                                        null
                                }
                            </section>

                        </section>
                    </section>
                </section>
                {isReplying ?
                    <motion.section className="w-full">
                        <CommentInput
                            anonChecked={anonChecked}
                            setAnonChecked={setAnonChecked}
                            commentBody={nestedComment}
                            setCommentBody={setNestedComment}
                            imagePreview={internalImagePreview}
                            setImagePreview={setInternalImagePreview}
                            image={nestedComment?.image}
                            onChange={handleFileUpload}
                            handleCommentChange={handleAddNewComment}
                            submitComment={() => { submitNestedCommentResponse(); setIsReplying(() => false) }}
                            setIsReplying={setIsReplying}
                            isValidComment={isValidComment}
                            isLoading={isLoading}
                            imageLoading={imageLoading}
                            user={user}
                            cancel
                        />
                    </motion.section>
                    :
                    null
                }
            </div>


            <Modal
                show={openReport}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={handleReportModal}
                position='center'
                contentWidth='w-full md:w-2/4'
            >
                <CommentReportModal
                    onClose={handleReportModal}
                    commentId={parentComment?.id}
                    postId={originalPostId}
                />
            </Modal>

            <Modal
                show={showBlockModal}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={handleShowBlockModal}
                position='center'
                contentWidth='w-full md:w-1/4'
            >
                <BlockPromptModal
                    user={!parentComment.is_anonymous ? (parentComment?.user?.username || parentComment?.user?.name) : 'Anonymous'}
                    handleShowBlockModal={handleShowBlockModal}
                    handleBlockUser={handleBlockUser}
                    isLoading={blockLoading}
                />
            </Modal>

            <Modal
                show={imageModal}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={toggleImageModal}
                position='center'
                contentWidth='w-full'
            >
                <ImageModalView
                    file={parentComment.attachment}
                    handleImageModal={toggleImageModal}
                />
            </Modal>
        </>
    )
}
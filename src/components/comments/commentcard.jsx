import { Fragment, useEffect, useRef, useState } from "react"
import { Button } from "../forms/button"
import { Avatar } from "../global/avatar"
import { CommentInput } from "./commentinput"
import { motion } from "framer-motion"
import { NestedCommentCard } from "./nestedcommentcard"
import { downVariants, PostCardVariants } from "../../helpers/cardanimation"
import { useBlockUserMutation, useCommentReactionMutation, useDeleteCommentMutation, useUpdatePostNotificationsMutation } from "../../services/posts/postsApiSlice"
import { toast } from "sonner"
import { handleError } from "../../utils/handleError"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { useNavigate } from "react-router-dom"
import { randomId } from "../../helpers/randomid"
import { storageDB } from "../../utils/firestore"
import { useOnOutsideClick } from "../../hooks/useOnOutsideClick"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "../../services/authSlice"
import { NewNotificationIcon, TrashIcon } from "../../assets/icons/generated"
import { Modal } from "../global/modal"
import { CommentReportModal } from "./commentreportmodal"
import { BlockPromptModal } from "../global/blockpromptmodal"
import { AuthWrapper } from "../../utils/authWrapper"
import { ImageModalView } from "../global/imagemodalview"
import { useLazyGetUserFromUsernameQuery } from "../../services/userApiSlice"
import moment from "moment"
import * as Icon from "react-feather"
import LoadingBar from "react-top-loading-bar"

export const CommentCard = ({
    parentComment,
    allComments,
    submitCommentResponse,
    submitNestedCommentResponse,
    comment,
    setComment,
    nestedComment,
    setNestedComment,
    anonChecked,
    setAnonChecked,
    nestedAnonChecked,
    setNestedAnonChecked,
    time,
    reaction,
    avatar,
    isLoading,
    originalPostId,
    imagePreview,
    setImagePreview,
    internalImagePreview,
    setInternalImagePreview,
    notification,
    isReported,
}) => {

    let isValidComment = false;
    const currentUser = useSelector(selectCurrentUser);
    const isCurrentUser = currentUser && currentUser?.id === parentComment?.user?.id;

    const navigate = useNavigate()
    const popUpRef = useRef();
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [showPopUp, setShowPopUp] = useState(false);
    const [openReport, setOpenReport] = useState(false);
    const [action, setAction] = useState(reaction);
    const [likeCount, setLikeCount] = useState();
    const [unlikeCount, setUnlikeCount] = useState();
    const [isReplying, setIsReplying] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    // const [login, setLogin] = useState(false)

    const [commentReaction] = useCommentReactionMutation();
    const [blockUser, { isLoading: blockLoading }] = useBlockUserMutation();
    const [deleteComment] = useDeleteCommentMutation();
    const [updatePostNotifications] = useUpdatePostNotificationsMutation();
    const [trigger, { isLoading: userLoading }] = useLazyGetUserFromUsernameQuery();

    useOnOutsideClick(popUpRef, () => {
        setShowPopUp(false);
    });

    const handleAddNewComment = (event) => {
        setComment({ ...comment, comment: event.target.value });
    }
    const handleFileUpload = (event) => {
        event.preventDefault()
        const { files } = event.target;
        if (!files[0]) return;
        setImagePreview(() => URL.createObjectURL(files[0]))
        savePostImage(files[0])
    };
    const savePostImage = async (file) => {
        setImageLoading(true)
        const imageRef = ref(storageDB, `web-images/${randomId()}`);
        const snapshot = await uploadBytes(imageRef, file);
        const url = await getDownloadURL(
            ref(storageDB, snapshot.metadata.fullPath)
        );
        setComment({ ...comment, image: url })
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

    const handleNotificationPreference = async (postId) => {
        const toastId = toast("Updating...");
        try {
            const res = await updatePostNotifications({ post_id: postId }).unwrap();
            toast.dismiss(toastId);
            toast.success(res?.message);
        } catch (error) {
            toast.dismiss(toastId);
            const errorMessage = handleError(error);
            toast.error(errorMessage)
        }
        setShowPopUp(false)
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
    };


    const handleNavigateToProfile = async (username) => {
        try {
            const res = await trigger(username);
            navigate(`/userprofile/${res?.data?.data?.id}`)
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

    if ((comment.comment || comment.image) && !imageLoading) {
        isValidComment = true
    };

    useEffect(() => {
        reaction && setAction(() => reaction)
        setLikeCount(() => parentComment.likes)
        setUnlikeCount(() => parentComment.unlikes)
    }, []);

    const handleReply = () => {
        setIsReplying(true)
    }

    return (
        <>
            <LoadingBar height={3} color="#017FC8" progress={userLoading ? 75 : 100} />
            <div className={`w-full border border-tgray-50 rounded-xl p-4 flex flex-col items-start justify-between gap-4 relative`}>
                <section className="w-full flex gap-3">
                    <div onClick={() => navigate(`/userprofile/${parentComment?.user.id}`)}
                        className={`flex items-start justify-start ${parentComment?.is_anonymous ? "pointer-events-none" : "cursor-pointer"}`}>
                        <Avatar size="xsm" src={parentComment.is_anonymous ? null : avatar} />
                    </div>
                    <section className="w-full flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold">{parentComment.is_anonymous ? "Anonymous" : (parentComment?.user.username ?? parentComment?.user.name)}</span>
                            <span className="p-0.5 rounded-full border border-[#F96C40]" />
                            <span className="text-xs text-tprimary-50 font-bold">{moment(time).fromNow(true)}</span>
                        </div>

                        <article className="text-sm font-normal text-wrap whitespace-pre-wrap break-words w-full">
                            {parentComment.comment.split(/(@\w+)/g).map((part, index) => {
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
                        </article>



                        <section className="w-full">
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
                            <div className="flex items-center gap-8">
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
                            </div>

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
                                                    <AuthWrapper onClick={() => handleNotificationPreference(parentComment?.id)}>
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
                                                            <AuthWrapper ref={popUpRef} onClick={handleReportModal} >
                                                                <li className="bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight">
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
                        {allComments?.length > 0 ?
                            <span onClick={() => setShowMore(prev => !prev)} className="text-tprimary-50 font-bold text-xs sm:text-sm cursor-pointer">
                                {` ${showMore ? 'Hide' : 'View'} ${allComments.length} ${allComments?.length === 1 ? 'Reply' : 'Replies'} `}
                            </span>
                            :
                            null
                        }
                    </section>
                </section>
                {isReplying ?
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
                            commentBody={comment}
                            setCommentBody={setComment}
                            imagePreview={imagePreview}
                            setImagePreview={setImagePreview}
                            image={comment.image}
                            onChange={handleFileUpload}
                            handleCommentChange={handleAddNewComment}
                            submitComment={() => { submitCommentResponse(); setIsReplying(false); setShowMore(true) }}
                            setIsReplying={setIsReplying}
                            isValidComment={isValidComment}
                            isLoading={isLoading}
                            imageLoading={imageLoading}
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
                                        submitNestedCommentResponse={() => { submitNestedCommentResponse(parentComment.id, comment.id); setIsReplying(false); setShowMore(true) }}
                                        isLoading={isLoading}
                                        anonChecked={nestedAnonChecked}
                                        setAnonChecked={setNestedAnonChecked}
                                        parentIsAnon={parentComment.is_anonymous}
                                        originalPostId={originalPostId}
                                        internalImagePreview={internalImagePreview}
                                        setInternalImagePreview={setInternalImagePreview}
                                        notification={comment?.enabled_notification}
                                        isReported={comment?.is_reported}
                                    />
                                ))
                            }
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
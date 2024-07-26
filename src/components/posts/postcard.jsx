import { Avatar } from "../global/avatar"
import { PostComment } from "./postcomment"
import { PostImage } from "./postimage"
import { PostTags } from "./posttags"
import { PostCommentCount } from "./postcommentcount"
import { PostActionButton } from "./postactionbutton"
import { PostShareButton } from "./postsharebutton"
import { motion } from "framer-motion"
import { PostCardVariants } from "../../helpers/cardanimation"
import { useRef, useState } from "react"
import { useTruncatedElement } from "../../hooks/useTruncated"
import { Button } from "../forms/button"
import { PostTitle } from "./posttitle"
import { useDeletePostMutation, usePostReactionMutation, useSelectPollOptionMutation } from "../../services/posts/postsApiSlice"
import { toast } from "sonner"
import { handleError } from "../../utils/handleError"
import { PostPollBar } from "./postpollbar"
import { useOnOutsideClick } from "../../hooks/useOnOutsideClick"
import { Modal } from "../global/modal"
import { ShareModal } from "./postsharemodal"
import { NewNotificationIcon, TrashIcon } from '../../assets/icons/generated'
import { BlockPromptModal } from "../global/blockpromptmodal"
import { useBlockUserMutation } from "../../services/userApiSlice"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "../../services/authSlice"
import { PostReportModal } from "./postreportmodal"
import TalkamLogo from "../../assets/icons/logo.svg"
import moment from "moment"
import * as Icon from 'react-feather'

export const PostCard = ({
    id,
    avatar,
    title,
    comment,
    tags,
    image,
    category,
    time,
    author,
    commentcount,
    likes,
    side,
    isAnon,
    routeChange,
    type,
    reaction,
    polls,
    user,
}) => {

    const anonymous = !!isAnon;
    const currentUser = useSelector(selectCurrentUser);
    const isCurrentUser = currentUser && currentUser?.id === user?.id;
    const commentRef = useRef(null);
    const popUpRef = useRef();
    const [ showPopUp, setShowPopUp ] = useState(false);
    const [ openShare, setOpenShare ] = useState(false);
    const [ showBlockModal, setShowBlockModal ] = useState(false);
    const [ openReport, setOpenReport ] = useState(false);
    const [ action, setAction ] = useState(reaction && reaction?.action);
    const [ likeCount, setLikeCount ] = useState(likes);
    const [ showImagePreview, setShowImagePreview ] = useState(false)
    const [ pollOptions, setPollOptions ] = useState(polls);
    const [ selectedPoll, setSelectedPoll ] = useState(pollOptions && pollOptions.some(option => option.selected));

    const { isTruncated, isReadingMore, toggleIsShowingMore } = useTruncatedElement(commentRef);
    useOnOutsideClick(popUpRef, () => {
        setShowPopUp(false);
    });

    const [ postReaction ] = usePostReactionMutation();
    const [ selectPollOption ] = useSelectPollOptionMutation();
    const [ blockUser, { isLoading } ] = useBlockUserMutation();
    const [ deletePost ] = useDeletePostMutation();

    const calculatePercentages = (options) => {
        const totalVotes = options.reduce((sum, option) => sum + option.count, 0);
        return options.map(option => ({
          ...option,
          percentage: totalVotes ? (option.count / totalVotes) * 100 : 0
        }));
    };

    const updatePollHandler = (pollId) => {
        if(selectedPoll) return;
        const newOptions = pollOptions.map((poll) => {
            if(poll.id === pollId) {
                return {
                    ...poll,
                    selected: true,
                    count: poll.count + 1,
                }
            }
            return poll
        });
        setPollOptions(() => calculatePercentages(newOptions));
        submitPoll();

        //Creating this as a closure so the UI updates immediately before the server response returns ( Optimistic UI updates ==> better UX )
        async function submitPoll(){
            try {
                await selectPollOption({poll_id: pollId}).unwrap();
                toast.success("Vote submitted")
            } catch (error){
                const errorMessage = handleError(error);
                toast.error(errorMessage)
            }
        }

        setSelectedPoll(true);
    }

    const handlePostReaction = async (reaction) => {
        // Check if the new reaction is the same as the current action
        if (reaction === action) {
            setAction(() => null);
            if (reaction === "Like") {
                setLikeCount(() => likeCount - 1);
            }
        } else {
            // Update Optimistically for better UX
            if (reaction) {
                setAction(() => reaction);
                if (reaction === "Like") {
                    setLikeCount(() => likeCount + 1);
                    if (action === "Dislike") {
                        // setUnlikeCount(() => unlikeCount - 1);
                    }
                } else if (reaction === "Dislike" && action === "Like") {
                    setLikeCount(() => likeCount - 1);
                }
            }
        }
        try {
            const res = await postReaction({ post_id: id, action: reaction }).unwrap()
            // setAction(() => res?.data?.action);
        } catch (error) {
            const errorMessage = handleError(error)
            toast.error(errorMessage);
            setAction(reaction?.action);
        }
    };

    const handleBlockUser = async() => {
        try {
            const blockRes = await blockUser({ blocked_user_id: user.id }).unwrap();
            toast.success(blockRes.message);
            setShowBlockModal(() => false)
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage)
        }

    };

    const handleDeletePost = async() => {
        try {
            const deleteRes = await deletePost(id);
            toast.success(deleteRes?.data?.message)
        } catch(error){
            const errorMessage = handleError(error);
            toast.error(errorMessage);
        }
        setShowPopUp(() => false)
    }

    const copyTextToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(`https://web.talkam.prodevs.io/comment/${id}`);
            toast.success("Copied to Clipboard")
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage);
        }
        setShowPopUp(() => false)
    }
    
    const toggleModal = () => {
        setShowImagePreview((prev) => !prev)
    }
    const toggleShareModal = () => {
        setOpenShare((prev) => !prev)
    }
    const handleShowBlockModal = () => {
        setShowBlockModal((prev) => !prev)
    }
    const handleReportModal = () => {
        setOpenReport((prev) => !prev)
    }

    return (
        <motion.div
            key="chatbox"
            variants={PostCardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="w-full flex flex-col gap-2 border border-tgray-xlight p-3 rounded-lg relative bg-white"
        >
            <header className="flex items-center justify-between gap-3">
                <section className="flex items-center gap-3">
                    <Avatar size="xsm" src={ !anonymous ? avatar : null} />
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className={`${ side ? "text-xs" : "text-sm" } font-medium text-tblack-100 whitespace-nowrap`}>{category}</span>
                            <span className={`${side ? "text-xs" : "text-sm"} font-medium text-tprimary-50 whitespace-nowrap`}>{moment(time).fromNow(true)}</span>
                        </div>
                        <span className="text-xs font-medium text-[#858585]">Posted by { !anonymous ? author : 'Anonymous' }</span>
                    </div>
                </section>

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
                            className="absolute top-12 right-5 z-10"
                        >
                            <ul className="w-full bg-white flex flex-col items-start divide-y divide-tgray-50 border border-tgray-50 overflow-hidden rounded-xl">
                                <li onClick={() => copyTextToClipboard()}
                                    className="bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight"
                                >
                                    <Icon.Link2 className='-rotate-45' size={15} color='#000000' strokeWidth={2} />
                                    <p>Copy link</p>
                                </li>
                                <li onClick={() => onClick(item, id)}
                                    className="bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight"
                                >
                                    <NewNotificationIcon className="w-4 h-4" />
                                    <p>Get notifications for this thread</p>
                                </li>
                                <li onClick={handleShowBlockModal}
                                    className={`
                                        bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight
                                        ${(!anonymous) ? "block" : 'hidden'}
                                        ${(!isCurrentUser) ? "block" : 'hidden'}
                                    `}
                                >
                                    <Icon.Slash size={15} color='#000000' strokeWidth={2} />
                                    <p>Block @{author}</p>
                                </li>
                                <li onClick={handleReportModal}
                                    className="bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight"
                                >
                                    <Icon.Flag size={15} color='#000000' strokeWidth={2} />
                                    <p>Report this post</p>
                                </li>
                                <li onClick={handleDeletePost}
                                        className={` ${ isCurrentUser ? 'block' : 'hidden' }  bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight `}
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
            </header>

            <main className="w-full flex flex-col gap-2">
                <section className="flex flex-col w-full gap-3">
                    {
                        type !== 'Poll' ?
                        <>
                            <article className="flex flex-col w-full gap-2">
                                <PostTitle
                                    ref={commentRef}
                                    side={side}
                                    title={title}
                                    isReadingMore={isReadingMore}
                                />
                                <PostComment
                                    side={side}
                                    ref={commentRef}
                                    comment={comment}
                                    isReadingMore={isReadingMore}
                                />
                                {isTruncated && (
                                    <Button
                                        variant="link"
                                        className="!text-tprimary-50 !font-medium !text-sm "
                                        onClick={toggleIsShowingMore}
                                        children={isReadingMore ? 'Read less...' : 'Read more...'}
                                    />
                                )}
                            </article>
                            <PostImage
                                onClick={toggleModal}
                                side={side}
                                src={image}
                            />
                        </>
                        :
                        <>
                            <section className="flex flex-col gap-2">
                                <PostTitle
                                    side={side}
                                    title={title}
                                    isReadingMore={isReadingMore}
                                />
                                <div className="flex flex-col gap-3">
                                    {
                                        pollOptions?.map((poll, index) => (
                                            <PostPollBar
                                                key={poll.id + index}
                                                option={poll.option}
                                                selected={poll.selected}
                                                percentage={poll.percentage}
                                                handlePollVote={updatePollHandler}
                                                id={poll.id}
                                                color="#BAE4FD"
                                                selectedPoll={selectedPoll}
                                            />
                                        ))
                                    }
                                    <span className="text-sm font-medium">{ selectedPoll ? '3 votes' : '7 days left' }</span>
                                </div>
                            </section>
                        </>
                    }
                    <section className="flex items-center justify-start gap-2 flex-wrap">
                        {tags && tags?.map((tag, index) => ( <PostTags side={side} key={tag + index} tag={tag} /> ))}
                    </section>
                </section>
                <footer className={` ${ side ? 'hidden' : 'flex' } flex item-center justify-between flex-wrap gap-2 border-t border-tgray-50 py-2`}>
                    <div className="flex items-center flex-wrap gap-2">
                        <PostCommentCount
                            count={commentcount}
                            routeChange={routeChange}
                        />
                        <PostActionButton
                            count={likeCount}
                            handleReaction={handlePostReaction}
                            reaction={action}
                        />
                    </div>
                    <PostShareButton onClick={toggleShareModal} />
                </footer>
            </main>
            <Modal
                show={showImagePreview}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={toggleModal}
                position='center'
                contentWidth='w-full md:w-2/4'
            >
                <div>
                    <img 
                        src={image}
                        className="w-full h-full flex items-center justify-center m-auto bg-[#444444] relative"
                        style={{
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: "cover",
                            objectFit: 'contain',
                        }}
                        onError={(e) => {
                            e.target.onerror = TalkamLogo;
                            e.target.src = TalkamLogo;
                        }}
                    />
                    <Icon.X
                        size={32}
                        onClick={toggleModal}
                        className="bg-white p-2 rounded-full bg-opacity-30 m-5 cursor-pointer absolute top-0 right-0 border-2 border-[#ffffff80]"
                        color="#000000"
                        strokeWidth={4}
                    />
                </div>
            </Modal>
            <Modal
                show={openShare}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={toggleShareModal}
                position='center'
                contentWidth='w-full md:w-fit'
            >
                <ShareModal
                    onClose={toggleShareModal}
                    title={title}
                    comment={comment}
                    image={image}
                    id={id}
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
                    user={ !anonymous ? author : 'Anonymous' }
                    onClose={handleShowBlockModal}
                    handleBlockUser={handleBlockUser}
                    isLoading={isLoading}
                />
            </Modal>

            <Modal
                show={openReport}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={handleReportModal}
                position='center'
                contentWidth='w-full md:w-2/4'
            >
                <PostReportModal onClose={handleReportModal} />
            </Modal>
        </motion.div>
    )
}
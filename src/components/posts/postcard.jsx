import { Avatar } from "../global/avatar"
import { PostComment } from "./postcomment"
import { PostMedia } from "./postmedia"
import { PostTags } from "./posttags"
import { PostCommentCount } from "./postcommentcount"
import { PostActionButton } from "./postactionbutton"
import { PostShareButton } from "./postsharebutton"
import { motion } from "framer-motion"
import { PostCardVariants } from "../../helpers/cardanimation"
import { Button } from "../forms/button"
import { PostTitle } from "./posttitle"
import { PostPollBar } from "./postpollbar"
import { Modal } from "../global/modal"
import { ShareModal } from "./postsharemodal"
import { AnalyticsIcon, BlueTickIcon, LockIcon, NewNotificationIcon, TrashIcon } from '../../assets/icons/generated'
import { BlockPromptModal } from "../global/blockpromptmodal"
import { PostReportModal } from "./postreportmodal"
import { usePostController } from "../../controllers/postsController"
import { Link } from "react-router-dom"
import { ImageModalView } from "../global/imagemodalview"
import { AuthWrapper } from "../../utils/authWrapper"
import { PromotionModal } from "../../routes/dashboard/userprofile/promotion/promotion"
import { PostAnalyticsModal } from "./postanalyticsmodal"
import moment from "moment"
import * as Icon from 'react-feather'

export const PostCard = ({
    id,
    avatar,
    title,
    comment,
    tags,
    image: src,
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
    handleDeletePost,
    parentCategory,
    group,
    isReported,
    notification,
    published,
    home,
    isUser,
    ad,
}) => {

    const postController = usePostController(isAnon, user, reaction, likes, polls, isReported, notification, id);

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
            <header className="flex items-center justify-between gap-2">
                <section className="flex items-center gap-3">
                    <span
                        onClick={() => postController.navigate(`/userprofile/${user.username ?? user.id}`)}
                        className={`w-fit ${postController.anonymous ? "pointer-events-none" : "cursor-pointer"} `}
                    >
                        <Avatar size="xsm" src={!postController.anonymous ? avatar : null} />
                    </span>
                    <div className="flex flex-col gap-2">
                        <section className="flex flex-col items-start sm:flex-row sm:items-center gap-2">
                            <div className="flex items-center gap-2">
                                <span className={`${side ? "text-xs" : "text-sm"} font-medium text-tblack-100 whitespace-nowrap`}>{parentCategory?.name ?? category?.name}</span>
                                <span className={`${side ? "text-xs" : "text-sm"} font-medium text-tprimary-50 whitespace-nowrap`}>{moment(time).fromNow(true)}</span>
                            </div>
                            <span
                                onClick={postController?.handlePromotionModal}
                                className={`w-fit ${isUser && !ad && (group ? group?.group_access !== "Closed" : true) ? "inline" : "hidden"} font-normal border border-[#D1F2F7] text-[8px] px-2 py-1 rounded-full bg-gradient-to-r from-[#FDFFFF] to-[#D1F2F7] cursor-pointer sm:ml-4`}
                            >
                                Promote post
                            </span>
                            <span
                                className={`w-fit ${ad ? "inline" : "hidden"} font-normal text-[8px] px-2 py-1 rounded-full bg-[#FDAC0E] cursor-pointer sm:ml-4`}
                            >
                                Ad
                            </span>
                        </section>
                        <span className="text-xs font-medium text-[#858585]">
                            <span className="flex items-center gap-2">
                                Posted by {!postController.anonymous ? author : 'Anonymous'} {user?.active_subscription ? <BlueTickIcon /> : null}
                            </span>
                            {
                                group && home ?
                                    <p className="items-center whitespace-nowrap inline-flex gap-1 pl-1">
                                        to{" "}
                                        <Link to={`/group/${group?.uuid}`} className="text-tprimary-50 cursor-pointer">
                                            {group?.name}
                                        </Link>
                                        {group?.group_access === "Closed" ? <LockIcon className="w-4 h-4" /> : null}
                                    </p>
                                    :
                                    null
                            }
                            {
                                category && home && !group ?
                                    <p className="items-center whitespace-nowrap inline-flex gap-1 pl-1">
                                        to{" "}
                                        <Link to={`/category/${category?.uuid}`} className="text-tprimary-50 cursor-pointer truncate">
                                            {category?.name}
                                        </Link>
                                    </p>
                                    :
                                    null
                            }
                        </span>
                    </div>
                </section>

                <section ref={postController.popUpRef} className="cursor-pointer">
                    <Icon.MoreVertical onClick={() => postController.setShowPopUp(prev => !prev)} color="#212121" />
                    {
                        postController.showPopUp ?
                            <motion.div
                                variants={PostCardVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                                className="absolute top-12 right-5 z-10"
                            >
                                <ul className="w-full bg-white flex flex-col items-start divide-y divide-tgray-50 border border-tgray-50 overflow-hidden rounded-xl">
                                    <li onClick={() => postController.copyTextToClipboard()}
                                        className="bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight"
                                    >
                                        <Icon.Link2 className='-rotate-45' size={15} color='#000000' strokeWidth={2} />
                                        <p>Copy link</p>
                                    </li>
                                    <li>
                                        <AuthWrapper onClick={() => postController?.handleNotificationPreference()}>
                                            <li
                                                className="bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight"
                                            >
                                                <NewNotificationIcon className="w-4 h-4" />
                                                <p>{postController?.isNotificationEnabled ? "Mute notifications for this thread" : "Get notifications for this thread"}</p>
                                            </li>
                                        </AuthWrapper>
                                    </li>
                                    <li onClick={postController.handleAnalyticsModal}
                                        className={`
                                        bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight
                                        ${postController?.isCurrentUser && ad ? "block" : 'hidden'}
                                    `}
                                    >
                                        <AnalyticsIcon size={15} color='#000000' strokeWidth={2} />
                                        <p>View Analytics</p>
                                    </li>
                                    <li className={`w-full ${postController?.isPostReported ? 'hidden' : 'block'} `}>
                                        <AuthWrapper onClick={postController.handleReportModal}>
                                            <li
                                                className="bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight"
                                            >
                                                <Icon.Flag size={15} color='#000000' strokeWidth={2} />
                                                <p>Report this post</p>
                                            </li>
                                        </AuthWrapper>
                                    </li>
                                    <li onClick={() => handleDeletePost(id)}
                                        className={` ${postController.isCurrentUser ? 'block' : 'hidden'}  bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight `}
                                    >
                                        <TrashIcon className="text-[#AC4242]" />
                                        <p>Delete Post</p>
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
                                        ref={postController.commentRef}
                                        side={side}
                                        title={title}
                                        isReadingMore={postController.isReadingMore}
                                    />
                                    <PostComment
                                        side={side}
                                        ref={postController.commentRef}
                                        comment={comment}
                                        isReadingMore={postController.isReadingMore}
                                    />
                                    {postController.isTruncated && (
                                        <Button
                                            variant="link"
                                            className="!text-tprimary-50 !font-medium !text-sm "
                                            onClick={postController.toggleIsShowingMore}
                                            children={postController.isReadingMore ? 'Read less...' : 'Read more...'}
                                        />
                                    )}
                                </article>
                                <PostMedia
                                    onClick={postController.toggleModal}
                                    side={side}
                                    type={type}
                                    src={src}
                                />
                            </>
                            :
                            <>
                                <section className="flex flex-col gap-2">
                                    <PostTitle
                                        side={side}
                                        title={title}
                                        isReadingMore={postController.isReadingMore}
                                    />
                                    <div className="flex flex-col gap-3">
                                        {
                                            postController.pollOptions?.map((poll, index) => {

                                                postController.totalVoteCount = postController.pollOptions.reduce((sum, option) => sum + option.count, 0) ?? 0;

                                                if (!postController.pluralization)
                                                    postController.pluralization = '0 votes'
                                                if (postController.totalVoteCount > 0) {
                                                    const noun = postController.totalVoteCount > 1 ? 'Votes' : 'Vote';
                                                    postController.pluralization = postController.totalVoteCount + " " + noun
                                                }

                                                let today = moment();
                                                let expiresAt = moment(poll.expires_at);
                                                postController.hasExpired = moment(expiresAt).isSameOrBefore(today);

                                                postController.noOfDaysLeft = expiresAt.to(today, true) ?? 0;

                                                return (
                                                    <PostPollBar
                                                        key={poll.id + index}
                                                        option={poll.option}
                                                        selected={poll.selected}
                                                        percentage={poll.percentage}
                                                        handlePollVote={postController.updatePollHandler}
                                                        id={poll.id}
                                                        color="#BAE4FD"
                                                        selectedPoll={postController.selectedPoll}
                                                        hasExpired={postController.hasExpired}
                                                    />
                                                )
                                            })
                                        }
                                        <span className="text-sm font-medium flex items-center gap-4">
                                            {(postController.selectedPoll || postController.hasExpired) ? postController.pluralization : !postController.noOfDaysLeft ? 0 : postController.noOfDaysLeft + ' left'}
                                            {
                                                postController.hasExpired ?
                                                    <>
                                                        <span className="bg-tprimary-50 rounded-full w-1 h-1" />
                                                        <span className="text-xs text-tgray-250">
                                                            Ended
                                                        </span>
                                                    </>
                                                    :
                                                    null
                                            }
                                        </span>
                                    </div>
                                </section>
                            </>
                    }
                    <section className="flex items-center justify-start gap-2 flex-wrap">
                        {tags && tags?.map((tag, index) => (<PostTags side={side} key={tag + index} tag={tag} />))}
                    </section>
                </section>
                <footer className={` ${side ? 'hidden' : 'flex'} flex item-center justify-between flex-wrap gap-2 border-t border-tgray-50 py-2`}>
                    <div className="flex items-center flex-wrap gap-2">
                        <PostCommentCount
                            count={commentcount}
                            routeChange={routeChange}
                        />
                        <PostActionButton
                            count={postController.likeCount}
                            handleReaction={postController.handlePostReaction}
                            reaction={postController.action}
                        />
                    </div>
                    <PostShareButton onClick={postController.toggleShareModal} />
                </footer>
                {
                    published && !moment(published, "YYYY-MM-DD HH:mm:ss").isSameOrBefore(new Date()) ?
                        <section className="flex items-center justify-between py-2 px-4 rounded-full bg-tprimary-50">
                            <p className="text-sm text-white">Scheduled Post</p>
                            <p className="text-sm text-white">{`${moment(published).format("DD MMMM YYYY")} - ${moment(published).format("LT")}`}</p>
                        </section>
                        :
                        null
                }
            </main>
            <Modal
                show={postController.showImagePreview}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={postController.toggleModal}
                position='center'
                contentWidth='w-full'
            >
                <ImageModalView
                    file={src}
                    handleImageModal={postController.toggleModal}
                />
            </Modal>
            <Modal
                show={postController.openShare}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={postController.toggleShareModal}
                position='center'
                contentWidth='w-full md:w-fit'
            >
                <ShareModal
                    onClose={postController.toggleShareModal}
                    title={title}
                    comment={comment}
                    image={src}
                    id={id}
                />
            </Modal>

            <Modal
                show={postController.showBlockModal}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={postController.handleShowBlockModal}
                position='center'
                contentWidth='w-full sm:w-3/5 md:w-5/12 xl:w-3/12 '
            >
                <BlockPromptModal
                    handleBlockUser={postController.handleBlockUser}
                    isLoading={postController.isLoading}
                    handleShowBlockModal={postController.handleShowBlockModal}
                    user={!postController.anonymous ? author : 'Anonymous'}
                />
            </Modal>

            <Modal
                show={postController.openReport}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={postController.handleReportModal}
                position='center'
                contentWidth='w-full md:w-2/4'
            >
                <PostReportModal
                    onClose={postController.handleReportModal}
                    checkedValue={postController.checkedValue}
                    setCheckedValue={postController.setCheckedValue}
                    handleReport={postController?.handleReportPost}
                    isLoading={postController?.reportLoading}
                    confirmationModal={postController?.confirmationModal}
                    setConfirmationModal={postController?.setConfirmationModal}
                />
            </Modal>

            <Modal
                show={postController.openPromotionModal}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={postController.handlePromotionModal}
                position='center'
                contentWidth='w-full md:w-3/4 xl:w-2/5'
            >
                <PromotionModal
                    onClose={postController.handlePromotionModal}
                    postId={id}
                />
            </Modal>

            <Modal
                show={postController.openAnalytics}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={postController.handleAnalyticsModal}
                position='center'
                contentWidth='w-full md:w-3/4 xl:w-2/5'
            >
                <PostAnalyticsModal
                    onClose={postController.handleAnalyticsModal}
                    postId={id}
                />
            </Modal>

        </motion.div>
    )
}
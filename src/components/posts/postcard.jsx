import { Avatar } from "../global/avatar"
import { PostComment } from "./postcomment"
import { PostImage } from "./postimage"
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
import { NewNotificationIcon, TrashIcon } from '../../assets/icons/generated'
import { BlockPromptModal } from "../global/blockpromptmodal"
import { PostReportModal } from "./postreportmodal"
import { usePostController } from "../../controllers/postsController"
import TalkamLogo from "../../assets/icons/logo.svg"
import moment from "moment"
import * as Icon from 'react-feather'
import { Link } from "react-router-dom"

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
    handleDeletePost,
    parentCategory,
    group,
    home,
}) => {

    const postController = usePostController(isAnon, user, reaction, likes, polls, id);

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
                    <span
                        onClick={() => postController.navigate(`/userprofile/${user.id}`)}
                        className={`w-fit ${postController.anonymous ? "pointer-events-none" : "cursor-pointer"} `}
                    >
                        <Avatar size="xsm" src={!postController.anonymous ? avatar : null} />
                    </span>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className={`${side ? "text-xs" : "text-sm"} font-medium text-tblack-100 whitespace-nowrap`}>{parentCategory ? parentCategory?.name : category?.name}</span>
                            <span className={`${side ? "text-xs" : "text-sm"} font-medium text-tprimary-50 whitespace-nowrap`}>{moment(time).fromNow(true)}</span>
                        </div>
                        <span className="text-xs font-medium text-[#858585]">
                            Posted by {!postController.anonymous ? author : 'Anonymous'}
                            {
                                group && home ?
                                    <p className="items-center whitespace-nowrap inline-flex gap-1 pl-1">
                                        to{" "}
                                        <Link to={`/group/${group?.id}`} className="text-tprimary-50 cursor-pointer">
                                            {group?.name}
                                        </Link>
                                    </p>
                                    :
                                    null
                            }
                            {
                                category && home && !group ?
                                    <p className="items-center whitespace-nowrap inline-flex gap-1 pl-1">
                                        to{" "}
                                        <Link to={`/categories/${category?.id}`} className="text-tprimary-50 cursor-pointer">
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
                                    <li
                                        className="bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight"
                                    >
                                        <NewNotificationIcon className="w-4 h-4" />
                                        <p>Get notifications for this thread</p>
                                    </li>
                                    <li onClick={postController.handleShowBlockModal}
                                        className={`
                                        bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight
                                        ${(!postController.anonymous) ? "block" : 'hidden'}
                                        ${(!postController.isCurrentUser) ? "block" : 'hidden'}
                                    `}
                                    >
                                        <Icon.Slash size={15} color='#000000' strokeWidth={2} />
                                        <p>Block @{author}</p>
                                    </li>
                                    <li onClick={postController.handleReportModal}
                                        className="bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight"
                                    >
                                        <Icon.Flag size={15} color='#000000' strokeWidth={2} />
                                        <p>Report this post</p>
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
                                <PostImage
                                    onClick={postController.toggleModal}
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
                                        <span className="text-sm font-medium">
                                            {(postController.selectedPoll || postController.hasExpired) ? postController.pluralization : !postController.noOfDaysLeft ? 0 : postController.noOfDaysLeft + ' left'}
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
            </main>
            <Modal
                show={postController.showImagePreview}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={postController.toggleModal}
                position='center'
                contentWidth='w-full'
            >
                <div className="relative h-[90dvh] w-full">

                    <Icon.X
                        size={32}
                        onClick={postController.toggleModal}
                        className="bg-white p-2 rounded-full bg-opacity-30 cursor-pointer absolute top-0 right-0 m-5 border-2 border-[#ffffff80]"
                        color="#000000"
                        strokeWidth={4}
                    />

                    <div className="w-full h-full">
                        <img
                            src={image}
                            className="w-full h-full flex items-center justify-center bg-[#000]"
                            style={{
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: "cover",
                                objectFit: 'contain',
                                objectPosition: "center",
                                backgroundPosition: "center"
                            }}
                            onError={(e) => {
                                e.target.onerror = TalkamLogo;
                                e.target.src = TalkamLogo;
                            }}
                        />
                    </div>
                </div>
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
                    image={image}
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
                <PostReportModal onClose={postController.handleReportModal} />
            </Modal>
        </motion.div>
    )
}
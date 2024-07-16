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
import { usePostReactionMutation, useSelectPollOptionMutation } from "../../services/posts/postsApiSlice"
import { toast } from "sonner"
import { handleError } from "../../utils/handleError"
import { PostPollBar } from "./postpollbar"
import { PostPopup } from "./postpopup"
import { useOnOutsideClick } from "../../hooks/useOnOutsideClick"
import { Modal } from "../global/modal"
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
}) => {

    const anonymous = !!isAnon;
    const commentRef = useRef(null);
    const popUpRef = useRef()
    const [ showPopUp, setShowPopUp ] = useState(false)
    const [ action, setAction ] = useState(reaction && reaction?.action);
    const [ likeCount, setLikeCount ] = useState(likes);
    const [ showImagePreview, setShowImagePreview ] = useState(false)
    const [pollOptions, setPollOptions] = useState(polls);
    const [ selectedPoll, setSelectedPoll ] = useState(pollOptions && pollOptions.some(option => option.selected));

    const { isTruncated, isReadingMore, toggleIsShowingMore } = useTruncatedElement(commentRef);
    useOnOutsideClick(popUpRef, () => {
        setShowPopUp(false);
    });

    const [ postReaction ] = usePostReactionMutation();
    const [ selectPollOption ] = useSelectPollOptionMutation()

    const calculatePercentages = (options) => {
        const totalVotes = options.reduce((sum, option) => sum + option.count, 0);
        return options.map(option => ({
          ...option,
          percentage: totalVotes ? (option.count / totalVotes) * 100 : 0
        }));
    };

    const updatePollHandler = async(pollId) => {
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
        try {
            await selectPollOption({poll_id: pollId}).unwrap();
            toast.success("Vote submitted")
        } catch (error){
            const errorMessage = handleError(error);
            toast.error(errorMessage)
        }
        setSelectedPoll(true);
    }

    const handlePostReaction = async (reaction) => {
        // Check if the new reaction is the same as the current action
        if (reaction === action) {
            setAction(() => null);
            if((reaction === "Like") === (action === "Like")){
                setLikeCount( () => likeCount - 1 )
            }
        }
        // Update Optimistically for better UX
        if (reaction && reaction !== action) {
            setAction(() => reaction);
            if(reaction === "Like"){
                setLikeCount(() => likeCount + 1)
            } else if ( reaction === "Dislike" && action === "Like" ){
                setLikeCount(() => likeCount - 1)
            } else if (reaction === "Dislike"){
                setLikeCount(() => likeCount)
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
    const getPopUpItem = (item, id) => {
        // console.log(item, id)
    }
    const toggleModal = () => {
        setShowImagePreview((prev) => !prev)
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

                <section className="cursor-pointer">
                    <Icon.MoreVertical onClick={() => setShowPopUp(prev => !prev)} color="#212121" />
                    { 
                        showPopUp ? 
                        <motion.div
                            ref={popUpRef}
                            key="chatbox"
                            variants={PostCardVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                            className="absolute top-12 right-5 z-10"
                        >
                            <PostPopup
                                onClick={getPopUpItem}
                                author={author}
                            />
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
                                        pollOptions?.map((poll) => (
                                            <PostPollBar
                                                key={poll.id}
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
                        {tags && tags?.map((tag) => ( <PostTags side={side} key={tag} tag={tag} /> ))}
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
                    <PostShareButton />
                </footer>
            </main>
            <Modal
                show={showImagePreview}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={true}
                onClose={toggleModal}
                position='center'
                contentWidth='w-full md:w-2/4'
            >
                <img 
                    src={image}
                    className="w-full h-full flex items-center justify-center m-auto bg-[#444444]"
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
            </Modal>
        </motion.div>
    )
}
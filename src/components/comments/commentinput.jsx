import { useSelector } from "react-redux"
import { TrashIcon, UploadGifIcon, UploadImageIcon } from "../../assets/icons/generated"
import { downVariants, PostCardVariants } from "../../helpers/cardanimation"
import { Button } from "../forms/button"
import { Input } from "../forms/input"
import { AnonToggleButton } from "../global/anonymoustoggle"
import { Avatar } from "../global/avatar"
import { motion } from "framer-motion"
import { selectCurrentUser } from "../../services/authSlice"
import { useIsAuth } from "../../hooks/useIsAuth"
import { Link, useNavigate } from "react-router-dom"
import { ColoredLoader } from "../global/loader"
import { useRef, useState } from "react"
import { useGetTagSuggestionsQuery } from "../../services/posts/postsApiSlice"
import { useClickOutside } from "../../hooks/useClickOutside"
import { useMediaQuery } from "../../hooks/useMediaQuery"
import * as Icon from 'react-feather'
import EmojiPicker from "emoji-picker-react"

export const CommentInput = ({
    anonChecked,
    setAnonChecked,
    commentBody,
    setCommentBody,
    setImagePreview,
    imagePreview,
    onChange,
    // handleCommentChange,
    submitComment,
    image,
    setIsReplying,
    cancel,
    isValidComment,
    isLoading,
    imageLoading,
    error,
    user,
}) => {

    let isMonitor = useMediaQuery("(min-width: 768px)");
    const navigate = useNavigate();
    const currentUser = useSelector(selectCurrentUser);
    const isAuth = useIsAuth();
    const textareaRef = useRef();
    const reactionRef = useRef();

    const [plusPrompt, setPlusPrompt] = useState(false);
    const [mentionInput, setMentionInput] = useState("");
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [isMentioning, setIsMentioning] = useState(false);
    const [showReactions, setShowReactions] = useState(false);

    useClickOutside(reactionRef, () => {
        setShowReactions(false);
    });

    const { data: suggestions, isLoading: searchLoading } = useGetTagSuggestionsQuery(mentionInput);

    const handleAnonToggle = (event) => {
        if (!user) return;
        if (!user?.data?.active_subscription && user?.data?.anonymous_comment >= 5) {
            setPlusPrompt(true)
        } else {
            setAnonChecked(event.target.checked)
        }
    }

    const handleCommentChange = (e) => {
        const data = suggestions?.data || []
        const value = e.target.value;
        setCommentBody({ ...commentBody, comment: value });

        const lastAtIndex = value.lastIndexOf('@');
        if (lastAtIndex !== -1 && value.length > lastAtIndex + 1) {
            const mention = value.slice(lastAtIndex + 1);
            setMentionInput(mention);

            // Show suggested users based on the current mention input
            setSuggestedUsers(data);

            // Check if there are suggestions and update mentioning state
            if (suggestions && suggestions.data?.length > 0) {
                setIsMentioning(true);
            } else {
                // Close the suggestion box if there are no matches
                setIsMentioning(false);
            }
        } else {
            setMentionInput("");
            setSuggestedUsers([]);
            setIsMentioning(false);
        }
    };


    const handleUserSelect = (username) => {
        const newComment = commentBody.comment.replace(/@\w+$/, `@${username}`);
        setCommentBody({ ...commentBody, comment: newComment });
        setMentionInput("");
        setSuggestedUsers([]);
        setIsMentioning(false);
        textareaRef.current.focus();
    };

    // Function to render the comment with mentions as styled spans
    const renderCommentWithMentions = (text) => {
        const parts = text.split(/(@\w+)/g);
        return parts.map((part, index) => {
            if (part.startsWith('@')) {
                return `<span class='mention'>${part}</span>`;
            }
            return part;
        }).join('');
    };

    const handleTextareaScroll = () => {
        if (textareaRef.current) {
            document.getElementById("comment-overlay").scrollTop = textareaRef.current.scrollTop;
        }
    };


    const handleSubmit = () => {
        if (!isAuth) {
            navigate("/login", { replace: true })
        } else {
            submitComment();
        }
    }

    return (
        <>
            <div className={`w-full border border-tgray-50 ${(!anonChecked && !plusPrompt) ? "rounded-xl" : "rounded-tr-xl rounded-tl-xl"} p-3 flex flex-col sm:flex-row items-start justify-between gap-2`}>
                <section className="w-full flex items-start gap-2">
                    <div className="flex items-start justify-start">
                        <Avatar size="sm" src={currentUser?.avatar} />
                    </div>
                    <section className="relative w-full flex flex-col gap-1">
                        <div
                            id="comment-overlay"
                            className="absolute inset-0 whitespace-pre-wrap break-words text-xs text-tblack-100 p-3 pointer-events-none"
                            style={{
                                color: '#212121',
                                backgroundColor: 'transparent',
                                zIndex: 1,
                                overflowY: 'hidden',
                                border: "none"
                            }}
                            dangerouslySetInnerHTML={{ __html: renderCommentWithMentions(commentBody?.comment || "") }}
                        />

                        {/* Textarea */}
                        <textarea
                            ref={textareaRef}
                            rows={4}
                            className={`
                                ${error ? 'border border-error-100 focus:ring-error-100 focus:ring-opacity-10 focus:border focus:border-error-100' : 'focus:ring-0 focus:border-0'}
                                border border-tgray-50 placeholder:text-tgray-250
                                p-3 focus:outline-none w-full text-xs text-transparent caret-tblack-100 no-scrollbar
                            `}
                            style={{
                                zIndex: 2,
                                position: 'relative',
                                backgroundColor: 'transparent',
                                outline: 'none',
                                border: "none"
                            }}
                            placeholder="Leave a comment..."
                            value={commentBody?.comment}
                            onChange={handleCommentChange}
                            onScroll={handleTextareaScroll}
                        />

                        {/* Tagging suggestions */}

                        {isMentioning && !searchLoading && suggestedUsers.length > 0 ? (
                            <ul className="rounded-lg max-h-40 overflow-y-auto bg-white flex flex-col gap-1 shadow-sm border border-tgray-xlight">
                                {suggestedUsers.map((user, index) => (
                                    <li
                                        key={index}
                                        className="hover:bg-tprimary-100 text-tprimary-50 hover:text-white cursor-pointer flex flex-col gap-1 p-1"
                                        onClick={() => handleUserSelect(user.username)} // Adjust based on how user data is structured
                                    >
                                        <section className="flex items-center gap-2">
                                            <Avatar size="xs" src={user?.avatar} />
                                            <span className="text-xs">@{user.username}</span>
                                        </section>
                                    </li>
                                ))}
                            </ul>
                        ) : isMentioning && searchLoading ? (
                            <div className="flex justify-center p-2">
                                <ColoredLoader />
                                <span className="text-xs text-gray-500">Loading results...</span>
                            </div>
                        ) : null}

                        {/***************************************************** Image here ***********************************************/}
                        {
                            imagePreview ?
                                <section className="relative rounded-lg min-h-[170px] h-[250px]">
                                    {
                                        image ?
                                            <>
                                                <img
                                                    className="border-none h-full w-full rounded-lg"
                                                    src={image ?? null}
                                                    style={{
                                                        backgroundRepeat: 'no-repeat',
                                                        backgroundSize: "cover",
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                                <span className="w-full h-full bg-[#000000] bg-opacity-10 absolute top-0 flex items-center justify-center m-auto cursor-pointer rounded-md">
                                                    <span className="absolute top-2 right-2 text-white bg-white p-2 rounded-full" onClick={() => {
                                                        setCommentBody({ ...commentBody, image: null })
                                                        setImagePreview(() => null)
                                                    }}>
                                                        <TrashIcon className="" style={{ paddingLeft: '2px', color: "#FF0000" }} />
                                                    </span>
                                                </span>
                                            </>
                                            :
                                            null
                                    }
                                    {
                                        imageLoading ?
                                            <div
                                                style={{
                                                    backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%),url(${imagePreview})`,
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundSize: 'cover',
                                                    objectFit: "contain",
                                                }}
                                                className="w-full h-full bg-gradient-to-b from-[#a99daa45] to-[#eee6ef1e] absolute flex items-center justify-center m-auto pointer-events-none rounded-md">
                                                <ColoredLoader />
                                            </div>
                                            : null
                                    }
                                </section>
                                :
                                null
                        }
                        <div className="flex items-center gap-3">
                            <label
                                className="cursor-pointer">
                                <Input
                                    className='hidden'
                                    type='file'
                                    name="img"
                                    id="img"
                                    accept='image/*'
                                    onChange={onChange}
                                />
                                <Icon.Image color="#2121219C" />
                            </label>
                            <div
                                ref={reactionRef}
                                className="z-10 relative cursor-pointer" onClick={() => setShowReactions(prev => !prev)}>
                                {/* <UploadGifIcon /> */}
                                <Icon.Smile color="#2121219C" />
                                {
                                    showReactions ?
                                        <motion.section
                                            key="chatbox"
                                            variants={PostCardVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                                            className="absolute -left-32 -top-14"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <EmojiPicker
                                                onEmojiClick={(emojiObject) => {
                                                    // here i append the selected emoji to the current comment body and return focus to the text field
                                                    setCommentBody((prev) => ({
                                                        ...prev,
                                                        comment: prev.comment + emojiObject.emoji,
                                                    }));
                                                    textareaRef.current.focus();
                                                }}
                                                width={!isMonitor ? "300px" : "400px"}
                                                reactionsDefaultOpen={true}
                                                allowExpandReactions={true}
                                            />
                                        </motion.section>
                                        :
                                        null
                                }
                            </div>

                            <div className="flex items-center gap-2">
                                <AnonToggleButton checked={anonChecked} onChange={(event) => handleAnonToggle(event)} />
                                {!user?.data?.active_subscription ? <span className="text-xs text-tgray-250 ">{user?.data?.anonymous_post}/5</span> : null}
                            </div>
                        </div>
                    </section>
                </section>

                <section className=" flex items-center gap-2 self-end">
                    {cancel ?
                        <Button
                            type="button"
                            variant="link"
                            children="Cancel"
                            className="!rounded-full !py-2 !px-3 self-end font-bold !text-error-500"
                            onClick={() => setIsReplying(() => false)}
                        />
                        :
                        null
                    }
                    <Button
                        children="Comment"
                        className="!rounded-full !py-2 !px-3"
                        onClick={handleSubmit}
                        disabled={!isValidComment || isLoading || !isAuth}
                    // isLoading={isLoading}
                    />
                </section>
            </div>
            {
                anonChecked &&
                <motion.p
                    key="chatbox"
                    variants={downVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    className="bg-[#FDD78D] text-xs font-semibold rounded-bl-xl rounded-br-xl p-2 flex items-center justify-center text-center">
                    You&apos;re posting anonymously. Your profile won&apos;t be shown.
                </motion.p>
            }
            {
                plusPrompt ?
                    <motion.div
                        key="chatbox"
                        variants={downVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        className="bg-gradient-to-r from-[#D1F2F7] via-[#FDFFFF] to-[#D1F2F7] text-[10px] font-semibold sm:rounded-bl-xl sm:rounded-br-xl p-2 flex items-center justify-center text-center"
                    >
                        <p>
                            You have used up your 5 free anonymous post, to post anonymously without limit, {" "} <Link to="/pricing" className="text-tprimary-50 pl-.5 underline underline-offset-2 inline">upgrade to TalkAM plus today</Link>
                        </p>
                    </motion.div>
                    :
                    null
            }
            <style jsx>{`
                .mention {
                    color: blue;
                    cursor: pointer;
                }
            `}</style>
        </>
    )
}
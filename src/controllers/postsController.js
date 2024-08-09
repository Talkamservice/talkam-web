import { useSelector } from "react-redux";
import { selectCurrentUser } from "../services/authSlice";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useTruncatedElement } from "../hooks/useTruncated";
import { useOnOutsideClick } from "../hooks/useOnOutsideClick";
import { useBlockUserMutation, usePostReactionMutation, useSelectPollOptionMutation } from "../services/posts/postsApiSlice";
import { toast } from "sonner";
import { handleError } from "../utils/handleError";

export const usePostController = (isAnon, user, reaction, likes, polls, id) => {

    let noOfDaysLeft = 0
    let totalVoteCount = 0
    let hasExpired = false
    let pluralization;

    const anonymous = !!isAnon;
    const currentUser = useSelector(selectCurrentUser);
    const isCurrentUser = currentUser && currentUser?.id === user?.id;
    const navigate = useNavigate();
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


    return {
        noOfDaysLeft,
        totalVoteCount,
        hasExpired,
        pluralization,
        anonymous,
        currentUser,
        isCurrentUser,
        navigate,
        commentRef,
        popUpRef,
        showPopUp,
        setShowPopUp,
        openShare,
        setOpenShare,
        showBlockModal,
        setShowBlockModal,
        openReport,
        setOpenReport,
        action,
        setAction,
        likeCount,
        setLikeCount,
        showImagePreview,
        setShowImagePreview,
        pollOptions,
        setPollOptions,
        selectedPoll,
        setSelectedPoll,
        isTruncated,
        isReadingMore,
        toggleIsShowingMore,
        updatePollHandler,
        handlePostReaction,
        handleBlockUser,
        copyTextToClipboard,
        toggleModal,
        toggleShareModal,
        handleShowBlockModal,
        handleReportModal,
        isLoading,
    }
}
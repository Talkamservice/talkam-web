import { useState } from "react";
import { toast } from "sonner";
import { handleError } from "../utils/handleError";
import { useReportCommentMutation } from "../services/posts/postsApiSlice";

export const useReportCommentController = (postId, commentId) => {
    const [confirmationModal, setConfirmationModal] = useState();
    const [checkedValue, setCheckedValue] = useState("");

    const [reportPost, { isLoading: reportLoading }] = useReportCommentMutation();

    const handleReportPost = async () => {
        try {
            const reportDetails = {
                reason: checkedValue,
                post_id: postId,
                comment_id: commentId
            }
            const res = await reportPost(reportDetails).unwrap();
            toast.success(res?.message);
            setConfirmationModal(true)
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage);
        }
    };

    return {
        confirmationModal,
        setConfirmationModal,
        checkedValue,
        setCheckedValue,
        handleReportPost,
        reportLoading
    }
}
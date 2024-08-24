import { toast } from "sonner";
import { Button } from "../../../../../components/forms/button";
import { useUpdateMemberRequestsMutation } from "../../../../../services/groupApiSlice";
import { handleError } from "../../../../../utils/handleError";
import { useParams } from "react-router-dom";

export const RejectRequestModal = ({ memberId, onClose }) => {

    const { groupId } = useParams();
    const [updateMemberRequests, { isLoading: updateLoading }] = useUpdateMemberRequestsMutation();

    const handleRequests = async () => {
        try {
            const requestDetails = {
                member_id: memberId,
                action: "Declined"
            }
            const res = await updateMemberRequests({ id: groupId, body: { ...requestDetails } }).unwrap();
            toast.success(res?.message);
            onClose();
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage);
        }
    };

    return (
        <main className="flex flex-col gap-4 p-6">
            <header className="w-full flex flex-col items-center justify-center gap-3">
                <h2 className="font-bold text-lg">Reject Request</h2>
                <p className="text-xs text-tgray-250 text-center">This request would be removed and canot be undone.</p>
            </header>

            <section className="flex flex-col gap-2">
                <Button
                    onClick={handleRequests}
                    isLoading={updateLoading}
                    disabled={updateLoading}
                    className="!rounded-full"
                    children="Reject"
                    variant="error"
                    fullWidth
                />
                <Button
                    className="!rounded-full"
                    children="Cancel"
                    variant="outline"
                    fullWidth
                    onClick={onClose}
                />
            </section>
        </main>
    )
}
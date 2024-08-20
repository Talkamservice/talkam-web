import { toast } from "sonner";
import { Button } from "../../../../../components/forms/button"
import { useDeleteGuidelineMutation } from "../../../../../services/groupApiSlice";
import { handleError } from "../../../../../utils/handleError";

export const DeletePromptModal = ({ ruleId, onClose }) => {

    const [deleteGuideline, { isLoading: deleteLoading }] = useDeleteGuidelineMutation();

    const handleDeleteGuideline = async () => {
        try {
            const res = await deleteGuideline(ruleId).unwrap()
            toast.success(res?.message);
            onClose();
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage)
        }
        onClose();
    }

    return (
        <main className="flex flex-col gap-4 p-6">
            <header className="w-full flex flex-col items-center justify-center gap-3">
                <h2 className="font-bold text-lg">Delete Rule</h2>
                <p className="text-xs text-tgray-250 text-center">This rule would be deleted permanently. </p>
            </header>

            <section className="flex flex-col gap-2">
                <Button
                    onClick={handleDeleteGuideline}
                    isLoading={deleteLoading}
                    disabled={deleteLoading}
                    className="!rounded-full"
                    children="Delete Rule"
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
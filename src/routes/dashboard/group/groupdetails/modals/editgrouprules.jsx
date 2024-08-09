import { useCallback, useState } from "react"
import { Button } from "../../../../../components/forms/button"
import { TextArea } from "../../../../../components/forms/textarea"
import { handleError } from "../../../../../utils/handleError"
import { toast } from "sonner"
import { useAddGuidelinesMutation, useUpdateGuidelinesMutation } from "../../../../../services/groupApiSlice"
import { useParams } from "react-router-dom"

export const EditGroupRules = ({ onClose }) => {

    let isRuleValid = false
    const { groupId } = useParams();
    const [ details, setDetails ] = useState({
        title: "",
        description: "",
    });

    const setFormattedDetailsContent = useCallback(
        (text, name, limit) => {
        setDetails({...details, [name]: text?.slice(0, limit)});
        },
        [details, setDetails]
    );
    const [ addGuidelines, { isLoading } ] = useAddGuidelinesMutation();

    const handleUpdateGroupDetails = async (event) => {
        event.preventDefault();
        try {
            const body = {
                group_id: groupId,
                title: details?.title,
                description: details?.description
            }
            const res = await addGuidelines(body).unwrap()
            toast.success(res?.message);
            onClose();
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage)
        }
    }
    if(details.title && details.description){
        isRuleValid = true
    }

    return (
        <main className="w-full flex flex-col gap-4 p-6 md:p-8">
            <header className="w-full flex items-start border-b border-tgray-50 ">
                <h4 className="text-lg font-boldNunito">Add Group Rule</h4>
            </header>

            <form id="update" onSubmit={handleUpdateGroupDetails}  className="flex flex-col gap-5">
                <TextArea
                    label="Name"
                    placeholder="Enter rule"
                    rounded="rounded-lg"
                    value={details.title}
                    onChange={(event) => setFormattedDetailsContent(event.target.value, 'title', 50)}
                    limit={80}
                    limitPosition="top"
                    rows={1}
                    required
                />

                <TextArea
                    label="Description"
                    type="text"
                    rounded="rounded-lg"
                    placeholder = 'A short description of your rule'
                    value={details.description}
                    onChange={(event) => setFormattedDetailsContent(event.target.value, 'description', 100)}
                    rows={4}
                    limit={100}
                    limitPosition="bottom"
                    required
                />
            </form>

            <footer className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
                <Button
                    children="Cancel"
                    variant="outline"
                    className="!border-error-500 !text-error-500"
                    fullWidth
                    onClick={onClose}
                />

                <Button
                    form="update"
                    children="Save"
                    className="!bg-[#272727] disabled:!bg-opacity-50"
                    fullWidth
                    disabled={!isRuleValid || isLoading}
                    isLoading={isLoading}
                />
            </footer>
        </main>
    )
}
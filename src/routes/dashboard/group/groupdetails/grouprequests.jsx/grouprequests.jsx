import { X } from "react-feather"
import { useGetGroupRequestsQuery, useUpdateMemberRequestsMutation } from "../../../../../services/groupApiSlice";
import { useParams } from "react-router-dom";
import { GroupRequestCard } from "../../../../../components/global/grouprequestcard";
import { GroupSkeletonLoader } from "../../../../../components/global/skeletons";
import { EmptyState } from "../../../../../components/global/emptystate";
import { handleError } from "../../../../../utils/handleError";
import { toast } from "sonner";
import { Modal } from "../../../../../components/global/modal";
import { RejectRequestModal } from "../modals/rejectRequestPrompt";
import { useState } from "react";
import EmptyListIcon from "../../../../../assets/images/emptylist.png"

export const GroupRequests = ({ setMemberView }) => {

    const { groupId } = useParams();
    const [showPrompt, setShowPrompt] = useState();
    const [memberId, setMemberId] = useState(null);
    const { data: requestMembers, isLoading } = useGetGroupRequestsQuery(groupId);
    const [updateMemberRequests, { isLoading: updateLoading }] = useUpdateMemberRequestsMutation();

    const handleRequests = async (memberId, action) => {
        try {
            const requestDetails = {
                member_id: memberId,
                action: action
            }
            const res = await updateMemberRequests({ ...requestDetails }).unwrap();
            toast.success(res?.message)
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage);
        }
    };

    const togglePrompt = (id) => {
        setMemberId(() => id)
        setShowPrompt((prev) => !prev)
    }

    return (
        <div className="flex flex-col gap-4">
            <header className="flex items-center gap-1">
                <X className="cursor-pointer" onClick={() => setMemberView("members")} />
                <p className="text-base font-bold">Requests</p>
            </header>

            <section>
                {
                    isLoading ?
                        <GroupSkeletonLoader num={5} button={false} />
                        :
                        !requestMembers?.data?.data.length ?
                            <section className="w-full py-1">
                                <EmptyState
                                    icon={EmptyListIcon}
                                    height="h-[30px]"
                                    width="h-[30px]"
                                    text="No requests"
                                    subtext="When requests are made they would appear here"
                                />
                            </section>
                            :
                            requestMembers?.data?.data?.map((member) => (
                                <GroupRequestCard
                                    key={member?.id}
                                    avatar={member?.avatar}
                                    user={member?.username}
                                    onApprove={() => handleRequests(member.id, "Approved")}
                                    onDecline={() => togglePrompt(member?.id)}
                                    isLoading={updateLoading}
                                />
                            ))
                }
            </section>

            <Modal
                show={showPrompt}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={togglePrompt}
                position='center'
                contentWidth='w-full sm:w-3/5 md:w-5/12 xl:w-3/12 '
            >
                <RejectRequestModal
                    memberId={memberId}
                    onClose={() => setShowPrompt(false)}
                />
            </Modal>
        </div>
    )
}
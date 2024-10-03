import { useState } from "react"
import { Link } from "react-router-dom"
import { NoteIcon, TrashIcon, UploadAvatarIcon } from "../../../../assets/icons/generated"
import { ListSkeleton } from "../../../../components/global/skeletons"
import { EmptyState } from "../../../../components/global/emptystate"
import { IsRole } from "../../../../utils/isRole"
import { Modal } from "../../../../components/global/modal"
import { EditGroupRules } from "./modals/editgrouprules"
import { DeletePromptModal } from "./modals/deleteruleprompt"
import EmptyListIcon from "../../../../assets/images/emptylist.png"

export const GroupRules = ({ groupDetails, isLoading }) => {

    const [showRuleModal, setShowRuleModal] = useState();
    const [showPrompt, setShowPrompt] = useState();
    const [ruleId, setRuleId] = useState();

    const toggleRuleModal = () => {
        setShowRuleModal((prev) => !prev)
    }
    const togglePrompt = (id) => {
        setRuleId(() => id)
        setShowPrompt((prev) => !prev)
    }

    return (
        <div className="w-full flex flex-col gap-4">
            <header className="flex items-center justify-between gap-4">

                <div className="w-full flex items-center gap-2">
                    <NoteIcon />
                    <p className="text-base font-bold">Group Rules</p>
                </div>

                <IsRole currentRole={groupDetails?.data?.user_role ?? "Member"} allowedRoles={["Owner", "Admin"]}>
                    <div onClick={toggleRuleModal} className='cursor-pointer border border-tgray-50 rounded-full px-3 py-1 flex items-center justify-between gap-2'>
                        <UploadAvatarIcon />
                        <span className='text-tblack-100 text-sm'>Add</span>
                    </div>
                </IsRole>
            </header>

            <section className="w-full h-full flex flex-col gap-4">
                <header className="flex flex-col gap-4">
                    <article className="text-sm font-normal ">
                        Rules unique to this group and enforced by the moderators.
                        <Link to={"/help&info/rules"} className="font-bold text-sm text-tprimary-50">TalkAM guidelines and rules</Link> still apply in addition to these.
                    </article>

                    <p className="text-sm font-normal">{groupDetails?.data.description}</p>
                </header>

                <ul className="flex flex-col gap-2">
                    {
                        isLoading ?
                            <ListSkeleton />
                            :
                            !groupDetails?.data?.guidelines.length ?
                                <section className="w-full py-4">
                                    <EmptyState
                                        icon={EmptyListIcon}
                                        height="h-[50px]"
                                        width="h-[50px]"
                                        text="No Rules"
                                        subtext="When rules are added to the group they would appear here"
                                    />
                                </section>
                                :
                                groupDetails?.data?.guidelines.map((rule, index) => (
                                    <div key={rule.id} className="w-full flex items-start gap-3 border-b border-tgray-50 py-2">
                                        <span className="flex items-center justify-center w-3 h-3 p-3 border border-tgray-50 rounded-full text-sm font-boldNunito">
                                            {index + 1}
                                        </span>

                                        <section className="w-full flex flex-col gap-3">
                                            <header className="w-full flex items-center justify-between gap-4">
                                                <h2 className="text-sm font-bold !text-wrap !whitespace-pre-line !break-word">{rule.title}</h2>
                                                <IsRole currentRole={groupDetails?.data?.user_role ?? "Member"} allowedRoles={["Owner", "Admin"]}>
                                                    <span className="cursor-pointer" onClick={() => togglePrompt(rule?.id)}>
                                                        <TrashIcon style={{ color: "#F95555" }} />
                                                    </span>
                                                </IsRole>
                                            </header>
                                            <article className="w-full overflow-hidden text-sm font-normal !text-wrap !whitespace-pre-line !break-words">
                                                {rule.description}
                                            </article>
                                        </section>
                                    </div>
                                ))
                    }
                </ul>
            </section>
            <Modal
                show={showRuleModal}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={toggleRuleModal}
                position='center'
                contentWidth='w-full md:w-3/5'
            >
                <EditGroupRules
                    onClose={toggleRuleModal}
                />
            </Modal>

            <Modal
                show={showPrompt}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={togglePrompt}
                position='center'
                contentWidth='w-full sm:w-3/5 md:w-5/12 xl:w-3/12 '
            >
                <DeletePromptModal
                    ruleId={ruleId}
                    onClose={() => setShowPrompt(false)}
                />
            </Modal>
        </div>
    )
}
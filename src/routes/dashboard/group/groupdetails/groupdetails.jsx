import { Tabs } from "../../../../components/global/tabs";
import { GroupAbout } from "./groupabout";
import { GroupMembers } from "./groupmembers";
import { GroupRules } from "./grouprules";
import { UploadAvatarIcon } from "../../../../assets/icons/generated";
import { ColoredLoader } from "../../../../components/global/loader";
import { Modal } from "../../../../components/global/modal";
import { EditGroupHeader } from "./modals/editgroupheader";
import { useState } from "react";
import { IsRole } from "../../../../utils/isRole";
import FallBack from '../../../../assets/icons/groupicon.svg'

export const GroupDetails = ({ groupDetails, currentUserRole, isLoading }) => {

    const tabs = [
        {
            id: 0,
            title: "Rules",
            component: <GroupRules groupDetails={groupDetails} isLoading={isLoading} />
        },
        {
            id: 1,
            title: "Members",
            component:  <GroupMembers currentUserRole={currentUserRole} />
        },
        {
            id: 2,
            title: "About",
            component: <GroupAbout groupDetails={groupDetails} isLoading={isLoading} />
        },
    ];

    const [ showEditHeaderModal, setShowEditHeaderMdal ] = useState();

    const toggleHeaderModal = () => {
        setShowEditHeaderMdal((prev) => !prev)
    }

    return (
        <div className="w-full flex flex-col h-full">
            {
                isLoading ?
                <section className="w-full flex items-center justify-center py-4">
                    <ColoredLoader />
                </section>
                :
                <section className="w-full flex flex-col gap-4">
                    <header className="flex items-start justify-between gap-4">
                        <section className="flex items-center gap-2">
                            <img
                                style={{
                                    backgroundSize: "cover",
                                    backgroundRepeat: "no-repeat",
                                    objectFit: "cover",
                                }}
                                src={groupDetails?.data.image ?? FallBack}
                                className="rounded-full w-12 h-12"
                                onError={(e) => {
                                    e.target.onerror = FallBack;
                                    e.target.src = FallBack
                                }}
                            />
                            <div className="flex flex-col items-start">
                                <p className="font-medium text-base">{groupDetails?.data.name}</p>
                                <span className="text-sm font-bold">{groupDetails?.data.total_members} members</span>
                            </div>
                        </section>

                        <IsRole currentRole={currentUserRole} allowedRoles={[ "Owner", "Admin" ]}>
                            <div onClick={toggleHeaderModal} className='cursor-pointer border border-tgray-50 rounded-full px-3 py-1 flex items-center justify-between gap-2'>
                                <UploadAvatarIcon />
                                <span className='text-tblack-100 text-sm'>Edit</span>
                            </div>
                        </IsRole>
                    </header>

                    <article className="text-sm">{groupDetails?.data.about}</article>
                </section>
            }

            <section className="relative overflow-y-auto w-full h-full no-scrollbar">
                <Tabs tabs={tabs} />
            </section>

            <Modal
                show={showEditHeaderModal}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={toggleHeaderModal}
                position='center'
                contentWidth='w-full md:w-3/5'
            >
                <EditGroupHeader
                    groupId={groupDetails?.data?.id}
                    onClose={toggleHeaderModal}
                />
            </Modal>
        </div>
    )
}
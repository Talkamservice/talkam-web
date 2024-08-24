import { useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDeleteMemberMutation, useGetGroupMembersQuery, useMakeModeratorMutation, useRemoveModeratorMutation } from "../../../../../services/groupApiSlice"
import { Avatar } from "../../../../../components/global/avatar";
import { motion } from "framer-motion";
import { PostCardVariants } from "../../../../../helpers/cardanimation";
import { useOnOutsideClick } from "../../../../../hooks/useOnOutsideClick";
import { ChatSquareIcon, SingleUserIcon } from "../../../../../assets/icons/generated";
import { GroupSkeletonLoader } from "../../../../../components/global/skeletons";
import { IsRole } from "../../../../../utils/isRole";
import { EmptyState } from "../../../../../components/global/emptystate";
import { handleError } from "../../../../../utils/handleError";
import { toast } from "sonner";
import EmptyListIcon from "../../../../../assets/images/emptylist.png"
import * as Icon from 'react-feather'
import moment from "moment";

export const Members = ({ currentUserRole, setMemberView, requestCount }) => {

    const { groupId } = useParams();
    const { data: groupMembers, isLoading } = useGetGroupMembersQuery({
        id: groupId,
        status: ""
    });
    const [makeModerator, { isLoading: makeModeratorLoading }] = useMakeModeratorMutation();
    const [removeModerator, { isLoading: removeModeratorLoading }] = useRemoveModeratorMutation();
    const [deleteMember, { isLoading: deleteLoading }] = useDeleteMemberMutation();

    const handleMakeModerator = async (memberId) => {

        const body = {
            role: "Admin"
        }
        try {
            const res = await makeModerator({ id: memberId, body: body }).unwrap()
            toast.success(res?.message)
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage);
        }
    }

    const handleRemoveModerator = async (memberId) => {
        const body = {
            role: "Member"
        }
        try {
            const res = await removeModerator({ id: memberId, body }).unwrap()
            toast.success(res?.message)
        } catch (error) {
            const errorMessage = handleError(errorMessage);
            toast.error(errorMessage);
        }
    }

    const handleDeleteMember = async (memberId) => {
        try {
            const res = await deleteMember(memberId).unwrap()
            toast.success(res?.message)
        } catch (error) {
            const errorMessage = handleError(errorMessage);
            toast.error(errorMessage);
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <section className="flex flex-col gap-3">
                <p className="font-boldNunito text-base">Administrator/Creator</p>
                {
                    isLoading ?
                        <GroupSkeletonLoader num={1} button={false} />
                        :
                        !groupMembers?.data.Owner.length ?
                            <section className="w-full py-1">
                                <EmptyState
                                    icon={EmptyListIcon}
                                    height="h-[30px]"
                                    width="h-[30px]"
                                    text="No Admin"
                                    subtext="When an admin is added to the group they would appear here"
                                />
                            </section>
                            :
                            <MemberListCard
                                avatar={groupMembers?.data?.Owner[0]?.user?.avatar}
                                joined={groupMembers?.data?.Owner[0]?.created_at}
                                user={groupMembers?.data?.Owner[0]?.user?.username || groupMembers?.data?.Owner[0]?.user?.name}
                                currentUserRole={currentUserRole}
                                poppostion={"top-0"}
                                handleDeleteMember={() => handleDeleteMember(groupMembers?.data?.Owner[0]?.id)}
                                handleRemoveModerator={() => handleRemoveModerator(groupMembers?.data?.Owner[0]?.id)}
                                userId={groupMembers?.data?.Owner[0]?.user?.id}
                                role={groupMembers?.data?.Owner[0]?.role}
                            />
                }
            </section>
            <section className="flex flex-col gap-3">
                <header className="flex items-center gap-2">
                    <p className="font-boldNunito text-base">Moderators</p>
                    <span className="flex items-center justify-center p-3 text-white text-xs rounded-full bg-tprimary-50 h-4 w-4">{groupMembers?.data?.Admin.length}</span>
                </header>
                {
                    isLoading ?
                        <GroupSkeletonLoader num={2} button={false} />
                        :
                        !groupMembers?.data?.Admin.length ?
                            <section className="w-full py-1">
                                <EmptyState
                                    icon={EmptyListIcon}
                                    height="h-[30px]"
                                    width="h-[30px]"
                                    text="No Moderators"
                                    subtext="When moderators are added to the group they would appear here"
                                />
                            </section>
                            :
                            groupMembers?.data?.Admin?.map((admin) => (
                                <MemberListCard
                                    key={admin?.user?.id}
                                    avatar={admin?.user?.avatar}
                                    joined={admin?.created_at}
                                    user={admin?.user?.username || admin?.user?.name}
                                    currentUserRole={currentUserRole}
                                    poppostion={"bottom-0"}
                                    handleDeleteMember={() => handleDeleteMember(admin?.id)}
                                    handleRemoveModerator={() => handleRemoveModerator(admin?.id)}
                                    userId={admin?.user?.id}
                                    role={admin?.role}
                                />
                            ))
                }
            </section>
            <section className="flex flex-col gap-3">
                <header className="w-full flex items-center justify-between gap-2">
                    <div className="flex-nowrap flex items-center gap-2 flex-1">
                        <p className="font-boldNunito text-base">All Members</p>
                        <span className="flex items-center justify-center p-3 text-white text-xs rounded-full bg-tprimary-50 h-4 w-4">{groupMembers?.data?.Member.length}</span>
                    </div>
                    {
                        groupMembers?.data?.Member.length > 15 ?
                            <p className="items-center gap-1 flex justify-center cursor-pointer">
                                <span onClick={() => setMemberView("allmembers")} className="text-sm font-semibold">View all</span>
                                <Icon.ChevronRight size={15} />
                            </p>
                            :
                            null
                    }
                </header>
                {
                    requestCount ?
                        <IsRole currentRole={currentUserRole} allowedRoles={["Owner", "Admin"]}>
                            <div onClick={() => setMemberView("requests")} className="py-3 px-4 bg-tprimary-50 flex justify-between gap-4 items-center text-twhite-100 text-sm rounded-lg cursor-pointer">
                                <span className="font-semiboldNunito">New Requests</span>
                                <span className="font-semiboldNunito text-xs">{requestCount}</span>
                            </div>
                        </IsRole>
                        :
                        null
                }
                {
                    isLoading ?
                        <GroupSkeletonLoader num={2} button={false} />
                        :
                        !groupMembers?.data?.Member.length ?
                            <section className="w-full py-1">
                                <EmptyState
                                    icon={EmptyListIcon}
                                    height="h-[30px]"
                                    width="h-[30px]"
                                    text="No Members"
                                    subtext="When members are added or join the group they would appear here"
                                />
                            </section>
                            :
                            groupMembers?.data?.Member?.map((member) => (
                                <MemberListCard
                                    key={member?.user?.id}
                                    avatar={member?.user?.avatar}
                                    joined={member?.created_at}
                                    user={member?.user?.username || member?.user?.name}
                                    currentUserRole={currentUserRole}
                                    poppostion={"bottom-0"}
                                    handleDeleteMember={() => handleDeleteMember(member?.id)}
                                    handleMakeModerator={() => handleMakeModerator(member?.id)}
                                    userId={member?.user?.id}
                                    role={member?.role}
                                />
                            ))
                }
            </section>
        </div>
    )
}

export const MemberListCard = ({ avatar, user, role, currentUserRole, joined, poppostion, handleDeleteMember, handleMakeModerator, handleRemoveModerator, userId }) => {

    const navigate = useNavigate();
    const location = useLocation();
    const popUpRef = useRef();
    const [showPopUp, setShowPopUp] = useState();
    useOnOutsideClick(popUpRef, () => {
        setShowPopUp(false);
    });

    const handleTogglePopup = () => {
        setShowPopUp((prev) => !prev)
    }

    return (
        <div className="w-full flex items-center justify-between gap-4 h-full relative">
            <section className="flex items-center gap-2">
                <Avatar src={avatar} size="sm" />
                <div className="flex flex-col">
                    <p className="text-base font-medium">{user}</p>
                    <span className="text-xs font-semibold text-[#787878]">Member since {moment(joined).format("MMMM YYYY") ?? ' --/--/--'}</span>
                </div>
            </section>

            <section ref={popUpRef} className="cursor-pointer">
                <Icon.MoreVertical onClick={handleTogglePopup} color="#212121" />
                {
                    showPopUp ?
                        <motion.div
                            variants={PostCardVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                            className={`absolute ${poppostion} right-5 z-40`}
                        >
                            <ul className="w-full bg-white flex flex-col items-start divide-y divide-tgray-50 border border-tgray-50 overflow-hidden rounded-xl">
                                <li
                                    onClick={() => navigate(`/userprofile/${userId}`)}
                                    className="bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight whitespace-nowrap"
                                >
                                    <SingleUserIcon className='w-4 h-4 font-light' size={15} />
                                    <p>View Profile</p>
                                </li>
                                <li
                                    className="bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight whitespace-nowrap"
                                    onClick={() => {
                                        navigate({
                                            pathname: `${location.pathname}`,
                                            search: `?messages=true`,
                                        }, { state: userId });
                                    }}
                                >
                                    <ChatSquareIcon className="w-4 h-4" />
                                    <p>Send Message</p>
                                </li>

                                {
                                    role === "Member" || role === "Admin" && role !== "Owner" ?
                                        <IsRole currentRole={currentUserRole} allowedRoles={["Owner", "Admin"]}>
                                            <li onClick={handleDeleteMember} className={`bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight whitespace-nowrap`}>
                                                <Icon.Slash size={15} />
                                                <p>Remove {user}</p>
                                            </li>
                                        </IsRole>
                                        :
                                        null
                                }
                                {
                                    role === "Admin" ?
                                        <IsRole currentRole={currentUserRole} allowedRoles={["Owner", "Admin"]}>
                                            <li onClick={handleRemoveModerator} className={`bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight whitespace-nowrap`}>
                                                <Icon.UserMinus size={18} className="text-[#AC4242]" />
                                                <p>Remove as Moderator</p>
                                            </li>
                                        </IsRole>
                                        :
                                        null
                                }
                                {
                                    role !== "Admin" && role !== "Owner" ?
                                        <IsRole currentRole={currentUserRole} allowedRoles={["Owner", "Admin"]}>
                                            <li onClick={handleMakeModerator} className={`bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight whitespace-nowrap`}>
                                                <Icon.UserPlus size={18} className="" />
                                                <p>Add as Moderator</p>
                                            </li>
                                        </IsRole>
                                        :
                                        null
                                }
                            </ul>
                        </motion.div>
                        :
                        null
                }
            </section>
        </div>
    )
}
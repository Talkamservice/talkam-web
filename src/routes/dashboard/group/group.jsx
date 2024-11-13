import { useNavigate, useParams } from "react-router-dom";
import { AnalyticsIcon, FeaturedFireIcon, LatestEventsIcon, LockIcon, NewBadgeIcon, TrendingIcon, UploadAvatarIcon } from "../../../assets/icons/generated";
import { RouteTabs } from "../../../components/global/routetabs"
import { useFollowGroupMutation, useGetGroupDetailsQuery, useRequestFollowMutation, useUnFollowGroupMutation } from "../../../services/groupApiSlice";
import { Banner } from "../../../components/global/groupbanner";
import { BannerSkeletons, ButtonSkeletonLoader } from "../../../components/global/skeletons";
import { GroupDetails } from "./groupdetails/groupdetails";
import { Button } from "../../../components/forms/button";
import { handleError } from "../../../utils/handleError";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../services/authSlice";
import { IsRole } from "../../../utils/isRole";
import { Modal } from "../../../components/global/modal";
import { useRef, useState } from "react";
import { ColoredLoader } from "../../../components/global/loader";
import { EditGroupHeader } from "./groupdetails/modals/editgroupheader";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { motion } from "framer-motion";
import { PostCardVariants } from "../../../helpers/cardanimation";
import { useOnOutsideClick } from "../../../hooks/useOnOutsideClick";
import { useGroupController } from "../../../controllers/groupController";
import { GroupReportModal } from "./groupreportmodal";
import { IsSuspended } from "../../../utils/isSuspended";
import { PromotionModal } from "../userprofile/promotion/promotion";
import * as Icon from 'react-feather'
import FallBack from "../../../assets/icons/users.svg"
import Protected from "../../../utils/protected";
import { PostAnalyticsModal } from "../../../components/posts/postanalyticsmodal";

const tabs = [
    {
        id: 0,
        title: "Just In",
        text: "new",
        icon: <NewBadgeIcon />
    },
    {
        id: 1,
        title: "Featured",
        text: "featured",
        icon: <FeaturedFireIcon />
    },
    {
        id: 2,
        title: "Trending",
        text: "trending",
        icon: <TrendingIcon />
    },
];

export const Group = () => {

    let isMobile = useMediaQuery("(max-width: 768px)");
    const popUpRef = useRef();
    const navigate = useNavigate();
    const currentUser = useSelector(selectCurrentUser);
    const { groupId } = useParams();
    const [showEditHeaderModal, setShowEditHeaderMdal] = useState();
    const [showInfo, setShowInfo] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [promotionModal, setPromotionModal] = useState(false);
    const [analyticsModal, setAnalyticsModal] = useState(false)

    const { data: groupDetails, isLoading } = useGetGroupDetailsQuery(groupId);
    const [followGroup, { isLoading: followLoading }] = useFollowGroupMutation();
    const [unFollowGroup, { isLoading: unFollowLoading }] = useUnFollowGroupMutation();
    const [requestFollow, { isLoading: requestLoading }] = useRequestFollowMutation();

    const groupController = useGroupController(null, groupId);

    useOnOutsideClick(popUpRef, () => {
        setShowPopup(false);
    });

    const toggleHeaderModal = () => {
        setShowEditHeaderMdal((prev) => !prev)
    }
    const handleFollowGroup = async () => {
        try {
            const credentials = {
                group_id: groupId,
                user_id: currentUser?.id,
            }
            const res = await followGroup({ ...credentials }).unwrap();
            toast.success(res?.message)
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage)
        }
    }

    const handleUnFollowGroup = async () => {
        try {
            const credentials = {
                group_id: groupId,
                user_id: currentUser?.id,
            }
            const res = await unFollowGroup({ ...credentials }).unwrap();
            toast.success(res?.message)
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage)
        }
    }

    const handleRquestToFollowGroup = async () => {
        try {
            const res = await requestFollow(groupId).unwrap();
            toast.success(res?.message)
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage)
        }
    }

    const toggleInfoView = () => {
        setShowInfo((prev) => !prev)
    };

    const handlePromotionModal = () => {
        setPromotionModal(prev => !prev)
    }

    const handleGroupAnalyticsModal = () => {
        setAnalyticsModal(prev => !prev)
        setShowPopup(false);
    }

    const isPrivateMember = groupDetails?.data?.is_following && groupDetails?.data.group_access === "Closed"

    return (
        <Protected>
            <IsSuspended isSuspended={groupDetails?.data?.is_suspended}>
                <section className="h-full flex divide-x divide-tgray-xlight">
                    <div className="w-full flex flex-col gap-2 md:w-4/6 h-full p-2 md:px-6 md:pt-6">
                        <section className="w-full flex flex-col gap-2">
                            {
                                isLoading ?
                                    <BannerSkeletons />
                                    :
                                    <Banner
                                        onRoute={() => navigate(`/category/${groupDetails?.data?.category?.id}`)}
                                        groupCategory={groupDetails?.data.category?.name}
                                        banner={groupDetails?.data.image}
                                        groupCategoryIcon={groupDetails?.data.category?.icon_image ?? <LatestEventsIcon />}
                                    />
                            }

                            <section className="w-full flex flex-col items-start gap-2">
                                <section className="w-full flex items-start gap-8">
                                    {
                                        isLoading ?
                                            <section className="w-full flex items-center justify-center py-4">
                                                <ColoredLoader />
                                            </section>
                                            :
                                            <section className="w-full flex flex-col gap-2">
                                                <header className="flex items-start gap-4">
                                                    <section className="flex items-start md:items-center gap-2">
                                                        <img
                                                            style={{
                                                                backgroundSize: "cover",
                                                                backgroundRepeat: "no-repeat",
                                                                objectFit: "cover",
                                                            }}
                                                            src={groupDetails?.data.image ?? FallBack}
                                                            className="rounded-full w-12 h-12 bg-tgray-100 bg-opacity-10"
                                                            onError={(e) => {
                                                                e.target.onerror = FallBack;
                                                                e.target.src = FallBack
                                                            }}
                                                        />
                                                        <div className="flex flex-col md:flex-row items-start gap-3">
                                                            <div className="flex flex-col items-start">
                                                                <div className="flex items-center gap-1">
                                                                    <p className="font-medium text-sm md:text-base">{groupDetails?.data.name}</p>
                                                                    {groupDetails?.data.group_access === "Closed" ? <LockIcon /> : null}
                                                                </div>
                                                                <span className="text-xs md:text-sm font-bold">
                                                                    {groupDetails?.data.total_members} {!groupDetails?.data.total_members ? 'members' : groupDetails?.data.total_members > 1 ? "members" : "member"}
                                                                </span>
                                                            </div>
                                                            <IsRole currentRole={groupDetails?.data?.user_role ?? "Member"} allowedRoles={["Owner", "Admin"]}>
                                                                <div onClick={toggleHeaderModal} className='cursor-pointer border border-tgray-50 rounded-full px-3 py-1 flex items-center justify-between gap-2'>
                                                                    <UploadAvatarIcon />
                                                                    <span className='text-tblack-100 text-xs md:text-sm'>Edit</span>
                                                                </div>
                                                            </IsRole>
                                                            {
                                                                !groupDetails?.data?.promotion ?
                                                                    <IsRole currentRole={groupDetails?.data?.user_role ?? "Member"} allowedRoles={["Owner", "Admin"]}>
                                                                        <span
                                                                            onClick={handlePromotionModal}
                                                                            className={`w-fit font-normal border border-[#D1F2F7] text-[8px] px-2 py-1 rounded-full bg-gradient-to-r from-[#FDFFFF] to-[#D1F2F7] cursor-pointer`}
                                                                        >
                                                                            Promote group
                                                                        </span>
                                                                    </IsRole>
                                                                    :
                                                                    null
                                                            }

                                                            <span
                                                                className={`w-fit ${groupDetails?.data?.promotion ? "inline" : "hidden"} font-normal text-[8px] px-2 py-1 rounded-full bg-[#FDAC0E] cursor-pointer sm:ml-4`}
                                                            >
                                                                Ad
                                                            </span>
                                                        </div>
                                                    </section>
                                                </header>
                                            </section>
                                    }
                                    {
                                        isLoading ?
                                            <div className="flex items-end justify-end py-1">
                                                <ButtonSkeletonLoader />
                                            </div>
                                            :
                                            <div className={`${groupDetails ? "block" : "hidden"}`}>
                                                <section className="flex items-end justify-end">
                                                    {
                                                        !groupDetails?.data?.is_following && groupDetails?.data.group_access === "Opened" ?
                                                            <Button
                                                                children="Follow"
                                                                leftIcon={!followLoading && <Icon.Plus size={18} />}
                                                                className="!rounded-full !text-sm bg-tprimary-50 !px-4 !py-2.5 font-semiboldNunito"
                                                                onClick={handleFollowGroup}
                                                                isLoading={followLoading}
                                                                disabled={followLoading}
                                                            />
                                                            :
                                                            !groupDetails?.data?.is_following && groupDetails?.data.group_access === "Closed" && !groupDetails?.data?.has_requested ?
                                                                <Button
                                                                    children="Request to join"
                                                                    leftIcon={!requestLoading && <Icon.Plus size={18} />}
                                                                    className="!rounded-full !text-sm !px-4 !py-2.5 font-semiboldNunito"
                                                                    onClick={handleRquestToFollowGroup}
                                                                    isLoading={requestLoading}
                                                                    disabled={requestLoading}
                                                                />
                                                                :
                                                                groupDetails?.data?.is_following ?
                                                                    <Button
                                                                        children="Unfollow"
                                                                        className="!rounded-full !text-sm !px-4 !py-2.5 font-semiboldNunito"
                                                                        onClick={handleUnFollowGroup}
                                                                        isLoading={unFollowLoading}
                                                                        disabled={unFollowLoading}
                                                                        variant="error"
                                                                    />
                                                                    :
                                                                    <p className="border border-tprimary-50 px-3 py-1 rounded-full whitespace-nowrap flex items-center gap-2 text-tprimary-50">
                                                                        <Icon.Info size={18} />
                                                                        Requested
                                                                    </p>

                                                    }
                                                </section>
                                            </div>
                                    }
                                    {groupDetails?.data?.is_following || isPrivateMember ? <section ref={popUpRef} className="cursor-pointer relative">
                                        <Icon.MoreVertical onClick={() => setShowPopup(prev => !prev)} size={35} className="hover:bg-tgray-xlight p-2 rounded-full cursor-pointer" />
                                        {
                                            showPopup ?
                                                <motion.div
                                                    variants={PostCardVariants}
                                                    initial="initial"
                                                    animate="animate"
                                                    exit="exit"
                                                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                                                    className="absolute top-12 right-4 z-[15]"
                                                >
                                                    <ul className="w-full bg-white flex flex-col items-start divide-y divide-tgray-50 border border-tgray-50 overflow-hidden rounded-xl">
                                                        <li onClick={() => { groupController.handleReportModal(); setShowPopup(false) }}
                                                            className="bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight whitespace-nowrap"
                                                        >
                                                            <Icon.Flag className='' size={15} color='#000000' strokeWidth={2} />
                                                            <p>Report Group</p>
                                                        </li>
                                                        <li onClick={handleGroupAnalyticsModal}
                                                            className={`${groupDetails?.data?.promotion ? "block" : "hidden"} bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight whitespace-nowrap`}
                                                        >
                                                            <AnalyticsIcon className='' size={15} color='#000000' strokeWidth={2} />
                                                            <p>View Analytics</p>
                                                        </li>
                                                    </ul>
                                                </motion.div>
                                                :
                                                null
                                        }
                                    </section> : null}
                                </section>
                                <div className="w-full flex flex-col gap-2">
                                    <article className="w-full text-xs md:text-sm">{groupDetails?.data.about}</article>
                                    <div className="block md:hidden">
                                        {
                                            showInfo ?
                                                <button onClick={toggleInfoView} type="button" className="rounded-full px-4 py-2 text-xs text-twhite-100 bg-[#2D2D2D]">
                                                    View posts
                                                </button>
                                                :
                                                <button onClick={toggleInfoView} type="button" className="rounded-full px-4 py-2 text-xs text-twhite-100 bg-[#2D2D2D]">
                                                    View info
                                                </button>
                                        }
                                    </div>
                                </div>
                            </section>
                        </section>

                        {
                            showInfo && isMobile ?
                                <section className={`w-full block md:hidden md:w-2/6 h-full p-2 md:px-6 relative`}>
                                    <GroupDetails
                                        currentUserRole={groupDetails?.data?.user_role ?? "Member"}
                                        groupDetails={groupDetails}
                                        isLoading={isLoading}
                                    />
                                </section>
                                :
                                <>
                                    {
                                        groupDetails?.data.is_suspended ?
                                            <p className="flex items-center justify-center m-auto">You have been suspended from this group!</p>
                                            :
                                            (groupDetails?.data.group_access === "Closed" && !isPrivateMember) ?
                                                <p className="flex items-center justify-center m-auto font-bold">Only group members can view content within</p>
                                                :
                                                <section className="relative overflow-y-auto w-full no-scrollbar">
                                                    <RouteTabs
                                                        tabs={tabs}
                                                    />
                                                </section>
                                    }
                                </>
                        }
                    </div>

                    <section className={`w-full hidden md:block md:w-2/6 h-full p-2 md:px-6 relative`}>
                        {
                            (groupDetails?.data.group_access === "Closed" && !isPrivateMember) ?
                                <p className="flex items-center justify-center m-auto font-bold">Only group members can view content within</p>
                                :
                                <GroupDetails
                                    currentUserRole={groupDetails?.data?.user_role ?? "Member"}
                                    groupDetails={groupDetails}
                                    isLoading={isLoading}
                                />
                        }
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
                            banner={groupDetails?.data.image}
                            name={groupDetails?.data?.name}
                            info={groupDetails?.data.about}
                        />
                    </Modal>

                    <Modal
                        show={groupController.openReport}
                        shouldCloseOnEscPress={false}
                        shouldCloseOnOverlayClick={false}
                        onClose={groupController.handleReportModal}
                        position='center'
                        contentWidth='w-full md:w-2/4'
                    >
                        <GroupReportModal
                            onClose={groupController.handleReportModal}
                            checkedValue={groupController.checkedValue}
                            setCheckedValue={groupController.setCheckedValue}
                            handleReport={groupController?.handleReportGroup}
                            isLoading={groupController?.reportLoading}
                            confirmationModal={groupController?.confirmationModal}
                            setConfirmationModal={groupController?.setConfirmationModal}
                        />
                    </Modal>

                    <Modal
                        show={promotionModal}
                        shouldCloseOnEscPress={false}
                        shouldCloseOnOverlayClick={false}
                        onClose={handlePromotionModal}
                        position='center'
                        contentWidth='w-full md:w-3/4 xl:w-2/5'
                    >
                        <PromotionModal
                            onClose={handlePromotionModal}
                            groupId={groupDetails?.data?.id}
                        />
                    </Modal>

                    <Modal
                        show={analyticsModal}
                        shouldCloseOnEscPress={false}
                        shouldCloseOnOverlayClick={false}
                        onClose={handleGroupAnalyticsModal}
                        position='center'
                        contentWidth='w-full md:w-3/4 xl:w-2/5'
                    >
                        <PostAnalyticsModal
                            onClose={handleGroupAnalyticsModal}
                            groupId={groupDetails?.data?.id}
                        />
                    </Modal>
                </section>
            </IsSuspended>
        </Protected >
    )
} 
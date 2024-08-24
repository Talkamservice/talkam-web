import { useNavigate, useParams } from "react-router-dom";
import { FeaturedFireIcon, LatestEventsIcon, NewBadgeIcon, TrendingIcon, UploadAvatarIcon } from "../../../assets/icons/generated";
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
import { useState } from "react";
import { ColoredLoader } from "../../../components/global/loader";
import { EditGroupHeader } from "./groupdetails/modals/editgroupheader";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import * as Icon from 'react-feather'
import FallBack from "../../../assets/icons/users.svg"

const tabs = [
    {
        id: 0,
        title: "Featured",
        text: "featured",
        icon: <FeaturedFireIcon />
    },
    {
        id: 1,
        title: "Trending",
        text: "trending",
        icon: <TrendingIcon />
    },
    {
        id: 2,
        title: "Just In",
        text: "new",
        icon: <NewBadgeIcon />
    },
];

export const Group = () => {

    let isMobile = useMediaQuery("(max-width: 768px)");
    const navigate = useNavigate();
    const currentUser = useSelector(selectCurrentUser);
    const { groupId } = useParams();
    const [showEditHeaderModal, setShowEditHeaderMdal] = useState();
    const [showInfo, setShowInfo] = useState(false);

    const { data: groupDetails, isLoading } = useGetGroupDetailsQuery(groupId);
    const [followGroup, { isLoading: followLoading }] = useFollowGroupMutation();
    const [unFollowGroup, { isLoading: unFollowLoading }] = useUnFollowGroupMutation();
    const [requestFollow, { isLoading: requestLoading }] = useRequestFollowMutation()

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

    return (
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
                                                    className="rounded-full w-12 h-12"
                                                    onError={(e) => {
                                                        e.target.onerror = FallBack;
                                                        e.target.src = FallBack
                                                    }}
                                                />
                                                <div className="flex flex-col md:flex-row items-start gap-3">
                                                    <div className="flex flex-col items-start">
                                                        <p className="font-medium text-sm md:text-base">{groupDetails?.data.name}</p>
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
                                                !groupDetails?.data?.is_following && groupDetails?.data.group_access && !groupDetails?.data?.has_requested === "Closed" ?
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
                            }
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
                <GroupDetails
                    currentUserRole={groupDetails?.data?.user_role ?? "Member"}
                    groupDetails={groupDetails}
                    isLoading={isLoading}
                />
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
        </section>
    )
} 
import { LatestEventsIcon, LockIcon } from "../../../assets/icons/generated";
import { Banner } from "../../../components/global/groupbanner";
import { ColoredLoader } from "../../../components/global/loader";
import { BannerSkeletons, ButtonSkeletonLoader } from "../../../components/global/skeletons";
import { Button } from "../../../components/forms/button";
import { useFollowGroupMutation, useRequestFollowMutation, useUnFollowGroupMutation } from "../../../services/groupApiSlice";
import { handleError } from "../../../utils/handleError";
import { toast } from "sonner";
import FallBack from "../../../assets/icons/users.svg"
import * as Icon from 'react-feather'

export const GroupBannerAd = ({ groupDetails, refetch, refetchAds, isLoading, groupId, actions }) => {

    const [followGroup, { isLoading: followLoading }] = useFollowGroupMutation();
    const [unFollowGroup, { isLoading: unFollowLoading }] = useUnFollowGroupMutation();
    const [requestFollow, { isLoading: requestLoading }] = useRequestFollowMutation();

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
        refetch();
        refetchAds();
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
        refetch();
        refetchAds();
    }

    const handleRquestToFollowGroup = async () => {
        try {
            const res = await requestFollow(groupId).unwrap();
            toast.success(res?.message)
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage)
        }
        refetch();
        refetchAds();
    }

    return (
        <section className="w-full flex flex-col gap-2">
            {
                isLoading ?
                    <BannerSkeletons />
                    :
                    <Banner
                        onRoute={() => navigate(`/category/${groupDetails?.category?.id}`)}
                        groupCategory={groupDetails?.category?.name}
                        banner={groupDetails?.image}
                        groupCategoryIcon={groupDetails?.category?.icon_image ?? <LatestEventsIcon />}
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
                                            src={groupDetails?.image ?? FallBack}
                                            className="rounded-full w-12 h-12 bg-tgray-100 bg-opacity-10"
                                            onError={(e) => {
                                                e.target.onerror = FallBack;
                                                e.target.src = FallBack
                                            }}
                                        />
                                        <div className="flex flex-col md:flex-row items-start gap-3">
                                            <div className="flex flex-col items-start">
                                                <div className="flex items-center gap-1">
                                                    <p className="font-medium text-sm md:text-base">{groupDetails?.name}</p>
                                                    {groupDetails?.group_access === "Closed" ? <LockIcon /> : null}
                                                </div>
                                                <span className="text-xs md:text-sm font-bold">
                                                    {groupDetails?.total_members} {!groupDetails?.total_members ? 'members' : groupDetails?.total_members > 1 ? "members" : "member"}
                                                </span>
                                            </div>

                                            <span
                                                className={`w-fit font-normal text-[8px] px-2 py-1 rounded-full bg-[#FDAC0E] cursor-pointer sm:ml-4`}
                                            >
                                                Ad
                                            </span>
                                        </div>
                                    </section>
                                </header>

                                <div className="w-full flex flex-col gap-2">
                                    <article className="w-full text-xs md:text-sm">{groupDetails?.about}</article>
                                </div>
                            </section>
                    }
                    {
                        actions ?
                            <section>
                                {
                                    isLoading ?
                                        <div className="flex items-end justify-end py-1">
                                            <ButtonSkeletonLoader />
                                        </div>
                                        :
                                        <div className={`${groupDetails ? "block" : "hidden"}`}>
                                            <section className="flex items-end justify-end">
                                                {
                                                    !groupDetails?.is_following && groupDetails?.group_access === "Opened" ?
                                                        <Button
                                                            children="Follow"
                                                            leftIcon={!followLoading && <Icon.Plus size={18} />}
                                                            className="!rounded-full !text-sm bg-tprimary-50 !px-4 !py-2.5 font-semiboldNunito"
                                                            onClick={handleFollowGroup}
                                                            isLoading={followLoading}
                                                            disabled={followLoading}
                                                        />
                                                        :
                                                        !groupDetails?.is_following && groupDetails?.group_access === "Closed" && !groupDetails?.has_requested ?
                                                            <Button
                                                                children="Request to join"
                                                                leftIcon={!requestLoading && <Icon.Plus size={18} />}
                                                                className="!rounded-full !text-sm !px-4 !py-2.5 font-semiboldNunito"
                                                                onClick={handleRquestToFollowGroup}
                                                                isLoading={requestLoading}
                                                                disabled={requestLoading}
                                                            />
                                                            :
                                                            groupDetails?.is_following ?
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
                            </section>
                            :
                            null
                    }
                </section>
            </section>
        </section>
    )
}
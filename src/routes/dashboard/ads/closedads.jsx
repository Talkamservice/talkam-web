import { AdCard } from "../../../components/global/adcard";
import { useGetRunningAdsQuery } from "../../../services/paymentApiSlice";
import { handleError } from "../../../utils/handleError";
import { toast } from "sonner";
import { EmptyState } from "../../../components/global/emptystate";
import { AdSkeletonLoader } from "../../../components/global/skeletons";
import EmptyListIcon from "../../../assets/images/emptylist.png"

export const ClosedAds = () => {

    const { data: closedAds, isLoading, isError, error } = useGetRunningAdsQuery("Inactive");

    if (isError) {
        const errorMessage = handleError(error);
        toast.error(errorMessage);
        return (
            <div className="w-full items-center justify-center m-auto text-center text-tgray-150">
                <p className="text-sm font-normal">Ads aren't loading right now.</p>
                <p className="text-xs font-normal">Try again.</p>
            </div>
        );
    }

    return (
        <div>
            {
                isLoading ?
                    <AdSkeletonLoader />
                    :
                    !closedAds?.data?.data?.length ?
                        <section className="w-full py-7">
                            <EmptyState
                                icon={EmptyListIcon}
                                height="h-[30px]"
                                width="h-[30px]"
                                text="You currently don&apos;t have any Closed promotions"
                                subtext="When you have any closed or expired promotions, they would appear here"
                            />
                        </section>
                        :

                        <section className="flex flex-col gap-3">
                            {
                                closedAds?.data?.data?.map((ad) => (
                                    <AdCard
                                        key={ad.id}
                                        id={ad.id}
                                        post={ad?.post}
                                        commentCount={ad?.post?.comments_count}
                                        likes={ad?.post?.likes_count}
                                        impressions={ad?.post?.views_count}
                                        status={ad.status}
                                        type="closed"
                                    />
                                ))
                            }
                        </section>
            }
        </div>
    )
}
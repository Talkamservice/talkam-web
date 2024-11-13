import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/forms/button";
import { AdCard } from "../../../components/global/adcard";
import { useGetRunningAdsQuery } from "../../../services/paymentApiSlice";
import { handleError } from "../../../utils/handleError";
import { toast } from "sonner";
import { AdSkeletonLoader } from "../../../components/global/skeletons";

export const RunningAds = () => {

    const navigate = useNavigate();
    const { data: runningAds, isLoading, isError, error } = useGetRunningAdsQuery();

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
                    !runningAds?.data?.data?.length ?
                        <section className="flex items-center justify-center flex-col gap-3 h-full p-7 md:py-24">
                            <div>
                                <p className="text-2xl text-center">You currently don&apos;t have any post promoted</p>
                                <p className="text-base text-[#858585] text-center">You haven&apos;t promoted any post yet. Click on the button below to begin</p>
                            </div>

                            <Button
                                className="!rounded-full"
                                onClick={() => navigate("/create-post", { state: "new-promo" })}
                            >
                                Start Promoting
                            </Button>
                        </section> :

                        <section className="flex flex-col gap-3">
                            {
                                runningAds?.data?.data?.map((ad) => (
                                    <AdCard
                                        key={ad.id}
                                        id={ad.id}
                                        post={ad?.post}
                                        group={ad?.group}
                                        commentCount={ad?.post?.comments_count}
                                        likes={ad?.post?.likes_count}
                                        impressions={ad?.post?.views_count}
                                        status={ad.status}
                                        type="running"
                                    />
                                ))
                            }
                        </section>
            }
        </div>
    )
}
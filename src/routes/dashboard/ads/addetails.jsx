import { ArrowLeft } from "react-feather"
import { Button } from "../../../components/forms/button"
import { useNavigate, useParams } from "react-router-dom"
import { useGetPromotionDetailsQuery } from "../../../services/paymentApiSlice";
import { AdSkeletonLoader } from "../../../components/global/skeletons";
import { AdCard } from "../../../components/global/adcard";
import { handleError } from "../../../utils/handleError";
import { toast } from "sonner";

const statusMap = {
    "Active": "running",
    "Pending": "running",
    "Inactive": "closed"
}

export const AdDetails = () => {

    const { adId } = useParams();
    const navigate = useNavigate();

    const { data: ad, isLoading, isError, error } = useGetPromotionDetailsQuery(adId);

    if (isError) {
        const errorMessage = handleError(error);
        toast.error(errorMessage);
        return (
            <div className="w-full items-center justify-center m-auto text-center text-tgray-150">
                <p className="text-sm font-normal">Ad details have failed to load right now.</p>
                <p className="text-xs font-normal">Try again.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col">
            <header className="w-full flex items-center justify-between gap-4 p-4 border-b border-tgray-50 h-[5dvh] sticky top-0 bg-white z-20">
                <Button
                    variant="link"
                    leftIcon={<ArrowLeft size={18} />}
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>

                <p className="fomt-medium">Ad Details</p>
            </header>

            <section className="w-full p-6">
                {
                    isLoading ?
                        <AdSkeletonLoader num={1} />
                        :
                        <AdCard
                            id={ad?.data?.id}
                            type={statusMap[ad?.data?.status]}
                            post={ad?.data?.post}
                            group={ad?.data?.group}
                            status={ad?.data?.status}
                            stats={ad?.data?.stats}
                            page="details"
                        />
                }
            </section>
        </div>
    )
}
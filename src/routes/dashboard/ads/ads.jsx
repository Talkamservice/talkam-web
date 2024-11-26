import { ArrowLeft, Plus } from "react-feather"
import { Button } from "../../../components/forms/button"
import { useNavigate } from "react-router-dom"
import { RouteTabs } from "../../../components/global/routetabs";

const tabs = [
    {
        id: 0,
        title: "Running ads",
        text: "running-ads",
    },
    {
        id: 1,
        title: "Closed ads",
        text: "closed-ads",
    },
];

export const Ads = () => {

    const navigate = useNavigate();

    return (
        <div className="w-full h-full flex flex-col">
            <header className="w-full flex items-center justify-between gap-4 px-4 py-2 border-b border-tgray-50 sticky top-0 bg-white">
                <Button
                    variant="link"
                    leftIcon={<ArrowLeft size={18} />}
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>

                <Button
                    className="!rounded-full"
                    onClick={() => navigate("/create-post", { state: "new-promo" })}
                    rightIcon={<Plus size={18} />}
                >
                    Start Promoting
                </Button>
            </header>

            <section className="w-full p-6 relative overflow-y-auto">
                <RouteTabs tabs={tabs} />
            </section>
        </div>
    )
}
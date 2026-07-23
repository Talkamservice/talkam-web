import { useNavigate } from "react-router-dom";
import { Button } from "../forms/button"
import { useMediaQuery } from "../../hooks/useMediaQuery";

export const TalkAmPlusCard = ({ plan }) => {

    const navigate = useNavigate();
    let isMonitor = useMediaQuery("(min-width: 1024px)");


    return (
        <div className="w-full rounded-xl p-6 bg-gradient-to-b from-[#005783] to-[#00131D] flex flex-col items-center justify-center gap-2">
            {
                plan === "Freemium" ?
                    <div className="w-full flex items-start justify-start">
                        <p className="text-xs rounded-full bg-[#FDFAE0] px-3 py-1.5 ">Freemium</p>
                    </div>
                    :
                    null
            }
            <header className="flex flex-col gap-2">
                <h1 className="text-xl font-bold text-white text-center">Upgrade to TalkAM plus</h1>
                <p className="text-xs text-[#8AC9EF] text-center">Enjoy great experiences with our premium plan, get easy access to creator tools and boost your presence on TalkAm.</p>
            </header>

            <Button
                className="!rounded-full !text-xs xl:!text-sm"
                fullWidth
                onClick={() => navigate("/plus")}
            >
                {isMonitor ? 'Upgrade to TalkAM plus' : "Upgrade to plus"}
            </Button>
        </div>
    )
}
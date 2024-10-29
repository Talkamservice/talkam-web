import { useNavigate } from "react-router-dom";
import { Button } from "../forms/button"

export const PremiumSubCard = ({ plan, renewal }) => {

    const navigate = useNavigate();

    return (
        <div className="w-full rounded-xl bg-gradient-to-b from-[#005783] to-[#00131D] flex flex-col items-center justify-center gap-2">
            <header className="w-full flex items-center justify-between gap-4 border-b border-[#024B72] p-4">
                <h1 className="text-xl font-bold text-white">Your premium plan</h1>
                <p className="text-[8px] rounded-full bg-[#FDFAE0] px-3 py-1.5 bg-gradient-to-r from-[#D1F2F7] via-[#FDFFFF] to-[#D1F2F7] whitespace-nowrap">TalkAM plus</p>
            </header>

            <section className="w-full flex flex-col gap-4 px-4 py-2">
                <div className="w-full flex items-center justify-between gap-4">
                    <span className="text-xs text-[#8AC9EF]">Plan</span>
                    <span className="text-xs text-[#FFFFFF]">{plan}</span>
                </div>
                <div className="w-full flex items-center justify-between gap-4">
                    <span className="text-xs text-[#8AC9EF]">Renewal</span>
                    <span className="text-xs text-[#FFFFFF]">{renewal}</span>
                </div>
            </section>
        </div>
    )
}
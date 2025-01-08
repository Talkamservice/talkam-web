import { CustomRangeSlider } from "../../../../components/global/customrange"
import { useNumberFormatter } from "../../../../hooks/useNumberFormatter";

export const SlideTwo = ({ handleBudgetChange, handleDurationChange, budget, duration, currency, impressionData, estimatedReach }) => {

    let durationPluralization;

    if (!duration)
        durationPluralization = '0 days'
    if (duration > 0) {
        const noun = duration > 1 ? 'days' : 'day';
        durationPluralization = duration + " " + noun
    }

    const formattedBudget = useNumberFormatter(budget * duration);

    return (
        <div className="flex flex-col gap-3 divide-y divide-tgray-50">
            <section className="flex flex-col gap-6 py-2">
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">What is your budget.</p>
                    <span className="text-[10px] font-medium text-[#858585]">Daily budget</span>
                </div>

                <section className="flex flex-col w-full gap-3">
                    <CustomRangeSlider
                        initialValue={budget}
                        min={impressionData?.amount.toFixed(0)}
                        max={impressionData?.max_daily_amount.toFixed(0)}
                        step={1}
                        onValueChange={handleBudgetChange}
                    />
                    <section className="w-full flex items-center justify-between">
                        <span className="text-[10px] font-medium text-[#858585]">{currency}{impressionData?.amount.toFixed(0)}</span>
                        <span className="text-[10px] font-medium text-[#473131]">{currency}{impressionData?.max_daily_amount.toFixed(0)}</span>
                    </section>
                </section>
            </section>

            <section className="flex flex-col w-full py-6 gap-6">
                <div className="flex flex-col gap-2 py-2">
                    <p className="text-sm font-medium">Duration.</p>
                </div>

                <section className="flex flex-col w-full gap-3">
                    <CustomRangeSlider
                        initialValue={duration}
                        min={1}
                        max={30}
                        step={1}
                        onValueChange={handleDurationChange}
                    />
                    <section className="w-full flex items-center justify-between">
                        <span className="text-[10px] font-medium text-[#858585]">1 day</span>
                        <span className="text-[10px] font-medium text-[#858585]">30 days</span>
                    </section>
                </section>
            </section>

            <section className="py-3">
                <section className="w-full rounded-xl bg-[#F1FAFF] border border-[#E5F6FF] p-4 flex items-center flex-col gap-6 justify-center">
                    <div className="w-full md:w-3/4 flex items-center justify-between">
                        <p className="text-xl text-tprimary-50 font-bold">{currency}{formattedBudget ?? 0}</p>
                        <span className="text-[#858585] text-[10px]">For</span>
                        <p className="text-xl text-tprimary-50 font-bold">{durationPluralization}</p>
                    </div>
                    <p className="text-[#858585] text-xs">Estimated reach within {durationPluralization} is {estimatedReach ?? 0} impressions</p>
                </section>
            </section>
        </div>
    )
}
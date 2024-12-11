import { CustomRangeSlider } from "../../../../components/global/customrange"
import { useNumberFormatter } from "../../../../hooks/useNumberFormatter";

export const SlideTwo = ({ handleBudgetChange, handleDurationChange, budget, duration, currency }) => {

    let durationPluralization;

    if (!duration)
        durationPluralization = '0 days'
    if (duration > 0) {
        const noun = duration > 1 ? 'days' : 'day';
        durationPluralization = duration + " " + noun
    }
    const formattedBudget = useNumberFormatter(budget);

    return (
        <div className="flex flex-col gap-6 divide-y divide-tgray-50">
            <section className="flex flex-col gap-12 py-6">
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">What is your budget.</p>
                    <span className="text-[10px] font-medium text-[#858585]">Daily budget</span>
                </div>

                <section className="flex flex-col w-full gap-3">
                    <CustomRangeSlider
                        initialValue={budget}
                        min={50}
                        max={10000}
                        step={50}
                        onValueChange={handleBudgetChange}
                    />
                    <section className="w-full flex items-center justify-between">
                        <span className="text-[10px] font-medium text-[#858585]">{currency}50</span>
                        <span className="text-[10px] font-medium text-[#858585]">{currency}10,000</span>
                    </section>
                </section>
            </section>

            <section className="flex flex-col w-full py-6 gap-6">
                <div className="flex flex-col gap-2">
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
        </div>
    )
}
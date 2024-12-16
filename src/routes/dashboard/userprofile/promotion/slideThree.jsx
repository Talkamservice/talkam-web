import { useNumberFormatter } from "../../../../hooks/useNumberFormatter";

export const SlideThree = ({ location, minAge, maxAge, gender, budget, countries, duration, currency, priceToPay, estimatedReach }) => {

    let durationPluralization;

    if (!duration)
        durationPluralization = '0 days'
    if (duration > 0) {
        const noun = duration > 1 ? 'days' : 'day';
        durationPluralization = duration + " " + noun
    }
    const formattedBudget = useNumberFormatter(budget);
    const formattedPriceToPay = useNumberFormatter(priceToPay)

    return (
        <div className="flex flex-col gap-6 divide-y divide-tgray-50">
            <section className="flex flex-col gap-6 py-6">
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">Your reach</p>
                </div>

                <section className="flex items-start justify-between flex-wrap w-full gap-3">
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-[#858585]">Location(s)</span>
                        {
                            countries?.map((country) => (
                                <p className="text-xl font-medium">{country?.name}</p>
                            ))
                        }
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-[#858585]">Age range</span>
                        <p className="text-xl font-medium">{minAge} - {maxAge}yrs</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-[#858585]">Gender</span>
                        <p className="text-xl font-medium">{gender}</p>
                    </div>
                </section>
            </section>

            <section className="flex flex-col gap-6 py-6">
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">Budget & Duration</p>
                </div>

                <section className="flex items-center justify-between flex-wrap w-full gap-3">
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-[#858585]">Daily budget</span>
                        <p className="text-xl font-medium">{currency}{formattedBudget}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-[#858585]">Duration</span>
                        <p className="text-xl font-medium">{durationPluralization}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-[#858585]">Amount</span>
                        <p className="text-xl font-medium">{currency}{formattedPriceToPay}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-[#858585]">Estimated Reach</span>
                        <p className="text-xl font-medium">{estimatedReach ?? ""} impressions</p>
                    </div>
                </section>
            </section>
        </div>
    )
}
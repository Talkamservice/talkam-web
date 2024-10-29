import { ArrowLeft } from "react-feather"
import { Button } from "../../../components/forms/button"
import { PricingTabs } from "../../../components/pricing/pricingTabs"
import { useState } from "react"
import { PricingCard } from "../../../components/pricing/pricingcard"
import { useGetAllPlansQuery } from "../../../services/paymentApiSlice"

const freemiumFeatures = [
    "Limited character when Posting and commenting.",
    "Vote.",
    "See Ads.",
    "Join groups.",
    "Create 1 (One) public group.",
    "Anonymous post toggle will be disabled.",
    "Get 5 access to post anonymously.",
]

const talkAMPlusFeatures = [
    "Unlimited character when Posting and commenting.",
    "Ad-free experience.",
    "Freely toggle off or on Ads.",
    "Join groups.",
    "Create unlimited public and private groups.",
    "Freely toggle off or on Anonymous posting.",
    "Your profile shows a blue tick.",
    "Unlimited anonymous post and comment.",
]

const tabs = [
    {
        id: 0,
        // title: "Monthly",
        text: "Annually",
        node: <p className="flex items-center gap-2">
            <span className="text-sm !font-extralight">Annually</span>
            <span className="border border-[#D1F2F7] text-[8px] px-2 py-1 rounded-full bg-gradient-to-r from-[#D1F2F7] via-[#FDFFFF] to-[#D1F2F7] !text-tblack-100">Save 20%</span>
        </p>
    },
    {
        id: 1,
        title: "Monthly",
        text: "Monthly",
    }
]

export const Pricing = () => {

    const [period, setPeriod] = useState("Annually");
    const { data: plans, isLoading } = useGetAllPlansQuery();

    const handleCurrentTab = (tab) => {
        setPeriod(tab)
    }

    return (
        <div className="absolute top-0 left-0 bg-white z-[35] lg:z-[39] w-full h-full flex flex-col md:flex-row divide-x divide-tgray-50 overflow-auto no-scrollbar p-4 md:px-12">
            <section className="w-full rounded-xl bg-gradient-to-b from-[#FEFEFE] to-[#F0F0F0] border border-[#E5E5E5] p-6 flex flex-col items-center gap-12 overflow-y-auto no-scrollbar">
                <div className="w-full flex items-start lg:items-center flex-col lg:flex-row gap-4">
                    {/* <Button
                        className="!rounded-full !bg-black"
                        leftIcon={<ArrowLeft size={18} />}
                    >
                        Back
                    </Button> */}
                    <header className="w-full flex items-center justify-center">
                        <section className="flex flex-col items-center">
                            <p className="font-bold text-xl md:text-3xl text-center">Upgrade to TalkAM plus</p>
                            <p className="text-sm md:text-base text-tgray-250">Enjoy great ecperiences with TalkAM plus</p>
                        </section>
                    </header>
                </div>
                <section className="w-full xl:w-3/5 flex flex-col gap-6 items-center justify-center">
                    <header className="w-fit">
                        <PricingTabs
                            tabs={tabs}
                            onTabChange={handleCurrentTab}
                        />
                    </header>
                    <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        {
                            plans?.data?.map((plan) => {
                                return (
                                    <PricingCard
                                        key={plan.id}
                                        planId={period === "Annually" ? plan?.durations?.[1]?.id : plan?.durations?.[0]?.id}
                                        currentPlan={plan?.is_active_subscription}
                                        period={period === "Annually" ? plan?.durations?.[1]?.frequency : plan?.durations?.[0]?.frequency}
                                        plan={plan?.name}
                                        features={plan?.benefits}
                                        price={
                                            plan?.durations.length ?
                                                (period === "Annually" ? plan?.durations?.[1]?.price : plan?.durations?.[0]?.price)
                                                :
                                                0
                                        }
                                    />
                                )
                            })
                        }
                        {/* <PricingCard
                            period={period}
                            plan="TalkAM Plus"
                            features={talkAMPlusFeatures}
                            price={period === "Annually" ? 60 : 5}
                        /> */}
                    </section>
                </section>
            </section>

        </div>
    )
}
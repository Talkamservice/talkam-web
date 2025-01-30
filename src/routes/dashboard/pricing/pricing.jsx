import { ArrowLeft } from "react-feather"
import { Button } from "../../../components/forms/button"
import { PricingTabs } from "../../../components/pricing/pricingTabs"
import { useState } from "react"
import { PricingCard } from "../../../components/pricing/pricingcard"
import { useGetAllPlansQuery } from "../../../services/paymentApiSlice"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "../../../services/authSlice"
import { useGetUserProfileDetailsQuery } from "../../../services/userApiSlice"
import { ColoredLoader } from "../../../components/global/loader"

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

export const Pricing = () => {

    const currentUser = useSelector(selectCurrentUser);
    const [period, setPeriod] = useState("Monthly");
    const { data: plans, isLoading } = useGetAllPlansQuery();
    const { data: user } = useGetUserProfileDetailsQuery(currentUser?.id, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true
    });

    const handleCurrentTab = (tab) => {
        setPeriod(tab)
    };

    const tabs = [
        {
            id: 0,
            // title: "Monthly",
            text: "Annually",
            node: <p className="flex items-center gap-2">
                <span className="text-sm !font-extralight">Annually</span>
                {
                    plans?.data?.[0]?.discount ?
                        <span className="border border-[#D1F2F7] text-[8px] px-2 py-1 rounded-full bg-gradient-to-r from-[#D1F2F7] via-[#FDFFFF] to-[#D1F2F7] !text-tblack-100">Save {plans?.data?.[0]?.discount}%</span>
                        :
                        null
                }
            </p>
        },
        {
            id: 1,
            title: "Monthly",
            text: "Monthly",
        }
    ]

    return (
        <div className="absolute top-0 left-0 bg-white z-[35] lg:z-[39] w-full h-full flex flex-col md:flex-row divide-x divide-tgray-50 overflow-auto no-scrollbar p-4 md:px-12">
            <section className="w-full rounded-xl bg-gradient-to-b from-[#FEFEFE] to-[#F0F0F0] border border-[#E5E5E5] p-6 flex flex-col items-center gap-8 overflow-y-auto no-scrollbar">
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
                            <p className="text-sm md:text-base text-tgray-250">Enjoy great experiences with TalkAM plus</p>
                        </section>
                    </header>
                </div>

                {
                    isLoading ?
                        <ColoredLoader />
                        :
                        <section className="w-full xl:w-5/6 flex flex-col gap-6 items-center justify-center">

                            {
                                !user?.data?.active_subscription ?
                                    <header className="w-fit">
                                        <PricingTabs
                                            tabs={tabs}
                                            onTabChange={handleCurrentTab}
                                        />
                                    </header>
                                    :
                                    null
                            }

                            <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
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
                                                        "0"
                                                }
                                                currentPlanPrice={
                                                    (plan.is_active_subscription && plan?.price) ?? "0"
                                                }
                                                currency={
                                                    (plan?.currency) ?? "$"
                                                }
                                            />
                                        )
                                    })
                                }
                            </section>
                        </section>
                }
            </section>

        </div>
    )
}
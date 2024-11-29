import { Check } from "react-feather"
import { Button } from "../forms/button"
import { useSubscribeMutation } from "../../services/paymentApiSlice";
import { closePaymentModal, useFlutterwave } from "flutterwave-react-v3";
import { toast } from "sonner";
import { handleError } from "../../utils/handleError";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from '../../assets/images/avatar.png'

export const PricingCard = ({ plan, currentPlan, period, features, price = "0", planId, currentPlanPrice }) => {

    const navigate = useNavigate();
    const [subResponse, setSubResponse] = useState(null)
    const [subscribe, { isLoading }] = useSubscribeMutation();

    const handleSubscribe = async () => {
        try {
            const res = await subscribe({ plan_duration_id: planId }).unwrap();
            toast.success(res?.message);
            setSubResponse(res?.data);

            if (res?.data) {
                const config = {
                    public_key: import.meta.env.VITE_FLUTTERWAVE_KEY,
                    tx_ref: res?.data?.reference,
                    amount: res?.data?.amount,
                    currency: res?.data?.currency,
                    payment_options: 'card,mobilemoney,ussd',
                    payment_plan: res?.data?.metadata?.flutterwave_data_id,
                    customer: {
                        email: res?.data?.user?.email,
                        phone_number: res?.data?.user?.phone,
                        name: res?.data?.user?.name ?? res?.data?.user?.username,
                    },
                    customizations: {
                        title: res?.data?.activity ?? "TalkAM Subscription",
                        description: res?.data?.description ?? "TalkAM Subscription",
                        logo: Logo,
                    },
                    meta: { ...res?.data?.metadata }
                };

                const handleFlutterPayment = useFlutterwave(config);
                handleFlutterPayment({
                    callback: async (response) => {
                        navigate('/', { replace: true })
                        closePaymentModal();
                    },
                    onClose: () => {
                        navigate('/', { replace: true })
                    },
                });
            } else {
                toast.error('Payment details missing. Please try again.');
            }
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage);
        }
    };

    return (
        <div className="w-full border border-[#E5E5E5] rounded-xl divide-y divide-tgray-200 bg-white h-fit">
            <header className="flex flex-col gap-2 p-7">
                <div className="flex items-center justify-between">
                    <p className="text-xs text-[#858585]">{plan}</p>
                    <p className={`text-[10px] bg-[#F6F3DA] py-1.5 px-3 rounded-full ${currentPlan ? "flex" : "hidden"} `}>Current Plan</p>
                </div>

                <p className="font-bold text-3xl">${currentPlan ? currentPlanPrice : price}</p>
                <p className={`text-sm ${currentPlan || plan === "Freemium" ? "hidden" : "flex"}`}>Billed {period}</p>
            </header>

            <section className={`px-7 py-3 ${currentPlan || plan === "Freemium" ? "hidden" : "block"} `}>
                <Button
                    className="!rounded-full"
                    fullWidth
                    onClick={handleSubscribe}
                    isLoading={isLoading}
                    disabled={isLoading}
                >
                    Subscribe and pay
                </Button>
            </section>

            <section className="px-7 py-3 flex flex-col gap-6">
                {
                    features?.map((feature, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 flex-2"
                        >
                            <Check size={18} color="#017FCB" />
                            <span className="flex flex-1 text-sm">{feature?.title}</span>
                        </div>
                    ))
                }
            </section>

            <footer className="flex items-center text-[10px] px-7 py-3">
                <p>By subscribing to TalkAm plus, you agree to have read the <span className="text-tprimary-50">Purchase Terms and Conditions</span></p>
            </footer>
        </div>
    )
}
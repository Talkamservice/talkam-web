import { X } from "react-feather"
import { Button } from "../../../../components/forms/button"
import { SlideOne } from "./slideone"
import { useGetCountriesQuery } from "../../../../services/userApiSlice"
import { useEffect, useState } from "react"
import { SlideTwo } from "./slidetwo"
import { SlideThree } from "./slideThree"
import { useGetPromotionImpressionsQuery, usePaymentCallBackMutation, usePromoteMutation } from "../../../../services/paymentApiSlice"
import { toast } from "sonner"
import { handleError } from "../../../../utils/handleError"
import { closePaymentModal, useFlutterwave } from "flutterwave-react-v3"
import { useNavigate } from "react-router-dom"
import { postStorageKeys } from "../../create post/createpost"
import { Storage } from "../../../../app/storage"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "../../../../services/authSlice"
import { useGetCurrencySymbol } from "../../../../hooks/useGetCurrencySymbol"
import { useNumberFormatter } from "../../../../hooks/useNumberFormatter"
import Logo from '../../../../assets/images/avatar.png'

export const PromotionModal = ({ onClose, postId, groupId, payload }) => {

    let slideOneIsValid = false;
    const navigate = useNavigate();
    const currentUser = useSelector(selectCurrentUser);
    const userCurrency = useGetCurrencySymbol(currentUser?.pricing_currency)
    const [currentSlide, setCurrentSlide] = useState("one");
    const [country, setCountry] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [countrySearch, setCountrySearch] = useState("");
    const [budget, setBudget] = useState(1000);
    const [duration, setDuration] = useState(15);
    const [gender, setGender] = useState("");
    const [priceToPay, setPriceToPay] = useState(budget)
    const [ageRange, setAgeRange] = useState({
        minAge: 18,
        maxAge: 45
    })
    const transformedCountries = selectedItems?.map(country => country.id)
    const paidPrice = budget * duration;

    const { data: countries, isFetching: loadingCountries } = useGetCountriesQuery({
        search: countrySearch
    });
    const [promote, { isLoading }] = usePromoteMutation();
    const [paymentCallBack] = usePaymentCallBackMutation();
    const { data: impressionData } = useGetPromotionImpressionsQuery();

    const EstimatedReach = () => {
        if (!impressionData?.data) {
            return 0;
        }
        const multiplier = impressionData?.data?.impressions / impressionData?.data?.amount * budget;
        return Number((multiplier * duration).toFixed(0))
    }
    const formattedEstimatedReach = useNumberFormatter(EstimatedReach(), 0)

    const handleCountrySearch = (event) => {
        setCountrySearch(event.target.value)
    }

    const handleGendleSelect = event => {
        setGender(event.target.value)
    }

    const handleSelectCountry = (option) => {
        setCountry(option)
        setCountrySearch("")
    }

    const handleRangeChange = ({ min, max }) => {
        setAgeRange((prevRange) => ({
            minAge: min !== undefined ? min : prevRange.minAge,
            maxAge: max !== undefined ? max : prevRange.maxAge,
        }));
    };
    const handleBudgetRange = (value) => {
        setBudget(value)
    };
    const handleDurationRange = (value) => {
        setDuration(value);
    };

    const handlePromote = async () => {

        const postObject = {
            data: payload,
            type: "Post"
        }

        const details = {
            post_id: postId ?? null,
            group_id: groupId ?? null,
            country_id: [...transformedCountries],
            state_id: null,
            min_age: ageRange.minAge.toString(),
            max_age: ageRange.maxAge.toString(),
            gender: gender,
            daily_budget: budget,
            duration: duration,
            payload: payload ? postObject : null
        };

        try {
            const res = await promote({ ...details }).unwrap();
            toast.success(res?.message);

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
                        closePaymentModal();
                        onClose();
                        postStorageKeys.forEach((key) => Storage.removeItem(key));
                        navigate("/ads", { replace: true });

                        setTimeout(async () => {
                            try {
                                await paymentCallBack({ reference: res?.data?.reference }).unwrap();
                            } catch (err) {
                                const errorMessage = handleError(err);
                                // toast.error(errorMessage);
                            }
                        }, 120000);
                    },
                    onClose: () => {
                        navigate("/home/new");
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

    const slideMap = {
        "one":
            <SlideOne
                countries={countries}
                country={country}
                gender={gender}
                minAge={ageRange.minAge}
                maxAge={ageRange.maxAge}
                countrySearch={countrySearch}
                handleCountrySearch={handleCountrySearch}
                handleSelectCountry={handleSelectCountry}
                loadingCountries={loadingCountries}
                rangeValueChange={handleRangeChange}
                handleGender={handleGendleSelect}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                setCountrySearch={setCountrySearch}
            />,
        "two":
            <SlideTwo
                handleBudgetChange={handleBudgetRange}
                handleDurationChange={handleDurationRange}
                budget={budget}
                duration={duration}
                currency={userCurrency ?? currentUser?.pricing_currency}
                impressionData={impressionData?.data}
                priceToPay={priceToPay}
                setPriceToPay={setPriceToPay}
                estimatedReach={formattedEstimatedReach}
            />,
        "three":
            <SlideThree
                budget={budget}
                duration={duration}
                location={country?.name}
                countries={selectedItems}
                minAge={ageRange.minAge}
                maxAge={ageRange.maxAge}
                gender={gender}
                currency={userCurrency ?? currentUser?.pricing_currency}
                priceToPay={paidPrice}
                estimatedReach={formattedEstimatedReach}
            />
        ,
    }

    useEffect(() => {
        setBudget(impressionData?.data?.amount.toFixed(0) ?? 7000)
        setPriceToPay(impressionData?.data?.amount.toFixed(0) ?? 7000)
    }, [impressionData])

    const stepMap = {
        "one": '01',
        "two": '02',
        "three": '03'
    }

    if (selectedItems?.length && ageRange && gender) {
        slideOneIsValid = true
    }

    return (
        <div className="w-full flex flex-col gap-4">
            <header className="flex items-center justify-between border-b border-tgray-50 gap-3 p-6">
                <p className="text-xl font-bold">Promote your {groupId ? 'group' : 'post'}</p>
                <X className="cursor-pointer" onClick={onClose} size={20} strokeWidth={2} />
            </header>
            <section className="w-full flex flex-col px-6 gap-3">
                <p className="font-medium text-[#858585] text-base">Reach more people and make your {groupId ? 'group' : 'post'} more visible to a large audience of people.</p>
                <span className="w-full flex justify-end text-sm font-medium text-tprimary-50">{stepMap[currentSlide]}/<span className="text-tprimary-50 text-opacity-45">03</span></span>
            </section>
            <section className="px-6 transition-all duration-700 ease-in-out">
                {slideMap[currentSlide]}
            </section>
            <footer className="w-full flex items-end justify-end p-6">
                {
                    currentSlide === "one" ?
                        <section className="w-full flex items-center gap-4">
                            <Button
                                children="Cancel"
                                variant="outline"
                                className="!border-error-500 !text-error-500 !rounded-full"
                                fullWidth
                                onClick={onClose}
                            />

                            <Button
                                children="Next"
                                className="!rounded-full"
                                fullWidth
                                onClick={() => setCurrentSlide("two")}
                                disabled={!slideOneIsValid}
                            />
                        </section>
                        :
                        currentSlide === "two" ?
                            <section className="w-full flex items-center gap-4">
                                <Button
                                    children="Back"
                                    variant="outline"
                                    className="!border-error-500 !text-error-500 !rounded-full"
                                    fullWidth
                                    onClick={() => setCurrentSlide("one")}
                                />

                                <Button
                                    children="Preview"
                                    className="!rounded-full"
                                    fullWidth
                                    onClick={() => setCurrentSlide("three")}
                                />
                            </section>
                            :
                            <section className="w-full flex items-center gap-4">
                                <Button
                                    children="Back"
                                    variant="outline"
                                    className="!border-error-500 !text-error-500 !rounded-full"
                                    fullWidth
                                    onClick={() => setCurrentSlide("two")}
                                />

                                <Button
                                    children="Create Promotion"
                                    className="!rounded-full"
                                    fullWidth
                                    onClick={handlePromote}
                                    isLoading={isLoading}
                                    disabled={isLoading}
                                />
                            </section>
                }
            </footer>
        </div>
    )
}
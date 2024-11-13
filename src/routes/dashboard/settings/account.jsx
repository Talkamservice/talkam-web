import FacebookLogin from "@greatsumini/react-facebook-login"
import { GoogleAuthButton } from "../../../components/forms/socialbuttons/googleauthbutton"
import { FacebookAuthButton } from "../../../components/forms/socialbuttons/facebookauthbutton"
import { AppleAuthButton } from "../../../components/forms/socialbuttons/appleauthbutton"
import { useGoogleLogin } from "@react-oauth/google"
import { useOauthLoginMutation } from "../../../services/authApiSlice"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { handleError } from "../../../utils/handleError"
import { Button } from "../../../components/forms/button"
import { Modal } from "../../../components/global/modal"
import { DeleteAccountModal } from "./deleteaccountmodal"
import { useState } from "react"
import { ChangePasswordModal } from "./changepasswordmodal"
import { selectCurrentUser } from "../../../services/authSlice"
import { TalkAmPlusCard } from "../../../components/global/talkampluscard"
import { useGetUserProfileDetailsQuery } from "../../../services/userApiSlice"
import { PremiumSubCard } from "../../../components/global/premiumsubcard"
import { CancelSubscriptionModal } from "./cancelsubmodal"
import { AlertCircle } from "react-feather"
import { useCancelSubscriptionMutation } from "../../../services/paymentApiSlice"
import moment from "moment/moment"

export const AccountSettings = () => {

    const currentUser = useSelector(selectCurrentUser)
    const dispatch = useDispatch();
    const [cancelSubModal, setCancelSubModal] = useState(false);
    const [openDeleteAccount, setOpenDeleteAccount] = useState(false);
    const [changePasswordModal, setChangePasswordModal] = useState(false);
    const [OauthLogin, { isLoading: OauthLoading }] = useOauthLoginMutation();
    const [cancelSubscription, { isLoading }] = useCancelSubscriptionMutation()
    const { data: user } = useGetUserProfileDetailsQuery(currentUser?.id, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true
    });

    const googleLogin = useGoogleLogin({
        onSuccess: async tokenResponse => {
            try {
                const loginData = await OauthLogin({
                    token: tokenResponse?.access_token,
                    provider: 'google',
                }).unwrap()
                // dispatch(
                //     setCredentials({
                //         user: loginData?.data?.user,
                //         accessToken: loginData?.data?.token,
                //     }),
                // )
                // if(loginData.data.new_user){
                //     navigate("/get-started/interests", { replace: true })
                // } else {
                //     toast.success("Logged in successfully!");
                //     navigate("/", { replace: true })
                // }
            } catch (error) {
                const errorMessage = handleError(error)
                toast.error(errorMessage);
            }
        },
    });

    const responseFacebook = async (response) => {
        try {
            const loginData = await OauthLogin({
                token: response.accessToken,
                provider: 'facebook',
            }).unwrap()
            // dispatch(
            //     setCredentials({
            //         user: loginData?.data?.user,
            //         accessToken: loginData?.data?.token,
            //     }),
            // )
            // if(loginData.data.new_user){
            //     navigate("/get-started/interests", { replace: true })
            // } else {
            //     toast.success("Logged in successfully!");
            //     navigate("/", { replace: true })
            // }
        } catch (error) {
            const errorMessage = handleError(error)
            toast.error(errorMessage);
        }
    }

    const handleCancleSubscription = async () => {
        try {
            const res = await cancelSubscription(user?.data?.active_subscription?.id).unwrap();
            toast.success(res?.message)
            setCancelSubModal(false)
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage);
        }
    }

    const handleDeleteModal = () => {
        setOpenDeleteAccount((prev) => !prev)
    }
    const handleChangePasswordModal = () => {
        setChangePasswordModal((prev) => !prev)
    }
    const handleSubscriptionModal = () => {
        setCancelSubModal((prev) => !prev)
    }

    console.log(user)

    return (
        <div className="flex flex-col gap-12 py-8">
            <section className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-bold text-tblack-50">Email address</p>
                        <p className="text-sm font-normal">{currentUser?.email}</p>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-bold">Password</p>
                        <p className="text-sm font-normal">*****************</p>
                    </div>
                    <span onClick={handleChangePasswordModal} className='cursor-pointer border border-tgray-50 rounded-full py-1 flex items-center text-tblack-100 text-xs md:text-sm whitespace-nowrap px-2'>Change</span>
                </div>


                <div className="w-full flex flex-col md:flex-row gap-3 md:items-center justify-between border-t border-tgray-50 py-4">
                    <div className="flex flex-col gap-1">
                        <p className="text-lg font-bold uppercase">Your Subscription plan</p>
                        <span className="text-xs text-error-500 flex items-center gap-1">
                            <AlertCircle color="#FF0000" size={18} />
                            {user?.data?.active_subscription?.renewal_cancelled_at ? "Cancelled" : ""}
                        </span>
                    </div>
                    <section className="md:w-1/2">
                        {
                            user && (
                                user?.data?.active_subscription ?
                                    <PremiumSubCard
                                        plan={user?.data?.active_subscription?.plan?.name}
                                        renewal={moment(user?.data?.active_subscription?.expires_at).format("MMMM DD, YYYY")}
                                    />
                                    :
                                    <TalkAmPlusCard plan="Freemium" />)
                        }
                    </section>
                </div>

                {
                    user ? (
                        !user?.data?.active_subscription?.renewal_cancelled_at ?
                            <div className="w-full flex items-center justify-between border-y border-tgray-50 py-4">
                                <p onClick={() => setCancelSubModal((prev) => !prev)} className="text-sm text-tprimary-50 underline cursor-pointer">Cancel Subscription</p>
                                <p className="text-[10px] text-[#858585]">By clicking on cancel subscription, you agree that you have read TalkAM&apos;s <span className="text-tprimary-50">Cancelation Policy</span>.</p>
                            </div>
                            :
                            null
                    ) : null
                }

            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GoogleAuthButton onClick={() => googleLogin()} />
                <FacebookLogin
                    appId={import.meta.env.VITE_FACEBOOK_CLIENT_ID}
                    onSuccess={(response) => {
                        responseFacebook(response)
                    }}
                    render={(renderProps) => (
                        <FacebookAuthButton onClick={renderProps.onClick} />
                    )}
                />
                <AppleAuthButton />
            </section>

            <Button
                children="Delete Account"
                variant="link"
                className="!text-[#EE1414] underline font-bold text-sm"
                onClick={handleDeleteModal}
            />


            <Modal
                show={openDeleteAccount}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={handleDeleteModal}
                position='center'
                contentWidth='w-full md:w-2/4'
            >
                <DeleteAccountModal onClose={handleDeleteModal} />
            </Modal>

            <Modal
                show={changePasswordModal}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={handleChangePasswordModal}
                position='center'
                contentWidth='w-full md:w-2/4 lg:w-2/5'
            >
                <ChangePasswordModal onClose={handleChangePasswordModal} />
            </Modal>

            <Modal
                show={cancelSubModal}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={handleSubscriptionModal}
                position='center'
                contentWidth='w-full md:w-2/4 lg:w-2/5'
            >
                <CancelSubscriptionModal
                    handleCancelSub={handleCancleSubscription}
                    isLoading={isLoading}
                    onClose={handleSubscriptionModal}
                />
            </Modal>
        </div>
    )
}
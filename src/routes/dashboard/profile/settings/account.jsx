import FacebookLogin from "@greatsumini/react-facebook-login"
import { GoogleAuthButton } from "../../../../components/forms/socialbuttons/googleauthbutton"
import { FacebookAuthButton } from "../../../../components/forms/socialbuttons/facebookauthbutton"
import { AppleAuthButton } from "../../../../components/forms/socialbuttons/appleauthbutton"
import { useGoogleLogin } from "@react-oauth/google"
import { useOauthLoginMutation } from "../../../../services/authApiSlice"
import { useDispatch } from "react-redux"
import { toast } from "sonner"
import { handleError } from "../../../../utils/handleError"
import { Button } from "../../../../components/forms/button"
import { Modal } from "../../../../components/global/modal"
import { DeleteAccountModal } from "./deleteaccountmodal"
import { useState } from "react"
import { ChangePasswordModal } from "./changepasswordmodal"

export const AccountSettings = () => {

    const dispatch = useDispatch();
    const [ openDeleteAccount, setOpenDeleteAccount ] = useState(false);
    const [ changePasswordModal, setChangePasswordModal ] = useState(false);
    const [ OauthLogin, { isLoading: OauthLoading } ] = useOauthLoginMutation();

    const googleLogin = useGoogleLogin({
        onSuccess: async tokenResponse => {
            try {
                const loginData = await OauthLogin ({
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
            } catch(error){
                const errorMessage = handleError(error)
                toast.error(errorMessage);
            }
        },
    });

    const responseFacebook = async(response) => {
        try {
            const loginData = await OauthLogin ({
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
        } catch(error){
            const errorMessage = handleError(error)
            toast.error(errorMessage);
        }
    }

    const handleDeleteModal = () => {
        setOpenDeleteAccount((prev) => !prev)
    }
    const handleChangePasswordModal = () => {
        setChangePasswordModal((prev) => !prev)
    }

    return (
        <div className="flex flex-col gap-12 py-8">
            <section className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-bold text-tblack-50">Email address</p>
                        <p className="text-sm font-normal">janedough@email.com</p>
                    </div>
                    {/* <p to="settings" className='cursor-pointer border border-tgray-50 rounded-full px-2 py-1 flex items-center justify-between gap-2'>
                        <span className='text-tblack-100 text-xs md:text-sm whitespace-nowrap'>Change</span>
                    </p> */}
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-bold">Password</p>
                        <p className="text-sm font-normal">*****************</p>
                    </div>
                    <p onClick={handleChangePasswordModal} className='cursor-pointer border border-tgray-50 rounded-full px-2 py-1 flex items-center justify-between gap-2'>
                        <span className='text-tblack-100 text-xs md:text-sm whitespace-nowrap px-2'>Change</span>
                    </p>
                </div>
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
                contentWidth='w-full md:w-2/4'
            >
                <ChangePasswordModal onClose={handleChangePasswordModal} />
            </Modal>
        </div>
    )
}
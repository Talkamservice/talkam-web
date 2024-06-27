import React, { useState } from 'react'
import { Button } from '../../../components/forms/button';
import { TalkamLogo } from '../../../assets/icons/generated';
import { Otp } from '../../../components/forms/otpinput';
import { useLocation, useNavigate } from 'react-router-dom';
import { useResendOtpMutation, useVerifyOtpMutation } from '../../../services/authApiSlice';
import { toast } from 'sonner';
import { ColoredLoader } from '../../../components/global/loader';
import { motion } from 'framer-motion';
import { CardVariants } from '../../../helpers/cardanimation';

const typeMap = {
    "verify_email": "Verify Account",
    "password_reset": "Password Recovery"
}

export const Verification = () => {

    const navigate = useNavigate();
    const { state:locationState } = useLocation();
    const { emailValue, type } = locationState;
    const [code, setCode] = useState(null)
    const handleChange = (enteredOtp) => {
        setCode(enteredOtp);
    };

    const [ verifyOtp, { isLoading } ] = useVerifyOtpMutation();
    const [ resendOtp, { isLoading: resendLoading } ] = useResendOtpMutation();

    const verifyHandler = async(event) => {
        event.preventDefault();

        try {
            const verifyDetails = {
                email: emailValue,
                code: code,
                type: type
            }
            const email = await verifyOtp (verifyDetails).unwrap()
            toast.success(email.message);
            if(type === "password_reset"){
                navigate("/password-reset", { replace: true, state: code })
            } else {
                navigate("/get-started/interests", { replace: true})
            }
        } catch(error){
          toast.error(error?.data?.message);
        }
        setCode(null)
    }

    const resendHandler = async() => {
        setCode(null)
        try {
            const resendDetails = {
                email: emailValue,
                type: type
            }
            const response = await resendOtp (resendDetails).unwrap()
            toast.success(response.message);
        } catch(error){
          toast.error(error?.data?.message);
        }
    }

    let formIsValid = false;
    if(code && code.length >= 4){
        formIsValid = true
    }

    return (
        <main className='w-full h-[100dvh] flex items-center justify-center m-auto bg-twhite-100 p-2 sm:p-12'>
            <motion.div
                key="chatbox"
                variants={CardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                className='w-full h-full md:h-fit max-w-screen-2xl flex items-center justify-center md:w-2/3 xl:w-5/12 bg-twhite-100 p-4 md:p-12 rounded-2xl flex-col gap-6 rounded-2xl md:shadow-box'
            >
                <header className='w-full flex items-center justify-center flex-col gap-4'>
                    <div className='flex items-center gap-2'>
                        <TalkamLogo />
                        <p className='flex items-center text-xl'><span className='font-extrabold'>talk</span>AM</p>
                    </div>
                    <div className="flex items-center justify-center flex-col w-full gap-2">
                        <p className='text-lg font-bold text-tblack-100'>{typeMap[type]}</p>
                        <p className='text-sm text-tblack-100 text-center'>
                            Please enter the PIN we sent to <bold to='/login' className='text-sm font-bold'>{emailValue}</bold>.
                        </p>
                    </div>
                </header>

                <form onSubmit={verifyHandler} className='flex items-center justify-center flex-col gap-4 w-full'>
                    <Otp
                        value={code}
                        numInputs={4}
                        onChange={handleChange}
                        className="pb-6"
                    />
                    <div className='flex flex-col item-center justify-center text-center gap-3'>
                        <span className='text-doc-gray1 text-sm'>Haven’t received the PIN yet?</span>
                        <span onClick={resendHandler} className='w-full flex items-center justify-center underline cursor-pointer font-bold text-tprimary-50 text-sm'>
                            { 
                                resendLoading ? 
                                <ColoredLoader />
                                : 
                                'Resend PIN'
                            }
                        </span>
                    </div>

                    <Button 
                        variant="primary"
                        children="Verify"
                        disabled={!formIsValid}
                        isLoading={isLoading}
                        fullWidth
                    />
                </form>
            </motion.div>
        </main>
    )
}
import React from 'react'
import { Input } from '../../../components/forms/input'
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/forms/button';
import { TalkamLogo } from '../../../assets/icons/generated';
import { useForm } from '../../../hooks/useForm';
import { isEmail } from '../../../utils/formValidations';
import { toast } from 'sonner';
import { useForgotPasswordMutation } from '../../../services/authApiSlice';
import { motion } from 'framer-motion';
import { CardVariants } from '../../../helpers/cardanimation';
import { handleError } from '../../../utils/handleError';

export const Recovery = () => {

    const navigate = useNavigate();
    const {
        hasError: emailHasError, inputBlurHandler: emailBlurHandler,
        value: emailValue, valueChangeHandler: emailChangeHandler,
        reset: resetEmail, isValid: emailIsValid,
    } = useForm(isEmail);

    const [ forgotPassword, { isLoading } ] = useForgotPasswordMutation();

    const submitHandler = async (event) => {
        event.preventDefault();
        try {
            const res = await forgotPassword ({
                email: emailValue,
            }).unwrap()
            toast.success(res.message);
            navigate("/email-verification", { state: { emailValue: emailValue, type: "password_reset"} })
        } catch(error){
            const errorMessage = handleError(error)
            toast.error(errorMessage);
        }
        resetEmail();
    };

    let formIsValid = false;
    if(emailIsValid){
        formIsValid = true;
    };

    return (
        <main className='w-full h-[100dvh] flex items-center justify-center m-auto bg-twhite-100 p-2 sm:p-12'>
            <motion.div
                key="chatbox"
                variants={CardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                className='w-full h-full md:h-fit max-w-screen-2xl flex items-center justify-center md:w-2/3 xl:w-5/12 bg-twhite-100 p-4 md:p-12 flex-col gap-6 rounded-2xl md:shadow-box'
            >
                <header className='w-full flex items-center justify-center flex-col gap-4'>
                    <div className='flex items-center gap-2'>
                        <TalkamLogo />
                        <p className='flex items-center text-xl font-regularNunito'><span className='font-extraboldNunito'>talk</span>AM</p>
                    </div>
                    <div className="flex items-center justify-center flex-col w-full gap-2">
                        <p className='text-lg font-bold text-tblack-100'>Password Recovery</p>
                    </div>
                </header>

                <form onSubmit={submitHandler} className='flex items-center justify-center flex-col gap-4 w-full'>
                    <Input
                        wrapperClassName='w-full'
                        type="email"
                        label='Email'
                        placeholder='example@example.com'
                        onBlur={emailBlurHandler}
                        onChange={emailChangeHandler}
                        value={emailValue}
                        error={emailHasError}
                        errorText={emailHasError ? "Please Enter a Valid Email" : ""}
                        required
                    />

                    <p className='text-sm text-tblack-100'>
                        Remember password? <Link to="/login" className='text-[#017FC8] text-sm font-bold'>Login</Link>.
                    </p>

                    <Button
                        variant="primary"
                        children="Reset Password"
                        disabled={!formIsValid || isLoading}
                        isLoading={isLoading}
                        fullWidth
                    />
                </form>
            </motion.div>
        </main>
    )
}
import React, { useState } from 'react'
import { Input } from '../../../components/forms/input'
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/forms/button';
import { TalkamLogo } from '../../../assets/icons/generated';
import { useSignupMutation } from '../../../services/authApiSlice';
import { useForm } from '../../../hooks/useForm';
import { isEmail, isNotEmptyAndNoSpaces } from '../../../utils/formValidations';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../../services/authSlice';
import { CardVariants } from '../../../helpers/cardanimation';
import { motion } from 'framer-motion';
import { handleError } from '../../../utils/handleError';
import * as Icon from 'react-feather'

export const SignUp = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);

    const {
        hasError: emailHasError, inputBlurHandler: emailBlurHandler,
        value: emailValue, valueChangeHandler: emailChangeHandler,
        reset: resetEmail, isValid: emailIsValid,
    } = useForm(isEmail);

    const {
        hasError: passwordHasError, inputBlurHandler: passwordBlurHandler,
        value: passwordValue, valueChangeHandler: passwordChangeHandler,
        reset: resetPassword, isValid: passwordIsValid,
    } = useForm(isNotEmptyAndNoSpaces);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev)
    };
    const [signup, { isLoading }] = useSignupMutation();

    let formIsValid = false;
    if (emailIsValid && passwordIsValid) {
        formIsValid = true;
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        try {
            const userData = await signup({
                email: emailValue,
                password: passwordValue,
            }).unwrap()
            dispatch(
                setCredentials({
                    user: userData?.data?.user,
                    accessToken: userData?.data?.token,
                }),
            )
            toast.success("Account creation successfull!");
            navigate("/email-verification", { state: { emailValue: emailValue, type: "verify_email" } })
        } catch (error) {
            const errorMessage = handleError(error)
            toast.error(errorMessage);
        }
        resetEmail();
        resetPassword();
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
                className='w-full h-full md:h-fit max-w-screen-2xl flex items-center justify-center md:w-2/3 xl:w-5/12 bg-twhite-100 p-4 md:p-12 flex-col gap-6 rounded-2xl md:shadow-box'
            >
                <header className='w-full flex items-center justify-center flex-col gap-4'>
                    <div className='flex items-center gap-2'>
                        <TalkamLogo />
                        <p className='flex items-center text-xl font-regularNunito'><span className='font-extraboldNunito'>talk</span>AM</p>
                    </div>
                    <div className="flex items-center justify-center flex-col w-full gap-2 text-center">
                        <p className='text-lg font-bold text-tblack-100'>Create Account</p>
                        <p className='text-sm text-tblack-100'>
                            Already have an account? <Link to='/login' className='text-[#017FC8] text-sm font-bold'>Login</Link>.
                        </p>
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
                    <Input
                        wrapperClassName='relative w-full'
                        label='Password'
                        placeholder='********'
                        type={showPassword ? 'text' : 'password'}
                        onBlur={passwordBlurHandler}
                        onChange={passwordChangeHandler}
                        value={passwordValue}
                        error={passwordHasError}
                        required
                        errorText={passwordHasError ? "Please Enter a Password" : ""}
                        eye
                        icon={
                            showPassword ?
                                <Icon.EyeOff className='cursor-pointer' size={15} onClick={togglePasswordVisibility} />
                                :
                                <Icon.Eye className='cursor-pointer' size={15} onClick={togglePasswordVisibility} />
                        }
                    />

                    <Button
                        variant="primary"
                        children="Create Account"
                        disabled={!formIsValid}
                        isLoading={isLoading}
                        fullWidth
                    />
                </form>

                <p className='text-sm font-medium text-tblack-100 text-center'>
                    By continuing you consent to and agree to TalkAM&apos;s <Link to='' className='text-[#017FC8] text-sm font-bold'>Terms to Use </Link>
                    and <Link to='' className='text-[#017FC8] text-sm font-bold'> Privacy Policy</Link>
                </p>
            </motion.div>
        </main>
    )
}
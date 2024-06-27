import React, { useState } from 'react'
import { Input } from '../../../components/forms/input'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/forms/button';
import { TalkamLogo } from '../../../assets/icons/generated';
import { useForm } from '../../../hooks/useForm';
import { confirmPasswordMatches, isValidPassword, passwordMatcher } from '../../../utils/formValidations';
import { useResetPasswordMutation } from '../../../services/authApiSlice';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { CardVariants } from '../../../helpers/cardanimation';
import * as Icon from 'react-feather'

export const PasswordReset = () => {

    const { state: code } = useLocation();
    const navigate = useNavigate();
    const [touched, setTouched] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [showSecondPassword, setShowSecondPassword] = useState(false);

    const {
        value: enteredPassword,
        hasError: passwordHasError,
        valueChangeHandler: passwordChangeHandler,
        inputBlurHandler: passwordBlurHandler,
        reset: resetEnteredPassword,
    } = useForm(isValidPassword)
    
    const {
        value: enteredConfirmPassword,
        valueChangeHandler: confirmPasswordChangeHandler,
        inputBlurHandler: confirmPasswordBlurHandler,
        isValid: confirmPasswordIsValid,
        reset: resetConfirmPassword,
    } = useForm(confirmPasswordMatches(enteredPassword));

    const [ resetPassword, { isLoading } ] = useResetPasswordMutation();

    const handleSubmit = async(event) => {
        event?.preventDefault()
        try {
            const userData = {
                code: code,
                password: enteredPassword
            }
            const res = await resetPassword({ ...userData }).unwrap();
            toast.success(res.message);
            navigate("/login", { replace: true })
        } catch(err){
            toast.error(err?.data?.message);
        };
        resetEnteredPassword()
        resetConfirmPassword()
    }

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev)
    }

    const toggleSecondPasswordVisibility = () => {
        setShowSecondPassword(prev => !prev)
    }

    let isValid = passwordMatcher(enteredPassword, enteredConfirmPassword);

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
                        <p className='text-lg font-bold text-tblack-100'>Password Reset</p>
                        <p className='text-sm text-tblack-100'>
                            Already have an account? <Link to='/login' className='text-[#017FC8] text-sm font-bold'>Login</Link>.
                        </p>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className='flex items-center justify-center flex-col gap-4 w-full'>
                    <Input
                        wrapperClassName='relative w-full'
                        label='New Password'
                        placeholder='********'
                        type={showPassword ? 'text' : 'password'}
                        onBlur={passwordBlurHandler}
                        onChange={passwordChangeHandler}
                        value={enteredPassword}
                        error={passwordHasError}
                        required
                        errorText={passwordHasError ? "Password Must contain at least a number, an upperCase character and a special character (!, @, #, $, %, &, *)" : ""}
                        eye
                        icon = {
                            showPassword ?  
                            <Icon.EyeOff className='cursor-pointer' size={15} onClick={togglePasswordVisibility} /> 
                            : 
                            <Icon.Eye className='cursor-pointer' size={15} onClick={togglePasswordVisibility} />
                        }
                    />

                    <Input
                        onFocus={() => {
                            setTimeout(() => {
                              setTouched(true);
                            }, 3000)
                          }}
                        wrapperClassName='relative w-full'
                        label='Confirm password'
                        placeholder='********'
                        required
                        value={enteredConfirmPassword}
                        onChange={confirmPasswordChangeHandler}
                        onBlur={confirmPasswordBlurHandler}
                        error={touched && !confirmPasswordIsValid}
                        errorText={touched && !confirmPasswordIsValid ? "Passwords do not match" : null}
                        type={showSecondPassword ? 'text' : 'password'}
                        eye
                        icon = {
                            showSecondPassword ?  
                            <Icon.EyeOff className='cursor-pointer' size={15} onClick={toggleSecondPasswordVisibility} /> 
                            : 
                            <Icon.Eye className='cursor-pointer' size={15} onClick={toggleSecondPasswordVisibility} />
                        }
                    />

                    <Button
                        variant="primary"
                        children="Update Password"
                        disabled={!isValid || isLoading}
                        isLoading={isLoading}
                        fullWidth
                    />
                </form>
            </motion.div>
        </main>
    )
}
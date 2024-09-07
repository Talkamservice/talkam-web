import React, { useState } from 'react'
import { Input } from '../../../components/forms/input'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../../components/forms/button';
import { TalkamLogo } from '../../../assets/icons/generated';
import { GoogleAuthButton } from '../../../components/forms/socialbuttons/googleauthbutton';
import { FacebookAuthButton } from '../../../components/forms/socialbuttons/facebookauthbutton';
import { AppleAuthButton } from '../../../components/forms/socialbuttons/appleauthbutton';
import { useForm } from '../../../hooks/useForm';
import { isNotEmpty } from '../../../utils/formValidations';
import { useLoginMutation, useOauthLoginMutation } from '../../../services/authApiSlice';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../../services/authSlice';
import { useGoogleLogin } from '@react-oauth/google';
import { TiktokAuthButton } from '../../../components/forms/socialbuttons/titktokauthbutton';
import { CardVariants } from '../../../helpers/cardanimation';
import { handleError } from '../../../utils/handleError';
import FacebookLogin from '@greatsumini/react-facebook-login';
import * as Icon from 'react-feather'

export const ModalLogin = ({ onClose }) => {

    const { pathname } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);

    const {
        hasError: emailHasError, inputBlurHandler: emailBlurHandler,
        value: emailValue, valueChangeHandler: emailChangeHandler,
        reset: resetEmail, isValid: emailIsValid,
    } = useForm(isNotEmpty);

    const {
        hasError: passwordHasError, inputBlurHandler: passwordBlurHandler,
        value: passwordValue, valueChangeHandler: passwordChangeHandler,
        reset: resetPassword, isValid: passwordIsValid,
    } = useForm(isNotEmpty);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev)
    };

    const handleCloseModal = (event) => {
        event.stopPropagation();
        onClose()
    }

    const [login, { isLoading }] = useLoginMutation();
    const [OauthLogin, { isLoading: OauthLoading }] = useOauthLoginMutation();

    let formIsValid = false;
    if (emailIsValid && passwordIsValid) {
        formIsValid = true;
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        try {
            const userData = await login({
                input: emailValue,
                password: passwordValue,
            }).unwrap()
            dispatch(
                setCredentials({
                    user: userData?.data?.user,
                    accessToken: userData?.data?.token,
                }),
            );
            resetEmail();
            resetPassword();
            toast.success("Logged in successfully!");
            navigate(`${pathname}`, { replace: true })
            onClose()
        } catch (error) {
            const errorMessage = handleError(error)
            toast.error(errorMessage);
        }
    };


    const googleLogin = useGoogleLogin({
        onSuccess: async tokenResponse => {
            try {
                const loginData = await OauthLogin({
                    token: tokenResponse?.access_token,
                    provider: 'google',
                }).unwrap()
                dispatch(
                    setCredentials({
                        user: loginData?.data?.user,
                        accessToken: loginData?.data?.token,
                    }),
                )
                if (loginData.data.new_user) {
                    navigate("/get-started/interests", { replace: true })
                } else {
                    toast.success("Logged in successfully!");
                    navigate("/", { replace: true })
                }
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
            dispatch(
                setCredentials({
                    user: loginData?.data?.user,
                    accessToken: loginData?.data?.token,
                }),
            )
            if (loginData.data.new_user) {
                navigate("/get-started/interests", { replace: true })
            } else {
                toast.success("Logged in successfully!");
                navigate("/", { replace: true })
            }
        } catch (error) {
            const errorMessage = handleError(error)
            toast.error(errorMessage);
        }
    }

    const handleTikTokLogin = () => {
        const clientKey = import.meta.env.VITE_TIKTOK_CLIENT_ID;
        const redirectUri = encodeURIComponent('https://localhost:5173/login/tiktok-callback');
        // random state token for CSRF protection
        const state = Math.random().toString(36).substring(2);

        const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&response_type=code&redirect_uri=${redirectUri}&state=${state}`;
        window.location.href = authUrl
    };

    return (
        <main className='w-full flex items-center justify-center m-auto bg-twhite-100 p-2 sm:p-8 no-scrollbar'>
            <motion.div
                key="chatbox"
                variants={CardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                className='w-full h-full flex items-center justify-center bg-twhite-100 p-4 rounded-2xl flex-col gap-6'
            >
                <header className='w-full flex items-center justify-center flex-col gap-4'>
                    <div className='flex items-center gap-2'>
                        <TalkamLogo />
                        <p className='flex items-center text-xl font-regularNunito'><span className='font-extraboldNunito'>talk</span>AM</p>
                    </div>
                    <div className="flex items-center justify-center flex-col w-full gap-2 text-center">
                        <p className='text-lg font-bold text-tblack-100'>Login</p>
                        <p className='text-sm text-tblack-100'>
                            Don&apos;t have an account? <Link to="/sign-up" className='text-[#017FC8] text-sm font-bold'>Create one</Link>.
                        </p>
                    </div>
                </header>

                <form onSubmit={submitHandler} className='flex items-center justify-center flex-col gap-4 w-full'>
                    <Input
                        wrapperClassName='w-full'
                        type="text"
                        label='Username/Email'
                        placeholder='example@example.com'
                        onBlur={emailBlurHandler}
                        onChange={emailChangeHandler}
                        value={emailValue}
                        error={emailHasError}
                        errorText={emailHasError ? "Please Enter a Valid Email/Username" : ""}
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

                    <p className='text-sm text-tblack-100 text-center'>
                        Forgot your password? <Link to='/recover-password' className='text-[#017FC8] text-sm font-bold'>Recover password</Link>.
                    </p>

                    <Button
                        variant="primary"
                        children="Login"
                        disabled={!formIsValid || isLoading}
                        isLoading={isLoading}
                        fullWidth
                    />

                    <section className='w-full flex flex-col gap-3 pt-6'>
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
                        {/* <AppleAuthButton /> */}
                        {/* <TiktokAuthButton onClick={handleTikTokLogin} /> */}
                        <Button
                            type="button"
                            variant="error-outline"
                            fullWidth
                            onClick={(event) => handleCloseModal(event)}
                        >
                            Cancel
                        </Button>
                    </section>
                </form>
            </motion.div>
        </main>
    )
}
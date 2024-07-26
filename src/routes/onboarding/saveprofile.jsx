import React, { useState } from 'react'
import { Button } from '../../components/forms/button';
import { TalkamLogo, UploadAvatarIcon } from '../../assets/icons/generated';
import { Input } from '../../components/forms/input';
import { Avatar } from '../../components/global/avatar';
import { CardVariants } from '../../helpers/cardanimation';
import { motion } from 'framer-motion';
import { useForm } from '../../hooks/useForm';
import { isNotEmpty } from '../../utils/formValidations';
import { useGetAvatarsQuery, useUpdateProfileMutation } from '../../services/userApiSlice';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../components/global/modal';
import { ChooseAvatarModal } from './avatarmodal';
import { selectCurrentUser, setCredentials } from '../../services/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Protected from '../../utils/protected';

export const SaveProfile = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const token = useSelector(selectCurrentToken)
    const [ openAvatarModal, setOpenAvatarModal ] = useState();
    const [profileImage, setProfileImage] = useState(null);
    const {
        hasError: userNameHasError, inputBlurHandler: userNameBlurHandler,
        value: userNameValue, valueChangeHandler: userNameChangeHandler,
        reset: resetUserName, isValid: userNameIsValid,
    } = useForm(isNotEmpty);

    const { data:avatars, isLoading:loadingAvatars } = useGetAvatarsQuery();
    const [ updateProfile, { isLoading } ] = useUpdateProfileMutation();

    const toggleModal = () => {
        setOpenAvatarModal(prev => !prev)
    }

    const handleAvatarSelect = (avatar) => {
        setProfileImage(() => avatar.image)
        setOpenAvatarModal(false)
    }

    const submitHandler = async(event) => {
        event.preventDefault();
        try {
            const res = await updateProfile({ username: userNameValue, avatar: profileImage }).unwrap();
            dispatch(setCredentials({
                user: {...currentUser, avatar: profileImage},
                accessToken: token,
            }))
            toast.success(res?.message);
            navigate('/home/featured', { replace: true })
        } catch(err) {
            const errorMessage = handleError(err);
            toast.error(errorMessage)
        }
        resetUserName();
    }

    let formIsValid = false;

    if(userNameIsValid && profileImage) {
        formIsValid = true
    }

    return (
        <Protected>
            <main className='w-full min-h-[100dvh] flex items-center justify-center m-auto bg-twhite-100 p-2 sm:p-12'>
                <motion.div
                    key="chatbox"
                    variants={CardVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    className='w-full h-full md:h-fit max-w-screen-2xl flex items-center justify-center md:w-2/3 xl:w-5/12 p-4 md:p-12 bg-twhite-100 flex-col gap-8 rounded-2xl md:shadow-box'
                >
                    <header className='w-full flex items-center justify-center flex-col gap-8 pt-4 px-4'>
                        <div className='flex items-center gap-2'>
                            <TalkamLogo />
                            <p className='flex items-center text-xl font-regularNunito'><span className='font-extraboldNunito'>talk</span>AM</p>
                        </div>
                        <div className="flex items-center justify-center flex-col w-full gap-2 text-center">
                            <p className='text-lg font-bold text-tblack-100'>Profile</p>
                            <p className='text-sm text-tblack-100 text-center'>
                                We&apos;ll use this to recommend groups you can join.
                            </p>
                        </div>
                    </header>

                    <form onSubmit={submitHandler} className='w-full flex flex-col items-center justify-center gap-8'>
                        <section className='flex flex-col items-center justify-center gap-2'>
                            <Avatar src={profileImage} size="xl" />

                            <label onClick={toggleModal} className='cursor-pointer border border-tgray-50 rounded-full p-2 flex items-center justify-between gap-2'>
                                <UploadAvatarIcon />
                                <span className='text-tblack-100 text-sm'>Choose an avatar</span>
                            </label>
                        </section>
                        <Input
                            wrapperClassName='relative w-full'
                            label='Username'
                            placeholder='Chuck Norris'
                            type="text"
                            onBlur={userNameBlurHandler}
                            onChange={userNameChangeHandler}
                            value={userNameValue}
                            error={userNameHasError}
                            required
                            errorText={userNameHasError ? "Please Enter a valid username" : ""}
                        />

                        <Button
                            children="Save & Continue"
                            variant="primary"
                            fullWidth
                            disabled={!formIsValid || isLoading}
                            isLoading={isLoading}
                        />
                    </form>
                </motion.div>
            </main>
            <Modal
                show={openAvatarModal}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={toggleModal}
                position='center'
                contentWidth='w-full md:w-3/4'
            >
                <ChooseAvatarModal
                    avatars={avatars}
                    isLoading={loadingAvatars}
                    handleAvatarSelect={handleAvatarSelect}
                />
            </Modal>
        </Protected>
    )
}
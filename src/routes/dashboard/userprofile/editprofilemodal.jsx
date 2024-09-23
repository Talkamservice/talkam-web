
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentToken, selectCurrentUser, setCredentials } from '../../../services/authSlice';
import { useForm } from '../../../hooks/useForm';
import { isNotEmptyAndNoSpaces } from '../../../utils/formValidations';
import { useGetAvatarsQuery, useUpdateProfileMutation } from '../../../services/userApiSlice';
import { toast } from 'sonner';
import { handleError } from '../../../utils/handleError';
import { motion } from 'framer-motion';
import { TalkamLogo, UploadAvatarIcon } from '../../../assets/icons/generated';
import { CardVariants } from '../../../helpers/cardanimation';
import { Avatar } from '../../../components/global/avatar';
import { Input } from '../../../components/forms/input';
import { Modal } from '../../../components/global/modal';
import { ChooseAvatarModal } from '../../onboarding/avatarmodal';
import { Button } from '../../../components/forms/button';

export const EditProfileModal = ({ onClose, user }) => {

    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const token = useSelector(selectCurrentToken)
    const [openAvatarModal, setOpenAvatarModal] = useState();
    const [profileImage, setProfileImage] = useState(user?.data?.avatar ?? null);
    const {
        hasError: userNameHasError, inputBlurHandler: userNameBlurHandler,
        value: userNameValue, valueChangeHandler: userNameChangeHandler,
        reset: resetUserName, isValid: userNameIsValid,
    } = useForm(isNotEmptyAndNoSpaces);

    const { data: avatars, isLoading: loadingAvatars } = useGetAvatarsQuery();
    const [updateProfile, { isLoading }] = useUpdateProfileMutation();

    const toggleModal = () => {
        setOpenAvatarModal(prev => !prev)
    }

    const handleAvatarSelect = (avatar) => {
        setProfileImage(() => avatar.image)
        setOpenAvatarModal(false)
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        try {
            const updateObject = {
                username: (!userNameValue || userNameValue === "") ? currentUser?.username : userNameValue,
                avatar: profileImage ?? currentUser?.avatar
            }
            const res = await updateProfile({ ...updateObject }).unwrap();
            dispatch(setCredentials({
                user: { ...currentUser, ...updateObject },
                accessToken: token,
            }))
            toast.success(res?.message);
            onClose();
        } catch (err) {
            const errorMessage = handleError(err);
            toast.error(errorMessage)
        }
        resetUserName();
    }

    return (
        <main className='w-full flex items-center justify-center m-auto bg-twhite-100 p-4 sm:p-12'>
            <motion.div
                key="chatbox"
                variants={CardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                className='w-full flex items-center justify-center flex-col gap-8'
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

                <form id='edit' onSubmit={submitHandler} className='w-full flex flex-col items-center justify-center gap-8'>
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
                        placeholder={user?.data?.username ?? user?.data?.name}
                        type="text"
                        onBlur={userNameBlurHandler}
                        onChange={userNameChangeHandler}
                        value={userNameValue}
                        error={userNameHasError}
                        required
                        errorText={userNameHasError ? "Please Enter a valid username" : ""}
                    />

                    <footer className='w-full flex item-center gap-4'>
                        <Button
                            children="Cancel"
                            variant="outline"
                            fullWidth
                            onClick={onClose}
                        />
                        <Button
                            form="edit"
                            children="Save & Continue"
                            variant="primary"
                            fullWidth
                            disabled={(userNameValue && !userNameIsValid || !profileImage) || isLoading}
                            isLoading={isLoading}
                        />
                    </footer>
                </form>
            </motion.div>
            <Modal
                show={openAvatarModal}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={toggleModal}
                position='center'
                contentWidth='w-full md:w-3/5'
            >
                <ChooseAvatarModal
                    onClose={toggleModal}
                    avatars={avatars}
                    isLoading={loadingAvatars}
                    handleAvatarSelect={handleAvatarSelect}
                />
            </Modal>
        </main>
    )
}

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentToken, selectCurrentUser, setCredentials } from '../../../services/authSlice';
import { useForm } from '../../../hooks/useForm';
import { isNoSpaces, isNotEmptyAndNoSpaces } from '../../../utils/formValidations';
import { useGetAvatarsQuery, useGetCountriesQuery, useGetStatesQuery, useUpdateProfileMutation } from '../../../services/userApiSlice';
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
import { DropDownSelect } from '../../../components/forms/dropdown';
import { Datepicker } from 'flowbite-react';
import { themeOptions } from '../../../utils/calendarTheme';
import { randomId } from '../../../helpers/randomid';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const genderOptions = [
    {
        id: randomId(),
        name: "Male",
        value: "Male"
    },
    {
        id: randomId(),
        name: "Female",
        value: "Female"
    },
    {
        id: randomId(),
        name: "Others",
        value: "Others"
    },
    {
        id: randomId(),
        name: "Choose not to specify",
        value: "Choose not to specify"
    },
]

export const EditProfileModal = ({ onClose, user }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const token = useSelector(selectCurrentToken)
    const [openAvatarModal, setOpenAvatarModal] = useState();
    const [openDOBModal, setOpenDOBModal] = useState();
    const [dateOfBirth, setDateOfBirth] = useState(user?.data?.date_of_birth);
    const [countrySearch, setCountrySearch] = useState("")
    const [country, setCountry] = useState(user?.data?.country);
    const [locationState, setLocationState] = useState(user?.data?.state);
    const [stateSearch, setStateSearch] = useState("");
    const [gender, setGender] = useState(user?.data?.gender);
    const [profileImage, setProfileImage] = useState(user?.data?.avatar ?? null);
    const {
        hasError: userNameHasError, inputBlurHandler: userNameBlurHandler,
        value: userNameValue, valueChangeHandler: userNameChangeHandler,
        reset: resetUserName, isValid: userNameIsValid,
    } = useForm(isNoSpaces);

    const { data: avatars, isLoading: loadingAvatars } = useGetAvatarsQuery();
    const { data: countries, isFetching: loadingCountries } = useGetCountriesQuery({
        search: countrySearch
    });
    const { data: states, isFetching: loadingStates } = useGetStatesQuery({
        countryId: country?.id,
        search: stateSearch
    }, { skip: !country?.id })
    const [updateProfile, { isLoading }] = useUpdateProfileMutation();

    const toggleModal = () => {
        setOpenAvatarModal(prev => !prev)
    }

    const toggleDOBModal = () => {
        setOpenDOBModal(prev => !prev)
    }

    const handleAvatarSelect = (avatar) => {
        setProfileImage(() => avatar.image)
        setOpenAvatarModal(false)
    }

    const handleSelectGender = (option) => {
        setGender(option.value)
    }

    const handleDatePicker = (SelectedDate) => {
        const date = moment(SelectedDate).format("YYYY-MM-DD")
        setDateOfBirth(date)
    }

    const handleCountrySearch = (event) => {
        setCountrySearch(event.target.value)
    }

    const handleSelectCountry = (option) => {
        setCountry(option)
    }

    const handleLocationStateSearch = (event) => {
        setStateSearch(event.target.value)
    }

    const handleSelectState = (option) => {
        setLocationState(option)
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        try {
            const updateObject = {
                username: (!userNameValue || userNameValue === "") ? currentUser?.username : userNameValue,
                avatar: profileImage ?? currentUser?.avatar,
                date_of_birth: dateOfBirth ?? currentUser?.date_of_birth,
                country_id: country?.id,
                state_id: locationState?.id,
                gender: gender
            }
            const res = await updateProfile({ ...updateObject }).unwrap();
            dispatch(setCredentials({
                user: { ...currentUser, ...updateObject },
                accessToken: token,
            }))
            navigate(`/userprofile/${(!userNameValue || userNameValue === "") ? currentUser?.username : userNameValue}`, { replace: true })
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

                <form id='edit' onSubmit={submitHandler} className='w-full flex flex-col items-center justify-center gap-4'>
                    <section className='flex flex-col items-center justify-center gap-2'>
                        <Avatar src={profileImage} size="xl" />

                        <label onClick={toggleModal} className='cursor-pointer border border-tgray-50 rounded-full p-2 flex items-center justify-between gap-2'>
                            <UploadAvatarIcon />
                            <span className='text-tblack-100 text-sm'>Choose an avatar</span>
                        </label>
                    </section>
                    <Input
                        wrapperClassName='relative w-full'
                        label='Username (No spaces)'
                        placeholder={user?.data?.username ?? user?.data?.name}
                        type="text"
                        onBlur={userNameBlurHandler}
                        onChange={userNameChangeHandler}
                        value={userNameValue}
                        error={userNameHasError}
                        required
                        errorText={userNameHasError ? "Please Enter a valid username" : ""}
                    />

                    <DropDownSelect
                        label="Gender"
                        defaultValue={(gender && gender !== "") ? gender : "gender"}
                        options={genderOptions}
                        onChange={handleSelectGender}
                    />
                    <Input
                        wrapperClassName="relative w-full"
                        label="Date of Birth"
                        placeholder="dd/mm/yyyy"
                        value={dateOfBirth || ""}
                        onFocus={() => setOpenDOBModal(true)}
                        readOnly
                    />

                    {/* <Input
                        wrapperClassName='relative w-full'
                        label='Date of Birth'
                        placeholder={(dateOfBirth && dateOfBirth !== "") ? dateOfBirth : "dd/mm/yyyy"}
                        onFocus={() => setOpenDOBModal(true)}
                    /> */}
                    <DropDownSelect
                        label="Country"
                        defaultValue={country?.name ?? "country"}
                        options={countries?.data}
                        isLoading={loadingCountries}
                        onChange={handleSelectCountry}
                        search
                        searchChange={handleCountrySearch}
                        searchValue={countrySearch}
                    />
                    <DropDownSelect
                        label={`State (${country?.name ?? "country"})`}
                        defaultValue={locationState?.name ?? "State"}
                        options={states?.data}
                        isLoading={loadingStates}
                        onChange={handleSelectState}
                        search
                        searchChange={handleLocationStateSearch}
                        searchValue={stateSearch}
                    />

                    <footer className='w-full flex item-center gap-4 pt-8'>
                        <Button
                            children="Cancel"
                            variant="error-outline"
                            fullWidth
                            onClick={onClose}
                        />
                        <Button
                            form="edit"
                            children="Save & Continue"
                            variant="primary"
                            fullWidth
                            disabled={((userNameValue && !userNameIsValid) || isLoading)}
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

            <Modal
                show={openDOBModal}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={toggleDOBModal}
                position='center'
                contentWidth='w-full md:w-2/5'
            >
                <div className='flex flex-col gap-8 p-6'>
                    <Datepicker
                        inline
                        className='w-full'
                        theme={themeOptions}
                        maxDate={new Date()}
                        onSelectedDateChanged={handleDatePicker}

                    />
                    <footer className='flex items-center gap-4'>
                        <Button
                            fullWidth
                            onClick={toggleDOBModal}
                        >
                            Done
                        </Button>
                        <Button
                            fullWidth
                            variant="error"
                            onClick={() => { setDateOfBirth("dd/mm/yyyy"); setOpenDOBModal(false) }}
                        >
                            Cancel
                        </Button>
                    </footer>
                </div>
            </Modal>
        </main>
    )
}
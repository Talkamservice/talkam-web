import { Suspense, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { GroupAddIcon, InboxIcon, LatestEventsIcon, NotificationIcon, TalkamLogo, UsersIcon } from '../../assets/icons/generated';
import { SideBarItem } from '../global/sidebarItem';
import { Button } from '../forms/button';
import { NavSearch } from '../forms/navsearchbar';
import { useFollowingCategoriesQuery, useGetCategoriesQuery, useGetUserProfileDetailsQuery } from '../../services/userApiSlice';
import { ColoredLoader } from '../global/loader';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../services/authSlice';
import { Avatar } from '../global/avatar';
import { motion } from 'framer-motion';
import { downVariants } from '../../helpers/cardanimation';
import { UserPopUp } from './components/userpopup';
import { useOnOutsideClick } from '../../hooks/useOnOutsideClick';
import { Modal } from '../global/modal';
import { useResendOtpMutation } from '../../services/authApiSlice';
import { toast } from 'sonner';
import { handleError } from '../../utils/handleError';
import { Messages } from '../../routes/dashboard/messages/messages';
import { DrawerModal } from '../global/drawer';
import * as Icon from 'react-feather'

export const MainAppLayout = ({ children }) => {

    let isMobile = useMediaQuery("(max-width: 1024px)");
    let isLogoMobile = useMediaQuery("(max-width: 425px)");

    const navigate = useNavigate();
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search);
    const currentUser = useSelector(selectCurrentUser)
    const popUpRef = useRef();
    const [showPanel, setShowPanel] = useState(false);
    const [profileMenu, setProfileMenu] = useState(false);
    const [verifyModal, setVerifyModal] = useState(false);

    const { data: categories, isLoading: loadingCategories } = useGetCategoriesQuery({
        sort: 'popular'
    });
    const { data: followingCategories, isLoading: followingCategoriesLoading } = useFollowingCategoriesQuery();
    const [resendOtp, { isLoading: resendLoading }] = useResendOtpMutation();
    const { data: user } = useGetUserProfileDetailsQuery(currentUser?.id, {
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    });

    useOnOutsideClick(popUpRef, () => {
        setProfileMenu(() => false)
    })

    const verifyAccountHandler = async () => {
        try {
            const resendDetails = {
                email: currentUser?.email,
                type: "verify_email"
            }
            const response = await resendOtp(resendDetails).unwrap()
            toast.success(response.message);
            navigate("/email-verification", { state: { emailValue: resendDetails?.email, type: "verify_email" } })
        } catch (error) {
            const errorMessage = handleError(error)
            toast.error(errorMessage);
        }
    }

    const toggleShowPanel = () => {
        setShowPanel((prev) => !prev);
    };
    const showProfileMenu = () => {
        setProfileMenu((prev) => !prev)
    }

    const toggleVerifyModal = () => {
        setVerifyModal((prev) => !prev)
    }

    useEffect(() => {
        if (user) {
            if (!user?.data?.email_verified_at) {
                setVerifyModal(() => true)
            }
        };
    }, [user]);

    return (
        <Suspense fallback={<ColoredLoader />}>
            <section className='w-full flex items-center justify-center no-scrollbar'>
                <main className='w-full relative h-dvh no-scrollbar max-w-screen-2xl no-scrollbar'>
                    {/* Mobile header */}
                    <header className={`sticky w-full flex items-center justify-between gap-8 sm:gap-4 border-b border-tgray-light bg-white z-40 px-6 lg:px-24 h-[7dvh] py-2 top-0`}>
                        <div onClick={() => { navigate('/home'); setShowPanel(false); }} className="flex items-center gap-2 cursor-pointer">
                            <TalkamLogo width={isMobile ? 25 : 35} height={isMobile ? 30 : 40} />
                            <p className={` ${!isLogoMobile ? 'block' : 'hidden'} flex items-center text-xl font-regularNunito`}><span className='font-extraboldNunito'>talk</span>AM</p>
                        </div>
                        <section className='w-10/12 md:w-9/12 flex items-center justify-end gap-6 md:gap-8 no-scrollbar'>
                            <section className={`${isMobile ? "" : "flex-1"} flex items-center gap-5 md:gap-8`}>
                                {isMobile ?
                                    <Icon.Search
                                        onClick={() => navigate('/search')}
                                        className={`${isMobile ? 'w-5 h-5' : 'w-7 h-7'}`}
                                    />
                                    :
                                    <NavSearch />
                                }
                                <NotificationIcon className={`cursor-pointer ${isMobile ? 'w-5 h-5' : 'w-7 h-7'}`} />
                                <InboxIcon
                                    onClick={() => {
                                        navigate({
                                            pathname: `${location.pathname}/`,
                                            search: `?messages=true`,
                                        });
                                        setShowPanel(false);
                                    }}
                                    className={`cursor-pointer ${isMobile ? 'w-5 h-5' : 'w-7 h-7'}`}
                                />
                            </section>
                            <section className='flex items-center gap-5 md:gap-8'>
                                <Button
                                    children={isMobile ? "" : "Post"}
                                    leftIcon={< Icon.Plus size={isMobile ? 16 : 20} />}
                                    className={isMobile ? "!rounded-full !text-base bg-tprimary-50 !p-1" : "!rounded-full !text-base bg-tprimary-50 !px-4 !py-2.5"}
                                    onClick={() => { navigate('/create-post'); setShowPanel(false) }}
                                />
                                <div ref={popUpRef} className='cursor-pointer relative'>
                                    <Avatar

                                        onClick={showProfileMenu} src={currentUser?.avatar}
                                        size={isMobile ? "xs" : "sm"}
                                    />
                                    {
                                        profileMenu ?
                                            <motion.div
                                                variants={downVariants}
                                                initial="initial"
                                                animate="animate"
                                                exit="exit"
                                                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                                                className="absolute top-14 -right-12 z-40"
                                            >
                                                <UserPopUp
                                                    currentUser={currentUser}
                                                    toggleShowPanel={() => setShowPanel(false)}
                                                    close={showProfileMenu}
                                                />
                                            </motion.div>
                                            :
                                            null
                                    }
                                </div>
                                <Icon.Menu
                                    className={`${isMobile ? 'block' : 'hidden'}`}
                                    width={24}
                                    height={24}
                                    color="black"
                                    onClick={toggleShowPanel}
                                    size={isMobile ? 15 : 18}
                                />
                            </section>
                        </section>
                    </header>

                    <div className=" relative flex no-scrollbar h-[calc(100dvh-7dvh)]">
                        <div
                            className={`fixed inset-0 z-[38] backdrop-blur-sm bg-tgray-300 lg:hidden`}
                            style={{
                                opacity: 0.8,
                                display: isMobile && showPanel ? "block" : "none",
                            }}
                            aria-hidden="true"
                            onClick={toggleShowPanel}
                        ></div>

                        <aside
                            className={`fixed border-r border-tgray-light inset-y-0 z-[38] lg:absolute w-80 sm:w-96 no-scrollbar overflow-y-auto bg-white sm:pl-20 pr-6
                        ${isMobile && !showPanel && "hidden"}`}
                        >
                            <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
                                <nav className={`flex-1 no-scrollbar ${isMobile && 'pt-14'} `}>
                                    <section className='w-full flex flex-col items-start gap-3 border-b border-tgray-200 py-6 pl-4 pb-4'>
                                        <h1 className='text-base font-bold'>Your subcategories</h1>
                                        <ul className='w-full flex flex-col gap-2'>
                                            {
                                                followingCategoriesLoading ?
                                                    <section className='w-full flex items-center justify-center m-auto'>
                                                        <ColoredLoader />
                                                    </section>
                                                    :
                                                    followingCategories?.data.slice(0, 5).map((item) => (
                                                        <SideBarItem
                                                            key={item.id}
                                                            children={item.name}
                                                            image={item.icon_image ?? <LatestEventsIcon />}
                                                            url={`/category/${item?.id}`}
                                                            onClick={() => setShowPanel(false)}
                                                        />
                                                    ))
                                            }
                                        </ul>
                                    </section>

                                    <section className='flex flex-col items-start gap-3 border-b border-tgray-200 py-6 pl-4 pb-4'>
                                        <h1 className='text-base font-bold'>Groups</h1>
                                        <Button
                                            variant="outline"
                                            fullWidth
                                            children="Create group"
                                            rightIcon={<GroupAddIcon />}
                                            className="flex items-center justify-between text-sm !p-2 !px-3"
                                            onClick={() => { navigate('/create-group'); setShowPanel(false); }}
                                        />
                                        <Button
                                            variant="outline"
                                            fullWidth
                                            children="See all groups"
                                            rightIcon={<Icon.ArrowRight />}
                                            className="flex items-center justify-between !text-sm !p-2 !px-3 !border-none"
                                            onClick={() => { navigate('/groups'); setShowPanel(false); }}
                                        />
                                    </section>

                                    <section className='w-full flex flex-col items-start gap-3 border-b border-tgray-200 py-6 pl-4 pb-4'>
                                        <h1 className='text-base font-bold'>Popular subcategories</h1>
                                        <ul className='w-full flex flex-col gap-2'>
                                            {
                                                loadingCategories ?
                                                    <section className='w-full flex items-center justify-center m-auto'>
                                                        <ColoredLoader />
                                                    </section>
                                                    :
                                                    categories?.data.slice(0, 5).map((item) => (
                                                        <SideBarItem
                                                            key={item.id}
                                                            children={item.name}
                                                            image={item.icon_image ?? <LatestEventsIcon />}
                                                            url={`/category/${item?.id}`}
                                                            onClick={() => setShowPanel(false)}
                                                        />
                                                    ))
                                            }
                                        </ul>
                                        <Button
                                            variant="link"
                                            fullWidth
                                            children="See all categories"
                                            rightIcon={<Icon.ArrowRight />}
                                            className="flex items-center justify-between !text-sm !py-0 !px-0"
                                            onClick={() => { navigate('/categories'); setShowPanel(false); }}
                                        />
                                    </section>

                                    <section className='flex flex-col items-start gap-3 border-b border-tgray-200 py-6 pl-4 pb-4'>
                                        <Button
                                            variant="link"
                                            fullWidth
                                            children="Help & Support"
                                            className="flex items-center justify-between !text-sm !py-0 !px-0"
                                        />
                                        <Button
                                            variant="link"
                                            fullWidth
                                            children="Content policy"
                                            className="flex items-center justify-between !text-sm !py-0 !px-0"
                                        />
                                        <Button
                                            variant="link"
                                            fullWidth
                                            children="About"
                                            className="flex items-center justify-between !text-sm !py-0 !px-0"
                                        />
                                        <Button
                                            variant="link"
                                            fullWidth
                                            children="Report a problem"
                                            className="flex items-center justify-between !text-sm !py-0 !px-0"
                                        />
                                    </section>
                                </nav>
                            </div>
                        </aside>

                        <main className={`flex-1 w-full h-full ${!isMobile && " pl-80 sm:pl-96"} no-scrollbar`}>
                            {/* main content */}
                            <div className="flex flex-col flex-1 h-full overflow-x-hidden overflow-auto no-scrollbar body-font font-normal text-tblack-100">
                                <Outlet />
                            </div>
                        </main>
                    </div>
                </main>

                <Modal
                    show={verifyModal}
                    shouldCloseOnEscPress={false}
                    shouldCloseOnOverlayClick={false}
                    onClose={toggleVerifyModal}
                    position='center'
                    contentWidth='w-full md:w-2/5'
                >
                    <div className="p-6 flex items-center flex-col gap-4">

                        <header className="w-full border-b border-tgray-50 flex items-center gap-2 py-1">
                            <Icon.AlertCircle color="#FF0000" />
                            <p className="w-full text-base font-bold ">Verify Email</p>
                        </header>
                        Kindly Verify your email to continue

                        <Button
                            onClick={verifyAccountHandler}
                            isLoading={resendLoading}
                            disabled={resendLoading}
                        >
                            Continue to verification
                        </Button>
                    </div>
                </Modal>

                <DrawerModal
                    show={searchParams.get('messages')}
                    shouldCloseOnEscPress={false}
                    onClose={() => navigate(-1)}
                    contentWidth='w-full lg:w-9/12'
                >
                    <Messages />
                </DrawerModal>
            </section>
        </Suspense>
    );
};
import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { GroupAddIcon, InboxIcon, LatestEventsIcon, LockIcon, NotificationIcon, TalkamLogo } from '../../assets/icons/generated';
import { SideBarItem } from '../global/sidebarItem';
import { Button } from '../forms/button';
import { NavSearch } from '../forms/navsearchbar';
import { useFollowingCategoriesQuery, useGetSubCategoriesQuery, useGetUserProfileDetailsQuery } from '../../services/userApiSlice';
import { ColoredLoader } from '../global/loader';
import { useDispatch, useSelector } from 'react-redux';
import { logOut, selectCurrentToken, selectCurrentUser } from '../../services/authSlice';
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
import { useGetNotificationStatsQuery } from '../../services/notificationsApiSlice';
import { useIsAuth } from '../../hooks/useIsAuth';
import { AuthWrapper } from '../../utils/authWrapper';
import { useGlobalLoader } from '../../hooks/useCheckLoader';
import { Storage } from '../../app/storage';
import { apiSlice } from '../../app/api/apiSlice';
import * as Icon from 'react-feather'
import Pusher from 'pusher-js';
import LoadingBar from 'react-top-loading-bar';
import PushIcon from "../../assets/icons/logo.svg"

export const MainAppLayout = ({ children }) => {

    let isMobile = useMediaQuery("(max-width: 1024px)");
    let isLogoMobile = useMediaQuery("(max-width: 425px)");

    const dispatch = useDispatch();
    const state = useGlobalLoader()
    const navigate = useNavigate();
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search);
    const isAuth = useIsAuth();
    const token = useSelector(selectCurrentToken)
    const currentUser = useSelector(selectCurrentUser)
    const popUpRef = useRef();
    const [showPanel, setShowPanel] = useState(false);
    const [profileMenu, setProfileMenu] = useState(false);
    const [verifyModal, setVerifyModal] = useState(false);

    const { data: categories, isLoading: loadingCategories } = useGetSubCategoriesQuery({
        sort: "popular",
        categoryId: ""
    }, {
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    });
    const { data: followingCategories, isLoading: followingCategoriesLoading } = useFollowingCategoriesQuery({
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    });
    const [resendOtp, { isLoading: resendLoading }] = useResendOtpMutation();
    const { data: user, isSuccess } = useGetUserProfileDetailsQuery(currentUser?.id, {
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    });
    const { data: notificationStats, refetch: refetchNotification } = useGetNotificationStatsQuery();

    useOnOutsideClick(popUpRef, () => {
        setProfileMenu(() => false)
    });

    const showPushNotification = (data) => {
        if (Notification.permission === 'granted') {
            console.log("granted")
            new Notification("TalkAm", {
                body: "You have new notifications on TalkAm",
            });
        }
    };

    const connectToPusher = () => {
        let pusherChannel; // Declare pusherChannel variable

        // Unsubscribe from the channel if it's already subscribed
        if (pusherChannel) {
            pusherChannel.unbind_all();
            pusher.unsubscribe('refresh-notification.' + currentUser?.id);
        }

        const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
            cluster: import.meta.env.VITE_PUSHER_CLUSTER,
            encrypted: true,
            authEndpoint: `${import.meta.env.VITE_BASE_API_URL}/broadcasting/auth`,
            auth: {
                headers: {
                    'content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        });
        pusherChannel = pusher.subscribe('refresh-notification.' + currentUser?.id); // Assign pusherChannel
        pusherChannel.bind('refresh', (data) => {
            console.log(document.visibilityState)
            if (document.visibilityState === 'hidden') {
                console.log("Notification received")
                showPushNotification(data);
            }
            // refetchNotification();

        });
        return () => {
            pusherChannel.unbind_all();
            pusher.unsubscribe('refresh-notification.' + currentUser?.id);
        };
    };

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
        refetchNotification();
        if (user) {
            if (!user?.data?.email_verified_at) {
                setVerifyModal(() => true)
            }
        };
    }, [currentUser, user]);

    useEffect(() => {
        refetchNotification();
        if (user) {
            if (!user?.data?.status === "Banned") {
                dispatch(apiSlice.util.resetApiState());
                dispatch(logOut());
                Storage.clearItem();
                navigate("/", { replace: true })
            }
        };
    }, [currentUser, user]);

    useEffect(() => {
        connectToPusher();
    }, []);

    useEffect(() => {
        if ("Notification" in window) {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    console.log("Notification permission granted.");
                } else {
                    console.log("Notification permission denied.");
                }
            });
        }
    }, []);

    return (
        <section className='w-full flex items-center justify-center no-scrollbar'>
            <LoadingBar height={3} color="#017FC8" progress={state === "loading" ? 75 : 100} />
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
                            {
                                !isAuth ?
                                    <section className='flex items-center gap-4'>
                                        <Button
                                            variant="outline"
                                            className="!rounded-full !font-bold !py-2.5 !px-4 text-tprimary-50 border border-tprimary-50"
                                            onClick={() => navigate("/sign-up")}
                                        >
                                            Sign Up
                                        </Button>

                                        <Button
                                            variant="primary"
                                            className="!rounded-full !font-bold !py-3 !px-4"
                                            leftIcon={<LockIcon className="w-5 h-5 text-twhite-100" />}
                                            onClick={() => navigate("/login")}
                                        >
                                            Login
                                        </Button>
                                    </section>
                                    :
                                    null
                            }
                            {
                                isAuth ?
                                    <>

                                        <div className='relative'>
                                            <NotificationIcon onClick={() => navigate('/notifications')} className={`cursor-pointer ${isMobile ? 'w-5 h-5' : 'w-7 h-7'}`} />
                                            <span
                                                className={`absolute top-0 right-0 rounded-full bg-red-600 p-[2px] flex items-center justify-center
                                                    ${notificationStats?.data?.unread_notifications > 99 ? "" : "h-3 w-3"}
                                                    ${notificationStats?.data?.unread_notifications ? ' flex' : 'hidden'} text-[6px] text-twhite-100`
                                                }
                                            >
                                                {notificationStats?.data?.unread_notifications}
                                            </span>
                                        </div>

                                        <div className='relative'>
                                            <Icon.Mail
                                                onClick={() => {
                                                    navigate({
                                                        pathname: `${location.pathname}`,
                                                        search: `messages`,
                                                    });
                                                    setShowPanel(false);
                                                }}
                                                className={`cursor-pointer ${isMobile ? 'w-5 h-5' : 'w-7 h-7'}`}
                                            />
                                            <span
                                                className={`absolute top-0 right-0 rounded-full bg-red-600 p-[2px] flex items-center justify-center
                                                    ${notificationStats?.data?.unread_messages > 99 ? "" : "h-3 w-3"}
                                                    ${notificationStats?.data?.unread_messages ? ' flex' : 'hidden'} text-[6px] text-twhite-100`
                                                }
                                            >
                                                {notificationStats?.data?.unread_messages}
                                            </span>

                                        </div>
                                    </>
                                    :
                                    null
                            }
                        </section>
                        <section className='flex items-center gap-5 md:gap-8'>
                            {
                                isAuth ?
                                    <>
                                        <Button
                                            children={isMobile ? "" : "Post"}
                                            leftIcon={< Icon.Plus size={isMobile ? 16 : 20} />}
                                            className="!p-1 lg:!px-4 lg:!py-2.5 !rounded-full"
                                            onClick={() => { navigate('/create-post'); setShowPanel(false) }}
                                        />
                                        <div ref={popUpRef} className='cursor-pointer relative'>
                                            <Avatar
                                                onClick={showProfileMenu} src={user?.data?.avatar ?? currentUser?.avatar}
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
                                    </>
                                    :
                                    null
                            }
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
                                <section className='w-full flex flex-col items-start gap-2 border-b border-tgray-200 py-4 pl-4 pb-4'>
                                    <h1 className='text-base font-bold'>Your subcategories</h1>
                                    <ul className='w-full flex flex-col'>
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

                                <section className='flex flex-col items-start gap-3 border-b border-tgray-200 py-4 pl-4 pb-4'>
                                    <h1 className='text-base font-bold'>Groups</h1>
                                    <div className='w-full'>
                                        <AuthWrapper onClick={() => { navigate('/create-group'); setShowPanel(false); }}>
                                            <Button
                                                variant="outline"
                                                fullWidth
                                                children="Create group"
                                                rightIcon={<GroupAddIcon />}
                                                className="flex items-center justify-between text-sm !p-2 !px-3"
                                            />
                                        </AuthWrapper>
                                    </div>
                                    <Button
                                        variant="outline"
                                        fullWidth
                                        children="See all groups"
                                        rightIcon={<Icon.ArrowRight />}
                                        className="flex items-center justify-between !text-sm !p-2 !px-3 !border-none"
                                        onClick={() => { navigate('/groups'); setShowPanel(false); }}
                                    />
                                </section>

                                <section className='w-full flex flex-col items-start gap-2 border-b border-tgray-200 py-6 pl-4 pb-4'>
                                    <h1 className='text-base font-bold'>Popular subcategories</h1>
                                    <ul className='w-full flex flex-col'>
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

                                    <Link
                                        className="flex items-center justify-between !text-sm !py-0 !px-0"
                                        to="/help&info/about"
                                    >
                                        About
                                    </Link>
                                    <Link
                                        className="flex items-center justify-between !text-sm !py-0 !px-0"
                                        to="/help&info/faqs"
                                    >
                                        FAQs
                                    </Link>
                                    <Link
                                        className="flex items-center justify-between !text-sm !py-0 !px-0"
                                        to="/help&info/rules"
                                    >
                                        Rules
                                    </Link>
                                    <Link
                                        className="flex items-center justify-between !text-sm !py-0 !px-0"
                                        to="/help&info/feedback"
                                    >
                                        Feedback
                                    </Link>
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
                show={location.search.includes("messages")}
                shouldCloseOnEscPress={false}
                onClose={() => navigate(-1)}
                contentWidth='w-full lg:w-9/12'
            >
                <Messages />
            </DrawerModal>
        </section>

    );
};
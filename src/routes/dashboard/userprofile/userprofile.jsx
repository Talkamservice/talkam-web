import { useNavigate, useParams } from "react-router-dom";
import { Avatar } from "../../../components/global/avatar";
import { RouteTabs } from "../../../components/global/routetabs";
import { useGetUserProfileDetailsQuery } from "../../../services/userApiSlice";
import { EditProfileModal } from "./editprofilemodal";
import { Modal } from "../../../components/global/modal";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../services/authSlice";
import { BlueTickIcon, ChatSquareIcon, UploadAvatarIcon } from "../../../assets/icons/generated";
import { AuthWrapper } from "../../../utils/authWrapper";
import { BlockPromptModal } from "../../../components/global/blockpromptmodal";
import { useOnOutsideClick } from "../../../hooks/useOnOutsideClick";
import { useBlockUserMutation } from "../../../services/posts/postsApiSlice";
import { toast } from "sonner";
import { handleError } from "../../../utils/handleError";
import { motion } from "framer-motion";
import { PostCardVariants } from "../../../helpers/cardanimation";
import { ColoredLoader } from "../../../components/global/loader";
import { ScheduledPosts } from "./scheduledposts";
import * as Icon from 'react-feather'

const tabs = [
    {
        id: 0,
        title: "Posts",
        text: "posts",
    },
    {
        id: 1,
        title: "Comments",
        text: "comments",
    },
    {
        id: 2,
        title: "Upvotes",
        text: "upvotes",
    },
    {
        id: 3,
        title: "Media",
        text: "media",
    },
];

export const Profile = () => {

    const { userId } = useParams();
    const navigate = useNavigate()
    const popUpRef = useRef();
    const userPopRef = useRef();
    const currentUser = useSelector(selectCurrentUser);
    const [editModal, setEditModal] = useState();
    const [popUp, setPopUp] = useState(false);
    const [userPop, setUserPop] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false)
    const [viewScheduled, setViewScheduled] = useState(false)

    useOnOutsideClick(popUpRef, () => {
        setPopUp(false);
    })
    useOnOutsideClick(userPopRef, () => {
        setUserPop(false);
    })
    const isLoggedInUser = currentUser?.username === userId;

    const { data: user, refetch, isFetching } = useGetUserProfileDetailsQuery(userId, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true
    });
    const [blockUser, { isLoading }] = useBlockUserMutation();

    const username =
        user?.data?.username && user?.data?.username !== "" ?
            user?.data.username :
            user?.data?.name && user?.data?.name !== "" ?
                user?.data?.name :
                user?.data?.email


    const handleBlockUser = async () => {
        try {
            const blockRes = await blockUser({ blocked_user_id: user?.data?.id }).unwrap();
            toast.success(blockRes.message);
            refetch();
            setShowBlockModal(() => false)
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage)
        }
        setPopUp(false);
    };

    const copyTextToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(`https://web.talkam.prodevs.io/userprofile/${userId}`);
            toast.success("Copied to Clipboard")
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage);
        }
        setPopUp(false);
    }

    const handleShowBlockModal = () => {
        setShowBlockModal((prev) => !prev)
    }

    const handleEditModal = () => {
        setEditModal((prev) => !prev)
    }

    const handleScheduledModal = () => {
        setViewScheduled((prev) => !prev)
        setUserPop(false)
    }

    return (
        <div className="w-full flex flex-col lg:w-4/6 h-full">
            <section className="w-full flex flex-col">
                <div className="w-full px-6 py-3 flex items-start justify-between gap-4">
                    <section className="flex items-start flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <Avatar src={user?.data.avatar} size='sm' />
                            <span className="flex items-center gap-2 text-sm md:text-base font-bold text-tblack-100">
                                {username}
                                {
                                    user && !isFetching ?
                                        <section className={``}>
                                            {
                                                user?.data?.active_subscription ?
                                                    <BlueTickIcon />
                                                    :
                                                    <span
                                                        onClick={() => navigate("/pricing")}
                                                        className={` ${isLoggedInUser && !user?.data?.active_subscription ? "block" : "hidden"} w-fit flex items-center gap-1 font-normal border border-[#D1F2F7] text-[8px] px-2 py-1 rounded-full bg-gradient-to-r from-[#FDFFFF] to-[#D1F2F7] cursor-pointer sm:ml-4`}
                                                    >
                                                        <BlueTickIcon />
                                                        Subscribe to TalkAM plus
                                                    </span>
                                            }
                                        </section>
                                        :
                                        null
                                }
                            </span>
                        </div>
                        <p className={`text-base font-bold text-tblack-100 ${isLoggedInUser ? "block" : "hidden"} `}>My Profile</p>
                    </section>

                    <section ref={userPopRef} className={`relative ${isLoggedInUser ? "flex" : "hidden"}  hover:bg-tgray-xlight p-1 rounded-full`}>
                        <Icon.MoreVertical onClick={() => setUserPop((prev) => !prev)} color="#212121" />
                        {
                            userPop ?
                                <motion.section
                                    variants={PostCardVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                                    className="absolute top-6 right-2 z-20">
                                    <ul className="w-full bg-white flex flex-col items-start divide-y divide-tgray-50 border border-tgray-50 overflow-hidden rounded-xl">
                                        <li onClick={() => { handleEditModal(); setUserPop(false) }}
                                            className="bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight whitespace-nowrap cursor-pointer"
                                        >
                                            <UploadAvatarIcon />
                                            <span className='text-tblack-100 text-xs md:text-sm whitespace- cursor-pointer'>Edit Profile</span>
                                        </li>
                                        <li onClick={() => handleScheduledModal()}
                                            className="bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight whitespace-nowrap cursor-pointer"
                                        >
                                            <Icon.Save className='' size={18} color='#000000' strokeWidth={2} />
                                            <p>View Scheduled Posts</p>
                                        </li>
                                    </ul>
                                </motion.section>
                                :
                                null
                        }
                    </section>

                    <div className={`flex items-center gap-2 ${(!isLoggedInUser && user?.data?.status !== "Banned") ? "flex" : "hidden"}`}>
                        {
                            user?.data?.is_blocked ?
                                <p
                                    onClick={handleBlockUser}
                                    className={`
                                        border border-[#FF0000] text-xs font-medium text-[#FF0000] p-2 rounded-full cursor-pointer
                                        flex items-center gap-2 whitespace-nowrap
                                        ${isLoading ? "pointer-events-none" : ""}
                                    `}
                                >
                                    {isLoading ? <ColoredLoader colors={["#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000"]} /> : null}
                                    Unblock @{username}
                                </p>
                                :
                                <section ref={popUpRef} className={`relative cursor-pointer hover:bg-tgray-xlight p-1 rounded-full ${user?.data?.is_blocked ? 'hidden' : 'blocked'} `}>
                                    <Icon.MoreVertical onClick={() => setPopUp(prev => !prev)} color="#212121" />
                                    {
                                        popUp ?
                                            <motion.div
                                                variants={PostCardVariants}
                                                initial="initial"
                                                animate="animate"
                                                exit="exit"
                                                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                                                className="absolute top-5 right-2 z-20"
                                            >
                                                <ul className="w-full bg-white flex flex-col items-start divide-y divide-tgray-50 border border-tgray-50 overflow-hidden rounded-xl">
                                                    {
                                                        !user?.data?.i_am_blocked ?
                                                            <li className="w-full">
                                                                <AuthWrapper
                                                                    onClick={() => {
                                                                        navigate({
                                                                            pathname: `${location.pathname}`,
                                                                            search: `messages&u=${userId}`,
                                                                        }, { state: userId });
                                                                    }}
                                                                >
                                                                    {
                                                                        !user?.data?.is_blocked ?
                                                                            <p className={` ${!isLoggedInUser ? "flex" : "hidden"} bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight whitespace-nowrap `}>
                                                                                <ChatSquareIcon />
                                                                                <span className='text-tblack-100 text-sm whitespace-nowrap'>Send direct message</span>
                                                                            </p>
                                                                            :
                                                                            null
                                                                    }
                                                                </AuthWrapper>
                                                            </li>
                                                            :
                                                            null
                                                    }
                                                    <li onClick={() => copyTextToClipboard()}
                                                        className="bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight whitespace-nowrap"
                                                    >
                                                        <Icon.Link2 className='-rotate-45' size={18} color='#000000' strokeWidth={2} />
                                                        <p>Copy profile link</p>
                                                    </li>
                                                    {
                                                        !user?.data?.i_am_blocked ?
                                                            <li className="w-full">
                                                                <AuthWrapper onClick={handleShowBlockModal}>
                                                                    <li className={`
                                                            bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight whitespace-nowrap
                                                            ${(!isLoggedInUser) ? "block" : 'hidden'}
                                                        `}
                                                                    >
                                                                        <Icon.Slash size={15} color='#FF0000' strokeWidth={2} />
                                                                        <p className="text-[#FF0000]">Block @{username}</p>
                                                                    </li>
                                                                </AuthWrapper>
                                                            </li>
                                                            :
                                                            null
                                                    }
                                                </ul>
                                            </motion.div>
                                            :
                                            null
                                    }
                                </section>
                        }
                    </div>
                </div>
            </section>

            {
                user?.data?.is_blocked ?
                    <section className="w-full flex flex-col items-center justify-center gap-2 py-16">
                        <p className="text-lg font-bold">@{username} {" "} is blocked</p>
                        <span className="text-sm">Unblock them to view their activities and posts.</span>
                    </section>
                    :
                    user?.data?.status === "Banned" ?
                        <section className="w-full flex flex-col items-center justify-center gap-2 py-16">
                            <p className="text-lg font-bold">@{username} {" "} is banned</p>
                            <span className="text-sm">You would not be able to view their activities and posts.</span>
                        </section>
                        :
                        user?.data?.i_am_blocked ?
                            <section className="w-full flex flex-col items-center justify-center gap-2 py-16">
                                <p className="text-lg font-bold">@{username} blocked you</p>
                                <span className="text-sm">You won&apos;t be able to view their activities and posts.</span>
                            </section>
                            :
                            <section className="relative overflow-y-auto w-full no-scrollbar">
                                <RouteTabs data={isLoggedInUser} tabs={tabs} headerPadding="px-6" />
                            </section>

            }

            <Modal
                show={editModal}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={handleEditModal}
                position='center'
                contentWidth='w-full md:w-3/5'
            >
                <EditProfileModal
                    onClose={handleEditModal}
                    user={user}
                />
            </Modal>

            <Modal
                show={showBlockModal}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={handleShowBlockModal}
                position='center'
                contentWidth='w-full sm:w-3/5 md:w-5/12 xl:w-3/12'
            >
                <BlockPromptModal
                    handleBlockUser={handleBlockUser}
                    isLoading={isLoading}
                    handleShowBlockModal={handleShowBlockModal}
                    user={username}
                />
            </Modal>

            <Modal
                show={viewScheduled}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={handleScheduledModal}
                position='center'
                contentWidth='w-full sm:w-3/5 md:w-7/12 xl:w-8/12 '
            >
                <ScheduledPosts onClose={handleScheduledModal} />
            </Modal>
        </div>
    )
}
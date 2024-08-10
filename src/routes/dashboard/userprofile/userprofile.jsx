import { useParams } from "react-router-dom";
import { Avatar } from "../../../components/global/avatar";
import { RouteTabs } from "../../../components/global/routetabs";
import { useGetUserProfileDetailsQuery } from "../../../services/userApiSlice";
import { EditProfileModal } from "./editprofilemodal";
import { Modal } from "../../../components/global/modal";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../services/authSlice";
import { UploadAvatarIcon } from "../../../assets/icons/generated";

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
];

export const Profile = () => {

    const currentUser = useSelector(selectCurrentUser);
    const { userId } = useParams();
    const [editModal, setEditModal] = useState();

    const isLoggedInUser = currentUser?.id === Number(userId);

    const { data: user } = useGetUserProfileDetailsQuery(userId, {
        // refetchOnMountOrArgChange: true
    });

    const handleEditModal = () => {
        setEditModal((prev) => !prev)
    }

    return (
        <div className="w-full flex flex-col lg:w-4/6 h-full">
            <section className="w-full flex flex-col">
                <div className="w-full px-6 py-3 flex items-start justify-between gap-4">
                    <section className="flex items-start flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <Avatar src={user?.data.avatar} size='sm' />
                            <span className="text-sm md:text-base font-bold text-tblack-100">{user?.data.username ?? user?.data.name}</span>
                        </div>
                        <p className={`text-base font-bold text-tblack-100 ${isLoggedInUser ? "block" : "hidden"} `}>My Profile</p>
                    </section>
                    <p onClick={handleEditModal} className={` ${isLoggedInUser ? "flex" : "hidden"} cursor-pointer border border-tgray-50 rounded-full px-2 py-1 flex items-center justify-between gap-2`}>
                        <UploadAvatarIcon />
                        <span className='text-tblack-100 text-xs md:text-sm whitespace-nowrap'>Edit Profile</span>
                    </p>
                </div>
            </section>

            <section className="relative overflow-y-auto w-full no-scrollbar px-6">
                <RouteTabs tabs={tabs} />
            </section>

            <Modal
                show={editModal}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={handleEditModal}
                position='center'
                contentWidth='w-full md:w-3/5'
            >
                <EditProfileModal onClose={handleEditModal} />
            </Modal>
        </div>
    )
}
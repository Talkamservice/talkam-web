import { Avatar } from "../../../components/global/avatar";
import { UploadAvatarIcon } from "../../../assets/icons/generated";
import { RouteTabs } from "../../../components/global/routetabs";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../services/authSlice";
import { Modal } from "../../../components/global/modal";
import { useState } from "react";
import { EditProfileModal } from "./editprofilemodal";

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

    const [ editModal, setEditModal ] = useState();
    const user = useSelector(selectCurrentUser);

    const handleEditModal = () => {
        setEditModal((prev) => !prev)
    }

    return (
        <div className="w-full lg:w-4/6 h-full">
            <section className="w-full flex flex-col">
                <div className="w-full px-6 py-3 flex items-start justify-between gap-4">
                    <section className="flex items-start flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <Avatar src={user?.avatar} size='sm' />
                            <span className="text-sm md:text-base font-bold text-tblack-100">{user?.username ?? user?.name}</span>
                        </div>
                        <p className="text-base font-bold text-tblack-100">My Profile</p>
                    </section>
                    <p onClick={handleEditModal} className='cursor-pointer border border-tgray-50 rounded-full px-2 py-1 flex items-center justify-between gap-2'>
                        <UploadAvatarIcon />
                        <span className='text-tblack-100 text-xs md:text-sm whitespace-nowrap'>Edit Profile</span>
                    </p>
                </div>
            </section>

            <section className="w-full px-6">
                <RouteTabs tabs={tabs} />
            </section>

            <Modal
                show={editModal}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={handleEditModal}
                position='center'
                contentWidth='w-full md:w-2/4'
            >
                <EditProfileModal onClose={handleEditModal} />
            </Modal>
        </div>
    )
}
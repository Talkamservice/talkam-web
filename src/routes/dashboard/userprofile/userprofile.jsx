import { useParams } from "react-router-dom";
import { Avatar } from "../../../components/global/avatar";
import { RouteTabs } from "../../../components/global/routetabs";
import { useGetUserProfileDetailsQuery } from "../../../services/userApiSlice";

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

    const { userId } = useParams()
    const { data:user } = useGetUserProfileDetailsQuery(userId);

    return (
        <div className="w-full lg:w-4/6 h-full">
            <section className="w-full flex flex-col">
                <div className="w-full px-6 py-3 flex items-start justify-between gap-4">
                    <section className="flex items-start flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <Avatar src={user?.data.avatar} size='sm' />
                            <span className="text-sm md:text-base font-bold text-tblack-100">{user?.data.username ?? user?.data.name}</span>
                        </div>
                        {/* <p className="text-base font-bold text-tblack-100">My Profile</p> */}
                    </section>
                </div>
            </section>

            <section className="w-full px-6">
                <RouteTabs tabs={tabs} />
            </section>
        </div>
    )
}
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../services/authSlice";
import { RouteTabs } from "../../../../components/global/routetabs";

const tabs = [
    {
        id: 0,
        title: "Account",
        text: "account",
    },
    {
        id: 1,
        title: "Notifications",
        text: "profile-notifications",
    },
    // {
    //     id: 2,
    //     title: "Privacy",
    //     text: "privacy",
    // },
    {
        id: 2,
        title: "Blocked users",
        text: "blocked-users",
    },
];

export const ProfileSettings = () => {

    const user = useSelector(selectCurrentUser);

    return (
        <div className="w-full lg:w-4/6 h-full">
            <p className="p-6 text-lg font-bold">Settings</p>
            <section className="w-full px-6">
                <RouteTabs tabs={tabs} />
            </section>
        </div>
    )
}
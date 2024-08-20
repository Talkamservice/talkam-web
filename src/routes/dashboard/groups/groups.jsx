import { EmptyState } from "../../../components/global/emptystate";
import { GroupCard } from "../../../components/global/groupcard";
import { RouteTabs } from "../../../components/global/routetabs"
import { GroupSkeletonLoader } from "../../../components/global/skeletons";
import { useGroupController } from "../../../controllers/groupController";
import EmptyListIcon from "../../../assets/images/emptylist.png"
import { useNavigate } from "react-router-dom";

const tabs = [
    {
        id: 0,
        title: "Recents",
        text: "recents",
    },
    {
        id: 1,
        title: "Explore",
        text: "explore",
    },
];

export const Groups = () => {

    const navigate = useNavigate();
    const groupController = useGroupController('popular');

    return (
        <div className="w-full flex divide-x divide-tgray-light h-full">
            <section className="relative w-full md:w-4/6 overflow-y-auto no-scrollbar px-6">
                <RouteTabs
                    tabs={tabs}
                />
            </section>

            <section className="w-2/6 px-6 hidden md:block py-4 space-y-8 overflow-y-auto no-scrollbar">
                <section className="flex flex-col gap-4">
                    <h2 className="text-base font-bold leading-none">Your Groups</h2>
                    <ul className="flex items-start flex-col gap-4">
                        {
                            groupController.followingGroupsLoading ?
                                <GroupSkeletonLoader button={false} />
                                :
                                !groupController.following?.data?.data.length ?
                                    <section className="w-full py-4">
                                        <EmptyState
                                            icon={EmptyListIcon}
                                            height="h-[50px]"
                                            width="h-[50px]"
                                            text="No groups"
                                            subtext="When groups are added they would appear here"
                                        />
                                    </section>
                                    :
                                    groupController.following?.data?.data.map((group) => (
                                        <GroupCard
                                            onClick={() => navigate(`/group/${group.id}`)}
                                            key={group.id}
                                            img={group.image}
                                            members={group.total_members}
                                            group={group.name}
                                        />
                                    ))
                        }
                    </ul>
                </section>
            </section>
        </div>
    )
}
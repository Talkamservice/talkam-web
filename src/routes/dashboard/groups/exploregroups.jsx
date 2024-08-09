import { EmptyState } from "../../../components/global/emptystate";
import { JoinGroupCard } from "../../../components/global/joingroupcard"
import { GroupSkeletonLoader, PillSkeletonLoader } from "../../../components/global/skeletons";
import { useGroupController } from "../../../controllers/groupController";
import EmptyListIcon from "../../../assets/images/emptylist.png"


export const ExploreGroups = () => {

    const groupController = useGroupController('popular');

    return (
        <div className="flex flex-col gap-4">
            <header className="flex items-start flex-col gap-2">
                <p className="text-base font-bold">Explore groups by category</p>
                <div className="flex items-center flex-wrap gap-2">
                    {
                        groupController.categoriesLoading ?
                            <PillSkeletonLoader num={12} />
                            :
                            groupController.categories?.data?.slice(0, 15).map((item, index) => (
                                <span
                                    key={index}
                                    onClick={() => groupController.setCategoryId(item.id)}
                                    className={`
                                        text-sm py-1 px-2 border border-tgray-50 rounded-full text whitespace-nowrap cursor-pointer
                                        ${groupController.categoryId === item?.id ? "bg-tprimary-50 text-white" : "bg-white text-tblack-100"}
                                    `}
                                >
                                    {item.name}
                                </span>
                            ))
                    }
                </div>
            </header>

            <section className="w-full py-3 flex flex-col gap-3">
                {
                    groupController.allGroupsLoading || groupController.fetchingGroups ?
                        <GroupSkeletonLoader />
                        :
                        !groupController.allGroups?.data?.data.length ?
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
                            groupController.allGroups?.data?.data?.map((group) => (
                                <JoinGroupCard
                                    key={group.id}
                                    avatar={group.image}
                                    membersCount={group.total_members}
                                    groupName={group.name}
                                    groupId={group.id}
                                />
                            ))
                }
            </section>
        </div>
    )
}
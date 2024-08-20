import { useState } from "react"
import { Search } from "../../../../../components/global/search";
import { X } from "react-feather";
import { useGetGroupMembersQuery } from "../../../../../services/groupApiSlice";
import { useDebounceValue } from "../../../../../hooks/useDebounceValue";
import { GroupSkeletonLoader } from "../../../../../components/global/skeletons";
import { EmptyState } from "../../../../../components/global/emptystate";
import { MemberListCard } from "../groupmembers/members";
import { useParams } from "react-router-dom";
import EmptyListIcon from "../../../../../assets/images/emptylist.png"

export const AllGroupMembers = ({ setMemberView, currentUserRole }) => {

    const { groupId } = useParams()
    const [search, setSearch] = useState();
    const debounceValue = useDebounceValue(search);
    const { data: groupMembers, isLoading } = useGetGroupMembersQuery({
        id: groupId,
        status: ""
    });

    return (
        <section className="flex flex-col gap-6">
            <header className="w-full flex flex-col items-start justify-between gap-4">
                <div className="flex items-center gap-1">
                    <X className="cursor-pointer" onClick={() => setMemberView("members")} />
                    <p className="text-base font-bold">Requests</p>
                </div>
                <Search onChange={(event) => setSearch(event.target.value)} placeholder="Search members" />
            </header>

            <section className="flex flex-col gap-4">
                {
                    isLoading ?
                        <GroupSkeletonLoader num={2} button={false} />
                        :
                        !groupMembers?.data?.Member.length ?
                            <section className="w-full py-1">
                                <EmptyState
                                    icon={EmptyListIcon}
                                    height="h-[30px]"
                                    width="h-[30px]"
                                    text="No Members"
                                    subtext="When members are added or join the group they would appear here"
                                />
                            </section>
                            :
                            groupMembers?.data?.Member?.map((member) => (
                                <MemberListCard
                                    key={member?.user?.id}
                                    avatar={member?.user?.avatar}
                                    joined={member?.created_at}
                                    user={member?.user?.username || member?.user?.name}
                                    currentUserRole={currentUserRole}
                                    poppostion={"bottom-0"}
                                    handleDeleteMember={() => handleDeleteMember(member?.id)}
                                    handleMakeModerator={() => handleMakeModerator(member?.id)}
                                    userId={member?.user?.id}
                                    role={member?.role}
                                />
                            ))
                }
            </section>
        </section>
    )
}
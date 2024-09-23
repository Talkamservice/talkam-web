import { JoinGroupCard } from "../../../components/global/joingroupcard"
import { PostCardVariants } from "../../../helpers/cardanimation"
import { motion } from "framer-motion"
import { useSearchQuery } from "../../../services/seachApiSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { GroupSkeletonLoader } from "../../../components/global/skeletons";
import { EmptyState } from "../../../components/global/emptystate";
import SearchIcon from '../../../assets/images/searchicon.jpg'
import { IsBanned } from "../../../utils/isBanned";

export const SearchGroup = () => {

    const navigate = useNavigate()
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('search') || '';
    const { data: searchResult, isLoading, isFetching } = useSearchQuery({
        sort: 'group',
        search: searchTerm
    }, (searchTerm || searchTerm !== "") ?? skipToken);

    return (
        <motion.div
            key="chatbox"
            variants={PostCardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="flex flex-col gap-4 py-3">
            <section className="w-full py-3 flex flex-col gap-3">
                {
                    isLoading || isFetching ?
                        <GroupSkeletonLoader num={6} />
                        :
                        !searchResult?.data?.data.length ?
                            <section className="w-full py-4">
                                <EmptyState
                                    icon={SearchIcon}
                                    height="h-[50px]"
                                    width="h-[50px]"
                                    text={`No results for ${searchTerm} groups`}
                                    subtext="When groups are added they would appear here"
                                />
                            </section>
                            :
                            searchResult?.data.data.map((group) => (
                                <IsBanned isBanned={group?.is_suspended} onClick={() => navigate(`/group/${group.id}`)} >
                                    <JoinGroupCard
                                        key={group.id}
                                        avatar={group.image}
                                        membersCount={group.total_members}
                                        groupName={group.name}
                                        groupId={group.id}
                                        access={group.group_access}
                                        isSuspended={group.is_suspended}
                                    />
                                </IsBanned>
                            ))
                }
            </section>
        </motion.div>
    )
}
import { PostCardVariants } from "../../../helpers/cardanimation"
import { motion } from "framer-motion"
import { useSearchQuery } from "../../../services/seachApiSlice";
import { useLocation } from "react-router-dom";
import { GroupSkeletonLoader } from "../../../components/global/skeletons";
import { EmptyState } from "../../../components/global/emptystate";
import { SearchUserCard } from "../../../components/global/searchusercard";
import SearchIcon from '../../../assets/images/searchicon.jpg'

export const SearchUsers = () => {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('search') || '';
    const { data: searchResult, isLoading, isFetching } = useSearchQuery({
        sort: 'user',
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
            className="flex flex-col gap-4 py-3"
        >
            <section className="w-full flex flex-col divide-y divide-tgray-50 divide-opacity-70">
                {
                    isLoading || isFetching ?
                        <GroupSkeletonLoader button={false} num={6} />
                        :
                        !searchResult?.data?.data.length ?
                            <section className="w-full py-4">
                                <EmptyState
                                    icon={SearchIcon}
                                    height="h-[50px]"
                                    width="h-[50px]"
                                    text={`No results for ${searchTerm}`}
                                    subtext="Users you search for would appear here"
                                />
                            </section>
                            :
                            searchResult?.data.data.map((user) => {

                                const username =
                                    user?.username && user?.username !== "" ?
                                        user?.username :
                                        user?.name && user?.name !== "" ?
                                            user?.name :
                                            user?.email

                                return (
                                    <SearchUserCard
                                        key={user.id}
                                        username={username}
                                        avatar={user?.avatar}
                                        userId={user?.id}
                                    />
                                )
                            })
                }
            </section>
        </motion.div>
    )
}
import { SubCategoryCard } from "../../../components/categories/subcategorycard"
import { EmptyState } from "../../../components/global/emptystate"
import { useGetSubCategoriesQuery } from "../../../services/userApiSlice"
import { SubCategorySkeletonLoader } from "../../../components/global/skeletons"
import EmptyListIcon from "../../../assets/images/emptylist.png"

export const SubCategories = ({ id }) => {

    const { data: subcategories, isLoading } = useGetSubCategoriesQuery({
        sort: "",
        categoryId: id
    });

    return (
        <section className="w-full">
            {
                isLoading ?
                    <div className="w-full">
                        <SubCategorySkeletonLoader />
                    </div>
                    :
                    !subcategories?.data.length ?
                        <section className="w-full flex items-center justify-center m-auto py-1">
                            <EmptyState
                                icon={EmptyListIcon}
                                height="h-[30px]"
                                width="h-[30px]"
                                text="No Subcategories"
                                subtext="When a subcategory is added they would appear here"
                            />
                        </section>
                        :
                        <section className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {subcategories?.data?.map((category) => (
                                <SubCategoryCard
                                    key={category.id}
                                    followercount={category?.followers_count}
                                    name={category?.name}
                                    id={category.id}
                                />
                            ))}
                        </section>
            }
        </section>

    )
}
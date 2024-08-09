import { LatestEventsIcon } from "../../../assets/icons/generated"
import { SideBarItem } from "../../../components/global/sidebarItem"
import { CategorySkeletonLoader } from "../../../components/global/skeletons"
import { useGetCategoriesQuery } from "../../../services/userApiSlice"

export const Categories = () => {

    const { data:categories, loadingCategories } = useGetCategoriesQuery({
        sort: 'popular'
    })

    return (
        <ul className="flex flex-col divide-y divide-tgray-50">
            {
                loadingCategories ?
                <CategorySkeletonLoader />
                :
                categories?.data?.map((item) => (
                    <p className="py-3">
                        <SideBarItem
                            key={item.id}
                            children={item.name}
                            image={item.icon_image ?? <LatestEventsIcon />}
                            url={item.url}
                            onClick={() => {}}
                        />
                    </p>
                ))
            }
        </ul>
    )
}
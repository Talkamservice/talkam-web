import { toast } from "sonner";
import { CategoryAccordion } from "../../../components/categories/categoryaccordion"
import { useGetCategoriesQuery } from "../../../services/userApiSlice"
import { handleError } from "../../../utils/handleError";
import { EmptyState } from "../../../components/global/emptystate";
import { SubCategories } from "./subcategories";
import { CategorySkeletonLoader } from "../../../components/global/skeletons";
import { Button } from "../../../components/forms/button";
import { Plus } from "react-feather";
import { useNavigate } from "react-router-dom";
import EmptyListIcon from "../../../assets/images/emptylist.png"

export const Categories = () => {

    const navigate = useNavigate();

    const { data: categories, isLoading, isError, error } = useGetCategoriesQuery({
        sort: ""
    });

    if (isError) {
        const errorMessage = handleError(error);
        toast.error(errorMessage);
        return (
            <div className="w-full items-center justify-center m-auto text-center text-tgray-150">
                <p className="text-sm font-normal">An Error seems to have occurred.</p>
                <p className="text-xs font-normal">Try again.</p>
            </div>
        );
    }

    return (
        <div className="w-full lg:w-5/6 flex flex-col gap-8 p-6">
            <header className="w-full flex flex-col items-start md:flex-row md:items-center justify-between">
                <h1 className="text-xl font-bold">
                    All Categories
                </h1>

                <Button
                    onClick={() => navigate("/help&info/feedback")}
                    className="!text-tprimary-50"
                    leftIcon={<Plus size={18} />}
                    variant="link"
                >
                    Submit a suggestion
                </Button>
            </header>

            <section className="w-full flex flex-col gap-8">
                {
                    isLoading ?
                        <CategorySkeletonLoader />
                        :
                        !categories?.data.length ?
                            <section className="w-full flex items-center justify-center m-auto py-1">
                                <EmptyState
                                    icon={EmptyListIcon}
                                    height="h-[30px]"
                                    width="h-[30px]"
                                    text="No Categories"
                                    subtext="When categories are added they would appear here"
                                />
                            </section>
                            :
                            categories?.data?.map((category) => (
                                <CategoryAccordion
                                    key={category.id}
                                    title={category?.name}
                                    icon={category.background_image}
                                >
                                    <SubCategories id={category?.id} />
                                </CategoryAccordion>
                            ))
                }
            </section>
        </div>
    )
}
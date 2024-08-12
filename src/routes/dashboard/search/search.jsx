import { useLocation, useParams } from "react-router-dom";
import { RouteTabs } from "../../../components/global/routetabs";
import { NavSearch } from "../../../components/forms/navsearchbar";

export const Search = () => {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('search') || '';

    const tabs = [
        {
            id: 0,
            title: "Posts",
            text: `posts?search=${searchTerm ?? ""}`,
        },
        {
            id: 1,
            title: "Groups",
            text: `groups?search=${searchTerm ?? ""}`,
        },
        {
            id: 2,
            title: "Media",
            text: `media?search=${searchTerm ?? ""}`,
        },
    ];



    return (
        <div className="flex flex-col px-6 pt-6 gap-4 h-full">
            <section className="block lg:hidden">
                <NavSearch />
            </section>
            <section className="text-xl font-bold">Search Results for : "{searchTerm}"</section>

            <section className="relative w-full lg:w-4/6 overflow-y-auto no-scrollbar">
                <RouteTabs tabs={tabs} />
            </section>
        </div>
    )
}
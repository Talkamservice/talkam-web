import { useLocation, useParams } from "react-router-dom";
import { NavSearch } from "../../../components/forms/navsearchbar";
import { Tabs } from "../../../components/global/tabs";
import { SearchPosts } from "./searchposts";
import { SearchGroup } from "./searchgroups";
import { SearchMedia } from "./searchmedia";

export const Search = () => {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('search') || '';

    const tabs = [
        {
            id: 0,
            title: "Posts",
            // text: `posts?search=${searchTerm ?? ""}`,
            component: <SearchPosts />
        },
        {
            id: 1,
            title: "Groups",
            // text: `groups?search=${searchTerm ?? ""}`,
            component: <SearchGroup />
        },
        {
            id: 2,
            title: "Media",
            // text: `media?search=${searchTerm ?? ""}`,
            component: <SearchMedia />
        },
    ];



    return (
        <div className="flex flex-col px-6 pt-6 gap-4 h-full">
            <section className="block lg:hidden">
                <NavSearch />
            </section>
            <section className="text-xl font-bold">Search Results for : "{searchTerm}"</section>

            <section className="relative w-full lg:w-4/6 overflow-y-auto no-scrollbar">
                <Tabs tabs={tabs} />
            </section>
        </div>
    )
}
import { RouteTabs } from "../../../components/global/routetabs";

export const Search = () => {

    const tabs = [
        {
            id: 0,
            title: "Posts",
            text: "posts-results",
        },
        {
            id: 1,
            title: "Groups",
            text: "groups-results",
        },
        {
            id: 2,
            title: "Media",
            text: "media-results",
        },
    ];

    return (
        <div className="flex flex-col p-6 gap-4">
            <section className="text-xl font-bold">Search Results for: ""</section>

            <section className="w-full md:w-3/5">
                <RouteTabs tabs={tabs} />
            </section>
        </div>
    )
}
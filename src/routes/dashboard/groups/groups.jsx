import { GroupCard } from "../../../components/global/groupcard";
import { RouteTabs } from "../../../components/global/routetabs"

const tabs = [
    {
        id: 0,
        title: "Recents",
        text: "recents",
    },
    {
        id: 1,
        title: "Explore",
        text: "explore",
    },
];

export const Groups = () => {

    return (
        <div className="w-full flex divide-x divide-tgray-light h-full">
            <section className="relative w-full md:w-4/6 overflow-y-auto no-scrollbar px-6">
                <RouteTabs
                    tabs={tabs}
                />
            </section>

            <section className="w-2/6 px-6 hidden md:block py-4 space-y-8 overflow-y-auto no-scrollbar">
                <section className="flex flex-col gap-4">
                    <h2 className="text-base font-bold leading-none">Popular Groups</h2>
                    <ul className="flex items-start flex-col gap-4">
                        <GroupCard group="Games" members={128} />
                        <GroupCard group="Events" members={142} />
                        <GroupCard group="Movies" members={497} />
                        <GroupCard group="Lifestyles" members={189} />
                        <GroupCard group="Entertainments" members={765} />
                    </ul>
                </section>
            </section>
        </div>
    )
}
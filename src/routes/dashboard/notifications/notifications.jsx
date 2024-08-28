import { RouteTabs } from "../../../components/global/routetabs";

export const Notifications = () => {

    const tabs = [
        {
            id: 0,
            title: "All notifications",
            text: "all",
        },
        {
            id: 1,
            title: "Mentions",
            text: "mentions",
        },
    ];

    return (
        <div className="w-full flex flex-col gap-8 lg:w-4/6 h-full p-6">
            <header className="w-full flex items-center justify-between">
                <p className="text-lg font-medium">Notifications</p>
                <span className="text-sm font-medium cursor-pointer">Mark all as read</span>
            </header>

            <section className="relative overflow-y-auto w-full no-scrollbar">
                <RouteTabs tabs={tabs} />
            </section>
        </div>
    )
} 
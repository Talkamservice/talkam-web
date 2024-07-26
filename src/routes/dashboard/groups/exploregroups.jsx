import { JoinGroupCard } from "../../../components/global/joingroupcard"

export const ExploreGroups = () => {

    const categories = [ "BBN", "Arsenal", "Champions League", "Dating", "Gaming PC", "PS6", "Programming"];

    return (
        <div className="flex flex-col gap-4">
            <header className="flex items-start flex-col gap-2">
                <p className="text-base font-bold">Explore groups by category</p>
                <div className="flex items-center flex-wrap gap-2">
                    {
                        categories.map((item, index) => (
                            <span key={index} className="text-sm py-1 px-2 border border-tgray-50 rounded-full text whitespace-nowrap">
                                {item}
                            </span>
                        ))
                    }
                </div>
            </header>

            <section className="w-full py-3 flex flex-col gap-3">
                <JoinGroupCard />
                <JoinGroupCard />
                <JoinGroupCard />
                <JoinGroupCard />
                <JoinGroupCard />
                <JoinGroupCard />
                <JoinGroupCard />
            </section>
        </div>
    )
}
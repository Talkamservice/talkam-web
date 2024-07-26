import { Button } from "../forms/button"
import { GroupCard } from "./groupcard"

export const JoinGroupCard = ({ avatar }) => {
    return (
        <div className="w-full flex items-center justify-between gap-4">
            <GroupCard
                img={avatar}
                group="Cooking"
                members={327}
            />

            <Button
                children="Join"
                className="!rounded-full !py-2 !px-4 font-bold "
            />
        </div>
    )
}
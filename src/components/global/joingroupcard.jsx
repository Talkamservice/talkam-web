import { useNavigate } from "react-router-dom"
import { Button } from "../forms/button"
import { GroupCard } from "./groupcard"

export const JoinGroupCard = ({ avatar, groupName, membersCount, groupId }) => {

    const navigate = useNavigate();

    return (
        <div className="w-full flex items-center justify-between gap-4">
            <GroupCard
                img={avatar}
                group={groupName}
                members={membersCount}
            />

            <Button
                children="View group"
                className="!rounded-full !py-2 !px-4 font-bold"
                onClick={() => navigate(`/group/${groupId}`)}
            />
        </div>
    )
}
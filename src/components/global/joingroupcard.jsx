import { useNavigate } from "react-router-dom"
import { Button } from "../forms/button"
import { GroupCard } from "./groupcard"
import { AuthWrapper } from "../../utils/authWrapper";

export const JoinGroupCard = ({ avatar, groupName, membersCount, groupId }) => {

    const navigate = useNavigate();

    return (
        <div className="w-full flex items-center justify-between gap-4">
            <GroupCard
                img={avatar}
                group={groupName}
                members={membersCount}
            />

            <AuthWrapper onClick={() => navigate(`/group/${groupId}`)}>
                <Button
                    children="View"
                    className="!rounded-full !py-2 !px-4 font-bold"
                />
            </AuthWrapper>
        </div>
    )
}
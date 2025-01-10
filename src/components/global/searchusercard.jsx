import { useNavigate } from "react-router-dom"
import { Avatar } from "./avatar"

export const SearchUserCard = ({ username, avatar, userId }) => {

    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/userprofile/${username ?? userId}`)}
            className="flex items-center gap-3 hover:bg-tgray-xlight px-2 py-3 cursor-pointer">
            <Avatar
                size="sm"
                src={avatar}
            />
            <p className="text-lg font-semibold">{username}</p>
        </div>
    )
}
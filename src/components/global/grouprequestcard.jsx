import { Link } from "react-router-dom"
import { Avatar } from "./avatar"
import * as Icon from 'react-feather'

export const GroupRequestCard = ({ avatar, user, onDecline, onApprove, id }) => {
    return (
        <div className="w-full flex items-center justify-between gap-2">
            <Link to={`/userprofile/${id}`} className="w-full flex items-center gap-2">
                <Avatar src={avatar} size="xsm" />
                <div className="flex flex-col">
                    <p className="text-base font-medium">{user ?? '---'}</p>
                </div>
            </Link>

            <div className="flex items-center gap-4">
                <Icon.X onClick={onDecline} color="#FF0000" size={30} className="p-1 border border-error-500 rounded-full cursor-pointer" />
                <Icon.Check onClick={onApprove} color="#0E956E" size={30} className="p-1 border border-green-500 rounded-full cursor-pointer" />
            </div>
        </div>
    )
}
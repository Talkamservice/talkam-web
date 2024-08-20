import moment from "moment"
import { Avatar } from "../global/avatar"
import { HasReadIcon, UnreadIcon } from "../../assets/icons/generated"

export const ConversationCard = ({ avatar, user, lastMessage, time, status, onClick, activeChat }) => {

    return (
        <div onClick={onClick}
            className={`w-full flex items-start gap-4 justify-between hover:bg-tgray-xlight p-2 cursor-pointer ${activeChat ? 'bg-tgray-xlight' : ''}`}>
            <Avatar src={avatar} size="xsm" />
            <div className="w-full flex flex-col gap-1 truncate flex-1">
                <p className="text-sm font-bold whitespace-nowrap">{user}</p>
                <p className="text-sm font-normal text-[#666666] w-full text-left truncate">{lastMessage}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
                <span className="font-lightNunito text-[#888888] text-xs whitespace-nowrap">{moment(time).format('LT')}</span>
                <span className="text-xs">
                    {status ? <HasReadIcon /> : <UnreadIcon />}
                </span>
            </div>
        </div>
    )
} 
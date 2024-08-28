import { Avatar } from "../global/avatar"
import { HasReadIcon, UnreadIcon } from "../../assets/icons/generated"
import * as Icon from 'react-feather'
import moment from "moment"

export const ConversationCard = ({ avatar, user, lastMessage, time, status, onClick, activeChat, unreadcount, isFromReceiver }) => {

    return (
        <div onClick={onClick}
            className={`relative w-full flex items-start gap-4 justify-between hover:bg-tgray-xlight p-2 cursor-pointer ${activeChat ? 'bg-tgray-xlight' : ''}`}>
            <Avatar src={avatar} size="xsm" />
            <div className="w-full flex flex-col gap-1 truncate flex-1">
                <p className="text-sm font-bold whitespace-nowrap">{user}</p>
                <p className="text-sm font-normal text-[#666666] w-full text-left truncate">{lastMessage}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
                <span className="font-lightNunito text-[#888888] text-xs whitespace-nowrap">{moment(time).format('LT')}</span>
                {
                    !isFromReceiver ?
                        <span className="text-xs">
                            {lastMessage ? (status ? <HasReadIcon /> : <UnreadIcon />) : null}
                        </span>
                        :
                        null
                }
            </div>
            {
                isFromReceiver && unreadcount || isFromReceiver && !status ?
                    <span className='absolute top-2 left-3'>
                        <Icon.Circle
                            size={10}
                            fill="#00FF00"
                            strokeWidth={0}
                            color="#FFF"
                        />
                    </span>
                    :
                    null
            }
        </div >
    )
} 
import { useNavigate } from 'react-router-dom'
import { Avatar } from '../global/avatar';
import * as Icon from 'react-feather'

export const ChatHeader = ({ currentChat, currentUser }) => {

    const navigate = useNavigate();
    const receiver = currentChat?.members?.find(member => member.id !== currentUser.id);


    return (
        <div className={`p-2 flex items-center justify-between space-x-3 w-full border-b border-[#E2E4E9]`}>
            <div className='cursor-pointer' onClick={() => navigate(`/userprofile/${receiver?.id}`)}>
                <Avatar src={receiver?.avatar} size="sm" />
            </div>
            <div className={`flex-1 flex items-center space-x-3`}>
                <span className="flex-1 inline-flex flex-col text-sm">
                    <span className={`font-semibold text-lg`}>
                        {(receiver?.username || receiver?.name) ?? '-- --'}
                    </span>
                </span>
            </div>
            <Icon.MoreVertical />
        </div>
    )
}
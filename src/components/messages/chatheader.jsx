import { useNavigate } from 'react-router-dom'
import { Avatar } from '../global/avatar';
import * as Icon from 'react-feather'

export const ChatHeader = ({ currentChat, currentUser }) => {

    const navigate = useNavigate();

    let receiver;
    // Logic is not meant to be here sha lol
    // The backend made me do this lmaoo cause the receiver and sender were switched in the server response for request
    // and since this is a reusable guy across both sides i had to do this! :)

    if (currentChat) {
        if (currentChat?.receiver?.id === currentUser?.id) {
            receiver = currentChat?.sender
        } else {
            receiver = currentChat?.receiver
        }
    }

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
import * as Icon from 'react-feather'
import { NewNotificationIcon } from '../../assets/icons/generated'

export const PostPopup = ({ author, onClick, id }) => {

    const popItems = [
        {
            name: "Copy link",
            icon: <Icon.Link2 className='-rotate-45' size={15} color='#000000' strokeWidth={2} />
        },
        {
            name: "Get notifications for this thread",
            icon: <NewNotificationIcon className="w-4 h-4" />
        },
        {
            name: `Block ${author}`,
            icon: <Icon.Slash size={15} color='#000000' strokeWidth={2} />
        },
        {
            name: "Report this post",
            icon: <Icon.Flag size={15} color='#000000' strokeWidth={2} />
        },
    ]
    return (
        <ul 
            className="w-full bg-white flex flex-col items-start divide-y divide-tgray-50 border border-tgray-50 overflow-hidden rounded-xl"
        >
            {popItems?.map((item) => (
                <li key={item.name} onClick={() => onClick(item, id)} className="bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight">
                    <span>{item.icon}</span>
                    <p>{item.name}</p>
                </li>
            ))}
        </ul>
    )
}
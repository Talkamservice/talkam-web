import { useLocation, useNavigate } from "react-router-dom";
import { Avatar } from "./avatar";
import { useLazyShowNotificationQuery } from "../../services/notificationsApiSlice";
import classNames from "classnames"
import * as Icon from 'react-feather'

export const NotificationCard = ({ notification, image, style, time, title, type, id, extra, notifyId, read, refetch }) => {

    const location = useLocation();
    const navigate = useNavigate();
    const [trigger, { }] = useLazyShowNotificationQuery()

    const notificationType = {
        "post": `/comment/${id}`,
        "group": `/group/${id}`,
        "conversation": `${location.pathname}?messages`,
        "comment": `/comment/${id}`,
        "user": "",
        "notification": ""
    }

    return (
        <div
            onClick={() => { trigger(notifyId); refetch(); navigate(`${type ? notificationType[type] : location.pathname}`, { state: type === "conversation" ? extra?.sender?.id : id }) }}
            className="cursor-pointer w-full flex items-start gap-4 justify-between hover:bg-tgray-xlight p-2 relative">
            <section className="flex gap-2">
                {
                    type === "conversation" ?
                        <Avatar src={extra?.sender?.avatar} size="xs" />
                        :
                        null
                }
                <section className="flex flex-col gap-2">
                    <p className='text-sm font-bold leading-5'><b>{title ?? 'No title'}</b></p>
                    <p className="w-full flex-2 text-sm font-normal">{notification}</p>
                    <span className="font-medium text-xs">{time}</span>
                </section>
            </section>

            <div
                className={classNames(style, `w-[200px] flex-2 ${image ? 'block' : 'hidden'} cursor-pointer h-[100px] rounded-lg`)}
                style={{
                    backgroundImage: `url(${image})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: "cover",
                    objectFit: 'contain',
                    backgroundColor: "#444444"
                }}
            />

            {
                read === null ?
                    <span className='absolute top-0 left-0'>
                        <Icon.Circle
                            size={10}
                            fill="#FF0000"
                            strokeWidth={0}
                            color="#FFF"
                        />
                    </span>
                    :
                    null
            }
        </div>
    )
}
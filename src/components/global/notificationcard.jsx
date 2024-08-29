import classNames from "classnames"
import { useNavigate } from "react-router-dom";

export const NotificationCard = ({ notification, image, onClick, style, time, title, type, id }) => {

    const navigate = useNavigate();

    const notificationType = {
        "post": `https://web.talkam.prodevs.io/comment/${id}`,
        "group": "",
        "conversation": ``,
        "comment": "",
        "user": "",
        "notification": ""
    }

    // navigate({
    //     pathname: `${location.pathname}/`,
    //     search: `?messages=true`,
    // }, { state: id });

    return (
        <div onClick={onClick} className="cursor-pointer w-full flex items-start gap-4 justify-between">
            <section className="flex flex-col gap-2">
                <p className='text-base font-bold leading-5'><b>{title ?? 'No title'}:</b></p>
                <p className="w-full flex-2 text-sm font-normal">{notification}"</p>
                <span className="font-medium text-xs">{time}</span>
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
        </div>
    )
}
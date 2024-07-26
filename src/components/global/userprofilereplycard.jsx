import classNames from "classnames"

export const UserReplyCard = ({ user, comment, image, onClick, style, time }) => {
    return (
        <div onClick={onClick} className="cursor-pointer w-full flex items-start gap-4 justify-between">
            <section className="flex flex-col gap-2">
                <p className="w-full flex-2 text-sm font-normal">"<span className="pr-2 inline text-sm font-bold">@{user ?? "Anonmyous"}</span>{comment}"</p>
                <span className="font-bold text-xs">{time}</span>
            </section>

            <div
                className={classNames(style,`w-[200px] flex-2 ${ image ? 'block' : 'hidden' } cursor-pointer h-[100px] rounded-lg`)} 
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
import classNames from "classnames"
import { Fragment } from "react";

export const UserReplyCard = ({ user, comment, image, onClick, style, time }) => {
    return (
        <div onClick={onClick} className="cursor-pointer w-full flex items-start gap-4 justify-between">
            <section className="flex flex-col gap-2">
                <p className="w-full flex flex-2 text-sm font-normal">"
                    <span className="pr-2 inline text-sm font-bold">@{user ?? "Anonmyous"}</span>
                    <article className="text-sm font-normal text-wrap whitespace-pre-wrap break-words w-full">
                        {comment.split(/(@\w+)/g).map((part, index) => {
                            // Clean up any leading or trailing `$` character around mentions
                            part = part.replace(/\$/g, ''); // Remove all occurrences of '$'

                            // Check if the part is a mention
                            if (part.startsWith('@')) {
                                const username = part.substring(1); // Remove the '@'
                                return (
                                    <span
                                        key={index}
                                        onClick={() => handleNavigateToProfile(username)} // Link to the user's profile
                                        className="text-blue-700 font-semibold cursor-pointer"
                                    >
                                        {part}
                                    </span>
                                );
                            }

                            // Render regular text
                            return <Fragment key={index}>{part}</Fragment>;
                        })}
                    </article>
                </p>
                <span className="font-bold text-xs">{time}</span>
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
import classNames from "classnames"
import { Fragment } from "react";
import { useLazyGetUserFromUsernameQuery } from "../../services/userApiSlice";

export const UserReplyCard = ({ user, comment, image, onClick, style, time }) => {

    const [trigger, { isLoading: userLoading }] = useLazyGetUserFromUsernameQuery();

    const handleNavigateToProfile = async (username) => {
        try {
            const res = await trigger(username);
            navigate(`/userprofile/${res?.data?.data?.username ?? res?.data?.data?.id}`)
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage)
        }
    }

    return (
        <div onClick={onClick} className="cursor-pointer w-full flex items-start gap-4 justify-between">
            <section className="flex flex-col gap-2">
                <p className="w-full flex flex-2 text-sm font-normal">"
                    <span className="pr-2 inline text-sm font-bold">@{user ?? "Anonmyous"}</span>
                    <article className="text-sm font-normal text-wrap whitespace-pre-wrap break-words w-full">
                        {comment?.split(/(@\w+)/g).map((part, index) => {
                            // Clean up any leading or trailing `$` character around mentions
                            part = part.replace(/\$/g, ''); // Remove all occurrences of '$'

                            // Check if the part is a mention
                            if (part.startsWith('@')) {
                                const username = part.substring(1); // Remove the '@'
                                return (
                                    <span
                                        key={index}
                                        onClick={(event) => { event.stopPropagation(); handleNavigateToProfile(username) }} // Link to the user's profile
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
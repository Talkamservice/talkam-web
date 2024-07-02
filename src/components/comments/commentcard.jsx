import { Avatar } from "../global/avatar"

export const CommentCard = ({  }) => {

    return (
        <>
            <div className={`w-full border border-tgray-50 rounded-xl p-3 flex items-start justify-between gap-4`}>
                <div className="flex items-start justify-start">
                    <Avatar size="sm" />
                </div>
                <section className="flex flex-col gap-1 w-full">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold">daphne322</span>
                        <span className="p-0.5 rounded-full border border-[#F96C40]" />
                        <span className="text-xs text-tprimary-50 font-bold">5hrs</span>
                    </div>

                    <article className="text-sm font-normal">
                        I have been building PCs for 25 years. I have the latest tech in my gaming rig, 
                        but I also have a PC with Pentium 4 and Windows XP with service pack 3. 
                        It plays my music and videos just as well as any PC today.
                    </article>
                </section>
            </div>
        </>
    )
}
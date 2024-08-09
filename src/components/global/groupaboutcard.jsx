export const GroupAboutCard = ({ icon, title, text }) => {
    return (
        <div className="w-full flex items-start gap-3 border-b border-tgray-xlight py-2">
            <span className="flex items-center justify-center w-8 h-8 p-2 border border-tgray-50 rounded-full text-sm font-boldNunito">
                {icon}
            </span>

            <section className="w-full flex flex-col gap-3">
                <header className="w-full flex items-center justify-between gap-4">
                    <h2 className="text-sm font-bold !text-wrap !whitespace-pre-line !break-word">{title}</h2>
                </header>
                <article className="w-full overflow-hidden text-sm font-normal !text-wrap !whitespace-pre-line !break-words">
                    {text}
                </article>
            </section>
        </div>
    )
}
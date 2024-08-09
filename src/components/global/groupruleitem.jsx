import { TrashIcon } from "../../assets/icons/generated"

export const GroupRuleItem = ({ id, index, rule, description, handleRemoveRule }) => {
    return (
        <div className="w-full flex items-start gap-3 border-b border-tgray-50 py-2">
            <span className="flex items-center justify-center w-3 h-3 p-3 border border-tgray-50 rounded-full text-sm font-boldNunito">
                {index}
            </span>

            <section className="w-full flex flex-col gap-3">
                <header className="w-full flex items-center justify-between gap-4">
                    <h2 className="text-sm font-bold !text-wrap !whitespace-pre-line !break-word">{rule}</h2>
                    <span className="cursor-pointer" onClick={() => handleRemoveRule(id)}>
                        <TrashIcon style={{color:"#F95555"}} />
                    </span>
                </header>
                <article className="w-full overflow-hidden text-sm font-normal !text-wrap !whitespace-pre-line !break-words">
                    {description}
                </article>
            </section>
        </div>
    )
}
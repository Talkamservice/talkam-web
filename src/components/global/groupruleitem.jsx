import { TrashIcon } from "../../assets/icons/generated"

export const GroupRuleItem = ({ id, index, rule, description, handleRemoveRule }) => {
    return (
        <div className="flex items-start gap-3 border-b border-tgray-50 py-2">
            <span className="flex items-center justify-center w-3 h-3 p-3 border border-tgray-50 rounded-full text-sm font-boldNunito">
                {index}
            </span>

            <section className="flex flex-col gap-3">
                <header className="flex items-center justify-between gap-4">
                    <h2 className="whitespace-nowrap font-bold text-sm">{rule}</h2>
                    <span className="cursor-pointer" onClick={() => handleRemoveRule(id)}>
                        <TrashIcon style={{color:"#F95555"}} />
                    </span>
                </header>

                <article className="text-sm font-normal">{description}</article>
            </section>
        </div>
    )
}
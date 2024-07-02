export const RuleCard = ({ rule, text }) => {
    return (
        <li className="flex items-center gap-1">
            <p className="text-sm font-normal text-tblack-50"><h6 className=" pr-2 inline text-sm font-bold text-tblack-50 whitespace-nowrap">{rule}:</h6>{text}</p>
        </li>
    )
}
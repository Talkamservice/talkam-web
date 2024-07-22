import * as Icon from "react-feather"

export const CustomRadio = ({node, checked, checkBoxHandler, id, name, label, value}) => {

  return (
    <label
      htmlFor={id}
        onClick={checkBoxHandler}
        className={`
            flex items-start w-full ${checked ? 'border-y border-tprimary-50' : ''}
            ${ checked ? 'bg-[#E0F1FE]' : ''}
            justify-between py-4 px-6 cursor-pointer
        `} 
    >
        {label && <span className="text-sm font-medium">{label}</span>}
        {node && <div className="">{node}</div>}
        <input
            id={id}
            type="radio"
            value={value}
            name={name}
            className="hidden"
        />
        { checked ? <Icon.CheckCircle size={20}color="#017FC8" /> : null }
    </label>

  )
}
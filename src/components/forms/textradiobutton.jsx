export const TextRadioButton = ({ position = 'left', space = false, id, label, node, onChange, checked, defaultChecked, disabled, name, ...rest }) => {

  return (
    <label id={id} className={`flex items-start ${space && `justify-between`} cursor-pointer gap-3`}>
      {position === 'left' && (
        <input
          {...rest}
          onChange={onChange}
          type="radio"
          className="w-5 h-5 border border-tgray-50 cursor-pointer text-tprimary-50 bg-twhite-100
            focus:ring-tprimary-50 dark:focus:ring-tprimary-50 dark:ring-offset-tprimary-100 m-0.5
            dark:border-tgray-50"
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          name={name}
        />
      )}
      {label ? <span className='cursor-pointer text-base text-tblack-100'>{label}</span> : null}
      {node ? node : null}
      {position === 'right' && (
        <input
          {...rest}
          onChange={onChange}
          type="radio"
          className="w-5 h-5 border border-tgray-50 cursor-pointer text-tprimary-50 bg-twhite-100
            focus:ring-tprimary-50 dark:focus:ring-tprimary-50 dark:ring-offset-tprimary-50
            dark:border-tgray-50"
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          name={name}
        />
      )}
    </label>
  )
}
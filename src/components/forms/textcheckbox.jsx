export const TextCheckBox = ({ position='left', space = false, id, label, name, node, onChange, checked, defaultChecked, disabled, ...rest }) => {

    return (
      <label id={id} className={`flex items-start ${space && `justify-between`} cursor-pointer gap-3`}>
        { position === 'left' && (
          <input
            {...rest}
            onChange={onChange}
            type="checkbox"
            className="w-5 h-5 border border-tgray-50 cursor-pointer rounded-md text-tprimary-50 bg-twhite-100
            focus:ring-tprimary-50 dark:focus:ring-tprimary-50 dark:ring-offset-tprimary-50 m-0.5
            dark:border-tgray-50"
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            name={name}
          />
        )}
        {label ? <span className='cursor-pointer text-base text-tblack-100 leading'>{label}</span> : null}
        {node ? node : null}
        { position === 'right' && (
          <input
            {...rest}
            onChange={onChange}
            type="checkbox"
            className="w-5 h-5 border border-tgray-50 cursor-pointer rounded-md text-tprimary-50 bg-twhite-100
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
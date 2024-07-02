import classNames from "classnames";
import PropTypes from "prop-types";
import { ColorRing } from 'react-loader-spinner'
import { useMediaQuery } from "../../hooks/useMediaQuery";

export const Button = ({ 
  id, 
  color, 
  radius, 
  tColor, 
  icon, 
  loadColor, 
  isLoading,  
  fullWidth, 
  className, 
  children, 
  leftIcon, 
  rightIcon, 
  rounded, 
  variant, 
  onClick, 
  disabled, 
  form,
  type,
  ref, 
  ...rest 
  }) => {
  
  let isMonitor = useMediaQuery("(min-width: 2560px)");

    const baseClass = (
      `md:text-sm text-xs cursor-pointer select-none [outline:none] disabled:cursor-not-allowed space-x-2 ${ variant === 'icon' ? '' : 'px-6 py-3.5' }
      disabled:bg-opacity-40 ${fullWidth ? "w-full text-center flex items-center justify-center" : "flex items-center justify-between"}
      transition-all ease-in-out duration-300`
    )
    const primaryClass = (` bg-tprimary-50 focus:ring-blue-300 text-twhite-100`)
    const defaultClass = (` bg-tgray-75 text-tblack-100`)
    const successClass = (` bg-success-150 text-twhite-100`)
    const errorClass = (` bg-error-500 text-twhite-100`)
    const linkClass = (`bg-none text-tblack-100 border-none !px-0 !py-0 space-x-2`)
    const outlineClass = (`bg-none text-tblack-100 border border border-tgray-50`)
    const iconClass = (`p-0! ${color ? color : 'bg-none'} ${radius} ${tColor ? tColor : "black"} flex items-center justify-center space-y-0 space-x-0 m-0!`)

    const buttomMap = {
      "primary" : primaryClass,
      "default" : defaultClass,
      "success" : successClass,
      "error" : errorClass,
      "link" : linkClass,
      "outline" : outlineClass,
      "icon" : iconClass,
    }

  return (
    <button
      ref={ref}
      type = {type}
      onClick={onClick}
      form={form}
      id={id}
      disabled={disabled}
      className={classNames(baseClass,
        rounded ? "rounded-lg" : "",
        buttomMap[variant],
        className
      )}
      {...rest}
    >
      {!!leftIcon && leftIcon}
      {isLoading && 
        <ColorRing
          colors={["#FFF", "#FFF", "#FFF", "#FFF", "#FFF"]}
          ariaLabel="blocks-loading"
          animationDuration="0.75"
          width={isMonitor ? 40 : 20}
          height={isMonitor ? 40 : 20}
          wrapperClass="blocks-wrapper"
          visible={true}
        />
      }
      {children ? <span className="whitespace-nowrap">{children}</span> : null}
      {icon ? <span>{icon}</span> : null}
      {!!rightIcon && rightIcon}
    </button>
  );
}

Button.defaultProps = {
  rounded: true,
  variant: "primary",
};

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  rounded: PropTypes.bool.isRequired,
  variant: PropTypes.oneOf([
    "primary",
    "default",
    "success",
    "error",
    "outline",
    "link",
    "icon",
  ]),
};
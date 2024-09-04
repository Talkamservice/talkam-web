import { useRef } from "react";
import * as Icon from "react-feather";

export const Input = (props) => {
  const {
    id,
    eye,
    icon,
    rounded,
    name,
    wrapperClassName = "",
    placeholder = "",
    label = "",
    type = "text",
    error = false,
    errorText = "",
    readOnly = false,
    required = false,
    onFocus,
    paddingX,
    height,
    textSize,
    ...rest
  } = props;

  const inputRef = useRef();

  return (
    <div className={wrapperClassName}>
      <div
        className={`transition duration-150 ease-in-out space-y-1`}
        onClick={() => inputRef.current.focus()}
      >
        <label htmlFor={id} className="text-sm font-medium text-tblack-100">
          {label} {required && <span className="text-error-100">*</span>}
        </label>
        <input
          autoComplete="new-password"
          name={name}
          onFocus={onFocus}
          readOnly={readOnly}
          ref={inputRef}
          type={type}
          className={`
            ${
              error
                ? "border border-error-100 focus:ring-error-100 focus:ring-opacity-10 focus:border focus:border-error-100"
                : "focus:ring-tblue-100 focus:border-tprimary-100"
            }
            border ${
              error ? "border-error-100" : "border-tgray-50"
            } placeholder:text-tgray-250 relative ${
            rounded ? rounded : "rounded-xl"
          }
          ${paddingX ? paddingX : "px-4"}
          ${height ? height : "py-3.5"}
              placeholder:text-sm focus:ring-4 focus:outline-none w-full ${
                textSize ? textSize : "text-xs"
              } text-tblack-100`}
          id={id}
          placeholder={placeholder}
          {...rest}
        />
        {eye ? (
          <span className="absolute pt-3.5 right-8 text-tgray-150">{icon}</span>
        ) : null}
      </div>
      {errorText && (
        <div className="flex items-center pt-1">
          <Icon.AlertCircle
            size={15}
            color="red"
            style={{ paddingRight: "3px" }}
          />
          <p className="text-xs text-error-100">{errorText}</p>
        </div>
      )}
    </div>
  );
};

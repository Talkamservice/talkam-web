import { useMemo, useRef } from "react";
import * as Icon from "react-feather";

export const TextArea = (props) => {
  const {
    id,
    rows = 4,
    cols = 50,
    value,
    limit,
    limitPosition = "bottom",
    onChange,
    rounded,
    wrapperClassName = "",
    textstyles,
    placeholder = "",
    label = "",
    type = "text",
    error = false,
    errorText = "",
    readOnly = false,
    required = false,
    textSize,
    ...rest
  } = props;

  const inputRef = useRef();

  //   This limit function checks to see if the user is within "15"
  //   characters away from our total character limit...UX necessity

  const isLimit = useMemo(() => {
    return limit - value?.length <= 15 ? true : false;
  }, [limit, value]);

  return (
    <div className={wrapperClassName}>
      <div
        className={`transition duration-150 ease-in-out space-y-1`}
        onClick={() => inputRef.current.focus()}
      >
        <header className="flex items-center justify-between gap-4">
          <label htmlFor={id} className="text-sm text-doc-gray4 font-normal">
            {label} {required && <span className="text-error-500">*</span>}
          </label>
          {limit && limitPosition === "top" ? (
            <p
              className={`${
                isLimit ? "text-error-500" : "text-tgray-75"
              } text-xs`}
            >{`${value?.length ?? 0}/${limit}`}</p>
          ) : null}
        </header>
        <>
          <textarea
            onChange={onChange}
            value={value}
            rows={rows}
            cols={cols}
            readOnly={readOnly}
            ref={inputRef}
            type={type}
            style={textstyles}
            className={`
              ${
                error
                  ? "border border-error-100 focus:ring-error-100 focus:ring-opacity-10 focus:border focus:border-error-100"
                  : "focus:ring-tblue-100 focus:border-tprimary-100"
              }
              border border-tgray-50 placeholder:text-tgray-250 ${
                rounded ? rounded : "rounded-xl"
              }
              p-3 focus:ring-4 focus:outline-none w-full ${
                textSize ? textSize : "text-xs"
              } text-tblack-100 no-scrollbar`}
            id={id}
            placeholder={placeholder}
            {...rest}
          />
          {limit && limitPosition === "bottom" ? (
            <p
              className={`${
                isLimit ? "text-error-500" : "text-tgray-75"
              } text-xs`}
            >{`${value?.length ?? 0}/${limit}`}</p>
          ) : null}
        </>
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

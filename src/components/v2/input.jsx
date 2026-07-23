import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * TalkAM Design System v1.0 — Form input
 * Spec: "TalkAM Design System.dc.html" § Components › Form Inputs
 * States: default · focused · filled · error · disabled.
 */
export const DsInput = ({
  label,
  error,
  disabled,
  className,
  wrapperClassName,
  id,
  ...props
}) => {
  const inputId = id || props.name;

  return (
    <div className={classNames("flex flex-col gap-1.5", wrapperClassName)}>
      {label ? (
        <label
          htmlFor={inputId}
          className={classNames(
            "text-caption font-semiboldNunito",
            error ? "text-signal-error" : disabled ? "text-surface-muted" : "text-ink-600"
          )}
        >
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        disabled={disabled}
        className={classNames(
          "h-12 w-full rounded-ds-md border-[1.5px] px-4 text-body font-regularNunito text-navy-800",
          "placeholder:text-ink-400 transition-shadow duration-200",
          error
            ? "border-signal-error bg-surface-errorField focus:shadow-focus-error"
            : "border-ink-200 bg-ink-50 focus:border-brand-400 focus:shadow-focus-brand",
          disabled && "bg-ink-100 text-surface-muted cursor-not-allowed",
          className
        )}
        {...props}
      />
      {error && typeof error === "string" ? (
        <span className="text-[11px] text-signal-error font-regularNunito">{error}</span>
      ) : null}
    </div>
  );
};

DsInput.propTypes = {
  label: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  disabled: PropTypes.bool,
};

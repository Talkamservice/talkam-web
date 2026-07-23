import classNames from "classnames";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

/**
 * TalkAM Design System v1.0 — Button
 * Spec: "TalkAM Design System.dc.html" § Components › Buttons
 * 7 variants · 4 sizes · default / hover / disabled states.
 *
 * This is the v2 (design-system) button. The v1 button at
 * components/forms/button.jsx is untouched and still used by every
 * existing page.
 */

const VARIANTS = {
  // Navy · main CTA
  primary: "bg-navy-800 text-white hover:bg-navy-900",
  // Blue · posts, links, joins
  brand: "bg-brand-400 text-white hover:bg-brand-600",
  // Teal · book session, therapy CTAs only
  therapy: "bg-wellness-400 text-white hover:bg-wellness-600",
  // Gold · premium / verified
  premium: "bg-gold-400 text-navy-800 hover:bg-[#c9a256]",
  // Secondary action
  outline: "bg-transparent text-navy-800 border-[1.5px] border-navy-800 hover:bg-navy-50",
  // Tertiary
  ghost: "bg-transparent text-brand-400 hover:bg-brand-50",
  // Delete / cancel
  destructive: "bg-signal-error text-white hover:bg-surface-errorInk",
  // On dark surfaces — used by the marketing nav
  translucent:
    "bg-white/10 text-white border-[1.5px] border-white/25 hover:bg-white/20",
};

const SIZES = {
  sm: "h-8 px-3.5 text-caption rounded-ds-sm",
  md: "h-11 px-5 text-body rounded-ds-md",
  lg: "h-14 px-7 text-body-lg rounded-[14px]",
  pill: "h-12 px-7 text-body rounded-full",
};

export const DsButton = ({
  as,
  to,
  href,
  variant = "primary",
  size = "md",
  fullWidth,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}) => {
  const classes = classNames(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-boldNunito",
    "transition-all duration-200 ease-in-out cursor-pointer select-none [outline:none]",
    "focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2",
    VARIANTS[variant],
    SIZES[size],
    fullWidth && "w-full",
    disabled && "opacity-45 cursor-not-allowed pointer-events-none",
    className
  );

  const inner = (
    <>
      {!!leftIcon && leftIcon}
      {children ? <span>{children}</span> : null}
      {!!rightIcon && rightIcon}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {inner}
      </Link>
    );
  }

  if (href || as === "a") {
    return (
      <a href={href} className={classes} {...props}>
        {inner}
      </a>
    );
  }

  return (
    <button type="button" className={classes} disabled={disabled} {...props}>
      {inner}
    </button>
  );
};

DsButton.propTypes = {
  variant: PropTypes.oneOf([
    "primary",
    "brand",
    "therapy",
    "premium",
    "outline",
    "ghost",
    "destructive",
    "translucent",
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg", "pill"]),
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

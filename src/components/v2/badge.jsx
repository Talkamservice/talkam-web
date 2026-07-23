import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * TalkAM Design System v1.0 — Badges & topic chips
 * Spec: "TalkAM Design System.dc.html" § Components › Badges & Topic Chips
 */

const TONES = {
  active: "bg-wellness-25 text-wellness-600",
  verified: "bg-gold-50 text-gold-600",
  pending: "bg-brand-25 text-brand-600",
  rejected: "bg-surface-errorTint text-surface-errorInk",
  offline: "bg-ink-50 text-ink-400 border border-ink-200",
  premium: "bg-gold-100 text-gold-600 border border-gold-200",
  success: "bg-signal-success text-white",
  error: "bg-signal-error text-white",
  brand: "bg-brand-25 text-brand-600",
  teal: "bg-wellness-50 text-wellness-600",
  onDark: "bg-white/10 text-white/80 border border-white/15",
};

export const DsBadge = ({ tone = "brand", dot, icon, className, children, ...props }) => (
  <span
    className={classNames(
      "inline-flex items-center gap-1.5 rounded-full px-3 py-[5px]",
      "text-[11px] font-boldNunito whitespace-nowrap",
      TONES[tone],
      className
    )}
    {...props}
  >
    {dot ? (
      <span
        className={classNames(
          "h-1.5 w-1.5 shrink-0 rounded-full",
          typeof dot === "string" ? dot : "bg-signal-success"
        )}
      />
    ) : null}
    {icon ? <span className="shrink-0">{icon}</span> : null}
    {children}
  </span>
);

/** Selectable community topic chip. */
export const DsChip = ({ active, className, children, ...props }) => (
  <span
    className={classNames(
      "inline-flex cursor-pointer items-center rounded-full px-4 py-[7px] text-caption transition-colors",
      active
        ? "bg-navy-800 text-white font-boldNunito"
        : "bg-brand-25 text-brand-600 font-semiboldNunito hover:bg-brand-400 hover:text-white",
      className
    )}
    {...props}
  >
    {children}
  </span>
);

/** Small uppercase eyebrow label that opens most DS sections. */
export const DsEyebrow = ({ className, children }) => (
  <span
    className={classNames(
      "text-[11px] font-boldNunito tracking-[0.12em] uppercase",
      className
    )}
  >
    {children}
  </span>
);

DsBadge.propTypes = {
  tone: PropTypes.oneOf(Object.keys(TONES)),
  dot: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  children: PropTypes.node,
};

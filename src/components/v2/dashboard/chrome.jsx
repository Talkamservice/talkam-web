import { useEffect } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * Shared chrome for the three B2B dashboards (admin, employee, therapist).
 * Spec: the `.card` / `.badge-*` / `.btn-*` / table rules at the top of
 * "TalkAM B2B Dashboard.dc.html".
 */

/* ── Surfaces ─────────────────────────────────────────────────────────── */

export const Card = ({ className, children, ...props }) => (
  <div
    className={classNames(
      "rounded-ds-lg border border-surface-line bg-white p-5 shadow-[0_1px_4px_rgba(20,27,52,0.04)]",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

/** Card with a header strip and flush content (used for tables). */
export const PanelCard = ({ title, subtitle, action, className, children }) => (
  <div
    className={classNames(
      "overflow-hidden rounded-ds-lg border border-surface-line bg-white shadow-[0_1px_4px_rgba(20,27,52,0.04)]",
      className
    )}
  >
    {title ? (
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 px-5 py-4">
        <div>
          <div className="text-body font-extraboldNunito text-navy-800">{title}</div>
          {subtitle ? (
            <div className="text-[11px] text-ink-400">{subtitle}</div>
          ) : null}
        </div>
        {action}
      </div>
    ) : null}
    {children}
  </div>
);

export const SectionTitle = ({ title, subtitle, className }) => (
  <div className={className}>
    <div className="text-body font-extraboldNunito text-navy-800">{title}</div>
    {subtitle ? <div className="text-[11px] text-ink-400">{subtitle}</div> : null}
  </div>
);

/* ── Badges ───────────────────────────────────────────────────────────── */

const BADGES = {
  green: "bg-wellness-25 text-wellness-600",
  blue: "bg-brand-25 text-brand-600",
  gold: "bg-gold-50 text-gold-600",
  red: "bg-surface-errorTint text-surface-errorInk",
  purple: "bg-[#F5F0FF] text-[#6B44A8]",
  grey: "bg-ink-100 text-ink-500",
};

export const Badge = ({ tone = "blue", dot, className, children }) => (
  <span
    className={classNames(
      "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-[3px] text-[11px] font-boldNunito",
      BADGES[tone],
      className
    )}
  >
    {dot ? (
      <span
        className={classNames(
          "h-[5px] w-[5px] shrink-0 rounded-full",
          dot === "gold" ? "bg-signal-warning" : "bg-signal-success"
        )}
      />
    ) : null}
    {children}
  </span>
);

/* ── Buttons ──────────────────────────────────────────────────────────── */

export const PrimaryButton = ({ className, children, ...props }) => (
  <button
    type="button"
    className={classNames(
      "inline-flex cursor-pointer items-center gap-[7px] rounded-[10px] bg-brand-400 px-4 py-[9px]",
      "text-[13px] font-boldNunito text-white shadow-[0_4px_12px_rgba(1,127,200,0.22)]",
      "transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:shadow-none",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export const SecondaryButton = ({ className, children, ...props }) => (
  <button
    type="button"
    className={classNames(
      "inline-flex cursor-pointer items-center gap-[7px] rounded-[10px] border border-surface-line bg-white px-3.5 py-[9px]",
      "text-[13px] font-semiboldNunito text-ink-600 transition-colors hover:bg-ink-50",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

/* ── Table ────────────────────────────────────────────────────────────── */

export const Table = ({ head, children }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {head.map((cell, i) => (
            <th
              key={i}
              className="whitespace-nowrap border-b border-[#EEEEEE] bg-[#FAFAFA] px-4 py-2.5 text-left text-[11px] font-boldNunito tracking-[0.06em] text-ink-400"
            >
              {cell}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

export const Td = ({ first, className, children, ...props }) => (
  <td
    className={classNames(
      "whitespace-nowrap border-b border-[#F5F5F5] px-4 py-3 text-[13px]",
      first ? "font-boldNunito text-ink-800" : "text-ink-600",
      className
    )}
    {...props}
  >
    {children}
  </td>
);

export const Tr = ({ className, children, ...props }) => (
  <tr className={classNames("[&:last-child>td]:border-b-0 hover:[&>td]:bg-[#FAFAFA]", className)} {...props}>
    {children}
  </tr>
);

/* ── Toggle ───────────────────────────────────────────────────────────── */

export const Toggle = ({ on, label, className, ...props }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={label}
    className={classNames(
      "relative h-[22px] w-10 shrink-0 cursor-pointer rounded-full transition-colors",
      on ? "bg-wellness-400" : "bg-ink-200",
      className
    )}
    {...props}
  >
    <span
      className={classNames(
        "absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.18)] transition-all",
        on ? "left-[20px]" : "left-0.5"
      )}
    />
  </button>
);

/* ── Info strips ──────────────────────────────────────────────────────── */

const STRIPS = {
  blue: "border-[#C9E2F9] bg-brand-25 text-brand-600",
  purple: "border-[#E3D5FF] bg-[#F5F0FF] text-[#5A3990]",
  red: "border-[#FFCDD2] bg-surface-errorTint text-surface-errorInk",
  gold: "border-[#F0D8A8] bg-[#FDF3E3] text-[#7A5608]",
};

export const InfoStrip = ({ tone = "blue", icon, action, className, children }) => (
  <div
    className={classNames(
      "flex flex-wrap items-center gap-2.5 rounded-ds-md border px-4 py-3",
      STRIPS[tone],
      className
    )}
  >
    {icon}
    <span className="min-w-[240px] flex-1 text-caption leading-[1.5]">{children}</span>
    {action}
  </div>
);

/* ── Toast ────────────────────────────────────────────────────────────── */

export const Toast = ({ message }) =>
  message ? (
    <div
      role="status"
      className="flex w-fit items-center gap-2 rounded-[10px] bg-navy-800 px-4 py-2.5 text-[12.5px] font-semiboldNunito text-white"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6FCDB6" strokeWidth="2.5" strokeLinecap="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {message}
    </div>
  ) : null;

/* ── Modal ────────────────────────────────────────────────────────────── */

export const Modal = ({ open, onClose, title, subtitle, width = "max-w-[520px]", children }) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center overflow-y-auto bg-navy-900/50 p-4 backdrop-blur-sm sm:p-8">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={classNames(
          "my-auto w-full overflow-hidden rounded-ds-xl bg-white shadow-e4",
          width
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-ink-100 px-6 py-4">
          <div>
            <div className="text-[16px] font-extraboldNunito text-navy-800">{title}</div>
            {subtitle ? <div className="text-[11.5px] text-ink-400">{subtitle}</div> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 cursor-pointer rounded-ds-sm p-1 text-ink-400 hover:bg-ink-50 hover:text-navy-800"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

/* ── KPI card ─────────────────────────────────────────────────────────── */

export const KpiCard = ({ icon, iconBg, badge, value, label, dark, children }) =>
  dark ? (
    <div className="relative overflow-hidden rounded-ds-lg border border-navy-600 bg-[linear-gradient(135deg,#141B34,#1A2E5A)] p-5 shadow-[0_4px_16px_rgba(20,27,52,0.18)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -top-4 h-[100px] w-[100px] rounded-full bg-[radial-gradient(circle,rgba(219,182,110,0.18)_0%,transparent_65%)]"
      />
      <div className="mb-3.5 flex items-start justify-between">
        <span className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-gold-400/[0.14]">
          {icon}
        </span>
        {badge}
      </div>
      <div className="relative z-[1] mb-[3px] text-[28px] font-extraboldNunito text-white">
        {value}
      </div>
      <div className="relative z-[1] flex flex-wrap items-center gap-1.5 text-caption text-white/45">
        {label}
        {children}
      </div>
    </div>
  ) : (
    <Card>
      <div className="mb-3.5 flex items-start justify-between">
        <span
          className={classNames(
            "flex h-[38px] w-[38px] items-center justify-center rounded-[11px]",
            iconBg
          )}
        >
          {icon}
        </span>
        {badge}
      </div>
      <div className="mb-[3px] text-[28px] font-extraboldNunito text-navy-800">{value}</div>
      <div className="text-caption text-ink-400">{label}</div>
      {/* Optional footnote — used for the "withheld until N employees" note.
          Renders nothing when absent, so the card is unchanged without it. */}
      {children}
    </Card>
  );

Modal.propTypes = { open: PropTypes.bool, onClose: PropTypes.func, title: PropTypes.string };
Toggle.propTypes = { on: PropTypes.bool, label: PropTypes.string };

/**
 * The suppressed-aggregate state for the admin dashboard.
 *
 * Shown wherever a company-wide figure is withheld because too few employees
 * contributed. It says WHY, so an admin never reads a blank panel as "nobody
 * used it" — see planning-docs/web-api/03-admin-dashboard.md §2.
 */
export const Withheld = ({ cohort, floor = 5, className }) => (
  <div
    className={classNames(
      "flex items-center gap-2.5 rounded-[10px] bg-[#F8F9FC] px-3.5 py-3 text-[11.5px] leading-[1.6] text-ink-400",
      className
    )}
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9299A8" strokeWidth="2" className="shrink-0">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    </svg>
    <span>
      Not enough data yet. Figures appear once at least {floor} employees have joined
      {typeof cohort === "number" ? ` \u2014 you have ${cohort}` : ""}. This protects your
      team&apos;s anonymity.
    </span>
  </div>
);

/** Loading placeholder on the deck's own ink-100 surface — no layout shift. */
export const AdminSkeleton = ({ className }) => (
  <div className={classNames("animate-pulse rounded-[10px] bg-ink-100", className)} />
);

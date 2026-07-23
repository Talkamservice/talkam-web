import classNames from "classnames";
import PropTypes from "prop-types";
import TalkamWordmark from "../../assets/svgs/talkam-logo.svg";
import { businessPreview } from "../../fakedata/v2/landing";
import { employeeRoster, billingPreview } from "../../fakedata/v2/forbusiness";

/**
 * Static, decorative screenshots of the admin dashboard, shown inside a
 * BrowserFrame on the marketing pages.
 * Spec: "TalkAM Landing Page.dc.html" § 1C and "TalkAM For Business.dc.html".
 *
 * These are marketing chrome, not the real dashboard — the live Admin
 * Dashboard is built separately under routes/v2/business/admin.
 */

const KPI_ICONS = {
  users: (color) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
    </svg>
  ),
  check: (color) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  calendar: (color) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  dollar: (color) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
};

/** Dark sidebar shared by every preview. */
const PreviewSidebar = ({ items, active = 0, width = "w-[150px]" }) => (
  <div className={classNames("shrink-0 bg-navy-800 px-3 py-4", width)}>
    <img
      src={TalkamWordmark}
      alt=""
      className="mb-5 h-4 w-auto [filter:brightness(0)_invert(1)]"
    />
    <div className="flex flex-col gap-1">
      {items.map((item, i) => (
        <div
          key={item}
          className={classNames(
            "rounded-ds-sm px-2.5 py-2 text-[11px]",
            i === active
              ? "bg-brand-400 font-boldNunito text-white"
              : "font-semiboldNunito text-white/50"
          )}
        >
          {item}
        </div>
      ))}
    </div>
  </div>
);

/** Overview: KPI row + anonymised top-topics breakdown. */
export const OverviewPreview = ({ nav = businessPreview.nav, height = "h-[400px]" }) => (
  <div className={classNames("flex bg-surface-page", height)}>
    <PreviewSidebar items={nav} />
    <div className="flex-1 overflow-hidden p-[18px]">
      <div className="text-[15px] font-extraboldNunito text-navy-800">Overview</div>
      <div className="mb-3 text-[11px] text-[#9299A8]">{businessPreview.company}</div>

      <div className="mb-3 grid grid-cols-4 gap-2">
        {businessPreview.kpis.map((kpi) => (
          <div
            key={kpi.label}
            className={classNames(
              "rounded-[11px] p-[11px]",
              kpi.dark
                ? "bg-[linear-gradient(135deg,#141B34,#1A2E5A)]"
                : "border border-[#EDEFF3] bg-white"
            )}
          >
            <div
              className={classNames(
                "mb-[7px] flex h-[26px] w-[26px] items-center justify-center rounded-ds-sm",
                kpi.dark ? "bg-gold-400/[0.16]" : kpi.iconBg
              )}
            >
              {KPI_ICONS[kpi.icon](kpi.iconColor)}
            </div>
            <div
              className={classNames(
                "text-[19px] font-extraboldNunito",
                kpi.dark ? "text-white" : "text-navy-800"
              )}
            >
              {kpi.value}
            </div>
            <div
              className={classNames("text-[9.5px]", kpi.dark ? "text-white/50" : "text-[#9299A8]")}
            >
              {kpi.label}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-ds-md border border-[#EDEFF3] bg-white p-3.5">
        <div className="mb-[11px] flex items-center justify-between">
          <div className="text-caption font-extraboldNunito text-navy-800">Top Topics</div>
          <div className="text-[10px] text-[#9299A8]">Anonymised · no individual data</div>
        </div>
        <div className="flex flex-col gap-2">
          {businessPreview.topics.map((topic) => (
            <div key={topic.label}>
              <div className="mb-[3px] flex justify-between text-[11px] text-[#5B6577]">
                <span>{topic.label}</span>
                <span className="font-boldNunito" style={{ color: topic.color }}>
                  {topic.pct}%
                </span>
              </div>
              <div className="h-[5px] overflow-hidden rounded-[3px] bg-ink-100">
                <div
                  className="h-full"
                  style={{ width: `${topic.pct}%`, backgroundColor: topic.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/** Employees: anonymised seat roster. */
export const EmployeesPreview = () => (
  <div className="h-[400px] bg-surface-page p-5">
    <div className="mb-3.5 flex items-center justify-between gap-3">
      <div>
        <div className="text-[16px] font-extraboldNunito text-navy-800">Employees</div>
        <div className="text-[11px] text-[#9299A8]">187 active · 63 pending invite</div>
      </div>
      <div className="rounded-[9px] bg-brand-400 px-3.5 py-2 text-[11px] font-extraboldNunito text-white">
        + Invite
      </div>
    </div>

    <div className="overflow-hidden rounded-ds-md border border-[#EDEFF3] bg-white">
      <div className="grid grid-cols-[2fr_1.4fr_1fr] bg-[#F7F9FC] px-4 py-[11px] text-[10px] font-extraboldNunito tracking-[0.04em] text-[#9299A8]">
        <span>EMPLOYEE</span>
        <span>STATUS</span>
        <span>SESSIONS</span>
      </div>
      {employeeRoster.map((row) => (
        <div
          key={row.masked}
          className="grid grid-cols-[2fr_1.4fr_1fr] items-center border-t border-[#F0F2F6] px-4 py-3"
        >
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[11px] font-extraboldNunito text-white"
              style={{ background: row.bg }}
            >
              {row.ini}
            </span>
            <div>
              <div className="text-caption font-boldNunito text-navy-800">{row.masked}</div>
              <div className="text-[10px] text-[#B4BAC6]">Anonymised ID</div>
            </div>
          </div>
          <div>
            <span
              className={classNames(
                "rounded-full px-2.5 py-[3px] text-[10.5px] font-extraboldNunito",
                row.status === "Active"
                  ? "bg-wellness-50 text-wellness-600"
                  : "bg-[#FBF3E3] text-[#9A7526]"
              )}
            >
              {row.status}
            </span>
          </div>
          <div className="text-caption font-boldNunito text-navy-800">{row.sessions}</div>
        </div>
      ))}
    </div>
  </div>
);

/** Billing: this-month spend, seats billed, recent invoices. */
export const BillingPreview = () => (
  <div className="h-[400px] bg-surface-page p-5">
    <div className="text-[16px] font-extraboldNunito text-navy-800">Billing</div>
    <div className="mb-4 text-[11px] text-[#9299A8]">
      Post-paid · billed monthly via Flutterwave
    </div>

    <div className="mb-3.5 grid grid-cols-2 gap-2.5">
      <div className="rounded-ds-md bg-navy-800 p-4 text-white">
        <div className="text-[10px] font-boldNunito text-white/55">THIS MONTH</div>
        <div className="mt-1 text-h2 font-extraboldNunito">
          {billingPreview.thisMonth.amount}
        </div>
        <div className="mt-0.5 text-[10.5px] text-brand-200">
          {billingPreview.thisMonth.note}
        </div>
      </div>
      <div className="rounded-ds-md border border-[#EDEFF3] bg-white p-4">
        <div className="text-[10px] font-boldNunito text-[#9299A8]">SEATS BILLED</div>
        <div className="mt-1 text-h2 font-extraboldNunito text-navy-800">
          {billingPreview.seatsBilled.count}
        </div>
        <div className="mt-0.5 text-[10.5px] text-wellness-400">
          {billingPreview.seatsBilled.note}
        </div>
      </div>
    </div>

    <div className="overflow-hidden rounded-ds-md border border-[#EDEFF3] bg-white">
      <div className="border-b border-[#F0F2F6] px-4 py-[11px] text-[11px] font-extraboldNunito text-navy-800">
        Recent invoices
      </div>
      {billingPreview.invoices.map((invoice) => (
        <div
          key={invoice.month}
          className="flex items-center justify-between border-b border-[#F5F6F9] px-4 py-[11px]"
        >
          <div>
            <div className="text-caption font-boldNunito text-navy-800">{invoice.month}</div>
            <div className="text-[10.5px] text-[#9299A8]">{invoice.sessions} sessions</div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="text-[12.5px] font-extraboldNunito text-navy-800">
              {invoice.amount}
            </div>
            <span className="rounded-full bg-wellness-50 px-2.5 py-[3px] text-[10px] font-extraboldNunito text-wellness-600">
              Paid
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

OverviewPreview.propTypes = { nav: PropTypes.arrayOf(PropTypes.string) };

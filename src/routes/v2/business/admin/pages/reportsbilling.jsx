import { useState } from "react";
import classNames from "classnames";
import * as Icon from "react-feather";
import {
  Card,
  PanelCard,
  Badge,
  Toggle,
  Table,
  Td,
  Tr,
  InfoStrip,
  PrimaryButton,
  SecondaryButton,
} from "../../../../../components/v2/dashboard/chrome";
import { useAdminModal } from "../adminmodals";
import {
  reportCards,
  companyMonthly,
  roi,
  currentPlan,
  invoices,
  networkStats,
  PLANS,
  tierForSeats,
  naira,
  CURRENT_SEATS,
} from "../../../../../fakedata/v2/admin";

/** Admin › Reports and Billing. */

const REPORT_BTN = {
  primary: "bg-brand-400 text-white hover:bg-brand-600",
  teal: "bg-wellness-50 text-wellness-600 hover:bg-wellness-25",
  gold: "bg-gold-50 text-gold-600 hover:bg-gold-100",
};

export const AdminReports = () => {
  const { open, showToast } = useAdminModal();
  const [digest, setDigest] = useState(true);
  const max = Math.max(...companyMonthly.map((m) => m.value));

  return (
    <>
      <div className="grid gap-3.5 lg:grid-cols-3">
        {reportCards.map((card) => (
          <Card key={card.key} className="flex flex-col">
            <span
              className={classNames(
                "mb-3.5 flex h-11 w-11 items-center justify-center rounded-ds-md",
                card.iconBg
              )}
            >
              {card.key === "usage" ? (
                <Icon.Grid size={20} color={card.iconColor} />
              ) : card.key === "wellness" ? (
                <Icon.BarChart2 size={20} color={card.iconColor} />
              ) : (
                <Icon.DollarSign size={20} color={card.iconColor} />
              )}
            </span>
            <div className="mb-1 text-body font-extraboldNunito text-navy-800">
              {card.title}
            </div>
            <p className="mb-3.5 text-caption leading-[1.5] text-ink-400">{card.body}</p>

            {card.key === "roi" ? (
              <div className="mb-3.5 flex flex-col gap-1.5 rounded-[10px] bg-gold-50 p-3">
                <div className="flex justify-between gap-3">
                  <span className="text-[11px] text-ink-500">Gross productivity value</span>
                  <span className="text-[11.5px] font-boldNunito text-navy-800">
                    {roi.grossValue}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-[11px] text-ink-500">Program cost this month</span>
                  <span className="text-[11.5px] font-boldNunito text-navy-800">
                    {roi.programCost}
                  </span>
                </div>
                <div className="flex justify-between gap-3 border-t border-[#F0E4C8] pt-1.5">
                  <span className="text-[11.5px] font-boldNunito text-navy-800">Net ROI</span>
                  <span className="text-caption font-extraboldNunito text-gold-600">
                    {roi.netROI} · {roi.multiple}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => open("roi")}
                  className="mt-0.5 cursor-pointer text-left text-[10.5px] text-gold-600 underline"
                >
                  See the 4 factors behind this number
                </button>
              </div>
            ) : null}

            <div className="mt-auto flex items-center justify-between gap-3">
              <span className="text-[11px] text-ink-400">
                Last generated: {card.generated}
              </span>
              <button
                type="button"
                onClick={() => showToast(`${card.title} download started`)}
                className={classNames(
                  "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-[9px] px-3 py-1.5 text-[12px] font-boldNunito transition-colors",
                  REPORT_BTN[card.tone]
                )}
              >
                <Icon.Download size={12} />
                Download PDF
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Engagement trend */}
      <Card>
        <div className="mb-0.5 flex flex-wrap items-center justify-between gap-2">
          <div className="text-body font-extraboldNunito text-navy-800">
            Engagement Since Launch
          </div>
          <span className="text-[11px] font-boldNunito text-wellness-400">↑ 312% since Feb</span>
        </div>
        <p className="mb-4 text-caption leading-[1.5] text-ink-400">
          Total sessions booked company-wide, month over month, since your first employee
          activated. Anonymised — no individual breakdown.
        </p>
        <div className="flex h-[120px] items-end gap-2.5">
          {companyMonthly.map((m, i) => (
            <div key={m.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
              <span className="text-[10.5px] font-boldNunito text-navy-800">{m.value}</span>
              <div className="flex h-full w-full items-end">
                <div
                  className={classNames(
                    "w-full rounded-t-[4px]",
                    i === companyMonthly.length - 1 ? "bg-brand-400" : "bg-brand-50"
                  )}
                  style={{ height: `${Math.round((m.value / max) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-surface-muted">{m.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Scheduled reports */}
      <Card>
        <div className="text-body font-extraboldNunito text-navy-800">
          Schedule Automated Reports
        </div>
        <div className="mb-4 text-caption text-ink-400">
          Get reports delivered to your inbox automatically
        </div>
        <div className="flex flex-wrap items-center gap-3.5 rounded-ds-md bg-ink-50 px-4 py-3.5">
          <Icon.Calendar size={20} className="shrink-0 text-brand-400" />
          <div className="min-w-[200px] flex-1">
            <div className="mb-0.5 text-[13px] font-boldNunito text-ink-800">
              Monthly digest every 1st of the month
            </div>
            <div className="text-[11px] text-ink-500">Sent to adaeze.okonkwo@zenithbank.com</div>
          </div>
          <Toggle on={digest} label="Monthly digest" onClick={() => setDigest((v) => !v)} />
        </div>
      </Card>
    </>
  );
};

export const AdminBilling = () => {
  const { open, showToast } = useAdminModal();
  const [planKey, setPlanKey] = useState("lite");
  const [seats, setSeats] = useState("250");
  const [quoteSent, setQuoteSent] = useState(false);

  const plan = PLANS[planKey];
  const seatNum = parseInt(seats, 10) || 0;
  const outOfRange =
    !plan.custom && (seatNum < plan.minSeats || seatNum > plan.maxSeats);
  const perSeat = plan.custom ? 0 : tierForSeats(plan.tiers, seatNum).price;

  const sessionsRemaining = networkStats.sessionsBundle - networkStats.sessionsUsed;
  const sessionPct = Math.round(
    (networkStats.sessionsUsed / networkStats.sessionsBundle) * 100
  );
  const sessionsLow = sessionsRemaining <= 5;

  return (
    <>
      {sessionsLow ? (
        <InfoStrip
          tone="gold"
          icon={<Icon.AlertTriangle size={18} className="shrink-0 text-gold-600" />}
          action={
            <button
              type="button"
              onClick={() => open("topUp")}
              className="shrink-0 cursor-pointer rounded-[9px] bg-gold-600 px-4 py-2 text-[12.5px] font-extraboldNunito text-white"
            >
              Top Up
            </button>
          }
        >
          <strong className="font-boldNunito">Session bundle running low</strong> —{" "}
          {sessionsRemaining} sessions remaining. Top up to avoid disruption.
        </InfoStrip>
      ) : null}

      {/* Current plan */}
      <div className="relative overflow-hidden rounded-ds-lg bg-[linear-gradient(135deg,#141B34,#1A2E5A)] p-6 shadow-[0_4px_20px_rgba(20,27,52,0.18)] lg:px-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-5 -top-5 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(219,182,110,0.14)_0%,transparent_65%)]"
        />
        <div className="relative z-[1] flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-[280px] flex-1">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-gold-400/30 bg-gold-400/[0.15] px-3 py-1">
              <span className="text-[11px] text-gold-400">✦</span>
              <span className="text-[10px] font-boldNunito tracking-[0.06em] text-gold-400">
                {currentPlan.label}
              </span>
            </div>
            <div className="flex max-w-[440px] flex-col gap-[9px]">
              {currentPlan.lines.map((line) => (
                <div key={line.label} className="flex items-center justify-between gap-3">
                  <span className="text-[12.5px] text-white/60">{line.label}</span>
                  <span className="text-[13px] font-boldNunito text-white">{line.value}</span>
                </div>
              ))}
              <div className="mt-0.5 flex items-center justify-between gap-3 border-t border-white/[0.14] pt-[11px]">
                <span className="text-body font-extraboldNunito text-white">Total / month</span>
                <span className="text-h2 font-extraboldNunito text-white">
                  {currentPlan.total}
                </span>
              </div>
            </div>
            <div className="mt-3 text-[11.5px] text-white/40">{currentPlan.renews}</div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => showToast("Upgrade flow coming from the plan picker below")}
              className="cursor-pointer rounded-[10px] bg-gold-400 px-[18px] py-[9px] text-[13px] font-extraboldNunito text-navy-800"
            >
              Upgrade Plan
            </button>
            <button
              type="button"
              onClick={() => open("addSeats")}
              className="cursor-pointer rounded-[10px] border border-white/[0.12] bg-white/[0.08] px-[18px] py-[9px] text-[13px] font-semiboldNunito text-white/60"
            >
              Manage Seats
            </button>
          </div>
        </div>
      </div>

      {/* Session bundle usage */}
      <Card>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-body font-extraboldNunito text-navy-800">
              Session Bundle Usage
            </div>
            <div className="text-[11px] text-ink-400">
              Resets {networkStats.nextReset} · unused sessions do not roll over
            </div>
          </div>
          <PrimaryButton onClick={() => open("topUp")}>Top Up Sessions</PrimaryButton>
        </div>
        <div className="mb-2 flex items-baseline gap-2">
          <span className="text-[26px] font-extraboldNunito text-navy-800">
            {networkStats.sessionsUsed} / {networkStats.sessionsBundle}
          </span>
          <span className="text-caption text-ink-500">sessions used this month</span>
        </div>
        <div className="mb-2 h-2 rounded-[4px] bg-ink-100">
          <div
            className={classNames(
              "h-2 rounded-[4px]",
              sessionsLow ? "bg-gold-600" : "bg-brand-400"
            )}
            style={{ width: `${sessionPct}%` }}
          />
        </div>
        <p className="text-caption text-ink-500">
          {sessionsRemaining} sessions remaining · ₦8,000 per session, reserved on your
          invoice and drawn down as sessions happen
        </p>
      </Card>

      {/* Usage cards */}
      <div className="grid gap-3.5 lg:grid-cols-3">
        <Card>
          <div className="mb-2.5 text-[11px] font-boldNunito tracking-[0.06em] text-ink-400">
            SEAT USAGE
          </div>
          <div className="mb-1 text-[26px] font-extraboldNunito text-navy-800">247 / 250</div>
          <div className="mb-2 h-[5px] rounded-[3px] bg-ink-100">
            <div className="h-[5px] rounded-[3px] bg-brand-400" style={{ width: "98.8%" }} />
          </div>
          <div className="text-caption text-ink-500">
            3 seats remaining ·{" "}
            <button
              type="button"
              onClick={() => open("addSeats")}
              className="cursor-pointer font-boldNunito text-brand-400"
            >
              Add more
            </button>
          </div>
        </Card>
        <Card>
          <div className="mb-2.5 text-[11px] font-boldNunito tracking-[0.06em] text-ink-400">
            THERAPIST ACCESS SEATS
          </div>
          <div className="mb-1 text-[26px] font-extraboldNunito text-navy-800">50 / 50</div>
          <div className="mb-2 h-[5px] rounded-[3px] bg-ink-100">
            <div className="h-[5px] w-full rounded-[3px] bg-wellness-400" />
          </div>
          <div className="text-caption text-ink-500">Flat ₦3,500 per employee seat</div>
        </Card>
        <Card>
          <div className="mb-2.5 text-[11px] font-boldNunito tracking-[0.06em] text-ink-400">
            NEXT INVOICE
          </div>
          <div className="mb-1 text-[26px] font-extraboldNunito text-navy-800">₦475,000</div>
          <div className="mb-2.5 text-caption text-ink-500">Due Aug 1, 2026</div>
          <span className="text-[11px] font-semiboldNunito text-wellness-400">
            Auto-pay enabled
          </span>
        </Card>
      </div>

      {/* Invoices */}
      <PanelCard
        title="Invoice History"
        subtitle="Last 12 months · manual bank transfer"
        action={<SecondaryButton>Download All</SecondaryButton>}
      >
        <Table head={["INVOICE", "PERIOD", "SEATS", "AMOUNT", "STATUS", "ACTION"]}>
          {invoices.map((inv) => (
            <Tr key={inv.id}>
              <Td first>{inv.id}</Td>
              <Td className="text-ink-500">{inv.period}</Td>
              <Td>{inv.seats}</Td>
              <Td className="font-boldNunito text-ink-800">{inv.amount}</Td>
              <Td>
                <Badge tone={inv.tone} dot={inv.tone === "green"}>
                  {inv.status}
                </Badge>
              </Td>
              <Td>
                <div className="flex gap-1.5">
                  <SecondaryButton
                    onClick={() => open("invoice", inv.id)}
                    className="!px-2.5 !py-1.5 !text-[11px]"
                  >
                    View
                  </SecondaryButton>
                  {inv.tone === "gold" ? (
                    <button
                      type="button"
                      onClick={() => showToast(`${inv.id} marked paid`)}
                      className="cursor-pointer rounded-[7px] bg-brand-400 px-2.5 py-1.5 text-[11px] font-boldNunito text-white"
                    >
                      Mark Paid
                    </button>
                  ) : null}
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      </PanelCard>

      {/* Plans */}
      <Card>
        <div className="text-body font-extraboldNunito text-navy-800">Plans</div>
        <div className="mb-4 text-[11px] text-ink-400">
          Wellbeing Lite is your active plan today — select any plan below to see its
          per-seat pricing
        </div>

        <div className="mb-5 grid gap-3 lg:grid-cols-3">
          {Object.values(PLANS).map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => {
                setPlanKey(p.key);
                setSeats(p.custom ? "" : String(p.defaultSeats));
                setQuoteSent(false);
              }}
              className={classNames(
                "relative cursor-pointer rounded-ds-md border-[1.5px] p-4 text-left transition-colors",
                planKey === p.key ? "border-brand-400 bg-brand-25" : "border-ink-200 bg-white"
              )}
            >
              {p.isCurrent ? (
                <span className="absolute -top-[9px] left-3.5 rounded-full bg-brand-400 px-[9px] py-[3px] text-[9px] font-extraboldNunito tracking-[0.04em] text-white">
                  CURRENT
                </span>
              ) : null}
              <div className="mb-1 mt-1 text-[13px] font-extraboldNunito text-navy-800">
                {p.name}
              </div>
              <span className="mb-2 inline-block rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-boldNunito text-ink-500">
                {p.seatRange}
              </span>
              <div className="mb-2 text-h3 font-extraboldNunito text-navy-800">
                {p.custom ? (
                  "Custom"
                ) : (
                  <>
                    {naira(p.tiers[p.tiers.length - 1].price)}
                    <span className="text-[11px] font-regularNunito text-ink-400">
                      {" "}
                      /seat from
                    </span>
                  </>
                )}
              </div>
              <ul className="text-[11px] leading-[1.7] text-ink-500">
                {p.features.map((f) => (
                  <li key={f}>· {f}</li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        <div className="border-t border-ink-100 pt-4">
          {plan.custom ? (
            quoteSent ? (
              <div className="flex flex-col items-start gap-3 py-2">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-25">
                  <Icon.Check size={22} className="text-brand-400" />
                </span>
                <div className="text-[15px] font-extraboldNunito text-navy-800">
                  Quote request sent
                </div>
                <p className="max-w-[440px] text-[12.5px] leading-[1.7] text-ink-500">
                  Our enterprise team will reach out to adaeze.okonkwo@zenithbank.com
                  within 1 business day with a custom Wellbeing Plus proposal.
                </p>
                <button
                  type="button"
                  onClick={() => setQuoteSent(false)}
                  className="cursor-pointer text-caption font-boldNunito text-brand-400"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <>
                <div className="mb-0.5 text-caption font-boldNunito text-navy-800">
                  Request custom pricing for Wellbeing Plus
                </div>
                <p className="mb-4 text-[11px] text-ink-400">
                  For 2,000+ seats, multi-country rollouts, or a dedicated account
                  manager — our enterprise team builds a plan around your organisation
                </p>
                <div className="mb-3 grid gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-boldNunito text-ink-600">
                      Estimated team size
                    </span>
                    <input
                      type="number"
                      placeholder="e.g. 2500"
                      className="h-[42px] rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px] text-ink-800"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-boldNunito text-ink-600">
                      Best contact email
                    </span>
                    <input
                      defaultValue="adaeze.okonkwo@zenithbank.com"
                      className="h-[42px] rounded-[10px] border-[1.5px] border-brand-400 px-3.5 text-[13px] text-ink-800 shadow-focus-brand"
                    />
                  </label>
                </div>
                <label className="mb-4 flex flex-col gap-1.5">
                  <span className="text-[11px] font-boldNunito text-ink-600">
                    Anything specific you need?
                  </span>
                  <textarea
                    rows={3}
                    placeholder="e.g. rollout across 3 subsidiaries, custom EAP reporting cadence…"
                    className="resize-none rounded-ds-md border-[1.5px] border-ink-200 px-3.5 py-3 text-[13px] text-ink-800"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setQuoteSent(true)}
                  className="h-12 w-full cursor-pointer rounded-ds-md bg-navy-800 text-body font-extraboldNunito text-white hover:bg-navy-900"
                >
                  Request Custom Quote →
                </button>
              </>
            )
          ) : (
            <>
              <div className="mb-0.5 text-caption font-boldNunito text-navy-800">
                {plan.name} volume pricing
              </div>
              <p className="mb-3.5 text-[11px] text-ink-400">
                Your per-seat rate is based on total licensed seats — it applies
                automatically the moment you cross a tier
              </p>
              <div className="mb-5 flex flex-col gap-1.5">
                {plan.tiers.map((t) => {
                  const isCurrent = seatNum >= t.min && seatNum <= t.max;
                  return (
                    <div
                      key={t.min}
                      className={classNames(
                        "flex items-center rounded-[9px] border px-3 py-[9px]",
                        isCurrent ? "border-[#C9E2F9] bg-brand-25" : "border-ink-100 bg-[#FAFAFA]"
                      )}
                    >
                      <span className="flex-1 text-[12.5px] font-semiboldNunito text-ink-800">
                        {t.min}–{t.max} seats
                      </span>
                      <span className="text-[12.5px] font-boldNunito text-navy-800">
                        {naira(t.price)}/seat
                      </span>
                      {isCurrent ? (
                        <span className="ml-2.5 rounded-full bg-brand-400 px-2 py-[3px] text-[9px] font-extraboldNunito text-white">
                          YOUR TIER
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3.5 rounded-[14px] bg-ink-50 p-4">
                <div className="text-[13px] font-extraboldNunito text-navy-800">
                  Choose how many seats to pay for
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    aria-label="Decrease seats"
                    onClick={() => setSeats(String(Math.max(1, seatNum - 1)))}
                    className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-[9px] border-[1.5px] border-ink-200 bg-white text-[18px] font-boldNunito text-ink-600"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    aria-label="Seats to pay for"
                    className="h-9 w-[100px] rounded-[9px] border-[1.5px] border-ink-200 px-3 text-center text-body font-boldNunito text-ink-800"
                  />
                  <button
                    type="button"
                    aria-label="Increase seats"
                    onClick={() => setSeats(String(seatNum + 1))}
                    className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-[9px] border-[1.5px] border-ink-200 bg-white text-[18px] font-boldNunito text-ink-600"
                  >
                    +
                  </button>
                  <span className="text-caption text-ink-400">seats</span>
                  {outOfRange ? (
                    <span className="text-[11px] font-boldNunito text-surface-errorInk">
                      {plan.name} covers {plan.minSeats}–{plan.maxSeats} seats
                    </span>
                  ) : null}
                </div>
                <div className="flex justify-between gap-3 border-t border-surface-line pt-3">
                  <span className="text-caption text-ink-500">Rate per seat</span>
                  <span className="text-[13px] font-boldNunito text-navy-800">
                    {outOfRange ? "—" : `${naira(perSeat)}/seat`}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-caption text-ink-500">Monthly total</span>
                  <span className="text-[15px] font-extraboldNunito text-navy-800">
                    {outOfRange ? "—" : naira(perSeat * seatNum)}
                  </span>
                </div>
                <PrimaryButton
                  disabled={outOfRange}
                  className="justify-center"
                  onClick={() =>
                    open("planCheckout", {
                      planName: plan.name,
                      seats: seatNum,
                      perSeat: `${naira(perSeat)}/seat`,
                      monthly: naira(perSeat * seatNum),
                    })
                  }
                >
                  Continue to Payment →
                </PrimaryButton>
              </div>
            </>
          )}
        </div>
      </Card>
    </>
  );
};

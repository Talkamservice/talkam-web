import { useState } from "react";
import PropTypes from "prop-types";
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
  SecondaryButton,
} from "../../../../../components/v2/dashboard/chrome";
import { Withheld, AdminSkeleton } from "../../../../../components/v2/dashboard/chrome";
import { useAdminModal } from "../adminmodals";
import { naira, tierForSeats } from "../../../../../constants/admindashboard";
import {
  useGetAdminReportsQuery,
  useGetAdminOverviewQuery,
  useGetBillingQuery,
  useGetBillingInvoicesQuery,
  useCreateVirtualAccountMutation,
  downloadCsv,
} from "../../../../../services/v2/adminApiSlice";
import { useGetMeV2Query } from "../../../../../services/v2/authApiSliceV2";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../../../../services/authSlice";

/** Admin › Reports and Billing. */

const REPORT_BTN = {
  primary: "bg-brand-400 text-white hover:bg-brand-600",
  teal: "bg-wellness-50 text-wellness-600 hover:bg-wellness-25",
  gold: "bg-gold-50 text-gold-600 hover:bg-gold-100",
};

/** Presentation for the three report cards; the copy comes from the API. */
const REPORT_STYLE = {
  usage: { iconBg: "bg-brand-25", iconColor: "#017FC8", tone: "primary" },
  wellness: { iconBg: "bg-wellness-50", iconColor: "#3BA88F", tone: "teal" },
  roi: { iconBg: "bg-gold-50", iconColor: "#9A6E0A", tone: "gold" },
};

export const AdminReports = () => {
  const { open, showToast } = useAdminModal();
  const [digest, setDigest] = useState(true);

  const { data, isLoading } = useGetAdminReportsQuery();
  const { data: overview } = useGetAdminOverviewQuery();
  const { data: me } = useGetMeV2Query();
  const token = useSelector(selectCurrentToken);

  const reportCards = (data?.reports ?? []).map((card) => ({
    ...card,
    ...(REPORT_STYLE[card.key] ?? REPORT_STYLE.usage),
  }));

  const trend = data?.monthly_trend;
  const companyMonthly = trend?.value ?? [];
  const max = Math.max(...companyMonthly.map((m) => m.value), 1);
  const roi = overview?.roi;

  /* Growth since the first month with any sessions. */
  const first = companyMonthly.find((m) => m.value > 0);
  const last = companyMonthly[companyMonthly.length - 1];
  const growth =
    first && last && first.value > 0 && first !== last
      ? Math.round(((last.value - first.value) / first.value) * 100)
      : null;

  const download = async (key, title) => {
    try {
      await downloadCsv(`/business/reports/${key}/download`, token, `talkam-${key}.csv`);
      showToast(`${title} download started`);
    } catch {
      showToast("Couldn't generate that report — please try again");
    }
  };

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
                    {naira(roi?.value?.gross_value)}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-[11px] text-ink-500">Program cost this month</span>
                  <span className="text-[11.5px] font-boldNunito text-navy-800">
                    {naira(roi?.value?.program_cost)}
                  </span>
                </div>
                <div className="flex justify-between gap-3 border-t border-[#F0E4C8] pt-1.5">
                  <span className="text-[11.5px] font-boldNunito text-navy-800">Net ROI</span>
                  <span className="text-caption font-extraboldNunito text-gold-600">
                    {naira(roi?.value?.net_roi)}
                    {roi?.value?.multiple ? ` · ${roi.value.multiple}x return` : ""}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => open("roi", roi)}
                  className="mt-0.5 cursor-pointer text-left text-[10.5px] text-gold-600 underline"
                >
                  See the 4 factors behind this number
                </button>
              </div>
            ) : null}

            <div className="mt-auto flex items-center justify-between gap-3">
              <span className="text-[11px] text-ink-400">Anonymised · generated on request</span>
              <button
                type="button"
                onClick={() => download(card.key, card.title)}
                className={classNames(
                  "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-[9px] px-3 py-1.5 text-[12px] font-boldNunito transition-colors",
                  REPORT_BTN[card.tone]
                )}
              >
                <Icon.Download size={12} />
                Download CSV
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
          {growth !== null ? (
            <span className="text-[11px] font-boldNunito text-wellness-400">
              ↑ {growth}% since {first.label}
            </span>
          ) : null}
        </div>
        <p className="mb-4 text-caption leading-[1.5] text-ink-400">
          Total sessions booked company-wide, month over month, since your first employee
          activated. Anonymised — no individual breakdown.
        </p>
        {isLoading ? (
          <AdminSkeleton className="h-[120px]" />
        ) : trend?.suppressed ? (
          <Withheld cohort={trend.cohort} />
        ) : (
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
        )}
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
            <div className="text-[11px] text-ink-500">Sent to {me?.email ?? "your work email"}</div>
          </div>
          <Toggle on={digest} label="Monthly digest" onClick={() => setDigest((v) => !v)} />
        </div>
      </Card>
    </>
  );
};

/* ── Billing ─────────────────────────────────────────────────────────────── */

/** The plan whose seat band contains n (falls back to the current plan). */
const planForSeats = (plans, n) =>
  Object.values(plans).find(
    (p) => n >= p.minSeats && (p.maxSeats === null || n <= p.maxSeats)
  ) ?? Object.values(plans).find((p) => p.isCurrent);

/** A band label: "1–100 seats" or "501+ seats" (max: null = and above). */
const bandLabel = (t) => (t.max === null ? `${t.min}+ seats` : `${t.min}–${t.max} seats`);

const BACK_BTN =
  "mb-5 inline-flex items-center gap-2 text-[13.5px] font-boldNunito text-ink-500 hover:text-navy-800";

const KYC_TYPES = [
  { key: "bvn", label: "BVN", sub: "Bank Verification No." },
  { key: "nin", label: "NIN", sub: "National ID No." },
];

/** Small copy-to-clipboard control for the account number. */
function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(String(value));
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="cursor-pointer rounded-[7px] bg-white/[0.14] px-2.5 py-1.5 text-[11px] font-boldNunito text-white hover:bg-white/25"
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}

CopyButton.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

/**
 * Bank-transfer reconciliation (web §11). Three states: prompt → KYC form → the
 * org's own dedicated account. The raw BVN/NIN is posted to the API (which passes
 * it to Flutterwave) and is never rendered back — only the last 4 return.
 */
function BankTransferCard({ va }) {
  const [expanded, setExpanded] = useState(false);
  const [idType, setIdType] = useState("bvn");
  const [idNumber, setIdNumber] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState(null);
  const [createVirtualAccount, { isLoading }] = useCreateVirtualAccountMutation();

  const digits = idNumber.replace(/\D/g, "");
  const valid = digits.length === 11 && consent;

  const submit = async () => {
    setError(null);
    try {
      // On success the AdminBilling tag invalidates → the summary refetches with
      // the new account, and this card flips to the account view.
      await createVirtualAccount({ id_type: idType, id_number: digits, consent }).unwrap();
    } catch (e) {
      setError(e?.data?.message || "We couldn’t set up your account. Please try again.");
    }
  };

  // State 3 — the account exists.
  if (va) {
    return (
      <PanelCard title="Bank transfer" subtitle="Payments match your invoices automatically">
        <div className="rounded-ds-lg bg-navy-800 p-5 text-white">
          <div className="text-[10.5px] font-boldNunito tracking-[0.08em] text-white/55">
            YOUR DEDICATED ACCOUNT
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-3">
            <span className="text-h3 font-extraboldNunito tracking-[0.06em]">
              {va.account_number}
            </span>
            <CopyButton value={va.account_number} />
          </div>
          <div className="text-caption text-white/75">{va.bank_name}</div>
          <div className="my-4 h-px bg-white/[0.14]" />
          <div className="flex items-start gap-2.5 text-[12.5px] leading-[1.55] text-white/80">
            <Icon.Check size={15} className="mt-0.5 shrink-0 text-wellness-400" />
            <span>
              Transfer your invoice total here from any bank — it’s matched to your open
              invoices and settled automatically, usually within minutes.
            </span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <Badge tone="green" dot>
            Verified · {va.id_type?.toUpperCase()} ••{va.id_last4}
          </Badge>
          {Number(va.credit_balance) > 0 ? (
            <span className="text-caption text-ink-500">
              Unapplied credit{" "}
              <strong className="font-boldNunito text-ink-800">{naira(va.credit_balance)}</strong>{" "}
              · applied to your next invoice
            </span>
          ) : null}
        </div>
      </PanelCard>
    );
  }

  // States 1 & 2 — no account yet.
  return (
    <PanelCard title="Bank transfer" subtitle="Get an account that reconciles itself">
      {!expanded ? (
        <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-[13.5px] leading-[1.6] text-ink-500">
            Get your company’s own dedicated account number so every transfer is matched to
            your invoices and settled automatically — no reference to quote, no “mark as paid”.
          </p>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="shrink-0 cursor-pointer rounded-[10px] bg-brand-400 px-4 py-3 text-[13px] font-boldNunito text-white hover:bg-brand-600"
          >
            Set up bank transfer →
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-[13px] leading-[1.6] text-ink-500">
            Nigerian banks require an identity check to open a permanent account. Enter a
            director or authorized signatory’s BVN or NIN.
          </p>

          <div className="flex gap-2.5">
            {KYC_TYPES.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setIdType(t.key)}
                aria-pressed={idType === t.key}
                className={classNames(
                  "flex-1 cursor-pointer rounded-[10px] border-[1.5px] p-3 text-center",
                  idType === t.key ? "border-brand-400 bg-brand-25" : "border-ink-200 bg-white"
                )}
              >
                <div
                  className={classNames(
                    "text-[13px] font-extraboldNunito",
                    idType === t.key ? "text-brand-600" : "text-ink-600"
                  )}
                >
                  {t.label}
                </div>
                <div className="text-[10.5px] text-ink-400">{t.sub}</div>
              </button>
            ))}
          </div>

          <div>
            <label className="mb-1.5 block text-caption font-boldNunito text-ink-700">
              {idType.toUpperCase()} (11 digits)
            </label>
            <input
              inputMode="numeric"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              maxLength={14}
              placeholder="e.g. 22233344455"
              aria-label={`${idType} number`}
              className="h-12 w-full rounded-ds-md border-[1.5px] border-brand-400 px-4 text-body font-boldNunito tracking-[0.1em] text-navy-800 shadow-focus-brand"
            />
            <p className="mt-1.5 text-[11px] text-ink-400">
              Belongs to a director / authorized signatory — a company itself has no BVN.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setConsent(!consent)}
            aria-pressed={consent}
            className="flex items-start gap-3 rounded-[11px] border-[1.5px] border-ink-200 bg-ink-50 px-3.5 py-3 text-left"
          >
            <span
              className={classNames(
                "mt-0.5 flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px]",
                consent ? "border-brand-400 bg-brand-400" : "border-ink-300 bg-white"
              )}
            >
              {consent ? <Icon.Check size={12} className="text-white" strokeWidth={3.5} /> : null}
            </span>
            <span className="text-[12px] leading-[1.55] text-ink-500">
              I confirm I’m authorized to provide this ID and consent to it being used to open
              a bank-transfer account for my company.
            </span>
          </button>

          <div className="flex items-start gap-2 text-[11.5px] leading-[1.55] text-ink-400">
            <Icon.Lock size={14} className="mt-0.5 shrink-0" />
            <span>
              Sent to our payment provider (Flutterwave) to open the account.{" "}
              <strong className="font-boldNunito text-ink-500">
                TalkAM never stores your BVN/NIN
              </strong>{" "}
              — we keep only the last 4 digits and your consent date.
            </span>
          </div>

          {error ? (
            <p className="rounded-ds-md bg-[#FEF2F2] px-3.5 py-2.5 text-[12px] text-[#B42318]">
              {error}
            </p>
          ) : null}

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={!valid || isLoading}
              onClick={submit}
              className={classNames(
                "rounded-[10px] px-4 py-3 text-[13px] font-boldNunito text-white",
                valid && !isLoading
                  ? "cursor-pointer bg-brand-400 hover:bg-brand-600"
                  : "cursor-not-allowed bg-ink-300"
              )}
            >
              {isLoading ? "Creating…" : "Create my account →"}
            </button>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="cursor-pointer text-caption text-ink-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </PanelCard>
  );
}

BankTransferCard.propTypes = {
  va: PropTypes.object,
};

export const AdminBilling = () => {
  const { open, showToast } = useAdminModal();
  const [view, setView] = useState("billing"); // billing | manage | compare
  const [seats, setSeats] = useState(null); // null → mirrors the org's current seats

  const { data: billing } = useGetBillingQuery();
  const { data: invoices = [] } = useGetBillingInvoicesQuery();

  const PLANS = billing?.catalogue?.plans;
  const seatTiers = billing?.catalogue?.seatTiers ?? [];
  const currentPlan = billing?.current_plan;
  const usage = billing?.usage;
  const currentSeats = billing?.current_seats ?? 0;

  // Hold until the summary resolves — plan / usage drive the whole page.
  if (!billing || !currentPlan || !PLANS || !usage) return <AdminSkeleton />;

  const perSeatNow = tierForSeats(seatTiers, currentSeats)?.price ?? 0;

  const seatsUsed = usage.seatsUsed ?? 0;
  const seatsTotal = usage.seatsTotal ?? currentSeats;
  const seatPct = seatsTotal ? Math.min(100, Math.round((seatsUsed / seatsTotal) * 100)) : 0;

  const sessionsBundle = usage.sessionsBundle ?? 0;
  const sessionsUsed = usage.sessionsUsed ?? 0;
  // A purchased-but-unpaid bundle isn't usable yet — prepay activates on payment (§11).
  const bundleFunded = usage.sessionsFunded ?? false;
  const sessionsRemaining = bundleFunded
    ? usage.sessionsRemaining ?? Math.max(0, sessionsBundle - sessionsUsed)
    : 0;
  const sessionPct = sessionsBundle
    ? Math.round((sessionsRemaining / sessionsBundle) * 100)
    : 100;
  const sessionsLow = bundleFunded && sessionsBundle > 0 && sessionsRemaining <= 5;

  // Manage calculator — seats drive the rate (one global ladder); the plan follows size.
  const seatNum = parseInt(seats ?? currentSeats, 10) || 0;
  const seatTier = tierForSeats(seatTiers, seatNum);
  const perSeat = seatTier?.price ?? 0;
  const derivedPlan = planForSeats(PLANS, seatNum);
  const isCustom = !!derivedPlan?.custom;
  const tierIdx = seatTiers.findIndex(
    (t) => seatNum >= t.min && (t.max === null || seatNum <= t.max)
  );
  const nextTier = tierIdx >= 0 ? seatTiers[tierIdx + 1] : null;

  /* ── Manage plan & seats ─────────────────────────────────────────────── */
  if (view === "manage") {
    return (
      <Card>
        <button type="button" onClick={() => setView("billing")} className={BACK_BTN}>
          <Icon.ArrowLeft size={15} />
          Billing
        </button>

        {/* 1 · seats → live cost */}
        <div className="mb-1 text-body font-extraboldNunito text-navy-800">
          Set your seats — see what it costs
        </div>
        <p className="mb-4 text-[12.5px] text-ink-400">
          Everything here follows one number: how many employee seats you pay for.
        </p>
        <div className="mb-8 grid overflow-hidden rounded-ds-lg border border-surface-line lg:grid-cols-2">
          <div className="p-5 lg:p-6">
            <div className="mb-3 text-[11px] font-boldNunito tracking-[0.06em] text-ink-400">
              EMPLOYEE SEATS
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Decrease seats"
                onClick={() => setSeats(String(Math.max(1, seatNum - 1)))}
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border-[1.5px] border-ink-200 bg-white text-[20px] font-boldNunito text-ink-600"
              >
                −
              </button>
              <input
                type="number"
                value={seats ?? String(currentSeats)}
                onChange={(e) => setSeats(e.target.value)}
                aria-label="Seats to pay for"
                className="h-[50px] w-[110px] rounded-[10px] border-[1.5px] border-brand-400 px-3 text-center text-h3 font-extraboldNunito text-navy-800 shadow-focus-brand"
              />
              <button
                type="button"
                aria-label="Increase seats"
                onClick={() => setSeats(String(seatNum + 1))}
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border-[1.5px] border-ink-200 bg-white text-[20px] font-boldNunito text-ink-600"
              >
                +
              </button>
            </div>
            <p className="mt-3.5 text-caption text-ink-500">
              You pay for the seats you license — billed monthly in advance. Raise
              capacity any time and you’re charged for the increase.
            </p>
          </div>
          <div className="flex flex-col justify-center bg-[linear-gradient(135deg,#141B34,#1A2E5A)] p-5 text-white lg:p-6">
            <div className="text-[11px] font-boldNunito tracking-[0.06em] text-white/50">
              {seatNum} seats · {seatTier ? bandLabel(seatTier) : "—"}
            </div>
            {isCustom ? (
              <>
                <div className="mt-2 text-h3 font-extraboldNunito">Custom pricing</div>
                <p className="mt-1 text-[12.5px] text-white/60">
                  2,000+ seats — our enterprise team builds a plan around you.
                </p>
                <button
                  type="button"
                  onClick={() => setView("compare")}
                  className="mt-3 w-fit cursor-pointer rounded-[9px] bg-white/[0.12] px-3.5 py-2 text-[12.5px] font-boldNunito"
                >
                  See plans →
                </button>
              </>
            ) : (
              <>
                <div className="mt-1.5 text-[15px] font-boldNunito text-[#CFE6F6]">
                  {naira(perSeat)}{" "}
                  <span className="text-[12.5px] font-regularNunito text-white/60">
                    per seat / month
                  </span>
                </div>
                <div className="mt-0.5 text-[34px] font-extraboldNunito leading-none tracking-[-0.02em]">
                  {naira(perSeat * seatNum)}{" "}
                  <span className="text-[15px] font-boldNunito text-white/60">/ month</span>
                </div>
                {nextTier ? (
                  <span className="mt-3 w-fit rounded-full border border-[#3BA88F]/40 bg-[#3BA88F]/[0.16] px-3 py-1.5 text-[12px] font-boldNunito text-[#B7DFCB]">
                    ↓ Cross {seatTier.max} seats → {naira(nextTier.price)}/seat
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() =>
                    open("planCheckout", {
                      planName: derivedPlan?.name,
                      seats: seatNum,
                      perSeat: `${naira(perSeat)}/seat`,
                      monthly: naira(perSeat * seatNum),
                    })
                  }
                  className="mt-4 w-fit cursor-pointer rounded-[10px] bg-gold-400 px-[18px] py-[10px] text-[13px] font-extraboldNunito text-navy-800"
                >
                  Update seats →
                </button>
              </>
            )}
          </div>
        </div>

        {/* 2 · rate ladder */}
        <div className="mb-1 text-body font-extraboldNunito text-navy-800">
          Per-seat rate by team size
        </div>
        <p className="mb-3.5 text-[12.5px] text-ink-400">
          Your rate drops automatically the moment you cross a band — nothing to switch.
        </p>
        <div className="mb-8 flex flex-col gap-1.5">
          {seatTiers.map((t) => {
            const here = seatNum >= t.min && (t.max === null || seatNum <= t.max);
            return (
              <div
                key={t.min}
                className={classNames(
                  "flex items-center rounded-[9px] border px-3.5 py-3",
                  here ? "border-[#C9E2F9] bg-brand-25" : "border-ink-100 bg-[#FAFAFA]"
                )}
              >
                <span className="flex-1 text-[12.5px] font-semiboldNunito text-ink-800">
                  {bandLabel(t)}
                </span>
                <span className="text-[12.5px] font-boldNunito text-navy-800">
                  {naira(t.price)}/seat
                </span>
                {here ? (
                  <span className="ml-2.5 rounded-full bg-brand-400 px-2 py-[3px] text-[9px] font-extraboldNunito text-white">
                    YOU
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* 3 · plan = features */}
        <div className="mb-1 text-body font-extraboldNunito text-navy-800">
          What your plan includes
        </div>
        <p className="mb-3.5 text-[12.5px] text-ink-400">
          Your plan follows your size — it isn’t a separate price. Bigger teams unlock more.
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-ds-md border border-surface-line p-5">
          <div className="mr-2">
            <div className="text-[11px] font-extraboldNunito tracking-[0.06em] text-brand-400">
              YOUR PLAN
            </div>
            <div className="text-[17px] font-extraboldNunito text-navy-800">
              {derivedPlan?.name ?? currentPlan.label}
            </div>
          </div>
          <div className="flex flex-1 flex-wrap gap-x-5 gap-y-2">
            {(derivedPlan?.features ?? []).map((f) => (
              <span key={f} className="flex items-center gap-1.5 text-[12.5px] text-ink-500">
                <Icon.Check size={14} className="text-wellness-400" />
                {f}
              </span>
            ))}
          </div>
          <SecondaryButton onClick={() => setView("compare")}>Compare plans →</SecondaryButton>
        </div>
      </Card>
    );
  }

  /* ── Compare plans (read-only) ───────────────────────────────────────── */
  if (view === "compare") {
    return (
      <Card>
        <button type="button" onClick={() => setView("manage")} className={BACK_BTN}>
          <Icon.ArrowLeft size={15} />
          Manage plan &amp; seats
        </button>
        <div className="mb-1 text-body font-extraboldNunito text-navy-800">
          What you unlock as you grow
        </div>
        <p className="mb-5 text-[12.5px] text-ink-400">
          Every plan bills at your seat-band rate — plans differ only by features, and follow
          your team size. Nothing to buy here.
        </p>
        <div className="grid gap-3.5 lg:grid-cols-3">
          {Object.values(PLANS).map((p) => (
            <div
              key={p.key}
              className={classNames(
                "rounded-ds-md border-[1.5px] p-4",
                p.isCurrent ? "border-brand-400 bg-brand-25" : "border-ink-200 bg-white"
              )}
            >
              <div
                className={classNames(
                  "text-[10px] font-extraboldNunito tracking-[0.08em]",
                  p.isCurrent ? "text-brand-400" : "text-ink-400"
                )}
              >
                {p.isCurrent ? "YOUR PLAN" : `AT ${p.minSeats.toLocaleString("en-NG")}+ SEATS`}
              </div>
              <div className="mb-1 mt-1.5 text-[15px] font-extraboldNunito text-navy-800">
                {p.name}
              </div>
              <span className="mb-3 inline-block rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-boldNunito text-ink-500">
                {p.seatRange}
              </span>
              <ul className="flex flex-col gap-1.5">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2 text-[12px] text-ink-500">
                    <Icon.Check size={13} className="mt-0.5 shrink-0 text-wellness-400" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  /* ── Billing landing ─────────────────────────────────────────────────── */
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
          {sessionsRemaining} sessions left. Top up to avoid disruption.
        </InfoStrip>
      ) : null}

      {/* Plan */}
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
            <div className="text-[38px] font-extraboldNunito leading-none tracking-[-0.02em] text-white">
              {currentPlan.total}{" "}
              <span className="text-[16px] font-boldNunito text-white/60">/ month</span>
            </div>
            <div className="mt-2.5 text-[13px] text-white/60">
              {currentPlan.seats} employee seats × {currentPlan.perSeat} · {currentPlan.renews}
            </div>
            {currentPlan.payMethodLabel ? (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#3BA88F]/40 bg-[#3BA88F]/[0.16] px-3 py-1.5 text-[12px] font-boldNunito text-[#CDE6D9]">
                <span className="h-1.5 w-1.5 rounded-full bg-wellness-400" />
                Billed monthly · {currentPlan.payMethodLabel}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setView("manage")}
                className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full border border-gold-400/40 bg-gold-400/[0.16] px-3 py-1.5 text-[12px] font-boldNunito text-[#E8D3A3]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                Billing not set up yet — finish setup →
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setView("manage")}
            className="cursor-pointer rounded-[10px] bg-gold-400 px-[18px] py-[10px] text-[13px] font-extraboldNunito text-navy-800"
          >
            Manage plan &amp; seats
          </button>
        </div>
      </div>

      {/* Seats + Sessions */}
      <div className="grid gap-3.5 lg:grid-cols-2">
        <Card>
          <div className="mb-2.5 flex items-start justify-between gap-3">
            <div className="text-[11px] font-boldNunito tracking-[0.06em] text-ink-400">
              EMPLOYEE SEATS
            </div>
            <button
              type="button"
              onClick={() => setView("manage")}
              className="shrink-0 cursor-pointer text-[13px] font-boldNunito text-brand-400"
            >
              Manage seats →
            </button>
          </div>
          <div className="mb-1 text-[30px] font-extraboldNunito text-navy-800">
            {seatsUsed}{" "}
            <span className="text-[15px] font-boldNunito text-ink-400">of {seatsTotal} used</span>
          </div>
          <div className="mb-2.5 h-2 rounded-[4px] bg-ink-100">
            <div className="h-2 rounded-[4px] bg-brand-400" style={{ width: `${seatPct}%` }} />
          </div>
          <p className="text-caption text-ink-500">
            {Math.max(0, seatsTotal - seatsUsed)} seats available · {naira(perSeatNow)} each, billed
            monthly
          </p>
        </Card>

        <Card>
          <div className="mb-2.5 flex items-start justify-between gap-3">
            <div className="text-[11px] font-boldNunito tracking-[0.06em] text-ink-400">
              SESSION BUNDLE
            </div>
            <SecondaryButton className="!px-3 !py-1.5 !text-[12px]" onClick={() => open("topUp")}>
              Top up
            </SecondaryButton>
          </div>
          <div className="mb-1 text-[30px] font-extraboldNunito text-navy-800">
            {bundleFunded ? sessionsRemaining : sessionsBundle}{" "}
            <span className="text-[15px] font-boldNunito text-ink-400">
              {bundleFunded ? "sessions left" : "sessions · pending"}
            </span>
          </div>
          <div className="mb-2.5 h-2 rounded-[4px] bg-ink-100">
            <div
              className={classNames(
                "h-2 rounded-[4px]",
                !bundleFunded ? "bg-gold-400/40" : sessionsLow ? "bg-gold-600" : "bg-wellness-400"
              )}
              style={{ width: `${bundleFunded ? sessionPct : 100}%` }}
            />
          </div>
          <p className="text-caption text-ink-500">{sessionsUsed} used · ₦8,000 per session</p>
          {bundleFunded ? (
            <div className="mt-3 rounded-[11px] border border-[#CDE9DF] bg-[#E7F4EF] px-3.5 py-3 text-[12.5px] font-semiboldNunito text-[#1F6B55]">
              <strong className="font-extraboldNunito">Sessions never expire.</strong> They’re drawn
              down as your team books — refill whenever you run low.
            </div>
          ) : (
            <div className="mt-3 rounded-[11px] border border-gold-400/40 bg-gold-50 px-3.5 py-3 text-[12.5px] font-semiboldNunito text-gold-600">
              <strong className="font-extraboldNunito">Pending payment.</strong> Your{" "}
              {sessionsBundle}-session bundle activates once your first bill is paid.
            </div>
          )}
        </Card>
      </div>

      {/* Bank transfer — dedicated virtual account (web §11), when enabled */}
      {billing?.virtual_accounts_enabled ? (
        <BankTransferCard va={billing?.virtual_account} />
      ) : null}

      {/* Invoices */}
      <PanelCard
        title="Invoices"
        subtitle="Settled by bank transfer"
        action={<SecondaryButton>Download all</SecondaryButton>}
      >
        {invoices.length === 0 ? (
          <div className="py-8 text-center text-caption text-ink-400">
            No invoices yet — your first one is issued once your first employee activates.
          </div>
        ) : (
          <Table head={["INVOICE", "PERIOD", "SEATS", "AMOUNT", "STATUS", ""]}>
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
                  <div className="flex justify-end gap-1.5">
                    <SecondaryButton
                      onClick={() => open("invoice", inv.id)}
                      className="!px-2.5 !py-1.5 !text-[11px]"
                    >
                      View
                    </SecondaryButton>
                    {/* With a dedicated account, transfers auto-reconcile — the
                        customer self-mark-paid is retired (web §11). */}
                    {inv.tone !== "green" && !billing?.virtual_account ? (
                      <button
                        type="button"
                        onClick={() => showToast(`${inv.id} marked paid`)}
                        className="cursor-pointer rounded-[7px] bg-brand-400 px-2.5 py-1.5 text-[11px] font-boldNunito text-white"
                      >
                        Mark paid
                      </button>
                    ) : null}
                  </div>
                </Td>
              </Tr>
            ))}
          </Table>
        )}
      </PanelCard>

      {/* Manage entry */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-ds-lg border border-dashed border-ink-200 bg-white px-5 py-4">
        <p className="text-[13.5px] text-ink-500">
          Want a different plan or to see{" "}
          <strong className="font-boldNunito text-ink-800">volume pricing</strong> for more seats?
        </p>
        <SecondaryButton onClick={() => setView("manage")}>Manage plan &amp; seats →</SecondaryButton>
      </div>
    </>
  );
};

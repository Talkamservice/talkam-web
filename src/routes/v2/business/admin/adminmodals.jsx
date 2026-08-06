import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import classNames from "classnames";
import {
  Modal,
  PrimaryButton,
  SecondaryButton,
  InfoStrip,
  Toast,
} from "../../../../components/v2/dashboard/chrome";
import { naira, tierForSeats } from "../../../../constants/admindashboard";
import {
  useGetBillingQuery,
  useGetBillingInvoicesQuery,
  useGetAdminTherapistDetailQuery,
  useRequestOrgDeletionMutation,
} from "../../../../services/v2/adminApiSlice";
import { useRequestOtpV2Mutation } from "../../../../services/v2/authApiSliceV2";
import { OtpBoxes, apiErrorMessage } from "../auth/authlayout";

/**
 * Modal + toast host for the admin dashboard.
 * Spec: "TalkAM B2B Dashboard.dc.html" § modals.
 *
 * Modals are opened by name from anywhere via useAdminModal().open(name, ctx).
 * A single provider wraps the dashboard so any page can trigger them without
 * prop-drilling.
 */

const AdminModalContext = createContext(null);

export const useAdminModal = () => {
  const ctx = useContext(AdminModalContext);
  if (!ctx) throw new Error("useAdminModal must be used inside AdminModalProvider");
  return ctx;
};

export const AdminModalProvider = () => {
  const [modal, setModal] = useState(null);
  const [context, setContext] = useState(null);
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const open = useCallback((name, ctx = null) => {
    setModal(name);
    setContext(ctx);
  }, []);
  const close = useCallback(() => setModal(null), []);

  const showToast = useCallback((message) => {
    if (timer.current) clearTimeout(timer.current);
    setToast(message);
    timer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  const value = useMemo(
    () => ({ open, close, showToast, toast, modal, context }),
    [open, close, showToast, toast, modal, context]
  );

  return (
    <AdminModalContext.Provider value={value}>
      <Outlet />
      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-[400] -translate-x-1/2">
          <Toast message={toast} />
        </div>
      ) : null}
      <AdminModals modal={modal} context={context} close={close} showToast={showToast} />
    </AdminModalContext.Provider>
  );
};

/* ── Individual modals ────────────────────────────────────────────────── */

const InviteModal = ({ open, close, showToast }) => {
  const [role, setRole] = useState("employee");

  return (
    <Modal open={open} onClose={close} title="Invite people" subtitle="Assign a role to each invite">
      <div className="mb-4 flex gap-2">
        {[
          { key: "employee", label: "Employee" },
          { key: "therapist", label: "Therapist" },
        ].map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setRole(r.key)}
            aria-pressed={role === r.key}
            className={classNames(
              "flex-1 cursor-pointer rounded-[10px] border-[1.5px] p-2.5 text-center text-caption font-boldNunito",
              role === r.key
                ? r.key === "therapist"
                  ? "border-wellness-400 bg-wellness-50 text-wellness-600"
                  : "border-brand-400 bg-brand-25 text-brand-600"
                : "border-ink-200 bg-surface-page text-ink-400"
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-boldNunito text-ink-400">Work email</span>
          <input
            type="email"
            placeholder="name@zenithbank.com"
            className="h-[42px] rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px] text-ink-800"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-boldNunito text-ink-400">Department</span>
          <select className="h-[42px] rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px] text-ink-800">
            <option>Technology</option>
            <option>Finance</option>
            <option>Operations</option>
            <option>HR</option>
            <option>Legal</option>
          </select>
        </label>
      </div>

      <InfoStrip tone="purple" className="mb-4">
        {role === "therapist"
          ? "Therapists are routed into credential verification before they can accept sessions."
          : "Employees go straight into onboarding. No seat is charged until they activate."}
      </InfoStrip>

      <div className="flex justify-end gap-2">
        <SecondaryButton onClick={close}>Cancel</SecondaryButton>
        <PrimaryButton
          onClick={() => {
            close();
            showToast("Invite sent");
          }}
        >
          Send invite
        </PrimaryButton>
      </div>
    </Modal>
  );
};

const CsvUploadModal = ({ open, close, showToast }) => {
  const [errored, setErrored] = useState(false);

  return (
    <Modal open={open} onClose={close} title="Bulk invite via CSV" subtitle="columns: employee_id, email, department">
      {errored ? (
        <>
          <div className="mb-2.5 flex items-center gap-3 rounded-[14px] border-2 border-dashed border-[#E8A3A3] bg-surface-errorField p-4">
            <div className="flex-1">
              <div className="text-[13px] font-boldNunito text-surface-errorInk">
                roster.pdf couldn&apos;t be used
              </div>
              <div className="text-[11px] text-signal-error">Only .csv files are supported</div>
            </div>
            <SecondaryButton onClick={() => setErrored(false)}>Try again</SecondaryButton>
          </div>
          <InfoStrip tone="red" className="mb-4">
            File must be a .csv with columns: employee_id, email, department. Max size 5MB.
          </InfoStrip>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setErrored(true)}
          className="mb-4 flex w-full cursor-pointer items-center gap-3.5 rounded-[14px] border-2 border-dashed border-brand-200 bg-[linear-gradient(135deg,#EEF4FC,#D1EEFE)] p-4 text-left"
        >
          <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-ds-md bg-white shadow-[0_2px_8px_rgba(1,127,200,0.12)]">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#017FC8" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </span>
          <span className="flex-1">
            <span className="block text-body font-boldNunito text-navy-800">
              Drop a .csv here or click to browse
            </span>
            <span className="block text-caption text-brand-600">
              employee_id, email, department
            </span>
          </span>
        </button>
      )}

      <div className="flex justify-end gap-2">
        <SecondaryButton onClick={close}>Cancel</SecondaryButton>
        <PrimaryButton
          disabled={errored}
          onClick={() => {
            close();
            showToast("12 invites queued from roster.csv");
          }}
        >
          Upload &amp; invite
        </PrimaryButton>
      </div>
    </Modal>
  );
};

const RoiModal = ({ open, close, context }) => {
  const roi = context?.value ?? {};

  return (
  <Modal
    open={open}
    onClose={close}
    title="How ROI is calculated"
    subtitle="Four inputs, no black box"
    width="max-w-[560px]"
  >
    <div className="mb-4 flex flex-col gap-2.5">
      {[
        { label: "Sessions delivered this month", value: String(roi.sessions ?? 0) },
        { label: "Absenteeism days avoided per session", value: String(roi.days_per_session ?? 0) },
        { label: "Average daily productivity value", value: naira(roi.daily_value) },
        { label: "Program cost this month", value: naira(roi.program_cost) },
      ].map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between gap-4 rounded-ds-md bg-ink-50 px-3.5 py-3"
        >
          <span className="text-caption text-ink-500">{row.label}</span>
          <span className="text-[13px] font-boldNunito text-navy-800">{row.value}</span>
        </div>
      ))}
    </div>

    <div className="mb-4 rounded-ds-md bg-gold-50 p-4">
      <div className="mb-2 flex justify-between gap-4">
        <span className="text-caption text-ink-500">Gross productivity value</span>
        <span className="text-[13px] font-boldNunito text-navy-800">{naira(roi.gross_value)}</span>
      </div>
      <div className="mb-2 flex justify-between gap-4">
        <span className="text-caption text-ink-500">Less program cost</span>
        <span className="text-[13px] font-boldNunito text-navy-800">− {naira(roi.program_cost)}</span>
      </div>
      <div className="flex justify-between gap-4 border-t border-[#F0E4C8] pt-2">
        <span className="text-[13px] font-boldNunito text-navy-800">Net ROI</span>
        <span className="text-body font-extraboldNunito text-gold-600">
          {naira(roi.net_roi)}{roi.multiple ? ` · ${roi.multiple}x return` : ""}
        </span>
      </div>
    </div>

    <p className="text-[11.5px] leading-[1.6] text-ink-400">
      Sessions × days avoided × daily value gives the gross productivity figure;
      subtracting the program cost gives net ROI. All inputs are company-wide
      aggregates — no individual employee data is used.
    </p>
  </Modal>
  );
};

const TopUpModal = ({ open, close, showToast }) => {
  const [key, setKey] = useState("25");
  const { data: billing } = useGetBillingQuery();
  const topUpOptions = billing?.catalogue?.topUpOptions ?? [];
  const selected = topUpOptions.find((o) => o.key === key) ?? topUpOptions[0];

  if (!selected) return null;

  return (
    <Modal open={open} onClose={close} title="Top up sessions" subtitle="₦8,000 per session">
      <div className="mb-4 flex gap-2.5">
        {topUpOptions.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setKey(opt.key)}
            className={classNames(
              "relative flex-1 cursor-pointer rounded-ds-md border-[1.5px] px-2.5 py-3.5 text-center",
              key === opt.key ? "border-brand-400 bg-brand-25" : "border-ink-200 bg-white"
            )}
          >
            {opt.tag ? (
              <span className="absolute -top-[9px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-400 px-[9px] py-[3px] text-[9px] font-extraboldNunito text-white">
                {opt.tag}
              </span>
            ) : null}
            <div className="text-h3 font-extraboldNunito text-navy-800">{opt.sessions}</div>
            <div className="mb-1 text-[10.5px] text-ink-400">sessions</div>
            <div className="text-caption font-extraboldNunito text-brand-400">
              {naira(opt.sessions * 8000)}
            </div>
          </button>
        ))}
      </div>

      <InfoStrip className="mb-4">
        Added to your next invoice. Sessions are available immediately and drawn down
        as they happen.
      </InfoStrip>

      <div className="flex justify-end gap-2">
        <SecondaryButton onClick={close}>Cancel</SecondaryButton>
        <PrimaryButton
          onClick={() => {
            close();
            showToast(`${selected.sessions} sessions added to your bundle`);
          }}
        >
          Add {selected.sessions} sessions · {naira(selected.sessions * 8000)}
        </PrimaryButton>
      </div>
    </Modal>
  );
};

const AddSeatsModal = ({ open, close, showToast }) => {
  const [key, setKey] = useState("25");
  const { data: billing } = useGetBillingQuery();
  const CURRENT_SEATS = billing?.current_seats ?? 0;
  const plans = billing?.catalogue?.plans;
  const seatPackOptions = billing?.catalogue?.seatPackOptions ?? [];
  const liteTiers = plans?.lite?.tiers ?? [];
  const addQty = parseInt(key, 10);
  const newTotal = CURRENT_SEATS + addQty;
  const oldPrice = tierForSeats(liteTiers, CURRENT_SEATS)?.price ?? 0;
  const newPrice = tierForSeats(liteTiers, newTotal)?.price ?? 0;

  if (!plans) return null;

  return (
    <Modal open={open} onClose={close} title="Add seats" subtitle={`Currently ${CURRENT_SEATS} licensed seats`}>
      <div className="mb-4 flex gap-2.5">
        {seatPackOptions.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setKey(opt.key)}
            className={classNames(
              "relative flex-1 cursor-pointer rounded-ds-md border-[1.5px] px-2.5 py-3.5 text-center",
              key === opt.key ? "border-brand-400 bg-brand-25" : "border-ink-200 bg-white"
            )}
          >
            {opt.tag ? (
              <span className="absolute -top-[9px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-400 px-[9px] py-[3px] text-[9px] font-extraboldNunito text-white">
                {opt.tag}
              </span>
            ) : null}
            <div className="text-h3 font-extraboldNunito text-navy-800">+{opt.seats}</div>
            <div className="text-[10.5px] text-ink-400">seats</div>
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-2 rounded-ds-md bg-ink-50 p-3.5">
        <div className="flex justify-between gap-4">
          <span className="text-caption text-ink-500">New seat total</span>
          <span className="text-[13px] font-boldNunito text-navy-800">{newTotal}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-caption text-ink-500">Rate per seat</span>
          <span className="text-[13px] font-boldNunito text-navy-800">
            {naira(newPrice)}/seat
          </span>
        </div>
        <div className="flex justify-between gap-4 border-t border-surface-line pt-2">
          <span className="text-caption font-boldNunito text-navy-800">New monthly total</span>
          <span className="text-body font-extraboldNunito text-brand-400">
            {naira(newTotal * newPrice)}
          </span>
        </div>
      </div>

      {newPrice !== oldPrice ? (
        <InfoStrip tone="gold" className="mb-4">
          This crosses a volume tier — your per-seat rate drops from {naira(oldPrice)} to{" "}
          {naira(newPrice)}.
        </InfoStrip>
      ) : null}

      <div className="flex justify-end gap-2">
        <SecondaryButton onClick={close}>Cancel</SecondaryButton>
        <PrimaryButton
          onClick={() => {
            close();
            showToast(`${addQty} seats added`);
          }}
        >
          Add {addQty} seats
        </PrimaryButton>
      </div>
    </Modal>
  );
};

const InvoiceModal = ({ open, close, context }) => {
  const { data: invoices = [] } = useGetBillingInvoicesQuery();
  const invoice = invoices.find((i) => i.id === context) ?? invoices[0];

  if (!invoice) return null;

  return (
    <Modal open={open} onClose={close} title={invoice.id} subtitle={invoice.period}>
      <div className="mb-4 flex flex-col gap-2.5">
        {[
          { label: "Employee Seats · 50 × ₦2,000", value: "₦100,000" },
          { label: "Therapist Network Access · 50 × ₦3,500", value: "₦175,000" },
          { label: "Session Bundle · 25 × ₦8,000", value: "₦200,000" },
        ].map((line) => (
          <div key={line.label} className="flex justify-between gap-4 border-b border-ink-100 pb-2.5">
            <span className="text-caption text-ink-500">{line.label}</span>
            <span className="text-[13px] font-boldNunito text-navy-800">{line.value}</span>
          </div>
        ))}
        <div className="flex justify-between gap-4 pt-1">
          <span className="text-body font-extraboldNunito text-navy-800">Total</span>
          <span className="text-h3 font-extraboldNunito text-navy-800">{invoice.amount}</span>
        </div>
      </div>
      <InfoStrip className="mb-4">
        Paid by bank transfer to TalkAM Technologies Ltd · GTBank · 0123456789
      </InfoStrip>
      <div className="flex justify-end gap-2">
        <SecondaryButton onClick={close}>Close</SecondaryButton>
        <PrimaryButton>Download PDF</PrimaryButton>
      </div>
    </Modal>
  );
};

const EmployeeModal = ({ open, close, context }) => (
  <Modal open={open} onClose={close} title={context?.id ?? "Employee"} subtitle="Seat record">
    <InfoStrip tone="purple" className="mb-4">
      You see seat administration only. Session counts, session content, chat messages,
      therapist notes and community activity are never visible to an employer account —
      not even in aggregate below 5 users.
    </InfoStrip>
    <div className="flex flex-col gap-2.5">
      {[
        ["Employee ID", context?.id],
        ["Work email", context?.email],
        ["Department", context?.department],
        ["Role", context?.role],
        ["Status", context?.status],
        ["Seated since", context?.activated_at ?? "—"],
      ].map(([label, value]) => (
        <div key={label} className="flex justify-between gap-4 border-b border-ink-100 pb-2.5">
          <span className="text-caption text-ink-500">{label}</span>
          <span className="text-[13px] font-boldNunito capitalize text-navy-800">{value}</span>
        </div>
      ))}
    </div>
  </Modal>
);

const ConfirmModal = ({ open, close, showToast, context }) => (
  <Modal open={open} onClose={close} title={context?.title ?? "Are you sure?"} width="max-w-[440px]">
    <p className="mb-5 text-[13px] leading-[1.7] text-ink-500">{context?.body}</p>
    <div className="flex justify-end gap-2">
      <SecondaryButton onClick={close}>Cancel</SecondaryButton>
      <button
        type="button"
        onClick={async () => {
          try {
            if (context?.onConfirm) await context.onConfirm();
            close();
            showToast(context?.toast ?? "Done");
          } catch {
            close();
            showToast("Couldn't complete that action — please try again");
          }
        }}
        className="cursor-pointer rounded-[10px] bg-signal-error px-4 py-[9px] text-[13px] font-boldNunito text-white hover:bg-surface-errorInk"
      >
        {context?.confirmLabel ?? "Confirm"}
      </button>
    </div>
  </Modal>
);

const CapacityModal = ({ open, close, showToast }) => (
  <Modal open={open} onClose={close} title="Request more capacity" subtitle="Tell us which specialty to prioritise">
    <div className="mb-4 flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-boldNunito text-ink-400">Specialty</span>
        <select className="h-[42px] rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px] text-ink-800">
          <option>Anxiety</option>
          <option>Depression</option>
          <option>Work Stress</option>
          <option>Relationships</option>
          <option>Grief</option>
          <option>PTSD / Trauma</option>
        </select>
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-boldNunito text-ink-400">Anything else?</span>
        <textarea
          rows={3}
          placeholder="e.g. we need evening slots for our operations team"
          className="resize-none rounded-ds-md border-[1.5px] border-ink-200 px-3.5 py-3 text-[13px] text-ink-800"
        />
      </label>
    </div>
    <div className="flex justify-end gap-2">
      <SecondaryButton onClick={close}>Cancel</SecondaryButton>
      <PrimaryButton
        onClick={() => {
          close();
          showToast("Capacity request sent to TalkAM");
        }}
      >
        Send request
      </PrimaryButton>
    </div>
  </Modal>
);

const AddOwnTherapistModal = ({ open, close, showToast }) => (
  <Modal open={open} onClose={close} title="Add your own therapist" subtitle="They complete the same verification">
    <div className="mb-4 flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-boldNunito text-ink-400">Full name</span>
        <input className="h-[42px] rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px] text-ink-800" />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-boldNunito text-ink-400">Email</span>
        <input type="email" className="h-[42px] rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px] text-ink-800" />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-boldNunito text-ink-400">Billing</span>
        <select className="h-[42px] rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px] text-ink-800">
          <option>Billed through TalkAM (draws from your bundle)</option>
          <option>Settled directly with you</option>
        </select>
      </label>
    </div>
    <div className="flex justify-end gap-2">
      <SecondaryButton onClick={close}>Cancel</SecondaryButton>
      <PrimaryButton
        onClick={() => {
          close();
          showToast("Therapist invite sent for verification");
        }}
      >
        Send invite
      </PrimaryButton>
    </div>
  </Modal>
);

/** "★★★☆☆" for a numeric rating (rounded, clamped 0–5). */
const starsFor = (r) => {
  const n = Math.max(0, Math.min(5, Math.round(Number(r) || 0)));
  return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);
};

/** Fallback focus-areas when the API has no explicit list: split "Anxiety · CBT". */
const splitSpecialty = (s) =>
  (s ?? "")
    .split(/[·,]/)
    .map((x) => x.trim())
    .filter(Boolean);

/** One PRACTICE DETAILS line: icon + value + caption. */
const PracticeDetail = ({ icon, value, label, tone }) => (
  <div className="flex items-center gap-2.5">
    <span className="shrink-0">{icon}</span>
    <div>
      <div
        className={classNames(
          "text-[12.5px] font-boldNunito",
          tone === "verified" ? "text-wellness-600" : tone === "warn" ? "text-gold-600" : "text-ink-800"
        )}
      >
        {value}
      </div>
      <div className="text-[10.5px] text-ink-400">{label}</div>
    </div>
  </div>
);

/**
 * Therapist detail — spec: "TalkAM B2B Dashboard.dc.html" § THERAPIST VIEW MODAL.
 *
 * Bespoke overlay (not the shared Modal) because the deck needs a custom header
 * with avatar/provider badge/stars, a scrollable body and sticky header+footer.
 * Every field is bound from the roster row; fields the roster does not yet carry
 * (bio, focus areas, formats, languages, response time, next slot, review
 * breakdown) degrade gracefully — they light up once a detail endpoint supplies
 * them. Reviews and the credentialing line are NEVER fabricated: the reviews
 * section only renders with real review rows, and "Verified by TalkAM" only
 * shows for a genuinely verified therapist.
 */
const TherapistModal = ({ open, close, context }) => {
  const { open: openModal } = useAdminModal();
  // The list row seeds the header instantly; the detail endpoint fills the rich
  // fields (focus areas, formats, next slot, reviews) when it lands.
  const { data: detail } = useGetAdminTherapistDetailQuery(context?.id, {
    skip: !open || !context?.id,
  });

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open) return null;

  const t = { ...(context ?? {}), ...(detail ?? {}) };
  const isOwn = !!t.is_own;
  const verified = !!t.is_verified;
  const rating = t.rating ?? null;
  const ratingText = rating != null ? rating : "—";
  const stars = starsFor(rating);
  const teamSessions = t.team_sessions ?? null;
  const focusAreas = t.focus_areas?.length ? t.focus_areas : splitSpecialty(t.specialty);
  const reviews = t.reviews_list ?? [];
  const hasReviews = reviews.length > 0;
  const breakdown = t.rating_breakdown ?? null;
  const nextSlot = t.next_slot ?? "—";
  const responseTime = t.response_time ?? "—";
  const formats = t.formats ?? "—";
  const languages = t.languages ?? "—";
  const years = t.years_experience ?? null;
  const bio =
    t.bio ??
    (verified
      ? "Verified through TalkAM's credentialing process. Full clinical credentials and indemnity status are held on TalkAM's internal review tool — not shown here, to protect therapist privacy."
      : "Brought into your network by your organisation. Not yet verified through TalkAM's own credentialing process.");
  const billLabel = t.bill_label ?? (isOwn ? "Billed to your organisation" : "TalkAM-billed");
  const providerBadge = isOwn ? "bg-wellness-50 text-wellness-600" : "bg-brand-25 text-brand-600";
  const providerLabel = isOwn ? "Your own provider" : "TalkAM network";

  const kpis = [
    ["avg rating", ratingText, "text-navy-800"],
    ["team sessions", teamSessions ?? "—", "text-navy-800"],
    ["next slot", nextSlot, "text-brand-400"],
    ["avg response", responseTime, "text-navy-800"],
  ];

  return (
    <div
      className="fixed inset-0 z-[300] flex items-start justify-center overflow-y-auto bg-navy-900/50 p-4 backdrop-blur-sm sm:p-8"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.name ?? "Therapist"}
        onClick={(e) => e.stopPropagation()}
        className="my-auto max-h-[90vh] w-full max-w-[680px] overflow-y-auto rounded-ds-xl bg-white shadow-e4"
      >
        {/* header */}
        <div className="sticky top-0 z-[2] flex items-start gap-4 border-b border-ink-100 bg-white px-7 py-5">
          {t.avatar ? (
            <img src={t.avatar} alt="" className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-400 text-[22px] font-extraboldNunito text-white">
              {t.initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="text-[19px] font-extraboldNunito text-navy-800">{t.name}</span>
              <span className="text-[13px] text-gold-600">✦</span>
              <span className={classNames("rounded-full px-2.5 py-[3px] text-[10px] font-extraboldNunito", providerBadge)}>
                {providerLabel}
              </span>
            </div>
            <div className="mb-2 text-[12.5px] text-ink-400">
              {t.specialty}
              {years ? ` · ${years} yrs experience` : ""}
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[14px] tracking-[1px] text-gold-400">{stars}</span>
              <span className="text-[12.5px] font-extraboldNunito text-navy-800">{ratingText}</span>
              {teamSessions != null ? (
                <span className="text-[11.5px] text-ink-400">· {teamSessions} sessions with your team</span>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-ds-sm bg-surface-page text-ink-600 hover:text-navy-800"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-5 px-7 py-5">
          {/* key stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {kpis.map(([label, value, color]) => (
              <div key={label} className="rounded-ds-md bg-ink-50 p-3.5">
                <div className={classNames("text-[18px] font-extraboldNunito", color)}>{value}</div>
                <div className="text-[10.5px] text-ink-400">{label}</div>
              </div>
            ))}
          </div>

          {/* about */}
          <div>
            <div className="mb-2 text-[12px] font-extraboldNunito tracking-[0.04em] text-navy-800">ABOUT</div>
            <div className="text-[13px] leading-[1.7] text-ink-600">{bio}</div>
          </div>

          {/* focus areas */}
          {focusAreas.length ? (
            <div>
              <div className="mb-2.5 text-[12px] font-extraboldNunito tracking-[0.04em] text-navy-800">FOCUS AREAS</div>
              <div className="flex flex-wrap gap-2">
                {focusAreas.map((tag) => (
                  <span key={tag} className="rounded-full bg-brand-25 px-3 py-1.5 text-[11.5px] font-boldNunito text-brand-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {/* practice details */}
          <div>
            <div className="mb-2.5 text-[12px] font-extraboldNunito tracking-[0.04em] text-navy-800">PRACTICE DETAILS</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <PracticeDetail
                label="Session formats"
                value={formats}
                icon={
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#858585" strokeWidth="2">
                    <path d="M12 2v20M2 12h20" />
                  </svg>
                }
              />
              <PracticeDetail
                label="Languages"
                value={languages}
                icon={
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#858585" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20" />
                  </svg>
                }
              />
              <PracticeDetail
                label="Billing"
                value={billLabel}
                icon={
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#858585" strokeWidth="2">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                }
              />
              {verified ? (
                <PracticeDetail
                  tone="verified"
                  label="Credentials & indemnity"
                  value="Verified by TalkAM"
                  icon={
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1F6B59" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  }
                />
              ) : (
                <PracticeDetail
                  tone="warn"
                  label="Not TalkAM-verified"
                  value="Employer-provided"
                  icon={
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9A6E0A" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                    </svg>
                  }
                />
              )}
            </div>
          </div>

          {/* ratings & reviews — only with real review rows (never fabricated) */}
          {hasReviews ? (
            <div>
              <div className="mb-3 text-[12px] font-extraboldNunito tracking-[0.04em] text-navy-800">
                RATINGS &amp; REVIEWS
              </div>
              <div className="mb-3.5 flex items-center gap-5 rounded-ds-md bg-ink-50 p-4">
                <div className="shrink-0 text-center">
                  <div className="text-[32px] font-extraboldNunito leading-none text-navy-800">{ratingText}</div>
                  <div className="my-1 text-[12px] tracking-[1px] text-gold-400">{stars}</div>
                  <div className="text-[10.5px] text-ink-400">avg rating</div>
                </div>
                {breakdown ? (
                  <div className="flex flex-1 flex-col gap-1.5">
                    {breakdown.map((r) => (
                      <div key={r.stars} className="flex items-center gap-2.5">
                        <span className="w-2 text-[10.5px] text-ink-400">{r.stars}</span>
                        <div className="h-1.5 flex-1 rounded-[3px] bg-ink-100">
                          <div className="h-1.5 rounded-[3px] bg-gold-400" style={{ width: `${r.pct}%` }} />
                        </div>
                        <span className="w-7 text-right text-[10.5px] text-ink-400">{r.pct}%</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col gap-2.5">
                {reviews.map((rv, i) => (
                  <div key={i} className="rounded-ds-md border border-ink-100 p-3.5">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[12px] tracking-[1px] text-gold-400">{starsFor(rv.rating)}</span>
                      <span className="text-[10.5px] text-ink-400">{rv.when ?? rv.created_at ?? ""}</span>
                    </div>
                    <div className="mb-1.5 text-[12.5px] leading-[1.6] text-ink-600">
                      &ldquo;{rv.comment ?? rv.text}&rdquo;
                    </div>
                    <div className="text-[10.5px] font-boldNunito text-ink-400">Employee · anonymised</div>
                  </div>
                ))}
              </div>
              <div className="mt-2.5 text-[10.5px] leading-[1.6] text-ink-400">
                Reviews are submitted by employees and shown anonymised. Session content is never included.
              </div>
            </div>
          ) : null}

          {/* footer actions */}
          <div className="sticky bottom-0 flex gap-2 bg-white pt-1">
            <button
              type="button"
              onClick={close}
              className="h-[46px] flex-1 rounded-[10px] border border-ink-200 bg-surface-page text-[13px] font-boldNunito text-navy-800 hover:bg-ink-100"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() =>
                openModal("confirm", {
                  title: `Remove ${t.name}?`,
                  body: "They stop taking new bookings from your team. Sessions already scheduled still go ahead.",
                  confirmLabel: "Remove",
                  toast: `${t.name} removed from your network`,
                })
              }
              className="h-[46px] flex-1 rounded-[10px] border border-[#FFCDD2] bg-surface-errorTint text-[13px] font-boldNunito text-surface-errorInk hover:bg-[#FFE4E4]"
            >
              Remove from network
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportModal = ({ open, close, context }) => (
  <Modal open={open} onClose={close} title="RPT-0231" subtitle="Under review by TalkAM Trust & Safety">
    <InfoStrip tone="red" className="mb-4">
      Reports never include session content, chat text, or clinical notes. You see
      category and resolution status only.
    </InfoStrip>
    <div className="flex flex-col gap-2.5">
      {[
        ["Reported", "Dr. Emeka N. (therapist)"],
        ["Category", "Late to session"],
        ["Filed by", "Employee (anonymous)"],
        ["Date", "Jul 15, 2026"],
        ["Status", "Under review"],
      ].map(([label, value]) => (
        <div key={label} className="flex justify-between gap-4 border-b border-ink-100 pb-2.5">
          <span className="text-caption text-ink-500">{label}</span>
          <span className="text-[13px] font-boldNunito text-navy-800">{value}</span>
        </div>
      ))}
    </div>
  </Modal>
);

const PlanCheckoutModal = ({ open, close, showToast, context }) => (
  <Modal open={open} onClose={close} title="Confirm plan change" subtitle={context?.planName}>
    <div className="mb-4 flex flex-col gap-2 rounded-ds-md bg-ink-50 p-3.5">
      <div className="flex justify-between gap-4">
        <span className="text-caption text-ink-500">Seats</span>
        <span className="text-[13px] font-boldNunito text-navy-800">{context?.seats}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-caption text-ink-500">Rate per seat</span>
        <span className="text-[13px] font-boldNunito text-navy-800">{context?.perSeat}</span>
      </div>
      <div className="flex justify-between gap-4 border-t border-surface-line pt-2">
        <span className="text-caption font-boldNunito text-navy-800">Monthly total</span>
        <span className="text-body font-extraboldNunito text-brand-400">{context?.monthly}</span>
      </div>
    </div>
    <InfoStrip className="mb-4">
      Billed on your next invoice. Nothing is charged today.
    </InfoStrip>
    <div className="flex justify-end gap-2">
      <SecondaryButton onClick={close}>Cancel</SecondaryButton>
      <PrimaryButton
        onClick={() => {
          close();
          showToast("Plan updated");
        }}
      >
        Confirm &amp; continue
      </PrimaryButton>
    </div>
  </Modal>
);

/**
 * Enabling 2FA (off -> on) requires a fresh email OTP server-side
 * (PrivacySettingService::update). Turning it off never does, so that path
 * skips this modal entirely and saves straight away.
 */
const TwoFactorEnableModal = ({ open, close, showToast, context }) => {
  const [requestOtp, { isLoading: isSending }] = useRequestOtpV2Mutation();
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const email = context?.email;

  useEffect(() => {
    if (!open || !email) return;
    setCode("");
    setError(null);
    setSent(false);
    requestOtp({ type: "login", email }).then(() => setSent(true)).catch(() => {});
  }, [open, email]); // eslint-disable-line react-hooks/exhaustive-deps

  const resend = async () => {
    setError(null);
    try {
      await requestOtp({ type: "login", email }).unwrap();
      setSent(true);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  const confirm = async () => {
    setConfirming(true);
    setError(null);
    try {
      await context.onConfirm(code);
      close();
      showToast("Two-factor authentication enabled");
    } catch (err) {
      setError(apiErrorMessage(err, "That code didn't work. Request a new one."));
      setCode("");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Turn on two-factor authentication"
      subtitle={email ? `Enter the 6-digit code emailed to ${email}` : undefined}
      width="max-w-[440px]"
    >
      <OtpBoxes value={code} onChange={setCode} disabled={confirming} />
      {error ? <p className="mb-4 text-caption text-signal-error">{error}</p> : null}
      <p className="mb-4 text-caption text-ink-400">
        {sent ? "A code is on its way. " : ""}
        <button
          type="button"
          onClick={resend}
          disabled={isSending}
          className="cursor-pointer font-boldNunito text-brand-400"
        >
          Resend code
        </button>
      </p>
      <div className="flex justify-end gap-2">
        <SecondaryButton onClick={close}>Cancel</SecondaryButton>
        <PrimaryButton disabled={code.length < 6 || confirming} onClick={confirm}>
          {confirming ? "Confirming…" : "Confirm & enable"}
        </PrimaryButton>
      </div>
    </Modal>
  );
};

/* ── Delete company account (Danger Zone) ─────────────────────────────── */

const DeleteCompanyModal = ({ open, close, showToast, context }) => {
  const [requestDeletion, { isLoading }] = useRequestOrgDeletionMutation();
  const [confirmName, setConfirmName] = useState("");
  const [error, setError] = useState(null);
  const companyName = context?.name ?? "";

  useEffect(() => {
    if (!open) {
      setConfirmName("");
      setError(null);
    }
  }, [open]);

  const confirm = async () => {
    setError(null);
    try {
      await requestDeletion({ confirm_name: confirmName }).unwrap();
      close();
      showToast("Company account scheduled for deletion in 30 days");
    } catch (err) {
      setError(apiErrorMessage(err, "Couldn't schedule that just now — please try again"));
    }
  };

  return (
    <Modal open={open} onClose={close} title="Delete company account" width="max-w-[460px]">
      <p className="mb-4 text-[13px] leading-[1.7] text-ink-500">
        This schedules <strong className="font-boldNunito text-navy-800">{companyName}</strong>{" "}
        for deletion. Employees keep normal access during a 30-day grace period — after that,
        every membership is deactivated and the account is permanently removed. You can cancel
        this any time before then.
      </p>
      <label className="mb-4 flex flex-col gap-1.5">
        <span className="text-[11px] font-boldNunito text-ink-400">
          Type <strong className="font-boldNunito text-ink-800">{companyName}</strong> to confirm
        </span>
        <input
          value={confirmName}
          onChange={(e) => setConfirmName(e.target.value)}
          className="h-[42px] rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px] text-ink-800"
        />
      </label>
      {error ? <p className="mb-4 text-caption text-signal-error">{error}</p> : null}
      <div className="flex justify-end gap-2">
        <SecondaryButton onClick={close}>Cancel</SecondaryButton>
        <button
          type="button"
          onClick={confirm}
          disabled={confirmName !== companyName || isLoading}
          className="cursor-pointer rounded-[10px] bg-signal-error px-4 py-[9px] text-[13px] font-boldNunito text-white disabled:cursor-not-allowed disabled:bg-[#C7CEDA]"
        >
          {isLoading ? "Scheduling…" : "Delete company account"}
        </button>
      </div>
    </Modal>
  );
};

const AdminModals = ({ modal, context, close, showToast }) => (
  <>
    <InviteModal open={modal === "invite"} close={close} showToast={showToast} />
    <CsvUploadModal open={modal === "csv"} close={close} showToast={showToast} />
    <RoiModal open={modal === "roi"} close={close} context={context} />
    <TopUpModal open={modal === "topUp"} close={close} showToast={showToast} />
    <AddSeatsModal open={modal === "addSeats"} close={close} showToast={showToast} />
    <InvoiceModal open={modal === "invoice"} close={close} context={context} />
    <EmployeeModal open={modal === "employee"} close={close} context={context} />
    <ConfirmModal open={modal === "confirm"} close={close} showToast={showToast} context={context} />
    <CapacityModal open={modal === "capacity"} close={close} showToast={showToast} />
    <AddOwnTherapistModal open={modal === "addOwn"} close={close} showToast={showToast} />
    <TherapistModal open={modal === "therapist"} close={close} context={context} />
    <ReportModal open={modal === "report"} close={close} context={context} />
    <PlanCheckoutModal open={modal === "planCheckout"} close={close} showToast={showToast} context={context} />
    <TwoFactorEnableModal open={modal === "twoFactorEnable"} close={close} showToast={showToast} context={context} />
    <DeleteCompanyModal open={modal === "deleteCompany"} close={close} showToast={showToast} context={context} />
  </>
);

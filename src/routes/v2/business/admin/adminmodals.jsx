import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import classNames from "classnames";
import {
  Modal,
  PrimaryButton,
  SecondaryButton,
  InfoStrip,
  Toast,
} from "../../../../components/v2/dashboard/chrome";
import {
  roi,
  ROI_INPUTS,
  naira,
  invoices,
  topUpOptions,
  seatPackOptions,
  CURRENT_SEATS,
  PLANS,
  tierForSeats,
  networkStats,
} from "../../../../fakedata/v2/admin";

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

const RoiModal = ({ open, close }) => (
  <Modal
    open={open}
    onClose={close}
    title="How ROI is calculated"
    subtitle="Four inputs, no black box"
    width="max-w-[560px]"
  >
    <div className="mb-4 flex flex-col gap-2.5">
      {[
        { label: "Sessions delivered this month", value: String(ROI_INPUTS.sessionsThisMonth) },
        { label: "Absenteeism days avoided per session", value: String(ROI_INPUTS.daysPerSession ?? roi.daysPerSession) },
        { label: "Average daily productivity value", value: roi.dailyValue },
        { label: "Program cost this month", value: roi.programCost },
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
        <span className="text-[13px] font-boldNunito text-navy-800">{roi.grossValue}</span>
      </div>
      <div className="mb-2 flex justify-between gap-4">
        <span className="text-caption text-ink-500">Less program cost</span>
        <span className="text-[13px] font-boldNunito text-navy-800">− {roi.programCost}</span>
      </div>
      <div className="flex justify-between gap-4 border-t border-[#F0E4C8] pt-2">
        <span className="text-[13px] font-boldNunito text-navy-800">Net ROI</span>
        <span className="text-body font-extraboldNunito text-gold-600">
          {roi.netROI} · {roi.multiple}
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

const TopUpModal = ({ open, close, showToast }) => {
  const [key, setKey] = useState("25");
  const selected = topUpOptions.find((o) => o.key === key);

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
  const addQty = parseInt(key, 10);
  const newTotal = CURRENT_SEATS + addQty;
  const oldPrice = tierForSeats(PLANS.lite.tiers, CURRENT_SEATS).price;
  const newPrice = tierForSeats(PLANS.lite.tiers, newTotal).price;

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
  const invoice = invoices.find((i) => i.id === context) ?? invoices[0];
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
  <Modal open={open} onClose={close} title={context?.id ?? "Employee"} subtitle="Anonymised record">
    <InfoStrip tone="purple" className="mb-4">
      You can see status and session <strong>counts</strong> only. Session content,
      chat messages, therapist notes and community activity are never visible to an
      employer account.
    </InfoStrip>
    <div className="flex flex-col gap-2.5">
      {[
        ["Employee ID", context?.id],
        ["Department", context?.dept],
        ["Status", context?.status],
        ["Sessions used", context ? `${context.used} / ${context.total}` : "—"],
        ["Last active", context?.lastActive],
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
        onClick={() => {
          close();
          showToast(context?.toast ?? "Done");
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

const TherapistModal = ({ open, close, context }) => (
  <Modal open={open} onClose={close} title={context?.name ?? "Therapist"} subtitle={context?.specialty}>
    <div className="mb-4 flex gap-4">
      {[
        ["Sessions", context?.sessions],
        ["Avg rating", context?.rating],
        ["Next slot", context?.availability],
      ].map(([label, value]) => (
        <div key={label} className="flex-1 rounded-ds-md bg-ink-50 p-3">
          <div className="text-h3 font-extraboldNunito text-navy-800">{value}</div>
          <div className="text-[10px] text-ink-400">{label}</div>
        </div>
      ))}
    </div>
    <InfoStrip className="mb-4">
      Every B2B session with this therapist draws ₦8,000 from your session bundle.
    </InfoStrip>
    <div className="flex justify-end">
      <SecondaryButton onClick={close}>Close</SecondaryButton>
    </div>
  </Modal>
);

const ReportModal = ({ open, close }) => (
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

const AdminModals = ({ modal, context, close, showToast }) => (
  <>
    <InviteModal open={modal === "invite"} close={close} showToast={showToast} />
    <CsvUploadModal open={modal === "csv"} close={close} showToast={showToast} />
    <RoiModal open={modal === "roi"} close={close} />
    <TopUpModal open={modal === "topUp"} close={close} showToast={showToast} />
    <AddSeatsModal open={modal === "addSeats"} close={close} showToast={showToast} />
    <InvoiceModal open={modal === "invoice"} close={close} context={context} />
    <EmployeeModal open={modal === "employee"} close={close} context={context} />
    <ConfirmModal open={modal === "confirm"} close={close} showToast={showToast} context={context} />
    <CapacityModal open={modal === "capacity"} close={close} showToast={showToast} />
    <AddOwnTherapistModal open={modal === "addOwn"} close={close} showToast={showToast} />
    <TherapistModal open={modal === "therapist"} close={close} context={context} />
    <ReportModal open={modal === "report"} close={close} />
    <PlanCheckoutModal open={modal === "planCheckout"} close={close} showToast={showToast} context={context} />
  </>
);

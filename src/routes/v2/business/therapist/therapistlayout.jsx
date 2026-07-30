import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import * as Icon from "react-feather";
import { DashboardShell } from "../../../../components/v2/dashboard/dashboardshell";
import {
  Modal,
  PrimaryButton,
  SecondaryButton,
  InfoStrip,
  Toast,
} from "../../../../components/v2/dashboard/chrome";
import { usePageMeta } from "../../../../hooks/usePageMeta";
import { V2 } from "../../../../constants/v2routes";
import { useDispatch } from "react-redux";
import { therapistPortalLabel, therapistPageMeta, initialsOf } from "../../../../constants/therapistdashboard";
import { logOut } from "../../../../services/authSlice";
import { useGetMeV2Query } from "../../../../services/v2/authApiSliceV2";
import {
  useGetTherapistHomeQuery,
  useGetTherapistSessionsQuery,
} from "../../../../services/v2/therapistApiSlice";

/**
 * Therapist (provider) dashboard shell.
 * Spec: "TalkAM B2B Therapist Dashboard.dc.html". Wellness-teal accent, per
 * the DS rule that teal marks therapy surfaces.
 */

const TherapistContext = createContext(null);

export const useTherapist = () => {
  const ctx = useContext(TherapistContext);
  if (!ctx) throw new Error("useTherapist must be used inside TherapistProvider");
  return ctx;
};

const at = (path) => `${V2.therapist}${path}`;

/** Deck: sidebar `<nav>` — order, labels and count-pill tones. */
const navSections = ({ upcoming, unread, showEarnings }) => [
  {
    items: [
      { to: V2.therapist, end: true, label: "Home", icon: <Icon.Home size={16} /> },
      { to: at("/availability"), label: "Availability", icon: <Icon.Clock size={16} /> },
      { to: at("/sessions"), label: "Sessions", icon: <Icon.Calendar size={16} />, count: upcoming ? String(upcoming) : undefined, countTone: "blue" },
      { to: at("/messages"), label: "Client Messages", icon: <Icon.MessageCircle size={16} />, count: unread ? String(unread) : undefined, countTone: "blue" },
      { to: at("/analytics"), label: "Analytics", icon: <Icon.BarChart2 size={16} /> },
      // The Earnings module is hidden for business-employed therapists (§04).
      ...(showEarnings ? [{ to: at("/earnings"), label: "Earnings", icon: <Icon.DollarSign size={16} /> }] : []),
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      { to: at("/help"), label: "Help & Support", icon: <Icon.HelpCircle size={16} /> },
      { to: at("/profile"), label: "Profile & Account", icon: <Icon.User size={16} /> },
    ],
  },
];

/** Deck: the two verification strips directly under the logo block. */
const VerificationStrips = ({ isVerified, employer }) => (
  <>
    <div className="flex items-center gap-2 rounded-[10px] border border-[rgba(219,182,110,0.28)] bg-[rgba(219,182,110,0.12)] px-2.5 py-2">
      <span className="shrink-0 text-[12px] text-gold-400">✦</span>
      <span className="text-[10.5px] leading-[1.4] text-[#E9CE95]">
        {isVerified ? "Verified Therapist · MDCN Confirmed" : "Verification in progress"}
      </span>
    </div>
    {employer ? (
      <div className="mt-2 flex items-center gap-2 rounded-[10px] border border-[rgba(104,180,225,0.28)] bg-[rgba(104,180,225,0.12)] px-2.5 py-2">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#68B4E1" strokeWidth="2" className="shrink-0">
          <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01" />
        </svg>
        <span className="text-[10.5px] leading-[1.4] text-[#A9D5EF]">
          Employed by {employer} · Paid by business
        </span>
      </div>
    ) : null}
  </>
);

export const TherapistProvider = () => {
  const [modal, setModal] = useState(null);
  const [context, setContext] = useState(null);
  const [toast, setToast] = useState(null);
  const [resolved, setResolved] = useState([]);
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

  const resolve = useCallback((key) => setResolved((p) => [...p, key]), []);
  const dispatch = useDispatch();

  const value = useMemo(
    () => ({ open, close, showToast, resolved, resolve, signOut: () => dispatch(logOut()) }),
    [open, close, showToast, resolved, resolve, dispatch]
  );

  return (
    <TherapistContext.Provider value={value}>
      <Outlet />
      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-[400] -translate-x-1/2">
          <Toast message={toast} />
        </div>
      ) : null}
      <TherapistModals
        modal={modal}
        context={context}
        close={close}
        showToast={showToast}
        resolve={resolve}
      />
    </TherapistContext.Provider>
  );
};

export const TherapistLayout = () => {
  const { pathname } = useLocation();

  const { data: me } = useGetMeV2Query();
  const { data: home } = useGetTherapistHomeQuery();
  const { data: sessions } = useGetTherapistSessionsQuery();

  const employment = home?.employment ?? {};
  const showEarnings = !employment.is_business_employed;
  const upcoming = sessions?.upcoming?.length ?? 0;
  const unread = home?.attention?.unread_messages ?? 0;

  const fullName = me?.name ?? "";
  const user = {
    name: fullName || me?.username || "",
    role: me?.therapist?.credential_type ?? "Therapist",
    initials: initialsOf(fullName || me?.username || ""),
    avatarBg: "#017FC8",
    avatarColor: "#fff",
  };

  const segment = pathname.replace(V2.therapist, "").replace(/^\//, "") || "home";
  const meta = therapistPageMeta[segment] ?? therapistPageMeta.home;

  const subtitle =
    segment === "home"
      ? [fullName, new Date().toLocaleDateString("en-NG", { weekday: "long", month: "short", day: "numeric" })].filter(Boolean).join(" · ")
      : segment === "sessions"
        ? `${upcoming} upcoming`
        : meta.subtitle;

  usePageMeta(`${meta.title} — TalkAM for Therapists`);

  return (
    <DashboardShell
      sections={navSections({ upcoming, unread, showEarnings })}
      width={224}
      portalLabel={therapistPortalLabel}
      topBlock={<VerificationStrips isVerified={!!me?.therapist?.is_verified} employer={employment.employer_name} />}
      user={user}
      bellDot={(home?.attention?.pending_notes ?? 0) + unread > 0}
      title={meta.title}
      subtitle={subtitle}
      topbarAction={
        /* Deck: blue `#017FC8` pill — "Manage Availability" — not a teal CTA. */
        <Link
          to={at("/availability")}
          className="inline-flex shrink-0 cursor-pointer items-center gap-[7px] rounded-[10px] bg-brand-400 px-4 py-[9px] text-[13px] font-boldNunito text-white shadow-[0_4px_12px_rgba(1,127,200,0.25)] transition-colors hover:bg-brand-600"
        >
          <Icon.Plus size={13} strokeWidth={2.5} />
          <span className="hidden sm:inline">Manage Availability</span>
        </Link>
      }
    />
  );
};

/* ── Modals ───────────────────────────────────────────────────────────── */

const NotesModal = ({ open, close, showToast, resolve }) => (
  <Modal open={open} onClose={close} title="Session notes" subtitle="Private to you — never shared with the employer">
    <InfoStrip tone="purple" className="mb-4">
      Sessions are never recorded. These written notes are the only record, and they
      stay with you.
    </InfoStrip>
    <textarea
      rows={6}
      defaultValue=""
      placeholder="What came up, what you tried, and what to pick up next time…"
      className="mb-4 w-full resize-none rounded-ds-md border-[1.5px] border-ink-200 px-3.5 py-3 text-[13px] leading-[1.6] text-ink-800"
    />
    <div className="flex justify-end gap-2">
      <SecondaryButton onClick={close}>Save draft</SecondaryButton>
      <PrimaryButton
        onClick={() => {
          resolve("notes");
          close();
          showToast("Session notes saved");
        }}
      >
        Save notes
      </PrimaryButton>
    </div>
  </Modal>
);

const RescheduleReqModal = ({ open, close, showToast, resolve }) => (
  <Modal open={open} onClose={close} title="Reschedule request" subtitle="Anonymous · currently Thu 2:00 PM">
    <p className="mb-4 text-[13px] leading-[1.7] text-ink-500">
      The client has asked to move this session. Accepting notifies them and frees your
      original slot.
    </p>
    <div className="mb-4 flex flex-col gap-2">
      {["Thu · 5:00 PM", "Fri · 10:00 AM", "Fri · 3:00 PM"].map((slot, i) => (
        <label
          key={slot}
          className="flex cursor-pointer items-center gap-3 rounded-ds-md border-[1.5px] border-ink-200 px-3.5 py-3 text-[13px] font-semiboldNunito text-ink-600 has-[:checked]:border-wellness-400 has-[:checked]:bg-wellness-50"
        >
          <input
            type="radio"
            name="reschedule-slot"
            defaultChecked={i === 0}
            className="text-wellness-400 focus:ring-wellness-400"
          />
          {slot}
        </label>
      ))}
    </div>
    <div className="flex justify-end gap-2">
      <SecondaryButton onClick={close}>Decline</SecondaryButton>
      <PrimaryButton
        onClick={() => {
          resolve("reschedule");
          close();
          showToast("Reschedule confirmed — client notified");
        }}
      >
        Confirm new time
      </PrimaryButton>
    </div>
  </Modal>
);

const JoinConfirmModal = ({ open, close, showToast, context }) => (
  <Modal open={open} onClose={close} title="Join session room?" width="max-w-[440px]">
    <div className="mb-4 flex items-center gap-3">
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-h4 font-extraboldNunito text-white"
        style={{ background: context?.avatarBg ?? "#3BA88F" }}
      >
        {context?.initials ?? "A"}
      </span>
      <div>
        <div className="text-body font-extraboldNunito text-navy-800">
          {context?.client ?? "Anonymous client"}
        </div>
        <div className="text-[11.5px] text-ink-400">
          {context?.format ?? "Video"} · {context?.focus ?? "Session"}
        </div>
      </div>
    </div>
    <InfoStrip tone="purple" className="mb-4">
      This room is never recorded — no audio, video or transcript is stored.
    </InfoStrip>
    <div className="flex justify-end gap-2">
      <SecondaryButton onClick={close}>Not yet</SecondaryButton>
      <button
        type="button"
        onClick={() => {
          close();
          showToast(`Session with ${context?.client ?? "the client"} started`);
        }}
        className="cursor-pointer rounded-[10px] bg-wellness-400 px-4 py-[9px] text-[13px] font-boldNunito text-white hover:bg-wellness-600"
      >
        Join room
      </button>
    </div>
  </Modal>
);

const RequestModal = ({ open, close, showToast, context }) => (
  <Modal open={open} onClose={close} title="New client request" subtitle={context?.focus}>
    <p className="mb-4 text-[13px] leading-[1.7] text-ink-500">{context?.context}</p>
    <div className="mb-4 rounded-ds-md bg-ink-50 p-3.5">
      <div className="text-[11px] font-boldNunito text-ink-400">REQUESTED SLOT</div>
      <div className="text-body font-extraboldNunito text-navy-800">{context?.requested}</div>
    </div>
    <div className="flex justify-end gap-2">
      <SecondaryButton
        onClick={() => {
          close();
          showToast("Request declined");
        }}
      >
        Decline
      </SecondaryButton>
      <button
        type="button"
        onClick={() => {
          close();
          showToast("Request accepted — session scheduled");
        }}
        className="cursor-pointer rounded-[10px] bg-wellness-400 px-4 py-[9px] text-[13px] font-boldNunito text-white hover:bg-wellness-600"
      >
        Accept &amp; schedule
      </button>
    </div>
  </Modal>
);

const AllPayoutsModal = ({ open, close, context }) => (
  <Modal open={open} onClose={close} title="All payouts" subtitle="Paid weekly via Flutterwave" width="max-w-[560px]">
    <div className="flex flex-col">
      {(context ?? []).map((p) => (
        <div
          key={p.date}
          className="flex items-center justify-between gap-4 border-b border-ink-100 py-3 last:border-b-0"
        >
          <div>
            <div className="text-[13px] font-boldNunito text-navy-800">{p.date}</div>
            <div className="text-[11px] text-ink-400">{p.sessions} sessions</div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[13px] font-extraboldNunito text-navy-800">{p.amount}</span>
            <span className="rounded-full bg-wellness-50 px-2.5 py-[3px] text-[10px] font-extraboldNunito text-wellness-600">
              Paid
            </span>
          </div>
        </div>
      ))}
    </div>
  </Modal>
);

/**
 * Only the active modal is mounted. Rendering all of them meant each one's
 * children were evaluated on every state change — a modal that reads its
 * `context` (e.g. AllPayouts mapping over a payout array) would then crash
 * whenever a *different* modal was open and `context` held another shape.
 */
const TherapistModals = ({ modal, context, close, showToast, resolve }) => {
  switch (modal) {
    case "notes":
      return <NotesModal open close={close} showToast={showToast} resolve={resolve} />;
    case "rescheduleReq":
      return <RescheduleReqModal open close={close} showToast={showToast} resolve={resolve} />;
    case "joinConfirm":
      return <JoinConfirmModal open close={close} showToast={showToast} context={context} />;
    case "request":
      return <RequestModal open close={close} showToast={showToast} context={context} />;
    case "allPayouts":
      return (
        <AllPayoutsModal open close={close} context={Array.isArray(context) ? context : []} />
      );
    default:
      return null;
  }
};

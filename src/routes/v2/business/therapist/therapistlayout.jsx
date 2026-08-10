import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import * as Icon from "react-feather";
import classNames from "classnames";
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
import {
  therapistPortalLabel,
  therapistPageMeta,
  initialsOf,
  sessionWhen,
  SESSION_FORMAT_LABEL,
} from "../../../../constants/therapistdashboard";
import { logOut } from "../../../../services/authSlice";
import { useGetMeV2Query, useRequestOtpV2Mutation } from "../../../../services/v2/authApiSliceV2";
import { OtpBoxes, apiErrorMessage } from "../auth/authlayout";
import { CallScreen } from "../../../../components/v2/callroom";
import { useGetTherapistSlotsQuery } from "../../../../services/v2/employeeApiSlice";
import {
  useGetTherapistHomeQuery,
  useGetTherapistSessionsQuery,
  useGetSessionNotesQuery,
  useSaveSessionNotesMutation,
  useProposeSessionRequestMutation,
  useGetTherapistProfileQuery,
  useRequestBookingRescheduleMutation,
} from "../../../../services/v2/therapistApiSlice";

/** Stable pseudonymous client ref, matching the backend's own "#4021" scheme
 *  (§11 privacy) — therapists never see a client's real name here. */
const anonRef = (session) => "Anonymous · #" + (4000 + ((session?.id ?? 0) % 6000));

const RESCHEDULE_REASONS = [
  { key: "personal_emergency", label: "Personal emergency" },
  { key: "technical_issues", label: "Technical issues" },
  { key: "client_request", label: "Client requested" },
];

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
        open={open}
        close={close}
        showToast={showToast}
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

const NotesModal = ({ open, close, showToast, context }) => {
  const sessionId = context?.id;
  const { data: existing, isFetching } = useGetSessionNotesQuery(sessionId, { skip: !sessionId });
  const [saveNotes, { isLoading: isSaving }] = useSaveSessionNotesMutation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sharedWithClient, setSharedWithClient] = useState(false);

  useEffect(() => {
    if (!existing) return;
    setTitle(existing.title ?? "");
    setContent(existing.content ?? "");
    setSharedWithClient(!!existing.shared_with_client);
  }, [existing]);

  const save = async (status) => {
    if (!sessionId || !title.trim()) return;
    try {
      await saveNotes({
        id: sessionId,
        title: title.trim(),
        content,
        shared_with_client: sharedWithClient,
        status,
      }).unwrap();
      close();
      showToast(status === "draft" ? "Draft saved" : "Session notes saved");
    } catch (err) {
      showToast(apiErrorMessage(err, "Couldn't save that note — please try again"));
    }
  };

  return (
    <Modal open={open} onClose={close} title="Session notes" subtitle="Private to you — never shared with the employer">
      <InfoStrip tone="purple" className="mb-4">
        Sessions are never recorded. These written notes are the only record, and they
        stay with you.
      </InfoStrip>
      {isFetching ? (
        <div className="mb-4 h-32 animate-pulse rounded-ds-md bg-ink-50" />
      ) : (
        <>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (e.g. Follow-up on anxiety management)"
            className="mb-3 w-full rounded-ds-md border-[1.5px] border-ink-200 px-3.5 py-2.5 text-[13px] font-semiboldNunito text-ink-800"
          />
          <textarea
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What came up, what you tried, and what to pick up next time…"
            className="mb-3 w-full resize-none rounded-ds-md border-[1.5px] border-ink-200 px-3.5 py-3 text-[13px] leading-[1.6] text-ink-800"
          />
          <label className="mb-4 flex cursor-pointer items-center gap-2 text-[12.5px] text-ink-500">
            <input
              type="checkbox"
              checked={sharedWithClient}
              onChange={(e) => setSharedWithClient(e.target.checked)}
              className="text-wellness-400 focus:ring-wellness-400"
            />
            Share a copy of this note with the client
          </label>
        </>
      )}
      <div className="flex justify-end gap-2">
        <SecondaryButton onClick={() => save("draft")} disabled={!title.trim() || isSaving}>
          Save draft
        </SecondaryButton>
        <PrimaryButton onClick={() => save("final")} disabled={!title.trim() || isSaving}>
          {isSaving ? "Saving…" : "Save notes"}
        </PrimaryButton>
      </div>
    </Modal>
  );
};

const RescheduleReqModal = ({ open, close, showToast, context }) => {
  const session = context;
  const [slot, setSlot] = useState(null);
  const [reason, setReason] = useState(RESCHEDULE_REASONS[0].key);
  const [requestReschedule, { isLoading }] = useRequestBookingRescheduleMutation();

  const { data: slotData } = useGetTherapistSlotsQuery(
    { id: session?.therapist_id },
    { skip: !session?.therapist_id }
  );
  const slots = (slotData?.slots ?? slotData ?? []).slice(0, 6);

  const confirm = async () => {
    if (!slot || !session?.id) return;
    try {
      await requestReschedule({ id: session.id, new_starts_at: slot, reason }).unwrap();
      close();
      showToast("Reschedule requested — the client will be asked to confirm");
    } catch (err) {
      showToast(apiErrorMessage(err, "Couldn't request a reschedule — please try again"));
    }
  };

  return (
    <Modal open={open} onClose={close} title="Propose a new time" subtitle={`${anonRef(session)} · currently ${sessionWhen(session?.starts_at)}`}>
      <p className="mb-4 text-[13px] leading-[1.7] text-ink-500">
        Pick a new slot from your own availability. The client is notified and must confirm
        before the session actually moves.
      </p>
      <div className="mb-4 flex flex-col gap-2">
        {slots.length === 0 ? (
          <div className="rounded-ds-md bg-ink-50 px-3.5 py-3 text-[12px] leading-[1.6] text-ink-400">
            No open slots in the next two weeks.
          </div>
        ) : (
          slots.map((s) => {
            const value = s.starts_at ?? s;
            return (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-3 rounded-ds-md border-[1.5px] border-ink-200 px-3.5 py-3 text-[13px] font-semiboldNunito text-ink-600 has-[:checked]:border-wellness-400 has-[:checked]:bg-wellness-50"
              >
                <input
                  type="radio"
                  name="reschedule-slot"
                  checked={slot === value}
                  onChange={() => setSlot(value)}
                  className="text-wellness-400 focus:ring-wellness-400"
                />
                {sessionWhen(value)}
              </label>
            );
          })
        )}
      </div>
      <div className="mb-4">
        <div className="mb-1.5 text-[11px] font-boldNunito text-ink-400">REASON</div>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full rounded-ds-md border-[1.5px] border-ink-200 px-3.5 py-2.5 text-[13px] font-semiboldNunito text-ink-600"
        >
          {RESCHEDULE_REASONS.map((r) => (
            <option key={r.key} value={r.key}>{r.label}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-end gap-2">
        <SecondaryButton onClick={close}>Cancel</SecondaryButton>
        <PrimaryButton onClick={confirm} disabled={!slot || isLoading}>
          {isLoading ? "Sending…" : "Send request"}
        </PrimaryButton>
      </div>
    </Modal>
  );
};

/** The "Accept & schedule" flow for a new-client request (no committed slot
 *  yet) — the therapist reviews their own real availability and proposes a
 *  concrete time, which turns the request into an actual (unpaid) session. */
const ProposeTimeModal = ({ open, close, showToast, context }) => {
  const lead = context;
  const [slot, setSlot] = useState(null);
  const { data: profile } = useGetTherapistProfileQuery();
  const [proposeTime, { isLoading }] = useProposeSessionRequestMutation();

  const { data: slotData } = useGetTherapistSlotsQuery(
    { id: profile?.id },
    { skip: !profile?.id }
  );
  const slots = (slotData?.slots ?? slotData ?? []).slice(0, 6);

  const send = async () => {
    if (!slot || !lead?.id) return;
    try {
      await proposeTime({ id: lead.id, starts_at: slot }).unwrap();
      close();
      showToast("Proposal sent — the client will be notified");
    } catch (err) {
      showToast(apiErrorMessage(err, "Couldn't send that proposal — please try again"));
    }
  };

  return (
    <Modal open={open} onClose={close} title="Propose new time" width="max-w-[520px]">
      <p className="mb-4 text-[13px] leading-[1.7] text-ink-500">
        Client will be notified and asked to confirm the new time. Sending a proposal creates
        the session on hold — it moves to Upcoming once they pay.
      </p>
      <div className="mb-4 grid grid-cols-2 gap-2">
        {slots.length === 0 ? (
          <div className="col-span-2 rounded-ds-md bg-ink-50 px-3.5 py-3 text-[12px] leading-[1.6] text-ink-400">
            No open slots in the next two weeks.
          </div>
        ) : (
          slots.map((s) => {
            const value = s.starts_at ?? s;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setSlot(value)}
                aria-pressed={slot === value}
                className={classNames(
                  "cursor-pointer rounded-[10px] border-[1.5px] px-3 py-[11px] text-center text-[12.5px] font-boldNunito",
                  slot === value
                    ? "border-navy-800 bg-navy-800 text-white"
                    : "border-ink-200 bg-surface-page text-ink-600"
                )}
              >
                {sessionWhen(value)}
              </button>
            );
          })
        )}
      </div>
      <PrimaryButton onClick={send} disabled={!slot || isLoading} className="w-full">
        {isLoading ? "Sending…" : "Send Proposal"}
      </PrimaryButton>
    </Modal>
  );
};

const JoinConfirmModal = ({ open, close, context, openCall }) => (
  <Modal open={open} onClose={close} title="Join session room?" width="max-w-[440px]">
    <div className="mb-4 flex items-center gap-3">
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-h4 font-extraboldNunito text-white"
        style={{ background: "#3BA88F" }}
      >
        {initialsOf(anonRef(context))}
      </span>
      <div>
        <div className="text-body font-extraboldNunito text-navy-800">{anonRef(context)}</div>
        <div className="text-[11.5px] text-ink-400">
          {SESSION_FORMAT_LABEL[context?.format] ?? "Video"} · {sessionWhen(context?.starts_at)}
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
        onClick={() => openCall(context)}
        className="cursor-pointer rounded-[10px] bg-wellness-400 px-4 py-[9px] text-[13px] font-boldNunito text-white hover:bg-wellness-600"
      >
        Join room
      </button>
    </div>
  </Modal>
);

const CallModal = ({ close, showToast, context }) => (
  <CallScreen
    bookingId={context?.id}
    format={context?.format}
    counterpartName={anonRef(context)}
    onExit={() => {
      close();
      showToast("Call ended");
    }}
  />
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

/**
 * Only the active modal is mounted. Rendering all of them meant each one's
 * children were evaluated on every state change — a modal that reads its
 * `context` (e.g. AllPayouts mapping over a payout array) would then crash
 * whenever a *different* modal was open and `context` held another shape.
 */
const TherapistModals = ({ modal, context, open, close, showToast }) => {
  switch (modal) {
    case "notes":
      return <NotesModal open close={close} showToast={showToast} context={context} />;
    case "rescheduleReq":
      return <RescheduleReqModal open close={close} showToast={showToast} context={context} />;
    case "proposeTime":
      return <ProposeTimeModal open close={close} showToast={showToast} context={context} />;
    case "joinConfirm":
      return (
        <JoinConfirmModal
          open
          close={close}
          context={context}
          openCall={(session) => open("call", session)}
        />
      );
    case "call":
      return <CallModal close={close} showToast={showToast} context={context} />;
    case "allPayouts":
      return (
        <AllPayoutsModal open close={close} context={Array.isArray(context) ? context : []} />
      );
    case "twoFactorEnable":
      return <TwoFactorEnableModal open close={close} showToast={showToast} context={context} />;
    default:
      return null;
  }
};

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { V2 } from "../../../../constants/v2routes";
import {
  MOODS,
  MOOD_MESSAGES,
  SESSION_TYPE_META,
  reportReasons,
  initialsOf,
} from "../../../../constants/employeedashboard";
import { logOut } from "../../../../services/authSlice";
import {
  useCancelBookingMutation,
  useRescheduleBookingMutation,
  useReviewBookingMutation,
  useSaveSessionMoodMutation,
  useGetTherapistsQuery,
  useGetTherapistSlotsQuery,
  useCreateBookingMutation,
  useGetCareTeamQuery,
  useReportUserMutation,
  useDeleteAccountMutation,
  useGetBookingsQuery,
} from "../../../../services/v2/employeeApiSlice";
import { useGetMeV2Query, useRequestOtpV2Mutation } from "../../../../services/v2/authApiSliceV2";
import { OtpBoxes, apiErrorMessage } from "../auth/authlayout";

/** Slot label in the deck's "Thu Jul 9 · 10:00 AM" shape. */
const slotLabel = (iso) => {
  const d = new Date(String(iso).replace(" ", "T"));
  return `${d.toLocaleDateString("en-NG", { weekday: "short", month: "short", day: "numeric" })} · ${d.toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit" })}`;
};

/** Hours until a session — drives the refund copy the deck spells out. */
const hoursUntil = (iso) =>
  (new Date(String(iso).replace(" ", "T")).getTime() - Date.now()) / 3600000;

/**
 * Employee dashboard modals.
 * Spec: § MODALS of "TalkAM B2B Employee Dashboard.dc.html" — each one is a
 * fixed `rgba(10,18,32,0.55)` scrim with an 18px-radius white sheet.
 */

const Scrim = ({ children, onClose }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center overflow-y-auto bg-[rgba(10,18,32,0.55)] p-6">
      {children}
    </div>
  );
};

const Sheet = ({ width, className, children }) => (
  <div
    role="dialog"
    aria-modal="true"
    className={classNames(
      "my-auto w-full rounded-[18px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.35)]",
      className
    )}
    style={{ maxWidth: width }}
  >
    {children}
  </div>
);

/** Deck: the 28×28 `#F2F3F7` close square in titled modals. */
const SheetHeader = ({ title, onClose }) => (
  <div className="flex items-center justify-between gap-3 border-b border-ink-100 px-6 py-[22px]">
    <div className="text-[16px] font-extraboldNunito text-navy-800">{title}</div>
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-[8px] bg-surface-page"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </div>
);

/** Deck: `buildMoodPicker(..., small=true)` — used by the pre-session + feedback modals. */
const SmallMoodRow = ({ value, onPick }) => (
  <div className="flex gap-2">
    {MOODS.map((m) => (
      <button
        key={m.key}
        type="button"
        onClick={() => onPick(m.key)}
        aria-pressed={value === m.key}
        className={classNames(
          "flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-[10px] border-[1.5px] px-1.5 py-2.5",
          value === m.key
            ? "border-[#017FC8] bg-[#EEF4FC] text-[#015C94]"
            : "border-surface-line bg-[#F8F9FC] text-[#717171]"
        )}
      >
        <span className="text-[22px]">{m.emoji}</span>
        <span className="text-[10px] font-boldNunito">{m.label}</span>
      </button>
    ))}
  </div>
);

const NavyButton = ({ className, children, ...props }) => (
  <button
    type="button"
    className={classNames(
      "h-[46px] cursor-pointer rounded-[12px] bg-navy-800 text-[13px] font-extraboldNunito text-white",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

const GreyButton = ({ className, children, ...props }) => (
  <button
    type="button"
    className={classNames(
      "h-[46px] cursor-pointer rounded-[10px] border border-ink-200 bg-surface-page text-[13px] font-boldNunito text-navy-800",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

const RedButton = ({ className, children, ...props }) => (
  <button
    type="button"
    className={classNames(
      "h-[46px] cursor-pointer rounded-[10px] bg-[#AC4242] text-[13px] font-extraboldNunito text-white",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

/* ── Reschedule ───────────────────────────────────────────────────────────── */

const RescheduleModal = ({ close, showToast, session }) => {
  const [slot, setSlot] = useState(null);
  const [reschedule, { isLoading }] = useRescheduleBookingMutation();

  const { data: slotData } = useGetTherapistSlotsQuery(
    { id: session?.therapist_id },
    { skip: !session?.therapist_id }
  );

  const slots = useMemo(
    () => (slotData?.slots ?? slotData ?? []).slice(0, 6),
    [slotData]
  );

  const confirm = async () => {
    if (!slot) return;

    try {
      await reschedule({ id: session.id, starts_at: slot }).unwrap();
      close();
      showToast("Session rescheduled");
    } catch {
      showToast("Couldn't reschedule just now — please try again");
    }
  };

  return (
    <Scrim onClose={close}>
      <Sheet width={460}>
        <SheetHeader title="Reschedule session" onClose={close} />
        <div className="flex flex-col gap-3.5 px-6 py-[22px]">
          <div className="text-[12px] leading-[1.6] text-ink-500">
            Currently: {slotLabel(session?.starts_at)} with {session?.therapist_name}. Pick a
            new available slot below.
          </div>
          <div className="grid grid-cols-2 gap-2">
            {slots.length === 0 ? (
              <div className="col-span-2 rounded-[10px] bg-[#F8F9FC] px-3.5 py-3 text-[12px] leading-[1.6] text-ink-400">
                No open slots in the next two weeks. Try messaging your therapist directly.
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
                      "cursor-pointer rounded-[10px] border-[1.5px] px-2 py-[11px] text-center text-[12.5px] font-boldNunito",
                      slot === value
                        ? "border-navy-800 bg-navy-800 text-white"
                        : "border-ink-200 bg-surface-page text-ink-600"
                    )}
                  >
                    {slotLabel(value)}
                  </button>
                );
              })
            )}
          </div>
          <div className="rounded-[10px] bg-[#FBF5E8] px-3 py-2.5 text-[11.5px] leading-[1.6] text-[#9A6E0A]">
            Rescheduling more than 24h before your session is free and instant.
          </div>
          <NavyButton onClick={confirm} disabled={!slot || isLoading}>
            {isLoading ? "Rescheduling…" : "Confirm New Time"}
          </NavyButton>
        </div>
      </Sheet>
    </Scrim>
  );
};

/* ── Cancel ───────────────────────────────────────────────────────────────── */

const CancelModal = ({ close, showToast, session }) => {
  const [cancelBooking, { isLoading }] = useCancelBookingMutation();
  const moreThanADay = hoursUntil(session?.starts_at) > 24;

  const confirm = async () => {
    try {
      await cancelBooking({ id: session.id }).unwrap();
      close();
      showToast("Session cancelled");
    } catch {
      showToast("Couldn't cancel just now — please try again");
    }
  };

  return (
  <Scrim onClose={close}>
    <Sheet width={420} className="p-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF0F0]">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#AC4242" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
      <div className="mb-2 text-[17px] font-extraboldNunito text-navy-800">
        Cancel this session?
      </div>
      <div className="mb-[18px] text-[13px] leading-[1.7] text-ink-500">
        Your session with {session?.therapist_name} is{" "}
        {moreThanADay ? "more than 24 hours away" : "less than 24 hours away"} — you&apos;ll
        receive a{" "}
        <strong className="font-boldNunito text-[#3BA88F]">
          {moreThanADay ? "full refund" : "50% refund"}
        </strong>
        . Cancelling within 24 hours refunds 50%; no-shows are not refunded.
      </div>
      <div className="flex gap-2.5">
        <GreyButton className="flex-1" onClick={close}>
          Keep Session
        </GreyButton>
        <RedButton className="flex-1" onClick={confirm} disabled={isLoading}>
          {isLoading ? "Cancelling…" : "Cancel Session"}
        </RedButton>
      </div>
    </Sheet>
  </Scrim>
  );
};

/* ── Feedback ─────────────────────────────────────────────────────────────── */

const FeedbackModal = ({ close, showToast, session }) => {
  const [star, setStar] = useState(4);
  const [postMood, setPostMood] = useState(null);
  const [comment, setComment] = useState("");
  const [review, { isLoading }] = useReviewBookingMutation();
  const [saveSessionMood] = useSaveSessionMoodMutation();

  const submit = async () => {
    if (!session?.id) {
      close();
      return;
    }

    try {
      await review({ id: session.id, rating: star, comment: comment || undefined }).unwrap();

      // The mood pair is separate from the review — a rating can be given
      // without one, and vice versa.
      if (postMood) {
        const value = MOODS.find((m) => m.key === postMood)?.value;
        await saveSessionMood({ id: session.id, phase: "post", mood: value }).unwrap();
      }

      close();
      showToast("Thanks — your feedback helps");
    } catch {
      showToast("Couldn't submit that just now — please try again");
    }
  };

  return (
    <Scrim onClose={close}>
      <Sheet width={440} className="p-6">
        <div className="mb-1 text-[16px] font-extraboldNunito text-navy-800">
          How was your session?
        </div>
        <div className="mb-[18px] text-[12px] text-ink-400">
          {session?.therapist_name ? `With ${session.therapist_name} · ` : ""}
          {session?.starts_at ? `${slotLabel(session.starts_at).split(" · ")[0]} — ` : ""}
          private, only visible to you and TalkAM
        </div>
        <div className="mb-[18px] flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setStar(n)}
              aria-label={`${n} stars`}
              className={classNames(
                "cursor-pointer text-[34px] leading-none",
                n <= star ? "text-gold-400" : "text-ink-200"
              )}
            >
              ★
            </button>
          ))}
        </div>
        <div className="mb-[9px] text-center text-[12.5px] font-boldNunito text-navy-800">
          How do you feel after this session?
        </div>
        <div className="mb-3.5">
          <SmallMoodRow value={postMood} onPick={setPostMood} />
        </div>
        <div className="mb-3.5 rounded-[10px] bg-[#F8F9FC] px-[13px] py-2.5 text-[11.5px] leading-[1.6] text-ink-600">
          {postMood ? MOOD_MESSAGES[postMood] : "Pick how you feel now — this is just for you."}
        </div>
        <textarea
          placeholder="Optional — what went well, or what could improve?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mb-4 h-[70px] w-full resize-none rounded-[12px] border-[1.5px] border-ink-200 px-3.5 py-3 text-[13px] text-ink-800"
        />
        <NavyButton className="w-full" onClick={submit} disabled={isLoading}>
          {isLoading ? "Submitting…" : "Submit Feedback"}
        </NavyButton>
      </Sheet>
    </Scrim>
  );
};

/* ── Pre-session mood ─────────────────────────────────────────────────────── */

const PreSessionMoodModal = ({ close, open, session }) => {
  const [mood, setMood] = useState(null);
  const [saveSessionMood, { isLoading }] = useSaveSessionMoodMutation();
  const { data: me } = useGetMeV2Query();
  const company = me?.business?.organization?.name ?? "your employer";

  /** The mood is optional — "Continue" always gets you into the room. */
  const proceed = async () => {
    if (mood && session?.id) {
      const value = MOODS.find((m) => m.key === mood)?.value;
      try {
        await saveSessionMood({ id: session.id, phase: "pre", mood: value }).unwrap();
      } catch {
        /* Never block joining a session on a check-in failing to save. */
      }
    }

    open("inCall", session);
  };

  return (
    <Scrim onClose={close}>
      <Sheet width={420} className="p-6">
        <div className="mb-1 text-[16px] font-extraboldNunito text-navy-800">
          Before you join…
        </div>
        <div className="mb-[18px] text-[12px] text-ink-400">
          How are you feeling right now? This helps track your progress over time —
          private, never shared with {company}.
        </div>
        <div className="mb-4">
          <SmallMoodRow value={mood} onPick={setMood} />
        </div>
        <button
          type="button"
          onClick={proceed}
          disabled={isLoading}
          className="h-[46px] w-full cursor-pointer rounded-[12px] bg-[#3BA88F] text-[13px] font-extraboldNunito text-white"
        >
          {isLoading ? "Saving…" : "Continue to Session Room →"}
        </button>
      </Sheet>
    </Scrim>
  );
};

/* ── Booking ──────────────────────────────────────────────────────────────── */

const BookingModal = ({ close, showToast, sessionType, setSessionType }) => {
  const [type, setType] = useState(sessionType);
  const [slot, setSlot] = useState(null);

  const { data: careTeam } = useGetCareTeamQuery();
  const { data: directory } = useGetTherapistsQuery({ per_page: 1 });
  const [createBooking, { isLoading }] = useCreateBookingMutation();

  /* Prefer the member's existing therapist — continuity of care is the point
     of the card. Fall back to the first of the directory for a new member. */
  const suggested = careTeam?.therapist ?? directory?.data?.[0] ?? null;
  const therapistId = suggested?.id;

  const { data: slotData } = useGetTherapistSlotsQuery(
    { id: therapistId },
    { skip: !therapistId }
  );
  const slots = useMemo(() => (slotData?.slots ?? slotData ?? []).slice(0, 6), [slotData]);
  const chosen = slot ?? slots[0]?.starts_at ?? slots[0] ?? null;

  const confirm = async () => {
    if (!therapistId || !chosen) return;

    try {
      await createBooking({
        therapist_id: therapistId,
        starts_at: chosen,
        format: type,
      }).unwrap();
      setSessionType(type);
      close();
      showToast(`Session booked for ${slotLabel(chosen)}`);
    } catch {
      showToast("Couldn't book that slot — it may have just been taken");
    }
  };

  const chip = (active) =>
    classNames(
      "flex flex-1 cursor-pointer items-center justify-center gap-[7px] rounded-[10px] border-[1.5px] p-[11px] text-[13px] font-boldNunito",
      active ? "border-navy-800 bg-navy-800 text-white" : "border-ink-200 bg-surface-page text-ink-600"
    );

  return (
    <Scrim onClose={close}>
      <Sheet width={440}>
        <SheetHeader title="Book a session" onClose={close} />
        <div className="flex flex-col gap-4 px-6 py-[22px]">
          <div className="flex items-center gap-3 rounded-[12px] bg-[#F8F9FC] px-3.5 py-3">
            <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-[#017FC8] text-[13px] font-extraboldNunito text-white">
              {initialsOf(suggested?.name ?? "")}
            </span>
            <div>
              <div className="text-[13px] font-boldNunito text-navy-800">
                {suggested?.name ?? "Finding you a therapist…"}
              </div>
              <div className="text-[11px] text-ink-400">
                {[suggested?.focus, chosen ? slotLabel(chosen) : null].filter(Boolean).join(" · ") ||
                  "Checking availability"}
              </div>
            </div>
          </div>

          {slots.length > 1 ? (
            <div>
              <span className="mb-2 block text-[12px] font-boldNunito text-ink-600">
                Pick a time
              </span>
              <div className="grid grid-cols-2 gap-2">
                {slots.map((sl) => {
                  const value = sl.starts_at ?? sl;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSlot(value)}
                      aria-pressed={chosen === value}
                      className={classNames(
                        "cursor-pointer rounded-[10px] border-[1.5px] px-2 py-[11px] text-center text-[12.5px] font-boldNunito",
                        chosen === value
                          ? "border-navy-800 bg-navy-800 text-white"
                          : "border-ink-200 bg-surface-page text-ink-600"
                      )}
                    >
                      {slotLabel(value)}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div>
            <label className="mb-2 block text-[12px] font-boldNunito text-ink-600">
              How would you like to connect?
            </label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setType("video")} className={chip(type === "video")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" />
                </svg>
                Video call
              </button>
              <button type="button" onClick={() => setType("voice")} className={chip(type === "voice")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Voice call
              </button>
            </div>
          </div>

          <div className="rounded-[12px] bg-[#EEF4FC] px-3.5 py-3 text-[11.5px] leading-[1.6] text-brand-600">
            We&apos;ll send you a reminder before your session, and{" "}
            {suggested?.name ?? "your therapist"} will see this on their schedule right away.
          </div>

          <button
            type="button"
            onClick={confirm}
            disabled={!therapistId || !chosen || isLoading}
            className="h-12 cursor-pointer rounded-[12px] bg-navy-800 text-[14px] font-extraboldNunito text-white disabled:cursor-not-allowed disabled:bg-[#C7CEDA]"
          >
            {isLoading ? "Booking…" : "Confirm Session →"}
          </button>
        </div>
      </Sheet>
    </Scrim>
  );
};

/* ── Session cap reached ──────────────────────────────────────────────────── */

const CapReachedModal = ({ close, showToast }) => {
  const [requested, setRequested] = useState(false);
  const { data: bookings } = useGetBookingsQuery();
  const { data: me } = useGetMeV2Query();

  const used = bookings?.summary?.sessions_used ?? 0;
  const allowed = bookings?.summary?.sessions_allowed ?? used;
  const company = me?.business?.organization?.name ?? "your company";

  return (
    <Scrim onClose={close}>
      <Sheet width={440} className="overflow-hidden">
        <div className="px-[26px] pb-5 pt-[26px] text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#FBF0F0]">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#AC4242" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div className="mb-2 text-[18px] font-extraboldNunito text-navy-800">
            You&apos;ve reached your monthly session limit
          </div>
          <div className="text-[13px] leading-[1.6] text-[#6B7280]">
            You&apos;ve used all <b className="text-navy-800">{used} of {allowed}</b> sessions
            in your {company} plan for this billing month. To keep booking, ask your admin to
            top up your organisation&apos;s session pool.
          </div>
        </div>

        {requested ? (
          <div className="px-[26px] pb-[26px]">
            <div className="mb-3.5 flex items-start gap-[11px] rounded-[12px] border border-[#C4E8DF] bg-wellness-25 px-4 py-3.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1F6B59" strokeWidth="2.5" strokeLinecap="round" className="mt-px shrink-0">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <div className="text-[12px] leading-[1.6] text-wellness-600">
                <b>Your admin has been notified.</b> We&apos;ve emailed a confirmation to
                your inbox — you&apos;ll get a notification here as soon as more sessions
                are added to the pool.
              </div>
            </div>
            <button
              type="button"
              onClick={close}
              className="h-12 w-full cursor-pointer rounded-[12px] bg-navy-800 text-[13.5px] font-extraboldNunito text-white"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="px-[26px] pb-[26px]">
            <div className="mb-3.5 rounded-[12px] bg-[#EEF4FC] px-3.5 py-3 text-[11.5px] leading-[1.6] text-brand-600">
              Notifying your admin sends them a top-up request. We&apos;ll email you a copy
              and let you know the moment more sessions are added — your allowance also
              resets automatically next billing month.
            </div>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={close}
                className="h-12 flex-1 cursor-pointer rounded-[12px] border border-ink-200 bg-surface-page text-[13.5px] font-boldNunito text-ink-600"
              >
                Not now
              </button>
              <button
                type="button"
                onClick={() => {
                  setRequested(true);
                  showToast("Request sent to your admin · confirmation emailed");
                }}
                className="h-12 flex-[1.4] cursor-pointer rounded-[12px] bg-navy-800 text-[13.5px] font-extraboldNunito text-white"
              >
                Notify admin to top up
              </button>
            </div>
          </div>
        )}
      </Sheet>
    </Scrim>
  );
};

/* ── In-call screen ───────────────────────────────────────────────────────── */

const InCallScreen = ({ open, sessionType, session }) => {
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const { data: me } = useGetMeV2Query();

  const isVideo = (session?.format ?? sessionType) === "video";
  const therapistName = session?.therapist_name ?? "";
  const therapistInitials = initialsOf(therapistName);
  const myInitial = (me?.name ?? me?.username ?? "").charAt(0).toUpperCase();

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const label = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-[600] flex flex-col bg-[#0A1220]">
      <div className="flex items-center justify-between px-[26px] py-5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#AC4242]" />
          <span className="text-[13px] font-boldNunito text-white">{label}</span>
        </div>
        <span className="text-[12px] text-white/40">Encrypted · not recorded</span>
      </div>

      <div className="relative flex flex-1 items-center justify-center">
        {isVideo ? (
          <>
            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(160deg,#141B34,#0D2240)]">
              <span className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[#017FC8] text-[40px] font-extraboldNunito text-white">
                {therapistInitials}
              </span>
            </div>
            <div className="absolute bottom-6 right-6 flex h-[100px] w-[140px] items-center justify-center overflow-hidden rounded-[14px] border-2 border-white/[0.15] bg-[#1A2E5A]">
              {cameraOn ? (
                <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#3BA88F] text-[18px] font-extraboldNunito text-white">
                  {myInitial}
                </span>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
                  <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
              <span className="absolute bottom-1.5 left-2 text-[9px] font-boldNunito text-white/60">
                YOU
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-[18px]">
            <div className="relative flex h-[140px] w-[140px] items-center justify-center rounded-full bg-[rgba(1,127,200,0.15)]">
              <span className="absolute -inset-3.5 rounded-full border-2 border-[rgba(1,127,200,0.25)]" />
              <span className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-[#017FC8] text-[32px] font-extraboldNunito text-white">
                {therapistInitials}
              </span>
            </div>
            <div className="text-[16px] font-extraboldNunito text-white">{therapistName}</div>
            <div className="text-[12px] text-white/40">Voice call · {label}</div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 p-7">
        <button
          type="button"
          onClick={() => setMuted((v) => !v)}
          aria-label={muted ? "Unmute" : "Mute"}
          className={classNames(
            "flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full",
            muted ? "bg-[#AC4242]" : "bg-white/[0.12]"
          )}
        >
          {muted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
              <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
              <line x1="12" y1="19" x2="12" y2="23" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
            </svg>
          )}
        </button>

        {isVideo ? (
          <button
            type="button"
            onClick={() => setCameraOn((v) => !v)}
            aria-label={cameraOn ? "Turn camera off" : "Turn camera on"}
            className={classNames(
              "flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full",
              cameraOn ? "bg-white/[0.12]" : "bg-[#AC4242]"
            )}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" />
            </svg>
          </button>
        ) : null}

        <button
          type="button"
          onClick={() => open("feedback", session)}
          aria-label="End call"
          className="flex h-[52px] w-[60px] cursor-pointer items-center justify-center rounded-[26px] bg-[#AC4242]"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" stroke="none">
            <path d="M21.5 15.9l-3.8-1.1c-.5-.1-1 0-1.3.4l-1.7 1.7c-2.5-1.3-4.6-3.4-5.9-5.9l1.7-1.7c.4-.4.5-.9.4-1.3L9.8 4.2c-.2-.6-.8-1-1.4-.9L4.7 4C4 4.1 3.5 4.7 3.5 5.4 3.9 14 10.2 20.1 18.6 20.5c.7 0 1.3-.5 1.4-1.2l.7-3.7c.1-.6-.3-1.2-.9-1.4z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

/* ── Report ───────────────────────────────────────────────────────────────── */

const ReportModal = ({ close, showToast, session }) => {
  const [reason, setReason] = useState("late");
  const [detail, setDetail] = useState("");
  const [reportUser, { isLoading }] = useReportUserMutation();
  const { data: careTeam } = useGetCareTeamQuery();

  const submit = async () => {
    const label = reportReasons.find((r) => r.key === reason)?.label ?? reason;
    const targetId = session?.therapist_id ?? careTeam?.therapist?.id ?? null;

    try {
      await reportUser({
        user_id: targetId,
        reason: label,
        description: detail || label,
      }).unwrap();
      close();
      showToast("Report submitted — our team will follow up");
    } catch {
      showToast("Couldn't submit that report — please try again");
    }
  };

  return (
    <Scrim onClose={close}>
      <Sheet width={460} className="p-6">
        <div className="mb-1 text-[16px] font-extraboldNunito text-navy-800">
          Report a concern
        </div>
        <div className="mb-4 text-[12px] text-ink-400">
          Goes directly to TalkAM&apos;s Trust &amp; Safety team — never to your employer
        </div>
        <div className="mb-4 flex flex-col gap-2">
          {reportReasons.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setReason(r.key)}
              aria-pressed={reason === r.key}
              className={classNames(
                "cursor-pointer rounded-[10px] border-[1.5px] px-3.5 py-[11px] text-left text-[13px] font-semiboldNunito",
                reason === r.key
                  ? "border-[#FFCDD2] bg-[#FFF0F0] text-[#8B2E2E]"
                  : "border-surface-line bg-[#F8F9FC] text-ink-600"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
        <textarea
          placeholder="Add any detail that might help (optional)"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          className="mb-4 h-[70px] w-full resize-none rounded-[12px] border-[1.5px] border-ink-200 px-3.5 py-3 text-[13px] text-ink-800"
        />
        <div className="flex gap-2.5">
          <GreyButton className="flex-1" onClick={close}>
            Cancel
          </GreyButton>
          <RedButton className="flex-1" onClick={submit} disabled={isLoading}>
            {isLoading ? "Submitting…" : "Submit Report"}
          </RedButton>
        </div>
      </Sheet>
    </Scrim>
  );
};

/* ── Delete account ───────────────────────────────────────────────────────── */

const DeleteAccountModal = ({ close, showToast }) => {
  const [confirmation, setConfirmation] = useState("");
  const [deleteAccount, { isLoading }] = useDeleteAccountMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const confirmed = confirmation.trim().toUpperCase() === "DELETE";

  const submit = async () => {
    if (!confirmed) return;

    try {
      await deleteAccount({}).unwrap();
      dispatch(logOut());
      navigate(V2.businessLogin, { replace: true });
    } catch {
      showToast?.("Couldn't delete your account just now — please contact support");
    }
  };

  return (
  <Scrim onClose={close}>
    <Sheet width={440} className="p-6 text-center">
      <div className="mx-auto mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#FFF0F0]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#AC4242" strokeWidth="2">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14H6L5 6" />
        </svg>
      </div>
      <div className="mb-2 text-[17px] font-extraboldNunito text-navy-800">
        Delete your TalkAM account?
      </div>
      <div className="mb-[18px] text-left text-[13px] leading-[1.7] text-ink-500">
        Your community posts are anonymised (username replaced with [deleted]). Session
        notes are permanently erased within 30 days. This cannot be undone.
      </div>
      <input
        placeholder="Type DELETE to confirm"
        aria-label="Type DELETE to confirm"
        value={confirmation}
        onChange={(e) => setConfirmation(e.target.value)}
        className="mb-3.5 h-[46px] w-full rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-center text-[13px] text-ink-800"
      />
      <div className="flex gap-2.5">
        <GreyButton className="flex-1" onClick={close}>
          Keep Account
        </GreyButton>
        <RedButton className="flex-1" onClick={submit} disabled={!confirmed || isLoading}>
          {isLoading ? "Deleting…" : "Delete Forever"}
        </RedButton>
      </div>
    </Sheet>
  </Scrim>
  );
};

/* ── Sign out ─────────────────────────────────────────────────────────────── */

const SignOutModal = ({ close }) => {
  const dispatch = useDispatch();

  return (
  <Scrim onClose={close}>
    <Sheet width={380} className="p-6 text-center">
      <div className="mb-2 text-[16px] font-extraboldNunito text-navy-800">
        Sign out of TalkAM?
      </div>
      <div className="mb-5 text-[13px] leading-[1.6] text-ink-500">
        You&apos;ll need your work email and password to sign back in.
      </div>
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={close}
          className="h-11 flex-1 cursor-pointer rounded-[10px] border border-ink-200 bg-surface-page text-[13px] font-boldNunito text-navy-800"
        >
          Stay Signed In
        </button>
        <Link
          to={V2.businessLogin}
          replace
          onClick={() => dispatch(logOut())}
          className="flex h-11 flex-1 items-center justify-center rounded-[10px] bg-navy-800 text-[13px] font-extraboldNunito text-white"
        >
          Sign Out
        </Link>
      </div>
    </Sheet>
  </Scrim>
  );
};

/* ── Two-factor enable ────────────────────────────────────────────────────── */

/**
 * Enabling 2FA (off -> on) requires a fresh email OTP server-side
 * (PrivacySettingService::update). Turning it off never does, so that path
 * skips this modal entirely and saves straight away.
 */
const TwoFactorEnableModal = ({ close, showToast, context }) => {
  const [requestOtp, { isLoading: isSending }] = useRequestOtpV2Mutation();
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const email = context?.email;

  useEffect(() => {
    if (!email) return;
    requestOtp({ type: "login", email }).then(() => setSent(true)).catch(() => {});
  }, [email]); // eslint-disable-line react-hooks/exhaustive-deps

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
    <Scrim onClose={close}>
      <Sheet width={420} className="p-6">
        <div className="mb-1 text-[16px] font-extraboldNunito text-navy-800">
          Turn on two-factor authentication
        </div>
        <div className="mb-[18px] text-[12px] text-ink-400">
          Enter the 6-digit code emailed to {email}
        </div>
        <OtpBoxes value={code} onChange={setCode} disabled={confirming} />
        {error ? <div className="mb-3.5 text-[11.5px] text-[#AC4242]">{error}</div> : null}
        <div className="mb-4 text-[11.5px] text-ink-400">
          {sent ? "A code is on its way. " : ""}
          <button
            type="button"
            onClick={resend}
            disabled={isSending}
            className="cursor-pointer font-boldNunito text-[#017FC8]"
          >
            Resend code
          </button>
        </div>
        <div className="flex gap-2.5">
          <GreyButton className="flex-1" onClick={close}>
            Cancel
          </GreyButton>
          <NavyButton className="flex-1" onClick={confirm} disabled={code.length < 6 || confirming}>
            {confirming ? "Confirming…" : "Confirm & enable"}
          </NavyButton>
        </div>
      </Sheet>
    </Scrim>
  );
};

/* ── Router ───────────────────────────────────────────────────────────────── */

export const EmployeeModals = ({
  modal,
  context,
  close,
  open,
  showToast,
  sessionType,
  setSessionType,
}) => {
  switch (modal) {
    case "reschedule":
      return <RescheduleModal close={close} showToast={showToast} session={context} />;
    case "cancel":
      return <CancelModal close={close} showToast={showToast} session={context} />;
    case "feedback":
      return <FeedbackModal close={close} showToast={showToast} session={context} />;
    case "preSessionMood":
      return <PreSessionMoodModal close={close} open={open} session={context} />;
    case "booking":
      return (
        <BookingModal
          close={close}
          showToast={showToast}
          sessionType={sessionType}
          setSessionType={setSessionType}
        />
      );
    case "capReached":
      return <CapReachedModal close={close} showToast={showToast} />;
    case "inCall":
      return <InCallScreen open={open} sessionType={sessionType} session={context} />;
    case "report":
      return <ReportModal close={close} showToast={showToast} session={context} />;
    case "deleteAccount":
      return <DeleteAccountModal close={close} showToast={showToast} />;
    case "twoFactorEnable":
      return <TwoFactorEnableModal close={close} showToast={showToast} context={context} />;
    case "signout":
      return <SignOutModal close={close} />;
    default:
      return null;
  }
};

export { SmallMoodRow, SESSION_TYPE_META };

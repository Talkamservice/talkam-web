import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { CallScreen } from "../../../../components/v2/callroom";
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
  useInitiatePaymentMutation,
  useSubmitSessionRequestMutation,
  useDeclineMySessionRequestMutation,
  useRequestTopUpMutation,
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

/** A therapist's specialty line — the care-team card's own `focus` string,
 *  or the directory card's `specialties` array joined the same way. */
const therapistFocus = (t) =>
  t?.focus ?? ((t?.specialties ?? []).map((s) => s.name).filter(Boolean).join(" · ") || t?.credential_type || "");

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
      await reschedule({ id: session.id, new_starts_at: slot, reason: "client_request" }).unwrap();
      close();
      showToast(`Reschedule requested — ${session?.therapist_name ?? "your therapist"} needs to confirm it`);
    } catch (err) {
      showToast(apiErrorMessage(err, "Couldn't reschedule just now — please try again"));
    }
  };

  return (
    <Scrim onClose={close}>
      <Sheet width={460}>
        <SheetHeader title="Reschedule session" onClose={close} />
        <div className="flex flex-col gap-3.5 px-6 py-[22px]">
          <div className="text-[12px] leading-[1.6] text-ink-500">
            Currently: {slotLabel(session?.starts_at)} with {session?.therapist_name}. Pick a
            new slot to propose below — your session stays as-is until they confirm it.
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
            Rescheduling more than 24h before your session is free — it just needs your
            therapist to confirm the new time.
          </div>
          <NavyButton onClick={confirm} disabled={!slot || isLoading}>
            {isLoading ? "Sending…" : "Request New Time"}
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
    } catch (err) {
      close();
      showToast(apiErrorMessage(err, "Couldn't cancel just now — please try again"));
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

/* ── Session request (proposed time) ─────────────────────────────────────── */

/** Confirming a therapist's proposed time is just paying for the session
 *  they already created on hold — reuses the same real Flutterwave flow as
 *  BookingModal, scoped to an existing session id instead of a new one. */
const PaySessionRequestModal = ({ close, showToast, context: request }) => {
  const [checkout, setCheckout] = useState(null);
  const [result, setResult] = useState(null);
  const paidRef = useRef(false);
  const [initiatePayment, { isLoading }] = useInitiatePaymentMutation();

  const flwConfig = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_KEY,
    tx_ref: checkout?.reference ?? "",
    amount: checkout?.amount ?? 0,
    currency: checkout?.currency ?? "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: checkout?.customer?.email ?? "",
      name: checkout?.customer?.name ?? "",
    },
    customizations: {
      title: "TalkAM session",
      description: `Session with ${request?.therapist_name ?? "your therapist"}`,
    },
    meta: { ...(checkout?.meta ?? {}) },
  };
  const handleFlutterPayment = useFlutterwave(flwConfig);

  useEffect(() => {
    if (!checkout) return;
    paidRef.current = false;
    handleFlutterPayment({
      callback: (response) => {
        const ok = ["successful", "completed"].includes(response?.status);
        if (ok) {
          paidRef.current = true;
          setResult({ status: "success" });
        }
        closePaymentModal();
      },
      onClose: () => {
        if (paidRef.current) return;
        setResult({ status: "error" });
      },
    });
    setCheckout(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkout]);

  const pay = async () => {
    try {
      const payload = await initiatePayment({ id: request.session_id }).unwrap();
      setCheckout(payload);
    } catch (err) {
      showToast(apiErrorMessage(err, "Couldn't start payment — please try again"));
    }
  };

  useEffect(() => {
    if (request?.session_id) pay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request?.session_id]);

  if (result?.status === "success") {
    return (
      <Scrim onClose={close}>
        <Sheet width={400} className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-wellness-50">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1F8A5B" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="mb-2 text-[17px] font-extraboldNunito text-navy-800">Payment received</div>
          <div className="mb-5 text-[13px] leading-[1.7] text-ink-500">
            Your session with {request?.therapist_name ?? "your therapist"} is confirmed.
          </div>
          <button
            type="button"
            onClick={() => {
              close();
              showToast("Session confirmed");
            }}
            className="h-12 w-full cursor-pointer rounded-[12px] bg-navy-800 text-[14px] font-extraboldNunito text-white"
          >
            Done
          </button>
        </Sheet>
      </Scrim>
    );
  }

  if (result?.status === "error") {
    return (
      <Scrim onClose={close}>
        <Sheet width={400} className="p-6 text-center">
          <div className="mb-2 text-[17px] font-extraboldNunito text-navy-800">Payment didn&apos;t go through</div>
          <div className="mb-5 text-[13px] leading-[1.7] text-ink-500">
            You can try again now, or come back to this from your Sessions page.
          </div>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={close}
              className="h-12 flex-1 cursor-pointer rounded-[12px] border border-ink-200 bg-surface-page text-[13.5px] font-boldNunito text-ink-600"
            >
              Later
            </button>
            <button
              type="button"
              onClick={() => {
                setResult(null);
                pay();
              }}
              disabled={isLoading}
              className="h-12 flex-[1.4] cursor-pointer rounded-[12px] bg-navy-800 text-[13.5px] font-extraboldNunito text-white"
            >
              {isLoading ? "Starting…" : "Try again"}
            </button>
          </div>
        </Sheet>
      </Scrim>
    );
  }

  return (
    <div className="fixed inset-0 z-[600] flex flex-col items-center justify-center gap-3 bg-black/40">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-navy-200 border-t-navy-800" />
      <div className="text-[13px] text-white">Starting payment…</div>
    </div>
  );
};

const DeclineSessionRequestModal = ({ close, showToast, context: request }) => {
  const [decline, { isLoading }] = useDeclineMySessionRequestMutation();

  const confirm = async () => {
    try {
      await decline(request.id).unwrap();
      close();
      showToast("Request declined");
    } catch (err) {
      showToast(apiErrorMessage(err, "Couldn't decline that — please try again"));
    }
  };

  return (
    <Scrim onClose={close}>
      <Sheet width={400} className="p-6 text-center">
        <div className="mb-2 text-[17px] font-extraboldNunito text-navy-800">Decline this time?</div>
        <div className="mb-5 text-[13px] leading-[1.7] text-ink-500">
          {request?.therapist_name ?? "Your therapist"} will be notified. You can send a new
          request any time.
        </div>
        <div className="flex gap-2.5">
          <GreyButton className="flex-1" onClick={close}>Keep looking</GreyButton>
          <RedButton className="flex-1" onClick={confirm} disabled={isLoading}>
            {isLoading ? "Declining…" : "Decline"}
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
      <Sheet width={440}>
        <SheetHeader title="How was your session?" onClose={close} />
        <div className="p-6">
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
        <button
          type="button"
          onClick={close}
          className="mt-3 w-full cursor-pointer text-center text-[12.5px] font-boldNunito text-ink-500"
        >
          Skip for now
        </button>
        </div>
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

const BookingModal = ({ close, open, showToast, sessionType, setSessionType }) => {
  const [type, setType] = useState(sessionType);
  const [slot, setSlot] = useState(null);
  const [error, setError] = useState(null);
  const [requestMode, setRequestMode] = useState(false);
  const [preferredAt, setPreferredAt] = useState("");
  const [note, setNote] = useState("");
  const [submitRequest, { isLoading: isSendingRequest }] = useSubmitSessionRequestMutation();

  const [selectedTherapistId, setSelectedTherapistId] = useState(null);
  const { data: careTeam } = useGetCareTeamQuery();
  const { data: directory } = useGetTherapistsQuery({ per_page: 20 });
  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();

  /* Whoever this member can actually book: their existing care-team
     therapist first (continuity of care), then everyone else the directory
     returns them — for a business-employed member that is scoped server-side
     to their own org's therapists, not the whole public marketplace. */
  const candidates = useMemo(() => {
    const list = [];
    if (careTeam?.therapist) list.push(careTeam.therapist);
    (directory?.data ?? []).forEach((t) => {
      if (!list.some((c) => c.id === t.id)) list.push(t);
    });
    return list;
  }, [careTeam, directory]);

  const suggested = candidates.find((c) => c.id === selectedTherapistId) ?? candidates[0] ?? null;
  const therapistId = suggested?.id;

  const { data: slotData } = useGetTherapistSlotsQuery(
    { id: therapistId },
    { skip: !therapistId }
  );
  const slots = useMemo(() => (slotData?.slots ?? slotData ?? []).slice(0, 6), [slotData]);
  const chosen = slot ?? slots[0]?.starts_at ?? slots[0] ?? null;

  // Business-employed members book through their employer's therapist
  // network (§09 coverage: org_bundle/org_external) — no card payment on
  // this model, but the therapist still reviews every new session before
  // it's real (same as the request/propose flow — see "Requests" tab).
  const confirm = async () => {
    if (!therapistId || !chosen) return;
    setError(null);

    try {
      await createBooking({
        therapist_id: therapistId,
        starts_at: chosen,
        format: type,
      }).unwrap();
      setSessionType(type);
      close();
      showToast(`Booked for ${slotLabel(chosen)} — ${suggested?.name ?? "your therapist"} will confirm shortly`);
    } catch (err) {
      // 400 covers two distinct backend failures the controller maps to the
      // same status: the per-employee cap guard, and "therapist not found"
      // (e.g. a stale id). Only the former should open the cap-reached
      // dialog — checking the message keeps a "not found" from silently
      // being misread as "you're capped".
      if (err?.status === 400 && /sessions allowed this billing cycle/i.test(err?.data?.message ?? "")) {
        open("capReached");
        return;
      }
      setError(apiErrorMessage(err, "Couldn't book that slot — it may have just been taken"));
    }
  };

  const sendRequest = async () => {
    if (!therapistId || !preferredAt) return;
    setError(null);
    try {
      await submitRequest({
        therapist_id: therapistId,
        format: type,
        preferred_at: preferredAt.replace("T", " ") + ":00",
        note: note || undefined,
      }).unwrap();
      close();
      showToast(`Request sent — ${suggested?.name ?? "your therapist"} will get back to you soon`);
    } catch (err) {
      setError(apiErrorMessage(err, "Couldn't send that request — please try again"));
    }
  };

  const chip = (active) =>
    classNames(
      "flex flex-1 cursor-pointer items-center justify-center gap-[7px] rounded-[10px] border-[1.5px] p-[11px] text-[13px] font-boldNunito",
      active ? "border-navy-800 bg-navy-800 text-white" : "border-ink-200 bg-surface-page text-ink-600"
    );

  if (requestMode) {
    return (
      <Scrim onClose={close}>
        <Sheet width={440}>
          <SheetHeader title="Request a session" onClose={close} />
          <div className="flex flex-col gap-4 px-6 py-[22px]">
            <div className="flex items-center gap-3 rounded-[12px] bg-[#F8F9FC] px-3.5 py-3">
              <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-[#017FC8] text-[13px] font-extraboldNunito text-white">
                {initialsOf(suggested?.name ?? "")}
              </span>
              <div>
                <div className="text-[13px] font-boldNunito text-navy-800">
                  {suggested?.name ?? "Your therapist"}
                </div>
                <div className="text-[11px] text-ink-400">
                  No open slot works? Tell them your preferred time instead.
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[12px] font-boldNunito text-ink-600">
                Preferred day &amp; time
              </label>
              <input
                type="datetime-local"
                value={preferredAt}
                onChange={(e) => setPreferredAt(e.target.value)}
                className="w-full rounded-[10px] border-[1.5px] border-ink-200 px-3.5 py-[11px] text-[13px] font-semiboldNunito text-ink-800"
              />
            </div>

            <div>
              <label className="mb-2 block text-[12px] font-boldNunito text-ink-600">
                How would you like to connect?
              </label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setType("video")} className={chip(type === "video")}>
                  Video call
                </button>
                <button type="button" onClick={() => setType("voice")} className={chip(type === "voice")}>
                  Voice call
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[12px] font-boldNunito text-ink-600">
                Note (optional)
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Anything that helps them plan for the session…"
                className="w-full resize-none rounded-[10px] border-[1.5px] border-ink-200 px-3.5 py-3 text-[13px] leading-[1.6] text-ink-800"
              />
            </div>

            {error ? <p className="text-caption text-signal-error">{error}</p> : null}

            <button
              type="button"
              onClick={sendRequest}
              disabled={!therapistId || !preferredAt || isSendingRequest}
              className="h-12 cursor-pointer rounded-[12px] bg-navy-800 text-[14px] font-extraboldNunito text-white disabled:cursor-not-allowed disabled:bg-[#C7CEDA]"
            >
              {isSendingRequest ? "Sending…" : "Send Request"}
            </button>
            <button
              type="button"
              onClick={() => setRequestMode(false)}
              className="cursor-pointer text-center text-[12.5px] font-boldNunito text-ink-500"
            >
              ← Back to available times
            </button>
          </div>
        </Sheet>
      </Scrim>
    );
  }

  // Payment outcome screen — shown once the Flutterwave modal closes, in
  // place of the booking form (the booking itself already exists by then).
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
                {[therapistFocus(suggested), chosen ? slotLabel(chosen) : null].filter(Boolean).join(" · ") ||
                  "Checking availability"}
              </div>
            </div>
          </div>

          {candidates.length > 1 ? (
            <div>
              <span className="mb-2 block text-[12px] font-boldNunito text-ink-600">
                Choose a therapist
              </span>
              <div className="flex flex-col gap-2">
                {candidates.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedTherapistId(c.id);
                      setSlot(null);
                    }}
                    aria-pressed={therapistId === c.id}
                    className={classNames(
                      "flex cursor-pointer items-center gap-3 rounded-[10px] border-[1.5px] px-3 py-2.5 text-left",
                      therapistId === c.id
                        ? "border-navy-800 bg-[#F8F9FC]"
                        : "border-ink-200 bg-white"
                    )}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#017FC8] text-[12px] font-extraboldNunito text-white">
                      {initialsOf(c.name ?? "")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[12.5px] font-boldNunito text-navy-800">{c.name}</div>
                      <div className="truncate text-[11px] text-ink-400">
                        {therapistFocus(c) || "Therapist"}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

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

          {error ? <p className="text-caption text-signal-error">{error}</p> : null}

          <button
            type="button"
            onClick={confirm}
            disabled={!therapistId || !chosen || isBooking}
            className="h-12 cursor-pointer rounded-[12px] bg-navy-800 text-[14px] font-extraboldNunito text-white disabled:cursor-not-allowed disabled:bg-[#C7CEDA]"
          >
            {isBooking ? "Booking…" : "Confirm Session →"}
          </button>
          <button
            type="button"
            onClick={() => setRequestMode(true)}
            disabled={!therapistId}
            className="cursor-pointer text-center text-[12.5px] font-boldNunito text-ink-500 disabled:opacity-50"
          >
            Can&apos;t find a good time? Send a request instead
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
  const [requestTopUp, { isLoading }] = useRequestTopUpMutation();

  const used = bookings?.summary?.employee_cap_used ?? 0;
  // null means uncapped (§ SessionCapService) — never collapse that into a
  // fake "N of N" by falling back to `used`, which would fabricate a limit
  // that was never actually hit.
  const cap = bookings?.summary?.employee_cap ?? null;
  const company = me?.business?.organization?.name ?? "your company";

  const notify = async () => {
    try {
      await requestTopUp().unwrap();
      setRequested(true);
      showToast("Request sent to your admin · confirmation emailed");
    } catch (err) {
      showToast(apiErrorMessage(err, "Couldn't send that just now — please try again"));
    }
  };

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
            {cap !== null ? (
              <>
                You&apos;ve used all <b className="text-navy-800">{used} of {cap}</b> sessions
                allowed at {company} for this billing cycle.
              </>
            ) : (
              <>You&apos;ve reached your session limit at {company} for this billing cycle.</>
            )}{" "}
            To keep booking, ask your admin to raise the cap or top up the session pool.
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
                onClick={notify}
                disabled={isLoading}
                className="h-12 flex-[1.4] cursor-pointer rounded-[12px] bg-navy-800 text-[13.5px] font-extraboldNunito text-white disabled:cursor-not-allowed disabled:bg-[#C7CEDA]"
              >
                {isLoading ? "Sending…" : "Notify admin to top up"}
              </button>
            </div>
          </div>
        )}
      </Sheet>
    </Scrim>
  );
};

/* ── In-call screen ───────────────────────────────────────────────────────── */

const InCallScreen = ({ open, sessionType, session }) => (
  <CallScreen
    bookingId={session?.id}
    format={session?.format ?? sessionType}
    counterpartName={session?.therapist_name ?? ""}
    onExit={() => open("feedback", session)}
  />
);

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
          open={open}
          showToast={showToast}
          sessionType={sessionType}
          setSessionType={setSessionType}
        />
      );
    case "capReached":
      return <CapReachedModal close={close} showToast={showToast} />;
    case "paySessionRequest":
      return <PaySessionRequestModal close={close} showToast={showToast} context={context} />;
    case "declineSessionRequest":
      return <DeclineSessionRequestModal close={close} showToast={showToast} context={context} />;
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

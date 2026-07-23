import { useEffect, useState } from "react";
import classNames from "classnames";
import * as Icon from "react-feather";
import {
  Modal,
  PrimaryButton,
  SecondaryButton,
  InfoStrip,
} from "../../../../components/v2/dashboard/chrome";
import {
  MOODS,
  MOOD_MESSAGES,
  bookingSlots,
  nextSession,
} from "../../../../fakedata/v2/employee";

/** Modals for the employee dashboard. Spec: § MODALS of the employee deck. */

const MoodRow = ({ value, onPick }) => (
  <div className="flex flex-wrap gap-2">
    {MOODS.map((m) => (
      <button
        key={m.key}
        type="button"
        onClick={() => onPick(m.key)}
        aria-pressed={value === m.key}
        className={classNames(
          "flex flex-1 basis-[84px] cursor-pointer flex-col items-center gap-1 rounded-ds-md border-[1.5px] px-2 py-3 transition-colors",
          value === m.key
            ? "border-brand-400 bg-brand-25"
            : "border-ink-200 bg-white hover:bg-ink-50"
        )}
      >
        <span className="text-h2">{m.emoji}</span>
        <span className="text-[11px] font-boldNunito text-ink-600">{m.label}</span>
      </button>
    ))}
  </div>
);

const BookingModal = ({ open, close, showToast }) => {
  const [slot, setSlot] = useState("thu10");
  const [type, setType] = useState("video");

  return (
    <Modal open={open} onClose={close} title="Book a session" subtitle="Dr. Adewale K. · Clinical Psychologist">
      <div className="mb-4">
        <div className="mb-2 text-[11px] font-boldNunito text-ink-400">SESSION TYPE</div>
        <div className="flex gap-2">
          {[
            { key: "video", label: "Video", icon: <Icon.Video size={15} /> },
            { key: "voice", label: "Voice", icon: <Icon.Mic size={15} /> },
            { key: "chat", label: "Chat", icon: <Icon.MessageCircle size={15} /> },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setType(t.key)}
              aria-pressed={type === t.key}
              className={classNames(
                "flex flex-1 cursor-pointer items-center justify-center gap-[7px] rounded-[10px] border-[1.5px] p-[11px] text-[13px] font-boldNunito",
                type === t.key
                  ? "border-navy-800 bg-navy-800 text-white"
                  : "border-ink-200 bg-surface-page text-ink-600"
              )}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 text-[11px] font-boldNunito text-ink-400">AVAILABLE SLOTS</div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {bookingSlots.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSlot(s.key)}
              aria-pressed={slot === s.key}
              className={classNames(
                "cursor-pointer rounded-[10px] border-[1.5px] px-2 py-2.5 text-center",
                slot === s.key ? "border-brand-400 bg-brand-25" : "border-ink-200 bg-white"
              )}
            >
              <div className="text-[11px] text-ink-400">
                {s.day} · {s.date}
              </div>
              <div className="text-[13px] font-boldNunito text-navy-800">{s.time}</div>
            </button>
          ))}
        </div>
      </div>

      <InfoStrip className="mb-4">
        This session draws 1 from your monthly allowance. You have 2 remaining.
      </InfoStrip>

      <div className="flex justify-end gap-2">
        <SecondaryButton onClick={close}>Cancel</SecondaryButton>
        <PrimaryButton
          onClick={() => {
            close();
            showToast("Session booked — you'll get a reminder 24h before");
          }}
        >
          Confirm booking
        </PrimaryButton>
      </div>
    </Modal>
  );
};

const PreSessionMoodModal = ({ open, close, showToast }) => {
  const [mood, setMood] = useState(null);

  return (
    <Modal open={open} onClose={close} title="Before you join" subtitle="A quick check-in — only you and your therapist see this">
      <div className="mb-4">
        <MoodRow value={mood} onPick={setMood} />
        {mood ? (
          <p className="mt-3 rounded-ds-md bg-wellness-50 px-3.5 py-3 text-caption leading-[1.6] text-wellness-600">
            {MOOD_MESSAGES[mood]}
          </p>
        ) : null}
      </div>

      <div className="mb-4 flex flex-col gap-2">
        {[
          "Find a quiet, private space",
          "Headphones if you have them",
          "One or two things you'd like to get to",
        ].map((item) => (
          <div key={item} className="flex items-center gap-2.5 text-[13px] text-ink-600">
            <Icon.Check size={15} className="shrink-0 text-wellness-400" />
            {item}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <SecondaryButton onClick={close}>Not yet</SecondaryButton>
        <PrimaryButton
          disabled={!mood}
          onClick={() => {
            close();
            showToast("Joining your session room…");
          }}
        >
          Join session room →
        </PrimaryButton>
      </div>
    </Modal>
  );
};

const RescheduleModal = ({ open, close, showToast }) => {
  const [slot, setSlot] = useState("fri11");
  return (
    <Modal open={open} onClose={close} title="Reschedule session" subtitle={nextSession.whenRangeLabel}>
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {bookingSlots.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setSlot(s.key)}
            aria-pressed={slot === s.key}
            className={classNames(
              "cursor-pointer rounded-[10px] border-[1.5px] px-2 py-2.5 text-center",
              slot === s.key ? "border-brand-400 bg-brand-25" : "border-ink-200 bg-white"
            )}
          >
            <div className="text-[11px] text-ink-400">
              {s.day} · {s.date}
            </div>
            <div className="text-[13px] font-boldNunito text-navy-800">{s.time}</div>
          </button>
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <SecondaryButton onClick={close}>Keep current time</SecondaryButton>
        <PrimaryButton
          onClick={() => {
            close();
            showToast("Session rescheduled");
          }}
        >
          Reschedule
        </PrimaryButton>
      </div>
    </Modal>
  );
};

const CancelModal = ({ open, close, showToast }) => (
  <Modal open={open} onClose={close} title="Cancel this session?" width="max-w-[440px]">
    <p className="mb-4 text-[13px] leading-[1.7] text-ink-500">
      Your session with {nextSession.therapist} on {nextSession.whenLabel} will be
      cancelled. Cancelling more than 24 hours ahead returns the session to your monthly
      allowance.
    </p>
    <div className="flex justify-end gap-2">
      <SecondaryButton onClick={close}>Keep session</SecondaryButton>
      <button
        type="button"
        onClick={() => {
          close();
          showToast("Session cancelled");
        }}
        className="cursor-pointer rounded-[10px] bg-signal-error px-4 py-[9px] text-[13px] font-boldNunito text-white hover:bg-surface-errorInk"
      >
        Cancel session
      </button>
    </div>
  </Modal>
);

const FeedbackModal = ({ open, close, showToast }) => {
  const [stars, setStars] = useState(4);
  return (
    <Modal open={open} onClose={close} title="How was your session?" subtitle="Your rating is private to TalkAM">
      <div className="mb-4 flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setStars(n)}
            aria-label={`${n} stars`}
            className={classNames(
              "cursor-pointer text-[32px] leading-none transition-colors",
              n <= stars ? "text-gold-400" : "text-ink-200"
            )}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        rows={3}
        placeholder="Anything you'd like to add? (optional)"
        className="mb-4 w-full resize-none rounded-ds-md border-[1.5px] border-ink-200 px-3.5 py-3 text-[13px] text-ink-800"
      />
      <div className="flex justify-end gap-2">
        <SecondaryButton onClick={close}>Skip</SecondaryButton>
        <PrimaryButton
          onClick={() => {
            close();
            showToast("Thanks — your feedback helps");
          }}
        >
          Submit rating
        </PrimaryButton>
      </div>
    </Modal>
  );
};

const CapReachedModal = ({ open, close, showToast }) => (
  <Modal open={open} onClose={close} title="You've used all 6 sessions this cycle" width="max-w-[460px]">
    <InfoStrip tone="gold" className="mb-4">
      New bookings are paused until your allowance resets on 1 Aug, or your admin tops
      up. Any session already scheduled still goes ahead.
    </InfoStrip>
    <p className="mb-4 text-[13px] leading-[1.7] text-ink-500">
      We can let your HR admin know you&apos;d like more sessions. They see the request
      only — never why you asked.
    </p>
    <div className="flex justify-end gap-2">
      <SecondaryButton onClick={close}>Not now</SecondaryButton>
      <PrimaryButton
        onClick={() => {
          close();
          showToast("Request sent to your admin · confirmation emailed");
        }}
      >
        Notify admin to top up
      </PrimaryButton>
    </div>
  </Modal>
);

const ReportModal = ({ open, close, showToast }) => {
  const [reason, setReason] = useState("late");
  const reasons = [
    { key: "late", label: "Therapist was late" },
    { key: "conduct", label: "Unprofessional conduct" },
    { key: "tech", label: "Technical problems" },
    { key: "other", label: "Something else" },
  ];
  return (
    <Modal open={open} onClose={close} title="Report a concern" subtitle="Goes to TalkAM Trust & Safety — never to your employer">
      <div className="mb-4 flex flex-col gap-2">
        {reasons.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setReason(r.key)}
            aria-pressed={reason === r.key}
            className={classNames(
              "cursor-pointer rounded-[10px] border-[1.5px] px-3.5 py-3 text-left text-[13px] font-semiboldNunito",
              reason === r.key
                ? "border-brand-400 bg-brand-25 text-brand-600"
                : "border-ink-200 bg-white text-ink-600"
            )}
          >
            {r.label}
          </button>
        ))}
      </div>
      <textarea
        rows={3}
        placeholder="Tell us what happened (optional)"
        className="mb-4 w-full resize-none rounded-ds-md border-[1.5px] border-ink-200 px-3.5 py-3 text-[13px] text-ink-800"
      />
      <div className="flex justify-end gap-2">
        <SecondaryButton onClick={close}>Cancel</SecondaryButton>
        <PrimaryButton
          onClick={() => {
            close();
            showToast("Report submitted — our team will follow up");
          }}
        >
          Submit report
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export const EmployeeModals = ({ modal, context, close, showToast }) => (
  <>
    <BookingModal open={modal === "booking"} close={close} showToast={showToast} />
    <PreSessionMoodModal open={modal === "preSessionMood"} close={close} showToast={showToast} />
    <RescheduleModal open={modal === "reschedule"} close={close} showToast={showToast} />
    <CancelModal open={modal === "cancel"} close={close} showToast={showToast} />
    <FeedbackModal open={modal === "feedback"} close={close} showToast={showToast} />
    <CapReachedModal open={modal === "capReached"} close={close} showToast={showToast} />
    <ReportModal open={modal === "report"} close={close} showToast={showToast} />
  </>
);

export { MoodRow };

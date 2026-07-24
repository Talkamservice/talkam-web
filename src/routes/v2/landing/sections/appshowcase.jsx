import classNames from "classnames";
import { PhoneFrame } from "../../../../components/v2/frames";
import { DsEyebrow } from "../../../../components/v2/badge";
import {
  therapistPreview,
  sessionPreview,
  moodPreview,
  appShowcaseCaptions,
} from "../../../../constants/marketing/landing";

/**
 * "Inside the app" — three phone instances.
 * Spec: "TalkAM Landing Page.dc.html" § 1C › APP SHOWCASE.
 */

const PhoneCaption = ({ title, body }) => (
  <div className="text-center">
    <h3 className="mb-1 text-[16px] font-extraboldNunito text-navy-800">{title}</h3>
    <p className="mx-auto max-w-[230px] text-[12.5px] leading-[1.5] text-ink-500">{body}</p>
  </div>
);

const FindTherapistPhone = () => (
  <PhoneFrame>
    <div className="border-b border-[#EDEFF3] bg-white px-4 pb-3 pt-4">
      <div className="mb-2 text-[10px] font-boldNunito text-[#9299A8]">9:41</div>
      <div className="text-[16px] font-extraboldNunito text-navy-800">Find a therapist</div>
    </div>
    <div className="flex flex-1 flex-col gap-2.5 p-3">
      <div className="flex flex-wrap gap-1.5">
        {therapistPreview.filters.map((filter) => (
          <span
            key={filter.label}
            className={classNames(
              "rounded-full px-[11px] py-[5px] text-[10px] font-boldNunito",
              filter.active ? "bg-brand-400 text-white" : "bg-[#EEF1F6] text-[#5B6577]"
            )}
          >
            {filter.label}
          </span>
        ))}
      </div>

      {therapistPreview.therapists.map((therapist) => (
        <div
          key={therapist.id}
          className="rounded-[14px] bg-white p-[13px] shadow-[0_1px_3px_rgba(20,27,52,0.05)]"
        >
          <div className={classNames("flex gap-2.5", therapist.primary && "mb-2.5")}>
            <span
              className={classNames("h-11 w-11 shrink-0 rounded-ds-md", therapist.avatar)}
            />
            <div className="flex-1">
              <div className="text-[12.5px] font-extraboldNunito text-navy-800">
                {therapist.name} <span className="text-wellness-400">✓</span>
              </div>
              <div className="text-[10.5px] text-[#9299A8]">{therapist.title}</div>
              <div className="mt-0.5 text-[10.5px] font-boldNunito text-[#C79A3B]">
                ★ {therapist.rating} · {therapist.sessions}
              </div>
            </div>
          </div>
          {therapist.primary ? (
            <button
              type="button"
              className="w-full rounded-[10px] bg-brand-400 py-[9px] text-caption font-extraboldNunito text-white"
            >
              Book a session
            </button>
          ) : null}
        </div>
      ))}
    </div>
  </PhoneFrame>
);

const SessionPhone = () => (
  <PhoneFrame
    className="shadow-[0_40px_80px_rgba(20,27,52,0.3)]"
    screenClassName="!bg-[#0D2240] relative"
  >
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-[linear-gradient(160deg,#017FC8,#0D2240)] p-5">
      <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-white/[0.28] bg-white/[0.14] text-[34px] font-extraboldNunito text-white">
        {sessionPreview.initial}
      </div>
      <div className="text-center">
        <div className="text-[15px] font-extraboldNunito text-white">
          {sessionPreview.therapistName}
        </div>
        <div className="mt-0.5 text-caption text-white/60">{sessionPreview.elapsed}</div>
      </div>
      <div className="absolute inset-x-0 bottom-5 flex justify-center gap-3.5">
        <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-white/[0.16]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          </svg>
        </span>
        <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#E5484D]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.15 4.18 2 2 0 0 1 5 2h3a2 2 0 0 1 2 1.72c.13.98.36 1.94.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91" />
          </svg>
        </span>
        <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-white/[0.16]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" />
          </svg>
        </span>
      </div>
    </div>
  </PhoneFrame>
);

const MoodPhone = () => (
  <PhoneFrame>
    <div className="border-b border-[#EDEFF3] bg-white px-4 pb-3 pt-4">
      <div className="mb-2 text-[10px] font-boldNunito text-[#9299A8]">9:41</div>
      <div className="text-[16px] font-extraboldNunito text-navy-800">How are you today?</div>
    </div>
    <div className="flex flex-1 flex-col gap-3 p-3.5">
      <div className="flex justify-between">
        {moodPreview.moods.map((mood, i) => (
          <span
            key={mood}
            className={classNames(
              "flex h-10 w-10 items-center justify-center rounded-ds-md text-xl",
              i === moodPreview.selectedIndex
                ? "bg-brand-400 shadow-[0_6px_14px_rgba(1,127,200,0.35)]"
                : "bg-[#EEF1F6]"
            )}
          >
            {mood}
          </span>
        ))}
      </div>

      <div className="rounded-[14px] bg-white p-3.5 shadow-[0_1px_3px_rgba(20,27,52,0.05)]">
        <div className="mb-2.5 text-[11px] font-extraboldNunito text-navy-800">This week</div>
        <div className="flex h-[70px] items-end gap-1.5">
          {moodPreview.week.map((bar, i) => (
            <span
              key={i}
              className={classNames("flex-1 rounded-t-[4px]", bar.color)}
              style={{ height: `${bar.height}%` }}
            />
          ))}
        </div>
      </div>

      <div className="rounded-ds-md bg-wellness-50 p-3 text-[11.5px] leading-[1.5] text-wellness-600">
        {moodPreview.streakNote}
      </div>
    </div>
  </PhoneFrame>
);

export const AppShowcase = () => (
  <section id="app" className="scroll-mt-20 bg-white px-6 py-16 lg:px-14 lg:py-[88px]">
    <div className="mx-auto max-w-[1440px]">
      <div className="v2-reveal mb-2 text-center">
        <DsEyebrow className="text-brand-400">Inside the app</DsEyebrow>
      </div>
      <h2 className="v2-reveal mb-2 text-center text-[30px] font-extraboldNunito tracking-[-0.01em] text-navy-800 lg:text-[38px]">
        Everything, in your pocket.
      </h2>
      <p className="mx-auto mb-10 max-w-[560px] text-center text-[15px] leading-[1.6] text-ink-500 lg:mb-[52px]">
        From community conversations to booking a licensed therapist — the whole
        experience lives in one beautifully simple app.
      </p>

      <div className="flex flex-wrap items-start justify-center gap-9">
        <div className="v2-reveal flex max-w-[280px] flex-col items-center gap-4">
          <FindTherapistPhone />
          <PhoneCaption {...appShowcaseCaptions[0]} />
        </div>
        <div className="v2-reveal flex max-w-[280px] flex-col items-center gap-4 lg:-mt-6">
          <SessionPhone />
          <PhoneCaption {...appShowcaseCaptions[1]} />
        </div>
        <div className="v2-reveal flex max-w-[280px] flex-col items-center gap-4">
          <MoodPhone />
          <PhoneCaption {...appShowcaseCaptions[2]} />
        </div>
      </div>
    </div>
  </section>
);

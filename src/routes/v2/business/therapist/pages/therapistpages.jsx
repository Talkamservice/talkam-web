import { useState } from "react";
import classNames from "classnames";
import * as Icon from "react-feather";
import {
  Card,
  PanelCard,
  Badge,
  SecondaryButton,
} from "../../../../../components/v2/dashboard/chrome";
import { DsAccordion } from "../../../../../components/v2/accordion";
import { useTherapist } from "../therapistlayout";
import { Link } from "react-router-dom";
import { V2 } from "../../../../../constants/v2routes";
import {
  onboardingChecklist,
  CHECKLIST_TONE,
  followups,
  homeStats,
  todaySchedule,
  continuity,
  homeNextSession,
  homeLatestReview,
  selfCareSessions,
  analyticsRangeOpts,
  analyticsKpis,
  sessionBarsRaw,
  topClientTopics,
  outcomeTrendRaw,
  ratingBreakdown,
  busiestSlots,
  therapistProfile,
  therapistNotifRows,
  upcomingSessions,
  pastSessions,
  sessionRequests,
  WEEK_DAYS,
  initialDays,
  initialSlots,
  CANDIDATE_TIMES,
  earnings,
  therapistMessageThreads,
  therapistFaqs,
} from "../../../../../fakedata/v2/therapist";

/** All eight therapist dashboard pages. */

const TealButton = ({ className, children, ...props }) => (
  <button
    type="button"
    className={classNames(
      "inline-flex cursor-pointer items-center gap-[7px] rounded-[10px] bg-wellness-400 px-4 py-[9px]",
      "text-[13px] font-boldNunito text-white transition-colors hover:bg-wellness-600",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

/* ── HOME ─────────────────────────────────────────────────────────────── */

export const TherapistHome = () => {
  const { open, resolved } = useTherapist();
  const [slide, setSlide] = useState(0);
  const [checklistOpen, setChecklistOpen] = useState(true);
  const outstanding = followups.filter((f) => !resolved.includes(f.key));
  const item = onboardingChecklist.items[slide];
  const tone = CHECKLIST_TONE[item.tone];
  const last = slide === onboardingChecklist.items.length - 1;

  return (
    <>
      {/* greeting + V2 pill */}
      <div>
        <div className="mb-[3px] flex flex-wrap items-center gap-2.5">
          <span className="text-[20px] font-blackNunito tracking-[-0.01em] text-navy-800">
            Good morning, Dr. Okafor
          </span>
          <span className="inline-flex items-center gap-[5px] rounded-full bg-[linear-gradient(135deg,#6B44A8,#8B5FC2)] px-2.5 py-1 text-[10px] font-extraboldNunito tracking-[0.05em] text-white shadow-[0_3px_8px_rgba(107,68,168,0.3)]">
            <span className="h-[5px] w-[5px] rounded-full bg-white" />
            V2 PREVIEW
          </span>
        </div>
        <div className="text-[13px] text-ink-400">
          You have 3 sessions today · next one starts soon
        </div>
      </div>

      {/* getting-started carousel */}
      {checklistOpen ? (
        <div className="relative overflow-hidden rounded-[18px] border border-[#E0D3F5] bg-[linear-gradient(135deg,#F3EEFB,#EEF4FC)] px-[22px] py-5">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-5 -top-[30px] h-[150px] w-[150px] rounded-full bg-[radial-gradient(circle,rgba(107,68,168,0.12)_0%,transparent_68%)]"
          />
          <div className="relative z-[1]">
            <div className="mb-4 flex items-start justify-between gap-3.5">
              <div className="flex gap-[13px]">
                <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#6B44A8,#8B5FC2)] shadow-[0_6px_14px_rgba(107,68,168,0.28)]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </span>
                <div>
                  <div className="text-[15px] font-blackNunito tracking-[-0.01em] text-navy-800">
                    {onboardingChecklist.title}
                  </div>
                  <div className="max-w-[520px] text-[12px] leading-[1.5] text-[#6A5A85]">
                    {onboardingChecklist.subtitle}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setChecklistOpen(false)}
                title="Dismiss"
                aria-label="Dismiss"
                className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-[8px] bg-[rgba(107,68,168,0.1)]"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B44A8" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="p-0.5">
              <div className="relative flex min-h-[150px] flex-col overflow-hidden rounded-[14px] border border-[#EBE3F7] bg-white px-6 py-[22px] shadow-[0_8px_22px_rgba(107,68,168,0.10)]">
                <span className="absolute right-5 top-3.5 text-[34px] font-blackNunito leading-none tracking-[-0.02em] text-[rgba(107,68,168,0.09)]">
                  {`0${slide + 1}`}
                </span>
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="rounded-full px-[9px] py-[3px] text-[9.5px] font-extraboldNunito tracking-[0.05em]"
                    style={{ background: tone.bg, color: tone.fg }}
                  >
                    {tone.label}
                  </span>
                </div>
                <div className="mb-[9px] max-w-[90%] text-[18px] font-blackNunito leading-[1.3] tracking-[-0.01em] text-navy-800">
                  {item.title}
                </div>
                <div className="max-w-[94%] text-[13px] leading-[1.62] text-[#5B5B6B]">
                  {item.sub}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3.5">
              <button
                type="button"
                onClick={() => setSlide((i) => Math.max(0, i - 1))}
                aria-label="Previous"
                className={classNames(
                  "flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] border border-[#E0D3F5] bg-white",
                  slide === 0
                    ? "cursor-not-allowed text-[#C9BEDE] opacity-55"
                    : "cursor-pointer text-[#6B44A8]"
                )}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <div className="flex items-center gap-[7px]">
                {onboardingChecklist.items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Slide ${i + 1}`}
                    onClick={() => setSlide(i)}
                    className={classNames(
                      "h-2 cursor-pointer rounded-full transition-all",
                      i === slide ? "w-[22px] bg-[#6B44A8]" : "w-2 bg-[rgba(107,68,168,0.25)]"
                    )}
                  />
                ))}
              </div>
              {last ? (
                <button
                  type="button"
                  onClick={() => setChecklistOpen(false)}
                  className="flex cursor-pointer items-center gap-[7px] whitespace-nowrap rounded-[10px] bg-[linear-gradient(135deg,#6B44A8,#8B5FC2)] px-4 py-[9px] text-[12.5px] font-extraboldNunito text-white shadow-[0_6px_14px_rgba(107,68,168,0.28)]"
                >
                  Got it
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setSlide((i) => i + 1)}
                  className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-[10px] bg-navy-800 px-4 py-[9px] text-[12.5px] font-extraboldNunito text-white"
                >
                  Next
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* next session hero + follow-ups */}
      <div className="grid items-stretch gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="relative flex flex-col overflow-hidden rounded-[18px] border border-[#1E2D5A] bg-[linear-gradient(135deg,#0F1E3D,#17305C)] p-[22px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-[200px] w-[200px] rounded-full bg-[radial-gradient(circle,rgba(1,127,200,0.28)_0%,transparent_65%)]"
          />
          <div className="relative z-[1] mb-4 flex items-center justify-between gap-3">
            <span className="text-[11px] font-extraboldNunito tracking-[0.1em] text-brand-200">
              UP NEXT
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.15] bg-white/10 px-[11px] py-[5px] text-[11px] font-boldNunito text-white">
              <span className="v2-live-dot h-1.5 w-1.5 rounded-full bg-[#3BA88F]" />
              Starts in {homeNextSession.countdown}
            </span>
          </div>
          <div className="relative z-[1] mb-4 flex flex-wrap items-center gap-3.5">
            <span
              className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[15px] text-[18px] font-extraboldNunito text-white shadow-[0_6px_16px_rgba(0,0,0,0.25)]"
              style={{ background: homeNextSession.avatarBg }}
            >
              {homeNextSession.initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[18px] font-extraboldNunito text-white">
                {homeNextSession.name}
              </div>
              <div className="text-[12px] text-white/55">
                {homeNextSession.sessionNo} · {homeNextSession.time} · {homeNextSession.format}
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-[rgba(1,127,200,0.25)] px-[11px] py-[5px] text-[11px] font-boldNunito text-[#9BD0F0]">
              {homeNextSession.focus}
            </span>
          </div>
          <div className="relative z-[1] mb-4 rounded-[12px] border border-white/[0.09] bg-white/[0.06] px-3.5 py-3">
            <div className="mb-[5px] text-[10px] font-boldNunito tracking-[0.06em] text-white/40">
              FROM YOUR LAST SESSION
            </div>
            <div className="text-[12.5px] leading-[1.55] text-white/80">
              {homeNextSession.lastNote}
            </div>
          </div>
          <div className="relative z-[1] mt-auto flex gap-2.5">
            <button
              type="button"
              onClick={() => open("joinConfirm", homeNextSession)}
              className="flex-1 cursor-pointer rounded-[11px] bg-brand-400 p-3 text-center text-[13px] font-extraboldNunito text-white shadow-[0_6px_16px_rgba(1,127,200,0.35)]"
            >
              Join Session →
            </button>
            <Link
              to={`${V2.therapist}/messages`}
              className="cursor-pointer rounded-[11px] border border-white/[0.16] bg-white/10 px-4 py-3 text-[13px] font-boldNunito text-white"
            >
              Message
            </Link>
          </div>
        </div>

        <div>
          <div className="mb-3 text-[13px] font-extraboldNunito text-navy-800">
            Needs your attention
          </div>
          {outstanding.length ? (
            <div className="flex flex-col gap-2.5">
              {outstanding.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => open(f.key === "messages" ? "inbox" : f.key)}
                  style={{ borderLeftColor: f.accent }}
                  className="flex cursor-pointer items-center gap-3 rounded-[12px] border border-surface-line border-l-[3px] bg-white px-[15px] py-[13px] text-left"
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] text-[13px] font-extraboldNunito"
                    style={{ background: f.tint, color: f.stroke }}
                  >
                    {f.count}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12.5px] font-extraboldNunito text-navy-800">
                      {f.title}
                    </span>
                    <span className="block text-[11px] leading-[1.4] text-ink-400">{f.sub}</span>
                  </span>
                  <span
                    className="shrink-0 text-[11px] font-boldNunito"
                    style={{ color: f.accent }}
                  >
                    {f.cta} →
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-[12px] border border-[#BFE6DC] bg-wellness-50 p-5 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F8A5B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <div className="text-[13px] font-extraboldNunito text-wellness-600">
                You&apos;re all caught up
              </div>
              <div className="text-[11.5px] leading-[1.5] text-[#3E7A6B]">
                No pending notes, requests, or unread messages. Nice work.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* stats with deltas */}
      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {homeStats.map((st) => (
          <Card key={st.label}>
            <span
              className="mb-3.5 flex h-[38px] w-[38px] items-center justify-center rounded-[11px]"
              style={{ background: st.tint }}
            >
              <StatIcon name={st.icon} stroke={st.stroke} />
            </span>
            <div className="mb-[3px] text-[28px] font-blackNunito text-navy-800">{st.value}</div>
            <div className="mb-2 text-[12px] text-ink-400">{st.label}</div>
            <div className="text-[11px] font-boldNunito" style={{ color: st.deltaColor }}>
              {st.delta}
            </div>
          </Card>
        ))}
        <Link
          to={`${V2.therapist}/availability`}
          className="relative overflow-hidden rounded-ds-lg border border-navy-600 bg-[linear-gradient(135deg,#141B34,#1A2E5A)] p-5"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-[15px] -top-[15px] h-[100px] w-[100px] rounded-full bg-[radial-gradient(circle,rgba(219,182,110,0.18)_0%,transparent_65%)]"
          />
          <span className="relative z-[1] mb-1.5 block text-[11px] text-white/45">
            6 open slots this week
          </span>
          <span className="relative z-[1] block text-[18px] font-blackNunito leading-[1.3] text-white">
            Manage availability →
          </span>
        </Link>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="mb-3.5 text-[13px] font-extraboldNunito text-navy-800">
            Today&apos;s schedule · Wednesday, Jul 8
          </div>
          <div className="overflow-hidden rounded-ds-lg border border-surface-line bg-white">
            {todaySchedule.map((s) => (
              <div
                key={s.time}
                className="flex flex-wrap items-center gap-3.5 border-b border-[#F5F5F5] px-5 py-3.5"
              >
                <div className="w-14 shrink-0 text-[12px] font-boldNunito text-brand-400">
                  {s.time}
                </div>
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-extraboldNunito text-white"
                  style={{ background: s.avatarBg }}
                >
                  {s.initials}
                </span>
                <div className="min-w-[120px] flex-1">
                  <div className="text-[13px] font-boldNunito text-ink-800">{s.name}</div>
                  <div className="text-[11px] text-ink-400">{s.format}</div>
                </div>
                <span
                  className={classNames(
                    "rounded-full px-[9px] py-[3px] text-[11px] font-boldNunito",
                    s.status === "Confirmed"
                      ? "bg-[#EEF4FC] text-brand-600"
                      : "bg-gold-50 text-gold-600"
                  )}
                >
                  {s.status}
                </span>
                {s.status === "Confirmed" ? (
                  <button
                    type="button"
                    onClick={() => open("joinConfirm", s)}
                    className="ml-2.5 cursor-pointer rounded-[8px] bg-brand-400 px-3 py-[7px] text-[11.5px] font-boldNunito text-white"
                  >
                    Join Session
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3.5 text-[13px] font-extraboldNunito text-navy-800">
            Coming up · continuity of care
          </div>
          <div className="overflow-hidden rounded-ds-lg border border-surface-line bg-white">
            {continuity.map((c) => (
              <div key={c.name} className="border-b border-[#F5F5F5] px-4 py-[13px]">
                <div className="mb-2 flex items-center gap-2.5">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-extraboldNunito text-white"
                    style={{ background: c.avatarBg }}
                  >
                    {c.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] font-boldNunito text-ink-800">{c.name}</div>
                    <div className="text-[10.5px] text-ink-400">{c.when}</div>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#EEF4FC] px-[9px] py-[3px] text-[10px] font-boldNunito text-brand-600">
                    {c.tag}
                  </span>
                </div>
                <div className="pl-[42px] text-[11.5px] leading-[1.5] text-[#5B6577]">
                  {c.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* review + self-care */}
      <div className="grid items-stretch gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[13px] font-extraboldNunito text-navy-800">Latest review</div>
            <Link
              to={`${V2.therapist}/profile`}
              className="text-[12px] font-boldNunito text-brand-400"
            >
              All reviews →
            </Link>
          </div>
          <div className="text-[15px] tracking-[2px] text-gold-400">★★★★★</div>
          <div className="text-[14px] italic leading-[1.6] text-[#3E4A52]">
            &quot;{homeLatestReview.quote}&quot;
          </div>
          <div className="text-[11.5px] font-semiboldNunito text-ink-400">
            — {homeLatestReview.author} · {homeLatestReview.when}
          </div>
        </Card>
        <div className="flex flex-col justify-center gap-2 rounded-ds-lg border border-[#BFE6DC] bg-wellness-50 p-[18px]">
          <div className="flex items-center gap-[9px]">
            <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-white">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1F8A5B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </span>
            <div className="text-[13px] font-extraboldNunito text-wellness-600">
              A note on your own wellbeing
            </div>
          </div>
          <div className="text-[12px] leading-[1.6] text-[#3E7A6B]">
            You&apos;ve held <strong className="font-boldNunito">{selfCareSessions} sessions</strong> this
            week. Holding space for others is demanding — remember to block a break for
            yourself too.
          </div>
        </div>
      </div>
    </>
  );
};

/** Deck: `_icon` — the three home stat glyphs. */
const StatIcon = ({ name, stroke }) => {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth: 2 };
  if (name === "star")
    return (
      <svg {...common}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  if (name === "users")
    return (
      <svg {...common}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      </svg>
    );
  return (
    <svg {...common}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
};


/* ── SESSIONS ─────────────────────────────────────────────────────────── */

export const TherapistSessions = () => {
  const { open, resolved } = useTherapist();
  const [tab, setTab] = useState("upcoming");
  const [notesSaved, setNotesSaved] = useState([]);

  const tabs = [
    { key: "upcoming", label: "Upcoming", count: upcomingSessions.length },
    { key: "past", label: "Past", count: pastSessions.length },
    { key: "requests", label: "Requests", count: sessionRequests.length },
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {[
          { label: "Today", value: "3" },
          { label: "This week", value: "23" },
          { label: "Notes due", value: "2", tone: "text-signal-error" },
          { label: "Requests", value: String(sessionRequests.length) },
        ].map((s) => (
          <Card key={s.label}>
            <div className={classNames("text-h2 font-extraboldNunito", s.tone || "text-navy-800")}>
              {s.value}
            </div>
            <div className="text-[11px] text-ink-400">{s.label}</div>
          </Card>
        ))}
      </div>

      <div className="flex w-fit max-w-full gap-1.5 overflow-x-auto rounded-[11px] border border-surface-line bg-white p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            aria-pressed={tab === t.key}
            className={classNames(
              "whitespace-nowrap rounded-[8px] px-3.5 py-2 text-[13px] font-boldNunito",
              tab === t.key ? "bg-wellness-400 text-white" : "cursor-pointer text-ink-500"
            )}
          >
            {t.label} · {t.count}
          </button>
        ))}
      </div>

      <PanelCard>
        {tab === "upcoming" &&
          upcomingSessions.map((s) => (
            <div
              key={s.id}
              className="flex flex-wrap items-center gap-3 border-b border-[#F5F5F5] px-5 py-4 last:border-b-0"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] text-[13px] font-extraboldNunito text-white"
                style={{ background: s.avatarBg }}
              >
                {s.initials}
              </span>
              <div className="min-w-[180px] flex-1">
                <div className="text-[13px] font-boldNunito text-navy-800">{s.client}</div>
                <div className="text-[11px] text-ink-400">
                  {s.when} · {s.number}
                </div>
              </div>
              <Badge tone="green">{s.focus}</Badge>
              <Badge tone="blue">{s.format}</Badge>
              <div className="flex gap-2">
                <SecondaryButton onClick={() => open("rescheduleReq")}>
                  Reschedule
                </SecondaryButton>
                <TealButton onClick={() => open("joinConfirm", s)}>Join</TealButton>
              </div>
            </div>
          ))}

        {tab === "past" &&
          pastSessions.map((s) => {
            const done = s.notesSaved || notesSaved.includes(s.id) || resolved.includes("notes");
            return (
              <div
                key={s.id}
                className="flex flex-wrap items-center gap-3 border-b border-[#F5F5F5] px-5 py-4 last:border-b-0"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] text-[13px] font-extraboldNunito text-white"
                  style={{ background: s.avatarBg }}
                >
                  {s.initials}
                </span>
                <div className="min-w-[180px] flex-1">
                  <div className="text-[13px] font-boldNunito text-navy-800">{s.client}</div>
                  <div className="text-[11px] text-ink-400">
                    {s.when} · {s.focus}
                  </div>
                </div>
                {done ? (
                  <Badge tone="green" dot>
                    Notes saved
                  </Badge>
                ) : (
                  <SecondaryButton
                    onClick={() => {
                      setNotesSaved((p) => [...p, s.id]);
                      open("notes");
                    }}
                  >
                    Write notes
                  </SecondaryButton>
                )}
              </div>
            );
          })}

        {tab === "requests" &&
          (sessionRequests.length ? (
            sessionRequests.map((r) => (
              <div key={r.id} className="border-b border-[#F5F5F5] px-5 py-4 last:border-b-0">
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] text-[13px] font-extraboldNunito text-white"
                    style={{ background: r.avatarBg }}
                  >
                    {r.initials}
                  </span>
                  <div className="min-w-[180px] flex-1">
                    <div className="text-[13px] font-boldNunito text-navy-800">{r.client}</div>
                    <div className="text-[11px] text-ink-400">Requested {r.requested}</div>
                  </div>
                  <Badge tone="purple">{r.focus}</Badge>
                </div>
                <p className="mb-3 text-[12.5px] leading-[1.6] text-ink-500">{r.context}</p>
                <div className="flex gap-2">
                  <TealButton onClick={() => open("request", r)}>Accept &amp; schedule</TealButton>
                  <SecondaryButton onClick={() => open("request", r)}>Decline</SecondaryButton>
                </div>
              </div>
            ))
          ) : (
            <div className="px-5 py-10 text-center">
              <div className="text-body font-extraboldNunito text-navy-800">No requests</div>
              <p className="text-caption text-ink-400">New client requests will appear here.</p>
            </div>
          ))}
      </PanelCard>
    </>
  );
};

/* ── AVAILABILITY ─────────────────────────────────────────────────────── */

export const TherapistAvailability = () => {
  const [days, setDays] = useState(initialDays);
  const [slots, setSlots] = useState(initialSlots);
  const [blocked, setBlocked] = useState(["Dec 25, 2026", "Jan 1, 2027"]);

  const addSlot = (key) => {
    const taken = slots[key] || [];
    const next = CANDIDATE_TIMES.find((t) => !taken.includes(t));
    if (next) setSlots((p) => ({ ...p, [key]: [...taken, next] }));
  };

  return (
    <>
      <div className="flex items-center gap-2.5 rounded-[12px] border border-[#C9E2F9] bg-[#EEF4FC] px-4 py-3">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#015C94" strokeWidth="2" className="shrink-0">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span className="text-[12px] leading-[1.5] text-brand-600">
          Slots are fixed at 50 minutes with a 10-minute buffer, shown to clients in WAT.
          Editing availability never cancels a confirmed booking — you&apos;ll see a
          conflict warning instead.
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {WEEK_DAYS.map((d) => {
          const active = days[d.key];
          const daySlots = slots[d.key] || [];
          return (
            <div
              key={d.key}
              className="rounded-[14px] border-[1.5px] border-surface-line bg-white px-[18px] py-4"
            >
              <div
                className={classNames(
                  "flex items-center justify-between gap-3",
                  active && "mb-3.5"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={classNames(
                      "text-body font-extraboldNunito",
                      active ? "text-navy-800" : "text-surface-muted"
                    )}
                  >
                    {d.label}
                  </span>
                  {active ? (
                    <span className="rounded-full bg-[#EEF4FC] px-[9px] py-[3px] text-[10px] font-boldNunito text-brand-600">
                      {daySlots.length} slots
                    </span>
                  ) : null}
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={active}
                  aria-label={d.label}
                  onClick={() => setDays((p) => ({ ...p, [d.key]: !p[d.key] }))}
                  className={classNames(
                    "relative h-[22px] w-10 shrink-0 cursor-pointer rounded-full transition-colors",
                    active ? "bg-brand-400" : "bg-ink-200"
                  )}
                >
                  <span
                    className={classNames(
                      "absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.15)] transition-all",
                      active ? "left-5" : "left-0.5"
                    )}
                  />
                </button>
              </div>

              {active ? (
                <div className="flex flex-wrap gap-2">
                  {daySlots.map((label) => (
                    <span
                      key={label}
                      className="flex items-center gap-2 rounded-full border-[1.5px] border-ink-200 bg-[#F8F9FC] py-[7px] pl-3.5 pr-2"
                    >
                      <span className="text-[12px] font-semiboldNunito text-ink-800">{label}</span>
                      <button
                        type="button"
                        aria-label={`Remove ${label}`}
                        onClick={() =>
                          setSlots((p) => ({
                            ...p,
                            [d.key]: p[d.key].filter((x) => x !== label),
                          }))
                        }
                        className="flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-full bg-ink-100"
                      >
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#858585" strokeWidth="3">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => addSlot(d.key)}
                    className="flex cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] border-dashed border-brand-400 bg-[#EEF4FC] px-3.5 py-[7px]"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#015C94" strokeWidth="3" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span className="text-[12px] font-boldNunito text-brand-600">Add slot</span>
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <Card>
        <div className="mb-1 text-body font-extraboldNunito text-navy-800">
          Block specific dates
        </div>
        <div className="mb-3.5 text-[12px] text-ink-400">
          Holidays or days off — overrides your recurring weekly pattern
        </div>
        <div className="mb-3.5 flex flex-wrap gap-2">
          {blocked.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setBlocked((p) => p.filter((x) => x !== d))}
              className="cursor-pointer rounded-full bg-[#F5F0FF] px-3.5 py-[7px] text-[12px] font-boldNunito text-[#6B44A8]"
            >
              {d} ✕
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2.5">
          <input
            type="date"
            aria-label="Date to block"
            className="h-[42px] rounded-[10px] border-[1.5px] border-ink-200 px-3 text-[13px] text-ink-600"
          />
          <button
            type="button"
            className="cursor-pointer rounded-[10px] bg-navy-800 px-[18px] text-[13px] font-boldNunito text-white"
          >
            Block Date
          </button>
        </div>
      </Card>
    </>
  );
};


export const TherapistAnalytics = () => {
  const [range, setRange] = useState("12w");

  const outcomePts = outcomeTrendRaw
    .map((v, i) => `${(i / (outcomeTrendRaw.length - 1)) * 100},${100 - ((v - 50) / 40) * 100}`)
    .join(" ");

  return (
    <>
      {/* header + range + V2 pill */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-[16px] font-blackNunito tracking-[-0.01em] text-navy-800">
            Your practice at a glance
          </span>
          <span className="inline-flex items-center gap-[5px] rounded-full bg-[linear-gradient(135deg,#6B44A8,#8B5FC2)] px-2.5 py-1 text-[10px] font-extraboldNunito tracking-[0.05em] text-white shadow-[0_3px_8px_rgba(107,68,168,0.3)]">
            <span className="h-[5px] w-[5px] rounded-full bg-white" />
            V2 PREVIEW
          </span>
        </div>
        <div className="flex gap-0.5 rounded-[11px] bg-[#F0F1F5] p-[3px]">
          {analyticsRangeOpts.map((o) => (
            <button
              key={o.key}
              type="button"
              onClick={() => setRange(o.key)}
              aria-pressed={range === o.key}
              className={classNames(
                "cursor-pointer rounded-[9px] px-3.5 py-1.5 text-[12px] font-boldNunito",
                range === o.key ? "bg-brand-400 text-white" : "text-ink-400"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI grid (8) */}
      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {analyticsKpis.map((k) => (
          <Card key={k.label}>
            <div className="mb-2 text-[11px] font-boldNunito tracking-[0.06em] text-ink-400">
              {k.label}
            </div>
            <div className="text-[26px] font-blackNunito text-navy-800">{k.value}</div>
            <div className="mt-1 text-[11px]" style={{ color: k.subColor }}>
              {k.sub}
            </div>
          </Card>
        ))}
      </div>

      {/* sessions per week + top topics */}
      <div className="grid gap-3.5 xl:grid-cols-[2fr_1fr]">
        <Card>
          <div className="mb-[3px] text-body font-extraboldNunito text-navy-800">
            Sessions per week
          </div>
          <div className="mb-[18px] text-[11px] text-ink-400">
            Trending up — most recent week highlighted
          </div>
          <div className="flex h-[110px] items-end gap-1.5">
            {sessionBarsRaw.map((v, i) => (
              <div key={i} className="flex h-full flex-1 items-end">
                <div
                  className="w-full rounded-t-[3px]"
                  style={{
                    height: `${v * 11}%`,
                    background: i === sessionBarsRaw.length - 1 ? "#017FC8" : "#C9E2F9",
                  }}
                />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-[3px] text-body font-extraboldNunito text-navy-800">
            Top client topics
          </div>
          <div className="mb-4 text-[11px] text-ink-400">Aggregated, not clinical detail</div>
          <div className="flex flex-col gap-[11px]">
            {topClientTopics.map((t) => (
              <div key={t.label}>
                <div className="mb-[5px] flex justify-between gap-3">
                  <span className="text-[12px] font-semiboldNunito text-ink-800">{t.label}</span>
                  <span className="text-[12px] font-boldNunito" style={{ color: t.color }}>
                    {t.pct}%
                  </span>
                </div>
                <div className="h-[5px] rounded-[3px] bg-ink-100">
                  <div
                    className="h-[5px] rounded-[3px]"
                    style={{ width: `${t.pct}%`, background: t.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* client outcomes + rating breakdown */}
      <div className="grid gap-3.5 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <div className="mb-[3px] flex items-center justify-between gap-3">
            <div className="text-body font-extraboldNunito text-navy-800">Client outcomes</div>
            <span className="rounded-full bg-wellness-25 px-[9px] py-[3px] text-[10px] font-boldNunito text-wellness-600">
              ▲ 21 pts
            </span>
          </div>
          <div className="mb-4 text-[11px] text-ink-400">
            Average self-reported wellbeing across clients (anonymous, aggregate)
          </div>
          <div className="relative h-[120px]">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
              <defs>
                <linearGradient id="outcomeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3BA88F" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#3BA88F" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon points={`0,100 ${outcomePts} 100,100`} fill="url(#outcomeFill)" />
              <polyline
                points={outcomePts}
                fill="none"
                stroke="#3BA88F"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-ink-300">
            <span>12 wks ago</span>
            <span>Now</span>
          </div>
        </Card>

        <Card>
          <div className="mb-[3px] text-body font-extraboldNunito text-navy-800">
            Rating breakdown
          </div>
          <div className="mb-4 text-[11px] text-ink-400">58 reviews · 4.9 average</div>
          <div className="flex flex-col gap-2.5">
            {ratingBreakdown.map((r) => (
              <div key={r.stars} className="flex items-center gap-2.5">
                <span className="w-[22px] text-[11px] font-boldNunito text-ink-400">
                  {r.stars}
                </span>
                <div className="h-[7px] flex-1 rounded-[4px] bg-ink-100">
                  <div
                    className="h-[7px] rounded-[4px]"
                    style={{ width: `${r.pct}%`, background: r.bar }}
                  />
                </div>
                <span className="w-5 text-right text-[11px] font-boldNunito text-ink-800">
                  {r.count}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* busiest times */}
      <Card>
        <div className="mb-[3px] text-body font-extraboldNunito text-navy-800">
          When you&apos;re busiest
        </div>
        <div className="mb-[18px] text-[11px] text-ink-400">
          Booking load by day — use it to plan your open slots
        </div>
        <div className="flex h-[90px] items-end gap-3">
          {busiestSlots.map((s) => (
            <div key={s.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t-[4px]"
                  style={{
                    height: `${s.load}%`,
                    background:
                      s.load >= 90 ? "#017FC8" : s.load >= 60 ? "#68B4E1" : "#C9E2F9",
                  }}
                />
              </div>
              <span className="text-[11px] font-boldNunito text-ink-400">{s.day}</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};


export const TherapistEarnings = () => {
  const { open, showToast } = useTherapist();

  return (
    <>
      <div className="relative overflow-hidden rounded-ds-lg bg-[linear-gradient(120deg,#124034,#3BA88F)] p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-8 h-[180px] w-[180px] rounded-full bg-white/10"
        />
        <div className="relative z-[1]">
          <div className="text-[10px] font-extraboldNunito tracking-[0.06em] text-white/70">
            AVAILABLE BALANCE
          </div>
          <div className="mt-1 text-[34px] font-extraboldNunito text-white">
            {earnings.balance}
          </div>
          <div className="mt-1 text-[12px] text-white/80">{earnings.payoutNote}</div>
        </div>
      </div>

      <div className="grid gap-3.5 lg:grid-cols-3">
        {[
          { label: "THIS MONTH", value: earnings.thisMonth },
          { label: "SESSIONS THIS MONTH", value: String(earnings.sessionsThisMonth) },
          { label: "RATE PER B2B SESSION", value: earnings.ratePerSession },
        ].map((s) => (
          <Card key={s.label}>
            <div className="mb-2 text-[11px] font-boldNunito tracking-[0.06em] text-ink-400">
              {s.label}
            </div>
            <div className="text-h2 font-extraboldNunito text-navy-800">{s.value}</div>
          </Card>
        ))}
      </div>

      <PanelCard
        title="Recent payouts"
        subtitle="Paid weekly via Flutterwave"
        action={
          <SecondaryButton onClick={() => open("allPayouts", earnings.payouts)}>
            View all
          </SecondaryButton>
        }
      >
        {earnings.payouts.slice(0, 3).map((p) => (
          <div
            key={p.date}
            className="flex items-center justify-between gap-4 border-b border-[#F5F5F5] px-5 py-3.5 last:border-b-0"
          >
            <div>
              <div className="text-[13px] font-boldNunito text-navy-800">{p.date}</div>
              <div className="text-[11px] text-ink-400">{p.sessions} sessions</div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-[13px] font-extraboldNunito text-navy-800">{p.amount}</span>
              <Badge tone="green">Paid</Badge>
            </div>
          </div>
        ))}
      </PanelCard>

      <Card>
        <div className="mb-3.5 text-body font-extraboldNunito text-navy-800">Payout method</div>
        <div className="flex flex-wrap items-center gap-3 rounded-ds-md bg-ink-50 p-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-wellness-50">
            <Icon.CreditCard size={17} className="text-wellness-600" />
          </span>
          <div className="min-w-[160px] flex-1">
            <div className="text-[13px] font-boldNunito text-navy-800">
              {earnings.payoutMethod.bank} {earnings.payoutMethod.masked}
            </div>
            <div className="text-[11px] text-ink-400">{earnings.payoutMethod.name}</div>
          </div>
          <SecondaryButton onClick={() => showToast("Payout method editor opens here")}>
            Change
          </SecondaryButton>
        </div>
      </Card>
    </>
  );
};

/* ── MESSAGES ─────────────────────────────────────────────────────────── */

export const TherapistMessages = () => {
  const [activeId, setActiveId] = useState(therapistMessageThreads[0].id);
  const active = therapistMessageThreads.find((t) => t.id === activeId);

  return (
    <div className="grid gap-3.5 lg:grid-cols-[280px_1fr]">
      <PanelCard title="Clients">
        {therapistMessageThreads.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveId(t.id)}
            className={classNames(
              "flex w-full cursor-pointer items-start gap-2.5 border-b border-[#F5F5F5] px-4 py-3.5 text-left last:border-b-0",
              activeId === t.id ? "bg-wellness-50" : "hover:bg-ink-50"
            )}
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-extraboldNunito text-white"
              style={{ background: t.avatarBg }}
            >
              {t.initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2">
                <span className="truncate text-[13px] font-boldNunito text-navy-800">
                  {t.name}
                </span>
                <span className="shrink-0 text-[10.5px] text-ink-400">{t.time}</span>
              </span>
              <span className="mt-0.5 block truncate text-[11.5px] text-ink-400">
                {t.preview}
              </span>
            </span>
            {t.unread ? (
              <span className="shrink-0 rounded-full bg-wellness-400 px-1.5 py-0.5 text-[9px] font-boldNunito text-white">
                {t.unread}
              </span>
            ) : null}
          </button>
        ))}
      </PanelCard>

      <PanelCard title={active.name} subtitle="Encrypted · sessions and chats are never recorded">
        <div className="flex flex-col gap-3 p-5">
          {active.messages.map((m, i) => (
            <div
              key={i}
              className={classNames("flex", m.from === "me" ? "justify-end" : "justify-start")}
            >
              <div
                className={classNames(
                  "max-w-[75%] rounded-ds-md px-3.5 py-2.5",
                  m.from === "me" ? "bg-wellness-400 text-white" : "bg-ink-50 text-ink-800"
                )}
              >
                <p className="text-[13px] leading-[1.55]">{m.text}</p>
                <div
                  className={classNames(
                    "mt-1 text-[10px]",
                    m.from === "me" ? "text-white/60" : "text-ink-400"
                  )}
                >
                  {m.time}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 border-t border-ink-100 p-4">
          <input
            placeholder="Write a message…"
            aria-label="Write a message"
            className="h-10 flex-1 rounded-ds-md border-[1.5px] border-ink-200 px-3.5 text-[13px] text-ink-800"
          />
          <TealButton>
            <Icon.Send size={14} />
          </TealButton>
        </div>
      </PanelCard>
    </div>
  );
};

/* ── PROFILE & ACCOUNT ────────────────────────────────────────────────── */

export const TherapistProfile = () => {
  const { open, showToast } = useTherapist();
  const [profile, setProfile] = useState(therapistProfile);
  const [notifs, setNotifs] = useState(
    therapistNotifRows.reduce((acc, n) => ({ ...acc, [n.key]: n.on }), {})
  );
  const [twoFa, setTwoFa] = useState(true);

  const field = (k) => (e) => setProfile((p) => ({ ...p, [k]: e.target.value }));
  const input =
    "h-[42px] w-full rounded-[10px] border-[1.5px] border-ink-200 px-[13px] text-[13px] text-ink-800";
  const label = "mb-[5px] block text-[11px] font-boldNunito text-ink-400";

  const Switch = ({ on, onClick, label: aria }) => (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={aria}
      onClick={onClick}
      className={classNames(
        "relative h-[22px] w-10 shrink-0 cursor-pointer rounded-full transition-colors",
        on ? "bg-[#3BA88F]" : "bg-ink-200"
      )}
    >
      <span
        className={classNames(
          "absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.15)] transition-all",
          on ? "left-5" : "left-0.5"
        )}
      />
    </button>
  );

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {/* Public Profile */}
      <Card>
        <div className="mb-3.5 flex items-center justify-between gap-3">
          <div className="text-body font-extraboldNunito text-navy-800">Public Profile</div>
          <span className="rounded-full bg-gold-50 px-[9px] py-[3px] text-[10px] font-boldNunito text-gold-600">
            ✦ Verified
          </span>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className={label} htmlFor="thr-name">Full Name</label>
            <input id="thr-name" className={input} value={profile.name} onChange={field("name")} />
          </div>
          <div>
            <label className={label} htmlFor="thr-bio">About</label>
            <textarea
              id="thr-bio"
              value={profile.bio}
              onChange={field("bio")}
              className="h-[78px] w-full resize-none rounded-[10px] border-[1.5px] border-ink-200 px-[13px] py-2.5 text-[12.5px] leading-[1.6] text-ink-800"
            />
          </div>
          <div>
            <span className={label}>Specialties</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {profile.specialties.map((sp) => (
                <span
                  key={sp}
                  className="rounded-full bg-[#EEF4FC] px-3 py-[5px] text-[11px] font-boldNunito text-brand-600"
                >
                  {sp}
                </span>
              ))}
              <button
                type="button"
                className="cursor-pointer rounded-full border-[1.5px] border-dashed border-[#C9D3E0] px-[11px] py-1 text-[11px] font-boldNunito text-brand-400"
              >
                + Add
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className={label} htmlFor="thr-years">Years of experience</label>
              <input id="thr-years" className={input} value={profile.years} onChange={field("years")} />
            </div>
            <div className="flex-1">
              <label className={label} htmlFor="thr-rate">Session rate</label>
              <input id="thr-rate" className={input} value={profile.rate} onChange={field("rate")} />
            </div>
          </div>
          <div>
            <label className={label} htmlFor="thr-langs">Languages</label>
            <input id="thr-langs" className={input} value={profile.langs} onChange={field("langs")} />
          </div>
          <div>
            <label className={label} htmlFor="thr-formats">Session formats</label>
            <input id="thr-formats" className={input} value={profile.formats} onChange={field("formats")} />
          </div>
          <div className="flex gap-2 rounded-[10px] bg-[#EEF4FC] px-[13px] py-2.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#015C94" strokeWidth="2" className="mt-px shrink-0">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span className="text-[11px] leading-[1.55] text-brand-600">
              This is what companies and clients see. Your B2B session rate is set by
              TalkAM; the rate above is your consumer rate.
            </span>
          </div>
          <button
            type="button"
            onClick={() => showToast("Profile saved")}
            className="h-[46px] cursor-pointer rounded-[12px] bg-navy-800 text-[13px] font-extraboldNunito text-white"
          >
            Save Changes
          </button>
        </div>
      </Card>

      {/* Account */}
      <Card>
        <div className="mb-1 text-body font-extraboldNunito text-navy-800">Account</div>
        <div className="mb-3.5 text-[11px] text-ink-400">{profile.email}</div>
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-[#F5F5F5] py-[11px]">
            <div>
              <div className="text-[13px] font-semiboldNunito text-ink-800">
                Credential verification
              </div>
              <div className="text-[10.5px] text-ink-400">MDCN, NPA, indemnity insurance</div>
            </div>
            <span className="rounded-full bg-[#EEF4FC] px-[9px] py-[3px] text-[11px] font-boldNunito text-brand-600">
              Verified
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 border-b border-[#F5F5F5] py-[11px]">
            <div>
              <div className="text-[13px] font-semiboldNunito text-ink-800">Payout account</div>
              <div className="text-[10.5px] text-ink-400">Manage bank details on mobile</div>
            </div>
            <button type="button" className="cursor-pointer text-[12px] font-boldNunito text-brand-400">
              Open App
            </button>
          </div>
          <div className="flex items-center justify-between gap-4 py-[11px]">
            <div className="max-w-[240px]">
              <div className="text-[13px] font-semiboldNunito text-ink-800">
                Two-factor authentication
              </div>
              <div className="text-[10.5px] text-ink-400">
                Email a one-time code to your work email at every sign-in
              </div>
            </div>
            <Switch
              on={twoFa}
              label="Two-factor authentication"
              onClick={() => setTwoFa((v) => !v)}
            />
          </div>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <div className="mb-1 text-body font-extraboldNunito text-navy-800">
          Notification Preferences
        </div>
        <div className="mb-3.5 text-[11px] text-ink-400">
          Choose what TalkAM emails and alerts you about
        </div>
        <div className="flex flex-col">
          {therapistNotifRows.map((n, i) => (
            <div
              key={n.key}
              className={classNames(
                "flex items-center justify-between gap-4 py-[11px]",
                i < therapistNotifRows.length - 1 && "border-b border-[#F5F5F5]"
              )}
            >
              <div className="max-w-[250px]">
                <div className="text-[13px] font-semiboldNunito text-ink-800">{n.title}</div>
                <div className="text-[10.5px] text-ink-400">{n.sub}</div>
              </div>
              <Switch
                on={notifs[n.key]}
                label={n.title}
                onClick={() => setNotifs((p) => ({ ...p, [n.key]: !p[n.key] }))}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Safety */}
      <Card>
        <div className="mb-1 text-body font-extraboldNunito text-navy-800">Safety</div>
        <div className="mb-3.5 text-[11px] text-ink-400">
          Concerned about a client interaction?
        </div>
        <button
          type="button"
          onClick={() => open("report")}
          className="w-full cursor-pointer rounded-[10px] border border-ink-200 bg-surface-page p-3 text-left text-[13px] font-boldNunito text-ink-600"
        >
          Report a client
        </button>
      </Card>

      {/* Danger Zone */}
      <Card className="!border-[#FFCDD2]">
        <div className="mb-1 text-body font-extraboldNunito text-[#8B2E2E]">Danger Zone</div>
        <div className="mb-3.5 text-[11px] text-ink-400">
          Deactivating removes you from client search immediately
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => showToast("Profile deactivated")}
            className="cursor-pointer rounded-[10px] border border-[#FFCDD2] bg-surface-page p-[11px] text-[13px] font-boldNunito text-[#8B2E2E]"
          >
            Deactivate profile temporarily
          </button>
          <button
            type="button"
            onClick={() => open("deleteAccount")}
            className="w-full cursor-pointer rounded-[10px] bg-[#AC4242] p-3 text-center text-[13px] font-boldNunito text-white"
          >
            Delete my account
          </button>
        </div>
      </Card>
    </div>
  );
};


export const TherapistHelp = () => (
  <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr] xl:items-start">
    <Card>
      <div className="mb-1 text-body font-extraboldNunito text-navy-800">
        Frequently asked questions
      </div>
      <div className="mb-3.5 text-caption text-ink-400">
        Payouts, rates, requests and privacy — the things therapists ask us most.
      </div>
      <DsAccordion items={therapistFaqs} />
    </Card>

    <div className="flex flex-col gap-4">
      <Card>
        <div className="mb-2.5 text-body font-extraboldNunito text-navy-800">
          Provider support
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5 rounded-ds-md border border-[#EEEEEE] bg-ink-50 px-3.5 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-wellness-400">
              <Icon.MessageCircle size={15} color="#fff" />
            </span>
            <div>
              <div className="text-[12.5px] font-boldNunito text-navy-800">Live chat</div>
              <div className="text-[11px] text-ink-400">Informly widget · replies in minutes</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-ds-md border border-[#EEEEEE] bg-ink-50 px-3.5 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-brand-400">
              <Icon.Mail size={15} color="#fff" />
            </span>
            <div>
              <div className="text-[12.5px] font-boldNunito text-navy-800">
                providers@talkam.net
              </div>
              <div className="text-[11px] text-ink-400">Replies within 1 business day</div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="!bg-navy-800">
        <div className="mb-1.5 text-[13px] font-extraboldNunito text-white">
          Sessions are never recorded
        </div>
        <p className="text-[11.5px] leading-[1.7] text-white/55">
          No audio, video or transcript is stored for any session room. Your written
          notes are the only record, and they are private to you.
        </p>
      </Card>
    </div>
  </div>
);

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { Card } from "../../../../../components/v2/dashboard/chrome";
import { useEmployee } from "../employeelayout";
import { V2 } from "../../../../../constants/v2routes";
import {
  MOODS,
  HOME_MOODS,
  MOOD_MESSAGES,
  MOOD_BY_VALUE,
  moodEmojiForAverage,
  FACTOR_EMOJI,
  SESSION_TYPE_META,
  recommended,
  qrSeed,
  sessionPrep,
  TOPIC_CHIP_PALETTE,
  CONSENT_COPY,
  CONSENT_ORDER,
  avatarColour,
  initialsOf,
} from "../../../../../constants/employeedashboard";
import {
  useGetMoodTodayQuery,
  useGetMoodSummaryQuery,
  useGetMoodHistoryQuery,
  useSaveMoodCheckinMutation,
  useGetBookingsQuery,
  useGetCareTeamQuery,
  useGetCommunityTrendingQuery,
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useGetPrivacySettingsQuery,
  useSavePrivacySettingsMutation,
  useUpdateProfileMutation,
  useGetFaqsQuery,
} from "../../../../../services/v2/employeeApiSlice";
import {
  useGetMeV2Query,
  useGetConsentsQuery,
  useSaveConsentsMutation,
} from "../../../../../services/v2/authApiSliceV2";

/**
 * The seven employee dashboard screens.
 * Spec: "TalkAM B2B Employee Dashboard.dc.html" — each `sc-if` page state is a
 * route here; everything else is a one-to-one transcription of the deck.
 *
 * Data comes from api/v2 (planning-docs/web-api/02-employee-dashboard.md);
 * only labels, emoji and palettes are still local.
 */

/* ── Shared pieces ────────────────────────────────────────────────────────── */

/** Deck: `buildMoodPicker` (Check-ins, `small=false`). */
const MoodPicker = ({ options, value, onPick, small }) => (
  <div className="flex gap-2">
    {options.map((m) => (
      <button
        key={m.key}
        type="button"
        onClick={() => onPick(m.key)}
        aria-pressed={value === m.key}
        className={classNames(
          "flex flex-1 cursor-pointer flex-col items-center border-[1.5px]",
          small ? "gap-1 rounded-[10px] px-1.5 py-2.5" : "gap-1.5 rounded-[12px] px-2 py-3.5",
          value === m.key
            ? "border-[#017FC8] bg-[#EEF4FC] text-[#015C94]"
            : "border-surface-line bg-[#F8F9FC] text-[#717171]"
        )}
      >
        <span className={small ? "text-[22px]" : "text-[26px]"}>{m.emoji}</span>
        <span className={classNames("font-boldNunito", small ? "text-[10px]" : "text-[11px]")}>
          {m.label}
        </span>
      </button>
    ))}
  </div>
);

/** Deck: `homeMoodRow` — flatter tiles, white ground, `#EEF0F4` border. */
const HomeMoodRow = ({ value, onPick }) => (
  <div className="flex gap-2.5">
    {HOME_MOODS.map((m) => (
      <button
        key={m.key}
        type="button"
        onClick={() => onPick(m.key)}
        aria-pressed={value === m.key}
        className={classNames(
          "flex flex-1 cursor-pointer flex-col items-center gap-[5px] rounded-[12px] border-[1.5px] px-1.5 py-[11px]",
          value === m.key ? "border-[#017FC8] bg-[#EEF4FC]" : "border-[#EEF0F4] bg-white"
        )}
      >
        <span className="text-[26px]">{m.emoji}</span>
        <span className="text-[11px] font-boldNunito text-ink-600">{m.label}</span>
      </button>
    ))}
  </div>
);

/** Deck: `<div class="card" style="padding:16px 18px">` stat tile. */
const StatCard = ({ value, label, accent }) => (
  <Card className="!px-[18px] !py-4">
    <div className="mb-0.5 text-[22px] font-blackNunito" style={{ color: accent }}>
      {value}
    </div>
    <div className="text-[11.5px] text-ink-400">{label}</div>
  </Card>
);

const SectionHeading = ({ className, children }) => (
  <div className={classNames("text-[13px] font-extraboldNunito text-navy-800", className)}>
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <div className="text-body font-extraboldNunito text-navy-800">{children}</div>
);

const CardSub = ({ className, children }) => (
  <div className={classNames("text-[11px] text-ink-400", className)}>{children}</div>
);

const SavedPill = ({ children }) => (
  <span className="rounded-full bg-wellness-25 px-[11px] py-1 text-[11px] font-boldNunito text-wellness-600">
    {children}
  </span>
);

/** Skeleton block using the deck's own ink-100 surface — no layout shift. */
const Skeleton = ({ className }) => (
  <div className={classNames("animate-pulse rounded-[10px] bg-ink-100", className)} />
);

/** Quiet empty state in the deck's muted voice. */
const EmptyNote = ({ children }) => (
  <div className="rounded-[10px] bg-[#F8F9FC] px-3.5 py-3 text-[12px] leading-[1.6] text-ink-400">
    {children}
  </div>
);

/* ── Formatting helpers ───────────────────────────────────────────────────── */

const WAT = { timeZone: "Africa/Lagos" };

const sessionDayLabel = (iso) => {
  if (!iso) return "";
  const date = new Date(iso.replace(" ", "T"));
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const day = isToday
    ? "Today"
    : isTomorrow
      ? "Tomorrow"
      : date.toLocaleDateString("en-NG", { ...WAT, weekday: "short", month: "short", day: "numeric" });

  const time = date.toLocaleTimeString("en-NG", { ...WAT, hour: "numeric", minute: "2-digit" });

  return `${day} · ${time} WAT`;
};

const sessionRangeLabel = (iso, minutes = 50) => {
  if (!iso) return "";
  const start = new Date(iso.replace(" ", "T"));
  const end = new Date(start.getTime() + minutes * 60000);
  const fmt = (d) => d.toLocaleTimeString("en-NG", { ...WAT, hour: "numeric", minute: "2-digit" });
  const base = sessionDayLabel(iso).split(" · ")[0];

  return `${base} · ${fmt(start)} – ${fmt(end)} WAT`;
};

const historyDateLabel = (iso) => {
  if (!iso) return "";
  const date = new Date(iso.replace(" ", "T"));
  return `${date.toLocaleDateString("en-NG", { month: "short", day: "numeric" })} · ${
    SESSION_TYPE_META[String(iso).includes("voice") ? "voice" : "video"]?.short ?? ""
  }`;
};

const pastSessionLabel = (session) => {
  const date = new Date(String(session.starts_at).replace(" ", "T"));
  const day = date.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
  const type = SESSION_TYPE_META[session.format]?.short ?? session.format;
  return `${day} · ${type} · ${session.duration_minutes} min`;
};

/** The deck shows "Completed" / "No-show"; the API's vocabulary is wider. */
const statusLabel = (status) =>
  ({
    completed: "Completed",
    no_show: "No-show",
    cancelled: "Cancelled",
    confirmed: "Confirmed",
    pending_payment: "Awaiting payment",
    expired: "Expired",
    failed: "Failed",
  })[status] ?? status;

const checkinDayLabel = (date) => {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (date === today) return "Today";
  if (date === yesterday) return "Yesterday";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-NG", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

/* ── HOME ─────────────────────────────────────────────────────────────────── */

export const EmployeeHome = () => {
  const { open, showToast } = useEmployee();

  const { data: me } = useGetMeV2Query();
  const { data: today } = useGetMoodTodayQuery();
  const { data: summary, isLoading: summaryLoading } = useGetMoodSummaryQuery(14);
  const { data: bookings } = useGetBookingsQuery();
  const { data: trending } = useGetCommunityTrendingQuery();
  const [saveCheckin] = useSaveMoodCheckinMutation();

  const company = me?.business?.organization?.name ?? "Your employer";
  // `name` is the full name; the greeting uses just the first word of it.
  const firstName = (me?.name ?? "").split(" ")[0];

  const homeMood = MOOD_BY_VALUE[today?.mood]?.key ?? null;

  const next = bookings?.upcoming?.[0] ?? null;
  const typeLabel = SESSION_TYPE_META[next?.format]?.label ?? SESSION_TYPE_META.video.label;
  const lastCompleted = bookings?.past?.find((s) => s.status === "completed" && !s.rating) ?? null;

  /* Deck: a fortnight area chart. The API returns one point per day with null
     for missed days; nulls are dropped so the line stays continuous. */
  const trendPts = useMemo(() => {
    const series = summary?.series ?? [];
    const points = series
      .map((p, i) => ({ i, mood: p.mood }))
      .filter((p) => p.mood !== null && p.mood !== undefined);

    if (points.length < 2) return null;

    const span = Math.max(series.length - 1, 1);
    return points
      .map((p) => `${(p.i / span) * 100},${100 - ((p.mood - 1) / 4) * 100}`)
      .join(" ");
  }, [summary]);

  const snapshot = [
    { value: String(summary?.streak ?? 0), label: "day check-in streak", accent: "#3BA88F" },
    {
      value: bookings?.summary?.sessions_allowed
        ? `${bookings.summary.sessions_used} / ${bookings.summary.sessions_allowed}`
        : String(bookings?.summary?.sessions_used ?? 0),
      label: "sessions used this quarter",
      accent: "#017FC8",
    },
    {
      value:
        summary?.month_delta_percent === null || summary?.month_delta_percent === undefined
          ? "—"
          : `${summary.month_delta_percent > 0 ? "+" : ""}${summary.month_delta_percent}%`,
      label: "mood vs last month",
      accent: "#1F8A5B",
    },
  ];

  const pickMood = async (key) => {
    const mood = MOODS.find((m) => m.key === key);
    if (!mood) return;

    try {
      await saveCheckin({ mood: mood.value }).unwrap();
      showToast("Check-in logged — thanks for showing up for yourself");
    } catch {
      showToast("Couldn't save that just now — please try again");
    }
  };

  return (
    <>
      {/* greeting + V2 pill */}
      <div>
        <div className="mb-[3px] flex flex-wrap items-center gap-2.5">
          <span className="text-[20px] font-blackNunito tracking-[-0.01em] text-navy-800">
            Good morning{firstName ? `, ${firstName}` : ""}
          </span>
          <span className="inline-flex items-center gap-[5px] rounded-full bg-[linear-gradient(135deg,#6B44A8,#8B5FC2)] px-2.5 py-1 text-[10px] font-extraboldNunito tracking-[0.05em] text-white shadow-[0_3px_8px_rgba(107,68,168,0.3)]">
            <span className="h-[5px] w-[5px] rounded-full bg-white" />
            V2 PREVIEW
          </span>
        </div>
        <div className="text-[13px] text-ink-400">
          Here&apos;s your space today — take a moment for yourself.
        </div>
      </div>

      <div className="flex items-center gap-2.5 rounded-[12px] border border-[#E3D5FF] bg-[#F5F0FF] px-4 py-3">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B44A8" strokeWidth="2" className="shrink-0">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        </svg>
        <span className="text-[12px] leading-[1.5] text-[#5A3990]">
          Everything you do on TalkAM — sessions, mood check-ins, chats, community posts —
          stays private. {company} only ever sees anonymised, company-wide totals.
        </span>
      </div>

      {/* inline daily check-in */}
      <Card>
        <div className="mb-3.5 flex items-center justify-between gap-3">
          <div>
            <CardTitle>How are you feeling today?</CardTitle>
            <CardSub>A 5-second check-in — private to you</CardSub>
          </div>
          {homeMood ? <SavedPill>✓ Logged today</SavedPill> : null}
        </div>
        <HomeMoodRow value={homeMood} onPick={pickMood} />
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        {/* upcoming session */}
        <div className="relative overflow-hidden rounded-ds-lg bg-[linear-gradient(135deg,#141B34,#1A2E5A)] px-6 py-[22px] shadow-[0_4px_16px_rgba(20,27,52,0.18)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-5 -top-5 h-[160px] w-[160px] rounded-full bg-[radial-gradient(circle,rgba(59,168,143,0.16)_0%,transparent_65%)]"
          />
          <div className="relative z-[1] mb-3.5 flex items-center gap-[7px]">
            <span className="h-[7px] w-[7px] rounded-full bg-[#3BA88F]" />
            <span className="text-[10px] font-boldNunito tracking-[0.08em] text-[#6FCDB6]">
              NEXT SESSION
            </span>
          </div>

          {next ? (
            <>
              <div className="relative z-[1] flex items-center gap-3.5">
                <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#017FC8] text-[18px] font-extraboldNunito text-white">
                  {initialsOf(next.therapist_name)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[17px] font-extraboldNunito text-white">
                    {next.therapist_name}
                  </div>
                  <div className="text-[12px] text-white/50">
                    {typeLabel} · {sessionDayLabel(next.starts_at)}
                  </div>
                </div>
              </div>
              <div className="relative z-[1] mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => open("reschedule", next)}
                  className="flex-1 cursor-pointer rounded-[10px] border border-white/[0.18] bg-white/10 p-2.5 text-center text-[12px] font-boldNunito text-white"
                >
                  Reschedule
                </button>
                <button
                  type="button"
                  onClick={() => open("cancel", next)}
                  className="flex-1 cursor-pointer rounded-[10px] border border-[rgba(172,66,66,0.3)] bg-[rgba(172,66,66,0.15)] p-2.5 text-center text-[12px] font-boldNunito text-[#FF9B9B]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => open("preSessionMood", next)}
                  className="flex-1 cursor-pointer rounded-[10px] bg-[#3BA88F] p-2.5 text-center text-[12px] font-extraboldNunito text-white"
                >
                  Join Room
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="relative z-[1] text-[15px] font-extraboldNunito text-white">
                No session booked yet
              </div>
              <div className="relative z-[1] mt-1 text-[12px] leading-[1.6] text-white/50">
                When you&apos;re ready, book a time that suits you — your benefit covers it.
              </div>
              <div className="relative z-[1] mt-5">
                <button
                  type="button"
                  onClick={() => open("booking")}
                  className="w-full cursor-pointer rounded-[10px] bg-[#3BA88F] p-2.5 text-center text-[12px] font-extraboldNunito text-white"
                >
                  Book a Session
                </button>
              </div>
            </>
          )}
        </div>

        {/* get the app */}
        <Card className="flex flex-col">
          <div className="mb-[3px] text-body font-extraboldNunito text-navy-800">
            Get the TalkAM app
          </div>
          <div className="mb-3.5 text-[11px] text-ink-400">
            Community, chat &amp; mood tracking live on mobile
          </div>
          <div className="flex flex-1 items-center gap-3.5">
            <div className="h-[88px] w-[88px] shrink-0 rounded-[10px] border border-ink-200 bg-white p-1.5">
              <div className="grid h-full w-full grid-cols-8 gap-px">
                {qrSeed.map((v, i) => (
                  <span key={i} style={{ background: v ? "#141B34" : "#fff" }} />
                ))}
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <a
                href="https://apps.apple.com/za/app/talkam-tech/id6740508182"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-[9px] bg-navy-800 px-2.5 py-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
                <span>
                  <span className="block text-[9px] leading-none text-white/50">
                    Download on the
                  </span>
                  <span className="block text-[11.5px] font-extraboldNunito leading-[1.3] text-white">
                    App Store
                  </span>
                </span>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.talkamtech.app"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-[9px] bg-navy-800 px-2.5 py-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M5 3l14 9-14 9V3z" />
                </svg>
                <span>
                  <span className="block text-[9px] leading-none text-white/50">Get it on</span>
                  <span className="block text-[11.5px] font-extraboldNunito leading-[1.3] text-white">
                    Google Play
                  </span>
                </span>
              </a>
            </div>
          </div>
        </Card>
      </div>

      {/* quick links */}
      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <Link to={`${V2.employee}/checkins`}>
          <QuickLink
            tint="#FFF0F0"
            stroke="#AC4242"
            path="M22 12h-4l-3 9L9 3l-3 9H2"
            title="Daily check-in"
            note={homeMood ? "Logged today — add detail" : "How are you feeling today?"}
          />
        </Link>
        <Link to={`${V2.employee}/community`}>
          <QuickLink
            tint="#EEF4FC"
            stroke="#017FC8"
            path="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            title="Trending in Community"
            note={
              trending?.[0]?.name
                ? `${trending[0].name} is trending this week`
                : "See what people are talking about"
            }
          />
        </Link>
        <Link to={`${V2.employee}/messages`}>
          <QuickLink
            tint="#E8F7F4"
            stroke="#3BA88F"
            path="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"
            title="Message your therapist"
            note="Encrypted · private to you"
          />
        </Link>
        <button
          type="button"
          onClick={() => open("feedback", lastCompleted)}
          disabled={!lastCompleted}
          className="text-left disabled:cursor-default"
        >
          <QuickLink
            tint="#FBF5E8"
            stroke="#9A6E0A"
            path="M20 6 9 17l-5-5"
            title="Rate your last session"
            note={
              lastCompleted
                ? `With ${lastCompleted.therapist_name} · ${pastSessionLabel(lastCompleted).split(" · ")[0]}`
                : "Nothing waiting to be rated"
            }
          />
        </button>
      </div>

      {/* wellbeing snapshot */}
      <div className="grid items-stretch gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <CardTitle>Your wellbeing this fortnight</CardTitle>
              <CardSub>
                {summary?.month_delta_percent > 0 ? "Trending up" : "Private to you"} — private to you
              </CardSub>
            </div>
            <Link
              to={`${V2.employee}/checkins`}
              className="shrink-0 text-[12px] font-boldNunito text-brand-400"
            >
              View check-ins →
            </Link>
          </div>
          <div className="mb-4 h-[70px]">
            {summaryLoading ? (
              <Skeleton className="h-full w-full" />
            ) : trendPts ? (
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="h-full w-full overflow-visible"
              >
                <defs>
                  <linearGradient id="empMoodFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3BA88F" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#3BA88F" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline
                  points={trendPts}
                  fill="none"
                  stroke="#3BA88F"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
                <polygon points={`0,100 ${trendPts} 100,100`} fill="url(#empMoodFill)" />
              </svg>
            ) : (
              <div className="flex h-full items-center">
                <EmptyNote>
                  Check in a couple of days running and your trend will appear here.
                </EmptyNote>
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {snapshot.map((w) => (
              <div key={w.label} className="rounded-[12px] bg-[#F8F9FC] px-1.5 py-3 text-center">
                <div
                  className="mb-0.5 text-[19px] font-blackNunito"
                  style={{ color: w.accent }}
                >
                  {w.value}
                </div>
                <div className="text-[10.5px] leading-[1.3] text-ink-400">{w.label}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* recommended for you */}
        <div className="flex flex-col gap-3">
          <SectionHeading>Recommended for you</SectionHeading>
          {recommended.map((r) => (
            <Card key={r.title} className="flex flex-1 cursor-pointer items-center gap-[13px]">
              <span
                className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[12px]"
                style={{ background: r.tint }}
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={r.accent}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={r.icon} />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <div
                  className="mb-0.5 text-[9.5px] font-extraboldNunito tracking-[0.08em]"
                  style={{ color: r.accent }}
                >
                  {r.tag}
                </div>
                <div className="text-[13px] font-extraboldNunito leading-[1.3] text-navy-800">
                  {r.title}
                </div>
                <div className="text-[11px] leading-[1.4] text-ink-400">{r.sub}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

const QuickLink = ({ tint, stroke, path, title, note }) => (
  <Card className="flex h-full cursor-pointer flex-col gap-2.5">
    <span
      className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px]"
      style={{ background: tint }}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2">
        <path d={path} />
      </svg>
    </span>
    <div>
      <div className="text-[13px] font-extraboldNunito text-navy-800">{title}</div>
      <div className="text-[11px] text-ink-400">{note}</div>
    </div>
  </Card>
);

/* ── MY SESSIONS ──────────────────────────────────────────────────────────── */

export const EmployeeSessions = () => {
  const { open } = useEmployee();

  const { data: bookings, isLoading } = useGetBookingsQuery();
  const { data: careTeam } = useGetCareTeamQuery();
  const { data: summaryData } = useGetMoodSummaryQuery(14);

  const next = bookings?.upcoming?.[0] ?? null;
  const past = bookings?.past ?? [];
  const s = bookings?.summary;
  const typeShort = SESSION_TYPE_META[next?.format]?.short ?? SESSION_TYPE_META.video.short;
  const therapist = careTeam?.therapist;

  const summary = [
    { value: String(s?.upcoming ?? 0), label: "Upcoming", accent: "#017FC8" },
    { value: String(s?.completed ?? 0), label: "Completed", accent: "#141B34" },
    {
      value: s?.sessions_allowed ? `${s.sessions_used} / ${s.sessions_allowed}` : String(s?.sessions_used ?? 0),
      label: "Sessions used",
      accent: "#1F8A5B",
    },
    {
      value: moodEmojiForAverage(summaryData?.average_mood),
      label:
        summaryData?.month_delta_percent > 0
          ? "Mood trending up"
          : summaryData?.month_delta_percent < 0
            ? "Mood dipping"
            : "Mood steady",
      accent: "#9A6E0A",
    },
  ];

  return (
    <>
      {/* summary strip */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {summary.map((k) => (
          <StatCard key={k.label} {...k} />
        ))}
      </div>

      <div className="grid items-stretch gap-4 xl:grid-cols-[1.5fr_1fr]">
        {/* next session hero */}
        <div className="relative flex flex-col overflow-hidden rounded-[18px] border border-[#1E2D5A] bg-[linear-gradient(135deg,#0F1E3D,#17305C)] p-[22px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-[200px] w-[200px] rounded-full bg-[radial-gradient(circle,rgba(59,168,143,0.28)_0%,transparent_65%)]"
          />
          <div className="relative z-[1] mb-4 flex items-center justify-between gap-3">
            <span className="text-[11px] font-extraboldNunito tracking-[0.1em] text-[#6FCDB6]">
              YOUR NEXT SESSION
            </span>
            {next ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.15] bg-white/10 px-[11px] py-[5px] text-[11px] font-boldNunito text-white">
                {typeShort}
              </span>
            ) : null}
          </div>

          {next ? (
            <>
              <div className="relative z-[1] mb-4 flex items-center gap-3.5">
                <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[15px] bg-[#017FC8] text-[18px] font-extraboldNunito text-white shadow-[0_6px_16px_rgba(0,0,0,0.25)]">
                  {initialsOf(next.therapist_name)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[18px] font-extraboldNunito text-white">
                    {next.therapist_name}
                  </div>
                  <div className="text-[12px] text-white/55">
                    {sessionRangeLabel(next.starts_at, next.duration_minutes)}
                  </div>
                </div>
              </div>
              <div className="relative z-[1] mt-auto flex gap-2.5">
                <button
                  type="button"
                  onClick={() => open("preSessionMood", next)}
                  className="flex-1 cursor-pointer rounded-[11px] bg-[#3BA88F] p-3 text-center text-[13px] font-extraboldNunito text-white shadow-[0_6px_16px_rgba(59,168,143,0.35)]"
                >
                  Join Room →
                </button>
                <button
                  type="button"
                  onClick={() => open("reschedule", next)}
                  className="cursor-pointer rounded-[11px] border border-white/[0.16] bg-white/10 px-[15px] py-3 text-[13px] font-boldNunito text-white"
                >
                  Reschedule
                </button>
                <button
                  type="button"
                  onClick={() => open("cancel", next)}
                  className="cursor-pointer rounded-[11px] border border-[rgba(255,120,120,0.25)] bg-[rgba(255,80,80,0.14)] px-[15px] py-3 text-[13px] font-boldNunito text-[#FF9E9E]"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="relative z-[1] mb-1 text-[18px] font-extraboldNunito text-white">
                Nothing scheduled
              </div>
              <div className="relative z-[1] text-[12px] leading-[1.6] text-white/55">
                Book a session whenever you&apos;re ready — your company benefit covers it.
              </div>
              <div className="relative z-[1] mt-auto pt-5">
                <button
                  type="button"
                  onClick={() => open("booking")}
                  className="w-full cursor-pointer rounded-[11px] bg-[#3BA88F] p-3 text-center text-[13px] font-extraboldNunito text-white shadow-[0_6px_16px_rgba(59,168,143,0.35)]"
                >
                  Book a Session →
                </button>
              </div>
            </>
          )}
        </div>

        {/* prep checklist */}
        <Card className="flex flex-col">
          <div className="mb-1 text-[13px] font-extraboldNunito text-navy-800">
            Before you join
          </div>
          <CardSub className="mb-3.5">A calmer session starts here</CardSub>
          <div className="flex flex-col gap-3">
            {sessionPrep.map((label, i) => {
              /* Only the first item has a real signal behind it — the
                 pre-session check-in. The rest are guidance (plan D3). */
              const done = i === 0 ? !!next?.client_pre_mood : false;

              return (
                <div key={label} className="flex items-start gap-2.5">
                  <span
                    className={classNames(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border-[1.5px]",
                      done ? "border-[#3BA88F] bg-[#3BA88F]" : "border-[#D2D6E0] bg-white"
                    )}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  <span
                    className={classNames(
                      "text-[12.5px] leading-[1.5]",
                      done ? "text-[#9299A8] line-through" : "text-ink-800"
                    )}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* care team */}
      <div>
        <SectionHeading className="mb-3">Your care team</SectionHeading>
        {therapist ? (
          <Card className="flex flex-wrap items-center gap-4">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] text-[18px] font-extraboldNunito text-white"
              style={{ background: avatarColour(therapist.name) }}
            >
              {therapist.initials}
            </span>
            <div className="min-w-[220px] flex-1">
              <div className="mb-[3px] flex items-center gap-2">
                <span className="text-[15px] font-extraboldNunito text-navy-800">
                  {therapist.name}
                </span>
                {therapist.rating ? (
                  <span className="text-[12px] font-boldNunito text-gold-400">
                    ★ {therapist.rating}
                  </span>
                ) : null}
              </div>
              <div className="mb-1 text-[12px] text-ink-400">
                {[therapist.credential_type, therapist.focus].filter(Boolean).join(" · ")}
              </div>
              <div className="text-[11.5px] leading-[1.5] text-[#5B6577]">
                {careTeam?.continuity_note ??
                  `${therapist.sessions_together} session${therapist.sessions_together === 1 ? "" : "s"} together so far.`}
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2">
              <Link
                to={`${V2.employee}/messages`}
                className="rounded-[9px] bg-[#017FC8] px-4 py-[9px] text-center text-[12px] font-extraboldNunito text-white"
              >
                Message
              </Link>
              <button
                type="button"
                onClick={() => open("booking")}
                className="cursor-pointer rounded-[9px] border border-ink-200 bg-surface-page px-4 py-[9px] text-center text-[12px] font-boldNunito text-ink-600"
              >
                Book again
              </button>
            </div>
          </Card>
        ) : (
          <Card>
            <EmptyNote>
              You haven&apos;t seen a therapist yet. Book your first session and they&apos;ll
              appear here.
            </EmptyNote>
          </Card>
        )}
      </div>

      <SectionHeading className="mt-2">History</SectionHeading>
      <div className="overflow-hidden rounded-ds-lg border border-surface-line bg-white">
        {isLoading ? (
          <div className="flex flex-col gap-2 p-5">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        ) : past.length === 0 ? (
          <div className="p-5">
            <EmptyNote>No past sessions yet — your history will build up here.</EmptyNote>
          </div>
        ) : (
          past.map((s) => (
            <div
              key={s.id}
              className="flex flex-wrap items-center gap-3.5 border-b border-[#F5F5F5] px-5 py-3.5"
            >
              <span
                className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full text-[13px] font-extraboldNunito text-white"
                style={{ background: avatarColour(s.therapist_name) }}
              >
                {initialsOf(s.therapist_name)}
              </span>
              <div className="min-w-[160px] flex-1">
                <div className="text-[13px] font-boldNunito text-ink-800">{s.therapist_name}</div>
                <div className="text-[11px] text-ink-400">{pastSessionLabel(s)}</div>
              </div>
              {s.client_pre_mood && s.client_post_mood ? (
                <span className="mr-0.5 text-[15px]" title="Private — only visible to you">
                  {MOOD_BY_VALUE[s.client_pre_mood]?.emoji}→{MOOD_BY_VALUE[s.client_post_mood]?.emoji}
                </span>
              ) : null}
              <span
                className={classNames(
                  "rounded-full px-[9px] py-[3px] text-[11px] font-boldNunito",
                  s.status === "no_show"
                    ? "bg-[#FFF0F0] text-[#8B2E2E]"
                    : "bg-wellness-25 text-wellness-600"
                )}
              >
                {statusLabel(s.status)}
              </span>
              {s.status === "completed" && !s.rating ? (
                <button
                  type="button"
                  onClick={() => open("feedback", s)}
                  className="cursor-pointer rounded-[8px] border border-ink-200 bg-surface-page px-3 py-[7px] text-[11.5px] font-boldNunito text-ink-600"
                >
                  Rate session
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => open("report", s)}
                aria-label="Report this session"
                className="cursor-pointer p-1.5 text-ink-300"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      <div className="rounded-[12px] bg-[#EEF4FC] px-4 py-3 text-[12px] leading-[1.6] text-brand-600">
        Cancellation policy: full refund up to 24 hours before your session, 50% refund
        within 24 hours, no refund for no-shows.
      </div>
    </>
  );
};

/* ── CHECK-INS & MOOD ─────────────────────────────────────────────────────── */

export const EmployeeCheckins = () => {
  const { showToast } = useEmployee();

  const { data: today } = useGetMoodTodayQuery();
  const { data: summary, isLoading: summaryLoading } = useGetMoodSummaryQuery(14);
  const { data: historyPage, isLoading: historyLoading } = useGetMoodHistoryQuery({ per_page: 6 });
  const [saveCheckin, { isLoading: isSaving }] = useSaveMoodCheckinMutation();

  const [mood, setMood] = useState(null);
  const [factors, setFactors] = useState([]);

  const factorOptions = today?.factors ?? [];
  const recent = historyPage?.data ?? [];
  const savedToday = !!today?.checked_in;
  const bars = summary?.series ?? [];

  // Seed the picker from today's entry so re-visiting the page shows what was
  // already logged rather than an empty form.
  useEffect(() => {
    if (today?.checkin) {
      setMood(MOOD_BY_VALUE[today.checkin.mood]?.key ?? null);
      setFactors(today.checkin.factors ?? []);
    }
  }, [today?.checkin?.date]); // eslint-disable-line react-hooks/exhaustive-deps

  const stats = [
    { value: String(summary?.streak ?? 0), label: "day streak", accent: "#3BA88F" },
    { value: moodEmojiForAverage(summary?.average_mood), label: "avg mood", accent: "#017FC8" },
    {
      value: `${summary?.days_logged ?? 0} / ${summary?.window_days ?? 14}`,
      label: "days logged",
      accent: "#141B34",
    },
    {
      value:
        summary?.month_delta_percent === null || summary?.month_delta_percent === undefined
          ? "—"
          : `${summary.month_delta_percent > 0 ? "+" : ""}${summary.month_delta_percent}%`,
      label: "vs last month",
      accent: "#1F8A5B",
    },
  ];

  const save = async () => {
    if (!mood) {
      showToast("Pick how you're feeling first");
      return;
    }

    const value = MOODS.find((m) => m.key === mood)?.value;

    try {
      await saveCheckin({ mood: value, factors }).unwrap();
      showToast("Check-in saved — private to you");
    } catch {
      showToast("Couldn't save that just now — please try again");
    }
  };

  return (
    <>
      {/* stats strip */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((k) => (
          <StatCard key={k.label} {...k} />
        ))}
      </div>

      {/* daily check-in with factors */}
      <Card>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <CardTitle>How are you feeling today?</CardTitle>
            <CardSub>A quick daily check-in — takes 5 seconds, seen only by you</CardSub>
          </div>
          {savedToday ? <SavedPill>✓ Saved today</SavedPill> : null}
        </div>

        <div className="mb-[18px]">
          <MoodPicker options={MOODS} value={mood} onPick={setMood} />
        </div>

        <div className="mb-2.5 text-[12px] font-boldNunito text-navy-800">
          What&apos;s affecting your mood?{" "}
          <span className="font-regularNunito text-ink-400">(optional)</span>
        </div>
        <div className="mb-[18px] flex flex-wrap gap-2">
          {factorOptions.map((f) => {
            const on = factors.includes(f.key);
            return (
              <button
                key={f.key}
                type="button"
                aria-pressed={on}
                onClick={() =>
                  setFactors((prev) =>
                    prev.includes(f.key) ? prev.filter((x) => x !== f.key) : [...prev, f.key]
                  )
                }
                className={classNames(
                  "inline-flex cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] px-[13px] py-2 text-[12.5px] font-boldNunito",
                  on
                    ? "border-[#017FC8] bg-[#EEF4FC] text-[#015C94]"
                    : "border-surface-line bg-white text-[#5B6577]"
                )}
              >
                <span>{FACTOR_EMOJI[f.key]}</span>
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="rounded-[10px] bg-[#F8F9FC] px-3.5 py-[11px] text-[12px] leading-[1.6] text-ink-600">
          {mood
            ? MOOD_MESSAGES[mood]
            : "Pick a mood above and we’ll check in with a short note."}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={save}
            disabled={isSaving}
            className={classNames(
              "h-[46px] rounded-[11px] px-[22px] text-[13px] font-extraboldNunito text-white",
              mood && !isSaving ? "cursor-pointer bg-[#3BA88F]" : "cursor-not-allowed bg-[#C7CEDA]"
            )}
          >
            {isSaving ? "Saving…" : "Save check-in"}
          </button>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <CardTitle>Your mood trend</CardTitle>
              <CardSub>Last {summary?.window_days ?? 14} days · visible only to you</CardSub>
            </div>
            {summary?.month_delta_percent > 0 ? (
              <span className="shrink-0 rounded-full bg-wellness-25 px-[11px] py-1 text-[11px] font-boldNunito text-wellness-600">
                ▲ Trending up
              </span>
            ) : null}
          </div>
          <div className="flex h-[110px] items-end gap-1.5 px-0.5">
            {summaryLoading
              ? Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className="flex h-full flex-1 items-end">
                    <Skeleton className="h-1/2 w-full" />
                  </div>
                ))
              : bars.map((point, i) => (
                  <div key={point.date} className="flex h-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-[3px]"
                      title={point.mood ? `${point.date}: ${MOOD_BY_VALUE[point.mood]?.label}` : point.date}
                      style={{
                        /* 1–5 mapped onto 20–100% so a "Rough" day is still a
                           visible bar rather than nothing at all. */
                        height: point.mood ? `${(point.mood / 5) * 100}%` : "4%",
                        background: point.mood
                          ? i === bars.length - 1
                            ? "#017FC8"
                            : "#D1EEFE"
                          : "#F0F0F2",
                      }}
                    />
                  </div>
                ))}
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-[10px] text-ink-300">
              {bars[0] ? checkinDayLabel(bars[0].date) : ""}
            </span>
            <span className="text-[10px] text-ink-300">
              {bars.length ? checkinDayLabel(bars[bars.length - 1].date) : ""}
            </span>
          </div>
        </Card>

        <Card className="!border-none !bg-[linear-gradient(135deg,#141B34,#1A2E5A)]">
          <div className="mb-2.5 text-[11px] font-boldNunito tracking-[0.06em] text-white/50">
            STREAK
          </div>
          <div className="mb-0.5 text-[34px] font-blackNunito text-white">
            {summary?.streak ?? 0} day{(summary?.streak ?? 0) === 1 ? "" : "s"}
          </div>
          <div className="mb-4 text-[12px] text-white/50">
            {(summary?.streak ?? 0) > 0 ? "Keep it up" : "Check in today to start one"}
          </div>
          <div className="text-[11px] leading-[1.6] text-white/40">
            Detailed journaling and full mood history live in the mobile app.
          </div>
        </Card>
      </div>

      {/* top factors + recent check-ins */}
      <div className="grid items-start gap-4 xl:grid-cols-[1fr_1.6fr]">
        <Card>
          <div className="mb-[3px] text-body font-extraboldNunito text-navy-800">
            What&apos;s driving your mood
          </div>
          <CardSub className="mb-4">
            Most-logged factors · last {summary?.window_days ?? 14} days
          </CardSub>
          <div className="flex flex-col gap-3.5">
            {(summary?.top_factors ?? []).length === 0 ? (
              <EmptyNote>Tag what&apos;s affecting your mood and patterns show up here.</EmptyNote>
            ) : (
              summary.top_factors.map((f, i) => (
                <div key={f.key}>
                  <div className="mb-1.5 flex justify-between gap-3">
                    <span className="text-[12.5px] font-boldNunito text-[#3E4A52]">{f.label}</span>
                    <span className="text-[12px] text-ink-400">{f.percent}%</span>
                  </div>
                  <div className="h-1.5 rounded-[3px] bg-ink-100">
                    <div
                      className="h-1.5 rounded-[3px]"
                      style={{
                        width: `${f.percent}%`,
                        background: ["#017FC8", "#6B44A8", "#3BA88F"][i] ?? "#017FC8",
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <div className="mb-3.5 text-body font-extraboldNunito text-navy-800">
            Recent check-ins
          </div>
          <div className="flex flex-col">
            {historyLoading ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
            ) : recent.length === 0 ? (
              <EmptyNote>Nothing logged yet — your first check-in will show up here.</EmptyNote>
            ) : (
              recent.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3.5 border-b border-[#F5F5F5] py-[11px] last:border-b-0"
                >
                  <span className="shrink-0 text-[24px]">{MOOD_BY_VALUE[c.mood]?.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] font-boldNunito text-ink-800">
                      {checkinDayLabel(c.date)} · {MOOD_BY_VALUE[c.mood]?.label}
                    </div>
                    <div className="text-[11px] leading-[1.4] text-ink-400">
                      {c.note ?? "Logged how I'm feeling today."}
                    </div>
                  </div>
                  <span className="shrink-0 text-[10.5px] font-semiboldNunito text-[#9299A8]">
                    {c.factor_labels?.length ? c.factor_labels.join(" · ") : "No tags"}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </>
  );
};

/* ── COMMUNITY ────────────────────────────────────────────────────────────── */

export const EmployeeCommunity = () => {
  const { data: topics = [], isLoading } = useGetCommunityTrendingQuery();
  const { data: me } = useGetMeV2Query();
  const company = me?.business?.organization?.name ?? "your employer";

  return (
    <>
      <div className="flex items-center gap-2.5 rounded-[12px] border border-[#C9E2F9] bg-[#EEF4FC] px-4 py-3">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#015C94" strokeWidth="2" className="shrink-0">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span className="text-[12px] leading-[1.5] text-brand-600">
          Posting and replying happen in the mobile app under your anonymous username —
          never linked to your work account.
        </span>
      </div>

      <SectionHeading>Trending topics this week</SectionHeading>

      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[120px]" />)
          : topics.map((t, i) => {
              const chip = TOPIC_CHIP_PALETTE[i % TOPIC_CHIP_PALETTE.length];
              return (
                <Card key={t.category_id} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="rounded-full px-2.5 py-1 text-[11px] font-boldNunito"
                      style={{ background: chip.chipBg, color: chip.chipFg }}
                    >
                      {t.name}
                    </span>
                    <span className="text-[11px] text-ink-400">{t.posts} posts</span>
                  </div>
                  <div className="text-[13px] leading-[1.5] text-ink-600">&quot;{t.snippet}&quot;</div>
                  <div className="text-[11px] text-ink-300">— anonymous · {t.time_ago}</div>
                </Card>
              );
            })}
      </div>

      {!isLoading && topics.length === 0 ? (
        <EmptyNote>
          Nothing trending this week yet. The community is most active in the mobile app —
          and nothing there is ever linked to {company}.
        </EmptyNote>
      ) : null}

      <a
        href="https://play.google.com/store/apps/details?id=com.talkamtech.app"
        target="_blank"
        rel="noreferrer"
        className="flex h-12 items-center justify-center gap-2 rounded-[12px] bg-navy-800 text-[13px] font-extraboldNunito text-white"
      >
        Continue the conversation on the app →
      </a>
    </>
  );
};

/* ── MESSAGES ─────────────────────────────────────────────────────────────── */

export const EmployeeMessages = () => {
  const { data: me } = useGetMeV2Query();
  const { data: conversationPage, isLoading } = useGetConversationsQuery();
  const [active, setActive] = useState(null);
  const [draft, setDraft] = useState("");
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  const company = me?.business?.organization?.name ?? "Your employer";
  const threads = conversationPage?.data ?? [];
  const activeId = active ?? threads[0]?.id ?? null;
  const activeThread = threads.find((t) => t.id === activeId) ?? null;

  const { data: messagePage } = useGetMessagesQuery(activeId, { skip: !activeId });
  const messages = messagePage?.data ?? [];

  const send = async (e) => {
    e.preventDefault();
    if (!draft.trim() || !activeId) return;

    try {
      await sendMessage({ conversation_id: activeId, message: draft.trim() }).unwrap();
      setDraft("");
    } catch {
      /* The thread stays as-is; the composer keeps the text so nothing is lost. */
    }
  };

  return (
    <>
      <div className="flex items-center gap-2.5 rounded-[12px] border border-[#E3D5FF] bg-[#F5F0FF] px-4 py-3">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B44A8" strokeWidth="2" className="shrink-0">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        </svg>
        <span className="text-[12px] leading-[1.5] text-[#5A3990]">
          End-to-end encrypted. {company} can see that messages were sent (daily/weekly
          totals only) — never who, when in detail, or what.
        </span>
      </div>

      <div className="flex flex-col overflow-hidden rounded-ds-lg border border-surface-line bg-white lg:h-[460px] lg:flex-row">
        <div className="shrink-0 overflow-y-auto border-b border-ink-100 lg:w-[260px] lg:border-b-0 lg:border-r">
          {isLoading ? (
            <div className="flex flex-col gap-2 p-3.5">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          ) : threads.length === 0 ? (
            <div className="p-3.5">
              <EmptyNote>No conversations yet — message your therapist after a session.</EmptyNote>
            </div>
          ) : (
            threads.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActive(t.id)}
                className={classNames(
                  "flex w-full cursor-pointer items-center gap-2.5 border-l-[3px] px-3.5 py-3 text-left",
                  activeId === t.id
                    ? "border-l-[#017FC8] bg-[#EEF4FC]"
                    : "border-l-transparent bg-transparent"
                )}
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-extraboldNunito text-white"
                  style={{ background: avatarColour(t.other_member?.name ?? String(t.id)) }}
                >
                  {initialsOf(t.other_member?.name ?? "")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-boldNunito text-ink-800">
                    {t.other_member?.name ?? "TalkAM"}
                  </span>
                  <span className="block truncate text-[11px] text-ink-400">
                    {t.last_message?.message ?? "No messages yet"}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-2.5 border-b border-ink-100 px-[18px] py-3.5">
            <span
              className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-[12px] font-extraboldNunito text-white"
              style={{ background: avatarColour(activeThread?.other_member?.name ?? "") }}
            >
              {initialsOf(activeThread?.other_member?.name ?? "")}
            </span>
            <div>
              <div className="text-[13px] font-extraboldNunito text-navy-800">
                {activeThread?.other_member?.name ?? "Select a conversation"}
              </div>
              {activeThread ? <div className="text-[10px] text-[#3BA88F]">● Online</div> : null}
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-[18px]">
            {messages.length === 0 ? (
              <EmptyNote>
                {activeThread
                  ? "No messages in this conversation yet."
                  : "Pick a conversation to read it."}
              </EmptyNote>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={classNames(
                    "max-w-[70%] px-3.5 py-2.5 text-[13px]",
                    m.sender_id === me?.id
                      ? "self-end rounded-[14px_14px_3px_14px] bg-[#017FC8] text-white"
                      : "self-start rounded-[14px_14px_14px_3px] bg-[#F0F0F2] text-ink-800"
                  )}
                >
                  {m.message}
                </div>
              ))
            )}
          </div>

          <form className="flex gap-2.5 border-t border-ink-100 px-[18px] py-3.5" onSubmit={send}>
            <input
              placeholder="Write a message…"
              aria-label="Write a message"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={!activeId}
              className="h-[42px] flex-1 rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px] text-ink-800"
            />
            <button
              type="submit"
              disabled={!activeId || isSending || !draft.trim()}
              className="cursor-pointer rounded-[10px] bg-[#017FC8] px-[18px] text-[13px] font-boldNunito text-white disabled:cursor-not-allowed disabled:bg-[#C7CEDA]"
            >
              {isSending ? "…" : "Send"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

/* ── PROFILE & PRIVACY ────────────────────────────────────────────────────── */

export const EmployeeProfile = () => {
  const { open, showToast } = useEmployee();

  const { data: me } = useGetMeV2Query();
  const { data: consentState } = useGetConsentsQuery();
  const { data: privacy } = useGetPrivacySettingsQuery();
  const [saveConsents] = useSaveConsentsMutation();
  const [savePrivacy] = useSavePrivacySettingsMutation();
  const [updateProfile, { isLoading: isSavingProfile }] = useUpdateProfileMutation();

  const [fullName, setFullName] = useState("");

  const serverName = me?.name ?? "";
  useEffect(() => setFullName(serverName), [serverName]);

  const twoFa = !!privacy?.two_factor_enabled;

  const toggleConsent = async (key, next) => {
    try {
      await saveConsents({
        consents: CONSENT_ORDER.reduce(
          (acc, k) => ({ ...acc, [k]: k === key ? next : !!consentState?.[k]?.granted }),
          {}
        ),
      }).unwrap();
      showToast("Privacy settings updated");
    } catch {
      showToast("Couldn't update that just now — please try again");
    }
  };

  const toggleTwoFa = async () => {
    if (twoFa) {
      try {
        await savePrivacy({ ...privacy, two_factor_enabled: false }).unwrap();
        showToast("Two-factor authentication disabled");
      } catch {
        showToast("Couldn't update that just now — please try again");
      }
      return;
    }

    open("twoFactorEnable", {
      email: me?.email,
      onConfirm: (otp) => savePrivacy({ ...privacy, two_factor_enabled: true, otp }).unwrap(),
    });
  };

  const saveProfile = async () => {
    try {
      await updateProfile({ full_name: fullName }).unwrap();
      showToast("Profile saved");
    } catch {
      showToast("Couldn't save your profile just now — please try again");
    }
  };

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {/* Profile */}
      <Card>
        <div className="mb-3.5 text-body font-extraboldNunito text-navy-800">Profile</div>
        <div className="flex flex-col gap-3">
          <div>
            <label
              htmlFor="employee-full-name"
              className="mb-[5px] block text-[11px] font-boldNunito text-ink-400"
            >
              Full Name
            </label>
            <input
              id="employee-full-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="flex h-[42px] w-full items-center rounded-[10px] border-[1.5px] border-ink-200 px-[13px] text-[13px] text-ink-800"
            />
          </div>
          <div>
            <label
              htmlFor="employee-work-email"
              className="mb-[5px] block text-[11px] font-boldNunito text-brand-400"
            >
              Work Email
            </label>
            <div
              id="employee-work-email"
              className="flex h-[42px] items-center rounded-[10px] border-[1.5px] border-[#017FC8] px-[13px] text-[13px] text-ink-800 shadow-[0_0_0_3px_rgba(1,127,200,0.1)]"
            >
              {me?.email ?? ""}
            </div>
          </div>
          <div>
            <span className="mb-[5px] block text-[11px] font-boldNunito text-ink-400">
              Community Username
            </span>
            <div className="flex h-[42px] items-center justify-between gap-2 rounded-[10px] border-[1.5px] border-ink-200 px-[13px] text-[13px] text-ink-800">
              <span>{me?.username ?? ""}</span>
              <span className="text-[10px] text-ink-300">
                Never shown to employer or therapist
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={saveProfile}
            disabled={isSavingProfile}
            className="h-[46px] cursor-pointer rounded-[12px] bg-navy-800 text-[13px] font-extraboldNunito text-white"
          >
            {isSavingProfile ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <div className="mb-1 text-body font-extraboldNunito text-navy-800">
          Privacy Settings
        </div>
        <CardSub className="mb-3.5">Your NDPA consent choices — change anytime</CardSub>
        <div className="flex flex-col">
          {CONSENT_ORDER.map((key, i) => {
            const state = consentState?.[key];
            const locked = state?.required ?? i < 2;
            const on = !!state?.granted;

            return (
              <div
                key={key}
                className={classNames(
                  "flex items-center justify-between gap-4 py-[11px]",
                  i < CONSENT_ORDER.length - 1 && "border-b border-[#F5F5F5]"
                )}
              >
                <div>
                  <div className="text-[13px] font-semiboldNunito text-ink-800">
                    {CONSENT_COPY[key].title}
                  </div>
                  <div className="text-[10.5px] text-ink-400">
                    {locked ? "Required" : "Optional"}
                  </div>
                </div>
                {locked ? (
                  <span
                    aria-label={`${CONSENT_COPY[key].title} — required`}
                    className="relative h-[22px] w-10 shrink-0 rounded-full bg-[#C4C8D4]"
                  >
                    <span className="absolute right-0.5 top-0.5 h-[18px] w-[18px] rounded-full bg-white" />
                  </span>
                ) : (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on}
                    aria-label={CONSENT_COPY[key].title}
                    onClick={() => toggleConsent(key, !on)}
                    className={classNames(
                      "relative h-[22px] w-10 shrink-0 cursor-pointer rounded-full transition-colors",
                      on ? "bg-[#3BA88F]" : "bg-ink-200"
                    )}
                  >
                    <span
                      className={classNames(
                        "absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white transition-all",
                        on ? "right-0.5" : "left-0.5"
                      )}
                    />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Security */}
      <Card>
        <div className="mb-1 text-body font-extraboldNunito text-navy-800">Security</div>
        <CardSub className="mb-3.5">Add an extra step to keep your account safe</CardSub>
        <div className="flex items-center justify-between gap-4 py-[11px]">
          <div className="max-w-[230px]">
            <div className="text-[13px] font-semiboldNunito text-ink-800">
              Two-factor authentication
            </div>
            <div className="text-[10.5px] text-ink-400">
              Email a one-time code to your work email at every sign-in
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={twoFa}
            aria-label="Two-factor authentication"
            onClick={toggleTwoFa}
            className={classNames(
              "relative h-[22px] w-10 shrink-0 cursor-pointer rounded-full transition-colors",
              twoFa ? "bg-[#3BA88F]" : "bg-ink-200"
            )}
          >
            <span
              className={classNames(
                "absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.15)] transition-all",
                twoFa ? "left-5" : "left-0.5"
              )}
            />
          </button>
        </div>
        {twoFa ? (
          <div className="mt-2 flex gap-2 rounded-[10px] bg-wellness-25 px-3 py-2.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1F6B59" strokeWidth="2" className="mt-px shrink-0">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span className="text-[11px] leading-[1.55] text-wellness-600">
              2FA is on — a 6-digit code is emailed to you each time you sign in.
            </span>
          </div>
        ) : null}
      </Card>

      {/* Safety */}
      <Card>
        <div className="mb-1 text-body font-extraboldNunito text-navy-800">Safety</div>
        <CardSub className="mb-3.5">Something wasn&apos;t right in a session or chat?</CardSub>
        <button
          type="button"
          onClick={() => open("report")}
          className="w-full cursor-pointer rounded-[10px] border border-ink-200 bg-surface-page p-3 text-left text-[13px] font-boldNunito text-ink-600"
        >
          Report a therapist or a session
        </button>
      </Card>

      {/* Danger Zone */}
      <Card className="!border-[#FFCDD2]">
        <div className="mb-1 text-body font-extraboldNunito text-[#8B2E2E]">Danger Zone</div>
        <CardSub className="mb-3.5">Permanent — cannot be undone</CardSub>
        <button
          type="button"
          onClick={() => open("deleteAccount")}
          className="w-full cursor-pointer rounded-[10px] bg-[#AC4242] p-3 text-center text-[13px] font-boldNunito text-white"
        >
          Delete my account
        </button>
      </Card>
    </div>
  );
};

/* ── HELP & SUPPORT ───────────────────────────────────────────────────────── */

export const EmployeeHelp = () => {
  const { data: me } = useGetMeV2Query();
  const { data: categories, isLoading } = useGetFaqsQuery();
  const company = me?.business?.organization?.name ?? "your employer";

  /* The v1 FAQ endpoint returns categories each holding their questions; the
     deck shows one flat accordion. */
  // `/user/faqs` returns every category; the employee Help screen shows only
  // the employee set (the therapist dashboard adds its own category).
  const faqs = (categories ?? [])
    .filter((c) => c.name === "Employee Dashboard")
    .flatMap((c) => c.faq ?? []);

  return (
    <>
      <div className="grid items-start gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-4">
          <Card>
            <div className="mb-1 text-body font-extraboldNunito text-navy-800">
              Frequently asked questions
            </div>
            <div className="mb-3.5 text-[12px] text-ink-400">
              Quick answers before you reach out — most things are covered here.
            </div>
            <div className="flex flex-col gap-2">
              {isLoading ? (
                <>
                  <Skeleton className="h-12" />
                  <Skeleton className="h-12" />
                  <Skeleton className="h-12" />
                </>
              ) : faqs.length === 0 ? (
                <EmptyNote>
                  No FAQs published yet — use the contact options on the right and we&apos;ll
                  help directly.
                </EmptyNote>
              ) : (
                faqs.map((f) => (
                  <details
                    key={f.id}
                    className="rounded-[12px] border border-[#EEEEEE] bg-[#F8F9FC] px-4 py-[13px]"
                  >
                    <summary className="cursor-pointer list-none text-[13px] font-boldNunito text-navy-800 [&::-webkit-details-marker]:hidden">
                      {f.question}
                    </summary>
                    <p className="mb-0 mt-2.5 text-[12.5px] leading-[1.65] text-[#5B6577]">
                      {f.answer}
                    </p>
                  </details>
                ))
              )}
            </div>
          </Card>

          <Card>
            <div className="mb-1 text-body font-extraboldNunito text-navy-800">
              Knowledge base
            </div>
            <div className="mb-3.5 text-[12px] text-ink-400">
              Guides and walkthroughs — powered by our Informly help center.
            </div>
            <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-dashed border-[#C9CEDA] bg-[#FAFBFD] p-6 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-[#EEF4FC]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#017FC8" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </span>
              <div className="text-[12.5px] font-boldNunito text-ink-600">
                Informly knowledge base embed
              </div>
              <div className="max-w-[320px] text-[11px] leading-[1.6] text-[#9299A8]">
                Reserved for the Informly widget (help center + live chat). Swap this
                placeholder for the real embed script when ready.
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <div className="mb-2.5 text-body font-extraboldNunito text-navy-800">
              Still need help?
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5 rounded-[12px] border border-[#EEEEEE] bg-[#F8F9FC] px-3.5 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[#017FC8]">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </span>
                <div>
                  <div className="text-[12.5px] font-boldNunito text-navy-800">Live chat</div>
                  <div className="text-[11px] text-ink-400">
                    Informly widget · replies in minutes
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-[12px] border border-[#EEEEEE] bg-[#F8F9FC] px-3.5 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[#3BA88F]">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                    <path d="M4 4h16v16H4z" />
                    <path d="M22 6l-10 7L2 6" />
                  </svg>
                </span>
                <div>
                  <div className="text-[12.5px] font-boldNunito text-navy-800">
                    support@talkam.net
                  </div>
                  <div className="text-[11px] text-ink-400">Replies within 1 business day</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="!border-[rgba(59,168,143,0.25)] !bg-[rgba(59,168,143,0.1)]">
            <div className="mb-1.5 text-[13px] font-extraboldNunito text-wellness-600">
              Private by default
            </div>
            <div className="text-[11.5px] leading-[1.7] text-[#3E5C54]">
              Support requests you send here are never visible to {company} — only TalkAM
              staff can see them, same as your sessions and messages.
            </div>
          </Card>
        </div>
      </div>

      {/* Deck: fixed Informly launcher */}
      <button
        type="button"
        title="Informly widget launcher — replace with real embed"
        aria-label="Open live chat"
        className="fixed bottom-7 right-7 z-[200] flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full bg-[#017FC8] shadow-[0_10px_28px_rgba(1,127,200,0.4)]"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </button>
    </>
  );
};

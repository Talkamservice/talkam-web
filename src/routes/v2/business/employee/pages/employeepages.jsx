import { useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import * as Icon from "react-feather";
import {
  Card,
  PanelCard,
  Badge,
  Toggle,
  InfoStrip,
  PrimaryButton,
  SecondaryButton,
} from "../../../../../components/v2/dashboard/chrome";
import { DsAccordion } from "../../../../../components/v2/accordion";
import { StoreBadges } from "../../../../../components/v2/storebadges";
import { useEmployee } from "../employeelayout";
import { MoodRow } from "../employeemodals";
import { V2 } from "../../../../../constants/v2routes";
import {
  MOODS,
  MOOD_MESSAGES,
  CHECKIN_FACTORS,
  nextSession,
  moodTrend,
  wellbeingSnapshot,
  recentCheckins,
  topFactors,
  upcomingSessions,
  pastSessions,
  careTeam,
  prepChecklist,
  communityGroups,
  messageThreads,
  consentToggles,
  notificationPrefs,
  wellnessResources,
  employeeFaqs,
} from "../../../../../fakedata/v2/employee";

/** All seven employee dashboard pages. */

const PrivacyStrip = () => (
  <InfoStrip tone="purple" icon={<Icon.Shield size={15} className="shrink-0" />}>
    Everything you do on TalkAM — sessions, mood check-ins, chats, community posts —
    stays private. Zenith Bank only ever sees anonymised, company-wide totals.
  </InfoStrip>
);

const NextSessionCard = () => {
  const { open } = useEmployee();
  return (
    <div className="relative overflow-hidden rounded-ds-lg bg-[linear-gradient(135deg,#141B34,#1A2E5A)] p-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 h-[140px] w-[140px] rounded-full bg-[radial-gradient(circle,rgba(1,127,200,0.28)_0%,transparent_65%)]"
      />
      <div className="relative z-[1]">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-wellness-400" />
          <span className="text-[10px] font-boldNunito tracking-[0.08em] text-white/60">
            NEXT SESSION
          </span>
        </div>
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-400 text-body font-extraboldNunito text-white">
            {nextSession.initials}
          </span>
          <div className="min-w-0">
            <div className="text-[15px] font-extraboldNunito text-white">
              {nextSession.therapist}
            </div>
            <div className="text-[11.5px] text-white/60">
              {nextSession.typeLabel} · {nextSession.whenLabel}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => open("reschedule")}
            className="cursor-pointer rounded-[9px] border border-white/[0.14] bg-white/[0.08] px-3.5 py-2 text-caption font-boldNunito text-white/70"
          >
            Reschedule
          </button>
          <button
            type="button"
            onClick={() => open("cancel")}
            className="cursor-pointer rounded-[9px] border border-white/[0.14] bg-white/[0.08] px-3.5 py-2 text-caption font-boldNunito text-white/70"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => open("preSessionMood")}
            className="cursor-pointer rounded-[9px] bg-brand-400 px-3.5 py-2 text-caption font-extraboldNunito text-white hover:bg-brand-600"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── HOME ─────────────────────────────────────────────────────────────── */

export const EmployeeHome = () => {
  const { open, showToast, homeMood, setHomeMood } = useEmployee();

  return (
    <>
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-h2 font-extraboldNunito text-navy-800">
            Good morning, Chidinma
          </span>
        </div>
        <p className="text-[13px] text-ink-500">
          Here&apos;s your space today — take a moment for yourself.
        </p>
      </div>

      <PrivacyStrip />

      {/* Inline daily check-in */}
      <Card>
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="text-body font-extraboldNunito text-navy-800">
              How are you feeling today?
            </div>
            <div className="text-[11px] text-ink-400">
              A 5-second check-in — private to you
            </div>
          </div>
          {homeMood ? (
            <Badge tone="green" dot>
              Logged today
            </Badge>
          ) : null}
        </div>
        <MoodRow
          value={homeMood}
          onPick={(k) => {
            setHomeMood(k);
            showToast("Check-in logged — thanks for showing up for yourself");
          }}
        />
        {homeMood ? (
          <p className="mt-3 rounded-ds-md bg-wellness-50 px-3.5 py-3 text-caption leading-[1.6] text-wellness-600">
            {MOOD_MESSAGES[homeMood]}
          </p>
        ) : null}
      </Card>

      <div className="grid gap-3.5 xl:grid-cols-[1.4fr_1fr]">
        <NextSessionCard />

        <Card>
          <div className="mb-1 text-body font-extraboldNunito text-navy-800">
            Get the TalkAM app
          </div>
          <p className="mb-3.5 text-[11.5px] text-ink-400">
            Community, chat &amp; mood tracking live on mobile
          </p>
          <StoreBadges />
        </Card>
      </div>

      {/* Wellbeing snapshot */}
      <Card>
        <div className="mb-1 text-body font-extraboldNunito text-navy-800">
          Wellbeing snapshot
        </div>
        <div className="mb-4 text-[11px] text-ink-400">Last 14 days · private to you</div>

        <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Check-in streak", value: `${wellbeingSnapshot.streak} days` },
            { label: "Average mood", value: wellbeingSnapshot.averageMood },
            { label: "Days logged", value: String(wellbeingSnapshot.daysLogged) },
            { label: "vs last month", value: wellbeingSnapshot.monthDelta, tone: "text-wellness-400" },
          ].map((s) => (
            <div key={s.label} className="rounded-ds-md bg-ink-50 p-3">
              <div className={classNames("text-h3 font-extraboldNunito", s.tone || "text-navy-800")}>
                {s.value}
              </div>
              <div className="text-[10.5px] text-ink-400">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex h-[90px] items-end gap-1.5">
          {moodTrend.map((h, i) => (
            <div key={i} className="flex h-full flex-1 items-end">
              <div
                className={classNames(
                  "w-full rounded-t-[3px]",
                  i === moodTrend.length - 1 ? "bg-brand-400" : "bg-brand-50"
                )}
                style={{ height: `${h}%` }}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Quick links + resources */}
      <div className="grid gap-3.5 lg:grid-cols-3">
        {[
          { to: `${V2.employee}/checkins`, title: "Daily check-in", note: "How are you feeling today?", icon: <Icon.Activity size={17} className="text-signal-error" />, bg: "bg-surface-errorTint" },
          { to: `${V2.employee}/community`, title: "Community", note: "Talk freely, anonymously", icon: <Icon.MessageSquare size={17} className="text-brand-400" />, bg: "bg-brand-25" },
          { to: `${V2.employee}/sessions`, title: "My sessions", note: "Upcoming and past", icon: <Icon.Calendar size={17} className="text-wellness-400" />, bg: "bg-wellness-50" },
        ].map((q) => (
          <Link key={q.title} to={q.to}>
            <Card className="flex h-full items-center gap-3 transition-shadow hover:shadow-e2">
              <span className={classNames("flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px]", q.bg)}>
                {q.icon}
              </span>
              <div>
                <div className="text-[13px] font-boldNunito text-navy-800">{q.title}</div>
                <div className="text-[11px] text-ink-400">{q.note}</div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <PanelCard title="Recommended for you" subtitle="From the TalkAM Journal">
        {wellnessResources.map((r) => (
          <Link
            key={r.slug}
            to={V2.blogPost(r.slug)}
            className="flex items-center gap-3 border-b border-[#F5F5F5] px-5 py-3.5 last:border-b-0 hover:bg-ink-50"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-brand-25">
              <Icon.BookOpen size={16} className="text-brand-400" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-boldNunito text-navy-800">{r.title}</div>
              <div className="text-[11px] text-ink-400">{r.meta}</div>
            </div>
            <Icon.ChevronRight size={16} className="shrink-0 text-ink-300" />
          </Link>
        ))}
      </PanelCard>
    </>
  );
};

/* ── MY SESSIONS ──────────────────────────────────────────────────────── */

export const EmployeeSessions = () => {
  const { open } = useEmployee();
  const [tab, setTab] = useState("upcoming");

  return (
    <>
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {[
          { label: "Upcoming", value: String(upcomingSessions.length) },
          { label: "Completed", value: String(pastSessions.length) },
          { label: "Used this cycle", value: `${wellbeingSnapshot.sessionsUsed} / ${wellbeingSnapshot.sessionsTotal}` },
          { label: "Mood trend", value: wellbeingSnapshot.monthDelta, tone: "text-wellness-400" },
        ].map((s) => (
          <Card key={s.label}>
            <div className={classNames("text-h2 font-extraboldNunito", s.tone || "text-navy-800")}>
              {s.value}
            </div>
            <div className="text-[11px] text-ink-400">{s.label}</div>
          </Card>
        ))}
      </div>

      <NextSessionCard />

      {/* Prep checklist */}
      <Card>
        <div className="mb-1 text-body font-extraboldNunito text-navy-800">
          Before you join
        </div>
        <div className="mb-3.5 text-[11px] text-ink-400">
          A short prep list — it makes the 50 minutes count
        </div>
        <div className="flex flex-col gap-2.5">
          {prepChecklist.map((item) => (
            <div key={item.key} className="flex items-start gap-3 rounded-ds-md bg-ink-50 p-3">
              <Icon.CheckCircle size={16} className="mt-0.5 shrink-0 text-wellness-400" />
              <div>
                <div className="text-[13px] font-boldNunito text-navy-800">{item.label}</div>
                <div className="text-[11px] text-ink-400">{item.note}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Care team */}
      <Card>
        <div className="mb-3.5 flex flex-wrap items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-400 text-h4 font-extraboldNunito text-white">
            {careTeam.initials}
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-body font-extraboldNunito text-navy-800">{careTeam.name}</div>
            <div className="text-[11.5px] text-ink-400">{careTeam.title}</div>
          </div>
          <Badge tone="gold">★ {careTeam.rating}</Badge>
        </div>
        <InfoStrip tone="blue" className="mb-3.5">
          {careTeam.continuity}
        </InfoStrip>
        <div className="flex flex-wrap gap-2">
          <SecondaryButton>
            <Icon.MessageCircle size={13} /> Message
          </SecondaryButton>
          <PrimaryButton onClick={() => open("booking")}>Book again</PrimaryButton>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex w-fit gap-1.5 rounded-[11px] border border-surface-line bg-white p-1">
        {[
          { key: "upcoming", label: `Upcoming · ${upcomingSessions.length}` },
          { key: "past", label: `Past · ${pastSessions.length}` },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            aria-pressed={tab === t.key}
            className={classNames(
              "whitespace-nowrap rounded-[8px] px-3.5 py-2 text-[13px] font-boldNunito",
              tab === t.key ? "bg-brand-400 text-white" : "cursor-pointer text-ink-500"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <PanelCard>
        {(tab === "upcoming" ? upcomingSessions : pastSessions).map((s) => (
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
            <div className="min-w-[160px] flex-1">
              <div className="text-[13px] font-boldNunito text-navy-800">{s.therapist}</div>
              <div className="text-[11px] text-ink-400">
                {s.when} ·{" "}
                <span className="font-boldNunito text-wellness-400">{s.focus}</span>
              </div>
            </div>
            <Badge tone="blue">{s.type}</Badge>
            {tab === "upcoming" ? (
              <PrimaryButton onClick={() => open("preSessionMood")}>Join</PrimaryButton>
            ) : s.rated ? (
              <span className="text-[12px] font-boldNunito text-gold-400">
                {"★".repeat(s.rating)}
              </span>
            ) : (
              <SecondaryButton onClick={() => open("feedback")}>Rate session</SecondaryButton>
            )}
          </div>
        ))}
      </PanelCard>
    </>
  );
};

/* ── CHECK-INS & MOOD ─────────────────────────────────────────────────── */

export const EmployeeCheckins = () => {
  const { showToast } = useEmployee();
  const [mood, setMood] = useState(null);
  const [factors, setFactors] = useState([]);
  const [log, setLog] = useState(recentCheckins);

  const save = () => {
    if (!mood) {
      showToast("Pick how you're feeling first");
      return;
    }
    const meta = MOODS.find((m) => m.key === mood);
    const tags = factors.length
      ? factors.map((f) => CHECKIN_FACTORS.find((c) => c.key === f).label).join(" · ")
      : "No tags";
    setLog((prev) => [
      {
        day: "Today",
        mood: meta.emoji,
        label: meta.label,
        tags,
        note: factors.length
          ? `Noted: ${tags.toLowerCase()}.`
          : "Logged how I'm feeling today.",
      },
      ...prev,
    ].slice(0, 6));
    setMood(null);
    setFactors([]);
    showToast("Check-in saved — private to you");
  };

  return (
    <>
      <PrivacyStrip />

      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {[
          { label: "Current streak", value: `${wellbeingSnapshot.streak} days` },
          { label: "Average mood", value: wellbeingSnapshot.averageMood },
          { label: "Days logged", value: String(wellbeingSnapshot.daysLogged) },
          { label: "vs last month", value: wellbeingSnapshot.monthDelta, tone: "text-wellness-400" },
        ].map((s) => (
          <Card key={s.label}>
            <div className={classNames("text-h2 font-extraboldNunito", s.tone || "text-navy-800")}>
              {s.value}
            </div>
            <div className="text-[11px] text-ink-400">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Daily check-in */}
      <Card>
        <div className="mb-1 text-body font-extraboldNunito text-navy-800">
          Today&apos;s check-in
        </div>
        <div className="mb-3.5 text-[11px] text-ink-400">
          Pick how you&apos;re feeling, then tag what&apos;s driving it
        </div>

        <MoodRow value={mood} onPick={setMood} />

        {mood ? (
          <p className="mt-3 rounded-ds-md bg-wellness-50 px-3.5 py-3 text-caption leading-[1.6] text-wellness-600">
            {MOOD_MESSAGES[mood]}
          </p>
        ) : null}

        <div className="mb-2 mt-4 text-[11px] font-boldNunito text-ink-400">
          WHAT&apos;S DRIVING IT? (OPTIONAL)
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {CHECKIN_FACTORS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() =>
                setFactors((prev) =>
                  prev.includes(f.key) ? prev.filter((x) => x !== f.key) : [...prev, f.key]
                )
              }
              aria-pressed={factors.includes(f.key)}
              className={classNames(
                "cursor-pointer rounded-full px-3.5 py-2 text-caption font-boldNunito transition-colors",
                factors.includes(f.key)
                  ? "bg-navy-800 text-white"
                  : "bg-ink-100 text-ink-500 hover:bg-ink-200"
              )}
            >
              {f.label}
              {factors.includes(f.key) ? " ✓" : ""}
            </button>
          ))}
        </div>

        <PrimaryButton onClick={save} disabled={!mood}>
          Save check-in
        </PrimaryButton>
      </Card>

      <div className="grid gap-3.5 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <div className="mb-1 text-body font-extraboldNunito text-navy-800">Mood trend</div>
          <div className="mb-4 text-[11px] text-ink-400">Last 14 days</div>
          <div className="flex h-[120px] items-end gap-1.5">
            {moodTrend.map((h, i) => (
              <div key={i} className="flex h-full flex-1 items-end">
                <div
                  className={classNames(
                    "w-full rounded-t-[3px]",
                    i === moodTrend.length - 1 ? "bg-brand-400" : "bg-brand-50"
                  )}
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-1 text-body font-extraboldNunito text-navy-800">Top factors</div>
          <div className="mb-4 text-[11px] text-ink-400">What you tag most often</div>
          <div className="flex flex-col gap-[11px]">
            {topFactors.map((f) => (
              <div key={f.label}>
                <div className="mb-1.5 flex justify-between gap-3">
                  <span className="text-caption font-semiboldNunito text-ink-800">{f.label}</span>
                  <span className="text-caption font-boldNunito" style={{ color: f.color }}>
                    {f.pct}%
                  </span>
                </div>
                <div className="h-[5px] rounded-[3px] bg-ink-100">
                  <div
                    className="h-[5px] rounded-[3px]"
                    style={{ width: `${f.pct}%`, backgroundColor: f.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <PanelCard title="Recent check-ins" subtitle="Only you can see these">
        {log.map((entry, i) => (
          <div
            key={i}
            className="flex items-start gap-3 border-b border-[#F5F5F5] px-5 py-3.5 last:border-b-0"
          >
            <span className="text-h2 leading-none">{entry.mood}</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[13px] font-boldNunito text-navy-800">{entry.day}</span>
                <Badge tone="grey">{entry.label}</Badge>
                <span className="text-[11px] text-ink-400">{entry.tags}</span>
              </div>
              <p className="mt-1 text-[12px] text-ink-500">{entry.note}</p>
            </div>
          </div>
        ))}
      </PanelCard>
    </>
  );
};

/* ── COMMUNITY ────────────────────────────────────────────────────────── */

const GROUP_TONE = {
  brand: "bg-brand-25 text-brand-400",
  teal: "bg-wellness-50 text-wellness-400",
  gold: "bg-gold-50 text-gold-600",
  purple: "bg-[#F5F0FF] text-[#6B44A8]",
};

export const EmployeeCommunity = () => (
  <>
    <InfoStrip tone="purple" icon={<Icon.Shield size={15} className="shrink-0" />}>
      You post under a pseudonym that is never linked to your work identity. Your
      employer cannot see your posts, replies, or which groups you join.
    </InfoStrip>

    <div className="grid gap-3.5 sm:grid-cols-2">
      {communityGroups.map((g) => (
        <Card key={g.name} className="flex items-center gap-3.5">
          <span
            className={classNames(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px]",
              GROUP_TONE[g.tone]
            )}
          >
            <Icon.MessageSquare size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-extraboldNunito text-navy-800">{g.name}</div>
            <div className="text-[11px] text-ink-400">
              {g.members} · {g.posts} new today
            </div>
          </div>
          <SecondaryButton className="shrink-0">Open</SecondaryButton>
        </Card>
      ))}
    </div>

    <Card className="text-center">
      <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-[14px] bg-brand-25">
        <Icon.Smartphone size={22} className="text-brand-400" />
      </span>
      <div className="mb-1 text-body font-extraboldNunito text-navy-800">
        The full community lives on mobile
      </div>
      <p className="mx-auto mb-4 max-w-[420px] text-[12.5px] leading-[1.6] text-ink-500">
        Posting, replies and group chat are richer in the TalkAM app. Sign in with this
        same account — everything carries over.
      </p>
      <StoreBadges className="justify-center" />
    </Card>
  </>
);

/* ── MESSAGES ─────────────────────────────────────────────────────────── */

export const EmployeeMessages = () => {
  const [activeId, setActiveId] = useState(messageThreads[0].id);
  const active = messageThreads.find((t) => t.id === activeId);

  return (
    <div className="grid gap-3.5 lg:grid-cols-[280px_1fr]">
      <PanelCard title="Conversations">
        {messageThreads.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveId(t.id)}
            className={classNames(
              "flex w-full cursor-pointer items-start gap-2.5 border-b border-[#F5F5F5] px-4 py-3.5 text-left last:border-b-0",
              activeId === t.id ? "bg-brand-25" : "hover:bg-ink-50"
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
              <span className="shrink-0 rounded-full bg-brand-400 px-1.5 py-0.5 text-[9px] font-boldNunito text-white">
                {t.unread}
              </span>
            ) : null}
          </button>
        ))}
      </PanelCard>

      <PanelCard title={active.name} subtitle="End-to-end encrypted · never seen by your employer">
        <div className="flex flex-col gap-3 p-5">
          {active.messages.map((m, i) => (
            <div
              key={i}
              className={classNames("flex", m.from === "me" ? "justify-end" : "justify-start")}
            >
              <div
                className={classNames(
                  "max-w-[75%] rounded-ds-md px-3.5 py-2.5",
                  m.from === "me"
                    ? "bg-brand-400 text-white"
                    : "bg-ink-50 text-ink-800"
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
          <PrimaryButton>
            <Icon.Send size={14} />
          </PrimaryButton>
        </div>
      </PanelCard>
    </div>
  );
};

/* ── PROFILE & PRIVACY ────────────────────────────────────────────────── */

export const EmployeeProfile = () => {
  const { open, showToast } = useEmployee();
  const [consents, setConsents] = useState(
    consentToggles.reduce((acc, c) => ({ ...acc, [c.key]: c.on }), {})
  );
  const [notifs, setNotifs] = useState(
    notificationPrefs.reduce((acc, n) => ({ ...acc, [n.key]: n.on }), {})
  );
  const [twoFa, setTwoFa] = useState(true);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <div className="mb-3.5 text-body font-extraboldNunito text-navy-800">
          Your consent choices
        </div>
        <div className="flex flex-col">
          {consentToggles.map((c, i) => (
            <div
              key={c.key}
              className={classNames(
                "flex items-center justify-between gap-4 py-3",
                i < consentToggles.length - 1 && "border-b border-[#F5F5F5]"
              )}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[13px] font-semiboldNunito text-ink-800">{c.title}</span>
                  {c.locked ? <Badge tone="grey">Required</Badge> : null}
                </div>
                <div className="text-[11px] text-ink-400">{c.note}</div>
              </div>
              {c.locked ? (
                <Icon.Lock size={16} className="shrink-0 text-ink-300" />
              ) : (
                <Toggle
                  on={consents[c.key]}
                  label={c.title}
                  onClick={() => {
                    setConsents((p) => ({ ...p, [c.key]: !p[c.key] }));
                    showToast("Consent updated");
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-3.5 text-body font-extraboldNunito text-navy-800">
          Notification preferences
        </div>
        <div className="flex flex-col">
          {notificationPrefs.map((n, i) => (
            <div
              key={n.key}
              className={classNames(
                "flex items-center justify-between gap-4 py-3",
                i < notificationPrefs.length - 1 && "border-b border-[#F5F5F5]"
              )}
            >
              <div>
                <div className="text-[13px] font-semiboldNunito text-ink-800">{n.title}</div>
                <div className="text-[11px] text-ink-400">{n.note}</div>
              </div>
              <Toggle
                on={notifs[n.key]}
                label={n.title}
                onClick={() => setNotifs((p) => ({ ...p, [n.key]: !p[n.key] }))}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="text-body font-extraboldNunito text-navy-800">Security</div>
        <div className="mb-3.5 text-caption text-ink-400">
          Add a second step when you sign in
        </div>
        <div className="flex items-center justify-between gap-4 py-3">
          <div className="max-w-[360px]">
            <div className="text-[13px] font-semiboldNunito text-ink-800">
              Two-factor authentication (2FA)
            </div>
            <div className="text-[11px] text-ink-400">
              A 6-digit code is emailed to your work address at every sign-in
            </div>
          </div>
          <Toggle
            on={twoFa}
            label="Two-factor authentication"
            onClick={() => {
              setTwoFa((v) => !v);
              showToast(twoFa ? "Two-factor authentication disabled" : "Two-factor authentication enabled");
            }}
          />
        </div>
      </Card>

      <Card>
        <div className="text-body font-extraboldNunito text-navy-800">Safety</div>
        <div className="mb-3.5 text-caption text-ink-400">
          Report a session or therapist — goes to TalkAM, never your employer
        </div>
        <SecondaryButton onClick={() => open("report")}>
          <Icon.Flag size={13} /> Report a concern
        </SecondaryButton>
      </Card>
    </div>
  );
};

/* ── HELP & SUPPORT ───────────────────────────────────────────────────── */

export const EmployeeHelp = () => (
  <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr] xl:items-start">
    <div className="flex flex-col gap-4">
      <InfoStrip tone="red" icon={<Icon.AlertTriangle size={15} className="shrink-0" />}>
        <strong className="font-boldNunito">In crisis right now?</strong> TalkAM is not an
        emergency service. If you are in immediate danger, contact local emergency
        services. For urgent non-emergency support, message your care team.
      </InfoStrip>

      <Card>
        <div className="mb-1 text-body font-extraboldNunito text-navy-800">
          Frequently asked questions
        </div>
        <div className="mb-3.5 text-caption text-ink-400">
          The things members ask us most
        </div>
        <DsAccordion items={employeeFaqs} />
      </Card>
    </div>

    <div className="flex flex-col gap-4">
      <Card>
        <div className="mb-2.5 text-body font-extraboldNunito text-navy-800">
          Talk to someone
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5 rounded-ds-md border border-[#EEEEEE] bg-ink-50 px-3.5 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-brand-400">
              <Icon.MessageCircle size={15} color="#fff" />
            </span>
            <div>
              <div className="text-[12.5px] font-boldNunito text-navy-800">Live chat</div>
              <div className="text-[11px] text-ink-400">Informly widget · replies in minutes</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-ds-md border border-[#EEEEEE] bg-ink-50 px-3.5 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-wellness-400">
              <Icon.Mail size={15} color="#fff" />
            </span>
            <div>
              <div className="text-[12.5px] font-boldNunito text-navy-800">support@talkam.net</div>
              <div className="text-[11px] text-ink-400">Replies within 1 business day</div>
            </div>
          </div>
        </div>
      </Card>

      <PanelCard title="Wellness reading" subtitle="From the TalkAM Journal">
        {wellnessResources.map((r) => (
          <Link
            key={r.slug}
            to={V2.blogPost(r.slug)}
            className="flex items-center gap-3 border-b border-[#F5F5F5] px-5 py-3.5 last:border-b-0 hover:bg-ink-50"
          >
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12.5px] font-boldNunito text-navy-800">
                {r.title}
              </div>
              <div className="text-[11px] text-ink-400">{r.meta}</div>
            </div>
            <Icon.ChevronRight size={15} className="shrink-0 text-ink-300" />
          </Link>
        ))}
      </PanelCard>

      <Card className="!bg-navy-800">
        <div className="mb-1.5 text-[13px] font-extraboldNunito text-white">
          Your privacy, always
        </div>
        <p className="text-[11.5px] leading-[1.7] text-white/55">
          Support staff cannot read your sessions, messages, mood entries or community
          posts. Neither can your employer.
        </p>
      </Card>
    </div>
  </div>
);

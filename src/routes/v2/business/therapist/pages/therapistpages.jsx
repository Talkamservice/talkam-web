import { useState } from "react";
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
import { useTherapist } from "../therapistlayout";
import {
  nextSession,
  attentionItems,
  therapistKpis,
  continuityClients,
  latestReview,
  selfCareNudge,
  upcomingSessions,
  pastSessions,
  sessionRequests,
  WEEK_DAYS,
  initialDays,
  initialSlots,
  CANDIDATE_TIMES,
  analyticsRanges,
  analyticsByRange,
  ratingBreakdown,
  busiestSlots,
  earnings,
  therapistMessageThreads,
  therapistProfile,
  therapistNotifPrefs,
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

const ATTENTION_TONE = {
  gold: "bg-gold-50 text-gold-600",
  blue: "bg-brand-25 text-brand-400",
  purple: "bg-[#F5F0FF] text-[#6B44A8]",
};

export const TherapistHome = () => {
  const { open, resolved } = useTherapist();
  const outstanding = attentionItems.filter((i) => !resolved.includes(i.key));

  return (
    <>
      <div>
        <div className="text-h2 font-extraboldNunito text-navy-800">
          Good morning, Dr. Okafor
        </div>
        <p className="text-[13px] text-ink-500">
          You have {upcomingSessions.filter((s) => s.when.startsWith("Today")).length} sessions
          today · next one starts soon
        </p>
      </div>

      {/* Next session hero */}
      <div className="relative overflow-hidden rounded-ds-lg bg-[linear-gradient(120deg,#124034,#3BA88F)] p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-8 h-[180px] w-[180px] rounded-full bg-white/10"
        />
        <div className="relative z-[1]">
          <div className="mb-3 text-[10px] font-extraboldNunito tracking-[0.08em] text-white/70">
            NEXT SESSION · {nextSession.countdown.toUpperCase()}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-[220px]">
              <div className="text-h3 font-extraboldNunito text-white">{nextSession.client}</div>
              <div className="mt-1 text-[12px] text-white/75">
                {nextSession.sessionNumber} · {nextSession.format} · Focus:{" "}
                {nextSession.focus}
              </div>
              <div className="mt-2 max-w-[460px] rounded-ds-md bg-white/[0.14] px-3 py-2 text-[11.5px] leading-[1.5] text-white/85">
                Last session: {nextSession.lastNote}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => open("notes")}
                className="cursor-pointer rounded-[9px] border border-white/25 bg-white/[0.14] px-3.5 py-2 text-caption font-boldNunito text-white"
              >
                Message
              </button>
              <button
                type="button"
                onClick={() => open("joinConfirm", nextSession)}
                className="cursor-pointer rounded-[9px] bg-white px-4 py-2 text-caption font-extraboldNunito text-[#124034]"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Needs your attention */}
      <PanelCard
        title="Needs your attention"
        subtitle={outstanding.length ? "Clear these before your next session" : undefined}
      >
        {outstanding.length ? (
          outstanding.map((item) => (
            <div
              key={item.key}
              className="flex flex-wrap items-center gap-3 border-b border-[#F5F5F5] px-5 py-3.5 last:border-b-0"
            >
              <span
                className={classNames(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]",
                  ATTENTION_TONE[item.tone]
                )}
              >
                <Icon.AlertCircle size={16} />
              </span>
              <div className="min-w-[160px] flex-1">
                <div className="text-[13px] font-boldNunito text-navy-800">{item.label}</div>
                <div className="text-[11px] text-ink-400">{item.note}</div>
              </div>
              <SecondaryButton
                onClick={() =>
                  open(
                    item.key === "notes"
                      ? "notes"
                      : item.key === "reschedule"
                        ? "rescheduleReq"
                        : "notes"
                  )
                }
              >
                {item.cta}
              </SecondaryButton>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-wellness-50">
              <Icon.Check size={22} className="text-wellness-400" />
            </span>
            <div className="text-body font-extraboldNunito text-navy-800">All caught up</div>
            <p className="text-caption text-ink-400">
              Nothing pending — enjoy the clear runway.
            </p>
          </div>
        )}
      </PanelCard>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {therapistKpis.map((kpi) => (
          <Card key={kpi.label}>
            <div className="text-[10px] font-boldNunito tracking-[0.06em] text-ink-400">
              {kpi.label}
            </div>
            <div
              className={classNames(
                "mt-1 text-h2 font-extraboldNunito",
                kpi.valueTone || "text-navy-800"
              )}
            >
              {kpi.value}
            </div>
            <div className={classNames("text-[11px]", kpi.deltaTone)}>{kpi.delta}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-3.5 xl:grid-cols-[1.3fr_1fr]">
        <PanelCard title="Continuity of care" subtitle="Clients you're seeing again">
          {continuityClients.map((c) => (
            <div
              key={c.name}
              className="flex flex-wrap items-center gap-3 border-b border-[#F5F5F5] px-5 py-3.5 last:border-b-0"
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-caption font-extraboldNunito text-white"
                style={{ background: c.avatarBg }}
              >
                {c.initials}
              </span>
              <div className="min-w-[140px] flex-1">
                <div className="text-[13px] font-boldNunito text-navy-800">{c.name}</div>
                <div className="text-[11px] text-ink-400">
                  {c.sessions} sessions · {c.focus}
                </div>
              </div>
              <Badge tone="green">Next {c.next}</Badge>
            </div>
          ))}
        </PanelCard>

        <div className="flex flex-col gap-3.5">
          <Card>
            <div className="mb-2 text-body font-extraboldNunito text-navy-800">
              Latest review
            </div>
            <div className="mb-2 text-gold-400">{"★".repeat(latestReview.stars)}</div>
            <p className="mb-2 text-[13px] leading-[1.6] text-ink-600">
              &ldquo;{latestReview.text}&rdquo;
            </p>
            <div className="text-[11px] text-ink-400">{latestReview.meta}</div>
          </Card>

          <Card className="!border-wellness-200 !bg-wellness-50">
            <div className="mb-1.5 flex items-center gap-2">
              <Icon.Heart size={15} className="text-wellness-600" />
              <span className="text-[13px] font-extraboldNunito text-wellness-600">
                Look after you, too
              </span>
            </div>
            <p className="text-[12px] leading-[1.6] text-wellness-600">{selfCareNudge}</p>
          </Card>
        </div>
      </div>
    </>
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
  const { showToast } = useTherapist();
  const [days, setDays] = useState(initialDays);
  const [slots, setSlots] = useState(initialSlots);

  const addSlot = (day) => {
    const current = slots[day] ?? [];
    const next = CANDIDATE_TIMES.find((t) => !current.includes(t));
    if (!next) {
      showToast("No more slots available that day");
      return;
    }
    setSlots((p) => ({ ...p, [day]: [...current, next] }));
  };

  const removeSlot = (day, label) =>
    setSlots((p) => ({ ...p, [day]: p[day].filter((l) => l !== label) }));

  const totalSlots = Object.values(slots).flat().length;

  return (
    <>
      <InfoStrip icon={<Icon.Clock size={15} className="shrink-0 text-brand-600" />}>
        Changes apply to future bookings immediately. Sessions already booked are
        unaffected — you currently publish{" "}
        <strong className="font-boldNunito">{totalSlots} slots</strong> a week.
      </InfoStrip>

      <div className="flex flex-col gap-3">
        {WEEK_DAYS.map((day) => (
          <Card key={day.key}>
            <div className="mb-3 flex items-center justify-between gap-4">
              <div className="text-body font-extraboldNunito text-navy-800">{day.label}</div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-ink-400">
                  {days[day.key] ? `${(slots[day.key] ?? []).length} slots` : "Unavailable"}
                </span>
                <Toggle
                  on={days[day.key]}
                  label={day.label}
                  onClick={() => {
                    setDays((p) => ({ ...p, [day.key]: !p[day.key] }));
                    showToast(
                      days[day.key] ? `${day.label} turned off` : `${day.label} turned on`
                    );
                  }}
                />
              </div>
            </div>

            {days[day.key] ? (
              <div className="flex flex-wrap gap-2">
                {(slots[day.key] ?? []).map((slot) => (
                  <span
                    key={slot}
                    className="inline-flex items-center gap-2 rounded-full bg-wellness-50 py-2 pl-3.5 pr-2 text-caption font-boldNunito text-wellness-600"
                  >
                    {slot}
                    <button
                      type="button"
                      onClick={() => removeSlot(day.key, slot)}
                      aria-label={`Remove ${slot} on ${day.label}`}
                      className="cursor-pointer rounded-full p-0.5 hover:bg-wellness-200/40"
                    >
                      <Icon.X size={12} />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => addSlot(day.key)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-dashed border-ink-300 px-3.5 py-2 text-caption font-boldNunito text-ink-500 hover:border-wellness-400 hover:text-wellness-600"
                >
                  <Icon.Plus size={13} /> Add slot
                </button>
              </div>
            ) : (
              <p className="text-caption text-ink-400">
                Not accepting bookings on {day.label}s.
              </p>
            )}
          </Card>
        ))}
      </div>

      <TealButton className="w-fit" onClick={() => showToast("Availability saved")}>
        Save availability
      </TealButton>
    </>
  );
};

/* ── ANALYTICS ────────────────────────────────────────────────────────── */

export const TherapistAnalytics = () => {
  const [range, setRange] = useState("4w");
  const data = analyticsByRange[range];
  const max = Math.max(...data.trend);

  return (
    <>
      <div className="flex w-fit gap-1.5 rounded-[11px] border border-surface-line bg-white p-1">
        {analyticsRanges.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setRange(r.key)}
            aria-pressed={range === r.key}
            className={classNames(
              "whitespace-nowrap rounded-[8px] px-3.5 py-2 text-[13px] font-boldNunito",
              range === r.key ? "bg-wellness-400 text-white" : "cursor-pointer text-ink-500"
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {data.kpis.map((kpi) => (
          <Card key={kpi.label}>
            <div className="text-[10px] font-boldNunito tracking-[0.06em] text-ink-400">
              {kpi.label.toUpperCase()}
            </div>
            <div className="mt-1 text-h2 font-extraboldNunito text-navy-800">{kpi.value}</div>
            <div className="text-[11px] text-wellness-400">{kpi.delta}</div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="mb-1 text-body font-extraboldNunito text-navy-800">Outcome trend</div>
        <div className="mb-4 text-[11px] text-ink-400">
          Sessions delivered over the selected range
        </div>
        <div className="flex h-[140px] items-end gap-2">
          {data.trend.map((v, i) => (
            <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
              <div className="flex h-full w-full items-end">
                <div
                  className={classNames(
                    "w-full rounded-t-[4px]",
                    i === data.trend.length - 1 ? "bg-wellness-400" : "bg-wellness-50"
                  )}
                  style={{ height: `${Math.round((v / max) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-surface-muted">{data.labels[i]}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-3.5 lg:grid-cols-2">
        <Card>
          <div className="mb-4 text-body font-extraboldNunito text-navy-800">
            Rating breakdown
          </div>
          <div className="flex flex-col gap-2.5">
            {ratingBreakdown.map((r) => (
              <div key={r.stars} className="flex items-center gap-3">
                <span className="w-10 shrink-0 text-[11px] font-boldNunito text-ink-500">
                  {r.stars} ★
                </span>
                <div className="h-[6px] flex-1 rounded-[3px] bg-ink-100">
                  <div
                    className="h-[6px] rounded-[3px] bg-gold-400"
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
                <span className="w-9 shrink-0 text-right text-[11px] font-boldNunito text-navy-800">
                  {r.pct}%
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-4 text-body font-extraboldNunito text-navy-800">Busiest slots</div>
          <div className="flex flex-col gap-2.5">
            {busiestSlots.map((s) => (
              <div key={s.label}>
                <div className="mb-1.5 flex justify-between gap-3">
                  <span className="text-caption font-semiboldNunito text-ink-800">{s.label}</span>
                  <span className="text-caption font-boldNunito text-wellness-600">{s.pct}%</span>
                </div>
                <div className="h-[5px] rounded-[3px] bg-ink-100">
                  <div
                    className="h-[5px] rounded-[3px] bg-wellness-400"
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
};

/* ── EARNINGS ─────────────────────────────────────────────────────────── */

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
  const { showToast } = useTherapist();
  const [prefs, setPrefs] = useState(
    therapistNotifPrefs.reduce((acc, p) => ({ ...acc, [p.key]: p.on }), {})
  );
  const [twoFa, setTwoFa] = useState(true);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <div className="mb-1 text-body font-extraboldNunito text-navy-800">Public profile</div>
        <div className="mb-3.5 text-caption text-ink-400">
          What clients see when they browse the network
        </div>
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-boldNunito text-ink-400">Display name</span>
            <input
              defaultValue={therapistProfile.name}
              className="h-[42px] rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px] text-ink-800"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-boldNunito text-ink-400">
                Consumer rate (₦/session)
              </span>
              <input
                defaultValue={therapistProfile.rate}
                className="h-[42px] rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px] text-ink-800"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-boldNunito text-ink-400">Years practising</span>
              <input
                defaultValue={therapistProfile.years}
                className="h-[42px] rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px] text-ink-800"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-boldNunito text-ink-400">Languages</span>
            <input
              defaultValue={therapistProfile.langs}
              className="h-[42px] rounded-[10px] border-[1.5px] border-ink-200 px-3.5 text-[13px] text-ink-800"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-boldNunito text-ink-400">Bio</span>
            <textarea
              rows={4}
              defaultValue={therapistProfile.bio}
              className="resize-none rounded-ds-md border-[1.5px] border-ink-200 px-3.5 py-3 text-[13px] leading-[1.6] text-ink-800"
            />
          </label>
          <TealButton className="w-fit" onClick={() => showToast("Profile saved")}>
            Save profile
          </TealButton>
        </div>
      </Card>

      <Card>
        <div className="mb-3.5 text-body font-extraboldNunito text-navy-800">
          Notification preferences
        </div>
        <div className="flex flex-col">
          {therapistNotifPrefs.map((p, i) => (
            <div
              key={p.key}
              className={classNames(
                "flex items-center justify-between gap-4 py-3",
                i < therapistNotifPrefs.length - 1 && "border-b border-[#F5F5F5]"
              )}
            >
              <div>
                <div className="text-[13px] font-semiboldNunito text-ink-800">{p.title}</div>
                <div className="text-[11px] text-ink-400">{p.note}</div>
              </div>
              <Toggle
                on={prefs[p.key]}
                label={p.title}
                onClick={() => setPrefs((prev) => ({ ...prev, [p.key]: !prev[p.key] }))}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="text-body font-extraboldNunito text-navy-800">Security</div>
        <div className="mb-3.5 text-caption text-ink-400">
          Protect your practice account
        </div>
        <div className="flex items-center justify-between gap-4 py-3">
          <div className="max-w-[360px]">
            <div className="text-[13px] font-semiboldNunito text-ink-800">
              Two-factor authentication (2FA)
            </div>
            <div className="text-[11px] text-ink-400">
              A 6-digit code is emailed to you at every sign-in
            </div>
          </div>
          <Toggle
            on={twoFa}
            label="Two-factor authentication"
            onClick={() => {
              setTwoFa((v) => !v);
              showToast(
                twoFa ? "Two-factor authentication disabled" : "Two-factor authentication enabled"
              );
            }}
          />
        </div>
      </Card>

      <Card className="!border-[#FFCDD2]">
        <div className="text-body font-extraboldNunito text-surface-errorInk">Account</div>
        <div className="mb-3.5 text-caption text-ink-400">
          Pause bookings or close your practice account
        </div>
        <div className="flex flex-wrap gap-2">
          <SecondaryButton onClick={() => showToast("Bookings paused")}>
            Pause new bookings
          </SecondaryButton>
          <button
            type="button"
            onClick={() => showToast("Account deletion requires support confirmation")}
            className="cursor-pointer rounded-[10px] border border-signal-error px-3.5 py-[9px] text-[13px] font-boldNunito text-signal-error"
          >
            Delete account
          </button>
        </div>
      </Card>
    </div>
  );
};

/* ── HELP & SUPPORT ───────────────────────────────────────────────────── */

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

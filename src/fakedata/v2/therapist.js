/* ═══════════════════════════════════════════════════════════════════════════
 * MOCK DATA — B2B Therapist (provider) dashboard
 * UI-only phase. Transcribed from "TalkAM B2B Therapist Dashboard.dc.html".
 *
 * NOTE: the deck's nav has no separate "Clients" page (PRD §7 lists one);
 * client continuity lives inside Sessions and the Home continuity panel here,
 * matching the deck. Flagged for a product decision.
 * ═══════════════════════════════════════════════════════════════════════════ */

/** Deck: sidebar footer identity. */
export const therapistUser = {
  name: "Dr. Adewale Okafor",
  role: "Anxiety · CBT Specialist",
  initials: "AK",
  avatarBg: "#017FC8",
  avatarColor: "#fff",
};

export const therapistPortalLabel = "Professional Portal";

/** Deck: `businessTagText` — the therapist is employed by a business account. */
export const therapistBusinessTag = "Employed by Zenith Bank";

/** Deck: `pageDefs`. */
export const therapistPageMeta = {
  home: { title: "Home", subtitle: "Dr. Adewale Okafor · Wednesday, Jul 8" },
  availability: { title: "Availability", subtitle: "Weekly recurring schedule · shown in WAT" },
  sessions: { title: "Sessions", subtitle: "5 upcoming this week" },
  messages: { title: "Client Messages", subtitle: "Encrypted · booking name only" },
  analytics: { title: "Analytics", subtitle: "Your performance on TalkAM" },
  earnings: { title: "Earnings", subtitle: "B2B & consumer sessions · paid weekly" },
  profile: { title: "Profile & Account", subtitle: "Public profile, credentials & security" },
  help: { title: "Help & Support", subtitle: "Answers, guides, and live help when you need it" },
};

export const nextSession = {
  client: "Anonymous · CBT follow-up",
  initials: "A",
  avatarBg: "linear-gradient(135deg,#3BA88F,#124034)",
  countdown: "in 24 min",
  focus: "Work stress",
  lastNote: "Client was practising the boundary-setting script from session 3.",
  sessionNumber: "Session 4",
  format: "Video",
};

export const attentionItems = [
  { key: "notes", label: "2 session notes pending", note: "From Tue and Wed", tone: "gold", cta: "Write notes" },
  { key: "reschedule", label: "1 reschedule request", note: "Anonymous · Thu 2:00 PM", tone: "blue", cta: "Review" },
  { key: "messages", label: "3 unread messages", note: "Oldest 2 days ago", tone: "purple", cta: "Open messages" },
];

export const therapistKpis = [
  { label: "THIS WEEK", value: "23", delta: "↑ 12%", deltaTone: "text-wellness-400" },
  { label: "RATING", value: "4.9", delta: "★★★★★", deltaTone: "text-gold-400" },
  { label: "NOTES DUE", value: "2", valueTone: "text-signal-error", delta: "to write", deltaTone: "text-ink-400" },
  { label: "UTILISATION", value: "78%", delta: "↑ 6%", deltaTone: "text-wellness-400" },
];

export const continuityClients = [
  { initials: "A", name: "Anonymous · #4021", sessions: 4, focus: "Work stress", next: "Today 10:00", avatarBg: "#3BA88F" },
  { initials: "B", name: "Anonymous · #4088", sessions: 2, focus: "Anxiety", next: "Thu 13:30", avatarBg: "#017FC8" },
  { initials: "C", name: "Anonymous · #4102", sessions: 6, focus: "Relationships", next: "Fri 16:00", avatarBg: "#C79A3B" },
];

export const latestReview = {
  stars: 5,
  text: "Dr. Okafor made me feel heard from the first minute. The tools he gave me actually fit my week.",
  meta: "Anonymous client · Jul 9",
};

export const selfCareNudge =
  "You've run 23 sessions this week. Blocking one recovery slot tomorrow keeps your practice sustainable.";

export const upcomingSessions = [
  { id: "u1", client: "Anonymous · CBT follow-up", initials: "A", avatarBg: "linear-gradient(135deg,#3BA88F,#124034)", when: "Today · 10:00 AM", focus: "Work stress", number: "Session 4", format: "Video" },
  { id: "u2", client: "Anonymous · Intake", initials: "B", avatarBg: "linear-gradient(135deg,#017FC8,#0D2240)", when: "Today · 1:30 PM", focus: "Anxiety", number: "Session 1", format: "Voice" },
  { id: "u3", client: "Anonymous · Follow-up", initials: "C", avatarBg: "linear-gradient(135deg,#C79A3B,#9A7526)", when: "Today · 4:00 PM", focus: "Relationships", number: "Session 6", format: "Video" },
  { id: "u4", client: "Anonymous · Follow-up", initials: "D", avatarBg: "linear-gradient(135deg,#6B44A8,#4E3AB0)", when: "Thu · 9:00 AM", focus: "Sleep", number: "Session 2", format: "Chat" },
  { id: "u5", client: "Anonymous · Follow-up", initials: "E", avatarBg: "linear-gradient(135deg,#3BA88F,#124034)", when: "Fri · 11:00 AM", focus: "Work stress", number: "Session 3", format: "Video" },
];

export const pastSessions = [
  { id: "p1", client: "Anonymous · #4021", initials: "A", avatarBg: "linear-gradient(135deg,#3BA88F,#124034)", when: "Wed · 2:00 PM", focus: "Work stress", notesSaved: false },
  { id: "p2", client: "Anonymous · #4088", initials: "B", avatarBg: "linear-gradient(135deg,#017FC8,#0D2240)", when: "Tue · 10:00 AM", focus: "Anxiety", notesSaved: false },
  { id: "p3", client: "Anonymous · #4102", initials: "C", avatarBg: "linear-gradient(135deg,#C79A3B,#9A7526)", when: "Mon · 4:00 PM", focus: "Relationships", notesSaved: true },
];

export const sessionRequests = [
  {
    id: "r1",
    client: "Anonymous · New client",
    initials: "N",
    avatarBg: "linear-gradient(135deg,#6B44A8,#4E3AB0)",
    focus: "Burnout",
    context: "Referred through Zenith Bank Nigeria. Prefers evenings, video.",
    requested: "Thu · 5:00 PM",
  },
];

export const WEEK_DAYS = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
];

export const initialDays = { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false };

export const initialSlots = {
  mon: ["9:00 – 9:50 AM", "11:00 – 11:50 AM", "2:00 – 2:50 PM"],
  tue: ["9:00 – 9:50 AM", "10:00 – 10:50 AM"],
  wed: ["10:00 – 10:50 AM", "2:00 – 2:50 PM", "4:30 – 5:20 PM"],
  thu: ["9:00 – 9:50 AM", "2:00 – 2:50 PM"],
  fri: ["9:00 – 9:50 AM", "10:00 – 10:50 AM", "11:00 – 11:50 AM"],
  sat: [],
  sun: [],
};

export const CANDIDATE_TIMES = [
  "8:00 – 8:50 AM", "9:00 – 9:50 AM", "10:00 – 10:50 AM", "11:00 – 11:50 AM",
  "1:00 – 1:50 PM", "2:00 – 2:50 PM", "3:00 – 3:50 PM", "4:00 – 4:50 PM",
  "4:30 – 5:20 PM", "5:00 – 5:50 PM",
];

export const analyticsRanges = [
  { key: "4w", label: "4 weeks" },
  { key: "12w", label: "12 weeks" },
  { key: "6m", label: "6 months" },
];

export const analyticsByRange = {
  "4w": {
    kpis: [
      { label: "Sessions delivered", value: "84", delta: "↑ 9%" },
      { label: "Avg rating", value: "4.9", delta: "↑ 0.1" },
      { label: "Utilisation", value: "78%", delta: "↑ 6%" },
      { label: "Notes completion", value: "92%", delta: "↑ 4%" },
    ],
    trend: [58, 64, 72, 78],
    labels: ["W1", "W2", "W3", "W4"],
  },
  "12w": {
    kpis: [
      { label: "Sessions delivered", value: "241", delta: "↑ 18%" },
      { label: "Avg rating", value: "4.8", delta: "↑ 0.2" },
      { label: "Utilisation", value: "74%", delta: "↑ 11%" },
      { label: "Notes completion", value: "89%", delta: "↑ 7%" },
    ],
    trend: [40, 48, 52, 58, 61, 66, 64, 70, 72, 74, 78, 80],
    labels: ["W1", "", "", "W4", "", "", "W7", "", "", "W10", "", "W12"],
  },
  "6m": {
    kpis: [
      { label: "Sessions delivered", value: "486", delta: "↑ 34%" },
      { label: "Avg rating", value: "4.8", delta: "↑ 0.3" },
      { label: "Utilisation", value: "71%", delta: "↑ 19%" },
      { label: "Notes completion", value: "87%", delta: "↑ 12%" },
    ],
    trend: [35, 48, 57, 66, 73, 82],
    labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  },
};



export const earnings = {
  balance: "₦342,000",
  payoutNote: "Next payout: Friday · via Flutterwave",
  thisMonth: "₦756,000",
  sessionsThisMonth: 63,
  ratePerSession: "₦12,000",
  payouts: [
    { date: "Jul 18, 2026", sessions: 23, amount: "₦276,000" },
    { date: "Jul 11, 2026", sessions: 19, amount: "₦228,000" },
    { date: "Jul 04, 2026", sessions: 21, amount: "₦252,000" },
    { date: "Jun 27, 2026", sessions: 18, amount: "₦216,000" },
    { date: "Jun 20, 2026", sessions: 22, amount: "₦264,000" },
  ],
  payoutMethod: { bank: "GTBank", masked: "•••• 4821", name: "Adewale Okafor" },
};

export const therapistMessageThreads = [
  {
    id: "ce",
    name: "Anonymous · #4021",
    initials: "A",
    avatarBg: "#3BA88F",
    preview: "Thank you — I'll try the breathing exercise tonight.",
    time: "2h",
    unread: 2,
    messages: [
      { from: "them", text: "Hi Dr. Okafor — quick question before our session.", time: "8:40 AM" },
      { from: "me", text: "Of course, go ahead.", time: "8:52 AM" },
      { from: "them", text: "Thank you — I'll try the breathing exercise tonight.", time: "9:05 AM" },
    ],
  },
  {
    id: "tb",
    name: "Anonymous · #4088",
    initials: "B",
    avatarBg: "#017FC8",
    preview: "Could we move Thursday to the evening?",
    time: "1d",
    unread: 1,
    messages: [{ from: "them", text: "Could we move Thursday to the evening?", time: "Yesterday" }],
  },
];


export const therapistNotifPrefs = [
  { key: "booking", title: "New bookings", note: "When a client books a slot", on: true },
  { key: "reminder", title: "Session reminders", note: "24 hours and 1 hour before", on: true },
  { key: "message", title: "New messages", note: "When a client writes to you", on: true },
  { key: "cancel", title: "Cancellations", note: "When a client cancels or reschedules", on: true },
  { key: "payout", title: "Payout summary", note: "Weekly payout confirmation", on: true },
  { key: "review", title: "New reviews", note: "When a client rates a session", on: false },
];

export const therapistFaqs = [
  { q: "How and when do I get paid?", a: "Payouts run weekly, every Friday, to the bank account on your Earnings page via Flutterwave. Your balance updates as sessions are marked held." },
  { q: "What is the B2B session rate?", a: "Business sessions are paid at a flat rate set by TalkAM and identical for every therapist on the network — there are no per-therapist negotiations. Your consumer rate is separate and set by you." },
  { q: "I was onboarded by a company — where are my earnings?", a: "Therapists brought on by a business are paid directly by that organisation at the rate agreed with them, so the Earnings module is hidden and you carry a \"paid by business\" tag instead." },
  { q: "Can I decline a client request?", a: "Yes. Requests appear under Sessions → Requests and you can accept or decline each one. Declining is never shared with the client as a reason." },
  { q: "Are sessions recorded?", a: "No. Video, voice and chat rooms are never recorded — not audio, not video, not transcript. Your written session notes are the only record and they are private to you." },
  { q: "How do I change my availability?", a: "Availability → toggle a day on or off, and add or remove slots. Changes apply to future bookings immediately; already-booked sessions are unaffected." },
];

/* ── Home (deck: "TalkAM B2B Therapist Dashboard.dc.html" § HOME) ───────── */

/** Deck: `checklistItems` (businessEmployed branch) + `checklistTitle/Subtitle`. */
export const onboardingChecklist = {
  title: "Getting started: how your account works",
  subtitle:
    "A quick rundown for therapists employed by Zenith Bank — what TalkAM handles, and what your employer does.",
  items: [
    { key: "rate", tone: "true", title: "You’re salaried by Zenith Bank", sub: "As a business-employed therapist, you’re paid directly by Zenith Bank — not per session by TalkAM. Your pay is arranged with your employer." },
    { key: "bundle", tone: "true", title: "No per-session payouts from TalkAM", sub: "Sessions you deliver here don’t generate TalkAM payouts or draw from a session bundle. That’s why the Earnings module isn’t shown for your account." },
    { key: "payout", tone: "true", title: "TalkAM is your practice tool, not your payer", sub: "Use TalkAM to manage availability, sessions, client messages and your profile. Compensation questions go to your employer’s HR team." },
    { key: "consumer", tone: "note", title: "You serve Zenith Bank’s team only", sub: "Your bookings come from employees on Zenith Bank’s plan. You’re not listed in the open consumer network unless your employer enables it." },
    { key: "bank", tone: "action", title: "Complete your profile in the mobile app", sub: "Finish your public profile and credentials in the TalkAM mobile app so employees can find and book you with confidence." },
  ],
};

export const CHECKLIST_TONE = {
  true: { label: "HOW IT WORKS", bg: "#E8F7F4", fg: "#1F6B59" },
  note: { label: "GOOD TO KNOW", bg: "#EEF4FC", fg: "#015C94" },
  action: { label: "ACTION NEEDED", bg: "#FBF5E8", fg: "#9A6E0A" },
};

/** Deck: `followups`. */
export const followups = [
  { key: "notes", count: "2", title: "Session notes pending", sub: "Chidinma E. · Tunde B. — write up before your next session", cta: "Write notes", tint: "#FBF5E8", stroke: "#9A6E0A", accent: "#9A6E0A" },
  { key: "reschedule", count: "1", title: "Reschedule request", sub: "Fatima B. asked to move Thursday 3:00 PM → Friday", cta: "Review", tint: "#F5F0FF", stroke: "#6B44A8", accent: "#6B44A8" },
  { key: "messages", count: "3", title: "Unread client messages", sub: "Chidinma, Fatima and 1 other are waiting to hear back", cta: "Open inbox", tint: "#EEF4FC", stroke: "#017FC8", accent: "#017FC8" },
];

/** Deck: `homeStats`. */
export const homeStats = [
  { icon: "cal", tint: "#EEF4FC", stroke: "#017FC8", value: "5", label: "Sessions this week", delta: "▲ 2 vs last week", deltaColor: "#1F8A5B" },
  { icon: "star", tint: "#FBF5E8", stroke: "#9A6E0A", value: "4.9", label: "Average rating", delta: "▲ 0.1 this month", deltaColor: "#1F8A5B" },
  { icon: "users", tint: "#EEF4FC", stroke: "#017FC8", value: "64", label: "Sessions completed", delta: "18 active clients", deltaColor: "#858585" },
];

/** Deck: `todaySchedule`. */
export const todaySchedule = [
  { time: "10:00 AM", name: "Fatima B.", initials: "FB", avatarBg: "#6B44A8", format: "Video · 50 min", status: "Confirmed" },
  { time: "4:00 PM", name: "Chidinma E.", initials: "CE", avatarBg: "#017FC8", format: "Video · 50 min", status: "Confirmed" },
  { time: "4:30 PM", name: "Tunde B.", initials: "TB", avatarBg: "#017FC8", format: "Video · 50 min", status: "Awaiting client" },
];

/** Deck: `continuity`. */
export const continuity = [
  { name: "Chidinma Eze", initials: "CE", avatarBg: "#017FC8", when: "Today · 11:00 AM", tag: "Anxiety", note: "Revisit boundary-setting at work; check in on box-breathing practice." },
  { name: "Tunde Bakare", initials: "TB", avatarBg: "#1F8A5B", when: "Today · 4:30 PM", tag: "Work stress", note: "Follow up on sleep routine and the workload conversation with his lead." },
  { name: "Fatima Bello", initials: "FB", avatarBg: "#6B44A8", when: "Thu · 2:00 PM", tag: "Grief", note: "Second session — continue processing; introduce journalling if she’s open." },
];

/** Deck: `nextSession`. */
export const homeNextSession = {
  name: "Chidinma Eze",
  initials: "CE",
  avatarBg: "#017FC8",
  countdown: "22 min",
  time: "11:00 AM",
  format: "Video · 50 min",
  focus: "Work-related anxiety",
  lastNote: "Practised box-breathing; wanted to revisit boundary-setting with her manager.",
  sessionNo: "Session 4",
};

/** Deck: `latestReview` + `selfCareSessions`. */
export const homeLatestReview = {
  quote: "Dr. Okafor made me feel genuinely heard. The tools we worked on are already helping at work.",
  author: "Chidinma E.",
  when: "2 days ago",
};
export const selfCareSessions = 12;

/* ── Analytics (deck § ANALYTICS) ───────────────────────────────────────── */

export const analyticsRangeOpts = [
  { key: "4w", label: "4 weeks" },
  { key: "12w", label: "12 weeks" },
  { key: "6m", label: "6 months" },
];

export const analyticsKpis = [
  { label: "TOTAL SESSIONS", value: "64", sub: "+8 this month", subColor: "#1F8A5B" },
  { label: "COMPLETION RATE", value: "96%", sub: "2 no-shows · 62 done", subColor: "#858585" },
  { label: "AVG SESSION LENGTH", value: "48m", sub: "of 50m booked", subColor: "#858585" },
  { label: "AVG RESPONSE TIME", value: "2.4h", sub: "▼ 0.6h faster", subColor: "#1F8A5B" },
  { label: "REPEAT CLIENTS", value: "71%", sub: "booked a 2nd session", subColor: "#858585" },
  { label: "AVG RATING", value: "4.9★", sub: "from 58 reviews", subColor: "#858585" },
  { label: "CANCELLATIONS", value: "4%", sub: "below 8% network avg", subColor: "#1F8A5B" },
  { label: "ACTIVE CLIENTS", value: "18", sub: "+3 this month", subColor: "#1F8A5B" },
];

export const sessionBarsRaw = [3, 4, 2, 5, 6, 4, 5, 7, 6, 5, 8, 5];

export const topClientTopics = [
  { label: "Anxiety", pct: 42, color: "#017FC8" },
  { label: "Work Stress", pct: 31, color: "#017FC8" },
  { label: "Relationships", pct: 27, color: "#DBB66E" },
];

export const outcomeTrendRaw = [58, 61, 60, 64, 67, 66, 70, 72, 71, 74, 77, 79];

export const ratingBreakdown = [
  { stars: "5★", pct: 86, count: "50", bar: "#017FC8" },
  { stars: "4★", pct: 10, count: "6", bar: "#68B4E1" },
  { stars: "3★", pct: 3, count: "2", bar: "#C9E2F9" },
  { stars: "2★", pct: 0, count: "0", bar: "#E2E2E2" },
  { stars: "1★", pct: 1, count: "0", bar: "#E2E2E2" },
];

export const busiestSlots = [
  { day: "Mon", load: 60 }, { day: "Tue", load: 85 }, { day: "Wed", load: 100 },
  { day: "Thu", load: 75 }, { day: "Fri", load: 90 }, { day: "Sat", load: 30 },
  { day: "Sun", load: 10 },
];

/* ── Profile & Account (deck § PROFILE) ─────────────────────────────────── */

export const therapistProfile = {
  name: "Dr. Adewale Okafor",
  bio: "MDCN-licensed clinical psychologist specialising in anxiety and cognitive behavioural therapy. Nine years supporting professionals through workplace stress, panic and burnout.",
  specialties: ["Anxiety", "CBT", "PTSD/Trauma"],
  years: "9",
  rate: "15,000",
  langs: "English, Yoruba",
  formats: "Video · Voice · Chat",
  email: "chidinma… no — dr.adewale.okafor@practice.ng",
};

export const therapistNotifRows = [
  { key: "booking", title: "New bookings", sub: "When a client books a session with you", on: true },
  { key: "reminder", title: "Session reminders", sub: "24 hours and 1 hour before each session", on: true },
  { key: "message", title: "Client messages", sub: "When a client sends you a message", on: true },
  { key: "cancel", title: "Cancellations & reschedules", sub: "When a client changes or cancels a session", on: true },
  { key: "payout", title: "Weekly payout summary", sub: "Every Friday when your earnings are processed", on: true },
  { key: "review", title: "New reviews", sub: "When a client leaves a rating or review", on: false },
];

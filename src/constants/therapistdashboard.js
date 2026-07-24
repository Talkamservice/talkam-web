/**
 * Therapist dashboard — static design copy and presentation helpers.
 *
 * Data (home, sessions, availability, analytics, earnings, profile, messages)
 * comes from api/v2/therapist — see planning-docs/web-api/04-therapist-dashboard.md.
 * Only labels, the onboarding checklist copy, palettes and formatters live here.
 */

export const therapistPortalLabel = "Professional Portal";

export const therapistPageMeta = {
  home: { title: "Home" },
  availability: { title: "Availability", subtitle: "Weekly recurring schedule · shown in WAT" },
  sessions: { title: "Sessions" },
  messages: { title: "Client Messages", subtitle: "Encrypted · booking name only" },
  analytics: { title: "Analytics", subtitle: "Your performance on TalkAM" },
  earnings: { title: "Earnings", subtitle: "Paid weekly via Flutterwave" },
  profile: { title: "Profile & Account", subtitle: "Public profile, credentials & security" },
  help: { title: "Help & Support", subtitle: "Answers, guides, and live help when you need it" },
};

/** Deck order + labels for the seven-day availability editor. */
export const WEEK_DAYS = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
];

/** The candidate slots the "add slot" picker offers, as {start,end} in H:i. */
export const CANDIDATE_SLOTS = [
  { start: "08:00", end: "08:50", label: "8:00 – 8:50 AM" },
  { start: "09:00", end: "09:50", label: "9:00 – 9:50 AM" },
  { start: "10:00", end: "10:50", label: "10:00 – 10:50 AM" },
  { start: "11:00", end: "11:50", label: "11:00 – 11:50 AM" },
  { start: "13:00", end: "13:50", label: "1:00 – 1:50 PM" },
  { start: "14:00", end: "14:50", label: "2:00 – 2:50 PM" },
  { start: "15:00", end: "15:50", label: "3:00 – 3:50 PM" },
  { start: "16:00", end: "16:50", label: "4:00 – 4:50 PM" },
  { start: "16:30", end: "17:20", label: "4:30 – 5:20 PM" },
  { start: "17:00", end: "17:50", label: "5:00 – 5:50 PM" },
];

/** "09:00" → "9:00 AM"; "09:00"+"09:50" → "9:00 – 9:50 AM". */
export const to12h = (hhmm) => {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  const period = h < 12 ? "AM" : "PM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
};
export const slotLabel = (start, end) => `${to12h(start).replace(/ (AM|PM)$/, "")} – ${to12h(end)}`;

export const analyticsRangeOpts = [
  { key: "4w", label: "4 weeks" },
  { key: "12w", label: "12 weeks" },
  { key: "6m", label: "6 months" },
];

export const RATING_BAR_COLOURS = {
  5: "#017FC8",
  4: "#68B4E1",
  3: "#C9E2F9",
  2: "#E2E2E2",
  1: "#E2E2E2",
};

export const AVATAR_COLOURS = ["#017FC8", "#3BA88F", "#9A6E0A", "#6B44A8", "#AC4242", "#1F8A5B"];
export const avatarColour = (seed = "") => {
  const sum = [...String(seed)].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_COLOURS[sum % AVATAR_COLOURS.length];
};

export const naira = (n) =>
  n === null || n === undefined ? "—" : `₦${Math.round(Number(n)).toLocaleString("en-NG")}`;

export const initialsOf = (name = "") =>
  String(name)
    .split(/\s+/)
    .filter((w) => !["dr", "dr.", "mr", "mr.", "mrs", "mrs.", "ms", "ms.", "prof", "prof."].includes(w.toLowerCase()))
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

const WAT = { timeZone: "Africa/Lagos" };
export const sessionWhen = (iso) => {
  if (!iso) return "";
  const d = new Date(String(iso).replace(" ", "T"));
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const day = isToday
    ? "Today"
    : d.toLocaleDateString("en-NG", { ...WAT, weekday: "short", month: "short", day: "numeric" });
  const time = d.toLocaleTimeString("en-NG", { ...WAT, hour: "numeric", minute: "2-digit" });
  return `${day} · ${time}`;
};
export const countdownTo = (iso) => {
  if (!iso) return "";
  const mins = Math.round((new Date(String(iso).replace(" ", "T")).getTime() - Date.now()) / 60000);
  if (mins <= 0) return "now";
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  return `${h}h ${mins % 60}m`;
};

export const SESSION_FORMAT_LABEL = { video: "Video", voice: "Voice", chat: "Chat" };

/**
 * Deck: the business-employed onboarding carousel. Static copy — shown only
 * when home.employment.is_business_employed is true.
 */
export const onboardingChecklist = {
  title: "Getting started: how your account works",
  subtitle:
    "A quick rundown for therapists employed by a business — what TalkAM handles, and what your employer does.",
  items: [
    { key: "rate", tone: "true", title: "You're salaried by your employer", sub: "As a business-employed therapist, you're paid directly by your employer — not per session by TalkAM. Your pay is arranged with them." },
    { key: "bundle", tone: "true", title: "No per-session payouts from TalkAM", sub: "Sessions you deliver here don't generate TalkAM payouts or draw from a session bundle. That's why the Earnings module isn't shown for your account." },
    { key: "payout", tone: "true", title: "TalkAM is your practice tool, not your payer", sub: "Use TalkAM to manage availability, sessions, client messages and your profile. Compensation questions go to your employer's HR team." },
    { key: "consumer", tone: "note", title: "You serve your employer's team", sub: "Your bookings come from employees on your employer's plan. You're not listed in the open consumer network unless they enable it." },
    { key: "bank", tone: "action", title: "Complete your profile in the mobile app", sub: "Finish your public profile and credentials in the TalkAM mobile app so employees can find and book you with confidence." },
  ],
};

export const CHECKLIST_TONE = {
  true: { label: "HOW IT WORKS", bg: "#E8F7F4", fg: "#1F6B59" },
  note: { label: "GOOD TO KNOW", bg: "#EEF4FC", fg: "#015C94" },
  action: { label: "ACTION NEEDED", bg: "#FBF5E8", fg: "#9A6E0A" },
};

/** Notification-preference rows (labels only; state comes from §09). */
export const therapistNotifRows = [
  { key: "booking", title: "New bookings", sub: "When a client books a session with you" },
  { key: "reminder", title: "Session reminders", sub: "24 hours and 1 hour before each session" },
  { key: "message", title: "Client messages", sub: "When a client sends you a message" },
  { key: "cancel", title: "Cancellations & reschedules", sub: "When a client changes or cancels a session" },
  { key: "payout", title: "Weekly payout summary", sub: "Every Friday when your earnings are processed" },
  { key: "review", title: "New reviews", sub: "When a client leaves a rating or review" },
];

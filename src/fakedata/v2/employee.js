/* ═══════════════════════════════════════════════════════════════════════════
 * MOCK DATA — B2B Employee (member) dashboard
 * Transcribed verbatim from "TalkAM B2B Employee Dashboard.dc.html".
 *
 * Every value below is copied from the deck's `renderVals()` block. Do not
 * paraphrase copy or re-order lists — the deck is the specification.
 * ═══════════════════════════════════════════════════════════════════════════ */

/** Sidebar footer identity — deck: `<aside>` footer block. */
export const employeeUser = {
  name: "Chidinma Eze",
  role: "Zenith Bank Nigeria",
  initials: "C",
  avatarBg: "#EEF4FC",
  avatarColor: "#015C94",
};

export const employeePortalLabel = "My Wellbeing";

/** Deck: `pageDefs`. */
export const employeePageMeta = {
  home: { title: "Home", subtitle: "Chidinma · Zenith Bank Nigeria" },
  sessions: { title: "My Sessions", subtitle: "1 upcoming · 4 past sessions" },
  checkins: {
    title: "Check-ins & Mood",
    subtitle: "Private trend summary — full history on mobile",
  },
  community: { title: "Community", subtitle: "Anonymous · trending this week" },
  messages: { title: "Messages", subtitle: "Encrypted · therapist chat" },
  profile: { title: "Profile & Privacy", subtitle: "Account, consent & safety" },
  help: {
    title: "Help & Support",
    subtitle: "Answers, guides, and live help when you need it",
  },
};

/** Deck: `notifications` seed state. */
export const employeeNotifications = [
  { id: "n1", text: "Reminder: your session with Dr. Adewale K. is tomorrow at 2:00 PM", time: "2h ago", read: false, kind: "reminder" },
  { id: "n2", text: "How was your session with Dr. Chioma O.? Leave feedback", time: "1d ago", read: false, kind: "feedback" },
  { id: "n3", text: "Don't forget your daily check-in today", time: "1d ago", read: false, kind: "checkin" },
  { id: "n4", text: "Dr. Adewale K. sent you a new message", time: "3d ago", read: true, kind: "message" },
];

/** Deck: `notifKindColor`. */
export const NOTIF_KIND_COLOR = {
  reminder: "#017FC8",
  feedback: "#DBB66E",
  checkin: "#AC4242",
  message: "#3BA88F",
};

/** Deck: `MOOD_MESSAGES`. */
export const MOOD_MESSAGES = {
  great: "That's wonderful to hear — keep doing what's working for you! 🌟",
  good: "Glad you're doing well. Small steady days add up.",
  okay: "Okay days are still valid days. Be gentle with yourself.",
  low: "Sorry you're having a tough time. Consider reaching out to your therapist or a trusted friend today.",
  rough:
    "That sounds really hard. You don't have to carry it alone — your therapist and TalkAM's support line are here anytime.",
};

/**
 * Deck: `buildMoodPicker` — Great → Rough. Used by Check-ins, the pre-session
 * modal and the feedback modal.
 */
export const MOODS = [
  { key: "great", emoji: "😄", label: "Great" },
  { key: "good", emoji: "🙂", label: "Good" },
  { key: "okay", emoji: "😐", label: "Okay" },
  { key: "low", emoji: "😔", label: "Low" },
  { key: "rough", emoji: "😣", label: "Rough" },
];

/**
 * Deck: `homeMoodRow` — Rough → Great. Deliberately the reverse of `MOODS`;
 * the deck runs the Home check-in in the opposite direction.
 */
export const HOME_MOODS = [
  { key: "rough", emoji: "😣", label: "Rough" },
  { key: "low", emoji: "😔", label: "Low" },
  { key: "okay", emoji: "😐", label: "Okay" },
  { key: "good", emoji: "🙂", label: "Good" },
  { key: "great", emoji: "😄", label: "Great" },
];

/** Deck: `factorTags`. */
export const CHECKIN_FACTORS = [
  { key: "work", label: "Work", emoji: "💼" },
  { key: "sleep", label: "Sleep", emoji: "😴" },
  { key: "family", label: "Family", emoji: "👨‍👩‍👧" },
  { key: "health", label: "Health", emoji: "🩺" },
  { key: "money", label: "Finances", emoji: "💰" },
  { key: "social", label: "Relationships", emoji: "💬" },
  { key: "exercise", label: "Exercise", emoji: "🏃" },
  { key: "rest", label: "Rest", emoji: "🧘" },
];

/** Deck: `typeMeta` + `nextSession`. */
export const SESSION_TYPE_META = {
  video: { label: "Video session", short: "Video" },
  voice: { label: "Voice session", short: "Voice" },
};

export const nextSession = {
  therapist: "Dr. Adewale K.",
  initials: "AK",
  whenLabel: "Today · 4:00 PM WAT",
  whenRangeLabel: "Today · 4:00 PM – 4:50 PM WAT",
};

/** Deck: `homeTrendRaw` — Home fortnight area chart. */
export const homeTrendRaw = [40, 55, 45, 60, 50, 70, 65, 75, 68, 80, 72, 85, 78, 88];

/** Deck: `wellbeingSnapshot`. */
export const wellbeingSnapshot = [
  { value: "7", label: "day check-in streak", accent: "#3BA88F" },
  { value: "4 / 6", label: "sessions used this quarter", accent: "#017FC8" },
  { value: "+18%", label: "mood vs last month", accent: "#1F8A5B" },
];

/** Deck: `recommended`. */
export const recommended = [
  {
    tag: "GUIDED",
    title: "5-minute box breathing",
    sub: "Calm your nervous system before a busy day",
    tint: "#EEF4FC",
    accent: "#017FC8",
    icon: "M22 12h-4l-3 9L9 3l-3 9H2",
  },
  {
    tag: "READ",
    title: "Setting boundaries at work",
    sub: "A practical guide from the TalkAM library",
    tint: "#E8F7F4",
    accent: "#1F6B59",
    icon: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
  },
];

/** Deck: `qrSeed` — deterministic QR-ish 8×8 pattern for the "Get the app" card. */
export const qrSeed = [
  1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1,
  1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1,
  0, 0, 0, 0, 1, 0, 0, 1, 1, 1,
];

/** Deck: `sessSummary` (uncapped state). */
export const sessionSummary = [
  { value: "1", label: "Upcoming", accent: "#017FC8" },
  { value: "4", label: "Completed", accent: "#141B34" },
  { value: "2 / 6", label: "Sessions used", accent: "#1F8A5B" },
  { value: "😄", label: "Mood trending up", accent: "#9A6E0A" },
];

/** Deck: `sessionPrep`. */
export const sessionPrep = [
  { done: true, label: "Complete your pre-session mood check-in" },
  { done: true, label: "Find a quiet, private space" },
  { done: false, label: "Jot down what you'd like to talk about" },
];

/** Deck: `careTeam`. */
export const careTeam = {
  name: "Dr. Adewale K.",
  initials: "AK",
  avatarBg: "#017FC8",
  title: "Clinical Psychologist",
  focus: "Anxiety · Work stress",
  rating: "4.9",
  sessions: "4 sessions together",
  note: "Continuing work on boundary-setting and box-breathing.",
};

/** Deck: `pastRaw` → `pastSessions`. */
export const pastSessions = [
  { name: "Dr. Chioma O.", date: "Jul 2 · Video · 50 min", initials: "CO", avatarBg: "#3BA88F", status: "Completed", canRate: true, preMood: "low", postMood: "good" },
  { name: "Dr. Adewale K.", date: "Jun 25 · Voice · 50 min", initials: "AK", avatarBg: "#017FC8", status: "Completed", canRate: false, preMood: "okay", postMood: "good" },
  { name: "Dr. Adewale K.", date: "Jun 11 · Video · 50 min", initials: "AK", avatarBg: "#017FC8", status: "Completed", canRate: false },
  { name: "Dr. Chioma O.", date: "May 28 · Video · 50 min", initials: "CO", avatarBg: "#3BA88F", status: "No-show", canRate: false },
];

export const MOOD_EMOJI = { great: "😄", good: "🙂", okay: "😐", low: "😔", rough: "😣" };

/** Deck: `moodStats` — Check-ins stat strip. */
export const moodStats = [
  { value: "9", label: "day streak", accent: "#3BA88F" },
  { value: "🙂", label: "avg mood", accent: "#017FC8" },
  { value: "12 / 14", label: "days logged", accent: "#141B34" },
  { value: "+18%", label: "vs last month", accent: "#1F8A5B" },
];

/** Deck: `moodBarsRaw` — Check-ins 14-day bar chart. */
export const moodBarsRaw = [55, 62, 48, 70, 66, 58, 72, 80, 64, 58, 75, 68, 60, 74];

/** Deck: `baseCheckins`. */
export const baseCheckins = [
  { day: "Yesterday", mood: "😐", label: "Okay", tags: "Sleep · Work", note: "Tired but managed the workload." },
  { day: "Mon, Jul 7", mood: "😄", label: "Great", tags: "Exercise · Social", note: "Good session with Dr. Adewale." },
  { day: "Sun, Jul 6", mood: "🙂", label: "Good", tags: "Family · Rest", note: "Restful day with family." },
];

/** Deck: `topFactors`. */
export const topFactors = [
  { label: "Work", pct: 64, color: "#017FC8" },
  { label: "Sleep", pct: 48, color: "#6B44A8" },
  { label: "Rest", pct: 32, color: "#3BA88F" },
];

/** Deck: `topicRaw` + `chipPalette`. */
export const communityTopics = [
  { name: "Work Stress", posts: 214, snippet: "Anyone else feel like Mondays never end lately?", time: "2h ago", chipBg: "#EEF4FC", chipFg: "#015C94" },
  { name: "Anxiety", posts: 181, snippet: "Small win today — I spoke up in the meeting.", time: "4h ago", chipBg: "#FFF0F0", chipFg: "#8B2E2E" },
  { name: "Relationships", posts: 97, snippet: "How do you set boundaries without guilt?", time: "6h ago", chipBg: "#F5F0FF", chipFg: "#6B44A8" },
  { name: "Grief", posts: 42, snippet: "One year today. Still figuring out how to sit with it.", time: "8h ago", chipBg: "#F0F0F2", chipFg: "#717171" },
  { name: "Depression", posts: 88, snippet: "Getting out of bed felt like a win today.", time: "11h ago", chipBg: "#E8F7F4", chipFg: "#1F6B59" },
  { name: "General Support", posts: 130, snippet: "Just needed somewhere to say I’m proud of myself.", time: "13h ago", chipBg: "#FBF5E8", chipFg: "#9A6E0A" },
];

/** Deck: `threadDefs`. */
export const messageThreads = [
  { key: "ak", name: "Dr. Adewale K.", preview: "That’s completely understandable —", initials: "AK", avatarBg: "#017FC8" },
  { key: "co", name: "Dr. Chioma O.", preview: "See you at our next session!", initials: "CO", avatarBg: "#3BA88F" },
  { key: "support", name: "TalkAM Support", preview: "Your session receipt is ready", initials: "TS", avatarBg: "#858585" },
];

/** Deck: the three bubbles hard-coded in the Messages pane. */
export const conversation = [
  { from: "them", text: "How are you feeling ahead of Thursday's session?" },
  { from: "me", text: "A bit anxious about the work deadline we discussed, but doing okay." },
  { from: "them", text: "That's completely understandable — let's make it the focus on Thursday." },
];

/** Deck: Profile & Privacy — consent rows. */
export const consentRows = [
  { key: "account", title: "Account operation", note: "Required", locked: true },
  { key: "session", title: "Session delivery", note: "Required", locked: true },
  { key: "community", title: "Anonymous community", note: "Optional", locked: false, on: true },
  { key: "research", title: "Anonymised research", note: "Optional", locked: false, on: false },
];

/** Deck: `employeeFaqs`. */
export const employeeFaqs = [
  { q: "Can my employer see my sessions or messages?", a: "No. Zenith Bank only ever sees anonymised, aggregate trends across the whole team — never your individual sessions, mood check-ins, messages, or community activity." },
  { q: "How do I book or reschedule a session?", a: "Go to My Sessions to book a new slot, or use Reschedule / Cancel on an upcoming session. Cancelling ≥24h ahead is a full refund; under 24h is 50%; no-shows are not refunded." },
  { q: "What happens to my account if I leave the company?", a: "Your personal TalkAM account and session history stay yours. You’ll just move off the company plan — you can keep using TalkAM on your own, or reach out to us about continuing coverage." },
  { q: "Is the community feed anonymous?", a: "Yes — posting and browsing the community happens under an anonymous username in the mobile app. Nothing you post there is tied to your work identity." },
  { q: "How do I change my therapist?", a: 'Open Messages or My Sessions and select "Find a different therapist" — you can browse and switch at any time, at no extra cost.' },
  { q: "I’m in crisis right now — what do I do?", a: "If you are in immediate danger, please contact local emergency services. You can also message your therapist directly or use the crisis resources linked in the mobile app’s Community tab." },
];

/** Deck: `slotDefs` — reschedule modal. */
export const rescheduleSlots = [
  { key: "thu10", label: "Thu Jul 9 · 10:00 AM" },
  { key: "thu4", label: "Thu Jul 9 · 4:00 PM" },
  { key: "fri9", label: "Fri Jul 10 · 9:00 AM" },
  { key: "fri2", label: "Fri Jul 10 · 2:00 PM" },
  { key: "mon11", label: "Mon Jul 13 · 11:00 AM" },
  { key: "mon3", label: "Mon Jul 13 · 3:00 PM" },
];

/** Deck: `reasonDefs` — report modal. */
export const reportReasons = [
  { key: "late", label: "Therapist was late or unavailable" },
  { key: "unprofessional", label: "Unprofessional conduct" },
  { key: "chat", label: "Inappropriate message in chat" },
  { key: "other", label: "Something else" },
];

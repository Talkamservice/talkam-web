/* ═══════════════════════════════════════════════════════════════════════════
 * MOCK DATA — B2B Employee (member) dashboard
 * UI-only phase. Transcribed from "TalkAM B2B Employee Dashboard.dc.html".
 *
 * Tone here is warm and personal, and the privacy assurance is persistent:
 * nothing on these screens is ever visible to the employer.
 * ═══════════════════════════════════════════════════════════════════════════ */

export const employeeWorkspace = {
  name: "Chidinma Eze",
  meta: "Zenith Bank Nigeria",
  initial: "C",
  accent: "#017FC8",
  portalLabel: "My Wellbeing",
};

export const employeeUser = {
  name: "Chidinma Eze",
  role: "Zenith Bank Nigeria",
  initials: "C",
  avatarBg: "#EEF4FC",
  avatarColor: "#015C94",
};

export const employeePageMeta = {
  home: { title: "Home", subtitle: "Your private wellbeing space" },
  sessions: { title: "My Sessions", subtitle: "Upcoming, past and your care team" },
  checkins: { title: "Check-ins & Mood", subtitle: "Private to you — always" },
  community: { title: "Community", subtitle: "Anonymous spaces to talk freely" },
  messages: { title: "Messages", subtitle: "Your care team" },
  profile: { title: "Profile & Privacy", subtitle: "Consent, security and preferences" },
  help: { title: "Help & Support", subtitle: "Answers and someone to talk to" },
};

export const MOODS = [
  { key: "great", emoji: "😄", label: "Great" },
  { key: "good", emoji: "🙂", label: "Good" },
  { key: "okay", emoji: "😐", label: "Okay" },
  { key: "low", emoji: "😔", label: "Low" },
  { key: "rough", emoji: "😣", label: "Rough" },
];

export const MOOD_MESSAGES = {
  great: "That's wonderful to hear — keep doing what's working for you! 🌟",
  good: "Glad you're doing well. Small steady days add up.",
  okay: "Okay days are still valid days. Be gentle with yourself.",
  low: "Sorry you're having a tough time. Consider reaching out to your therapist or a trusted friend today.",
  rough:
    "That sounds really hard. You don't have to carry it alone — your therapist and TalkAM's support line are here anytime.",
};

export const CHECKIN_FACTORS = [
  { key: "work", label: "Work" },
  { key: "sleep", label: "Sleep" },
  { key: "family", label: "Family" },
  { key: "health", label: "Health" },
  { key: "money", label: "Finances" },
  { key: "social", label: "Relationships" },
  { key: "exercise", label: "Exercise" },
  { key: "rest", label: "Rest" },
];

export const nextSession = {
  therapist: "Dr. Adewale K.",
  initials: "AK",
  typeLabel: "Video session",
  whenLabel: "Today · 4:00 PM WAT",
  whenRangeLabel: "Today · 4:00 PM – 4:50 PM WAT",
  focus: "Work stress",
};

/** 14-day mood trend — height % per day. */
export const moodTrend = [55, 42, 60, 48, 65, 70, 58, 72, 66, 80, 62, 75, 84, 78];

export const wellbeingSnapshot = {
  streak: 7,
  averageMood: "Good",
  daysLogged: 21,
  monthDelta: "+12%",
  sessionsUsed: 4,
  sessionsTotal: 6,
};

export const recentCheckins = [
  { day: "Yesterday", mood: "🙂", label: "Good", tags: "Work · Sleep", note: "Slept better, work felt manageable." },
  { day: "Tue", mood: "😐", label: "Okay", tags: "Work", note: "Long day, but I took a proper lunch break." },
  { day: "Mon", mood: "😔", label: "Low", tags: "Work · Finances", note: "Money worries kept surfacing." },
  { day: "Sun", mood: "😄", label: "Great", tags: "Rest · Family", note: "Real rest day. Felt like myself." },
];

export const topFactors = [
  { label: "Work", pct: 42, color: "#017FC8" },
  { label: "Sleep", pct: 28, color: "#3BA88F" },
  { label: "Finances", pct: 18, color: "#DBB66E" },
  { label: "Relationships", pct: 12, color: "#6B44A8" },
];

export const upcomingSessions = [
  {
    id: "s1",
    therapist: "Dr. Adewale K.",
    initials: "AK",
    avatarBg: "#017FC8",
    type: "Video",
    when: "Today · 4:00 PM",
    focus: "Work stress",
    number: "Session 5",
  },
];

export const pastSessions = [
  { id: "p1", therapist: "Dr. Adewale K.", initials: "AK", avatarBg: "#017FC8", type: "Video", when: "Jul 9 · 2:00 PM", focus: "Work stress", rated: true, rating: 5 },
  { id: "p2", therapist: "Dr. Adewale K.", initials: "AK", avatarBg: "#017FC8", type: "Voice", when: "Jul 2 · 4:00 PM", focus: "Sleep", rated: true, rating: 5 },
  { id: "p3", therapist: "Dr. Chioma O.", initials: "CO", avatarBg: "#3BA88F", type: "Video", when: "Jun 25 · 11:00 AM", focus: "Intake", rated: false },
];

export const careTeam = {
  name: "Dr. Adewale K.",
  initials: "AK",
  title: "Clinical Psychologist · CBT",
  rating: "4.9",
  sessions: 4,
  continuity: "You've had 4 sessions together — continuity helps.",
};

export const prepChecklist = [
  { key: "mood", label: "Pre-session mood check-in", note: "Helps your therapist see where you're starting from" },
  { key: "quiet", label: "Find a quiet, private space", note: "Somewhere you won't be interrupted for 50 minutes" },
  { key: "talking", label: "Jot down talking points", note: "One or two things you want to get to" },
];

export const bookingSlots = [
  { key: "thu10", day: "Thu", date: "Jul 17", time: "10:00 AM" },
  { key: "thu16", day: "Thu", date: "Jul 17", time: "4:00 PM" },
  { key: "fri11", day: "Fri", date: "Jul 18", time: "11:00 AM" },
  { key: "fri15", day: "Fri", date: "Jul 18", time: "3:00 PM" },
  { key: "mon09", day: "Mon", date: "Jul 21", time: "9:00 AM" },
  { key: "mon14", day: "Mon", date: "Jul 21", time: "2:00 PM" },
];

export const communityGroups = [
  { name: "Work Stress", members: "2.4k members", topic: "Work Stress", tone: "brand", posts: 18 },
  { name: "Anxiety Support", members: "3.1k members", topic: "Anxiety", tone: "teal", posts: 42 },
  { name: "Sleep & Rest", members: "980 members", topic: "Sleep", tone: "gold", posts: 9 },
  { name: "General Support", members: "5.6k members", topic: "General", tone: "purple", posts: 63 },
];

export const messageThreads = [
  {
    id: "t1",
    name: "Dr. Adewale K.",
    initials: "AK",
    avatarBg: "#017FC8",
    preview: "See you at 4 — bring the notes if you made any.",
    time: "2h",
    unread: 2,
    messages: [
      { from: "them", text: "Hi Chidinma — just confirming our session today at 4:00 PM.", time: "9:12 AM" },
      { from: "me", text: "Yes, that still works. Thank you.", time: "9:30 AM" },
      { from: "them", text: "See you at 4 — bring the notes if you made any.", time: "9:31 AM" },
    ],
  },
  {
    id: "t2",
    name: "TalkAM Support",
    initials: "TA",
    avatarBg: "#3BA88F",
    preview: "Your session allowance resets on 1 Aug.",
    time: "3d",
    unread: 0,
    messages: [
      { from: "them", text: "Your session allowance resets on 1 Aug.", time: "Mon" },
    ],
  },
];

export const consentToggles = [
  { key: "account", title: "Account operation", note: "Required to log you in and keep your account secure", locked: true, on: true },
  { key: "session", title: "Session delivery", note: "Required to book and deliver your therapy sessions", locked: true, on: true },
  { key: "community", title: "Anonymous community", note: "Post and reply in the community feed", locked: false, on: true },
  { key: "research", title: "Anonymised research", note: "Let de-identified data improve TalkAM's programs", locked: false, on: false },
];

export const notificationPrefs = [
  { key: "reminders", title: "Session reminders", note: "24 hours and 1 hour before", on: true },
  { key: "checkin", title: "Daily check-in nudge", note: "A gentle reminder each evening", on: true },
  { key: "messages", title: "New messages", note: "When your care team writes to you", on: true },
  { key: "community", title: "Community activity", note: "Replies to your posts", on: false },
];

export const employeeNotifications = [
  { id: "n1", text: "Reminder: your session with Dr. Adewale K. is today at 4:00 PM", time: "2h ago", read: false, tone: "brand" },
  { id: "n2", text: "How was your session with Dr. Chioma O.? Leave feedback", time: "1d ago", read: false, tone: "gold" },
  { id: "n3", text: "Don't forget your daily check-in today", time: "1d ago", read: false, tone: "teal" },
  { id: "n4", text: "Dr. Adewale K. sent you a new message", time: "3d ago", read: true, tone: "grey" },
];

export const wellnessResources = [
  { title: "5 grounding techniques for when panic hits", meta: "5 min read · Anxiety & Stress", slug: "grounding-techniques-for-panic" },
  { title: "The science of a good night's sleep", meta: "7 min read · Self-Care", slug: "science-of-a-good-nights-sleep" },
  { title: "Managing anxiety at work without burning out", meta: "6 min read · Workplace Wellbeing", slug: "managing-anxiety-at-work" },
];

export const employeeFaqs = [
  { q: "Can my employer see my sessions or mood check-ins?", a: "No. Your employer only ever sees anonymised, company-wide totals — and only once at least 5 people have responded. Your individual sessions, messages, mood entries and community posts are never visible to them, under any circumstance." },
  { q: "How many sessions do I get?", a: "Your company sets a per-cycle allowance — yours is 6 sessions this cycle. You can see what's left on Home and My Sessions. If you reach the cap you can ask your admin to top up." },
  { q: "What happens if I need to cancel?", a: "Cancel or reschedule from My Sessions. Cancelling more than 24 hours ahead frees the session back to your allowance." },
  { q: "Is my community activity linked to my work account?", a: "No. You participate under a pseudonym that is never linked to your work identity or shown to your employer." },
  { q: "What if I'm in crisis right now?", a: "TalkAM is not an emergency service. If you are in immediate danger, contact local emergency services. For urgent non-emergency support, use the crisis resources on this page or message your care team." },
];

/* ═══════════════════════════════════════════════════════════════════════════
 * MOCK DATA — TalkAM For Therapists page
 * UI-only phase. Copy + figures transcribed from
 * "TalkAM For Therapists.dc.html".
 * ═══════════════════════════════════════════════════════════════════════════ */

export const therapistTrustStats = [
  { value: "4.9★", label: "Avg. therapist rating" },
  { value: "Weekly", label: "Payout schedule" },
  { value: "100%", label: "You set your hours" },
  { value: "Verified", label: "Trust badge on profile" },
];

export const therapistHeroStats = [
  { value: "Weekly payouts", label: "Paid reliably via Flutterwave" },
  { value: "You set the hours", label: "Full control of availability" },
];

export const therapistFeatures = [
  {
    icon: "🗓️",
    bg: "bg-wellness-50",
    title: "Set your availability",
    body: "Publish the slots that work for you. Change them anytime.",
  },
  {
    icon: "🎥",
    bg: "bg-brand-25",
    title: "Secure sessions",
    body: "Video, voice or chat rooms that are never recorded.",
  },
  {
    icon: "💰",
    bg: "bg-[#FBF3E3]",
    title: "Weekly payouts",
    body: "Transparent per-session rates, paid via Flutterwave.",
  },
  {
    icon: "📈",
    bg: "bg-wellness-50",
    title: "Practice analytics",
    body: "Track utilisation, ratings and outcomes over time.",
  },
  {
    icon: "✅",
    bg: "bg-brand-25",
    title: "Verified badge",
    body: "Build instant trust with a verified profile.",
  },
  {
    icon: "📝",
    bg: "bg-[#FBF3E3]",
    title: "Notes & continuity",
    body: "Private session notes keep care consistent.",
  },
];

/** Therapist Home dashboard preview. */
export const therapistHomePreview = {
  greeting: "Good morning, Dr. Okafor 👋",
  subtitle: "You have 5 sessions today",
  nextSession: {
    kicker: "NEXT SESSION · IN 24 MIN",
    title: "Anonymous · CBT follow-up",
    focus: "Focus: work stress",
  },
  kpis: [
    { label: "THIS WEEK", value: "23", delta: "↑ 12%", deltaClass: "text-wellness-400" },
    { label: "RATING", value: "4.9", delta: "★★★★★", deltaClass: "text-[#C79A3B]" },
    { label: "NOTES DUE", value: "2", valueClass: "text-[#E5484D]", delta: "to write", deltaClass: "text-[#9299A8]" },
  ],
};

/** Therapist Sessions dashboard preview. */
export const therapistSessions = [
  {
    ini: "A",
    bg: "linear-gradient(135deg,#3BA88F,#124034)",
    title: "Anonymous · CBT follow-up",
    time: "Today · 10:00",
    focus: "Work stress",
    cta: "Join",
  },
  {
    ini: "B",
    bg: "linear-gradient(135deg,#017FC8,#0D2240)",
    title: "Anonymous · Intake",
    time: "Today · 13:30",
    focus: "Anxiety",
    cta: "View",
  },
  {
    ini: "C",
    bg: "linear-gradient(135deg,#C79A3B,#9A7526)",
    title: "Anonymous · Follow-up",
    time: "Today · 16:00",
    focus: "Relationships",
    cta: "View",
  },
];

export const therapistSessionPoints = [
  {
    title: "Secure video, voice or chat",
    body: "Sessions are never recorded — full confidentiality.",
  },
  {
    title: "Accept or decline requests",
    body: "You choose who you take on and when.",
  },
  { title: "Session notes built in", body: "Keep continuity of care with private notes." },
];

/** Therapist Earnings dashboard preview. */
export const therapistEarnings = {
  balance: "₦342,000",
  payoutNote: "Next payout: Friday · via Flutterwave",
  payouts: [
    { date: "Jul 18, 2026", sessions: "23", amount: "₦276,000" },
    { date: "Jul 11, 2026", sessions: "19", amount: "₦228,000" },
    { date: "Jul 04, 2026", sessions: "21", amount: "₦252,000" },
  ],
};

export const therapistSteps = [
  { n: "01", title: "Apply", body: "Tell us about your practice and upload your credentials." },
  { n: "02", title: "Get verified", body: "We confirm your licence and add your verified badge." },
  { n: "03", title: "Set availability", body: "Publish the hours and slots that suit you." },
  { n: "04", title: "Start earning", body: "Accept clients, run sessions, get paid weekly." },
];

export const therapistTestimonial = {
  quote:
    "TalkAM gave me a steady stream of clients without the overhead of running my own practice. I set my hours, and the dashboard handles the rest.",
  name: "Dr. Adewale Okafor",
  meta: "Clinical Psychologist · 3 yrs on TalkAM",
  initial: "O",
};

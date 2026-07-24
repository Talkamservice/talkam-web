/* ═══════════════════════════════════════════════════════════════════════════
 * STATIC CONTENT — TalkAM landing page (variant 1C)
 *
 * This is the page's real editorial copy and its decorative device previews —
 * not backend data. The hero community-feed preview is deliberately illustrative
 * (showing real community posts on a public page would break the anonymity
 * model), and the stat counters are curated marketing figures, not live counts.
 * See planning-docs/web-api/06-marketing-legal.md for the rationale.
 *
 * Copy + figures are transcribed from "TalkAM Landing Page.dc.html" § 1C.
 * ═══════════════════════════════════════════════════════════════════════════ */

/** Hero phone — community feed preview. */
export const heroFeedPosts = [
  {
    id: "p1",
    author: "QuietStorm",
    topic: "Anxiety",
    topicTone: "teal",
    avatar: "bg-gradient-to-br from-brand-200 to-wellness-400",
    timeAgo: "2h ago",
    body: "First therapy session tomorrow and I'm actually excited instead of scared. This community got me here 💙",
    likes: 128,
    comments: 24,
  },
  {
    id: "p2",
    author: "GentleTide",
    topic: "Work Stress",
    topicTone: "brand",
    avatar: "bg-gradient-to-br from-[#C79A3B] to-gold-400",
    timeAgo: "5h ago",
    body: "Small win: I set a boundary at work today and the world didn't end. Progress 🌱",
    likes: 89,
    comments: 12,
  },
];

/** App showcase phone 1 — find a therapist. */
export const therapistPreview = {
  filters: [
    { label: "Anxiety", active: true },
    { label: "Trauma", active: false },
    { label: "Family", active: false },
  ],
  therapists: [
    {
      id: "t1",
      name: "Dr. Adewale O.",
      title: "Clinical Psychologist",
      rating: "4.9",
      sessions: "120+ sessions",
      avatar: "bg-gradient-to-br from-brand-400 to-navy-700",
      primary: true,
    },
    {
      id: "t2",
      name: "Dr. Ngozi E.",
      title: "Therapist, CBT",
      rating: "4.8",
      sessions: "90+ sessions",
      avatar: "bg-gradient-to-br from-wellness-400 to-wellness-600",
      primary: false,
    },
  ],
};

/** App showcase phone 2 — live session. */
export const sessionPreview = {
  therapistName: "Dr. Adewale Okafor",
  initial: "A",
  elapsed: "Session · 24:16",
};

/** App showcase phone 3 — mood check-in. */
export const moodPreview = {
  moods: ["😔", "😐", "🙂", "😄"],
  selectedIndex: 2,
  // Height % + bar colour for the "This week" mini chart.
  week: [
    { height: 40, color: "bg-[#D1EAF8]" },
    { height: 60, color: "bg-[#D1EAF8]" },
    { height: 50, color: "bg-[#8FC9EC]" },
    { height: 75, color: "bg-[#8FC9EC]" },
    { height: 65, color: "bg-brand-400" },
    { height: 88, color: "bg-brand-400" },
    { height: 80, color: "bg-wellness-400" },
  ],
  streakNote: "You've logged 7 days in a row 🌱 Keep it going.",
};

/** Captions under each showcase phone. */
export const appShowcaseCaptions = [
  {
    title: "Book real support",
    body: "Browse verified therapists by specialty and book in seconds.",
  },
  {
    title: "Meet on your terms",
    body: "Video, voice, or chat sessions — private and secure.",
  },
  {
    title: "Track how you feel",
    body: "Private daily check-ins reveal patterns over time.",
  },
];

/** For Business section — dashboard preview inside the browser frame. */
export const businessPreview = {
  company: "Zenith Bank Nigeria · July 2026",
  nav: ["Overview", "Employees", "Therapist Network", "Reports", "Billing"],
  kpis: [
    { value: "247", label: "Total Employees", iconBg: "bg-brand-25", iconColor: "#017FC8", icon: "users" },
    { value: "184", label: "Active This Month", iconBg: "bg-wellness-50", iconColor: "#3BA88F", icon: "check" },
    { value: "328", label: "Sessions", iconBg: "bg-gold-50", iconColor: "#9A6E0A", icon: "calendar" },
    { value: "₦4.2M", label: "Est. ROI", dark: true, iconColor: "#DBB66E", icon: "dollar" },
  ],
  topics: [
    { label: "Work Stress", pct: 34, color: "#017FC8" },
    { label: "Anxiety", pct: 26, color: "#3BA88F" },
    { label: "Relationships", pct: 18, color: "#DBB66E" },
    { label: "Depression", pct: 12, color: "#6B44A8" },
  ],
};

export const businessBenefits = [
  "Seat-based pricing that scales with your team",
  "Anonymised, aggregate wellbeing reporting",
  "NDPA-compliant consent, built in",
];

export const therapistPerks = ["Weekly payouts", "Flexible hours", "Verified badge"];

/** "TalkAM today" stat band. */
export const landingStats = [
  { value: "10K+", label: "Community members already on the web" },
  { value: "300+", label: "Licensed therapists ready to help" },
  { value: "40+", label: "Active communities & topics" },
  { value: "24/7", label: "Access to support, day or night" },
];

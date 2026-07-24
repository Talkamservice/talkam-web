/* ═══════════════════════════════════════════════════════════════════════════
 * STATIC CONTENT — TalkAM For Business page
 * The page's real editorial copy + decorative preview mockups; not backend data.
 * Copy + figures transcribed from "TalkAM For Business.dc.html".
 * See planning-docs/web-api/06-marketing-legal.md for the static-content rationale.
 *
 * NOTE: the deck's billing preview reads "64 sessions × ₦15,000", which
 * contradicts the flat ₦8,000/session rate on the Pricing deck. Transcribed
 * as-designed and flagged for a product decision.
 * ═══════════════════════════════════════════════════════════════════════════ */

export const businessSectors = ["Banking", "Tech", "NGOs", "Schools", "Firms"];

export const businessHeroStats = [
  { value: "Pay per session", label: "No upfront lock-in · post-billing" },
  { value: "100% private", label: "Employees stay anonymous" },
];

export const businessFeatures = [
  {
    icon: "📊",
    bg: "bg-brand-25",
    title: "Anonymised analytics",
    body: "Company-wide wellbeing trends and top themes — never a single individual identified.",
  },
  {
    icon: "🪑",
    bg: "bg-wellness-50",
    title: "Simple seat management",
    body: "Invite in bulk, set caps, add or remove seats as your team changes.",
  },
  {
    icon: "🧑‍⚕️",
    bg: "bg-brand-25",
    title: "Vetted therapist network",
    body: "Employees book licensed, verified therapists directly in the app.",
  },
  {
    icon: "💳",
    bg: "bg-[#FBF3E3]",
    title: "Pay per session",
    body: "Post-paid, flat rate per session per seat. No upfront lock-in.",
  },
  {
    icon: "🔒",
    bg: "bg-wellness-50",
    title: "Privacy by design",
    body: "NDPA-compliant consent and a hard wall between employer and individual data.",
  },
  {
    icon: "🤝",
    bg: "bg-brand-25",
    title: "Community + care",
    body: "Anonymous community plus real 1:1 therapy — the whole spectrum of support.",
  },
];

/** Employees dashboard preview — roster rows are deliberately anonymised. */
export const employeeRoster = [
  { ini: "A", bg: "linear-gradient(135deg,#017FC8,#0D2240)", masked: "Employee #1042", status: "Active", sessions: "4" },
  { ini: "B", bg: "linear-gradient(135deg,#3BA88F,#1F6B59)", masked: "Employee #1043", status: "Active", sessions: "2" },
  { ini: "C", bg: "linear-gradient(135deg,#C79A3B,#9A7526)", masked: "Employee #1044", status: "Invited", sessions: "—" },
  { ini: "D", bg: "linear-gradient(135deg,#7A5AF8,#4E3AB0)", masked: "Employee #1045", status: "Active", sessions: "6" },
  { ini: "E", bg: "linear-gradient(135deg,#017FC8,#0D2240)", masked: "Employee #1046", status: "Invited", sessions: "—" },
];

export const seatManagementPoints = [
  {
    title: "CSV or manual invites",
    body: "Onboard hundreds at once with format validation.",
  },
  {
    title: "Per-employee session caps",
    body: "Control monthly usage limits per seat.",
  },
  { title: "Anonymised by default", body: "Identities are masked — always." },
];

/** Billing dashboard preview. */
export const billingPreview = {
  thisMonth: { amount: "₦960,000", note: "64 sessions × ₦15,000" },
  seatsBilled: { count: "187", note: "Only active users" },
  invoices: [
    { month: "July 2026", sessions: "64", amount: "₦960,000" },
    { month: "June 2026", sessions: "58", amount: "₦870,000" },
    { month: "May 2026", sessions: "41", amount: "₦615,000" },
  ],
};

export const businessSteps = [
  {
    n: "01",
    title: "Create your org",
    body: "Sign up with your work email and confirm your company domain.",
  },
  {
    n: "02",
    title: "Invite your team",
    body: "Upload a roster or add people manually. Set session caps per seat.",
  },
  {
    n: "03",
    title: "Watch wellbeing grow",
    body: "Employees book care privately; you see anonymised trends and pay per session.",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
 * MOCK DATA — B2B Admin (HR) dashboard
 * UI-only phase. Transcribed from "TalkAM B2B Dashboard.dc.html".
 *
 * Every figure here is anonymised/aggregate by design — the PRD's hard rule is
 * that an employer never sees individual employee data. Employee rows carry an
 * EMP-#### id and a session COUNT, never session content.
 * ═══════════════════════════════════════════════════════════════════════════ */

export const adminWorkspace = {
  name: "Zenith Bank Nigeria",
  meta: "Team Plan · 247 seats",
  initial: "Z",
  accent: "#017FC8",
  portalLabel: "Business Portal",
};

export const adminUser = {
  name: "Adaeze Okonkwo",
  role: "HR Manager",
  initials: "AO",
  email: "adaeze.okonkwo@zenithbank.com",
  phone: "+234 801 234 5678",
  avatarBg: "#E8F7F4",
  avatarColor: "#1F6B59",
};

/** Topbar title/subtitle per page. */
export const adminPageMeta = {
  overview: { title: "Overview", subtitle: "Zenith Bank Nigeria · July 2026" },
  employees: { title: "Employees", subtitle: "247 seats · Team Plan" },
  therapists: { title: "Therapist Network", subtitle: "6 verified therapists serving your team" },
  "my-therapists": { title: "My Therapists", subtitle: "Therapists active in your organisation" },
  reports: { title: "Reports", subtitle: "Anonymised wellness data · NDPA compliant" },
  billing: { title: "Billing", subtitle: "Team Plan · ₦1,480,000/month" },
  trust: { title: "Trust & Safety", subtitle: "Anonymised reports · handled by TalkAM" },
  settings: { title: "Settings", subtitle: "Company, notifications & integrations" },
  activity: { title: "Activity Log", subtitle: "Admin actions across your workspace" },
  help: { title: "Help & Support", subtitle: "Answers, guides, and live help when you need it" },
};

/* ── Overview ─────────────────────────────────────────────────────────── */

export const overviewKpis = [
  { key: "employees", value: "247", label: "Total Employees", badge: "+12 this month", tone: "blue", iconBg: "bg-brand-25", iconColor: "#017FC8", icon: "users" },
  { key: "active", value: "184", label: "Active Users This Month", badge: "74.5% rate", tone: "green", iconBg: "bg-wellness-50", iconColor: "#3BA88F", icon: "check" },
  { key: "sessions", value: "328", label: "Sessions This Month", badge: "+23% vs Jun", tone: "gold", iconBg: "bg-gold-50", iconColor: "#9A6E0A", icon: "calendar" },
];

/** Daily session bars — July. Index 5 is the highlighted day (Jul 14). */
export const sessionActivityBars = [50, 63, 45, 75, 68, 88, 93, 80, 100, 73, 62, 78];
export const sessionActivityHighlight = 5;
export const sessionActivityLabels = ["Jul 1", "4", "7", "9", "11", "14", "16", "18", "20", "22", "25", "28"];

export const topTopics = [
  { label: "Work Stress", pct: 34, color: "#017FC8" },
  { label: "Anxiety", pct: 26, color: "#3BA88F" },
  { label: "Relationships", pct: 18, color: "#DBB66E" },
  { label: "Depression", pct: 12, color: "#6B44A8" },
  { label: "Other", pct: 10, color: "#C4C8D4" },
];

export const recentSessions = [
  { id: "EMP-0047", dept: "Technology", therapist: "Dr. Adewale K.", type: "Video", date: "Jul 16, 2:00 PM", status: "Completed" },
  { id: "EMP-0112", dept: "Operations", therapist: "Dr. Chioma O.", type: "Audio", date: "Jul 16, 11:00 AM", status: "Completed" },
  { id: "EMP-0203", dept: "Finance", therapist: "Dr. Emeka N.", type: "Video", date: "Jul 15, 4:00 PM", status: "Pending" },
  { id: "EMP-0089", dept: "HR", therapist: "Dr. Adewale K.", type: "Chat", date: "Jul 15, 2:00 PM", status: "Completed" },
  { id: "EMP-0167", dept: "Legal", therapist: "Dr. Chioma O.", type: "Video", date: "Jul 14, 10:00 AM", status: "Completed" },
];

/* ── ROI ──────────────────────────────────────────────────────────────── */

export const ROI_INPUTS = {
  sessionsThisMonth: 328,
  absenteeismDaysPerSession: 0.35,
  avgDailyProductivityValue: 21000,
  programCostThisMonth: 1480000,
};

export const naira = (n) => `₦${Math.round(n).toLocaleString("en-NG")}`;

const grossValue =
  ROI_INPUTS.sessionsThisMonth *
  ROI_INPUTS.absenteeismDaysPerSession *
  ROI_INPUTS.avgDailyProductivityValue;

export const roi = {
  sessions: ROI_INPUTS.sessionsThisMonth,
  daysPerSession: ROI_INPUTS.absenteeismDaysPerSession,
  dailyValue: naira(ROI_INPUTS.avgDailyProductivityValue),
  programCost: naira(ROI_INPUTS.programCostThisMonth),
  grossValue: naira(grossValue),
  netROI: naira(grossValue - ROI_INPUTS.programCostThisMonth),
  multiple: `${(grossValue / ROI_INPUTS.programCostThisMonth).toFixed(1)}x return`,
  headline: `₦${(grossValue / 1e6).toFixed(1)}M`,
};

/* ── Employees ────────────────────────────────────────────────────────── */

export const employees = [
  { id: "EMP-0047", email: "empl47@zenithbank.com", dept: "Technology", status: "active", used: 7, total: 12, lastActive: "Today, 2:00 PM" },
  { id: "EMP-0112", email: "empl112@zenithbank.com", dept: "Operations", status: "active", used: 4, total: 12, lastActive: "Today, 11:00 AM" },
  { id: "EMP-0203", email: "empl203@zenithbank.com", dept: "Finance", status: "invited", used: 0, total: 12, lastActive: "—" },
  { id: "EMP-0089", email: "empl89@zenithbank.com", dept: "HR", status: "active", used: 10, total: 12, lastActive: "Yesterday" },
  { id: "EMP-0167", email: "empl167@zenithbank.com", dept: "Legal", status: "inactive", used: 2, total: 12, lastActive: "Jul 10" },
  { id: "EMP-0231", email: "empl231@zenithbank.com", dept: "Technology", status: "active", used: 5, total: 12, lastActive: "Today, 9:00 AM" },
  { id: "EMP-0305", email: "empl305@zenithbank.com", dept: "Finance", status: "active", used: 8, total: 12, lastActive: "Yesterday" },
  { id: "EMP-0088", email: "empl88@zenithbank.com", dept: "Operations", status: "invited", used: 0, total: 12, lastActive: "—" },
  { id: "EMP-0402", email: "empl402@zenithbank.com", dept: "HR", status: "active", used: 3, total: 12, lastActive: "Jul 12" },
  { id: "EMP-0511", email: "empl511@zenithbank.com", dept: "Legal", status: "inactive", used: 1, total: 12, lastActive: "Jul 5" },
];

export const employeeDepartments = ["All Departments", "Technology", "Finance", "Operations", "HR", "Legal"];
export const employeeStatuses = ["All Status", "Active", "Invited", "Inactive"];
export const EMPLOYEES_PER_PAGE = 5;

export const sessionActivityLog = [
  { id: "sa1", employeeId: "EMP-0047", therapistName: "Dr. Adewale K.", datetime: "Thu Jul 9 · 2:00 PM", status: "upcoming" },
  { id: "sa2", employeeId: "EMP-0089", therapistName: "Dr. Chioma O.", datetime: "Fri Jul 10 · 10:00 AM", status: "upcoming" },
  { id: "sa3", employeeId: "EMP-0305", therapistName: "Dr. Emeka N.", datetime: "Tue Jul 7 · 3:00 PM", status: "held" },
  { id: "sa4", employeeId: "EMP-0167", therapistName: "Dr. Ngozi U.", datetime: "Mon Jul 6 · 11:00 AM", status: "missed" },
  { id: "sa5", employeeId: "EMP-0402", therapistName: "Dr. Oluwaseun F.", datetime: "Jul 2 · 4:00 PM", status: "held" },
  { id: "sa6", employeeId: "EMP-0511", therapistName: "Dr. Blessing T.", datetime: "Jun 29 · 9:00 AM", status: "missed" },
];

/* ── Therapists ───────────────────────────────────────────────────────── */

export const therapists = [
  { id: "th-ak", initials: "AK", name: "Dr. Adewale K.", specialty: "Anxiety · CBT", sessions: 64, rating: "4.9", availability: "Today 4pm", avatarBg: "#017FC8", inNetwork: true, monthSessions: 12, provider: "network", billing: "talkam" },
  { id: "th-co", initials: "CO", name: "Dr. Chioma O.", specialty: "Relationships", sessions: 51, rating: "4.8", availability: "Tomorrow 10am", avatarBg: "#3BA88F", inNetwork: true, monthSessions: 9, provider: "network", billing: "talkam" },
  { id: "th-en", initials: "EN", name: "Dr. Emeka N.", specialty: "Work Stress", sessions: 47, rating: "4.7", availability: "Jul 18, 2pm", avatarBg: "#9A6E0A", inNetwork: true, monthSessions: 7, provider: "network", billing: "talkam" },
  { id: "th-nu", initials: "NU", name: "Dr. Ngozi U.", specialty: "Grief Counselling", sessions: 22, rating: "5.0", availability: "Jul 17, 11am", avatarBg: "#6B44A8", inNetwork: true, monthSessions: 4, provider: "network", billing: "talkam" },
  { id: "th-of", initials: "OF", name: "Dr. Oluwaseun F.", specialty: "Depression", sessions: 38, rating: "4.9", availability: "Today 6pm", avatarBg: "#AC4242", inNetwork: false, monthSessions: 0, provider: "network", billing: "talkam" },
  { id: "th-bt", initials: "BT", name: "Dr. Blessing T.", specialty: "PTSD / Trauma", sessions: 19, rating: "4.8", availability: "Jul 19, 9am", avatarBg: "#017FC8", inNetwork: false, monthSessions: 0, provider: "network", billing: "talkam" },
  { id: "th-io", initials: "IO", name: "Dr. Ifeoma O.", specialty: "In-house · Wellbeing", sessions: 8, rating: "4.9", availability: "By arrangement", avatarBg: "#1F8A5B", inNetwork: true, monthSessions: 6, provider: "own", billing: "self" },
];

export const specialtyOptions = [
  "All Specialties",
  "Anxiety · CBT",
  "Relationships",
  "Work Stress",
  "Grief Counselling",
  "Depression",
  "PTSD / Trauma",
  "In-house · Wellbeing",
];

/** Aggregated from employees' private onboarding self-check-ins. */
export const teamNeeds = [
  { label: "Work Stress", pct: 34, color: "#017FC8" },
  { label: "Anxiety", pct: 27, color: "#3BA88F" },
  { label: "Sleep & Mood", pct: 19, color: "#DBB66E" },
  { label: "Relationships", pct: 14, color: "#6B44A8" },
];

export const networkStats = {
  seatsUsed: 50,
  seatsTotal: 50,
  sessionsUsed: 21,
  sessionsBundle: 25,
  nextReset: "1 Aug 2026",
};

/* ── Reports ──────────────────────────────────────────────────────────── */

export const companyMonthly = [
  { label: "Feb", value: 41 },
  { label: "Mar", value: 78 },
  { label: "Apr", value: 122 },
  { label: "May", value: 190 },
  { label: "Jun", value: 268 },
  { label: "Jul", value: 328 },
];

export const reportCards = [
  { key: "usage", title: "Monthly Usage Report", body: "Session counts, active users, engagement rate by department. Anonymised.", generated: "Jul 14", iconBg: "bg-brand-25", iconColor: "#017FC8", tone: "primary" },
  { key: "wellness", title: "Wellness Trend Analysis", body: "Topic trends, repeat sessions, mood indicators. 90-day rolling data.", generated: "Jul 1", iconBg: "bg-wellness-50", iconColor: "#3BA88F", tone: "teal" },
  { key: "roi", title: "ROI & Productivity Report", body: "Estimated absenteeism reduction, cost per session, wellness ROI calculation.", generated: "Jun 30", iconBg: "bg-gold-50", iconColor: "#9A6E0A", tone: "gold" },
];

/* ── Trust & Safety ───────────────────────────────────────────────────── */

export const safetyReports = [
  { id: "RPT-0231", reported: "Dr. Emeka N.", reportedRole: "therapist", category: "Late to session", categoryTone: "gold", filedBy: "Employee (anon.)", date: "Jul 15", status: "Under review", statusTone: "red" },
  { id: "RPT-0198", reported: "EMP-0167", reportedRole: "employee", category: "Inappropriate chat", categoryTone: "purple", filedBy: "Dr. Chioma O.", date: "Jul 11", status: "Resolved", statusTone: "green" },
];

/* ── Billing ──────────────────────────────────────────────────────────── */

export const currentPlan = {
  label: "TEAM PLAN · ACTIVE",
  lines: [
    { label: "Employee Seats · 50 × ₦2,000", value: "₦100,000" },
    { label: "Therapist Network Access · 50 × ₦3,500", value: "₦175,000" },
    { label: "Session Bundle · 25 × ₦8,000", value: "₦200,000" },
  ],
  total: "₦475,000",
  renews: "Renews Aug 1, 2026 · billed monthly",
};

export const invoices = [
  { id: "INV-2026-07", period: "Jul 1 – Jul 31, 2026", seats: 50, amount: "₦475,000", status: "Due Aug 14", tone: "gold" },
  { id: "INV-2026-06", period: "Jun 1 – Jun 30, 2026", seats: 50, amount: "₦435,000", status: "Paid", tone: "green" },
  { id: "INV-2026-05", period: "May 1 – May 31, 2026", seats: 50, amount: "₦395,000", status: "Paid", tone: "green" },
  { id: "INV-2026-04", period: "Apr 1 – Apr 30, 2026", seats: 50, amount: "₦355,000", status: "Paid", tone: "green" },
];

export const CURRENT_SEATS = 250;

export const PLANS = {
  lite: {
    key: "lite", name: "Wellbeing Lite", isCurrent: true, seatRange: "Up to 500 seats",
    minSeats: 1, maxSeats: 500, defaultSeats: 250,
    tiers: [
      { min: 1, max: 100, price: 7000 },
      { min: 101, max: 300, price: 6000 },
      { min: 301, max: 500, price: 5500 },
    ],
    features: ["Community + subsidised sessions", "Monthly PDF report", "2 HR admin seats"],
  },
  core: {
    key: "core", name: "Wellbeing Core", isCurrent: false, seatRange: "501 – 2,000 seats",
    minSeats: 501, maxSeats: 2000, defaultSeats: 501,
    tiers: [
      { min: 501, max: 1000, price: 4500 },
      { min: 1001, max: 1500, price: 4000 },
      { min: 1501, max: 2000, price: 3500 },
    ],
    features: ["Unlimited sessions", "Weekly reporting", "5 HR admin seats"],
  },
  plus: {
    key: "plus", name: "Wellbeing Plus", isCurrent: false, seatRange: "2,000+ seats",
    custom: true,
    features: ["Dedicated account manager", "Custom EAP reporting", "Unlimited HR seats"],
  },
};

export const tierForSeats = (tiers, seats) =>
  tiers.find((t) => seats >= t.min && seats <= t.max) ?? tiers[tiers.length - 1];

export const topUpOptions = [
  { key: "10", sessions: 10 },
  { key: "25", sessions: 25, tag: "Most popular" },
  { key: "50", sessions: 50 },
];

export const seatPackOptions = [
  { key: "10", seats: 10 },
  { key: "25", seats: 25, tag: "Most popular" },
  { key: "50", seats: 50 },
];

/* ── Activity log ─────────────────────────────────────────────────────── */

export const activityLog = [
  { actor: "Adaeze Okonkwo", action: "invited 12 employees from Technology", when: "2 hours ago", tone: "blue", icon: "user-plus" },
  { actor: "Adaeze Okonkwo", action: "added Dr. Ifeoma O. as an in-house therapist", when: "Yesterday", tone: "teal", icon: "heart" },
  { actor: "Tunde Balogun", action: "downloaded the June usage report", when: "Yesterday", tone: "gold", icon: "download" },
  { actor: "Adaeze Okonkwo", action: "topped up the session bundle by 25 sessions", when: "Jul 14", tone: "blue", icon: "credit-card" },
  { actor: "Adaeze Okonkwo", action: "enabled two-factor authentication", when: "Jul 12", tone: "purple", icon: "lock" },
  { actor: "Tunde Balogun", action: "marked invoice INV-2026-06 as paid", when: "Jul 8", tone: "green", icon: "check" },
  { actor: "Adaeze Okonkwo", action: "set the per-employee session cap to 6", when: "Jul 3", tone: "blue", icon: "settings" },
  { actor: "Adaeze Okonkwo", action: "deactivated 1 employee seat", when: "Jul 1", tone: "red", icon: "user-minus" },
];

/* ── Help ─────────────────────────────────────────────────────────────── */

export const adminFaqs = [
  { q: "How do I add or remove employee seats?", a: "Go to Employees → Invite People to add new seats, or open an employee row and select Remove to free up a seat. Billing updates automatically on your next invoice." },
  { q: "Can I see what my employees discuss in therapy or the community?", a: 'No. TalkAM for Business is built on a strict privacy boundary — admins only ever see anonymised, aggregate trends (like "34% of check-ins mention work stress"). Individual sessions, messages, and posts are never visible to an employer account.' },
  { q: "How is my monthly bill calculated?", a: "Billing is based on your seat count tier blended with a network-wide therapist-rate fairness index, shown transparently on the Billing page. You can review the full breakdown there at any time." },
  { q: "How do I invite a therapist to our bench instead of an employee?", a: 'Use Invite People and tag the invite as "Therapist" instead of "Employee" — they will go through our credential verification flow instead of the employee onboarding.' },
  { q: "What happens to data if we cancel our plan?", a: "Employees keep their individual TalkAM accounts and history. Your company loses access to the aggregate dashboard, and your admin seat is deactivated at the end of the billing period." },
  { q: "Who do I contact for a compliance or security question?", a: "Use the live chat below, or email compliance@talkam.net — our team responds within one business day." },
];

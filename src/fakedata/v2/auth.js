/* ═══════════════════════════════════════════════════════════════════════════
 * MOCK DATA — B2B auth & onboarding
 * UI-only phase. Copy, pricing tiers and defaults transcribed from
 * "TalkAM B2B Auth.dc.html".
 * ═══════════════════════════════════════════════════════════════════════════ */

/** Demo company used throughout the onboarding flow. */
export const DEMO_COMPANY = {
  name: "Zenith Bank Nigeria",
  domain: "zenithbank.com",
  adminEmail: "adaeze.okonkwo@zenithbank.com",
  inviteeName: "Chidinma Eze",
  inviteeEmail: "chidinma.eze@zenithbank.com",
};

/** Left brand panel copy, keyed by screen. */
export const authBrandContent = {
  signup: {
    eyebrow: "FOR EMPLOYERS",
    title: "Give your team real mental health support.",
    body: "Enrol employees anonymously, track engagement in aggregate, and pay one clean monthly invoice — no clinical detail ever reaches HR.",
    points: ["Verified Nigerian therapists only", "NDPA 2023 compliant by design", "No individual employee data, ever"],
  },
  domain: {
    eyebrow: "FOR EMPLOYERS",
    title: "Verifying your company keeps everyone safe.",
    body: "Domain confirmation stops anyone from claiming a company they don't control — a requirement before any employee can be invited.",
    points: ["One-time domain check", "15-minute code expiry", "Company admins only"],
  },
  seats: {
    eyebrow: "FOR EMPLOYERS",
    title: "Pricing locks in the moment you choose seats.",
    body: "Nothing downstream — plan pricing, therapist bench setup — is calculated until your seat count is set.",
    points: ["Volume discounts apply automatically", "Change your seat count anytime", "No charge until employees activate"],
  },
  plan: {
    eyebrow: "FOR EMPLOYERS",
    title: "Fair pricing, explained plainly.",
    body: "Your rate blends your seat-count tier with a network-wide average therapist session rate, so pricing stays balanced no matter which therapists your team books.",
    points: ["Unlimited community access", "Subsidised therapy sessions", "Monthly anonymised reporting"],
  },
  therapistBench: {
    eyebrow: "FOR EMPLOYERS",
    title: "Shape your therapist bench.",
    body: "Tell us which specialties matter most to your team — we prioritise onboarding matching verified therapists first.",
    points: ["Individual employees can still book anyone", "Fully optional — skip anytime", "Refine anytime from Therapist Network"],
  },
  invite: {
    eyebrow: "ONBOARDING",
    title: "Two roles, two very different flows.",
    body: "Employees head straight into topic-of-interest onboarding. Therapists are routed into credential verification before they can accept sessions.",
    points: ["CSV bulk upload supported", "Role assigned per invite", "Resend or revoke anytime"],
  },
  inviteSent: {
    eyebrow: "ONBOARDING",
    title: "Invites are on their way.",
    body: "Each recipient gets a unique, single-use link. Nothing is created until they accept.",
    points: ["Tracked: sent / opened / joined", "Auto-reminder after 7 days", "No seat charged until activation"],
  },
  landing: {
    eyebrow: "INVITED MEMBER",
    title: "Private by default.",
    body: "Whatever you do on TalkAM — posts, sessions, mood check-ins — your employer only ever sees anonymised, aggregate numbers.",
    points: ["Your employer cannot see your activity", "Your community username stays private", "You can leave the program anytime"],
  },
  consent: {
    eyebrow: "NDPA 2023",
    title: "Nothing is assumed. Everything is chosen.",
    body: "Four separate categories, each opted in individually. No box is ever pre-ticked.",
    points: ["Account & session consent required", "Community & research consent optional", "Change anytime in Privacy Settings"],
  },
  topics: {
    eyebrow: "PERSONALISE",
    title: "Same categories as the mobile community.",
    body: "This just shapes what you see first — you can browse or post in any topic regardless.",
    points: ["Anxiety · Depression · Relationships", "Work Stress · Grief · General Support", "Editable anytime from Profile"],
  },
  assessment: {
    eyebrow: "PRIVATE & CONFIDENTIAL",
    title: "Matched to the right therapist, faster.",
    body: "Your answers stay private — only anonymised, company-wide patterns (after at least 5 responses) ever reach HR, and only to help them prioritise which specialists to bring on.",
    points: ["Never shared individually, ever", "Refine your matches anytime", "Takes about 2 minutes"],
  },
  complete: {
    eyebrow: "READY",
    title: "Welcome to TalkAM.",
    body: "Your account is fully set up.",
    points: ["Company verified", "Consent recorded with timestamp", "Topics personalised"],
  },
  signin: {
    eyebrow: "WELCOME BACK",
    title: "One dashboard, three roles.",
    body: "Admins, employees and therapists all sign in here — each lands on a completely different home.",
    points: ["Business email required", "No OAuth on web dashboard", "2FA available in Settings"],
  },
  twofa: {
    eyebrow: "WELCOME BACK",
    title: "One dashboard, three roles.",
    body: "Admins, employees and therapists all sign in here — each lands on a completely different home.",
    points: ["Business email required", "No OAuth on web dashboard", "2FA available in Settings"],
  },
  forgot: {
    eyebrow: "ACCOUNT RECOVERY",
    title: "We'll get you back in.",
    body: "Reset links are single-use and expire after 30 minutes for security.",
    points: ["Sent to your verified work email", "No security questions needed", "Contact admin if email changed"],
  },
};

/** Volume pricing tiers. `max: null` means "and above". */
export const SEAT_TIERS = [
  { min: 1, max: 100, price: 7000 },
  { min: 101, max: 300, price: 6000 },
  { min: 301, max: 500, price: 5500 },
  { min: 501, max: null, price: 5000 },
];

export const EMP_SEAT_RATE = 2000;
export const THERAPIST_ACCESS_RATE = 3500;
export const SESSION_RATE = 8000;

/** Blended-pricing constants from the deck's "how this price is calculated". */
export const STANDARD_THERAPIST_RATE = 15000;
export const NETWORK_AVERAGE_RATE = 15450;

export const naira = (n) => `₦${Math.round(n).toLocaleString("en-NG")}`;

export const bundleOptions = [
  { key: "10", sessions: 10 },
  { key: "25", sessions: 25, tag: "Most popular" },
  { key: "50", sessions: 50 },
];

export const planFeatures = [
  "Unlimited anonymous community access on mobile",
  "Subsidised 1:1 therapy sessions (video, voice, chat)",
  "Anonymised utilisation dashboard, refreshed daily",
  "Monthly PDF report, board-ready",
  "Up to 2 HR admin seats",
  "Dedicated onboarding support",
];

export const inviteRows = [
  { email: "chidinma.eze@zenithbank.com", dept: "Technology", role: "employee", initial: "C", avatarBg: "#017FC8" },
  { email: "tunde.balogun@zenithbank.com", dept: "Finance", role: "employee", initial: "T", avatarBg: "#3BA88F" },
  { email: "dr.ngozi.uba@practice.ng", dept: "Clinical", role: "therapist", initial: "N", avatarBg: "#9A6E0A" },
  { email: "fatima.bello@zenithbank.com", dept: "Operations", role: "employee", initial: "F", avatarBg: "#6B44A8" },
];

export const consentDefs = [
  { key: "account", title: "Account operation", tag: "REQUIRED", desc: "Basic account data needed to log you in and keep your account secure." },
  { key: "session", title: "Session delivery", tag: "REQUIRED", desc: "Encrypted data needed to book, deliver and record your therapy sessions." },
  { key: "community", title: "Anonymous community", tag: "OPTIONAL", desc: "Post and reply in the anonymous community feed. Off by default." },
  { key: "research", title: "Anonymised research", tag: "OPTIONAL", desc: "Let aggregated, de-identified data improve TalkAM's programs." },
];

export const topicDefs = [
  { key: "anxiety", label: "Anxiety" },
  { key: "depression", label: "Depression" },
  { key: "relationships", label: "Relationships" },
  { key: "work", label: "Work Stress" },
  { key: "grief", label: "Grief" },
  { key: "general", label: "General Support" },
];

export const benchTopicDefs = [
  { key: "anxiety", label: "Anxiety" },
  { key: "depression", label: "Depression" },
  { key: "relationships", label: "Relationships" },
  { key: "work", label: "Work Stress" },
  { key: "grief", label: "Grief" },
  { key: "trauma", label: "PTSD / Trauma" },
];

export const assessmentDefs = [
  { cat: "work", label: "Work-related stress", concern: "Work Stress" },
  { cat: "anxiety", label: "Anxiety or worry", concern: "Anxiety" },
  { cat: "sleep", label: "Sleep or low mood", concern: "Sleep & Mood" },
  { cat: "relationships", label: "Relationships or family", concern: "Relationships" },
];

export const assessmentOptions = [
  { val: 0, label: "Not at all" },
  { val: 1, label: "Mild" },
  { val: 2, label: "Moderate" },
  { val: 3, label: "Significant" },
];

/** Ordered screen list — powers the review-only screen switcher. */
export const AUTH_SCREENS = [
  { id: "signup", label: "Company Signup", path: "sign-up" },
  { id: "domain", label: "Domain Verify", path: "verify" },
  { id: "seats", label: "Choose Seats", path: "seats" },
  { id: "plan", label: "Plan & Billing", path: "plan" },
  { id: "therapistBench", label: "Therapist Bench", path: "therapist-bench" },
  { id: "invite", label: "Invite Team", path: "invite" },
  { id: "inviteSent", label: "Invites Sent", path: "invite-sent" },
  { id: "landing", label: "Invite Landing", path: "join" },
  { id: "consent", label: "Consent", path: "consent" },
  { id: "topics", label: "Topics of Interest", path: "topics" },
  { id: "assessment", label: "Self Check-in", path: "self-check" },
  { id: "complete", label: "Complete", path: "welcome" },
  { id: "signin", label: "Sign In", path: "login" },
  { id: "twofa", label: "Two-Factor", path: "two-factor" },
  { id: "forgot", label: "Forgot Password", path: "forgot-password" },
];

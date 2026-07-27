/**
 * B2B auth & onboarding — static design copy.
 *
 * These are not data: they are the left brand panel's per-screen copy and the
 * review-only screen switcher, both transcribed from
 * "TalkAM B2B Auth.dc.html". Everything that IS data (pricing tiers, seat
 * rates, consent keys, topic chips, the self-check questionnaire, invite rows)
 * now comes from api/v2/business — see planning-docs/web-api/01-b2b-auth.md.
 */

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
    body: "Your rate is the volume-tier price for your seat count — a flat facilitation fee, billed monthly. Turn on TalkAM's therapist network and you only pay for the sessions your team actually uses.",
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

/** Ordered screen list — powers the review-only screen switcher (`?screens=1`). */
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

/* ═══════════════════════════════════════════════════════════════════════════
 * MOCK DATA — TalkAM Pricing page
 * UI-only phase; replace with API/CMS data when Pricing is wired up.
 * Copy + figures transcribed from "TalkAM Pricing.dc.html".
 * ═══════════════════════════════════════════════════════════════════════════ */

/** The three billing layers. */
export const pricingTiers = [
  {
    id: "seats",
    name: "Employee Seats",
    price: "₦2,000",
    unit: "/employee/mo",
    badge: "PER EMPLOYEE",
    highlight: false,
    body: "One seat per employee — unlocks the TalkAM app, anonymous community, mood tracking and self-guided tools.",
    note: "Billed monthly after activation, NGN. Only active seats are charged.",
  },
  {
    id: "therapist-access",
    name: "Therapist Access",
    price: "₦3,500",
    unit: "/employee/mo",
    badge: "MOST POPULAR",
    highlight: true,
    body: "Add-on per seat that lets employees book verified therapists across the TalkAM network.",
    note: "Optional layer. Add it for your whole team or a subset of seats.",
  },
  {
    id: "session-bundle",
    name: "Session Bundle",
    price: "₦8,000",
    unit: "/session",
    badge: "FLAT RATE",
    highlight: false,
    body: "A shared, pre-purchased pool of sessions drawn down as employees book — a flat rate, company-wide.",
    note: "Reserved on your invoice; top up anytime. The same flat rate is paid to every therapist.",
  },
];

/** "Every plan includes" grid. */
export const pricingIncluded = [
  {
    title: "Unlimited 1:1 therapy booking",
    body: "Every employee can book with any verified therapist on the network, no per-session fee.",
  },
  {
    title: "Anonymous community access",
    body: "Full access to TalkAM's community spaces under a private, work-unlinked identity.",
  },
  {
    title: "Anonymised company reports",
    body: "Aggregate wellness trends for your team — never individual employee data.",
  },
  {
    title: "NDPA-compliant consent flows",
    body: "Built-in, opt-in consent management aligned with the Nigeria Data Protection Act 2023.",
  },
  {
    title: "Dedicated therapist bench",
    body: "Prioritized specialties matched to what your team actually needs.",
  },
  {
    title: "Admin & HR dashboard",
    body: "Manage seats, invites, billing, and trust & safety from one place.",
  },
];

/** Worked example panel — "EXAMPLE · 50 EMPLOYEES". */
export const pricingExample = {
  heading: "EXAMPLE · 50 EMPLOYEES",
  lines: [
    { label: "Employee Seats · 50 × ₦2,000", value: "₦100,000" },
    { label: "Therapist Access · 50 × ₦3,500", value: "₦175,000" },
    { label: "Session Bundle · 25 × ₦8,000", value: "₦200,000" },
  ],
  total: { label: "Total / month", value: "₦475,000" },
};

export const pricingFaqs = [
  {
    q: "How does the three-layer pricing work?",
    a: "You pay ₦2,000 per employee seat and ₦3,500 per seat for therapist access each month, plus a shared Session Bundle at a flat ₦8,000 per session. Seats are per-person; the session pool is bought in blocks and shared across the whole team.",
  },
  {
    q: "Are session tokens per employee or shared?",
    a: "Shared. The Session Bundle is a company-wide pool — any employee draws from it when they book, until it runs out. You can then top up, and set an optional per-employee cap from Settings to keep usage balanced.",
  },
  {
    q: "When am I first charged?",
    a: "Never at signup. TalkAM is post-paid by default — your first invoice is generated only once your first employee activates their account. You settle by bank transfer, or pay by card via Flutterwave for instant setup.",
  },
  {
    q: "What is the therapist paid per session?",
    a: "A flat ₦8,000 per B2B session, set by TalkAM and identical for every therapist on the network. It is drawn from your session bundle — there are no per-therapist markups or negotiated rates.",
  },
  {
    q: "Can we bring our own therapist?",
    a: "Yes. Invite a therapist you already work with; they complete the same verification. You then choose whether their sessions are billed through TalkAM (drawing from your bundle) or settled directly with you.",
  },
  {
    q: "Do unused sessions or seats roll over?",
    a: "Seats are billed monthly by active count, so unused seats simply aren't charged. Session bundles are pre-purchased and remain available until drawn down — top up whenever the pool runs low.",
  },
];

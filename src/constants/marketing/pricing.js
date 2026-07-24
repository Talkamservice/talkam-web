/* ═══════════════════════════════════════════════════════════════════════════
 * STATIC CONTENT — TalkAM Pricing page (web §07)
 *
 * The page's editorial copy (tier descriptions, the "every plan includes" grid,
 * the FAQ). The actual RATES come from GET business/pricing-config so the numbers
 * track the backend; the tier prices and the worked example are built from that
 * config by the helpers below.
 *
 * Copy transcribed from "TalkAM Pricing.dc.html".
 * ═══════════════════════════════════════════════════════════════════════════ */

const naira = (n) => `₦${Math.round(n).toLocaleString("en-NG")}`;

/** Per-tier copy; the price is filled from pricing-config. `rateKey` selects it. */
const PRICING_TIER_COPY = [
  {
    id: "seats",
    name: "Employee Seats",
    rateKey: "employee_seat_rate",
    unit: "/employee/mo",
    badge: "PER EMPLOYEE",
    highlight: false,
    body: "One seat per employee — unlocks the TalkAM app, anonymous community, mood tracking and self-guided tools.",
    note: "Billed monthly after activation, NGN. Only active seats are charged.",
  },
  {
    id: "therapist-access",
    name: "Therapist Access",
    rateKey: "therapist_access_rate",
    unit: "/employee/mo",
    badge: "MOST POPULAR",
    highlight: true,
    body: "Add-on per seat that lets employees book verified therapists across the TalkAM network.",
    note: "Optional layer. Add it for your whole team or a subset of seats.",
  },
  {
    id: "session-bundle",
    name: "Session Bundle",
    rateKey: "session_rate",
    unit: "/session",
    badge: "FLAT RATE",
    highlight: false,
    body: "A shared, pre-purchased pool of sessions drawn down as employees book — a flat rate, company-wide.",
    note: "Reserved on your invoice; top up anytime. The same flat rate is paid to every therapist.",
  },
];

/** Tier cards with the price pulled from pricing-config. */
export const buildPricingTiers = (config) =>
  PRICING_TIER_COPY.map((tier) => ({
    ...tier,
    price: naira(config?.[tier.rateKey] ?? 0),
  }));

/** The "EXAMPLE · 50 EMPLOYEES" panel, computed from the live rates. */
const EXAMPLE_SEATS = 50;
const EXAMPLE_BUNDLE = 25;

export const buildPricingExample = (config) => {
  const seatRate = config?.employee_seat_rate ?? 0;
  const accessRate = config?.therapist_access_rate ?? 0;
  const sessionRate = config?.session_rate ?? 0;

  const seats = EXAMPLE_SEATS * seatRate;
  const access = EXAMPLE_SEATS * accessRate;
  const bundle = EXAMPLE_BUNDLE * sessionRate;

  return {
    heading: `EXAMPLE · ${EXAMPLE_SEATS} EMPLOYEES`,
    lines: [
      { label: `Employee Seats · ${EXAMPLE_SEATS} × ${naira(seatRate)}`, value: naira(seats) },
      { label: `Therapist Access · ${EXAMPLE_SEATS} × ${naira(accessRate)}`, value: naira(access) },
      { label: `Session Bundle · ${EXAMPLE_BUNDLE} × ${naira(sessionRate)}`, value: naira(bundle) },
    ],
    total: { label: "Total / month", value: naira(seats + access + bundle) },
  };
};

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

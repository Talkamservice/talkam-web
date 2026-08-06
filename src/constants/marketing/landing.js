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

/**
 * "Inside the app" showcase — the three pre-rendered card artworks.
 *
 * The artwork carries its own headline and sub-copy as PIXELS, so `title` and
 * `body` here are transcriptions of what is baked into each PNG. They are
 * rendered as visually-hidden text: without them the section contributes three
 * images and no heading to the document outline, and a screen reader gets
 * nothing but the alt text.
 *
 * `aspect` comes from the pixels. All three files are 804×1748 and share a
 * pixel-identical type grid (headline y88–271, sub-copy y311–401, plus a third
 * sub-copy line at y419–455 on the therapists card), after which the phone runs
 * to y1747 and bleeds off an unauthored bottom edge — so a top-anchored crop
 * loses nothing. How much can be cut differs per card, though: 1 and 2 hold a
 * straight-on phone spanning x48–754 that reads at any height, while 3's phone
 * enters narrow at y640 and its hand only reaches the frame edge at y1141. Crop
 * 3 to the others' height and you get a small phone adrift in empty black.
 *
 * So card 3's 1500 is a floor, not a preference. The 1150/1300 on the other two
 * are a choice: both clear their own content comfortably, and stepping the three
 * heights up in gentle increments turns that constraint into a deliberate
 * rhythm — which is also what opens the space each card's emoji chip sits in.
 * Because the type grid is shared, flush tops put all three baked headlines on
 * one baseline, so the differing heights read as designed rather than as drift.
 *
 * That staircase only earns its keep when the three cards are seen TOGETHER, so
 * it starts at `lg`. Below that the row is a filmstrip showing one card at a
 * time, where unequal heights stop reading as rhythm and just leave a few
 * hundred pixels of blank under the shorter cards — hence the uniform 1500 crop
 * on mobile, which also lets cards 1 and 2 show nearly their whole phone.
 */
export const appShowcaseCards = [
  {
    key: "community",
    title: "Talk freely. Be heard.",
    body: "Join thousands of Nigerians sharing journeys anonymously with support.",
    alt: "The TalkAM community feed on a phone, showing an anonymous post in the Anxiety topic with replies.",
    aspect: "aspect-[804/1500] lg:aspect-[804/1150]",
    chip: { emoji: "🙂", label: "How are you feeling?" },
  },
  {
    key: "safety",
    title: "Share safely, no judgement",
    body: "Join a community that understands. Post anonymously and find support.",
    alt: "A TalkAM community page on a phone, showing the Anxiety group with 46K members and a subscribe button.",
    aspect: "aspect-[804/1500] lg:aspect-[804/1300]",
    chip: { emoji: "💙", label: "You're not alone" },
  },
  {
    key: "therapists",
    title: "Access licensed therapists",
    body: "Find a trusted therapist, start a video or voice call, and track your progress in one place.",
    alt: "A hand holding a phone showing a TalkAM therapist profile with specialties, session formats and reviews.",
    aspect: "aspect-[804/1500]",
    chip: { emoji: "🌱", label: "7 days in a row" },
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

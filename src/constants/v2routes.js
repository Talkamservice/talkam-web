/**
 * Route map for the TalkAM web platform (marketing site + B2B dashboards).
 *
 * These are the site's canonical URLs — the marketing site is served from the
 * root. The legacy v1 community app keeps its own paths (/home, /ads,
 * /settings, /groups, …) and is reached directly rather than from "/".
 *
 * Only two paths ever collided with v1: "/" (v1 used to redirect it to /home)
 * and "/pricing" (v1's TalkAM Plus consumer upgrade, now at /plus).
 */
export const V2_ROOT = "";

const at = (path = "") => `${V2_ROOT}${path}`;

export const V2 = {
  root: "/",
  landing: "/",
  pricing: at("/pricing"),
  forBusiness: at("/for-business"),
  forTherapists: at("/for-therapists"),
  privacy: at("/privacy-policy"),
  terms: at("/terms"),
  blog: at("/blog"),
  blogPost: (slug = ":slug") => at(`/blog/${slug}`),

  // B2B auth & onboarding
  businessLogin: at("/business/login"),
  businessSignUp: at("/business/sign-up"),
  businessVerify: at("/business/verify"),
  businessSeats: at("/business/seats"),
  businessPlan: at("/business/plan"),
  businessTherapistBench: at("/business/therapist-bench"),
  businessInvite: at("/business/invite"),
  businessInviteSent: at("/business/invite-sent"),
  businessJoin: at("/business/join"),
  businessConsent: at("/business/consent"),
  businessTopics: at("/business/topics"),
  businessSelfCheck: at("/business/self-check"),
  businessWelcome: at("/business/welcome"),
  businessTwoFactor: at("/business/two-factor"),
  businessForgotPassword: at("/business/forgot-password"),
  businessTherapistApply: at("/business/join"),

  // B2B dashboards
  admin: at("/business/admin"),
  employee: at("/business/employee"),
  therapist: at("/business/therapist"),
};

/**
 * Marketing nav link sets. Each deck specifies its own row — they are NOT the
 * same set, so every page passes the one its deck shows.
 */

/** Spec: Landing 1C — NAV. */
export const MARKETING_NAV = [
  { label: "The App", to: `${V2.landing}#app`, hash: true },
  { label: "For Business", to: V2.forBusiness },
  { label: "For Therapists", to: V2.forTherapists },
  { label: "Journal", to: V2.blog },
];

/** Spec: "TalkAM Pricing.dc.html" — NAV. */
export const PRICING_NAV = [
  { label: "Features", to: `${V2.landing}#app`, hash: true },
  { label: "Pricing", to: V2.pricing },
  { label: "FAQ", to: `${V2.landing}#faq`, hash: true },
];

/** Spec: "TalkAM For Business.dc.html" / "TalkAM For Therapists.dc.html" — NAV. */
export const PRODUCT_NAV = [
  { label: "The App", to: V2.landing },
  { label: "For Business", to: V2.forBusiness },
  { label: "For Therapists", to: V2.forTherapists },
  { label: "Pricing", to: V2.pricing },
  { label: "Journal", to: V2.blog },
];

/** Spec: "TalkAM Blog.dc.html" — NAV (three links only). */
export const JOURNAL_NAV = [
  { label: "The App", to: V2.landing },
  { label: "For Business", to: V2.pricing },
  { label: "Journal", to: V2.blog },
];

/** Footer link groups — spec: Landing 1C footer. */
export const FOOTER_GROUPS = [
  {
    title: "Product",
    links: [
      { label: "The App", to: `${V2.landing}#app`, hash: true },
      { label: "Pricing", to: V2.pricing },
      { label: "Journal", to: V2.blog },
      { label: "For Business", to: V2.forBusiness },
      { label: "For Therapists", to: V2.forTherapists },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "#", hash: true },
      { label: "Careers", to: "#", hash: true },
      { label: "Contact", to: "#", hash: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: V2.privacy },
      { label: "Terms of Use", to: V2.terms },
    ],
  },
];

/** Spec: "TalkAM Blog.dc.html" — FOOTER (three-link PRODUCT column, no BUSINESS). */
export const JOURNAL_FOOTER_GROUPS = [
  {
    title: "Product",
    links: [
      { label: "The App", to: V2.landing },
      { label: "Pricing", to: V2.pricing },
      { label: "Journal", to: V2.blog, current: true },
    ],
  },
  FOOTER_GROUPS[1],
  FOOTER_GROUPS[2],
];

/** Live store listings for the TalkAM mobile app. */
export const APP_STORE_URL =
  "https://apps.apple.com/za/app/talkam-tech/id6740508182";
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.talkamtech.app&pcampaignid=web_share";

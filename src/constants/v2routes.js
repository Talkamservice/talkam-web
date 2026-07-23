/**
 * Route map for the TalkAM v2 web platform (marketing site + B2B dashboards).
 *
 * DECISION — every v2 route is namespaced under `/v2` so the build is purely
 * additive: the v1 app already owns `/` (redirects to /home), `/pricing`,
 * `/login` and `/sign-up`. Promoting v2 to the site root later is a one-line
 * change to V2_ROOT plus the router mount path — no component touches.
 */
export const V2_ROOT = "/v2";

const at = (path = "") => `${V2_ROOT}${path}`;

export const V2 = {
  root: V2_ROOT,
  landing: at(""),
  pricing: at("/pricing"),
  forBusiness: at("/for-business"),
  forTherapists: at("/for-therapists"),
  privacy: at("/privacy-policy"),
  terms: at("/terms"),
  blog: at("/blog"),
  blogPost: (slug = ":slug") => at(`/blog/${slug}`),

  // B2B auth
  businessLogin: at("/business/login"),
  businessSignUp: at("/business/sign-up"),
  businessVerify: at("/business/verify"),
  businessTwoFactor: at("/business/two-factor"),
  businessForgotPassword: at("/business/forgot-password"),
  businessResetPassword: at("/business/reset-password"),
  businessTherapistApply: at("/business/therapist-apply"),

  // B2B dashboards
  admin: at("/business/admin"),
  employee: at("/business/employee"),
  therapist: at("/business/therapist"),
};

/** Primary marketing nav — spec: Landing 1C nav row. */
export const MARKETING_NAV = [
  { label: "The App", to: `${V2.landing}#app`, hash: true },
  { label: "For Business", to: V2.forBusiness },
  { label: "For Therapists", to: V2.forTherapists },
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

/** Live store listings for the TalkAM mobile app. */
export const APP_STORE_URL =
  "https://apps.apple.com/za/app/talkam-tech/id6740508182";
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.talkamtech.app&pcampaignid=web_share";

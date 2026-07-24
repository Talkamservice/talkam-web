/**
 * Admin dashboard — static design copy and shared presentation helpers.
 *
 * Everything that is DATA (KPIs, topics, rosters, therapists, reports, safety
 * queue, activity) comes from api/v2/business — see
 * planning-docs/web-api/03-admin-dashboard.md. Note §0 of that plan: three deck
 * panels asked for individual employee data and are deliberately served as
 * company-wide aggregates instead.
 */

export const adminPortalLabel = "Business Portal";

/** Topbar title per page; subtitles that quote live numbers are built per page. */
export const adminPageMeta = {
  overview: { title: "Overview" },
  employees: { title: "Employees" },
  therapists: { title: "Therapist Network" },
  "my-therapists": { title: "My Therapists", subtitle: "Therapists active in your organisation" },
  reports: { title: "Reports", subtitle: "Anonymised wellness data · NDPA compliant" },
  billing: { title: "Billing" },
  trust: { title: "Trust & Safety", subtitle: "Anonymised reports · handled by TalkAM" },
  settings: { title: "Settings", subtitle: "Company, notifications & integrations" },
  activity: { title: "Activity Log", subtitle: "Admin actions across your workspace" },
  help: { title: "Help & Support", subtitle: "Answers, guides, and live help when you need it" },
};

/** Deck bar/segment palette, cycled by position. */
export const TOPIC_BAR_COLOURS = ["#017FC8", "#3BA88F", "#DBB66E", "#6B44A8", "#C4C8D4"];

export const AVATAR_COLOURS = ["#017FC8", "#3BA88F", "#9A6E0A", "#6B44A8", "#AC4242", "#1F8A5B"];

export const avatarColour = (seed = "") => {
  const sum = [...String(seed)].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_COLOURS[sum % AVATAR_COLOURS.length];
};

export const naira = (n) =>
  n === null || n === undefined ? "—" : `₦${Math.round(Number(n)).toLocaleString("en-NG")}`;

/** "₦2.4M" for the dark ROI tile. */
export const compactNaira = (n) => {
  if (n === null || n === undefined) return "—";
  const value = Number(n);
  if (value >= 1e9) return `₦${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `₦${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `₦${(value / 1e3).toFixed(0)}K`;
  return naira(value);
};

/** Status chip tones used across the roster and the safety queue. */
export const STATUS_TONE = {
  active: "green",
  invited: "gold",
  inactive: "grey",
  Pending: "gold",
  Resolved: "green",
  Unresolved: "red",
};

/** "Dr. Adewale Kolawole" → "AK". */
export const initialsOf = (name = "") =>
  String(name)
    .split(/\s+/)
    .filter((w) => !["dr", "dr.", "mr", "mr.", "mrs", "mrs.", "ms", "ms.", "prof", "prof."].includes(w.toLowerCase()))
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

export const EMPLOYEES_PER_PAGE = 5;

/**
 * Pick the volume tier a seat count falls into (web §07 billing). Operates on
 * the `tiers` arrays returned by the billing catalogue; falls back to the last
 * tier for counts above the highest band.
 */
export const tierForSeats = (tiers = [], seats) =>
  tiers.find((t) => seats >= t.min && seats <= t.max) ?? tiers[tiers.length - 1];

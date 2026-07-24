/**
 * Employee dashboard — static design copy and the mood-scale mapping.
 *
 * Transcribed from "TalkAM B2B Employee Dashboard.dc.html". None of this is
 * data: it is labels, emoji, encouragement copy and the palettes the deck
 * specifies. Everything that IS data (check-ins, sessions, care team, topics,
 * consents, FAQs) comes from api/v2 — see planning-docs/web-api/02-employee-dashboard.md.
 */

export const employeePortalLabel = "My Wellbeing";

/** Deck: `pageDefs`. Subtitles that quote live numbers are built per page. */
export const employeePageMeta = {
  home: { title: "Home" },
  sessions: { title: "My Sessions" },
  checkins: {
    title: "Check-ins & Mood",
    subtitle: "Private trend summary — full history on mobile",
  },
  community: { title: "Community", subtitle: "Anonymous · trending this week" },
  messages: { title: "Messages", subtitle: "Encrypted · therapist chat" },
  profile: { title: "Profile & Privacy", subtitle: "Account, consent & safety" },
  help: {
    title: "Help & Support",
    subtitle: "Answers, guides, and live help when you need it",
  },
};

/** Deck: `notifKindColor`. */
export const NOTIF_KIND_COLOR = {
  reminder: "#017FC8",
  feedback: "#DBB66E",
  checkin: "#AC4242",
  message: "#3BA88F",
};

/**
 * The deck's five-point emoji scale mapped onto the API's 1–5 integer mood.
 * `great` is the top of the scale, matching MoodConstants MAX.
 */
export const MOODS = [
  { key: "great", value: 5, emoji: "😄", label: "Great" },
  { key: "good", value: 4, emoji: "🙂", label: "Good" },
  { key: "okay", value: 3, emoji: "😐", label: "Okay" },
  { key: "low", value: 2, emoji: "😔", label: "Low" },
  { key: "rough", value: 1, emoji: "😣", label: "Rough" },
];

/**
 * Deck: `homeMoodRow` — deliberately the reverse of MOODS; the Home check-in
 * runs Rough → Great.
 */
export const HOME_MOODS = [...MOODS].reverse();

export const MOOD_BY_VALUE = MOODS.reduce((acc, m) => ({ ...acc, [m.value]: m }), {});
export const MOOD_EMOJI = MOODS.reduce((acc, m) => ({ ...acc, [m.key]: m.emoji }), {});

/** Nearest emoji for a fractional average (e.g. 3.6 → 🙂). */
export const moodEmojiForAverage = (average) => {
  if (average === null || average === undefined) return "—";
  return MOOD_BY_VALUE[Math.round(average)]?.emoji ?? "—";
};

/** Deck: `MOOD_MESSAGES`. */
export const MOOD_MESSAGES = {
  great: "That's wonderful to hear — keep doing what's working for you! 🌟",
  good: "Glad you're doing well. Small steady days add up.",
  okay: "Okay days are still valid days. Be gentle with yourself.",
  low: "Sorry you're having a tough time. Consider reaching out to your therapist or a trusted friend today.",
  rough:
    "That sounds really hard. You don't have to carry it alone — your therapist and TalkAM's support line are here anytime.",
};

/**
 * Deck: `factorTags` emoji. The factor keys and labels come from the API
 * (config('v2.checkins.factors')); only the emoji are presentation.
 */
export const FACTOR_EMOJI = {
  work: "💼",
  sleep: "😴",
  family: "👨‍👩‍👧",
  health: "🩺",
  money: "💰",
  social: "💬",
  exercise: "🏃",
  rest: "🧘",
};

/** Deck: `typeMeta`. */
export const SESSION_TYPE_META = {
  video: { label: "Video session", short: "Video" },
  voice: { label: "Voice session", short: "Voice" },
  chat: { label: "Chat session", short: "Chat" },
};

/** Deck: `recommended` — curated resource cards. Deep-links land with §05. */
export const recommended = [
  {
    tag: "GUIDED",
    title: "5-minute box breathing",
    sub: "Calm your nervous system before a busy day",
    tint: "#EEF4FC",
    accent: "#017FC8",
    icon: "M22 12h-4l-3 9L9 3l-3 9H2",
  },
  {
    tag: "READ",
    title: "Setting boundaries at work",
    sub: "A practical guide from the TalkAM library",
    tint: "#E8F7F4",
    accent: "#1F6B59",
    icon: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
  },
];

/** Deck: `qrSeed` — deterministic QR-ish 8×8 pattern for the "Get the app" card. */
export const qrSeed = [
  1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1,
  1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1,
  0, 0, 0, 0, 1, 0, 0, 1, 1, 1,
];

/** Deck: `chipPalette` — community topic chips, cycled by position. */
export const TOPIC_CHIP_PALETTE = [
  { chipBg: "#EEF4FC", chipFg: "#015C94" },
  { chipBg: "#FFF0F0", chipFg: "#8B2E2E" },
  { chipBg: "#F5F0FF", chipFg: "#6B44A8" },
  { chipBg: "#F0F0F2", chipFg: "#717171" },
  { chipBg: "#E8F7F4", chipFg: "#1F6B59" },
  { chipBg: "#FBF5E8", chipFg: "#9A6E0A" },
];

/** Deck: avatar tints, picked deterministically so a person keeps their colour. */
export const AVATAR_COLOURS = ["#017FC8", "#3BA88F", "#9A6E0A", "#6B44A8", "#858585"];

export const avatarColour = (seed = "") => {
  const sum = [...String(seed)].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_COLOURS[sum % AVATAR_COLOURS.length];
};

/** "Dr. Adewale K." → "AK". */
export const initialsOf = (name = "") =>
  String(name)
    .split(/\s+/)
    .filter((w) => !["dr", "dr.", "mr", "mr.", "mrs", "mrs.", "ms", "ms.", "prof", "prof."].includes(w.toLowerCase()))
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

/** Deck: `sessionPrep`. Guidance copy — deliberately not persisted (plan D3). */
export const sessionPrep = [
  "Complete your pre-session mood check-in",
  "Find a quiet, private space",
  "Jot down what you'd like to talk about",
];

/** Deck: Profile & Privacy consent rows, keyed by the API's consent keys. */
export const CONSENT_COPY = {
  account_operation: { title: "Account operation" },
  session_delivery: { title: "Session delivery" },
  anonymous_community: { title: "Anonymous community" },
  anonymised_research: { title: "Anonymised research" },
};

export const CONSENT_ORDER = [
  "account_operation",
  "session_delivery",
  "anonymous_community",
  "anonymised_research",
];

/** Deck: `reasonDefs` — report modal. */
export const reportReasons = [
  { key: "late", label: "Therapist was late or unavailable" },
  { key: "unprofessional", label: "Unprofessional conduct" },
  { key: "chat", label: "Inappropriate message in chat" },
  { key: "other", label: "Something else" },
];

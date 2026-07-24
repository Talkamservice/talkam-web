/* ═══════════════════════════════════════════════════════════════════════════
 * The TalkAM Journal — presentation constants (web §05)
 * Palette + category order transcribed from "TalkAM Blog.dc.html". These are
 * static design tokens; article data itself comes from the journal API.
 * ═══════════════════════════════════════════════════════════════════════════ */

export const BLOG_COLORS = {
  blue: { hex: "#017FC8", tint: "#EEF4FC", avatar: "linear-gradient(135deg,#017FC8,#0D2240)" },
  green: { hex: "#3BA88F", tint: "#E8F7F4", avatar: "linear-gradient(135deg,#3BA88F,#1F6B59)" },
  gold: { hex: "#C79A3B", tint: "#FAF3E4", avatar: "linear-gradient(135deg,#DBB66E,#C79A3B)" },
};

/** Chip order from the deck. */
export const BLOG_CATEGORY_ORDER = [
  "Anxiety & Stress",
  "Workplace Wellbeing",
  "Self-Care",
  "Relationships",
  "Therapy 101",
  "Community Stories",
];

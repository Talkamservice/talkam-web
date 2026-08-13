import { useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import * as Icon from "react-feather";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Card,
  PanelCard,
  Badge,
  SecondaryButton,
  Withheld,
  AdminSkeleton as Skeleton,
} from "../../../../../components/v2/dashboard/chrome";
import { DsAccordion } from "../../../../../components/v2/accordion";
import { useTherapist } from "../therapistlayout";
import { V2 } from "../../../../../constants/v2routes";
import {
  onboardingChecklist,
  CHECKLIST_TONE,
  WEEK_DAYS,
  CANDIDATE_SLOTS,
  analyticsRangeOpts,
  RATING_BAR_COLOURS,
  therapistNotifRows,
  avatarColour,
  initialsOf,
  naira,
  slotLabel,
  sessionWhen,
  countdownTo,
  SESSION_FORMAT_LABEL,
} from "../../../../../constants/therapistdashboard";
import {
  useGetTherapistHomeQuery,
  useGetTherapistSessionsQuery,
  useAcknowledgeSessionMutation,
  useDeclineSessionMutation,
  useGetTherapistSessionRequestsQuery,
  useDeclineSessionRequestMutation,
  useGetAvailabilityQuery,
  useUpdateAvailabilityMutation,
  useGetTherapistAnalyticsQuery,
  useGetEarningsQuery,
  useGetTherapistProfileQuery,
  useUpdateTherapistProfileMutation,
  useRespondToBookingRescheduleMutation,
} from "../../../../../services/v2/therapistApiSlice";
import { useGetMeV2Query } from "../../../../../services/v2/authApiSliceV2";
import {
  useGetFaqsQuery,
  useGetPrivacySettingsQuery,
  useSavePrivacySettingsMutation,
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useStartConversationMutation,
} from "../../../../../services/v2/employeeApiSlice";
import { apiErrorMessage } from "../../auth/authlayout";
import { selectCurrentToken } from "../../../../../services/authSlice";
import { useConversationChannel } from "../../../../../hooks/useConversationChannel";

/**
 * All eight therapist dashboard pages, wired to api/v2/therapist.
 * Spec: "TalkAM B2B Therapist Dashboard.dc.html". Data comes from the §04
 * aggregates and the reused §§11–14/16 endpoints; only labels and palettes are
 * local (constants/therapistdashboard.js).
 */

const TealButton = ({ className, children, ...props }) => (
  <button
    type="button"
    className={classNames(
      "inline-flex cursor-pointer items-center gap-[7px] rounded-[10px] bg-wellness-400 px-4 py-[9px]",
      "text-[13px] font-boldNunito text-white transition-colors hover:bg-wellness-600 disabled:cursor-not-allowed disabled:bg-surface-muted",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

const EmptyNote = ({ children }) => (
  <div className="rounded-[10px] bg-[#F8F9FC] px-3.5 py-3 text-[12px] leading-[1.6] text-ink-400">
    {children}
  </div>
);

/** The three home-stat glyphs (deck `_icon`). */
const StatIcon = ({ name, stroke }) => {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth: 2 };
  if (name === "star")
    return (
      <svg {...common}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  if (name === "users")
    return (
      <svg {...common}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      </svg>
    );
  return (
    <svg {...common}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
};

/** A pending reschedule on a session — the requester waits, the counterpart
 *  gets an inline accept/decline. Renders nothing without one. Mirrors the
 *  employee dashboard's own PendingRescheduleBanner. */
const PendingRescheduleBanner = ({ session, showToast, dark = true }) => {
  const { data: me } = useGetMeV2Query();
  const [respond, { isLoading }] = useRespondToBookingRescheduleMutation();
  const pr = session?.pending_reschedule;

  if (!pr) return null;

  const isMine = pr.requested_by === me?.id;

  if (isMine) {
    return (
      <div
        className={classNames(
          "relative z-[1] mb-4 w-full rounded-[10px] border px-3.5 py-3 text-[12px]",
          dark ? "border-white/[0.16] bg-white/10 text-white/70" : "border-ink-200 bg-ink-50 text-ink-500"
        )}
      >
        Reschedule requested — waiting on them to confirm {sessionWhen(pr.new_starts_at)}.
      </div>
    );
  }

  const act = async (action) => {
    try {
      await respond({ id: pr.id, action }).unwrap();
      showToast(action === "accept" ? "Reschedule confirmed" : "Reschedule declined");
    } catch (err) {
      showToast(apiErrorMessage(err, "Couldn't respond to that — please try again"));
    }
  };

  return (
    <div
      className={classNames(
        "relative z-[1] mb-4 w-full rounded-[10px] border px-3.5 py-3",
        dark ? "border-white/[0.16] bg-white/10" : "border-ink-200 bg-ink-50"
      )}
    >
      <div className={classNames("mb-2 text-[12px]", dark ? "text-white/80" : "text-ink-600")}>
        New time proposed: {sessionWhen(pr.new_starts_at)}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => act("decline")}
          disabled={isLoading}
          className={classNames(
            "flex-1 cursor-pointer rounded-[8px] border px-3 py-2 text-[11.5px] font-boldNunito",
            dark ? "border-white/[0.18] bg-transparent text-white" : "border-ink-200 bg-white text-ink-600"
          )}
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => act("accept")}
          disabled={isLoading}
          className="flex-1 cursor-pointer rounded-[8px] bg-wellness-400 px-3 py-2 text-[11.5px] font-extraboldNunito text-white"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

/* ── HOME ─────────────────────────────────────────────────────────────── */

export const TherapistHome = () => {
  const { open, showToast } = useTherapist();
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [checklistOpen, setChecklistOpen] = useState(true);
  const [paused, setPaused] = useState(false);

  const { data: me } = useGetMeV2Query();
  const { data: home, isLoading } = useGetTherapistHomeQuery();
  const [startConversation, { isLoading: isOpeningChat }] = useStartConversationMutation();

  // Deck greets a therapist as "Dr. {last name}", falling back to "Doctor"
  // while /me is still resolving.
  const lastName = (me?.name ?? "").trim().split(/\s+/).filter(Boolean).slice(-1)[0];
  const firstName = lastName ? `Dr. ${lastName}` : "Doctor";
  const next = home?.next_session;
  const kpis = home?.kpis ?? {};
  const attention = home?.attention ?? {};
  const continuity = home?.continuity ?? [];
  const review = home?.latest_review;
  const isBusinessEmployed = home?.employment?.is_business_employed;

  const messageClient = async () => {
    if (!next?.id) return;
    try {
      const conversation = await startConversation(next.id).unwrap();
      navigate(`${V2.therapist}/messages`, { state: { conversationId: conversation.id } });
    } catch (err) {
      showToast(apiErrorMessage(err, "Couldn't open that conversation — please try again"));
    }
  };

  const checklistItems = onboardingChecklist.items;
  const last = slide === checklistItems.length - 1;

  // Auto-advance the getting-started carousel — each slide slides left after a
  // beat and loops at the end. Pauses on hover and for reduced-motion users.
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!isBusinessEmployed || !checklistOpen || paused || reduceMotion) {
      return undefined;
    }
    const id = setTimeout(
      () => setSlide((i) => (i + 1) % checklistItems.length),
      5000
    );
    return () => clearTimeout(id);
  }, [slide, isBusinessEmployed, checklistOpen, paused, reduceMotion, checklistItems.length]);

  /* Deck's "needs your attention" strip, built from the live counts. */
  const followups = [
    attention.pending_notes
      ? { key: "notes", count: attention.pending_notes, title: "Session notes pending", sub: "Write them up before your next session", cta: "Write notes", tint: "#FBF5E8", stroke: "#9A6E0A", accent: "#9A6E0A" }
      : null,
    attention.reschedule_requests
      ? { key: "reschedule", count: attention.reschedule_requests, title: "Reschedule request", sub: "A client asked to move a session", cta: "Review", tint: "#F5F0FF", stroke: "#6B44A8", accent: "#6B44A8" }
      : null,
    attention.unread_messages
      ? { key: "inbox", count: attention.unread_messages, title: "Unread client messages", sub: "Clients are waiting to hear back", cta: "Open inbox", tint: "#EEF4FC", stroke: "#017FC8", accent: "#017FC8" }
      : null,
  ].filter(Boolean);

  const homeStats = [
    { icon: "cal", tint: "#EEF4FC", stroke: "#017FC8", value: String(kpis.sessions_this_week ?? 0), label: "Sessions this week", delta: "This week", deltaColor: "#858585" },
    { icon: "star", tint: "#FBF5E8", stroke: "#9A6E0A", value: kpis.rating ?? "—", label: "Average rating", delta: kpis.rating ? "★★★★★" : "No reviews yet", deltaColor: "#9A6E0A" },
    { icon: "users", tint: "#EEF4FC", stroke: "#017FC8", value: String(kpis.sessions_completed ?? 0), label: "Sessions completed", delta: kpis.notes_due ? `${kpis.notes_due} notes due` : "All notes done", deltaColor: kpis.notes_due ? "#AC4242" : "#1F8A5B" },
  ];

  return (
    <>
      <div>
        <div className="mb-[3px] flex flex-wrap items-center gap-2.5">
          <span className="text-[20px] font-blackNunito tracking-[-0.01em] text-navy-800">
            Good morning, {firstName}
          </span>
          <span className="inline-flex items-center gap-[5px] rounded-full bg-[linear-gradient(135deg,#6B44A8,#8B5FC2)] px-2.5 py-1 text-[10px] font-extraboldNunito tracking-[0.05em] text-white shadow-[0_3px_8px_rgba(107,68,168,0.3)]">
            <span className="h-[5px] w-[5px] rounded-full bg-white" />
            V2 PREVIEW
          </span>
        </div>
        <div className="text-[13px] text-ink-400">
          {next
            ? `Your next session starts ${countdownTo(next.starts_at) === "now" ? "now" : `in ${countdownTo(next.starts_at)}`}`
            : "No sessions scheduled right now"}
        </div>
      </div>

      {/* getting-started carousel — only for business-employed therapists */}
      {isBusinessEmployed && checklistOpen ? (
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="relative overflow-hidden rounded-[18px] border border-[#E0D3F5] bg-[linear-gradient(135deg,#F3EEFB,#EEF4FC)] px-[22px] py-5"
        >
          <div aria-hidden="true" className="pointer-events-none absolute -right-5 -top-[30px] h-[150px] w-[150px] rounded-full bg-[radial-gradient(circle,rgba(107,68,168,0.12)_0%,transparent_68%)]" />
          <div className="relative z-[1]">
            <div className="mb-4 flex items-start justify-between gap-3.5">
              <div className="flex gap-[13px]">
                <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#6B44A8,#8B5FC2)] shadow-[0_6px_14px_rgba(107,68,168,0.28)]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </span>
                <div>
                  <div className="text-[15px] font-blackNunito tracking-[-0.01em] text-navy-800">
                    {onboardingChecklist.title}
                  </div>
                  <div className="max-w-[520px] text-[12px] leading-[1.5] text-[#6A5A85]">
                    {onboardingChecklist.subtitle}
                  </div>
                </div>
              </div>
              <button type="button" onClick={() => setChecklistOpen(false)} title="Dismiss" aria-label="Dismiss" className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-[8px] bg-[rgba(107,68,168,0.1)]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B44A8" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="p-0.5">
              {/* Viewport frame; the track slides horizontally beneath it. */}
              <div className="relative min-h-[150px] overflow-hidden rounded-[14px] border border-[#EBE3F7] bg-white shadow-[0_8px_22px_rgba(107,68,168,0.10)]">
                <div
                  className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
                  style={{ transform: `translateX(-${slide * 100}%)` }}
                >
                  {checklistItems.map((it, i) => {
                    const itemTone = CHECKLIST_TONE[it.tone];
                    return (
                      <div key={i} className="relative flex min-h-[150px] w-full shrink-0 flex-col px-6 py-[22px]">
                        <span className="absolute right-5 top-3.5 text-[34px] font-blackNunito leading-none tracking-[-0.02em] text-[rgba(107,68,168,0.09)]">
                          {`0${i + 1}`}
                        </span>
                        <div className="mb-3 flex items-center gap-2">
                          <span className="rounded-full px-[9px] py-[3px] text-[9.5px] font-extraboldNunito tracking-[0.05em]" style={{ background: itemTone.bg, color: itemTone.fg }}>
                            {itemTone.label}
                          </span>
                        </div>
                        <div className="mb-[9px] max-w-[90%] text-[18px] font-blackNunito leading-[1.3] tracking-[-0.01em] text-navy-800">
                          {it.title}
                        </div>
                        <div className="max-w-[94%] text-[13px] leading-[1.62] text-[#5B5B6B]">{it.sub}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3.5">
              <button type="button" onClick={() => setSlide((i) => Math.max(0, i - 1))} aria-label="Previous" className={classNames("flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] border border-[#E0D3F5] bg-white", slide === 0 ? "cursor-not-allowed text-[#C9BEDE] opacity-55" : "cursor-pointer text-[#6B44A8]")}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <div className="flex items-center gap-[7px]">
                {onboardingChecklist.items.map((_, i) => (
                  <button key={i} type="button" aria-label={`Slide ${i + 1}`} onClick={() => setSlide(i)} className={classNames("h-2 cursor-pointer rounded-full transition-all", i === slide ? "w-[22px] bg-[#6B44A8]" : "w-2 bg-[rgba(107,68,168,0.25)]")} />
                ))}
              </div>
              {last ? (
                <button type="button" onClick={() => setChecklistOpen(false)} className="flex cursor-pointer items-center gap-[7px] whitespace-nowrap rounded-[10px] bg-[linear-gradient(135deg,#6B44A8,#8B5FC2)] px-4 py-[9px] text-[12.5px] font-extraboldNunito text-white shadow-[0_6px_14px_rgba(107,68,168,0.28)]">
                  Got it
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </button>
              ) : (
                <button type="button" onClick={() => setSlide((i) => i + 1)} className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-[10px] bg-navy-800 px-4 py-[9px] text-[12.5px] font-extraboldNunito text-white">
                  Next
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* next session hero + follow-ups */}
      <div className="grid items-stretch gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="relative flex flex-col overflow-hidden rounded-[18px] border border-[#1E2D5A] bg-[linear-gradient(135deg,#0F1E3D,#17305C)] p-[22px]">
          <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-[200px] w-[200px] rounded-full bg-[radial-gradient(circle,rgba(1,127,200,0.28)_0%,transparent_65%)]" />
          <div className="relative z-[1] mb-4 flex items-center justify-between gap-3">
            <span className="text-[11px] font-extraboldNunito tracking-[0.1em] text-brand-200">UP NEXT</span>
            {next ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.15] bg-white/10 px-[11px] py-[5px] text-[11px] font-boldNunito text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3BA88F]" />
                Starts in {countdownTo(next.starts_at)}
              </span>
            ) : null}
          </div>

          {next ? (
            <>
              <div className="relative z-[1] mb-4 flex flex-wrap items-center gap-3.5">
                <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[15px] text-[18px] font-extraboldNunito text-white shadow-[0_6px_16px_rgba(0,0,0,0.25)]" style={{ background: avatarColour(next.client_ref) }}>
                  {next.client_ref?.replace("#", "").slice(0, 1)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[18px] font-extraboldNunito text-white">Anonymous · {next.client_ref}</div>
                  <div className="text-[12px] text-white/55">
                    {next.session_number} · {sessionWhen(next.starts_at).split(" · ")[1]} · {SESSION_FORMAT_LABEL[next.format] ?? next.format}
                  </div>
                </div>
                {next.focus ? (
                  <span className="shrink-0 rounded-full bg-[rgba(1,127,200,0.25)] px-[11px] py-[5px] text-[11px] font-boldNunito text-[#9BD0F0]">{next.focus}</span>
                ) : null}
              </div>
              {next.last_note ? (
                <div className="relative z-[1] mb-4 rounded-[12px] border border-white/[0.09] bg-white/[0.06] px-3.5 py-3">
                  <div className="mb-[5px] text-[10px] font-boldNunito tracking-[0.06em] text-white/40">FROM YOUR LAST SESSION</div>
                  <div className="text-[12.5px] leading-[1.55] text-white/80">{next.last_note}</div>
                </div>
              ) : null}
              <PendingRescheduleBanner session={next} showToast={showToast} />
              <div className="relative z-[1] mt-auto flex gap-2.5">
                <button type="button" onClick={() => open("joinConfirm", next)} className="flex-1 cursor-pointer rounded-[11px] bg-brand-400 p-3 text-center text-[13px] font-extraboldNunito text-white shadow-[0_6px_16px_rgba(1,127,200,0.35)]">
                  Join Session →
                </button>
                <button
                  type="button"
                  onClick={messageClient}
                  disabled={isOpeningChat}
                  className="cursor-pointer rounded-[11px] border border-white/[0.16] bg-white/10 px-4 py-3 text-[13px] font-boldNunito text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isOpeningChat ? "Opening…" : "Message"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="relative z-[1] mb-1 text-[16px] font-extraboldNunito text-white">Nothing scheduled</div>
              <div className="relative z-[1] text-[12px] leading-[1.6] text-white/55">When a client books, your next session appears here.</div>
              <div className="relative z-[1] mt-auto pt-5">
                <Link to={`${V2.therapist}/availability`} className="block w-full cursor-pointer rounded-[11px] bg-brand-400 p-3 text-center text-[13px] font-extraboldNunito text-white">
                  Manage availability →
                </Link>
              </div>
            </>
          )}
        </div>

        <div>
          <div className="mb-3 text-[13px] font-extraboldNunito text-navy-800">Needs your attention</div>
          {isLoading ? (
            <Skeleton className="h-[120px]" />
          ) : followups.length ? (
            <div className="flex flex-col gap-2.5">
              {followups.map((f) => (
                <button key={f.key} type="button" onClick={() => open(f.key)} style={{ borderLeftColor: f.accent }} className="flex cursor-pointer items-center gap-3 rounded-[12px] border border-surface-line border-l-[3px] bg-white px-[15px] py-[13px] text-left">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] text-[13px] font-extraboldNunito" style={{ background: f.tint, color: f.stroke }}>{f.count}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12.5px] font-extraboldNunito text-navy-800">{f.title}</span>
                    <span className="block text-[11px] leading-[1.4] text-ink-400">{f.sub}</span>
                  </span>
                  <span className="shrink-0 text-[11px] font-boldNunito" style={{ color: f.accent }}>{f.cta} →</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-[12px] border border-[#BFE6DC] bg-wellness-50 p-5 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F8A5B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              </span>
              <div className="text-[13px] font-extraboldNunito text-wellness-600">You&apos;re all caught up</div>
              <div className="text-[11.5px] leading-[1.5] text-[#3E7A6B]">No pending notes, requests, or unread messages. Nice work.</div>
            </div>
          )}
        </div>
      </div>

      {/* stats with deltas */}
      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {homeStats.map((st) => (
          <Card key={st.label}>
            <span className="mb-3.5 flex h-[38px] w-[38px] items-center justify-center rounded-[11px]" style={{ background: st.tint }}>
              <StatIcon name={st.icon} stroke={st.stroke} />
            </span>
            <div className="mb-[3px] text-[28px] font-blackNunito text-navy-800">{st.value}</div>
            <div className="mb-2 text-[12px] text-ink-400">{st.label}</div>
            <div className="text-[11px] font-boldNunito" style={{ color: st.deltaColor }}>{st.delta}</div>
          </Card>
        ))}
        <Link to={`${V2.therapist}/availability`} className="relative overflow-hidden rounded-ds-lg border border-navy-600 bg-[linear-gradient(135deg,#141B34,#1A2E5A)] p-5">
          <span aria-hidden="true" className="pointer-events-none absolute -right-[15px] -top-[15px] h-[100px] w-[100px] rounded-full bg-[radial-gradient(circle,rgba(219,182,110,0.18)_0%,transparent_65%)]" />
          <span className="relative z-[1] mb-1.5 block text-[11px] text-white/45">
            {kpis.utilisation !== null && kpis.utilisation !== undefined ? `${kpis.utilisation}% utilised this week` : "Set your weekly hours"}
          </span>
          <span className="relative z-[1] block text-[18px] font-blackNunito leading-[1.3] text-white">Manage availability →</span>
        </Link>
      </div>

      {/* continuity of care */}
      <div>
        <div className="mb-3.5 text-[13px] font-extraboldNunito text-navy-800">Coming up · continuity of care</div>
        <div className="overflow-hidden rounded-ds-lg border border-surface-line bg-white">
          {continuity.length === 0 ? (
            <div className="p-5"><EmptyNote>No upcoming sessions yet. Your continuity notes appear here as clients book.</EmptyNote></div>
          ) : (
            continuity.map((c) => (
              <div key={c.client_ref + c.next_at} className="border-b border-[#F5F5F5] px-4 py-[13px] last:border-b-0">
                <div className="mb-2 flex items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-extraboldNunito text-white" style={{ background: avatarColour(c.client_ref) }}>
                    {c.client_ref?.replace("#", "").slice(0, 1)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] font-boldNunito text-ink-800">Anonymous · {c.client_ref}</div>
                    <div className="text-[10.5px] text-ink-400">{sessionWhen(c.next_at)}</div>
                  </div>
                  {c.focus ? (
                    <span className="shrink-0 rounded-full bg-[#EEF4FC] px-[9px] py-[3px] text-[10px] font-boldNunito text-brand-600">{c.focus}</span>
                  ) : null}
                </div>
                {c.shared_note ? (
                  <div className="pl-[42px] text-[11.5px] leading-[1.5] text-[#5B6577]">{c.shared_note}</div>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>

      {/* review + self-care */}
      <div className="grid items-stretch gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[13px] font-extraboldNunito text-navy-800">Latest review</div>
            <Link to={`${V2.therapist}/profile`} className="text-[12px] font-boldNunito text-brand-400">All reviews →</Link>
          </div>
          {review ? (
            <>
              <div className="text-[15px] tracking-[2px] text-gold-400">{"★".repeat(review.stars)}{"☆".repeat(5 - review.stars)}</div>
              <div className="text-[14px] italic leading-[1.6] text-[#3E4A52]">&quot;{review.text}&quot;</div>
              <div className="text-[11.5px] font-semiboldNunito text-ink-400">— Anonymous client · {review.when}</div>
            </>
          ) : (
            <EmptyNote>No reviews yet — they appear here once clients rate their sessions.</EmptyNote>
          )}
        </Card>
        {home?.self_care ? (
          <div className="flex flex-col justify-center gap-2 rounded-ds-lg border border-[#BFE6DC] bg-wellness-50 p-[18px]">
            <div className="flex items-center gap-[9px]">
              <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-white">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1F8A5B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" /></svg>
              </span>
              <div className="text-[13px] font-extraboldNunito text-wellness-600">A note on your own wellbeing</div>
            </div>
            <div className="text-[12px] leading-[1.6] text-[#3E7A6B]">{home.self_care}</div>
          </div>
        ) : null}
      </div>
    </>
  );
};

/* ── SESSIONS ─────────────────────────────────────────────────────────── */

export const TherapistSessions = () => {
  const { open, showToast } = useTherapist();
  const [tab, setTab] = useState("upcoming");

  const { data, isLoading } = useGetTherapistSessionsQuery();
  const { data: leadsData, isLoading: isLoadingLeads } = useGetTherapistSessionRequestsQuery();
  const [acknowledge] = useAcknowledgeSessionMutation();
  const [decline, { isLoading: isDeclining }] = useDeclineSessionMutation();
  const [declineLead, { isLoading: isDecliningLead }] = useDeclineSessionRequestMutation();

  const upcoming = (data?.upcoming ?? []).filter((s) => s.status === "confirmed");
  // Acknowledging a request is the therapist's own "dealt with" signal — the
  // session itself stays pending_payment until the client actually pays, but
  // it should still drop out of the action queue once reviewed.
  const paymentPending = (data?.upcoming ?? []).filter((s) => s.status === "pending_payment" && !s.acknowledged_at);
  const leads = leadsData ?? [];
  const past = data?.past ?? [];
  const requestCount = paymentPending.length + leads.length;

  const clientRef = (session) => "Anonymous · #" + (4000 + ((session.user_id ?? session.id) % 6000));
  const leadRef = (lead) => "Anonymous · #" + (4000 + (lead.id % 6000));

  const tabs = [
    { key: "upcoming", label: "Upcoming", count: upcoming.length },
    { key: "past", label: "Past", count: past.length },
    { key: "requests", label: "Requests", count: requestCount },
  ];

  const acknowledgePending = async (s) => {
    try {
      await acknowledge(s.id).unwrap();
      showToast(
        s.coverage === "consumer"
          ? "Acknowledged — it'll move to Upcoming once payment is confirmed"
          : "Session confirmed"
      );
    } catch {
      showToast("Couldn't accept that — please try again");
    }
  };

  const declinePending = async (id) => {
    try {
      await decline(id).unwrap();
      showToast("Request declined");
    } catch {
      showToast("Couldn't decline that — please try again");
    }
  };

  const declineNewClientLead = async (id) => {
    try {
      await declineLead(id).unwrap();
      showToast("Request declined");
    } catch {
      showToast("Couldn't decline that — please try again");
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {[
          { label: "Upcoming", value: String(upcoming.length) },
          { label: "Completed", value: String(past.filter((s) => s.status === "completed").length) },
          { label: "Notes due", value: String(past.filter((s) => s.status === "completed" && !s.has_note).length), tone: "text-signal-error" },
          { label: "Requests", value: String(requestCount) },
        ].map((s) => (
          <Card key={s.label}>
            <div className={classNames("text-h2 font-extraboldNunito", s.tone || "text-navy-800")}>{s.value}</div>
            <div className="text-[11px] text-ink-400">{s.label}</div>
          </Card>
        ))}
      </div>

      <div className="flex w-fit max-w-full gap-1.5 overflow-x-auto rounded-[11px] border border-surface-line bg-white p-1">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)} aria-pressed={tab === t.key} className={classNames("whitespace-nowrap rounded-[8px] px-3.5 py-2 text-[13px] font-boldNunito", tab === t.key ? "bg-wellness-400 text-white" : "cursor-pointer text-ink-500")}>
            {t.label} · {t.count}
          </button>
        ))}
      </div>

      <PanelCard>
        {(isLoading || isLoadingLeads) ? (
          <div className="flex flex-col gap-2 p-5"><Skeleton className="h-12" /><Skeleton className="h-12" /></div>
        ) : null}

        {!isLoading && tab === "upcoming" && (upcoming.length ? upcoming.map((s) => (
          <div key={s.id} className="border-b border-[#F5F5F5] px-5 py-4 last:border-b-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] text-[13px] font-extraboldNunito text-white" style={{ background: avatarColour(clientRef(s)) }}>
                {String(s.user_id ?? s.id).slice(-1)}
              </span>
              <div className="min-w-[180px] flex-1">
                <div className="text-[13px] font-boldNunito text-navy-800">{clientRef(s)}</div>
                <div className="text-[11px] text-ink-400">{sessionWhen(s.starts_at)}</div>
              </div>
              <Badge tone="blue">{SESSION_FORMAT_LABEL[s.format] ?? s.format}</Badge>
              <div className="flex gap-2">
                <SecondaryButton onClick={() => open("rescheduleReq", s)}>Reschedule</SecondaryButton>
                <TealButton onClick={() => open("joinConfirm", s)}>Join</TealButton>
              </div>
            </div>
            <PendingRescheduleBanner session={s} showToast={showToast} dark={false} />
          </div>
        )) : <div className="px-5 py-10 text-center"><div className="text-body font-extraboldNunito text-navy-800">No upcoming sessions</div><p className="text-caption text-ink-400">Confirmed sessions will appear here.</p></div>)}

        {!isLoading && tab === "past" && (past.length ? past.map((s) => {
          const done = !!s.has_note;
          return (
            <div key={s.id} className="flex flex-wrap items-center gap-3 border-b border-[#F5F5F5] px-5 py-4 last:border-b-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] text-[13px] font-extraboldNunito text-white" style={{ background: avatarColour(clientRef(s)) }}>
                {String(s.user_id ?? s.id).slice(-1)}
              </span>
              <div className="min-w-[180px] flex-1">
                <div className="text-[13px] font-boldNunito text-navy-800">{clientRef(s)}</div>
                <div className="text-[11px] text-ink-400">{sessionWhen(s.starts_at)} · {statusLabel(s.status)}</div>
              </div>
              {done ? (
                <Badge tone="green" dot>Notes saved</Badge>
              ) : (
                <SecondaryButton onClick={() => open("notes", s)}>Write notes</SecondaryButton>
              )}
            </div>
          );
        }) : <div className="px-5 py-10 text-center"><div className="text-body font-extraboldNunito text-navy-800">No past sessions</div></div>)}

        {!isLoading && tab === "requests" && (requestCount ? (
          <>
            {leads.map((r) => (
              <div key={`lead-${r.id}`} className="border-b border-[#F5F5F5] px-5 py-4 last:border-b-0">
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] text-[13px] font-extraboldNunito text-white" style={{ background: avatarColour(leadRef(r)) }}>
                    {String(r.id).slice(-1)}
                  </span>
                  <div className="min-w-[180px] flex-1">
                    <div className="flex items-center gap-2 text-[13px] font-boldNunito text-navy-800">
                      {leadRef(r)}
                      {r.focus ? <Badge tone="purple">{r.focus}</Badge> : null}
                    </div>
                    <div className="text-[11px] text-ink-400">Requested {sessionWhen(r.preferred_at)}</div>
                  </div>
                  <Badge tone="blue">{SESSION_FORMAT_LABEL[r.format] ?? r.format}</Badge>
                </div>
                {r.note ? <p className="mb-3 text-[12px] leading-[1.6] text-ink-500">{r.note}</p> : null}
                <div className="flex gap-2">
                  <TealButton onClick={() => open("proposeTime", r)}>Accept &amp; schedule</TealButton>
                  <SecondaryButton onClick={() => declineNewClientLead(r.id)} disabled={isDecliningLead}>Decline</SecondaryButton>
                </div>
              </div>
            ))}
            {paymentPending.map((r) => (
              <div key={`pending-${r.id}`} className="border-b border-[#F5F5F5] px-5 py-4 last:border-b-0">
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] text-[13px] font-extraboldNunito text-white" style={{ background: avatarColour(clientRef(r)) }}>
                    {String(r.user_id ?? r.id).slice(-1)}
                  </span>
                  <div className="min-w-[180px] flex-1">
                    <div className="text-[13px] font-boldNunito text-navy-800">{clientRef(r)}</div>
                    <div className="text-[11px] text-ink-400">
                      Booked {sessionWhen(r.starts_at)}
                      {r.coverage === "consumer" ? " · awaiting their payment" : ""}
                    </div>
                  </div>
                  <Badge tone="blue">{SESSION_FORMAT_LABEL[r.format] ?? r.format}</Badge>
                </div>
                <div className="flex gap-2">
                  <TealButton onClick={() => acknowledgePending(r)}>
                    {r.coverage === "consumer" ? "Acknowledge" : "Accept & schedule"}
                  </TealButton>
                  <SecondaryButton onClick={() => declinePending(r.id)} disabled={isDeclining}>Decline</SecondaryButton>
                </div>
              </div>
            ))}
          </>
        ) : <div className="px-5 py-10 text-center"><div className="text-body font-extraboldNunito text-navy-800">No requests</div><p className="text-caption text-ink-400">New client requests will appear here.</p></div>)}
      </PanelCard>
    </>
  );
};

const statusLabel = (status) =>
  ({ completed: "Completed", no_show: "No-show", cancelled: "Cancelled", confirmed: "Confirmed" })[status] ?? status;

/* ── AVAILABILITY ─────────────────────────────────────────────────────── */

export const TherapistAvailability = () => {
  const { showToast } = useTherapist();
  const { data: grid, isLoading } = useGetAvailabilityQuery();
  const [saveAvailability, { isLoading: isSaving }] = useUpdateAvailabilityMutation();

  /* Local editable copy, seeded from the server grid. */
  const [days, setDays] = useState({});
  const [slots, setSlots] = useState({});

  useEffect(() => {
    if (grid) {
      setDays(grid.days ?? {});
      setSlots(grid.slots ?? {});
    }
  }, [grid]);

  const addSlot = (key) => {
    const taken = (slots[key] || []).map((s) => s.start);
    const next = CANDIDATE_SLOTS.find((c) => !taken.includes(c.start));
    if (next) {
      setSlots((p) => ({ ...p, [key]: [...(p[key] || []), { start: next.start, end: next.end, active: true }] }));
      setDays((p) => ({ ...p, [key]: true }));
    }
  };

  const save = async () => {
    const payload = { days: {} };
    for (const d of WEEK_DAYS) {
      payload.days[d.key] = days[d.key] ? (slots[d.key] || []).map((s) => ({ start: s.start, end: s.end, active: true })) : [];
    }

    try {
      await saveAvailability(payload).unwrap();
      showToast("Availability saved");
    } catch {
      showToast("Couldn't save your availability — check the times and try again");
    }
  };

  return (
    <>
      <div className="flex items-center gap-2.5 rounded-[12px] border border-[#C9E2F9] bg-[#EEF4FC] px-4 py-3">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#015C94" strokeWidth="2" className="shrink-0">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span className="text-[12px] leading-[1.5] text-brand-600">
          Slots are shown to clients in WAT. Editing availability never cancels a confirmed
          booking — your existing sessions keep their times.
        </span>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2.5"><Skeleton className="h-[70px]" /><Skeleton className="h-[70px]" /></div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {WEEK_DAYS.map((d) => {
            const active = !!days[d.key];
            const daySlots = slots[d.key] || [];
            return (
              <div key={d.key} className="rounded-[14px] border-[1.5px] border-surface-line bg-white px-[18px] py-4">
                <div className={classNames("flex items-center justify-between gap-3", active && "mb-3.5")}>
                  <div className="flex items-center gap-2.5">
                    <span className={classNames("text-body font-extraboldNunito", active ? "text-navy-800" : "text-surface-muted")}>{d.label}</span>
                    {active ? (
                      <span className="rounded-full bg-[#EEF4FC] px-[9px] py-[3px] text-[10px] font-boldNunito text-brand-600">{daySlots.length} slots</span>
                    ) : null}
                  </div>
                  <button type="button" role="switch" aria-checked={active} aria-label={d.label} onClick={() => setDays((p) => ({ ...p, [d.key]: !p[d.key] }))} className={classNames("relative h-[22px] w-10 shrink-0 cursor-pointer rounded-full transition-colors", active ? "bg-brand-400" : "bg-ink-200")}>
                    <span className={classNames("absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.15)] transition-all", active ? "left-5" : "left-0.5")} />
                  </button>
                </div>

                {active ? (
                  <div className="flex flex-wrap gap-2">
                    {daySlots.map((slot) => (
                      <span key={slot.start} className="flex items-center gap-2 rounded-full border-[1.5px] border-ink-200 bg-[#F8F9FC] py-[7px] pl-3.5 pr-2">
                        <span className="text-[12px] font-semiboldNunito text-ink-800">{slotLabel(slot.start, slot.end)}</span>
                        <button type="button" aria-label={`Remove ${slot.start}`} onClick={() => setSlots((p) => ({ ...p, [d.key]: p[d.key].filter((x) => x.start !== slot.start) }))} className="flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-full bg-ink-100">
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#858585" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                      </span>
                    ))}
                    <button type="button" onClick={() => addSlot(d.key)} className="flex cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] border-dashed border-brand-400 bg-[#EEF4FC] px-3.5 py-[7px]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#015C94" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                      <span className="text-[12px] font-boldNunito text-brand-600">Add slot</span>
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      <button type="button" onClick={save} disabled={isSaving} className="h-[46px] w-fit cursor-pointer rounded-[12px] bg-navy-800 px-6 text-[13px] font-extraboldNunito text-white disabled:cursor-not-allowed disabled:bg-surface-muted">
        {isSaving ? "Saving…" : "Save availability"}
      </button>
    </>
  );
};

/* ── ANALYTICS ────────────────────────────────────────────────────────── */

export const TherapistAnalytics = () => {
  const [range, setRange] = useState("4w");
  const { data, isLoading } = useGetTherapistAnalyticsQuery(range);

  const kpis = data?.kpis ?? {};
  const bars = data?.session_bars ?? [];
  const topics = data?.top_topics ?? [];
  const outcome = (data?.outcome_trend ?? []).filter((v) => v !== null);
  const ratings = data?.rating_breakdown ?? [];
  const busiest = data?.busiest_slots ?? [];

  const peakBar = Math.max(...bars, 1);
  const outcomePts =
    outcome.length >= 2
      ? outcome.map((v, i) => `${(i / (outcome.length - 1)) * 100},${100 - ((v - 1) / 4) * 100}`).join(" ")
      : null;

  const kpiCards = [
    { label: "TOTAL SESSIONS", value: String(kpis.total_sessions ?? 0) },
    { label: "COMPLETION RATE", value: kpis.completion_rate === null || kpis.completion_rate === undefined ? "—" : `${kpis.completion_rate}%` },
    { label: "NO-SHOWS", value: String(kpis.no_shows ?? 0) },
    { label: "REPEAT CLIENTS", value: kpis.repeat_clients_percent === null || kpis.repeat_clients_percent === undefined ? "—" : `${kpis.repeat_clients_percent}%` },
    { label: "ACTIVE CLIENTS", value: String(kpis.active_clients ?? 0) },
    { label: "AVG RATING", value: kpis.avg_rating ? `${kpis.avg_rating}★` : "—" },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-[16px] font-blackNunito tracking-[-0.01em] text-navy-800">Your practice at a glance</span>
          <span className="inline-flex items-center gap-[5px] rounded-full bg-[linear-gradient(135deg,#6B44A8,#8B5FC2)] px-2.5 py-1 text-[10px] font-extraboldNunito tracking-[0.05em] text-white shadow-[0_3px_8px_rgba(107,68,168,0.3)]">
            <span className="h-[5px] w-[5px] rounded-full bg-white" />V2 PREVIEW
          </span>
        </div>
        <div className="flex gap-0.5 rounded-[11px] bg-[#F0F1F5] p-[3px]">
          {analyticsRangeOpts.map((o) => (
            <button key={o.key} type="button" onClick={() => setRange(o.key)} aria-pressed={range === o.key} className={classNames("cursor-pointer rounded-[9px] px-3.5 py-1.5 text-[12px] font-boldNunito", range === o.key ? "bg-brand-400 text-white" : "text-ink-400")}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
        {kpiCards.map((k) => (
          <Card key={k.label}>
            <div className="mb-2 text-[11px] font-boldNunito tracking-[0.06em] text-ink-400">{k.label}</div>
            <div className="text-[26px] font-blackNunito text-navy-800">{isLoading ? "…" : k.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-3.5 xl:grid-cols-[2fr_1fr]">
        <Card>
          <div className="mb-[3px] text-body font-extraboldNunito text-navy-800">Sessions per week</div>
          <div className="mb-[18px] text-[11px] text-ink-400">Most recent week highlighted</div>
          {isLoading ? <Skeleton className="h-[110px]" /> : (
            <div className="flex h-[110px] items-end gap-1.5">
              {bars.map((v, i) => (
                <div key={i} className="flex h-full flex-1 items-end">
                  <div className="w-full rounded-t-[3px]" style={{ height: `${Math.max((v / peakBar) * 100, 3)}%`, background: i === bars.length - 1 ? "#017FC8" : "#C9E2F9" }} />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="mb-[3px] text-body font-extraboldNunito text-navy-800">Top client topics</div>
          <div className="mb-4 text-[11px] text-ink-400">Aggregated, not clinical detail</div>
          {topics.length === 0 ? (
            <EmptyNote>Topics appear once you have completed sessions in this window.</EmptyNote>
          ) : (
            <div className="flex flex-col gap-[11px]">
              {topics.map((t, i) => {
                const colour = ["#017FC8", "#3BA88F", "#DBB66E"][i] ?? "#017FC8";
                return (
                  <div key={t.label}>
                    <div className="mb-[5px] flex justify-between gap-3">
                      <span className="text-[12px] font-semiboldNunito text-ink-800">{t.label}</span>
                      <span className="text-[12px] font-boldNunito" style={{ color: colour }}>{t.percent}%</span>
                    </div>
                    <div className="h-[5px] rounded-[3px] bg-ink-100">
                      <div className="h-[5px] rounded-[3px]" style={{ width: `${t.percent}%`, background: colour }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-3.5 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <div className="mb-[3px] text-body font-extraboldNunito text-navy-800">Client outcomes</div>
          <div className="mb-4 text-[11px] text-ink-400">Average post-session mood across clients (anonymous, aggregate)</div>
          {outcomePts ? (
            <div className="relative h-[120px]">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
                <defs>
                  <linearGradient id="outcomeFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3BA88F" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#3BA88F" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon points={`0,100 ${outcomePts} 100,100`} fill="url(#outcomeFill)" />
                <polyline points={outcomePts} fill="none" stroke="#3BA88F" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ) : (
            <EmptyNote>Outcome trend builds as clients complete their post-session check-ins.</EmptyNote>
          )}
        </Card>

        <Card>
          <div className="mb-[3px] text-body font-extraboldNunito text-navy-800">Rating breakdown</div>
          <div className="mb-4 text-[11px] text-ink-400">
            {kpis.avg_rating ? `${ratings.reduce((a, r) => a + r.count, 0)} reviews · ${kpis.avg_rating} average` : "No reviews in this window"}
          </div>
          <div className="flex flex-col gap-2.5">
            {ratings.map((r) => (
              <div key={r.stars} className="flex items-center gap-2.5">
                <span className="w-[22px] text-[11px] font-boldNunito text-ink-400">{r.stars}★</span>
                <div className="h-[7px] flex-1 rounded-[4px] bg-ink-100">
                  <div className="h-[7px] rounded-[4px]" style={{ width: `${r.percent}%`, background: RATING_BAR_COLOURS[r.stars] }} />
                </div>
                <span className="w-5 text-right text-[11px] font-boldNunito text-ink-800">{r.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-[3px] text-body font-extraboldNunito text-navy-800">When you&apos;re busiest</div>
        <div className="mb-[18px] text-[11px] text-ink-400">Booking load by day — use it to plan your open slots</div>
        <div className="flex h-[90px] items-end gap-3">
          {busiest.map((s) => (
            <div key={s.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <div className="flex w-full flex-1 items-end">
                <div className="w-full rounded-t-[4px]" style={{ height: `${Math.max(s.load, 2)}%`, background: s.load >= 90 ? "#017FC8" : s.load >= 60 ? "#68B4E1" : "#C9E2F9" }} />
              </div>
              <span className="text-[11px] font-boldNunito text-ink-400">{s.day}</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};

/* ── EARNINGS ─────────────────────────────────────────────────────────── */

export const TherapistEarnings = () => {
  const { open } = useTherapist();
  const { data: home } = useGetTherapistHomeQuery();
  const { data, isLoading, isError } = useGetEarningsQuery(undefined, {
    skip: home?.employment?.is_business_employed,
  });

  /* A business-employed therapist is paid by their company — the nav item is
     hidden, but a direct visit gets the explanation rather than a broken page. */
  if (home?.employment?.is_business_employed || isError) {
    return (
      <Card className="!bg-navy-800">
        <div className="mb-1.5 text-[15px] font-extraboldNunito text-white">Paid directly by {home?.employment?.employer_name ?? "your employer"}</div>
        <p className="text-[12px] leading-[1.7] text-white/60">
          Your sessions are paid by your employer at the rate you agreed with them, so
          TalkAM earnings and payouts don&apos;t apply to your account. Compensation
          questions go to your employer&apos;s HR team.
        </p>
      </Card>
    );
  }

  const totals = data?.totals ?? {};
  const tiles = data?.tiles ?? {};
  const payouts = data?.recent_payouts ?? [];

  return (
    <>
      <div className="relative overflow-hidden rounded-ds-lg bg-[linear-gradient(120deg,#124034,#3BA88F)] p-6">
        <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 h-[180px] w-[180px] rounded-full bg-white/10" />
        <div className="relative z-[1]">
          <div className="text-[10px] font-extraboldNunito tracking-[0.06em] text-white/70">AVAILABLE BALANCE</div>
          <div className="mt-1 text-[34px] font-extraboldNunito text-white">{isLoading ? "…" : naira(data?.balance)}</div>
          <div className="mt-1 text-[12px] text-white/80">Paid weekly · via Flutterwave</div>
        </div>
      </div>

      <div className="grid gap-3.5 lg:grid-cols-3">
        {[
          { label: "THIS MONTH", value: naira(totals.this_month) },
          { label: "SESSIONS THIS WEEK", value: String(tiles.sessions_this_week ?? 0) },
          { label: "AVG PER SESSION", value: naira(tiles.avg_per_session) },
        ].map((s) => (
          <Card key={s.label}>
            <div className="mb-2 text-[11px] font-boldNunito tracking-[0.06em] text-ink-400">{s.label}</div>
            <div className="text-h2 font-extraboldNunito text-navy-800">{s.value}</div>
          </Card>
        ))}
      </div>

      <PanelCard
        title="Recent payouts"
        subtitle="Paid weekly via Flutterwave"
        action={<SecondaryButton onClick={() => open("allPayouts", payouts)}>View all</SecondaryButton>}
      >
        {payouts.length === 0 ? (
          <div className="p-5"><EmptyNote>No payouts yet — your first one lands the Friday after your first completed session.</EmptyNote></div>
        ) : (
          payouts.slice(0, 3).map((p) => (
            <div key={p.date ?? p.id} className="flex items-center justify-between gap-4 border-b border-[#F5F5F5] px-5 py-3.5 last:border-b-0">
              <div>
                <div className="text-[13px] font-boldNunito text-navy-800">{p.date ?? p.created_at}</div>
                <div className="text-[11px] text-ink-400">{p.sessions ?? ""} {p.sessions ? "sessions" : ""}</div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[13px] font-extraboldNunito text-navy-800">{naira(p.amount)}</span>
                <Badge tone="green">Paid</Badge>
              </div>
            </div>
          ))
        )}
      </PanelCard>
    </>
  );
};

/* ── MESSAGES ─────────────────────────────────────────────────────────── */

export const TherapistMessages = () => {
  const location = useLocation();
  const token = useSelector(selectCurrentToken);
  const { data: me } = useGetMeV2Query();
  // Polling is the baseline that always works; the Pusher subscription below
  // makes new messages land instantly when real credentials are configured
  // (VITE_PUSHER_KEY) — until then it's a no-op and polling alone covers it.
  const { data: conversationPage, isLoading, refetch: refetchConversations } = useGetConversationsQuery(undefined, {
    pollingInterval: 8000,
  });
  /* A "Message" CTA elsewhere hands us the conversation id it just opened
   * via navigation state — open straight to it instead of the first thread. */
  const [activeId, setActiveId] = useState(() => location.state?.conversationId ?? null);
  const [draft, setDraft] = useState("");
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  const threads = conversationPage?.data ?? [];
  const currentId = activeId ?? threads[0]?.id ?? null;
  const active = threads.find((t) => t.id === currentId) ?? null;

  const { data: messagePage, isFetching: isLoadingMessages, refetch: refetchMessages } = useGetMessagesQuery(currentId, {
    skip: !currentId,
    pollingInterval: 4000,
  });
  // The API returns newest-first (built for "load older on scroll-up"
  // pagination) — flip it so the thread reads oldest-to-newest, top to
  // bottom, like every other chat UI.
  const messages = useMemo(() => (messagePage?.data ?? []).slice().reverse(), [messagePage]);

  useConversationChannel(currentId, me?.id, token, () => {
    refetchMessages();
    refetchConversations();
  });

  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [currentId, messages.length]);

  const clientRef = (thread) => "Anonymous · #" + (4000 + ((thread.other_member?.id ?? thread.id) % 6000));

  const send = async (e) => {
    e.preventDefault();
    if (!draft.trim() || !currentId) return;
    try {
      await sendMessage({ conversation_id: currentId, message: draft.trim() }).unwrap();
      setDraft("");
    } catch { /* keep the draft */ }
  };

  return (
    <div className="grid gap-3.5 lg:h-[50dvh] lg:grid-cols-[280px_1fr]">
      <PanelCard title="Clients" className="flex min-h-0 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col gap-2 p-3.5"><Skeleton className="h-12" /><Skeleton className="h-12" /></div>
        ) : threads.length === 0 ? (
          <div className="p-3.5"><EmptyNote>No conversations yet.</EmptyNote></div>
        ) : (
          threads.map((t) => (
            <button key={t.id} type="button" onClick={() => setActiveId(t.id)} className={classNames("flex w-full cursor-pointer items-start gap-2.5 border-b border-[#F5F5F5] px-4 py-3.5 text-left last:border-b-0", currentId === t.id ? "bg-wellness-50" : "hover:bg-ink-50")}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-extraboldNunito text-white" style={{ background: avatarColour(clientRef(t)) }}>
                {String(t.other_member?.id ?? t.id).slice(-1)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-[13px] font-boldNunito text-navy-800">{clientRef(t)}</span>
                </span>
                <span className="mt-0.5 block truncate text-[11.5px] text-ink-400">{t.last_message?.message ?? "No messages yet"}</span>
              </span>
              {t.unread_count ? (
                <span className="shrink-0 rounded-full bg-wellness-400 px-1.5 py-0.5 text-[9px] font-boldNunito text-white">{t.unread_count}</span>
              ) : null}
            </button>
          ))
        )}
        </div>
      </PanelCard>

      <PanelCard title={active ? clientRef(active) : "Messages"} subtitle="Encrypted · sessions and chats are never recorded" className="flex min-h-0 flex-col">
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-5">
          {active && isLoadingMessages && messages.length === 0 ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-10 w-1/2 self-end" />
            </div>
          ) : messages.length === 0 ? (
            <EmptyNote>{active ? "No messages in this conversation yet." : "Pick a conversation to read it."}</EmptyNote>
          ) : (
            <>
              {messages.map((m) => (
                <div key={m.id} className={classNames("flex", m.sender_id === me?.id ? "justify-end" : "justify-start")}>
                  <div className={classNames("max-w-[75%] rounded-ds-md px-3.5 py-2.5", m.sender_id === me?.id ? "bg-wellness-400 text-white" : "bg-ink-50 text-ink-800")}>
                    <p className="text-[13px] leading-[1.55]">{m.message}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        <form className="flex shrink-0 items-center gap-2 border-t border-ink-100 p-4" onSubmit={send}>
          <input placeholder="Write a message…" aria-label="Write a message" value={draft} onChange={(e) => setDraft(e.target.value)} disabled={!currentId} className="h-10 flex-1 rounded-ds-md border-[1.5px] border-ink-200 px-3.5 text-[13px] text-ink-800" />
          <TealButton type="submit" disabled={!currentId || isSending || !draft.trim()}>
            <Icon.Send size={14} />
          </TealButton>
        </form>
      </PanelCard>
    </div>
  );
};

/* ── PROFILE & ACCOUNT ────────────────────────────────────────────────── */

export const TherapistProfile = () => {
  const { open, showToast } = useTherapist();
  const { data: me } = useGetMeV2Query();
  const { data: serverProfile } = useGetTherapistProfileQuery();
  const { data: privacy } = useGetPrivacySettingsQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateTherapistProfileMutation();
  const [savePrivacy] = useSavePrivacySettingsMutation();

  const [profile, setProfile] = useState({ bio: "", years: "", rate: "" });
  const [notifs, setNotifs] = useState({});
  const twoFa = !!privacy?.two_factor_enabled;

  useEffect(() => {
    if (serverProfile) {
      setProfile({
        bio: serverProfile.bio ?? "",
        years: String(serverProfile.years_experience ?? ""),
        rate: String(serverProfile.session_rate ?? ""),
      });
    }
  }, [serverProfile]);

  const field = (k) => (e) => setProfile((p) => ({ ...p, [k]: e.target.value }));
  const input = "h-[42px] w-full rounded-[10px] border-[1.5px] border-ink-200 px-[13px] text-[13px] text-ink-800";
  const label = "mb-[5px] block text-[11px] font-boldNunito text-ink-400";

  const Switch = ({ on, onClick, label: aria }) => (
    <button type="button" role="switch" aria-checked={on} aria-label={aria} onClick={onClick} className={classNames("relative h-[22px] w-10 shrink-0 cursor-pointer rounded-full transition-colors", on ? "bg-[#3BA88F]" : "bg-ink-200")}>
      <span className={classNames("absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.15)] transition-all", on ? "left-5" : "left-0.5")} />
    </button>
  );

  const save = async () => {
    try {
      await updateProfile({ bio: profile.bio, years_experience: Number(profile.years) || undefined, session_rate: Number(profile.rate) || undefined }).unwrap();
      showToast("Profile saved");
    } catch {
      showToast("Couldn't save your profile — please try again");
    }
  };

  const specialties = serverProfile?.specialties ?? [];

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <div className="mb-3.5 flex items-center justify-between gap-3">
          <div className="text-body font-extraboldNunito text-navy-800">Public Profile</div>
          {me?.therapist?.is_verified ? (
            <span className="rounded-full bg-gold-50 px-[9px] py-[3px] text-[10px] font-boldNunito text-gold-600">✦ Verified</span>
          ) : null}
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className={label} htmlFor="thr-name">Full Name</label>
            <input id="thr-name" className={input} value={me?.name ?? ""} readOnly />
          </div>
          <div>
            <label className={label} htmlFor="thr-bio">About</label>
            <textarea id="thr-bio" value={profile.bio} onChange={field("bio")} className="h-[78px] w-full resize-none rounded-[10px] border-[1.5px] border-ink-200 px-[13px] py-2.5 text-[12.5px] leading-[1.6] text-ink-800" />
          </div>
          <div>
            <span className={label}>Specialties</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {specialties.map((sp) => (
                <span key={sp} className="rounded-full bg-[#EEF4FC] px-3 py-[5px] text-[11px] font-boldNunito text-brand-600">{sp}</span>
              ))}
              {specialties.length === 0 ? <span className="text-[11px] text-ink-400">Set in the mobile app</span> : null}
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className={label} htmlFor="thr-years">Years of experience</label>
              <input id="thr-years" className={input} value={profile.years} onChange={field("years")} />
            </div>
            <div className="flex-1">
              <label className={label} htmlFor="thr-rate">Session rate</label>
              <input id="thr-rate" className={input} value={profile.rate} onChange={field("rate")} />
            </div>
          </div>
          <div className="flex gap-2 rounded-[10px] bg-[#EEF4FC] px-[13px] py-2.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#015C94" strokeWidth="2" className="mt-px shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
            <span className="text-[11px] leading-[1.55] text-brand-600">This is what companies and clients see. Your B2B session rate is set by TalkAM; the rate above is your consumer rate.</span>
          </div>
          <button type="button" onClick={save} disabled={isSaving} className="h-[46px] cursor-pointer rounded-[12px] bg-navy-800 text-[13px] font-extraboldNunito text-white">
            {isSaving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </Card>

      <Card>
        <div className="mb-1 text-body font-extraboldNunito text-navy-800">Account</div>
        <div className="mb-3.5 text-[11px] text-ink-400">{me?.email}</div>
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-[#F5F5F5] py-[11px]">
            <div>
              <div className="text-[13px] font-semiboldNunito text-ink-800">Credential verification</div>
              <div className="text-[10.5px] text-ink-400">MDCN, NPA, indemnity insurance</div>
            </div>
            <span className="rounded-full bg-[#EEF4FC] px-[9px] py-[3px] text-[11px] font-boldNunito text-brand-600">
              {me?.therapist?.is_verified ? "Verified" : "In review"}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 border-b border-[#F5F5F5] py-[11px]">
            <div>
              <div className="text-[13px] font-semiboldNunito text-ink-800">Payout account</div>
              <div className="text-[10.5px] text-ink-400">Manage bank details on mobile</div>
            </div>
            <button type="button" className="cursor-pointer text-[12px] font-boldNunito text-brand-400">Open App</button>
          </div>
          <div className="flex items-center justify-between gap-4 py-[11px]">
            <div className="max-w-[240px]">
              <div className="text-[13px] font-semiboldNunito text-ink-800">Two-factor authentication</div>
              <div className="text-[10.5px] text-ink-400">Email a one-time code to your work email at every sign-in</div>
            </div>
            <Switch on={twoFa} label="Two-factor authentication" onClick={async () => {
              if (twoFa) {
                try {
                  await savePrivacy({ ...privacy, two_factor_enabled: false }).unwrap();
                  showToast("Two-factor authentication disabled");
                } catch {
                  showToast("Couldn't update that just now — please try again");
                }
                return;
              }

              open("twoFactorEnable", {
                email: me?.email,
                onConfirm: (otp) => savePrivacy({ ...privacy, two_factor_enabled: true, otp }).unwrap(),
              });
            }} />
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-1 text-body font-extraboldNunito text-navy-800">Notification Preferences</div>
        <div className="mb-3.5 text-[11px] text-ink-400">Choose what TalkAM emails and alerts you about</div>
        <div className="flex flex-col">
          {therapistNotifRows.map((n, i) => (
            <div key={n.key} className={classNames("flex items-center justify-between gap-4 py-[11px]", i < therapistNotifRows.length - 1 && "border-b border-[#F5F5F5]")}>
              <div className="max-w-[250px]">
                <div className="text-[13px] font-semiboldNunito text-ink-800">{n.title}</div>
                <div className="text-[10.5px] text-ink-400">{n.sub}</div>
              </div>
              <Switch on={notifs[n.key] ?? true} label={n.title} onClick={() => setNotifs((p) => ({ ...p, [n.key]: !(p[n.key] ?? true) }))} />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-1 text-body font-extraboldNunito text-navy-800">Safety</div>
        <div className="mb-3.5 text-[11px] text-ink-400">Concerned about a client interaction?</div>
        <button type="button" onClick={() => open("report")} className="w-full cursor-pointer rounded-[10px] border border-ink-200 bg-surface-page p-3 text-left text-[13px] font-boldNunito text-ink-600">
          Report a client
        </button>
      </Card>

      <Card className="!border-[#FFCDD2]">
        <div className="mb-1 text-body font-extraboldNunito text-[#8B2E2E]">Danger Zone</div>
        <div className="mb-3.5 text-[11px] text-ink-400">Deactivating removes you from client search immediately</div>
        <div className="flex flex-col gap-2">
          <button type="button" onClick={() => showToast("Profile deactivated")} className="cursor-pointer rounded-[10px] border border-[#FFCDD2] bg-surface-page p-[11px] text-[13px] font-boldNunito text-[#8B2E2E]">
            Deactivate profile temporarily
          </button>
          <button type="button" onClick={() => open("deleteAccount")} className="w-full cursor-pointer rounded-[10px] bg-[#AC4242] p-3 text-center text-[13px] font-boldNunito text-white">
            Delete my account
          </button>
        </div>
      </Card>
    </div>
  );
};

/* ── HELP & SUPPORT ───────────────────────────────────────────────────── */

export const TherapistHelp = () => {
  const { data: categories } = useGetFaqsQuery();
  // `/user/faqs` returns every category; the therapist Help screen shows only
  // the therapist set.
  const faqs = (categories ?? [])
    .filter((c) => c.name === "Therapist Dashboard")
    .flatMap((c) => c.faq ?? [])
    .map((f) => ({ q: f.question, a: f.answer }));

  return (
    <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr] xl:items-start">
      <Card>
        <div className="mb-1 text-body font-extraboldNunito text-navy-800">Frequently asked questions</div>
        <div className="mb-3.5 text-caption text-ink-400">Payouts, rates, requests and privacy — the things therapists ask us most.</div>
        {faqs.length === 0 ? (
          <EmptyNote>No FAQs published yet — use the contact options and we&apos;ll help directly.</EmptyNote>
        ) : (
          <DsAccordion items={faqs} marker="none" />
        )}
      </Card>

      <div className="flex flex-col gap-4">
        <Card>
          <div className="mb-2.5 text-body font-extraboldNunito text-navy-800">Provider support</div>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5 rounded-ds-md border border-[#EEEEEE] bg-ink-50 px-3.5 py-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-wellness-400"><Icon.MessageCircle size={15} color="#fff" /></span>
              <div>
                <div className="text-[12.5px] font-boldNunito text-navy-800">Live chat</div>
                <div className="text-[11px] text-ink-400">Informly widget · replies in minutes</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-ds-md border border-[#EEEEEE] bg-ink-50 px-3.5 py-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-brand-400"><Icon.Mail size={15} color="#fff" /></span>
              <div>
                <div className="text-[12.5px] font-boldNunito text-navy-800">providers@talkam.net</div>
                <div className="text-[11px] text-ink-400">Replies within 1 business day</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="!bg-navy-800">
          <div className="mb-1.5 text-[13px] font-extraboldNunito text-white">Sessions are never recorded</div>
          <p className="text-[11.5px] leading-[1.7] text-white/55">No audio, video or transcript is stored for any session room. Your written notes are the only record, and they are private to you.</p>
        </Card>
      </div>
    </div>
  );
};

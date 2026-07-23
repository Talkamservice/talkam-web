import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import {
  useOnboarding,
  StepEyebrow,
  ScreenTitle,
  ScreenLead,
  AuthButton,
  InfoNote,
  SelectChip,
} from "../authlayout";
import { usePageMeta } from "../../../../../hooks/usePageMeta";
import { V2 } from "../../../../../constants/v2routes";
import { inviteRows, benchTopicDefs } from "../../../../../fakedata/v2/auth";

/** Screens 5–7: therapist bench, team invite (+ CSV error state), invites sent. */

/* ── 4b. THERAPIST BENCH ───────────────────────────────────────────────── */
export const TherapistBench = () => {
  const navigate = useNavigate();
  const o = useOnboarding();
  usePageMeta("Preview your therapist bench — TalkAM for Business");

  const seats = parseInt(o.seatsCount, 10) || 0;

  return (
    <>
      <StepEyebrow>OPTIONAL</StepEyebrow>
      <ScreenTitle>Preview your therapist bench</ScreenTitle>

      {seats <= 0 ? (
        <div className="mb-5 rounded-ds-md bg-surface-errorTint px-4 py-3.5 text-[12.5px] leading-[1.6] text-surface-errorInk">
          Choose your seat count first — therapist matching is scaled to your team size
          and can&apos;t be set up before that.
        </div>
      ) : null}

      <ScreenLead className="mb-5">
        Based on {seats} seats, tell us which specialties to prioritise in your bench.
        Individual employees are still matched to any verified therapist — this just
        shapes who we onboard first for your company.
      </ScreenLead>

      <div className="mb-3.5 flex flex-wrap gap-2.5">
        {benchTopicDefs.map((topic) => (
          <SelectChip
            key={topic.key}
            selected={o.benchTopics.includes(topic.key)}
            onClick={() => o.toggleIn("benchTopics", topic.key)}
          >
            {topic.label}
          </SelectChip>
        ))}
      </div>

      <div className="mb-5 rounded-ds-md bg-brand-25 px-3.5 py-3 text-[11.5px] leading-[1.6] text-brand-600">
        6 verified therapists already actively serve companies on TalkAM. We&apos;ll
        prioritise onboarding more in your selected specialties as your team grows.
      </div>

      <AuthButton className="mb-2.5" onClick={() => navigate(V2.businessInvite)}>
        Continue to Team Invites →
      </AuthButton>
      <button
        type="button"
        onClick={() => navigate(V2.businessInvite)}
        className="w-full cursor-pointer text-center text-caption text-ink-400"
      >
        Skip for now
      </button>
    </>
  );
};

/* ── 5. TEAM INVITE ────────────────────────────────────────────────────── */
export const TeamInvite = () => {
  const navigate = useNavigate();
  const o = useOnboarding();
  usePageMeta("Invite employees & therapists — TalkAM for Business");

  return (
    <>
      <StepEyebrow>ONBOARD YOUR TEAM</StepEyebrow>
      <ScreenTitle>Invite employees &amp; therapists</ScreenTitle>
      <ScreenLead className="mb-5">
        Assign a role to each invite. Therapists get a professional application flow;
        employees go straight to onboarding.
      </ScreenLead>

      {o.csvErrored ? (
        <>
          <div className="mb-2.5 flex items-center gap-3 rounded-[14px] border-2 border-dashed border-[#E8A3A3] bg-surface-errorField p-4">
            <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] bg-white">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#AC4242" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </span>
            <div className="flex-1">
              <div className="text-[13px] font-boldNunito text-surface-errorInk">
                roster.pdf couldn&apos;t be used
              </div>
              <div className="text-[11px] text-signal-error">
                Only .csv files are supported
              </div>
            </div>
            <button
              type="button"
              onClick={() => o.set({ csvErrored: false })}
              className="shrink-0 cursor-pointer rounded-[9px] bg-signal-error px-3.5 py-[7px] text-caption font-boldNunito text-white"
            >
              Try Again
            </button>
          </div>
          <div className="mb-5 flex gap-2 rounded-[10px] bg-surface-errorTint px-3.5 py-2.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B2E2E" strokeWidth="2" className="mt-px shrink-0">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="text-[11.5px] leading-[1.6] text-surface-errorInk">
              File must be a .csv with columns: email, role, department. Max size 5MB.
              Download our <strong className="font-boldNunito">sample template</strong>{" "}
              if you&apos;re not sure of the format.
            </span>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => o.set({ csvErrored: true })}
          className="mb-[18px] flex w-full cursor-pointer items-center gap-3 rounded-[14px] border-2 border-dashed border-brand-200 bg-[linear-gradient(135deg,#EEF4FC,#D1EEFE)] p-4 text-left"
        >
          <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] bg-white">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#017FC8" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </span>
          <span className="flex-1">
            <span className="block text-[13px] font-boldNunito text-navy-800">
              Upload CSV
            </span>
            <span className="block text-[11px] text-brand-600">
              email, role (employee / therapist), department
            </span>
          </span>
          <span className="shrink-0 rounded-[9px] bg-brand-400 px-3.5 py-[7px] text-caption font-boldNunito text-white">
            Browse
          </span>
        </button>
      )}

      <div className="mb-[18px] flex flex-col gap-2">
        {inviteRows.map((row) => (
          <div
            key={row.email}
            className="flex items-center gap-2 rounded-ds-md border border-ink-200 bg-white px-3 py-2.5"
          >
            <span
              className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-caption font-extraboldNunito text-white"
              style={{ background: row.avatarBg }}
            >
              {row.initial}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-boldNunito text-ink-800">
                {row.email}
              </div>
              <div className="text-[10px] text-ink-400">{row.dept}</div>
            </div>
            <span
              className={classNames(
                "shrink-0 rounded-[6px] px-2 py-[3px] text-[9px] font-extraboldNunito tracking-[0.04em]",
                row.role === "therapist"
                  ? "bg-wellness-50 text-wellness-600"
                  : "bg-brand-25 text-brand-600"
              )}
            >
              {row.role === "therapist" ? "THERAPIST" : "EMPLOYEE"}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mb-4 flex cursor-pointer items-center gap-2 text-[13px] font-boldNunito text-brand-400"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#017FC8" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add another
      </button>

      <div className="mb-5 rounded-ds-md border border-[#E3D5FF] bg-[#F5F0FF] px-4 py-3.5">
        <div className="mb-1.5 flex items-center gap-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B44A8" strokeWidth="2" className="shrink-0">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="text-[13px] font-extraboldNunito text-[#5A3990]">
            Already have a therapist?
          </span>
        </div>
        <p className="text-[11.5px] leading-[1.6] text-[#5A3990]">
          Tag their invite as <strong className="font-boldNunito">Therapist</strong> to
          bring your own provider onto TalkAM alongside your team. They complete the
          same quick verification, and you&apos;ll choose how they&apos;re billed —
          through TalkAM or settled directly with you — from My Therapists.
        </p>
      </div>

      <AuthButton onClick={() => navigate(V2.businessInviteSent)}>
        Send 4 Invites →
      </AuthButton>
      <button
        type="button"
        onClick={() => navigate(V2.businessTwoFactor)}
        className="mt-3.5 w-full cursor-pointer text-center text-caption text-ink-400"
      >
        Skip for now — go to dashboard
      </button>
    </>
  );
};

/* ── 5b. INVITES SENT ──────────────────────────────────────────────────── */
export const InvitesSent = () => {
  const navigate = useNavigate();
  usePageMeta("Invites sent — TalkAM for Business");

  return (
    <>
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-wellness-50">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3BA88F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <ScreenTitle>Invites sent</ScreenTitle>
      <ScreenLead className="mb-6 !leading-[1.7]">
        4 invite emails are on their way. Each includes a unique link — 3 employees
        will complete community onboarding, 1 therapist will be routed into the
        professional application flow. Track status anytime from Employees.
      </ScreenLead>
      <AuthButton tone="brand" onClick={() => navigate(V2.businessTwoFactor)}>
        Go to Admin Dashboard →
      </AuthButton>
    </>
  );
};

/* ── 6. INVITE LANDING (recipient) ─────────────────────────────────────── */
export const InviteLanding = () => {
  const navigate = useNavigate();
  const o = useOnboarding();
  usePageMeta("Complete your registration — TalkAM");

  return (
    <>
      <div className="mb-6 flex items-center gap-2.5 rounded-ds-md border border-surface-line bg-ink-50 px-4 py-3.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-brand-400 text-[13px] font-extraboldNunito text-white">
          Z
        </span>
        <span className="text-[13px] text-ink-600">
          You were invited by{" "}
          <strong className="text-navy-800">Zenith Bank Nigeria</strong> to join TalkAM
          as a{o.landingRole === "therapist" ? " verified therapist." : "n employee."}
        </span>
      </div>

      <ScreenTitle>Complete your registration</ScreenTitle>
      <ScreenLead className="mb-5">
        Set a password to activate your account. Your employer will never see your
        session activity or content.
      </ScreenLead>

      <div className="mb-5 flex gap-2">
        {[
          { key: "employee", label: "I'm a team member" },
          { key: "therapist", label: "I'm a therapist" },
        ].map((role) => {
          const active = o.landingRole === role.key;
          return (
            <button
              key={role.key}
              type="button"
              onClick={() => o.set({ landingRole: role.key })}
              aria-pressed={active}
              className={classNames(
                "flex-1 cursor-pointer rounded-[10px] border-[1.5px] p-2.5 text-center text-caption font-boldNunito",
                !active && "border-ink-200 bg-surface-page text-ink-400",
                active && role.key === "employee" && "border-brand-400 bg-brand-25 text-brand-600",
                active && role.key === "therapist" && "border-wellness-400 bg-wellness-50 text-wellness-600"
              )}
            >
              {role.label}
            </button>
          );
        })}
      </div>

      <form
        className="flex flex-col gap-3.5"
        onSubmit={(e) => {
          e.preventDefault();
          navigate(V2.businessConsent);
        }}
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-caption font-boldNunito text-ink-600">Full name</label>
          <input
            defaultValue="Chidinma Eze"
            className="h-12 w-full rounded-ds-md border-[1.5px] border-ink-200 bg-white px-4 text-body text-navy-800"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-caption font-boldNunito text-ink-600">Work email</label>
          <input
            disabled
            value="chidinma.eze@zenithbank.com"
            className="h-12 w-full cursor-not-allowed rounded-ds-md border-[1.5px] border-ink-200 bg-ink-100 px-4 text-body text-ink-400"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-caption font-boldNunito text-ink-600">
            Create password
          </label>
          <input
            type="password"
            defaultValue="passw0rd12"
            className="h-12 w-full rounded-ds-md border-[1.5px] border-ink-200 bg-white px-4 text-body text-navy-800"
          />
        </div>
        <AuthButton type="submit" className="mt-1">
          Continue →
        </AuthButton>
      </form>
    </>
  );
};

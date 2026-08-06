import { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import {
  useOnboarding,
  StepEyebrow,
  ScreenTitle,
  ScreenLead,
  AuthButton,
  SelectChip,
  FormError,
  SkeletonLine,
  apiErrorMessage,
} from "../authlayout";
import { usePageMeta } from "../../../../../hooks/usePageMeta";
import { V2 } from "../../../../../constants/v2routes";
import { setCredentials } from "../../../../../services/authSlice";
import {
  useGetOrganizationQuery,
  useSaveBenchMutation,
  useImportRosterMutation,
  useSendInvitationsMutation,
  useGetInvitationQuery,
  useAcceptInvitationMutation,
} from "../../../../../services/v2/businessApiSlice";

/** Screens 5–7: therapist bench, team invite (+ CSV error state), invites sent. */

/** Deck avatar palette. Picked deterministically so a row keeps its colour. */
const AVATAR_COLOURS = ["#017FC8", "#3BA88F", "#9A6E0A", "#6B44A8"];
const avatarColour = (email = "") => {
  const sum = [...email].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_COLOURS[sum % AVATAR_COLOURS.length];
};

/** Compact input for the inline "add one" form — 44px, matching its buttons
 *  (the shared authInputClass is 48px, which reads too tall in this dense card). */
const INVITE_INPUT =
  "h-11 w-full rounded-ds-md border-[1.5px] border-ink-200 bg-white px-3.5 text-[13px] text-navy-800 placeholder:text-ink-400 focus:border-brand-400 focus:shadow-focus-brand";

/* ── 4b. THERAPIST BENCH ───────────────────────────────────────────────── */
export const TherapistBench = () => {
  const navigate = useNavigate();
  const o = useOnboarding();
  usePageMeta("Preview your therapist bench — TalkAM for Business");

  const { data: org, isLoading } = useGetOrganizationQuery();
  const [saveBench, { isLoading: isSaving }] = useSaveBenchMutation();
  const [error, setError] = useState(null);

  const seats = org?.organization?.seats_licensed ?? 0;
  const available = org?.bench?.available ?? [];
  const therapistCount = org?.bench?.verified_therapist_count ?? 0;

  const proceed = async (persist) => {
    setError(null);

    if (!persist) {
      navigate(V2.businessInvite);
      return;
    }

    try {
      await saveBench({ bench_topics: o.benchTopics }).unwrap();
      navigate(V2.businessInvite);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  return (
    <>
      <StepEyebrow>OPTIONAL</StepEyebrow>
      <ScreenTitle>Preview your therapist bench</ScreenTitle>

      {!isLoading && seats <= 0 ? (
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
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <SkeletonLine key={i} className="h-[38px] w-[110px] rounded-full" />
            ))
          : available.map((topic) => (
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
        {therapistCount} verified therapists already actively serve companies on TalkAM.
        We&apos;ll prioritise onboarding more in your selected specialties as your team
        grows.
      </div>

      <FormError>{error}</FormError>

      <AuthButton className="mb-2.5" disabled={isSaving} onClick={() => proceed(true)}>
        {isSaving ? "Saving…" : "Continue to Team Invites →"}
      </AuthButton>
      <button
        type="button"
        onClick={() => proceed(false)}
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

  const fileInput = useRef(null);
  const [importRoster, { isLoading: isImporting }] = useImportRosterMutation();
  const [sendInvitations, { isLoading: isSending }] = useSendInvitationsMutation();
  const [error, setError] = useState(null);

  const rows = o.inviteRows;

  // Manual "add one" form — the counterpart to CSV upload for small teams.
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({ email: "", department: "", role: "employee" });
  const [formError, setFormError] = useState(null);

  const draftField = (key) => (event) =>
    setDraft((prev) => ({ ...prev, [key]: event.target.value }));

  const closeForm = () => {
    setShowForm(false);
    setDraft({ email: "", department: "", role: "employee" });
    setFormError(null);
  };

  const addRow = () => {
    const email = draft.email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Enter a valid email address.");
      return;
    }
    if (rows.some((row) => row.email.toLowerCase() === email)) {
      setFormError("That email is already on the list.");
      return;
    }

    o.set({
      inviteRows: [
        ...rows,
        { email, role: draft.role, department: draft.department.trim() || null },
      ],
    });
    // Keep the form open and cleared so several people can be added in a row.
    setDraft({ email: "", department: "", role: "employee" });
    setFormError(null);
  };

  const removeRow = (email) => {
    o.set({ inviteRows: rows.filter((row) => row.email !== email) });
  };

  const onFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError(null);

    try {
      const parsed = await importRoster(file).unwrap();
      o.set({
        csvErrored: false,
        csvErrorName: "",
        inviteRows: [...rows, ...(parsed?.rows ?? [])],
      });

      if (parsed?.invalid_count) {
        setError(
          `${parsed.invalid_count} row${parsed.invalid_count > 1 ? "s were" : " was"} skipped — check the email and role columns.`
        );
      }
    } catch (err) {
      o.set({ csvErrored: true, csvErrorName: file.name });
    }
  };

  // A ready-to-fill template matching the parser's columns (email, role,
  // department; role is employee or therapist, department optional). Generated
  // client-side — no round-trip needed.
  const downloadSampleCsv = () => {
    const csv = [
      "email,role,department",
      "jane.doe@company.com,employee,Engineering",
      "kwame.mensah@company.com,employee,Finance",
      "dr.ada@practice.com,therapist,",
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "talkam-team-invite-sample.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const send = async () => {
    setError(null);

    try {
      const result = await sendInvitations({
        invites: rows.map((row) => ({
          email: row.email,
          role: row.role,
          department: row.department ?? null,
        })),
      }).unwrap();

      o.set({ invitesSent: result?.data ?? null });
      navigate(V2.businessInviteSent);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  return (
    <>
      <StepEyebrow>ONBOARD YOUR TEAM</StepEyebrow>
      <ScreenTitle>Invite employees &amp; therapists</ScreenTitle>
      <ScreenLead className="mb-5">
        Assign a role to each invite. Therapists get a professional application flow;
        employees go straight to onboarding.
      </ScreenLead>

      <input
        ref={fileInput}
        type="file"
        accept=".csv,text/csv"
        onChange={onFile}
        className="hidden"
      />

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
                {o.csvErrorName} couldn&apos;t be used
              </div>
              <div className="text-[11px] text-signal-error">
                Only .csv files are supported
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                o.set({ csvErrored: false, csvErrorName: "" });
                fileInput.current?.click();
              }}
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
              File must be a .csv with columns: email, role, department. Max size 5MB.{" "}
              <button
                type="button"
                onClick={downloadSampleCsv}
                className="cursor-pointer font-boldNunito text-brand-400 underline-offset-2 hover:underline"
              >
                Download our sample template
              </button>{" "}
              if you&apos;re not sure of the format.
            </span>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={isImporting}
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
              {isImporting ? "Reading roster…" : "Upload CSV"}
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

      <div className="-mt-2.5 mb-3 flex items-center gap-1.5 text-[11px] text-ink-400">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span>
          Not sure of the format?{" "}
          <button
            type="button"
            onClick={downloadSampleCsv}
            className="cursor-pointer font-boldNunito text-brand-400 underline-offset-2 hover:underline"
          >
            Download the sample CSV
          </button>
        </span>
      </div>

      <div className="mb-[18px] flex flex-col gap-2">
        {rows.map((row) => (
          <div
            key={row.email}
            className="flex items-center gap-2 rounded-ds-md border border-ink-200 bg-white px-3 py-2.5"
          >
            <span
              className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-caption font-extraboldNunito text-white"
              style={{ background: avatarColour(row.email) }}
            >
              {row.email.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-boldNunito text-ink-800">
                {row.email}
              </div>
              <div className="text-[10px] text-ink-400">{row.department || "—"}</div>
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
            <button
              type="button"
              onClick={() => removeRow(row.email)}
              aria-label={`Remove ${row.email}`}
              className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-400 hover:bg-ink-100 hover:text-ink-600"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {showForm ? (
        <div className="mb-3 flex flex-col gap-2.5 rounded-[14px] border border-ink-200 bg-white p-3.5">
          <input
            type="email"
            value={draft.email}
            onChange={draftField("email")}
            onKeyDown={(e) => e.key === "Enter" && addRow()}
            placeholder="name@company.com"
            className={INVITE_INPUT}
            aria-label="Invite email"
          />
          <input
            type="text"
            value={draft.department}
            onChange={draftField("department")}
            onKeyDown={(e) => e.key === "Enter" && addRow()}
            placeholder="Department"
            className={INVITE_INPUT}
            aria-label="Department (optional)"
          />
          <div className="grid grid-cols-2 gap-2.5">
            {["employee", "therapist"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setDraft((prev) => ({ ...prev, role: r }))}
                aria-pressed={draft.role === r}
                className={classNames(
                  "h-11 rounded-ds-md text-[13px] font-boldNunito capitalize transition-colors",
                  draft.role === r
                    ? "bg-navy-800 text-white"
                    : "bg-ink-50 text-ink-600 hover:bg-ink-100"
                )}
              >
                {r}
              </button>
            ))}
          </div>
          {formError ? (
            <div className="text-[11.5px] font-boldNunito text-signal-error">{formError}</div>
          ) : null}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={closeForm}
              className="h-11 cursor-pointer rounded-ds-md bg-ink-50 text-[13px] font-boldNunito text-ink-600 transition-colors hover:bg-ink-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={addRow}
              className="h-11 cursor-pointer rounded-ds-md bg-brand-400 text-[13px] font-boldNunito text-white transition-colors hover:bg-brand-600"
            >
              Add
            </button>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setShowForm(true)}
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

      <FormError>{error}</FormError>

      <AuthButton disabled={rows.length === 0 || isSending} onClick={send}>
        {isSending ? "Sending…" : `Send ${rows.length} Invite${rows.length === 1 ? "" : "s"} →`}
      </AuthButton>
      <button
        type="button"
        onClick={() => navigate(V2.admin, { replace: true })}
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
  const o = useOnboarding();
  usePageMeta("Invites sent — TalkAM for Business");

  const sent = o.invitesSent;
  const invitations = sent?.invitations ?? [];
  const total = sent?.sent ?? 0;
  const therapists = invitations.filter((row) => row.role === "therapist").length;
  const employees = total - therapists;

  const breakdown = [
    employees > 0 ? `${employees} employee${employees === 1 ? "" : "s"} will complete community onboarding` : null,
    therapists > 0 ? `${therapists} therapist${therapists === 1 ? "" : "s"} will be routed into the professional application flow` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-wellness-50">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3BA88F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <ScreenTitle>Invites sent</ScreenTitle>
      <ScreenLead className="mb-6 !leading-[1.7]">
        {total} invite email{total === 1 ? " is" : "s are"} on their way. Each includes a
        unique link{breakdown ? ` — ${breakdown}` : ""}. Track status anytime from
        Employees.
      </ScreenLead>
      <AuthButton tone="brand" onClick={() => navigate(V2.admin, { replace: true })}>
        Go to Admin Dashboard →
      </AuthButton>
    </>
  );
};

/* ── 6. INVITE LANDING (recipient) ─────────────────────────────────────── */
export const InviteLanding = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const o = useOnboarding();
  const [searchParams] = useSearchParams();
  usePageMeta("Complete your registration — TalkAM");

  const token = searchParams.get("token") ?? "";
  const { data: invite, isLoading, isError, error: loadError } = useGetInvitationQuery(token, {
    skip: !token,
  });
  const [acceptInvitation, { isLoading: isAccepting }] = useAcceptInvitationMutation();

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // The role is fixed by the invitation — the deck's two pills show which one
  // the recipient was invited as.
  const role = invite?.role ?? o.landingRole;
  const company = invite?.organization_name ?? "";
  const initial = invite?.organization_initial ?? "";

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await acceptInvitation({
        token,
        full_name: fullName,
        password,
      }).unwrap();

      const data = result?.data;
      dispatch(setCredentials({ user: data?.user, accessToken: data?.token }));
      o.set({ landingRole: data?.role ?? role });
      navigate(V2.businessConsent);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  if (!token || isError) {
    return (
      <>
        <ScreenTitle>This invite link isn&apos;t valid</ScreenTitle>
        <ScreenLead className="mb-6 !leading-[1.7]">
          {token
            ? apiErrorMessage(loadError, "It may have expired or already been used.")
            : "The link is missing its token."}{" "}
          Ask your administrator to send a new invite.
        </ScreenLead>
        <AuthButton tone="brand" onClick={() => navigate(V2.businessLogin)}>
          Go to Sign In →
        </AuthButton>
      </>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center gap-2.5 rounded-ds-md border border-surface-line bg-ink-50 px-4 py-3.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-brand-400 text-[13px] font-extraboldNunito text-white">
          {initial}
        </span>
        <span className="text-[13px] text-ink-600">
          You were invited by{" "}
          <strong className="text-navy-800">{company}</strong> to join TalkAM
          as a{role === "therapist" ? " verified therapist." : "n employee."}
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
        ].map((option) => {
          const active = role === option.key;
          return (
            <div
              key={option.key}
              aria-current={active}
              className={classNames(
                "flex-1 rounded-[10px] border-[1.5px] p-2.5 text-center text-caption font-boldNunito",
                !active && "border-ink-200 bg-surface-page text-ink-400",
                active && option.key === "employee" && "border-brand-400 bg-brand-25 text-brand-600",
                active && option.key === "therapist" && "border-wellness-400 bg-wellness-50 text-wellness-600"
              )}
            >
              {option.label}
            </div>
          );
        })}
      </div>

      <FormError>{error}</FormError>

      <form className="flex flex-col gap-3.5" onSubmit={submit}>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="invite-full-name" className="text-caption font-boldNunito text-ink-600">Full name</label>
          <input
            id="invite-full-name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-12 w-full rounded-ds-md border-[1.5px] border-ink-200 bg-white px-4 text-body text-navy-800"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="invite-work-email" className="text-caption font-boldNunito text-ink-600">Work email</label>
          <input
            id="invite-work-email"
            disabled
            value={isLoading ? "" : invite?.email ?? ""}
            className="h-12 w-full cursor-not-allowed rounded-ds-md border-[1.5px] border-ink-200 bg-ink-100 px-4 text-body text-ink-400"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="invite-password" className="text-caption font-boldNunito text-ink-600">
            Create password
          </label>
          <input
            id="invite-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-ds-md border-[1.5px] border-ink-200 bg-white px-4 text-body text-navy-800"
          />
        </div>
        <AuthButton type="submit" disabled={isLoading || isAccepting} className="mt-1">
          {isAccepting ? "Creating your account…" : "Continue →"}
        </AuthButton>
      </form>
    </>
  );
};

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import classNames from "classnames";
import {
  useOnboarding,
  OnboardingSteps,
  StepEyebrow,
  ScreenTitle,
  ScreenLead,
  AuthButton,
  InfoNote,
  SelectChip,
  FormError,
  SkeletonLine,
  apiErrorMessage,
} from "../authlayout";
import { usePageMeta } from "../../../../../hooks/usePageMeta";
import { V2 } from "../../../../../constants/v2routes";
import { THERAPIST_ONBOARDING_STEPS } from "../../../../../constants/businessauth";
import {
  useGetConsentsQuery,
  useSaveConsentsMutation,
  useGetMeV2Query,
} from "../../../../../services/v2/authApiSliceV2";
import {
  useGetOnboardingTopicsQuery,
  useSaveOnboardingTopicsMutation,
  useGetSelfCheckQuery,
  useSaveSelfCheckMutation,
  useGetPricingConfigQuery,
} from "../../../../../services/v2/businessApiSlice";
import {
  useGetInterestTopicsQuery,
  useSaveTherapistSpecialtiesMutation,
} from "../../../../../services/v2/therapistApiSlice";

/** Screens 8–11: consent, topics, self-check assessment, complete. */

/**
 * Consent copy is design copy, so it stays here; which keys are REQUIRED and
 * whether they are granted comes from the API.
 */
const CONSENT_COPY = {
  account_operation: {
    title: "Account operation",
    desc: "Basic account data needed to log you in and keep your account secure.",
  },
  session_delivery: {
    title: "Session delivery",
    desc: "Encrypted data needed to book, deliver and record your therapy sessions.",
  },
  anonymous_community: {
    title: "Anonymous community",
    desc: "Post and reply in the anonymous community feed. Off by default.",
  },
  anonymised_research: {
    title: "Anonymised research",
    desc: "Let aggregated, de-identified data improve TalkAM's programs.",
  },
};

const CONSENT_ORDER = [
  "account_operation",
  "session_delivery",
  "anonymous_community",
  "anonymised_research",
];

/* ── 7. CONSENT ────────────────────────────────────────────────────────── */
export const Consent = () => {
  const navigate = useNavigate();
  const o = useOnboarding();
  usePageMeta("Your data, your choice — TalkAM");

  const { data: state, isLoading } = useGetConsentsQuery();
  const { data: me } = useGetMeV2Query();
  const [saveConsents, { isLoading: isSaving }] = useSaveConsentsMutation();
  const { data: pricing } = useGetPricingConfigQuery();
  const isTherapist = (me?.business?.role ?? o.landingRole) === "therapist";

  const [choices, setChoices] = useState({});
  const [error, setError] = useState(null);

  const items = CONSENT_ORDER.map((key) => ({
    key,
    required: state?.[key]?.required ?? CONSENT_ORDER.indexOf(key) < 2,
    ...CONSENT_COPY[key],
  }));

  const blocked = !(choices.account_operation && choices.session_delivery);

  const submit = async () => {
    setError(null);

    try {
      await saveConsents({
        consents: CONSENT_ORDER.reduce(
          (acc, key) => ({ ...acc, [key]: !!choices[key] }),
          {}
        ),
      }).unwrap();
      // A therapist gets a real Specialties step at its own url — not the
      // employee interest-topics picker (see TopicsOfInterest below).
      navigate(isTherapist ? V2.businessSpecialties : V2.businessTopics);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  return (
    <>
      {isTherapist ? <OnboardingSteps steps={THERAPIST_ONBOARDING_STEPS} current={2} /> : null}
      <StepEyebrow>BEFORE YOU CONTINUE</StepEyebrow>
      <ScreenTitle>Your data, your choice</ScreenTitle>
      <ScreenLead className="mb-5">
        NDPA 2023 requires explicit, granular consent. Nothing here is pre-selected —
        choose each independently. Change these anytime in Privacy Settings.
      </ScreenLead>

      <div className="mb-5 flex flex-col gap-2.5">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <SkeletonLine key={i} className="h-[74px] rounded-[14px]" />
            ))
          : items.map((item) => {
              const checked = !!choices[item.key];
              return (
                <div
                  key={item.key}
                  className={classNames(
                    "flex items-start gap-3 rounded-[14px] border-[1.5px] bg-white px-4 py-3.5",
                    checked ? "border-brand-400" : "border-ink-200"
                  )}
                >
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    aria-label={item.title}
                    onClick={() =>
                      setChoices((prev) => ({ ...prev, [item.key]: !checked }))
                    }
                    className={classNames(
                      "mt-px flex h-[22px] w-[22px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] border-[1.5px]",
                      checked ? "border-brand-400 bg-brand-400" : "border-surface-muted bg-white"
                    )}
                  >
                    {checked ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : null}
                  </button>
                  <div className="flex-1">
                    <div className="mb-[3px] flex flex-wrap items-center gap-[7px]">
                      <span className="text-[13px] font-boldNunito text-navy-800">
                        {item.title}
                      </span>
                      <span
                        className={classNames(
                          "rounded-[5px] px-[7px] py-0.5 text-[9px] font-extraboldNunito tracking-[0.04em]",
                          item.required
                            ? "bg-surface-errorTint text-surface-errorInk"
                            : "bg-ink-100 text-ink-500"
                        )}
                      >
                        {item.required ? "REQUIRED" : "OPTIONAL"}
                      </span>
                    </div>
                    <p className="text-caption leading-[1.5] text-ink-500">{item.desc}</p>
                  </div>
                </div>
              );
            })}
      </div>

      <p className="mb-5 text-[11px] leading-[1.6] text-ink-400">
        By continuing you agree to our{" "}
        <Link to={V2.privacy} className="font-boldNunito text-brand-400">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link to={V2.terms} className="font-boldNunito text-brand-400">
          Terms of Service
        </Link>
        . Data Protection Officer:{" "}
        <span className="font-boldNunito text-navy-800">
          {pricing?.dpo_email ?? "privacy@talkam.net"}
        </span>
      </p>

      <FormError>{error}</FormError>

      <AuthButton disabled={blocked || isSaving} onClick={submit}>
        {isSaving ? "Saving…" : "Accept & Continue →"}
      </AuthButton>
    </>
  );
};

/* ── 8. TOPICS OF INTEREST (employees only) ─────────────────────────────── */
export const TopicsOfInterest = () => {
  const navigate = useNavigate();
  const o = useOnboarding();
  usePageMeta("What's on your mind lately? — TalkAM");

  const { data: topics = [], isLoading } = useGetOnboardingTopicsQuery();
  const [saveTopics, { isLoading: isSaving }] = useSaveOnboardingTopicsMutation();
  const [error, setError] = useState(null);

  const submit = async () => {
    setError(null);

    const ids = topics
      .filter((topic) => o.selectedTopics.includes(topic.key))
      .map((topic) => topic.id);

    try {
      await saveTopics({ interests: ids }).unwrap();
      navigate(V2.businessSelfCheck);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  return (
    <>
      <StepEyebrow>LAST STEP</StepEyebrow>
      <ScreenTitle>What&apos;s on your mind lately?</ScreenTitle>
      <ScreenLead className="mb-6">
        Pick a few topics — same categories as the mobile community. We&apos;ll tailor
        your feed and suggested therapists. You can change this anytime.
      </ScreenLead>

      <div className="mb-7 flex flex-wrap gap-2.5">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <SkeletonLine key={i} className="h-[38px] w-[120px] rounded-full" />
            ))
          : topics.map((topic) => (
              <SelectChip
                key={topic.key}
                selected={o.selectedTopics.includes(topic.key)}
                onClick={() => o.toggleIn("selectedTopics", topic.key)}
              >
                {topic.label}
              </SelectChip>
            ))}
      </div>

      <FormError>{error}</FormError>

      <AuthButton
        disabled={o.selectedTopics.length === 0 || isSaving}
        onClick={submit}
      >
        {isSaving ? "Saving…" : "Continue →"}
      </AuthButton>
    </>
  );
};

/* ── 8b. SPECIALTIES (therapists only, its own url/screen) ──────────────
 * A therapist used to be routed through the exact same screen as above —
 * wrong entirely, not just wrong copy: it never collected a bio or clinical
 * specialties, and the completion screen went on to claim "your
 * application now moves to credential verification" regardless. This is
 * now a genuinely separate step at /business/specialties, reached only
 * from Consent's own role branch — no runtime role-forking on one shared
 * url/screen, which was fragile against a reload resetting local state.
 */
export const TherapistSpecialties = () => {
  const navigate = useNavigate();
  usePageMeta("Specialties — TalkAM");

  const { data: topics = [], isLoading } = useGetInterestTopicsQuery();
  const [saveSpecialties, { isLoading: isSaving }] = useSaveTherapistSpecialtiesMutation();

  const [bio, setBio] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState(null);

  const toggleId = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const blocked = !bio.trim() || selectedIds.length === 0 || isSaving;

  const submit = async () => {
    setError(null);

    try {
      await saveSpecialties({ bio: bio.trim(), specialties: selectedIds }).unwrap();
      // Therapists are providers, not clients — the employee self check-in is
      // org.role:employee only, so skip it and go straight to the finish.
      navigate(V2.businessWelcome);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  return (
    <>
      <OnboardingSteps steps={THERAPIST_ONBOARDING_STEPS} current={3} />
      <StepEyebrow>LAST STEP</StepEyebrow>
      <ScreenTitle>Specialties</ScreenTitle>
      <ScreenLead className="mb-6">
        Clients find you by these. Select all that apply.
      </ScreenLead>

      <label className="mb-1.5 block text-[11px] font-boldNunito uppercase tracking-[0.04em] text-ink-500">
        Your bio (shown on profile)
      </label>
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        maxLength={1000}
        placeholder="Describe yourself"
        className="mb-5 h-[110px] w-full resize-none rounded-[10px] border-[1.5px] border-ink-200 px-[13px] py-2.5 text-[13px] leading-[1.6] text-navy-800 outline-none focus:border-brand-400"
      />

      <div className="mb-7 flex flex-wrap gap-2.5">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <SkeletonLine key={i} className="h-[38px] w-[120px] rounded-full" />
            ))
          : topics.map((topic) => (
              <SelectChip
                key={topic.id}
                selected={selectedIds.includes(topic.id)}
                onClick={() => toggleId(topic.id)}
              >
                {topic.name}
              </SelectChip>
            ))}
      </div>

      <FormError>{error}</FormError>

      <AuthButton disabled={blocked} onClick={submit}>
        {isSaving ? "Saving…" : "Continue →"}
      </AuthButton>
    </>
  );
};

/* ── 9. SELF-CHECK ASSESSMENT ──────────────────────────────────────────── */
export const SelfCheck = () => {
  const navigate = useNavigate();
  const o = useOnboarding();
  usePageMeta("A quick self check-in — TalkAM");

  const { data: me } = useGetMeV2Query();
  const role = me?.business?.role ?? o.landingRole;
  const isTherapist = role === "therapist";

  // Only employees have a self check-in; skip the org.role:employee endpoint for
  // anyone else so it never 403s.
  const { data: selfCheck, isLoading } = useGetSelfCheckQuery(undefined, {
    skip: role !== "employee",
  });
  const [saveSelfCheck, { isLoading: isSaving }] = useSaveSelfCheckMutation();
  const [error, setError] = useState(null);

  // Defensive: a therapist reaching this screen (back button / direct link) is
  // moved straight to the finish rather than shown an employee-only step.
  useEffect(() => {
    if (isTherapist) navigate(V2.businessWelcome, { replace: true });
  }, [isTherapist, navigate]);

  const questions = selfCheck?.questions ?? [];
  const options = selfCheck?.options ?? [];
  const company = me?.business?.organization?.name ?? "Your employer";

  const incomplete =
    questions.length === 0 ||
    questions.some((row) => o.assessment[row.category] === null || o.assessment[row.category] === undefined);

  const submit = async () => {
    setError(null);

    try {
      const result = await saveSelfCheck({
        answers: questions.reduce(
          (acc, row) => ({ ...acc, [row.category]: o.assessment[row.category] }),
          {}
        ),
      }).unwrap();

      o.set({ primaryConcern: result?.primary_concern });
      navigate(V2.businessWelcome);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  return (
    <>
      <StepEyebrow>LAST STEP · 2 MINUTES</StepEyebrow>
      <ScreenTitle>A quick self check-in</ScreenTitle>
      <ScreenLead className="mb-5">
        This helps us privately suggest the right kind of therapist for you first.
        Answer honestly — only you ever see these individual answers.
      </ScreenLead>

      <InfoNote
        tone="purple"
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B44A8" strokeWidth="2" className="mt-px shrink-0">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          </svg>
        }
      >
        {company} never sees your individual answers. Only an anonymised, company-wide
        pattern (once at least 5 people respond) helps HR know which specialties to
        prioritise.
      </InfoNote>

      <div className="mb-6 flex flex-col gap-[18px]">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <SkeletonLine key={i} className="h-[70px]" />
            ))
          : questions.map((row) => (
              <fieldset key={row.category}>
                <legend className="mb-2.5 text-[13px] font-boldNunito text-navy-800">
                  {row.label}
                </legend>
                <div className="flex gap-2">
                  {options.map((opt) => {
                    const selected = o.assessment[row.category] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          o.set({
                            assessment: { ...o.assessment, [row.category]: opt.value },
                          })
                        }
                        className={classNames(
                          "flex-1 cursor-pointer rounded-[9px] border-[1.5px] px-1 py-[9px] text-center text-[11.5px] font-boldNunito",
                          selected
                            ? "border-navy-800 bg-navy-800 text-white"
                            : "border-ink-200 bg-surface-page text-ink-500"
                        )}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
      </div>

      <FormError>{error}</FormError>

      <AuthButton disabled={incomplete || isSaving} onClick={submit}>
        {isSaving ? "Saving…" : "Complete Onboarding →"}
      </AuthButton>
    </>
  );
};

/* ── 10. COMPLETE / ROUTE ──────────────────────────────────────────────── */
export const OnboardingComplete = () => {
  const navigate = useNavigate();
  const o = useOnboarding();
  usePageMeta("You're all set — TalkAM");

  const { data: me, isLoading: isLoadingMe } = useGetMeV2Query();
  const { data: selfCheck } = useGetSelfCheckQuery(undefined, {
    skip: me?.business?.role !== "employee",
  });

  const role = me?.business?.role ?? o.landingRole;
  const isTherapist = role === "therapist";
  // v1 UserResource exposes one `name` (full name) — there is no first_name.
  const firstName = (me?.name ?? "").split(" ")[0];
  const primary = o.primaryConcern ?? selfCheck?.primary_concern ?? "";

  // o.landingRole defaults to "employee" (authlayout.jsx) and is only ever
  // set to the real role by teamonboarding.jsx's own invite-detection step —
  // a therapist going through THIS flow never sets it, so before `me` loads,
  // `role` above resolves to the wrong default and briefly renders the
  // employee copy before flipping to the correct one once useGetMeV2Query()
  // resolves. me.business.role is the only value worth trusting here; wait
  // for it rather than flash a guess.
  if (isLoadingMe) {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <SkeletonLine className="h-16 w-16 rounded-full" />
        <SkeletonLine className="h-6 w-48 rounded-full" />
        <SkeletonLine className="h-4 w-64 rounded-full" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-wellness-50 text-[30px]">
        🎉
      </div>
      <ScreenTitle>
        You&apos;re all set{firstName ? `, ${firstName}` : ""}
      </ScreenTitle>
      <ScreenLead className="mb-6 !leading-[1.7]">
        Your account is active.{" "}
        {isTherapist
          ? "Your bio and specialties are saved, and your dashboard is ready — you can already accept sessions from your employer's team. Complete TalkAM verification anytime in the mobile app if you'd also like to appear in the public therapist directory."
          : `Your consent choices are recorded and your interests are saved.${primary ? ` Based on your check-in, we'll suggest therapists specialising in ${primary} first.` : ""} Head to your dashboard to book.`}
      </ScreenLead>

      <AuthButton
        tone={isTherapist ? "therapy" : "brand"}
        onClick={() =>
          navigate(isTherapist ? V2.therapist : V2.employee, { replace: true })
        }
      >
        {isTherapist ? "Go to Therapist Dashboard →" : "Go to My Dashboard →"}
      </AuthButton>
    </>
  );
};

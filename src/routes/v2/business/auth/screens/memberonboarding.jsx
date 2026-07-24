import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import classNames from "classnames";
import {
  useOnboarding,
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
} from "../../../../../services/v2/businessApiSlice";

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
  usePageMeta("Your data, your choice — TalkAM");

  const { data: state, isLoading } = useGetConsentsQuery();
  const [saveConsents, { isLoading: isSaving }] = useSaveConsentsMutation();

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
      navigate(V2.businessTopics);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  return (
    <>
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
        <span className="font-boldNunito text-navy-800">dpo@talkam.net</span>
      </p>

      <FormError>{error}</FormError>

      <AuthButton disabled={blocked || isSaving} onClick={submit}>
        {isSaving ? "Saving…" : "Accept & Continue →"}
      </AuthButton>
    </>
  );
};

/* ── 8. TOPICS OF INTEREST ─────────────────────────────────────────────── */
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

/* ── 9. SELF-CHECK ASSESSMENT ──────────────────────────────────────────── */
export const SelfCheck = () => {
  const navigate = useNavigate();
  const o = useOnboarding();
  usePageMeta("A quick self check-in — TalkAM");

  const { data: selfCheck, isLoading } = useGetSelfCheckQuery();
  const { data: me } = useGetMeV2Query();
  const [saveSelfCheck, { isLoading: isSaving }] = useSaveSelfCheckMutation();
  const [error, setError] = useState(null);

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

  const { data: me } = useGetMeV2Query();
  const { data: selfCheck } = useGetSelfCheckQuery(undefined, {
    skip: me?.business?.role !== "employee",
  });

  const role = me?.business?.role ?? o.landingRole;
  const isTherapist = role === "therapist";
  const firstName = me?.first_name ?? "";
  const primary = o.primaryConcern ?? selfCheck?.primary_concern ?? "";

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
          ? "Your application now moves to credential verification. Meanwhile, set your availability from the dashboard."
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

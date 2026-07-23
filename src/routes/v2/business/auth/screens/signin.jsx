import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useOnboarding,
  StepEyebrow,
  ScreenTitle,
  ScreenLead,
  Field,
  authInputClass,
  AuthButton,
  OtpBoxes,
  InfoNote,
} from "../authlayout";
import { usePageMeta } from "../../../../../hooks/usePageMeta";
import { V2 } from "../../../../../constants/v2routes";
import { DEMO_COMPANY } from "../../../../../fakedata/v2/auth";

/** Screens 12–14: sign in, two-factor, forgot password. */

/* ── 11. SIGN IN ───────────────────────────────────────────────────────── */
export const SignIn = () => {
  const navigate = useNavigate();
  const o = useOnboarding();
  usePageMeta("Sign in — TalkAM for Business");

  const signInAs = (role) => {
    o.set({ twoFaRole: role });
    navigate(V2.businessTwoFactor);
  };

  return (
    <>
      <ScreenTitle>Welcome back</ScreenTitle>
      <ScreenLead className="mb-7">
        Sign in with your business email. If two-factor is on, we&apos;ll email a
        one-time code to your work address next.
      </ScreenLead>

      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <Field label="Work email" labelTone="brand">
          <input
            type="email"
            defaultValue={DEMO_COMPANY.adminEmail}
            className={authInputClass(true)}
          />
        </Field>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between gap-3">
            <label className="text-caption font-boldNunito text-ink-600">Password</label>
            <button
              type="button"
              onClick={() => navigate(V2.businessForgotPassword)}
              className="cursor-pointer text-caption font-boldNunito text-brand-400"
            >
              Forgot password?
            </button>
          </div>
          <input type="password" defaultValue="passw0rd12" className={authInputClass()} />
        </div>

        {/* The deck exposes all three roles so any dashboard can be reached. */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => signInAs("admin")}
            className="h-12 flex-1 cursor-pointer rounded-ds-md bg-navy-800 text-[13px] font-extraboldNunito text-white transition-colors hover:bg-navy-900"
          >
            Sign in as Admin
          </button>
          <button
            type="button"
            onClick={() => signInAs("employee")}
            className="h-12 flex-1 cursor-pointer rounded-ds-md bg-brand-400 text-[13px] font-extraboldNunito text-white transition-colors hover:bg-brand-600"
          >
            as Employee
          </button>
          <button
            type="button"
            onClick={() => signInAs("therapist")}
            className="h-12 flex-1 cursor-pointer rounded-ds-md bg-wellness-400 text-[13px] font-extraboldNunito text-white transition-colors hover:bg-wellness-600"
          >
            as Therapist
          </button>
        </div>
      </form>

      <p className="mt-5 text-center text-caption text-ink-400">
        New company?{" "}
        <button
          type="button"
          onClick={() => navigate(V2.businessSignUp)}
          className="cursor-pointer font-boldNunito text-brand-400"
        >
          Create an account
        </button>
      </p>
    </>
  );
};

/* ── 12. TWO-FACTOR (EMAIL OTP) ────────────────────────────────────────── */
export const TwoFactor = () => {
  const navigate = useNavigate();
  const o = useOnboarding();
  usePageMeta("Enter your login code — TalkAM for Business");

  const dashboards = {
    admin: V2.admin,
    employee: V2.employee,
    therapist: V2.therapist,
  };

  return (
    <>
      <StepEyebrow>TWO-FACTOR AUTHENTICATION</StepEyebrow>
      <ScreenTitle>Enter your login code</ScreenTitle>
      <ScreenLead className="mb-6">
        For your security, we&apos;ve emailed a 6-digit code to your work email{" "}
        <strong className="text-navy-800">{DEMO_COMPANY.adminEmail}</strong>. Enter it
        to finish signing in as{" "}
        <strong className="text-navy-800">{o.twoFaRole}</strong>.
      </ScreenLead>

      <OtpBoxes filled={["2", "9", "1"]} />

      <InfoNote
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#017FC8" strokeWidth="2" className="mt-px shrink-0">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        }
      >
        This code was sent only to your registered work email. It expires in 10 minutes
        and can be used once.
      </InfoNote>

      <p className="mb-6 text-caption text-ink-400">
        Didn&apos;t get it?{" "}
        <button type="button" className="cursor-pointer font-boldNunito text-brand-400">
          Resend code
        </button>
      </p>

      <AuthButton onClick={() => navigate(dashboards[o.twoFaRole] ?? V2.admin)}>
        Verify &amp; Sign In →
      </AuthButton>

      <p className="mt-4 text-center text-caption text-ink-400">
        <button
          type="button"
          onClick={() => navigate(V2.businessLogin)}
          className="cursor-pointer font-boldNunito text-brand-400"
        >
          ← Back to sign in
        </button>
      </p>
    </>
  );
};

/* ── 13. FORGOT PASSWORD ───────────────────────────────────────────────── */
export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  usePageMeta("Reset your password — TalkAM for Business");

  if (sent) {
    return (
      <>
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-25">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#017FC8" strokeWidth="2">
            <path d="M22 6l-10 7L2 6" />
            <rect x="2" y="4" width="20" height="16" rx="2" />
          </svg>
        </div>
        <h1 className="mb-2 text-h2 font-extraboldNunito text-navy-800">
          Check your inbox
        </h1>
        <ScreenLead className="mb-6 !leading-[1.7]">
          We&apos;ve sent a password reset link to {DEMO_COMPANY.adminEmail}. It
          expires in 30 minutes.
        </ScreenLead>
        <button
          type="button"
          onClick={() => navigate(V2.businessLogin)}
          className="h-12 w-full cursor-pointer rounded-ds-md border border-ink-200 bg-surface-page text-[13px] font-extraboldNunito text-navy-800"
        >
          Back to Sign In
        </button>
      </>
    );
  }

  return (
    <>
      <ScreenTitle>Reset your password</ScreenTitle>
      <ScreenLead className="mb-6">
        Enter your business email — we&apos;ll send a secure reset link.
      </ScreenLead>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        <Field label="Work email">
          <input
            type="email"
            defaultValue={DEMO_COMPANY.adminEmail}
            className={authInputClass()}
          />
        </Field>
        <AuthButton type="submit">Send Reset Link</AuthButton>
      </form>
    </>
  );
};

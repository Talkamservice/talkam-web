import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
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
  FormError,
  apiErrorMessage,
} from "../authlayout";
import { usePageMeta } from "../../../../../hooks/usePageMeta";
import { V2 } from "../../../../../constants/v2routes";
import { setCredentials } from "../../../../../services/authSlice";
import {
  useLoginV2Mutation,
  useVerifyTwoFactorMutation,
  useForgotPasswordV2Mutation,
  useRequestOtpV2Mutation,
} from "../../../../../services/v2/authApiSliceV2";

/** Screens 12–14: sign in, two-factor, forgot password. */

/** Where each role lands after a successful sign-in. */
const DASHBOARDS = {
  admin: V2.admin,
  employee: V2.employee,
  therapist: V2.therapist,
};

/**
 * Auth transitions REPLACE the history entry — you should never be able to
 * press Back into a sign-in form you have already cleared.
 *
 * It is also load-bearing: the three dashboards are separate top-level route
 * trees, and a *push* across trees issued from an async continuation (i.e.
 * after `await login(...)`) is silently dropped by the router. Replace is both
 * the correct semantics and the one that lands.
 */
const enterDashboard = (navigate, dashboard) =>
  navigate(DASHBOARDS[dashboard] ?? V2.employee, { replace: true });

/* ── 11. SIGN IN ───────────────────────────────────────────────────────── */
export const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const o = useOnboarding();
  usePageMeta("Sign in — TalkAM for Business");

  const [login, { isLoading }] = useLoginV2Mutation();
  const [form, setForm] = useState({ input: "", password: "" });
  const [error, setError] = useState(null);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  /**
   * The deck exposes three buttons so every dashboard is reachable during
   * review. In the real product the destination is not the caller's to choose:
   * all three submit the same credentials and the server's
   * `business.dashboard` decides where you land.
   */
  const submit = async (e) => {
    e?.preventDefault();
    setError(null);

    try {
      const result = await login(form).unwrap();
      const data = result?.data;

      if (data?.two_factor_required) {
        o.set({ pendingEmail: data.email ?? form.input });
        navigate(V2.businessTwoFactor);
        return;
      }

      dispatch(setCredentials({ user: data?.user, accessToken: data?.token }));
      enterDashboard(navigate, data?.business?.dashboard);
    } catch (err) {
      setError(apiErrorMessage(err, "We couldn't sign you in. Check your details and try again."));
    }
  };

  return (
    <>
      <ScreenTitle>Welcome back</ScreenTitle>
      <ScreenLead className="mb-7">
        Sign in with your business email. If two-factor is on, we&apos;ll email a
        one-time code to your work address next.
      </ScreenLead>

      <FormError>{error}</FormError>

      <form className="flex flex-col gap-4" onSubmit={submit}>
        <Field label="Work email" labelTone="brand">
          <input
            type="email"
            required
            value={form.input}
            onChange={set("input")}
            className={authInputClass(true)}
          />
        </Field>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between gap-3">
            <label htmlFor="signin-password" className="text-caption font-boldNunito text-ink-600">Password</label>
            <button
              type="button"
              onClick={() => navigate(V2.businessForgotPassword)}
              className="cursor-pointer text-caption font-boldNunito text-brand-400"
            >
              Forgot password?
            </button>
          </div>
          <input
            id="signin-password"
            type="password"
            required
            value={form.password}
            onChange={set("password")}
            className={authInputClass()}
          />
        </div>

        {/* Three roles, one credential set — the server decides the destination. */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="submit"
            disabled={isLoading}
            className="h-12 flex-1 cursor-pointer rounded-ds-md bg-navy-800 text-[13px] font-extraboldNunito text-white transition-colors hover:bg-navy-900"
          >
            {isLoading ? "Signing in…" : "Sign in as Admin"}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="h-12 flex-1 cursor-pointer rounded-ds-md bg-brand-400 text-[13px] font-extraboldNunito text-white transition-colors hover:bg-brand-600"
          >
            as Employee
          </button>
          <button
            type="submit"
            disabled={isLoading}
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
  const dispatch = useDispatch();
  const o = useOnboarding();
  usePageMeta("Enter your login code — TalkAM for Business");

  const [verifyTwoFactor, { isLoading }] = useVerifyTwoFactorMutation();
  const [requestOtp, { isLoading: isResending }] = useRequestOtpV2Mutation();

  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [resent, setResent] = useState(false);

  const email = o.pendingEmail;

  const submit = async () => {
    setError(null);

    try {
      const result = await verifyTwoFactor({ email, code }).unwrap();
      const data = result?.data;

      dispatch(setCredentials({ user: data?.user, accessToken: data?.token }));
      enterDashboard(navigate, data?.business?.dashboard);
    } catch (err) {
      setError(apiErrorMessage(err, "That code didn't work. Request a new one."));
      setCode("");
    }
  };

  const resend = async () => {
    setError(null);
    setResent(false);

    try {
      await requestOtp({ type: "login", email }).unwrap();
      setResent(true);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  return (
    <>
      <StepEyebrow>TWO-FACTOR AUTHENTICATION</StepEyebrow>
      <ScreenTitle>Enter your login code</ScreenTitle>
      <ScreenLead className="mb-6">
        For your security, we&apos;ve emailed a 6-digit code to your work email{" "}
        <strong className="text-navy-800">{email}</strong>. Enter it
        to finish signing in.
      </ScreenLead>

      <OtpBoxes value={code} onChange={setCode} disabled={isLoading} />

      <FormError>{error}</FormError>

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
        {resent ? "A new code is on its way. " : "Didn't get it? "}
        <button
          type="button"
          onClick={resend}
          disabled={isResending}
          className="cursor-pointer font-boldNunito text-brand-400"
        >
          Resend code
        </button>
      </p>

      <AuthButton disabled={code.length < 6 || isLoading} onClick={submit}>
        {isLoading ? "Verifying…" : "Verify & Sign In →"}
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
  usePageMeta("Reset your password — TalkAM for Business");

  const [forgotPassword, { isLoading }] = useForgotPasswordV2Mutation();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await forgotPassword({ email }).unwrap();
      setSent(true);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

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
          We&apos;ve sent a password reset link to {email}. It expires in 30 minutes.
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

      <FormError>{error}</FormError>

      <form className="flex flex-col gap-4" onSubmit={submit}>
        <Field label="Work email">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authInputClass()}
          />
        </Field>
        <AuthButton type="submit" disabled={isLoading}>
          {isLoading ? "Sending…" : "Send Reset Link"}
        </AuthButton>
      </form>
    </>
  );
};

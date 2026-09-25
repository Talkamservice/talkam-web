import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  ScreenTitle,
  ScreenLead,
  Field,
  authInputClass,
  PasswordInput,
  AuthButton,
  OtpBoxes,
  FormError,
  apiErrorMessage,
} from "../../business/auth/authlayout";
import { usePageMeta } from "../../../../hooks/usePageMeta";
import { V2 } from "../../../../constants/v2routes";
import { setCredentials } from "../../../../services/authSlice";
import { useLoginV2Mutation, useVerifyTwoFactorMutation } from "../../../../services/v2/authApiSliceV2";

/**
 * Platform Admin sign-in — deliberately its own screen, not a reuse of the
 * B2B SignIn (that one resolves role off `business.role`, an org-scoped
 * field a platform-admin account has nothing in). This checks
 * `platform_role.is_platform_admin` off the same /auth/login response
 * instead (see LoginController::login's new "platform_role" key).
 */
export const PlatformLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  usePageMeta("Platform Admin sign in — TalkAM");

  const [login, { isLoading }] = useLoginV2Mutation();
  const [verifyTwoFactor, { isLoading: isVerifying }] = useVerifyTwoFactorMutation();

  const [form, setForm] = useState({ input: "", password: "" });
  const [step, setStep] = useState("credentials");
  const [pendingEmail, setPendingEmail] = useState(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const enter = (data) => {
    if (!data?.platform_role?.is_platform_admin) {
      setError("This account isn't registered for the Platform Admin panel.");
      return false;
    }
    dispatch(setCredentials({ user: data.user, accessToken: data.token }));
    navigate(V2.platform, { replace: true });
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await login(form).unwrap();
      const data = result?.data;

      if (data?.two_factor_required) {
        setPendingEmail(data.email ?? form.input);
        setStep("otp");
        return;
      }

      enter(data);
    } catch (err) {
      setError(apiErrorMessage(err, "We couldn't sign you in. Check your details and try again."));
    }
  };

  const verify = async () => {
    setError(null);
    try {
      const result = await verifyTwoFactor({ email: pendingEmail, code }).unwrap();
      if (!enter(result?.data)) setCode("");
    } catch (err) {
      setError(apiErrorMessage(err, "That code didn't work. Request a new one."));
      setCode("");
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[linear-gradient(135deg,#141B34,#1A2E5A)] px-4">
      <div className="w-full max-w-[420px] rounded-ds-xl bg-white p-8 shadow-e4">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-navy-800 text-[13px] font-extraboldNunito text-gold-400">
            TA
          </span>
          <span className="text-caption font-boldNunito tracking-[0.08em] text-ink-400">
            PLATFORM ADMIN
          </span>
        </div>

        {step === "credentials" ? (
          <>
            <ScreenTitle>Staff sign in</ScreenTitle>
            <ScreenLead className="mb-6">
              Restricted to TalkAM staff with a Platform Admin role.
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
              <Field label="Password">
                <PasswordInput required value={form.password} onChange={set("password")} />
              </Field>
              <AuthButton type="submit" disabled={isLoading}>
                {isLoading ? "Signing in…" : "Sign In"}
              </AuthButton>
            </form>
          </>
        ) : (
          <>
            <ScreenTitle>Enter your login code</ScreenTitle>
            <ScreenLead className="mb-6">
              We&apos;ve emailed a 6-digit code to <strong className="text-navy-800">{pendingEmail}</strong>.
            </ScreenLead>

            <OtpBoxes value={code} onChange={setCode} disabled={isVerifying} />
            <FormError>{error}</FormError>

            <AuthButton disabled={code.length < 6 || isVerifying} onClick={verify}>
              {isVerifying ? "Verifying…" : "Verify & Sign In"}
            </AuthButton>

            <button
              type="button"
              onClick={() => { setStep("credentials"); setError(null); }}
              className="mt-4 w-full cursor-pointer text-center text-caption font-boldNunito text-brand-400"
            >
              ← Back to sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
};

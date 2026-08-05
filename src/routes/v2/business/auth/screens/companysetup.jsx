import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
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
  PasswordStrength,
  PasswordInput,
  isPasswordValid,
} from "../authlayout";
import { usePageMeta } from "../../../../../hooks/usePageMeta";
import { V2 } from "../../../../../constants/v2routes";
import { setCredentials } from "../../../../../services/authSlice";
import {
  useGetPricingConfigQuery,
  useGetIndustriesQuery,
  useGetOrganizationQuery,
  useRegisterCompanyMutation,
  useVerifyDomainMutation,
  useSaveSeatsMutation,
  useSavePlanMutation,
  useCheckoutPlanMutation,
  useCardSetupMutation,
} from "../../../../../services/v2/businessApiSlice";
import { useRequestOtpV2Mutation } from "../../../../../services/v2/authApiSliceV2";

/** Screens 1–4: company signup, domain verify, seats, plan & billing. */

const naira = (n) => `₦${Math.round(n || 0).toLocaleString("en-NG")}`;

/* ── 1. COMPANY SIGNUP ─────────────────────────────────────────────────── */
export const CompanySignup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const o = useOnboarding();
  usePageMeta("Create your company account — TalkAM for Business");

  const [registerCompany, { isLoading }] = useRegisterCompanyMutation();
  const { data: industries = [] } = useGetIndustriesQuery();
  const { data: pricing } = useGetPricingConfigQuery();
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    company_name: "",
    work_email: "",
    industry: "",
    headcount_band: "",
    password: "",
  });

  const headcountBands = pricing?.headcount_bands ?? [];

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  // Default the two dropdowns to the first fetched option once the lists arrive
  // (without clobbering a choice the user has already made).
  useEffect(() => {
    if (!form.industry && industries.length) {
      setForm((prev) => ({ ...prev, industry: industries[0].name }));
    }
  }, [industries, form.industry]);

  useEffect(() => {
    if (!form.headcount_band && headcountBands.length) {
      setForm((prev) => ({ ...prev, headcount_band: headcountBands[0] }));
    }
  }, [headcountBands, form.headcount_band]);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await registerCompany(form).unwrap();
      const data = result?.data;

      dispatch(setCredentials({ user: data?.user, accessToken: data?.token }));
      o.set({ pendingEmail: form.work_email });
      navigate(V2.businessVerify);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  return (
    <>
      <StepEyebrow>STEP 1 OF 3 · COMPANY DETAILS</StepEyebrow>
      <ScreenTitle>Create your company account</ScreenTitle>
      <ScreenLead className="mb-7">
        No OAuth, no personal accounts — sign up with your verified business email
        only.
      </ScreenLead>

      <FormError>{error}</FormError>

      <form className="flex flex-col gap-4" onSubmit={submit}>
        <Field label="Company name">
          <input
            required
            value={form.company_name}
            onChange={set("company_name")}
            className={authInputClass()}
          />
        </Field>

        <Field
          label="Work email"
          labelTone="brand"
          hint="Must be a company domain — free email providers (Gmail, Yahoo) aren't accepted."
        >
          <input
            type="email"
            required
            value={form.work_email}
            onChange={set("work_email")}
            className={authInputClass(true)}
          />
        </Field>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Industry">
            <select className={authInputClass()} value={form.industry} onChange={set("industry")}>
              {industries.map((option) => (
                <option key={option.id ?? option.name} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Headcount">
            <select
              className={authInputClass()}
              value={form.headcount_band}
              onChange={set("headcount_band")}
            >
              {headcountBands.map((band) => (
                <option key={band} value={band}>
                  {band}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Create password">
          <PasswordInput
            required
            value={form.password}
            onChange={set("password")}
          />
          <PasswordStrength value={form.password} />
        </Field>

        <AuthButton
          type="submit"
          disabled={isLoading || !isPasswordValid(form.password)}
          className="mt-1.5"
        >
          {isLoading ? "Creating account…" : "Continue →"}
        </AuthButton>

        <p className="text-center text-caption text-ink-400">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate(V2.businessLogin)}
            className="cursor-pointer font-boldNunito text-brand-400"
          >
            Sign in
          </button>
        </p>
      </form>
    </>
  );
};

/* ── 2. DOMAIN CONFIRMATION ────────────────────────────────────────────── */
export const DomainVerify = () => {
  const navigate = useNavigate();
  const o = useOnboarding();
  usePageMeta("Confirm your business email — TalkAM for Business");

  const { data: org } = useGetOrganizationQuery();
  const [verifyDomain, { isLoading }] = useVerifyDomainMutation();
  const [requestOtp, { isLoading: isResending }] = useRequestOtpV2Mutation();

  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [resent, setResent] = useState(false);

  const organization = org?.organization;
  const email = o.pendingEmail || organization?.hr_contact_email || "your work email";

  const submit = async () => {
    setError(null);

    try {
      await verifyDomain({ code }).unwrap();
      navigate(V2.businessSeats);
    } catch (err) {
      setError(apiErrorMessage(err, "That code didn't work. Request a new one."));
      setCode("");
    }
  };

  const resend = async () => {
    setError(null);
    setResent(false);

    try {
      await requestOtp({ type: "verify_email", email }).unwrap();
      setResent(true);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  return (
    <>
      <StepEyebrow>STEP 2 OF 4 · VERIFY EMAIL</StepEyebrow>
      <ScreenTitle>Confirm your business email</ScreenTitle>
      <ScreenLead className="mb-6">
        We&apos;ve sent a 6-digit code to{" "}
        <strong className="text-navy-800">{email}</strong>. Enter it below to
        verify your email and continue.
      </ScreenLead>

      <OtpBoxes value={code} onChange={setCode} disabled={isLoading} />

      <FormError>{error}</FormError>

      <InfoNote
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#017FC8" strokeWidth="2" className="mt-px shrink-0">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        }
      >
        Email verification prevents anyone from creating a company account with an
        address they don&apos;t control. Codes expire in 15 minutes.
      </InfoNote>

      <p className="mb-6 text-caption text-ink-400">
        {resent ? "A new code is on its way. " : "Didn't get it? "}
        <button
          type="button"
          onClick={resend}
          disabled={isResending}
          className="cursor-pointer font-boldNunito text-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isResending ? "Sending…" : "Resend code"}
        </button>
      </p>

      <AuthButton disabled={code.length < 6 || isLoading} onClick={submit}>
        {isLoading ? "Verifying…" : "Verify & Continue →"}
      </AuthButton>
    </>
  );
};

/* ── 3. CHOOSE SEATS ───────────────────────────────────────────────────── */
export const ChooseSeats = () => {
  const navigate = useNavigate();
  const o = useOnboarding();
  usePageMeta("Choose your seats — TalkAM for Business");

  const { data: pricing } = useGetPricingConfigQuery();
  const { data: org } = useGetOrganizationQuery();
  const [saveSeats, { isLoading }] = useSaveSeatsMutation();
  const [error, setError] = useState(null);

  const tiers = pricing?.seat_tiers ?? [];
  const bundleOptions = pricing?.bundle_options ?? [];
  const blockRate = pricing?.session_rate ?? 0;
  const customRate = pricing?.session_custom_rate ?? blockRate;

  // Seed the stepper from what the company already saved, once.
  const savedSeats = org?.organization?.seats_licensed;
  useEffect(() => {
    if (savedSeats) o.set({ seatsCount: String(savedSeats) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedSeats]);

  const seats = parseInt(o.seatsCount, 10) || 0;
  const seatsInvalid = seats <= 0;

  // Per-seat price comes from the volume tier the seat count lands in — the same
  // "YOUR TIER" row shown below. It IS the facilitation fee, billed monthly.
  const currentTier = tiers.find(
    (t) => seats >= t.min && (t.max === null || seats <= t.max)
  );
  const seatRate = currentTier?.price ?? 0;

  const usesNetwork = o.therapistAccessOn;
  const prepay = o.paymentTiming !== "postpay";
  const isCustom = o.bundleKey === "custom";

  const bundleSessions = isCustom
    ? Math.max(parseInt(o.customBundle, 10) || 0, 0)
    : parseInt(o.bundleKey, 10) || 0;

  // A prepaid bundle prices at the block rate, or the +3% custom rate for a
  // non-block quantity. Postpay (pay-as-you-go) buys nothing up front.
  const sessionRate = isCustom ? customRate : blockRate;
  const hasBundle = usesNetwork && prepay && bundleSessions > 0;

  const seatsMonthly = seats * seatRate; // recurring
  const bundleDueNow = hasBundle ? bundleSessions * sessionRate : 0; // one-off

  const submit = async () => {
    setError(null);

    try {
      await saveSeats({
        seats_licensed: seats,
        therapist_access: usesNetwork,
        payment_timing: usesNetwork ? o.paymentTiming : "prepay",
        bundle_sessions: usesNetwork && prepay ? bundleSessions : 0,
        bundle_custom: usesNetwork && prepay && isCustom,
      }).unwrap();
      navigate(V2.businessPlan);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  return (
    <>
      <StepEyebrow>STEP 3 OF 4 · SEATS</StepEyebrow>
      <ScreenTitle>How many employees will you onboard?</ScreenTitle>
      <ScreenLead className="mb-6">
        Your per-seat price is set the moment you choose a seat count — nothing else
        in setup is priced until this is locked in.
      </ScreenLead>

      {/* Seat stepper */}
      <div className="mb-4 rounded-ds-lg border-[1.5px] border-ink-200 bg-white p-5">
        <label className="mb-2.5 block text-caption font-boldNunito text-ink-600">
          Number of seats
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Decrease seats"
            onClick={() => o.set({ seatsCount: String(Math.max(1, seats - 10)) })}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border-[1.5px] border-ink-200 bg-surface-page text-[19px] font-boldNunito text-ink-600"
          >
            −
          </button>
          <input
            type="number"
            min="1"
            value={o.seatsCount}
            onChange={(e) => o.set({ seatsCount: e.target.value })}
            aria-label="Number of seats"
            className="h-12 min-w-0 flex-1 rounded-ds-md border-[1.5px] border-brand-400 bg-white px-4 text-center text-h4 font-extraboldNunito text-navy-800 shadow-focus-brand"
          />
          <button
            type="button"
            aria-label="Increase seats"
            onClick={() => o.set({ seatsCount: String(seats + 10) })}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border-[1.5px] border-ink-200 bg-surface-page text-[19px] font-boldNunito text-ink-600"
          >
            +
          </button>
        </div>
      </div>

      {/* Volume tiers */}
      <div className="mb-4 rounded-[14px] bg-ink-50 p-4">
        <div className="mb-2.5 text-caption font-boldNunito text-navy-800">
          Volume pricing tier
        </div>
        <div className="flex flex-col gap-1.5">
          {tiers.map((tier) => {
            const isCurrent =
              !seatsInvalid && seats >= tier.min && (tier.max === null || seats <= tier.max);
            return (
              <div
                key={tier.min}
                className={classNames(
                  "flex items-center rounded-[9px] border px-3 py-[9px]",
                  isCurrent ? "border-[#C9E2F9] bg-brand-25" : "border-ink-100 bg-[#FAFAFA]"
                )}
              >
                <span className="flex-1 text-[12.5px] font-semiboldNunito text-ink-800">
                  {tier.max === null
                    ? `${tier.min.toLocaleString()}+ seats`
                    : `${tier.min}–${tier.max} seats`}
                </span>
                <span className="text-[12.5px] font-boldNunito text-navy-800">
                  {naira(tier.price)}/seat
                </span>
                {isCurrent ? (
                  <span className="ml-2.5 rounded-full bg-brand-400 px-2 py-[3px] text-[9px] font-extraboldNunito text-white">
                    YOUR TIER
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Use TalkAM's therapist network */}
      <div className="mb-4 rounded-ds-lg border-[1.5px] border-[#C9E2F9] bg-white p-[18px]">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="text-body font-extraboldNunito text-navy-800">
                Use TalkAM&apos;s therapist network
              </span>
              <span className="rounded-full bg-wellness-50 px-2 py-[3px] text-[9px] font-extraboldNunito tracking-[0.04em] text-wellness-600">
                RECOMMENDED
              </span>
            </div>
            <p className="text-caption leading-[1.55] text-ink-500">
              Free to enable — your employees can book TalkAM-verified therapists. You
              only pay for the sessions they actually use.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={usesNetwork}
            aria-label="Use TalkAM's therapist network"
            onClick={() => o.set({ therapistAccessOn: !usesNetwork })}
            className={classNames(
              "relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors",
              usesNetwork ? "bg-wellness-400" : "bg-ink-200"
            )}
          >
            <span
              className={classNames(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.15)] transition-all",
                usesNetwork ? "left-[22px]" : "left-0.5"
              )}
            />
          </button>
        </div>

        {usesNetwork ? (
          <div className="mt-4 border-t border-ink-100 pt-4">
            {/* Prepay vs pay-as-you-go */}
            <div className="mb-1 text-caption font-boldNunito text-navy-800">
              How do you want to pay for sessions?
            </div>
            <p className="mb-3 text-[11.5px] leading-[1.5] text-ink-400">
              Prepay a bundle up front (cheaper per session), or pay as you go and settle
              for what your team uses each month.
            </p>
            <div className="mb-4 flex gap-2.5">
              {[
                { key: "prepay", label: "Prepay a bundle" },
                { key: "postpay", label: "Pay as you go" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => o.set({ paymentTiming: opt.key })}
                  aria-pressed={o.paymentTiming === opt.key}
                  className={classNames(
                    "flex-1 cursor-pointer rounded-[10px] border-[1.5px] p-[11px] text-center text-[12.5px] font-boldNunito",
                    o.paymentTiming === opt.key
                      ? "border-brand-400 bg-brand-25 text-brand-600"
                      : "border-ink-200 bg-white text-ink-500"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {prepay ? (
              <>
                <div className="mb-1 text-caption font-boldNunito text-navy-800">
                  Pre-purchase a Session Bundle
                </div>
                <p className="mb-3.5 text-[11.5px] leading-[1.5] text-ink-400">
                  Sessions are {naira(blockRate)} each, drawn down as they happen. Buy in
                  blocks:
                </p>

                <div className="flex gap-2.5">
                  {bundleOptions.map((opt) => {
                    const active = o.bundleKey === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => o.set({ bundleKey: opt.key, customBundle: "" })}
                        className={classNames(
                          "relative flex-1 cursor-pointer rounded-ds-md border-[1.5px] px-2.5 py-3.5 text-center",
                          active ? "border-brand-400 bg-brand-25" : "border-ink-200 bg-white"
                        )}
                      >
                        {opt.tag ? (
                          <span className="absolute -top-[9px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-400 px-[9px] py-[3px] text-[9px] font-extraboldNunito tracking-[0.04em] text-white">
                            {opt.tag}
                          </span>
                        ) : null}
                        <div className="text-h3 font-extraboldNunito text-navy-800">
                          {opt.sessions}
                        </div>
                        <div className="mb-[5px] text-[10.5px] text-ink-400">sessions</div>
                        <div className="text-caption font-extraboldNunito text-brand-400">
                          {naira(opt.sessions * blockRate)}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div
                  className={classNames(
                    "mt-2.5 rounded-ds-md border-[1.5px] px-3.5 py-3",
                    isCustom ? "border-brand-400 bg-brand-25" : "border-ink-200 bg-white"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="mb-0.5 text-[12.5px] font-extraboldNunito text-navy-800">
                        Custom amount
                      </div>
                      <p className="text-[11px] text-ink-400">
                        A specific number instead of a block — priced at {naira(customRate)}
                        /session.
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        placeholder="e.g. 18"
                        aria-label="Custom session count"
                        value={isCustom ? o.customBundle : ""}
                        onChange={(e) =>
                          o.set({ customBundle: e.target.value, bundleKey: "custom" })
                        }
                        className="h-10 w-[88px] rounded-[10px] border-[1.5px] border-ink-200 px-3 text-center text-body font-boldNunito text-navy-800"
                      />
                      <span className="text-[11px] text-ink-400">sessions</span>
                    </div>
                  </div>
                  {isCustom ? (
                    <div className="mt-3 flex items-center justify-between border-t border-[#C9E2F9] pt-3">
                      <span className="text-[11.5px] text-ink-500">
                        {bundleSessions} × {naira(customRate)}
                      </span>
                      <span className="text-body font-extraboldNunito text-brand-400">
                        {naira(bundleSessions * customRate)}
                      </span>
                    </div>
                  ) : null}
                </div>
              </>
            ) : (
              <div className="rounded-ds-md border-[1.5px] border-ink-200 bg-ink-50 px-4 py-3.5">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-[12.5px] font-extraboldNunito text-navy-800">
                    Pay as you go
                  </span>
                  <span className="rounded-full bg-brand-25 px-2 py-[2px] text-[9px] font-extraboldNunito tracking-[0.04em] text-brand-600">
                    NO UPFRONT COST
                  </span>
                </div>
                <p className="text-[11.5px] leading-[1.55] text-ink-500">
                  No bundle to buy now. Sessions are billed at {naira(customRate)} each,
                  totalled on your monthly invoice — you only pay for what your team
                  actually uses.
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Cost summary */}
      <div className="mb-5 rounded-ds-lg bg-navy-800 px-5 py-[18px]">
        <div className="mb-3 text-[11px] font-boldNunito tracking-[0.06em] text-white/50">
          YOUR PLAN
        </div>
        <div className="flex flex-col gap-[9px]">
          <div className="flex justify-between gap-3">
            <span className="text-[12.5px] text-white/65">
              Employee seats · {seats} × {naira(seatRate)}
            </span>
            <span className="text-[13px] font-boldNunito text-white">
              {naira(seatsMonthly)}/mo
            </span>
          </div>
          {usesNetwork && prepay && hasBundle ? (
            <div className="flex justify-between gap-3">
              <span className="text-[12.5px] text-white/65">
                Session bundle · {bundleSessions} × {naira(sessionRate)}
              </span>
              <span className="text-[13px] font-boldNunito text-white">
                {naira(bundleDueNow)} once
              </span>
            </div>
          ) : null}
          {usesNetwork && !prepay ? (
            <div className="flex justify-between gap-3">
              <span className="text-[12.5px] text-white/65">
                Sessions · as used, {naira(customRate)} each
              </span>
              <span className="text-[13px] font-boldNunito text-white/80">metered</span>
            </div>
          ) : null}

          {prepay ? (
            <>
              <div className="flex items-center justify-between gap-3 border-t border-white/[0.14] pt-[11px]">
                <span className="text-[13px] font-extraboldNunito text-white">Your first bill</span>
                <span className="text-[22px] font-extraboldNunito text-white">
                  {naira(seatsMonthly + bundleDueNow)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[12px] text-white/55">Then monthly · seats</span>
                <span className="text-[13px] font-boldNunito text-white/80">
                  {naira(seatsMonthly)}
                </span>
              </div>
              <p className="pt-0.5 text-[10.5px] leading-[1.45] text-white/40">
                Seats + bundle. Charged now if you pay by card, or on your first invoice
                (net terms) if you pay by transfer — you choose on the next step.
              </p>
            </>
          ) : (
            <div className="flex items-center justify-between gap-3 border-t border-white/[0.14] pt-[11px]">
              <span className="text-[13px] font-extraboldNunito text-white">Seats / month</span>
              <span className="text-[22px] font-extraboldNunito text-white">
                {naira(seatsMonthly)}
              </span>
            </div>
          )}
        </div>
      </div>

      <FormError>{error}</FormError>

      <AuthButton disabled={seatsInvalid || isLoading} onClick={submit}>
        {isLoading ? "Saving…" : `Continue with ${o.seatsCount} Seats →`}
      </AuthButton>
    </>
  );
};

/* ── 4. PLAN & BILLING ─────────────────────────────────────────────────── */
export const PlanBilling = () => {
  const navigate = useNavigate();
  const o = useOnboarding();
  usePageMeta("Your plan & billing — TalkAM for Business");

  const { data: pricing } = useGetPricingConfigQuery();
  const { data: org } = useGetOrganizationQuery();
  const [savePlan, { isLoading }] = useSavePlanMutation();
  const [checkoutPlan, { isLoading: isCheckingOut }] = useCheckoutPlanMutation();
  const [cardSetup, { isLoading: isSavingCard }] = useCardSetupMutation();
  const [error, setError] = useState(null);
  const [checkout, setCheckout] = useState(null);

  // Flutterwave inline checkout for the prepay + "Pay by card" path. The hook is
  // set up at the top level (rules of hooks); we trigger the modal from an effect
  // once the backend hands back a checkout, mirroring the consumer flow.
  const savingCard = checkout?.mode === "card"; // postpay card-on-file, not a bundle charge
  const flwConfig = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_KEY,
    tx_ref: checkout?.reference ?? "",
    amount: checkout?.amount ?? 0,
    currency: checkout?.currency ?? "NGN",
    payment_options: savingCard ? "card" : "card,mobilemoney,ussd",
    customer: {
      email: checkout?.customer?.email ?? "",
      name: checkout?.customer?.name ?? "",
    },
    customizations: {
      title: "TalkAM for Business",
      description: savingCard
        ? "Save your card — a small refundable hold verifies it (not charged)"
        : "Session bundle — charged now so sessions are ready immediately",
    },
    meta: { ...(checkout?.meta ?? {}) },
  };
  const handleFlutterPayment = useFlutterwave(flwConfig);

  useEffect(() => {
    if (!checkout) return;
    handleFlutterPayment({
      callback: () => {
        closePaymentModal();
        navigate(V2.businessTherapistBench, { replace: true });
      },
      onClose: () => {
        // The card window was dismissed — let them continue; the bundle can be
        // paid later from the dashboard.
        navigate(V2.businessTherapistBench, { replace: true });
      },
    });
    setCheckout(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkout]);

  const quote = org?.quote;
  const seats = quote?.seats ?? 0;
  const seatRate = quote?.rates?.seat ?? 0;
  const perSeat = quote?.plan?.per_seat ?? seatRate;
  const seatsMonthly = quote?.seats_monthly ?? 0;
  const usesNetwork = quote?.uses_network ?? false;
  const prepay = (quote?.payment_timing ?? "prepay") !== "postpay";
  const bundleSessions = quote?.bundle_sessions ?? 0;
  const bundleRate = quote?.rates?.session_applied ?? 0;
  const bundleTotal = quote?.bundle_total ?? 0;
  const dueAtSignup = prepay ? seatsMonthly + bundleTotal : 0; // first month (seats) + prepaid bundle
  const meteredRate = quote?.rates?.metered_session ?? 0;
  const meteredSessions = quote?.metered_sessions ?? false;
  const planName = quote?.plan?.name ?? pricing?.plan?.name ?? "";
  const planFeatures = quote?.plan?.features ?? pricing?.plan?.features ?? [];
  // §11: when dedicated virtual accounts are live, bank-transfer orgs get their own
  // auto-reconciling account from the billing dashboard — so we no longer show a
  // shared account to pay into here at signup.
  const vaEnabled = pricing?.virtual_accounts_enabled ?? false;

  // Prepay + card charges the session bundle now; postpay + card saves the card
  // for month-end (a small refundable hold, nothing charged). Both need Flutterwave.
  const cardChargesNow = o.payMethod === "card" && prepay && dueAtSignup > 0;
  const cardSavesNow = o.payMethod === "card" && !prepay;
  const cardUnavailable = (cardChargesNow || cardSavesNow) && !import.meta.env.VITE_FLUTTERWAVE_KEY;

  // Bank-transfer copy (web §11) — only shown when dedicated accounts are live.
  // Prepay activates on payment (never on trust).
  const transferNote = prepay
    ? "No card? Set up your company's own dedicated account (a quick verification) from your billing dashboard, then transfer your first bill there — your session bundle activates automatically once it lands. Nothing is charged today."
    : "No card? Set up your company's own dedicated account from your billing dashboard; your monthly invoices reconcile against it automatically. Nothing is charged today.";

  // Card is the only rail until dedicated bank transfer (§11) is enabled — never
  // leave the picker on a bank-transfer choice that isn't shown.
  useEffect(() => {
    if (!vaEnabled && o.payMethod !== "card") o.set({ payMethod: "card" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaEnabled]);

  const proceed = async (persist) => {
    setError(null);

    if (!persist) {
      navigate(V2.businessTherapistBench);
      return;
    }

    try {
      await savePlan({ pay_method: o.payMethod, payment_timing: o.paymentTiming }).unwrap();

      // Card: prepay charges the session bundle now; postpay saves the card for
      // month-end (a small refundable hold). Either way the effect opens the
      // Flutterwave modal; amount 0 falls through (e.g. prepay with no bundle).
      if (o.payMethod === "card") {
        // Bail before starting a checkout if we can't open Flutterwave — otherwise
        // we'd leave an orphan pending payment behind.
        if (!import.meta.env.VITE_FLUTTERWAVE_KEY) {
          setError(
            "Card payments aren't available yet. Choose Invoice / bank transfer, or skip and add billing later from the dashboard."
          );
          return;
        }

        const result = prepay
          ? await checkoutPlan().unwrap()
          : await cardSetup().unwrap();

        if (result?.amount > 0 && result?.reference) {
          setCheckout({ ...result, mode: prepay ? "bundle" : "card" });
          return;
        }
      }

      navigate(V2.businessTherapistBench);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  return (
    <>
      <StepEyebrow>STEP 4 OF 4 · PLAN &amp; BILLING</StepEyebrow>
      <ScreenTitle>Your plan, priced fairly</ScreenTitle>
      <ScreenLead className="mb-5">
        One plan in Phase 1 — built to be simple to approve and easy to explain to
        your board.
      </ScreenLead>

      <div className="relative mb-4 overflow-hidden rounded-[18px] border-2 border-brand-400 bg-white p-[26px] shadow-[0_8px_28px_rgba(1,127,200,0.12)]">
        <span className="absolute right-4 top-4 rounded-full bg-brand-25 px-2.5 py-1 text-[10px] font-extraboldNunito tracking-[0.05em] text-brand-600">
          {seats} SEATS
        </span>
        <div className="mb-1.5 text-caption font-boldNunito tracking-[0.04em] text-brand-400">
          {planName.toUpperCase()}
        </div>
        <div className="mb-1 flex items-baseline gap-1.5">
          <span className="text-display font-extraboldNunito text-navy-800">
            {naira(perSeat)}
          </span>
          <span className="text-[13px] text-ink-400">/ employee / month</span>
        </div>
        <p className="mb-[18px] text-caption text-ink-400">
          {naira(seatsMonthly)} total/month · billed monthly
        </p>

        <div className="mb-[18px] flex flex-col gap-2.5">
          {planFeatures.map((feature) => (
            <div key={feature} className="flex items-center gap-2.5">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3BA88F" strokeWidth="2.5" strokeLinecap="round" className="shrink-0">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-[13px] text-ink-800">{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 rounded-ds-md bg-ink-50 p-3.5">
          <div className="text-[11px] font-boldNunito tracking-[0.04em] text-navy-800">
            WHAT YOU&apos;RE SETTING UP
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-caption text-ink-500">
              Employee seats · {seats} × {naira(seatRate)}
            </span>
            <span className="text-caption font-boldNunito text-navy-800">
              {naira(seatsMonthly)}/mo
            </span>
          </div>
          {usesNetwork && prepay && bundleSessions > 0 ? (
            <div className="flex justify-between gap-3">
              <span className="text-caption text-ink-500">
                Session bundle · {bundleSessions} × {naira(bundleRate)}
              </span>
              <span className="text-caption font-boldNunito text-navy-800">
                {naira(bundleTotal)} once
              </span>
            </div>
          ) : null}
          {usesNetwork && meteredSessions ? (
            <div className="flex justify-between gap-3">
              <span className="text-caption text-ink-500">Sessions · pay-as-you-go</span>
              <span className="text-caption font-boldNunito text-navy-800">
                {naira(meteredRate)}/session
              </span>
            </div>
          ) : null}
          <div className="flex flex-col gap-1.5 border-t border-surface-line pt-2">
            {prepay && dueAtSignup > 0 ? (
              <>
                <div className="flex justify-between gap-3">
                  <span className="text-caption font-boldNunito text-navy-800">
                    {o.payMethod === "card" ? "Due today" : "On your first invoice"}
                  </span>
                  <span className="text-[13px] font-extraboldNunito text-brand-400">
                    {naira(dueAtSignup)}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-caption text-ink-500">Then monthly (seats)</span>
                  <span className="text-caption font-boldNunito text-navy-800">
                    {naira(seatsMonthly)}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex justify-between gap-3">
                <span className="text-caption font-boldNunito text-navy-800">Billed monthly</span>
                <span className="text-[13px] font-extraboldNunito text-brand-400">
                  {naira(seatsMonthly)}
                </span>
              </div>
            )}
          </div>
          <p className="text-[11px] leading-[1.6] text-ink-400">
            Your seat price is the {naira(seatRate)} volume-tier rate for {seats} seats —
            the facilitation fee for connecting your team with therapists. No hidden
            multipliers.
          </p>
        </div>
      </div>

      {/* Payment method */}
      <div className="mb-[18px] rounded-ds-lg border-[1.5px] border-ink-200 bg-white p-5">
        <div className="mb-1 text-[13px] font-extraboldNunito text-navy-800">
          How would you like to pay?
        </div>
        <p className="mb-3.5 text-caption text-ink-400">
          {!vaEnabled
            ? "Pay by card to set up instantly — or skip below and add billing later."
            : prepay
              ? "Most teams pay by invoice. Smaller teams can pay by card for instant setup."
              : "Your seats are billed monthly; pay-as-you-go sessions are settled each month-end — by net-terms invoice or auto-charged to a card."}
        </p>

        {/* Bank transfer (dedicated account) is only offered when §11 is enabled;
            until then card is the only rail and the toggle is hidden entirely. */}
        {vaEnabled ? (
          <div className="mb-4 flex gap-2.5">
            {[
              { key: "invoice", label: "Invoice / bank transfer" },
              { key: "card", label: "Pay by card" },
            ].map((method) => (
              <button
                key={method.key}
                type="button"
                onClick={() => o.set({ payMethod: method.key })}
                aria-pressed={o.payMethod === method.key}
                className={classNames(
                  "flex-1 cursor-pointer rounded-[10px] border-[1.5px] p-[11px] text-center text-[12.5px] font-boldNunito",
                  o.payMethod === method.key
                    ? "border-brand-400 bg-brand-25 text-brand-600"
                    : "border-ink-200 bg-white text-ink-500"
                )}
              >
                {method.label}
              </button>
            ))}
          </div>
        ) : null}

        {vaEnabled && o.payMethod === "invoice" ? (
          <div className="rounded-ds-md bg-ink-50 p-3.5 text-caption leading-[1.7] text-ink-600">
            {transferNote}
          </div>
        ) : (
          <>
            <div className="mb-3 flex items-center gap-2.5 rounded-ds-md border border-[#EEF0F4] bg-ink-50 px-4 py-3">
              <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] bg-[#FF9B00]">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2">
                  <rect x="1" y="4" width="22" height="16" rx="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </span>
              <div className="flex-1">
                <div className="text-[12.5px] font-extraboldNunito text-navy-800">
                  Secured by Flutterwave
                </div>
                <p className="text-[11px] leading-[1.5] text-ink-500">
                  You&apos;ll be taken to Flutterwave&apos;s secure checkout to enter your
                  card — TalkAM never sees or stores your card details.
                </p>
              </div>
            </div>
            <p className="text-[11px] leading-[1.6] text-ink-400">
              {prepay
                ? "Your first month — seats plus the session bundle — is charged now via Flutterwave, so sessions are ready immediately. From next month, seats are billed to the same card. Best for smaller teams who'd rather not wait on an invoice."
                : "Your seats are billed monthly to this card — a fixed charge for your licensed capacity — and the sessions your team uses are added at each month-end. You only pay for the sessions actually used. We verify your card now with a small refundable hold; nothing is charged today."}
            </p>
          </>
        )}
      </div>

      <FormError>{error}</FormError>

      {cardUnavailable ? (
        <p className="mb-2.5 rounded-ds-md bg-[#FEF2F2] px-3.5 py-2.5 text-[12px] leading-[1.5] text-[#B42318]">
          Card payments aren&apos;t available yet — choose Invoice / bank transfer,
          or skip and add billing later from the dashboard.
        </p>
      ) : null}

      <AuthButton
        tone="brand"
        disabled={isLoading || isCheckingOut || isSavingCard || cardUnavailable}
        className="mb-2.5"
        onClick={() => proceed(true)}
      >
        {isCheckingOut || isSavingCard
          ? "Opening checkout…"
          : isLoading
            ? "Saving…"
            : cardChargesNow
              ? `Pay ${naira(dueAtSignup)} with Flutterwave →`
              : cardSavesNow
                ? "Save card & Continue →"
                : "Confirm Plan & Continue →"}
      </AuthButton>
      <button
        type="button"
        onClick={() => proceed(false)}
        className="w-full cursor-pointer text-center text-caption text-ink-400"
      >
        Skip billing setup for now — I&apos;ll add this later from the dashboard
      </button>
    </>
  );
};

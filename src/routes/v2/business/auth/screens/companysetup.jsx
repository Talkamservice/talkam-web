import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import classNames from "classnames";
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
  useGetPricingConfigQuery,
  useGetOrganizationQuery,
  useRegisterCompanyMutation,
  useVerifyDomainMutation,
  useSaveSeatsMutation,
  useSavePlanMutation,
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
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    company_name: "",
    work_email: "",
    industry: "Banking & Finance",
    headcount_band: "100 – 300",
    password: "",
  });

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

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
              <option>Banking &amp; Finance</option>
              <option>Technology</option>
              <option>Professional Services</option>
              <option>Manufacturing</option>
            </select>
          </Field>
          <Field label="Headcount">
            <select
              className={authInputClass()}
              value={form.headcount_band}
              onChange={set("headcount_band")}
            >
              <option>50 – 100</option>
              <option>100 – 300</option>
              <option>300 – 500</option>
              <option>500+</option>
            </select>
          </Field>
        </div>

        <Field label="Create password" hint="Min. 8 characters, at least 1 number">
          <input
            type="password"
            required
            value={form.password}
            onChange={set("password")}
            className={authInputClass()}
          />
        </Field>

        <AuthButton type="submit" disabled={isLoading} className="mt-1.5">
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
  usePageMeta("Confirm your business domain — TalkAM for Business");

  const { data: org } = useGetOrganizationQuery();
  const [verifyDomain, { isLoading }] = useVerifyDomainMutation();
  const [requestOtp, { isLoading: isResending }] = useRequestOtpV2Mutation();

  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [resent, setResent] = useState(false);

  const organization = org?.organization;
  const email = o.pendingEmail || organization?.hr_contact_email || "your work email";
  const companyName = organization?.name || "your company";
  const domain = organization?.domain || "your domain";

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
      <StepEyebrow>STEP 2 OF 4 · VERIFY DOMAIN</StepEyebrow>
      <ScreenTitle>Confirm your business domain</ScreenTitle>
      <ScreenLead className="mb-6">
        We&apos;ve sent a 6-digit code to{" "}
        <strong className="text-navy-800">{email}</strong>. This
        confirms {companyName} owns{" "}
        <strong className="text-navy-800">{domain}</strong> before any
        employee can join.
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
        Domain verification prevents anyone from creating a company account with an
        address they don&apos;t control. Codes expire in 15 minutes.
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
  const empRate = pricing?.employee_seat_rate ?? 0;
  const therapistRate = pricing?.therapist_access_rate ?? 0;
  const sessionRate = pricing?.session_rate ?? 0;

  // Seed the stepper from what the company already saved, once.
  const savedSeats = org?.organization?.seats_licensed;
  useEffect(() => {
    if (savedSeats) o.set({ seatsCount: String(savedSeats) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedSeats]);

  const seats = parseInt(o.seatsCount, 10) || 0;
  const seatsInvalid = seats <= 0;

  const bundleSessions =
    o.bundleKey === "custom"
      ? Math.max(parseInt(o.customBundle, 10) || 0, 0)
      : parseInt(o.bundleKey, 10) || 0;

  const empSeatMonthly = seats * empRate;
  const therapistMonthly = o.therapistAccessOn ? seats * therapistRate : 0;
  const bundleMonthly = o.therapistAccessOn ? bundleSessions * sessionRate : 0;
  const grandTotal = empSeatMonthly + therapistMonthly + bundleMonthly;

  const submit = async () => {
    setError(null);

    try {
      await saveSeats({
        seats_licensed: seats,
        therapist_access: o.therapistAccessOn,
        bundle_sessions: bundleSessions,
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

      {/* Therapist network access */}
      <div className="mb-4 rounded-ds-lg border-[1.5px] border-[#C9E2F9] bg-white p-[18px]">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="text-body font-extraboldNunito text-navy-800">
                Therapist Network Access
              </span>
              <span className="rounded-full bg-wellness-50 px-2 py-[3px] text-[9px] font-extraboldNunito tracking-[0.04em] text-wellness-600">
                RECOMMENDED
              </span>
            </div>
            <p className="text-caption leading-[1.55] text-ink-500">
              {naira(therapistRate)} / seat / month — flat, per employee seat. Unlocks
              TalkAM-verified therapists for your team.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={o.therapistAccessOn}
            aria-label="Therapist Network Access"
            onClick={() => o.set({ therapistAccessOn: !o.therapistAccessOn })}
            className={classNames(
              "relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors",
              o.therapistAccessOn ? "bg-wellness-400" : "bg-ink-200"
            )}
          >
            <span
              className={classNames(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.15)] transition-all",
                o.therapistAccessOn ? "left-[22px]" : "left-0.5"
              )}
            />
          </button>
        </div>

        {o.therapistAccessOn ? (
          <div className="mt-4 border-t border-ink-100 pt-4">
            <div className="mb-1 text-caption font-boldNunito text-navy-800">
              Pre-purchase a Session Bundle
            </div>
            <p className="mb-3.5 text-[11.5px] leading-[1.5] text-ink-400">
              Sessions are {naira(sessionRate)} each, drawn down as they happen. Buy in
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
                      {naira(opt.sessions * sessionRate)}
                    </div>
                  </button>
                );
              })}
            </div>

            <div
              className={classNames(
                "mt-2.5 rounded-ds-md border-[1.5px] px-3.5 py-3",
                o.bundleKey === "custom"
                  ? "border-brand-400 bg-brand-25"
                  : "border-ink-200 bg-white"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="mb-0.5 text-[12.5px] font-extraboldNunito text-navy-800">
                    Custom amount
                  </div>
                  <p className="text-[11px] text-ink-400">
                    Not one of the blocks above? Enter the exact number of sessions your
                    team needs.
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 18"
                    aria-label="Custom session count"
                    value={o.bundleKey === "custom" ? o.customBundle : ""}
                    onChange={(e) =>
                      o.set({ customBundle: e.target.value, bundleKey: "custom" })
                    }
                    className="h-10 w-[88px] rounded-[10px] border-[1.5px] border-ink-200 px-3 text-center text-body font-boldNunito text-navy-800"
                  />
                  <span className="text-[11px] text-ink-400">sessions</span>
                </div>
              </div>
              {o.bundleKey === "custom" ? (
                <div className="mt-3 flex items-center justify-between border-t border-[#C9E2F9] pt-3">
                  <span className="text-[11.5px] text-ink-500">
                    {bundleSessions} × {naira(sessionRate)}
                  </span>
                  <span className="text-body font-extraboldNunito text-brand-400">
                    {naira(bundleSessions * sessionRate)}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {/* Monthly total */}
      <div className="mb-5 rounded-ds-lg bg-navy-800 px-5 py-[18px]">
        <div className="mb-3 text-[11px] font-boldNunito tracking-[0.06em] text-white/50">
          MONTHLY TOTAL
        </div>
        <div className="flex flex-col gap-[9px]">
          <div className="flex justify-between gap-3">
            <span className="text-[12.5px] text-white/65">
              Employee Seats · {seats} × {naira(empRate)}
            </span>
            <span className="text-[13px] font-boldNunito text-white">
              {naira(empSeatMonthly)}
            </span>
          </div>
          {o.therapistAccessOn ? (
            <>
              <div className="flex justify-between gap-3">
                <span className="text-[12.5px] text-white/65">
                  Therapist Network Access · {seats} × {naira(therapistRate)}
                </span>
                <span className="text-[13px] font-boldNunito text-white">
                  {naira(therapistMonthly)}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-[12.5px] text-white/65">
                  Session Bundle · {bundleSessions} × {naira(sessionRate)}
                </span>
                <span className="text-[13px] font-boldNunito text-white">
                  {naira(bundleMonthly)}
                </span>
              </div>
            </>
          ) : null}
          <div className="flex items-center justify-between gap-3 border-t border-white/[0.14] pt-[11px]">
            <span className="text-[13px] font-extraboldNunito text-white">Total / month</span>
            <span className="text-[22px] font-extraboldNunito text-white">
              {naira(grandTotal)}
            </span>
          </div>
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
  const [error, setError] = useState(null);

  const quote = org?.quote;
  const blended = quote?.blended;
  const seats = quote?.seats ?? 0;
  const tierPrice = quote?.tier?.price ?? 0;
  const fairness = blended?.fairness_multiplier ?? 1;
  const perSeat = blended?.per_seat ?? 0;
  const planName = pricing?.plan?.name ?? "";
  const planFeatures = pricing?.plan?.features ?? [];
  const bank = pricing?.bank_details ?? {};

  const proceed = async (persist) => {
    setError(null);

    if (!persist) {
      navigate(V2.businessTherapistBench);
      return;
    }

    try {
      await savePlan({ pay_method: o.payMethod }).unwrap();
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
          {naira(blended?.total_monthly)} total/month · billed monthly
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
            HOW THIS PRICE IS CALCULATED
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-caption text-ink-500">Seat tier rate ({seats} seats)</span>
            <span className="text-caption font-boldNunito text-navy-800">
              {naira(tierPrice)}/seat
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-caption text-ink-500">
              Therapist rate fairness adjustment
            </span>
            <span className="text-caption font-boldNunito text-navy-800">
              {Number(fairness).toFixed(2)}x (balanced)
            </span>
          </div>
          <div className="flex justify-between gap-3 border-t border-surface-line pt-2">
            <span className="text-caption font-boldNunito text-navy-800">
              Final rate per seat
            </span>
            <span className="text-[13px] font-extraboldNunito text-brand-400">
              {naira(perSeat)}
            </span>
          </div>
          <p className="text-[11px] leading-[1.6] text-ink-400">
            We blend your seat-count tier with a network-wide average therapist session
            rate, so pricing never overvalues cheap sessions or undervalues expensive
            specialists — the same balance applies whichever therapists your employees
            choose.
          </p>
        </div>
      </div>

      {/* Payment method */}
      <div className="mb-[18px] rounded-ds-lg border-[1.5px] border-ink-200 bg-white p-5">
        <div className="mb-1 text-[13px] font-extraboldNunito text-navy-800">
          How would you like to pay?
        </div>
        <p className="mb-3.5 text-caption text-ink-400">
          Most teams pay by invoice. Smaller teams can pay by card for instant setup.
        </p>

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

        {o.payMethod === "invoice" ? (
          <>
            <div className="mb-3.5 rounded-ds-md bg-ink-50 p-3.5 text-caption leading-[1.8] text-ink-600">
              <strong className="font-boldNunito">{bank.company}</strong> · Bank Transfer
              <br />
              Account Name: {bank.account_name}
              <br />
              Bank: {bank.bank} · Account No: {bank.account_number}
            </div>
            <p className="text-[11px] leading-[1.6] text-ink-400">
              Seats are invoiced monthly once your first employee activates — not
              before. Your Session Bundle is reserved now and added to that first
              invoice; sessions are available immediately and drawn down as they
              happen. Suits NGOs, schools, firms and enterprises paying on net terms.
            </p>
          </>
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
                  You&apos;ll be taken to Flutterwave&apos;s secure checkout to enter
                  your card — TalkAM never sees or stores your card details.
                </p>
              </div>
            </div>
            <p className="text-[11px] leading-[1.6] text-ink-400">
              Your Session Bundle is charged now via Flutterwave so sessions are
              available immediately; seats are billed to the same card monthly. Best
              for small teams who&apos;d rather not wait on an invoice.
            </p>
          </>
        )}
      </div>

      <FormError>{error}</FormError>

      <AuthButton
        tone="brand"
        disabled={isLoading}
        className="mb-2.5"
        onClick={() => proceed(true)}
      >
        {isLoading
          ? "Saving…"
          : o.payMethod === "card"
            ? "Continue to Flutterwave →"
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

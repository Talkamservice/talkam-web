import {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useId,
  useMemo,
  useState,
} from "react";
import { Outlet, Link, useLocation, useSearchParams } from "react-router-dom";
import classNames from "classnames";
import TalkamIcon from "../../../../assets/svgs/talkam-icon.svg";
import TalkamWordmark from "../../../../assets/svgs/talkam-logo.svg";
import { V2_ROOT } from "../../../../constants/v2routes";
import { authBrandContent, AUTH_SCREENS } from "../../../../constants/businessauth";

/**
 * B2B auth & onboarding shell.
 * Spec: "TalkAM B2B Auth.dc.html" — dark brand panel (38%) on the left, a
 * 460px form column on the right.
 *
 * The deck is one stateful demo with a tab switcher across the top. That
 * switcher is a design-tool affordance, so each screen here is a real route
 * instead. Append `?screens=1` to any auth URL to bring the switcher back for
 * review — it never renders otherwise.
 */

const OnboardingContext = createContext(null);

/** Shared wizard state — the in-flight choices that span more than one screen
 *  (seat count before it is saved, the email a 2FA code was sent to, the
 *  invite token being accepted). Persisted state lives on the server and is
 *  read back through RTK Query; this only holds what is still being typed. */
export const useOnboarding = () => {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used inside AuthLayout");
  return ctx;
};

const INITIAL = {
  seatsCount: "250",
  therapistAccessOn: true,
  bundleKey: "25",
  customBundle: "",
  payMethod: "invoice",
  benchTopics: [],
  csvErrored: false,
  csvErrorName: "",
  inviteRows: [],
  invitesSent: null,
  pendingEmail: "",
  intendedRole: null,
  selectedTopics: [],
  assessment: { work: null, anxiety: null, sleep: null, relationships: null },
  landingRole: "employee",
  twoFaRole: "admin",
};

/**
 * Pulls a human message out of an RTK Query error. The API answers with
 * `{message, errors: {field: [msg]}}` — the first field error is the most
 * useful thing to show, falling back to the envelope message.
 */
export const apiErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  const body = error?.data;
  if (!body) return fallback;

  const fieldErrors = body.errors;
  if (fieldErrors && typeof fieldErrors === "object") {
    const first = Object.values(fieldErrors).flat()[0];
    if (first) return first;
  }

  return body.message || fallback;
};

export const AuthLayout = () => {
  const [state, setState] = useState(INITIAL);
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const showSwitcher = searchParams.get("screens") === "1";

  const value = useMemo(
    () => ({
      ...state,
      set: (patch) => setState((prev) => ({ ...prev, ...patch })),
      toggleIn: (key, item) =>
        setState((prev) => ({
          ...prev,
          [key]: prev[key].includes(item)
            ? prev[key].filter((x) => x !== item)
            : [...prev[key], item],
        })),
    }),
    [state]
  );

  const screen =
    AUTH_SCREENS.find((s) => pathname.endsWith(`/${s.path}`))?.id ?? "signup";
  const brand = authBrandContent[screen] ?? authBrandContent.signup;

  return (
    <OnboardingContext.Provider value={value}>
      <div className="flex min-h-dvh flex-col bg-surface-page font-regularNunito leading-[normal]">
        {showSwitcher ? (
          <div className="flex flex-shrink-0 items-center gap-1.5 overflow-x-auto bg-navy-900 px-6 py-2.5">
            <span className="mr-2.5 flex-shrink-0 whitespace-nowrap text-[10px] font-boldNunito tracking-[0.08em] text-white/30">
              AUTH &amp; ONBOARDING —
            </span>
            {AUTH_SCREENS.map((s) => (
              <Link
                key={s.id}
                to={`${V2_ROOT}/business/${s.path}?screens=1`}
                className={classNames(
                  "flex-shrink-0 whitespace-nowrap rounded-full px-3.5 py-[7px] text-caption font-boldNunito",
                  screen === s.id ? "bg-brand-400 text-white" : "text-white/50"
                )}
              >
                {s.label}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          {/* LEFT BRAND PANEL */}
          <aside className="relative flex flex-shrink-0 flex-col overflow-hidden bg-[linear-gradient(160deg,#0A1220_0%,#141B34_55%,#0D2240_100%)] p-8 lg:w-[38%] lg:min-w-[360px] lg:p-11">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-[60px] h-[340px] w-[340px] rounded-full bg-[radial-gradient(circle,rgba(1,127,200,0.16)_0%,transparent_65%)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-[60px] -left-[60px] h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,rgba(59,168,143,0.12)_0%,transparent_65%)]"
            />

            <Link
              to={V2_ROOT}
              className="relative z-[1] mb-8 flex items-center gap-2.5 lg:mb-14"
              aria-label="TalkAM home"
            >
              <img src={TalkamIcon} alt="" className="h-[30px] w-[30px]" />
              <img
                src={TalkamWordmark}
                alt="TalkAM"
                className="h-[17px] w-auto [filter:brightness(0)_invert(1)]"
              />
            </Link>

            <div className="relative z-[1] mb-[22px] inline-flex w-fit items-center gap-2 rounded-full border border-brand-400/[0.28] bg-brand-400/[0.14] px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
              <span className="text-[11px] font-boldNunito tracking-[0.07em] text-brand-200">
                {brand.eyebrow}
              </span>
            </div>

            <h2 className="relative z-[1] mb-3.5 max-w-[360px] text-[24px] font-blackNunito leading-[1.2] text-white lg:text-[30px]">
              {brand.title}
            </h2>
            <p className="relative z-[1] mb-8 max-w-[340px] text-[14px] leading-[1.7] text-white/55 lg:mb-10">
              {brand.body}
            </p>

            <div className="relative z-[1] mt-auto hidden flex-col gap-3.5 lg:flex">
              {brand.points.map((point) => (
                <div key={point} className="flex items-start gap-[11px]">
                  <span className="mt-px flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-ds-sm border border-white/[0.12] bg-white/[0.08]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3BA88F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="text-[13px] leading-[1.6] text-white/70">{point}</span>
                </div>
              ))}
            </div>
          </aside>

          {/* RIGHT FORM AREA */}
          <main className="flex flex-1 justify-center overflow-y-auto px-6 py-10 lg:px-8 lg:py-14">
            <div className="w-full max-w-[460px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </OnboardingContext.Provider>
  );
};

/* ── Small shared bits used by every screen ───────────────────────────────── */

export const StepEyebrow = ({ children }) => (
  <div className="mb-2 text-[11px] font-boldNunito tracking-[0.08em] text-brand-400">
    {children}
  </div>
);

export const ScreenTitle = ({ children }) => (
  <h1 className="mb-1.5 text-[22px] font-extraboldNunito text-navy-800 sm:text-[26px]">
    {children}
  </h1>
);

export const ScreenLead = ({ className, children }) => (
  <p className={classNames("text-[13px] leading-[1.6] text-ink-500", className)}>
    {children}
  </p>
);

/**
 * Labelled control. The label is bound to its input with htmlFor/id (the id is
 * generated and injected into the child) so screen readers and keyboard users
 * get the association WCAG 2.1 AA requires — no visual change.
 */
export const Field = ({ label, labelTone, hint, children }) => {
  const id = useId();
  const control = isValidElement(children)
    ? cloneElement(children, { id: children.props.id ?? id })
    : children;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={isValidElement(children) ? children.props.id ?? id : undefined}
        className={classNames(
          "text-caption font-boldNunito",
          labelTone === "brand" ? "text-brand-400" : "text-ink-600"
        )}
      >
        {label}
      </label>
      {control}
      {hint ? <span className="text-[11px] text-ink-400">{hint}</span> : null}
    </div>
  );
};

/** Deck input style: 48px, 12px radius, 1.5px border. */
export const authInputClass = (focused) =>
  classNames(
    "h-12 w-full rounded-ds-md border-[1.5px] bg-white px-4 text-body text-navy-800",
    "placeholder:text-ink-400 focus:border-brand-400 focus:shadow-focus-brand",
    focused ? "border-brand-400 shadow-focus-brand" : "border-ink-200"
  );

/** Primary navy CTA used across the wizard. */
export const AuthButton = ({ tone = "navy", disabled, className, children, ...props }) => (
  <button
    type="button"
    disabled={disabled}
    className={classNames(
      "h-[50px] w-full rounded-ds-md text-body font-extraboldNunito text-white transition-colors",
      disabled
        ? "cursor-not-allowed bg-surface-muted"
        : tone === "brand"
          ? "cursor-pointer bg-brand-400 hover:bg-brand-600"
          : tone === "therapy"
            ? "cursor-pointer bg-wellness-400 hover:bg-wellness-600"
            : "cursor-pointer bg-navy-800 hover:bg-navy-900",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

/**
 * OTP boxes. Same markup the deck specifies — 52x60 cells, brand border once a
 * digit lands, focus ring on the active cell (index 0 while empty, which is
 * exactly the deck's resting state).
 *
 * Typing is captured by one transparent input stretched over the row rather
 * than six separate fields: it keeps paste, backspace and mobile numeric
 * keyboards working without touching a single visual class.
 */
export const OtpBoxes = ({ value = "", onChange, length = 6, disabled }) => {
  const digits = value.split("");
  const caret = Math.min(digits.length, length - 1);

  return (
    <div className="relative mb-5 flex gap-2.5">
      {Array.from({ length }).map((_, i) => (
        <div
          key={i}
          className={classNames(
            "flex h-[60px] w-[52px] items-center justify-center rounded-ds-md border-[1.5px] text-[22px] font-extraboldNunito",
            i < digits.length
              ? "border-brand-400 bg-white text-navy-800"
              : "border-ink-200 bg-ink-50 text-surface-muted",
            i === caret && "shadow-focus-brand"
          )}
        >
          {i < digits.length ? digits[i] : "_"}
        </div>
      ))}

      {onChange ? (
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          aria-label="Verification code"
          maxLength={length}
          value={value}
          disabled={disabled}
          onChange={(e) =>
            onChange(e.target.value.replace(/\D/g, "").slice(0, length))
          }
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      ) : null}
    </div>
  );
};

/** Tinted information strip (blue by default, purple for the privacy note). */
export const InfoNote = ({ tone = "blue", icon, children }) => (
  <div
    className={classNames(
      "mb-5 flex gap-2.5 rounded-ds-md px-3.5 py-3",
      tone === "purple" ? "bg-[#F5F0FF]" : "bg-brand-25"
    )}
  >
    {icon}
    <span
      className={classNames(
        "text-caption leading-[1.6]",
        tone === "purple" ? "text-[#5A3990]" : "text-brand-600"
      )}
    >
      {children}
    </span>
  </div>
);

/**
 * Inline error strip. Reuses the exact treatment the therapist-bench screen
 * already uses for its "choose your seat count first" warning, so server
 * errors read as part of the same design rather than a new component.
 */
export const FormError = ({ children }) =>
  children ? (
    <div
      role="alert"
      className="mb-5 rounded-ds-md bg-surface-errorTint px-4 py-3.5 text-[12.5px] leading-[1.6] text-surface-errorInk"
    >
      {children}
    </div>
  ) : null;

/**
 * Skeleton line for the brief moment a screen is waiting on its data. Uses the
 * deck's own ink-100 surface so the layout never shifts.
 */
export const SkeletonLine = ({ className }) => (
  <div className={classNames("animate-pulse rounded-ds-sm bg-ink-100", className)} />
);

/**
 * Live password-strength meter for the signup form. The checks mirror the API's
 * password rule (PinConstants::PASSWORD_REGEX): 8–32 chars with an uppercase,
 * lowercase, number and special character. Renders nothing until the user types.
 */
export const PASSWORD_RULES = [
  { key: "length", label: "8–32 characters", test: (v) => v.length >= 8 && v.length <= 32 },
  { key: "upper", label: "Uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { key: "lower", label: "Lowercase letter", test: (v) => /[a-z]/.test(v) },
  { key: "number", label: "Number", test: (v) => /\d/.test(v) },
  { key: "special", label: "Special character (@$!%*?&#)", test: (v) => /[@$!%*?&#]/.test(v) },
];

/** True when a password satisfies every rule — handy for gating submit. */
export const isPasswordValid = (value = "") => PASSWORD_RULES.every((r) => r.test(value));

const STRENGTH_TIERS = [
  { label: "Weak", color: "#C0564E", bar: "bg-[#C0564E]" },
  { label: "Fair", color: "#C79A3B", bar: "bg-[#C79A3B]" },
  { label: "Good", color: "#017FC8", bar: "bg-brand-400" },
  { label: "Strong", color: "#3BA88F", bar: "bg-wellness-400" },
];

export const PasswordStrength = ({ value = "" }) => {
  if (!value) return null;

  const results = PASSWORD_RULES.map((rule) => ({ ...rule, met: rule.test(value) }));
  const met = results.filter((r) => r.met).length;

  // Only an all-rules-met password reads as "Strong" — it is also the point at
  // which submit unlocks, so the label and the gate stay in step. 4 → Good,
  // 3 → Fair, ≤2 → Weak.
  const tier = STRENGTH_TIERS[Math.max(0, Math.min(3, met - 2))];

  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {PASSWORD_RULES.map((_, i) => (
            <span
              key={i}
              className={classNames(
                "h-1.5 flex-1 rounded-full transition-colors",
                i < met ? tier.bar : "bg-ink-100"
              )}
            />
          ))}
        </div>
        <span className="text-[11px] font-boldNunito" style={{ color: tier.color }}>
          {tier.label}
        </span>
      </div>

      <ul className="mt-2 flex flex-wrap gap-x-3.5 gap-y-1">
        {results.map((rule) => (
          <li
            key={rule.key}
            className={classNames(
              "flex items-center gap-1 text-[11px]",
              rule.met ? "text-wellness-600" : "text-ink-400"
            )}
          >
            <span aria-hidden="true" className="text-[10px]">{rule.met ? "✓" : "○"}</span>
            {rule.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

/** Selectable pill used by the topics and therapist-bench pickers. */
export const SelectChip = ({ selected, children, ...props }) => (
  <button
    type="button"
    aria-pressed={selected}
    className={classNames(
      "cursor-pointer rounded-full px-[18px] py-[9px] text-[13px] font-boldNunito transition-colors",
      selected ? "bg-navy-800 text-white" : "bg-ink-100 text-ink-500 hover:bg-ink-200"
    )}
    {...props}
  >
    {children}
    {selected ? " ✓" : ""}
  </button>
);

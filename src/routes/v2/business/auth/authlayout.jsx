import { createContext, useContext, useMemo, useState } from "react";
import { Outlet, Link, useLocation, useSearchParams } from "react-router-dom";
import classNames from "classnames";
import TalkamIcon from "../../../../assets/svgs/talkam-icon.svg";
import TalkamWordmark from "../../../../assets/svgs/talkam-logo.svg";
import { V2_ROOT } from "../../../../constants/v2routes";
import { authBrandContent, AUTH_SCREENS } from "../../../../fakedata/v2/auth";

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

/** Shared wizard state. Deliberately local (not Redux) — it is throwaway UI
 *  state today, and swapping it for a real slice later touches only this file. */
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
  consents: { account: false, session: false, community: false, research: false },
  selectedTopics: ["anxiety"],
  assessment: { work: null, anxiety: null, sleep: null, relationships: null },
  landingRole: "employee",
  twoFaRole: "admin",
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

export const Field = ({ label, labelTone, hint, children }) => (
  <div className="flex flex-col gap-1.5">
    <label
      className={classNames(
        "text-caption font-boldNunito",
        labelTone === "brand" ? "text-brand-400" : "text-ink-600"
      )}
    >
      {label}
    </label>
    {children}
    {hint ? <span className="text-[11px] text-ink-400">{hint}</span> : null}
  </div>
);

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

/** OTP boxes — the deck shows 3 filled, 3 empty. */
export const OtpBoxes = ({ filled = ["4", "7", "2"], length = 6 }) => (
  <div className="mb-5 flex gap-2.5">
    {Array.from({ length }).map((_, i) => (
      <div
        key={i}
        className={classNames(
          "flex h-[60px] w-[52px] items-center justify-center rounded-ds-md border-[1.5px] text-[22px] font-extraboldNunito",
          i < filled.length
            ? "border-brand-400 bg-white text-navy-800"
            : "border-ink-200 bg-ink-50 text-surface-muted",
          i === 0 && "shadow-focus-brand"
        )}
      >
        {i < filled.length ? filled[i] : "_"}
      </div>
    ))}
  </div>
);

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

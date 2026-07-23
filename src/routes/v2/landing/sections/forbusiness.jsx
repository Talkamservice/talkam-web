import classNames from "classnames";
import { BrowserFrame } from "../../../../components/v2/frames";
import { DsButton } from "../../../../components/v2/button";
import { DsEyebrow } from "../../../../components/v2/badge";
import { V2 } from "../../../../constants/v2routes";
import { businessPreview, businessBenefits } from "../../../../fakedata/v2/landing";
import TalkamWordmark from "../../../../assets/svgs/talkam-logo.svg";

/**
 * "TalkAM for Business" band with the admin dashboard shown in a browser frame.
 * Spec: "TalkAM Landing Page.dc.html" § 1C › FOR BUSINESS.
 */

const KPI_ICONS = {
  users: (color) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
    </svg>
  ),
  check: (color) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  calendar: (color) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  dollar: (color) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
};

const DashboardPreview = () => (
  <div className="flex h-[400px] bg-surface-page">
    {/* sidebar */}
    <div className="w-[150px] shrink-0 bg-navy-800 px-3 py-4">
      <img
        src={TalkamWordmark}
        alt="TalkAM"
        className="mb-5 h-4 w-auto [filter:brightness(0)_invert(1)]"
      />
      <div className="flex flex-col gap-1">
        {businessPreview.nav.map((item, i) => (
          <div
            key={item}
            className={classNames(
              "rounded-ds-sm px-2.5 py-2 text-[11px]",
              i === 0
                ? "bg-brand-400 font-boldNunito text-white"
                : "font-semiboldNunito text-white/50"
            )}
          >
            {item}
          </div>
        ))}
      </div>
    </div>

    {/* main */}
    <div className="flex-1 overflow-hidden p-[18px]">
      <div className="text-[15px] font-extraboldNunito text-navy-800">Overview</div>
      <div className="mb-3 text-[11px] text-[#9299A8]">{businessPreview.company}</div>

      <div className="mb-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
        {businessPreview.kpis.map((kpi) => (
          <div
            key={kpi.label}
            className={classNames(
              "rounded-[11px] p-[11px]",
              kpi.dark
                ? "bg-[linear-gradient(135deg,#141B34,#1A2E5A)]"
                : "border border-[#EDEFF3] bg-white"
            )}
          >
            <div
              className={classNames(
                "mb-[7px] flex h-[26px] w-[26px] items-center justify-center rounded-ds-sm",
                kpi.dark ? "bg-gold-400/[0.16]" : kpi.iconBg
              )}
            >
              {KPI_ICONS[kpi.icon](kpi.iconColor)}
            </div>
            <div
              className={classNames(
                "text-[19px] font-extraboldNunito",
                kpi.dark ? "text-white" : "text-navy-800"
              )}
            >
              {kpi.value}
            </div>
            <div
              className={classNames(
                "text-[9.5px]",
                kpi.dark ? "text-white/50" : "text-[#9299A8]"
              )}
            >
              {kpi.label}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-ds-md border border-[#EDEFF3] bg-white p-3.5">
        <div className="mb-[11px] flex items-center justify-between">
          <div className="text-caption font-extraboldNunito text-navy-800">Top Topics</div>
          <div className="text-[10px] text-[#9299A8]">Anonymised · no individual data</div>
        </div>
        <div className="flex flex-col gap-2">
          {businessPreview.topics.map((topic) => (
            <div key={topic.label}>
              <div className="mb-[3px] flex justify-between text-[11px] text-[#5B6577]">
                <span>{topic.label}</span>
                <span className="font-boldNunito" style={{ color: topic.color }}>
                  {topic.pct}%
                </span>
              </div>
              <div className="h-[5px] overflow-hidden rounded-[3px] bg-ink-100">
                <div
                  className="h-full"
                  style={{ width: `${topic.pct}%`, backgroundColor: topic.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const LandingForBusiness = () => (
  <section
    id="business"
    className="relative scroll-mt-20 overflow-hidden bg-[linear-gradient(160deg,#0D1523,#141B34)] px-6 py-16 lg:px-14 lg:py-[88px]"
  >
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-20 top-[20%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(1,127,200,0.16)_0%,transparent_65%)]"
    />
    <div className="relative z-[1] mx-auto flex max-w-[1440px] flex-wrap items-center gap-10 lg:gap-12">
      <div className="v2-reveal min-w-[300px] max-w-[460px] flex-1">
        <DsEyebrow className="mb-3 block text-brand-200">TalkAM for Business</DsEyebrow>
        <h2 className="mb-3.5 text-[26px] font-extraboldNunito leading-[1.2] tracking-[-0.01em] text-white lg:text-[34px]">
          A wellness benefit your whole team actually uses.
        </h2>
        <p className="mb-6 text-[15px] leading-[1.75] text-white/60">
          Give employees private access to therapy and community, and see
          anonymised wellbeing trends — never individual data — from one clean
          dashboard.
        </p>
        <div className="mb-7 flex flex-col gap-3">
          {businessBenefits.map((benefit) => (
            <div key={benefit} className="flex items-start gap-2.5 text-body text-white/80">
              <span className="text-wellness-400">✓</span> {benefit}
            </div>
          ))}
        </div>
        <DsButton
          to={V2.forBusiness}
          variant="brand"
          size="lg"
          className="shadow-[0_10px_24px_rgba(1,127,200,0.35)]"
        >
          Explore for Business →
        </DsButton>
      </div>

      <BrowserFrame
        url="business.talkam.net/dashboard"
        className="v2-dash-tilt v2-reveal w-full min-w-0 flex-1 lg:min-w-[520px]"
      >
        <div className="overflow-x-auto">
          <div className="min-w-[560px]">
            <DashboardPreview />
          </div>
        </div>
      </BrowserFrame>
    </div>
  </section>
);

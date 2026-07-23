import classNames from "classnames";
import { MarketingHero } from "../../../components/layout/v2/marketinglayout";
import { BrowserFrame } from "../../../components/v2/frames";
import { ShowcaseBand, ShowcasePoints } from "../../../components/v2/showcaseband";
import {
  OverviewPreview,
  EmployeesPreview,
  BillingPreview,
} from "../../../components/v2/dashboardpreviews";
import { DsButton } from "../../../components/v2/button";
import { DsEyebrow } from "../../../components/v2/badge";
import { usePageMeta } from "../../../hooks/usePageMeta";
import { V2 } from "../../../constants/v2routes";
import {
  businessSectors,
  businessHeroStats,
  businessFeatures,
  seatManagementPoints,
  businessSteps,
} from "../../../fakedata/v2/forbusiness";

/**
 * TalkAM For Business — marketing page.
 * Spec: "TalkAM For Business.dc.html". UI only.
 */

export const V2ForBusiness = () => {
  usePageMeta(
    "For Business — TalkAM",
    "Give employees private access to therapy, community and self-care tools — and see anonymised wellbeing trends from one clean dashboard."
  );

  return (
    <>
      {/* HERO */}
      <MarketingHero
        className="bg-[linear-gradient(165deg,#0D1523_0%,#141B34_55%,#10284A_100%)]"
        innerClassName="flex flex-wrap items-center gap-12 pb-20 pt-10 lg:gap-14 lg:pb-[120px] lg:pt-[52px]"
        glows={[
          "-right-[120px] -top-[60px] h-[560px] w-[560px] bg-[radial-gradient(circle,rgba(1,127,200,0.22)_0%,transparent_60%)]",
          "-left-[100px] -bottom-[140px] h-[460px] w-[460px] bg-[radial-gradient(circle,rgba(59,168,143,0.12)_0%,transparent_60%)]",
        ]}
      >
        <div className="v2-reveal w-full min-w-0 flex-1 lg:max-w-[560px]">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.07] px-4 py-[7px]">
            <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-wellness-400" />
            <span className="text-caption font-boldNunito tracking-[0.04em] text-white/75">
              TALKAM FOR BUSINESS
            </span>
          </div>
          <h1 className="mb-5 text-[36px] font-extraboldNunito leading-[1.05] tracking-[-0.02em] text-white sm:text-[44px] lg:text-[56px]">
            A wellness benefit your whole team{" "}
            <span className="bg-[linear-gradient(100deg,#68B4E1,#3BA88F)] bg-clip-text text-transparent">
              actually uses.
            </span>
          </h1>
          <p className="mb-8 max-w-[480px] text-[16px] leading-[1.65] text-white/60 lg:text-h4">
            Give employees private access to therapy, community and self-care tools
            — and see anonymised wellbeing trends from one clean dashboard. Never
            individual data.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <DsButton
              to={V2.businessSignUp}
              variant="brand"
              size="lg"
              className="shadow-[0_14px_30px_rgba(1,127,200,0.4)]"
            >
              Get started →
            </DsButton>
            <DsButton to={V2.pricing} variant="translucent" size="lg">
              See pricing
            </DsButton>
          </div>

          <div className="mt-9 flex flex-wrap gap-7">
            {businessHeroStats.map((stat, i) => (
              <div key={stat.value} className="flex gap-7">
                {i > 0 ? <span className="w-px self-stretch bg-white/[0.12]" /> : null}
                <div>
                  <div className="text-h2 font-extraboldNunito text-white">{stat.value}</div>
                  <div className="text-[12.5px] text-white/50">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <BrowserFrame
          url="business.talkam.net/dashboard"
          className="v2-reveal hidden w-full min-w-0 flex-1 !shadow-[0_50px_100px_rgba(0,0,0,0.55)] md:block lg:min-w-[500px] lg:[transform:perspective(1600px)_rotateY(-9deg)_rotateX(3deg)]"
        >
          <div className="overflow-x-auto">
            <div className="min-w-[540px]">
              <OverviewPreview
                nav={[
                  "Overview",
                  "Employees",
                  "Therapist Network",
                  "Reports",
                  "Billing",
                  "Settings",
                ]}
                height="h-[430px]"
              />
            </div>
          </div>
        </BrowserFrame>
      </MarketingHero>

      {/* TRUSTED BY */}
      <section className="border-b border-[#EDEFF3] bg-white px-6 py-10 lg:px-14">
        <div className="mb-5 text-center text-caption font-extraboldNunito tracking-[0.1em] text-[#9299A8]">
          TRUSTED BY TEAMS ACROSS
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-14">
          {businessSectors.map((sector) => (
            <div
              key={sector}
              className="text-[17px] font-extraboldNunito tracking-[-0.01em] text-[#C3C9D4]"
            >
              {sector}
            </div>
          ))}
        </div>
      </section>

      {/* WHY TALKAM FOR BUSINESS */}
      <section className="bg-[#F7F9FC] px-6 py-16 lg:px-14 lg:py-[88px]">
        <div className="v2-reveal mx-auto mb-12 max-w-[640px] text-center">
          <DsEyebrow className="mb-3 block text-brand-400">
            Why TalkAM for Business
          </DsEyebrow>
          <h2 className="mb-3.5 text-[28px] font-extraboldNunito tracking-[-0.02em] text-navy-800 lg:text-[38px]">
            Care that scales, insight that respects privacy.
          </h2>
          <p className="text-body-lg leading-[1.65] text-[#5B6577]">
            Everything HR needs to run a modern wellbeing benefit — without ever
            crossing the line into individual employee data.
          </p>
        </div>

        <div className="mx-auto grid max-w-[1080px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {businessFeatures.map((feature) => (
            <div
              key={feature.title}
              className="v2-reveal rounded-[18px] border border-[#EDEFF3] bg-white p-[26px] shadow-[0_2px_8px_rgba(20,27,52,0.03)]"
            >
              <div
                className={classNames(
                  "mb-4 flex h-[46px] w-[46px] items-center justify-center rounded-[13px] text-[22px]",
                  feature.bg
                )}
              >
                {feature.icon}
              </div>
              <h3 className="mb-2 text-[17px] font-extraboldNunito text-navy-800">
                {feature.title}
              </h3>
              <p className="text-[13.5px] leading-[1.6] text-[#5B6577]">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SEAT MANAGEMENT */}
      <ShowcaseBand url="business.talkam.net/employees" preview={<EmployeesPreview />}>
        <DsEyebrow className="mb-3 block text-brand-400">Seat management</DsEyebrow>
        <h2 className="mb-4 text-[26px] font-extraboldNunito tracking-[-0.02em] text-navy-800 lg:text-display">
          Invite in bulk, manage seats in seconds.
        </h2>
        <p className="mb-6 text-[15.5px] leading-[1.7] text-[#5B6577]">
          Upload a roster or add people one by one. Every employee shows as an
          anonymised ID — you see status and usage, never who said what.
        </p>
        <ShowcasePoints points={seatManagementPoints} />
      </ShowcaseBand>

      {/* PRIVACY WALL */}
      <section className="relative overflow-hidden bg-[linear-gradient(160deg,#0D1523,#10284A)] px-6 py-16 lg:px-14 lg:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 -top-[100px] h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(1,127,200,0.16)_0%,transparent_65%)]"
        />
        <div className="v2-reveal relative z-[1] mx-auto max-w-[760px] text-center">
          <div className="mx-auto mb-5 flex h-[60px] w-[60px] items-center justify-center rounded-ds-lg border border-wellness-400/30 bg-wellness-400/[0.16]">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3BA88F" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h2 className="mb-4 text-[26px] font-extraboldNunito tracking-[-0.02em] text-white lg:text-[34px]">
            The employer never sees an individual.
          </h2>
          <p className="text-[16px] leading-[1.7] text-white/65 lg:text-h4">
            Mood check-ins, sessions, messages and community activity are private to
            the employee. HR only ever sees company-wide, anonymised totals — and
            only above a minimum cohort size. It&apos;s wellbeing insight without
            surveillance.
          </p>
          <div className="mt-5 inline-flex items-center rounded-full border border-white/[0.12] bg-white/[0.06] px-[18px] py-[9px] text-[13px] font-boldNunito text-white/80">
            NDPA-compliant consent, built in
          </div>
        </div>
      </section>

      {/* BILLING */}
      <ShowcaseBand reverse tint url="business.talkam.net/billing" preview={<BillingPreview />}>
        <DsEyebrow className="mb-3 block text-brand-400">Fair, post-paid billing</DsEyebrow>
        <h2 className="mb-4 text-[26px] font-extraboldNunito tracking-[-0.02em] text-navy-800 lg:text-display">
          Only pay for sessions your team actually uses.
        </h2>
        <p className="mb-6 text-[15.5px] leading-[1.7] text-[#5B6577]">
          No big upfront commitment. TalkAM bills a flat rate per session per seat at
          the end of each month, securely through Flutterwave. Add seats anytime; top
          up when you hit a cap.
        </p>
        <DsButton
          to={V2.pricing}
          variant="brand"
          size="lg"
          className="rounded-[13px] shadow-[0_10px_24px_rgba(1,127,200,0.3)]"
        >
          See the pricing model →
        </DsButton>
      </ShowcaseBand>

      {/* THREE STEPS */}
      <section className="bg-white px-6 py-16 lg:px-14 lg:py-[88px]">
        <div className="v2-reveal mb-12 text-center">
          <DsEyebrow className="mb-3 block text-brand-400">Get started in days</DsEyebrow>
          <h2 className="text-[28px] font-extraboldNunito tracking-[-0.02em] text-navy-800 lg:text-[36px]">
            Live for your team in three steps.
          </h2>
        </div>
        <div className="mx-auto grid max-w-[1000px] gap-6 md:grid-cols-3">
          {businessSteps.map((step) => (
            <div
              key={step.n}
              className="v2-reveal rounded-[18px] border border-[#EDEFF3] bg-[#F7F9FC] p-7"
            >
              <div className="mb-3 text-[44px] font-extraboldNunito leading-none text-[#D6E4F0]">
                {step.n}
              </div>
              <h3 className="mb-2 text-h4 font-extraboldNunito text-navy-800">{step.title}</h3>
              <p className="text-body leading-[1.6] text-[#5B6577]">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[linear-gradient(120deg,#017FC8,#0D2240)] px-6 py-16 text-center lg:px-14 lg:py-[88px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -right-20 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12)_0%,transparent_65%)]"
        />
        <div className="v2-reveal relative z-[1] mx-auto max-w-[620px]">
          <h2 className="mb-4 text-[30px] font-extraboldNunito tracking-[-0.02em] text-white lg:text-[40px]">
            Bring real care to your workplace.
          </h2>
          <p className="mb-7 text-[16px] leading-[1.6] text-white/80 lg:text-h4">
            Set up your organisation in minutes and invite your first team today.
          </p>
          <div className="flex flex-wrap justify-center gap-3.5">
            <DsButton
              to={V2.businessSignUp}
              size="lg"
              className="bg-white !text-[#0D2240] shadow-[0_14px_30px_rgba(0,0,0,0.25)] hover:bg-ink-50"
            >
              Get started free →
            </DsButton>
            <DsButton
              to={V2.pricing}
              size="lg"
              className="border-[1.5px] border-white/30 bg-white/[0.14] !text-white hover:bg-white/25"
            >
              View pricing
            </DsButton>
          </div>
        </div>
      </section>
    </>
  );
};

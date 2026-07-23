import classNames from "classnames";
import { MarketingHero } from "../../../components/layout/v2/marketinglayout";
import { BrowserFrame } from "../../../components/v2/frames";
import { ShowcaseBand, ShowcasePoints } from "../../../components/v2/showcaseband";
import {
  TherapistHomePreview,
  TherapistSessionsPreview,
  TherapistEarningsPreview,
} from "../../../components/v2/therapistpreviews";
import { DsButton } from "../../../components/v2/button";
import { DsEyebrow } from "../../../components/v2/badge";
import { usePageMeta } from "../../../hooks/usePageMeta";
import { V2 } from "../../../constants/v2routes";
import {
  therapistTrustStats,
  therapistHeroStats,
  therapistFeatures,
  therapistSessionPoints,
  therapistSteps,
  therapistTestimonial,
} from "../../../fakedata/v2/fortherapists";

/**
 * TalkAM For Therapists — marketing page.
 * Spec: "TalkAM For Therapists.dc.html". Wellness-teal themed throughout,
 * per the DS rule that teal is reserved for therapy surfaces. UI only.
 */
export const V2ForTherapists = () => {
  usePageMeta(
    "For Therapists — TalkAM",
    "Reach people who need support, set your own hours, and get paid reliably — with a verified badge that builds instant trust."
  );

  return (
    <>
      {/* HERO */}
      <MarketingHero
        className="bg-[linear-gradient(165deg,#0D1523_0%,#12241E_55%,#124034_100%)]"
        navCta={{
          ctaLabel: "Apply as a therapist →",
          ctaTo: V2.businessTherapistApply,
          ctaVariant: "therapy",
        }}
        innerClassName="flex flex-wrap items-center gap-12 pb-20 pt-10 lg:gap-14 lg:pb-[120px] lg:pt-[52px]"
        glows={[
          "-right-[120px] -top-[60px] h-[560px] w-[560px] bg-[radial-gradient(circle,rgba(59,168,143,0.24)_0%,transparent_60%)]",
          "-left-[100px] -bottom-[140px] h-[460px] w-[460px] bg-[radial-gradient(circle,rgba(1,127,200,0.12)_0%,transparent_60%)]",
        ]}
      >
        <div className="v2-reveal w-full min-w-0 flex-1 lg:max-w-[560px]">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.07] px-4 py-[7px]">
            <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-wellness-400" />
            <span className="text-caption font-boldNunito tracking-[0.04em] text-white/75">
              TALKAM FOR THERAPISTS
            </span>
          </div>
          <h1 className="mb-5 text-[36px] font-extraboldNunito leading-[1.05] tracking-[-0.02em] text-white sm:text-[44px] lg:text-[56px]">
            Grow your practice,{" "}
            <span className="bg-[linear-gradient(100deg,#5FD3B6,#68B4E1)] bg-clip-text text-transparent">
              on your terms.
            </span>
          </h1>
          <p className="mb-8 max-w-[480px] text-[16px] leading-[1.65] text-white/60 lg:text-h4">
            Reach people who need support, set your own hours, and get paid reliably
            — with a verified badge that builds instant trust and a dashboard built
            for your day.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <DsButton
              to={V2.businessTherapistApply}
              variant="therapy"
              size="lg"
              className="shadow-[0_14px_30px_rgba(59,168,143,0.4)]"
            >
              Apply as a therapist →
            </DsButton>
            <DsButton href="#howitworks" variant="translucent" size="lg">
              How it works
            </DsButton>
          </div>

          <div className="mt-9 flex flex-wrap gap-7">
            {therapistHeroStats.map((stat, i) => (
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
          url="pro.talkam.net/home"
          className="v2-reveal hidden w-full min-w-0 flex-1 !shadow-[0_50px_100px_rgba(0,0,0,0.55)] md:block lg:min-w-[500px] lg:[transform:perspective(1600px)_rotateY(-9deg)_rotateX(3deg)]"
        >
          <div className="overflow-x-auto">
            <div className="min-w-[540px]">
              <TherapistHomePreview />
            </div>
          </div>
        </BrowserFrame>
      </MarketingHero>

      {/* TRUST STATS */}
      <section className="border-b border-[#EDEFF3] bg-white px-6 py-10 lg:px-14">
        <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-14">
          {therapistTrustStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-h2 font-extraboldNunito text-navy-800">{stat.value}</div>
              <div className="text-caption font-semiboldNunito text-[#9299A8]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY PRACTICE ON TALKAM */}
      <section className="bg-[#F7F9FC] px-6 py-16 lg:px-14 lg:py-[88px]">
        <div className="v2-reveal mx-auto mb-12 max-w-[640px] text-center">
          <DsEyebrow className="mb-3 block text-wellness-400">
            Why practice on TalkAM
          </DsEyebrow>
          <h2 className="mb-3.5 text-[28px] font-extraboldNunito tracking-[-0.02em] text-navy-800 lg:text-[38px]">
            Everything you need to do great work.
          </h2>
          <p className="text-body-lg leading-[1.65] text-[#5B6577]">
            A calm, focused workspace that handles the admin — so you can focus on
            your clients.
          </p>
        </div>

        <div className="mx-auto grid max-w-[1080px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {therapistFeatures.map((feature) => (
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

      {/* YOUR DAY, ORGANISED */}
      <ShowcaseBand url="pro.talkam.net/sessions" preview={<TherapistSessionsPreview />}>
        <DsEyebrow className="mb-3 block text-wellness-400">Your day, organised</DsEyebrow>
        <h2 className="mb-4 text-[26px] font-extraboldNunito tracking-[-0.02em] text-navy-800 lg:text-display">
          Sessions, requests and notes in one place.
        </h2>
        <p className="mb-6 text-[15.5px] leading-[1.7] text-[#5B6577]">
          See who&apos;s next with a live countdown, accept new client requests, join
          secure video rooms, and write session notes right after — nothing slips.
        </p>
        <ShowcasePoints points={therapistSessionPoints} />
      </ShowcaseBand>

      {/* GET PAID RELIABLY */}
      <ShowcaseBand
        reverse
        tint
        url="pro.talkam.net/earnings"
        preview={<TherapistEarningsPreview />}
      >
        <DsEyebrow className="mb-3 block text-wellness-400">Get paid reliably</DsEyebrow>
        <h2 className="mb-4 text-[26px] font-extraboldNunito tracking-[-0.02em] text-navy-800 lg:text-display">
          Clear earnings, weekly payouts.
        </h2>
        <p className="mb-6 text-[15.5px] leading-[1.7] text-[#5B6577]">
          Track your balance in real time and get paid every week straight to your
          account through Flutterwave. Transparent per-session rates, no hidden cuts.
        </p>
        <div className="rounded-ds-md bg-brand-25 p-4 text-[13.5px] leading-[1.6] text-brand-600">
          <strong className="font-boldNunito">Joining through a company?</strong>{" "}
          Therapists onboarded by a business are paid directly by that organisation at
          an agreed flat rate — no earnings module needed.
        </div>
      </ShowcaseBand>

      {/* HOW IT WORKS */}
      <section id="howitworks" className="scroll-mt-20 bg-white px-6 py-16 lg:px-14 lg:py-[88px]">
        <div className="v2-reveal mb-12 text-center">
          <DsEyebrow className="mb-3 block text-wellness-400">Joining is simple</DsEyebrow>
          <h2 className="text-[28px] font-extraboldNunito tracking-[-0.02em] text-navy-800 lg:text-[36px]">
            From application to first session.
          </h2>
        </div>
        <div className="mx-auto grid max-w-[1120px] gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {therapistSteps.map((step) => (
            <div
              key={step.n}
              className="v2-reveal rounded-[18px] border border-[#EDEFF3] bg-[#F7F9FC] p-[26px]"
            >
              <div className="mb-3 text-[40px] font-extraboldNunito leading-none text-[#CDEAE1]">
                {step.n}
              </div>
              <h3 className="mb-2 text-[16px] font-extraboldNunito text-navy-800">
                {step.title}
              </h3>
              <p className="text-[13px] leading-[1.6] text-[#5B6577]">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="relative overflow-hidden bg-[linear-gradient(160deg,#12241E,#124034)] px-6 py-16 lg:px-14 lg:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 -top-[100px] h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,168,143,0.18)_0%,transparent_65%)]"
        />
        <figure className="v2-reveal relative z-[1] mx-auto max-w-[820px] text-center">
          <div aria-hidden="true" className="mb-5 text-[56px] leading-none text-white">
            “
          </div>
          <blockquote className="mb-6 text-[19px] font-boldNunito leading-[1.5] text-white lg:text-[23px]">
            {therapistTestimonial.quote}
          </blockquote>
          <figcaption className="flex items-center justify-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#3BA88F,#124034)] font-extraboldNunito text-white">
              {therapistTestimonial.initial}
            </span>
            <span className="text-left">
              <span className="block text-body font-extraboldNunito text-white">
                {therapistTestimonial.name} <span className="text-[#5FD3B6]">✓</span>
              </span>
              <span className="block text-caption text-white/60">
                {therapistTestimonial.meta}
              </span>
            </span>
          </figcaption>
        </figure>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[linear-gradient(120deg,#3BA88F,#124034)] px-6 py-16 text-center lg:px-14 lg:py-[88px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -right-20 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12)_0%,transparent_65%)]"
        />
        <div className="v2-reveal relative z-[1] mx-auto max-w-[620px]">
          <h2 className="mb-4 text-[30px] font-extraboldNunito tracking-[-0.02em] text-white lg:text-[40px]">
            Ready to grow your practice?
          </h2>
          <p className="mb-7 text-[16px] leading-[1.6] text-white/85 lg:text-h4">
            Apply today. Verification is quick, and you choose when you start.
          </p>
          <DsButton
            to={V2.businessTherapistApply}
            size="lg"
            className="bg-white !text-[#124034] shadow-[0_14px_30px_rgba(0,0,0,0.25)] hover:bg-ink-50"
          >
            Apply as a therapist →
          </DsButton>
        </div>
      </section>
    </>
  );
};

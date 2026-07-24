import classNames from "classnames";
import { MarketingHero } from "../../../components/layout/v2/marketinglayout";
import { DsButton } from "../../../components/v2/button";
import { DsEyebrow } from "../../../components/v2/badge";
import { DsAccordion } from "../../../components/v2/accordion";
import { MarketingFooter } from "../../../components/layout/v2/marketingfooter";
import { usePageMeta } from "../../../hooks/usePageMeta";
import { V2, PRICING_NAV } from "../../../constants/v2routes";
import {
  buildPricingTiers,
  buildPricingExample,
  pricingIncluded,
  pricingFaqs,
} from "../../../constants/marketing/pricing";
import { useGetPricingConfigQuery } from "../../../services/v2/businessApiSlice";

/**
 * TalkAM for Business — Pricing.
 * Spec: "TalkAM Pricing.dc.html".
 * The three headline rates come from GET business/pricing-config so the page's
 * numbers track the backend; the surrounding copy is static. CTAs route into the
 * B2B auth flow.
 */

const TierCard = ({ tier }) => (
  <div
    className={classNames(
      "relative rounded-[18px] bg-white p-6",
      tier.highlight
        ? "border-2 border-brand-400 shadow-[0_16px_40px_rgba(1,127,200,0.14)]"
        : "border-[1.5px] border-[#EEEEEE]"
    )}
  >
    <span
      className={classNames(
        "absolute -top-[11px] left-5 rounded-full px-2.5 py-1 text-[10px] font-extraboldNunito tracking-[0.04em]",
        tier.highlight ? "bg-brand-400 text-white" : "bg-[#F0F1F5] text-[#5B6577]"
      )}
    >
      {tier.badge}
    </span>

    <div className="mb-1.5 mt-4 text-[15px] font-extraboldNunito text-navy-800">
      {tier.name}
    </div>
    <div className="mb-1 flex items-baseline gap-1">
      <span className="text-[30px] font-blackNunito text-navy-800">{tier.price}</span>
      <span className="text-caption text-ink-400">{tier.unit}</span>
    </div>
    <p className="mb-4 text-[12.5px] leading-[1.6] text-ink-500">{tier.body}</p>
    <p className="border-t border-ink-100 pt-3.5 text-[11.5px] leading-[1.6] text-[#9299A8]">
      {tier.note}
    </p>
  </div>
);

export const V2Pricing = () => {
  usePageMeta(
    "Pricing — TalkAM for Business",
    "Three clear layers, billed after your team activates. No upfront charge, no hidden per-session surprises."
  );

  const { data: config } = useGetPricingConfigQuery();
  const pricingTiers = buildPricingTiers(config);
  const pricingExample = buildPricingExample(config);

  return (
    <>
      {/* HERO */}
      <MarketingHero
        navTone="light"
        navCta={{
          links: PRICING_NAV,
          active: "Pricing",
          logoClassName: "h-[22px] lg:h-6",
          padClassName: "py-5 lg:py-6",
        }}
        className="bg-white"
        innerClassName="pb-10 pt-14 text-center lg:pt-[72px]"
      >
        <span className="mb-[22px] inline-flex items-center rounded-full bg-brand-25 px-3.5 py-[7px]">
          <DsEyebrow className="text-brand-400">TalkAM for Business</DsEyebrow>
        </span>
        <h1 className="mb-3.5 text-[34px] font-blackNunito tracking-[-0.02em] text-navy-800 sm:text-[42px] lg:text-[48px]">
          Simple, transparent pricing.
        </h1>
        <p className="mx-auto mb-2 max-w-[640px] text-[16px] leading-[1.7] text-[#5B6577]">
          Three clear layers, billed after your team activates. No upfront charge,
          no hidden per-session surprises.
        </p>
      </MarketingHero>

      {/* PRICING LAYERS */}
      <section className="mx-auto max-w-[1080px] px-6 pb-10 pt-6 lg:px-14">
        <div className="grid gap-[18px] md:grid-cols-3">
          {pricingTiers.map((tier) => (
            <TierCard key={tier.id} tier={tier} />
          ))}
        </div>
      </section>

      {/* BILLING SUMMARY BAND */}
      <section className="mx-auto max-w-[1080px] px-6 pb-14 lg:px-14">
        <div className="flex flex-wrap items-center gap-3.5 rounded-ds-lg border border-[#C9E2F9] bg-brand-25 px-6 py-5">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#015C94"
            strokeWidth="2"
            className="shrink-0"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          </svg>
          <p className="min-w-[260px] flex-1 text-[13.5px] leading-[1.6] text-brand-600">
            <strong className="font-boldNunito">Post-paid by default.</strong> Nothing
            is charged at signup — your first invoice is generated only once your
            first employee activates. Pay by bank transfer, or by card via
            Flutterwave for instant setup.
          </p>
          <DsButton
            to={V2.businessSignUp}
            variant="brand"
            className="rounded-[11px] px-[22px] text-[13.5px]"
          >
            Get Started →
          </DsButton>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="bg-ink-50 px-6 py-14 lg:px-14 lg:py-[72px]">
        <h2 className="mb-10 text-center text-[26px] font-extraboldNunito tracking-[-0.01em] text-navy-800 lg:text-display">
          Every plan includes
        </h2>
        <div className="mx-auto grid max-w-[1000px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pricingIncluded.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 rounded-[14px] border border-[#EEEEEE] bg-white p-[22px]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-wellness-50">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3BA88F"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <div>
                <div className="mb-1 text-body font-extraboldNunito text-navy-800">
                  {item.title}
                </div>
                <p className="text-[12.5px] leading-[1.6] text-ink-500">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW WE PRICE IT */}
      <section className="mx-auto flex max-w-[1100px] flex-col items-center gap-10 px-6 py-14 lg:flex-row lg:gap-12 lg:px-14 lg:py-[72px]">
        <div className="flex-1">
          <DsEyebrow className="mb-2.5 block text-brand-400">How we price it</DsEyebrow>
          <h2 className="mb-3.5 text-[24px] font-extraboldNunito tracking-[-0.01em] text-navy-800 lg:text-[28px]">
            Fair, transparent, and never a surprise.
          </h2>
          <p className="mb-4 text-[14.5px] leading-[1.75] text-[#5B6577]">
            Your bill is the sum of three clean layers: employee seats and therapist
            access are billed per employee each month, while sessions are drawn from
            a shared bundle at a flat ₦8,000 each — the same rate paid to every
            therapist on the network.
          </p>
          <p className="text-[14.5px] leading-[1.75] text-[#5B6577]">
            The full breakdown is always visible on your Billing page — no per-seat
            markups, no hidden per-session surcharges.
          </p>
        </div>

        <div className="w-full flex-1 rounded-ds-xl bg-navy-800 p-8">
          <div className="mb-4 text-caption font-boldNunito tracking-[0.08em] text-white/50">
            {pricingExample.heading}
          </div>
          {pricingExample.lines.map((line) => (
            <div
              key={line.label}
              className="flex justify-between gap-4 border-b border-white/[0.08] py-2.5"
            >
              <span className="text-[13px] text-white/70">{line.label}</span>
              <span className="text-[13px] font-boldNunito text-white">{line.value}</span>
            </div>
          ))}
          <div className="flex justify-between gap-4 py-3.5">
            <span className="text-body font-extraboldNunito text-brand-200">
              {pricingExample.total.label}
            </span>
            <span className="text-[16px] font-blackNunito text-brand-200">
              {pricingExample.total.value}
            </span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-ink-50 px-6 py-14 lg:px-14 lg:py-[72px]">
        <h2 className="mb-8 text-center text-[24px] font-extraboldNunito tracking-[-0.01em] text-navy-800 lg:text-[28px]">
          Pricing questions
        </h2>
        {/* Deck: plain <details> — native disclosure marker, several can be open. */}
        <DsAccordion items={pricingFaqs} marker="native" className="mx-auto max-w-[700px]" />
      </section>

      {/* CTA */}
      <section className="bg-brand-400 px-6 py-14 text-center lg:px-14 lg:py-16">
        <h2 className="mb-2.5 text-[24px] font-extraboldNunito text-white lg:text-[28px]">
          Ready to bring TalkAM to your team?
        </h2>
        <p className="mb-6 text-[14px] text-white/75">Set up takes about 10 minutes.</p>
        {/* Deck: an inline `<a>` — radius 13, padding 14px 30px, 15px/800. The
            inline display is deliberate: it is what sets the band's height. */}
        <DsButton
          to={V2.businessSignUp}
          variant="inverse"
          size="lg"
          className="!inline h-auto rounded-[13px] px-[30px] py-3.5 text-[15px] font-extraboldNunito"
        >
          Get Started →
        </DsButton>
      </section>

      {/* Deck: single-row footer — © · Terms of Use · Privacy Policy · Business Login */}
      <MarketingFooter
        variant="minimal"
        links={[
          { label: "Terms of Use", to: V2.terms },
          { label: "Privacy Policy", to: V2.privacy },
          { label: "Business Login", to: V2.businessLogin },
        ]}
      />
    </>
  );
};

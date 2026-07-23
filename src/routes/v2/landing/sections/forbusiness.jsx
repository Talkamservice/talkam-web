import { BrowserFrame } from "../../../../components/v2/frames";
import { OverviewPreview } from "../../../../components/v2/dashboardpreviews";
import { DsButton } from "../../../../components/v2/button";
import { DsEyebrow } from "../../../../components/v2/badge";
import { V2 } from "../../../../constants/v2routes";
import { businessBenefits } from "../../../../fakedata/v2/landing";

/**
 * "TalkAM for Business" band with the admin dashboard shown in a browser frame.
 * Spec: "TalkAM Landing Page.dc.html" § 1C › FOR BUSINESS.
 */
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
            <OverviewPreview />
          </div>
        </div>
      </BrowserFrame>
    </div>
  </section>
);

import { DsButton } from "../../../../components/v2/button";
import { DsEyebrow } from "../../../../components/v2/badge";
import { StoreBadges } from "../../../../components/v2/storebadges";
import { V2 } from "../../../../constants/v2routes";
import { therapistPerks, landingStats } from "../../../../constants/marketing/landing";

/**
 * The three full-width bands between the app showcase and the footer.
 * Spec: "TalkAM Landing Page.dc.html" § 1C — APP DOWNLOAD BANNER,
 * FOR PROFESSIONALS, STATS.
 */

export const DownloadBanner = () => (
  <section className="bg-brand-25 px-6 py-12 lg:px-14 lg:py-16">
    <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-6 text-center">
      <h2 className="text-[20px] font-extraboldNunito tracking-[-0.01em] text-navy-800 lg:text-h2">
        Already on TalkAM web? Take it with you →
      </h2>
      <StoreBadges className="justify-center" />
    </div>
  </section>
);

export const ForProfessionals = () => (
  <section className="relative overflow-hidden bg-wellness-50 px-6 py-14 lg:px-14 lg:py-[84px]">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-16 -top-20 h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,rgba(59,168,143,0.18)_0%,transparent_65%)]"
    />
    <div className="relative z-[1] mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-10">
      <div className="v2-reveal max-w-[560px]">
        <DsEyebrow className="mb-2.5 block text-wellness-600">For Therapists</DsEyebrow>
        <h2 className="mb-3 text-[26px] font-extraboldNunito tracking-[-0.01em] text-navy-800 lg:text-[32px]">
          Grow your practice with TalkAM.
        </h2>
        <p className="mb-5 text-[15px] leading-[1.7] text-[#3E4A52]">
          Reach people who need support, set your own hours, and get paid weekly —
          with a verified badge that builds instant trust.
        </p>
        <div className="flex flex-wrap gap-2.5">
          {therapistPerks.map((perk) => (
            <span
              key={perk}
              className="rounded-full bg-white px-4 py-[7px] text-caption font-boldNunito text-wellness-600 shadow-[0_2px_6px_rgba(20,27,52,0.06)]"
            >
              {perk}
            </span>
          ))}
        </div>
      </div>

      {/* Deck: bespoke button — 56px tall, radius 14, padding 0 30px, 15px/800. */}
      <DsButton
        to={V2.forTherapists}
        variant="therapy"
        size="lg"
        className="shrink-0 px-[30px] text-[15px] font-extraboldNunito shadow-[0_10px_24px_rgba(59,168,143,0.3)] transition-transform hover:-translate-y-[3px] hover:shadow-[0_16px_32px_rgba(59,168,143,0.4)]"
      >
        Apply as a Professional
      </DsButton>
    </div>
  </section>
);

export const StatsBand = () => (
  <section className="bg-navy-800 px-6 py-14 lg:px-14 lg:py-16">
    <div className="mx-auto max-w-[1440px]">
      <div className="mb-9 text-center">
        <DsEyebrow className="text-brand-200">TalkAM today</DsEyebrow>
      </div>
      {/* Deck: `repeat(4,1fr)` gap 16, `.stat-grid>div+div` hairline divider. */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {landingStats.map((stat, i) => (
          <div
            key={stat.value}
            className={
              i > 0 ? "text-center lg:border-l lg:border-white/10" : "text-center"
            }
          >
            <div className="mb-2 text-[30px] font-blackNunito tracking-[-0.02em] text-brand-200 lg:text-[38px]">
              {stat.value}
            </div>
            <p className="text-caption leading-[1.5] text-white/60">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

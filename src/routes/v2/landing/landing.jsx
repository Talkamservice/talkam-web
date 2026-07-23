import { usePageMeta } from "../../../hooks/usePageMeta";
import { LandingHero } from "./sections/hero";
import { AppShowcase } from "./sections/appshowcase";
import { LandingForBusiness } from "./sections/forbusiness";
import { DownloadBanner, ForProfessionals, StatsBand } from "./sections/bands";

/**
 * talkam.net landing / waitlist — VARIANT 1C (product-led).
 * Spec: "TalkAM Landing Page.dc.html" § Option 1C. Variants 1A and 1B are
 * intentionally not implemented.
 *
 * UI-only: the waitlist form holds local state and makes no request.
 */
export const V2Landing = () => {
  usePageMeta(
    "TalkAM — Your community and your therapist, in one app.",
    "Talk freely, find your people, and book real licensed support — all from the TalkAM app, coming soon to iOS and Android."
  );

  return (
    <>
      <LandingHero />
      <AppShowcase />
      <DownloadBanner />
      <LandingForBusiness />
      <ForProfessionals />
      <StatsBand />
    </>
  );
};

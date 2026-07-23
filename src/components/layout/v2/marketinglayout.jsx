import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { MarketingNav } from "./marketingnav";
import { MarketingFooter } from "./marketingfooter";
import { useScrollReveal } from "../../../hooks/useScrollReveal";

/**
 * Shell for every public marketing page (landing, pricing, for-business,
 * for-therapists, legal, journal).
 *
 * Each page owns its own hero background, so the nav is composed into the
 * page's <MarketingHero> rather than rendered here — see the deck, where the
 * nav sits inside the hero gradient and the gradient differs per page.
 */
export const MarketingLayout = () => {
  const { pathname, hash } = useLocation();

  // Reset scroll between marketing pages, but honour in-page anchors.
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  useScrollReveal(pathname);

  return (
    <div className="min-h-dvh bg-white font-regularNunito text-navy-800 antialiased">
      <Outlet />
      <MarketingFooter />
    </div>
  );
};

/**
 * Page hero band: owns the background, hosts the nav, and renders the soft
 * radial "glow" orbs the decks use on dark sections.
 */
export const MarketingHero = ({
  className,
  innerClassName,
  navTone = "dark",
  navCta,
  glows = [],
  children,
}) => (
  <section className={classNames("relative overflow-hidden", className)}>
    {glows.map((glow, i) => (
      <div
        key={i}
        aria-hidden="true"
        className={classNames("pointer-events-none absolute rounded-full", glow)}
      />
    ))}
    <MarketingNav tone={navTone} {...navCta} />
    <div
      className={classNames(
        "relative z-[1] mx-auto max-w-[1440px] px-6 lg:px-14",
        innerClassName
      )}
    >
      {children}
    </div>
  </section>
);

MarketingHero.propTypes = {
  /** Extra classes on the <section> — set the background here. */
  className: PropTypes.string,
  /** "dark" over a dark hero, "light" for pages with a light hero. */
  navTone: PropTypes.oneOf(["dark", "light"]),
  /** Overrides for the nav's right-hand CTA: { ctaLabel, ctaTo, ctaVariant }. */
  navCta: PropTypes.object,
  /** Tailwind class strings positioning each decorative radial glow. */
  glows: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node,
};

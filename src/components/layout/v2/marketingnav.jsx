import { useState } from "react";
import { Link } from "react-router-dom";
import * as Icon from "react-feather";
import classNames from "classnames";
import { DsButton } from "../../v2/button";
import TalkamWordmark from "../../../assets/svgs/talkam-logo.svg";
import { V2, MARKETING_NAV } from "../../../constants/v2routes";

/**
 * Marketing site nav.
 *
 * Every marketing deck draws its own nav row — the link sets, the active
 * treatment, the CTA label and the CTA fill all differ page to page — so the
 * links, the active item and the CTA are props rather than constants:
 *
 *   landing        dark  · The App / For Business / For Therapists / Journal · translucent "Business Login →"
 *   pricing        light · Features / Pricing / FAQ                          · solid blue "Business Login →"
 *   for-business   dark  · 5 links, "For Business" active (blue rule)        · solid blue "Business Login →"
 *   for-therapists dark  · 5 links, "For Therapists" active (teal rule)      · teal "Apply as a therapist →"
 *   journal        dark  · The App / For Business / Journal                  · translucent "Business Login →"
 *   legal          light · no links                                          · solid blue "Business Login →"
 */
export const MarketingNav = ({
  tone = "dark",
  links = MARKETING_NAV,
  /** Label of the link the deck renders in its active treatment. */
  active,
  /** Underline colour under the active link — deck: 2px solid. */
  activeRule = "#017FC8",
  ctaLabel = "Business Login →",
  ctaTo = V2.businessLogin,
  ctaVariant,
  ctaClassName,
  /** Deck logo heights: 26px on the dark navs, 24px on the light ones. */
  logoClassName = "h-[22px] lg:h-[26px]",
  /** Deck nav padding: 26px on landing, 24px elsewhere. */
  padClassName = "py-5 lg:py-[26px]",
}) => {
  const [open, setOpen] = useState(false);
  const light = tone === "light";
  const resolvedCta = ctaVariant || (light ? "brand" : "translucent");

  const linkClass = (isActive) =>
    classNames(
      "text-body transition-colors",
      isActive
        ? light
          ? "font-boldNunito text-brand-400"
          : "font-extraboldNunito text-white"
        : light
          ? "font-semiboldNunito text-ink-600 hover:text-navy-800"
          : "font-semiboldNunito text-white/65 hover:text-white"
    );

  return (
    <header
      className={classNames(
        "relative z-20 w-full font-regularNunito",
        light && "border-b border-ink-100 bg-white"
      )}
    >
      <div
        className={classNames(
          "mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-6 lg:px-14",
          padClassName
        )}
      >
        <Link to={V2.landing} className="shrink-0" aria-label="TalkAM home">
          <img
            src={TalkamWordmark}
            alt="TalkAM"
            className={classNames(
              "w-auto",
              logoClassName,
              !light && "[filter:brightness(0)_invert(1)]"
            )}
          />
        </Link>

        {/* Desktop links */}
        {links.length ? (
          <nav className="hidden items-center gap-9 lg:flex">
            {links.map((item) => {
              const isActive = item.label === active;
              const inner = (
                <span
                  className={classNames(
                    isActive && !light && "border-b-2 pb-[3px]"
                  )}
                  style={isActive && !light ? { borderColor: activeRule } : undefined}
                >
                  {item.label}
                </span>
              );
              return item.hash ? (
                <a key={item.label} href={item.to} className={linkClass(isActive)}>
                  {inner}
                </a>
              ) : (
                <Link key={item.label} to={item.to} className={linkClass(isActive)}>
                  {inner}
                </Link>
              );
            })}
          </nav>
        ) : null}

        <div className="flex items-center gap-3">
          {/* Deck: 13px pill, padding 10px 20px (11px 22px on the solid variants). */}
          <DsButton
            to={ctaTo}
            variant={resolvedCta}
            size="sm"
            className={classNames(
              "hidden h-auto rounded-full px-5 py-2.5 text-[13px] sm:inline-flex",
              resolvedCta === "translucent" && "!bg-white/[0.08] hover:!bg-white/[0.16]",
              ctaClassName
            )}
          >
            {ctaLabel}
          </DsButton>
          {links.length ? (
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((prev) => !prev)}
              className={classNames("lg:hidden", light ? "text-navy-800" : "text-white")}
            >
              {open ? <Icon.X size={24} /> : <Icon.Menu size={24} />}
            </button>
          ) : null}
        </div>
      </div>

      {/* Mobile drawer */}
      {open && links.length ? (
        <nav
          className={classNames(
            "border-t px-6 py-4 lg:hidden",
            light ? "border-ink-100 bg-white" : "border-white/10 bg-navy-900/95 backdrop-blur"
          )}
        >
          <ul className="flex flex-col">
            {links.map((item) => (
              <li key={item.label}>
                {item.hash ? (
                  <a
                    href={item.to}
                    onClick={() => setOpen(false)}
                    className={classNames(
                      "block py-3 text-body-lg font-semiboldNunito",
                      light ? "text-ink-600" : "text-white/75"
                    )}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={classNames(
                      "block py-3 text-body-lg font-semiboldNunito",
                      light ? "text-ink-600" : "text-white/75"
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
            <li className="pt-3 sm:hidden">
              <DsButton
                to={ctaTo}
                variant={resolvedCta}
                size="md"
                fullWidth
                className="rounded-full"
                onClick={() => setOpen(false)}
              >
                {ctaLabel}
              </DsButton>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
};

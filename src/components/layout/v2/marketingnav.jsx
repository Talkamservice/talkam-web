import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import * as Icon from "react-feather";
import classNames from "classnames";
import { DsButton } from "../../v2/button";
import TalkamWordmark from "../../../assets/svgs/talkam-logo.svg";
import { V2, MARKETING_NAV } from "../../../constants/v2routes";

/**
 * Marketing site nav.
 * Spec: "TalkAM Landing Page.dc.html" § Option 1C — NAV (dark tone, sits over
 * the hero gradient) and "TalkAM Pricing.dc.html" — NAV (light tone, white bar
 * with a hairline rule) for pages whose hero is light.
 */
export const MarketingNav = ({ tone = "dark" }) => {
  const [open, setOpen] = useState(false);
  const light = tone === "light";

  const linkClass = (isActive) =>
    classNames(
      "text-body font-semiboldNunito transition-colors",
      light
        ? isActive
          ? "text-brand-400 font-boldNunito"
          : "text-ink-600 hover:text-navy-800"
        : isActive
          ? "text-white"
          : "text-white/65 hover:text-white"
    );

  return (
    <header
      className={classNames(
        "relative z-20 w-full font-regularNunito",
        light && "border-b border-ink-100 bg-white"
      )}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-6 py-5 lg:px-14 lg:py-[26px]">
        <Link to={V2.landing} className="shrink-0" aria-label="TalkAM home">
          <img
            src={TalkamWordmark}
            alt="TalkAM"
            className={classNames(
              "h-[22px] w-auto lg:h-[26px]",
              !light && "[filter:brightness(0)_invert(1)]"
            )}
          />
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-9 lg:flex">
          {MARKETING_NAV.map((item) =>
            item.hash ? (
              <a key={item.label} href={item.to} className={linkClass(false)}>
                {item.label}
              </a>
            ) : (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) => linkClass(isActive)}
              >
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <DsButton
            to={V2.businessLogin}
            variant={light ? "brand" : "translucent"}
            size="sm"
            className="hidden rounded-full px-5 py-2.5 sm:inline-flex"
          >
            Business Login →
          </DsButton>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
            className={classNames("lg:hidden", light ? "text-navy-800" : "text-white")}
          >
            {open ? <Icon.X size={24} /> : <Icon.Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <nav
          className={classNames(
            "border-t px-6 py-4 lg:hidden",
            light
              ? "border-ink-100 bg-white"
              : "border-white/10 bg-navy-900/95 backdrop-blur"
          )}
        >
          <ul className="flex flex-col">
            {MARKETING_NAV.map((item) => (
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
                to={V2.businessLogin}
                variant={light ? "brand" : "translucent"}
                size="md"
                fullWidth
                className="rounded-full"
                onClick={() => setOpen(false)}
              >
                Business Login →
              </DsButton>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
};

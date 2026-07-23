import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import * as Icon from "react-feather";
import classNames from "classnames";
import { DsButton } from "../../v2/button";
import TalkamWordmark from "../../../assets/svgs/talkam-logo.svg";
import { V2, MARKETING_NAV } from "../../../constants/v2routes";

/**
 * Marketing site nav.
 * Spec: "TalkAM Landing Page.dc.html" § Option 1C — NAV.
 * Transparent over the hero gradient on the landing page; solid navy
 * elsewhere (`solid` prop).
 */
export const MarketingNav = ({ solid }) => {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={classNames(
        "relative z-20 w-full font-regularNunito",
        solid && "bg-navy-800"
      )}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-6 py-5 lg:px-14 lg:py-[26px]">
        <Link to={V2.landing} className="shrink-0" aria-label="TalkAM home">
          <img
            src={TalkamWordmark}
            alt="TalkAM"
            className="h-[22px] w-auto [filter:brightness(0)_invert(1)] lg:h-[26px]"
          />
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-9 lg:flex">
          {MARKETING_NAV.map((item) =>
            item.hash ? (
              <a
                key={item.label}
                href={item.to}
                className="text-body font-semiboldNunito text-white/65 transition-colors hover:text-white"
              >
                {item.label}
              </a>
            ) : (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  classNames(
                    "text-body font-semiboldNunito transition-colors hover:text-white",
                    isActive ? "text-white" : "text-white/65"
                  )
                }
              >
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <DsButton
            to={V2.businessLogin}
            variant="translucent"
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
            className="text-white lg:hidden"
          >
            {open ? <Icon.X size={24} /> : <Icon.Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <nav className="border-t border-white/10 bg-navy-900/95 px-6 py-4 backdrop-blur lg:hidden">
          <ul className="flex flex-col">
            {MARKETING_NAV.map((item) => (
              <li key={item.label}>
                {item.hash ? (
                  <a
                    href={item.to}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-body-lg font-semiboldNunito text-white/75"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-body-lg font-semiboldNunito text-white/75"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
            <li className="pt-3 sm:hidden">
              <DsButton
                to={V2.businessLogin}
                variant="translucent"
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

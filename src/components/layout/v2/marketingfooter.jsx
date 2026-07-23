import { Link } from "react-router-dom";
import TalkamWordmark from "../../../assets/svgs/talkam-logo.svg";
import { V2, FOOTER_GROUPS } from "../../../constants/v2routes";

/**
 * Marketing site footer.
 * Spec: "TalkAM Landing Page.dc.html" § Option 1C — FOOTER.
 */
export const MarketingFooter = () => (
  <footer className="bg-navy-900 px-6 pb-7 pt-14 font-regularNunito lg:px-14 lg:pt-[60px]">
    <div className="mx-auto max-w-[1440px]">
      <div className="mb-11 flex flex-wrap justify-between gap-10">
        <div className="max-w-[280px]">
          <img
            src={TalkamWordmark}
            alt="TalkAM"
            className="mb-3.5 h-6 w-auto [filter:brightness(0)_invert(1)]"
          />
          <p className="text-[13px] leading-[1.7] text-white/45">
            Community-first mental wellness — where honest conversation meets real
            care.
          </p>
        </div>

        <div className="flex flex-wrap gap-10 lg:gap-16">
          {FOOTER_GROUPS.map((group) => (
            <div key={group.title}>
              <div className="mb-4 text-[11px] font-boldNunito uppercase tracking-[0.08em] text-white/35">
                {group.title}
              </div>
              <div className="flex flex-col gap-[11px]">
                {group.links.map((link) =>
                  link.hash ? (
                    <a
                      key={link.label}
                      href={link.to}
                      className="text-[13px] text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      to={link.to}
                      className="text-[13px] text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}

          <div>
            <div className="mb-4 text-[11px] font-boldNunito uppercase tracking-[0.08em] text-white/35">
              Business
            </div>
            <Link
              to={V2.businessLogin}
              className="text-[13px] font-boldNunito text-brand-200 transition-colors hover:text-white"
            >
              Business Login →
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-6 h-px bg-white/[0.08]" />

      <div className="flex flex-col gap-2 text-caption text-white/35 sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} TalkAM. All rights reserved.</span>
        <Link to={V2.businessLogin} className="transition-colors hover:text-white/60">
          Business Login
        </Link>
      </div>
    </div>
  </footer>
);

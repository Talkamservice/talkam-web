import classNames from "classnames";
import { APP_STORE_URL, PLAY_STORE_URL } from "../../constants/v2routes";

/**
 * App Store / Google Play download badges.
 * Spec: "TalkAM Landing Page.dc.html" § 1C › APP DOWNLOAD BANNER.
 */

const StoreLink = ({ href, icon, kicker, name, className }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={classNames(
      "flex items-center gap-2.5 rounded-[13px] px-[22px] py-[11px] no-underline",
      "transition-transform duration-200 hover:-translate-y-0.5",
      className
    )}
  >
    {icon}
    <span>
      <span className="block text-[9.5px] leading-none text-white/60">{kicker}</span>
      <span className="block text-body font-extraboldNunito leading-[1.3]">{name}</span>
    </span>
  </a>
);

export const StoreBadges = ({ className }) => (
  <div className={classNames("flex flex-wrap gap-3.5", className)}>
    <StoreLink
      href={APP_STORE_URL}
      kicker="Download on the"
      name="App Store"
      className="bg-navy-800 text-white"
      icon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7">
          <rect x="6" y="2" width="12" height="20" rx="2.2" />
          <line x1="10" y1="19" x2="14" y2="19" />
        </svg>
      }
    />
    <StoreLink
      href={PLAY_STORE_URL}
      kicker="GET IT ON"
      name="Google Play"
      className="bg-navy-800 text-white"
      icon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      }
    />
  </div>
);

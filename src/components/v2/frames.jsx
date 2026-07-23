import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * Decorative device frames used to show product in-context on the marketing
 * pages. Spec: "TalkAM Landing Page.dc.html" § Option 1C.
 */

/** Phone bezel. `hero` is the larger 290×600 hero device; default is 250×520. */
export const PhoneFrame = ({ hero, className, screenClassName, children }) => (
  <div
    className={classNames(
      "v2-phone-shot relative shrink-0 border border-white/10 bg-[#0B0F17]",
      hero
        ? "w-[290px] h-[600px] rounded-[42px] p-[9px] shadow-[0_40px_90px_rgba(0,0,0,0.55)]"
        : "w-[250px] h-[520px] rounded-[38px] p-2 shadow-[0_30px_60px_rgba(20,27,52,0.22)]",
      className
    )}
  >
    <div
      className={classNames(
        "flex h-full w-full flex-col overflow-hidden bg-[#F4F6FA]",
        hero ? "rounded-[34px]" : "rounded-[31px]",
        screenClassName
      )}
    >
      {children}
    </div>
  </div>
);

/** macOS-style browser chrome wrapping a dashboard screenshot. */
export const BrowserFrame = ({ url, className, children }) => (
  <div
    className={classNames(
      "overflow-hidden rounded-[14px] border border-white/10 shadow-[0_40px_90px_rgba(0,0,0,0.5)]",
      className
    )}
  >
    <div className="flex items-center gap-2 bg-[#E8EAF0] px-4 py-[11px]">
      <span className="h-[11px] w-[11px] shrink-0 rounded-full bg-[#FF5F57]" />
      <span className="h-[11px] w-[11px] shrink-0 rounded-full bg-[#FEBC2E]" />
      <span className="h-[11px] w-[11px] shrink-0 rounded-full bg-[#28C840]" />
      <div className="ml-2.5 flex-1 truncate rounded-[7px] bg-white px-3 py-[5px] text-[11px] font-semiboldNunito text-[#9299A8]">
        🔒 {url}
      </div>
    </div>
    {children}
  </div>
);

PhoneFrame.propTypes = { hero: PropTypes.bool, children: PropTypes.node };
BrowserFrame.propTypes = { url: PropTypes.string, children: PropTypes.node };

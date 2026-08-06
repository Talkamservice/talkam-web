import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * Decorative device frames used to show product in-context on the marketing
 * pages. Spec: "TalkAM Landing Page.dc.html" § Option 1C.
 */

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

BrowserFrame.propTypes = {
  url: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

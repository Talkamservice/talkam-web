import classNames from "classnames";
import PropTypes from "prop-types";
import { BrowserFrame } from "./frames";

/**
 * Alternating "copy beside a tilted dashboard screenshot" band, used by both
 * For Business and For Therapists.
 * Spec: "TalkAM For Business.dc.html" / "TalkAM For Therapists.dc.html".
 *
 * The screenshot is hidden below `md` (the decks' `.hide-sm`) — a 540px-wide
 * dashboard shrunk to phone width reads as noise, not proof.
 */
export const ShowcaseBand = ({ reverse, tint, url, preview, children }) => (
  <section
    className={classNames(
      "px-6 py-14 lg:px-14 lg:py-[92px]",
      tint ? "bg-[#F7F9FC]" : "bg-white"
    )}
  >
    <div
      className={classNames(
        "mx-auto flex max-w-[1180px] flex-col items-center gap-10 lg:gap-14",
        reverse ? "lg:flex-row-reverse" : "lg:flex-row"
      )}
    >
      <BrowserFrame
        url={url}
        className={classNames(
          "v2-reveal hidden w-full min-w-0 flex-1 !border-[#EDEFF3] !shadow-[0_40px_90px_rgba(20,27,52,0.16)] md:block",
          reverse
            ? "lg:[transform:perspective(1600px)_rotateY(-9deg)_rotateX(3deg)]"
            : "lg:[transform:perspective(1600px)_rotateY(9deg)_rotateX(3deg)]"
        )}
      >
        <div className="overflow-x-auto">
          <div className="min-w-[540px]">{preview}</div>
        </div>
      </BrowserFrame>
      <div className="v2-reveal w-full flex-1 lg:max-w-[440px]">{children}</div>
    </div>
  </section>
);

/** Checklist row used inside the showcase copy columns. */
export const ShowcasePoints = ({ points, tone = "wellness" }) => (
  <div className="flex flex-col gap-3.5">
    {points.map((point) => (
      <div key={point.title} className="flex items-start gap-3">
        <span
          className={classNames(
            "text-h4 font-extraboldNunito leading-tight",
            tone === "wellness" ? "text-wellness-400" : "text-brand-400"
          )}
        >
          ✓
        </span>
        <div>
          <div className="text-body font-extraboldNunito text-navy-800">{point.title}</div>
          <div className="text-[13px] text-ink-500">{point.body}</div>
        </div>
      </div>
    ))}
  </div>
);

ShowcaseBand.propTypes = {
  reverse: PropTypes.bool,
  tint: PropTypes.bool,
  url: PropTypes.string.isRequired,
  preview: PropTypes.node.isRequired,
  children: PropTypes.node,
};

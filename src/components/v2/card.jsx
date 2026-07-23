import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * TalkAM Design System v1.0 — Card surface
 * Radius LG (16px) for cards, XL (20px) for modals, 2XL (24px) for feature
 * panels; elevation E1–E4 per the DS elevation scale.
 */

const ELEVATIONS = { 0: "", 1: "shadow-e1", 2: "shadow-e2", 3: "shadow-e3", 4: "shadow-e4" };
const RADII = { lg: "rounded-ds-lg", xl: "rounded-ds-xl", "2xl": "rounded-ds-2xl" };

export const DsCard = ({
  elevation = 1,
  radius = "lg",
  bordered = true,
  className,
  children,
  ...props
}) => (
  <div
    className={classNames(
      "bg-white",
      RADII[radius],
      ELEVATIONS[elevation],
      bordered && "border border-black/[0.06]",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

DsCard.propTypes = {
  elevation: PropTypes.oneOf([0, 1, 2, 3, 4]),
  radius: PropTypes.oneOf(["lg", "xl", "2xl"]),
  bordered: PropTypes.bool,
  children: PropTypes.node,
};

import { useState } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * FAQ accordion.
 * Spec: the decks use <details>/<summary> with a +/– marker. Implemented with
 * a button + aria-expanded so it is keyboard- and screen-reader friendly.
 */
export const DsAccordion = ({ items, className }) => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className={classNames("flex flex-col gap-2.5", className)}>
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div
            key={item.q}
            className="rounded-[14px] border border-[#EEEEEE] bg-white px-5 py-4"
          >
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : index)}
              className="flex w-full cursor-pointer items-start justify-between gap-4 text-left"
            >
              <span className="text-body font-boldNunito text-navy-800">{item.q}</span>
              <span
                aria-hidden="true"
                className="shrink-0 text-h3 font-extraboldNunito leading-none text-brand-400"
              >
                {open ? "–" : "+"}
              </span>
            </button>
            {open ? (
              <p className="mt-3 text-[13px] leading-[1.7] text-ink-500">{item.a}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

DsAccordion.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({ q: PropTypes.string, a: PropTypes.string })
  ).isRequired,
};

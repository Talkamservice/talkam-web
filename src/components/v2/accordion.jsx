import { useState } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * FAQ accordion.
 *
 * The decks use `<details>/<summary>`, but not identically:
 *  - Landing / Blog / For Business / For Therapists add
 *    `summary{list-style:none}` + `summary::after{content:'+'}`, so the marker
 *    is a `+` / `–` on the right → `marker="plus"`.
 *  - Pricing and the employee Help screen leave the disclosure marker at its
 *    browser default, on the left → `marker="native"`, rendered with real
 *    `<details>` so it matches exactly (and, like the deck, several rows can
 *    be open at once).
 */
export const DsAccordion = ({ items, marker = "plus", className }) => {
  const [openIndex, setOpenIndex] = useState(null);

  if (marker === "native") {
    return (
      <div className={classNames("flex flex-col gap-2.5", className)}>
        {items.map((item) => (
          <details
            key={item.q}
            className="rounded-[14px] border border-[#EEEEEE] bg-white px-5 py-4"
          >
            <summary className="cursor-pointer text-[14px] font-boldNunito text-navy-800">
              {item.q}
            </summary>
            <p className="mb-0 mt-3 text-[13px] leading-[1.7] text-ink-500">{item.a}</p>
          </details>
        ))}
      </div>
    );
  }

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
              <span className="text-[14px] font-boldNunito text-navy-800">{item.q}</span>
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
  marker: PropTypes.oneOf(["plus", "native"]),
};

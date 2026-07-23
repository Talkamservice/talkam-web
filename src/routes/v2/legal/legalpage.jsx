import PropTypes from "prop-types";
import { MarketingHero } from "../../../components/layout/v2/marketinglayout";
import { DsEyebrow } from "../../../components/v2/badge";
import { usePageMeta } from "../../../hooks/usePageMeta";
import { privacyPolicy, termsOfUse } from "../../../fakedata/v2/legal";

/**
 * Shared long-form legal document layout.
 * Spec: "TalkAM Privacy Policy.dc.html" and "TalkAM Terms of Use.dc.html" —
 * both decks are the same 760px measure, differing only in copy and the
 * NDPA callout.
 */
const LegalPage = ({ doc, metaDescription }) => {
  usePageMeta(`${doc.title} — TalkAM`, metaDescription);

  return (
    <MarketingHero
      navTone="light"
      className="bg-white"
      innerClassName="!max-w-[760px] !px-6 pb-20 pt-12 lg:pb-24 lg:pt-16"
    >
      <DsEyebrow className="mb-2.5 block text-brand-400">Legal</DsEyebrow>
      <h1 className="mb-2 text-[28px] font-extraboldNunito tracking-[-0.01em] text-navy-800 lg:text-[36px]">
        {doc.title}
      </h1>
      <p className="text-[13px] text-[#9299A8]">Last updated: {doc.lastUpdated}</p>

      {doc.callout ? (
        <div className="mt-6 flex gap-3 rounded-[14px] bg-brand-25 px-5 py-[18px]">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#017FC8"
            strokeWidth="2"
            className="mt-0.5 shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-[13.5px] leading-[1.7] text-brand-600">{doc.callout}</p>
        </div>
      ) : null}

      <div className={doc.callout ? "mt-4" : "mt-6"}>
        {doc.sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-2.5 mt-9 text-[19px] font-extraboldNunito text-navy-800">
              {section.title}
            </h2>
            <p className="text-[14.5px] leading-[1.85] text-[#3E4A52]">{section.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-12 border-t border-ink-100 pt-6 text-[13.5px] leading-[1.8] text-[#5B6577]">
        {doc.contact.lead}{" "}
        <a
          href={`mailto:${doc.contact.email}`}
          className="text-brand-400 underline-offset-2 hover:text-brand-600 hover:underline"
        >
          {doc.contact.email}
        </a>
        .
      </div>
    </MarketingHero>
  );
};

LegalPage.propTypes = {
  doc: PropTypes.shape({
    title: PropTypes.string.isRequired,
    lastUpdated: PropTypes.string.isRequired,
    callout: PropTypes.string,
    sections: PropTypes.array.isRequired,
    contact: PropTypes.object.isRequired,
  }).isRequired,
};

export const V2PrivacyPolicy = () => (
  <LegalPage
    doc={privacyPolicy}
    metaDescription="How TalkAM collects, uses and protects your data — NDPA 2023 compliant, with a hard wall between employer and individual employee data."
  />
);

export const V2TermsOfUse = () => (
  <LegalPage
    doc={termsOfUse}
    metaDescription="The terms governing your use of TalkAM as a community member, therapy client, verified therapist, or business customer."
  />
);

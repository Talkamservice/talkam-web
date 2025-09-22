import { useEffect } from "react";
import Container from "./components/container";

export const ChildSafetyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Child Safety Standards data
  const safetyStandards = [
    "A clear prohibition on any content or behavior that sexualizes minors, exploits children, or uses them in any way for sexual content.",
    "Prohibition on grooming, sextortion, trafficking of children, or any solicitation of minors for sexual purposes.",
    "All content must respect applicable laws regarding minors in every country in which we operate.",
    "Regular reviews of our Terms of Service, Community Guidelines, and internal moderation policies to ensure alignment with best practices and legal requirements.",
  ];

  // Reporting mechanisms data
  const reportingMechanisms = [
    'The "Report" functionality built into the app (on any profile, message, photo, or content).',
    {
      text: "Support email: ",
      email: "support@talkam.net",
    },
    'For urgent or severe reports (e.g. content involving minors in danger or CSAM), users can mark as "Urgent" when reporting, such that it escalates to our trust & safety team immediately.',
  ];

  // CSAM handling procedures
  const csamHandling = [
    "We remove the content immediately and block any user accounts found to be sharing or facilitating such content.",
    "We comply with all legal obligations to report confirmed CSAM to relevant authorities in the user's jurisdiction (for example, law enforcement, child protection agencies) per applicable law.",
    "We preserve evidence securely for as long as required by law to aid in investigations, always ensuring the privacy and safety of minors.",
    "We also cooperate with law enforcement where required by law, while ensuring we follow due process, respect user rights, and do not overstep legal bounds.",
  ];

  // Legal compliance items
  const legalCompliance = [
    "Laws pertaining to child pornography / CSAM.",
    "Laws around mandatory reporting of abuse of minors.",
    "Data protection and privacy laws concerning minors (e.g., children's consent, parental permissions) where applicable.",
  ];

  // Contact responsibilities
  const contactResponsibilities = [
    "Receive official notifications about CSAE / CSAM issues.",
    "Take or direct corrective action (content removal, account suspension, law enforcement engagement).",
    "Ensure internal enforcement and policy review.",
  ];

  // Responsibilities table data
  const responsibilitiesData = [
    {
      talkam:
        "Moderating content proactively (both automated tools and human moderation).",
      users:
        "Avoid posting or sharing any content involving minors that is sexual, exploitative, or abusive.",
    },
    {
      talkam:
        "Maintaining evolving policies and enforcement aligned with legal requirements.",
      users:
        "Reporting any suspicious, illegal, or harmful content related to minors when seen.",
    },
    {
      talkam:
        "Protecting privacy of minors and preserving evidence when needed for legal actions.",
      users:
        "Cooperating with support / moderation when requested (e.g., by providing additional context).",
    },
  ];

  // Policy review items
  const policyReview = [
    "This policy is reviewed at least every 12 months, or sooner if required by changes in law, technology, or incidence of abuse.",
    "When updated, a notice will be posted here. Users affected by major changes will be notified via app or email where feasible.",
  ];

  // Definitions data
  const definitions = [
    {
      term: "CSAE (Child Sexual Abuse and Exploitation):",
      definition:
        "Content or behaviour that sexually exploits, abuses, or endangers children. This includes grooming, sextorting a child, trafficking of a child for sex, or otherwise sexually exploiting a child.",
    },
    {
      term: "CSAM (Child Sexual Abuse Material):",
      definition:
        "Any visual depiction (photos, videos, computer-generated imagery) involving a minor engaging in sexually explicit conduct.",
    },
    {
      term: "Minor / Child:",
      definition:
        "Anyone below the age of majority as defined by law in their jurisdiction (often under 18 years old).",
    },
  ];

  // Transparency commitments
  const transparencyCommitments = [
    "Publish this policy in a stable, discoverable location (in our app, our website).",
    "Include it in our Terms of Service / Community Guidelines so users are aware before joining or interacting.",
    "Ensure our in-app feedback/reporting tools are visible & usable.",
  ];

  return (
    <Container>
      <div className="w-full mx-auto max-w-screen-md">
        <h2 className="text-[#101828] font-bold text-2xl sm:text-4xl sm:leading-[46px] text-center ">
          Child Safety & CSAE (Child Sexual Abuse & Exploitation) Policy
        </h2>
        <div className="mt-9 md:mt-14 xl:mt-16 mb-4">
          {/* Section 1: Our Child Safety Standards */}
          <section id="standards" className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6">
              1. Our Child Safety Standards
            </h2>
            <p className="text-base text-black mb-6">
              At Talkam, we have zero tolerance for any form of child sexual
              abuse, exploitation, or content that endangers minors. Our
              published standards include:
            </p>
            <ul className="space-y-4">
              {safetyStandards.map((standard, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-black mr-3">•</span>
                  <p className="text-base text-black">{standard}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 2: Reporting & Feedback Mechanisms */}
          <section id="reporting" className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6">
              2. Reporting & Feedback Mechanisms
            </h2>
            <p className="text-base text-black mb-6">
              Users can report any incident or content of concern via:
            </p>
            <ul className="space-y-4 mb-6">
              {reportingMechanisms.map((mechanism, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-black mr-3">•</span>
                  <p className="text-base text-black">
                    {typeof mechanism === "string" ? (
                      mechanism
                    ) : (
                      <>
                        {mechanism.text}
                        <a
                          href={`mailto:${mechanism.email}`}
                          className="underline"
                        >
                          {mechanism.email}
                        </a>
                      </>
                    )}
                  </p>
                </li>
              ))}
            </ul>
            <p className="text-sm text-black">
              We ensure all reports are handled swiftly, fairly, and with
              sensitivity, respecting privacy and user dignity.
            </p>
          </section>

          {/* Section 3: Handling of CSAM and CSAE */}
          <section id="handling" className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6">
              3. Handling of CSAM and CSAE
            </h2>
            <p className="text-base text-black mb-6">
              When Talkam becomes aware (via user reports, internal moderation,
              or external notification) of any CSAM or CSAE:
            </p>
            <ul className="space-y-4">
              {csamHandling.map((procedure, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-black mr-3">•</span>
                  <p className="text-base text-black">{procedure}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 4: Legal Compliance & Jurisdiction */}
          <section id="compliance" className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6">
              4. Legal Compliance & Jurisdiction
            </h2>
            <p className="text-base text-black mb-6">
              Talkam is committed to complying with all applicable child
              protection laws in the jurisdictions where we operate. This
              includes but is not limited to:
            </p>
            <ul className="space-y-4 mb-6">
              {legalCompliance.map((law, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-black mr-3">•</span>
                  <p className="text-base text-black">{law}</p>
                </li>
              ))}
            </ul>
            <p className="text-base text-black">
              We regularly monitor legal developments and update our policies
              accordingly.
            </p>
          </section>

          {/* Section 5: Child Safety Point of Contact */}
          <section id="contact" className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6">
              5. Child Safety Point of Contact
            </h2>
            <p className="text-base text-black mb-6">
              If you are an authority, Google Play, or a user with concerns
              related to child safety, CSAE, or CSAM, please contact:
            </p>
            <div className="mb-6 p-4 border border-gray-300">
              <h3 className="text-lg font-semibold text-black mb-2">
                Child Safety Officer / Trust & Safety Lead
              </h3>
              <p className="text-base text-black">
                Email:{" "}
                <a href="mailto:childsafety@talkam.net" className="underline">
                  childsafety@talkam.net
                </a>
              </p>
            </div>
            <p className="text-base text-black mb-4">
              This contact is empowered to:
            </p>
            <ul className="space-y-3">
              {contactResponsibilities.map((responsibility, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-black mr-3">•</span>
                  <p className="text-base text-black">{responsibility}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 6: Responsibilities */}
          <section id="responsibilities" className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6">
              6. Our Responsibilities & Users&apos; Role
            </h2>
            <p className="text-base text-black mb-6">
              We believe safety is a shared responsibility. Below is how
              responsibilities are divided:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-3 text-left text-lg font-semibold text-black bg-gray-50">
                      Talkam&apos;s Responsibilities
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-lg font-semibold text-black bg-gray-50">
                      Users&apos; Responsibilities
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {responsibilitiesData.map((row, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 1 ? "bg-gray-50" : ""}
                    >
                      <td className="border border-gray-300 px-4 py-3 text-base text-black align-top">
                        {row.talkam}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-base text-black align-top">
                        {row.users}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 7: Policy Review & Updates */}
          <section id="review" className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6">
              7. Policy Review & Updates
            </h2>
            <ul className="space-y-4">
              {policyReview.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-black mr-3">•</span>
                  <p className="text-base text-black">{item}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 8: Definitions */}
          <section id="definitions" className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6">
              8. Definitions
            </h2>
            <p className="text-base text-black mb-6">For clarity:</p>
            <div className="space-y-6">
              {definitions.map((def, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {def.term}
                  </h3>
                  <p className="text-base text-black">{def.definition}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 9: Commitment to Transparency */}
          <section id="transparency" className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6">
              9. Commitment to Transparency
            </h2>
            <p className="text-base text-black mb-6">We will:</p>
            <ul className="space-y-4">
              {transparencyCommitments.map((commitment, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-black mr-3">•</span>
                  <p className="text-base text-black">{commitment}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Footer Message */}
          <div className="border border-gray-300 p-6 text-center">
            <p className="text-lg text-black mb-4">
              If you ever have questions, concerns, or suggestions about how we
              can further improve child safety on Talkam, please reach out to
              our Child Safety Officer at{" "}
              <a href="mailto:childsafety@talkam.net" className="underline">
                childsafety@talkam.net
              </a>
            </p>
            <p className="text-base text-black">
              Thank you for helping us maintain a safe space for everyone.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

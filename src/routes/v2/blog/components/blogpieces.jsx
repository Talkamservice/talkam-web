import { useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import PropTypes from "prop-types";
import { DsEyebrow } from "../../../../components/v2/badge";
import { V2 } from "../../../../constants/v2routes";
import { BLOG_COLORS } from "../../../../constants/journal";
import { useSubscribeNewsletterMutation } from "../../../../services/v2/journalApiSlice";

/** Cover artwork. The deck leaves these as empty image drop-slots, so the
 *  article's category gradient stands in until real cover images land. */
export const ArticleCover = ({ article, className, children }) => (
  <div
    className={classNames("relative overflow-hidden bg-brand-25", className)}
    style={{ background: article.cover }}
  >
    {children}
  </div>
);

export const AuthorAvatar = ({ article, size = 32, textClass = "text-caption" }) => (
  <span
    className={classNames(
      "flex shrink-0 items-center justify-center rounded-full font-extraboldNunito text-white",
      textClass
    )}
    style={{
      width: size,
      height: size,
      background: BLOG_COLORS[article.tone].avatar,
    }}
  >
    {article.authorInitials}
  </span>
);

/** Solid category pill, used over cover art. */
export const CategoryPill = ({ article, className }) => (
  <span
    className={classNames(
      "rounded-full px-[11px] py-[5px] text-[10.5px] font-extraboldNunito tracking-[0.04em] text-white",
      "whitespace-nowrap shadow-[0_4px_10px_rgba(20,27,52,0.2)]",
      className
    )}
    style={{ backgroundColor: BLOG_COLORS[article.tone].hex }}
  >
    {article.category}
  </span>
);

/** Tinted category pill, used on light backgrounds. */
export const CategoryTint = ({ article, className }) => (
  <span
    className={classNames(
      "inline-block whitespace-nowrap rounded-full px-[13px] py-1.5 text-[11.5px] font-extraboldNunito tracking-[0.04em]",
      className
    )}
    style={{
      backgroundColor: BLOG_COLORS[article.tone].tint,
      color: BLOG_COLORS[article.tone].hex,
    }}
  >
    {article.category}
  </span>
);

/** Standard article card used in the index grid and the related rail. */
export const ArticleCard = ({ article, compact }) => (
  <Link
    to={V2.blogPost(article.slug)}
    className={classNames(
      "v2-card-lift flex flex-col overflow-hidden rounded-[18px] border border-black/[0.07] bg-white",
      "shadow-[0_2px_10px_rgba(20,27,52,0.04)]"
    )}
  >
    <ArticleCover article={article} className={compact ? "h-[170px]" : "h-[200px]"}>
      <CategoryPill article={article} className="absolute left-3.5 top-3.5" />
    </ArticleCover>
    <div
      className={classNames(
        "flex flex-1 flex-col",
        compact ? "p-5" : "px-[22px] pb-5 pt-[22px]"
      )}
    >
      <div
        className={classNames(
          "font-semiboldNunito text-[#9299A8]",
          compact ? "mb-2 text-[11.5px]" : "mb-2.5 text-caption"
        )}
      >
        {article.readTime}
        {compact ? "" : ` · ${article.date}`}
      </div>
      <h3
        className={classNames(
          "font-extraboldNunito leading-[1.3] tracking-[-0.01em] text-navy-800",
          compact ? "text-[17px]" : "mb-2.5 text-[19px]"
        )}
      >
        {article.title}
      </h3>
      {compact ? null : (
        <>
          <p className="mb-5 flex-1 text-[13.5px] leading-[1.6] text-ink-500">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-2.5 border-t border-[#F0F1F5] pt-4">
            <AuthorAvatar article={article} />
            <span className="text-[12.5px] font-boldNunito text-navy-800">
              {article.author}
            </span>
          </div>
        </>
      )}
    </div>
  </Link>
);

/** Teal newsletter band that closes both the index and article views. */
export const NewsletterBand = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribe, { isLoading }] = useSubscribeNewsletterMutation();

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await subscribe({ email, source: "journal" }).unwrap();
      setSubscribed(true);
    } catch {
      // The band has no error state in the deck; the browser's own email
      // validation guards the common case, so a transient failure just leaves
      // the form in place for a retry.
    }
  };

  return (
    <section className="relative overflow-hidden bg-wellness-50 px-6 py-14 lg:px-14 lg:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[90px] -left-16 h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,rgba(59,168,143,0.18)_0%,transparent_65%)]"
      />
      <div className="relative z-[1] mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-10">
        <div className="max-w-[520px]">
          <DsEyebrow className="mb-2.5 block text-wellness-600">Stay in the loop</DsEyebrow>
          <h2 className="mb-2.5 text-[24px] font-extraboldNunito tracking-[-0.01em] text-navy-800 lg:text-[30px]">
            Wellbeing, in your inbox.
          </h2>
          <p className="text-[14.5px] leading-[1.65] text-[#3E4A52]">
            One thoughtful email a week — new guides, tools, and community stories.
            No noise, unsubscribe anytime.
          </p>
        </div>

        {subscribed ? (
          <div className="flex shrink-0 items-center gap-3 rounded-[14px] bg-white px-[22px] py-4 shadow-[0_8px_20px_rgba(31,107,89,0.12)]">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-wellness-50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3BA88F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </span>
            <span>
              <span className="block text-[14.5px] font-extraboldNunito text-navy-800">
                You&apos;re subscribed!
              </span>
              <span className="block text-[12.5px] text-ink-500">
                Watch your inbox for this week&apos;s edition.
              </span>
            </span>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex w-full shrink-0 flex-wrap gap-2.5 sm:w-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              aria-label="Email address"
              className="h-[52px] w-full min-w-0 flex-1 rounded-ds-md border-[1.5px] border-wellness-600/20 bg-white px-[18px] text-body text-navy-800 outline-none placeholder:text-ink-400 focus:border-wellness-400 sm:w-[260px] sm:flex-none"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="h-[52px] w-full shrink-0 cursor-pointer whitespace-nowrap rounded-ds-md bg-wellness-400 px-[26px] text-body font-extraboldNunito text-white shadow-[0_10px_22px_rgba(59,168,143,0.3)] transition-colors hover:bg-wellness-600 disabled:opacity-60 sm:w-auto"
            >
              {isLoading ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

ArticleCard.propTypes = { article: PropTypes.object.isRequired, compact: PropTypes.bool };

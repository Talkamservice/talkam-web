import { useMemo, useState } from "react";
import { MarketingFooter } from "../../../components/layout/v2/marketingfooter";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { MarketingHero } from "../../../components/layout/v2/marketinglayout";
import { DsEyebrow } from "../../../components/v2/badge";
import { usePageMeta } from "../../../hooks/usePageMeta";
import { V2, JOURNAL_NAV } from "../../../constants/v2routes";
import {
  blogArticles,
  featuredArticle,
  gridArticles,
  BLOG_CATEGORY_ORDER,
} from "../../../fakedata/v2/blog";
import {
  ArticleCard,
  ArticleCover,
  AuthorAvatar,
  CategoryTint,
  NewsletterBand,
} from "./components/blogpieces";

/**
 * The TalkAM Journal — index view.
 * Spec: "TalkAM Blog.dc.html" § INDEX VIEW.
 * Search and category filtering run entirely client-side over the mock
 * article set; no API calls in this phase.
 */
export const V2BlogIndex = () => {
  usePageMeta(
    "The TalkAM Journal — Stories & science for a healthier mind",
    "Practical guides, honest conversations, and research-backed tools — from the therapists and community that make up TalkAM."
  );

  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");

  const chips = useMemo(() => {
    const counts = blogArticles.reduce((acc, article) => {
      acc[article.category] = (acc[article.category] || 0) + 1;
      return acc;
    }, {});
    return [{ key: "all", label: "All", count: blogArticles.length }].concat(
      BLOG_CATEGORY_ORDER.filter((c) => counts[c]).map((c) => ({
        key: c,
        label: c,
        count: counts[c],
      }))
    );
  }, []);

  const visible = useMemo(() => {
    const q = query.toLowerCase().trim();
    return gridArticles
      .filter((a) => category === "all" || a.category === category)
      .filter((a) =>
        q ? `${a.title} ${a.excerpt} ${a.category}`.toLowerCase().includes(q) : true
      );
  }, [category, query]);

  return (
    <>
      {/* HERO */}
      <MarketingHero
        className="bg-ds-hero"
        navCta={{ links: JOURNAL_NAV, active: "Journal", padClassName: "py-5 lg:py-6" }}
        /* Deck: index header is `padding:56px 56px 72px`. */
        innerClassName="flex flex-col items-center pb-16 pt-10 text-center lg:pb-[72px] lg:pt-14"
        glows={[
          "-right-[100px] -top-[140px] h-[560px] w-[560px] bg-[radial-gradient(circle,rgba(1,127,200,0.20)_0%,transparent_65%)]",
          "left-[28%] -bottom-[180px] h-[460px] w-[460px] bg-[radial-gradient(circle,rgba(59,168,143,0.14)_0%,transparent_65%)]",
        ]}
      >
        <span className="mb-6 inline-flex items-center rounded-full border border-brand-400/[0.32] bg-brand-400/[0.16] px-4 py-2">
          <DsEyebrow className="text-brand-200">The TalkAM Journal</DsEyebrow>
        </span>
        <h1 className="mb-[18px] max-w-[780px] text-[34px] font-blackNunito leading-[1.06] tracking-[-0.02em] text-white sm:text-[44px] lg:text-[58px]">
          Stories &amp; science for a{" "}
          <span className="bg-gradient-to-r from-brand-200 to-wellness-400 bg-clip-text text-transparent">
            healthier mind
          </span>
          .
        </h1>
        <p className="mb-8 max-w-[560px] text-[15px] leading-[1.7] text-white/60 lg:text-[17px]">
          Practical guides, honest conversations, and research-backed tools — from
          the therapists and community that make up TalkAM.
        </p>

        <form
          role="search"
          onSubmit={(e) => e.preventDefault()}
          className="flex w-full max-w-[440px] items-center gap-2.5 rounded-full bg-white py-1.5 pl-5 pr-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9299A8" strokeWidth="2" className="shrink-0">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, topics, guides…"
            aria-label="Search articles"
            className="min-w-0 flex-1 border-none bg-transparent p-0 text-body text-navy-800 outline-none placeholder:text-ink-400 focus:ring-0"
          />
          <button
            type="submit"
            className="h-[42px] shrink-0 cursor-pointer rounded-full bg-brand-400 px-[22px] text-[13px] font-extraboldNunito text-white transition-colors hover:bg-brand-600"
          >
            Search
          </button>
        </form>
      </MarketingHero>

      {/* EDITOR'S PICK */}
      <section className="bg-white px-6 pb-10 pt-14 lg:px-14">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-5 flex items-center gap-2">
            <span className="h-4 w-1 rounded-[2px] bg-[#C79A3B]" />
            <DsEyebrow className="text-[#C79A3B]">Editor&apos;s pick</DsEyebrow>
          </div>

          <Link
            to={V2.blogPost(featuredArticle.slug)}
            className="v2-card-lift flex flex-col overflow-hidden rounded-[22px] border border-black/[0.07] bg-white shadow-[0_4px_16px_rgba(20,27,52,0.05)] lg:flex-row lg:gap-10"
          >
            <ArticleCover
              article={featuredArticle}
              className="h-[220px] shrink-0 sm:h-[280px] lg:h-auto lg:w-[560px]"
            />
            <div className="flex flex-1 flex-col justify-center p-7 lg:py-10 lg:pl-0 lg:pr-11">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <CategoryTint article={featuredArticle} />
                <span className="text-[12.5px] font-semiboldNunito text-[#9299A8]">
                  {featuredArticle.readTime} · {featuredArticle.date}
                </span>
              </div>
              <h2 className="mb-3.5 text-[24px] font-extraboldNunito leading-[1.15] tracking-[-0.015em] text-navy-800 lg:text-[34px]">
                {featuredArticle.title}
              </h2>
              <p className="mb-6 max-w-[520px] text-[15.5px] leading-[1.7] text-[#5B6577]">
                {featuredArticle.excerpt}
              </p>
              <div className="flex items-center gap-3">
                <AuthorAvatar article={featuredArticle} size={44} textClass="text-[15px]" />
                <div>
                  <div className="text-body font-extraboldNunito text-navy-800">
                    {featuredArticle.author}
                  </div>
                  <div className="text-caption text-[#9299A8]">
                    {featuredArticle.authorRole}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* CATEGORY FILTER */}
      <section className="bg-white px-6 pb-8 pt-3 lg:px-14">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-wrap gap-2.5 border-y border-[#EDEFF3] py-3.5">
            {chips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => setCategory(chip.key)}
                aria-pressed={category === chip.key}
                className={classNames(
                  "v2-chip cursor-pointer whitespace-nowrap rounded-full border-[1.5px] px-[17px] py-[9px] text-[13px]",
                  category === chip.key
                    ? "border-navy-800 bg-navy-800 font-extraboldNunito text-white"
                    : "border-[#E4E7ED] bg-white font-boldNunito text-[#5B6577]"
                )}
              >
                {chip.label}
                <span className="ml-1.5 font-boldNunito opacity-55">{chip.count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="bg-white px-6 pb-20 pt-3 lg:px-14">
        <div className="mx-auto max-w-[1440px]">
          {visible.length ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            /* Empty state — the deck has no explicit design for a zero-result
               search, so this follows the DS empty-state tone. */
            <div className="rounded-ds-lg border border-[#EDEFF3] bg-ink-50 px-6 py-16 text-center">
              <div className="mb-2 text-h3 font-extraboldNunito text-navy-800">
                No articles found
              </div>
              <p className="mx-auto mb-6 max-w-[380px] text-body text-ink-500">
                Nothing matches that search yet. Try a different phrase, or browse
                everything in the Journal.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                }}
                className="cursor-pointer rounded-ds-md bg-brand-400 px-5 py-3 text-body font-extraboldNunito text-white transition-colors hover:bg-brand-600"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      <NewsletterBand />
      <MarketingFooter variant="journal" />
    </>
  );
};

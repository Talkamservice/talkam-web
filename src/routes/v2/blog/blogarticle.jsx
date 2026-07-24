import { useMemo } from "react";
import { MarketingFooter } from "../../../components/layout/v2/marketingfooter";
import { Link, useParams, Navigate } from "react-router-dom";
import { MarketingNav } from "../../../components/layout/v2/marketingnav";
import { DsButton } from "../../../components/v2/button";
import { usePageMeta } from "../../../hooks/usePageMeta";
import { V2, APP_STORE_URL, JOURNAL_NAV } from "../../../constants/v2routes";
import { BLOG_COLORS } from "../../../constants/journal";
import { useGetJournalArticleQuery } from "../../../services/v2/journalApiSlice";
import {
  ArticleCard,
  ArticleCover,
  AuthorAvatar,
  CategoryTint,
  NewsletterBand,
} from "./components/blogpieces";

/**
 * The TalkAM Journal — article view.
 * Spec: "TalkAM Blog.dc.html" § ARTICLE VIEW.
 * Body blocks are p / h2 / quote / callout / list; h2s also drive the sticky
 * "In this article" table of contents.
 */

const Block = ({ block, sectionIndex }) => {
  switch (block.type) {
    case "h2":
      return (
        <h2
          id={`sec-${sectionIndex}`}
          className="mb-4 mt-11 scroll-mt-24 text-[22px] font-extraboldNunito tracking-[-0.01em] text-navy-800 lg:text-[26px]"
        >
          {block.text}
        </h2>
      );
    case "quote":
      return (
        <blockquote className="my-8 border-l-4 border-brand-400 py-1.5 pl-7 text-[19px] font-extraboldNunito leading-[1.4] tracking-[-0.01em] text-navy-800 lg:text-[22px]">
          {block.text}
        </blockquote>
      );
    case "callout":
      return (
        <div className="my-7 flex gap-3.5 rounded-ds-lg border border-wellness-400/25 bg-wellness-50 px-6 py-[22px]">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-wellness-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </span>
          <div>
            <div className="mb-1 text-caption font-extraboldNunito tracking-[0.04em] text-wellness-600">
              TRY THIS
            </div>
            <div className="text-[14.5px] leading-[1.65] text-wellness-600">{block.text}</div>
          </div>
        </div>
      );
    case "list":
      return (
        <ul className="mb-[22px] flex list-none flex-col gap-3 p-0">
          {block.items.map((item) => (
            <li key={item} className="relative pl-[30px] text-[16px] leading-[1.7] text-[#3E4A52]">
              <span
                aria-hidden="true"
                className="absolute left-1.5 top-[9px] h-2 w-2 rounded-full bg-brand-400"
              />
              {item}
            </li>
          ))}
        </ul>
      );
    default:
      return (
        <p className="mb-[22px] text-[16.5px] leading-[1.85] text-[#3E4A52]">{block.text}</p>
      );
  }
};

export const V2BlogArticle = () => {
  const { slug } = useParams();
  const { data, isLoading, isError } = useGetJournalArticleQuery(slug);
  const article = data?.article;

  // Compute before the early return so hook order stays stable.
  const { blocks, toc } = useMemo(() => {
    if (!article) return { blocks: [], toc: [] };
    let sectionIndex = 0;
    const withIndex = article.body.map((block) => ({
      block,
      sectionIndex: block.type === "h2" ? sectionIndex++ : -1,
    }));
    return {
      blocks: withIndex,
      toc: withIndex
        .filter(({ block }) => block.type === "h2")
        .map(({ block, sectionIndex: i }) => ({ text: block.text, idx: i })),
    };
  }, [article]);

  usePageMeta(
    article ? `${article.title} — The TalkAM Journal` : "Article not found — TalkAM",
    article?.excerpt
  );

  // A 404 (or a genuinely missing article once loaded) sends the reader back to
  // the index; while the fetch is in flight we hold the page rather than flash a
  // redirect.
  if (isError) return <Navigate to={V2.blog} replace />;
  if (isLoading || !article) return null;

  const related = data?.related ?? [];
  const accent = BLOG_COLORS[article.tone].hex;

  return (
    <>
      <div className="bg-navy-800">
        <MarketingNav links={JOURNAL_NAV} active="Journal" padClassName="py-5 lg:py-6" />
      </div>

      <article className="bg-white">
        {/* HEADER */}
        <header className="mx-auto max-w-[760px] px-6 pb-[30px] pt-11">
          <nav
            aria-label="Breadcrumb"
            className="mb-[22px] flex items-center gap-2 text-[12.5px] font-semiboldNunito text-[#9299A8]"
          >
            <Link to={V2.blog} className="font-boldNunito text-brand-400 hover:text-brand-600">
              Journal
            </Link>
            <span>/</span>
            <span className="font-boldNunito" style={{ color: accent }}>
              {article.category}
            </span>
          </nav>

          <CategoryTint article={article} className="mb-[18px]" />

          <h1 className="mb-[18px] text-[30px] font-blackNunito leading-[1.12] tracking-[-0.02em] text-navy-800 [text-wrap:pretty] sm:text-[36px] lg:text-[44px]">
            {article.title}
          </h1>
          <p className="mb-7 text-[17px] font-mediumNunito leading-[1.6] text-[#5B6577] lg:text-[19px]">
            {article.excerpt}
          </p>

          <div className="flex items-center gap-3.5">
            <AuthorAvatar article={article} size={48} textClass="text-[16px]" />
            <div>
              <div className="text-[14.5px] font-extraboldNunito text-navy-800">
                {article.author}
              </div>
              <div className="text-[12.5px] text-[#9299A8]">
                {article.authorRole} · {article.readTime} · {article.date}
              </div>
            </div>
          </div>
        </header>

        {/* COVER */}
        <div className="mx-auto max-w-[1000px] px-6 pb-2">
          <ArticleCover
            article={article}
            className="h-[240px] rounded-[22px] shadow-[0_20px_50px_rgba(20,27,52,0.12)] sm:h-[340px] lg:h-[440px]"
          />
        </div>

        {/* BODY + TOC */}
        <div className="mx-auto flex max-w-[1000px] items-start gap-12 px-6 pb-5 pt-11">
          <aside className="sticky top-8 hidden w-[220px] shrink-0 lg:block">
            <div className="mb-4 text-[11px] font-extraboldNunito tracking-[0.1em] text-[#9299A8]">
              IN THIS ARTICLE
            </div>
            <nav className="flex flex-col gap-3 border-l-2 border-[#EDEFF3] pl-4">
              {toc.map((item) => (
                <a
                  key={item.idx}
                  href={`#sec-${item.idx}`}
                  className="text-[13px] font-semiboldNunito leading-[1.4] text-[#5B6577] hover:text-brand-400"
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </aside>

          <div className="min-w-0 flex-1 lg:max-w-[640px]">
            {blocks.map(({ block, sectionIndex }, i) => (
              <Block key={i} block={block} sectionIndex={sectionIndex} />
            ))}

            {/* IN-APP RESOURCE CTA */}
            <div className="relative my-11 overflow-hidden rounded-ds-xl bg-[linear-gradient(135deg,#0D2240,#141B34)] px-8 py-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-[60px] h-[220px] w-[220px] rounded-full bg-[radial-gradient(circle,rgba(1,127,200,0.28)_0%,transparent_65%)]"
              />
              <div className="relative z-[1]">
                <div className="mb-2.5 text-[11px] font-extraboldNunito tracking-[0.1em] text-brand-200">
                  NEED TO TALK TO SOMEONE?
                </div>
                <h3 className="mb-2.5 text-h2 font-extraboldNunito tracking-[-0.01em] text-white">
                  Support is one tap away.
                </h3>
                <p className="mb-5 max-w-[420px] text-body leading-[1.6] text-white/60">
                  Book a licensed therapist or join a community conversation right
                  inside the TalkAM app.
                </p>
                <div className="flex flex-wrap gap-3">
                  <DsButton
                    href={APP_STORE_URL}
                    target="_blank"
                    rel="noreferrer"
                    variant="inverse"
                    className="rounded-[11px] !text-navy-800"
                  >
                    Get the app
                  </DsButton>
                  <DsButton
                    to={V2.forBusiness}
                    variant="translucent"
                    className="rounded-[11px]"
                  >
                    TalkAM for teams
                  </DsButton>
                </div>
              </div>
            </div>

            {/* AUTHOR CARD */}
            <div className="mt-9 flex items-center gap-4 rounded-ds-lg border border-black/5 bg-ink-50 p-6">
              <AuthorAvatar article={article} size={56} textClass="text-[19px]" />
              <div>
                <div className="mb-1 text-[15px] font-extraboldNunito text-navy-800">
                  {article.author}
                </div>
                <div className="text-[13px] leading-[1.55] text-ink-500">
                  {article.authorBio}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED */}
        <section className="mt-11 bg-ink-50 px-6 py-14 lg:px-14 lg:pb-20">
          <div className="mx-auto max-w-[1440px]">
            <h2 className="mb-7 text-[22px] font-extraboldNunito tracking-[-0.01em] text-navy-800 lg:text-[26px]">
              More from the Journal
            </h2>
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ArticleCard key={item.id} article={item} compact />
              ))}
            </div>
          </div>
        </section>
      </article>

      <NewsletterBand />
      <MarketingFooter variant="journal" />
    </>
  );
};

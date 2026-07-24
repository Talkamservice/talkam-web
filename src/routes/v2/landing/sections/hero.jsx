import { useState } from "react";
import classNames from "classnames";
import { MarketingHero } from "../../../../components/layout/v2/marketinglayout";
import { PhoneFrame } from "../../../../components/v2/frames";
import { heroFeedPosts } from "../../../../constants/marketing/landing";
import TalkamWordmark from "../../../../assets/svgs/talkam-logo.svg";

/**
 * Landing hero — spec: "TalkAM Landing Page.dc.html" § 1C › HERO.
 * Copy + waitlist form on the left, floating community-feed phone on the right.
 */

const AUDIENCES = [
  { id: "individual", label: "I'm an Individual", cta: "Join the Waitlist" },
  { id: "therapist", label: "I'm a Therapist", cta: "Apply as a Professional" },
];

const WaitlistForm = () => {
  const [audience, setAudience] = useState("individual");
  const [submitted, setSubmitted] = useState(false);
  const isTherapist = audience === "therapist";
  const submitLabel = AUDIENCES.find((a) => a.id === audience).cta;

  // UI-only: no request is made. API wiring lands in a later phase.
  const onSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-[460px] rounded-ds-xl bg-white p-[26px] shadow-[0_40px_90px_rgba(0,0,0,0.45)]">
        <div className="flex items-center gap-3.5 py-1.5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-wellness-50">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3BA88F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </span>
          <div>
            <div className="text-h4 font-extraboldNunito text-navy-800">
              You&apos;re on the list!
            </div>
            <div className="text-[13px] text-ink-400">
              We&apos;ll email you when early access opens.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[460px] rounded-ds-xl bg-white p-[26px] shadow-[0_40px_90px_rgba(0,0,0,0.45)]">
      <div
        role="tablist"
        aria-label="Waitlist audience"
        className="mb-4 inline-flex gap-0.5 rounded-full bg-[#F0F1F5] p-1"
      >
        {AUDIENCES.map((option) => (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={audience === option.id}
            onClick={() => setAudience(option.id)}
            className={classNames(
              "cursor-pointer whitespace-nowrap rounded-full px-4 py-[11px] text-[12.5px] transition-colors sm:px-[18px]",
              audience === option.id
                ? "bg-navy-800 font-extraboldNunito text-white"
                : "font-boldNunito text-ink-500"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex flex-wrap gap-2.5">
        {isTherapist ? (
          <input
            type="text"
            required
            placeholder="Full name"
            className="h-[50px] w-full rounded-ds-md border-[1.5px] border-ink-200 bg-ink-50 px-4 text-body text-navy-800 placeholder:text-ink-400 focus:border-brand-400 focus:shadow-focus-brand"
          />
        ) : null}
        <input
          type="email"
          required
          placeholder={isTherapist ? "Email address" : "Enter your email"}
          className="h-[50px] min-w-0 flex-1 basis-[220px] rounded-ds-md border-[1.5px] border-ink-200 bg-ink-50 px-4 text-body text-navy-800 placeholder:text-ink-400 focus:border-brand-400 focus:shadow-focus-brand"
        />
        {isTherapist ? (
          <input
            type="tel"
            required
            placeholder="Phone number"
            className="h-[50px] min-w-0 flex-1 basis-[130px] rounded-ds-md border-[1.5px] border-ink-200 bg-ink-50 px-4 text-body text-navy-800 placeholder:text-ink-400 focus:border-brand-400 focus:shadow-focus-brand"
          />
        ) : null}
        <button
          type="submit"
          className={classNames(
            "h-[50px] cursor-pointer whitespace-nowrap rounded-ds-md bg-brand-400 px-[22px] text-body font-extraboldNunito text-white",
            "shadow-[0_8px_20px_rgba(1,127,200,0.28)] transition-colors hover:bg-brand-600",
            isTherapist ? "w-full" : ""
          )}
        >
          {submitLabel}
        </button>
      </form>

      <p className="mt-3 text-[11px] font-semiboldNunito text-[#9A9A9A]">
        🔒 Free · No spam · 10K+ already in the community
      </p>
    </div>
  );
};

const FeedPost = ({ post }) => (
  <div className="rounded-[14px] bg-white p-[13px] shadow-[0_1px_3px_rgba(20,27,52,0.05)]">
    <div className="mb-2 flex items-center gap-2">
      <span className={classNames("h-[30px] w-[30px] shrink-0 rounded-full", post.avatar)} />
      <div>
        <div className="text-caption font-extraboldNunito text-navy-800">
          {post.author} ·{" "}
          <span
            className={classNames(
              "font-boldNunito",
              post.topicTone === "teal" ? "text-wellness-400" : "text-brand-400"
            )}
          >
            {post.topic}
          </span>
        </div>
        <div className="text-[10px] text-[#9299A8]">{post.timeAgo}</div>
      </div>
    </div>
    <p className="mb-2.5 text-caption leading-[1.55] text-[#3E4A52]">{post.body}</p>
    <div className="flex gap-4 text-[11px] font-boldNunito text-[#9299A8]">
      <span>♥ {post.likes}</span>
      <span>💬 {post.comments}</span>
      <span>↗ Share</span>
    </div>
  </div>
);

export const LandingHero = () => (
  <MarketingHero
    className="bg-ds-hero"
    /* Deck: the 1C hero band is `padding:52px 72px 80px` — 72px, not the 56px
       the other bands use. */
    padClassName="px-6 lg:px-[72px]"
    innerClassName="flex flex-col items-center gap-12 pb-16 pt-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:pb-20 lg:pt-[52px]"
    glows={[
      "-right-[100px] -top-[120px] h-[640px] w-[640px] bg-[radial-gradient(circle,rgba(1,127,200,0.22)_0%,transparent_65%)]",
      "left-[20%] -bottom-[200px] h-[560px] w-[560px] bg-[radial-gradient(circle,rgba(59,168,143,0.14)_0%,transparent_65%)]",
    ]}
  >
    <div className="w-full max-w-[620px] flex-1">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-400/[0.16] px-4 py-2">
        <span className="v2-live-dot h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
        <span className="text-[11.5px] font-extraboldNunito tracking-[0.1em] text-brand-200">
          COMMUNITY + MENTAL WELLNESS, FUSED
        </span>
      </div>

      <h1 className="mb-5 text-[42px] font-blackNunito leading-[1.05] tracking-[-0.03em] text-white [text-shadow:0_2px_40px_rgba(1,127,200,0.3)] sm:text-[56px] lg:text-[76px] lg:leading-none">
        Your community and your{" "}
        <span className="bg-gradient-to-r from-brand-200 to-wellness-400 bg-clip-text text-transparent">
          therapist
        </span>
        , in one app.
      </h1>

      <p className="mb-7 max-w-[480px] text-[15px] leading-[1.7] text-white/60 lg:text-[17px]">
        Talk freely, find your people, and book real licensed support — all from
        the TalkAM app, coming soon to iOS and Android.
      </p>

      <WaitlistForm />
    </div>

    {/* Hero phone — community feed */}
    <div className="v2-float relative shrink-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgba(1,127,200,0.32)_0%,transparent_70%)] blur-[14px]"
      />
      <PhoneFrame hero className="relative">
        {/* status + header */}
        <div className="bg-brand-400 px-[18px] pb-3 pt-3.5 text-white">
          <div className="mb-3 flex items-center justify-between text-[11px] font-boldNunito">
            <span>9:41</span>
            <span>●●● ▪</span>
          </div>
          <div className="flex items-center justify-between">
            <img
              src={TalkamWordmark}
              alt="TalkAM"
              className="h-[18px] w-auto [filter:brightness(0)_invert(1)]"
            />
            <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white/25 text-[13px] font-extraboldNunito">
              A
            </span>
          </div>
        </div>

        {/* tabs */}
        <div className="flex gap-[18px] border-b border-[#EDEFF3] bg-white px-[18px] pb-2 pt-3">
          <span className="border-b-[2.5px] border-brand-400 pb-2 text-[13px] font-extraboldNunito text-navy-800">
            For You
          </span>
          <span className="pb-2 text-[13px] font-semiboldNunito text-[#9299A8]">Following</span>
          <span className="pb-2 text-[13px] font-semiboldNunito text-[#9299A8]">Communities</span>
        </div>

        {/* feed */}
        <div className="flex flex-1 flex-col gap-2.5 overflow-hidden p-3">
          {heroFeedPosts.map((post) => (
            <FeedPost key={post.id} post={post} />
          ))}
        </div>

        {/* bottom nav */}
        <div className="flex justify-around border-t border-[#EDEFF3] bg-white pb-3.5 pt-2.5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#017FC8" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4C8D4" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4C8D4" strokeWidth="2">
            <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4C8D4" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
      </PhoneFrame>
    </div>
  </MarketingHero>
);

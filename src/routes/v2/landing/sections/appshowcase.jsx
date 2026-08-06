import classNames from "classnames";
import PropTypes from "prop-types";
import { DsEyebrow } from "../../../../components/v2/badge";
import { appShowcaseCards } from "../../../../constants/marketing/landing";
import ShowcaseCommunity from "../../../../assets/images/inside-the-app-1.png";
import ShowcaseSafety from "../../../../assets/images/inside-the-app-2.png";
import ShowcaseTherapists from "../../../../assets/images/inside-the-app-3.png";

/**
 * "Inside the app" — three pre-rendered artwork cards on a decorated canvas.
 * Spec: "TalkAM Landing Page.dc.html" § 1C › APP SHOWCASE, revised.
 *
 * The hand-built PhoneFrame mockups this section used to render were replaced
 * with finished artwork that bakes its own headline into the image, so the
 * per-phone captions went with them — they would have duplicated copy that is
 * already in the pixels. See `appShowcaseCards` for why each card crops to a
 * different height.
 *
 * The decorative layer sits BEHIND the cards rather than around them. The cards
 * are fully opaque, so anything they cover is simply hidden and the artwork can
 * never be obscured; the decor shows through exactly where the ragged bottom
 * edge and the side margins leave room for it.
 */

const CARD_ART = {
  community: ShowcaseCommunity,
  safety: ShowcaseSafety,
  therapists: ShowcaseTherapists,
};

/* Reveal delays per card. `.v2-reveal-in` animates with `both`, so a delay
   holds the armed (hidden) state rather than flashing the element first. */
const CARD_DELAY = ["", "[animation-delay:110ms]", "[animation-delay:220ms]"];

/** Small pill pairing an emoji with a line of product copy. */
const EmojiChip = ({ emoji, children, className }) => (
  <span
    className={classNames(
      "inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white/90 py-2 pl-2.5 pr-3.5",
      "text-[11.5px] font-boldNunito text-navy-800 shadow-[0_6px_18px_rgba(20,27,52,0.10)]",
      "ring-1 ring-black/[0.04] backdrop-blur-[2px]",
      className
    )}
  >
    <span className="text-[15px] leading-none">{emoji}</span>
    {children}
  </span>
);

EmojiChip.propTypes = {
  emoji: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

/** Feather-style icon in a tinted tile — matches the icon signature used across v2. */
const IconTile = ({ tint, stroke, children, className }) => (
  <span
    className={classNames(
      "inline-flex h-9 w-9 items-center justify-center rounded-ds-md shadow-[0_4px_12px_rgba(20,27,52,0.07)]",
      tint,
      className
    )}
  >
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  </span>
);

IconTile.propTypes = {
  tint: PropTypes.string,
  stroke: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

/**
 * The decorated canvas. Everything here is inert: `aria-hidden` and
 * non-interactive, sitting at the base of the stacking context so the cards
 * always paint over it.
 */
const ShowcaseDecor = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
    {/* Ambient glows — house vocabulary: circle, transparent 65%, negative offset.
        Alpha stays under the 0.18 ceiling the light bands elsewhere use. */}
    <div className="absolute -right-[120px] -top-[90px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(1,127,200,0.16)_0%,transparent_65%)]" />
    <div className="absolute -bottom-[160px] -left-[110px] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(59,168,143,0.15)_0%,transparent_65%)]" />
    <div className="absolute left-1/2 top-[38%] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(1,127,200,0.07)_0%,transparent_70%)]" />

    {/* Breathing rings — the exhale/inhale motif, upper left. Offset so the
        section edge cuts them at their centre: a clean half-circle reads as
        deliberate, where clipping two-thirds of a ring reads as a mistake.
        Sits high enough to clear the card row, which is what lets it survive at
        1024–1279 where the row uses the full measure and there is no gutter. */}
    <svg
      className="absolute -left-[130px] top-[36px] hidden h-[240px] w-[240px] text-brand-200/45 lg:block"
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <circle cx="100" cy="100" r="34" />
      <circle cx="100" cy="100" r="58" strokeDasharray="3 7" />
      <circle cx="100" cy="100" r="82" />
    </svg>

    {/* Sprout — growth, lower left, sitting under the shortest card. */}
    <svg
      className="absolute bottom-[90px] left-[6px] hidden h-[96px] w-[96px] text-wellness-400/40 xl:block"
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M60 104V52" />
      <path d="M60 74c0-15-11-27-26-27-1 15 11 27 26 27z" />
      <path d="M60 62c0-13 10-24 23-24 1 13-10 24-23 24z" />
    </svg>

    {/* Lotus — right margin, opposite the rings. */}
    <svg
      className="absolute right-[6px] top-[300px] hidden h-[96px] w-[96px] text-brand-200/45 xl:block"
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M60 86c0-20 0-38 0-58 14 14 14 40 0 58z" />
      <path d="M60 86c-14-18-14-44 0-58" />
      <path d="M60 86c-12-16-30-24-46-22 4 16 26 26 46 22z" />
      <path d="M60 86c12-16 30-24 46-22-4 16-26 26-46 22z" />
    </svg>

    {/* Mood curve — a week of check-ins as a soft line, drifting under the trio.
        Unlike the other vectors this one is MEANT to run behind the cards: an
        unbroken line disappearing behind a card is a depth cue, where a bloom
        cut in half is just a clipped bloom. `data-behind` exempts it from the
        decor-overlap check. */}
    <svg
      data-behind="true"
      className="absolute bottom-[40px] left-1/2 hidden h-[90px] w-[880px] -translate-x-1/2 text-brand-400/25 lg:block"
      viewBox="0 0 880 90"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M0 62C90 62 120 24 210 24s120 40 210 40 120-46 210-46 160 30 250 30" />
    </svg>

    {/* Chat bubble — the community half of the promise, lower right. */}
    <svg
      className="absolute bottom-[150px] right-[12px] hidden h-[88px] w-[88px] text-wellness-400/35 xl:block"
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    >
      <path d="M84 58a8 8 0 0 1-8 8H34L16 84V24a8 8 0 0 1 8-8h52a8 8 0 0 1 8 8z" />
      <path d="M34 38h32M34 50h20" strokeLinecap="round" />
    </svg>
  </div>
);

/**
 * One artwork card, with its emoji moment hung off the bottom.
 *
 * The chip is positioned against the CARD, not the row: `top-full` resolves to
 * this card's own bottom edge, so it tracks each card's differing crop height
 * automatically. Positioning the chips against the row instead — in the side
 * margins or by percentage — collides, because the margins measure ~137px
 * against chips 134–199px wide and a row-relative percentage can't know where
 * any individual card ends.
 */
const ShowcaseCard = ({ card, index }) => (
  <li
    className={classNames(
      "v2-reveal relative shrink-0 snap-center",
      /* Width ladder for the filmstrip. The `max(...,272px)` floor matters on
         320px phones, where a flat 78vw yields a 250px card — narrow enough that
         the baked headline drops to 31% of its authored scale. From sm up the
         card takes a fixed 420px instead of a vw slice, so a 640–1023px tablet
         stops showing one 340px card marooned in empty space. */
      "w-[max(78vw,272px)] max-w-[380px] sm:w-[420px] sm:max-w-none lg:w-auto",
      CARD_DELAY[index]
    )}
  >
    <h3 className="sr-only">{card.title}</h3>
    <p className="sr-only">{card.body}</p>
    <div
      className={classNames(
        "v2-card-lift relative w-full overflow-hidden rounded-ds-2xl",
        /* Card 1's artwork is pure white, so the hairline — not the fill — is
           what separates it from the canvas. It reads on the dark cards too. */
        "shadow-e3 ring-1 ring-black/[0.07]",
        card.aspect
      )}
    >
      <img
        src={CARD_ART[card.key]}
        alt={card.alt}
        width={804}
        height={1748}
        loading="lazy"
        decoding="async"
        /* Top-anchored cover crop: the artwork keeps its own width and is cut
           from the bottom, where the phone was already bleeding off frame. */
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
    </div>
    <EmojiChip
      emoji={card.chip.emoji}
      className={classNames("v2-float absolute left-3 top-full mt-3", CARD_DELAY[index])}
    >
      {card.chip.label}
    </EmojiChip>
  </li>
);

ShowcaseCard.propTypes = {
  card: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

export const AppShowcase = () => (
  <section
    id="app"
    /* Lands on brand-25, which is the DownloadBanner's own fill, so the two
       bands read as one gradient rather than two slabs. */
    className="relative scroll-mt-20 overflow-hidden bg-[linear-gradient(180deg,#F7F9FC_0%,#F1F5FB_46%,#EEF4FC_100%)] px-6 py-16 lg:px-14 lg:py-[88px]"
  >
    <ShowcaseDecor />

    <div className="relative z-[1] mx-auto max-w-[1440px]">
      <div className="v2-reveal mb-2 text-center">
        <DsEyebrow className="text-brand-400">Inside the app</DsEyebrow>
      </div>
      <h2 className="v2-reveal mb-2 text-center text-[30px] font-extraboldNunito tracking-[-0.01em] text-navy-800 lg:text-[38px]">
        Everything, in your pocket.
      </h2>
      <p className="mx-auto mb-7 max-w-[560px] text-center text-[15px] leading-[1.6] text-ink-500">
        From community conversations to booking a licensed therapist — the whole
        experience lives in one beautifully simple app.
      </p>

      {/* Trust rail — carries the icons, and restores the product detail the
          deleted mockups used to communicate. Below lg it becomes a left-aligned
          stack centred as a block, so the three icons line up instead of each
          row centring independently and leaving the icons stepped. */}
      <div className="v2-reveal mx-auto mb-10 flex w-fit flex-col items-start gap-3 lg:mb-[52px] lg:w-auto lg:flex-row lg:flex-wrap lg:items-center lg:justify-center lg:gap-x-7 lg:gap-y-3">
        <span className="flex items-center gap-2.5 text-[12.5px] font-boldNunito text-ink-600">
          <IconTile tint="bg-brand-25" stroke="#017FC8">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </IconTile>
          Anonymous by default
        </span>
        <span className="flex items-center gap-2.5 text-[12.5px] font-boldNunito text-ink-600">
          <IconTile tint="bg-wellness-50" stroke="#3BA88F">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </IconTile>
          Verified therapists
        </span>
        <span className="flex items-center gap-2.5 text-[12.5px] font-boldNunito text-ink-600">
          <IconTile tint="bg-gold-50" stroke="#B8861A">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </IconTile>
          Judgement-free communities
        </span>
      </div>

      {/* Cards. Tops are flush so the three baked headlines land on one shared
          baseline — the artwork's type grid is pixel-identical across the files,
          which is the whole reason the differing crop heights read as designed
          rather than as a mistake. Below lg the trio becomes a snap filmstrip:
          three ~700px-tall posters stacked vertically is 2,100px of scrolling on
          a phone, and swiping one at a time keeps every card above the width at
          which the baked type stops being legible. */}
      {/* `pb-16` reserves room for the chips and `pt-2` for the hover lift: a
          scroll container cannot keep overflow-y visible — setting overflow-x
          to auto forces overflow-y to auto too — so the filmstrip clips
          anything outside its padding box. Without the top padding,
          `v2-card-lift`'s translateY(-6px) shaved 6px off the top of the card
          on hover, squaring off its rounded corners.
          The measure widens in steps rather than all at once — the side vectors
          live in the gutters, so the row can only take space they don't need.
          `lg:gap-6` keeps the 1024 card above 280px, where `gap-8` left it at
          278px; `xl` restores the wider gutter once there is room for it. */}
      <ul
        className={classNames(
          "no-scrollbar -mx-6 flex list-none snap-x snap-mandatory items-start gap-4 overflow-x-auto px-6 pb-16 pt-2",
          "lg:mx-auto lg:mb-6 lg:grid lg:max-w-[1040px] lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0 lg:pt-0",
          /* The measure only widens at 2xl. Below 1536 the page's own
             max-w-[1440px] caps the available width at 1328px, so a wider row
             buys card size by eating the gutters the side vectors occupy — and
             a half-hidden lotus costs more than 40px of card. Past 1536 the
             container centres and the space appears outside it for free. */
          "xl:gap-8 2xl:max-w-[1280px]"
        )}
      >
        {appShowcaseCards.map((card, i) => (
          <ShowcaseCard key={card.key} card={card} index={i} />
        ))}
      </ul>

      {/* Mobile affordance for the filmstrip. */}
      <p className="mt-4 text-center text-[11.5px] font-boldNunito text-ink-400 lg:hidden">
        Swipe to explore →
      </p>
    </div>
  </section>
);

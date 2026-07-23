import { useEffect } from "react";

/**
 * Drives the `.v2-reveal` entrance animation used across the v2 marketing
 * pages (spec: the decks' `.reveal-1c` / `.reveal` classes).
 *
 * The decks use CSS `animation-timeline: view()`, which leaves elements stuck
 * at opacity 0 whenever the scroll timeline doesn't resolve. An
 * IntersectionObserver is only marginally better — its callbacks are async and
 * get coalesced during fast scrolling, so elements can be skipped and stay
 * invisible.
 *
 * Since an entrance animation is cosmetic but invisible content is a real
 * defect, this uses a deterministic rAF-throttled rect check instead:
 * elements are visible by default, armed (hidden) on mount, then revealed the
 * moment their box enters the viewport. Every scroll and resize re-checks, so
 * nothing can be missed. If JS never runs, the content is simply visible.
 *
 * Re-arms on `key` change so the animation replays on route change.
 */
export const useScrollReveal = (key) => {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll(".v2-reveal"));
    if (!nodes.length) return undefined;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;

    let pending = new Set(nodes);
    nodes.forEach((node) => {
      node.classList.remove("v2-reveal-in");
      node.classList.add("v2-reveal-armed");
    });

    let frame = null;

    const check = () => {
      frame = null;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      pending.forEach((node) => {
        const rect = node.getBoundingClientRect();
        // Reveal as soon as any part of the element is inside the viewport.
        const visible = rect.top < viewportHeight && rect.bottom > 0;
        if (!visible) return;
        node.classList.add("v2-reveal-in");
        node.classList.remove("v2-reveal-armed");
        pending.delete(node);
      });

      if (!pending.size) teardown();
    };

    const schedule = () => {
      if (frame === null) frame = window.requestAnimationFrame(check);
    };

    function teardown() {
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    check();

    return () => {
      teardown();
      // Leave nothing hidden if the page unmounts mid-reveal.
      pending.forEach((node) => node.classList.remove("v2-reveal-armed"));
      pending = new Set();
    };
  }, [key]);
};

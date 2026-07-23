import { useEffect } from "react";

/**
 * Drives the `.v2-reveal` entrance animation used across the v2 marketing
 * pages (spec: the decks' `.reveal-1c` class).
 *
 * The decks use CSS `animation-timeline: view()`. That leaves elements stuck
 * at opacity 0 whenever the scroll timeline doesn't resolve — during a static
 * render, in browsers without scroll-driven animation support, and for any
 * element already past the range on load. So instead: elements are visible by
 * default, this hook *arms* them (hides them) and then reveals each as it
 * scrolls into view. If JS never runs, the content is simply visible.
 *
 * Re-arms on `key` change so the animation replays on route change.
 */
export const useScrollReveal = (key) => {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll(".v2-reveal"));
    if (!nodes.length) return undefined;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") return undefined;

    nodes.forEach((node) => {
      node.classList.remove("v2-reveal-in");
      node.classList.add("v2-reveal-armed");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("v2-reveal-in");
          entry.target.classList.remove("v2-reveal-armed");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [key]);
};

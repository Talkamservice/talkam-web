import { useEffect } from "react";

/**
 * Sets document title + meta description for a route.
 *
 * Used instead of react-helmet on v2 pages: react-helmet still calls
 * UNSAFE_componentWillMount, which logs a deprecation warning under
 * React 18 StrictMode. No new dependency, no console noise.
 */
export const usePageMeta = (title, description) => {
  useEffect(() => {
    if (title) document.title = title;

    if (!description) return undefined;

    let tag = document.querySelector('meta[name="description"]');
    const created = !tag;
    if (created) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      document.head.appendChild(tag);
    }
    const previous = tag.getAttribute("content");
    tag.setAttribute("content", description);

    return () => {
      if (created) tag.remove();
      else if (previous !== null) tag.setAttribute("content", previous);
    };
  }, [title, description]);
};

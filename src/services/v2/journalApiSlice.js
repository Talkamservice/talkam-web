import { apiSliceV2 } from "../../app/api/apiSliceV2";

/**
 * The TalkAM Journal — public blog reads + newsletter capture.
 * Backend: planning-docs/web-api/05-blog.md (api/v2/journal/*).
 *
 * The index list carries no article `body` (cards, editor's pick and related
 * only need card fields); the article view fetches the full body by slug. Search
 * and category filtering stay client-side over the cached list, exactly as the
 * frozen UI already does.
 */
export const journalApiSlice = apiSliceV2.injectEndpoints({
  endpoints: (builder) => ({
    getJournalArticles: builder.query({
      query: () => `/journal/articles`,
      transformResponse: (response) => response?.data ?? [],
      providesTags: ["Journal"],
    }),

    getJournalArticle: builder.query({
      // { article, related } — 404 becomes an error the article page treats as
      // "not found" (redirect to the index).
      query: (slug) => `/journal/articles/${slug}`,
      transformResponse: (response) => response?.data,
      providesTags: ["Journal"],
    }),

    subscribeNewsletter: builder.mutation({
      query: (body) => ({
        url: `/journal/subscribe`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetJournalArticlesQuery,
  useGetJournalArticleQuery,
  useSubscribeNewsletterMutation,
} = journalApiSlice;

import { apiSliceV2 } from "../../app/api/apiSliceV2";

/**
 * Public legal documents — Privacy Policy & Terms of Use (web §06).
 * Backend: planning-docs/web-api/06-marketing-legal.md (api/v2/legal/*).
 *
 * The API returns the structured document exactly as the page consumes it
 * (title, lastUpdated, callout, contact, sections), so no reshaping is needed.
 */
export const legalApiSlice = apiSliceV2.injectEndpoints({
  endpoints: (builder) => ({
    getLegalDocument: builder.query({
      // slug ∈ { "privacy", "terms" }
      query: (slug) => `/legal/documents/${slug}`,
      transformResponse: (response) => response?.data,
      providesTags: ["Legal"],
    }),
  }),
});

export const { useGetLegalDocumentQuery } = legalApiSlice;

import { apiSlice } from "../app/api/apiSlice";

export const getFaqQuestionsSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    faqQuestions: builder.query({
      query: () => ({
        url: `/user/faqs`,
        method: "get",
      }),
    }),
  }),
});

export const { useFaqQuestionsQuery } = getFaqQuestionsSlice;

import { apiSlice } from "../app/api/apiSlice";

export const helpAndInfoSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    faqQuestions: builder.query({
      query: () => ({
        url: `/user/faqs`,
        method: "get",
      }),
    }),
    termsOfUse: builder.query({
      query: () => ({
        url: `/user/terms-and-conditions`,
        method: "get",
      }),
    }),
    privacyPolicy: builder.query({
      query: () => ({
        url: `/user/privacy-policies`,
        method: "get",
      }),
    }),
    rules: builder.query({
      query: () => ({
        url: `/user/guidelines`,
        method: "get",
      }),
    }),
  }),
});

export const {
  useFaqQuestionsQuery,
  useTermsOfUseQuery,
  usePrivacyPolicyQuery,
  useRulesQuery,
} = helpAndInfoSlice;

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
    giveFeedback: builder.mutation({
      query: (feedbackData) => ({
        url: "/user/feedback",
        method: "post",
        body: feedbackData,
        formData: true,
      }),
    }),
  }),
});

export const {
  useFaqQuestionsQuery,
  useTermsOfUseQuery,
  usePrivacyPolicyQuery,
  useRulesQuery,
  useGiveFeedbackMutation,
} = helpAndInfoSlice;

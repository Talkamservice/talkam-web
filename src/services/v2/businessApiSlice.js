import { apiSliceV2 } from "../../app/api/apiSliceV2";

/**
 * TalkAM for Business — auth, company onboarding and invited-member onboarding.
 * Backend: planning-docs/web-api/01-b2b-auth.md (api/v2/business/*).
 *
 * Sign-in, 2FA and password reset are NOT here: they reuse the shared v2 auth
 * endpoints, so they live in ./authApiSliceV2.js alongside the rest of auth.
 */
export const businessApiSlice = apiSliceV2.injectEndpoints({
  endpoints: (builder) => ({
    /* ── Public ──────────────────────────────────────────────────────── */

    getPricingConfig: builder.query({
      query: () => `/business/pricing-config`,
      transformResponse: (response) => response?.data,
    }),

    // Admin-managed industry list for the signup form.
    getIndustries: builder.query({
      query: () => `/business/industries`,
      transformResponse: (response) => response?.data ?? [],
    }),

    registerCompany: builder.mutation({
      query: (body) => ({
        url: `/business/register`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Organization", "Me"],
    }),

    getInvitation: builder.query({
      query: (token) => `/business/invitations/token/${token}`,
      transformResponse: (response) => response?.data,
    }),

    acceptInvitation: builder.mutation({
      query: ({ token, ...body }) => ({
        url: `/business/invitations/token/${token}/accept`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Me"],
    }),

    /* ── Company setup (admin) ───────────────────────────────────────── */

    verifyDomain: builder.mutation({
      query: (body) => ({
        url: `/business/domain/verify`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Organization", "Me"],
    }),

    getOrganization: builder.query({
      query: () => `/business/organization`,
      transformResponse: (response) => response?.data,
      providesTags: ["Organization"],
    }),

    saveSeats: builder.mutation({
      query: (body) => ({
        url: `/business/organization/seats`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Organization"],
    }),

    savePlan: builder.mutation({
      query: (body) => ({
        url: `/business/organization/plan`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Organization"],
    }),

    saveBench: builder.mutation({
      query: (body) => ({
        url: `/business/organization/bench`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Organization"],
    }),

    /* ── Invites (admin) ─────────────────────────────────────────────── */

    getInvitations: builder.query({
      query: (params) => ({ url: `/business/invitations`, params }),
      transformResponse: (response) => response?.data,
      providesTags: ["Invitations"],
    }),

    sendInvitations: builder.mutation({
      query: (body) => ({
        url: `/business/invitations`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Invitations", "Organization"],
    }),

    importRoster: builder.mutation({
      query: (file) => {
        const form = new FormData();
        form.append("file", file);
        return { url: `/business/invitations/import`, method: "POST", body: form };
      },
      transformResponse: (response) => response?.data,
    }),

    resendInvitation: builder.mutation({
      query: (id) => ({ url: `/business/invitations/${id}/resend`, method: "POST" }),
      invalidatesTags: ["Invitations"],
    }),

    revokeInvitation: builder.mutation({
      query: (id) => ({ url: `/business/invitations/${id}/revoke`, method: "POST" }),
      invalidatesTags: ["Invitations", "Organization"],
    }),

    /* ── Invited-member onboarding ───────────────────────────────────── */

    getOnboardingTopics: builder.query({
      query: () => `/business/onboarding/topics`,
      transformResponse: (response) => response?.data?.topics ?? [],
    }),

    saveOnboardingTopics: builder.mutation({
      query: (body) => ({
        url: `/business/onboarding/topics`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Me"],
    }),

    getSelfCheck: builder.query({
      query: () => `/business/self-check`,
      transformResponse: (response) => response?.data,
      providesTags: ["SelfCheck"],
    }),

    saveSelfCheck: builder.mutation({
      query: (body) => ({
        url: `/business/self-check`,
        method: "POST",
        body,
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: ["SelfCheck", "Me"],
    }),
  }),
});

export const {
  useGetPricingConfigQuery,
  useGetIndustriesQuery,
  useRegisterCompanyMutation,
  useGetInvitationQuery,
  useAcceptInvitationMutation,
  useVerifyDomainMutation,
  useGetOrganizationQuery,
  useSaveSeatsMutation,
  useSavePlanMutation,
  useSaveBenchMutation,
  useGetInvitationsQuery,
  useSendInvitationsMutation,
  useImportRosterMutation,
  useResendInvitationMutation,
  useRevokeInvitationMutation,
  useGetOnboardingTopicsQuery,
  useSaveOnboardingTopicsMutation,
  useGetSelfCheckQuery,
  useSaveSelfCheckMutation,
} = businessApiSlice;

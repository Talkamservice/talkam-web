import { apiSliceV2 } from "../../app/api/apiSliceV2";

/**
 * Admin (HR) dashboard.
 * Backend: planning-docs/web-api/03-admin-dashboard.md
 *
 * Every insight endpoint returns ANONYMISED, COMPANY-WIDE figures wrapped as
 * `{ value, cohort, suppressed }`. When `suppressed` is true the value is null
 * because fewer than the configured minimum number of employees contributed —
 * render the written "not enough data yet" state, never a zero.
 *
 * Billing lives in web §07 and is not injected here.
 */
export const adminApiSlice = apiSliceV2.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOverview: builder.query({
      query: () => `/business/insights/overview`,
      transformResponse: (response) => response?.data,
      providesTags: ["AdminInsights"],
    }),

    getTeamNeeds: builder.query({
      query: () => `/business/insights/team-needs`,
      transformResponse: (response) => response?.data,
      providesTags: ["AdminInsights"],
    }),

    getAdminReports: builder.query({
      query: () => `/business/reports`,
      transformResponse: (response) => response?.data,
      providesTags: ["AdminInsights"],
    }),

    getAdminEmployees: builder.query({
      query: (params) => ({ url: `/business/employees`, params }),
      transformResponse: (response) => response?.data,
      providesTags: ["AdminEmployees"],
    }),

    deactivateEmployee: builder.mutation({
      query: (memberId) => ({
        url: `/business/employees/${memberId}/deactivate`,
        method: "POST",
      }),
      invalidatesTags: ["AdminEmployees", "Organization"],
    }),

    reactivateEmployee: builder.mutation({
      query: (memberId) => ({
        url: `/business/employees/${memberId}/reactivate`,
        method: "POST",
      }),
      invalidatesTags: ["AdminEmployees", "Organization"],
    }),

    getAdminTherapists: builder.query({
      query: (params) => ({ url: `/business/therapists`, params }),
      transformResponse: (response) => response?.data,
      providesTags: ["AdminTherapists"],
    }),

    getAdminTherapistDetail: builder.query({
      query: (id) => ({ url: `/business/therapists/${id}` }),
      transformResponse: (response) => response?.data,
      providesTags: ["AdminTherapists"],
    }),

    addTherapistToNetwork: builder.mutation({
      query: (therapistId) => ({ url: `/business/therapists/${therapistId}/add`, method: "POST" }),
      invalidatesTags: ["AdminTherapists"],
    }),

    removeTherapistFromNetwork: builder.mutation({
      query: (therapistId) => ({ url: `/business/therapists/${therapistId}/remove`, method: "POST" }),
      invalidatesTags: ["AdminTherapists"],
    }),

    addOwnTherapist: builder.mutation({
      query: (body) => ({ url: `/business/therapists/own`, method: "POST", body }),
      transformResponse: (response) => response?.data,
      invalidatesTags: ["AdminTherapists", "AdminEmployees", "Organization"],
    }),

    requestTherapistCapacity: builder.mutation({
      query: (body) => ({ url: `/business/therapists/capacity-requests`, method: "POST", body }),
    }),

    getSafetyReports: builder.query({
      query: () => `/business/safety-reports`,
      transformResponse: (response) => response?.data?.reports ?? [],
      providesTags: ["AdminSafety"],
    }),

    getAdminActivity: builder.query({
      query: () => `/business/activity`,
      transformResponse: (response) => response?.data?.activity ?? [],
      providesTags: ["AdminActivity"],
    }),

    updateCompanyProfile: builder.mutation({
      query: (body) => ({
        url: `/business/organization/profile`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Organization", "Me"],
    }),

    saveSessionPolicy: builder.mutation({
      query: (body) => ({
        url: `/business/organization/session-policy`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Organization"],
    }),

    // Danger Zone (web §03 Settings).
    toggleEmployeeAccess: builder.mutation({
      query: (body) => ({ url: `/business/organization/employee-access`, method: "POST", body }),
      invalidatesTags: ["Organization"],
    }),

    cancelSubscription: builder.mutation({
      query: () => ({ url: `/business/organization/cancel-subscription`, method: "POST" }),
      invalidatesTags: ["Organization"],
    }),

    resumeSubscription: builder.mutation({
      query: () => ({ url: `/business/organization/resume-subscription`, method: "POST" }),
      invalidatesTags: ["Organization"],
    }),

    requestOrgDeletion: builder.mutation({
      query: (body) => ({ url: `/business/organization/request-deletion`, method: "POST", body }),
      invalidatesTags: ["Organization"],
    }),

    cancelOrgDeletion: builder.mutation({
      query: () => ({ url: `/business/organization/cancel-deletion`, method: "POST" }),
      invalidatesTags: ["Organization"],
    }),

    uploadCompanyLogo: builder.mutation({
      query: (file) => {
        const form = new FormData();
        form.append("logo", file);
        return { url: `/business/organization/logo`, method: "POST", body: form };
      },
      transformResponse: (response) => response?.data,
      invalidatesTags: ["Organization", "Me"],
    }),

    getAdminNotificationPreferences: builder.query({
      query: () => `/business/notification-preferences`,
      transformResponse: (response) => response?.data,
      providesTags: ["AdminNotificationPreferences"],
    }),

    saveAdminNotificationPreferences: builder.mutation({
      query: (body) => ({
        url: `/business/notification-preferences`,
        method: "POST",
        body,
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: ["AdminNotificationPreferences"],
    }),

    // Billing (web §07) — current plan, usage, current seats, plan catalogue.
    getBilling: builder.query({
      query: () => `/business/billing`,
      transformResponse: (response) => response?.data,
      providesTags: ["AdminBilling"],
    }),

    getBillingInvoices: builder.query({
      query: () => `/business/billing/invoices`,
      transformResponse: (response) => response?.data ?? [],
      providesTags: ["AdminBilling"],
    }),

    // Bank-transfer reconciliation (web §11) — mint the org's dedicated virtual
    // account from a director's BVN/NIN + consent. The raw id goes to the gateway
    // only; the billing summary refetches to show the new account.
    createVirtualAccount: builder.mutation({
      query: (body) => ({
        url: `/business/organization/virtual-account`,
        method: "POST",
        body,
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: ["AdminBilling"],
    }),
  }),
});

/**
 * CSV downloads go through the browser rather than RTK Query — the response is
 * a file, not JSON, and it must carry the bearer token.
 */
export const downloadCsv = async (path, token, filename) => {
  const response = await fetch(`${import.meta.env.VITE_BASE_API_V2_URL}${path}`, {
    headers: { authorization: `Bearer ${token}`, accept: "text/csv" },
  });

  if (!response.ok) throw new Error("download failed");

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const {
  useGetAdminOverviewQuery,
  useGetTeamNeedsQuery,
  useGetAdminReportsQuery,
  useGetAdminEmployeesQuery,
  useDeactivateEmployeeMutation,
  useReactivateEmployeeMutation,
  useGetAdminTherapistsQuery,
  useGetAdminTherapistDetailQuery,
  useAddTherapistToNetworkMutation,
  useRemoveTherapistFromNetworkMutation,
  useAddOwnTherapistMutation,
  useRequestTherapistCapacityMutation,
  useGetSafetyReportsQuery,
  useGetAdminActivityQuery,
  useUpdateCompanyProfileMutation,
  useSaveSessionPolicyMutation,
  useToggleEmployeeAccessMutation,
  useCancelSubscriptionMutation,
  useResumeSubscriptionMutation,
  useRequestOrgDeletionMutation,
  useCancelOrgDeletionMutation,
  useUploadCompanyLogoMutation,
  useGetAdminNotificationPreferencesQuery,
  useSaveAdminNotificationPreferencesMutation,
  useGetBillingQuery,
  useGetBillingInvoicesQuery,
  useCreateVirtualAccountMutation,
} = adminApiSlice;

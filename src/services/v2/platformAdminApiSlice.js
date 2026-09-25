import { apiSliceV2 } from "../../app/api/apiSliceV2";

/**
 * Platform Admin panel (web /platform) — staff-only lane wired to
 * talkam-api's "platform-admin" route group (gated by the platform.role
 * middleware). NOT adminApiSlice.js — that file is the B2B org-Admin (HR)
 * dashboard's slice, a different thing entirely.
 */
export const platformAdminApiSlice = apiSliceV2.injectEndpoints({
  endpoints: (builder) => ({
    getPlatformSession: builder.query({
      query: () => `/platform-admin/session`,
      transformResponse: (response) => response?.data,
    }),

    getPlatformDashboard: builder.query({
      query: () => `/platform-admin/dashboard`,
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformDashboard"],
    }),

    getPlatformNavCounts: builder.query({
      query: () => `/platform-admin/nav-counts`,
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformNavCounts"],
    }),

    getPlatformUsers: builder.query({
      query: (params) => ({ url: `/platform-admin/users`, params }),
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformUsers"],
    }),
    getPlatformUserDetail: builder.query({
      query: (id) => `/platform-admin/users/${id}`,
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformUsers"],
    }),
    getPlatformUserSessions: builder.query({
      query: ({ id, page } = {}) => ({ url: `/platform-admin/users/${id}/sessions`, params: { page } }),
      transformResponse: (response) => response?.data,
    }),
    getPlatformUserMood: builder.query({
      query: (id) => `/platform-admin/users/${id}/mood`,
      transformResponse: (response) => response?.data,
    }),
    getPlatformUserCommunity: builder.query({
      query: (id) => `/platform-admin/users/${id}/community`,
      transformResponse: (response) => response?.data,
    }),
    getPlatformUserActivity: builder.query({
      query: ({ id, page } = {}) => ({ url: `/platform-admin/users/${id}/activity`, params: { page } }),
      transformResponse: (response) => response?.data,
    }),
    getPlatformUserJourney: builder.query({
      query: (id) => `/platform-admin/users/${id}/journey`,
      transformResponse: (response) => response?.data,
    }),
    suspendPlatformUser: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/platform-admin/users/${id}/suspend`, method: "POST", body }),
      invalidatesTags: ["PlatformUsers"],
    }),
    unsuspendPlatformUser: builder.mutation({
      query: (id) => ({ url: `/platform-admin/users/${id}/unsuspend`, method: "POST" }),
      invalidatesTags: ["PlatformUsers"],
    }),
    banPlatformUser: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/platform-admin/users/${id}/ban`, method: "POST", body }),
      invalidatesTags: ["PlatformUsers"],
    }),
    strikePlatformUser: builder.mutation({
      query: (id) => ({ url: `/platform-admin/users/${id}/strike`, method: "POST" }),
      invalidatesTags: ["PlatformUsers"],
    }),
    updatePlatformUser: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/platform-admin/users/${id}`, method: "PUT", body }),
      invalidatesTags: ["PlatformUsers"],
    }),
    deletePlatformUser: builder.mutation({
      query: (id) => ({ url: `/platform-admin/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["PlatformUsers"],
    }),

    getPlatformTherapistVerifications: builder.query({
      query: (params) => ({ url: `/platform-admin/therapist-verification`, params }),
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformTherapistVerification"],
    }),
    startReviewPlatformApplication: builder.mutation({
      query: (id) => ({ url: `/platform-admin/therapist-verification/${id}/start-review`, method: "POST" }),
      invalidatesTags: ["PlatformTherapistVerification"],
    }),
    approvePlatformApplication: builder.mutation({
      query: (id) => ({ url: `/platform-admin/therapist-verification/${id}/approve`, method: "POST" }),
      invalidatesTags: ["PlatformTherapistVerification", "PlatformNavCounts"],
    }),
    rejectPlatformApplication: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/platform-admin/therapist-verification/${id}/reject`, method: "POST", body }),
      invalidatesTags: ["PlatformTherapistVerification", "PlatformNavCounts"],
    }),
    verdictPlatformDocument: builder.mutation({
      query: ({ documentId, ...body }) => ({ url: `/platform-admin/therapist-verification/documents/${documentId}/verdict`, method: "POST", body }),
      invalidatesTags: ["PlatformTherapistVerification"],
    }),

    getPlatformPerformance: builder.query({
      query: (params) => ({ url: `/platform-admin/performance`, params }),
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformPerformance"],
    }),
    updatePlatformPerformanceThreshold: builder.mutation({
      query: (body) => ({ url: `/platform-admin/performance/thresholds`, method: "PUT", body }),
      invalidatesTags: ["PlatformPerformance"],
    }),
    sendPlatformTherapistWarning: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/platform-admin/performance/${id}/warning`, method: "POST", body }),
      invalidatesTags: ["PlatformPerformance"],
    }),
    holdPlatformTherapist: builder.mutation({
      query: (id) => ({ url: `/platform-admin/performance/${id}/hold`, method: "POST" }),
      invalidatesTags: ["PlatformPerformance"],
    }),
    clearHoldPlatformTherapist: builder.mutation({
      query: (id) => ({ url: `/platform-admin/performance/${id}/clear-hold`, method: "POST" }),
      invalidatesTags: ["PlatformPerformance"],
    }),
    reverifyPlatformTherapist: builder.mutation({
      query: (id) => ({ url: `/platform-admin/performance/${id}/reverify`, method: "POST" }),
      invalidatesTags: ["PlatformPerformance"],
    }),
    terminatePlatformTherapist: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/platform-admin/performance/${id}/terminate`, method: "POST", body }),
      invalidatesTags: ["PlatformPerformance"],
    }),

    getPlatformActivityLogs: builder.query({
      query: (params) => ({ url: `/platform-admin/activity-logs`, params }),
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformActivityLogs"],
    }),

    getPlatformGrowth: builder.query({
      query: (range = "12w") => ({ url: `/platform-admin/growth`, params: { range } }),
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformGrowth"],
    }),

    getPlatformBusinesses: builder.query({
      query: (params) => ({ url: `/platform-admin/businesses`, params }),
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformBusinesses"],
    }),

    getPlatformBusiness: builder.query({
      query: (id) => `/platform-admin/businesses/${id}`,
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformBusinesses"],
    }),
    createPlatformBusiness: builder.mutation({
      query: (body) => ({ url: `/platform-admin/businesses`, method: "POST", body }),
      invalidatesTags: ["PlatformBusinesses"],
    }),
    updatePlatformBusiness: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/platform-admin/businesses/${id}`, method: "PUT", body }),
      invalidatesTags: ["PlatformBusinesses"],
    }),
    deletePlatformBusiness: builder.mutation({
      query: (id) => ({ url: `/platform-admin/businesses/${id}`, method: "DELETE" }),
      invalidatesTags: ["PlatformBusinesses"],
    }),
    suspendPlatformBusiness: builder.mutation({
      query: (id) => ({ url: `/platform-admin/businesses/${id}/suspend`, method: "POST" }),
      invalidatesTags: ["PlatformBusinesses"],
    }),
    reactivatePlatformBusiness: builder.mutation({
      query: (id) => ({ url: `/platform-admin/businesses/${id}/reactivate`, method: "POST" }),
      invalidatesTags: ["PlatformBusinesses"],
    }),
    getPlatformBusinessEmployees: builder.query({
      query: ({ id, page } = {}) => ({ url: `/platform-admin/businesses/${id}/employees`, params: { page } }),
      transformResponse: (response) => response?.data,
    }),
    getPlatformBusinessEmployeeDetail: builder.query({
      query: ({ id, memberId }) => `/platform-admin/businesses/${id}/employees/${memberId}`,
      transformResponse: (response) => response?.data,
    }),
    deactivatePlatformEmployee: builder.mutation({
      query: ({ id, memberId }) => ({ url: `/platform-admin/businesses/${id}/employees/${memberId}/deactivate`, method: "POST" }),
    }),
    reactivatePlatformEmployee: builder.mutation({
      query: ({ id, memberId }) => ({ url: `/platform-admin/businesses/${id}/employees/${memberId}/reactivate`, method: "POST" }),
    }),
    invitePlatformEmployee: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/platform-admin/businesses/${id}/employees/invite`, method: "POST", body }),
    }),
    getPlatformBusinessTherapists: builder.query({
      query: ({ id, page } = {}) => ({ url: `/platform-admin/businesses/${id}/therapists`, params: { page } }),
      transformResponse: (response) => response?.data,
    }),
    getPlatformBusinessInvoices: builder.query({
      query: ({ id, page } = {}) => ({ url: `/platform-admin/businesses/${id}/invoices`, params: { page } }),
      transformResponse: (response) => response?.data,
    }),
    getPlatformBusinessActivity: builder.query({
      query: ({ id, page } = {}) => ({ url: `/platform-admin/businesses/${id}/activity`, params: { page } }),
      transformResponse: (response) => response?.data,
    }),

    getPlatformSessions: builder.query({
      query: (params) => ({ url: `/platform-admin/sessions`, params }),
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformSessions"],
    }),

    getPlatformBilling: builder.query({
      query: (page) => ({ url: `/platform-admin/billing`, params: { page } }),
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformBilling"],
    }),

    getPlatformPayouts: builder.query({
      query: (params) => ({ url: `/platform-admin/payouts`, params }),
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformPayouts"],
    }),
    processPlatformPayout: builder.mutation({
      query: (therapistId) => ({ url: `/platform-admin/payouts/${therapistId}/process`, method: "POST" }),
      invalidatesTags: ["PlatformPayouts"],
    }),
    processAllPlatformPayouts: builder.mutation({
      query: () => ({ url: `/platform-admin/payouts/process-all`, method: "POST" }),
      invalidatesTags: ["PlatformPayouts"],
    }),
    getPlatformPayoutLastRun: builder.query({
      query: () => `/platform-admin/payouts/last-run`,
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformPayoutRun"],
    }),

    getPlatformCommunityOverview: builder.query({
      query: () => `/platform-admin/community/overview`,
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformCommunity"],
    }),
    getPlatformPostReports: builder.query({
      query: (params) => ({ url: `/platform-admin/community/post-reports`, params }),
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformCommunity"],
    }),
    resolvePlatformPostReport: builder.mutation({
      query: (id) => ({ url: `/platform-admin/community/post-reports/${id}/resolve`, method: "POST" }),
      invalidatesTags: ["PlatformCommunity"],
    }),
    deletePlatformPostReport: builder.mutation({
      query: (id) => ({ url: `/platform-admin/community/post-reports/${id}`, method: "DELETE" }),
      invalidatesTags: ["PlatformCommunity"],
    }),
    getPlatformCommentReports: builder.query({
      query: (params) => ({ url: `/platform-admin/community/comment-reports`, params }),
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformCommunity"],
    }),
    resolvePlatformCommentReport: builder.mutation({
      query: (id) => ({ url: `/platform-admin/community/comment-reports/${id}/resolve`, method: "POST" }),
      invalidatesTags: ["PlatformCommunity"],
    }),
    deletePlatformCommentReport: builder.mutation({
      query: (id) => ({ url: `/platform-admin/community/comment-reports/${id}`, method: "DELETE" }),
      invalidatesTags: ["PlatformCommunity"],
    }),
    getPlatformGroupReports: builder.query({
      query: (params) => ({ url: `/platform-admin/community/group-reports`, params }),
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformCommunity"],
    }),
    resolvePlatformGroupReport: builder.mutation({
      query: (id) => ({ url: `/platform-admin/community/group-reports/${id}/resolve`, method: "POST" }),
      invalidatesTags: ["PlatformCommunity"],
    }),
    suspendPlatformGroup: builder.mutation({
      query: ({ groupId, ...body }) => ({ url: `/platform-admin/community/groups/${groupId}/suspend`, method: "POST", body }),
      invalidatesTags: ["PlatformCommunity"],
    }),
    banPlatformGroup: builder.mutation({
      query: ({ groupId, ...body }) => ({ url: `/platform-admin/community/groups/${groupId}/ban`, method: "POST", body }),
      invalidatesTags: ["PlatformCommunity"],
    }),
    reactivatePlatformGroup: builder.mutation({
      query: (groupId) => ({ url: `/platform-admin/community/groups/${groupId}/reactivate`, method: "POST" }),
      invalidatesTags: ["PlatformCommunity"],
    }),
    deletePlatformGroup: builder.mutation({
      query: (groupId) => ({ url: `/platform-admin/community/groups/${groupId}`, method: "DELETE" }),
      invalidatesTags: ["PlatformCommunity"],
    }),
    getPlatformCommunityCategories: builder.query({
      query: () => `/platform-admin/community/categories`,
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformCommunity"],
    }),
    createPlatformGroup: builder.mutation({
      query: (body) => ({ url: `/platform-admin/community/groups`, method: "POST", body }),
      invalidatesTags: ["PlatformCommunity"],
    }),
    getPlatformGroupMembers: builder.query({
      query: ({ groupId, ...params }) => ({ url: `/platform-admin/community/groups/${groupId}/members`, params }),
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformCommunity"],
    }),
    updatePlatformGroupMemberRole: builder.mutation({
      query: ({ memberId, role }) => ({ url: `/platform-admin/community/groups/members/${memberId}/role`, method: "PUT", body: { role } }),
      invalidatesTags: ["PlatformCommunity"],
    }),
    suspendPlatformGroupMember: builder.mutation({
      query: (memberId) => ({ url: `/platform-admin/community/groups/members/${memberId}/suspend`, method: "POST" }),
      invalidatesTags: ["PlatformCommunity"],
    }),
    getPlatformGroups: builder.query({
      query: (params) => ({ url: `/platform-admin/community/groups`, params }),
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformCommunity"],
    }),
    updatePlatformGroup: builder.mutation({
      query: ({ groupId, ...body }) => ({ url: `/platform-admin/community/groups/${groupId}`, method: "PUT", body }),
      invalidatesTags: ["PlatformCommunity"],
    }),
    addPlatformGroupMember: builder.mutation({
      query: ({ groupId, ...body }) => ({ url: `/platform-admin/community/groups/${groupId}/members`, method: "POST", body }),
      invalidatesTags: ["PlatformCommunity"],
    }),
    removePlatformGroupMember: builder.mutation({
      query: (memberId) => ({ url: `/platform-admin/community/groups/members/${memberId}`, method: "DELETE" }),
      invalidatesTags: ["PlatformCommunity"],
    }),
    getPlatformGroupMemberReports: builder.query({
      query: (params) => ({ url: `/platform-admin/community/group-member-reports`, params }),
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformCommunity"],
    }),
    resolvePlatformGroupMemberReport: builder.mutation({
      query: (id) => ({ url: `/platform-admin/community/group-member-reports/${id}/resolve`, method: "POST" }),
      invalidatesTags: ["PlatformCommunity"],
    }),
    suspendPlatformReportedMember: builder.mutation({
      query: ({ reportId, ...body }) => ({ url: `/platform-admin/community/group-member-reports/${reportId}/suspend`, method: "POST", body }),
      invalidatesTags: ["PlatformCommunity"],
    }),
    unsuspendPlatformReportedMember: builder.mutation({
      query: (groupMemberId) => ({ url: `/platform-admin/community/group-members/${groupMemberId}/unsuspend`, method: "POST" }),
      invalidatesTags: ["PlatformCommunity"],
    }),
    getPlatformGroupDetail: builder.query({
      query: (groupId) => `/platform-admin/community/groups/${groupId}/detail`,
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformCommunity"],
    }),
    getPlatformGroupReportsForGroup: builder.query({
      query: ({ groupId, ...params }) => ({ url: `/platform-admin/community/groups/${groupId}/group-reports`, params }),
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformCommunity"],
    }),
    getPlatformCommentReportsForGroup: builder.query({
      query: ({ groupId, ...params }) => ({ url: `/platform-admin/community/groups/${groupId}/comment-reports`, params }),
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformCommunity"],
    }),

    getPlatformArticles: builder.query({
      query: (params) => ({ url: `/platform-admin/cms/articles`, params }),
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformCms"],
    }),
    createPlatformArticle: builder.mutation({
      query: (body) => ({ url: `/platform-admin/cms/articles`, method: "POST", body }),
      invalidatesTags: ["PlatformCms"],
    }),
    updatePlatformArticle: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/platform-admin/cms/articles/${id}`, method: "PUT", body }),
      invalidatesTags: ["PlatformCms"],
    }),
    deletePlatformArticle: builder.mutation({
      query: (id) => ({ url: `/platform-admin/cms/articles/${id}`, method: "DELETE" }),
      invalidatesTags: ["PlatformCms"],
    }),

    getPlatformDisputes: builder.query({
      query: (params) => ({ url: `/platform-admin/disputes`, params }),
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformDisputes"],
    }),
    resolvePlatformDispute: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/platform-admin/disputes/${id}/resolve`, method: "POST", body }),
      invalidatesTags: ["PlatformDisputes"],
    }),
    startReviewPlatformDispute: builder.mutation({
      query: (id) => ({ url: `/platform-admin/disputes/${id}/start-review`, method: "POST" }),
      invalidatesTags: ["PlatformDisputes"],
    }),
    escalatePlatformDispute: builder.mutation({
      query: (id) => ({ url: `/platform-admin/disputes/${id}/escalate`, method: "POST" }),
      invalidatesTags: ["PlatformDisputes"],
    }),

    getPlatformFeedback: builder.query({
      query: (params) => ({ url: `/platform-admin/feedback`, params }),
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformFeedback"],
    }),
    resolvePlatformFeedback: builder.mutation({
      query: (id) => ({ url: `/platform-admin/feedback/${id}/resolve`, method: "POST" }),
      invalidatesTags: ["PlatformFeedback"],
    }),
    respondPlatformFeedback: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/platform-admin/feedback/${id}/respond`, method: "POST", body }),
      invalidatesTags: ["PlatformFeedback"],
    }),

    getPlatformDeactivations: builder.query({
      query: (params) => ({ url: `/platform-admin/deactivations`, params }),
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformDeactivations"],
    }),
    approvePlatformDeactivation: builder.mutation({
      query: (id) => ({ url: `/platform-admin/deactivations/${id}/approve`, method: "POST" }),
      invalidatesTags: ["PlatformDeactivations"],
    }),
    rejectPlatformDeactivation: builder.mutation({
      query: (id) => ({ url: `/platform-admin/deactivations/${id}/reject`, method: "POST" }),
      invalidatesTags: ["PlatformDeactivations"],
    }),

    getPlatformRoles: builder.query({
      query: () => `/platform-admin/roles`,
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformRoles"],
    }),
    assignPlatformRole: builder.mutation({
      query: (body) => ({ url: `/platform-admin/roles/assign`, method: "POST", body }),
      invalidatesTags: ["PlatformRoles"],
    }),
    revokePlatformRole: builder.mutation({
      query: (body) => ({ url: `/platform-admin/roles/revoke`, method: "POST", body }),
      invalidatesTags: ["PlatformRoles"],
    }),

    getPlatformWaitlist: builder.query({
      query: (params) => ({ url: `/platform-admin/waitlist`, params }),
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformWaitlist"],
    }),

    getPlatformLegalDocument: builder.query({
      query: (slug) => `/platform-admin/legal/${slug}`,
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformLegal"],
    }),
    updatePlatformLegalDocument: builder.mutation({
      query: ({ slug, ...body }) => ({ url: `/platform-admin/legal/${slug}`, method: "PUT", body }),
      invalidatesTags: ["PlatformLegal"],
    }),

    getPlatformSettings: builder.query({
      query: () => `/platform-admin/settings`,
      transformResponse: (response) => response?.data,
      providesTags: ["PlatformSettings", "PlatformWaitlist"],
    }),
    updatePlatformSetting: builder.mutation({
      query: (body) => ({ url: `/platform-admin/settings`, method: "PUT", body }),
      invalidatesTags: ["PlatformSettings", "PlatformWaitlist"],
    }),
  }),
});

export const {
  useGetPlatformSessionQuery,
  useGetPlatformDashboardQuery,
  useGetPlatformNavCountsQuery,
  useGetPlatformUsersQuery,
  useGetPlatformUserDetailQuery,
  useGetPlatformUserSessionsQuery,
  useGetPlatformUserMoodQuery,
  useGetPlatformUserCommunityQuery,
  useGetPlatformUserActivityQuery,
  useGetPlatformUserJourneyQuery,
  useSuspendPlatformUserMutation,
  useUnsuspendPlatformUserMutation,
  useBanPlatformUserMutation,
  useStrikePlatformUserMutation,
  useUpdatePlatformUserMutation,
  useDeletePlatformUserMutation,
  useGetPlatformTherapistVerificationsQuery,
  useStartReviewPlatformApplicationMutation,
  useApprovePlatformApplicationMutation,
  useRejectPlatformApplicationMutation,
  useVerdictPlatformDocumentMutation,
  useGetPlatformPerformanceQuery,
  useUpdatePlatformPerformanceThresholdMutation,
  useSendPlatformTherapistWarningMutation,
  useHoldPlatformTherapistMutation,
  useClearHoldPlatformTherapistMutation,
  useReverifyPlatformTherapistMutation,
  useTerminatePlatformTherapistMutation,
  useGetPlatformActivityLogsQuery,
  useGetPlatformGrowthQuery,
  useGetPlatformBusinessesQuery,
  useGetPlatformBusinessQuery,
  useCreatePlatformBusinessMutation,
  useUpdatePlatformBusinessMutation,
  useDeletePlatformBusinessMutation,
  useSuspendPlatformBusinessMutation,
  useReactivatePlatformBusinessMutation,
  useGetPlatformBusinessEmployeesQuery,
  useGetPlatformBusinessEmployeeDetailQuery,
  useDeactivatePlatformEmployeeMutation,
  useReactivatePlatformEmployeeMutation,
  useInvitePlatformEmployeeMutation,
  useGetPlatformBusinessTherapistsQuery,
  useGetPlatformBusinessInvoicesQuery,
  useGetPlatformBusinessActivityQuery,
  useGetPlatformSessionsQuery,
  useGetPlatformBillingQuery,
  useGetPlatformPayoutsQuery,
  useProcessPlatformPayoutMutation,
  useProcessAllPlatformPayoutsMutation,
  useGetPlatformPayoutLastRunQuery,
  useGetPlatformPostReportsQuery,
  useResolvePlatformPostReportMutation,
  useDeletePlatformPostReportMutation,
  useGetPlatformCommentReportsQuery,
  useResolvePlatformCommentReportMutation,
  useDeletePlatformCommentReportMutation,
  useGetPlatformGroupReportsQuery,
  useGetPlatformCommunityOverviewQuery,
  useResolvePlatformGroupReportMutation,
  useSuspendPlatformGroupMutation,
  useBanPlatformGroupMutation,
  useReactivatePlatformGroupMutation,
  useDeletePlatformGroupMutation,
  useGetPlatformCommunityCategoriesQuery,
  useCreatePlatformGroupMutation,
  useGetPlatformGroupMembersQuery,
  useUpdatePlatformGroupMemberRoleMutation,
  useSuspendPlatformGroupMemberMutation,
  useGetPlatformGroupsQuery,
  useUpdatePlatformGroupMutation,
  useAddPlatformGroupMemberMutation,
  useRemovePlatformGroupMemberMutation,
  useGetPlatformGroupMemberReportsQuery,
  useResolvePlatformGroupMemberReportMutation,
  useSuspendPlatformReportedMemberMutation,
  useUnsuspendPlatformReportedMemberMutation,
  useGetPlatformGroupDetailQuery,
  useGetPlatformGroupReportsForGroupQuery,
  useGetPlatformCommentReportsForGroupQuery,
  useGetPlatformArticlesQuery,
  useCreatePlatformArticleMutation,
  useUpdatePlatformArticleMutation,
  useDeletePlatformArticleMutation,
  useGetPlatformDisputesQuery,
  useResolvePlatformDisputeMutation,
  useStartReviewPlatformDisputeMutation,
  useEscalatePlatformDisputeMutation,
  useGetPlatformFeedbackQuery,
  useResolvePlatformFeedbackMutation,
  useRespondPlatformFeedbackMutation,
  useGetPlatformDeactivationsQuery,
  useApprovePlatformDeactivationMutation,
  useRejectPlatformDeactivationMutation,
  useGetPlatformRolesQuery,
  useAssignPlatformRoleMutation,
  useRevokePlatformRoleMutation,
  useGetPlatformWaitlistQuery,
  useGetPlatformLegalDocumentQuery,
  useUpdatePlatformLegalDocumentMutation,
  useGetPlatformSettingsQuery,
  useUpdatePlatformSettingMutation,
} = platformAdminApiSlice;

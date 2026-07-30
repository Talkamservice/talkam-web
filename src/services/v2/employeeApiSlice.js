import { apiSliceV2 } from "../../app/api/apiSliceV2";

/**
 * Employee (member) dashboard.
 * Backend: planning-docs/web-api/02-employee-dashboard.md
 *
 * Most of this surface is REUSE of the mobile v2 lane — bookings (§07/§08),
 * messaging (§16), consent (§02), privacy/notification settings (§09) and
 * reports (§10) are all existing endpoints. Only the check-in extensions, the
 * care-team card and the community rollup are new.
 *
 * Nothing here is org-scoped: this is the member's own personal data, and the
 * same screens serve direct (non-B2B) users.
 */
export const employeeApiSlice = apiSliceV2.injectEndpoints({
  endpoints: (builder) => ({
    /* ── Check-ins & mood ────────────────────────────────────────────── */

    getMoodToday: builder.query({
      query: () => `/user/mood-checkins/today`,
      transformResponse: (response) => response?.data,
      providesTags: ["MoodCheckins"],
    }),

    getMoodSummary: builder.query({
      query: (days = 14) => ({ url: `/user/mood-checkins/summary`, params: { days } }),
      transformResponse: (response) => response?.data,
      providesTags: ["MoodCheckins"],
    }),

    getMoodHistory: builder.query({
      query: (params) => ({ url: `/user/mood-checkins`, params }),
      transformResponse: (response) => response?.data,
      providesTags: ["MoodCheckins"],
    }),

    saveMoodCheckin: builder.mutation({
      query: (body) => ({ url: `/user/mood-checkins`, method: "POST", body }),
      invalidatesTags: ["MoodCheckins"],
    }),

    /* ── Sessions ────────────────────────────────────────────────────── */

    getBookings: builder.query({
      query: () => `/user/bookings`,
      transformResponse: (response) => response?.data,
      providesTags: ["Bookings"],
    }),

    getBooking: builder.query({
      query: (id) => `/user/bookings/${id}`,
      transformResponse: (response) => response?.data,
      providesTags: ["Bookings"],
    }),

    cancelBooking: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/user/bookings/${id}/cancel`, method: "POST", body }),
      invalidatesTags: ["Bookings"],
    }),

    rescheduleBooking: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/user/bookings/${id}/reschedule`, method: "POST", body }),
      invalidatesTags: ["Bookings"],
    }),

    joinBooking: builder.query({
      query: (id) => `/user/bookings/${id}/join`,
      transformResponse: (response) => response?.data,
    }),

    reviewBooking: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/user/bookings/${id}/review`, method: "POST", body }),
      invalidatesTags: ["Bookings"],
    }),

    saveSessionMood: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/user/bookings/${id}/session-mood`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Bookings"],
    }),

    getCareTeam: builder.query({
      query: () => `/user/care-team`,
      transformResponse: (response) => response?.data,
      providesTags: ["Bookings"],
    }),

    /* ── Booking flow (reuse of §07 directory) ───────────────────────── */

    getTherapists: builder.query({
      query: (params) => ({ url: `/user/therapists`, params }),
      transformResponse: (response) => response?.data,
    }),

    getTherapistSlots: builder.query({
      query: ({ id, ...params }) => ({ url: `/user/therapists/${id}/slots`, params }),
      transformResponse: (response) => response?.data,
    }),

    createBooking: builder.mutation({
      query: (body) => ({ url: `/user/bookings`, method: "POST", body }),
      invalidatesTags: ["Bookings"],
    }),

    requestTopUp: builder.mutation({
      query: () => ({ url: `/user/bookings/request-top-up`, method: "POST" }),
    }),

    /* ── Community ───────────────────────────────────────────────────── */

    getCommunityTrending: builder.query({
      query: () => `/user/community/trending`,
      transformResponse: (response) => response?.data?.topics ?? [],
    }),

    /* ── Messaging (reuse of §16) ────────────────────────────────────── */

    getConversations: builder.query({
      query: (params) => ({ url: `/user/messaging/conversations`, params }),
      transformResponse: (response) => response?.data,
      providesTags: ["Conversations"],
    }),

    getMessages: builder.query({
      query: (conversationId) => ({
        url: `/user/messaging/messages/list`,
        params: { conversation_id: conversationId },
      }),
      transformResponse: (response) => response?.data,
      providesTags: ["Messages"],
    }),

    sendMessage: builder.mutation({
      query: (body) => ({ url: `/user/messaging/messages/send`, method: "POST", body }),
      invalidatesTags: ["Messages", "Conversations"],
    }),

    /* ── Profile & privacy (reuse of §09) ────────────────────────────── */

    getPrivacySettings: builder.query({
      query: () => `/user/privacy-settings`,
      transformResponse: (response) => response?.data,
      providesTags: ["PrivacySettings"],
    }),

    savePrivacySettings: builder.mutation({
      query: (body) => ({ url: `/user/privacy-settings`, method: "POST", body }),
      invalidatesTags: ["PrivacySettings"],
    }),

    getNotificationPreferences: builder.query({
      query: () => `/user/notification-preferences`,
      transformResponse: (response) => response?.data,
      providesTags: ["NotificationPreferences"],
    }),

    saveNotificationPreferences: builder.mutation({
      query: (body) => ({ url: `/user/notification-preferences`, method: "POST", body }),
      invalidatesTags: ["NotificationPreferences"],
    }),

    updateProfile: builder.mutation({
      query: (body) => ({ url: `/user/profile/update`, method: "POST", body }),
      invalidatesTags: ["Me"],
    }),

    reportUser: builder.mutation({
      query: (body) => ({ url: `/user/user-reports`, method: "POST", body }),
    }),

    deleteAccount: builder.mutation({
      query: (body) => ({ url: `/user/profile/delete-account`, method: "POST", body }),
    }),

    /* ── Notifications (reuse of the v1 feed on the v2 lane) ─────────── */

    getNotifications: builder.query({
      query: (params) => ({ url: `/user/notifications/list`, params }),
      transformResponse: (response) => response?.data,
      providesTags: ["Notifications"],
    }),

    markAllNotifications: builder.mutation({
      query: () => ({ url: `/user/notifications/mark-all`, method: "POST" }),
      invalidatesTags: ["Notifications"],
    }),

    /* ── Help ────────────────────────────────────────────────────────── */

    getFaqs: builder.query({
      query: (params) => ({ url: `/user/faqs`, params }),
      transformResponse: (response) => response?.data,
    }),
  }),
});

export const {
  useGetMoodTodayQuery,
  useGetMoodSummaryQuery,
  useGetMoodHistoryQuery,
  useSaveMoodCheckinMutation,
  useGetBookingsQuery,
  useGetBookingQuery,
  useCancelBookingMutation,
  useRescheduleBookingMutation,
  useLazyJoinBookingQuery,
  useReviewBookingMutation,
  useSaveSessionMoodMutation,
  useGetCareTeamQuery,
  useGetTherapistsQuery,
  useGetTherapistSlotsQuery,
  useCreateBookingMutation,
  useRequestTopUpMutation,
  useGetCommunityTrendingQuery,
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useGetPrivacySettingsQuery,
  useSavePrivacySettingsMutation,
  useGetNotificationPreferencesQuery,
  useSaveNotificationPreferencesMutation,
  useUpdateProfileMutation,
  useReportUserMutation,
  useDeleteAccountMutation,
  useGetNotificationsQuery,
  useMarkAllNotificationsMutation,
  useGetFaqsQuery,
} = employeeApiSlice;

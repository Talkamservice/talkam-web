import { apiSliceV2 } from "../../app/api/apiSliceV2";

/**
 * Therapist (provider) dashboard.
 * Backend: planning-docs/web-api/04-therapist-dashboard.md
 *
 * Mostly REUSE of the mobile v2 therapist lane (§§11–14, 16): sessions, notes,
 * earnings, payouts, profile, clients and messaging are existing endpoints. The
 * new pieces are the home + analytics aggregates and the live availability grid.
 *
 * A business-employed therapist (accepted an org invite in §01) is paid by
 * their company, so the earnings endpoints 403 for them — the frontend reads
 * home.employment.is_business_employed and never renders the Earnings module.
 */
export const therapistApiSlice = apiSliceV2.injectEndpoints({
  endpoints: (builder) => ({
    getTherapistHome: builder.query({
      query: () => `/therapist/home`,
      transformResponse: (response) => response?.data,
      providesTags: ["TherapistHome"],
    }),

    getTherapistAnalytics: builder.query({
      query: (range = "4w") => ({ url: `/therapist/analytics`, params: { range } }),
      transformResponse: (response) => response?.data,
      providesTags: ["TherapistAnalytics"],
    }),

    getAvailability: builder.query({
      query: () => `/therapist/availability`,
      transformResponse: (response) => response?.data,
      providesTags: ["TherapistAvailability"],
    }),

    updateAvailability: builder.mutation({
      query: (body) => ({ url: `/therapist/availability`, method: "PUT", body }),
      invalidatesTags: ["TherapistAvailability", "TherapistHome"],
    }),

    /* ── Sessions & notes (reuse of §12) ─────────────────────────────── */

    getTherapistSessions: builder.query({
      query: () => `/therapist/sessions`,
      transformResponse: (response) => response?.data,
      providesTags: ["TherapistSessions"],
    }),

    getSessionRequest: builder.query({
      query: (id) => `/therapist/sessions/${id}/request`,
      transformResponse: (response) => response?.data,
    }),

    acknowledgeSession: builder.mutation({
      query: (id) => ({ url: `/therapist/sessions/${id}/acknowledge`, method: "POST" }),
      invalidatesTags: ["TherapistSessions", "TherapistHome"],
    }),

    declineSession: builder.mutation({
      query: (id) => ({ url: `/therapist/sessions/${id}/decline`, method: "POST" }),
      invalidatesTags: ["TherapistSessions", "TherapistHome"],
    }),

    /* Same endpoints as employeeApiSlice's rescheduleBooking/respondToReschedule
     * (role-agnostic backend) — redefined here so a therapist-side action
     * invalidates THIS slice's cache. RTK Query tags only match within the
     * same createApi instance, so the employee-slice hooks are a no-op for
     * therapist-side queries. */
    requestBookingReschedule: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/user/bookings/${id}/reschedule`, method: "POST", body }),
      invalidatesTags: ["TherapistSessions", "TherapistHome"],
    }),

    respondToBookingReschedule: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/user/reschedules/${id}/respond`, method: "POST", body }),
      invalidatesTags: ["TherapistSessions", "TherapistHome"],
    }),

    getSessionNotes: builder.query({
      query: (id) => `/therapist/sessions/${id}/notes`,
      transformResponse: (response) => response?.data,
      providesTags: ["TherapistNotes"],
    }),

    saveSessionNotes: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/therapist/sessions/${id}/notes`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["TherapistNotes", "TherapistSessions", "TherapistHome"],
    }),

    /* ── Inbound session requests (no committed slot yet) ────────────── */

    getTherapistSessionRequests: builder.query({
      query: () => `/therapist/session-requests`,
      transformResponse: (response) => response?.data?.requests ?? [],
      providesTags: ["TherapistSessionRequests"],
    }),

    proposeSessionRequest: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/therapist/session-requests/${id}/propose`, method: "POST", body }),
      invalidatesTags: ["TherapistSessionRequests", "TherapistSessions", "TherapistHome"],
    }),

    declineSessionRequest: builder.mutation({
      query: (id) => ({ url: `/therapist/session-requests/${id}/decline`, method: "POST" }),
      invalidatesTags: ["TherapistSessionRequests", "TherapistHome"],
    }),

    /* ── Earnings (reuse of §13; 403 for business-employed) ──────────── */

    getEarnings: builder.query({
      query: () => `/therapist/earnings/dashboard`,
      transformResponse: (response) => response?.data,
      providesTags: ["TherapistEarnings"],
    }),

    getEarningsTransactions: builder.query({
      query: (params) => ({ url: `/therapist/earnings/transactions`, params }),
      transformResponse: (response) => response?.data,
    }),

    /* ── Profile (reuse of §14) ──────────────────────────────────────── */

    getTherapistProfile: builder.query({
      query: () => `/therapist/profile`,
      transformResponse: (response) => response?.data,
      providesTags: ["TherapistProfile"],
    }),

    updateTherapistProfile: builder.mutation({
      query: (body) => ({ url: `/therapist/profile/update`, method: "POST", body }),
      invalidatesTags: ["TherapistProfile"],
    }),
  }),
});

export const {
  useGetTherapistHomeQuery,
  useGetTherapistAnalyticsQuery,
  useGetAvailabilityQuery,
  useUpdateAvailabilityMutation,
  useGetTherapistSessionsQuery,
  useGetSessionRequestQuery,
  useAcknowledgeSessionMutation,
  useDeclineSessionMutation,
  useRequestBookingRescheduleMutation,
  useRespondToBookingRescheduleMutation,
  useGetSessionNotesQuery,
  useSaveSessionNotesMutation,
  useGetTherapistSessionRequestsQuery,
  useProposeSessionRequestMutation,
  useDeclineSessionRequestMutation,
  useGetEarningsQuery,
  useGetEarningsTransactionsQuery,
  useGetTherapistProfileQuery,
  useUpdateTherapistProfileMutation,
} = therapistApiSlice;

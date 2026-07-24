import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * v2 API slice — the parallel lane for everything the v2 web surfaces talk to
 * (api/v2 in talkam-api). Mirrors ./apiSlice.js exactly; it exists as a second
 * `createApi` rather than a base-URL swap because v1 pages still point at
 * api/v1 and both must work in the same session.
 *
 * Auth rides the same `state.auth.token` the v1 slice uses, so a single sign-in
 * covers both lanes.
 */

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_API_V2_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    // Laravel needs this to return JSON validation errors instead of a redirect.
    headers.set("accept", "application/json");
    return headers;
  },
});

export const apiSliceV2 = createApi({
  reducerPath: "apiV2",
  baseQuery: baseQuery,
  tagTypes: [
    "Organization",
    "Invitations",
    "SelfCheck",
    "Me",
    "MoodCheckins",
    "Bookings",
    "PrivacySettings",
    "NotificationPreferences",
    "Notifications",
    "Conversations",
    "Messages",
    "AdminInsights",
    "AdminEmployees",
    "AdminTherapists",
    "AdminSafety",
    "AdminActivity",
    "AdminBilling",
    "TherapistHome",
    "TherapistAnalytics",
    "TherapistAvailability",
    "TherapistSessions",
    "TherapistNotes",
    "TherapistEarnings",
    "TherapistProfile",
    "Journal",
    "Legal",
  ],
  endpoints: (builder) => ({}),
});

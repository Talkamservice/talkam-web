import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut } from "../../services/authSlice";

/**
 * v2 API slice — the parallel lane for everything the v2 web surfaces talk to
 * (api/v2 in talkam-api). Mirrors ./apiSlice.js exactly; it exists as a second
 * `createApi` rather than a base-URL swap because v1 pages still point at
 * api/v1 and both must work in the same session.
 *
 * Auth rides the same `state.auth.token` the v1 slice uses, so a single sign-in
 * covers both lanes.
 */

const rawBaseQuery = fetchBaseQuery({
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

/**
 * On a 401 the token is expired or revoked — clear the session and bounce to the
 * right login, instead of leaving the user on a dead, half-loaded page.
 */
const baseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    api.dispatch(logOut());

    if (typeof window !== "undefined") {
      const { pathname } = window.location;
      const loginPath = pathname.startsWith("/business") ? "/business/login" : "/login";
      // Don't fight a login attempt's own 401, or loop while already on login.
      if (pathname !== loginPath) {
        window.location.replace(loginPath);
      }
    }
  }

  return result;
};

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
    "AdminNotificationPreferences",
    "TherapistHome",
    "TherapistAnalytics",
    "TherapistAvailability",
    "TherapistSessions",
    "TherapistSessionRequests",
    "TherapistNotes",
    "TherapistEarnings",
    "TherapistProfile",
    "Journal",
    "Legal",
  ],
  endpoints: () => ({}),
});

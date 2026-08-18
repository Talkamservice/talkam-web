import { apiSliceV2 } from "../../app/api/apiSliceV2";

/**
 * Shared v2 auth endpoints. The B2B dashboard signs in through exactly the
 * same lane the mobile app uses — `login` takes an email in `input`, and
 * returns either a token or a `two_factor_required` challenge.
 */
export const authApiSliceV2 = apiSliceV2.injectEndpoints({
  endpoints: (builder) => ({
    loginV2: builder.mutation({
      query: (credentials) => ({
        url: `/auth/login`,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Me"],
    }),

    verifyTwoFactor: builder.mutation({
      query: (credentials) => ({
        url: `/auth/2fa/verify`,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Me"],
    }),

    forgotPasswordV2: builder.mutation({
      query: (body) => ({
        url: `/auth/password/forgot`,
        method: "POST",
        body,
      }),
    }),

    resetPasswordV2: builder.mutation({
      query: (body) => ({
        url: `/auth/password/reset`,
        method: "POST",
        body,
      }),
    }),

    /** Resend an email OTP — used by the domain-verify and 2FA screens. */
    requestOtpV2: builder.mutation({
      query: (body) => ({
        url: `/auth/otp/request`,
        method: "POST",
        body,
      }),
    }),

    getMeV2: builder.query({
      query: () => `/user/me`,
      transformResponse: (response) => response?.data,
      providesTags: ["Me"],
    }),

    getConsents: builder.query({
      query: () => `/user/consents`,
      transformResponse: (response) => response?.data,
      providesTags: ["Consents"],
    }),

    saveConsents: builder.mutation({
      query: (body) => ({
        url: `/user/consents`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Consents", "Me"],
    }),
  }),
});

export const {
  useLoginV2Mutation,
  useVerifyTwoFactorMutation,
  useForgotPasswordV2Mutation,
  useResetPasswordV2Mutation,
  useRequestOtpV2Mutation,
  useGetMeV2Query,
  useGetConsentsQuery,
  useSaveConsentsMutation,
} = authApiSliceV2;

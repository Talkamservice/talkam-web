import { apiSlice } from "../app/api/apiSlice"

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: `/auth/login`,
                method: "post",
                body: {...credentials}
            })
        }),
        tikTokLogin: builder.mutation({
            query: () => ({
                url: `https://www.tiktok.com/v2/auth/authorize/`,
                method: "post",
            })
        }),
        OauthLogin: builder.mutation({
            query: credentials => ({
                url: `/auth/oauth-login`,
                method: "post",
                body: {...credentials}
            })
        }),
        signup: builder.mutation({
            query: credentials => ({
                url: `/auth/register`,
                method: "post",
                body: {...credentials}
            })
        }),
        forgotPassword: builder.mutation({
            query: credentials => ({
                url: `/auth/password/forgot`,
                method: "post",
                body: {...credentials}
            })
        }),
        verifyOtp: builder.mutation({
            query: credentials => ({
                url: `/auth/otp/verify`,
                method: "post",
                body: {...credentials}
            })
        }),
        resendOtp: builder.mutation({
            query: credentials => ({
                url: `/auth/otp/request`,
                method: "post",
                body: {...credentials}
            })
        }),
        resetPassword: builder.mutation({
            query: credentials => ({
                url: `/auth/password/reset`,
                method: "post",
                body: {...credentials}
            })
        }),
    })
})

export const { 
    useLoginMutation,
    useOauthLoginMutation,
    useSignupMutation,
    useForgotPasswordMutation,
    useVerifyOtpMutation,
    useResendOtpMutation,
    useResetPasswordMutation,
    useTikTokLoginMutation,
} = authApiSlice
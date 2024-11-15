import { apiSlice } from "../app/api/apiSlice";

export const pricingApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllPlans: builder.query({
            query: () => ({
                url: "user/finance/plans",
                method: "get",
            }),
        }),
        subscribe: builder.mutation({
            query: credentials => ({
                url: `user/finance/subscriptions/initiate`,
                method: "post",
                body: { ...credentials }
            })
        }),
        cancelSubscription: builder.mutation({
            query: sub => ({
                url: `user/finance/subscriptions/${sub}/cancel`,
                method: "post",
            })
        }),
        promote: builder.mutation({
            query: credentials => ({
                url: `user/promotions/initiate`,
                method: 'post',
                body: { ...credentials }
            })
        }),
        getRunningAds: builder.query({
            query: status => ({
                url: `user/promotions?status=${status ?? ""}`,
                method: 'get'
            }),
            providesTags: ["ads"]
        }),
        getPromotionDetails: builder.query({
            query: ad => ({
                url: `user/promotions/${ad}/show`,
                method: "get"
            })
        }),
        deletePromotion: builder.mutation({
            query: ad => ({
                url: `user/promotions/${ad}/delete`,
                method: "DELETE"
            }),
            invalidatesTags: ["ads"]
        }),
        updatePromotion: builder.mutation({
            query: ({ ad, body }) => ({
                url: `user/promotions/${ad}/update`,
                method: "post",
                body: { ...body }
            }),
            invalidatesTags: ["ads"]
        }),
        paymentCallBack: builder.mutation({
            query: ref => ({
                url: `user/finance/payments/callback`,
                method: "post",
                body: { ...ref }
            }),
        }),
        restartPromotion: builder.mutation({
            query: ad => ({
                url: `user/promotions/${ad}/reinitiate`,
                method: "post"
            }),
            invalidatesTags: ["ads"]
        }),
        updateStats: builder.mutation({
            query: ({ ad }) => ({
                url: `user/posts/stats/save`,
                method: "post",
                body: { ...ad }
            }),
            invalidatesTags: ["analytics"]
        }),
    }),
});

export const {
    useGetAllPlansQuery,
    useSubscribeMutation,
    useCancelSubscriptionMutation,
    usePromoteMutation,
    useGetRunningAdsQuery,
    useDeletePromotionMutation,
    usePaymentCallBackMutation,
    useUpdatePromotionMutation,
    useRestartPromotionMutation,
    useUpdateStatsMutation,
    useGetPromotionDetailsQuery,
} = pricingApiSlice;

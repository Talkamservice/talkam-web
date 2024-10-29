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
        })
    }),
});

export const {
    useGetAllPlansQuery,
    useSubscribeMutation,
    useCancelSubscriptionMutation,
} = pricingApiSlice;

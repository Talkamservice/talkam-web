import { apiSlice } from "../app/api/apiSlice"

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCategories: builder.query({
            query: (sort) => ({
                url: `user/post-categories?sort=${sort}`,
                method: "get",
            })
        }),
        updateProfile: builder.mutation({
            query: payload => ({
                url: `user/profile/update`,
                method: 'post',
                body: { ...payload }
            })
        }),
        getTrendingTags: builder.query({
            query: () => ({
                url: `/user/trendings/fetch`,
                method: 'get',
            }),
        }),
        getAvatars: builder.query({
            query: () => ({
                url: `/profile/avatars`,
                method: 'get'
            })
        }),
        blockUser: builder.mutation({
            query: id => ({
                url: `/user/blocked-users/add`,
                method: 'post',
                body: id
            }),
            invalidatesTags: ['blocked']
        }),
        getUserProfileDetails: builder.query({
            query: id => ({
                url: `/user/profile/fetch?user_id=${id}`,
                method: "get",
            }),
            providesTags: ["profile"]
        }),
        getBlockedList: builder.query({
            query: () => ({
                url: `/user/blocked-users`,
                method: 'get',
            }),
            providesTags: ['blocked']
        }),
    })
})

export const { 
    useGetCategoriesQuery,
    useUpdateProfileMutation,
    useGetTrendingTagsQuery,
    useGetAvatarsQuery,
    useBlockUserMutation,
    useGetUserProfileDetailsQuery,
    useGetBlockedListQuery,
} = authApiSlice
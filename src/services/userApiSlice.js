import { apiSlice } from "../app/api/apiSlice"

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCategories: builder.query({
            query: ({sort}) => ({
                url: `user/post-categories?sort=${sort}`,
                method: "get",
            })
        }),
        getSubCategories: builder.query({
            query: ({sort, categoryId}) => ({
                url: `user/post-categories/sub-categories?sort=${sort}&catgeory_id=${categoryId}`,
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
        getUserProfileDetails: builder.query({
            query: id => ({
                url: `/user/profile/fetch?user_id=${id}`,
                method: "get",
            }),
            providesTags: ["profile"]
        }),
    })
})

export const { 
    useGetCategoriesQuery,
    useGetSubCategoriesQuery,
    useUpdateProfileMutation,
    useGetTrendingTagsQuery,
    useGetAvatarsQuery,
    useGetUserProfileDetailsQuery,
} = authApiSlice
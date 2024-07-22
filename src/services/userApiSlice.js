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
            })
        })
    })
})

export const { 
    useGetCategoriesQuery,
    useUpdateProfileMutation,
    useGetTrendingTagsQuery,
    useGetAvatarsQuery,
    useBlockUserMutation,
} = authApiSlice
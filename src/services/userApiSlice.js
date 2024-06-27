import { apiSlice } from "../app/api/apiSlice"

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCategories: builder.query({
            query: () => ({
                url: `user/post-categories`,
                method: "get",
            })
        }),
        updateProfile: builder.mutation({
            query: payload => ({
                url: `user/profile/update`,
                method: 'post',
                body: { ...payload }
            })
        })
        
    })
})

export const { 
    useGetCategoriesQuery,
    useUpdateProfileMutation,
} = authApiSlice
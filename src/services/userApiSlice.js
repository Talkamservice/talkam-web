import { apiSlice } from "../app/api/apiSlice"

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCategories: builder.query({
            query: ({ sort }) => ({
                url: `user/post-categories?sort=${sort}`,
                method: "get",
            })
        }),
        getSingleCategory: builder.query({
            query: id => ({
                url: `/user/post-categories/${id}/show`,
                method: "get",
            }),
            providesTags: ["category"]
        }),
        getSubCategories: builder.query({
            query: ({ sort, categoryId, search = "" }) => ({
                url: `user/post-categories/sub-categories?sort=${sort}&category_id=${categoryId}&search=${search}`,
                method: "get",
            })
        }),
        getMergedSubCategories: builder.query({
            query: id => ({
                url: `/user/post-categories/merged-categories?category_id=${id}`,
                method: "get",
            })
        }),
        updateProfile: builder.mutation({
            query: payload => ({
                url: `user/profile/update`,
                method: 'post',
                body: { ...payload }
            }),
            invalidatesTags: ["profile"]
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
        followingCategories: builder.query({
            query: () => ({
                url: `/user/post-categories/following`,
                method: 'get'
            }),
            providesTags: ["usercategories"]
        }),
        addInterest: builder.mutation({
            query: interest => ({
                url: `/user/profile/interests/add-remove`,
                method: 'post',
                body: interest
            }),
            invalidatesTags: ['category']
        }),
        getUserFromUsername: builder.query({
            query: username => ({
                url: `/user/profile/fetch?username=${username}`,
                method: "get"
            })
        }),
        getCountries: builder.query({
            query: ({ search }) => ({
                url: `/location/countries?search=${search}`,
                method: "get"
            })
        }),
        getStates: builder.query({
            query: ({ countryId, search }) => ({
                url: `/location/states?country_id=${countryId}&search=${search}`,
                method: "get"
            })
        }),
    })
})

export const {
    useGetCategoriesQuery,
    useGetSingleCategoryQuery,
    useGetSubCategoriesQuery,
    useUpdateProfileMutation,
    useGetTrendingTagsQuery,
    useGetAvatarsQuery,
    useGetMergedSubCategoriesQuery,
    useGetUserProfileDetailsQuery,
    useFollowingCategoriesQuery,
    useAddInterestMutation,
    useGetUserFromUsernameQuery,
    useLazyGetUserFromUsernameQuery,
    useGetCountriesQuery,
    useGetStatesQuery,
} = authApiSlice
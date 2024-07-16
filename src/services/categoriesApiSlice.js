import { apiSlice } from "../app/api/apiSlice"

export const categoriesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        // getAllCategories: builder.query({
        //     query: () => ({
        //         url: `/user/post-categories`,
        //         method: "get",
        //     }),
        //     providesTags: ["categories"]
        // }),     
    })
})

export const {
    useGetAllCategoriesQuery,
} = categoriesApiSlice
import { apiSlice } from "../app/api/apiSlice"

export const searchApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        search: builder.query({
            query: ({ sort, search }) => ({
                url: `/user/search?sort=${sort}&search=${search}`,
                method: "get",
            }),
        }),     
    })
})

export const {
    useSearchQuery,
} = searchApiSlice
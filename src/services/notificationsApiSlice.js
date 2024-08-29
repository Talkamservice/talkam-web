import { apiSlice } from "../app/api/apiSlice"

export const notificationsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllNotifications: builder.query({
            query: () => ({
                url: `user/notifications/list`,
                method: 'get',
            }),
            providesTags: ["notifications"]
        })
    })
})

export const {
    useGetAllNotificationsQuery,
} = notificationsApiSlice
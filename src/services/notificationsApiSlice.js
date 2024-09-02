import { apiSlice } from "../app/api/apiSlice"

export const notificationsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllNotifications: builder.query({
            keepUnusedDataFor: 30,
            query: () => ({
                url: `user/notifications/list`,
                method: 'get',
            }),
            providesTags: ["notifications"]
        }),
        getNotificationStats: builder.query({
            keepUnusedDataFor: 0,
            query: () => ({
                url: `user/notifications/get-notification-status`,
                method: 'get'
            }),
            providesTags: ["notificationstats"]
        }),
        markAllNotificationsAsRead: builder.mutation({
            query: () => ({
                url: `/user/notifications/mark-all`,
                method: 'post'
            }),
            invalidatesTags: ["notifications", "notificationstats"]
        }),
        clearAllNotifications: builder.mutation({
            query: () => ({
                url: `/user/notifications/clear-all`,
                method: 'post'
            }),
            invalidatesTags: ["notifications", "notificationstats"]
        }),
        showNotification: builder.query({
            query: id => ({
                url: `/user/notifications/${id}/show`,
                method: "get"
            }),
            invalidatesTags: ["notifications", "notificationstats"]
        })
    })
})

export const {
    useGetAllNotificationsQuery,
    useGetNotificationStatsQuery,
    useMarkAllNotificationsAsReadMutation,
    useClearAllNotificationsMutation,
    useShowNotificationQuery,
    useLazyShowNotificationQuery,
} = notificationsApiSlice
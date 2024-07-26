import { apiSlice } from "../app/api/apiSlice"

export const settingsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        deleteAccount: builder.mutation({
            query: () => ({
                url: `/user/profile/delete-account`,
                method: "post",
            }),
        }),     
        notificationSettings: builder.mutation({
            query: ({ ...body }) => ({
                url: `/user/notifications/preference/save`,
                method: 'post',
                body: { ...body }
            })
        })
    })
})

export const {
    useDeleteAccountMutation,
    useNotificationSettingsMutation,
} = settingsApiSlice
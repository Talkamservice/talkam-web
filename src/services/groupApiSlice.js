import { apiSlice } from "../app/api/apiSlice"

export const groupApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllGroups: builder.query({
            keepUnusedDataFor: 180,
            query: ({ categoryId, tab, search }) => ({
                url: `/user/groups?category_id=${categoryId}&tab=${tab}&search=${search}`,
                method: "get",
            }),
            providesTags: ["groups"]
        }),
        getFollowingGroups: builder.query({
            keepUnusedDataFor: 180,
            query: ({ categoryId, tab, search, type }) => ({
                url: `/user/groups/members/following?type=${type}&category_id=${categoryId}&tab=${tab}&search=${search}`,
                method: "get",
            }),
            providesTags: ["usergroups"]
        }),
        createGroup: builder.mutation({
            query: group => ({
                url: 'user/groups',
                method: "post",
                body: { ...group }
            }),
            invalidatesTags: ['groups', 'usergroups']
        }),
        getGroupDetails: builder.query({
            query: id => ({
                url: `/user/groups/${id}`,
                method: "get"
            }),
            providesTags: ["details"]
        }),
        getGroupMembers: builder.query({
            query: ({ id, status }) => ({
                url: `user/group-members?group_id=${id}&status=${status}`,
                method: "get"
            }),
            providesTags: ["members"]
        }),
        addGuidelines: builder.mutation({
            query: guidelines => ({
                url: `user/guidelines`,
                method: 'post',
                body: { ...guidelines }
            }),
            invalidatesTags: ["details", "guidelines"]
        }),
        followGroup: builder.mutation({
            query: credentials => ({
                url: `/user/group-members`,
                method: 'post',
                body: { ...credentials }
            }),
            invalidatesTags: ["details", "members", "usergroups"]
        }),
        unFollowGroup: builder.mutation({
            query: credentials => ({
                url: `/user/groups/unfollow-group`,
                method: 'post',
                body: { ...credentials }
            }),
            invalidatesTags: ["details", "members", "usergroups"]
        }),
        makeModerator: builder.mutation({
            query: ({ id, body }) => ({
                url: `/user/group-members/${id}`,
                method: 'PUT',
                body: { ...body }
            }),
            invalidatesTags: ["members", "details"]
        }),
        removeModerator: builder.mutation({
            query: ({ id, body }) => ({
                url: `/user/group-members/${id}`,
                method: 'PUT',
                body: { ...body }
            }),
            invalidatesTags: ["members", "details"]
        }),
        deleteMember: builder.mutation({
            query: id => ({
                url: `/user/group-members/${id}`,
                method: 'delete',
            }),
            invalidatesTags: ["members", "details"]
        }),
        updateGroupDetails: builder.mutation({
            query: ({ id, body }) => ({
                url: `/user/groups/${id}`,
                method: "PUT",
                body: { ...body }
            }),
            invalidatesTags: ["details", "groups", "usergroups"]
        }),
        updateGuidelines: builder.mutation({
            query: ({ id, body }) => ({
                url: `/user/guidelines/${id}`,
                method: "PUT",
                body: { ...body }
            }),
            invalidatesTags: ["details", "guidelines"]
        }),
        deleteGuideline: builder.mutation({
            query: id => ({
                url: `/user/guidelines/${id}`,
                method: "delete",
            }),
            invalidatesTags: ["details", "guidelines"]
        }),
        requestFollow: builder.mutation({
            query: id => ({
                url: `/user/groups/${id}/request-access`,
                method: 'post'
            }),
            invalidatesTags: ['details']
        }),
        getGroupRequests: builder.query({
            query: groupId => ({
                url: `user/groups/members/list?group_id=${groupId}&status=Pending`,
                method: 'get'
            }),
            providesTags: ['requests']
        }),
        updateMemberRequests: builder.mutation({
            query: ({ id, body }) => ({
                url: `/user/groups/${id}/update-access-request`,
                method: 'post',
                body: { ...body }
            }),
            invalidatesTags: ["requests", "members", "details"]
        }),
        reportGroupMutation: builder.mutation({
            query: body => ({
                url: `/user/groups/reports/create`,
                method: 'post',
                body: body
            }),
            invalidatesTags: ["details"]
        }),
    })
})

export const {
    useGetAllGroupsQuery,
    useGetFollowingGroupsQuery,
    useCreateGroupMutation,
    useGetGroupDetailsQuery,
    useGetGroupMembersQuery,
    useAddGuidelinesMutation,
    useFollowGroupMutation,
    useUnFollowGroupMutation,
    useMakeModeratorMutation,
    useRemoveModeratorMutation,
    useDeleteMemberMutation,
    useUpdateGroupDetailsMutation,
    useUpdateGuidelinesMutation,
    useDeleteGuidelineMutation,
    useRequestFollowMutation,
    useGetGroupRequestsQuery,
    useUpdateMemberRequestsMutation,
    useReportGroupMutationMutation,
} = groupApiSlice
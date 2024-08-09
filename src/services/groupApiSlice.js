import { apiSlice } from "../app/api/apiSlice"

export const groupApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllGroups: builder.query({
            query: ({ categoryId, tab, search }) => ({
                url: `/user/groups?category_id=${categoryId}&tab=${tab}&search=${search}`,
                method: "get",
            }),
            providesTags: ["groups"]
        }),
        getFollowingGroups: builder.query({
            query: ({ categoryId, tab, search }) => ({
                url: `/user/groups/members/following?category_id=${categoryId}&tab=${tab}&search=${search}`,
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
            query: id => ({
                url: `user/group-members?group_id=${id}`,
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
} = groupApiSlice
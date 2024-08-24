import { apiSlice } from "../../app/api/apiSlice"

export const messagesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        sendMessage: builder.mutation({
            query: message => ({
                url: `/user/messaging/messages/send`,
                method: "post",
                body: { ...message }
            }),
            invalidatesTags: ["messages"]
        }),
        getMessages: builder.query({
            query: ({ id, search }) => ({
                url: `/user/messaging/messages/list?conversation_id=${id}&search=${search}`,
                method: "get"
            }),
            providesTags: ["messages"]
        }),
        currentConversation: builder.query({
            query: id => ({
                url: `/user/messaging/conversations/current/fetch?receiver_id=${id}`,
                method: "get",
            })
        }),
        getAllConversations: builder.query({
            query: ({ status, tab, search }) => ({
                url: `/user/messaging/conversations?status=${status}&tab=${tab}&search=${search}`,
                method: 'get'
            }),
            providesTags: ["conversations"]
        }),
        getConversationDetails: builder.query({
            query: id => ({
                url: `/user/messaging/conversations/${id}`,
                method: 'get'
            }),
            providesTags: ["chatdetails"]
        }),
        updateRequestStatus: builder.mutation({
            query: body => ({
                url: `/user/messaging/conversations/update-status`,
                method: "post",
                body: { ...body }
            }),
            invalidatesTags: ["messages", "conversations", "chatdetails"]
        }),
        checkCurrentCoversation: builder.mutation({
            query: id => ({
                url: `/user/messaging/conversations/current-conversation`,
                method: "post",
                body: id
            }),
            invalidatesTags: ["conversations"]
        })
    })
})

export const {
    useSendMessageMutation,
    useGetMessagesQuery,
    useCurrentConversationQuery,
    useGetAllConversationsQuery,
    useGetConversationDetailsQuery,
    useUpdateRequestStatusMutation,
    useCheckCurrentCoversationMutation,
} = messagesApiSlice
import { apiSlice } from "../../app/api/apiSlice"

export const messagesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        sendMessage: builder.mutation({
            query: message => ({
                url: `/user/messaging/conversations`,
                method: "post",
                body: { ...message }
            }),
            providesTags: ["messages"]
        }),
        getMessages: builder.query({
            query: ({ id, search }) => ({
                url: `/user/messaging/messages/list?conversation_id=${id}&search=${search}`,
                method: "get"
            }),
            providesTags: ["messages"]
        }),
        currentConversation: builder.mutation({
            query: id => ({
                url: `/user/messaging/conversations/current-conversation`,
                method: "post",
                body: id
            })
        }),
        getAllConversations: builder.query({
            query: ({ status, tab, search }) => ({
                url: `/user/messaging/conversations?status=${status}&tab=${tab}&search=${search}`,
                method: 'get'
            }),
            providesTags: ["conversations"]
        })
    })
})

export const {
    useSendMessageMutation,
    useGetMessagesQuery,
    useCurrentConversationMutation,
    useGetAllConversationsQuery,
} = messagesApiSlice
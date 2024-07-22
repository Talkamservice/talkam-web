import { apiSlice } from "../../app/api/apiSlice"

export const postsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllPosts: builder.query({
            query: ({ tab, page }) => ({
                url: `/user/posts/?tab=${tab}&page=${page}`,
                method: "get",
            }),
            providesTags: ["posts"]
        }),
        getRecentPosts: builder.query({
            query: () => ({
                url: `/user/recents/fetch?sort=post`,
                method: "get",
            }),
            providesTags: ["recents"]
        }),
        getSinglePost: builder.query({
            query: post_id => ({
                url: `/user/posts/${post_id}`,
                method: "get",
            }),
            providesTags: ["postDetail"]
        }),
        getPostComments: builder.query({
            query: id => ({
                url: `/user/post-comments?post_id=${id}`,
                method: "get",
            }),
            providesTags: ["comments"]
        }),
        postReaction: builder.mutation({
            query: action => ({
                url: `/user/posts/reaction`,
                method: 'POST',
                body: {...action }
            }),
            invalidatesTags: ["postDetail", "posts", "comments"],
        }),
        commentReaction: builder.mutation({
            query: action => ({
                url: `/user/post-comments/reaction`,
                method: 'POST',
                body: {...action }
            }),
            invalidatesTags: ["postDetail", "comments"],
        }),
        makeComment: builder.mutation({
            query: body => ({
                url: `/user/post-comments`,
                method: 'POST',
                body: {...body}
            }),
            invalidatesTags: ["comments", "posts", "postDetail"],
        }),
        createPost: builder.mutation({
            query: body => ({
                url: `/user/posts`,
                method: 'post',
                body: { ...body }
            }),
            invalidatesTags: ["posts"]
        }),
        savePostToDrafts: builder.mutation({
            query: body => ({
                url: `/user/post-drafts`,
                method: 'post',
                body: { ...body }
            }),
        }),
        selectPollOption: builder.mutation({
            query: pollId => ({
                url: `/user/post-polls`,
                method: 'post',
                body: pollId
            }),
            invalidatesTags: ["posts","postDetail"]
        }),
    })
})

export const {
    useGetAllPostsQuery,
    useGetRecentPostsQuery,
    useGetSinglePostQuery,
    useGetPostCommentsQuery,
    usePostReactionMutation,
    useCommentReactionMutation,
    useMakeCommentMutation,
    useCreatePostMutation,
    useSavePostToDraftsMutation,
    useSelectPollOptionMutation,
} = postsApiSlice
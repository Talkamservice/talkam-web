import { apiSlice } from "../../app/api/apiSlice"

export const postsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllPosts: builder.query({
            keepUnusedDataFor:  180,
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
            keepUnusedDataFor: 360,
            query: post_id => ({
                url: `/user/posts/${post_id}`,
                method: "get",
            }),
            providesTags: ["postDetail", "recents"]
        }),
        deletePost: builder.mutation({
            query: postId => ({
                url: `/user/posts/${postId}`,
                method: 'delete',
            }),
            invalidatesTags: ["posts", "userposts", "upvotes", "usercomments"]
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
        deleteComment: builder.mutation({
            query: postId => ({
                url: `/user/post-comments/${postId}`,
                method: 'delete',
            }),
            invalidatesTags: ["posts", "postDetail", "comments"]
        }),
        getUserComments: builder.query({
            query: userId => ({
                url: `/user/post-comments?user_id=${userId}&exclude_anonymous=1&type=all`,
                method: "get",
            }),
            providesTags: ["usercomments"]
        }),
        getUserUpvotes: builder.query({
            query: ({page, id}) => ({
                url: `/user/posts/actions/get-upvotes?user_id=${id}&page=${page}`,
                method: "get",
            }),
            providesTags: ["upvotes"]
        }),
        getUserPosts: builder.query({
            query: ({ userId, page }) => ({
                url: `/user/posts/?user_id=${userId}&tab=latest&page=${page}`,
                method: "get",
            }),
            providesTags: ["userposts"]
        }),
    })
})

export const {
    useGetAllPostsQuery,
    useGetRecentPostsQuery,
    useGetSinglePostQuery,
    useDeletePostMutation,
    useGetPostCommentsQuery,
    usePostReactionMutation,
    useCommentReactionMutation,
    useMakeCommentMutation,
    useCreatePostMutation,
    useSavePostToDraftsMutation,
    useSelectPollOptionMutation,
    useDeleteCommentMutation,
    useGetUserCommentsQuery,
    useGetUserUpvotesQuery,
    useGetUserPostsQuery,
} = postsApiSlice
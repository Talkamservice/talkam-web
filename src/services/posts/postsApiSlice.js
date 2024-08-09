import { defaultSerializeQueryArgs } from "@reduxjs/toolkit/query"
import { apiSlice } from "../../app/api/apiSlice"

export const postsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllPosts: builder.query({
            query: ({tab, categoryId="", groupId="", page}) => ({
                url: `/user/posts/?tab=${tab}&category_id=${categoryId}&group_id=${groupId}&page=${page}`,
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
            invalidatesTags: ["posts", "userposts", "upvotes"]
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
            invalidatesTags: ["postDetail", "posts", "upvotes"],
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
            invalidatesTags: ["comments", "postDetail"],
        }),
        createPost: builder.mutation({
            query: body => ({
                url: `/user/posts`,
                method: 'post',
                body: { ...body }
            }),
            invalidatesTags: ["posts", "userposts"]
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
            invalidatesTags: ["posts", "postDetail"]
        }),
        deleteComment: builder.mutation({
            query: postId => ({
                url: `/user/post-comments/${postId}`,
                method: 'delete',
            }),
            invalidatesTags: ["postDetail", "comments"]
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
                url: `/user/posts/?user_id=${userId}&tab=latest&page=${page}&exclude_anonymous=1`,
                method: "get",
            }),
            serializeQueryArgs: ({ queryArgs, endpointDefinition, endpointName }) => {
                const { userId } = queryArgs

                return defaultSerializeQueryArgs({
                  endpointName,
                  queryArgs: { userId },
                  endpointDefinition
                })
            },
            forceRefetch({ currentArg, previousArg }) {
                const { page, userId } = currentArg;

                const data = previousArg;
                const prevPage = data && data.page;
                const prevUserId = data && data.userId;

                if((page === prevPage) && (userId === prevUserId)){
                    return false;
                } else {
                    return true;
                }
            },
            providesTags: ["userposts"]
        }),
        blockUser: builder.mutation({
            query: id => ({
                url: `/user/blocked-users/add`,
                method: 'post',
                body: id
            }),
            invalidatesTags: ['posts', 'blocked']
        }),
        getBlockedList: builder.query({
            keepUnusedDataFor: 0,
            query: () => ({
                url: `/user/blocked-users`,
                method: 'get',
            }),
            providesTags: ['blocked']
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
    useBlockUserMutation,
    useGetBlockedListQuery,
} = postsApiSlice
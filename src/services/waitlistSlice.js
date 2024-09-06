import { apiSlice } from "../app/api/apiSlice";

export const waitlistSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    joinWaitlist: builder.mutation({
      query: (data) => ({
        url: "/user/waitlist/save",
        method: "post",
        body: { ...data },
      }),
    }),
  }),
});

export const { useJoinWaitlistMutation } = waitlistSlice;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { logOut, setCredentials } from "../../services/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_API_URL,
  // credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
      headers.set('Content-Type', 'application/json');
    }
    return headers;
  },
});

//If there is ever an implemetation for refresh Tokens, hence why it wraps my baseQuery...
// const baseQueryWithReauth = async (args, api, extraOptions) => {
//   //Here i check for the current results from my baseQuery...
//   let result = await baseQuery(args, api, extraOptions)
//   // Now depending on what status code the backend returns for an expired accessToken i am going to request for a refresh token 
//   // if i have a user currently logged in
//   if(result?.error?.status === 401 || result?.error?.status ===  403){
//     const refreshToken = api?.getState()?.auth?.refreshToken
//     //I now send refresh token to get new access Token
//     const refreshResult = await baseQuery({url: `auth/token`, method: 'POST', body: { refreshToken: refreshToken }}, api, extraOptions)
//     //Now if it's a success, i get a data object and not an error, and i'll now replace my accessToken and keep my user object  
//     if(refreshResult?.data){
//       const user = api.getState().auth.user
//       //store new token 
//       api.dispatch(setCredentials({ ...refreshResult?.data?.data[0]?.accessToken, user }))
//       //retry original query with new access Token
//       result = await baseQuery(args, api, extraOptions)
//     } else {
//       api.dispatch(logOut())
//     }
//   }
//   return result
// }

export const apiSlice = createApi({
  baseQuery: baseQuery,
  endpoints: (builder) => ({}),
});
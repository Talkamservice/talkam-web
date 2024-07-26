import { createSlice } from "@reduxjs/toolkit";
import { Storage } from "../app/storage";

//Keys for storage items
export const TOKEN = "TOKEN";
export const USER = "USER-STATE";

//store storage items 
const token = window ? Storage.getItem(TOKEN) : null;
const user = window ? Storage.getItem(USER) : null;

const authSlice = createSlice({
  name: "auth",
  //Here I create my initial state for the global state i need for our authenticated user
  initialState: {
    user: user,
    token: token,
    // refreshToken: null
  },
  // I have my reducers here i can use everywhere in our the to dispatch actions and update our state... 
  reducers: {
    //this sets the current user logged into the app and also the accessToken
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.token = accessToken;
    //   state.refreshToken = refreshToken;
      Storage.setItem(USER, user);
      Storage.setItem(TOKEN, accessToken);
    },
    //this clears the user from state on logOut
    logOut: (state, action) => {
      state.user = null;
      state.token = null;

      Storage.clearItem();
      Storage.removeItem(USER);
      Storage.removeItem(TOKEN);
    },
    //Other reducers can go here...
  },
});

export const {
  setCredentials,
  logOut,
} = authSlice.actions;

export default authSlice.reducer;
//This selectors give me access to these values if needed anywhere in the app...
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
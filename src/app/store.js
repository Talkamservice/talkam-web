import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { apiSliceV2 } from "./api/apiSliceV2";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "../services/authSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [apiSliceV2.reducerPath]: apiSliceV2.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, apiSliceV2.middleware),
    devtTools: true
});

setupListeners(store.dispatch);
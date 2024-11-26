import { configureStore } from "@reduxjs/toolkit";
import visitorSegmentsReducer from "./visitorSegmentsSlice";

export const store = configureStore({
  reducer: {
    visitorSegments: visitorSegmentsReducer,
  },
});

export default store;
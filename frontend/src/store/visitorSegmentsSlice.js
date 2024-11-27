import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchContactSegments } from "../services/fetchContactSegments";

// Async thunk to fetch contact segments
export const fetchSegments = createAsyncThunk(
  "visitorSegments/fetchSegments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchContactSegments();
      const segmentNames = response.segments 
        ? Object.values(response.segments).map((segment) => segment.name)
        : [];
      
      console.log("Extracted Visitor Segment Names:", segmentNames);
      
      return segmentNames;
    } catch (err) {
      console.error("Visitor Segments Fetch Error:", err);
      return rejectWithValue(err.message);
    }
  }
);

const visitorSegmentsSlice = createSlice({
  name: "visitorSegments",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {}, // Optional: add manual reducers if needed
  extraReducers: (builder) => {
    builder
      .addCase(fetchSegments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSegments.fulfilled, (state, action) => {
        // console.log("Action Payload:", action.payload);
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchSegments.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export default visitorSegmentsSlice.reducer;

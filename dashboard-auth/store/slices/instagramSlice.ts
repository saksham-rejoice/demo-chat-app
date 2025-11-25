import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { logActivity } from '../../services/instagramService';
import { ActivityLogRequest, BaseResponse } from '../../types/instagram';

interface InstagramState {
  currentCollectionName: string | null;
  activityLog: {
    loading: boolean;
    error: string | null;
  };
  activityRefreshTrigger: number;
}

const initialState: InstagramState = {
  currentCollectionName: null,
  activityLog: {
    loading: false,
    error: null,
  },
  activityRefreshTrigger: 0,
};

export const logActivityAsync = createAsyncThunk<
  BaseResponse,
  ActivityLogRequest,
  { rejectValue: string }
>('instagram/logActivity', async (data, { rejectWithValue }) => {
  try {
    return await logActivity(data);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to log activity');
  }
});

const instagramSlice = createSlice({
  name: 'instagram',
  initialState,
  reducers: {
    setCurrentCollectionName: (state, action: PayloadAction<string>) => {
      state.currentCollectionName = action.payload;
    },
    clearCurrentCollectionName: (state) => {
      state.currentCollectionName = null;
    },
    refreshActivity: (state) => {
      state.activityRefreshTrigger += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logActivityAsync.pending, (state) => {
        state.activityLog.loading = true;
        state.activityLog.error = null;
      })
      .addCase(logActivityAsync.fulfilled, (state) => {
        state.activityLog.loading = false;
        state.activityLog.error = null;
      })
      .addCase(logActivityAsync.rejected, (state, action) => {
        state.activityLog.loading = false;
        state.activityLog.error = action.payload || 'Failed to log activity';
      });
  },
});

export const { setCurrentCollectionName, clearCurrentCollectionName, refreshActivity } = instagramSlice.actions;
export default instagramSlice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InstagramState {
  currentCollectionName: string | null;
}

const initialState: InstagramState = {
  currentCollectionName: null,
};

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
  },
});

export const { setCurrentCollectionName, clearCurrentCollectionName } = instagramSlice.actions;
export default instagramSlice.reducer;
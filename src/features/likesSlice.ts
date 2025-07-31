import { createSlice } from '@reduxjs/toolkit';

interface LikesState {
  likedProducts: string[]; // Adjust type based on your data (e.g., array of product IDs or objects)
}

const initialState: LikesState = {
  likedProducts: [], // Initialize as an empty array to avoid undefined
};

const likesSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {
    addLike(state, action) {
      state.likedProducts.push(action.payload);
    },
    removeLike(state, action) {
      state.likedProducts = state.likedProducts.filter((id) => id !== action.payload);
    },
    // Add other reducers as needed
  },
});

export const { addLike, removeLike } = likesSlice.actions;
export default likesSlice.reducer;
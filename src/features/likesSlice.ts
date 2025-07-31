import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { LikedProduct } from "@/types"

interface LikesState {
  likedProducts: LikedProduct[]
}

// Get initial likes from localStorage
const getInitialLikes = (): LikedProduct[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem("liked-products")
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (error) {
        console.error("Error parsing liked products from localStorage:", error)
        return []
      }
    }
  }
  return []
}

const initialState: LikesState = {
  likedProducts: getInitialLikes(),
}

const likesSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    addLike: (state, action: PayloadAction<LikedProduct>) => {
      const exists = state.likedProducts.find((item) => item.id === action.payload.id)
      if (!exists) {
        state.likedProducts.push(action.payload)
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem("liked-products", JSON.stringify(state.likedProducts))
        }
      }
    },
    removeLike: (state, action: PayloadAction<string>) => {
      state.likedProducts = state.likedProducts.filter((item) => item.id !== action.payload)
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem("liked-products", JSON.stringify(state.likedProducts))
      }
    },
    clearLikes: (state) => {
      state.likedProducts = []
      // Clear from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem("liked-products")
      }
    },
  },
})

export const { addLike, removeLike, clearLikes } = likesSlice.actions
export default likesSlice.reducer

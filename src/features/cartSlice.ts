import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { CartItem } from "@/types"

interface CartState {
  items: CartItem[]
}

// Get initial cart from localStorage
const getInitialCart = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem("cart-items")
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (error) {
        console.error("Error parsing cart items from localStorage:", error)
        return []
      }
    }
  }
  return []
}

const initialState: CartState = {
  items: getInitialCart(),
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id && item.size === action.payload.size,
      )

      if (existingItem) {
        existingItem.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem("cart-items", JSON.stringify(state.items))
      }
    },
    removeFromCart: (state, action: PayloadAction<{ id: string; size: number }>) => {
      state.items = state.items.filter((item) => !(item.id === action.payload.id && item.size === action.payload.size))
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem("cart-items", JSON.stringify(state.items))
      }
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; size: number; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id && item.size === action.payload.size)
      if (item) {
        item.quantity = action.payload.quantity
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem("cart-items", JSON.stringify(state.items))
        }
      }
    },
    clearCart: (state) => {
      state.items = []
      // Clear from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem("cart-items")
      }
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer

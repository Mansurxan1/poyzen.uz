import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { CartItem } from "@/types"

interface CartState {
  items: CartItem[]
}

const loadCartFromLocalStorage = (): CartItem[] => {
  try {
    const serializedCart = localStorage.getItem("cartItems")
    if (serializedCart === null) {
      return []
    }
    return JSON.parse(serializedCart)
  } catch (error) {
    console.error("Error loading cart from localStorage:", error)
    return []
  }
}

const saveCartToLocalStorage = (cartItems: CartItem[]) => {
  try {
    const serializedCart = JSON.stringify(cartItems)
    localStorage.setItem("cartItems", serializedCart)
  } catch (error) {
    console.error("Error saving cart to localStorage:", error)
  }
}

const initialState: CartState = {
  items: loadCartFromLocalStorage(),
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload
      const existingItem = state.items.find((item) => item.id === newItem.id && item.size === newItem.size)

      if (existingItem) {
        existingItem.quantity += newItem.quantity
      } else {
        state.items.push(newItem)
      }
      saveCartToLocalStorage(state.items)
    },
    removeItemFromCart: (state, action: PayloadAction<{ id: string; size: number }>) => {
      state.items = state.items.filter((item) => !(item.id === action.payload.id && item.size === action.payload.size))
      saveCartToLocalStorage(state.items)
    },
    updateItemQuantity: (state, action: PayloadAction<{ id: string; size: number; quantity: number }>) => {
      const { id, size, quantity } = action.payload
      const existingItem = state.items.find((item) => item.id === id && item.size === size)

      if (existingItem) {
        existingItem.quantity = quantity
        if (existingItem.quantity <= 0) {
          state.items = state.items.filter((item) => !(item.id === id && item.size === size))
        }
      }
      saveCartToLocalStorage(state.items)
    },
    clearCart: (state) => {
      state.items = []
      saveCartToLocalStorage(state.items)
    },
  },
})

export const { addItemToCart, removeItemFromCart, updateItemQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer

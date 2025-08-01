import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info" | "warning"
  duration?: number // in milliseconds, default 3000
}

interface ToastState {
  toasts: Toast[]
}

const initialState: ToastState = {
  toasts: [],
}

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<Toast, "id"> & { id?: string }>) => {
      const newToast: Toast = {
        id: action.payload.id || Date.now().toString(), // Generate unique ID if not provided
        ...action.payload,
      }
      state.toasts.push(newToast)
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload)
    },
  },
})

export const { addToast, removeToast } = toastSlice.actions
export default toastSlice.reducer

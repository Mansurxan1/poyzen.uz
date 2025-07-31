import { createSlice } from "@reduxjs/toolkit"

interface CurrencyState {
  currency: string
}

const initialState: CurrencyState = {
  currency: localStorage.getItem("currency") || "usd",
}

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency: (state, action: { payload: string }) => {
      state.currency = action.payload
      localStorage.setItem("currency", action.payload)
    },
  },
})

export const { setCurrency } = currencySlice.actions
export default currencySlice.reducer

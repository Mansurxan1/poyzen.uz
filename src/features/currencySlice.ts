import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface CurrencyState {
  currency: string
}

const getInitialCurrency = (): string => {
  return localStorage.getItem("currency") || "usd"
}

const initialState: CurrencyState = {
  currency: getInitialCurrency(),
}

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload
      localStorage.setItem("currency", action.payload)
    },
  },
})

export const { setCurrency } = currencySlice.actions
export default currencySlice.reducer

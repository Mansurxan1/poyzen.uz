import { createSlice } from "@reduxjs/toolkit"
import i18n from "@/i18n/i18n" // Import i18n instance

interface LanguageState {
  language: string
}

const initialState: LanguageState = {
  language: localStorage.getItem("i18n-lang") || "ru",
}

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: { payload: string }) => {
      state.language = action.payload
      localStorage.setItem("i18n-lang", action.payload)
      // Also update i18n instance directly
      if (i18n.language !== action.payload) {
        i18n.changeLanguage(action.payload)
      }
    },
  },
})

export const { setLanguage } = languageSlice.actions
export default languageSlice.reducer

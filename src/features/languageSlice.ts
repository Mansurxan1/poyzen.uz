import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import i18n from "@/i18n/i18n"

interface LanguageState {
  language: string
}

// Get initial language from localStorage or default to 'ru'
const getInitialLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem("i18n-lang")
    if (saved && (saved === 'uz' || saved === 'ru')) {
      return saved
    }
  }
  return "ru" // Default to Russian
}

const initialState: LanguageState = {
  language: getInitialLanguage(),
}

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem("i18n-lang", action.payload)
      }
      // Update i18n language
      if (i18n.language !== action.payload) {
        i18n.changeLanguage(action.payload)
      }
    },
    initializeLanguage: (state) => {
      const saved = getInitialLanguage()
      state.language = saved
      if (i18n.language !== saved) {
        i18n.changeLanguage(saved)
      }
    }
  },
})

export const { setLanguage, initializeLanguage } = languageSlice.actions
export default languageSlice.reducer

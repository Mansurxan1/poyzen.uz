import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import uz from "./locales/uz.json"
import ru from "./locales/ru.json"

// Get initial language from localStorage or default to 'ru'
const getInitialLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem("i18n-lang")
    if (saved && (saved === 'uz' || saved === 'ru')) {
      return saved
    }
  }
  return "ru"
}

i18n.use(initReactI18next).init({
  resources: {
    uz: { translation: uz },
    ru: { translation: ru },
  },
  lng: getInitialLanguage(),
  fallbackLng: "ru",
  interpolation: {
    escapeValue: false,
  },
})

export default i18n

import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import uz from "./locales/uz.json"
import ru from "./locales/ru.json"

i18n.use(initReactI18next).init({
  resources: {
    uz: { translation: uz },
    ru: { translation: ru },
  },
  lng: "ru",
  fallbackLng: "ru",
  interpolation: {
    escapeValue: false,
  },
})

export default i18n

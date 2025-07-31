import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import i18n from "./i18n/i18n"
import React from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "./redux"
import { setLanguage } from "@/features/languageSlice"
import Home from "./pages/Home/home"
import BrandPage from "./pages/brandPage/brandPage"
import Brand from "./pages/brand/brand"


const App = () => {
  const dispatch: AppDispatch = useDispatch()
  const currentLang = useSelector((state: RootState) => state.language.language)

  React.useEffect(() => {
    const savedLang = localStorage.getItem("i18n-lang") || "ru"
    if (currentLang !== savedLang) {
      dispatch(setLanguage(savedLang))
    }
  }, [dispatch, currentLang])

  React.useEffect(() => {
    document.documentElement.lang = currentLang 

    const handleLanguageChanged = (lng: string) => {
      document.documentElement.lang = lng
    }
    i18n.on("languageChanged", handleLanguageChanged)

    return () => {
      i18n.off("languageChanged", handleLanguageChanged)
    }
  }, [currentLang])

  return (
    <BrowserRouter>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Navigate to={`/${currentLang}`} replace />} />
          <Route path="/:lang" element={<Home />} />
          <Route path="/:lang/brand" element={<Brand />} />
          <Route path="/:lang/brand/:id" element={<BrandPage />} />
          {/* <Route path="*" element={<Navigate to={`/${currentLang}`} replace />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

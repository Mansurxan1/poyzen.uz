import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import i18n from "./i18n/i18n"
import React from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "./redux"
import { initializeLanguage } from "@/features/languageSlice"
import Home from "@/pages/Home/home"
import BrandPage from "@/pages/brandPage/brandPage"
import Brand from "@/pages/brand/brand"
import ProductAll from "@/pages/productAll/ProductAll"
import LikesPage from "@/pages/likes/likes"
import CartPage from "@/pages/cart/cartPage"
import SearchBar from "./pages/Search/search"

const App = () => {
  const dispatch: AppDispatch = useDispatch()
  const currentLang = useSelector((state: RootState) => state.language.language)

  React.useEffect(() => {
    // Initialize language from localStorage on app start
    dispatch(initializeLanguage())
  }, [dispatch])

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
          <Route path="/:lang/products" element={<ProductAll />} />
          <Route path="/:lang/search" element={<SearchBar />} />
          <Route path="/:lang/likes" element={<LikesPage />} />
          <Route path="/:lang/cart" element={<CartPage />} />
          <Route path="*" element={<Navigate to={`/${currentLang}`} replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

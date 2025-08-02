import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/common/Navbar"
import i18n from "./i18n/i18n"
import React from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "./redux"
import { initializeLanguage } from "@/features/languageSlice"
import Home from "@/pages/Home/home"
import ProductAll from "@/pages/productAll/ProductAll"
import Likes from "@/pages/likes/likes"
import Search from "@/pages/Search/search"
import ProductDetails from "@/pages/productDetails/ProductDetails"
import Cart from "@/pages/cart/cartPage"
import Brand from "@/pages/brand/brand"
import BrandPage from "./pages/brandPage/brandPage"

const App = () => {
  const dispatch: AppDispatch = useDispatch()
  const currentLang = useSelector((state: RootState) => state.language.language)

  React.useEffect(() => {
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
          <Route path="/:lang/products" element={<ProductAll />} />
          <Route path="/:lang/likes" element={<Likes />} />
          <Route path="/:lang/search" element={<Search />} />
          <Route path="/:lang/:brand/:nameUrl/:id" element={<ProductDetails />} />
          <Route path="/:lang/brand" element={<Brand />} />
          <Route path="/:lang/brand/:brandId" element={<BrandPage />} />
          <Route path="/:lang/cart" element={<Cart />} />
          <Route path="*" element={<Navigate to={`/${currentLang}`} replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

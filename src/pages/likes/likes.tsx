"use client"

import type React from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import ProductCard from "@/pages/productAll/components/ProductCard"
import Button from "@/components/ui/button"

const Likes: React.FC = () => {
  const { t } = useTranslation()
  const likedProducts = useSelector((state: RootState) => state.likes.likedProducts)
  const language = useSelector((state: RootState) => state.language.language)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        {t("likedProducts")} ({likedProducts.length})
      </h1>

      {likedProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">❤️</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">{t("noLikedProducts")}</h3>
          <p className="text-gray-500 mb-6">{t("startLikingProducts")}</p>
          <Link to={`/${language}/products`}>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg">
              {t("browseProducts")}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 auto-rows-fr">
          {likedProducts.map((item) => (
            <ProductCard key={item.id} variant={item.variant} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Likes

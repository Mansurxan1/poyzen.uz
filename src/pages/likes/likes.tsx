import type React from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import ProductCard from "@/pages/productAll/components/ProductCard"
import Button from "@/components/ui/button"
import { useEffect } from "react"
import { FaHeart, FaShoppingCart, FaHome } from "react-icons/fa"

const Likes: React.FC = () => {
  const { t } = useTranslation()
  const likedProducts = useSelector((state: RootState) => state.likes.likedProducts)
  const language = useSelector((state: RootState) => state.language.language)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <FaHeart className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {t("likedProducts")}
        </h1>
        <p className="text-xl text-gray-600">
          {likedProducts.length} {t("items")}
        </p>
      </div>

      {likedProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <FaHeart className="w-10 h-10 text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-3">{t("noLikedProducts")}</h3>
          <p className="text-gray-500 mb-8 text-lg">{t("startLikingProducts")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/${language}/products`}>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
                <FaShoppingCart className="w-5 h-5 mr-2" />
                {t("browseProducts")}
              </Button>
            </Link>
            <Link to={`/${language}`}>
              <Button variant="outline" className="px-8 py-3 rounded-lg bg-transparent border-2 border-gray-300 hover:border-gray-400 text-lg font-semibold transition-all duration-200">
                <FaHome className="w-5 h-5 mr-2" />
                {t("back_to_home")}
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 auto-rows-fr">
          {likedProducts.map((item) => (
            <ProductCard key={item.id} variant={item.variant} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Likes

"use client"

import type React from "react"
import { useSelector, useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { AiFillHeart } from "react-icons/ai"
import { FaShoppingCart } from "react-icons/fa"
import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
// @ts-expect-error - Swiper CSS import
import "swiper/css/bundle"
import type { RootState, AppDispatch } from "@/redux"
import { removeLike } from "@/features/likesSlice"
import { addToCart } from "@/features/cartSlice"
import Button from "@/components/ui/button"

const LikesPage: React.FC = () => {
  const { t } = useTranslation()
  const dispatch: AppDispatch = useDispatch()

  const likedProducts = useSelector((state: RootState) => state.likes.likedProducts)
  const currency = useSelector((state: RootState) => state.currency.currency) as "usd" | "uzs"
  const lang = useSelector((state: RootState) => state.language.language)
  const colors = useSelector((state: RootState) => state.categories.colors)

  const formatPrice = (price: number, isUZS: boolean = currency === "uzs") => {
    return price
      .toLocaleString(isUZS ? "uz-UZ" : "en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      .replace(/,/g, isUZS ? " " : ",")
  }

  const handleRemoveLike = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    dispatch(removeLike(productId))
  }

  const handleAddToCart = (likedProduct: (typeof likedProducts)[0], size: number, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    dispatch(
      addToCart({
        id: likedProduct.variant.id,
        quantity: 1,
        size,
        variant: likedProduct.variant,
        product: likedProduct.product,
      }),
    )
  }

  if (likedProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">{t("likedProducts")}</h1>
          <div className="text-center py-16">
            <div className="text-gray-400 text-8xl mb-6">💝</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              {t("noLikedProducts")}
            </h3>
            <p className="text-gray-600 mb-8 text-lg">{t("startLikingProducts")}</p>
            <Link to={`/${lang}/products`}>
              <Button variant="outline" className="px-8 py-3 text-lg">
                {t("browseProducts")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t("likedProducts")}</h1>
          <p className="text-gray-600 text-lg">
            {likedProducts.length} {t("products")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {likedProducts.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative">
                <Link to={`/${lang}/${item.product.brand}/${item.variant.nameUrl}/${item.variant.id}`}>
                  <Swiper modules={[Pagination]} pagination={{ clickable: true }} loop={true} className="w-full h-48">
                    {item.variant.images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`${item.product.name} ${index + 1}`}
                          className="w-full h-48 object-cover"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Link>
                <button
                  onClick={(e) => handleRemoveLike(item.id, e)}
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg z-10 transition-all duration-200 hover:bg-red-50 hover:scale-110"
                >
                  <AiFillHeart className="w-5 h-5 text-red-500" aria-label="remove from likes" />
                </button>
              </div>
              <div className="p-4">
                <Link to={`/${lang}/${item.product.brand}/${item.variant.nameUrl}/${item.variant.id}`}>
                  <h3 className="font-bold text-lg line-clamp-2 text-ellipsis overflow-hidden text-gray-800 hover:text-blue-600 transition-colors">
                    {`${item.product.brand} - ${item.product.name}`}
                  </h3>
                </Link>
                <div className="flex flex-col text-sm text-gray-600 mt-2">
                  <p>
                    {t("price")}:{" "}
                    <span className="line-through text-red-400">
                      {formatPrice(item.variant.sizes[0]?.price?.[currency] || 0)}
                    </span>{" "}
                    {currency.toUpperCase()}
                  </p>
                  <p>
                    {t("discount")}:{" "}
                    <span className="font-bold text-green-600">
                      {formatPrice(item.variant.sizes[0]?.discount?.[currency] || 0)}
                    </span>{" "}
                    {currency.toUpperCase()}
                  </p>
                  <p className="flex items-center gap-2 mt-1">
                    {t("color")}:{" "}
                    <span
                      className="w-4 h-4 rounded-full inline-block border border-gray-300"
                      style={{
                        backgroundColor: colors.find((c) => c.id === item.variant.color)?.color || "#000000",
                      }}
                      title={
                        colors.find((c) => c.id === item.variant.color)?.name?.[
                          lang as keyof (typeof colors)[0]["name"]
                        ] || "Unknown"
                      }
                    ></span>
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">{t("availableSizes")}:</p>
                  <div className="flex flex-wrap gap-2">
                    {item.variant.sizes
                      .filter((size) => size.inStock)
                      .slice(0, 3)
                      .map((size) => (
                        <button
                          key={size.size}
                          onClick={(e) => handleAddToCart(item, size.size, e)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 transition-colors"
                          title={`Add size ${size.size} to cart`}
                        >
                          <FaShoppingCart className="w-3 h-3" />
                          {size.size}
                        </button>
                      ))}
                    {item.variant.sizes.filter((size) => size.inStock).length > 3 && (
                      <Link
                        to={`/${lang}/${item.product.brand}/${item.variant.nameUrl}/${item.variant.id}`}
                        className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full hover:bg-gray-300 transition-colors"
                      >
                        +{item.variant.sizes.filter((size) => size.inStock).length - 3} more
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LikesPage

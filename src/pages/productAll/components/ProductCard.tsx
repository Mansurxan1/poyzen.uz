"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import "swiper/css/bundle"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux"
import type { ProductVariant, Color } from "@/types"
import { useCurrency } from "@/hooks/useCurrency"
import { useProductLikes } from "@/hooks/useProductLikes"

interface ProductCardProps {
  variant: ProductVariant
}

const ProductCard: React.FC<ProductCardProps> = ({ variant }) => {
  const { t } = useTranslation()
  const { currency, formatPrice } = useCurrency()
  const { toggleLike, isLiked } = useProductLikes()
  const language = useSelector((state: RootState) => state.language.language)
  const colors = useSelector((state: RootState) => state.categories.colors)

  const getLocalizedName = (name: { uz: string; ru: string }) => {
    return language === "uz" ? name.uz : name.ru
  }

  return (
    <Link
      to={`/${language}/${variant.brand}/${variant.nameUrl}/${variant.id}`}
      className="border rounded-lg overflow-hidden shadow-sm relative hover:shadow-md transition-shadow"
    >
      <div className="relative">
        <Swiper modules={[Pagination]} pagination={{ clickable: true }} loop={true} className="w-full h-48">
          {variant.images.map((image: string, index: number) => (
            <SwiperSlide key={index}>
              <img
                src={image || "/placeholder.svg"}
                alt={`${variant.nameUrl} ${index + 1}`}
                className="w-full h-48 object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {variant.sizes[0].discount[currency] < variant.sizes[0].price[currency] && (
          <div className="absolute top-2 left-2 z-50 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
            -
            {Math.round(
              ((variant.sizes[0].price[currency] - variant.sizes[0].discount[currency]) /
                variant.sizes[0].price[currency]) *
                100,
            )}
            %
          </div>
        )}

        <button
          onClick={(e) => toggleLike(variant.id, variant, variant.product!, e)}
          className={`absolute top-2 right-2 rounded-full p-2 shadow z-10 ${
            isLiked(variant.id) ? "bg-white border-none" : "bg-black border border-black"
          }`}
        >
          {isLiked(variant.id) ? (
            <AiFillHeart className="w-5 h-5 text-teal-400" />
          ) : (
            <AiOutlineHeart className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      <div className="p-2">
        <h3 className="font-semibold line-clamp-2 text-ellipsis overflow-hidden">
          {`${variant.brand} - ${variant.productName}`}
        </h3>
        <div className="flex flex-col text-sm text-gray-600">
          <p>
            {t("price")}:{" "}
            <span className="line-through text-red-400">
              {formatPrice(variant.sizes[0].price[currency])} {currency.toUpperCase()}
            </span>
          </p>
          <p>
            {t("discount")}:{" "}
            <span className="font-bold text-green-600">
              {formatPrice(variant.sizes[0].discount[currency])} {currency.toUpperCase()}
            </span>
          </p>
          <p className="flex items-center gap-2">
            {t("color")}:{" "}
            <span
              className="w-4 h-4 rounded-full inline-block border border-gray-300"
              style={{
                backgroundColor: colors.find((c: Color) => c.id === variant.color)?.color || "#000000",
              }}
              title={getLocalizedName(
                colors.find((c: Color) => c.id === variant.color)?.name || {
                  uz: "Noma'lum",
                  ru: "Неизвестно",
                },
              )}
            />
          </p>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard

import type React from "react"
import { useSelector, useDispatch } from "react-redux" // Import useDispatch
import { useTranslation } from "react-i18next"
import type { RootState, AppDispatch } from "@/redux" // Import AppDispatch
import { useMemo } from "react"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"
import { Link } from "react-router-dom"
import Button from "@/components/ui/button"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import { useCurrency } from "@/hooks/useCurrency"
import { addLike, removeLike } from "@/features/likesSlice" // Import Redux like actions
import type { ProductVariant, Product } from "@/types"

const Last24HoursProducts = () => {
  const { t } = useTranslation()
  const dispatch: AppDispatch = useDispatch()
  const products = useSelector((state: RootState) => state.products.data)
  const { currency, formatPrice } = useCurrency()
  const lang = useSelector((state: RootState) => state.language.language)
  const colors = useSelector((state: RootState) => state.categories.colors)
  const likedProducts = useSelector((state: RootState) => state.likes.likedProducts) // Get liked products from Redux

  const toggleLike = (productId: string, variant: ProductVariant, product: Product, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    const isLiked = likedProducts.some((item) => item.id === productId)

    if (isLiked) {
      dispatch(removeLike(productId))
    } else {
      dispatch(
        addLike({
          id: productId,
          variant: variant,
          product: product,
        }),
      )
    }
  }

  const recentVariants = useMemo(() => {
    // Collect all variants with additional product metadata
    const allVariants: (ProductVariant & { brand: string; productName: string; product: Product })[] = []

    Object.values(products).forEach((brandProducts) => {
      brandProducts.forEach((product) => {
        product.variants.forEach((variant) => {
          allVariants.push({
            ...variant,
            brand: product.brand,
            productName: product.name,
            product: product,
          })
        })
      })
    })

    // Group variants by product name
    const groupedByName: { [name: string]: (typeof allVariants)[0][] } = {}
    allVariants.forEach((variant) => {
      if (!groupedByName[variant.productName]) {
        groupedByName[variant.productName] = []
      }
      groupedByName[variant.productName].push(variant)
    })

    // Select the most recent variant for each product name and collect all images and colors
    const filteredVariants = Object.values(groupedByName).map((variants) => {
      // Sort variants by createdAt to get the most recent one
      const sortedVariants = variants.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      const mostRecentVariant = sortedVariants[0]

      // Collect all unique images from variants with the same product name, prioritizing the most recent variant's images
      const allImages = sortedVariants
        .flatMap((v) => v.images)
        .filter((img, index, self) => self.indexOf(img) === index)

      // Collect all unique color IDs
      const uniqueColorIds = Array.from(new Set(sortedVariants.map((v) => v.color)))

      // Find the lowest discount price among all sizes of all variants with the same product name
      const allSizes = sortedVariants.flatMap((v) => v.sizes)
      const lowestDiscountSize = allSizes
        .filter((size) => size.discount?.[currency])
        .sort((a, b) => a.discount[currency] - b.discount[currency])[0] || sortedVariants[0].sizes[0]

      return {
        ...mostRecentVariant,
        images: [...mostRecentVariant.images, ...allImages.filter((img) => !mostRecentVariant.images.includes(img))], // Most recent images first
        colorIds: uniqueColorIds,
        sizes: [lowestDiscountSize], // Use the size with the lowest discount price
      }
    })

    // Sort by createdAt to get the 10 most recent products
    return filteredVariants
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
  }, [products, currency])

  if (!recentVariants.length) {
    return (
      <div className="p-4 text-center text-gray-500">
        {t("new_arrivals")} ({t("no_new_products")})
      </div>
    )
  }

  return (
    <section className="w-full sm:px-4 py-8">
      <h2 className="text-xl font-bold mb-4 text-center">
        {t("new_arrivals")} ({t("latest_products")})
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 auto-rows-fr">
        {recentVariants.map((item) => {
          const isItemLiked = likedProducts.some((likedItem) => likedItem.id === item.id)
          return (
            <Link
              key={item.id}
              to={`/${lang}/${item.brand}/${item.nameUrl}/${item.id}`}
              className="border border-gray-100 overflow-hidden shadow-sm relative"
            >
              <div className="relative">
                <Swiper modules={[Pagination]} pagination={{ clickable: true }} loop={true} className="w-full h-48">
                  {item.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={image}
                        alt={`${item.productName} ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {item.sizes[0]?.discount?.[currency] < item.sizes[0]?.price?.[currency] && (
                  <div className="absolute top-2 left-2 bg-red-500 z-30 text-white px-2 py-1 rounded text-xs font-semibold">
                    -
                    {Math.round(
                      ((item.sizes[0].price[currency] - item.sizes[0].discount[currency]) /
                        item.sizes[0].price[currency]) *
                        100,
                    )}
                    %
                  </div>
                )}
                <button
                  onClick={(e) => toggleLike(item.id, item, item.product, e)}
                  className={`absolute cursor-pointer top-2 right-2 rounded-full shadow p-2 z-10 transition-all duration-300 ease-in-out transform hover:scale-110 ${
                    isItemLiked 
                      ? "bg-white border-none shadow-lg scale-110" 
                      : "bg-white/80 hover:bg-white"
                  }`}
                >
                  {isItemLiked ? (
                    <AiFillHeart className="w-5 h-5 text-teal-400 animate-pulse" aria-label="unlike" />
                  ) : (
                    <AiOutlineHeart className="w-5 h-5 text-gray-600 hover:text-teal-400 transition-colors duration-200" aria-label="like" />
                  )}
                </button>
              </div>
              <div className="p-2">
                <h3 className="font-semibold line-clamp-2 text-ellipsis overflow-hidden">
                  {`${item.brand} - ${item.productName}`}
                </h3>
                <div className="flex flex-col text-sm text-gray-600">
                  <p>
                    {t("price")}:{" "}
                    <span className="line-through text-red-400">
                      {formatPrice(item.sizes[0]?.price?.[currency] || 0)} {currency.toUpperCase()}
                    </span>
                  </p>
                  <p>
                    {t("discount")}:{" "}
                    <span className="font-bold text-green-600">
                      {formatPrice(item.sizes[0]?.discount?.[currency] || 0)} {currency.toUpperCase()}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    {t("colors")}:{" "}
                    {item.colorIds.map((colorId) => {
                      const color = colors.find((c) => c.id === colorId)
                      return (
                        <span
                          key={colorId}
                          className={`w-4 h-4 rounded-full inline-block border ${
                            colorId === 1 ? "border-black" : "border-gray-300"
                          }`}
                          style={{ backgroundColor: color?.color || "#000000" }}
                          title={color?.name[lang as keyof typeof color.name] || t("color")}
                        ></span>
                      )
                    })}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
      <div className="flex justify-center mt-4">
        <Link to={`/${lang}/products`}>
          <Button variant="outline" className="w-full max-w-xs bg-transparent">
            {t("view_more")}
          </Button>
        </Link>
      </div>
    </section>
  )
}

export default Last24HoursProducts
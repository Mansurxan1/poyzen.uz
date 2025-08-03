import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode, Thumbs } from "swiper/modules"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"
import { FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa"
import { FiCheck } from "react-icons/fi"
import type { RootState, AppDispatch } from "@/redux"
import { addItemToCart, updateItemQuantity, removeItemFromCart } from "@/features/cartSlice"
import { addToast } from "@/features/toastSlice"
import Button from "@/components/ui/button"
import type { Color } from "@/types"
import type { ProductSize as ProductSizeType, ProductVariant as ProductVariantType } from "@/types"
import { useCurrency } from "@/hooks/useCurrency"
import { useProductLikes } from "@/hooks/useProductLikes"
import type { Material, Season } from "@/types"
import type { Swiper as SwiperType } from "swiper"
// @ts-expect-error - Swiper CSS module not found in types
import "swiper/css"
// @ts-expect-error - Swiper CSS module not found in types
import "swiper/css/free-mode"
// @ts-expect-error - Swiper CSS module not found in types
import "swiper/css/thumbs"

const ProductDetails: React.FC = () => {
  const { t } = useTranslation()
  const { brand, nameUrl, id } = useParams<{ brand: string; nameUrl: string; id: string }>()
  const dispatch: AppDispatch = useDispatch()
  const navigate = useNavigate()
  const { currency, formatPrice } = useCurrency()
  const { toggleLike, isLiked } = useProductLikes()
  const language = useSelector((state: RootState) => state.language.language)
  const productsData = useSelector((state: RootState) => state.products.data)
  const categoriesData = useSelector((state: RootState) => state.categories)
  const cartItems = useSelector((state: RootState) => state.cart.items)

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
  const [selectedSize, setSelectedSize] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const currentProductVariant = useMemo(() => {
    if (!brand || !nameUrl || !id) return null
    const brandProducts = productsData[brand]
    if (!brandProducts) return null
    for (const prod of brandProducts) {
      const variant = prod.variants.find((v) => v.id === id && v.nameUrl === nameUrl)
      if (variant) {
        return { ...variant, product: prod, brand: prod.brand, productName: prod.name, category: prod.category }
      }
    }
    return null
  }, [brand, nameUrl, id, productsData])

  const allProductVariants = useMemo(() => {
    if (!currentProductVariant || !currentProductVariant.product) return []
    return currentProductVariant.product.variants.map((variant) => ({
      ...variant,
      product: currentProductVariant.product,
      brand: currentProductVariant.brand,
      productName: currentProductVariant.productName,
      category: currentProductVariant.category,
    }))
  }, [currentProductVariant])

  const uniqueColorVariants = useMemo(() => {
    const seenColors = new Set<number>()
    const uniqueVariants: ProductVariantType[] = []
    allProductVariants.forEach((variant) => {
      if (!seenColors.has(variant.color)) {
        seenColors.add(variant.color)
        uniqueVariants.push(variant)
      }
    })
    return uniqueVariants
  }, [allProductVariants])

  const availableSizes = useMemo(() => {
    return (
      currentProductVariant?.sizes
        .filter((size: ProductSizeType) => size.inStock)
        .sort((a: ProductSizeType, b: ProductSizeType) => a.size - b.size) || []
    )
  }, [currentProductVariant])

  const selectedSizeDetails = useMemo(() => {
    return availableSizes.find((size: ProductSizeType) => size.size === selectedSize)
  }, [availableSizes, selectedSize])

  const displayPrice = selectedSizeDetails?.price[currency] || currentProductVariant?.sizes[0]?.price[currency] || 0
  const displayDiscount =
    selectedSizeDetails?.discount[currency] || currentProductVariant?.sizes[0]?.discount[currency] || 0

  const advancePaymentAmount = displayDiscount * 0.3

  const cartItem = useMemo(() => {
    return cartItems.find((item) => item.id === currentProductVariant?.id && item.size === selectedSize)
  }, [cartItems, currentProductVariant, selectedSize])

  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity)
    } else {
      setQuantity(1)
    }
  }, [cartItem])

  const handleSizeSelect = (size: number) => {
    setSelectedSize(size)
    const existingCartItem = cartItems.find((item) => item.id === currentProductVariant?.id && item.size === size)
    if (existingCartItem) {
      setQuantity(existingCartItem.quantity)
    } else {
      setQuantity(1)
    }
  }

  const handleQuantityChange = (amount: number) => {
    if (!selectedSizeDetails) {
      dispatch(addToast({ message: t("select_size_error"), type: "warning" }))
      return
    }

    const newQuantity = Math.max(0, quantity + amount)

    if (newQuantity === 0) {
      dispatch(removeItemFromCart({ id: currentProductVariant!.id, size: selectedSizeDetails.size }))
      dispatch(addToast({ message: t("product_removed_from_cart"), type: "info" }))
    } else if (cartItem) {
      dispatch(
        updateItemQuantity({ id: currentProductVariant!.id, size: selectedSizeDetails.size, quantity: newQuantity }),
      )
      dispatch(addToast({ message: t("cart_updated_success"), type: "info" }))
    } else {
      dispatch(
        addItemToCart({
          id: currentProductVariant!.id,
          quantity: newQuantity,
          size: selectedSizeDetails.size,
          variant: currentProductVariant!,
          product: currentProductVariant!.product!,
        }),
      )
      dispatch(addToast({ message: t("product_added_to_cart"), type: "success" }))
    }
    setQuantity(newQuantity)
  }

  const handleAddToCart = () => {
    if (!selectedSizeDetails) {
      dispatch(addToast({ message: t("select_size_error"), type: "warning" }))
      return
    }
    if (currentProductVariant && selectedSizeDetails) {
      dispatch(
        addItemToCart({
          id: currentProductVariant.id,
          quantity: 1,
          size: selectedSizeDetails.size,
          variant: currentProductVariant,
          product: currentProductVariant.product!,
        }),
      )
      dispatch(addToast({ message: t("product_added_to_cart"), type: "success" }))
    }
  }

  const handleToggleLike = (e: React.MouseEvent) => {
    if (!currentProductVariant || !currentProductVariant.product) return
    toggleLike(currentProductVariant.id, currentProductVariant, currentProductVariant.product, e)
  }

  const getLocalizedName = (name: { uz: string; ru: string }) => {
    return language === "uz" ? name.uz : name.ru
  }

  const getColorName = (colorId: number) => {
    const color = categoriesData.colors.find((c: Color) => c.id === colorId)
    return color ? getLocalizedName(color.name) : t("unknown_color")
  }

  const getMaterialName = (materialId: number) => {
    const material = categoriesData.materials.find((m: Material) => m.id === materialId)
    return material ? getLocalizedName(material.name) : t("unknown_material")
  }

  const getSeasonName = (seasonId: number) => {
    const season = categoriesData.season.find((s: Season) => s.id === seasonId)
    return season ? getLocalizedName(season.name) : t("unknown_season")
  }

  if (!currentProductVariant) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        {t("no_products_found")}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <nav className="text-sm text-gray-500 mb-6">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <Link to={`/${language}`} className="text-blue-600 hover:underline">
                {t("home")}
              </Link>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <Link to={`/${language}/products`} className="text-blue-600 hover:underline">
                {t("products")}
              </Link>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <Link
                to={`/${language}/brand/${currentProductVariant.brand?.toLowerCase()}`}
                className="text-blue-600 hover:underline"
              >
                {currentProductVariant.brand}
              </Link>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-700 font-medium">{currentProductVariant.productName}</li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-5">
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="relative w-full  mb-4">
              <Swiper
                spaceBetween={10}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Thumbs]}
                className="mySwiper2 rounded-2xl"
              >
                {currentProductVariant.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      alt={`${currentProductVariant.productName} ${index + 1}`}
                      className="w-full h-auto object-cover max-h-[450px]"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <button
                onClick={(e) => handleToggleLike(e)}
                className={`absolute top-4 right-4 rounded-full p-2 shadow-md z-10 ${
                  isLiked(currentProductVariant.id) ? "bg-white border-none" : ""
                }`}
              >
                {isLiked(currentProductVariant.id) ? (
                  <AiFillHeart className="w-6 h-6 text-teal-400" aria-label="unlike" />
                ) : (
                  <AiOutlineHeart className="w-6 h-6" aria-label="like" />
                )}
              </button>
            </div>
            <div className="w-full">
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView="auto"
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Thumbs]}
                className="mySwiper h-24 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100"
              >
                {currentProductVariant.images.map((image, index) => (
                  <SwiperSlide
                    key={index}
                    className="!w-20 !h-20 flex-shrink-0" // Fixed width for each thumbnail
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover rounded-md cursor-pointer border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2">{currentProductVariant.productName}</h1>
            <p className="text-gray-600 mb-4">{currentProductVariant.brand}</p>

            <div className="flex items-center mb-4">
              <span className="text-xl font-semibold text-gray-800 mr-2">{t("article")}:</span>
              <span className="text-lg text-gray-600">{currentProductVariant.id}</span>
            </div>

            <div className="flex items-center mb-4">
              <span className="text-xl font-semibold text-gray-800 mr-2">{t("gender")}:</span>
              <span className="text-lg text-gray-600">{t(currentProductVariant.gender.toLowerCase())}</span>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{t("availableSizes")}</h3>
              <div className="flex flex-wrap gap-2">
                {availableSizes.length > 0 ? (
                  availableSizes.map((size: ProductSizeType) => (
                    <Button
                      key={size.size}
                      variant={selectedSize === size.size ? "default" : "outline"}
                      onClick={() => handleSizeSelect(size.size)}
                      disabled={!size.inStock}
                      className={`px-4 py-2 rounded-md ${!size.inStock ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {size.size}
                    </Button>
                  ))
                ) : (
                  <p className="text-gray-500">{t("no_available_sizes")}</p>
                )}
              </div>
            </div>

            <div className="flex items-center mb-4">
              <span className="text-xl font-semibold text-gray-800 mr-2">{t("color")}:</span>
              <div className="flex gap-2">
                {uniqueColorVariants.map((variant) => {
                  const color = categoriesData.colors.find((c: Color) => c.id === variant.color)
                  const isSelected = variant.id === currentProductVariant.id
                  return (
                    <button
                      key={variant.id}
                      onClick={() => navigate(`/${language}/${variant.brand}/${variant.nameUrl}/${variant.id}`)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        isSelected ? "border-blue-500 ring-2 ring-blue-300" : "border-gray-300 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: color?.color }}
                      title={getColorName(variant.color)}
                      aria-label={`Select color ${getColorName(variant.color)}`}
                    >
                      {isSelected && <FiCheck className="w-4 h-4 text-white drop-shadow-sm" />}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center mb-4">
              <span className="text-xl font-semibold text-gray-800 mr-2">{t("materials")}:</span>
              <span className="text-lg text-gray-600">{getMaterialName(currentProductVariant.materials)}</span>
            </div>

            <div className="flex items-center mb-4">
              <span className="text-xl font-semibold text-gray-800 mr-2">{t("season")}:</span>
              <span className="text-lg text-gray-600">{getSeasonName(currentProductVariant.season)}</span>
            </div>

            <div className="flex items-center mb-6">
              <span className="text-xl font-semibold text-gray-800 mr-2">{t("year")}:</span>
              <span className="text-lg text-gray-600">{currentProductVariant.year}</span>
            </div>

            <div className="flex items-center mb-6">
              <span className="text-xl font-semibold text-gray-800 mr-2">{t("price")}:</span>
              {displayDiscount < displayPrice ? (
                <>
                  <span className="text-sm sm:text-xl mt-1 font-bold text-green-600 mr-2">
                    {formatPrice(displayDiscount)} {currency.toUpperCase()}
                  </span>
                  <span className="text-xs text-red-400 mt-1 line-through">
                    {formatPrice(displayPrice)} {currency.toUpperCase()}
                  </span>
                  <span className="ml-2 bg-red-500 text-white p-1 rounded text-sm font-semibold">
                    -{Math.round(((displayPrice - displayDiscount) / displayPrice) * 100)}%
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(displayPrice)} {currency.toUpperCase()}
                </span>
              )}
            </div>

            {currentProductVariant.inAdvancePayment && (
              <div className="mb-4 text-blue-700 font-medium">
                <p>
                  {t("in_advance_payment_details")}{" "}
                  <span className="font-bold">
                    {formatPrice(advancePaymentAmount)} {currency.toUpperCase()}
                  </span>
                </p>
              </div>
            )}

            <div className="flex flex-col gap-4 mb-6">
              {cartItem && cartItem.quantity > 0 ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 0}
                    >
                      <FaMinus className="w-4 h-4" />
                    </Button>
                    <span className="px-4 text-lg font-medium">{quantity}</span>
                    <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)}>
                      <FaPlus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!selectedSizeDetails || !selectedSizeDetails.inStock}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <FaShoppingCart className="mr-3 w-5 h-5" /> {t("add_to_cart")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("description")}</h3>
          <p className="text-gray-700 leading-relaxed">{getLocalizedName(currentProductVariant.description)}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("composition")}</h3>
          <p className="text-gray-700 leading-relaxed">{getMaterialName(currentProductVariant.materials)}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("rating")}</h3>
          <p className="text-gray-700 leading-relaxed">{currentProductVariant.rating}/5</p>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
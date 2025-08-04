import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode, Thumbs } from "swiper/modules"
import { Heart, Plus, Minus, ShoppingCart, Check, Star, ChevronRight, Bell, Mail, Pin, CheckCircle } from "lucide-react"
import type { RootState, AppDispatch } from "@/redux"
import { addItemToCart, updateItemQuantity, removeItemFromCart } from "@/features/cartSlice"
import { addToast } from "@/features/toastSlice"
import Button from "@/components/ui/button"
import Card from "@/components/ui/card"
import Badge from "@/components/ui/badge"
import Separator from "@/components/ui/separator"
import type {
  Color,
  Material,
  Season,
  ProductSize as ProductSizeType,
  ProductVariant as ProductVariantType,
} from "@/types"
import { useCurrency } from "@/hooks/useCurrency"
import { useProductLikes } from "@/hooks/useProductLikes"
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

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

  const handleBuyNow = () => {
    if (!selectedSizeDetails) {
      dispatch(addToast({ message: t("select_size_error"), type: "warning" }))
      return
    }
    if (quantity <= 0) {
      dispatch(addToast({ message: t("select_quantity_error"), type: "warning" }))
      return
    }
    setIsModalOpen(true)
  }

  const handleConfirmBuy = () => {
    if (currentProductVariant && selectedSizeDetails) {
      cartItems.forEach((item) => {
        if (item.id === currentProductVariant.id) {
          dispatch(removeItemFromCart({ id: item.id, size: item.size }))
        }
      })
      dispatch(addToast({ message: t("cart_cleared_for_product"), type: "info" }))

      const telegramUrl = `https://t.me/poyzenuzbot?start=${currentProductVariant.id}-${selectedSizeDetails.size}-${quantity}`
      window.location.href = telegramUrl
    }
    setIsModalOpen(false)
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
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">{t("no_products_found")}</h2>
          <p className="text-gray-500">Mahsulot topilmadi</p>
        </Card>
      </div>
    )
  }

  const discountPercentage =
    displayDiscount < displayPrice ? Math.round(((displayPrice - displayDiscount) / displayPrice) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to={`/${language}`} className="hover:text-blue-600 transition-colors">
              {t("home")}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/${language}/products`} className="hover:text-blue-600 transition-colors">
              {t("products")}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              to={`/${language}/brand/${currentProductVariant.brand?.toLowerCase()}`}
              className="hover:text-blue-600 transition-colors"
            >
              {currentProductVariant.brand}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium block truncate max-w-[200px]"
              title={currentProductVariant.productName}
            >
              {currentProductVariant.productName}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="relative">
                <Swiper
                  spaceBetween={10}
                  thumbs={{ swiper: thumbsSwiper }}
                  modules={[FreeMode, Thumbs]}
                  onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
                  className="aspect-square"
                >
                  {currentProductVariant.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${currentProductVariant.productName} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleToggleLike}
                  className="absolute top-4 right-4 rounded-full shadow-lg z-10"
                >
                  <Heart
                    className={`w-5 h-5 ${isLiked(currentProductVariant.id) ? "fill-red-500 text-red-500" : ""}`}
                  />
                </Button>

                {discountPercentage > 0 && (
                  <Badge className="absolute z-20 top-4 left-4 bg-red-500 text-white font-bold text-lg py-2 px-4 rounded-lg shadow-md">
                    -{discountPercentage}%
                  </Badge>
                )}
              </div>
            </Card>

            <div className="px-2">
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={8}
                slidesPerView="auto"
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Thumbs]}
                className="thumbnail-swiper"
              >
                {currentProductVariant.images.map((image, index) => (
                  <SwiperSlide key={index} className="!w-20 !h-20">
                    <div
                      className={`w-full h-full rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                        activeImageIndex === index ? "border-blue-500" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentProductVariant.productName}</h1>
              <p className="text-lg text-gray-600 mb-4">{currentProductVariant.brand}</p>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(currentProductVariant.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({currentProductVariant.rating}/5)</span>
              </div>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Mahsulot ma'lumotlari</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Artikul:</span>
                  <span className="font-medium">{currentProductVariant.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jins:</span>
                  <span className="font-medium">{t(currentProductVariant.gender.toLowerCase())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Material:</span>
                  <span className="font-medium">{getMaterialName(currentProductVariant.materials)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mavsum:</span>
                  <span className="font-medium">{getSeasonName(currentProductVariant.season)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Yil:</span>
                  <span className="font-medium">{currentProductVariant.year}</span>
                </div>
              </div>
            </Card>

            <div>
              <h3 className="text-lg font-semibold mb-3">Rang</h3>
              <div className="flex gap-3">
                {uniqueColorVariants.map((variant) => {
                  const color = categoriesData.colors.find((c: Color) => c.id === variant.color)
                  const isSelected = variant.id === currentProductVariant.id
                  return (
                    <button
                      key={variant.id}
                      onClick={() => navigate(`/${language}/${variant.brand}/${variant.nameUrl}/${variant.id}`)}
                      className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all ${
                        isSelected ? "border-blue-500 scale-110" : "border-gray-300 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: color?.color }}
                      title={getColorName(variant.color)}
                    >
                      {isSelected && <Check className="w-5 h-5 text-white drop-shadow-lg" />}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">O'lcham</h3>
              <div className="grid grid-cols-4 gap-2">
                {availableSizes.length > 0 ? (
                  availableSizes.map((size: ProductSizeType) => (
                    <Button
                      key={size.size}
                      variant={selectedSize === size.size ? "default" : "outline"}
                      onClick={() => handleSizeSelect(size.size)}
                      disabled={!size.inStock}
                      className="text-lg font-semibold"
                    >
                      {size.size}
                    </Button>
                  ))
                ) : (
                  <p className="text-gray-500 col-span-4">Mavjud o'lchamlar yo'q</p>
                )}
              </div>
            </div>

            {currentProductVariant?.inAdvancePayment && selectedSize !== null && (
              <div className="p-4 mb-6">
                <p className="text-blue-800 font-medium">
                  {t("in_advance_payment_details")}{" "}
                  <span className="font-bold">
                    {formatPrice(advancePaymentAmount)} {currency.toUpperCase()}
                  </span>
                </p>
              </div>
            )}

            <div className="flex items-center gap-3 mb-6">
                {discountPercentage > 0 ? (
                  <>
                    <span className="text-xl sm:text-3xl font-bold text-green-600">
                      {formatPrice(displayDiscount)} {currency.toUpperCase()}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(displayPrice)} {currency.toUpperCase()}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(displayPrice)} {currency.toUpperCase()}
                  </span>
                )}
              </div>
              

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-lg font-medium">Miqdor:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="h-12 w-12"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-6 text-lg font-semibold min-w-[60px] text-center">{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)} className="h-12 w-12">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={cartItem && cartItem.quantity > 0 ? () => navigate(`/${language}/cart`) : handleAddToCart}
                  disabled={!selectedSizeDetails || !selectedSizeDetails.inStock}
                  variant="outline"
                  size="lg"
                  className="h-14 text-lg font-semibold"
                >
                  <ShoppingCart className="mr-2 w-5 h-5" />
                  {cartItem && cartItem.quantity > 0 ? "Savatga o'tish" : "Savatga qo'shish"}
                </Button>

                <Button
                  onClick={handleBuyNow}
                  disabled={!selectedSizeDetails || !selectedSizeDetails.inStock || quantity <= 0}
                  size="lg"
                  className="h-14 text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  Hozir sotib olish
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Card className="mt-8 p-6">
          <h3 className="text-xl font-semibold mb-4">Mahsulot haqida</h3>
          <p className="text-gray-700 leading-relaxed text-lg">{getLocalizedName(currentProductVariant.description)}</p>
        </Card>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Bell className="w-12 h-12 text-yellow-500" />
              </div>

              <h2 className="text-xl font-bold">Diqqat!</h2>

              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Sizni hozir Telegram botga yo'naltiramiz. Iltimos, bot ochilgach, "Start" tugmasini bosing.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">Bu tugma orqali sizning buyurtmangiz tasdiqlanadi.</p>
                </div>

                <div className="flex items-start gap-3">
                  <Pin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">Muhim!</p>
                    <p className="text-sm">Agar siz "Start" tugmasini bosmasangiz, admin siz bilan bog'lana olmaydi.</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex gap-3">
                <Button onClick={() => setIsModalOpen(false)} variant="outline" className="flex-1">
                  Bekor qilish
                </Button>
                <Button onClick={handleConfirmBuy} className="flex-1 bg-green-500 hover:bg-green-600">
                  Tasdiqlash
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default ProductDetails
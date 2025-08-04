"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/redux"
import { removeItemFromCart, updateItemQuantity, clearCart } from "@/features/cartSlice"
import { addToast } from "@/features/toastSlice"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { FaPlus, FaMinus, FaTrash, FaShoppingCart, FaHome, FaCreditCard, FaTruck, FaShieldAlt } from "react-icons/fa"
import Button from "@/components/ui/button"
import { useCurrency } from "@/hooks/useCurrency"
import type { Color } from "@/types"
import BuyConfirmationModal from "@/components/common/BuyConfirmationModal"
import { motion, AnimatePresence } from "framer-motion"

const CartPage: React.FC = () => {
  const { t } = useTranslation()
  const dispatch: AppDispatch = useDispatch()
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const language = useSelector((state: RootState) => state.language.language)
  const colors = useSelector((state: RootState) => state.categories.colors)
  const { currency, formatPrice } = useCurrency()

  const [isConfirmationModalOpen, setIsConfirmationModal] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const getLocalizedName = (name: { uz: string; ru: string }) => {
    return language === "uz" ? name.uz : name.ru
  }

  const handleQuantityChange = (id: string, size: number, newQuantity: number) => {
    if (newQuantity < 1) newQuantity = 1
    dispatch(updateItemQuantity({ id, size, quantity: newQuantity }))
    dispatch(addToast({ message: t("cart_updated_success"), type: "info" }))
  }

  const handleRemoveItem = (id: string, size: number) => {
    dispatch(removeItemFromCart({ id, size }))
    dispatch(addToast({ message: t("product_removed_from_cart"), type: "info" }))
  }

  const handleClearCart = () => {
    dispatch(clearCart())
    dispatch(addToast({ message: t("cart_cleared_success"), type: "info" }))
  }

  const handleProceedToCheckout = () => {
    setIsConfirmationModal(true)
  }

  const handleConfirmPurchase = () => {
    const botBaseUrl = "https://t.me/poyzenuzbot?start="
    const cartData = cartItems.map((item) => `${item.id}-${item.size}-${item.quantity}`).join("_")
    const telegramUrl = `${botBaseUrl}${cartData}`

    window.open(telegramUrl, "_blank")

    dispatch(
      addToast({
        message: t("telegram_redirect_info", "Telegram bot yangi tabda ochildi. Iltimos, 'Start' tugmasini bosing."),
        type: "success",
      }),
    )

    setTimeout(() => {
      dispatch(clearCart())
      dispatch(addToast({ message: t("order_placed_successfully"), type: "success" }))
    }, 1000)

    setIsConfirmationModal(false)
  }

  const handleCloseModal = () => {
    setIsConfirmationModal(false)
  }

  const subTotal = cartItems.reduce((sum, item) => {
    const price = item.variant.sizes.find((s) => s.size === item.size)?.discount[currency] || 0
    return sum + price * item.quantity
  }, 0)

  const discountPercentage = 0.1
  const discountAmount = subTotal * discountPercentage
  const deliveryFee = 0
  const total = subTotal - discountAmount + deliveryFee
  const advancePaymentAmount = total * 0.3

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 lg:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 tracking-tight">
            {t("shoppingCart")}
          </h1>
          <p className="mt-2 text-base sm:text-lg text-gray-600">
            {cartItems.length} {t("items")}
          </p>
        </motion.div>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-md p-6 sm:p-8 text-center border border-gray-100"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
              <FaShoppingCart className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">{t("emptyCart")}</h3>
            <p className="text-gray-500 mb-8 text-base sm:text-lg max-w-md mx-auto">{t("addItemsToCart")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={`/${language}/products`}>
                <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg text-base font-semibold transition-all duration-300 shadow-md">
                  <FaShoppingCart className="w-4 h-4 mr-2" />
                  {t("browseProducts")}
                </Button>
              </Link>
              <Link to={`/${language}`}>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto px-6 py-3 rounded-lg border-2 border-gray-300 hover:border-gray-400 text-gray-700 text-base font-semibold transition-all duration-300 bg-transparent"
                >
                  <FaHome className="w-4 h-4 mr-2" />
                  {t("back_to_home")}
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <FaShoppingCart className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{t("cart_items")}</h2>
              </div>
              <AnimatePresence>
                {cartItems.map((item) => {
                  const itemPrice = item.variant.sizes.find((s) => s.size === item.size)?.discount[currency] || 0
                  const itemTotal = itemPrice * item.quantity
                  const itemColor = colors.find((c: Color) => c.id === item.variant.color)
                  return (
                    <motion.div
                      key={`${item.id}-${item.size}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 mb-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100 last:mb-0" // Added card styling for each item
                    >
                      <img
                        src={item.variant.images[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-28 h-28 object-cover rounded-md border border-gray-200 flex-shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between w-full text-center sm:text-left">
                        <div>
                          <h3 className="font-semibold text-gray-800 text-base sm:text-lg">{item.product.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {t("size")}: {item.size}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center justify-center sm:justify-start mt-1">
                            {t("color")}:{" "}
                            <span
                              className="w-4 h-4 rounded-full inline-block border border-gray-300 ml-1"
                              style={{ backgroundColor: itemColor?.color || "#000000" }}
                              title={itemColor ? getLocalizedName(itemColor.name) : t("unknown_color")}
                            ></span>
                          </p>
                        </div>
                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.size, item.quantity - 1)}
                            className="border-gray-300 hover:border-gray-400 p-2 w-8 h-8 flex items-center justify-center"
                          >
                            <FaMinus className="w-3 h-3" />
                          </Button>
                          <span className="text-base font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.size, item.quantity + 1)}
                            className="border-gray-300 hover:border-gray-400 p-2 w-8 h-8 flex items-center justify-center"
                          >
                            <FaPlus className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-100 w-full">
                          <span className="text-base font-semibold text-gray-900">
                            {t("total")}: {formatPrice(itemTotal)} {currency.toUpperCase()}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id, item.size)}
                            className="text-red-500 hover:text-red-700 p-2 w-8 h-8 flex items-center justify-center"
                          >
                            <FaTrash className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
              <div className="mt-6 flex justify-end">
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  className="bg-transparent border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors duration-200 text-sm px-4 py-2"
                >
                  <FaTrash className="w-3 h-3 mr-2" />
                  {t("clearCart")}
                </Button>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full lg:w-80 xl:w-96 bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100 flex-shrink-0"
            >
              <div className="flex items-center gap-3 mb-6">
                <FaCreditCard className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{t("orderSummary")}</h2>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700 text-base">
                  <span>
                    {t("sub_total")} ({cartItems.length} {t("items")})
                  </span>
                  <span className="font-medium">
                    {formatPrice(subTotal)} {currency.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-red-500 text-base">
                  <span>
                    {t("discount")} ({discountPercentage * 100}%)
                  </span>
                  <span className="font-medium">
                    -{formatPrice(discountAmount)} {currency.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700 text-base">
                  <span>{t("shipping")}</span>
                  <span className="font-medium">{t("free_delivery")}</span>
                </div>
                <div className="flex justify-between text-gray-700 text-base">
                  <span>{t("advance_payment_amount")} (30%)</span>
                  <span className="font-medium">
                    {formatPrice(advancePaymentAmount)} {currency.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700 text-base">
                  <span>{t("delivery_timeline")}</span>
                  <span className="font-medium">{t("delivery_10_15_days")}</span>
                </div>
                <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900 pt-4 border-t border-gray-200">
                  <span>{t("total")}</span>
                  <span>
                    {formatPrice(total)} {currency.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500 mb-6 space-y-2">
                <p className="flex items-center gap-2">
                  <FaTruck className="w-4 h-4 text-emerald-500" />
                  <span>{t("free_delivery")}</span>
                </p>
                <p className="flex items-center gap-2">
                  <FaShieldAlt className="w-4 h-4 text-blue-500" />
                  <span>{t("90_day_warranty")}</span>
                  <Link to={`/${language}/warranty-details`} className="text-blue-600 hover:underline ml-1">
                    {t("details")}
                  </Link>
                </p>
              </div>
              <Button
                onClick={handleProceedToCheckout}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg text-base font-semibold transition-all duration-300 shadow-md"
              >
                <FaCreditCard className="w-4 h-4 mr-2" />
                {t("proceedToCheckout")}
              </Button>
            </motion.div>
          </div>
        )}
      </div>

      <BuyConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmPurchase}
      />
    </div>
  )
}

export default CartPage

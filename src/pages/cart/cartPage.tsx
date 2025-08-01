"use client"

import type React from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/redux"
import { removeItemFromCart, updateItemQuantity, clearCart } from "@/features/cartSlice"
import { addToast } from "@/features/toastSlice" // Import addToast
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa"
import Button from "@/components/ui/button"
import Input from "@/components/ui/input"
import { useCurrency } from "@/hooks/useCurrency"
import type { Color } from "@/types"
import { useEffect } from "react"

const CartPage: React.FC = () => {
  const { t } = useTranslation()
  const dispatch: AppDispatch = useDispatch()
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const language = useSelector((state: RootState) => state.language.language)
  const colors = useSelector((state: RootState) => state.categories.colors)
  const { currency, formatPrice } = useCurrency()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const getLocalizedName = (name: { uz: string; ru: string }) => {
    return language === "uz" ? name.uz : name.ru
  }

  const handleQuantityChange = (id: string, size: number, newQuantity: number) => {
    if (newQuantity < 1) newQuantity = 1 // Ensure quantity doesn't go below 1
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

  const subTotal = cartItems.reduce((sum, item) => {
    const price = item.variant.sizes.find((s) => s.size === item.size)?.discount[currency] || 0
    return sum + price * item.quantity
  }, 0)

  const discountPercentage = 0.1 // 10% discount (example from image)
  const discountAmount = subTotal * discountPercentage
  const deliveryFee = 0 // Free delivery as requested

  const total = subTotal - discountAmount + deliveryFee
  const advancePaymentAmount = total * 0.3 // 30% advance payment

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{t("shoppingCart")}</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🛒</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">{t("emptyCart")}</h3>
          <p className="text-gray-500 mb-6">{t("addItemsToCart")}</p>
          <Link to={`/${language}/products`}>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg">
              {t("browseProducts")}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="grid grid-cols-[1fr_auto_auto_auto] md:grid-cols-[2fr_1fr_1fr_auto] gap-4 pb-4 border-b border-gray-200 font-semibold text-gray-700">
              <div>{t("product_code")}</div>
              <div className="text-center">{t("quantity")}</div>
              <div className="text-right">{t("total")}</div>
              <div className="text-center">{t("action")}</div>
            </div>
            {cartItems.map((item) => {
              const itemPrice = item.variant.sizes.find((s) => s.size === item.size)?.discount[currency] || 0
              const itemTotal = itemPrice * item.quantity
              const itemColor = colors.find((c: Color) => c.id === item.variant.color)

              return (
                <div
                  key={`${item.id}-${item.size}`}
                  className="grid grid-cols-[1fr_auto_auto_auto] md:grid-cols-[2fr_1fr_1fr_auto] gap-4 py-4 border-b border-gray-100 items-center"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.variant.images[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-md border border-gray-200"
                    />
                    <div>
                      <h3 className="font-medium text-gray-800">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">
                        {t("size")}: {item.size}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        {t("color")}:{" "}
                        <span
                          className="w-4 h-4 rounded-full inline-block border border-gray-300 ml-1"
                          style={{ backgroundColor: itemColor?.color || "#000000" }}
                          title={itemColor ? getLocalizedName(itemColor.name) : t("unknown_color")}
                        ></span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, item.size, item.quantity - 1)}
                    >
                      <FaMinus className="w-3 h-3" />
                    </Button>
                    <span className="text-lg font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, item.size, item.quantity + 1)}
                    >
                      <FaPlus className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="text-right text-lg font-semibold text-gray-900">
                    {formatPrice(itemTotal)} {currency.toUpperCase()}
                  </div>
                  <div className="flex justify-center">
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id, item.size)}>
                      <FaTrash className="w-5 h-5 text-red-500 hover:text-red-700" />
                    </Button>
                  </div>
                </div>
              )
            })}
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={handleClearCart} className="bg-transparent">
                {t("clearCart")}
              </Button>
              {/* Update Cart button can be added here if needed for more complex logic */}
              {/* <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg">
                {t("update_cart")}
              </Button> */}
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-80 bg-white rounded-2xl shadow-xl p-6 border border-gray-100 flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t("orderSummary")}</h2>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Input type="text" placeholder={t("discount_voucher")} className="flex-1" />
                <Button variant="secondary">{t("apply")}</Button>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>
                  {t("sub_total")} ({cartItems.length} {t("items")})
                </span>
                <span>
                  {formatPrice(subTotal)} {currency.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>
                  {t("discount")} ({discountPercentage * 100}%)
                </span>
                <span>
                  -{formatPrice(discountAmount)} {currency.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>{t("shipping")}</span>
                <span>{t("free_delivery")}</span> {/* Changed to free delivery */}
              </div>
              <div className="flex justify-between text-gray-700">
                <span>{t("advance_payment_amount")} (30%)</span>
                <span>
                  {formatPrice(advancePaymentAmount)} {currency.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>{t("total")}</span>
                <span>
                  {formatPrice(total)} {currency.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="text-sm text-gray-500 mb-6">
              <p className="flex items-center gap-1">
                <span className="text-green-500">✔</span> {t("90_day_warranty")}
                <Link to={`/${language}/warranty-details`} className="text-blue-600 hover:underline ml-1">
                  {t("details")}
                </Link>
              </p>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold">
              {t("proceedToCheckout")}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage

"use client"

import type React from "react"
import { useSelector, useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa"
import { Link } from "react-router-dom"
import type { RootState, AppDispatch } from "@/redux"
import { removeFromCart, updateQuantity, clearCart } from "@/features/cartSlice"
import Button from "@/components/ui/button"

const CartPage: React.FC = () => {
  const { t } = useTranslation()
  const dispatch: AppDispatch = useDispatch()

  const cartItems = useSelector((state: RootState) => state.cart.items)
  const currency = useSelector((state: RootState) => state.currency.currency) as "usd" | "uzs"
  const lang = useSelector((state: RootState) => state.language.language)

  const formatPrice = (price: number, isUZS: boolean = currency === "uzs") => {
    return price
      .toLocaleString(isUZS ? "uz-UZ" : "en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      .replace(/,/g, isUZS ? " " : ",")
  }

  const handleRemoveItem = (id: string, size: number) => {
    dispatch(removeFromCart({ id, size }))
  }

  const handleUpdateQuantity = (id: string, size: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id, size)
    } else {
      dispatch(updateQuantity({ id, size, quantity: newQuantity }))
    }
  }

  const handleClearCart = () => {
    dispatch(clearCart())
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const sizeData = item.variant.sizes.find((s) => s.size === item.size)
      const price = sizeData?.discount?.[currency] || 0
      return total + price * item.quantity
    }, 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("shoppingCart") || "Shopping Cart"}</h1>
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🛒</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("emptyCart") || "Your cart is empty"}</h3>
          <p className="text-gray-600 mb-6">{t("addItemsToCart") || "Add some items to your cart to get started"}</p>
          <Link to={`/${lang}/products`}>
            <Button variant="outline">{t("browseProducts") || "Browse Products"}</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("shoppingCart") || "Shopping Cart"}</h1>
        <Button onClick={handleClearCart} variant="outline" size="sm">
          {t("clearCart") || "Clear Cart"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const sizeData = item.variant.sizes.find((s) => s.size === item.size)
            const price = sizeData?.price?.[currency] || 0
            const discountPrice = sizeData?.discount?.[currency] || 0

            return (
              <div key={`${item.id}-${item.size}`} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex gap-4">
                  <Link to={`/${lang}/${item.product.brand}/${item.variant.nameUrl}/${item.variant.id}`}>
                    <img
                      src={item.variant.images[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </Link>

                  <div className="flex-1">
                    <Link
                      to={`/${lang}/${item.product.brand}/${item.variant.nameUrl}/${item.variant.id}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      <h3 className="font-semibold text-lg text-gray-900">
                        {`${item.product.brand} - ${item.product.name}`}
                      </h3>
                    </Link>

                    <p className="text-gray-600 text-sm mt-1">
                      {t("size")}: {item.size}
                    </p>

                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                          <FaMinus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                          <FaPlus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id, item.size)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500 line-through">
                      {formatPrice(price)} {currency.toUpperCase()}
                    </p>
                    <p className="font-bold text-lg text-green-600">
                      {formatPrice(discountPrice)} {currency.toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {t("total")}: {formatPrice(discountPrice * item.quantity)} {currency.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("orderSummary") || "Order Summary"}</h3>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>
                  {t("items") || "Items"} ({getTotalItems()})
                </span>
                <span>
                  {formatPrice(getTotalPrice())} {currency.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{t("shipping") || "Shipping"}</span>
                <span className="text-green-600">{t("free") || "Free"}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>{t("total") || "Total"}</span>
                <span>
                  {formatPrice(getTotalPrice())} {currency.toUpperCase()}
                </span>
              </div>
            </div>

            <Button className="w-full mb-3" size="lg">
              {t("proceedToCheckout") || "Proceed to Checkout"}
            </Button>

            <Link to={`/${lang}/products`}>
              <Button variant="outline" className="w-full bg-transparent">
                {t("continueShopping") || "Continue Shopping"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage

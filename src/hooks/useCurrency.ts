import { useSelector } from "react-redux"
import type { RootState } from "@/redux"

export function useCurrency() {
  const currency = useSelector((state: RootState) => state.currency.currency) as "usd" | "uzs"

  const formatPrice = (price: number, isUZS: boolean = currency === "uzs") => {
    return price
      .toLocaleString(isUZS ? "uz-UZ" : "en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      .replace(/,/g, isUZS ? " " : ",")
  }

  return { currency, formatPrice }
}

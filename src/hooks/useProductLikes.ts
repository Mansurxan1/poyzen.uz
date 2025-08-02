import type React from "react"

import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/redux"
import { addLike, removeLike } from "@/features/likesSlice"
import type { ProductVariant, Product } from "@/types"

export const useProductLikes = () => {
  const dispatch: AppDispatch = useDispatch()
  const { likedProducts } = useSelector((state: RootState) => state.likes)

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

  const isLiked = (productId: string) => {
    return likedProducts.some((item) => item.id === productId)
  }

  return {
    toggleLike,
    isLiked,
    likedProducts,
  }
}

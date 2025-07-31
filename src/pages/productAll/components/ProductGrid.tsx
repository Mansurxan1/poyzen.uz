"use client"

import type React from "react"
import type { ProductVariant } from "@/types"
import ProductCard from "./ProductCard"

interface ProductGridProps {
  products: ProductVariant[]
  title: string
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, title }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 auto-rows-fr">
        {products.map((variant: ProductVariant) => (
          <ProductCard key={variant.id} variant={variant} />
        ))}
      </div>
    </div>
  )
}

export default ProductGrid

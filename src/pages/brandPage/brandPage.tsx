"use client"

import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux"
import { useTranslation } from "react-i18next"
import ProductCard from "@/pages/productAll/components/ProductCard"
import type { ProductVariant } from "@/types"

const BrandPage = () => {
  const { brandId } = useParams<{ brandId: string }>()
  const { t } = useTranslation()
  const productsData = useSelector((state: RootState) => state.products.data)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const brandProducts = React.useMemo(() => {
    if (!brandId) return []
    
    // Brand ID ni to'g'ri formatda olish (katta harf bilan)
    const brandKey = brandId.charAt(0).toUpperCase() + brandId.slice(1).toLowerCase()
    const brandData = productsData[brandKey]
    
    if (!brandData) return []
    
    return brandData.flatMap((product) =>
      product.variants.map((variant: ProductVariant) => ({
        ...variant,
        brand: product.brand,
        productName: product.name,
        product: product,
      }))
    )
  }, [brandId, productsData])

  if (!brandId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        {t("brand_not_found")}
      </div>
    )
  }

  const brandKey = brandId.charAt(0).toUpperCase() + brandId.slice(1).toLowerCase()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center capitalize">
          {brandKey} {t("products")}
        </h1>
        
        {brandProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p className="text-xl">{t("no_products_found_for_brand")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 auto-rows-fr">
            {brandProducts.map((variant) => (
              <ProductCard key={variant.id} variant={variant} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BrandPage

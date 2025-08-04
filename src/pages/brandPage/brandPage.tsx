import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux"
import { useTranslation } from "react-i18next"
import ProductCard from "@/pages/productAll/components/ProductCard"
import Button from "@/components/ui/button"
import type { ProductVariant } from "@/types"

const BrandPage = () => {
  const { brandId } = useParams<{ brandId: string }>()
  const { t } = useTranslation()
  const productsData = useSelector((state: RootState) => state.products.data)
  const [currentPage, setCurrentPage] = useState(1)

  const PRODUCTS_PER_PAGE = 25

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const brandProducts = React.useMemo(() => {
    if (!brandId) return []
    
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

  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE
  const currentProducts = brandProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(brandProducts.length / PRODUCTS_PER_PAGE)

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl font-bold text-blue-500 uppercase mb-8 text-center">
          {brandKey} {t("products")}
        </h1>
        
        {brandProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p className="text-xl">{t("no_products_found_for_brand")}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 auto-rows-fr">
              {currentProducts.map((variant) => (
                <ProductCard key={variant.id} variant={variant} />
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
                 {t("modelNotFound")}
              </p>
              <a
                href="https://t.me/poyzenUz_Admin"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mx-4 underline"
              >
                Adminga murojaat qiling, siz izlagan tovar albatta topiladi!
              </a>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  {t("previous")}
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    onClick={() => paginate(page)}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  {t("next")}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default BrandPage
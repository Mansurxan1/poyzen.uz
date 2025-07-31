"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setCurrency } from "@/features/currencySlice"
import { setLanguage } from "@/features/languageSlice"
import { AiOutlineFilter, AiOutlineClose } from "react-icons/ai"
import { useTranslation } from "react-i18next"
import i18n from "@/i18n/i18n"
import type { AppDispatch } from "@/redux"
import { useProductFilter } from "@/hooks/useProductFilter"
import FilterSidebar from "./components/FilterSidebar"
import ProductGrid from "./components/ProductGrid"

const ProductAll: React.FC = () => {
  const { t } = useTranslation()
  const dispatch: AppDispatch = useDispatch()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  // openDropdown state is now managed within FilterSidebar

  const {
    filter,
    priceInput,
    activeFilters,
    filteredProducts,
    similarProducts,
    filterOptions,
    handleFilterChange,
    handlePriceChange,
    clearAllFilters,
  } = useProductFilter()

  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency") || "usd"
    const savedLanguage = localStorage.getItem("i18n-lang") || "uz"
    dispatch(setCurrency(savedCurrency))
    dispatch(setLanguage(savedLanguage))
    if (i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage)
    }
  }, [dispatch])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{t("all_products")}</h1>
            <p className="text-gray-600">
              {filteredProducts.length} {t("products_found")}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md border border-gray-200"
            >
              <AiOutlineFilter className="w-5 h-5" />
              {t("filters")}
              {activeFilters > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">{activeFilters}</span>
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar
              filter={filter}
              priceInput={priceInput}
              activeFilters={activeFilters}
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
              onPriceChange={handlePriceChange}
              onClearAll={clearAllFilters}
              // openDropdown and setOpenDropdown are no longer passed from here
            />
          </div>

          {isFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50">
              <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{t("filters")}</h3>
                    <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <AiOutlineClose className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <FilterSidebar
                    filter={filter}
                    priceInput={priceInput}
                    activeFilters={activeFilters}
                    filterOptions={filterOptions}
                    onFilterChange={handleFilterChange}
                    onPriceChange={handlePriceChange}
                    onClearAll={clearAllFilters}
                    // openDropdown and setOpenDropdown are no longer passed from here
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} title={t("filtered_products")} />
            ) : (
              <>
                <div className="text-center py-8 mb-8">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">{t("no_products_found")}</h3>
                  <p className="text-gray-500 mb-4">{t("showing_similar_products")}</p>
                  <button
                    onClick={clearAllFilters}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {t("clear_filters")}
                  </button>
                </div>

                {similarProducts.length > 0 && <ProductGrid products={similarProducts} title={t("similar_products")} />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductAll

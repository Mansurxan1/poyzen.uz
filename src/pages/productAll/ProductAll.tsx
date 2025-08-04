import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setCurrency } from "@/features/currencySlice"
import { setLanguage } from "@/features/languageSlice"
import { AiOutlineFilter, AiOutlineClose } from "react-icons/ai"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux"
import i18n from "@/i18n/i18n"
import type { AppDispatch } from "@/redux"
import { useProductFilter } from "@/hooks/useProductFilter"
import FilterSidebar from "./components/FilterSidebar"
import ProductGrid from "./components/ProductGrid"
import Button from "@/components/ui/button"

const PRODUCTS_PER_PAGE = 25

const ProductAll: React.FC = () => {
  const { t } = useTranslation()
  const dispatch: AppDispatch = useDispatch()
  const language = useSelector((state: RootState) => state.language.language)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState<"price-asc" | "price-desc" | "date-desc">("date-desc")

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

  // Sort products based on sortOrder
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "price-asc") {
      const priceA = a.sizes[0].discount.usd || a.sizes[0].price.usd
      const priceB = b.sizes[0].discount.usd || b.sizes[0].price.usd
      return priceA - priceB
    } else if (sortOrder === "price-desc") {
      const priceA = a.sizes[0].discount.usd || a.sizes[0].price.usd
      const priceB = b.sizes[0].discount.usd || b.sizes[0].price.usd
      return priceB - priceA
    } else {
      // Default: sort by date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency") || "usd"
    const savedLanguage = localStorage.getItem("i18n-lang") || "uz"
    dispatch(setCurrency(savedCurrency))
    dispatch(setLanguage(savedLanguage))
    if (i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage)
    }
  }, [dispatch])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [filter, sortOrder])

  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE)

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSortChange = (sort: "price-asc" | "price-desc" | "date-desc") => {
    setSortOrder(sort)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="flex flex-col justify-center pt-4 px-4 lg:flex-row mb-4">
          <div className="text-center">
            <h1 className="text-xl font-bold text-blue-500 uppercase mb-2">
              {t("all_products")}
            </h1>
            <p className="text-gray-600 font-semibold">
              {t("total_products")}: {sortedProducts.length}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            <Button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden flex items-center gap-2"
              variant="outline"
            >
              <AiOutlineFilter className="w-5 h-5" />
              {t("filters")}
              {activeFilters > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">{activeFilters}</span>
              )}
            </Button>
          </div>
        </div>
      <div className="max-w-7xl mx-auto py-4">

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
          <div className="hidden lg:block lg:sticky lg:top-4 pl-4 lg:self-start">
            <FilterSidebar
              filter={filter}
              priceInput={priceInput}
              activeFilters={activeFilters}
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
              onPriceChange={handlePriceChange}
              onClearAll={clearAllFilters}
              currentProductCount={sortedProducts.length}
              onSortChange={handleSortChange}
              sortOrder={sortOrder}
            />
          </div>
          {isFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-30 bg-black/50 bg-opacity-50">
              <div className="absolute inset-0 w-full h-full bg-white shadow-2xl overflow-y-auto flex flex-col">
                <div className="p-4 border-b border-gray-200 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{t("filters")}</h3>
                    <Button
                      onClick={() => setIsFilterOpen(false)}
                      variant="ghost"
                      size="icon"
                      className="hover:bg-gray-100"
                    >
                      <AiOutlineClose className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <div className="p-4 flex-grow overflow-y-auto z-[999]">
                  <FilterSidebar
                    filter={filter}
                    priceInput={priceInput}
                    activeFilters={activeFilters}
                    filterOptions={filterOptions}
                    onFilterChange={handleFilterChange}
                    onPriceChange={handlePriceChange}
                    onClearAll={clearAllFilters}
                    currentProductCount={sortedProducts.length}
                    onSortChange={handleSortChange}
                    sortOrder={sortOrder}
                  />
                </div>
                <div className="p-4 border-t border-gray-200 flex-shrink-0">
                  <Button
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full"
                    variant="default"
                    size="lg"
                  >
                    {t("show_products")} ({sortedProducts.length})
                  </Button>
                </div>
              </div>
            </div>
          )}
          <div className="flex-1">
            {currentProducts.length > 0 ? (
              <>
                <ProductGrid products={currentProducts} title={t("filtered_products")} />
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
            ) : (
              <>
                <div className="text-center py-12 mb-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                  <div className="text-gray-400 text-8xl mb-6">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-3">{t("no_products_found")}</h3>
                  <p className="text-gray-500 mb-6 text-lg">{t("showing_similar_products")}</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={clearAllFilters}
                      className="px-8 py-3"
                      variant="default"
                      size="lg"
                    >
                      {t("clear_filters")}
                    </Button>
                    <Link to={`/${language}/search?q=`}>
                      <Button
                        variant="outline"
                        className="px-8 py-3"
                        size="lg"
                      >
                        🔍 {t("search_products")}
                      </Button>
                    </Link>
                  </div>
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
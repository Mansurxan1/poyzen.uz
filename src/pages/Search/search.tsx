"use client"

import type React from "react"
import { useLocation, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux"
import { useProductSearch } from "@/hooks/useProductSearch"
import ProductGrid from "@/pages/productAll/components/ProductGrid"
import Button from "@/components/ui/button"

const Search: React.FC = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const searchQuery = queryParams.get("q") || ""
  const language = useSelector((state: RootState) => state.language.language)

  const { searchResults, suggestedProducts, popularBrands, popularCategories, hasExactResults, hasSuggestions } =
    useProductSearch(searchQuery)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        {t("search_results_for")}: "{searchQuery}"
      </h1>

      {hasExactResults ? (
        <ProductGrid products={searchResults} title={t("searchResults")} />
      ) : (
        <div className="text-center py-8 mb-8">
          <div className="text-gray-400 text-6xl mb-4">😔</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">{t("no_results_for_query")}</h3>
          <p className="text-gray-500 mb-4">{t("try_broadening_search")}</p>

          {hasSuggestions && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">{t("search_suggestions")}</h4>
              <div className="flex flex-wrap justify-center gap-4">
                {suggestedProducts.length > 0 && (
                  <div className="w-full">
                    <h5 className="text-md font-medium text-gray-600 mb-2">{t("suggested_products")}</h5>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {suggestedProducts.map((product) => (
                        <Link
                          key={product.id}
                          to={`/${language}/${product.brand}/${product.nameUrl}/${product.id}`}
                          className="block p-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow text-sm text-gray-700"
                        >
                          {product.brand} - {product.productName}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {popularBrands.length > 0 && (
                  <div className="w-full mt-4">
                    <h5 className="text-md font-medium text-gray-600 mb-2">{t("popular_brands")}</h5>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {popularBrands.map((brand) => (
                        <Link
                          key={brand}
                          to={`/${language}/brand/${brand.toLowerCase()}`}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm"
                        >
                          {brand}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {popularCategories.length > 0 && (
                  <div className="w-full mt-4">
                    <h5 className="text-md font-medium text-gray-600 mb-2">{t("popular_categories")}</h5>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {popularCategories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/${language}/category/${category.id}`}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link to={`/${language}/products`}>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg w-full sm:w-auto">
                {t("view_all_products")}
              </Button>
            </Link>
            <Link to={`/${language}`}>
              <Button variant="outline" className="px-6 py-3 rounded-lg w-full sm:w-auto bg-transparent">
                {t("back_to_home")}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Search

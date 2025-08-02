import type React from "react"
import { useLocation, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux"
import { useProductSearch } from "@/hooks/useProductSearch"
import ProductCard from "@/pages/productAll/components/ProductCard"
import Button from "@/components/ui/button"
import { FaSearch, FaHeart, FaShoppingCart, FaStar } from "react-icons/fa"

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
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <FaSearch className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {t("search_results_for")}
        </h1>
        <p className="text-xl text-gray-600">
          "{searchQuery}"
        </p>
      </div>

      {hasExactResults ? (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FaStar className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-800">{t("searchResults")}</h2>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {searchResults.length} {t("results")}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 auto-rows-fr">
            {searchResults.map((variant) => (
              <ProductCard key={variant.id} variant={variant} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 mb-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <FaSearch className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-3">{t("no_results_for_query")}</h3>
          <p className="text-gray-500 mb-6 text-lg">{t("try_broadening_search")}</p>

          {hasSuggestions && (
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-6">
                <FaHeart className="w-5 h-5 text-red-500" />
                <h4 className="text-xl font-bold text-gray-700">{t("products_you_might_like")}</h4>
              </div>
              <div className="space-y-8">
                {suggestedProducts.length > 0 && (
                  <div className="w-full">
                    <div className="flex items-center gap-2 mb-4">
                      <FaStar className="w-4 h-4 text-yellow-500" />
                      <h5 className="text-lg font-semibold text-gray-600">{t("suggested_products")}</h5>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {suggestedProducts.map((product) => (
                        <ProductCard key={product.id} variant={product} />
                      ))}
                    </div>
                  </div>
                )}

                {popularBrands.length > 0 && (
                  <div className="w-full">
                    <div className="flex items-center gap-2 mb-4">
                      <FaShoppingCart className="w-4 h-4 text-green-500" />
                      <h5 className="text-lg font-semibold text-gray-600">{t("popular_brands")}</h5>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {popularBrands.map((brand) => (
                        <Link
                          key={brand}
                          to={`/${language}/brand/${brand.toLowerCase()}`}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 border border-blue-200"
                        >
                          {brand}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {popularCategories.length > 0 && (
                  <div className="w-full">
                    <div className="flex items-center gap-2 mb-4">
                      <FaStar className="w-4 h-4 text-purple-500" />
                      <h5 className="text-lg font-semibold text-gray-600">{t("popular_categories")}</h5>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {popularCategories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/${language}/category/${category.id}`}
                          className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 border border-purple-200"
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
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg w-full sm:w-auto text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
                <FaShoppingCart className="w-5 h-5 mr-2" />
                {t("view_all_products")}
              </Button>
            </Link>
            <Link to={`/${language}`}>
              <Button variant="outline" className="px-8 py-3 rounded-lg w-full sm:w-auto bg-transparent border-2 border-gray-300 hover:border-gray-400 text-lg font-semibold transition-all duration-200">
                🏠 {t("back_to_home")}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Search

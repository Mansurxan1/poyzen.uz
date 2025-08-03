// src/pages/Search.tsx
import type React from "react";
import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux";
import { useProductSearch } from "@/hooks/useProductSearch";
import ProductCard from "@/pages/productAll/components/ProductCard";
import Button from "@/components/ui/button";
import { FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";

const SectionHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  count?: number;
}> = ({ icon, title, count }) => (
  <div className="flex items-center gap-3 px-4 mb-6">
    {icon}
    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
    {count !== undefined && (
      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
        {count} ta natija
      </span>
    )}
  </div>
);

const Search: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";
  const language = useSelector((state: RootState) => state.language.language);

  const { searchResults, suggestedProducts, hasExactResults, hasSuggestions } =
    useProductSearch(searchQuery);

  const handleAdminClick = () => {
    window.location.href = "https://t.me/poyzenuz_Admin";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-5 sm:px-4 max-w-7xl mx-auto">
      {hasExactResults ? (
        <section className="mb-8" aria-labelledby="search-results">
          <SectionHeader
            icon={<FaStar className="w-6 h-6 text-yellow-500" aria-hidden="true" />}
            title={t("searchResults")}
            count={searchResults.length}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 auto-rows-fr">
            {searchResults.map((variant) => (
              <ProductCard key={variant.id} variant={variant} />
            ))}
          </div>
        </section>
      ) : (
        <section className="text-center mb-8" aria-labelledby="no-results">
          <h3 id="no-results" className="text-2xl font-bold text-gray-700 mb-3">
            {t("no_results_for_query", { query: searchQuery })}
          </h3>
          <p className="text-gray-500 mb-6 text-lg">
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={handleAdminClick}
            >
              {t("admin")}
            </span>{" "}
          </p>
          {hasSuggestions && (
            <div className="mt-8 space-y-8">
              {suggestedProducts.length > 0 && (
                <section aria-labelledby="suggested-products">
                  <div className="px-4">
                    <SectionHeader
                      icon={<FaHeart className="w-5 h-5 text-red-500" aria-hidden="true" />}
                      title={t("products_you_might_like")}
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {suggestedProducts.map((product) => (
                      <ProductCard key={product.id} variant={product} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
          <div className="mt-8 px-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link to={`/${language}/products`} aria-label={t("view_all_products")}>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg w-full sm:w-auto text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
                <FaShoppingCart className="w-5 h-5 mr-2" aria-hidden="true" />
                {t("view_all_products")}
              </Button>
            </Link>
            <Link to={`/${language}`} aria-label={t("back_to_home")}>
              <Button
                variant="outline"
                className="px-8 py-3 rounded-lg w-full sm:w-auto bg-transparent border-2 border-gray-300 hover:border-gray-400 text-lg font-semibold transition-all duration-200"
              >
                🏠 {t("back_to_home")}
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Search;
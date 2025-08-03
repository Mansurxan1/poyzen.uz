import type React from "react";
import { useRef, useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux";
import type { SearchBarProps } from "@/types";
import Button from "@/components/ui/button";
import { useProductSearch } from "@/hooks/useProductSearch";
import ProductCard from "@/pages/productAll/components/ProductCard";

const SearchBar: React.FC<SearchBarProps> = ({ isSearchOpen, toggleSearch }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentLang = useSelector((state: RootState) => state.language.language);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { searchResults, popularBrands, hasExactResults, hasSuggestions } =
    useProductSearch(searchQuery);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      navigate(`/${currentLang}/search?q=${encodeURIComponent(query.trim())}`);
      toggleSearch();
      setSearchQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit(searchQuery);
    } else if (e.key === "Escape") {
      toggleSearch();
    }
  };

  const handlePopularSearch = (term: string) => {
    handleSearchSubmit(term);
  };

  return (
    <div
      className={`fixed inset-0 z-40 bg-black/20 bg-opacity-50 transition-opacity duration-300 ease-in-out ${
        isSearchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={toggleSearch}
    >
      <div
        className={`bg-white border-b min-h-screen border-gray-200 transition-all duration-300 ease-in-out ${
          isSearchOpen ? "translate-y-0" : "-translate-y-full"
        } absolute top-0 left-0 w-full shadow-lg max-h-screen overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder") || "Search products..."}
              className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              onKeyDown={handleKeyDown}
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <Button
                onClick={toggleSearch}
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-blue-600"
              >
                <FiX className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {searchQuery.length > 0 && hasExactResults && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                {t("searchResults")}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {searchResults.slice(0, 8).map((variant) => (
                  <ProductCard key={variant.id} variant={variant} />
                ))}
              </div>
              {searchResults.length > 8 && (
                <div className="text-center mt-4">
                  <Button onClick={() => handleSearchSubmit(searchQuery)} variant="default">
                    {t("view_all_results")}
                  </Button>
                </div>
              )}
            </div>
          )}

          {searchQuery.length === 0 && hasSuggestions && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">{t("search_suggestions")}</h3>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {popularBrands.map((item) => (
                  <Button
                    key={item}
                    onClick={() => handlePopularSearch(item)}
                    variant="ghost"
                    size="sm"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm border border-gray-200"
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {searchQuery.length > 0 && !hasExactResults && !hasSuggestions && (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">😔</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {t("no_results_for_query", { query: searchQuery })}
              </h3>
              <p className="text-gray-500 mb-4">
                {t("no_results_for_query_message", { query: searchQuery })}
              </p>
              <Button onClick={() => handleSearchSubmit("")} variant="outline">
                {t("clear_search")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
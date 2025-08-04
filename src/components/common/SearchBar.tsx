import type React from "react";
import { useRef, useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux";
import type { SearchBarProps } from "@/types";
import Button from "@/components/ui/button";

const SearchBar: React.FC<SearchBarProps> = ({ isSearchOpen, toggleSearch }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentLang = useSelector((state: RootState) => state.language.language);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
    } else {
      navigate(`/${currentLang}/products`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearchSubmit(query); // Trigger search on every input change
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit(searchQuery);
      toggleSearch(); // Close the search bar on Enter
    } else if (e.key === "Escape") {
      setSearchQuery(""); // Clear input on Escape
      toggleSearch();
      navigate(`/${currentLang}/products`); // Navigate back to products on Escape
    }
  };

  return (
    <div
      className={`fixed inset-0 z-40 bg-opacity-50 transition-opacity duration-300 ease-in-out ${
        isSearchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={toggleSearch}
    >
      <div
        className={`bg-white border-b border-gray-200 transition-all duration-300 ease-in-out ${
          isSearchOpen ? "translate-y-0" : "-translate-y-full"
        } absolute top-0 left-0 w-full shadow-lg max-h-screen overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-7xl mx-auto p-4">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleInputChange} // Trigger search on input change
              onKeyDown={handleKeyDown}
              placeholder={t("searchProducts")}
              className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <Button
                onClick={() => handleSearchSubmit(searchQuery)}
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-blue-600 mr-2"
              >
                <FiSearch className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  toggleSearch();
                  navigate(`/${currentLang}/products`);
                }}
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-blue-600"
              >
                <FiX className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
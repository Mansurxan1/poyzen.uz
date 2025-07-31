"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { FiSearch, FiX } from "react-icons/fi"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux"
import type { SearchBarProps } from "@/types"
import Button from "@/components/ui/button"

const SearchBar: React.FC<SearchBarProps> = ({ isSearchOpen, toggleSearch }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const currentLang = useSelector((state: RootState) => state.language.language)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isSearchOpen])

  const popularSearches = ["Nike", "Adidas", "Jordan", "Yeezy", "Air Max"]

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/${currentLang}/search?q=${encodeURIComponent(query.trim())}`)
      toggleSearch()
      setSearchQuery("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery)
    } else if (e.key === "Escape") {
      toggleSearch()
    }
  }

  const handlePopularSearch = (term: string) => {
    handleSearch(term)
  }

  return (
    <div
      className={`bg-white border-b border-gray-200 transition-all duration-300 ease-in-out ${
        isSearchOpen ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
      } overflow-hidden`}
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
            <Button onClick={toggleSearch} variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
              <FiX className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="max-w-2xl mx-auto mt-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {popularSearches.map((item) => (
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
      </div>
    </div>
  )
}

export default SearchBar

"use client"

import type React from "react"
import { useState } from "react"
import { AiOutlineFilter } from "react-icons/ai"
import { useTranslation } from "react-i18next"
import MultiSelectDropdown from "@/components/ui/SelectDropdown"
import Input from "@/components/ui/input"
import type { FilterState, PriceInputState, FilterOptions } from "@/types"

interface FilterSidebarProps {
  filter: FilterState
  priceInput: PriceInputState
  activeFilters: number
  filterOptions: FilterOptions
  onFilterChange: (key: keyof FilterState, values: string[]) => void
  onPriceChange: (type: "min" | "max", value: string) => void
  onClearAll: () => void
  // openDropdown and setOpenDropdown are now managed internally
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filter,
  priceInput,
  activeFilters,
  filterOptions,
  onFilterChange,
  onPriceChange,
  onClearAll,
}) => {
  const { t } = useTranslation()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null) // Internal state for managing which dropdown is open

  // This function ensures only one dropdown is open at a time
  const handleSetDropdownOpen = (dropdownName: string, open: boolean) => {
    if (open) {
      setOpenDropdown(dropdownName) // Open this dropdown
    } else if (openDropdown === dropdownName) {
      setOpenDropdown(null) // Close this dropdown if it's the one currently open
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <AiOutlineFilter className="w-5 h-5" />
          {t("filters")}
        </h3>
        {activeFilters > 0 && (
          <button onClick={onClearAll} className="text-sm text-red-500 hover:text-red-700 font-medium">
            {t("clear_all")}
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">{t("price_range")}</h4>
          <div className="space-y-3">
            <Input
              type="number"
              placeholder={t("min_price")}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
              value={priceInput.min}
              onChange={(e) => onPriceChange("min", e.target.value)}
            />
            <Input
              type="number"
              placeholder={t("max_price")}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
              value={priceInput.max}
              onChange={(e) => onPriceChange("max", e.target.value)}
            />
          </div>
        </div>

        {/* Brands */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">{t("brands")}</h4>
          <MultiSelectDropdown
            options={filterOptions.brands}
            placeholder={t("select_brand")}
            onSelect={(values) => onFilterChange("brands", values)}
            initialValues={filter.brands}
            enableSearch={true}
            closeOnSelect={false}
            isOpen={openDropdown === "brands"}
            setIsOpen={(open) => handleSetDropdownOpen("brands", open)} // Pass the internal handler
          />
        </div>

        {/* Categories */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">{t("categories")}</h4>
          <MultiSelectDropdown
            options={filterOptions.categories}
            placeholder={t("select_category")}
            onSelect={(values) => onFilterChange("categories", values)}
            initialValues={filter.categories}
            enableSearch={true}
            closeOnSelect={false}
            isOpen={openDropdown === "categories"}
            setIsOpen={(open) => handleSetDropdownOpen("categories", open)} // Pass the internal handler
          />
        </div>

        {/* Materials */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">{t("materials")}</h4>
          <MultiSelectDropdown
            options={filterOptions.materials}
            placeholder={t("select_material")}
            onSelect={(values) => onFilterChange("materials", values)}
            initialValues={filter.materials}
            enableSearch={true}
            closeOnSelect={false}
            isOpen={openDropdown === "materials"}
            setIsOpen={(open) => handleSetDropdownOpen("materials", open)} // Pass the internal handler
          />
        </div>

        {/* Colors */}
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-xl">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">{t("colors")}</h4>
          <MultiSelectDropdown
            options={filterOptions.colors}
            placeholder={t("select_color")}
            onSelect={(values) => onFilterChange("colors", values)}
            initialValues={filter.colors}
            enableSearch={true}
            closeOnSelect={false}
            isOpen={openDropdown === "colors"}
            setIsOpen={(open) => handleSetDropdownOpen("colors", open)} // Pass the internal handler
          />
        </div>

        {/* Seasons */}
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-xl">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">{t("seasons")}</h4>
          <MultiSelectDropdown
            options={filterOptions.seasons}
            placeholder={t("select_season")}
            onSelect={(values) => onFilterChange("seasons", values)}
            initialValues={filter.seasons}
            closeOnSelect={false}
            isOpen={openDropdown === "seasons"}
            setIsOpen={(open) => handleSetDropdownOpen("seasons", open)} // Pass the internal handler
          />
        </div>

        {/* Gender */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">{t("genders")}</h4>
          <MultiSelectDropdown
            options={filterOptions.genders}
            placeholder={t("select_gender")}
            onSelect={(values) => onFilterChange("genders", values)}
            initialValues={filter.genders}
            closeOnSelect={false}
            isOpen={openDropdown === "genders"}
            setIsOpen={(open) => handleSetDropdownOpen("genders", open)} // Pass the internal handler
          />
        </div>

        {/* Sizes */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-xl">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">{t("sizes")}</h4>
          <MultiSelectDropdown
            options={filterOptions.sizes}
            placeholder={t("select_size")}
            onSelect={(values) => onFilterChange("sizes", values)}
            initialValues={filter.sizes}
            closeOnSelect={false}
            isOpen={openDropdown === "sizes"}
            setIsOpen={(open) => handleSetDropdownOpen("sizes", open)} // Pass the internal handler
          />
        </div>
      </div>
    </div>
  )
}

export default FilterSidebar

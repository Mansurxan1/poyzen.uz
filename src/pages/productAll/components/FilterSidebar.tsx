"use client"

import type React from "react"
import { useState } from "react"
import { AiOutlineFilter } from "react-icons/ai"
import { useTranslation } from "react-i18next"
import MultiSelectDropdown from "@/components/ui/SelectDropdown"
import Input from "@/components/ui/input"
import Button from "@/components/ui/button"
import type { FilterState, PriceInputState, FilterOptions } from "@/types"

interface FilterSidebarProps {
  filter: FilterState
  priceInput: PriceInputState
  activeFilters: number
  filterOptions: FilterOptions
  onFilterChange: (key: keyof FilterState, values: string[]) => void
  onPriceChange: (type: "min" | "max", value: string) => void
  onClearAll: () => void
  currentProductCount: number
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filter,
  priceInput,
  activeFilters,
  filterOptions,
  onFilterChange,
  onPriceChange,
  onClearAll,
  currentProductCount,
}) => {
  const { t } = useTranslation()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const handleSetDropdownOpen = (dropdownName: string, open: boolean) => {
    if (open) {
      setOpenDropdown(dropdownName)
    } else if (openDropdown === dropdownName) {
      setOpenDropdown(null)
    }
  }

  // Faqat raqamlar kiritishga ruxsat berish va 0 dan pastga tushmaslik
  const handlePriceInputChange = (type: "min" | "max", e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Faqat raqamlar va bo'sh stringga ruxsat berish
    if (/^\d*$/.test(value)) {
      const numValue = Number(value)
      if (type === "min" && numValue < 0) {
        onPriceChange(type, "0") // 0 dan pastga tushmasin
      } else {
        onPriceChange(type, value)
      }
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <AiOutlineFilter className="w-5 h-5" />
          {t("filters")}
          {currentProductCount > 0 && (
            <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1">{currentProductCount}</span>
          )}
        </h3>
        {activeFilters > 0 && (
          <Button onClick={onClearAll} variant="ghost" className="text-sm text-red-500 hover:text-red-700 font-medium">
            {t("clear_all")}
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">{t("price_range")}</h4>
          <div className="space-y-3">
            <Input
              type="text" // type="text" qilib o'zgartirildi
              inputMode="numeric" // Faqat raqamli klaviaturani ochish uchun
              pattern="[0-9]*" // Faqat raqamlarni qabul qilish uchun
              placeholder={t("min_price")}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
              value={priceInput.min}
              onChange={(e) => handlePriceInputChange("min", e)}
            />
            <Input
              type="text" // type="text" qilib o'zgartirildi
              inputMode="numeric" // Faqat raqamli klaviaturani ochish uchun
              pattern="[0-9]*" // Faqat raqamlarni qabul qilish uchun
              placeholder={t("max_price")}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
              value={priceInput.max}
              onChange={(e) => handlePriceInputChange("max", e)}
            />
          </div>
        </div>

        {/* Brands */}
        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">{t("brands")}</h4>
          <MultiSelectDropdown
            options={filterOptions.brands}
            placeholder={t("select_brand")}
            onSelect={(values) => onFilterChange("brands", values)}
            initialValues={filter.brands}
            enableSearch={true}
            closeOnSelect={false}
            isOpen={openDropdown === "brands"}
            setIsOpen={(open) => handleSetDropdownOpen("brands", open)}
          />
        </div>

        {/* Categories */}
        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">{t("categories")}</h4>
          <MultiSelectDropdown
            options={filterOptions.categories}
            placeholder={t("select_category")}
            onSelect={(values) => onFilterChange("categories", values)}
            initialValues={filter.categories}
            enableSearch={true}
            closeOnSelect={false}
            isOpen={openDropdown === "categories"}
            setIsOpen={(open) => handleSetDropdownOpen("categories", open)}
          />
        </div>

        {/* Materials */}
        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">{t("materials")}</h4>
          <MultiSelectDropdown
            options={filterOptions.materials}
            placeholder={t("select_material")}
            onSelect={(values) => onFilterChange("materials", values)}
            initialValues={filter.materials}
            enableSearch={true}
            closeOnSelect={false}
            isOpen={openDropdown === "materials"}
            setIsOpen={(open) => handleSetDropdownOpen("materials", open)}
          />
        </div>

        {/* Colors */}
        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">{t("colors")}</h4>
          <MultiSelectDropdown
            options={filterOptions.colors}
            placeholder={t("select_color")}
            onSelect={(values) => onFilterChange("colors", values)}
            initialValues={filter.colors}
            enableSearch={true}
            closeOnSelect={false}
            isOpen={openDropdown === "colors"}
            setIsOpen={(open) => handleSetDropdownOpen("colors", open)}
          />
        </div>

        {/* Seasons */}
        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">{t("seasons")}</h4>
          <MultiSelectDropdown
            options={filterOptions.seasons}
            placeholder={t("select_season")}
            onSelect={(values) => onFilterChange("seasons", values)}
            initialValues={filter.seasons}
            closeOnSelect={false}
            isOpen={openDropdown === "seasons"}
            setIsOpen={(open) => handleSetDropdownOpen("seasons", open)}
          />
        </div>

        {/* Gender */}
        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">{t("genders")}</h4>
          <MultiSelectDropdown
            options={filterOptions.genders}
            placeholder={t("select_gender")}
            onSelect={(values) => onFilterChange("genders", values)}
            initialValues={filter.genders}
            closeOnSelect={false}
            isOpen={openDropdown === "genders"}
            setIsOpen={(open) => handleSetDropdownOpen("genders", open)}
          />
        </div>

        {/* Sizes */}
        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">{t("sizes")}</h4>
          <MultiSelectDropdown
            options={filterOptions.sizes}
            placeholder={t("select_size")}
            onSelect={(values) => onFilterChange("sizes", values)}
            initialValues={filter.sizes}
            closeOnSelect={false}
            isOpen={openDropdown === "sizes"}
            setIsOpen={(open) => handleSetDropdownOpen("sizes", open)}
          />
        </div>
      </div>
    </div>
  )
}

export default FilterSidebar

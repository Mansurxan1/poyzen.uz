import type React from "react"
import { useState } from "react"
import { AiOutlineFilter } from "react-icons/ai"
import { FaChevronUp, FaSearch } from "react-icons/fa"
import { useTranslation } from "react-i18next"
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
  onSortChange: (sort: "price-asc" | "price-desc" | "date-desc") => void
  sortOrder: "price-asc" | "price-desc" | "date-desc"
}

interface FilterSectionProps {
  title: string
  options: { value: string; label: string; color?: string }[]
  selectedValues: string[]
  onSelect: (values: string[]) => void
  enableSearch?: boolean
  children?: React.ReactNode
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  options,
  selectedValues,
  onSelect,
  enableSearch = true,
  children,
}) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAll, setShowAll] = useState(false)

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const displayedOptions = showAll ? filteredOptions : filteredOptions.slice(0, 5)

  const handleSelect = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [value] // Single selection for sort order
    onSelect(newSelectedValues)
  }

  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <div 
        className="flex items-center justify-between cursor-pointer mb-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
        <FaChevronUp 
          className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
            isOpen ? "rotate-0" : "rotate-180"
          }`}
        />
      </div>

      {isOpen && (
        <div className="space-y-3">
          {enableSearch && (
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder={t("search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50"
              />
            </div>
          )}

          {options.length > 0 && (
            <div 
              className={`space-y-2 ${showAll && filteredOptions.length > 8 ? 'max-h-48 overflow-y-auto custom-scrollbar' : ''}`}
            >
              {displayedOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors duration-150"
                  onClick={() => handleSelect(option.value)}
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.value)}
                    onChange={() => {}} // Handled by parent click
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex items-center gap-2">
                    {option.color && (
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                    <span className="text-sm text-gray-600">{option.label}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {children}

          {filteredOptions.length > 5 && (
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="link"
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              {showAll ? t("show_less") : t("show_all")}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filter,
  priceInput,
  activeFilters,
  filterOptions,
  onFilterChange,
  onPriceChange,
  onClearAll,
  onSortChange,
  sortOrder,
}) => {
  const { t } = useTranslation()

  const handlePriceInputChange = (type: "min" | "max", e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*$/.test(value)) {
      const numValue = Number(value)
      if (type === "min" && numValue < 0) {
        onPriceChange(type, "0")
      } else {
        onPriceChange(type, value)
      }
    }
  }

  const sortOptions = [
    { value: "date-desc", label: t("default_sort") },
    { value: "price-asc", label: t("price_low_to_high") },
    { value: "price-desc", label: t("price_high_to_low") },
  ]

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <AiOutlineFilter className="w-5 h-5" />
          {t("filters")}
        </h3>
        {activeFilters > 0 && (
          <Button
            onClick={onClearAll}
            variant="ghost"
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            {t("clear_all")}
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Sort Order */}
        <FilterSection
          title={t("sort_by")}
          options={sortOptions}
          selectedValues={[sortOrder]}
          onSelect={(values) => onSortChange(values[0] as "price-asc" | "price-desc" | "date-desc")}
          enableSearch={false}
        />

        {/* Price Range */}
        <FilterSection
          title={t("price_range")}
          options={[]}
          selectedValues={[]}
          onSelect={() => {}}
          enableSearch={false}
        >
          <div className="space-y-3">
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder={t("min_price")}
              className="w-full p-3 text-sm bg-white text-gray-700"
              value={priceInput.min}
              onChange={(e) => handlePriceInputChange("min", e)}
            />
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder={t("max_price")}
              className="w-full p-3 text-sm bg-white text-gray-700"
              value={priceInput.max}
              onChange={(e) => handlePriceInputChange("max", e)}
            />
          </div>
        </FilterSection>

        {/* Brands */}
        <FilterSection
          title={t("brands")}
          options={filterOptions.brands}
          selectedValues={filter.brands}
          onSelect={(values) => onFilterChange("brands", values)}
          enableSearch={true}
        />

        {/* Categories */}
        <FilterSection
          title={t("categories")}
          options={filterOptions.categories}
          selectedValues={filter.categories}
          onSelect={(values) => onFilterChange("categories", values)}
          enableSearch={true}
        />

        {/* Materials */}
        <FilterSection
          title={t("materials")}
          options={filterOptions.materials}
          selectedValues={filter.materials}
          onSelect={(values) => onFilterChange("materials", values)}
          enableSearch={true}
        />

        {/* Colors */}
        <FilterSection
          title={t("colors")}
          options={filterOptions.colors}
          selectedValues={filter.colors}
          onSelect={(values) => onFilterChange("colors", values)}
          enableSearch={true}
        />

        {/* Seasons */}
        <FilterSection
          title={t("seasons")}
          options={filterOptions.seasons}
          selectedValues={filter.seasons}
          onSelect={(values) => onFilterChange("seasons", values)}
          enableSearch={false}
        />

        {/* Gender */}
        <FilterSection
          title={t("genders")}
          options={filterOptions.genders}
          selectedValues={filter.genders}
          onSelect={(values) => onFilterChange("genders", values)}
          enableSearch={false}
        />

        {/* Sizes */}
        <FilterSection
          title={t("sizes")}
          options={filterOptions.sizes}
          selectedValues={filter.sizes}
          onSelect={(values) => onFilterChange("sizes", values)}
          enableSearch={false}
        />
      </div>
    </div>
  )
}

export default FilterSidebar
import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { FaChevronDown, FaSearch } from "react-icons/fa"
import { useClickOutside } from "@/hooks/useClickOutside"
import type { MultiSelectDropdownProps } from "@/types"

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  placeholder = "Tanlang",
  onSelect,
  initialValues = [],
  enableSearch = false,
  closeOnSelect = false,
  isOpen = false,
  setIsOpen,
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedValues, setSelectedValues] = useState<string[]>(initialValues)
  const dropdownRef = useClickOutside<HTMLDivElement>(() => {
    if (setIsOpen) setIsOpen(false)
  })

  useEffect(() => {
    setSelectedValues(initialValues)
  }, [initialValues])

  const filteredOptions = useMemo(() => {
    if (!enableSearch || !searchTerm) return options
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [options, searchTerm, enableSearch])

  const handleSelect = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value]
    
    setSelectedValues(newSelectedValues)
    onSelect?.(newSelectedValues)
    
    if (closeOnSelect && setIsOpen) {
      setIsOpen(false)
    }
  }

  const displayedLabel = useMemo(() => {
    if (selectedValues.length === 0) return placeholder
    if (selectedValues.length === 1) {
      const option = options.find((opt) => opt.value === selectedValues[0])
      return option ? option.label : placeholder
    }
    return `${selectedValues.length} ta tanlangan`
  }, [selectedValues, options, placeholder])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen?.(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:bg-gray-50"
      >
        <span className="text-sm text-gray-700 truncate">{displayedLabel}</span>
        <FaChevronDown
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {enableSearch && (
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          )}
          
          <div 
            className="max-h-48 overflow-y-auto" 
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none'
            }}
          >
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className="px-4 py-3 cursor-pointer hover:bg-gray-100 text-sm text-gray-700 flex items-center gap-3 transition-colors duration-150"
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
                  <span>{option.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MultiSelectDropdown

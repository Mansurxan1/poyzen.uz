"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { FaChevronDown } from "react-icons/fa"
import { useClickOutside } from "@/hooks/useClickOutside"
import type { MultiSelectDropdownProps } from "@/types"
import { useTranslation } from "react-i18next" // Import useTranslation

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  placeholder = "Tanlang",
  onSelect,
  initialValues = [],
  enableSearch = false,
  closeOnSelect = false,
  isOpen: controlledIsOpen, // Controlled prop for external state
  setIsOpen: controlledSetIsOpen, // Controlled setter for external state
}) => {
  const { t } = useTranslation() // Initialize useTranslation
  // Internal state, used if not controlled externally
  const [internalIsOpen, setInternalIsOpen] = useState(false)

  // Determine current isOpen state: controlled (if provided) or internal
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
  // Determine current setIsOpen function: controlled (if provided) or internal
  const setIsOpen = controlledSetIsOpen || setInternalIsOpen

  const [selectedValues, setSelectedValues] = useState<string[]>(initialValues)
  const [searchTerm, setSearchTerm] = useState("")

  // Click outside handler
  const dropdownRef = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false) // Always close on click outside
  })

  // Update selected values when initialValues prop changes
  useEffect(() => {
    setSelectedValues(initialValues)
  }, [initialValues])

  const handleSelect = useCallback(
    (value: string, e: React.MouseEvent) => {
      e.preventDefault() // Prevent default behavior (e.g., form submission if inside a form)
      e.stopPropagation() // Stop event from bubbling up to parent elements

      let newValues: string[]
      if (selectedValues.includes(value)) {
        newValues = selectedValues.filter((v) => v !== value)
      } else {
        newValues = [...selectedValues, value]
      }

      setSelectedValues(newValues)
      onSelect?.(newValues)

      // Close dropdown only if closeOnSelect is true
      if (closeOnSelect) {
        setIsOpen(false)
      }
    },
    [selectedValues, onSelect, closeOnSelect, setIsOpen],
  )

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsOpen(!isOpen) // Toggle the dropdown state using the determined setIsOpen function
    },
    [isOpen, setIsOpen],
  )

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation() // Prevent event from bubbling up
    setSearchTerm(e.target.value)
  }, [])

  const handleSearchClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation() // Prevent dropdown from closing when clicking inside search input
  }, [])

  const filteredOptions = options.filter((option) =>
    enableSearch ? option.label.toLowerCase().includes(searchTerm.toLowerCase()) : true,
  )

  const displayedLabel =
    selectedValues.length > 0
      ? selectedValues.length === 1
        ? options.find((opt) => opt.value === selectedValues[0])?.label || selectedValues[0]
        : `${selectedValues.length} ${t("selected_count")}` // Use translation for "selected"
      : placeholder

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="w-full px-4 py-3 flex items-center justify-between bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:bg-gray-50"
      >
        <span className="text-sm text-gray-700 truncate">{displayedLabel}</span>
        <FaChevronDown
          className={`w-4 h-4 ml-2 transition-transform duration-200 text-gray-500 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Use relative positioning to push content down instead of overlay */}
      {isOpen && (
        <div className="relative z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {enableSearch && (
            <div className="p-2 border-b border-gray-200">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onClick={handleSearchClick}
                placeholder={t("search_placeholder_dropdown")} // Use translation for search placeholder
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
              />
            </div>
          )}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 text-sm text-gray-700 transition-colors duration-150"
                onClick={(e) => handleSelect(option.value, e)}
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={() => {}} // Handled by parent click
                  onClick={(e) => e.stopPropagation()} // Prevent checkbox click from bubbling up
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded pointer-events-none" // Make checkbox non-interactive directly
                />
                {option.color && (
                  <span
                    className="w-4 h-4 rounded-full inline-block border border-gray-300 mr-2"
                    style={{ backgroundColor: option.color }}
                  ></span>
                )}
                <span className="flex-1">{option.label}</span>
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">{t("no_items_found")}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MultiSelectDropdown

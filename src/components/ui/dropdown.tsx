import type React from "react"
import { useState, useMemo } from "react"
import { FaChevronDown } from "react-icons/fa"
import { useClickOutside } from "@/hooks/useClickOutside"
import type { DropdownProps } from "@/types"

const Dropdown: React.FC<DropdownProps> = ({
  options,
  placeholder = "Tanlang",
  onSelect,
  initialValue,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false))

  const displayedLabel = useMemo(() => {
    if (initialValue) {
      const selectedOption = options.find((opt) => opt.value === initialValue)
      return selectedOption ? selectedOption.label : placeholder
    }
    return placeholder
  }, [initialValue, options, placeholder])

  const handleSelect = (option: (typeof options)[0]) => {
    setIsOpen(false)
    onSelect?.(option.value)
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-4 py-2 flex items-center justify-between bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:bg-gray-50"
      >
        <span className="text-sm text-gray-700">{displayedLabel}</span>
        <FaChevronDown
          className={`w-3.5 h-3.5 ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </button>
      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-md max-h-60 overflow-y-auto">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-700 transition-colors duration-150"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dropdown

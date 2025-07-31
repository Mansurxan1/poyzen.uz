import type React from "react"
import { useState, useRef, useEffect, useMemo } from "react"
import { FaChevronDown } from "react-icons/fa"

type DropdownOption = {
  value: string
  label: string
}

type DropdownProps = {
  options: DropdownOption[]
  placeholder?: string
  onSelect?: (value: string) => void
  initialValue?: string // Tanlangan qiymat (masalan, "uz", "ru")
}

const Dropdown: React.FC<DropdownProps> = ({ options, placeholder = "Select", onSelect, initialValue }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Ko'rsatiladigan labelni initialValue va options'dan to'g'ridan-to'g'ri hisoblab chiqamiz
  const displayedLabel = useMemo(() => {
    if (initialValue) {
      const selectedOption = options.find((opt) => opt.value === initialValue)
      return selectedOption ? selectedOption.label : placeholder // Agar qiymat topilmasa, placeholder ko'rsatiladi
    }
    return placeholder // Agar initialValue bo'lmasa, placeholder ko'rsatiladi
  }, [initialValue, options, placeholder]) // initialValue, options va placeholder o'zgarganda qayta hisoblanadi

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSelect = (option: DropdownOption) => {
    setIsOpen(false)
    onSelect?.(option.value) // Har doim 'value' ni yuboramiz
  }

  return (
    <div className="relative w-52" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-4 py-2 flex items-center justify-between bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="text-sm text-gray-700">{displayedLabel}</span> {/* Hisoblangan labelni ishlatamiz */}
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
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-700"
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

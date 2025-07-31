import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

interface DropdownOption {
  value: string;
  label: string;
  color?: string;
}

interface DropdownProps {
  options: DropdownOption[];
  placeholder?: string;
  onSelect?: (values: string[]) => void;
  initialValues?: string[];
  enableSearch?: boolean;
  closeOnSelect?: boolean;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

const MultiSelectDropdown: React.FC<DropdownProps> = ({
  options,
  placeholder = "Tanlang",
  onSelect,
  initialValues = [],
  enableSearch = false,
  closeOnSelect = true,
  isOpen: controlledIsOpen,
  setIsOpen: controlledSetIsOpen,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = controlledSetIsOpen || setInternalIsOpen;
  const [selectedValues, setSelectedValues] = useState<string[]>(initialValues);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (value: string) => {
    let newValues: string[];
    if (selectedValues.includes(value)) {
      newValues = selectedValues.filter((v) => v !== value);
    } else {
      newValues = [...selectedValues, value];
    }
    setSelectedValues(newValues);
    onSelect?.(newValues);
    if (closeOnSelect) {
      setIsOpen(false);
    }
  };

  const filteredOptions = options.filter((option) =>
    enableSearch
      ? option.label.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  const displayedLabel =
    selectedValues.length > 0
      ? selectedValues
          .map((val) => options.find((opt) => opt.value === val)?.label || val)
          .join(", ")
      : placeholder;

  return (
    <div className="relative w-64" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:bg-gray-50"
      >
        <span className="text-sm text-gray-700 truncate">{displayedLabel}</span>
        <FaChevronDown
          className={`w-4 h-4 ml-2 transition-transform duration-200 text-gray-500 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {enableSearch && (
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Qidirish..."
              className="w-full px-4 py-2 border-b border-gray-200 focus:outline-none text-sm text-gray-700 bg-gray-50"
            />
          )}
          {filteredOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 text-sm text-gray-700 transition-colors duration-150"
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={() => handleSelect(option.value)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              {option.color && (
                <span
                  className="w-4 h-4 rounded-full inline-block border border-gray-300 mr-2"
                  style={{ backgroundColor: option.color }}
                ></span>
              )}
              {option.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
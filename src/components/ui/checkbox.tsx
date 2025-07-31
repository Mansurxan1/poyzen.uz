"use client"

import type React from "react"
import type { CheckboxProps } from "@/types"

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange, className = "" }) => {
  return (
    <label
      className={`flex items-center mb-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded checked:bg-blue-600 checked:border-transparent transition-all duration-200"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  )
}

export default Checkbox

"use client"

import type React from "react"
import type { InputProps } from "@/types"

const Input: React.FC<InputProps> = ({ className = "", ...props }) => {
  return (
    <input
      {...props}
      className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      onKeyDown={(e) => {
        if (props.type === "number" && ["e", "E", "+", "-"].includes(e.key)) {
          e.preventDefault()
        }
      }}
    />
  )
}

export default Input

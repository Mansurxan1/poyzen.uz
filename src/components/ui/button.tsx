import type React from "react"
import type { ButtonProps } from "@/types"

const Button: React.FC<ButtonProps> = ({
  className = "",
  variant = "default",
  size = "default",
  children,
  ...props
}) => {
  const baseClasses =
    "inline-flex cursor-pointer items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 focus:ring-blue-500",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
    ghost: "hover:bg-gray-100 text-gray-700 focus:ring-gray-500",
    link: "text-blue-600 underline-offset-4 hover:underline focus:ring-blue-500",
  }

  const sizes = {
    default: "h-10 px-4 py-2 text-2xl",
    sm: "h-8 px-3 text2xls",
    lg: "h-12 px-8 text-base",
    icon: "h-10 w-10",
  }

  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} rounded-md ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button

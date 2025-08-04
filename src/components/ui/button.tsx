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
    "inline-flex cursor-pointer items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 ",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "bg-transparent hover:bg-gray-50 text-gray-700",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    ghost: "hover:bg-gray-100 text-gray-700",
    link: "text-blue-600 underline-offset-4 hover:underline",
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

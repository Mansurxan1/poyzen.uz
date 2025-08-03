import type React from "react"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string
  variant?: "default" | "secondary" | "destructive" | "success" | "warning" | "outline"
  size?: "sm" | "default" | "lg"
}

const Badge: React.FC<BadgeProps> = ({ className = "", variant = "default", size = "default", children, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200"

  const variants = {
    default: "bg-blue-100 text-blue-800 border border-blue-200",
    secondary: "bg-gray-100 text-gray-800 border border-gray-200",
    destructive: "bg-red-100 text-red-800 border border-red-200",
    success: "bg-green-100 text-green-800 border border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    outline: "bg-transparent text-gray-700 border border-gray-300",
  }

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  }

  return (
    <span className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </span>
  )
}

export default Badge

import type React from "react"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  variant?: "default" | "outlined" | "elevated" | "ghost"
  padding?: "none" | "sm" | "default" | "lg"
}

const Card: React.FC<CardProps> = ({
  className = "",
  variant = "default",
  children,
  ...props
}) => {
  const baseClasses = "rounded-lg transition-all duration-200"

  const variants = {
    default: "bg-white border border-gray-200 shadow-sm",
    outlined: "bg-white border-2 border-gray-300",
    elevated: "bg-white shadow-lg border border-gray-100",
    ghost: "bg-transparent",
  }

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  )
}

export default Card

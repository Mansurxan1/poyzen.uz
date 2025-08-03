import type React from "react"

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  orientation?: "horizontal" | "vertical"
  variant?: "default" | "dashed" | "dotted" | "thick"
}

const Separator: React.FC<SeparatorProps> = ({
  className = "",
  orientation = "horizontal",
  variant = "default",
  ...props
}) => {
  const baseClasses = "bg-gray-200"

  const orientations = {
    horizontal: "w-full h-px",
    vertical: "h-full w-px",
  }

  const variants = {
    default: "bg-gray-200",
    dashed: "bg-transparent border-t border-dashed border-gray-300",
    dotted: "bg-transparent border-t border-dotted border-gray-300",
    thick: "bg-gray-300 h-0.5",
  }

  const orientationClasses = orientations[orientation]
  const variantClasses = variant === "default" ? baseClasses : variants[variant]

  return (
    <div
      className={`${orientationClasses} ${variantClasses} ${className}`}
      role="separator"
      aria-orientation={orientation}
      {...props}
    />
  )
}

export default Separator

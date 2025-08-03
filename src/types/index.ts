import type React from "react"
export interface Price {
  usd: number
  uzs: number
}

export interface LocalizedText {
  uz: string
  ru: string
}

export interface ProductSize {
  size: number
  inStock: boolean
  sold: number
  price: Price
  discount: Price
}

export interface ProductVariant {
  id: string
  nameUrl: string
  color: number
  gender: "Men" | "Women" | "Unisex"
  materials: number
  year: number
  description: LocalizedText
  rating: number
  season: number
  poizonLink: string
  images: string[]
  sizes: ProductSize[]
  inStock: boolean
  inAdvancePayment: boolean
  createdAt: string
  brand?: string
  productName?: string
  product?: Product
}

export interface Product {
  brand: string
  name: string
  category: number
  videoUrl: string
  variants: ProductVariant[]
  relatedBrands: string[]
}

export interface Category {
  id: number
  name: LocalizedText
}

export interface Material {
  id: number
  name: LocalizedText
}

export interface Color {
  id: number
  name: LocalizedText
  color: string
}

export interface Season {
  id: number
  name: LocalizedText
  color: string
}

export interface BannerItem {
  id: string
  image: {
    uz: string
    ru: string
  }
  url: string
}

export interface CartItem {
  id: string
  quantity: number
  size: number
  variant: ProductVariant
  product: Product
}

export interface LikedProduct {
  id: string
  variant: ProductVariant
  product: Product
}

export interface DropdownOption {
  value: string
  label: string
  color?: string
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  children: React.ReactNode
}

export interface CheckboxProps {
  label: React.ReactNode
  checked: boolean
  onChange: () => void
  className?: string
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export interface DropdownProps {
  options: DropdownOption[]
  placeholder?: string
  onSelect?: (value: string) => void
  initialValue?: string
  className?: string
}

export interface SearchBarProps {
  isSearchOpen: boolean
  toggleSearch: () => void
}


export interface FilterState {
  categories: string[]
  colors: string[]
  seasons: string[]
  materials: string[]
  brands: string[]
  genders: string[]
  sizes: string[]
  priceMin: number
  priceMax: number
  bestDeals: boolean
}

export interface PriceInputState {
  min: string
  max: string
}

export interface DropdownOption {
  value: string
  label: string
  color?: string
}

export interface FilterOptions {
  categories: DropdownOption[]
  colors: DropdownOption[]
  seasons: DropdownOption[]
  materials: DropdownOption[]
  brands: DropdownOption[]
  genders: DropdownOption[]
  sizes: DropdownOption[]
}

export interface Price {
  usd: number
  uzs: number
}

export interface LocalizedText {
  uz: string
  ru: string
}

export interface ProductSize {
  size: number
  inStock: boolean
  sold: number
  price: Price
  discount: Price
}

export interface ProductVariant {
  id: string
  nameUrl: string
  color: number
  gender: "Men" | "Women" | "Unisex"
  materials: number
  year: number
  description: LocalizedText
  rating: number
  season: number
  poizonLink: string
  images: string[]
  sizes: ProductSize[]
  inStock: boolean
  inAdvancePayment: boolean
  createdAt: string
  brand?: string
  productName?: string
  product?: Product
  category?: number
}

export interface Product {
  brand: string
  name: string
  category: number
  videoUrl: string
  variants: ProductVariant[]
  relatedBrands: string[]
}

export interface ProductsData {
  [brand: string]: Product[]
}

export interface Category {
  id: number
  name: LocalizedText
}

export interface Material {
  id: number
  name: LocalizedText
}

export interface Color {
  id: number
  name: LocalizedText
  color: string
}

export interface Season {
  id: number
  name: LocalizedText
  color: string
}

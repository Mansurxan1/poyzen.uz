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

"use client"

import { useMemo, useCallback } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux"
import type { ProductVariant, Category } from "@/types"
import { useDebounce } from "@/hooks/useDebounce"

export const useProductSearch = (query: string) => {
  const debouncedQuery = useDebounce(query, 300)
  const { data: products } = useSelector((state: RootState) => state.products)
  const { categories } = useSelector((state: RootState) => state.categories)
  const language = useSelector((state: RootState) => state.language.language)

  const allVariants = useMemo(() => {
    return Object.keys(products).flatMap((brand) =>
      products[brand].flatMap((product) =>
        product.variants.map((variant: ProductVariant) => ({
          ...variant,
          brand: product.brand,
          productName: product.name,
          product: product,
          category: product.category,
        })),
      ),
    )
  }, [products])

  const getLocalizedName = useCallback((name: { uz: string; ru: string }) => {
    return language === "uz" ? name.uz : name.ru
  }, [language])

  const searchResults = useMemo(() => {
    if (!debouncedQuery) return []

    const lowerCaseQuery = debouncedQuery.toLowerCase()
    const exactMatches: ProductVariant[] = []
    const partialMatches: ProductVariant[] = []

    allVariants.forEach((variant) => {
      const productName = variant.productName?.toLowerCase() || ""
      const brandName = variant.brand?.toLowerCase() || ""
      const categoryName = getLocalizedName(
        categories.find((cat: Category) => cat.id === variant.category)?.name || { uz: "", ru: "" },
      ).toLowerCase()

      if (
        productName.includes(lowerCaseQuery) ||
        brandName.includes(lowerCaseQuery) ||
        categoryName.includes(lowerCaseQuery) ||
        variant.id.toLowerCase().includes(lowerCaseQuery)
      ) {
        if (
          productName === lowerCaseQuery ||
          brandName === lowerCaseQuery ||
          categoryName === lowerCaseQuery ||
          variant.id.toLowerCase() === lowerCaseQuery
        ) {
          exactMatches.push(variant)
        } else {
          partialMatches.push(variant)
        }
      }
    })

    // Prioritize exact matches, then partial matches
    return [...new Set([...exactMatches, ...partialMatches])] // Use Set to remove duplicates
  }, [debouncedQuery, allVariants, categories, getLocalizedName])

  const suggestedProducts = useMemo(() => {
    if (searchResults.length > 0) return [] // Don't suggest if there are search results

    // Return a selection of popular/new products if no search results
    // For simplicity, let's return the first 12 products from all variants
    return allVariants.slice(0, 12)
  }, [searchResults.length, allVariants])

  const popularBrands = useMemo(() => {
    const brands = Array.from(new Set(allVariants.map((v) => v.brand))).filter(Boolean)
    return brands.slice(0, 5) // Top 5 popular brands
  }, [allVariants])

  const popularCategories = useMemo(() => {
    return categories
      .map((cat: Category) => ({
        id: cat.id,
        name: getLocalizedName(cat.name),
      }))
      .slice(0, 5) // Top 5 popular categories
  }, [categories, getLocalizedName])

  return {
    searchResults,
    suggestedProducts,
    popularBrands,
    popularCategories,
    hasExactResults: searchResults.length > 0,
    hasSuggestions: suggestedProducts.length > 0 || popularBrands.length > 0 || popularCategories.length > 0,
  }
}

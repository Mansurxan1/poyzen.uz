"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux"
import type { FilterState, PriceInputState, FilterOptions, LocalizedText, DropdownOption } from "@/types"
import type { ProductVariant, ProductSize, Category, Color, Material, Season } from "@/types"
import { useTranslation } from "react-i18next"
import { useCurrency } from "@/hooks/useCurrency"

export const useProductFilter = () => {
  const { t } = useTranslation()
  const { currency } = useCurrency()
  const { data: products } = useSelector((state: RootState) => state.products)
  const { language } = useSelector((state: RootState) => state.language)
  const { categories, colors, season, materials } = useSelector((state: RootState) => state.categories)

  const [filter, setFilter] = useState<FilterState>({
    categories: [],
    colors: [],
    seasons: [],
    materials: [],
    brands: [],
    genders: [],
    sizes: [],
    priceMin: 0,
    priceMax: Number.POSITIVE_INFINITY,
  })

  const [priceInput, setPriceInput] = useState<PriceInputState>({ min: "", max: "" })
  const [activeFilters, setActiveFilters] = useState(0)

  // Count active filters
  useEffect(() => {
    const count = Object.entries(filter).reduce((total, [key, value]) => {
      if (key === "priceMin" || key === "priceMax") {
        return (
          total +
          (key === "priceMin" && value > 0 ? 1 : 0) +
          (key === "priceMax" && value < Number.POSITIVE_INFINITY ? 1 : 0)
        )
      }
      if (Array.isArray(value)) {
        return total + value.length
      }
      return total
    }, 0)
    setActiveFilters(count)
  }, [filter])

  const getLocalizedName = useCallback((name: LocalizedText) => {
    return language === "uz" ? name.uz : name.ru
  }, [language])

  // Get all variants with product info
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

  // Get filter options
  const filterOptions: FilterOptions = useMemo(() => {
    const brands = Array.from(new Set(allVariants.map((v) => v.brand)))
    const genders = ["Men", "Women", "Unisex"]
    const sizes = Array.from(
      new Set(allVariants.flatMap((variant) => variant.sizes.map((s: ProductSize) => s.size))),
    ).sort((a, b) => a - b)

    const sortAlphabetically = (a: DropdownOption, b: DropdownOption) => a.label.localeCompare(b.label)
    const sortNumerically = (a: DropdownOption, b: DropdownOption) => Number(a.label) - Number(b.label)

    return {
      categories: categories
        .map((cat: Category) => ({
          value: cat.id.toString(),
          label: getLocalizedName(cat.name),
        }))
        .sort(sortAlphabetically),
      colors: colors
        .map((color: Color) => ({
          value: color.id.toString(),
          label: getLocalizedName(color.name),
          color: color.color,
        }))
        .sort(sortAlphabetically),
      seasons: season
        .map((s: Season) => ({
          value: s.id.toString(),
          label: getLocalizedName(s.name),
        }))
        .sort(sortAlphabetically),
      materials: materials
        .map((mat: Material) => ({
          value: mat.id.toString(),
          label: getLocalizedName(mat.name),
        }))
        .sort(sortAlphabetically),
      brands: brands.map((brand) => ({ value: brand, label: brand })).sort(sortAlphabetically),
      genders: genders.map((gender) => ({ value: gender, label: t(gender.toLowerCase()) })).sort(sortAlphabetically),
      sizes: sizes.map((size) => ({ value: size.toString(), label: size.toString() })).sort(sortNumerically),
    }
  }, [categories, colors, season, materials, allVariants, t, getLocalizedName])

  // Filter products based on criteria
  const getFilteredProducts = useCallback((strict = true) => {
    return allVariants
      .filter((variant) => {
        // Use the current currency for price filtering
        const priceMatch = variant.sizes.some((s: ProductSize) => {
          const price = s.discount[currency]
          return price >= filter.priceMin && price <= filter.priceMax
        })

        if (strict) {
          return (
            (filter.categories.length === 0 || filter.categories.includes(variant.category!.toString())) &&
            (filter.colors.length === 0 || filter.colors.includes(variant.color.toString())) &&
            (filter.seasons.length === 0 || filter.seasons.includes(variant.season.toString())) &&
            (filter.materials.length === 0 || filter.materials.includes(variant.materials.toString())) &&
            (filter.brands.length === 0 || filter.brands.includes(variant.brand!)) &&
            (filter.genders.length === 0 || filter.genders.includes(variant.gender)) &&
            (filter.sizes.length === 0 ||
              variant.sizes.some((s: ProductSize) => filter.sizes.includes(s.size.toString()))) &&
            priceMatch
          )
        } else {
          // Relaxed filtering for similar products
          const categoryMatch =
            filter.categories.length === 0 || filter.categories.includes(variant.category!.toString())
          const brandMatch = filter.brands.length === 0 || filter.brands.includes(variant.brand!)
          const genderMatch = filter.genders.length === 0 || filter.genders.includes(variant.gender)

          return categoryMatch || brandMatch || genderMatch || priceMatch
        }
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [allVariants, filter, currency])

  const filteredProducts = useMemo(() => getFilteredProducts(true), [getFilteredProducts])
  const similarProducts = useMemo(
    () => (filteredProducts.length === 0 ? getFilteredProducts(false).slice(0, 12) : []),
    [filteredProducts, getFilteredProducts],
  )

  const handleFilterChange = (key: keyof FilterState, values: string[]) => {
    let newValues = values
    if (newValues.length > 1 && newValues.includes("0")) {
      newValues = newValues.filter((v) => v !== "0")
    }
    setFilter((prev) => ({
      ...prev,
      [key]: newValues,
    }))
  }

  const handlePriceChange = (type: "min" | "max", value: string) => {
    setPriceInput((prev) => ({ ...prev, [type]: value }))

    const numValue = value === "" ? (type === "min" ? 0 : Number.POSITIVE_INFINITY) : Number(value)

    setFilter((prev) => ({
      ...prev,
      [type === "min" ? "priceMin" : "priceMax"]: numValue,
    }))
  }

  const clearAllFilters = () => {
    setFilter({
      categories: [],
      colors: [],
      seasons: [],
      materials: [],
      brands: [],
      genders: [],
      sizes: [],
      priceMin: 0,
      priceMax: Number.POSITIVE_INFINITY,
    })
    setPriceInput({ min: "", max: "" })
  }

  return {
    filter,
    priceInput,
    activeFilters,
    filteredProducts,
    similarProducts,
    filterOptions,
    handleFilterChange,
    handlePriceChange,
    clearAllFilters,
    getLocalizedName,
  }
}

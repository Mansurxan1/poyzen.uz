// src/hooks/useProductSearch.ts
import { useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux";
import type { ProductVariant, Category } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";

export const useProductSearch = (query: string) => {
  const debouncedQuery = useDebounce(query, 300);
  const { data: products } = useSelector((state: RootState) => state.products);
  const { categories } = useSelector((state: RootState) => state.categories);
  const language = useSelector((state: RootState) => state.language.language);

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
    );
  }, [products]);

  const getLocalizedName = useCallback(
    (name: { uz: string; ru: string }) => {
      return language === "uz" ? name.uz : name.ru;
    },
    [language],
  );

  const searchResults = useMemo(() => {
    if (!debouncedQuery) return [];

    // Split query into individual words
    const queryWords = debouncedQuery.toLowerCase().trim().split(/\s+/);
    const exactMatches: ProductVariant[] = [];
    const partialMatches: ProductVariant[] = [];

    allVariants.forEach((variant) => {
      const productName = variant.productName?.toLowerCase() || "";
      const brandName = variant.brand?.toLowerCase() || "";
      const categoryName = getLocalizedName(
        categories.find((cat: Category) => cat.id === variant.category)?.name || {
          uz: "",
          ru: "",
        },
      ).toLowerCase();
      const descriptionUz = variant.description?.uz.toLowerCase() || "";
      const descriptionRu = variant.description?.ru.toLowerCase() || "";
      const variantId = variant.id.toLowerCase();

      // Check if any query word matches in any field
      const matches = queryWords.some((word) =>
        productName.includes(word) ||
        brandName.includes(word) ||
        categoryName.includes(word) ||
        variantId.includes(word) ||
        descriptionUz.includes(word) ||
        descriptionRu.includes(word),
      );

      if (matches) {
        // Check for exact match of the full query
        const fullQuery = debouncedQuery.toLowerCase().trim();
        if (
          productName === fullQuery ||
          brandName === fullQuery ||
          categoryName === fullQuery ||
          variantId === fullQuery ||
          descriptionUz === fullQuery ||
          descriptionRu === fullQuery
        ) {
          exactMatches.push(variant);
        } else {
          partialMatches.push(variant);
        }
      }
    });

    return [...new Set([...exactMatches, ...partialMatches])];
  }, [debouncedQuery, allVariants, categories, getLocalizedName]);

  const suggestedProducts = useMemo(() => {
    if (searchResults.length > 0) return [];
    return allVariants.slice(0, 12);
  }, [searchResults.length, allVariants]);

  const popularBrands = useMemo(() => {
    const brands = Array.from(new Set(allVariants.map((v) => v.brand))).filter(Boolean);
    return brands.slice(0, 5);
  }, [allVariants]);

  const popularCategories = useMemo(() => {
    return categories
      .map((cat: Category) => ({
        id: cat.id,
        name: getLocalizedName(cat.name),
      }))
      .slice(0, 5);
  }, [categories, getLocalizedName]);

  return {
    searchResults,
    suggestedProducts,
    popularBrands,
    popularCategories,
    hasExactResults: searchResults.length > 0,
    hasSuggestions: suggestedProducts.length > 0 || popularBrands.length > 0 || popularCategories.length > 0,
  };
};
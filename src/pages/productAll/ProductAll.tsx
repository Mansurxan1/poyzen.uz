import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "@/features/productSlice";
import { setCategories, setMaterials, setColors, setSeasons } from "@/features/categorySlice";
import { setCurrency } from "@/features/currencySlice";
import { setLanguage } from "@/features/languageSlice";
import { addLike, removeLike } from "@/features/likesSlice";
import { AiOutlineHeart, AiFillHeart, AiOutlineFilter, AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
// @ts-expect-error - Swiper CSS import
import "swiper/css/bundle";
import { useTranslation } from "react-i18next";
import MultiSelectDropdown from "@/components/ui/SelectDropdown";
import Input from "@/components/ui/input";
import i18n from "@/i18n/i18n";
import type { RootState, AppDispatch } from "@/redux";
import type { Product, ProductVariant, ProductSize, Category, Color, Material, Season } from "@/types";

interface LocalizedText {
  uz: string;
  ru: string;
}

interface FilterState {
  categories: string[];
  colors: string[];
  seasons: string[];
  materials: string[];
  brands: string[];
  genders: string[];
  sizes: string[];
  priceMin: number;
  priceMax: number;
}

const ProductAll: React.FC = () => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  // navigate is used in handleLikesClick function
  
  const { data: products } = useSelector((state: RootState) => state.products);
  const { currency } = useSelector((state: RootState) => state.currency) as 'usd' | 'uzs';
  const { language } = useSelector((state: RootState) => state.language);
  const { categories, colors, season, materials } = useSelector((state: RootState) => state.categories);
  const { likedProducts } = useSelector((state: RootState) => state.likes);

  const [filter, setFilter] = useState<FilterState>({
    categories: [],
    colors: [],
    seasons: [],
    materials: [],
    brands: [],
    genders: [],
    sizes: [],
    priceMin: 0,
    priceMax: Infinity,
  });
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [priceInput, setPriceInput] = useState({ min: "", max: "" });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    dispatch(setProducts(products));
    dispatch(setCategories(categories));
    dispatch(setMaterials(materials));
    dispatch(setColors(colors));
    dispatch(setSeasons(season));

    const savedCurrency = localStorage.getItem("currency") || "usd";
    const savedLanguage = localStorage.getItem("i18n-lang") || "uz";
    dispatch(setCurrency(savedCurrency));
    dispatch(setLanguage(savedLanguage));
    if (i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [dispatch, products, categories, materials, colors, season]);

  // Count active filters
  useEffect(() => {
    const count = Object.values(filter).reduce((total, value) => {
      if (Array.isArray(value)) {
        return total + value.length;
      }
      return total;
    }, 0);
    setActiveFilters(count);
  }, [filter]);

  // getPrice function removed as it's not used

  const getLocalizedName = (name: LocalizedText) => {
    return language === "uz" ? name.uz : name.ru;
  };

  const toggleLike = (productId: string, variant: ProductVariant, product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    const isLiked = likedProducts.some(item => item.id === productId);
    
    if (isLiked) {
      dispatch(removeLike(productId));
    } else {
      dispatch(addLike({
        id: productId,
        variant: variant,
        product: product
      }));
    }
  };

  const formatPrice = (price: number, isUZS: boolean = currency === "uzs") => {
    return price.toLocaleString(isUZS ? "uz-UZ" : "en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).replace(/,/g, isUZS ? " " : ",");
  };

  const handleFilterChange = (key: keyof FilterState, values: string[]) => {
    let newValues = values;
    if (newValues.length > 1 && newValues.includes("0")) {
      newValues = newValues.filter((v) => v !== "0");
    }
    setFilter((prev) => ({
      ...prev,
      [key]: newValues,
    }));
  };

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
      priceMax: Infinity,
    });
  };

  const filteredProducts = Object.keys(products)
    .flatMap((brand) =>
      (products[brand] as Product[]).flatMap((product: Product) =>
        product.variants
          .filter((variant: ProductVariant) =>
            (filter.categories.length === 0 || filter.categories.includes(product.category.toString())) &&
            (filter.colors.length === 0 || filter.colors.includes(variant.color.toString())) &&
            (filter.seasons.length === 0 || filter.seasons.includes(variant.season.toString())) &&
            (filter.materials.length === 0 || filter.materials.includes(variant.materials.toString())) &&
            (filter.brands.length === 0 || filter.brands.includes(product.brand)) &&
            (filter.genders.length === 0 || filter.genders.includes(variant.gender)) &&
            (filter.sizes.length === 0 || variant.sizes.some((s: ProductSize) => filter.sizes.includes(s.size.toString()))) &&
            (variant.sizes.some((s: ProductSize) => s.discount[currency as 'usd' | 'uzs'] >= filter.priceMin && s.discount[currency as 'usd' | 'uzs'] <= filter.priceMax))
          )
          .map((variant: ProductVariant) => ({ ...variant, brand: product.brand, productName: product.name, product }))
      )
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const brands = Object.keys(products);
  const genders = ["Men", "Women", "Unisex"];
  const sizes = Array.from(new Set(filteredProducts.flatMap((variant: ProductVariant) => variant.sizes.map((s: ProductSize) => s.size)))).sort((a, b) => a - b);

  const dropdownOptions = {
    categories: categories.map((cat: Category) => ({
      value: cat.id.toString(),
      label: getLocalizedName(cat.name),
    })),
    colors: colors.map((color: Color) => ({
      value: color.id.toString(),
      label: getLocalizedName(color.name),
      color: color.color,
    })),
    seasons: season.map((s: Season) => ({
      value: s.id.toString(),
      label: getLocalizedName(s.name),
    })),
    materials: materials.map((mat: Material) => ({
      value: mat.id.toString(),
      label: getLocalizedName(mat.name),
    })),
    brands: brands.map((brand) => ({ value: brand, label: brand })),
    genders: genders.map((gender) => ({ value: gender, label: t(gender.toLowerCase()) })),
    sizes: sizes.map((size) => ({ value: size.toString(), label: size.toString() })),
  };

  const FilterSidebar = () => (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <AiOutlineFilter className="w-5 h-5" />
          {t("filters")}
        </h3>
        {activeFilters > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            {t("clear_all")}
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">{t("price_range")}</h4>
        <div className="space-y-3">
          <Input
            type="number"
            placeholder={t("min_price")}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
              value={priceInput.min}
              onChange={e => {
                setPriceInput((prev) => ({ ...prev, min: e.target.value }));
                setFilter((prev) => ({
                  ...prev,
                  priceMin: e.target.value === "" ? 0 : Number(e.target.value)
                }));
              }}
          />
          <Input
            type="number"
            placeholder={t("max_price")}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
              value={priceInput.max}
              onChange={e => {
                setPriceInput((prev) => ({ ...prev, max: e.target.value }));
                setFilter((prev) => ({
                  ...prev,
                  priceMax: e.target.value === "" ? Infinity : Number(e.target.value)
                }));
              }}
          />
          </div>
        </div>

        {/* Brands */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">{t("brands")}</h4>
        <MultiSelectDropdown
          options={dropdownOptions.brands}
          placeholder={t("select")}
          onSelect={(values) => handleFilterChange("brands", values)}
          initialValues={filter.brands}
          enableSearch={true}
          isOpen={openDropdown === "brands"}
          setIsOpen={(open) => setOpenDropdown(open ? "brands" : null)}
        />
        </div>

        {/* Categories */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">{t("categories")}</h4>
        <MultiSelectDropdown
          options={dropdownOptions.categories}
          placeholder={t("select")}
          onSelect={(values) => handleFilterChange("categories", values)}
          initialValues={filter.categories}
          enableSearch={true}
          isOpen={openDropdown === "categories"}
          setIsOpen={(open) => setOpenDropdown(open ? "categories" : null)}
        />
        </div>

        {/* Materials */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">{t("materials")}</h4>
        <MultiSelectDropdown
          options={dropdownOptions.materials}
          placeholder={t("select")}
          onSelect={(values) => handleFilterChange("materials", values)}
          initialValues={filter.materials}
          enableSearch={true}
          isOpen={openDropdown === "materials"}
          setIsOpen={(open) => setOpenDropdown(open ? "materials" : null)}
        />
        </div>

        {/* Colors */}
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-xl">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">{t("colors")}</h4>
        <MultiSelectDropdown
          options={dropdownOptions.colors}
          placeholder={t("select")}
          onSelect={(values) => handleFilterChange("colors", values)}
          initialValues={filter.colors}
          enableSearch={true}
          isOpen={openDropdown === "colors"}
          setIsOpen={(open) => setOpenDropdown(open ? "colors" : null)}
        />
        </div>

        {/* Seasons */}
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-xl">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">{t("seasons")}</h4>
        <MultiSelectDropdown
          options={dropdownOptions.seasons}
          placeholder={t("select")}
          onSelect={(values) => handleFilterChange("seasons", values)}
          initialValues={filter.seasons}
          isOpen={openDropdown === "seasons"}
          setIsOpen={(open) => setOpenDropdown(open ? "seasons" : null)}
        />
        </div>

        {/* Gender */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">{t("gender")}</h4>
        <MultiSelectDropdown
          options={dropdownOptions.genders}
          placeholder={t("select")}
          onSelect={(values) => handleFilterChange("genders", values)}
          initialValues={filter.genders}
          isOpen={openDropdown === "genders"}
          setIsOpen={(open) => setOpenDropdown(open ? "genders" : null)}
        />
        </div>

        {/* Sizes */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-xl">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">{t("sizes")}</h4>
        <MultiSelectDropdown
          options={dropdownOptions.sizes}
          placeholder={t("select")}
          onSelect={(values) => handleFilterChange("sizes", values)}
          initialValues={filter.sizes}
          isOpen={openDropdown === "sizes"}
          setIsOpen={(open) => setOpenDropdown(open ? "sizes" : null)}
        />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{t("all_products")}</h1>
            <p className="text-gray-600">
              {filteredProducts.length} {t("products_found")}
            </p>
          </div>
          
          {/* Mobile Filter Button */}
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md border border-gray-200"
            >
              <AiOutlineFilter className="w-5 h-5" />
              {t("filters")}
              {activeFilters > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                  {activeFilters}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar />
          </div>

          {/* Mobile Filter Overlay */}
          {isFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50">
              <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{t("filters")}</h3>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <AiOutlineClose className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <FilterSidebar />
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 auto-rows-fr">
              {filteredProducts.map((variant: ProductVariant) => {
                const isLiked = likedProducts.some(item => item.id === variant.id);
                
                return (
            <Link
              key={variant.id}
              to={`/${language}/${variant.brand}/${variant.nameUrl}/${variant.id}`}
                    className="border rounded-lg overflow-hidden shadow-sm relative hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <Swiper
                  modules={[Pagination]}
                  pagination={{ clickable: true }}
                  loop={true}
                  className="w-full h-48"
                >
                  {variant.images.map((image: string, index: number) => (
                    <SwiperSlide key={index}>
                            <img 
                              src={image} 
                              alt={`${variant.nameUrl} ${index + 1}`} 
                              className="w-full h-48 object-cover" 
                            />
                    </SwiperSlide>
                  ))}
                </Swiper>
                      
                      {/* Discount Badge */}
                      {variant.sizes[0].discount[currency as 'usd' | 'uzs'] < variant.sizes[0].price[currency as 'usd' | 'uzs'] && (
                        <div className="absolute top-2 left-2 z-50 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                          -{Math.round(((variant.sizes[0].price[currency as 'usd' | 'uzs'] - variant.sizes[0].discount[currency as 'usd' | 'uzs']) / variant.sizes[0].price[currency as 'usd' | 'uzs']) * 100)}%
                        </div>
                      )}
                      {/* Like Button */}
                <button
                        onClick={(e) => toggleLike(variant.id, variant, variant.product, e)}
                        className={`absolute top-2 right-2 rounded-full p-2 shadow z-10 ${
                          isLiked 
                            ? "bg-white border-none" 
                            : "bg-black border border-black"
                        }`}
                      >
                        {isLiked ? (
                          <AiFillHeart className="w-5 h-5 text-teal-400" />
                        ) : (
                          <AiOutlineHeart className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>

                    <div className="p-2">
                      <h3 className="font-semibold line-clamp-2 text-ellipsis overflow-hidden">
                  {`${variant.brand} - ${variant.productName}`}
                </h3>
                      <div className="flex flex-col text-sm text-gray-600">
                  <p>
                    {t("price")}:{" "}
                    <span className="line-through text-red-400">
                            {formatPrice(variant.sizes[0].price[currency as 'usd' | 'uzs'])} {currency.toUpperCase()}
                          </span>
                  </p>
                  <p>
                    {t("discount")}:{" "}
                    <span className="font-bold text-green-600">
                            {formatPrice(variant.sizes[0].discount[currency as 'usd' | 'uzs'])} {currency.toUpperCase()}
                          </span>
                  </p>
                        <p className="flex items-center gap-2">
                          {t("color")}:{" "}
                    <span
                      className="w-4 h-4 rounded-full inline-block border border-gray-300"
                            style={{ 
                              backgroundColor: colors.find((c: Color) => c.id === variant.color)?.color || "#000000" 
                            }}
                            title={getLocalizedName(colors.find((c: Color) => c.id === variant.color)?.name || { uz: "Noma'lum", ru: "Неизвестно" })}
                          />
                  </p>
                </div>
              </div>
            </Link>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">{t("no_products_found")}</h3>
                <p className="text-gray-500">{t("try_different_filters")}</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {t("clear_filters")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAll;
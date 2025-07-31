import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import type { RootState } from "@/redux";
import { useMemo, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import Button from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const Last24HoursProducts = () => {
  const { t } = useTranslation();
  const products = useSelector((state: RootState) => state.products.data);
  const currency = useSelector((state: RootState) => state.currency.currency) as "usd" | "uzs";
  const lang = useSelector((state: RootState) => state.language.language);
  const colors = useSelector((state: RootState) => state.categories.colors);

  // State to track liked products
  const [likedProducts, setLikedProducts] = useState<{ [key: string]: boolean }>({});

  // Toggle like state for a product
  const toggleLike = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent Link navigation
    e.preventDefault(); // Prevent any default behavior
    setLikedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  // Format number with space as thousand separator
  const formatPrice = (price: number, isUZS: boolean = false) => {
    return price.toLocaleString(isUZS ? "uz-UZ" : "en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).replace(/,/g, isUZS ? " " : ",");
  };

  // Filter variants added in the last 24 hours, keeping the most recent and cheapest per product name, but show all colors
  const last24HourVariants = useMemo(() => {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Collect all variants within the last 24 hours
    const allVariants: {
      id: string;
      brand: string;
      name: string;
      nameUrl: string;
      images: string[];
      price: number;
      discount: number;
      createdAt: string;
      colorId: number;
    }[] = [];

    Object.values(products).forEach((brandProducts) => {
      brandProducts.forEach((product) => {
        product.variants.forEach((variant) => {
          const createdDate = new Date(variant.createdAt);
          if (createdDate > oneDayAgo) {
            allVariants.push({
              id: variant.id,
              brand: product.brand,
              name: product.name,
              nameUrl: variant.nameUrl,
              images: variant.images,
              price: variant.sizes[0]?.price?.[currency] || 0,
              discount: variant.sizes[0]?.discount?.[currency] || 0,
              createdAt: variant.createdAt,
              colorId: variant.color,
            });
          }
        });
      });
    });

    // Group by product name to select the most recent and cheapest variant
    const groupedByName: { [name: string]: typeof allVariants[0][] } = {};
    allVariants.forEach((variant) => {
      if (!groupedByName[variant.name]) {
        groupedByName[variant.name] = [];
      }
      groupedByName[variant.name].push(variant);
    });

    const filteredVariants = Object.values(groupedByName).map((variants) => {
      // Sort by createdAt (descending) and then by discount (ascending)
      return variants.sort((a, b) => {
        const dateComparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (dateComparison !== 0) return dateComparison;
        return a.discount - b.discount;
      })[0]; // Take the first (most recent and cheapest)
    });

    // Collect all unique colors for each product name
    const variantsWithAllColors = filteredVariants.map((variant) => {
      const sameNameVariants = allVariants.filter((v) => v.name === variant.name);
      const uniqueColorIds = Array.from(new Set(sameNameVariants.map((v) => v.colorId)));
      return { ...variant, colorIds: uniqueColorIds };
    });

    // Sort by createdAt descending and limit to 10 products
    return variantsWithAllColors
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  }, [products, currency]);

  if (!last24HourVariants.length) {
    return <div className="p-4 text-center text-gray-500">{t("No new products in last 24 hours")}</div>;
  }

  return (
    <section className="w-full px-4 py-8">
      <h2 className="text-xl font-bold mb-4 text-center">{t("New Arrivals (Last 24 Hours)")}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 auto-rows-fr">
        {last24HourVariants.map((item) => {
          return (
            <Link
              key={item.id}
              to={`/${lang}/${item.brand}/${item.nameUrl}/${item.id}`}
              className="border rounded-lg overflow-hidden shadow-sm relative"
            >
              <div className="relative">
                <Swiper
                  modules={[Pagination]}
                  pagination={{ clickable: true }}
                  loop={true}
                  className="w-full h-48"
                >
                  {item.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img src={image} alt={`${item.name} ${index + 1}`} className="w-full h-48 object-cover" />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <button
                  onClick={(e) => toggleLike(item.id, e)}
                  className={`absolute top-2 right-2 rounded-full p-2 shadow z-10 ${
                    likedProducts[item.id]
                      ? "bg-white border-none"
                      : "bg-black border border-black"
                  }`}
                >
                  {likedProducts[item.id] ? (
                    <AiFillHeart className="w-5 h-5 text-teal-400" aria-label="unlike" />
                  ) : (
                    <AiOutlineHeart className="w-5 h-5 text-white" aria-label="like" />
                  )}
                </button>
              </div>
              <div className="p-2">
                <h3 className="font-semibold line-clamp-2 text-ellipsis overflow-hidden">
                  {`${item.brand} - ${item.name}`}
                </h3>
                <div className="flex flex-col text-sm text-gray-600">
                  <p>
                    {t("Price")}:{" "}
                    <span className="line-through text-red-400">
                      {formatPrice(item.price, currency === "uzs")} {currency.toUpperCase()}
                    </span>
                  </p>
                  <p>
                    {t("Discount")}:{" "}
                    <span className="font-bold text-green-600">
                      {formatPrice(item.discount, currency === "uzs")} {currency.toUpperCase()}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    {t("Colors")}:{" "}
                    {item.colorIds.map((colorId) => {
                      const color = colors.find((c) => c.id === colorId);
                      return (
                        <span
                          key={colorId}
                          className={`w-4 h-4 rounded-full inline-block border ${
                            colorId === 1 ? "border-black" : "border-gray-300"
                          }`}
                          style={{ backgroundColor: color?.color || "#000000" }}
                          title={color?.name[lang as keyof typeof color.name] || t("Unknown color")}
                        ></span>
                      );
                    })}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="flex justify-center mt-4">
        <Link to={`/${lang}/products`}>
          <Button variant="outline" className="w-full max-w-xs">
            {t("details")}
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default Last24HoursProducts;
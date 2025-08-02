import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Price {
  usd: number;
  uzs: number;
}

interface LocalizedText {
  uz: string;
  ru: string;
}

interface ProductSize {
  size: number;
  inStock: boolean;
  sold: number;
  price: Price;
  discount: Price;
}

interface ProductVariant {
  id: string;
  nameUrl: string;
  color: number;
  gender: "Men" | "Women" | "Unisex";
  materials: number;
  year: number;
  description: LocalizedText;
  rating: number;
  season: number;
  poizonLink: string;
  images: string[];
  sizes: ProductSize[];
  inStock: boolean;
  inAdvancePayment: boolean;
  createdAt: string;
}

interface Product {
  brand: string;
  name: string;
  category: number;
  videoUrl: string;
  variants: ProductVariant[];
  relatedBrands: string[];
}

export interface ProductsData {
  [brand: string]: Product[];
}

interface ProductState {
  data: ProductsData;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  loading: false,
  error: null,
  data: {
    Nike: [
      {
        brand: "Nike",
        name: "Air Max 90",
        category: 1,
        videoUrl: "https://youtube.com/shorts/BOQO4hfuca4?feature=shared",
        variants: [
          {
            id: "nike-am90-red",
            nameUrl: "nike-air-max-90-red-men",
            color: 2,
            gender: "Men",
            materials: 1,
            year: 2024,
            description: {
              uz: "Qizil Air Max 90 klassik dizaynga ega, Air yostig'i tufayli yuqori qulaylik va sport hamda kundalik kiyim uchun mos.",
              ru: "Красные Air Max 90 с классическим дизайном, обеспечивают высокий комфорт благодаря подушке Air, подходят для спорта и повседневной носки.",
            },
            rating: 4.5,
            season: 3,
            poizonLink: "https://poizon.com/product1",
            images: [
              "https://i.postimg.cc/hvbgKNMj/1.jpg",
            ],
            sizes: [
              { size: 36, inStock: true, sold: 5, price: { usd: 115, uzs: 1450000 }, discount: { usd: 110, uzs: 1400000 } },
              { size: 37, inStock: true, sold: 8, price: { usd: 110, uzs: 1400000 }, discount: { usd: 105, uzs: 1350000 } },
              { size: 38, inStock: false, sold: 12, price: { usd: 120, uzs: 1500000 }, discount: { usd: 110, uzs: 1400000 } },
              { size: 39, inStock: true, sold: 15, price: { usd: 125, uzs: 1550000 }, discount: { usd: 115, uzs: 1450000 } },
              { size: 40, inStock: true, sold: 12, price: { usd: 130, uzs: 1600000 }, discount: { usd: 120, uzs: 1500000 } },
              { size: 41, inStock: false, sold: 8, price: { usd: 135, uzs: 1650000 }, discount: { usd: 125, uzs: 1550000 } },
              { size: 42, inStock: true, sold: 6, price: { usd: 140, uzs: 1700000 }, discount: { usd: 130, uzs: 1600000 } },
              { size: 43, inStock: true, sold: 4, price: { usd: 145, uzs: 1750000 }, discount: { usd: 135, uzs: 1650000 } },
              { size: 44, inStock: false, sold: 2, price: { usd: 150, uzs: 1800000 }, discount: { usd: 140, uzs: 1700000 } },
            ],
            inStock: true,
            inAdvancePayment: true,
            createdAt: "2025-08-02T12:00:00Z",
          },
          {
            id: "nike-am90-black",
            nameUrl: "nike-air-max-90-black-unisex",
            color: 1,
            gender: "Unisex",
            materials: 3,
            year: 2023,
            description: {
              uz: "Qora Air Max 90 zamonaviy dizayni va Air yostig‘i bilan har qanday vaziyatda qulaylik ta’minlaydi.",
              ru: "Черные Air Max 90 с современным дизайном и подушкой Air обеспечивают комфорт в любой ситуации.",
            },
            rating: 4.7,
            season: 5,
            poizonLink: "https://poizon.com/product2",
            images: [
              "https://i.postimg.cc/C5WDVBPY/2.jpg",
              "https://i.postimg.cc/85zLdVf8/21.jpg",
              "https://i.postimg.cc/fLqmBgYV/22.jpg",
              "https://i.postimg.cc/7LD36zxZ/24.jpg"
            ],
            sizes: [
              { size: 36, inStock: true, sold: 10, price: { usd: 120, uzs: 1500000 }, discount: { usd: 115, uzs: 1450000 } },
              { size: 37, inStock: true, sold: 7, price: { usd: 125, uzs: 1550000 }, discount: { usd: 120, uzs: 1500000 } },
              { size: 38, inStock: false, sold: 15, price: { usd: 130, uzs: 1600000 }, discount: { usd: 125, uzs: 1550000 } },
              { size: 39, inStock: true, sold: 12, price: { usd: 135, uzs: 1650000 }, discount: { usd: 130, uzs: 1600000 } },
              { size: 40, inStock: true, sold: 8, price: { usd: 140, uzs: 1700000 }, discount: { usd: 135, uzs: 1650000 } },
            ],
            inStock: true,
            inAdvancePayment: false,
            createdAt: "2025-08-02T10:00:00Z",
          },
          {
            id: "nike-am90-white",
            nameUrl: "nike-air-max-90-white-women",
            color: 3,
            gender: "Women",
            materials: 2,
            year: 2024,
            description: {
              uz: "Oq Air Max 90 ayollar uchun maxsus dizayn, yengil va qulay, yozgi kiyimlar bilan ajoyib uyg‘unlashadi.",
              ru: "Белые Air Max 90 для женщин, легкие и удобные, идеально сочетаются с летней одеждой.",
            },
            rating: 4.8,
            season: 3,
            poizonLink: "https://poizon.com/product3",
            images: [
              "https://i.postimg.cc/131CGf9L/31.jpg",
              "https://i.postimg.cc/ydRn3HMV/32.jpg",
              "https://i.postimg.cc/m2jjHV5F/33.jpg",
              "https://i.postimg.cc/vHYLbfZ8/34.jpg"
            ],
            sizes: [
              { size: 36, inStock: true, sold: 6, price: { usd: 110, uzs: 1400000 }, discount: { usd: 105, uzs: 1350000 } },
              { size: 37, inStock: false, sold: 9, price: { usd: 115, uzs: 1450000 }, discount: { usd: 110, uzs: 1400000 } },
              { size: 38, inStock: true, sold: 11, price: { usd: 120, uzs: 1500000 }, discount: { usd: 115, uzs: 1450000 } },
            ],
            inStock: true,
            inAdvancePayment: true,
            createdAt: "2025-08-02T15:00:00Z",
          },
        ],
        relatedBrands: ["Jordan", "Adidas"],
      },
    ],
    Yeezy: [
      {
        brand: "Yeezy",
        name: "Yeezy Boost 350 V2 Mono Ice",
        category: 2,
        videoUrl: "https://youtube.com/shorts/abc123",
        variants: [
          {
            id: "yeezy-350v2-monoice",
            nameUrl: "yeezy-boost-350-v2-mono-ice-men",
            color: 1,
            gender: "Men",
            materials: 2,
            year: 2024,
            description: {
              uz: "Yengil va qulay Yeezy Boost 350 V2 Mono Ice yozgi fasl uchun ideal tanlov.",
              ru: "Легкие и удобные Yeezy Boost 350 V2 Mono Ice идеально подходят для лета.",
            },
            rating: 4.7,
            season: 1,
            poizonLink: "https://poizon.com/yeezy1",
            images: [
              "https://i.postimg.cc/k5bWfyfs/41.jpg",
              "https://i.postimg.cc/rmyFKV04/42.jpg",
              "https://i.postimg.cc/hPVjy5Bf/43.jpg",
              "https://i.postimg.cc/523t1QjJ/44.jpg",
            ],
            sizes: [
              { size: 40, inStock: true, sold: 10, price: { usd: 220, uzs: 2700000 }, discount: { usd: 200, uzs: 2500000 } },
              { size: 41, inStock: true, sold: 7, price: { usd: 225, uzs: 2750000 }, discount: { usd: 210, uzs: 2600000 } },
              { size: 42, inStock: false, sold: 12, price: { usd: 230, uzs: 2800000 }, discount: { usd: 215, uzs: 2650000 } },
            ],
            inStock: true,
            inAdvancePayment: true,
            createdAt: "2025-08-02T10:00:00Z",
          },
        ],
        relatedBrands: ["Nike", "Adidas"],
      },
      {
        brand: "Yeezy",
        name: "Yeezy Foam Runner Sand",
        category: 2,
        videoUrl: "https://youtube.com/shorts/foamrunner",
        variants: [
          {
            id: "yeezy-foam-sand",
            nameUrl: "yeezy-foam-runner-sand-men",
            color: 3,
            gender: "Men",
            materials: 1,
            year: 2024,
            description: {
              uz: "Yumshoq materialdan tayyorlangan, yengil va nafas oluvchi Yeezy Foam Runner.",
            ru: "Изготовлены из мягкого материала, Yeezy Foam Runner легкие и дышащие.",
            },
            rating: 4.3,
            season: 3,
            poizonLink: "https://poizon.com/yeezy2",
            images: [
              "https://i.postimg.cc/523t1QjJ/44.jpg",
            ],
            sizes: [
              { size: 39, inStock: true, sold: 8, price: { usd: 120, uzs: 1500000 }, discount: { usd: 110, uzs: 1400000 } },
              { size: 40, inStock: true, sold: 5, price: { usd: 125, uzs: 1550000 }, discount: { usd: 115, uzs: 1450000 } },
              { size: 41, inStock: false, sold: 11, price: { usd: 130, uzs: 1600000 }, discount: { usd: 120, uzs: 1500000 } },
            ],
            inStock: true,
            inAdvancePayment: true,
            createdAt: "2025-08-02T11:00:00Z",
          },
        ],
        relatedBrands: ["Prada", "Nike"],
      },
      {
        brand: "Yeezy",
        name: "Yeezy Slide Onyx",
        category: 2,
        videoUrl: "https://youtube.com/shorts/slideonyx",
        variants: [
          {
            id: "yeezy-slide-onyxs",
            nameUrl: "yeezy-slide-onyx-unisex",
            color: 4,
            gender: "Unisex",
            materials: 1,
            year: 2023,
            description: {
              uz: "Yeezy Slide Onyx minimalistik dizayn va kundalik qulaylik uchun yaratilgan.",
              ru: "Yeezy Slide Onyx созданы для повседневного комфорта и имеют минималистичный дизайн.",
            },
            rating: 4.2,
            season: 4,
            poizonLink: "https://poizon.com/yeezy3",
            images: [
              "https://i.postimg.cc/rmyFKV04/42.jpg",
            ],
            sizes: [
              { size: 38, inStock: true, sold: 6, price: { usd: 100, uzs: 1300000 }, discount: { usd: 90, uzs: 1200000 } },
              { size: 39, inStock: true, sold: 9, price: { usd: 105, uzs: 1350000 }, discount: { usd: 95, uzs: 1250000 } },
              { size: 40, inStock: false, sold: 10, price: { usd: 110, uzs: 1400000 }, discount: { usd: 100, uzs: 1300000 } },
            ],
            inStock: true,
            inAdvancePayment: true,
            createdAt: "2025-08-02T12:00:00Z",
          },
          {
            id: "yeezy-slide-onyx",
            nameUrl: "yeezy-slide-onyx-unisex",
            color: 5,
            gender: "Unisex",
            materials: 1,
            year: 2023,
            description: {
              uz: "Yeezy Slide Onyx minimalistik dizayn va kundalik qulaylik uchun yaratilgan.",
              ru: "Yeezy Slide Onyx созданы для повседневного комфорта и имеют минималистичный дизайн.",
            },
            rating: 4.2,
            season: 4,
            poizonLink: "https://poizon.com/yeezy3",
            images: [
              "https://i.postimg.cc/rmyFKV04/42.jpg",
            ],
            sizes: [
              { size: 38, inStock: true, sold: 6, price: { usd: 100, uzs: 1300000 }, discount: { usd: 90, uzs: 1200000 } },
              { size: 39, inStock: true, sold: 9, price: { usd: 105, uzs: 1350000 }, discount: { usd: 95, uzs: 1250000 } },
              { size: 40, inStock: false, sold: 10, price: { usd: 110, uzs: 1400000 }, discount: { usd: 100, uzs: 1300000 } },
            ],
            inStock: true,
            inAdvancePayment: true,
            createdAt: "2025-08-02T12:00:00Z",
          },
        ],
        relatedBrands: ["Adidas", "Nike"],
      },
    ],
  },
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setProducts: (state, action: PayloadAction<ProductsData>) => {
      state.data = action.payload;
    },
    updateDiscount: (
      state,
      action: PayloadAction<{
        brand: string;
        variantId: string;
        size: number;
        discount: Price;
      }>
    ) => {
      const { brand, variantId, size, discount } = action.payload;
      const brandProducts = state.data[brand];
      if (!brandProducts) return;

      for (const product of brandProducts) {
        const variant = product.variants.find((v) => v.id === variantId);
        if (!variant) continue;

        const targetSize = variant.sizes.find((s) => s.size === size);
        if (targetSize) {
          targetSize.discount = discount;
        }
      }
    },
  },
});

export const { setLoading, setError, setProducts, updateDiscount } = productSlice.actions;
export default productSlice.reducer;
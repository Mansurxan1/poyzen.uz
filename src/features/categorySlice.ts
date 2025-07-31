import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Interfeyslar
interface Name {
  uz: string;
  ru: string;
}

export interface Category {
  id: number;
  name: Name;
}

export interface Material {
  id: number;
  name: Name;
}

export interface Color {
  id: number;
  name: Name;
  color: string;
}

export interface Season {
  id: number;
  name: Name;
  color: string;
}

// State interfeysi
interface CategoryState {
  categories: Category[];
  materials: Material[];
  colors: Color[];
  season: Season[];
  loading: boolean;
  error: string | null;
}

// Boshlang‘ich holat
const initialState: CategoryState = {
  categories: [
    { id: 1, name: { uz: "Krossovkalar", ru: "Кроссовки" } },
    { id: 2, name: { uz: "Kundalik poyabzal", ru: "Повседневная обувь" } },
    { id: 3, name: { uz: "Sport oyoq kiyim", ru: "Спортивная обувь" } },
    { id: 4, name: { uz: "Klassik poyabzal", ru: "Классическая обувь" } },
    { id: 5, name: { uz: "Yozgi shippaklar", ru: "Летние тапочки" } },
    { id: 6, name: { uz: "Qishki etiklar", ru: "Зимние сапоги" } },
    { id: 7, name: { uz: "Tuflilar", ru: "Туфли" } },
    { id: 8, name: { uz: "Ofis uchun poyabzal", ru: "Обувь для офиса" } },
    { id: 9, name: { uz: "Yurish uchun oyoq kiyim", ru: "Обувь для прогулок" } },
    { id: 10, name: { uz: "Baland poshnali oyoq kiyim", ru: "Обувь на высоком каблуке" } },
  ],
  materials: [
    { id: 1, name: { uz: "Teridan", ru: "Кожа" } },
    { id: 2, name: { uz: "Sun’iy teridan", ru: "Искусственная кожа" } },
    { id: 3, name: { uz: "To‘qima matodan", ru: "Ткань" } },
    { id: 4, name: { uz: "Mesh matodan", ru: "Сетчатый материал" } },
    { id: 5, name: { uz: "Zamsh (mokasin)", ru: "Замша" } },
    { id: 6, name: { uz: "Kauchuk taglik", ru: "Резиновая подошва" } },
    { id: 7, name: { uz: "Plastik material", ru: "Пластик" } },
    { id: 8, name: { uz: "Yog‘och taglik", ru: "Деревянная подошва" } },
    { id: 9, name: { uz: "Junli ichlik", ru: "Мех внутри" } },
    { id: 10, name: { uz: "Naylon (sport poyabzal)", ru: "Нейлон" } },
  ],
  colors: [
    { id: 1, name: { uz: "Oq", ru: "Белый" }, color: "#fff" },
    { id: 2, name: { uz: "Qora", ru: "Черный" }, color: "#000000" },
    { id: 3, name: { uz: "Qizil", ru: "Красный" }, color: "#FF0000" },
    { id: 4, name: { uz: "Ko‘k", ru: "Синий" }, color: "#0000FF" },
    { id: 5, name: { uz: "Yashil", ru: "Зеленый" }, color: "#00FF00" },
  ],
  season: [
    { id: 1, name: { uz: "Bahor", ru: "Весна" }, color: "#E6FFCC" },
    { id: 2, name: { uz: "Yoz", ru: "Лето" }, color: "#FFFACD" },
    { id: 3, name: { uz: "Kuz", ru: "Осень" }, color: "#FFDAB9" },
    { id: 4, name: { uz: "Qish", ru: "Зима" }, color: "#E0F7FA" },
    { id: 5, name: { uz: "Barcha fasllar", ru: "Всесезонный" }, color: "#000" },
  ],
  loading: false,
  error: null,
};

// Slice yaratish
const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setMaterials: (state, action: PayloadAction<Material[]>) => {
      state.materials = action.payload;
    },
    setColors: (state, action: PayloadAction<Color[]>) => {
      state.colors = action.payload;
    },
    setSeasons: (state, action: PayloadAction<Season[]>) => {
      state.season = action.payload;
    },
  },
});

// Eksporlar
export const {
  setLoading,
  setError,
  setCategories,
  setMaterials,
  setColors,
  setSeasons,
} = categorySlice.actions;

export default categorySlice.reducer;

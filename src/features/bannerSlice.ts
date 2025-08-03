import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface BannerItem {
  id: string
  image: {
    uz: string
    ru: string
  }
  url: string
}

const initialState: BannerItem[] = [
  {
    id: 'nike-am90-red',
    image: {
        uz: "https://cdn.pixabay.com/photo/2020/04/09/08/38/nike-5020363_1280.jpg",
        ru: "https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg",
    },
    url: "/products"
  },
  {
    id: 'adidas-yeezy-350',
    image: {
        uz: "https://brand.assets.adidas.com/image/upload/f_auto,q_auto,w_800/shoes_women_tcc_d_234be42564.jpg",
        ru: "https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg",
    },
    url: "/brand"
  },
  {
    id: 'adidas-yeezy-500',
    image: {
        uz: "https://cdn.pixabay.com/photo/2023/05/03/22/43/tennis-7968714_1280.png",
        ru: "https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg",
    },
    url: ""
  },
]

const bannerSlice = createSlice({
  name: 'banner',
  initialState,
  reducers: {
    addBanner: (state, action: PayloadAction<BannerItem>) => {
      state.push(action.payload)
    },

    removeBanner: (state, action: PayloadAction<string>) => {
      return state.filter(banner => banner.id !== action.payload)
    },


    setBanners: (_, action: PayloadAction<BannerItem[]>) => {
      return action.payload
    },
  },
})

export const { addBanner, removeBanner, setBanners } = bannerSlice.actions
export default bannerSlice.reducer

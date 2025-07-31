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
        uz: "https://brand.assets.adidas.com/image/upload/f_auto,q_auto,w_800/shoes_women_tcc_d_234be42564.jpg",
        ru: "https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg",
    },
    url: "/contact"
  },
  {
    id: 'adidas-yeezy-350',
    image: {
        uz: "https://brand.assets.adidas.com/image/upload/f_auto,q_auto,w_800/shoes_women_tcc_d_234be42564.jpg",
        ru: "https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg",
    },
    url: "/contact"
  },
  {
    id: 'adidas-yeezy-500',
    image: {
        uz: "https://brand.assets.adidas.com/image/upload/f_auto,q_auto,w_800/shoes_women_tcc_d_234be42564.jpg",
        ru: "https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg",
    },
    url: "contact"
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

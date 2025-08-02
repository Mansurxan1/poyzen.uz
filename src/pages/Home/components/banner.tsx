import { useSelector } from "react-redux"
import type { RootState } from "@/redux"
import { useNavigate } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay } from "swiper/modules"
// @ts-expect-error - Swiper CSS module not found in types
import "swiper/css"
// @ts-expect-error - Swiper CSS module not found in types
import "swiper/css/pagination"
// @ts-expect-error - Swiper CSS module not found in types
import "swiper/css/autoplay"

const Banner = () => {
  const navigate = useNavigate()

  // Redux'dan til va banner ma'lumotlarini olish
  const language = useSelector((state: RootState) => state.language.language) as "uz" | "ru"
  const banners = useSelector((state: RootState) => state.banner)

  // Banner bosilganda linkga yo'naltirish
  const handleBannerClick = (url: string) => {
    if (!url) return
    const fullUrl = `/${language}${url.startsWith("/") ? "" : "/"}${url}`
    navigate(fullUrl)
  }

  return (
    <section className="relative w-full py-8 overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          centeredSlides={false}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          className="w-full h-[350px] md:h-[450px] lg:h-[550px] rounded-2xl shadow-2xl"
        >
          {banners?.map((banner) => (
            <SwiperSlide key={banner.id}>
              <div
                onClick={() => handleBannerClick(banner.url)}
                className="w-full h-full cursor-pointer overflow-hidden rounded-2xl group relative"
              >
                <img
                  src={banner.image?.[language] || "/placeholder.svg"}
                  alt={`Banner - ${banner.id}`}
                  loading="lazy"
                  className="w-full h-full object-cover rounded-2xl transition-all duration-500 group-hover:scale-105"
                />
                
                {/* Shadow overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Click indicator */}
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default Banner

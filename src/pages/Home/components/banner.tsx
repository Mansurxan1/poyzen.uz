// import { useSelector } from 'react-redux';
// import type { RootState } from '@/redux';
// import { useTranslation } from 'react-i18next';
// import { useEffect, useState } from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay } from 'swiper/modules';
// // @ts-expect-error - Swiper CSS import
// import 'swiper/css/bundle';
// import { useNavigate } from 'react-router-dom';

// const Banner = () => {
//   const { i18n } = useTranslation();
//   const lang = useSelector((state: RootState) => state.language.language) as 'uz' | 'ru';
//   const banners = useSelector((state: RootState) => state.banner);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (i18n.language !== lang) {
//       i18n.changeLanguage(lang);
//     }
//   }, [i18n, lang]);

//   const handleBannerClick = (url: string) => {
//     const fullUrl = `/${lang}${url.startsWith('/') ? '' : '/'}${url}`;
//     navigate(fullUrl);
//   };

//   return (
//     <div className="w-full overflow-hidden">
//       <Swiper
//         modules={[Autoplay]}
//         autoplay={{ delay: 5000, disableOnInteraction: false }}
//         spaceBetween={10}
//         slidesPerView={1}
//         onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)} // bu to‘g‘ri ishlaydi
//         className="w-full"
//       >
//         {banners.map((banner) => (
//           <SwiperSlide key={banner.id}>
//             <div
//               onClick={() => handleBannerClick(banner.url)}
//               className="w-full h-[350px] relative rounded-2xl cursor-pointer"
//             >
//               <img
//                 src={banner.image[lang]}
//                 alt={banner.id}
//                 className="w-full h-full object-cover rounded-2xl"
//               />
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>

//       <div className="flex justify-center mt-2 gap-1">
//         {banners.map((_, i) => (
//           <span
//             key={i}
//             className={`w-2 h-2 rounded-full transition-colors duration-300 ${
//               currentIndex === i ? 'bg-teal-500' : 'bg-teal-300'
//             }`}
//           ></span>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Banner;


import { useSelector } from 'react-redux'
import type { RootState } from '@/redux'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
  const { i18n } = useTranslation()
  const lang = useSelector((state: RootState) => state.language.language) as 'uz' | 'ru'
  const banners = useSelector((state: RootState) => state.banner)
  const [currentIndex, setCurrentIndex] = useState(0)
  const navigate = useNavigate()

  // Language synchronization is now handled by Redux and i18n initialization

  // banner har 5 soniyada almashsin
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [banners.length])

  const handleBannerClick = (url: string) => {
    const fullUrl = `/${lang}${url.startsWith('/') ? '' : '/'}${url}`
    navigate(fullUrl)
  }

  return (
    <div className="relative w-full h-[350px] overflow-hidden rounded-2xl">
      {banners.map((banner, i) => (
        <img
          key={banner.id}
          src={banner.image[lang]}
          alt={banner.id}
          onClick={() => handleBannerClick(banner.url)}
          className={`absolute inset-0 w-full h-full object-cover rounded-2xl cursor-pointer transition-opacity duration-700 ${
            currentIndex === i ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        />
      ))}

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {banners.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              currentIndex === i ? 'bg-teal-500' : 'bg-teal-300'
            }`}
          ></span>
        ))}
      </div>
    </div>
  )
}

export default Banner

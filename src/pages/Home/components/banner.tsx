"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/redux"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Banner = () => {
  const lang = useSelector((state: RootState) => state.language.language) as "uz" | "ru"
  const banners = useSelector((state: RootState) => state.banner)
  const [currentIndex, setCurrentIndex] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [banners.length])

  const handleBannerClick = (url: string) => {
    const fullUrl = `/${lang}${url.startsWith("/") ? "" : "/"}${url}`
    navigate(fullUrl)
  }

  return (
    <div className="relative w-full h-[350px] overflow-hidden rounded-2xl">
      {banners.map((banner, i) => (
        <img
          key={banner.id}
          src={banner.image[lang] || "/placeholder.svg"}
          alt={banner.id}
          onClick={() => handleBannerClick(banner.url)}
          className={`absolute inset-0 w-full h-full object-cover rounded-2xl cursor-pointer transition-opacity duration-700 ${
            currentIndex === i ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        />
      ))}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {banners.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              currentIndex === i ? "bg-teal-500" : "bg-teal-300"
            }`}
          ></span>
        ))}
      </div>
    </div>
  )
}

export default Banner

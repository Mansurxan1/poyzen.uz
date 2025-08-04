import { useSelector } from "react-redux"
import type { RootState } from "@/redux"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import Banner from "./components/banner"
import Last24HoursProducts from "./components/Last24Hours"

import jordan from "@/assets/jordan.svg"

const brandLogos = [
  { id: "nike", name: "Nike", image: "https://1000logos.net/wp-content/uploads/2017/03/Nike-Logo.png" },
  { id: "adidas", name: "Adidas", image: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" },
  { id: "jordan", name: "Jordan", image: jordan },
  { id: "puma", name: "Puma", image: "https://upload.wikimedia.org/wikipedia/ru/b/b4/Puma_logo.svg" },
  { id: "reebok", name: "Reebok", image: "https://upload.wikimedia.org/wikipedia/commons/5/53/Reebok_2019_logo.svg" },
  { id: "skechers", name: "Skechers", image: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Skechers.svg" },
  { id: "fila", name: "Fila", image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Fila_logo.svg" },
  { id: "vans", name: "Vans", image: "https://1000logos.net/wp-content/uploads/2017/06/Vans-logo.png" },
  { id: "on", name: "On", image: "https://upload.wikimedia.org/wikipedia/commons/9/92/On-cloud-logo-white-background.svg" },
  { id: "peak", name: "Peak", image: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Peak_Logo.svg" },
  { id: "balenciaga", name: "Balenciaga", image: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Balenciaga_Logo.svg" },
]

const Home = () => {
  const { t } = useTranslation()
  const language = useSelector((state: RootState) => state.language.language)
  const [displayCount, setDisplayCount] = useState(11) // Default for grid-cols-3

  useEffect(() => {
    const updateDisplayCount = () => {
      const width = window.innerWidth
      if (width >= 1024) {
        setDisplayCount(brandLogos.length)
      } else if (width >= 768) {
        setDisplayCount(11)
      } else if (width >= 640) {
        setDisplayCount(9)
      } else {
        setDisplayCount(11)
      }
    }

    updateDisplayCount()
    window.addEventListener("resize", updateDisplayCount)
    return () => window.removeEventListener("resize", updateDisplayCount)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <main className="flex flex-col items-center">
      <Banner />
      <section className="w-full py-4 max-w-7xl mx-auto px-4">
        <h2 className="text-xl uppercase font-bold mb-6 text-blue-500 text-center">
          {t("famousBrand")}
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-5 place-items-center">
          {brandLogos.slice(0, displayCount).map((brand) => (
            <Link
              key={brand.id}
              to={`/${language}/brand/${brand.id}`}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-gray-50 hover:scale-105 transition-all duration-300 border border-gray-200"
              aria-label={`Visit ${brand.name} brand page`}
            >
              <img
                src={brand.image}
                alt={brand.name}
                className="w-30 h-10 md:w-32 md:h-16 object-contain mb-3"
                loading="lazy"
                onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
              />
            </Link>
          ))}
          <Link
            to={`/${language}/brands`}
            className="flex items-center uppercase justify-center px-6 py-8 md:px-10 md:py-11 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transition-all duration-300 border border-blue-600"
            aria-label={t("allBrand")}
          >
            <span className="text-sm font-bold text-center">
              {t("allBrand")}
            </span>
          </Link>
        </div>
      </section>
      <section className="w-full py-4 max-w-7xl mx-auto">
        <Last24HoursProducts />
      </section>
    </main>
  )
}

export default Home
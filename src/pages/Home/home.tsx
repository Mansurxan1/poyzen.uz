import { useSelector } from "react-redux"
import type { RootState } from "@/redux"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import Banner from "./components/banner"
import Last24HoursProducts from "./components/Last24Hours"

import newbalance from "@/assets/newbalance.svg"
import jordan from "@/assets/jordan.svg"

const brandLogos = [
  { id: "nike", name: "Nike", image: "https://1000logos.net/wp-content/uploads/2017/03/Nike-Logo.png" },
  { id: "adidas", name: "Adidas", image: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" },
  { id: "jordan", name: "Jordan", image: jordan },
  { id: "puma", name: "Puma", image: "https://upload.wikimedia.org/wikipedia/ru/b/b4/Puma_logo.svg" },
  { id: "reebok", name: "Reebok", image: "https://upload.wikimedia.org/wikipedia/commons/5/53/Reebok_2019_logo.svg" },
  { id: "new-balance", name: "New Balance", image: newbalance },
  { id: "skechers", name: "Skechers", image: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Skechers.svg" },
  { id: "fila", name: "Fila", image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Fila_logo.svg" },
  { id: "vans", name: "Vans", image: "https://1000logos.net/wp-content/uploads/2017/06/Vans-logo.png" },
  { id: "underarmour", name: "Under Armour", image: "https://upload.wikimedia.org/wikipedia/commons/4/44/Under_armour_logo.svg" },
  { id: "on", name: "On", image: "https://upload.wikimedia.org/wikipedia/commons/9/92/On-cloud-logo-white-background.svg" },
  { id: "peak", name: "Peak", image: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Peak_Logo.svg" },
  { id: "hugoboss", name: "Hugo Boss", image: "https://upload.wikimedia.org/wikipedia/commons/7/73/Hugo-Boss-Logo.svg" },
  { id: "balenciaga", name: "Balenciaga", image: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Balenciaga_Logo.svg" },
]

const Home = () => {
  const { t } = useTranslation()
  const language = useSelector((state: RootState) => state.language.language)
  const [displayCount, setDisplayCount] = useState(14)

  useEffect(() => {
    const updateDisplayCount = () => {
      const width = window.innerWidth
      if (width >= 640 && width < 768) {
        setDisplayCount(11)
      }else {
        setDisplayCount(16)
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
      <section className="w-full py-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {t("famousBrand")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 place-items-center">
          {brandLogos.slice(0, displayCount).map((brand) => (
            <Link
              key={brand.id}
              to={`/${language}/brand/${brand.id}`}
              className="hover:scale-105 transition-transform duration-300 flex flex-col items-center"
            >
              <img
                src={brand.image}
                alt={brand.name}
                className="w-30 h-10 md:w-35 md:h-16 object-contain mb-2"
              />
              <span className="text-sm font-medium text-center">
                {brand.name}
              </span>
            </Link>
          ))}
          <Link
            to={`/${language}/brands`}
            className="flex items-center justify-center w-32 h-16 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            {t("allBrand")}
          </Link>
        </div>
      </section>
      <section className="w-full py-8 max-w-7xl mx-auto">
        <Last24HoursProducts />
      </section>
    </main>
  )
}

export default Home

import { useSelector } from "react-redux"
import type { RootState } from "@/redux"
import Banner from "./components/banner"
import { Link } from "react-router-dom"
import Last24HoursProducts from "./components/Last24Hours"

const brandLogos = [
  { id: "nike", name: "Nike", image: "https://1000logos.net/wp-content/uploads/2017/03/Nike-Logo.png" },
  { id: "adidas", name: "Adidas", image: "https://1000logos.net/wp-content/uploads/2017/05/Adidas-logo.png" },
  { id: "puma", name: "Puma", image: "https://1000logos.net/wp-content/uploads/2017/05/Puma-Logo.png" },
  { id: "reebok", name: "Reebok", image: "https://1000logos.net/wp-content/uploads/2021/05/Reebok-logo.png" },
  {
    id: "new-balance",
    name: "New Balance",
    image: "https://1000logos.net/wp-content/uploads/2017/05/New-Balance-Logo.png",
  },
  { id: "converse", name: "Converse", image: "https://1000logos.net/wp-content/uploads/2017/03/Converse-logo.png" },
  { id: "asics", name: "Asics", image: "https://1000logos.net/wp-content/uploads/2017/06/Asics-logo.png" },
  { id: "vans", name: "Vans", image: "https://1000logos.net/wp-content/uploads/2017/06/Vans-logo.png" },
  { id: "fila", name: "Fila", image: "https://1000logos.net/wp-content/uploads/2017/05/Fila-logo.png" },
]

const Home = () => {
  const language = useSelector((state: RootState) => state.language.language)

  return (
    <main className="flex max-w-7xl mx-auto flex-col items-center">
      <Banner />
      <section className="w-full px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Mashhur Sneakers Brendlari</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 place-items-center">
          {brandLogos.slice(0, 9).map((brand) => (
            <Link
              key={brand.id}
              to={`/${language}/brand/${brand.id}`}
              className="hover:scale-105 transition-transform duration-300"
            >
              <img src={brand.image || "/placeholder.svg"} alt={brand.name} className="w-32 h-16 object-contain" />
            </Link>
          ))}
          <Link
            to={`/${language}/brands`}
            className="flex items-center justify-center w-32 h-16 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Batafsil
          </Link>
        </div>
      </section>
      <Last24HoursProducts />
    </main>
  )
}

export default Home

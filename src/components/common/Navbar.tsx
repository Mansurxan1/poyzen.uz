import React from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { FaHeart, FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch } from "react-icons/fa"
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/redux"
import { setCurrency } from "@/features/currencySlice"
import { setLanguage } from "@/features/languageSlice"
import SearchBar from "@/components/common/SearchBar"
import Dropdown from "@/components/ui/dropdown" 
import Button from "@/components/ui/button" 

const Navbar: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch: AppDispatch = useDispatch()
  const currentLang = useSelector((state: RootState) => state.language.language)
  const currentCurrency = useSelector((state: RootState) => state.currency.currency)
  const likedProducts = useSelector((state: RootState) => state.likes.likedProducts)
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const likeCount = likedProducts.length
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)

  const navLinks = [
    { to: "/", label: t("home") },
    { to: "/brand", label: t("brands") },
    { to: "/products", label: t("products") },
    { to: "/contact", label: t("contact") },
  ]

  const languageOptions = [
    { value: "uz", label: "UZB" },
    { value: "ru", label: "РУС" },
  ]

  const currencyOptions = [
    { value: "usd", label: "USD" },
    { value: "uzs", label: "UZS" },
  ]

  const toggleSearch = () => setIsSearchOpen((prev) => !prev)
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev)

  const handleCurrencyChange = (val: string) => {
    dispatch(setCurrency(val))
  }

  const handleLanguageChange = (newLangValue: string) => {
    if (currentLang === newLangValue) return
    dispatch(setLanguage(newLangValue))
    const currentPath = window.location.pathname
    const pathSegments = currentPath.split("/").filter(Boolean)
    const knownLanguages = languageOptions.map((opt) => opt.value)
    let targetPath: string
    if (pathSegments.length > 0 && knownLanguages.includes(pathSegments[0])) {
      pathSegments[0] = newLangValue
      targetPath = `/${pathSegments.join("/")}`
    } else {
      targetPath = `/${newLangValue}/${pathSegments.join("/")}`
    }
    navigate(targetPath)
  }

  const handleLikesClick = () => {
    navigate(`/${currentLang}/likes`)
    setIsMobileMenuOpen(false) // Menyu ochiq bo'lsa, navigatsiyadan keyin yopish
  }

  const handleCartClick = () => {
    navigate(`/${currentLang}/cart`)
    setIsMobileMenuOpen(false) // Menyu ochiq bo'lsa, navigatsiyadan keyin yopish
  }

  const handleProfileClick = () => {
    window.open("https://www.google.com", "_blank") // Google sahifasiga yo'naltirish
    setIsMobileMenuOpen(false) // Menyu ochiq bo'lsa, navigatsiyadan keyin yopish
  }

  return (
    <div className="sticky top-0 z-50">
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link to={`/${currentLang}`} className="flex items-center group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="ml-3 text-gray-900 font-bold text-xl hidden sm:block group-hover:text-blue-600 transition-colors duration-200">
                Poyzen
              </span>
            </Link>
            <div className="hidden lg:flex flex-1 justify-center mx-8">
              <div className="flex items-center space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={`/${currentLang}${link.to}`}
                    className={
                      "text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group" +
                      (location.pathname === `/${currentLang}${link.to}` ||
                      (link.to === "/" && location.pathname === `/${currentLang}`) // Home sahifasi uchun ham aktiv holatni tekshirish
                        ? " bg-blue-100 text-blue-700"
                        : "")
                    }
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button onClick={toggleSearch} variant="ghost" size="icon">
                <FaSearch className="h-5 w-5" />
              </Button>
              <Button onClick={handleLikesClick} variant="ghost" size="icon" className="relative">
                <FaHeart className="h-5 w-5" />
                {likeCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
                    {likeCount > 99 ? "99+" : likeCount}
                  </span>
                )}
              </Button>
              <Button onClick={handleCartClick} variant="ghost" size="icon" className="relative">
                <FaShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Button>
              {/* Currency and Language dropdowns for desktop/tablet */}
              <div className="hidden lg:flex items-center gap-2">
                <Dropdown
                  options={currencyOptions}
                  placeholder={currentCurrency.toUpperCase()}
                  onSelect={handleCurrencyChange}
                  initialValue={currentCurrency}
                  className="w-20 sm:w-24 md:w-32"
                />
                <Dropdown
                  options={languageOptions}
                  placeholder={t("language")}
                  onSelect={handleLanguageChange}
                  initialValue={currentLang}
                  className="w-20 sm:w-24 md:w-32"
                />
                <Button onClick={handleProfileClick} variant="outline" size="icon" className="bg-transparent">
                  <FaUser className="h-5 w-5" />
                </Button>
              </div>
              {/* Hamburger menu button for mobile */}
              <Button onClick={toggleMobileMenu} variant="ghost" size="icon" className="lg:hidden">
                {isMobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
        {/* Custom Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/50 bg-opacity-50 lg:hidden transition-opacity duration-300 ease-in-out"
            onClick={toggleMobileMenu} // Overlay bosilganda menyuni yopish
          >
            <div
              className={`absolute top-0 left-0 w-full sm:max-w-xs h-full bg-white shadow-lg transition-transform duration-300 ease-in-out transform ${
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full" // Chapdan ochilish/yopilish animatsiyasi
              }`}
              onClick={(e) => e.stopPropagation()} // Menyuning ichiga bosilganda yopilmasligi uchun
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">{t("menu")}</h2>
                <Button onClick={toggleMobileMenu} variant="ghost" size="icon">
                  <FaTimes className="h-6 w-6 text-gray-600" />
                </Button>
              </div>
              <div className="px-4 py-3 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={`/${currentLang}${link.to}`}
                    onClick={toggleMobileMenu} // Havola bosilganda menyuni yopish
                    className={
                      "block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-base font-medium" +
                      (location.pathname === `/${currentLang}${link.to}` ||
                      (link.to === "/" && location.pathname === `/${currentLang}`)
                        ? " bg-blue-100 text-blue-700"
                        : "")
                    }
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <Dropdown
                    options={currencyOptions}
                    placeholder={currentCurrency.toUpperCase()}
                    onSelect={handleCurrencyChange}
                    initialValue={currentCurrency}
                    className="w-full"
                  />
                  <Dropdown
                    options={languageOptions}
                    placeholder={t("language")}
                    onSelect={handleLanguageChange}
                    initialValue={currentLang}
                    className="w-full"
                  />
                  <Link
                    to={`/${currentLang}/profile`}
                    onClick={handleProfileClick} // Profil ikonasi bosilganda Google sahifasiga yo'naltirish
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-base font-medium"
                  >
                    <FaUser className="h-5 w-5" /> {t("profile")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
      <SearchBar isSearchOpen={isSearchOpen} toggleSearch={toggleSearch} />
    </div>
  )
}

export default Navbar

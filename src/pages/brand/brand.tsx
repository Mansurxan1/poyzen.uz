import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux';
import { Link } from 'react-router-dom';
import jordan from '@/assets/jordan.svg';
import newbalance from '@/assets/newbalance.svg';

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
];

const Brand: React.FC = () => {
  const language = useSelector((state: RootState) => state.language.language);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <section className="w-full px-4 py-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Mashhur Sneakers Brendlari
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 place-items-center">
        {brandLogos.map((brand) => (
          <Link
            key={brand.id}
            to={`/${language}/brand/${brand.id}`}
            className="hover:scale-105 transition-transform duration-300 flex flex-col items-center"
          >
            <img
              src={brand.image}
              alt={brand.name}
              className="w-32 h-16 object-contain mb-2"
            />
            <span className="text-lg font-medium text-gray-800">{brand.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Brand;
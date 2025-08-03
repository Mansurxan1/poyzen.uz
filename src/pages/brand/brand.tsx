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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <section className="w-full px-4 py-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Mashhur Sneakers Brendlari
      </h2>

      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-5 place-items-center">
        {brandLogos.map((brand) => (
          <Link
            key={brand.id}
            to={`/${language}/brand/${brand.id}`}
            className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-200"
          >
            <img
              src={brand.image}
              alt={brand.name}
              className="w-32 h-16 object-contain mb-3"
            />
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">
          Siz qidirgan brend topilmadi?
        </p>
        <a
          href="https://t.me/poyzenUz_Admin"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-5 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300"
        >
          Adminga murojaat qiling, siz izlagan brend albatta topiladi!
        </a>
      </div>
    </section>
  );
};

export default Brand;
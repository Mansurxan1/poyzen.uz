import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux';
import { Link } from 'react-router-dom';

const brandLogos = [
  { id: 'nike', name: 'Nike', image: 'https://1000logos.net/wp-content/uploads/2017/03/Nike-Logo.png' },
  { id: 'adidas', name: 'Adidas', image: 'https://1000logos.net/wp-content/uploads/2017/05/Adidas-logo.png' },
  { id: 'puma', name: 'Puma', image: 'https://1000logos.net/wp-content/uploads/2017/05/Puma-Logo.png' },
  { id: 'reebok', name: 'Reebok', image: 'https://1000logos.net/wp-content/uploads/2021/05/Reebok-logo.png' },
  { id: 'new-balance', name: 'New Balance', image: 'https://1000logos.net/wp-content/uploads/2017/05/New-Balance-Logo.png' },
  { id: 'converse', name: 'Converse', image: 'https://1000logos.net/wp-content/uploads/2017/03/Converse-logo.png' },
  { id: 'asics', name: 'Asics', image: 'https://1000logos.net/wp-content/uploads/2017/06/Asics-logo.png' },
  { id: 'vans', name: 'Vans', image: 'https://1000logos.net/wp-content/uploads/2017/06/Vans-logo.png' },
  { id: 'fila', name: 'Fila', image: 'https://1000logos.net/wp-content/uploads/2017/05/Fila-logo.png' },
  { id: 'under-armour', name: 'Under Armour', image: 'https://1000logos.net/wp-content/uploads/2017/05/Under-Armour-Logo.png' },
];

const Brand: React.FC = () => {
  const language = useSelector((state: RootState) => state.language.language);

  return (
    <section className="w-full px-4 py-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Mashhur Sneakers Brendlari
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 place-items-center">
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
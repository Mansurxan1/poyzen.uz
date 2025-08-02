import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHome } from 'react-icons/fa';

import type { RootState } from '@/redux';
import ProductCard from '@/pages/productAll/components/ProductCard'; 
import Button from '@/components/ui/button';
import type { ProductVariant } from '@/types';

interface Product {
  id: string | number;
  variant: ProductVariant; 
}

const Likes: React.FC = () => {
  const { t } = useTranslation();
  const likedProducts = useSelector((state: RootState) => state.likes.likedProducts) as Product[];
  const language = useSelector((state: RootState) => state.language.language);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 max-w-7xl mx-auto">
      {likedProducts.length > 0 && (
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {t('likedProducts')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('items', { count: likedProducts.length })}
          </p>
        </header>
      )}

      {likedProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-700 mb-3">
            {t('noLikedProducts')}
          </h3>
          <p className="text-gray-500 mb-8 text-lg">
            {t('startLikingProducts')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/${language}/products`} aria-label={t('browseProducts')}>
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                aria-label={t('browseProducts')}
              >
                <FaShoppingCart className="w-5 h-5 mr-2" aria-hidden="true" />
                {t('browseProducts')}
              </Button>
            </Link>
            <Link to={`/${language}`} aria-label={t('back_to_home')}>
              <Button
                variant="outline"
                className="px-8 py-3 rounded-lg bg-transparent border-2 border-gray-300 hover:border-gray-400 text-lg font-semibold transition-all duration-200"
                aria-label={t('back_to_home')}
              >
                <FaHome className="w-5 h-5 mr-2" aria-hidden="true" />
                {t('back_to_home')}
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 auto-rows-fr"
          role="grid"
        >
          {likedProducts.map((item) => (
            <ProductCard key={item.id} variant={item.variant} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Likes;
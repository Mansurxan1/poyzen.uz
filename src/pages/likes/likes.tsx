import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <section className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 sm:px-4'>
      <div className=" max-w-7xl mx-auto">
        {likedProducts.length > 0 && (
          <header className="text-center mb-8">
            <h1 className="text-lg sm:text-3xl font-bold text-blue-500 uppercase mb-2">
              {t('likedProducts')}
            </h1>
          </header>
        )}

        {likedProducts.length === 0 ? (
          <section className="min-h-[50vh] flex items-center justify-center px-4">
            <div className="flex flex-col items-center justify-center text-center">
              <h3 className="sm:text-2xl px-4 font-bold text-red-500 uppercase mb-3">
                {t('noLikedProducts')}
              </h3>

              <p className="text-gray-500 font-medium mb-8 text-lg">
                {t('startLikingProducts')}
              </p>

              {/* Tugmalar bir xil bo'lishi uchun width va style larni moslashtirdik */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
                <Link to={`/${language}/products`} className="w-full sm:w-auto">
                  <Button
                    className="w-full sm:w-60 text-center bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {t('browseProducts')}
                  </Button>
                </Link>

                <Link to={`/${language}`} className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full sm:w-60 text-center px-8 py-3 rounded-lg bg-transparent border-2 border-gray-300 hover:border-gray-400 text-lg font-semibold transition-all duration-200"
                  >
                    {t('back_to_home')}
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 auto-rows-fr"
            role="grid"
          >
            {likedProducts.map((item) => (
              <ProductCard key={item.id} variant={item.variant} />
            ))}
          </div>
        )}
      </div>

    </section>
  );
};

export default Likes;
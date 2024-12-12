'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { api } from "@/trpc/react";

// Category Skeleton Component
const CategorySkeleton = () => (
  <div className="flex gap-[45px] relative">
    {[...Array(4)].map((_, i) => (
      <div 
        key={i}
        className="h-6 w-20 bg-gray-200 rounded animate-pulse"
      />
    ))}
  </div>
);

// Product Card Skeleton Component
const ProductCardSkeleton = () => (
  <Card className="bg-white rounded-lg">
    <CardContent className="p-0">
      <div className="w-[227px] h-[227px] bg-gray-200 rounded-t-lg animate-pulse" />
      <div className="px-2 py-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 ml-2 animate-pulse" />
        <div className="flex items-center justify-between px-3 mt-2">
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="w-[69px] h-[23px] bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </CardContent>
  </Card>
);


const ProductCard = ({ product, handleCallback }) => {
  const priceFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  return (
    <Card className="bg-white rounded-lg hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <img
          src={product.image || '/images/product-placeholder.png'}
          alt={product.name}
          className="w-[227px] h-[227px] rounded-t-lg object-cover"
        />
        <div className="px-2 py-4">
          <h3 className="text-gray-900 text-sm ml-2 truncate" title={product.name}>
            {product.name}
          </h3>
          <div className="flex items-center justify-between px-3 mt-2">
            <span className="text-xl text-gray-900 font-bold">
              {priceFormatter.format(product.price)}
            </span>
            <button 
              className="w-[69px] h-[23px] text-sm text-white font-bold rounded bg-gradient-to-r from-violet-500 to-indigo-600 hover:opacity-90"
              onClick={() => handleCallback(product)}
            >
              购买
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function StoreContent() {
  const [currentCategoryId, setCurrentCategoryId] = useState<number>();
  const router = useRouter();

  // 获取分类列表
  const { data: categories, isLoading: loadingCategories } = api.mall.getCategories.useQuery();

  // 设置默认分类
  useEffect(() => {
    if (categories && categories.length > 0 && !currentCategoryId) {
      setCurrentCategoryId(categories[0].id);
    }
  }, [categories]);

  // 获取商品列表
  const { 
    data: productsData, 
    isLoading: loadingProducts 
  } = api.mall.getProducts.useQuery(
    {
      classifyId: currentCategoryId,
      page: 1,
      pageSize: 20,
      sortBy: 'newest'
    },
    {
      enabled: !!currentCategoryId, // 只在有分类ID时查询
    }
  );

  const handleShopping = (product) => {
    router.push(`/shopping?id=${product.id}`);
  };


  return (
    <div className="p-4">
      {/* Categories */}
      <Card className="bg-purple-100 mb-4">
        <CardContent className="px-4 py-2">
        {loadingCategories ? (
            <CategorySkeleton />
          ) : (
          <div className="flex gap-[45px] relative">
            {categories?.map((category) => (
              <span
                key={category.id}
                className={`cursor-pointer ${
                  currentCategoryId === category.id ? 'text-indigo-600' : 'text-gray-400'
                }`}
                onClick={() => setCurrentCategoryId(category.id)}
              >
                {category.name}
              </span>
            ))}
            
            {/* Active Indicator */}
            <div 
              className="absolute -bottom-1 w-[22px] h-1 bg-indigo-600 transition-all duration-300"
              style={{
                left: `${categories?.findIndex(c => c.id === currentCategoryId) * 145 + 5}px`
              }}
            />
          </div>
          )}
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="bg-purple-100 rounded-lg p-4">
      {loadingProducts || loadingCategories  ? (
          <div className="grid grid-cols-4 gap-[13px]">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-[13px]">
            {productsData?.products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                handleCallback={handleShopping} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
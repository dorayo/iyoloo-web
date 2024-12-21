"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";

// Category Skeleton Component
const CategorySkeleton = () => (
  <div className="relative flex gap-[45px]">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="h-6 w-20 animate-pulse rounded bg-gray-200" />
    ))}
  </div>
);

// Product Card Skeleton Component
const ProductCardSkeleton = () => (
  <Card className="rounded-lg bg-white">
    <CardContent className="p-0">
      <div className="h-[227px] w-[227px] animate-pulse rounded-t-lg bg-gray-200" />
      <div className="px-2 py-4">
        <div className="ml-2 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="mt-2 flex items-center justify-between px-3">
          <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-[23px] w-[69px] animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const ProductCard = ({ product, handleCallback }) => {
  const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <Card className="rounded-lg bg-white transition-shadow hover:shadow-lg">
      <CardContent className="p-0">
        <img
          src={product.image || "/images/product-placeholder.png"}
          alt={product.name}
          className="h-[227px] w-[227px] rounded-t-lg object-cover"
        />
        <div className="px-2 py-4">
          <h3
            className="ml-2 truncate text-sm text-gray-900"
            title={product.name}
          >
            {product.name}
          </h3>
          <div className="mt-2 flex items-center justify-between px-3">
            <span className="text-xl font-bold text-gray-900">
              {priceFormatter.format(product.price)}
            </span>
            <button
              className="h-[23px] w-[69px] rounded bg-gradient-to-r from-violet-500 to-indigo-600 text-sm font-bold text-white hover:opacity-90"
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
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  // 获取分类列表
  const { data: categories, isLoading: loadingCategories } =
    api.mall.getCategories.useQuery();

  // 设置默认分类
  useEffect(() => {
    if (categories && categories.length > 0 && !currentCategoryId) {
      setCurrentCategoryId(categories[0].id);
    }
  }, [categories]);

  // 获取商品列表
  const { data: productsData, isLoading: loadingProducts } =
    api.mall.getProducts.useQuery(
      {
        classifyId: currentCategoryId,
        page: 1,
        pageSize: 20,
        sortBy: "newest",
      },
      {
        enabled: !!currentCategoryId, // 只在有分类ID时查询
      },
    );

  const handleShopping = (product) => {
    router.push(`/shopping?id=${product.id}&userId=${userId}`);
  };

  return (
    <div className="p-4">
      {/* Categories */}
      <Card className="mb-4 bg-purple-100">
        <CardContent className="px-4 py-2">
          {loadingCategories ? (
            <CategorySkeleton />
          ) : (
            <div className="relative flex gap-[45px]">
              {categories?.map((category) => (
                <span
                  key={category.id}
                  className={`cursor-pointer ${
                    currentCategoryId === category.id
                      ? "text-indigo-600"
                      : "text-gray-400"
                  }`}
                  onClick={() => setCurrentCategoryId(category.id)}
                >
                  {category.name}
                </span>
              ))}

              {/* Active Indicator */}
              <div
                className="absolute -bottom-1 h-1 w-[22px] bg-indigo-600 transition-all duration-300"
                style={{
                  left: `${categories && categories?.findIndex((c) => c.id === currentCategoryId!) * 145 + 5}px`,
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="rounded-lg bg-purple-100 p-4">
        {loadingProducts || loadingCategories ? (
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

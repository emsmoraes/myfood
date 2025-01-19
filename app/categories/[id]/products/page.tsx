import ArrowBack from "@/app/_components/arrow-back";
import Header from "@/app/_components/header";
import ProductItem from "@/app/_components/product-item";
import ProductsList from "@/app/_components/products-list";
import RestaurantItem from "@/app/_components/restaurant-item";
import RestaurantList from "@/app/_components/restaurant-list";
import { db } from "@/app/_lib/prisma";
import { notFound } from "next/navigation";
import React from "react";
interface CategoriesPageProps {
  params: {
    id: string;
  };
}

async function CategoriesPage({ params }: CategoriesPageProps) {
  const category = await db.category.findUnique({
    where: {
      id: params.id,
    },
    include: {
      products: {
        include: {
          restaurant: {
            select: {
              name: true,
            },
          },
        },
        take: 10,
      },
      restaurants: {
        take: 3,
      },
    },
  });

  if (!category) {
    return notFound();
  }

  return (
    <>
      <Header />

      <div>
        <div className="mb-6 px-5 pt-3 laptop:px-44">
          <ArrowBack />
        </div>

        <h2 className="mb-6 px-5 text-lg font-semibold laptop:px-44">
          {category.name}
        </h2>

        <div className="grid w-full grid-cols-2 gap-6 px-5 laptop:hidden">
          {category?.products.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              className="min-w-full"
            />
          ))}
        </div>

        <div className="hidden space-y-4 laptop:block laptop:px-44">
          <div className="hidden gap-5 laptop:grid laptop:grid-cols-5 desktop:grid-cols-6">
            {category?.products.map((product) => (
              <ProductItem product={product} key={product.id} />
            ))}
          </div>
        </div>

        <div className="mb-24 mt-10 laptop:px-44">
          <div className="flex items-center justify-between px-5 laptop:px-0">
            <h2 className="mb-6 text-lg font-semibold">Restaurantes</h2>
          </div>
          <RestaurantList restaurantsProps={category.restaurants} />
        </div>
      </div>
    </>
  );
}

export default CategoriesPage;

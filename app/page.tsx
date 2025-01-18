import Header from "./_components/header";
import ProductsList from "./_components/products-list";
import { Button } from "./_components/ui/button";
import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { db } from "./_lib/prisma";
import PromoBanner from "./_components/promo-banner";
import RestaurantList from "./_components/restaurant-list";
import Image from "next/image";
import ResponsiveSearch from "./_components/responsive-search";
import ResponsiveCategoryList from "./_components/responsive-category-list";

export default async function Home() {
  const fetch = async () => {
    const getProducts = db.product.findMany({
      where: {
        discountPercentage: {
          gt: 0,
        },
      },
      take: 7,
      include: {
        restaurant: {
          select: {
            name: true,
          },
        },
      },
    });

    const getBurgersCategory = db.category.findFirst({
      where: {
        name: "Hambúrgueres",
      },
    });

    const getPizzasCategory = db.category.findFirst({
      where: {
        name: "Pizzas",
      },
    });

    const getRestaurants = db.restaurant.findMany({
      take: 4,
    });

    const [products, burgersCategory, pizzasCategory, restaurants] =
      await Promise.all([
        getProducts,
        getBurgersCategory,
        getPizzasCategory,
        getRestaurants,
      ]);

    return { products, burgersCategory, pizzasCategory, restaurants };
  };

  const { burgersCategory, pizzasCategory, products, restaurants } =
    await fetch();

  return (
    <>
      <Header search={false} />

      <ResponsiveSearch />

      <ResponsiveCategoryList />

      <div className="hidden space-y-4 laptop:block">
        <div className="flex items-center justify-between px-44">
          <h2 className="font-semibold">Pedidos Recomendados</h2>

          <Button
            asChild
            variant={"ghost"}
            className="h-fit cursor-pointer p-0 text-primary hover:bg-transparent hover:text-primary/75"
          >
            <div>
              <Link href="/products/recommended">Ver Todos</Link>
              <ChevronRightIcon size={16} />
            </div>
          </Button>
        </div>
        <ProductsList products={products} />
      </div>

      <div className="mb-5 mt-10 hidden grid-cols-2 gap-5 px-44 laptop:grid">
        <Link href={`/categories/${pizzasCategory?.id}/products`}>
          <PromoBanner
            src={"/promobanner-1.png"}
            alt="Até 30% de descontos em pizzas"
          />
        </Link>
        <Link href={`/categories/${pizzasCategory?.id}/products`}>
          <PromoBanner
            src={"/promobanner-2.png"}
            alt="Até 30% de descontos em pizzas"
          />
        </Link>
      </div>

      <div className="px-5 pt-6 laptop:hidden">
        <Link href={`/categories/${pizzasCategory?.id}/products`}>
          <PromoBanner
            src={"/promobanner-1.png"}
            alt="Até 30% de descontos em pizzas"
          />
        </Link>
      </div>

      <div className="space-y-4 pt-6 laptop:hidden">
        <div className="flex items-center justify-between px-5">
          <h2 className="font-semibold">Pedidos Recomendados</h2>

          <Button
            asChild
            variant={"ghost"}
            className="h-fit cursor-pointer p-0 text-primary hover:bg-transparent hover:text-primary/75"
          >
            <div>
              <Link href="/products/recommended">Ver Todos</Link>
              <ChevronRightIcon size={16} />
            </div>
          </Button>
        </div>
        <ProductsList products={products} />
      </div>

      <div className="px-5 pt-6 laptop:hidden">
        <Link href={`/categories/${burgersCategory?.id}/products`}>
          <PromoBanner
            src={"/promobanner-2.png"}
            alt="Até 30% de descontos em pizzas"
          />
        </Link>
      </div>

      <div className="mb-24 space-y-4 pt-6 laptop:px-44">
        <div className="flex items-center justify-between px-5 laptop:px-0">
          <h2 className="font-semibold">Restaurantes Recomendados</h2>

          <Button
            asChild
            variant={"ghost"}
            className="h-fit cursor-pointer p-0 text-primary hover:bg-transparent hover:text-primary/75"
          >
            <div>
              <Link href="/restaurants/recommended">Ver Todos</Link>
              <ChevronRightIcon size={16} />
            </div>
          </Button>
        </div>
        <RestaurantList restaurantsProps={restaurants} />
      </div>
    </>
  );
}

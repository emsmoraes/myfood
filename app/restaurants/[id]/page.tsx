import { db } from "@/app/_lib/prisma";
import { notFound } from "next/navigation";
import React from "react";
import RestaurantImage from "./_components/restaurant-image";
import Image from "next/image";
import { StarIcon } from "lucide-react";
import DeliveryDetail from "@/app/_components/delivery-detail";
import ProductsList from "@/app/_components/products-list";
import CartBanner from "./_components/cart-banner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { convertObjectWithDecimal } from "@/app/_helpers/convert-object-with-decimal";
import Header from "@/app/_components/header";
import { TiStarFullOutline } from "react-icons/ti";
import ArrowBack from "@/app/_components/arrow-back";
import { Sheet, SheetTrigger } from "@/app/_components/ui/sheet";
import ReviewRestaurantTrigger from "./_components/review-restaurant-trigger";
interface ProductsProps {
  params: Promise<{
    id: string;
  }>;
}

async function RestaurantPage({ params }: ProductsProps) {
  const resolvedParams = await params;

  const restaurant = await db.restaurant.findUnique({
    where: {
      id: resolvedParams.id,
    },
    include: {
      categories: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          products: {
            where: {
              restaurantId: resolvedParams.id,
            },
            include: {
              restaurant: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      products: {
        take: 10,
        include: {
          restaurant: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!restaurant) {
    return notFound();
  }

  const session = await getServerSession(authOptions);

  const userFavoritesRestaurants = await db.userFavoriteRestaurant.findMany({
    where: {
      userId: session?.user.id,
    },
  });

  return (
    <>
      <div className="laptop:hidden">
        <div className="mb-24">
          <RestaurantImage
            restaurant={convertObjectWithDecimal(restaurant)}
            userFavoritesRestaurants={userFavoritesRestaurants}
          />

          <div className="relative mt-[-1.5rem] flex items-center justify-between rounded-t-3xl bg-white px-5 py-6 pt-5">
            {/* TITULO */}
            <div className="flex items-center gap-[0.375rem] ">
              <div className="relative h-8 w-8">
                <Image
                  src={restaurant.imageUrl}
                  sizes="100%"
                  alt={restaurant.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>

              <h1 className="text-xl font-semibold">{restaurant.name}</h1>
            </div>
            <ReviewRestaurantTrigger
              userId={session?.user.id}
              restaurantId={restaurant.id}
            >
              <div className="flex items-center gap-[3px] rounded-full bg-foreground px-2 py-[2px] text-white">
                <StarIcon
                  size={12}
                  className="fill-yellow-500 text-yellow-500"
                />
                <span className="text-xs font-semibold">5.0</span>
              </div>
            </ReviewRestaurantTrigger>
          </div>

          <div className="px-5">
            <DeliveryDetail restaurant={convertObjectWithDecimal(restaurant)} />
          </div>

          <div className="mt-3 flex gap-4 overflow-x-scroll px-5 [&::-webkit-scrollbar]:hidden">
            {restaurant.categories.map((category) => (
              <div
                key={category.id}
                className="min-w-[167px] rounded-lg bg-[#f4f4f4] text-center"
              >
                <span className="text-sx text-muted-foreground">
                  {" "}
                  {category.name}
                </span>
              </div>
            ))}
          </div>

          {/* TODO mostrar produtos mais pedidos */}
          <div className="mt-6 space-y-4">
            <h2 className="px-5 font-semibold">Mais pedidos</h2>
            <ProductsList products={restaurant.products} />
          </div>

          {restaurant.categories.map((category) => (
            <div className="mt-6 space-y-4" key={category.id}>
              <h2 className="px-5 font-semibold">{category.name}</h2>
              <ProductsList products={category.products} />
            </div>
          ))}
          <CartBanner restaurant={convertObjectWithDecimal(restaurant)} />
        </div>
      </div>

      <div className="hidden laptop:block">
        <Header />

        <div className="mb-6 px-5 pt-3 laptop:px-44">
          <ArrowBack />
        </div>

        <div className="w-full px-44">
          <div className="mt-10 flex w-full gap-9">
            <div className="relative flex-1">
              <Image
                src={restaurant.imageUrl}
                alt={restaurant.name}
                fill
                className="rounded-md object-cover"
              />
            </div>

            <div className="flex h-[550px] w-[400px] flex-col">
              <div className="gatrip-2 flex items-center justify-between">
                <div className="flex flex-1 items-center gap-[0.375rem]">
                  <div className="relative h-10 w-10">
                    <Image
                      src={restaurant.imageUrl}
                      sizes="100%"
                      alt={restaurant.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>

                  <h1 className="truncate text-xl font-semibold">
                    {restaurant.name}
                  </h1>
                </div>
                <ReviewRestaurantTrigger
                  userId={session?.user.id}
                  restaurantId={restaurant.id}
                >
                  <div className="flex w-fit items-center rounded-full border-2 bg-[#323232] px-[11px] py-[4px] duration-150 hover:bg-zinc-800/80">
                    <TiStarFullOutline color="#FFB100" size={20} />
                    <span className="block text-sm font-semibold text-white">
                      5.0
                    </span>
                  </div>
                </ReviewRestaurantTrigger>
              </div>
              <DeliveryDetail
                restaurant={convertObjectWithDecimal(restaurant)}
              />
              <div className="mt-4 grid grid-cols-2 gap-2">
                {restaurant.categories.map((category) => (
                  <div
                    key={category.id}
                    className="min-w-[167px] rounded-[8px] bg-[#f4f4f4] py-1 text-center"
                  >
                    <span className="text-[17px] text-muted-foreground">
                      {" "}
                      {category.name}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex-1 overflow-y-scroll">
                <h2 className="text-lg font-semibold text-foreground ">
                  Sobre
                </h2>
                <p className="pr-2 text-[16px] text-[#7E8392]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos
                  ipsa nemo, voluptatem cupiditate magni error eveniet aut,
                  libero, quaerat voluptas impedit? Maiores consectetur error,
                  consequuntur veritatis enim minima nulla, tempore earum facere
                  provident nihil architecto.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TODO mostrar produtos mais pedidos */}
        <div className="mb-8 mt-8 space-y-4">
          <h2 className="px-44 text-xl font-semibold">Mais pedidos</h2>
          <ProductsList products={restaurant.products} />
        </div>

        <div className="mb-16">
          {restaurant.categories.map((category) => (
            <div className="mt-6 space-y-4 " key={category.id}>
              <h2 className="px-44 text-xl font-semibold">{category.name}</h2>
              <ProductsList products={category.products} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default RestaurantPage;

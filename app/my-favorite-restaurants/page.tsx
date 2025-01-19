import React from "react";
import { db } from "../_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";
import { notFound } from "next/navigation";
import Header from "../_components/header";
import RestaurantItem from "../_components/restaurant-item";
import Link from "next/link";
import { convertObjectWithDecimal } from "../_helpers/convert-object-with-decimal";

async function MyFavoriteRestaurants() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return notFound();
  }

  const userFavoriteRestaurants = await db.userFavoriteRestaurant.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      restaurant: true,
    },
  });

  return (
    <>
      <Header />

      <div className="px-5 py-6">
        <h2 className="mb-6 text-lg font-semibold">Restaurantes Favoritos</h2>

        {userFavoriteRestaurants.length > 0 ? (
          <>
            <div className="flex w-full flex-col gap-6 tablet:hidden">
              {userFavoriteRestaurants.map((restaurant) => (
                <RestaurantItem
                  key={restaurant.restaurant.id}
                  restaurant={convertObjectWithDecimal(restaurant.restaurant)}
                  className="min-w-full max-w-full"
                  userFavoritesRestaurants={convertObjectWithDecimal(
                    userFavoriteRestaurants,
                  )}
                />
              ))}
            </div>

            <div className="hidden gap-4 tablet:grid tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-3">
              {userFavoriteRestaurants.map((restaurant) => (
                <RestaurantItem
                  key={restaurant.restaurant.id}
                  restaurant={convertObjectWithDecimal(restaurant.restaurant)}
                  className="min-w-full max-w-full"
                  userFavoritesRestaurants={convertObjectWithDecimal(
                    userFavoriteRestaurants,
                  )}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">
              Você ainda não possue restaurantes favoritos.
            </h3>
            <Link
              className="font-semibold text-primary underline"
              href="/restaurants/recommended"
            >
              Ver restaurantes
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default MyFavoriteRestaurants;

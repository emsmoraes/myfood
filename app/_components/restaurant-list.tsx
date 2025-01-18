import React from "react";
import { db } from "../_lib/prisma";
import RestaurantItem from "./restaurant-item";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";
import { convertObjectWithDecimal } from "../_helpers/convert-object-with-decimal";
import { Restaurant } from "@prisma/client";

interface RestaurantListProps {
  restaurantsProps?: Restaurant[];
}

async function RestaurantList({ restaurantsProps }: RestaurantListProps) {
  const session = await getServerSession(authOptions);

  const userFavoritesRestaurants = await db.userFavoriteRestaurant.findMany({
    where: {
      userId: session?.user?.id,
    },
  });

  return (
    <>
      <div className="flex gap-4 overflow-x-scroll px-5 laptop:hidden [&&::-webkit-scrollbar]:hidden">
        {restaurantsProps?.map((restaurant) => (
          <RestaurantItem
            key={restaurant.id}
            restaurant={convertObjectWithDecimal(restaurant)}
            userFavoritesRestaurants={userFavoritesRestaurants}
          />
        ))}
      </div>
      <div className="hidden gap-3 laptop:grid laptop:grid-cols-3 laptop:gap-6 desktop:grid-cols-3">
        {restaurantsProps?.map((restaurant) => (
          <RestaurantItem
            key={restaurant.id}
            restaurant={convertObjectWithDecimal(restaurant)}
            userFavoritesRestaurants={userFavoritesRestaurants}
          />
        ))}
      </div>
    </>
  );
}

export default RestaurantList;

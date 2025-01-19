"use client";

import React from "react";
import { UserFavoriteRestaurant } from "@prisma/client";
import Header from "../../_components/header";
import RestaurantItem from "../../_components/restaurant-item";
import ArrowBack from "@/app/_components/arrow-back";
import { Decimal } from "@prisma/client/runtime/library";

interface RestaurantsProps {
  userFavoritesRestaurants?: UserFavoriteRestaurant[];
  restaurants: {
    id: string;
    name: string;
    imageUrl: string;
    deliveryFee: Decimal;
    deliveryTimeMinutes: number;
  }[];
  search: string;
}

function Restaurants({
  userFavoritesRestaurants,
  restaurants,
  search,
}: RestaurantsProps) {
  return (
    <>
      <Header searchParams={search} />

      <div className="mb-6 px-5 pt-3 laptop:px-44">
        <ArrowBack />
      </div>

      <div className="px-5 laptop:px-44">
        <h2 className="mb-6 text-lg font-semibold">
          Resultados para &ldquo;{search}&ldquo;
        </h2>

        <div className="flex w-full flex-col gap-6 tablet:hidden">
          {restaurants.map((restaurant) => (
            <RestaurantItem
              key={restaurant.id}
              restaurant={restaurant}
              className="min-w-full max-w-full"
              userFavoritesRestaurants={userFavoritesRestaurants}
            />
          ))}
        </div>

        <div className="hidden gap-4 tablet:grid tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-3">
          {restaurants.map((restaurant) => (
            <RestaurantItem
              key={restaurant.id}
              restaurant={restaurant}
              className="min-w-full max-w-full"
              userFavoritesRestaurants={userFavoritesRestaurants}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Restaurants;

import React, { Suspense } from "react";
import Restaurants from "./_components/resturants";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";
import { db } from "../_lib/prisma";
import { convertObjectWithDecimal } from "../_helpers/convert-object-with-decimal";

type SearchParams = Promise<{ search?: string | string[] }>;

async function RestaurantsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;
  const search = Array.isArray(params?.search)
    ? params.search[0] || ""
    : params?.search || "";

  const [restaurants, userFavoritesRestaurants] = await Promise.all([
    db.restaurant.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    }),
    db.userFavoriteRestaurant.findMany({
      where: {
        userId: session?.user?.id,
      },
    }),
  ]);

  return (
    <Suspense>
      <Restaurants
        userFavoritesRestaurants={userFavoritesRestaurants}
        restaurants={convertObjectWithDecimal(restaurants)}
        search={search}
      />
    </Suspense>
  );
}

export default RestaurantsPage;

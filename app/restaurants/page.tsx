import React, { Suspense } from "react";
import Restaurants from "./_components/resturants";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";
import { db } from "../_lib/prisma";
import { convertObjectWithDecimal } from "../_helpers/convert-object-with-decimal";

async function RestaurantsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  const search = searchParams?.search || "";

  const restaurants = await db.restaurant.findMany({
    where: {
      name: {
        contains: search as string,
        mode: "insensitive",
      },
    },
  });

  const userFavoritesRestaurants = await db.userFavoriteRestaurant.findMany({
    where: {
      userId: session?.user?.id,
    },
  });

  return (
    <Suspense>
      <Restaurants
        userFavoritesRestaurants={userFavoritesRestaurants}
        restaurants={convertObjectWithDecimal(restaurants)}
        search={search as string}
      />
    </Suspense>
  );
}

export default RestaurantsPage;

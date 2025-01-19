"use client";
import React, { useEffect, useState } from "react";
import { Restaurant, UserFavoriteRestaurant } from "@prisma/client";
import Image from "next/image";
import { BikeIcon, HeartIcon, StarIcon, TimerIcon } from "lucide-react";
import { formatCurrency } from "../_helpers/price";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "../_lib/utils";
import { useSession } from "next-auth/react";
import { isRestaurantCurrentlyFavorite } from "../_helpers/restaurant";
import useFavoriteRestaurant from "../_hooks/use-favorite-restaurant";
import { calculateAverage } from "../_actions/calculate-average";
import { TbLoader2 } from "react-icons/tb";

interface RestaurantItemProps {
  restaurant: Restaurant;
  className?: string;
  userFavoritesRestaurants?: UserFavoriteRestaurant[];
}

function RestaurantItem({
  restaurant,
  className,
  userFavoritesRestaurants,
}: RestaurantItemProps) {
  const [average, setAverage] = useState<number | null>();
  const isFavorite = isRestaurantCurrentlyFavorite(
    userFavoritesRestaurants,
    restaurant.id,
  );

  const { data } = useSession();

  const { handleFavoriteClick, isPending } = useFavoriteRestaurant({
    restaurantId: restaurant.id,
    isFavorite: isFavorite,
    userId: data?.user.id,
  });

  useEffect(() => {
    const getAverage = async () => {
      const average = await calculateAverage(restaurant.id);
      setAverage(average);
    };

    getAverage();
  }, [restaurant.id]);

  return (
    <div
      className={cn(
        "min-w-[266px] max-w-[266px] tablet:min-w-full laptop:max-w-full",
        className,
      )}
    >
      <div className="w-full space-y-3">
        <div className="relative h-[136px] w-full laptop:h-[165px]">
          <Link href={`/restaurants/${restaurant.id}`}>
            <Image
              sizes="100%"
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="rounded-lg object-cover"
              fill
            />
          </Link>

          <div className="absolute left-2 top-2 flex items-center gap-[2px] rounded-full bg-primary-foreground px-2 py-[2px] text-black">
            <StarIcon size={12} className="fill-yellow-500 text-yellow-500" />
            <span className="text-xs font-semibold">
              {average}
              .0
            </span>
          </div>

          {data?.user.id && (
            <Button
              className={cn(
                `absolute right-2 top-2 h-7 w-7 rounded-full bg-gray-700 hover:bg-red-900`,
                {
                  "bg-primary transition duration-300 hover:bg-gray-700":
                    isFavorite,
                },
              )}
              size={"icon"}
              onClick={handleFavoriteClick}
            >
              {isPending ? (
                <TbLoader2 className="animate-spin text-white" size={17} />
              ) : (
                <HeartIcon size={17} className="fill-white" />
              )}
            </Button>
          )}
        </div>
        <Link href={`/restaurants/${restaurant.id}`}>
          <div>
            <h3 className="laptop:text-md mt-2 text-sm font-semibold">
              {restaurant.name}
            </h3>

            <div className="flex gap-3">
              <div className="flex items-center gap-1">
                <BikeIcon className="text-primary" size={14} />
                <span className="text-xs text-muted-foreground">
                  {Number(restaurant.deliveryFee) === 0
                    ? "Entrega grátis"
                    : formatCurrency(Number(restaurant.deliveryFee))}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <TimerIcon className="text-primary" size={14} />
                <span className="text-xs text-muted-foreground">
                  {restaurant.deliveryTimeMinutes} min
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default RestaurantItem;

"use client";
import { Button } from "@/app/_components/ui/button";
import { isRestaurantCurrentlyFavorite } from "@/app/_helpers/restaurant";
import useFavoriteRestaurant from "@/app/_hooks/use-favorite-restaurant";
import { cn } from "@/app/_lib/utils";
import { Product, Restaurant, UserFavoriteRestaurant } from "@prisma/client";
import { ChevronLeftIcon, HeartIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { TbLoader2 } from "react-icons/tb";

interface ProductImageProps {
  restaurant: Pick<Restaurant, "id" | "imageUrl" | "name">;
  userFavoritesRestaurants?: UserFavoriteRestaurant[];
}

function RestaurantImage({
  restaurant,
  userFavoritesRestaurants,
}: ProductImageProps) {
  const router = useRouter();

  const { data } = useSession();

  const handleBackClick = () => {
    router.back();
  };

  const isFavorite = isRestaurantCurrentlyFavorite(
    userFavoritesRestaurants,
    restaurant.id,
  );

  const { handleFavoriteClick, isPending } = useFavoriteRestaurant({
    restaurantId: restaurant.id,
    isFavorite: isFavorite,
    userId: data?.user.id,
  });

  return (
    <div className="relative h-[250px] w-full">
      <Image
        className="object-cover"
        src={restaurant.imageUrl}
        sizes="100%"
        alt={restaurant.name}
        fill
      />

      <Button
        className="absolute left-2 top-2 rounded-full bg-white text-foreground hover:bg-primary-foreground/90"
        size={"icon"}
        onClick={handleBackClick}
      >
        <ChevronLeftIcon className="mr-[2px]" />
      </Button>

      <Button
        className={cn(
          "absolute right-4 top-4 rounded-full bg-gray-700 hover:bg-red-900",
          {
            "bg-primary transition duration-300 hover:bg-gray-700": isFavorite,
          },
        )}
        onClick={handleFavoriteClick}
        size={"icon"}
      >
        {isPending ? (
          <TbLoader2 className="animate-spin text-white" size={20} />
        ) : (
          <HeartIcon size={20} className="fill-white" />
        )}
      </Button>
    </div>
  );
}

export default RestaurantImage;

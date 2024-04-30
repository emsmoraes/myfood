import React from "react";
import { Restaurant } from "@prisma/client";
import Image from "next/image";
import {
  BikeIcon,
  Heart,
  HeartIcon,
  StarIcon,
  StoreIcon,
  TimerIcon,
} from "lucide-react";
import { formatCurrency } from "../_helpers/price";
import { Button } from "./ui/button";

interface RestaurantItemProps {
  restaurant: Restaurant;
}

function RestaurantItem({ restaurant }: RestaurantItemProps) {
  return (
    <div className="min-w-[266px] max-w-[266px] space-y-3">
      <div className="relative h-[136px] w-full">
        <Image
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="rounded-lg object-cover"
          fill
        />

        <div className="absolute left-2 top-2 flex items-center gap-[2px] rounded-full bg-primary-foreground px-2 py-[2px] text-black">
          <StarIcon size={12} className="fill-yellow-500 text-yellow-500" />
          <span className="text-xs font-semibold">5.0</span>
        </div>

        <Button
          className="absolute right-2 top-2 h-7 w-7 rounded-full bg-gray-700 hover:bg-red-900"
          size={"icon"}
        >
          <HeartIcon size={17} className="fill-white" />
        </Button>
      </div>

      <div>
        <h3 className="text-sm font-semibold">{restaurant.name}</h3>

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
    </div>
  );
}

export default RestaurantItem;

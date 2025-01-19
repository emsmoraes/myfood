"use client";

import { useTransition } from "react";
import {
  favoriteRestaurant,
  unfavoriteRestaurant,
} from "../_actions/restaurant";
import { toast } from "../_components/ui/use-toast";

interface UseFavoriteRestaurantProps {
  restaurantId: string;
  isFavorite?: boolean;
  userId?: string;
}

const useFavoriteRestaurant = ({
  restaurantId,
  isFavorite,
  userId,
}: UseFavoriteRestaurantProps) => {
  const [isPending, setIsPending] = useTransition();

  const handleFavoriteClick = async () => {
    if (!userId) return;

    setIsPending(async () => {
      try {
        if (isFavorite) {
          await unfavoriteRestaurant(userId, restaurantId);
          toast({ title: "Restaurante removido dos favoritos" });
        } else {
          await favoriteRestaurant(userId, restaurantId);
          toast({ title: "Restaurante favoritado com sucesso!" });
        }
      } catch (error) {
        toast({ title: "Erro ao favoritar o restaurante" });
      }
    });
  };

  return { handleFavoriteClick, isPending };
};

export default useFavoriteRestaurant;

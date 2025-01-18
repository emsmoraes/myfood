"use server";
import { db } from "../_lib/prisma";

export const calculateAverage = async (restaurantId: string) => {
  const restaurantAverages = await db.userNoteRestaurant.aggregate({
    where: {
      restaurantId: restaurantId,
    },
    _avg: {
      note: true,
    },
  });

  return restaurantAverages._avg.note || 0;
};

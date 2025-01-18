import { db } from "@/app/_lib/prisma";
import { notFound } from "next/navigation";
import React from "react";
import ProductImage from "./_components/product-image";
import ProductDetail from "./_components/product-detail";

interface ProductsProps {
  params: {
    id: string;
  };
}

async function Products({ params }: ProductsProps) {
  const product = await db.product.findUnique({
    where: {
      id: params.id,
    },
    include: {
      restaurant: true,
    },
  });

  if (!product) {
    return notFound();
  }

  const juices = await db.product.findMany({
    where: {
      category: {
        name: "Sucos",
      },
      restaurant: {
        id: product.restaurant.id,
      },
    },
    include: {
      restaurant: true,
    },
  });

  return (
    <div>
      <div className="laptop:hidden">
        <ProductImage product={product} />
      </div>

      <ProductDetail product={product} complementaryProducts={juices} />
    </div>
  );
}

export default Products;

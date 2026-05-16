import { prisma } from "@/lib/prisma";
import ProductClient from "./ProductClient";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Manajemen Produk</h2>
          <p className="text-sm text-zinc-400 mt-1">Kelola data inventaris laptop</p>
        </div>
      </div>
      <ProductClient initialProducts={products} />
    </div>
  );
}

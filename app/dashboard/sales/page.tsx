import { prisma } from "@/lib/prisma";
import SaleClient from "./SaleClient";

export const dynamic = "force-dynamic";

export default async function SalesPage() {
  const [sales, products] = await Promise.all([
    prisma.sale.findMany({
      orderBy: { date: "desc" },
      include: { product: true },
    }),
    prisma.product.findMany({ 
      where: { stock: { gt: 0 } }, // Only show products with stock
      orderBy: { name: "asc" } 
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Modul Penjualan (Checkout)</h2>
          <p className="text-sm text-zinc-400 mt-1">Catat transaksi penjualan ke pelanggan</p>
        </div>
      </div>
      <SaleClient 
        initialSales={sales} 
        products={products} 
      />
    </div>
  );
}

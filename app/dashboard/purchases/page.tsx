import { prisma } from "@/lib/prisma";
import PurchaseClient from "./PurchaseClient";

export const dynamic = "force-dynamic";

export default async function PurchasesPage() {
  const [purchases, products, suppliers] = await Promise.all([
    prisma.purchase.findMany({
      orderBy: { date: "desc" },
      include: { product: true, supplier: true },
    }),
    prisma.product.findMany({ orderBy: { name: "asc" } }),
    prisma.supplier.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Modul Pembelian (Restock)</h2>
          <p className="text-sm text-zinc-400 mt-1">Catat pembelian stok laptop dari supplier</p>
        </div>
      </div>
      <PurchaseClient 
        initialPurchases={purchases} 
        products={products} 
        suppliers={suppliers} 
      />
    </div>
  );
}

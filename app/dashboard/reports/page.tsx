import { prisma } from "@/lib/prisma";
import { ArrowDownRight, ArrowUpRight, DollarSign } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const [sales, purchases] = await Promise.all([
    prisma.sale.findMany({
      orderBy: { date: "desc" },
      include: { product: true },
    }),
    prisma.purchase.findMany({
      orderBy: { date: "desc" },
      include: { product: true, supplier: true },
    }),
  ]);

  const totalRevenue = sales.reduce((sum: number, sale: any) => sum + sale.totalPrice, 0);
  const totalExpense = purchases.reduce((sum: number, purchase: any) => sum + (purchase.buyPrice * purchase.quantity), 0);
  
  // Profit kotor (kasar) = Pendapatan Penjualan - Pengeluaran Pembelian
  // Dalam akuntansi sebenarnya ini bukan Net Profit, tapi untuk POS sederhana ini bisa jadi indikator cash flow.
  const cashFlow = totalRevenue - totalExpense;

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Laporan Keuangan</h2>
          <p className="text-sm text-zinc-400 mt-1">Ringkasan transaksi dan arus kas toko</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <ArrowUpRight className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">Total Pemasukan</p>
              <p className="text-2xl font-bold text-white mt-1">{formatIDR(totalRevenue)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <ArrowDownRight className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">Total Pengeluaran</p>
              <p className="text-2xl font-bold text-white mt-1">{formatIDR(totalExpense)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl border ${cashFlow >= 0 ? "bg-blue-500/10 border-blue-500/20" : "bg-amber-500/10 border-amber-500/20"}`}>
              <DollarSign className={`h-6 w-6 ${cashFlow >= 0 ? "text-blue-500" : "text-amber-500"}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">Arus Kas Bersih</p>
              <p className={`text-2xl font-bold mt-1 ${cashFlow >= 0 ? "text-blue-400" : "text-amber-400"}`}>
                {formatIDR(cashFlow)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-zinc-800">
            <h3 className="text-lg font-semibold text-white">Riwayat Penjualan Terakhir</h3>
          </div>
          <div className="overflow-y-auto max-h-96">
            {sales.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 font-medium">Tanggal</th>
                    <th className="px-6 py-3 font-medium">Produk</th>
                    <th className="px-6 py-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {sales.map((sale: any) => (
                    <tr key={sale.id} className="hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-3 text-zinc-400">
                        {new Date(sale.date).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-3">
                        <div className="text-white font-medium">{sale.product.name}</div>
                        <div className="text-xs text-zinc-500">{sale.quantity} Unit x {formatIDR(sale.sellPrice)}</div>
                      </td>
                      <td className="px-6 py-3 font-medium text-emerald-400 text-right">
                        +{formatIDR(sale.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-zinc-500">Belum ada penjualan.</div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-zinc-800">
            <h3 className="text-lg font-semibold text-white">Riwayat Pembelian Terakhir</h3>
          </div>
          <div className="overflow-y-auto max-h-96">
            {purchases.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 font-medium">Tanggal</th>
                    <th className="px-6 py-3 font-medium">Produk</th>
                    <th className="px-6 py-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {purchases.map((purchase: any) => (
                    <tr key={purchase.id} className="hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-3 text-zinc-400">
                        {new Date(purchase.date).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-3">
                        <div className="text-white font-medium">{purchase.product.name}</div>
                        <div className="text-xs text-zinc-500">{purchase.quantity} Unit x {formatIDR(purchase.buyPrice)}</div>
                      </td>
                      <td className="px-6 py-3 font-medium text-red-400 text-right">
                        -{formatIDR(purchase.buyPrice * purchase.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-zinc-500">Belum ada pembelian.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

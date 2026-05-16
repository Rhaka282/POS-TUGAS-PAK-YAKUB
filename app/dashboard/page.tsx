import { prisma } from "@/lib/prisma";
import { Laptop, ClipboardList, Clock, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [
    totalProducts,
    totalStok,
    totalDipinjam,
    totalDikembalikan,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.aggregate({ _sum: { stock: true } }),
    prisma.peminjaman.count({ where: { status: "DIPINJAM" } }),
    prisma.peminjaman.count({ where: { status: "DIKEMBALIKAN" } }),
  ]);

  // This month's peminjaman
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const thisMonthPeminjaman = await prisma.peminjaman.count({
    where: { tanggalPinjam: { gte: startOfMonth, lte: endOfMonth } },
  });

  const stats = [
    {
      name: "Total Produk Laptop",
      value: totalProducts.toString(),
      icon: Laptop,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      name: "Total Stok Tersedia",
      value: (totalStok._sum.stock || 0).toString() + " Unit",
      icon: Laptop,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
    },
    {
      name: "Sedang Dipinjam",
      value: totalDipinjam.toString() + " Laptop",
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      name: "Bulan Ini Dipinjam",
      value: thisMonthPeminjaman.toString() + " Kali",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
  ];

  // Recent peminjaman
  const recentPeminjaman = await prisma.peminjaman.findMany({
    take: 5,
    orderBy: { tanggalPinjam: "desc" },
    include: {
      user: { select: { name: true } },
      product: { select: { name: true, brand: true } },
    },
  });

  // Monthly peminjaman summary (last 6 months)
  const monthlyData: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
    const count = await prisma.peminjaman.count({
      where: { tanggalPinjam: { gte: start, lte: end } },
    });
    monthlyData.push({
      month: date.toLocaleDateString("id-ID", { month: "short", year: "numeric" }),
      count,
    });
  }

  const maxCount = Math.max(...monthlyData.map((m) => m.count), 1);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:bg-zinc-900 hover:border-zinc-700"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.borderColor} border`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">{stat.name}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Peminjaman */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-400" />
            Peminjaman Terbaru
          </h3>
          {recentPeminjaman.length > 0 ? (
            <div className="space-y-4">
              {recentPeminjaman.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-zinc-800/50 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                      {item.namaPeminjam.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{item.namaPeminjam}</p>
                      <p className="text-xs text-zinc-500">
                        {item.product.brand} {item.product.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                        item.status === "DIPINJAM"
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.status === "DIPINJAM" ? "bg-amber-400" : "bg-emerald-400"
                        }`}
                      />
                      {item.status === "DIPINJAM" ? "Dipinjam" : "Dikembalikan"}
                    </span>
                    <p className="text-xs text-zinc-600 mt-1">
                      {new Date(item.tanggalPinjam).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-zinc-800">
              <p className="text-sm text-zinc-500">Belum ada peminjaman</p>
            </div>
          )}
        </div>

        {/* Monthly Chart */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Peminjaman Per Bulan
          </h3>
          <div className="space-y-4">
            {monthlyData.map(({ month, count }) => (
              <div key={month} className="flex items-center gap-3">
                <span className="text-xs text-zinc-500 w-20 shrink-0 text-right">{month}</span>
                <div className="flex-1 h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-700"
                    style={{ width: `${Math.round((count / maxCount) * 100)}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-white w-5 text-right">{count}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-800">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400">Total Semua Peminjaman</span>
              <span className="text-white font-bold">
                {totalDipinjam + totalDikembalikan} kali
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

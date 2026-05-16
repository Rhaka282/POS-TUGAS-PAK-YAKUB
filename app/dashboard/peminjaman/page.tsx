"use client";

import { useEffect, useState } from "react";
import {
  ClipboardList,
  Laptop,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  RotateCcw,
  Search,
  Filter,
  TrendingUp,
} from "lucide-react";

type Peminjaman = {
  id: string;
  namaPeminjam: string;
  status: "DIPINJAM" | "DIKEMBALIKAN";
  tanggalPinjam: string;
  tanggalKembali: string | null;
  catatan: string | null;
  user: { name: string; email: string };
  product: { name: string; brand: string; specs: string | null };
};

export default function PeminjamanAdminPage() {
  const [data, setData] = useState<Peminjaman[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"SEMUA" | "DIPINJAM" | "DIKEMBALIKAN">("SEMUA");
  const [returning, setReturning] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/peminjaman");
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleReturn = async (id: string) => {
    setReturning(id);
    try {
      const res = await fetch(`/api/peminjaman/${id}`, { method: "PATCH" });
      if (res.ok) {
        showToast("Laptop berhasil dikembalikan! Stok bertambah.", "success");
        fetchData();
      } else {
        const err = await res.json();
        showToast(err.message || "Gagal mengembalikan laptop", "error");
      }
    } catch {
      showToast("Terjadi kesalahan", "error");
    } finally {
      setReturning(null);
    }
  };

  const filtered = data.filter((item) => {
    const matchStatus = filterStatus === "SEMUA" || item.status === filterStatus;
    const matchSearch =
      item.namaPeminjam.toLowerCase().includes(search.toLowerCase()) ||
      item.product.name.toLowerCase().includes(search.toLowerCase()) ||
      item.product.brand.toLowerCase().includes(search.toLowerCase()) ||
      item.user.email.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalDipinjam = data.filter((d) => d.status === "DIPINJAM").length;
  const totalDikembalikan = data.filter((d) => d.status === "DIKEMBALIKAN").length;

  // Monthly stats — group by month
  const monthlyStats = data.reduce<Record<string, number>>((acc, item) => {
    const month = new Date(item.tanggalPinjam).toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const thisMonth = new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  const thisMonthCount = monthlyStats[thisMonth] || 0;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all ${
            toast.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <Clock className="w-4 h-4" />
          )}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Manajemen Peminjaman</h2>
          <p className="text-zinc-400 text-sm mt-1">
            Kelola semua peminjaman laptop dan pantau pengembalian
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <ClipboardList className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-zinc-500">Total Peminjaman</p>
            <p className="text-2xl font-bold text-white">{data.length}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Clock className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-zinc-500">Sedang Dipinjam</p>
            <p className="text-2xl font-bold text-amber-400">{totalDipinjam}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-zinc-500">Bulan Ini ({thisMonth})</p>
            <p className="text-2xl font-bold text-emerald-400">{thisMonthCount}</p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Cari nama peminjam, laptop, atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {(["SEMUA", "DIPINJAM", "DIKEMBALIKAN"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2.5 text-xs font-medium rounded-xl border transition-all ${
                filterStatus === status
                  ? status === "DIPINJAM"
                    ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                    : status === "DIKEMBALIKAN"
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                    : "bg-blue-500/20 border-blue-500/40 text-blue-300"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
              }`}
            >
              {status === "SEMUA" ? "Semua" : status === "DIPINJAM" ? "Dipinjam" : "Dikembalikan"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">Memuat data peminjaman...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-7 h-7 text-zinc-600" />
            </div>
            <p className="text-zinc-400 font-medium">Belum ada data peminjaman</p>
            <p className="text-zinc-600 text-sm mt-1">Data peminjaman akan muncul di sini</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left text-xs font-medium text-zinc-500 px-6 py-4 uppercase tracking-wider">
                    Peminjam
                  </th>
                  <th className="text-left text-xs font-medium text-zinc-500 px-6 py-4 uppercase tracking-wider">
                    Laptop
                  </th>
                  <th className="text-left text-xs font-medium text-zinc-500 px-6 py-4 uppercase tracking-wider">
                    Tgl Pinjam
                  </th>
                  <th className="text-left text-xs font-medium text-zinc-500 px-6 py-4 uppercase tracking-wider">
                    Tgl Kembali
                  </th>
                  <th className="text-left text-xs font-medium text-zinc-500 px-6 py-4 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right text-xs font-medium text-zinc-500 px-6 py-4 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                          {item.namaPeminjam.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{item.namaPeminjam}</p>
                          <p className="text-xs text-zinc-500">{item.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Laptop className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-white">{item.product.name}</p>
                          <p className="text-xs text-zinc-500">{item.product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                        <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                        {new Date(item.tanggalPinjam).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-zinc-400">
                        {item.tanggalKembali
                          ? new Date(item.tanggalKembali).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
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
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.status === "DIPINJAM" && (
                        <button
                          onClick={() => handleReturn(item.id)}
                          disabled={returning === item.id}
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {returning === item.id ? (
                            <div className="w-3 h-3 border border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                          ) : (
                            <RotateCcw className="w-3 h-3" />
                          )}
                          Kembalikan
                        </button>
                      )}
                      {item.status === "DIKEMBALIKAN" && (
                        <span className="text-xs text-zinc-600 flex items-center gap-1 justify-end">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Selesai
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Monthly Summary */}
      {Object.keys(monthlyStats).length > 0 && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Rekap Bulanan
          </h3>
          <div className="space-y-3">
            {Object.entries(monthlyStats)
              .sort(([a], [b]) => b.localeCompare(a))
              .slice(0, 6)
              .map(([month, count]) => {
                const max = Math.max(...Object.values(monthlyStats));
                const pct = Math.round((count / max) * 100);
                return (
                  <div key={month} className="flex items-center gap-4">
                    <span className="text-sm text-zinc-400 w-36 shrink-0">{month}</span>
                    <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-white w-8 text-right">{count}</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

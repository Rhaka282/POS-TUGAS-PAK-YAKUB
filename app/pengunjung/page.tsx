"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Monitor,
  Search,
  Package,
  LogOut,
  Cpu,
  HardDrive,
  Clock,
  CheckCircle2,
  ClipboardList,
  Laptop,
  X,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  brand: string;
  sellPrice: number;
  stock: number;
  specs?: string;
  description?: string;
};

type Peminjaman = {
  id: string;
  status: "DIPINJAM" | "DIKEMBALIKAN";
  tanggalPinjam: string;
  tanggalKembali: string | null;
  product: { name: string; brand: string };
};

const brandColors: Record<string, string> = {
  ASUS: "from-blue-500/20 to-blue-600/5 border-blue-500/30 text-blue-400",
  ROG: "from-red-500/20 to-red-600/5 border-red-500/30 text-red-400",
  Acer: "from-green-500/20 to-green-600/5 border-green-500/30 text-green-400",
  Lenovo: "from-orange-500/20 to-orange-600/5 border-orange-500/30 text-orange-400",
  HP: "from-indigo-500/20 to-indigo-600/5 border-indigo-500/30 text-indigo-400",
  Dell: "from-cyan-500/20 to-cyan-600/5 border-cyan-500/30 text-cyan-400",
  MSI: "from-yellow-500/20 to-yellow-600/5 border-yellow-500/30 text-yellow-400",
  Apple: "from-zinc-400/20 to-zinc-500/5 border-zinc-400/30 text-zinc-300",
  Advan: "from-purple-500/20 to-purple-600/5 border-purple-500/30 text-purple-400",
};

function getBrandColor(brand: string) {
  return (
    brandColors[brand] ??
    "from-purple-500/20 to-purple-600/5 border-purple-500/30 text-purple-400"
  );
}

export default function PengunjungPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [peminjaman, setPeminjaman] = useState<Peminjaman[]>([]);
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"katalog" | "riwayat">("katalog");
  const [borrowing, setBorrowing] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const fetchProducts = () =>
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []));

  const fetchPeminjaman = () =>
    fetch("/api/peminjaman")
      .then((r) => r.json())
      .then((data) => setPeminjaman(Array.isArray(data) ? data : []));

  useEffect(() => {
    Promise.all([fetchProducts(), fetchPeminjaman()]).finally(() => setLoading(false));
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleBorrow = async (productId: string) => {
    setBorrowing(productId);
    setConfirmId(null);
    try {
      const res = await fetch("/api/peminjaman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Berhasil meminjam laptop! Stok otomatis berkurang.`, "success");
        await Promise.all([fetchProducts(), fetchPeminjaman()]);
        setActiveTab("riwayat");
      } else {
        showToast(data.message || "Gagal meminjam laptop", "error");
      }
    } catch {
      showToast("Terjadi kesalahan, coba lagi", "error");
    } finally {
      setBorrowing(null);
    }
  };

  const brands = ["Semua", ...Array.from(new Set(products.map((p) => p.brand)))];

  const filtered = products.filter((p) => {
    const matchBrand = selectedBrand === "Semua" || p.brand === selectedBrand;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    return matchBrand && matchSearch;
  });

  // Check if user already has active borrow for a product
  const activeBorrowIds = new Set(
    peminjaman.filter((p) => p.status === "DIPINJAM").map((p: any) => p.productId ?? "")
  );

  return (
    <div className="min-h-screen bg-[#080c14] text-white">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[120px]" />
      </div>

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
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          {toast.message}
        </div>
      )}

      {/* Confirm Modal */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Konfirmasi Peminjaman</h3>
              <button
                onClick={() => setConfirmId(null)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <Laptop className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    {products.find((p) => p.id === confirmId)?.name}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {products.find((p) => p.id === confirmId)?.brand}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-zinc-400 mb-6">
              Anda akan meminjam laptop ini. Stok akan berkurang otomatis setelah konfirmasi.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => handleBorrow(confirmId)}
                disabled={borrowing === confirmId}
                className="flex-1 py-2.5 text-sm font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all disabled:opacity-50"
              >
                {borrowing === confirmId ? "Memproses..." : "Ya, Pinjam!"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-[#080c14]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Monitor className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">LaptopVerse</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full">
              <div className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="text-xs text-purple-300 font-medium">Pengunjung</span>
            </div>
            <span className="hidden sm:block text-sm text-zinc-400">{session?.user?.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl border border-white/[0.06] hover:border-red-500/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">
            Selamat Datang,{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {session?.user?.name}
            </span>
          </h1>
          <p className="text-zinc-400">Temukan dan pinjam laptop yang kamu butuhkan.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/[0.06] pb-0">
          <button
            onClick={() => setActiveTab("katalog")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === "katalog"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-zinc-500 hover:text-white"
            }`}
          >
            <Package className="w-4 h-4" />
            Katalog Laptop
          </button>
          <button
            onClick={() => setActiveTab("riwayat")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all relative ${
              activeTab === "riwayat"
                ? "border-purple-500 text-purple-400"
                : "border-transparent text-zinc-500 hover:text-white"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Riwayat Peminjaman
            {peminjaman.filter((p) => p.status === "DIPINJAM").length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                {peminjaman.filter((p) => p.status === "DIPINJAM").length}
              </span>
            )}
          </button>
        </div>

        {/* =================== TAB: KATALOG =================== */}
        {activeTab === "katalog" && (
          <>
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Cari nama laptop atau brand..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-xl border transition-all ${
                      selectedBrand === brand
                        ? "bg-blue-500/20 border-blue-500/40 text-blue-300"
                        : "bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6 text-sm text-zinc-500">
              <Package className="w-4 h-4 text-zinc-600" />
              <span>
                <span className="text-white font-semibold">{filtered.length}</span> produk ditemukan
              </span>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 animate-pulse">
                    <div className="h-4 bg-white/10 rounded-lg w-1/3 mb-3" />
                    <div className="h-6 bg-white/10 rounded-lg w-4/5 mb-2" />
                    <div className="h-4 bg-white/10 rounded-lg w-full mb-4" />
                    <div className="h-8 bg-white/10 rounded-lg w-full" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-zinc-600" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-400 mb-2">Produk tidak ditemukan</h3>
                <p className="text-sm text-zinc-600">Coba ubah kata kunci pencarian atau filter brand.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((product) => {
                  const colorClass = getBrandColor(product.brand);
                  const [from, to, border, text] = colorClass.split(" ");
                  const isOutOfStock = product.stock <= 0;
                  const alreadyBorrowed = activeBorrowIds.has(product.id);
                  return (
                    <div
                      key={product.id}
                      className={`group relative bg-gradient-to-br ${from} ${to} border ${border} rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl flex flex-col`}
                    >
                      {/* Brand badge */}
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border ${border} mb-4 w-fit`}>
                        <Cpu className={`w-3 h-3 ${text}`} />
                        <span className={`text-xs font-bold ${text}`}>{product.brand}</span>
                      </div>

                      {/* Name */}
                      <h3 className="font-bold text-white text-base leading-snug mb-2 line-clamp-2 group-hover:text-blue-100 transition-colors">
                        {product.name}
                      </h3>

                      {/* Specs */}
                      {product.specs && (
                        <div className="flex items-start gap-1.5 mb-3">
                          <HardDrive className="w-3.5 h-3.5 text-zinc-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-zinc-500 line-clamp-2">{product.specs}</p>
                        </div>
                      )}

                      {/* Stock */}
                      <div className={`flex items-center justify-between pt-3 border-t ${border} mb-4 mt-auto`}>
                        <span className="text-xs text-zinc-500">Stok tersedia</span>
                        <span className={`text-sm font-bold ${product.stock > 0 ? "text-green-400" : "text-red-400"}`}>
                          {product.stock > 0 ? `${product.stock} unit` : "Habis"}
                        </span>
                      </div>

                      {/* Pinjam Button */}
                      {alreadyBorrowed ? (
                        <div className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                          <Clock className="w-3.5 h-3.5" />
                          Sedang Dipinjam
                        </div>
                      ) : isOutOfStock ? (
                        <div className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-zinc-600 cursor-not-allowed">
                          Stok Habis
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmId(product.id)}
                          disabled={borrowing === product.id}
                          className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {borrowing === product.id ? (
                            <div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Laptop className="w-3.5 h-3.5" />
                          )}
                          Pinjam Laptop
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* =================== TAB: RIWAYAT =================== */}
        {activeTab === "riwayat" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-zinc-400 text-sm">
                Total{" "}
                <span className="text-white font-semibold">{peminjaman.length}</span> riwayat peminjaman
              </p>
              {peminjaman.filter((p) => p.status === "DIPINJAM").length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs text-amber-400 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {peminjaman.filter((p) => p.status === "DIPINJAM").length} laptop sedang dipinjam
                </div>
              )}
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-white/[0.03] rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : peminjaman.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="w-8 h-8 text-zinc-600" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-400 mb-2">Belum ada peminjaman</h3>
                <p className="text-sm text-zinc-600 mb-4">Kamu belum pernah meminjam laptop.</p>
                <button
                  onClick={() => setActiveTab("katalog")}
                  className="px-5 py-2.5 text-sm font-medium rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all"
                >
                  Lihat Katalog
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {peminjaman.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          item.status === "DIPINJAM"
                            ? "bg-amber-500/10 border border-amber-500/20"
                            : "bg-emerald-500/10 border border-emerald-500/20"
                        }`}
                      >
                        {item.status === "DIPINJAM" ? (
                          <Clock className="w-5 h-5 text-amber-400" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {item.product.brand} — {item.product.name}
                        </p>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          Dipinjam:{" "}
                          {new Date(item.tanggalPinjam).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                          {item.tanggalKembali &&
                            ` • Dikembalikan: ${new Date(item.tanggalKembali).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}`}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                        item.status === "DIPINJAM"
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.status === "DIPINJAM" ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
                        }`}
                      />
                      {item.status === "DIPINJAM" ? "Dipinjam" : "Dikembalikan"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

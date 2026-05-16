"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ShoppingCart, BarChart3, Package, Shield, Zap, Star, ArrowRight, Monitor, Cpu, HardDrive, Menu, X } from "lucide-react";

const brands = ["ASUS", "ROG", "Acer", "Lenovo", "HP", "Dell", "MSI", "Apple"];

const features = [
  { icon: Package, title: "Manajemen Stok", desc: "Pantau inventaris laptop secara real-time. Notifikasi otomatis saat stok menipis.", color: "blue" },
  { icon: ShoppingCart, title: "Kasir Cepat", desc: "Proses transaksi penjualan dalam hitungan detik dengan antarmuka yang intuitif.", color: "purple" },
  { icon: BarChart3, title: "Laporan Keuangan", desc: "Analitik mendalam tentang penjualan, pembelian, dan arus kas toko Anda.", color: "cyan" },
  { icon: Shield, title: "Keamanan Data", desc: "Sistem autentikasi berlapis melindungi data penjualan dan inventaris Anda.", color: "green" },
  { icon: Zap, title: "Performa Tinggi", desc: "Dibangun dengan Next.js & MySQL untuk kecepatan dan keandalan maksimal.", color: "yellow" },
  { icon: Star, title: "Mudah Digunakan", desc: "Antarmuka modern yang intuitif. Tidak perlu pelatihan panjang untuk tim Anda.", color: "pink" },
];

const stats = [
  { value: "500+", label: "Toko Terpercaya" },
  { value: "50K+", label: "Transaksi/Bulan" },
  { value: "8+", label: "Merek Laptop" },
  { value: "99.9%", label: "Uptime" },
];

const colorMap: Record<string, string> = {
  blue: "from-blue-500/20 to-blue-600/5 border-blue-500/30 text-blue-400",
  purple: "from-purple-500/20 to-purple-600/5 border-purple-500/30 text-purple-400",
  cyan: "from-cyan-500/20 to-cyan-600/5 border-cyan-500/30 text-cyan-400",
  green: "from-green-500/20 to-green-600/5 border-green-500/30 text-green-400",
  yellow: "from-yellow-500/20 to-yellow-600/5 border-yellow-500/30 text-yellow-400",
  pink: "from-pink-500/20 to-pink-600/5 border-pink-500/30 text-pink-400",
};

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentBrand, setCurrentBrand] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBrand((prev) => (prev + 1) % brands.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#080c14] text-white overflow-x-hidden">
      {/* Ambient BG */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-600/5 rounded-full blur-[150px]" />
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#080c14]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl" : ""}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              LaptopVerse
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#fitur" className="text-sm text-zinc-400 hover:text-white transition-colors">Fitur</a>
            <a href="#brand" className="text-sm text-zinc-400 hover:text-white transition-colors">Brand</a>
            <a href="#statistik" className="text-sm text-zinc-400 hover:text-white transition-colors">Statistik</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm text-zinc-300 hover:text-white transition-colors">
              Masuk
            </Link>
            <Link href="/register" className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/25">
              Mulai Gratis
            </Link>
          </div>

          <button className="md:hidden text-zinc-400" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-[#0d1320] border-t border-white/5 px-6 py-4 flex flex-col gap-4">
            <a href="#fitur" className="text-sm text-zinc-400" onClick={() => setMenuOpen(false)}>Fitur</a>
            <a href="#brand" className="text-sm text-zinc-400" onClick={() => setMenuOpen(false)}>Brand</a>
            <a href="#statistik" className="text-sm text-zinc-400" onClick={() => setMenuOpen(false)}>Statistik</a>
            <Link href="/login" className="text-sm text-zinc-300">Masuk</Link>
            <Link href="/register" className="px-5 py-2 text-sm font-semibold text-center bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl">
              Mulai Gratis
            </Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center py-20">
          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
              <Zap className="w-3.5 h-3.5" />
              Sistem POS Toko Laptop #1 di Indonesia
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
              Kelola Toko Laptop{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Lebih Cerdas
              </span>
            </h1>

            <p className="text-lg text-zinc-400 leading-relaxed mb-10 max-w-lg">
              Platform manajemen toko laptop all-in-one. Dari kasir, stok inventaris, pembelian, hingga laporan keuangan — semua dalam satu dashboard yang elegan.
            </p>

            {/* Brand ticker */}
            <div className="flex items-center gap-3 mb-10">
              <span className="text-xs text-zinc-500 uppercase tracking-widest">Brand tersedia:</span>
              <div className="relative overflow-hidden h-7 w-28">
                {brands.map((brand, i) => (
                  <span
                    key={brand}
                    className={`absolute inset-0 flex items-center font-bold text-sm bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent transition-all duration-500 ${i === currentBrand ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/register" className="group flex items-center gap-2 px-7 py-4 font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5">
                Coba Sekarang — Gratis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="flex items-center gap-2 px-7 py-4 font-semibold text-zinc-300 rounded-2xl border border-zinc-700 hover:border-zinc-500 hover:text-white transition-all hover:-translate-y-0.5">
                Sudah Punya Akun
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl scale-110" />
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
              <Image
                src="/laptop_hero.png"
                alt="LaptopVerse Hero"
                width={700}
                height={450}
                className="w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080c14]/60 via-transparent to-transparent" />
            </div>

            {/* Floating cards */}
            <div className="absolute -bottom-6 -left-6 bg-[#0d1a2d] border border-blue-500/20 rounded-2xl p-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-xs text-zinc-500">Penjualan Hari Ini</div>
                  <div className="text-lg font-bold text-white">Rp 24.500.000</div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-[#0d1a2d] border border-cyan-500/20 rounded-2xl p-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="text-xs text-zinc-500">Stok Aktif</div>
                  <div className="text-lg font-bold text-white">284 Unit</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="statistik" className="py-16 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="relative group bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 text-center hover:border-blue-500/30 transition-all">
                <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="fitur" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
              <Star className="w-3.5 h-3.5" />
              Fitur Unggulan
            </div>
            <h2 className="text-4xl lg:text-5xl font-black mb-4">
              Semua yang Anda Butuhkan{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Ada Di Sini
              </span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Dirancang khusus untuk toko laptop Indonesia dengan fitur lengkap dan antarmuka yang intuitif.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              const colors = colorMap[feat.color];
              return (
                <div key={feat.title} className={`group relative bg-gradient-to-br ${colors.split(" ").slice(0, 2).join(" ")} border ${colors.split(" ")[2]} rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.split(" ").slice(0, 2).join(" ")} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${colors.split(" ")[3]}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BRANDS */}
      <section id="brand" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
                <Cpu className="w-3.5 h-3.5" />
                Multi-Brand Support
              </div>
              <h2 className="text-4xl lg:text-5xl font-black mb-6">
                Semua Brand{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Laptop Populer
                </span>
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                LaptopVerse mendukung manajemen produk untuk semua merek laptop ternama. Kategorisasi otomatis dan filter cerdas memudahkan pencarian stok.
              </p>

              <div className="grid grid-cols-4 gap-3">
                {brands.map((brand) => (
                  <div key={brand} className="group bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.07] hover:border-blue-500/30 rounded-xl py-3 text-center text-sm font-bold text-zinc-400 hover:text-white transition-all cursor-default">
                    {brand}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-3xl blur-3xl scale-110" />
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src="/laptop_brands.png"
                  alt="Brand Laptop"
                  width={700}
                  height={500}
                  className="w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080c14]/70 via-transparent to-transparent" />
              </div>

              {/* Spec pills */}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                {[
                  { icon: Cpu, label: "Intel / AMD / Apple M" },
                  { icon: HardDrive, label: "SSD NVMe Support" },
                  { icon: Monitor, label: "Multi-spec Tracking" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 px-3 py-2 bg-[#080c14]/80 backdrop-blur-md rounded-xl border border-white/10 text-xs text-zinc-300">
                    <Icon className="w-3.5 h-3.5 text-cyan-400" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="relative bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-cyan-600/20 border border-white/10 rounded-3xl p-12 lg:p-16 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-black mb-6">
                Siap Tingkatkan Penjualan{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Toko Anda?
                </span>
              </h2>
              <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
                Bergabunglah dengan ratusan toko laptop yang sudah menggunakan LaptopVerse. Daftar sekarang, gratis selamanya untuk paket dasar.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/register" className="group flex items-center gap-2 px-8 py-4 font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5 text-lg">
                  Daftar Sekarang — Gratis
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/login" className="flex items-center gap-2 px-8 py-4 font-semibold text-zinc-300 rounded-2xl border border-zinc-700 hover:border-zinc-500 hover:text-white transition-all hover:-translate-y-0.5 text-lg">
                  Masuk ke Akun
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <Monitor className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">LaptopVerse</span>
          </div>
          <p className="text-sm text-zinc-600">© 2025 LaptopVerse. Platform POS Toko Laptop Modern.</p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm text-zinc-500 hover:text-white transition-colors">Masuk</Link>
            <Link href="/register" className="text-sm text-zinc-500 hover:text-white transition-colors">Daftar</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

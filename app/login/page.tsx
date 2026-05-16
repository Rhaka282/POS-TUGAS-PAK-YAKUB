"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Monitor, Eye, EyeOff, ArrowRight, Zap, Shield, BarChart3,
  Loader2, ShieldCheck, Users,
} from "lucide-react";

const highlights = [
  { icon: Zap, text: "Kasir super cepat" },
  { icon: Shield, text: "Data aman & terenkripsi" },
  { icon: BarChart3, text: "Laporan real-time" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email atau password salah. Silakan coba lagi.");
      setLoading(false);
    } else {
      // Fetch session to get role, then redirect accordingly
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = session?.user?.role;
      if (role === "ADMIN") {
        router.push("/dashboard");
      } else {
        router.push("/pengunjung");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] flex">
      {/* Ambient BG */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[150px]" />
      </div>

      {/* Left Panel — Form */}
      <div className="relative z-10 flex w-full lg:w-1/2 items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">

          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 mb-10 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              LaptopVerse
            </span>
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">
              Selamat Datang
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Kembali! 👋
              </span>
            </h1>
            <p className="text-zinc-500 text-sm">
              Masuk untuk mengelola toko laptop Anda.
            </p>
          </div>

          {/* Role Info Badges */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl px-3 py-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div>
                <div className="text-xs font-bold text-blue-300">Admin</div>
                <div className="text-[10px] text-zinc-500">Akses penuh dashboard</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl px-3 py-2.5">
              <Users className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <div>
                <div className="text-xs font-bold text-purple-300">Pengunjung</div>
                <div className="text-[10px] text-zinc-500">Lihat katalog produk</div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@laptopverse.id"
                className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-blue-500/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-blue-500/30 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2 py-4 px-6 font-bold text-white text-sm bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 disabled:shadow-none mt-2"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</>
              ) : (
                <><span>Masuk ke LaptopVerse</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-600">
            Belum punya akun?{" "}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel — Visual */}
      <div className="hidden lg:flex relative w-1/2 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/laptop_hero.png" alt="LaptopVerse" fill className="object-cover opacity-60 scale-105" priority />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#080c14]/40 to-[#080c14]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col justify-end p-14 w-full">
          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { label: "Unit Terjual", value: "1,284", color: "text-blue-400" },
              { label: "Omset Bulan Ini", value: "Rp 487M", color: "text-cyan-400" },
              { label: "Brand Aktif", value: "8 Brand", color: "text-purple-400" },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                <div className={`text-lg font-black ${s.color} mb-1`}>{s.value}</div>
                <div className="text-xs text-zinc-500">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                <Monitor className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white text-lg">LaptopVerse</span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed mb-5">
              Platform POS terbaik untuk toko laptop. Kelola inventaris, transaksi, dan laporan dalam satu sistem.
            </p>
            <div className="space-y-2.5">
              {highlights.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <span className="text-sm text-zinc-300">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

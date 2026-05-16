"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Monitor, Eye, EyeOff, ArrowRight, CheckCircle2,
  Package, ShoppingCart, BarChart3, Loader2,
  ShieldCheck, Users,
} from "lucide-react";

type Role = "ADMIN" | "PENGUNJUNG";

const perks = [
  { icon: Package, text: "Manajemen stok multi-brand" },
  { icon: ShoppingCart, text: "Kasir & checkout instan" },
  { icon: BarChart3, text: "Laporan keuangan lengkap" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("PENGUNJUNG");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Terjadi kesalahan.");
      }

      router.push("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength =
    password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Lemah", "Sedang", "Kuat"];
  const strengthColor = ["", "bg-red-500", "bg-yellow-500", "bg-green-500"];

  return (
    <div className="min-h-screen bg-[#080c14] flex flex-row-reverse">
      {/* Ambient BG */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[150px]" />
      </div>

      {/* Right Panel — Form */}
      <div className="relative z-10 flex w-full lg:w-1/2 items-center justify-center p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md py-6">

          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              LaptopVerse
            </span>
          </Link>

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">
              Buat Akun
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Sekarang! 🚀
              </span>
            </h1>
            <p className="text-zinc-500 text-sm">Gratis selamanya. Mulai kelola toko laptop Anda hari ini.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selector */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Daftar Sebagai
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("ADMIN")}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                    role === "ADMIN"
                      ? "bg-blue-500/15 border-blue-500/50 shadow-lg shadow-blue-500/10"
                      : "bg-white/[0.03] border-white/[0.08] hover:border-white/20"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${role === "ADMIN" ? "bg-blue-500/30" : "bg-white/5"}`}>
                    <ShieldCheck className={`w-5 h-5 ${role === "ADMIN" ? "text-blue-400" : "text-zinc-500"}`} />
                  </div>
                  <div className="text-left">
                    <div className={`text-sm font-bold ${role === "ADMIN" ? "text-blue-300" : "text-zinc-400"}`}>Admin</div>
                    <div className="text-[10px] text-zinc-600">Akses penuh</div>
                  </div>
                  {role === "ADMIN" && (
                    <CheckCircle2 className="w-4 h-4 text-blue-400 ml-auto flex-shrink-0" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setRole("PENGUNJUNG")}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                    role === "PENGUNJUNG"
                      ? "bg-purple-500/15 border-purple-500/50 shadow-lg shadow-purple-500/10"
                      : "bg-white/[0.03] border-white/[0.08] hover:border-white/20"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${role === "PENGUNJUNG" ? "bg-purple-500/30" : "bg-white/5"}`}>
                    <Users className={`w-5 h-5 ${role === "PENGUNJUNG" ? "text-purple-400" : "text-zinc-500"}`} />
                  </div>
                  <div className="text-left">
                    <div className={`text-sm font-bold ${role === "PENGUNJUNG" ? "text-purple-300" : "text-zinc-400"}`}>Pengunjung</div>
                    <div className="text-[10px] text-zinc-600">Lihat katalog</div>
                  </div>
                  {role === "PENGUNJUNG" && (
                    <CheckCircle2 className="w-4 h-4 text-purple-400 ml-auto flex-shrink-0" />
                  )}
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-purple-500/30 transition-all"
              />
            </div>

            {/* Email */}
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
                className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-purple-500/30 transition-all"
              />
            </div>

            {/* Password */}
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
                  className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-purple-500/30 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2.5 space-y-1.5">
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${passwordStrength >= level ? strengthColor[passwordStrength] : "bg-white/10"}`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${passwordStrength === 1 ? "text-red-400" : passwordStrength === 2 ? "text-yellow-400" : "text-green-400"}`}>
                    Kekuatan password: {strengthLabel[passwordStrength]}
                  </p>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2 py-4 px-6 font-bold text-white text-sm bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 disabled:shadow-none mt-1"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Mendaftarkan akun...</>
              ) : (
                <><CheckCircle2 className="w-4 h-4" /><span>Buat Akun sebagai {role === "ADMIN" ? "Admin" : "Pengunjung"}</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-600">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>

      {/* Left Panel — Visual */}
      <div className="hidden lg:flex relative w-1/2 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/laptop_brands.png" alt="LaptopVerse Brands" fill className="object-cover opacity-50 scale-105" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#080c14]/40 to-[#080c14]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col justify-end p-14 w-full">
          <div className="flex flex-wrap gap-2 mb-10">
            {["ASUS", "ROG", "Acer", "Lenovo", "HP", "Dell", "MSI", "Apple"].map((brand) => (
              <span key={brand} className="px-3 py-1.5 text-xs font-bold bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-zinc-300 hover:border-purple-500/30 hover:text-purple-300 transition-colors cursor-default">
                {brand}
              </span>
            ))}
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl flex items-center justify-center">
                <Monitor className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-white">LaptopVerse</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-xs text-green-400">Gratis untuk mulai</span>
                </div>
              </div>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed mb-5">
              Bergabunglah dengan ratusan toko laptop yang sudah mempercayai LaptopVerse.
            </p>
            <div className="space-y-2.5">
              {perks.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-purple-400" />
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

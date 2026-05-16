"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Laptop, 
  ShoppingCart, 
  CreditCard, 
  BarChart3, 
  LogOut,
  Menu,
  X,
  ClipboardList
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Produk", href: "/dashboard/products", icon: Laptop },
  { name: "Peminjaman", href: "/dashboard/peminjaman", icon: ClipboardList },
  { name: "Pembelian", href: "/dashboard/purchases", icon: ShoppingCart },
  { name: "Penjualan", href: "/dashboard/sales", icon: CreditCard },
  { name: "Laporan", href: "/dashboard/reports", icon: BarChart3 },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm lg:hidden ${sidebarOpen ? "block" : "hidden"}`} onClick={() => setSidebarOpen(false)} />
      
      <div className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-zinc-800 bg-zinc-950 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-full flex-col">
          <div className="flex h-16 shrink-0 items-center px-6 border-b border-zinc-800">
            <Laptop className="h-8 w-8 text-blue-500" />
            <span className="ml-3 text-xl font-bold text-white tracking-tight">Laptop POS</span>
            <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6 text-zinc-400" />
            </button>
          </div>
          
          <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
            <nav className="flex-1 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-zinc-800 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-zinc-900 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-blue-500 font-bold">
                {session?.user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex flex-1 flex-col truncate">
                <span className="truncate text-sm font-medium text-white">{session?.user?.name}</span>
                <span className="truncate text-xs text-zinc-500">{session?.user?.email}</span>
              </div>
              <button 
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:pl-72 min-h-screen">
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-zinc-800 bg-zinc-950/80 px-4 backdrop-blur-md sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-zinc-400 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h1 className="text-xl font-semibold text-white truncate">
                {navigation.find(n => pathname === n.href || (pathname.startsWith(n.href) && n.href !== "/dashboard"))?.name || "Dashboard"}
              </h1>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Plus, Search, X, PackagePlus } from "lucide-react";
import { addPurchase } from "@/app/actions/purchase";

export default function PurchaseClient({ initialPurchases, products, suppliers }: any) {
  const [purchases, setPurchases] = useState(initialPurchases);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
  };

  const filteredPurchases = purchases.filter((p: any) => 
    p.product.name.toLowerCase().includes(search.toLowerCase()) || 
    p.supplier.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    await addPurchase(formData);
    window.location.reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Cari transaksi pembelian..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <PackagePlus className="h-4 w-4" /> Restock Produk
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">Tanggal</th>
                <th className="px-6 py-4 font-medium">Produk</th>
                <th className="px-6 py-4 font-medium">Supplier</th>
                <th className="px-6 py-4 font-medium">Jumlah</th>
                <th className="px-6 py-4 font-medium">Total Harga Beli</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((purchase: any) => (
                  <tr key={purchase.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 text-zinc-300">
                      {new Date(purchase.date).toLocaleDateString("id-ID", {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{purchase.product.name}</div>
                      <div className="text-xs text-zinc-500">{purchase.product.brand}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">{purchase.supplier.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        +{purchase.quantity} Unit
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-white">
                      {formatIDR(purchase.buyPrice * purchase.quantity)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                    Tidak ada data pembelian ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h3 className="text-lg font-semibold text-white">Restock Produk</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Produk Laptop</label>
                  <select required name="productId" className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="">-- Pilih Produk --</option>
                    {products.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.brand}) - Sisa Stok: {p.stock}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Supplier Baru</label>
                  <input name="supplierName" type="text" className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nama Supplier (jika kosong, dianggap General Supplier)" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Jumlah (Unit)</label>
                    <input required name="quantity" type="number" min="1" className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="10" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Harga Beli Satuan (Rp)</label>
                    <input required name="buyPrice" type="number" min="0" className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="15000000" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors disabled:opacity-70">
                  {loading ? "Menyimpan..." : "Simpan Pembelian"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

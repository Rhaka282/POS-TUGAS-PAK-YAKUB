"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Search, X } from "lucide-react";
import { addProduct, deleteProduct, updateProduct } from "@/app/actions/product";

export default function ProductClient({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    if (editingId) {
      await updateProduct(editingId, formData);
    } else {
      await addProduct(formData);
    }
    
    // Refresh page to get new data
    window.location.reload();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      await deleteProduct(id);
      window.location.reload();
    }
  };

  const openEditModal = (product: any) => {
    setEditingId(product.id);
    setIsModalOpen(true);
    // Let's rely on form defaultValues to populate data
    setTimeout(() => {
      const form = document.getElementById("productForm") as HTMLFormElement;
      if (form) {
        (form.elements.namedItem("name") as HTMLInputElement).value = product.name;
        (form.elements.namedItem("brand") as HTMLInputElement).value = product.brand;
        (form.elements.namedItem("buyPrice") as HTMLInputElement).value = product.buyPrice.toString();
        (form.elements.namedItem("sellPrice") as HTMLInputElement).value = product.sellPrice.toString();
        (form.elements.namedItem("stock") as HTMLInputElement).value = product.stock.toString();
        (form.elements.namedItem("specs") as HTMLInputElement).value = product.specs || "";
        (form.elements.namedItem("description") as HTMLInputElement).value = product.description || "";
      }
    }, 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Cari nama laptop atau merek..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" /> Tambah Produk
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">Nama Laptop</th>
                <th className="px-6 py-4 font-medium">Merek</th>
                <th className="px-6 py-4 font-medium">Stok</th>
                <th className="px-6 py-4 font-medium">Harga Beli</th>
                <th className="px-6 py-4 font-medium">Harga Jual</th>
                <th className="px-6 py-4 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{product.name}</div>
                      <div className="text-xs text-zinc-500 truncate max-w-xs">{product.specs}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {product.brand}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${product.stock <= 5 ? "text-red-400" : "text-white"}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{formatIDR(product.buyPrice)}</td>
                    <td className="px-6 py-4 font-medium text-emerald-400">{formatIDR(product.sellPrice)}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => openEditModal(product)} className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-400/10 rounded-lg transition-colors">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-300 p-2 hover:bg-red-400/10 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                    Tidak ada data produk ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h3 className="text-lg font-semibold text-white">
                {editingId ? "Edit Produk" : "Tambah Produk Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form id="productForm" onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Nama Laptop</label>
                  <input required name="name" type="text" className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: ROG Strix G15" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Merek</label>
                  <input required name="brand" type="text" className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: ASUS" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Harga Beli (Rp)</label>
                  <input required name="buyPrice" type="number" min="0" className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="15000000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Harga Jual (Rp)</label>
                  <input required name="sellPrice" type="number" min="0" className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="17000000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Stok Awal {editingId && "(Ubah Stok via Pembelian/Penjualan)"}</label>
                  <input required={!editingId} name="stock" type="number" min="0" disabled={!!editingId} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50" placeholder="10" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Spesifikasi Singkat</label>
                <input name="specs" type="text" className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Intel i7, 16GB RAM, 512GB SSD, RTX 3060" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Deskripsi</label>
                <textarea name="description" rows={3} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Catatan tambahan..."></textarea>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors disabled:opacity-70">
                  {loading ? "Menyimpan..." : "Simpan Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

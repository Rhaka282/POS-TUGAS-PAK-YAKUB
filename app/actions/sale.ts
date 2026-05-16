"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addSale(formData: FormData) {
  try {
    const productId = formData.get("productId") as string;
    const customerName = formData.get("customerName") as string;
    const quantity = parseInt(formData.get("quantity") as string);
    const sellPrice = parseFloat(formData.get("sellPrice") as string);
    const totalPrice = quantity * sellPrice;

    // Cek stok terlebih dahulu
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { success: false, error: "Produk tidak ditemukan" };
    }

    if (product.stock < quantity) {
      return { success: false, error: "Stok tidak mencukupi" };
    }

    await prisma.$transaction([
      prisma.sale.create({
        data: {
          productId,
          customerName: customerName || "Pelanggan Umum",
          quantity,
          sellPrice,
          totalPrice,
        },
      }),
      prisma.product.update({
        where: { id: productId },
        data: {
          stock: { decrement: quantity },
        },
      }),
    ]);

    revalidatePath("/dashboard/sales");
    revalidatePath("/dashboard/products");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Error adding sale:", error);
    return { success: false, error: "Gagal menambah data penjualan" };
  }
}

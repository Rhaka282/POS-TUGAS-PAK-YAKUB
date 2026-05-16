"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const brand = formData.get("brand") as string;
    const buyPrice = parseFloat(formData.get("buyPrice") as string);
    const sellPrice = parseFloat(formData.get("sellPrice") as string);
    const stock = parseInt(formData.get("stock") as string) || 0;
    const specs = formData.get("specs") as string;
    const description = formData.get("description") as string;

    await prisma.product.create({
      data: {
        name,
        brand,
        buyPrice,
        sellPrice,
        stock,
        specs,
        description,
      },
    });

    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    console.error("Error adding product:", error);
    return { success: false, error: "Gagal menambah produk" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Gagal menghapus produk" };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const brand = formData.get("brand") as string;
    const buyPrice = parseFloat(formData.get("buyPrice") as string);
    const sellPrice = parseFloat(formData.get("sellPrice") as string);
    const specs = formData.get("specs") as string;
    const description = formData.get("description") as string;

    await prisma.product.update({
      where: { id },
      data: {
        name,
        brand,
        buyPrice,
        sellPrice,
        specs,
        description,
      },
    });

    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Gagal mengupdate produk" };
  }
}

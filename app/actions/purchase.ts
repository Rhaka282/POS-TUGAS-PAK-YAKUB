"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addPurchase(formData: FormData) {
  try {
    const productId = formData.get("productId") as string;
    const supplierId = formData.get("supplierId") as string;
    const quantity = parseInt(formData.get("quantity") as string);
    const buyPrice = parseFloat(formData.get("buyPrice") as string);

    // Default supplier if none selected/provided. Usually we want to create one on the fly or select from existing.
    // For simplicity, we create a generic supplier if empty or just use the string as name if we change the form.
    // Wait, let's look at schema. Supplier has id, name.
    let finalSupplierId = supplierId;
    if (!finalSupplierId || finalSupplierId === "new") {
      const supplierName = formData.get("supplierName") as string;
      const supplier = await prisma.supplier.create({
        data: { name: supplierName || "General Supplier" }
      });
      finalSupplierId = supplier.id;
    }

    await prisma.$transaction([
      prisma.purchase.create({
        data: {
          productId,
          supplierId: finalSupplierId,
          quantity,
          buyPrice,
        },
      }),
      prisma.product.update({
        where: { id: productId },
        data: {
          stock: { increment: quantity },
        },
      }),
    ]);

    revalidatePath("/dashboard/purchases");
    revalidatePath("/dashboard/products");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Error adding purchase:", error);
    return { success: false, error: "Gagal menambah data pembelian" };
  }
}

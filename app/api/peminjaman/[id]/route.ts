import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// PATCH - Return laptop (Admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { role: string };
    if (user.role !== "ADMIN") {
      return NextResponse.json({ message: "Hanya admin yang dapat mengembalikan laptop" }, { status: 403 });
    }

    const { id } = params;

    // Find the peminjaman
    const peminjaman = await prisma.peminjaman.findUnique({ where: { id } });
    if (!peminjaman) {
      return NextResponse.json({ message: "Data peminjaman tidak ditemukan" }, { status: 404 });
    }
    if (peminjaman.status === "DIKEMBALIKAN") {
      return NextResponse.json({ message: "Laptop sudah dikembalikan sebelumnya" }, { status: 400 });
    }

    // Update status and increment stock atomically
    const [updated] = await prisma.$transaction([
      prisma.peminjaman.update({
        where: { id },
        data: {
          status: "DIKEMBALIKAN",
          tanggalKembali: new Date(),
        },
        include: {
          user: { select: { name: true } },
          product: { select: { name: true, brand: true } },
        },
      }),
      prisma.product.update({
        where: { id: peminjaman.productId },
        data: { stock: { increment: 1 } },
      }),
    ]);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error returning laptop:", error);
    return NextResponse.json({ message: "Gagal mengembalikan laptop" }, { status: 500 });
  }
}

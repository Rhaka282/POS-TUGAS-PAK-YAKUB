import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { id: string; role: string };

    // Admin can see all, pengunjung can only see their own
    const where = user.role === "ADMIN" ? {} : { userId: user.id };

    const peminjaman = await prisma.peminjaman.findMany({
      where,
      orderBy: { tanggalPinjam: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, name: true, brand: true, specs: true } },
      },
    });

    return NextResponse.json(peminjaman);
  } catch (error) {
    console.error("Error fetching peminjaman:", error);
    return NextResponse.json({ message: "Gagal mengambil data peminjaman" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { id: string; name: string; role: string };
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ message: "productId diperlukan" }, { status: 400 });
    }

    // Check product exists and has stock
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ message: "Produk tidak ditemukan" }, { status: 404 });
    }
    if (product.stock <= 0) {
      return NextResponse.json({ message: "Stok laptop habis, tidak dapat dipinjam" }, { status: 400 });
    }

    // Check if user already has an active borrowing for this product
    const existingBorrow = await prisma.peminjaman.findFirst({
      where: { userId: user.id, productId, status: "DIPINJAM" },
    });
    if (existingBorrow) {
      return NextResponse.json({ message: "Anda sudah meminjam laptop ini" }, { status: 400 });
    }

    // Create peminjaman and decrement stock atomically
    const [peminjaman] = await prisma.$transaction([
      prisma.peminjaman.create({
        data: {
          userId: user.id,
          productId,
          namaPeminjam: user.name,
          status: "DIPINJAM",
        },
        include: {
          product: { select: { name: true, brand: true } },
        },
      }),
      prisma.product.update({
        where: { id: productId },
        data: { stock: { decrement: 1 } },
      }),
    ]);

    return NextResponse.json(peminjaman, { status: 201 });
  } catch (error) {
    console.error("Error creating peminjaman:", error);
    return NextResponse.json({ message: "Gagal membuat peminjaman" }, { status: 500 });
  }
}

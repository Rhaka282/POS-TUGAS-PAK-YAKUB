const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@laptopverse.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@laptopverse.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const hashedPasswordUser = await bcrypt.hash("user123", 10);

  const user = await prisma.user.upsert({
    where: { email: "user@laptopverse.com" },
    update: {},
    create: {
      name: "Pengunjung",
      email: "user@laptopverse.com",
      password: hashedPasswordUser,
      role: "PENGUNJUNG",
    },
  });

  console.log("✅ Akun berhasil dibuat!");
  console.log("----------------------------");
  console.log("👤 ADMIN:");
  console.log("   Email    : admin@laptopverse.com");
  console.log("   Password : admin123");
  console.log("----------------------------");
  console.log("👤 PENGUNJUNG:");
  console.log("   Email    : user@laptopverse.com");
  console.log("   Password : user123");
  console.log("----------------------------");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

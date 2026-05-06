import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@sacredjourney.com";
  const password = process.env.ADMIN_PASSWORD ?? "Admin@12345";
  const name = process.env.ADMIN_NAME ?? "Sacred Journey Admin";

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { name, role: Role.admin },
    create: { name, email, password: passwordHash, role: Role.admin }
  });

  await prisma.setting.upsert({
    where: { key: "IMB_PAYMENT_LINK" },
    update: { value: process.env.IMB_PAYMENT_LINK ?? "https://imb.example/pay/sacred-journey" },
    create: { key: "IMB_PAYMENT_LINK", value: process.env.IMB_PAYMENT_LINK ?? "https://imb.example/pay/sacred-journey" }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

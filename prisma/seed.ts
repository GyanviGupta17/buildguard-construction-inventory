import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.auditLog.deleteMany();
  await prisma.materialRequest.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.material.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users
  await prisma.user.create({
    data: { name: "Rajesh Sharma (Site Eng)", role: "SITE_ENGINEER" },
  });
  await prisma.user.create({
    data: { name: "Anil Kumar (Store Mgr)", role: "STORE_MANAGER" },
  });
  await prisma.user.create({
    data: { name: "System Admin", role: "ADMIN" },
  });

  // 2. Create Projects
  const metroProject = await prisma.project.create({
    data: { name: "Metro Station Line 1", budget: 500000, spent: 120000 },
  });
  const highwayProject = await prisma.project.create({
    data: { name: "National Highway 44", budget: 800000, spent: 300000 },
  });

  // 3. Create Materials
  const cement = await prisma.material.create({
    data: { name: "Grade 53 Cement", unit: "Bags" },
  });
  const steel = await prisma.material.create({
    data: { name: "TMT Rebar 12mm", unit: "Tons" },
  });

  // 4. Create Initial Inventory
  await prisma.inventory.create({
    data: {
      projectId: metroProject.id,
      materialId: cement.id,
      quantity: 50,
    },
  });
  await prisma.inventory.create({
    data: {
      projectId: metroProject.id,
      materialId: steel.id,
      quantity: 120,
    },
  });

  await prisma.inventory.create({
    data: {
      projectId: highwayProject.id,
      materialId: cement.id,
      quantity: 300,
    },
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
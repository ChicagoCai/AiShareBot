import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const today = new Date();
  const dateOnly = new Date(today.toISOString().slice(0,10));

  const s1 = await prisma.stock.upsert({
    where: { code: "600000" },
    update: {},
    create: { code: "600000", name: "Mock半导体", sector: "半导体" }
  });

  const s2 = await prisma.stock.upsert({
    where: { code: "000001" },
    update: {},
    create: { code: "000001", name: "Mock白酒", sector: "白酒" }
  });

  await prisma.dailyData.create({
    data: {
      stockId: s1.id,
      date: dateOnly,
      open: 10,
      close: 13,
      changePct: 30,
      turnover: 120000000,
      isLimitUp: true,
      limitReason: "公司发布业绩预增，且有并购传闻",
      sources: {
        create: [
          { url: "https://example.com/news1", title: "某公司发布业绩预增" }
        ]
      }
    }
  });

  await prisma.dailyData.create({
    data: {
      stockId: s2.id,
      date: dateOnly,
      open: 20,
      close: 22,
      changePct: 10,
      turnover: 80000000,
      isLimitUp: false,
      limitReason: null
    }
  });

  await prisma.sectorSummary.createMany({
    data: [
      { date: dateOnly, sector: "半导体", changePct: 4.5, turnover: "12.3亿" as any, stockCount: 18 },
      { date: dateOnly, sector: "白酒", changePct: 2.1, turnover: "8.2亿" as any, stockCount: 10 }
    ]
  });

  console.log("Seed finished.");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

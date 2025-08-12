import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { startMockJob } from "./jobs/mockJob";
import { dateOnly } from "./utils";

// 初始化 Prisma 客户端
const prisma = new PrismaClient();
const app = express();

// 启用 CORS 和 JSON 中间件
app.use(cors());
app.use(express.json());

// 获取盘后汇总数据
app.get("/v1/postmarket/summary", async (req: Request, res: Response) => {
  try {
    // 获取查询日期，默认为今天
    const dateStr = (req.query.date as string) || new Date().toISOString().slice(0, 10);
    const date = new Date(dateStr);

    // 获取日期范围
    const dateStart = dateOnly(date);
    const dateEnd = new Date(dateStart);
    dateEnd.setDate(dateEnd.getDate() + 1);

    // 查询热点板块
    const sectors: any[] = await prisma.sectorSummary.findMany({
      where: { date: { gte: dateStart, lt: dateEnd } },
      orderBy: { changePct: "desc" },
      take: 10,
    });

    // 查询涨停股票
    const limitUps: any[] = await prisma.dailyData.findMany({
      where: { date: { gte: dateStart, lt: dateEnd }, isLimitUp: true },
      include: { stock: true, sources: true },
    });

    // 返回数据
    res.json({
      date: dateStr,
      hotSectors: sectors.map((s) => ({
        id: s.id,
        sector: s.sector,
        changePct: s.changePct,
        turnover: s.turnover,
        stockCount: s.stockCount,
      })),
      limitUpStocks: limitUps.map((d) => ({
        code: d.stock.code,
        name: d.stock.name,
        sector: d.stock.sector,
        changePct: d.changePct,
        reason: d.limitReason,
        sources: d.sources.map((s: any) => ({ title: s.title, url: s.url })),
      })),
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 启动 mock job（开发用）
startMockJob();

// 启动服务
const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log(`Backend listening on http://localhost:${port}`)
);

import cron from "node-cron";
import { fetchMarketDataForDate } from "./fetchData";

// 启动定时任务
export function startMockJob() {
  // 这里只是示例：每分钟运行一次（开发期间），真实环境请改为每天收盘后运行
  cron.schedule("* * * * *", async () => {
    try {
      const date = new Date();
      console.log("[mockJob] run for", date.toISOString().slice(0, 10));
      const marketData = await fetchMarketDataForDate(); // 获取真实数据
      console.log("Fetched market data:", marketData);
    } catch (err) {
      console.error("mockJob error", err);
    }
  });
}
import { PythonShell } from "python-shell";

// 获取股市数据
export async function fetchMarketDataForDate() {
  try {
    const results = await PythonShell.run("fetch_data.py", {});
    const data = JSON.parse(results[0]);
    return data;
  } catch (err) {
    throw err;
  }
}
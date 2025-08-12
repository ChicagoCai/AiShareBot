import React, { useEffect, useState } from "react";

type Summary = {
  date: string;
  hotSectors: { id:number; sector:string; changePct:number; turnover:any; stockCount?:number }[];
  limitUpStocks: { code:string; name:string; sector?:string; changePct?:number; reason?:string; sources?:any[] }[];
};

export default function App() {
  const [data, setData] = useState<Summary | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:4000/v1/postmarket/summary");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (e:any) {
        setErr(e.message);
      }
    }
    load();
  }, []);

  if (err) return <div style={{padding:12}}>错误: {err}</div>;
  if (!data) return <div style={{padding:12}}>加载中…</div>;

  return (
    <div style={{ width: 380, padding: 12, fontFamily: "Arial, sans-serif" }}>
      <h3 style={{ margin: 0 }}>盘后摘要 — {data.date}</h3>

      <section style={{ marginTop: 12 }}>
        <strong>热点板块</strong>
        <ul>
          {data.hotSectors.map(s => (
            <li key={s.id}>{s.sector}：{s.changePct}% / 成交 {s.turnover} / 成员 {s.stockCount}</li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 8 }}>
        <strong>涨停股</strong>
        <ul>
          {data.limitUpStocks.length === 0 && <li>今日无涨停（mock）</li>}
          {data.limitUpStocks.map(st => (
            <li key={st.code}>
              {st.name} ({st.code}) {st.sector ? `— ${st.sector}` : ""} {st.changePct ? `(${st.changePct}%)` : ""}
              <div style={{ fontSize: 12, color: "#555" }}>{st.reason ?? "原因：暂无"}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

// ameyaka 再通知サーバー
//   雨の日、傘のタグをかざすまで、設定した間隔（1・5・10分）で通知を送り続ける。
//   「止めた」状態はこのサーバー1か所で持つので、どの端末・拠点から止めても食い違わない。
//
//   起動: node server/ameyaka-push.mjs   （127.0.0.1:8911。外からは https://ameyaka.l4tp.org/ で届く）
//   鍵:   VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY を環境変数か ~/.ameyaka/env（600）で渡す。リポジトリには入れない
//
// API（すべて JSON、CORS 許可）
//   POST /subscribe  {subscription, settings:{intervalMin, threshold, lat, lon}}  端末を登録・更新
//   POST /start      {endpoint?}        今から再通知を始める（デモ・撮影用。endpoint 省略で全端末）
//   POST /stop       {endpoint?}        今日の再通知を止める（タグをかざしたときにアプリから呼ぶ）
//   GET  /status                         状態の一覧（endpoint は先頭だけ）
import http from "node:http";
import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import webpush from "web-push";

const HOST = "127.0.0.1";
const PORT = Number(process.env.PORT || 8911);
const DIR = process.env.AMEYAKA_DIR || join(homedir(), ".ameyaka");
const STATE = join(DIR, "state.json");
const TICK_MS = 10_000;
const MAX_PER_DAY = 30; // 止め忘れても鳴り続けないための上限
const AUTO_START_HOUR = Number(process.env.AUTO_START_HOUR ?? 7); // 毎朝この時刻(JST)に雨なら自動で開始

mkdirSync(DIR, { recursive: true });

// ~/.ameyaka/env があれば読む（KEY=VALUE）
const envFile = join(DIR, "env");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "https://github.com/yousan/Meeple-and-Koma",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

/* ---------- 状態 ---------- */
// subs: { [endpoint]: { subscription, settings, activeDay, stoppedDay, lastSent, sentToday, sentDay } }
let state = existsSync(STATE) ? JSON.parse(readFileSync(STATE, "utf8")) : { subs: {} };
function save() {
  writeFileSync(STATE + ".tmp", JSON.stringify(state, null, 2), { mode: 0o600 });
  renameSync(STATE + ".tmp", STATE);
}
const jstNow = () => new Date(Date.now() + 9 * 3600_000);
const today = () => jstNow().toISOString().slice(0, 10);
const short = (ep) => ep.slice(0, 50) + "…";
const log = (...a) => console.log(new Date().toISOString(), ...a);

function targets(endpoint) {
  return endpoint ? [state.subs[endpoint]].filter(Boolean) : Object.values(state.subs);
}

function start(endpoint) {
  const d = today();
  const list = targets(endpoint);
  for (const s of list) {
    s.activeDay = d;
    s.stoppedDay = null;
    s.lastSent = 0; // すぐ1通目を出す
  }
  save();
  return list.length;
}

function stop(endpoint) {
  const d = today();
  const list = targets(endpoint);
  for (const s of list) s.stoppedDay = d;
  save();
  return list.length;
}

/* ---------- 送信ループ ---------- */
async function tick() {
  const d = today();
  const now = Date.now();
  for (const [ep, s] of Object.entries(state.subs)) {
    if (s.activeDay !== d || s.stoppedDay === d) continue;
    if (s.sentDay !== d) { s.sentDay = d; s.sentToday = 0; }
    if (s.sentToday >= MAX_PER_DAY) continue;
    const interval = Math.max(1, Number(s.settings?.intervalMin || 1)) * 60_000;
    if (now - (s.lastSent || 0) < interval) continue;

    s.lastSent = now;
    s.sentToday++;
    const n = s.sentToday;
    const payload = {
      kind: "reinforce",
      title: n === 1 ? "今日は傘が必要です" : `傘、まだですか？（${n}回目）`,
      body: n === 1
        ? "傘のタグをかざすまで、お知らせが続きます。"
        : "傘の孫の手タグをかざすと止まります。",
      tag: `ameyaka-nag-${d}-${n}`, // 1通ずつ別の通知として積み上げる
      url: "./",
    };
    try {
      await webpush.sendNotification(s.subscription, JSON.stringify(payload), { TTL: 120, urgency: "high" });
      log("sent", n, short(ep));
    } catch (e) {
      log("send failed", e.statusCode, short(ep), e.body || e.message);
      if (e.statusCode === 404 || e.statusCode === 410) delete state.subs[ep];
    }
  }
  save();
}

/* ---------- 毎朝の自動開始（雨の日だけ） ---------- */
let lastAutoDay = null;
async function autoStart() {
  const t = jstNow();
  const d = today();
  if (t.getUTCHours() !== AUTO_START_HOUR || lastAutoDay === d) return;
  lastAutoDay = d;
  for (const [ep, s] of Object.entries(state.subs)) {
    const { lat = 35.6617, lon = 139.7041, threshold = 40 } = s.settings || {};
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        "&daily=precipitation_probability_max&timezone=Asia%2FTokyo&forecast_days=1";
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
      const prob = (await res.json()).daily?.precipitation_probability_max?.[0] ?? 0;
      log("auto", d, `prob=${prob}`, `threshold=${threshold}`, short(ep));
      if (prob >= threshold) start(ep);
    } catch (e) {
      log("auto: weather failed", e.message);
    }
  }
}

/* ---------- HTTP ---------- */
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type",
  "access-control-max-age": "600",
};
function send(res, code, obj) {
  res.writeHead(code, { "content-type": "application/json; charset=utf-8", ...CORS });
  res.end(JSON.stringify(obj));
}
function readBody(req) {
  return new Promise((resolve) => {
    let b = "";
    req.on("data", (c) => { b += c; if (b.length > 20_000) req.destroy(); });
    req.on("end", () => { try { resolve(b ? JSON.parse(b) : {}); } catch { resolve({}); } });
  });
}

http.createServer(async (req, res) => {
  const path = new URL(req.url, "http://x").pathname.replace(/\/+$/, "") || "/";
  if (req.method === "OPTIONS") return send(res, 204, {});
  try {
    if (req.method === "GET" && (path === "/" || path === "/status")) {
      const d = today();
      return send(res, 200, {
        ok: true, today: d, intervalTickSec: TICK_MS / 1000,
        subs: Object.entries(state.subs).map(([ep, s]) => ({
          endpoint: short(ep),
          intervalMin: s.settings?.intervalMin || 1,
          nagging: s.activeDay === d && s.stoppedDay !== d,
          stoppedToday: s.stoppedDay === d,
          sentToday: s.sentDay === d ? s.sentToday : 0,
          lastSent: s.lastSent ? new Date(s.lastSent).toISOString() : null,
        })),
      });
    }
    if (req.method === "POST" && path === "/subscribe") {
      const { subscription, settings } = await readBody(req);
      if (!subscription?.endpoint || !subscription?.keys) return send(res, 400, { ok: false, error: "subscription がありません" });
      const prev = state.subs[subscription.endpoint] || {};
      state.subs[subscription.endpoint] = { ...prev, subscription, settings: { ...prev.settings, ...settings } };
      save();
      log("subscribe", short(subscription.endpoint), JSON.stringify(settings || {}));
      return send(res, 200, { ok: true });
    }
    if (req.method === "POST" && path === "/start") {
      const { endpoint } = await readBody(req);
      // 外（Cloudflare 経由）からの「全端末を鳴らす」は受け付けない。自分の endpoint を知っている端末だけが自分を鳴らせる
      if (!endpoint && req.headers["cf-connecting-ip"]) return send(res, 403, { ok: false, error: "endpoint が必要です" });
      const n = start(endpoint);
      log("start", endpoint ? short(endpoint) : "all", n);
      return send(res, 200, { ok: true, started: n });
    }
    if (req.method === "POST" && path === "/stop") {
      const { endpoint } = await readBody(req);
      const n = stop(endpoint);
      log("stop", endpoint ? short(endpoint) : "all", n);
      return send(res, 200, { ok: true, stopped: n });
    }
    return send(res, 404, { ok: false, error: "not found" });
  } catch (e) {
    log("error", e.message);
    return send(res, 500, { ok: false, error: e.message });
  }
}).listen(PORT, HOST, () => log(`ameyaka-push listening on http://${HOST}:${PORT}`));

setInterval(() => { tick().catch((e) => log("tick", e.message)); autoStart(); }, TICK_MS);

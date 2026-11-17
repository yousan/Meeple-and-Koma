// 登録された端末ごとに、その人の地域・しきい値・通知タイミングを見て雨なら push を送る。
//   node scripts/rain-check.mjs             # 出発前（朝）
//   node scripts/rain-check.mjs --slot=evening --dry-run
import { send } from "./push-core.mjs";
import { loadEnv } from "./env.mjs";

loadEnv();

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

const SLOT = arg("slot", process.env.SLOT || "morning"); // morning | evening
const DRY_RUN = process.argv.includes("--dry-run");
// デモ用: 天気 API を呼ばずに降水確率を固定する（--mock-prob=70）。
// 自動配信の経路はそのまま通したいが、当日の天気に左右されたくないとき用。
const MOCK_PROB = (() => {
  const v = arg("mock-prob", process.env.MOCK_PROB);
  return v === undefined || v === "" ? null : Number(v);
})();

const FALLBACK = {
  lat: Number(process.env.LAT || 35.6617),
  lon: Number(process.env.LON || 139.7041),
  place: process.env.PLACE || "渋谷区",
  threshold: Number(process.env.RAIN_THRESHOLD || 50),
};

const cache = new Map();

// Actions の実行環境は一時的に外部接続が詰まることがあるので数回リトライする
// 実際に 2026-11-14 と 11-16 の cron がこれで落ちているので、回数と待ち時間を多めに取る
async function fetchJsonWithRetry(url, tries = 5) {
  let lastError;
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error(`Open-Meteo ${res.status}: ${await res.text()}`);
      return await res.json();
    } catch (e) {
      lastError = e;
      console.warn(`  天気取得に失敗（${i}/${tries}）: ${e.message}`);
      if (i < tries) await new Promise((r) => setTimeout(r, 3000 * 2 ** (i - 1)));
    }
  }
  throw lastError;
}

async function forecast(lat, lon) {
  const key = `${lat},${lon}`;
  if (cache.has(key)) return cache.get(key);

  if (MOCK_PROB !== null) {
    // 12時から降り始める想定の固定データ
    const hours = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      prob: hour >= 12 ? MOCK_PROB : Math.max(0, MOCK_PROB - 40),
    }));
    const mock = {
      max: MOCK_PROB, tmax: 18, date: new Date().toISOString().slice(0, 10),
      hours, evening: MOCK_PROB, mocked: true,
    };
    cache.set(key, mock);
    return mock;
  }

  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${lat}&longitude=${lon}` +
    "&hourly=precipitation_probability" +
    "&daily=precipitation_probability_max,temperature_2m_max" +
    "&timezone=Asia%2FTokyo&forecast_days=1";
  const d = await fetchJsonWithRetry(url);

  const hours = (d.hourly?.time || []).map((t, i) => ({
    hour: Number(t.slice(11, 13)),
    prob: d.hourly.precipitation_probability[i] ?? 0,
  }));
  const data = {
    max: d.daily?.precipitation_probability_max?.[0] ?? 0,
    tmax: d.daily?.temperature_2m_max?.[0] ?? null,
    date: d.daily?.time?.[0],
    hours,
    // 夕方以降（16時〜23時）の最大降水確率
    evening: hours.filter((h) => h.hour >= 16).reduce((a, h) => Math.max(a, h.prob), 0),
  };
  cache.set(key, data);
  return data;
}

// 仕様書 5.1 通知の種類 の文面に合わせる。
// 帰宅前は A/B の出し分け: 傘の場所が office と判定できるときだけ A。
function compose(slot, w, threshold, umbrellaLocation) {
  const prob = slot === "evening" ? w.evening : w.max;
  if (prob < threshold) return null;

  const first = w.hours.find((h) => h.prob >= threshold);
  if (slot === "evening") {
    const atOffice = umbrellaLocation === "office";
    return {
      kind: "evening",
      title: "帰宅時間に雨の予報です",
      body: atOffice
        ? "会社に置いてある傘をお忘れなく。"
        : `降水確率は${prob}%。傘はお持ちですか？`,
      tag: "ameyaka-evening",
      url: "./#history",
    };
  }

  // 降り始めの時間帯でタイトルを変える（仕様書の例「午後から雨が降る予報です」）
  const when =
    first === undefined ? "今日は雨の予報です"
    : first.hour < 12 ? "午前中に雨が降る予報です"
    : first.hour < 17 ? "午後から雨が降る予報です"
    : "夕方から雨が降る予報です";

  return {
    kind: "morning",
    title: when,
    body: `降水確率は${prob}%。${prob >= 80 ? "折りたたみ傘ではなく長傘がおすすめです。" : "傘を忘れずにお持ちください。"}`,
    tag: "ameyaka-morning",
    url: "./#history",
  };
}

console.log(`slot=${SLOT} dry-run=${DRY_RUN}`);

const result = await send(async (sub) => {
  const s = sub.settings || {};
  if (SLOT === "morning" && s.morning === false) return null;
  if (SLOT === "evening" && s.evening === false) return null;

  const lat = Number(s.lat ?? FALLBACK.lat);
  const lon = Number(s.lon ?? FALLBACK.lon);
  const threshold = Number(s.threshold ?? FALLBACK.threshold);
  const w = await forecast(lat, lon);

  const place = s.place || FALLBACK.place;
  console.log(
    `  ${w.mocked ? "[デモ値] " : ""}${place} (${lat},${lon}) ${w.date} 日中最大 ${w.max}% / 夕方以降 ${w.evening}% / 最高 ${w.tmax}℃ ・しきい値 ${threshold}%`
  );

  const payload = compose(SLOT, w, threshold, s.umbrellaLocation);
  if (DRY_RUN) {
    console.log("  dry-run →", payload ? payload.title + " / " + payload.body : "送信しない");
    return null;
  }
  return payload;
});

if (DRY_RUN) console.log("dry-run のため実際には送っていません。");
else console.log(result);

/* ameyaka — 傘を、忘れない。
   あめみやさんの Figma 設計に合わせた4画面。ハッシュルーティングのみ、ビルド不要。 */

const SVG = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.8V20h13V9.8"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M18 9a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16S18 14 18 9"/><path d="M10.5 19a2 2 0 0 0 3 0"/></svg>',
  umbrella: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v1.5"/><path d="M3.5 12a8.5 8.5 0 0 1 17 0z"/><path d="M12 12v6.5a2 2 0 0 1-4 0"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s6.5-6 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="7.5" width="17" height="12" rx="2.5"/><path d="M9 7.5V6a3 3 0 0 1 6 0v1.5"/></svg>',
  house: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 10.5 12 3.5l8.5 7"/><path d="M6 9.8V20h12V9.8"/><path d="M10 20v-4.5h4V20"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
  bluetooth: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7.5 17 16.5 12 21V3l5 4.5L7 16.5"/></svg>',
  battery: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="2.5" y="8" width="16" height="8" rx="2.5"/><path d="M21 11v2"/><rect x="4.5" y="10" width="10" height="4" rx="1" fill="currentColor" stroke="none"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 2.8v5.4c0 4.3-3 7.7-7 9.8-4-2.1-7-5.5-7-9.8V5.8z"/><path d="M9.2 12.2l2 2 3.6-3.8"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="8.6"/><path d="M12 11v5"/><circle cx="12" cy="8.2" r=".9" fill="currentColor"/></svg>',
  save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.6"/><path d="M8.5 12.2l2.4 2.4 4.6-5"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3 10.5 13.5"/><path d="M21 3l-6.8 18-3.7-7.5L3 9.8z"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20 4v4.5h-4.5"/></svg>',
  cloudRain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M7 16a4 4 0 0 1 .6-7.96 5.5 5.5 0 0 1 10.6 1.46A3.5 3.5 0 0 1 17.5 16z"/><path d="M9 19l-.7 1.6M13 19l-.7 1.6M17 19l-.7 1.6"/></svg>',
};

const PLACES = {
  shibuya: { name: "渋谷区", lat: 35.6617, lon: 139.7041 },
  aizu: { name: "会津若松市", lat: 37.4948, lon: 139.9298 },
  sapporo: { name: "札幌市", lat: 43.0618, lon: 141.3545 },
  osaka: { name: "大阪市", lat: 34.6937, lon: 135.5023 },
  fukuoka: { name: "福岡市", lat: 33.5902, lon: 130.4017 },
};

const DEFAULTS = {
  place: "shibuya",
  threshold: 40,
  morning: true,
  evening: true,
  reinforce: true,
  departAt: "08:30",
  returnAt: "18:30",
  leadMinutes: 30,
};

const PAGES = [
  { id: "home", label: "ホーム", icon: "home" },
  { id: "settings", label: "設定", icon: "settings" },
  { id: "history", label: "通知履歴", icon: "bell" },
  { id: "tag", label: "傘の状態", icon: "umbrella" },
];

/* ---------- 状態 ---------- */
const LS = "ameyaka.settings";
const LS_TAG = "ameyaka.tagstate";
const LS_DEMO = "ameyaka.demo";

let settings = { ...DEFAULTS, ...safeParse(localStorage.getItem(LS)) };
let weather = null;
let registration = null;
let subscription = null;
let historyFilter = "all";

function safeParse(s) { try { return JSON.parse(s) || {}; } catch { return {}; } }
function saveSettings() { localStorage.setItem(LS, JSON.stringify(settings)); }
function place() { return PLACES[settings.place] || PLACES.shibuya; }

// デモ用の天気固定。撮影・発表で当日の天気に左右されないようにする。
// URL に ?demo=rain / sunny / live を付けても切り替わる。
const DEMO_PRESETS = {
  live: null,
  rain: { label: "雨予報", max: 70, temp: 18.4, firstHour: 15 },
  heavy: { label: "大雨", max: 90, temp: 14.2, firstHour: 9 },
  sunny: { label: "晴れ", max: 10, temp: 22.0, firstHour: null },
};

function demoMode() {
  const q = new URLSearchParams(location.search).get("demo");
  if (q && q in DEMO_PRESETS) localStorage.setItem(LS_DEMO, q);
  const saved = localStorage.getItem(LS_DEMO);
  return saved && saved in DEMO_PRESETS ? saved : "live";
}

function setDemoMode(mode) {
  localStorage.setItem(LS_DEMO, mode);
}

function tagState() {
  return { present: true, battery: 82, spot: "玄関", ...safeParse(localStorage.getItem(LS_TAG)) };
}
function saveTagState(s) { localStorage.setItem(LS_TAG, JSON.stringify(s)); }

/* ---------- 雨の日チェック ----------
   雨予報の日は、傘のタグにスマホをかざすまでアプリが先に進まない。
   タグには ?tag=umbrella 付きの URL を書き込んでおき、かざすとその URL が開いて解除される。
   デモではボタンで代用する（画面に「デモ」と明記）。 */
const LS_CHECK = "ameyaka.umbrellaCheck";
let justUnlocked = false;

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
function umbrellaCheck() {
  const c = safeParse(localStorage.getItem(LS_CHECK));
  return c.day === todayKey() ? c : null;
}
const LS_DAYS = "ameyaka.checkedDays";
function markUmbrellaChecked(via) {
  localStorage.setItem(LS_CHECK, JSON.stringify({ day: todayKey(), at: Date.now(), via }));
  const days = new Set(safeArray(localStorage.getItem(LS_DAYS)));
  days.add(todayKey());
  localStorage.setItem(LS_DAYS, JSON.stringify([...days].slice(-60)));
}
function safeArray(s) { try { const v = JSON.parse(s); return Array.isArray(v) ? v : []; } catch { return []; } }
// 今日から遡って、雨の日チェックを続けた日数（チェックの無い日で途切れる）
function checkStreak() {
  const days = new Set(safeArray(localStorage.getItem(LS_DAYS)));
  let n = 0;
  const d = new Date();
  for (;;) {
    const k = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    if (!days.has(k)) break;
    n++; d.setDate(d.getDate() - 1);
  }
  return n;
}
function resetUmbrellaCheck() { localStorage.removeItem(LS_CHECK); }
function gateActive() { return settings.reinforce && needsUmbrella() && !umbrellaCheck(); }

// ?tag=... でチェック済み、?gate=reset でやり直し。処理したらアドレスバーから消す
function consumeUrlParams() {
  const q = new URLSearchParams(location.search);
  let changed = false;
  if (q.has("tag")) {
    const wasLocked = !umbrellaCheck();
    markUmbrellaChecked("tag");
    if (wasLocked) justUnlocked = true;
    q.delete("tag"); changed = true;
  }
  if (q.get("gate") === "reset") { resetUmbrellaCheck(); q.delete("gate"); changed = true; }
  if (changed) {
    const qs = q.toString();
    history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + location.hash);
  }
}

/* ---------- 天気 ---------- */
async function loadWeather() {
  const p = place();
  const preset = DEMO_PRESETS[demoMode()];
  if (preset) {
    const hours = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      prob: preset.firstHour === null ? preset.max : hour >= preset.firstHour ? preset.max : Math.max(0, preset.max - 50),
    }));
    weather = {
      temp: preset.temp,
      max: preset.max,
      summary:
        preset.max < settings.threshold ? "一日を通して晴れ"
        : preset.firstHour !== null && preset.firstHour >= 12 ? "午後から雨"
        : "午前中から雨",
      firstHour: preset.max >= settings.threshold ? preset.firstHour : null,
      hours,
      updatedAt: new Date(),
      mocked: true,
    };
    return weather;
  }

  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${p.lat}&longitude=${p.lon}` +
    "&current=temperature_2m,precipitation" +
    "&hourly=precipitation_probability" +
    "&daily=precipitation_probability_max,temperature_2m_max,temperature_2m_min" +
    "&timezone=Asia%2FTokyo&forecast_days=1";
  const res = await fetch(url);
  if (!res.ok) throw new Error("weather " + res.status);
  const d = await res.json();

  const hours = (d.hourly?.time || []).map((t, i) => ({
    hour: Number(t.slice(11, 13)),
    prob: d.hourly.precipitation_probability[i] ?? 0,
  }));
  const max = d.daily?.precipitation_probability_max?.[0] ?? 0;
  const first = hours.find((h) => h.prob >= Math.max(settings.threshold, 30));
  const am = hours.filter((h) => h.hour < 12).reduce((a, h) => Math.max(a, h.prob), 0);
  const pm = hours.filter((h) => h.hour >= 12).reduce((a, h) => Math.max(a, h.prob), 0);

  let summary = "雨の予報はありません";
  if (max >= settings.threshold) {
    if (am >= settings.threshold && pm >= settings.threshold) summary = "一日を通して雨";
    else if (pm >= settings.threshold) summary = "午後から雨";
    else summary = "午前中に雨";
  } else if (max >= 20) summary = "にわか雨の可能性";

  weather = {
    temp: Math.round((d.current?.temperature_2m ?? d.daily?.temperature_2m_max?.[0] ?? 0) * 10) / 10,
    max,
    summary,
    firstHour: first ? first.hour : null,
    hours,
    updatedAt: new Date(),
  };
  return weather;
}

function needsUmbrella() { return weather && weather.max >= settings.threshold; }

/* ---------- 画面 ---------- */
const main = document.getElementById("main");

function renderNav() {
  const cur = currentPage();
  document.getElementById("nav").innerHTML = PAGES.map(
    (p) => `<a href="#${p.id}" class="${p.id === cur ? "active" : ""}">${SVG[p.icon]}<span>${p.label}</span></a>`
  ).join("");
}

function renderChip() {
  document.getElementById("chipPlace").textContent = "今日の" + place().name;
  document.getElementById("chipValue").textContent = weather
    ? (needsUmbrella() ? "雨" : "傘なし") + " ・ " + weather.max + "%"
    : "取得中…";
}

function currentPage() {
  const id = location.hash.replace("#", "");
  return PAGES.some((p) => p.id === id) ? id : "home";
}

function head({ eyebrow, title, lead, right = "" }) {
  return `<div class="page-head"><div class="grow">
    ${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ""}
    <h2>${title}</h2>${lead ? `<p class="lead">${lead}</p>` : ""}
  </div>${right}</div>`;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 11) return "おはようございます";
  if (h < 18) return "こんにちは";
  return "こんばんは";
}

function fmtDate(d) {
  const w = "日月火水木金土"[d.getDay()];
  return `${d.getMonth() + 1}月${d.getDate()}日 ${w}曜日`;
}

function hhmm(d) {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function minusMinutes(hm, min) {
  const [h, m] = hm.split(":").map(Number);
  const t = new Date(2000, 0, 1, h, m - min);
  return hhmm(t);
}

/* ---- ホーム ---- */
function viewHome() {
  const p = place();
  const w = weather;
  const pct = w ? w.max : 0;
  const note = w
    ? w.firstHour !== null
      ? `${w.firstHour}時ごろから降り始める予報です`
      : "まとまった雨の予報はありません"
    : "天気を取得しています…";

  // ラベルと本文が矛盾しないよう、要否で見出しごと切り替える
  const advice = needsUmbrella()
    ? { l: "持っていこう", t: "今日は傘が必要です", s: w.firstHour !== null && w.firstHour >= 15 ? "帰宅時間に雨が予想されています" : "外出時に雨が予想されています" }
    : { l: "置いていこう", t: "今日は傘は不要です", s: "降水確率が" + settings.threshold + "%未満です" };

  const tag = tagState();
  const check = settings.reinforce && needsUmbrella() ? umbrellaCheck() : null;

  main.innerHTML =
    head({
      eyebrow: fmtDate(new Date()),
      title: greeting(),
      right: '<div class="avatar">A</div>',
    }) +
    `<div class="content">
      ${w && w.mocked ? `<div class="notice">${SVG.info}<span>天気は<b>デモ値（${DEMO_PRESETS[demoMode()].label}）</b>です。傘の状態はモックです。通知の配信は実装済みです。</span></div>` : ""}
      <section class="hero">
        <div class="place">${SVG.pin}<span>${p.name}</span></div>
        <div class="updated">${w ? hhmm(w.updatedAt) + " 更新" : ""}</div>
        <div class="temp">${w ? w.temp : "--"}°</div>
        <div class="summary">${w ? w.summary : "読み込み中"}</div>
        <div class="bar-head"><span>降水確率</span><b>${pct}%</b></div>
        <div class="bar"><i style="width:${pct}%"></i></div>
        <div class="note">${note}</div>
      </section>

      <section class="card advice">
        <div class="icon">${SVG.umbrella}</div>
        <div class="grow">
          <div class="l">${advice.l}</div>
          <div class="t">${advice.t}</div>
          <div class="s">${advice.s}</div>
        </div>
      </section>

      ${check ? `<section class="card advice checked">
        <div class="icon">${SVG.save}</div>
        <div class="grow">
          <div class="l">雨の日チェック</div>
          <div class="t" style="font-size:.95rem">傘を持ちました</div>
          <div class="s">${hhmm(new Date(check.at))} に${check.via === "tag" ? "タグで" : "デモで"}確認</div>
        </div>
        <button class="btn ghost mini" id="gateReset">やり直す</button>
      </section>` : ""}

      <div class="row-between">
        <div><div class="eyebrow">TODAY</div><div class="section-title">今日の予定</div></div>
        <a href="#settings" style="font-size:.74rem;color:var(--muted)">設定を変更</a>
      </div>
      <section class="card timeline">
        <div class="tl-item">
          <div class="tl-time">${settings.departAt}</div>
          <div class="tl-icon go">${SVG.bag}</div>
          <div class="tl-main"><div class="t">自宅を出発</div>
            <div class="s">${settings.morning ? `通知は ${minusMinutes(settings.departAt, settings.leadMinutes)} に届きます` : "出発前通知はオフです"}</div></div>
        </div>
        <div class="tl-item">
          <div class="tl-time">${settings.returnAt}</div>
          <div class="tl-icon home">${SVG.house}</div>
          <div class="tl-main"><div class="t">会社を出発</div>
            <div class="s">${settings.evening ? `通知は ${minusMinutes(settings.returnAt, settings.leadMinutes)} に届きます` : "帰宅前通知はオフです"}</div></div>
        </div>
      </section>

      <a class="card advice" href="#tag" style="text-decoration:none;color:inherit">
        <div class="icon">${SVG.bluetooth}</div>
        <div class="grow">
          <div class="l">スマートタグ</div>
          <div class="t" style="font-size:.95rem">傘は${tag.spot}にあります</div>
        </div>
        <span style="font-size:.7rem;color:var(--muted);display:flex;align-items:center;gap:6px">
          <span class="dot${tag.present ? "" : " off"}"></span>${tag.present ? "接続中" : "未接続"}</span>
        <span class="chev">${SVG.chevron}</span>
      </a>
    </div>`;
}

/* ---- 雨の日チェック（傘を持つまで先に進めない） ---- */
function viewGate() {
  const w = weather;
  main.innerHTML =
    head({
      eyebrow: "雨の日チェック",
      title: "傘を持ちましたか？",
      lead: `今日の降水確率は${w.max}%。傘のNFCタグをかざしてURLを開くまで、アプリは先に進めません。`,
    }) +
    `<div class="content">
      <section class="gate-stage">
        <div class="gate-ring"><div class="gate-icon">${SVG.umbrella}</div></div>
        <div class="gate-title">傘のNFCタグをかざして<br>URLを開いてください</div>
        <div class="gate-sub">${SVG.cloudRain}<span>${w.firstHour !== null ? `${w.firstHour}時ごろから雨の予報です` : "雨の予報です"}</span></div>
      </section>
      <button class="btn ghost" id="gateDemo">${SVG.save}<span>タグをかざした（デモ）</span></button>
      <div class="foot-note">デモではこのボタンがタグの読み取りの代わりです。<br>実機ではタグに書き込んだ URL（末尾 <b>?tag=umbrella</b>）を開くと解除されます。</div>
    </div>`;

  document.getElementById("gateDemo").addEventListener("click", () => {
    markUmbrellaChecked("demo");
    justUnlocked = true;
    render();
  });
}

/* 解除した瞬間の「実績解除」演出。ホームの上に重ねて出し、数秒で消える */
const GOLD_UMBRELLA = '<svg viewBox="0 0 64 64" fill="none"><path d="M32 6v4" stroke="#7a5200" stroke-width="3" stroke-linecap="round"/><path d="M6 32C6 18 18 9 32 9s26 9 26 23c-3.6-2.6-7.6-2.6-11 0-3.4-2.6-8.6-2.6-12 0h-2c-3.4-2.6-8.6-2.6-12 0-3.4-2.6-7.4-2.6-11 0z" fill="url(#ug)" stroke="#a87512" stroke-width="1.6" stroke-linejoin="round"/><path d="M32 9c-6 5-8 13-8 23M32 9c6 5 8 13 8 23" stroke="#c99325" stroke-width="1.3" opacity=".8"/><path d="M32 32v18a6 6 0 0 1-12 0" stroke="#7a5200" stroke-width="3.2" stroke-linecap="round"/><defs><linearGradient id="ug" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset=".45" stop-color="#f6c945"/><stop offset="1" stop-color="#d49a16"/></linearGradient></defs></svg>';

function showAchievement() {
  document.querySelector(".achv")?.remove();
  const streak = checkStreak();
  const colors = ["#f6c945", "#ffffff", "#7fd1c7", "#e08b4a", "#a7c7ff"];
  const bits = Array.from({ length: 26 }, (_, i) => {
    const left = Math.round(Math.random() * 100);
    const delay = (Math.random() * 0.5).toFixed(2);
    const dur = (1.6 + Math.random() * 1.2).toFixed(2);
    const rot = Math.round(Math.random() * 360);
    return `<i style="left:${left}%;background:${colors[i % colors.length]};animation-delay:${delay}s;animation-duration:${dur}s;transform:rotate(${rot}deg)"></i>`;
  }).join("");
  const el = document.createElement("div");
  el.className = "achv";
  el.innerHTML = `
    <div class="achv-confetti">${bits}</div>
    <div class="achv-card" role="status" aria-live="polite">
      <div class="achv-shine"></div>
      <div class="achv-label">✨ 実績解除</div>
      <div class="achv-medal"><div class="achv-umb">${GOLD_UMBRELLA}</div></div>
      <div class="achv-title">傘を持ちましたね！</div>
      <div class="achv-sub">今日の雨も、これで安心。いってらっしゃい！</div>
      ${streak >= 2 ? `<div class="achv-streak">☔ 雨の日チェック ${streak}日連続</div>` : ""}
      <div class="achv-tap">タップで閉じる</div>
    </div>`;
  const close = () => {
    el.classList.add("out");
    setTimeout(() => el.remove(), 350);
  };
  el.addEventListener("click", close);
  document.body.appendChild(el);
  navigator.vibrate?.([30, 60, 30]);
  setTimeout(close, 4200);
}

/* ---- 設定 ---- */
function viewSettings() {
  const enabled = !!subscription;
  main.innerHTML =
    head({
      eyebrow: "NOTIFICATION",
      title: "通知設定",
      lead: "雨の可能性がある日だけ、必要なタイミングでお知らせします。",
    }) +
    `<div class="content">
      <section class="card">
        <div class="row-between">
          <div><div class="eyebrow">TIMING</div><div class="section-title">通知タイミング</div></div>
          <span class="pill" id="activeCount"></span>
        </div>
        <div class="timeline" style="margin-top:10px">
          ${toggleRow("morning", "go", "bag", "出発前通知", `${minusMinutes(settings.departAt, settings.leadMinutes)}・出発の${settings.leadMinutes}分前`)}
          ${toggleRow("evening", "home", "house", "帰宅前通知", `${minusMinutes(settings.returnAt, settings.leadMinutes)}・帰宅の${settings.leadMinutes}分前`)}
          ${toggleRow("reinforce", "bell", "bell", "強化通知", "雨の日は傘のタグをかざすまで先に進めない")}
        </div>
      </section>

      <section class="card">
        <div class="row-between">
          <div><div class="eyebrow">RAIN CHANCE</div><div class="section-title">通知する降水確率</div></div>
          <b style="font-size:1.05rem"><span id="thVal">${settings.threshold}</span>% 以上</b>
        </div>
        <input type="range" id="th" min="10" max="90" step="10" value="${settings.threshold}" />
        <div class="scale"><span>10%</span><span>50%</span><span>90%</span></div>
        <div class="hint">${SVG.info}<span>降水確率が<span id="thVal2">${settings.threshold}</span>%未満の日は通知しません。</span></div>
      </section>

      <section class="card">
        <div class="eyebrow">PLACE &amp; TIME</div>
        <div class="section-title">地域と予定</div>
        <div class="timeline" style="margin-top:8px">
          <div class="tl-item"><div class="tl-main"><div class="t">地域</div></div>
            <select id="place">${Object.entries(PLACES).map(([k, v]) => `<option value="${k}" ${k === settings.place ? "selected" : ""}>${v.name}</option>`).join("")}</select></div>
          <div class="tl-item"><div class="tl-main"><div class="t">自宅を出発</div></div>
            <input type="time" id="departAt" value="${settings.departAt}" /></div>
          <div class="tl-item"><div class="tl-main"><div class="t">会社を出発</div></div>
            <input type="time" id="returnAt" value="${settings.returnAt}" /></div>
        </div>
      </section>

      <section class="card advice">
        <div class="icon">${SVG.shield}</div>
        <div class="grow">
          <div class="t" style="font-size:.95rem">通知の最適化</div>
          <div class="s">同じ内容を何度も通知しないよう自動で調整します</div>
        </div>
        <span style="color:var(--teal)">${SVG.save}</span>
      </section>

      <button class="btn" id="save">${SVG.save}<span>この内容で保存</span></button>

      <div class="section-label">DEMO</div>
      <section class="card">
        <div class="section-title">デモ用の天気</div>
        <div class="s" style="font-size:.74rem;color:var(--muted);margin:4px 0 12px">
          撮影や発表で当日の天気に左右されないための切替。デモ値のときはホームにその旨を表示します。
        </div>
        <div class="tabs" id="demoTabs">
          ${Object.entries(DEMO_PRESETS).map(([k, v]) =>
            `<button class="tab ${k === demoMode() ? "active" : ""}" data-demo="${k}">${v ? v.label + " " + v.max + "%" : "実天気API"}</button>`
          ).join("")}
        </div>
      </section>

      <div class="section-label">PUSH</div>
      <section class="card">
        <div class="section-title" style="margin-bottom:10px">プッシュ通知</div>
        <div class="statusline" id="pushStatus">確認中…</div>
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:14px">
          <button class="btn ${enabled ? "danger" : ""}" id="pushBtn">${enabled ? "通知を解除する" : "通知を有効にする"}</button>
          <button class="btn ghost" id="testBtn" ${enabled ? "" : "disabled"}>${SVG.send}<span>テスト通知を出す</span></button>
        </div>
        <div id="subWrap" ${enabled ? "" : "hidden"} style="margin-top:16px">
          <div class="statusline" style="margin-bottom:8px">この JSON を <code>subscriptions.json</code> に追記すると、朝の自動配信の対象になります。</div>
          <textarea id="subJson" readonly></textarea>
          <button class="btn ghost" id="copyBtn" style="margin-top:8px">コピー</button>
        </div>
      </section>
    </div>`;

  bindSettings();
}

function toggleRow(key, tone, icon, title, sub) {
  return `<div class="tl-item">
    <div class="tl-icon ${tone}">${SVG[icon]}</div>
    <div class="tl-main"><div class="t">${title}</div><div class="s">${sub}</div></div>
    <button class="toggle" data-key="${key}" aria-pressed="${settings[key]}" aria-label="${title}"></button>
  </div>`;
}

function updateActiveCount() {
  const n = ["morning", "evening", "reinforce"].filter((k) => settings[k]).length;
  const el = document.getElementById("activeCount");
  if (el) el.textContent = `${n}件 有効`;
}

function bindSettings() {
  updateActiveCount();
  main.querySelectorAll(".toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const k = btn.dataset.key;
      settings[k] = !settings[k];
      btn.setAttribute("aria-pressed", String(settings[k]));
      updateActiveCount();
    });
  });

  const th = document.getElementById("th");
  th.addEventListener("input", () => {
    settings.threshold = Number(th.value);
    document.getElementById("thVal").textContent = th.value;
    document.getElementById("thVal2").textContent = th.value;
  });

  document.getElementById("save").addEventListener("click", async () => {
    settings.place = document.getElementById("place").value;
    settings.departAt = document.getElementById("departAt").value || DEFAULTS.departAt;
    settings.returnAt = document.getElementById("returnAt").value || DEFAULTS.returnAt;
    saveSettings();
    const btn = document.getElementById("save");
    btn.innerHTML = SVG.save + "<span>保存しました</span>";
    try { await loadWeather(); } catch {}
    renderChip();
    refreshSubJson();
    setTimeout(() => { btn.innerHTML = SVG.save + "<span>この内容で保存</span>"; }, 1600);
  });

  main.querySelectorAll("#demoTabs .tab").forEach((t) =>
    t.addEventListener("click", async () => {
      setDemoMode(t.dataset.demo);
      try { await loadWeather(); } catch {}
      render();
    })
  );

  document.getElementById("pushBtn").addEventListener("click", togglePush);
  document.getElementById("testBtn").addEventListener("click", testNotification);
  document.getElementById("copyBtn").addEventListener("click", async () => {
    await navigator.clipboard.writeText(document.getElementById("subJson").value);
    document.getElementById("copyBtn").textContent = "コピーした";
  });

  refreshPushStatus();
  refreshSubJson();
}

function refreshPushStatus() {
  const el = document.getElementById("pushStatus");
  if (!el) return;
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    el.textContent = "このブラウザは Web Push に対応していません。\niOS は Safari で『ホーム画面に追加』してから開いてください。";
    const b = document.getElementById("pushBtn");
    if (b) b.disabled = true;
    return;
  }
  el.textContent = subscription
    ? "この端末は登録済みです。朝の自動配信と手動配信の両方を受け取れます。"
    : `まだ登録されていません。（通知の許可: ${Notification.permission}）`;
}

function refreshSubJson() {
  const ta = document.getElementById("subJson");
  if (!ta || !subscription) return;
  ta.value = JSON.stringify({ ...subscription.toJSON(), settings: exportableSettings() }, null, 2);
}

function exportableSettings() {
  const p = place();
  return {
    place: p.name, lat: p.lat, lon: p.lon,
    threshold: settings.threshold,
    morning: settings.morning, evening: settings.evening, reinforce: settings.reinforce,
    departAt: settings.departAt, returnAt: settings.returnAt,
  };
}

/* ---- 通知履歴 ---- */
async function viewHistory() {
  const items = await AmeyakaStore.all();
  const kinds = { all: "すべて", morning: "出発前", evening: "帰宅前", reinforce: "強化通知" };
  const shown = items.filter((i) => historyFilter === "all" || i.kind === historyFilter);

  main.innerHTML =
    head({
      eyebrow: "ACTIVITY",
      title: "通知履歴",
      lead: "雨の日にお届けしたお知らせを確認できます。",
      right: `<span class="pill">${items.length}件</span>`,
    }) +
    `<div class="content">
      <div class="tabs">${Object.entries(kinds).map(([k, v]) => `<button class="tab ${k === historyFilter ? "active" : ""}" data-k="${k}">${v}</button>`).join("")}</div>
      <div class="section-label">最近</div>
      <section class="card history">
        ${shown.length === 0
          ? '<div class="empty">まだ通知はありません。<br>設定から通知を有効にして、テスト通知を出してみてください。</div>'
          : shown.map(histItem).join("")}
      </section>
      ${items.length ? '<button class="btn ghost" id="clearHist">履歴を消す</button>' : ""}
      <div class="foot-note" style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:4px">
        <span style="color:var(--muted);width:15px;display:inline-block">${SVG.shield}</span>
        晴れの日はお知らせしません
      </div>
    </div>`;

  main.querySelectorAll(".tab").forEach((t) =>
    t.addEventListener("click", () => { historyFilter = t.dataset.k; viewHistory(); })
  );
  const clear = document.getElementById("clearHist");
  if (clear) clear.addEventListener("click", async () => { await AmeyakaStore.clear(); viewHistory(); });
}

function histItem(i) {
  const tone = { morning: "go", evening: "home", reinforce: "bell", manual: "go" }[i.kind] || "go";
  const icon = { morning: "bag", evening: "house", reinforce: "bell", manual: "send" }[i.kind] || "bell";
  const label = { morning: "出発前", evening: "帰宅前", reinforce: "強化通知", manual: "手動" }[i.kind] || "通知";
  return `<div class="hist-item">
    <div class="tl-icon ${tone}">${SVG[icon]}</div>
    <div class="hist-main">
      <span class="tag ${i.kind || "manual"}">${label}</span>
      <div class="t">${esc(i.title)}</div>
      <div class="b">${esc(i.body)}</div>
    </div>
    <div class="hist-when">${when(i.at)}</div>
  </div>`;
}

function when(ts) {
  const d = new Date(ts);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  return sameDay ? `今日 ${hhmm(d)}` : `${d.getMonth() + 1}月${d.getDate()}日 ${hhmm(d)}`;
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

/* ---- 傘の状態 ---- */
function viewTag() {
  const t = tagState();
  main.innerHTML =
    head({
      eyebrow: "SMART TAG",
      title: "傘の状態",
      lead: "スマートタグから取得した傘の位置と接続状態です。",
      right: `<button class="chev" id="reload" style="width:38px;height:38px;background:#fff">${SVG.refresh}</button>`,
    }) +
    `<div class="content">
      <section class="tag-stage">
        <div class="badge"><span class="dot${t.present ? "" : " off"}"></span>${t.present ? "タグ接続中" : "タグ未接続"}</div>
        <svg class="umb" viewBox="0 0 200 150" fill="none">
          <path d="M20 78a80 44 0 0 1 160 0z" fill="#2f6f7c"/>
          <path d="M100 34c-18 0-26 20-26 44h52c0-24-8-44-26-44z" fill="#4b8d99"/>
          <path d="M100 30v86a14 14 0 0 1-28 0" stroke="#16343a" stroke-width="5" stroke-linecap="round"/>
          <rect x="136" y="60" width="26" height="30" rx="8" fill="${t.present ? "#e08b4a" : "#c3ccce"}"/>
        </svg>
        <div class="last">最後に確認 ${t.present ? "たった今" : "3時間前"}</div>
        <div class="where">${t.present ? `傘は${t.spot}にあります` : "傘が見つかりません"}</div>
        ${t.present ? '<div class="ok">✓ 傘立てで検知</div>' : '<div class="mock">持ち出し中、または電波が届いていません</div>'}
      </section>

      <section class="card flat">
        <div class="stats">
          <div class="stat">${SVG.bluetooth}<div class="l">接続</div><div class="v">${t.present ? "良好" : "圏外"}</div></div>
          <div class="stat">${SVG.battery}<div class="l">バッテリー</div><div class="v">${t.battery}%</div></div>
          <div class="stat">${SVG.pin}<div class="l">登録場所</div><div class="v">自宅</div></div>
        </div>
      </section>

      <div class="section-label">DEVICE</div>
      <div class="section-title">登録中のタグ</div>
      <section class="card advice">
        <div class="icon">${SVG.umbrella}</div>
        <div class="grow">
          <div class="t" style="font-size:.95rem">いつもの傘</div>
          <div class="s">SmartTag ・ ST-2841</div>
        </div>
        <span style="font-size:.7rem;color:var(--muted);display:flex;align-items:center;gap:6px">
          <span class="dot${t.present ? "" : " off"}"></span>${t.present ? "接続済み" : "切断"}</span>
      </section>

      <button class="btn ghost" id="toggleDemo">${SVG.send}<span>デモ状態を切り替える</span></button>
      <div class="foot-note">この画面はスマートタグ未接続のため<b>モックデータ</b>です。実機が入ったら位置情報から自動で判定します。</div>
    </div>`;

  document.getElementById("toggleDemo").addEventListener("click", () => {
    const s = tagState();
    saveTagState({ ...s, present: !s.present, spot: !s.present ? "玄関" : s.spot });
    viewTag();
  });
  document.getElementById("reload").addEventListener("click", viewTag);
}

/* ---------- プッシュ ---------- */
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from([...atob(base64)].map((c) => c.charCodeAt(0)));
}

async function togglePush() {
  const btn = document.getElementById("pushBtn");
  try {
    if (subscription) {
      await subscription.unsubscribe();
      subscription = null;
      render();
      return;
    }
    btn.disabled = true;
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      document.getElementById("pushStatus").textContent =
        `通知が許可されませんでした（${permission}）。端末の設定から許可してください。`;
      btn.disabled = false;
      return;
    }
    const key = window.VAPID_PUBLIC_KEY;
    if (!key || key.startsWith("PASTE_")) throw new Error("config.js の VAPID_PUBLIC_KEY が未設定です");
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(key),
    });
    render();
  } catch (e) {
    const el = document.getElementById("pushStatus");
    if (el) el.textContent = "失敗: " + e.message;
    if (btn) btn.disabled = false;
  }
}

async function testNotification() {
  const w = weather;
  const title = needsUmbrella() ? "今日は傘が必要です" : "今日は傘がいりません";
  const body = w
    ? `降水確率は${w.max}%。${needsUmbrella() ? "傘を忘れずにお持ちください。" : "しきい値未満なので通知は出ません。"}`
    : "テスト通知です。";
  await registration.showNotification(title, {
    body, icon: "./icons/icon-192.png", badge: "./icons/icon-192.png", tag: "ameyaka-test",
  });
  await AmeyakaStore.add({ kind: "manual", title, body });
}

/* ---------- 起動 ---------- */
const views = { home: viewHome, settings: viewSettings, history: viewHistory, tag: viewTag };

function render() {
  const gated = gateActive();
  document.body.classList.toggle("gated", gated);
  renderNav();
  renderChip();
  (gated ? viewGate : views[currentPage()])();
  if (justUnlocked) { justUnlocked = false; showAchievement(); }
  document.getElementById("gateReset")?.addEventListener("click", () => {
    resetUmbrellaCheck();
    render();
  });
}

async function boot() {
  consumeUrlParams();
  render();

  // 天気の読み込みを Service Worker の準備待ちの後ろにしない（初回表示がその分遅くなるため）
  const weatherReady = loadWeather().then(
    () => render(),
    (e) => console.warn("天気取得失敗", e)
  );

  if ("serviceWorker" in navigator) {
    try {
      // 新しい版の Service Worker に切り替わったら、一度だけ読み直して最新の画面にする
      const hadController = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (hadController && !sessionStorage.getItem("ameyaka.reloaded")) {
          sessionStorage.setItem("ameyaka.reloaded", "1");
          location.reload();
        }
      });
      registration = await navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" });
      registration.update().catch(() => {});
      await navigator.serviceWorker.ready;
      subscription = await registration.pushManager.getSubscription();
      navigator.serviceWorker.addEventListener("message", (e) => {
        if (e.data?.type === "push-received" && currentPage() === "history") viewHistory();
      });
    } catch (e) {
      console.warn("SW 登録失敗", e);
    }
  }

  await weatherReady;
  wasGated = gateActive();
  render();
}

window.addEventListener("hashchange", render);

// タグの URL が別タブで開いても、ロック中のタブがすぐ解除されるようにする
let wasGated = false;
function syncGate() {
  const now = weather ? gateActive() : false;
  if (wasGated && !now && !justUnlocked) justUnlocked = true;
  wasGated = now;
  render();
}
window.addEventListener("storage", (e) => { if (e.key === LS_CHECK) syncGate(); });
document.addEventListener("visibilitychange", () => {
  if (document.hidden) return;
  registration?.update().catch(() => {});
  syncGate();
});
setInterval(() => { if (document.body.classList.contains("gated") && !justUnlocked && !gateActive()) syncGate(); }, 1500);
boot();

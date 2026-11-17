import webpush from "web-push";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const SUBS_PATH = new URL("../subscriptions.json", import.meta.url);

export function loadSubscriptions() {
  // 公開リポジトリに端末の購読情報を置きたくない場合は、
  // Actions Secret の SUBSCRIPTIONS_JSON に配列をそのまま入れる（あればこちらを優先）。
  const fromEnv = process.env.SUBSCRIPTIONS_JSON;
  if (fromEnv && fromEnv.trim()) {
    const list = JSON.parse(fromEnv);
    return Array.isArray(list) ? list : [];
  }
  if (!existsSync(SUBS_PATH)) return [];
  const list = JSON.parse(readFileSync(SUBS_PATH, "utf8"));
  return Array.isArray(list) ? list : [];
}

export function configure() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "https://github.com/yousan/Meeple-and-Koma";
  if (!publicKey || !privateKey) {
    throw new Error("VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY が未設定です（.env か GitHub Secrets）");
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);
}

const short = (sub) => sub.endpoint.slice(0, 58) + "…";

// payloadFor(sub) が null を返した購読はスキップ。
// 失効した購読（404/410）は subscriptions.json から自動で外す。
export async function send(payloadFor) {
  configure();
  const subs = loadSubscriptions();
  if (subs.length === 0) {
    console.log("購読が 0 件です。subscriptions.json に追記してください。");
    return { sent: 0, skipped: 0, removed: 0 };
  }

  const alive = [];
  let sent = 0, skipped = 0;

  for (const sub of subs) {
    const payload = await payloadFor(sub);
    if (!payload) {
      skipped++;
      alive.push(sub);
      console.log("skip", short(sub));
      continue;
    }
    try {
      await webpush.sendNotification(sub, JSON.stringify(payload));
      sent++;
      alive.push(sub);
      console.log("OK  ", short(sub), "-", payload.title);
    } catch (e) {
      const code = e.statusCode;
      if (code === 404 || code === 410) {
        console.log("期限切れのため削除:", short(sub));
      } else {
        console.error(`NG (${code})`, short(sub), e.body || e.message);
        alive.push(sub);
      }
    }
  }

  const removed = subs.length - alive.length;
  // Secret 運用のときはファイルを書き換えない（書いても反映されないため）
  if (removed > 0 && !process.env.SUBSCRIPTIONS_JSON) {
    writeFileSync(SUBS_PATH, JSON.stringify(alive, null, 2) + "\n");
  }
  console.log(`送信 ${sent} / スキップ ${skipped} / 削除 ${removed}（登録 ${subs.length}）`);
  return { sent, skipped, removed };
}

export const sendToAll = (payload) => send(() => payload);

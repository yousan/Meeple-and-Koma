// 手動トリガー（デバッグ・デモ用）
//   npm run push -- "今日は傘が必要です" "降水確率70%。15時ごろから降り始める予報です。"
import { sendToAll } from "./push-core.mjs";
import { loadEnv } from "./env.mjs";

loadEnv();

const title = process.argv[2] || "今日は傘が必要です";
const body = process.argv[3] || "降水確率70%。傘を忘れずにお持ちください。";
const kind = process.argv[4] || "morning";

await sendToAll({ title, body, kind, tag: "ameyaka-manual", url: "./#history" });

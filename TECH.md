# 技術仕様 — ameyaka

最終更新: 2026-11-17

## 一言でいうと

**朝、雨の日だけ「傘を持って」と通知する PWA。** サーバーを1台も立てず、GitHub Pages と
GitHub Actions だけで「購読の保存」と「定時配信」を成立させている。

## 使用技術

| 領域 | 採用 | 選んだ理由 |
| --- | --- | --- |
| フロント | 素の HTML / CSS / JavaScript（フレームワーク・ビルドなし） | GitHub Pages にそのまま置ける。環境構築に時間を溶かさない |
| PWA | Web App Manifest / Service Worker | iOS でもホーム画面に追加すれば Web Push が使える（iOS 16.4 以降） |
| 通知 | Web Push (VAPID) + `web-push` 3.6.7 | Apple / Google の push サーバーに直接送れる。アプリストア不要 |
| 通知履歴 | IndexedDB | Service Worker から localStorage は触れないため |
| 設定の保存 | localStorage ＋ 購読 JSON への同梱 | 端末ごとに地域・しきい値を変えて配信するため |
| 天気 | [Open-Meteo](https://open-meteo.com/) | API キー不要、非商用は無料、降水確率が時間単位で取れる |
| ホスティング | GitHub Pages（`main` ブランチの `/docs`） | 無料・HTTPS。Service Worker には HTTPS が必須 |
| スケジューラ | GitHub Actions の cron | サーバーを持たずに定時実行できる（遅延の問題は後述） |
| 購読の保管 | リポジトリ内の `subscriptions.json` | Pages は静的なので DB を置けない。ハッカソン規模なら十分 |
| 実行環境 | Node.js 24（ローカル）/ Node.js 22（Actions） | 追加ランタイムなし |

**有料サービスは一切使っていない。** 外部に預けている秘密情報は VAPID 秘密鍵のみで、
GitHub の Actions Secrets に置いている（リポジトリには入っていない）。

## 構成

```
ブラウザ（GitHub Pages）
  └ sw.js が push を受けて showNotification、履歴を IndexedDB に保存
購読情報 → subscriptions.json（端末ごとの設定つきでリポジトリにコミット）
スケジューラ → .github/workflows/rain.yml
                22:00 UTC = 7:00 JST  出発前
                09:00 UTC = 18:00 JST 帰宅前
天気 → Open-Meteo（リトライ5回・指数バックオフ）
送信 → web-push（VAPID）
```

端末ごとの設定（地域・しきい値・通知タイミング）は購読 JSON の `settings` に入り、
配信スクリプトがそれを読んで**人ごとに違う判定**をする。`settings` が無い購読は
リポジトリ変数（`LAT` / `LON` / `RAIN_THRESHOLD`）にフォールバックする。

## 画面

ホーム / 設定 / 通知履歴 / 傘の状態 の4画面。ハッシュルーティングのみ。
PC は左サイドバー、スマホは上部の横スクロールナビに畳まれる。

## 開発体制

- **画面設計**: あめみや（Figma で4画面を作成）
- **実装**: yousan が OpenClaw 上のアシスタント「じゅう」を通して Claude Code（Anthropic Opus 5）に書かせている。
  Discord のスレッドで指示 → じゅうがコードを書き、検証し、GitHub に push する、という流れ
- **リポジトリ**: <https://github.com/yousan/Meeple-and-Koma>
- **公開 URL**: <https://aizu-naranu.github.io/rain-push-pwa/>（このリポジトリの `docs/` と同じ中身）

## 動作実績（2026-11-13 〜 11-17）

実際に cron が回り、以下の判定と配信を行った。

- 11/15 降水確率 100% → 「今日は傘が必要です」送信成功
- 11/15 夕方 100% → 「帰宅時間に雨の予報です」送信成功
- 11/16 47%（しきい値 50% 未満）→ **送信せず**（意図どおり）
- 11/17 100% → 「帰宅時間に雨の予報です」送信成功

iPhone 実機での受信も確認済み（2026-11-13、ローカル直送と Actions 経由の両方）。

## 既知の弱点・未実装（正直に）

- **GitHub Actions の cron が大幅に遅れる。** 実測で朝の枠が 3.7〜4.2 時間、
  夕方の枠が 6.4〜10 時間遅れて実行された。Actions のスケジュールは混雑時の遅延が仕様で、
  時刻は保証されない。「正確に朝7時」が要るならスケジューラを別に持つ必要がある
- **スマートタグ連携は未実装。** 「傘の状態」画面はモックデータで、画面内にもその旨を明記している
- **強化通知**（傘が玄関にあるときの再通知）は設定 UI のみ。送信側はタグが前提なので未着手
- **購読の追加が手作業。** 画面に出る JSON を `subscriptions.json` にコミットする必要がある。
  静的ホスティングの制約で、人数が増えるなら別の置き場が要る
- Open-Meteo への接続は 11/14・11/16 に一度ずつ失敗した。リトライを 5 回・指数バックオフに増やして対処済み

# ameyaka — 傘を、忘れない。

雨の日の朝だけ「傘を持って」と知らせる PWA。UI はあめみやさんの Figma 設計に合わせています。

公開URL: <https://yousan.github.io/Meeple-and-Koma/>

使用技術・開発体制・既知の弱点は [TECH.md](TECH.md) にまとめてあります。

## 画面

| 画面 | 中身 | 状態 |
| --- | --- | --- |
| ホーム | 今日の天気・降水確率・傘の要否・今日の予定・タグ状態 | Open-Meteo から実データ |
| 設定 | 通知タイミング3種・しきい値・地域・出発/帰宅時刻・購読登録 | localStorage に保存 |
| 通知履歴 | 受信した push を種別で絞って一覧 | IndexedDB に実データ |
| 傘の状態 | スマートタグの接続・電池・位置 | **モック**（実機なし） |

## 構成

GitHub Pages は静的ホスティングなので「購読をサーバーに保存」「朝7時のスケジューラ」が置けない。
そこをリポジトリ内の JSON と GitHub Actions の cron で代用している。追加サーバも有料サービスも不要。

```
ブラウザ (GitHub Pages)
  └ sw.js が push を受けて showNotification + 履歴を IndexedDB に保存
購読情報 → subscriptions.json（端末ごとの設定つき）
スケジューラ → .github/workflows/rain.yml
                22:00 UTC = 7:00 JST  出発前
                09:00 UTC = 18:00 JST 帰宅前
天気 → Open-Meteo（APIキー不要・個人利用無料）
送信 → web-push（VAPID）
```

### 端末ごとの設定

設定画面で出す購読 JSON には `settings` が入る。`rain-check.mjs` はこれを読んで、
**端末ごとに地域・しきい値・通知タイミングを変えて判定する**。`settings` が無い購読は
リポジトリ変数（`LAT` / `LON` / `RAIN_THRESHOLD`）にフォールバックする。

```json
{
  "endpoint": "...",
  "keys": { "p256dh": "...", "auth": "..." },
  "settings": { "place": "渋谷区", "lat": 35.66, "lon": 139.70,
                "threshold": 40, "morning": true, "evening": true }
}
```

## セットアップ

```sh
npm install
npm run keys          # VAPID 鍵を生成
```

1. 公開鍵を `docs/config.js` に貼る
2. Settings → Secrets and variables → Actions
   - Secrets: `VAPID_PRIVATE_KEY`
   - Variables: `VAPID_PUBLIC_KEY` / `VAPID_SUBJECT` /（任意）`LAT` `LON` `RAIN_THRESHOLD`
3. Settings → Pages → Source: `main` の `/docs`
4. 公開 URL をスマホで開く → 設定画面で「通知を有効にする」
5. 出てきた購読 JSON を `subscriptions.json` の配列に追記 → commit & push

## 手動で通知を飛ばす（デモ・デバッグ）

```sh
npm run push -- "今日は傘が必要です" "降水確率70%。15時ごろから降り始める予報です。"
npm run rain -- --dry-run                 # 朝の判定を送らずに確認
npm run rain -- --slot=evening --dry-run  # 帰宅前の判定
npm run serve                             # http://localhost:8080
```

GitHub の Actions → 「雨チェックと通知」→ Run workflow でも発火できる
（`message` を入れるとその本文、空なら天気判定。`slot` で朝/夕を選ぶ）。

## 購読情報を公開したくないとき

このリポジトリは public なので、`subscriptions.json` に入れると端末の endpoint が誰でも読める。
実際に通知を送るには VAPID 秘密鍵で署名する必要があるため「勝手に通知を送られる」ことはないが、
端末を一意に識別できる文字列ではある。

気になる場合は、Actions Secret に **`SUBSCRIPTIONS_JSON`** として配列をそのまま入れる。
設定されていればファイルより優先され、`subscriptions.json` は空配列 `[]` のままでよい。

```json
[{ "endpoint": "https://web.push.apple.com/...", "keys": { "p256dh": "...", "auth": "..." } }]
```

## iOS の注意

- iOS 16.4 以降、**ホーム画面に追加した PWA からのみ** Web Push を受け取れる。
  Safari のタブで開いただけでは購読できない。
- `Notification.requestPermission()` はユーザー操作の中で呼ぶ必要がある（実装済み）。
- デモ当日はインストール済みの実機を用意して、通知が届く瞬間だけ見せるのが安全。

## 検証済み / 未検証

**検証済み**
- iPhone 実機に通知が届くこと（2026-11-13、ローカル直送と Actions 経由の両方）
- Open-Meteo から実データ取得、しきい値の両分岐
- Pages ビルドと全アセットの配信、4画面のレイアウト（Chrome 実描画）

**未検証**
- スマートタグ連携。「傘の状態」画面は**モックデータ**で、画面内にもその旨を明記している
- 強化通知（傘が玄関にあるときの再通知）は UI のトグルのみ。送信側の実装は未着手
- GitHub Actions の cron は混雑時に数分〜数十分遅れることがある（Actions の仕様）

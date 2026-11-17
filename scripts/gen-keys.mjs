import webpush from "web-push";

const keys = webpush.generateVAPIDKeys();
console.log(`
公開鍵 (docs/config.js に貼る / git に入れて OK)
  ${keys.publicKey}

秘密鍵 (GitHub の Secrets に VAPID_PRIVATE_KEY として登録。git に入れない)
  ${keys.privateKey}
`);

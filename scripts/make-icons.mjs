// 依存ゼロでプレースホルダのアイコン PNG を生成する（本番用の絵は後で差し替え）
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";

function crc32(buf) {
  let c, table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function png(size) {
  const raw = Buffer.alloc(size * (size * 3 + 1));
  const s = (v) => v * size;
  const cx = s(0.5), domeY = s(0.54), domeW = s(0.34), domeH = s(0.27);
  const shaftW = s(0.03), hookY = s(0.72), hookR = s(0.09);
  let p = 0;
  for (let y = 0; y < size; y++) {
    raw[p++] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const dx = (x - cx) / domeW, dy = (y - domeY) / domeH;
      // ameyaka マーク: ティール地に白い傘
      const hd = Math.hypot(x - (cx - hookR), y - hookY);
      const white =
        (y <= domeY && dx * dx + dy * dy <= 1) ||                       // 傘のドーム
        (Math.abs(x - cx) <= shaftW && y >= s(0.21) && y < hookY) ||    // 柄
        (y >= hookY && hd <= hookR + shaftW && hd >= hookR - shaftW);   // フック
      const [R, G, B] = white ? [255, 255, 255] : [47, 111, 124];
      raw[p++] = R; raw[p++] = G; raw[p++] = B;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8bit truecolor
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const dir = new URL("../docs/icons/", import.meta.url);
mkdirSync(dir, { recursive: true });
for (const size of [192, 512]) {
  const buf = png(size);
  writeFileSync(new URL(`icon-${size}.png`, dir), buf);
  console.log(`icon-${size}.png`, buf.length, "bytes", createHash("sha1").update(buf).digest("hex").slice(0, 8));
}

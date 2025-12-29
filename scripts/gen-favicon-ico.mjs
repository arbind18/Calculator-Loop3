import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

// Generates a minimal favicon.ico containing a single 32x32 PNG image.
// Modern browsers and Google accept ICO entries that embed PNG data.

const root = process.cwd();
const publicDir = join(root, "public");

const pngPath = join(publicDir, "favicon-32.png");
const icoPath = join(publicDir, "favicon.ico");

const png = await readFile(pngPath);

// ICO header (6 bytes)
// 0-1: reserved = 0
// 2-3: type = 1 (icon)
// 4-5: count = 1
const header = Buffer.from([0x00, 0x00, 0x01, 0x00, 0x01, 0x00]);

// Directory entry (16 bytes)
// width, height, colorCount, reserved
// planes (2), bitCount (2)
// bytesInRes (4), imageOffset (4)
const entry = Buffer.alloc(16);
entry.writeUInt8(32, 0); // width
entry.writeUInt8(32, 1); // height
entry.writeUInt8(0, 2); // color count
entry.writeUInt8(0, 3); // reserved
entry.writeUInt16LE(1, 4); // planes
entry.writeUInt16LE(32, 6); // bit count
entry.writeUInt32LE(png.length, 8); // bytes in resource
entry.writeUInt32LE(header.length + entry.length, 12); // image offset

const ico = Buffer.concat([header, entry, png]);
await writeFile(icoPath, ico);

console.log(`Wrote ${icoPath} (${ico.length} bytes) from ${pngPath} (${png.length} bytes)`);

import fs from "fs";

const toolFile = "src/lib/toolsData.ts";
const regFile = "src/lib/calculatorRegistry.ts";
const implFile = "src/components/calculators/categories/business/GenericBusinessTool.tsx";

const tools = fs.readFileSync(toolFile, "utf8");
const reg = fs.readFileSync(regFile, "utf8");
const impl = fs.readFileSync(implFile, "utf8");

const start = tools.indexOf("\n  business:");
const end = tools.indexOf("\n  education:");
const seg = start >= 0 && end > start ? tools.slice(start, end) : tools;

// Capture subcategory keys in order within the business section
const subcatRe = /\n\s*'([^']+)'\s*:\s*\{[\s\S]*?calculators\s*:\s*\[/g;
const subcats = [];
let m;
while ((m = subcatRe.exec(seg))) {
  subcats.push({ key: m[1], index: m.index });
}
subcats.sort((a, b) => a.index - b.index);

const subcatRanges = subcats.map((s, i) => ({
  key: s.key,
  start: s.index,
  end: i + 1 < subcats.length ? subcats[i + 1].index : seg.length,
}));

const idToSubcat = new Map();
const idToTitle = new Map();

for (const r of subcatRanges) {
  const chunk = seg.slice(r.start, r.end);
  for (const match of chunk.matchAll(/\{\s*id:\s*'([^']+)'\s*,\s*title:\s*'([^']+)'/g)) {
    idToSubcat.set(match[1], r.key);
    idToTitle.set(match[1], match[2]);
  }
}

// IDs wired to the generic Business calculator component
const regMatch = reg.match(/const\s+genericBusinessToolIds\s*=\s*\[((?:.|\r|\n)*?)\]\s*;?/);
const regSeg = regMatch ? regMatch[1] : "";
const idsReg = [...regSeg.matchAll(/'([^']+)'/g)].map((x) => x[1]);
const all = [...new Set(idsReg)].sort();

const implemented = [...new Set([...impl.matchAll(/id\s*===\s*'([^']+)'/g)].map((x) => x[1]))].sort();
const implementedSet = new Set(implemented);

const missing = all.filter((id) => !implementedSet.has(id));

const bySubcat = {};
for (const id of missing) {
  const k = idToSubcat.get(id) || "unknown";
  (bySubcat[k] ??= []).push(id);
}

const lines = [];
lines.push("# Business category readiness");
lines.push("");
lines.push("Total tools (in registry): " + all.length);
lines.push("Implemented (has explicit config): " + implemented.length);
lines.push("Not implemented (shows Not Configured): " + missing.length);
lines.push("");

lines.push("## Implemented (has explicit config)");
for (const id of implemented) {
  const title = idToTitle.get(id) || id;
  const sub = idToSubcat.get(id) || "unknown";
  lines.push("- " + id + " - " + title + " (" + sub + ")");
}

lines.push("");
lines.push("## Not implemented (needs formula)");

for (const sub of subcats.map((s) => s.key).concat(["unknown"])) {
  const ids = bySubcat[sub];
  if (!ids || ids.length === 0) continue;
  lines.push("");
  lines.push("### " + sub + " (" + ids.length + ")");
  for (const id of ids) {
    const title = idToTitle.get(id) || id;
    lines.push("- " + id + " - " + title);
  }
}

fs.writeFileSync("business-tools-status.md", lines.join("\n"));

console.log(
  JSON.stringify(
    {
      total: all.length,
      implemented: implemented.length,
      missing: missing.length,
      missingSample: missing.slice(0, 25),
    },
    null,
    2
  )
);

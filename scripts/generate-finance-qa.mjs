import fs from 'fs';
import path from 'path';

const outFile = path.join(process.cwd(), 'src/content/qa/finance.generated.json');

const args = process.argv.slice(2);
const argNum = (name, fallback) => {
  const idx = args.indexOf(name);
  if (idx === -1) return fallback;
  const n = Number(args[idx + 1]);
  return Number.isFinite(n) ? n : fallback;
};

const N_GST = argNum('--gst', 200);
const N_EMI = argNum('--emi', 200);
const N_COMP = argNum('--compound', 200);
const N_PL = argNum('--profitloss', 200);

// Seeded RNG for reproducibility
let seed = argNum('--seed', 42);
const rand = () => {
  // xorshift32
  seed ^= seed << 13;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  return ((seed >>> 0) % 1_000_000) / 1_000_000;
};

const pick = (arr) => arr[Math.floor(rand() * arr.length)];

const formatINR = (n) => {
  const rounded = Math.round(n);
  const s = String(rounded);
  // Indian grouping
  const last3 = s.slice(-3);
  const other = s.slice(0, -3);
  const withCommas = other.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return other ? `${withCommas},${last3}` : last3;
};

const toLakhCrore = (n) => {
  if (n >= 1e7) return `${(n / 1e7).toFixed(2)} crore`;
  if (n >= 1e5) return `${(n / 1e5).toFixed(2)} lakh`;
  return `${n.toFixed(2)}`;
};

const uniq = new Set();
const items = [];

const pushUnique = (topic, lang, q, a, tags = []) => {
  const key = q.toLowerCase().replace(/\s+/g, ' ').trim();
  if (uniq.has(key)) return false;
  uniq.add(key);
  const id = `${topic}-${uniq.size}`;
  items.push({ id, topic, lang, q, a, tags });
  return true;
};

const tooSimilar = (q, existing, threshold = 0.92) => {
  // Simple Jaccard similarity on tokens to avoid near-duplicates
  const tok = (t) => t
    .toLowerCase()
    .replace(/[₹,]/g, ' ')
    .replace(/[^\p{L}\p{N}%]+/gu, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter((x) => x.length >= 3);

  const A = new Set(tok(q));
  for (const e of existing) {
    const B = new Set(tok(e));
    if (A.size === 0 || B.size === 0) continue;
    let inter = 0;
    for (const x of A) if (B.has(x)) inter++;
    const union = A.size + B.size - inter;
    const sim = inter / union;
    if (sim >= threshold) return true;
  }
  return false;
};

const qCacheByTopic = {
  gst: [],
  emi: [],
  compound: [],
  'profit-loss': [],
};

// ---------- GST ----------
const gstRates = [5, 12, 18, 28];
const gstTemplates = [
  (amt, rate) => ({
    lang: 'mix',
    q: `GST ${rate}% on ₹${formatINR(amt)} = kitna?`,
  }),
  (amt, rate) => ({
    lang: 'en',
    q: `Calculate GST ${rate}% on ₹${formatINR(amt)}.`,
  }),
  (amt, rate) => ({
    lang: 'hi',
    q: `₹${formatINR(amt)} par ${rate}% GST nikaalo (amount + GST).`,
  }),
  (amt, rate) => ({
    lang: 'mix',
    q: `₹${formatINR(amt)} ka bill hai, GST ${rate}% add karke total?`,
  }),
];

const gstAnswer = (amt, rate) => {
  const tax = (amt * rate) / 100;
  const total = amt + tax;
  const half = tax / 2;
  return `Answer: GST = ₹${formatINR(tax)}, Total = ₹${formatINR(total)}\n\nSteps: GST = Amount × ${rate}% = ${formatINR(amt)} × ${rate}/100\nIf CGST/SGST: CGST = ₹${formatINR(half)}, SGST = ₹${formatINR(half)}.`;
};

let guard = 0;
while (qCacheByTopic.gst.length < N_GST && guard++ < N_GST * 50) {
  const amt = Math.floor(500 + rand() * 500000); // 500 to 5L
  const rate = pick(gstRates);
  const tpl = pick(gstTemplates);
  const { q, lang } = tpl(amt, rate);
  if (tooSimilar(q, qCacheByTopic.gst)) continue;
  const ok = pushUnique('gst', lang, q, gstAnswer(amt, rate), ['gst', 'tax']);
  if (ok) qCacheByTopic.gst.push(q);
}

// ---------- EMI ----------
const emiTemplates = [
  (p, r, y) => ({ lang: 'mix', q: `₹${formatINR(p)} loan, ${r}% annual, ${y} years: EMI kitni?` }),
  (p, r, y) => ({ lang: 'en', q: `EMI for loan ₹${formatINR(p)} at ${r}% p.a. for ${y} years?` }),
  (p, r, y) => ({ lang: 'hi', q: `Loan amount ₹${formatINR(p)}, rate ${r}% (annual), tenure ${y} saal — EMI nikaalo.` }),
  (p, r, y) => ({ lang: 'mix', q: `Home/Personal loan ₹${formatINR(p)} @ ${r}% for ${y} years. Monthly EMI?` }),
];

const emiCalc = (P, annualRate, years) => {
  const n = years * 12;
  const r = annualRate / 12 / 100;
  const pow = Math.pow(1 + r, n);
  const emi = (P * r * pow) / (pow - 1);
  const totalPay = emi * n;
  const interest = totalPay - P;
  return { emi, totalPay, interest, n, r };
};

const emiAnswer = (P, annualRate, years) => {
  const { emi, totalPay, interest, n } = emiCalc(P, annualRate, years);
  return `Answer: Monthly EMI ≈ ₹${formatINR(emi)}\nTotal payment ≈ ₹${formatINR(totalPay)}\nTotal interest ≈ ₹${formatINR(interest)}\n\nSteps: n = ${years}×12 = ${n} months (Monthly compounding standard EMI).`;
};

guard = 0;
while (qCacheByTopic.emi.length < N_EMI && guard++ < N_EMI * 60) {
  const P = Math.floor(20000 + rand() * 4000000); // 20k to 40L
  const r = Math.round((6 + rand() * 16) * 10) / 10; // 6% to 22%, 0.1 step
  const y = Math.floor(1 + rand() * 25);
  const { q, lang } = pick(emiTemplates)(P, r, y);
  if (tooSimilar(q, qCacheByTopic.emi)) continue;
  const ok = pushUnique('emi', lang, q, emiAnswer(P, r, y), ['emi', 'loan']);
  if (ok) qCacheByTopic.emi.push(q);
}

// ---------- Compound / Growth ----------
const compTemplates = [
  (p, r, y) => ({ lang: 'hi', q: `Mere paas ₹${formatINR(p)} hai aur ${r}% har saal return mile to ${y} saal me kitna ho jayega?` }),
  (p, r, y) => ({ lang: 'en', q: `If I invest ₹${formatINR(p)} at ${r}% yearly for ${y} years, what will it become?` }),
  (p, r, y) => ({ lang: 'mix', q: `₹${formatINR(p)} at ${r}% per year for ${y} years (compound). Final amount?` }),
  (p, r, y) => ({ lang: 'mix', q: `₹${formatINR(p)} ka investment, annual growth ${r}%, ${y} years after amount?` }),
];

const compAnswer = (P, rate, years) => {
  const A = P * Math.pow(1 + rate / 100, years);
  return `Answer: Final amount ≈ ₹${formatINR(A)} (≈ ${toLakhCrore(A)})\n\nFormula: A = P(1 + r/100)^n\nP = ₹${formatINR(P)}, r = ${rate}%, n = ${years}`;
};

guard = 0;
while (qCacheByTopic.compound.length < N_COMP && guard++ < N_COMP * 60) {
  const P = Math.floor(10000 + rand() * 5000000);
  const r = Math.round((1 + rand() * 20) * 10) / 10;
  const y = Math.floor(2 + rand() * 50);
  const { q, lang } = pick(compTemplates)(P, r, y);
  if (tooSimilar(q, qCacheByTopic.compound)) continue;
  const ok = pushUnique('compound', lang, q, compAnswer(P, r, y), ['compound', 'growth']);
  if (ok) qCacheByTopic.compound.push(q);
}

// ---------- Profit/Loss ----------
const plTemplates = [
  (cp, sp) => ({ lang: 'hi', q: `CP ₹${formatINR(cp)} aur SP ₹${formatINR(sp)} hai. Profit/Loss %?` }),
  (cp, sp) => ({ lang: 'en', q: `Cost price ₹${formatINR(cp)} and selling price ₹${formatINR(sp)}. Profit or loss percent?` }),
  (cp, sp) => ({ lang: 'mix', q: `₹${formatINR(cp)} me kharida aur ₹${formatINR(sp)} me becha: profit/loss kitna?` }),
  (cp, sp) => ({ lang: 'mix', q: `Buy ₹${formatINR(cp)}, sell ₹${formatINR(sp)} — P/L amount and %?` }),
];

const plAnswer = (CP, SP) => {
  const diff = SP - CP;
  const pct = (Math.abs(diff) / CP) * 100;
  const type = diff >= 0 ? 'Profit' : 'Loss';
  return `Answer: ${type} = ₹${formatINR(Math.abs(diff))} (~${pct.toFixed(2)}%)\n\nSteps: % = |SP-CP|/CP × 100`;
};

guard = 0;
while (qCacheByTopic['profit-loss'].length < N_PL && guard++ < N_PL * 60) {
  const CP = Math.floor(100 + rand() * 500000);
  // allow both profit and loss
  const factor = 0.5 + rand() * 1.5;
  const SP = Math.max(1, Math.floor(CP * factor));
  const { q, lang } = pick(plTemplates)(CP, SP);
  if (tooSimilar(q, qCacheByTopic['profit-loss'])) continue;
  const ok = pushUnique('profit-loss', lang, q, plAnswer(CP, SP), ['profit', 'loss']);
  if (ok) qCacheByTopic['profit-loss'].push(q);
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(items, null, 2), 'utf-8');

console.log('Generated:', items.length, 'QAs');
console.log('Output:', outFile);
console.log('Counts:', {
  gst: qCacheByTopic.gst.length,
  emi: qCacheByTopic.emi.length,
  compound: qCacheByTopic.compound.length,
  profitLoss: qCacheByTopic['profit-loss'].length,
});

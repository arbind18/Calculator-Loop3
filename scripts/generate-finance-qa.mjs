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
const N_GST_REV = argNum('--gst-reverse', 200);
const N_EMI = argNum('--emi', 200);
const N_COMP = argNum('--compound', 200);
const N_SIP = argNum('--sip', 200);
const N_SIP_REQ = argNum('--sip-required', 200);
const N_LUMP_REQ = argNum('--lumpsum-required', 200);
const N_CAGR = argNum('--cagr', 200);
const N_FD = argNum('--fd', 200);
const N_RD = argNum('--rd', 200);
const N_SI = argNum('--simple-interest', 200);
const N_INFL = argNum('--inflation', 200);
const N_SAL = argNum('--salary-breakup', 200);
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
  'gst-reverse': [],
  emi: [],
  compound: [],
  sip: [],
  'sip-required': [],
  'lumpsum-required': [],
  cagr: [],
  fd: [],
  rd: [],
  'simple-interest': [],
  inflation: [],
  'salary-breakup': [],
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

// ---------- GST (Reverse / Inclusive) ----------
const gstRevTemplates = [
  (total, rate) => ({ lang: 'mix', q: `₹${formatINR(total)} (GST inclusive) hai. Rate ${rate}%. Base price aur GST nikaalo.` }),
  (total, rate) => ({ lang: 'en', q: `₹${formatINR(total)} is GST-inclusive at ${rate}%. Find base amount and GST.` }),
  (total, rate) => ({ lang: 'hi', q: `Total ₹${formatINR(total)} (GST ke saath) hai, GST ${rate}%. Original price kitni thi?` }),
  (total, rate) => ({ lang: 'mix', q: `Inclusive bill ₹${formatINR(total)}, GST ${rate}%. GST amount?` }),
];

const gstReverseAnswer = (total, rate) => {
  const base = total / (1 + rate / 100);
  const gst = total - base;
  const half = gst / 2;
  return `Answer: Base ≈ ₹${formatINR(base)}, GST ≈ ₹${formatINR(gst)} (Total ₹${formatINR(total)})\n\nSteps: Base = Total / (1 + ${rate}/100)\nGST = Total - Base\nIf CGST/SGST: CGST ≈ ₹${formatINR(half)}, SGST ≈ ₹${formatINR(half)}.`;
};

guard = 0;
while (qCacheByTopic['gst-reverse'].length < N_GST_REV && guard++ < N_GST_REV * 60) {
  const rate = pick(gstRates);
  const base = Math.floor(500 + rand() * 500000);
  const total = base + (base * rate) / 100;
  const tpl = pick(gstRevTemplates);
  const { q, lang } = tpl(total, rate);
  if (tooSimilar(q, qCacheByTopic['gst-reverse'])) continue;
  const ok = pushUnique('gst-reverse', lang, q, gstReverseAnswer(total, rate), ['gst', 'reverse', 'inclusive']);
  if (ok) qCacheByTopic['gst-reverse'].push(q);
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

// ---------- SIP (Future Value) ----------
const sipTemplates = [
  (p, r, y) => ({ lang: 'hi', q: `Agar main ₹${formatINR(p)} per month SIP karu aur return ${r}% yearly ho to ${y} saal me kitna banega?` }),
  (p, r, y) => ({ lang: 'en', q: `If I do a SIP of ₹${formatINR(p)}/month at ${r}% annual return for ${y} years, what is the future value?` }),
  (p, r, y) => ({ lang: 'mix', q: `Monthly SIP ₹${formatINR(p)}, return ${r}% p.a., duration ${y} years. Final amount?` }),
  (p, r, y) => ({ lang: 'mix', q: `SIP: ₹${formatINR(p)} per month @ ${r}% for ${y} years — maturity value?` }),
];

const sipFV = (monthly, annualRate, years) => {
  const n = years * 12;
  const i = annualRate / 12 / 100;
  // Assumption: SIP at month end (annuity immediate). Many sites use (1+i) factor for month-begin; keep simple and mention assumption.
  const fv = monthly * ((Math.pow(1 + i, n) - 1) / i);
  return { fv, n, i };
};

const sipRequired = (targetFV, annualRate, years) => {
  const n = years * 12;
  const i = annualRate / 12 / 100;
  const factor = (Math.pow(1 + i, n) - 1) / i;
  const pmt = targetFV / factor;
  return { pmt, n, i };
};

const sipAnswer = (monthly, annualRate, years) => {
  const { fv, n } = sipFV(monthly, annualRate, years);
  const invested = monthly * n;
  const gain = fv - invested;
  return `Answer: Future value ≈ ₹${formatINR(fv)}\nTotal invested = ₹${formatINR(invested)}\nEstimated gain ≈ ₹${formatINR(gain)}\n\nSteps: i = (${annualRate}%/12), n = ${years}×12 = ${n}\nFV ≈ P × [((1+i)^n - 1)/i] (assumes SIP at month end).`;
};

guard = 0;
while (qCacheByTopic.sip.length < N_SIP && guard++ < N_SIP * 70) {
  const p = Math.floor(500 + rand() * 95000); // 500..95k per month
  const r = Math.round((4 + rand() * 20) * 10) / 10; // 4..24%
  const y = Math.floor(1 + rand() * 30);
  const { q, lang } = pick(sipTemplates)(p, r, y);
  if (tooSimilar(q, qCacheByTopic.sip)) continue;
  const ok = pushUnique('sip', lang, q, sipAnswer(p, r, y), ['sip', 'investment']);
  if (ok) qCacheByTopic.sip.push(q);
}

// ---------- SIP Required (Goal-based) ----------
const sipReqTemplates = [
  (target, r, y) => ({ lang: 'hi', q: `Mujhe ${y} saal me ₹${formatINR(target)} chahiye. Return ${r}% p.a. ho to monthly SIP kitni honi chahiye?` }),
  (target, r, y) => ({ lang: 'en', q: `I want ₹${formatINR(target)} in ${y} years. At ${r}% p.a., what monthly SIP is needed?` }),
  (target, r, y) => ({ lang: 'mix', q: `Goal ₹${formatINR(target)} in ${y} years at ${r}%. Required SIP per month?` }),
  (target, r, y) => ({ lang: 'mix', q: `Target ₹${formatINR(target)} after ${y} years, expected return ${r}% yearly. SIP amount?` }),
];

const sipReqAnswer = (target, annualRate, years) => {
  const { pmt, n } = sipRequired(target, annualRate, years);
  const invested = pmt * n;
  return `Answer: Required SIP ≈ ₹${formatINR(pmt)} per month\nTotal invested ≈ ₹${formatINR(invested)}\n\nSteps: i = (${annualRate}%/12), n = ${years}×12 = ${n}\nP ≈ Target / [((1+i)^n - 1)/i] (assumes SIP at month end).`;
};

guard = 0;
while (qCacheByTopic['sip-required'].length < N_SIP_REQ && guard++ < N_SIP_REQ * 80) {
  const target = Math.floor(100000 + rand() * 20000000); // 1L..2Cr
  const r = Math.round((6 + rand() * 18) * 10) / 10; // 6..24%
  const y = Math.floor(2 + rand() * 30);
  const { q, lang } = pick(sipReqTemplates)(target, r, y);
  if (tooSimilar(q, qCacheByTopic['sip-required'])) continue;
  const ok = pushUnique('sip-required', lang, q, sipReqAnswer(target, r, y), ['sip', 'goal']);
  if (ok) qCacheByTopic['sip-required'].push(q);
}

// ---------- Lumpsum Required (Goal-based) ----------
const lumpReqTemplates = [
  (target, r, y) => ({ lang: 'en', q: `To get ₹${formatINR(target)} in ${y} years at ${r}% p.a., how much lumpsum should I invest today?` }),
  (target, r, y) => ({ lang: 'hi', q: `Aaj kitna lumpsum invest karu ki ${y} saal baad ₹${formatINR(target)} ho jaye? Return ${r}% p.a.` }),
  (target, r, y) => ({ lang: 'mix', q: `Target ₹${formatINR(target)} after ${y} years at ${r}% yearly. Required lumpsum today?` }),
  (target, r, y) => ({ lang: 'mix', q: `₹${formatINR(target)} goal, tenure ${y} years, return ${r}%. Present investment amount?` }),
];

const lumpReqAnswer = (target, annualRate, years) => {
  const P = target / Math.pow(1 + annualRate / 100, years);
  return `Answer: Required lumpsum today ≈ ₹${formatINR(P)}\n\nFormula: P = Target / (1 + r/100)^n\nTarget=₹${formatINR(target)}, r=${annualRate}%, n=${years}`;
};

guard = 0;
while (qCacheByTopic['lumpsum-required'].length < N_LUMP_REQ && guard++ < N_LUMP_REQ * 80) {
  const target = Math.floor(50000 + rand() * 20000000);
  const r = Math.round((3 + rand() * 18) * 10) / 10;
  const y = Math.floor(1 + rand() * 40);
  const { q, lang } = pick(lumpReqTemplates)(target, r, y);
  if (tooSimilar(q, qCacheByTopic['lumpsum-required'])) continue;
  const ok = pushUnique('lumpsum-required', lang, q, lumpReqAnswer(target, r, y), ['lumpsum', 'goal']);
  if (ok) qCacheByTopic['lumpsum-required'].push(q);
}

// ---------- CAGR ----------
const cagrTemplates = [
  (s, e, y) => ({ lang: 'en', q: `Start ₹${formatINR(s)}, end ₹${formatINR(e)} in ${y} years. What is CAGR?` }),
  (s, e, y) => ({ lang: 'hi', q: `Agar ₹${formatINR(s)} ${y} saal me ₹${formatINR(e)} ho jaye, CAGR kitna hoga?` }),
  (s, e, y) => ({ lang: 'mix', q: `CAGR: ₹${formatINR(s)} → ₹${formatINR(e)} over ${y} years. CAGR %?` }),
  (s, e, y) => ({ lang: 'mix', q: `Annual growth rate (CAGR) for ₹${formatINR(s)} to ₹${formatINR(e)} in ${y} years?` }),
];

const cagrAnswer = (start, end, years) => {
  const cagr = (Math.pow(end / start, 1 / years) - 1) * 100;
  return `Answer: CAGR ≈ ${cagr.toFixed(2)}% per year\n\nFormula: CAGR = (End/Start)^(1/Years) - 1\nStart=₹${formatINR(start)}, End=₹${formatINR(end)}, Years=${years}`;
};

guard = 0;
while (qCacheByTopic.cagr.length < N_CAGR && guard++ < N_CAGR * 70) {
  const start = Math.floor(1000 + rand() * 5000000);
  const years = Math.floor(1 + rand() * 30);
  const mult = 0.4 + rand() * 5.0; // allow down/up
  const end = Math.max(1, Math.floor(start * mult));
  const { q, lang } = pick(cagrTemplates)(start, end, years);
  if (tooSimilar(q, qCacheByTopic.cagr)) continue;
  const ok = pushUnique('cagr', lang, q, cagrAnswer(start, end, years), ['cagr', 'growth']);
  if (ok) qCacheByTopic.cagr.push(q);
}

// ---------- FD (Maturity) ----------
const fdTemplates = [
  (p, r, y) => ({ lang: 'hi', q: `FD: ₹${formatINR(p)} at ${r}% for ${y} years (quarterly compounding). Maturity amount?` }),
  (p, r, y) => ({ lang: 'en', q: `Fixed Deposit ₹${formatINR(p)} at ${r}% for ${y} years (compounded quarterly). Maturity value?` }),
  (p, r, y) => ({ lang: 'mix', q: `FD ₹${formatINR(p)} @ ${r}% for ${y} years, quarterly. Final amount?` }),
  (p, r, y) => ({ lang: 'mix', q: `Bank FD: principal ₹${formatINR(p)}, rate ${r}% p.a., tenure ${y} years. Maturity?` }),
];

const fdAnswer = (P, annualRate, years) => {
  const n = years * 4;
  const r = annualRate / 100 / 4;
  const A = P * Math.pow(1 + r, n);
  const interest = A - P;
  return `Answer: Maturity ≈ ₹${formatINR(A)}\nInterest earned ≈ ₹${formatINR(interest)}\n\nFormula: A = P(1 + r/4)^(4t)\nP=₹${formatINR(P)}, r=${annualRate}%, t=${years}`;
};

guard = 0;
while (qCacheByTopic.fd.length < N_FD && guard++ < N_FD * 70) {
  const P = Math.floor(1000 + rand() * 5000000);
  const r = Math.round((3 + rand() * 10) * 10) / 10; // 3..13%
  const y = Math.floor(1 + rand() * 10);
  const { q, lang } = pick(fdTemplates)(P, r, y);
  if (tooSimilar(q, qCacheByTopic.fd)) continue;
  const ok = pushUnique('fd', lang, q, fdAnswer(P, r, y), ['fd', 'deposit']);
  if (ok) qCacheByTopic.fd.push(q);
}

// ---------- RD (Maturity) ----------
const rdTemplates = [
  (m, r, y) => ({ lang: 'hi', q: `RD: ₹${formatINR(m)} per month, rate ${r}% p.a., duration ${y} years. Maturity kitni?` }),
  (m, r, y) => ({ lang: 'en', q: `Recurring Deposit ₹${formatINR(m)}/month at ${r}% p.a. for ${y} years. Maturity amount?` }),
  (m, r, y) => ({ lang: 'mix', q: `RD ₹${formatINR(m)}/month @ ${r}% for ${y} years. Final amount?` }),
  (m, r, y) => ({ lang: 'mix', q: `Monthly RD deposit ₹${formatINR(m)} for ${y} years at ${r}% annual. Maturity value?` }),
];

const rdMaturity = (monthly, annualRate, years) => {
  const months = years * 12;
  const i = annualRate / 12 / 100;
  // Approximate RD by compounding each installment for remaining months (month-end deposit)
  let A = 0;
  for (let k = 0; k < months; k++) {
    const remaining = months - k;
    A += monthly * Math.pow(1 + i, remaining);
  }
  return { A, months };
};

const rdAnswer = (monthly, annualRate, years) => {
  const { A, months } = rdMaturity(monthly, annualRate, years);
  const invested = monthly * months;
  const interest = A - invested;
  return `Answer: RD maturity ≈ ₹${formatINR(A)}\nTotal invested = ₹${formatINR(invested)}\nInterest ≈ ₹${formatINR(interest)}\n\nNote: Approximation using monthly compounding at ${annualRate}% p.a. (month-end deposits).`;
};

guard = 0;
while (qCacheByTopic.rd.length < N_RD && guard++ < N_RD * 70) {
  const m = Math.floor(100 + rand() * 50000);
  const r = Math.round((3 + rand() * 9) * 10) / 10;
  const y = Math.floor(1 + rand() * 10);
  const { q, lang } = pick(rdTemplates)(m, r, y);
  if (tooSimilar(q, qCacheByTopic.rd)) continue;
  const ok = pushUnique('rd', lang, q, rdAnswer(m, r, y), ['rd', 'deposit']);
  if (ok) qCacheByTopic.rd.push(q);
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

// ---------- Simple Interest ----------
const siTemplates = [
  (p, r, y) => ({ lang: 'hi', q: `Simple Interest: ₹${formatINR(p)} par ${r}% yearly se ${y} saal me kitna interest aur total?` }),
  (p, r, y) => ({ lang: 'en', q: `Simple interest on ₹${formatINR(p)} at ${r}% per year for ${y} years. Interest and total amount?` }),
  (p, r, y) => ({ lang: 'mix', q: `P=₹${formatINR(p)}, R=${r}%, T=${y} years (simple interest). Total amount?` }),
  (p, r, y) => ({ lang: 'mix', q: `₹${formatINR(p)} simple interest @ ${r}% for ${y} years. Final amount?` }),
];

const siAnswer = (P, rate, years) => {
  const I = (P * rate * years) / 100;
  const A = P + I;
  return `Answer: Interest = ₹${formatINR(I)}, Total = ₹${formatINR(A)}\n\nFormula: SI = (P×R×T)/100\nP=₹${formatINR(P)}, R=${rate}%, T=${years}`;
};

guard = 0;
while (qCacheByTopic['simple-interest'].length < N_SI && guard++ < N_SI * 70) {
  const P = Math.floor(500 + rand() * 5000000);
  const r = Math.round((1 + rand() * 25) * 10) / 10;
  const y = Math.floor(1 + rand() * 30);
  const { q, lang } = pick(siTemplates)(P, r, y);
  if (tooSimilar(q, qCacheByTopic['simple-interest'])) continue;
  const ok = pushUnique('simple-interest', lang, q, siAnswer(P, r, y), ['simple-interest']);
  if (ok) qCacheByTopic['simple-interest'].push(q);
}

// ---------- Inflation ----------
const inflTemplates = [
  (p, r, y) => ({ lang: 'hi', q: `Aaj ki ₹${formatINR(p)} ki cheez, agar inflation ${r}% ho to ${y} saal baad kitni hogi?` }),
  (p, r, y) => ({ lang: 'en', q: `If something costs ₹${formatINR(p)} today and inflation is ${r}% per year, what will it cost after ${y} years?` }),
  (f, r, y) => ({ lang: 'mix', q: `Future cost ₹${formatINR(f)} hai (${y} years later), inflation ${r}%. Aaj ki value (present value) kitni?` }),
  (f, r, y) => ({ lang: 'en', q: `Future amount ₹${formatINR(f)} after ${y} years, inflation ${r}%. What is the present value today?` }),
];

const inflFuture = (present, rate, years) => present * Math.pow(1 + rate / 100, years);
const inflPV = (future, rate, years) => future / Math.pow(1 + rate / 100, years);

const inflAnswerFuture = (present, rate, years) => {
  const f = inflFuture(present, rate, years);
  return `Answer: Estimated future cost ≈ ₹${formatINR(f)}\n\nFormula: Future = Present × (1 + inflation)^years\nPresent=₹${formatINR(present)}, inflation=${rate}%, years=${years}`;
};

const inflAnswerPV = (future, rate, years) => {
  const pv = inflPV(future, rate, years);
  return `Answer: Present value today ≈ ₹${formatINR(pv)}\n\nFormula: PV = Future / (1 + inflation)^years\nFuture=₹${formatINR(future)}, inflation=${rate}%, years=${years}`;
};

guard = 0;
while (qCacheByTopic.inflation.length < N_INFL && guard++ < N_INFL * 80) {
  const rate = Math.round((2 + rand() * 12) * 10) / 10; // 2..14%
  const years = Math.floor(1 + rand() * 40);

  // Mix future and PV questions
  const isPV = rand() < 0.45;
  if (!isPV) {
    const present = Math.floor(100 + rand() * 5000000);
    const { q, lang } = pick(inflTemplates.slice(0, 2))(present, rate, years);
    if (tooSimilar(q, qCacheByTopic.inflation)) continue;
    const ok = pushUnique('inflation', lang, q, inflAnswerFuture(present, rate, years), ['inflation']);
    if (ok) qCacheByTopic.inflation.push(q);
  } else {
    const future = Math.floor(1000 + rand() * 8000000);
    const { q, lang } = pick(inflTemplates.slice(2))(future, rate, years);
    if (tooSimilar(q, qCacheByTopic.inflation)) continue;
    const ok = pushUnique('inflation', lang, q, inflAnswerPV(future, rate, years), ['inflation', 'present-value']);
    if (ok) qCacheByTopic.inflation.push(q);
  }
}

// ---------- Salary Breakup (Simple / Assumption-based) ----------
const salTemplates = [
  (ctcLpa, basicPct, hraPct, varPct) => ({
    lang: 'mix',
    q: `CTC ${ctcLpa} LPA hai. Basic ${basicPct}% + HRA ${hraPct}% of Basic + Variable ${varPct}% (annual). Monthly breakup?`,
  }),
  (ctcLpa, basicPct, hraPct, varPct) => ({
    lang: 'en',
    q: `CTC ${ctcLpa} LPA: assume Basic ${basicPct}%, HRA ${hraPct}% of Basic, Variable pay ${varPct}% yearly. Provide monthly breakup.`,
  }),
  (ctcLpa, basicPct, hraPct, varPct) => ({
    lang: 'hi',
    q: `Mera CTC ${ctcLpa} LPA hai. Basic ${basicPct}% aur HRA Basic ka ${hraPct}%, variable ${varPct}% maan kar monthly breakup batao.`,
  }),
  (ctcLpa, basicPct, hraPct, varPct) => ({
    lang: 'mix',
    q: `Salary breakup: ${ctcLpa} LPA, Basic ${basicPct}%, HRA ${hraPct}% of Basic, Variable ${varPct}%. Monthly figures?`,
  }),
  (ctcLpa, basicPct, hraPct, varPct) => ({
    lang: 'mix',
    q: `CTC ${ctcLpa} LPA ka monthly gross kitna hoga? Basic ${basicPct}% aur HRA ${hraPct}% of Basic (variable ${varPct}%).`,
  }),
];

const salAnswer = (ctcLpa, basicPct, hraPct, varPct) => {
  const annual = ctcLpa * 100000;
  const annualVariable = (annual * varPct) / 100;
  const annualFixed = annual - annualVariable;
  const monthlyFixed = annualFixed / 12;
  const monthlyGross = annual / 12;

  const basic = (monthlyFixed * basicPct) / 100;
  const hra = (basic * hraPct) / 100;
  const pf = (basic * 12) / 100; // rough PF estimate
  const other = monthlyFixed - basic - hra;

  return `Answer (monthly, approx):\n- Monthly CTC ≈ ₹${formatINR(monthlyGross)}\n- Fixed (monthly) ≈ ₹${formatINR(monthlyFixed)}\n- Variable (monthly avg) ≈ ₹${formatINR(annualVariable / 12)}\n\nFixed breakup (assumed):\n- Basic (${basicPct}% of fixed) ≈ ₹${formatINR(basic)}\n- HRA (${hraPct}% of Basic) ≈ ₹${formatINR(hra)}\n- Other/Special ≈ ₹${formatINR(other)}\n- PF estimate (~12% of Basic) ≈ ₹${formatINR(pf)}\n\nNote: This is assumption-based; actual salary structure varies by company and location.`;
};

guard = 0;
while (qCacheByTopic['salary-breakup'].length < N_SAL && guard++ < N_SAL * 90) {
  const ctcLpa = Math.round((3 + rand() * 97) * 10) / 10; // 3.0..100.0 LPA
  const basicPct = pick([30, 35, 40, 45, 50, 55]);
  const hraPct = pick([40, 45, 50]);
  const varPct = pick([0, 10, 15, 20, 25]);
  const { q, lang } = pick(salTemplates)(ctcLpa, basicPct, hraPct, varPct);

  // Use a higher threshold here so we only block near-identical questions
  if (tooSimilar(q, qCacheByTopic['salary-breakup'], 0.97)) continue;

  const ok = pushUnique(
    'salary-breakup',
    lang,
    q,
    salAnswer(ctcLpa, basicPct, hraPct, varPct),
    ['salary', 'breakup']
  );
  if (ok) qCacheByTopic['salary-breakup'].push(q);
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(items, null, 2), 'utf-8');

console.log('Generated:', items.length, 'QAs');
console.log('Output:', outFile);
console.log('Counts:', {
  gst: qCacheByTopic.gst.length,
  gstReverse: qCacheByTopic['gst-reverse'].length,
  emi: qCacheByTopic.emi.length,
  compound: qCacheByTopic.compound.length,
  sip: qCacheByTopic.sip.length,
  sipRequired: qCacheByTopic['sip-required'].length,
  lumpsumRequired: qCacheByTopic['lumpsum-required'].length,
  cagr: qCacheByTopic.cagr.length,
  fd: qCacheByTopic.fd.length,
  rd: qCacheByTopic.rd.length,
  simpleInterest: qCacheByTopic['simple-interest'].length,
  inflation: qCacheByTopic.inflation.length,
  salaryBreakup: qCacheByTopic['salary-breakup'].length,
  profitLoss: qCacheByTopic['profit-loss'].length,
});

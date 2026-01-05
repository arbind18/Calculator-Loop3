# Finance AI Training (Local, No API)

This project can learn Finance Q&A locally (without relying on Gemini) by using a generated Q&A bank.

## Goal
- Generate **100–300 unique** questions per finance topic.
- Avoid duplicate or near-duplicate prompts.
- Provide **direct answer + short steps**.

## How it works
1. We generate Q&A pairs into:
   - `src/content/qa/finance.generated.json`
2. The chat API uses this bank first (high-confidence match only).

## Generate Finance Q&A
From the project root:

- Generate 200 questions per topic (default):
  - `node scripts/generate-finance-qa.mjs`

- Generate 300 per topic:
  - `node scripts/generate-finance-qa.mjs --gst 300 --emi 300 --compound 300 --profitloss 300`

- Change randomness (reproducible):
  - `node scripts/generate-finance-qa.mjs --seed 123`

## Topics included (Phase 1)
- GST (add GST)
- EMI (loan EMI)
- Compound / growth
- Profit/Loss

## Next
After this phase, we can add:
- SIP, CAGR, FD/RD, GST inclusive reverse, tax slabs (versioned), salary breakup.

# Python Math Q&A (BODMAS)

This folder contains a small, safe (no `eval`) math question solver focused on basic arithmetic and BODMAS/PEMDAS.

Implementation for basic arithmetic (number system) lives in `python/math_qa/number/`.

Percentage-specific logic should live in `python/math_qa/percentage/`.

## Run (Windows PowerShell)

```powershell
chcp 65001

python .\python\math_qa_cli.py "2 + 3*4"
python .\python\math_qa_cli.py "मेरे पास 250 थे, 75 खर्च किए, अब कितने बचे?"
python .\python\math_qa_cli.py --lang hinglish "12 packets, each packet has 8 biscuits. total?"
python .\python\math_qa_cli.py "20 candies divided among 4 kids, each gets?"
python .\python\math_qa_cli.py "12 ko 3 se bhag"
python .\python\math_qa_cli.py "basic calculator link"
python .\python\math_qa_cli.py "remainder tool link do"
python .\python\math_qa_cli.py "What is a prime number?"
python .\python\math_qa_cli.py "17 prime hai?"
python .\python\math_qa_cli.py "सम संख्या क्या है?"
python .\python\math_qa_cli.py "number system kya hota hai?"
```

If Hindi text still looks garbled, try: `python -X utf8 .\python\math_qa_cli.py "..."`

If your terminal still mangles Devanagari, use one of these:

```powershell
# Option A: type using \uXXXX escapes
python .\python\math_qa_cli.py --decode-unicode "12 \u0915\u094b 3 \u0938\u0947 \u092d\u093e\u0917"

# Option B: store question in a UTF-8 file
Set-Content -Encoding utf8 .\tmp_question.txt "12 को 3 से भाग"
python .\python\math_qa_cli.py --file .\tmp_question.txt
```

## Output format

- Prints the final answer first
- Then prints a short summary
- Then prints a relevant tool link recommendation (e.g. `/calculator/basic-calculator`)
- Tone is kept friendly/human (no "As an AI...")

## Supported

- `+ - * /` with parentheses
- Common Hindi/Hinglish/English operator words: plus/jod/jama, minus/ghata, times/guna, divide/bhag
- A few common word-problem patterns (remaining/total/each)

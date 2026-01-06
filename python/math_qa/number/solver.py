from __future__ import annotations

import re
from dataclasses import dataclass
from fractions import Fraction
from typing import List, Literal, Optional, Sequence, Tuple

from .knowledge import respond as knowledge_respond

Lang = Literal["auto", "hi", "hinglish", "en"]


@dataclass
class SolveResult:
    normalized_expression: str
    value: Optional[Fraction]
    answer_text: str
    summary_text: str
    steps: List[str]
    detected_lang: Literal["hi", "hinglish", "en"]
    recommended_tool_title: str
    recommended_tool_url: str


_DEVANAGARI_RE = re.compile(r"[\u0900-\u097F]")


def _detect_lang(text: str) -> Literal["hi", "hinglish", "en"]:
    if _DEVANAGARI_RE.search(text):
        return "hi"
    t = text.lower()
    if re.search(r"\b(kya|kyu|kaise|ka|ki|ke|hai|bache|bacha|kitna|kitne|bhai)\b", t):
        return "hinglish"
    return "en"


def _normalize_text(raw: str) -> str:
    t = raw.strip()
    t = t.replace("×", "*").replace("÷", "/").replace("−", "-")
    t = re.sub(r"\b(bracket|brackets|parenthesis|parentheses)\b", "( )", t, flags=re.I)
    t = re.sub(r"[\u0000-\u001F\u007F]", " ", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t


_OPERATOR_PATTERNS: Sequence[Tuple[re.Pattern, str]] = [
    (re.compile(r"\b(plus|add|sum|total of|increase by)\b", re.I), "+"),
    (re.compile(r"\b(jod|joda|jodiye|jama|jamaa|योग|जोड़)\b", re.I), "+"),
    (re.compile(r"\b(minus|subtract|less|decrease by)\b", re.I), "-"),
    (re.compile(r"\b(ghata|ghatai|ghatao|कम|घटाओ|घटाइए|घटाना)\b", re.I), "-"),
    (re.compile(r"\b(times|multiply|multiplied by|product of)\b", re.I), "*"),
    (re.compile(r"\b(guna|guna\s*karo|गुणा|गुणा\s*करो)\b", re.I), "*"),
    (re.compile(r"\b(divide|divided by|quotient of|per)\b", re.I), "/"),
    (re.compile(r"\b(bhag|bhaag|भाग|भाग\s*करो|बाँट|बांट)\b", re.I), "/"),
]

_OP_KEYWORDS: Sequence[Tuple[re.Pattern, str]] = [
    (re.compile(r"\b(plus|add|sum|total)\b", re.I), "+"),
    (re.compile(r"\b(minus|subtract|less|difference)\b", re.I), "-"),
    (re.compile(r"\b(times|multiply|product)\b", re.I), "*"),
    (re.compile(r"\b(divide|divided|quotient|per)\b", re.I), "/"),
    (re.compile(r"\b(jod|jama|योग|जोड़)\b", re.I), "+"),
    (re.compile(r"\b(ghata|कम|घट)\b", re.I), "-"),
    (re.compile(r"\b(guna|गुणा)\b", re.I), "*"),
    (re.compile(r"\b(bhag|bhaag|भाग|बाँट|बांट)\b", re.I), "/"),
]

_REMAINDER_RE = re.compile(r"\b(remainder|mod|modulo|mods)\b|शेष|बाकी", re.I)
_PROPORTION_RE = re.compile(r"\b(ratio|proportion)\b|अनुपात", re.I)
_PRIME_RE = re.compile(r"\bprime\b|\bprime\s*number\b|प्राइम|अभाज्य|\bprime-number\b", re.I)
_LINK_INTENT_RE = re.compile(
    r"\b(link|url|website|open|tool\s*link|calculator\s*link|\s*link\s*chahiye|\s*link\s*de)\b"
    r"|लिंक\s*चाहिए|लिंक\s*दे|लिंक|यूआरएल|url|वेबसाइट",
    re.I,
)
_BASIC_TOOL_RE = re.compile(r"\b(basic\s*calculator|calculator|calc)\b|कैलकुलेटर|calculator", re.I)


def _recommend_tool(question_text: str, normalized_expression: str) -> Tuple[str, str]:
    q = question_text
    expr = normalized_expression

    if _PRIME_RE.search(q):
        return ("Prime Number Checker", "/calculator/prime-number-checker")

    if _REMAINDER_RE.search(q):
        return ("Remainder Calculator", "/calculator/remainder-calculator")

    if _PROPORTION_RE.search(q):
        return ("Proportion Calculator", "/calculator/proportion-calculator")

    if re.search(r"[+\-*/()]", expr):
        return ("Basic Calculator", "/calculator/basic-calculator")

    return ("Math Calculators", "/category/math")


def _is_link_request(text: str) -> bool:
    if _LINK_INTENT_RE.search(text):
        return True
    if not re.search(r"\d", text) and (
        _REMAINDER_RE.search(text) or _PROPORTION_RE.search(text) or _PRIME_RE.search(text) or _BASIC_TOOL_RE.search(text)
    ):
        return True
    return False


def _recommend_tool_from_link_request(text: str) -> Tuple[str, str]:
    if _REMAINDER_RE.search(text):
        return ("Remainder Calculator", "/calculator/remainder-calculator")
    if _PROPORTION_RE.search(text):
        return ("Proportion Calculator", "/calculator/proportion-calculator")
    if _PRIME_RE.search(text):
        return ("Prime Number Checker", "/calculator/prime-number-checker")
    if _BASIC_TOOL_RE.search(text):
        return ("Basic Calculator", "/calculator/basic-calculator")
    return ("Math Calculators", "/category/math")


def _extract_simple_binary(text: str) -> Optional[str]:
    nums = re.findall(r"-?\d[\d,]*(?:\.\d+)?", text)
    if len(nums) < 2:
        return None

    detected_ops: List[str] = []
    for pattern, op in _OP_KEYWORDS:
        if pattern.search(text):
            detected_ops.append(op)

    if not detected_ops:
        return None

    if len(set(detected_ops)) != 1:
        return None

    op = detected_ops[0]
    return f"{nums[0]} {op} {nums[1]}"


def _apply_operator_word_rewrites(text: str) -> str:
    out = text
    for pattern, op in _OPERATOR_PATTERNS:
        out = pattern.sub(op, out)

    out = re.sub(r"\binto\b", "*", out, flags=re.I)
    out = re.sub(r"(\d)\s*[xX]\s*(\d)", r"\1*\2", out)

    out = re.sub(
        r"\b(what is|calculate|find|solve|please|pls|kindly|answer|बताओ|बताइए|निकालो|निकालिए)\b",
        " ",
        out,
        flags=re.I,
    )

    out = re.sub(r"\s+", " ", out).strip()
    return out


def _extract_expression_or_template(text: str) -> Optional[str]:
    t = text
    tl = t.lower()

    start = r"(?:\b(?:mere\s*paas|i\s*had|i\s*have|there\s*were)\b|मेरे\s*पास)"
    spent_kw = r"(?:\b(?:spent|used|kharch)\b|खर्च)"
    rem_kw = r"(?:\b(?:left|remaining|bache|bacha)\b|बचे|बचा)"
    num = r"(-?\d[\d,]*(?:\.\d+)?)"

    m = re.search(start + r"\D*" + num + r".*?" + spent_kw + r"\D*" + num + r".*?" + rem_kw, t, flags=re.I)
    if m:
        return f"{m.group(1)} - {m.group(2)}"

    m = re.search(start + r"\D*" + num + r"\D*" + num + r".*?" + spent_kw + r".*?" + rem_kw, t, flags=re.I)
    if m:
        return f"{m.group(1)} - {m.group(2)}"

    m = re.search(
        r"\b(-?\d[\d,]*(?:\.\d+)?)\b\s*(?:packets|packet|boxes|box|items|item|चीज़ें|चीजे|पैकेट|डिब्बे?)\b.*?\b(?:each|per|har|हर)\b[^\d-]*(-?\d[\d,]*(?:\.\d+)?)\b",
        tl,
        flags=re.I,
    )
    if m and re.search(r"\b(total|in\s*all|kitne|कुल)\b", tl, flags=re.I):
        return f"{m.group(1)} * {m.group(2)}"

    m = re.search(
        r"\b(-?\d[\d,]*(?:\.\d+)?)\b\s*(?:items|item|candies|candy|apples|apple|चीज़ें|चीजे|टॉफी|टॉफियाँ|सेब)\b.*?"
        r"\b(?:distributed|shared|split|divide|divided|baant|बाँट|बांट)\b.*?"
        r"\b(-?\d[\d,]*(?:\.\d+)?)\b\s*(?:people|persons|kids|children|लोग|बच्चे)\b",
        tl,
        flags=re.I,
    )
    if m and re.search(r"\b(each|per|har|हर|each\s*gets|per\s*person|प्रति)\b", tl, flags=re.I):
        return f"{m.group(1)} / {m.group(2)}"

    m = re.search(r"\bdifference\s+between\b\s*(-?\d[\d,]*(?:\.\d+)?)\b\s*\b(and|&)\b\s*(-?\d[\d,]*(?:\.\d+)?)\b", tl)
    if m:
        return f"{m.group(1)} - {m.group(3)}"

    m = re.search(
        r"\b(-?\d[\d,]*(?:\.\d+)?)\b\s*(?:ko|को)\s*\b(-?\d[\d,]*(?:\.\d+)?)\b\s*(?:se|से)\s*(?:bhag|bhaag|भाग|बाँट|बांट)",
        text,
        flags=re.I,
    )
    if m:
        return f"{m.group(1)} / {m.group(2)}"

    return None


Token = Tuple[str, str]


def _tokenize(expr: str) -> List[Token]:
    s = expr
    i = 0
    tokens: List[Token] = []

    while i < len(s):
        ch = s[i]
        if ch.isspace():
            i += 1
            continue

        if ch in "+-*/()":
            tokens.append(("op", ch))
            i += 1
            continue

        if ch.isdigit() or ch == ".":
            j = i
            while j < len(s) and (s[j].isdigit() or s[j] in {",", "."}):
                j += 1

            if j < len(s) and s[j] == "/":
                k = j + 1
                while k < len(s) and (s[k].isdigit() or s[k] == ","):
                    k += 1
                if k > j + 1:
                    tokens.append(("num", s[i:k]))
                    i = k
                    continue

            tokens.append(("num", s[i:j]))
            i = j
            continue

        i += 1

    return tokens


_PRECEDENCE = {"+": 1, "-": 1, "*": 2, "/": 2}


def _to_rpn(tokens: Sequence[Token]) -> List[Token]:
    out: List[Token] = []
    stack: List[Token] = []
    prev_kind: Optional[str] = None

    for kind, value in tokens:
        if kind == "num":
            out.append((kind, value))
            prev_kind = "num"
            continue

        if kind == "op" and value in "+-*/":
            if value == "-" and (
                prev_kind is None
                or (prev_kind == "op" and stack and stack[-1][1] != ")")
                or prev_kind == "lparen"
            ):
                out.append(("num", "0"))

            while stack and stack[-1][0] == "op" and stack[-1][1] in "+-*/":
                if _PRECEDENCE[stack[-1][1]] >= _PRECEDENCE[value]:
                    out.append(stack.pop())
                else:
                    break
            stack.append((kind, value))
            prev_kind = "op"
            continue

        if kind == "op" and value == "(":
            stack.append(("op", "("))
            prev_kind = "lparen"
            continue

        if kind == "op" and value == ")":
            while stack and stack[-1][1] != "(":
                out.append(stack.pop())
            if not stack:
                raise ValueError("Mismatched parentheses")
            stack.pop()
            prev_kind = "rparen"
            continue

    while stack:
        op = stack.pop()
        if op[1] in "()":
            raise ValueError("Mismatched parentheses")
        out.append(op)

    return out


def _parse_fraction(num_text: str) -> Fraction:
    s = num_text.replace(",", "")
    if "/" in s and re.fullmatch(r"-?\d+\/\d+", s):
        a, b = s.split("/", 1)
        return Fraction(int(a), int(b))
    if re.fullmatch(r"-?\d+", s):
        return Fraction(int(s), 1)
    if re.fullmatch(r"-?\d*\.\d+", s) or re.fullmatch(r"-?\d+\.\d+", s):
        sign = -1 if s.startswith("-") else 1
        s2 = s[1:] if sign == -1 else s
        whole, frac = s2.split(".", 1)
        whole_i = int(whole) if whole else 0
        denom = 10 ** len(frac)
        numer = whole_i * denom + int(frac)
        return Fraction(sign * numer, denom)
    raise ValueError(f"Invalid number: {num_text}")


def _eval_rpn(rpn: Sequence[Token]) -> Fraction:
    stack: List[Fraction] = []
    for kind, value in rpn:
        if kind == "num":
            stack.append(_parse_fraction(value))
            continue

        if kind == "op":
            if len(stack) < 2:
                raise ValueError("Invalid expression")
            b = stack.pop()
            a = stack.pop()
            if value == "+":
                stack.append(a + b)
            elif value == "-":
                stack.append(a - b)
            elif value == "*":
                stack.append(a * b)
            elif value == "/":
                if b == 0:
                    raise ZeroDivisionError("Division by zero")
                stack.append(a / b)
            else:
                raise ValueError(f"Unsupported operator: {value}")
            continue

        raise ValueError("Invalid token")

    if len(stack) != 1:
        raise ValueError("Invalid expression")
    return stack[0]


def _format_value(v: Fraction) -> Tuple[str, str]:
    if v.denominator == 1:
        return (str(v.numerator), "")

    frac_str = f"{v.numerator}/{v.denominator}"
    dec = float(v)
    dec_str = f"{dec:.10f}".rstrip("0").rstrip(".")
    return (frac_str, dec_str)


def solve_question(question: str, *, lang: Lang = "auto") -> SolveResult:
    raw = question
    detected = (
        _detect_lang(raw)
        if lang == "auto"
        else ("hi" if lang == "hi" else ("en" if lang == "en" else "hinglish"))
    )

    t = _normalize_text(raw)

    # Knowledge-mode: number-system definitions and classification questions.
    kb = knowledge_respond(t, detected)
    if kb is not None:
        return SolveResult(
            normalized_expression="",
            value=None,
            answer_text=kb.answer_text,
            summary_text=kb.summary_text,
            steps=[],
            detected_lang=detected,
            recommended_tool_title=kb.tool_title,
            recommended_tool_url=kb.tool_url,
        )

    if _is_link_request(t):
        tool_title, tool_url = _recommend_tool_from_link_request(t)
        if detected == "hi":
            answer = f"लिंक: {tool_url}"
            summary = f"सार: आपके सवाल के हिसाब से {tool_title} का लिंक शेयर किया।"
        elif detected == "hinglish":
            answer = f"Link: {tool_url}"
            summary = f"Summary: Aapke question ke हिसाब se {tool_title} ka link share kiya."
        else:
            answer = f"Link: {tool_url}"
            summary = f"Summary: Shared the {tool_title} link based on your request."

        return SolveResult(
            normalized_expression="",
            value=None,
            answer_text=answer,
            summary_text=summary,
            steps=[],
            detected_lang=detected,
            recommended_tool_title=tool_title,
            recommended_tool_url=tool_url,
        )

    expr = _extract_expression_or_template(t)
    if expr is None:
        t2 = _apply_operator_word_rewrites(t)
        cleaned = re.sub(r"[^0-9+\-*/()., ]", " ", t2)
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
        expr = cleaned

    if expr and (re.search(r"[+\-*/]\s*$", expr) or re.search(r"\d\s+\d", expr)):
        fallback = _extract_simple_binary(t)
        if fallback:
            expr = fallback

    expr = expr.strip()
    expr = re.sub(r",(?!\d)", "", expr)
    expr = re.sub(r"\s+", " ", expr).strip()
    if not re.search(r"\d", expr):
        raise ValueError("No numbers found in the question")

    tokens = _tokenize(expr)
    if not tokens:
        raise ValueError("Could not parse an expression")

    rpn = _to_rpn(tokens)
    value = _eval_rpn(rpn)

    primary, extra = _format_value(value)
    tool_title, tool_url = _recommend_tool(t, expr)

    if detected == "hi":
        answer = f"जवाब: {primary}" + (f" (लगभग {extra})" if extra else "")
        summary = f"सार: मैंने BODMAS के हिसाब से `{expr}` निकाला।"
        steps = [
            f"Expression: {expr}",
            "BODMAS: पहले brackets, फिर ÷/×, फिर +/− (left-to-right)",
            f"Result: {primary}" + (f" (≈ {extra})" if extra else ""),
        ]
    elif detected == "hinglish":
        answer = f"Answer: {primary}" + (f" (approx {extra})" if extra else "")
        summary = f"Summary: BODMAS ke हिसाब se `{expr}` solve kiya."
        steps = [
            f"Expression: {expr}",
            "BODMAS: brackets → divide/multiply → add/subtract (left-to-right)",
            f"Result: {primary}" + (f" (≈ {extra})" if extra else ""),
        ]
    else:
        answer = f"Answer: {primary}" + (f" (approx {extra})" if extra else "")
        summary = f"Summary: Solved `{expr}` using BODMAS/PEMDAS."
        steps = [
            f"Expression: {expr}",
            "Order: parentheses → division/multiplication → addition/subtraction (left-to-right)",
            f"Result: {primary}" + (f" (≈ {extra})" if extra else ""),
        ]

    return SolveResult(
        normalized_expression=expr,
        value=value,
        answer_text=answer,
        summary_text=summary,
        steps=steps,
        detected_lang=detected,
        recommended_tool_title=tool_title,
        recommended_tool_url=tool_url,
    )

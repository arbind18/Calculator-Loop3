from __future__ import annotations

import math
import re
from dataclasses import dataclass
from fractions import Fraction
from typing import Literal, Optional, Tuple

DetectedLang = Literal["hi", "hinglish", "en"]


@dataclass
class KnowledgeResponse:
    answer_text: str
    summary_text: str
    tool_title: str
    tool_url: str


# --- Keyword detectors ---

_NUMBER_RE = re.compile(r"-?\d[\d,]*(?:\.\d+)?(?:\/\d[\d,]*)?")

_PRIME_RE = re.compile(r"\bprime\b|\bprime\s*number\b|प्राइम|अभाज्य", re.I)
_COMPOSITE_RE = re.compile(r"\bcomposite\b|भाज्य|संयोज्य", re.I)
_EVEN_RE = re.compile(r"\beven\b|सम\s*संख्या|सम\b", re.I)
_ODD_RE = re.compile(r"\bodd\b|विषम\s*संख्या|विषम\b", re.I)

_NATURAL_RE = re.compile(r"\bnatural\b|प्राकृतिक\s*संख्या|natural\s*number", re.I)
_WHOLE_RE = re.compile(r"\bwhole\b|पूर्ण\s*संख्या|whole\s*number", re.I)
_INTEGER_RE = re.compile(r"\binteger\b|पूर्णांक|integers", re.I)
_RATIONAL_RE = re.compile(r"\brational\b|परिमेय", re.I)
_IRRATIONAL_RE = re.compile(r"\birrational\b|अपरिमेय", re.I)
_REAL_RE = re.compile(r"\breal\b|वास्तविक\s*संख्या|real\s*number", re.I)

_DEFINITION_RE = re.compile(r"\b(what\s+is|define|definition|meaning)\b|क्या\s*है|परिभाषा|मतलब", re.I)
_NUMBER_SYSTEM_RE = re.compile(r"number\s*system|संख्या\s*पद्धति|नंबर\s*सिस्टम", re.I)

_WHY_ONE_NOT_PRIME_RE = re.compile(
    r"\b(why|reason)\b.*\b1\b.*\bprime\b|\bwhy\b.*\bprime\b.*\b1\b|"
    r"1\s*prime\s*(kyu|kyon|kyo)\s*nahi|1\s*prime\s*nahi\s*kyu|"
    r"1\s*अभाज्य\s*क्यों\s*नहीं|1\s*prime\s*kyon\s*nahi",
    re.I,
)

_LINK_HINT_RE = re.compile(r"\b(link|url)\b|लिंक|यूआरएल", re.I)


def _extract_first_int(text: str) -> Optional[int]:
    m = _NUMBER_RE.search(text)
    if not m:
        return None
    raw = m.group(0).replace(",", "")
    try:
        return int(raw)
    except Exception:
        return None


def _extract_first_number(text: str) -> Optional[Fraction]:
    """Extract a number as Fraction, supporting integers, decimals, and simple a/b forms."""
    m = _NUMBER_RE.search(text)
    if not m:
        return None
    raw = m.group(0).replace(",", "")

    # a/b (integer numerator/denominator)
    if "/" in raw and re.fullmatch(r"-?\d+\/\d+", raw):
        a, b = raw.split("/", 1)
        try:
            return Fraction(int(a), int(b))
        except Exception:
            return None

    # integer
    if re.fullmatch(r"-?\d+", raw):
        try:
            return Fraction(int(raw), 1)
        except Exception:
            return None

    # decimal
    if re.fullmatch(r"-?\d*\.\d+", raw) or re.fullmatch(r"-?\d+\.\d+", raw):
        sign = -1 if raw.startswith("-") else 1
        s = raw[1:] if sign == -1 else raw
        whole, frac = s.split(".", 1)
        whole_i = int(whole) if whole else 0
        denom = 10 ** len(frac)
        numer = whole_i * denom + int(frac)
        return Fraction(sign * numer, denom)

    return None


def _is_prime(n: int) -> bool:
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    limit = int(math.isqrt(n))
    i = 5
    while i <= limit:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True


def wants_knowledge_answer(text: str) -> bool:
    # If user explicitly asks "what is/define" or "number system" and there is no arithmetic expression,
    # treat as knowledge.
    if _NUMBER_SYSTEM_RE.search(text) or _DEFINITION_RE.search(text):
        return True

    if _WHY_ONE_NOT_PRIME_RE.search(text):
        return True

    # Or if user asks about a classification concept (prime/even/odd/etc) and not a calculation.
    if any(
        r.search(text)
        for r in (
            _PRIME_RE,
            _COMPOSITE_RE,
            _EVEN_RE,
            _ODD_RE,
            _NATURAL_RE,
            _WHOLE_RE,
            _INTEGER_RE,
            _RATIONAL_RE,
            _IRRATIONAL_RE,
            _REAL_RE,
        )
    ):
        return True

    # Link hint alone should be handled by main solver link-intent logic, but keeping safe.
    if _LINK_HINT_RE.search(text):
        return True

    return False


def _answer_why_one_not_prime(lang: DetectedLang) -> Tuple[str, str]:
    if lang == "hi":
        return (
            "1 अभाज्य (prime) नहीं है, क्योंकि prime संख्या की परिभाषा में **ठीक 2** positive factors होने चाहिए: 1 और वही संख्या।\n"
            "1 के सिर्फ 1 ही factor होता है (सिर्फ 1)।\n"
            "Extra note: अगर 1 को prime मान लें, तो unique prime factorization (हर संख्या का primes में unique breakdown) वाला नियम टूट जाता है।",
            "सार: prime के लिए 2 factors चाहिए; 1 के सिर्फ 1 factor है।",
        )

    if lang == "hinglish":
        return (
            "1 prime nahi hota, kyunki prime number ki definition me **exactly 2** positive factors hote hain: 1 aur number itself.\n"
            "1 ke factors sirf [1] hote hain.\n"
            "Bonus: agar 1 ko prime maan lein, to unique prime factorization wala rule break ho jata hai.",
            "Summary: Prime me 2 factors chahiye; 1 ke sirf 1 factor hain.",
        )

    return (
        "1 is not prime because a prime must have **exactly two** positive factors: 1 and itself.\n"
        "1 has only one positive factor (1).\n"
        "Also, including 1 as prime would break unique prime factorization.",
        "Summary: A prime needs 2 factors; 1 has only 1.",
    )


def _answer_set_membership(x: Fraction, text: str, lang: DetectedLang) -> Tuple[str, str, Tuple[str, str]]:
    """Answer questions like: 'Is 0 a natural number?' 'Is -3 an integer?'"""
    is_integer = (x.denominator == 1)
    xi = int(x) if is_integer else None

    asked_natural = bool(_NATURAL_RE.search(text))
    asked_whole = bool(_WHOLE_RE.search(text))
    asked_integer = bool(_INTEGER_RE.search(text))
    asked_rational = bool(_RATIONAL_RE.search(text))
    asked_irrational = bool(_IRRATIONAL_RE.search(text))
    asked_real = bool(_REAL_RE.search(text))

    # Convention note: many school definitions use N = {1,2,3,...}; some include 0.
    natural_yes = is_integer and xi is not None and xi >= 1
    whole_yes = is_integer and xi is not None and xi >= 0
    integer_yes = is_integer
    rational_yes = True
    irrational_yes = False
    real_yes = True

    lines: list[str] = []

    def yn(value: bool) -> str:
        if lang == "hi":
            return "हाँ" if value else "नहीं"
        return "Yes" if value else "No"

    if asked_natural:
        lines.append(("Natural/प्राकृतिक: " if lang == "hi" else "Natural: ") + yn(natural_yes))
        if is_integer and xi == 0:
            if lang == "hi":
                lines.append("Note: कुछ किताबों में 0 को natural मानते हैं; many school definitions में natural 1 से शुरू होता है।")
            else:
                lines.append("Note: Some textbooks include 0 as natural; many school definitions start naturals at 1.")

    if asked_whole:
        lines.append(("Whole/पूर्ण संख्या: " if lang == "hi" else "Whole: ") + yn(whole_yes))

    if asked_integer:
        lines.append(("Integer/पूर्णांक: " if lang == "hi" else "Integer: ") + yn(integer_yes))

    if asked_rational:
        lines.append(("Rational/परिमेय: " if lang == "hi" else "Rational: ") + yn(rational_yes))

    if asked_irrational:
        lines.append(("Irrational/अपरिमेय: " if lang == "hi" else "Irrational: ") + yn(irrational_yes))
        if irrational_yes is False:
            if lang == "hi":
                lines.append("(Given value ek fraction/decimal se represent ho raha hai, isliye rational hai.)")
            else:
                lines.append("(This value can be represented as a fraction/terminating decimal, so it's rational.)")

    if asked_real:
        lines.append(("Real/वास्तविक: " if lang == "hi" else "Real: ") + yn(real_yes))

    if lang == "hi":
        summary = "सार: number ka set-membership (natural/whole/integer आदि) clear कर दिया।"
    elif lang == "hinglish":
        summary = "Summary: number kis set me aata hai clear kar diya."
    else:
        summary = "Summary: Confirmed set membership."

    return ("\n".join(lines), summary, ("Math Calculators", "/category/math"))


def _tool_for_topic(text: str) -> Tuple[str, str]:
    if _PRIME_RE.search(text) or _COMPOSITE_RE.search(text):
        return ("Prime Number Checker", "/calculator/prime-number-checker")
    return ("Math Calculators", "/category/math")


def _answer_number_basics(lang: DetectedLang) -> Tuple[str, str]:
    if lang == "hi":
        return (
            "संख्या (Number) किसी मात्रा/गिनती को दिखाने का तरीका है—जैसे 0, 1, 2, 10.\n"
            "हम संख्याओं से चीज़ें गिनते हैं, तुलना करते हैं (बड़ा/छोटा), और हिसाब करते हैं (+, −, ×, ÷).",
            "सार: संख्या मात्रा/गिनती दिखाती है और हिसाब में काम आती है।",
        )
    if lang == "hinglish":
        return (
            "Number ka simple matlab hai quantity/गिनती ko represent karna—jaise 0, 1, 2, 10.\n"
            "Numbers se hum count karte hain, compare karte hain, aur calculations (+, −, ×, ÷) karte hain.",
            "Summary: Number quantity ko represent karta hai aur calculations me use hota hai.",
        )
    return (
        "A number is a way to represent quantity—like 0, 1, 2, 10.\n"
        "We use numbers to count, compare (greater/less), and calculate (+, −, ×, ÷).",
        "Summary: Numbers represent quantity and support calculations.",
    )


def _answer_definitions(text: str, lang: DetectedLang) -> Tuple[str, str]:
    # Return a compact definition set based on what was asked.
    asked = []
    if _NATURAL_RE.search(text):
        asked.append("natural")
    if _WHOLE_RE.search(text):
        asked.append("whole")
    if _INTEGER_RE.search(text):
        asked.append("integer")
    if _RATIONAL_RE.search(text):
        asked.append("rational")
    if _IRRATIONAL_RE.search(text):
        asked.append("irrational")
    if _REAL_RE.search(text):
        asked.append("real")
    if _EVEN_RE.search(text):
        asked.append("even")
    if _ODD_RE.search(text):
        asked.append("odd")
    if _PRIME_RE.search(text):
        asked.append("prime")
    if _COMPOSITE_RE.search(text):
        asked.append("composite")

    if not asked:
        return _answer_number_basics(lang)

    def hi_lines() -> list[str]:
        lines: list[str] = []
        if "natural" in asked:
            lines.append("प्राकृतिक संख्याएँ (Natural): 1, 2, 3, ... (आम तौर पर 0 शामिल नहीं होता)")
        if "whole" in asked:
            lines.append("पूर्ण संख्याएँ (Whole): 0, 1, 2, 3, ...")
        if "integer" in asked:
            lines.append("पूर्णांक (Integers): ..., −2, −1, 0, 1, 2, ...")
        if "rational" in asked:
            lines.append("परिमेय (Rational): a/b के रूप में लिखी जा सकती हैं (b ≠ 0), जैसे 3/4, −5, 0.25")
        if "irrational" in asked:
            lines.append("अपरिमेय (Irrational): a/b के रूप में नहीं लिख सकते, जैसे √2, π")
        if "real" in asked:
            lines.append("वास्तविक संख्याएँ (Real): सभी परिमेय + अपरिमेय संख्याएँ")
        if "even" in asked:
            lines.append("सम संख्या (Even): 2 से पूरी तरह विभाजित, जैसे 0, 2, 4, 6")
        if "odd" in asked:
            lines.append("विषम संख्या (Odd): 2 से पूरी तरह विभाजित नहीं, जैसे 1, 3, 5")
        if "prime" in asked:
            lines.append("अभाज्य/Prime: 1 से बड़ी संख्या जिसके सिर्फ 2 factors हों (1 और वही), जैसे 2, 3, 5, 7")
        if "composite" in asked:
            lines.append("भाज्य/Composite: 1 से बड़ी संख्या जिसके 2 से ज़्यादा factors हों, जैसे 4, 6, 8, 9")
        return lines

    def en_lines() -> list[str]:
        lines: list[str] = []
        if "natural" in asked:
            lines.append("Natural numbers: 1, 2, 3, ... (often excludes 0)")
        if "whole" in asked:
            lines.append("Whole numbers: 0, 1, 2, 3, ...")
        if "integer" in asked:
            lines.append("Integers: ..., −2, −1, 0, 1, 2, ...")
        if "rational" in asked:
            lines.append("Rational numbers: can be written as a/b (b ≠ 0), e.g., 3/4, −5, 0.25")
        if "irrational" in asked:
            lines.append("Irrational numbers: cannot be written as a/b, e.g., √2, π")
        if "real" in asked:
            lines.append("Real numbers: all rational + irrational numbers")
        if "even" in asked:
            lines.append("Even numbers: divisible by 2, e.g., 0, 2, 4, 6")
        if "odd" in asked:
            lines.append("Odd numbers: not divisible by 2, e.g., 1, 3, 5")
        if "prime" in asked:
            lines.append("Prime: integer > 1 with exactly two factors (1 and itself), e.g., 2, 3, 5, 7")
        if "composite" in asked:
            lines.append("Composite: integer > 1 with more than two factors, e.g., 4, 6, 8, 9")
        return lines

    if lang == "hi":
        answer = "\n".join(hi_lines())
        summary = "सार: परिभाषाएँ + examples दे दिए।"
        return (answer, summary)

    if lang == "hinglish":
        # Hinglish: mix English terms + Hindi explanation.
        answer = "\n".join(hi_lines())
        summary = "Summary: Definitions + examples clear kar diye."
        return (answer, summary)

    answer = "\n".join(en_lines())
    summary = "Summary: Shared definitions with examples."
    return (answer, summary)


def _answer_classification(n: int, text: str, lang: DetectedLang) -> Tuple[str, str, Tuple[str, str]]:
    # Decide what user is asking to check.
    check_prime = _PRIME_RE.search(text) or _COMPOSITE_RE.search(text)
    check_even_odd = _EVEN_RE.search(text) or _ODD_RE.search(text)

    is_int = True
    even = (n % 2 == 0)
    odd = not even
    prime = _is_prime(n) if n >= 0 else False
    composite = (n > 1 and not prime)

    lines = []
    if check_prime:
        if n <= 1:
            if lang == "hi":
                lines.append(f"{n} prime/composite नहीं होता (prime/composite के लिए संख्या 1 से बड़ी होनी चाहिए)।")
            else:
                lines.append(f"{n} is neither prime nor composite (prime/composite require an integer > 1).")
        else:
            if lang == "hi":
                lines.append(f"{n} {'अभाज्य (Prime)' if prime else 'भाज्य (Composite)'} है।")
                lines.append("Quick check: 1 और खुद के अलावा कोई factor नहीं (prime) / factors होते हैं (composite)।")
            elif lang == "hinglish":
                lines.append(f"{n} {'prime' if prime else 'composite'} hai.")
                lines.append("Quick check: prime me factors sirf 1 aur number khud hote hain.")
            else:
                lines.append(f"{n} is {'prime' if prime else 'composite'}.")
                lines.append("Quick check: a prime has exactly two positive factors (1 and itself).")

    if check_even_odd:
        if lang == "hi":
            lines.append(f"{n} {'सम (Even)' if even else 'विषम (Odd)'} है।")
        elif lang == "hinglish":
            lines.append(f"{n} {'even' if even else 'odd'} hai.")
        else:
            lines.append(f"{n} is {'even' if even else 'odd'}.")

    if not lines:
        # Generic classification
        if lang == "hi":
            lines.append(f"{n} ek पूर्णांक (integer) है।")
            lines.append(f"Even/odd: {'सम' if even else 'विषम'}")
            if n > 1:
                lines.append(f"Prime/composite: {'अभाज्य' if prime else 'भाज्य'}")
        else:
            lines.append(f"{n} is an integer.")
            lines.append(f"Even/odd: {'even' if even else 'odd'}")
            if n > 1:
                lines.append(f"Prime/composite: {'prime' if prime else 'composite'}")

    tool = _tool_for_topic(text)

    if lang == "hi":
        summary = "सार: number की category/check बता दी।"
    elif lang == "hinglish":
        summary = "Summary: Number ka check/category clear ho gaya."
    else:
        summary = "Summary: Classified the number." 

    return ("\n".join(lines), summary, tool)


def respond(text: str, lang: DetectedLang) -> Optional[KnowledgeResponse]:
    if _WHY_ONE_NOT_PRIME_RE.search(text):
        answer, summary = _answer_why_one_not_prime(lang)
        tool_title, tool_url = ("Prime Number Checker", "/calculator/prime-number-checker")
        return KnowledgeResponse(answer, summary, tool_title, tool_url)

    # If a number is provided and the question looks like a classification check, answer it.
    n = _extract_first_int(text)
    if n is not None and any(r.search(text) for r in (_PRIME_RE, _COMPOSITE_RE, _EVEN_RE, _ODD_RE)):
        answer, summary, (tool_title, tool_url) = _answer_classification(n, text, lang)
        return KnowledgeResponse(answer, summary, tool_title, tool_url)

    x = _extract_first_number(text)
    if x is not None and any(
        r.search(text)
        for r in (_NATURAL_RE, _WHOLE_RE, _INTEGER_RE, _RATIONAL_RE, _IRRATIONAL_RE, _REAL_RE)
    ):
        answer, summary, (tool_title, tool_url) = _answer_set_membership(x, text, lang)
        return KnowledgeResponse(answer, summary, tool_title, tool_url)

    # Definitions / number-system concept questions.
    if wants_knowledge_answer(text):
        # Special case: "number kya hai" or "number kyon" etc.
        if _NUMBER_SYSTEM_RE.search(text) or re.search(r"number\s+kyon|number\s+kya|संख्या\s*क्या|संख्या\s*क्यों", text, re.I):
            answer, summary = _answer_number_basics(lang)
            tool_title, tool_url = ("Math Calculators", "/category/math")
            return KnowledgeResponse(answer, summary, tool_title, tool_url)

        answer, summary = _answer_definitions(text, lang)
        tool_title, tool_url = _tool_for_topic(text)
        return KnowledgeResponse(answer, summary, tool_title, tool_url)

    return None

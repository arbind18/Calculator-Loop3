from __future__ import annotations

import argparse
import sys

from math_qa.number.solver import solve_question


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="Math Q&A (BODMAS) - prints answer then summary")
    parser.add_argument("question", nargs="?", help="Question text (Hindi/Hinglish/English)")
    parser.add_argument("--lang", choices=["auto", "hi", "hinglish", "en"], default="auto")
    parser.add_argument("--steps", action="store_true", help="Also print step-by-step lines")
    parser.add_argument("--file", help="Read question from a UTF-8 text file")
    parser.add_argument(
        "--decode-unicode",
        action="store_true",
        help="Decode \\uXXXX sequences in the question (useful if your terminal mangles Hindi text)",
    )

    args = parser.parse_args(argv)

    q = args.question

    if args.file:
        try:
            with open(args.file, "rb") as f:
                q = f.read().decode("utf-8", errors="strict").strip()
        except Exception as e:
            print(f"Could not read file: {e}")
            return 2

    if not q:
        q = sys.stdin.read().strip()

    if q and args.decode_unicode:
        try:
            q = bytes(q, "utf-8").decode("unicode_escape")
        except Exception:
            # If decode fails, keep original text.
            pass

    if not q:
        print("Please provide a question.")
        return 2

    try:
        result = solve_question(q, lang=args.lang)
    except Exception as e:
        # Friendly, human-style error.
        print(f"I got stuck on that one: {e}")
        print("Try writing it like: '2 + 3*4' or 'मेरे पास 250 थे, 75 खर्च किए, अब कितने बचे?'")
        return 1

    # Requirement: final answer first, then summary.
    print(result.answer_text)
    print(result.summary_text)

    # Requirement: recommend the most relevant tool link at the very end.
    print(f"Recommended tool: {result.recommended_tool_title} — {result.recommended_tool_url}")

    if args.steps:
        for line in result.steps:
            print("- " + line)

    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))

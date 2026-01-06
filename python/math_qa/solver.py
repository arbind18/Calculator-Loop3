"""Compatibility shim.

The main implementation has moved to the `number` subpackage:
`math_qa/number/solver.py`
"""

from .number.solver import Lang, SolveResult, solve_question  # noqa: F401

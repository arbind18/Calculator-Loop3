import re

content = "url: './Math/Basic-Arithmetic/Basic-Calculator.html'"
pattern = r"url:\s*['\"]([^'\"]+)['\"]"
match = re.search(pattern, content)

if match:
    print(f"Regex Match: {match.group(1)}")
else:
    print("Regex Failed")

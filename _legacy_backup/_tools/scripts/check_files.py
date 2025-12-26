import os
import re

directory = r'c:\Users\dell\Desktop\calculatorloop.com\Financial\Investment-and-Returns'
files = [f for f in os.listdir(directory) if f.endswith('.html')]

print("Checking files in " + directory)

for f in files:
    path = os.path.join(directory, f)
    try:
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
    except Exception as e:
        print(f"Error reading {f}: {e}")
        continue
        
    missing = []
    
    # Check SEO Meta Tags
    if not re.search(r'<meta\s+name=[\"\']description[\"\']', content, re.IGNORECASE):
        missing.append('SEO Meta Tags')
        
    # Check FAQ Section (looking for specific schema or substantial FAQ section)
    # The new template uses FAQPage schema.
    if not re.search(r'FAQPage', content):
        missing.append('FAQ Schema')
        
    # Check Rich Content (Article tag AND substantial length)
    if not re.search(r'<article>', content, re.IGNORECASE):
        missing.append('Rich Content (<article>)')
        
    # Check Schema Markup (General)
    if not re.search(r'application/ld\+json', content):
        missing.append('Schema Markup')
        
    # Check Mobile Optimization
    if not re.search(r'<meta\s+name=[\"\']viewport[\"\']', content, re.IGNORECASE):
        missing.append('Mobile Optimization')

    if missing:
        print(f'{f}: {", ".join(missing)}')

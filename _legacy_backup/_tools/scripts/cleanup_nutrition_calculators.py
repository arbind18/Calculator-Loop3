import os
import re

directory = r"c:\Users\dell\Desktop\calculatorloop.com\Health\Nutrition-and-Calories"

def cleanup_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Regex to find the script block containing calculateDiabetesRisk
        # We look for <script>...calculateDiabetesRisk...</script>
        # We use dotall=True so . matches newlines
        pattern = re.compile(r'<script>\s*function calculateDiabetesRisk\(\) \{.*?</script>', re.DOTALL)
        
        new_content, count = pattern.subn('', content)
        
        if count > 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Cleaned {count} instance(s) from {os.path.basename(file_path)}")
        else:
            print(f"No zombie script found in {os.path.basename(file_path)}")
            
    except Exception as e:
        print(f"Error processing {file_path}: {str(e)}")

def main():
    if not os.path.exists(directory):
        print(f"Directory not found: {directory}")
        return

    for filename in os.listdir(directory):
        if filename.endswith(".html"):
            file_path = os.path.join(directory, filename)
            cleanup_file(file_path)

if __name__ == "__main__":
    main()

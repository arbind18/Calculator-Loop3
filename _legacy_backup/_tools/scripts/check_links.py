import os
import re
from pathlib import Path

def normalize_path_for_comparison(path_str):
    """
    Normalize path for loose comparison.
    Converts to lowercase, replaces spaces/special chars with dashes or removes them.
    """
    # Remove ./ prefix
    if path_str.startswith('./'):
        path_str = path_str[2:]
    
    # Convert to lowercase
    path_str = path_str.lower()
    
    # Replace backslashes with forward slashes
    path_str = path_str.replace('\\', '/')
    
    # Replace spaces with dashes
    path_str = path_str.replace(' ', '-')
    
    # Replace & with and
    path_str = path_str.replace('&', 'and')
    
    return path_str

def get_all_html_files(root_dir):
    """Get all HTML files in the directory structure"""
    html_files = {}
    exclude_dirs = {'.git', '_tools', 'node_modules', '.vscode'}
    
    for root, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        for file in files:
            if file.endswith('.html') and file != 'Ui.html':
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, root_dir)
                
                # Store both original and normalized path
                norm_path = normalize_path_for_comparison(rel_path)
                html_files[norm_path] = rel_path
    
    return html_files

def get_linked_files(ui_file_path):
    """Extract linked files from Ui.html"""
    linked_files = {}
    
    try:
        with open(ui_file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        patterns = [
            r"url:\s*['\"]([^'\"]+)['\"]",
            r"href=['\"]([^'\"]+)['\"]"
        ]
        
        for pattern in patterns:
            matches = re.finditer(pattern, content)
            for match in matches:
                url = match.group(1)
                if url.startswith(('#', 'javascript:', 'mailto:', 'tel:', 'http')):
                    continue
                    
                norm_path = normalize_path_for_comparison(url)
                linked_files[norm_path] = url
                
    except Exception as e:
        print(f"Error reading Ui.html: {e}")
        
    return linked_files

def main():
    root_dir = r"c:\Users\dell\Desktop\calculatorloop.com"
    ui_file = os.path.join(root_dir, "Ui.html")
    report_file = os.path.join(root_dir, "_tools", "docs", "LINK_AUDIT_REPORT.txt")
    
    print("Scanning files...")
    all_files_map = get_all_html_files(root_dir)
    
    print("Scanning Ui.html links...")
    linked_files_map = get_linked_files(ui_file)
    
    # Check for matches
    linked_on_disk = []
    not_linked = []
    broken_links = []
    
    # 1. Check which files on disk are linked (using normalized paths)
    for norm_path, original_path in all_files_map.items():
        if norm_path in linked_files_map:
            linked_on_disk.append(original_path)
        else:
            not_linked.append(original_path)
            
    # 2. Check for broken links (links in UI that don't match any file)
    for norm_path, original_url in linked_files_map.items():
        if norm_path not in all_files_map:
            broken_links.append(original_url)

    # Generate Report
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write("="*50 + "\n")
        f.write("CALCULATOR LOOP - LINK AUDIT REPORT\n")
        f.write("="*50 + "\n\n")
        
        f.write(f"Total HTML files on disk: {len(all_files_map)}\n")
        f.write(f"Total links found in Ui.html: {len(linked_files_map)}\n\n")
        
        f.write(f"Files properly linked: {len(linked_on_disk)}\n")
        f.write(f"Files NOT linked (Orphaned): {len(not_linked)}\n")
        f.write(f"Broken links in UI (Dead links): {len(broken_links)}\n\n")
        
        if not_linked:
            f.write("-" * 50 + "\n")
            f.write("FILES NOT LINKED IN UI (ORPHANED FILES):\n")
            f.write("-" * 50 + "\n")
            # Group by folder
            grouped = {}
            for file in not_linked:
                directory = os.path.dirname(file)
                if directory not in grouped:
                    grouped[directory] = []
                grouped[directory].append(os.path.basename(file))
                
            for directory, files in sorted(grouped.items()):
                f.write(f"\nFolder: {directory}\n")
                for file in sorted(files):
                    f.write(f"  [ ] {file}\n")
            f.write("\n")

        if broken_links:
            f.write("-" * 50 + "\n")
            f.write("BROKEN LINKS IN UI (TARGET FILE NOT FOUND):\n")
            f.write("-" * 50 + "\n")
            for link in sorted(broken_links):
                f.write(f"  [X] {link}\n")

    print(f"Report generated at: {report_file}")
    print(f"Found {len(not_linked)} orphaned files and {len(broken_links)} broken links.")

if __name__ == "__main__":
    main()

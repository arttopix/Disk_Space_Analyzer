import os
import glob
import sys

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except AttributeError:
        pass

def find_project_root():
    """Traverse upwards to locate the workspace root (containing .git, backend, etc.)."""
    curr = os.path.abspath(os.path.dirname(__file__))
    while True:
        if os.path.exists(os.path.join(curr, ".git")) or (os.path.exists(os.path.join(curr, "backend")) and os.path.exists(os.path.join(curr, "frontend"))):
            return curr
        parent = os.path.dirname(curr)
        if parent == curr:
            break
        curr = parent
    return os.getcwd()

def summarize_project():
    project_root = find_project_root()
    total_lines = 0
    total_files = 0
    file_types = {}

    # Define the source file extensions we want to track
    extensions = ['**/*.py', '**/*.jsx', '**/*.js', '**/*.css', '**/*.html']
    
    for ext in extensions:
        search_path = os.path.join(project_root, ext)
        for file in glob.glob(search_path, recursive=True):
            # Skip ignored directories and files
            norm_file = os.path.normcase(os.path.normpath(file))
            parts = norm_file.split(os.sep)
            if any(ignored in parts for ignored in ['node_modules', 'venv', '.git', '__pycache__', '.gemini', '.agents', 'dist', 'build']):
                continue
                
            try:
                with open(file, 'r', encoding='utf-8') as f:
                    lines = len(f.readlines())
                    total_lines += lines
                    total_files += 1
                    
                    file_ext = os.path.splitext(file)[1]
                    if file_ext not in file_types:
                        file_types[file_ext] = 0
                    file_types[file_ext] += lines
            except Exception:
                pass
                
    print("=======================================")
    print("📊 Project Code Statistics (Skill) 📊")
    print("=======================================")
    print(f"📁 Root: {project_root}")
    print(f"📁 Total Tracked Files: {total_files}")
    print(f"📝 Total Lines of Code: {total_lines}")
    print("\nBreakdown by file type:")
    for ext, lines in sorted(file_types.items(), key=lambda item: item[1], reverse=True):
        print(f"   {ext:<6}: {lines:>5} lines")
    print("=======================================")

if __name__ == "__main__":
    summarize_project()

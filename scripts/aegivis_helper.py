import os
import shutil
import subprocess
import sys

# Aegivis Terminal Helper CLI
# Handles paths and encoding for Antigravity (AI Assistant)

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def get_full_path(relative_path):
    return os.path.join(PROJECT_ROOT, relative_path)

def run_cmd(cmd, cwd=PROJECT_ROOT):
    # Force UTF-8 encoding (chcp 65001) for Windows
    full_cmd = f"chcp 65001 > nul && {cmd}"
    print(f"[RE-RUN] Executing: {cmd}")
    return subprocess.run(full_cmd, shell=True, cwd=cwd)

def revert():
    src = get_full_path("index_2.html")
    dst = get_full_path("index.html")
    print(f"[ACTION] Reverting index.html from index_2.html...")
    try:
        shutil.copy2(src, dst)
        print("[SUCCESS] index.html has been restored perfectly.")
    except Exception as e:
        print(f"[ERROR] Failed to revert: {e}")

def check():
    print("==========================================")
    print("   Aegivis Project Environment Check      ")
    print("==========================================")
    print(f"Project Root: {PROJECT_ROOT}")
    
    files_to_check = ["index.html", "index_2.html", "manifest.json", "sw.js"]
    for f in files_to_check:
        status = "OK" if os.path.exists(get_full_path(f)) else "NOT FOUND"
        print(f"- {f}: {status}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python aegivis_helper.py [check|revert]")
        sys.exit(1)
    
    action = sys.argv[1]
    if action == "check":
        check()
    elif action == "revert":
        revert()
    else:
        print(f"Unknown action: {action}")

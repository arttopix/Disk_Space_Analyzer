import os
import sys
import time
import subprocess
import webbrowser

# Ensure UTF-8 console output on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except AttributeError:
        pass

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")

def get_python_exe():
    venv_python = os.path.join(BACKEND_DIR, "venv", "Scripts", "python.exe")
    if os.path.exists(venv_python):
        return venv_python
    return sys.executable

def kill_process(proc):
    if proc and proc.poll() is None:
        try:
            if sys.platform == "win32":
                subprocess.run(
                    ["taskkill", "/F", "/T", "/PID", str(proc.pid)],
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL
                )
            else:
                proc.terminate()
        except Exception:
            pass

def main():
    print("=" * 60)
    print("   💽 Disk Space Analyzer - One-Click Launcher")
    print("=" * 60)

    python_exe = get_python_exe()
    print(f"🔧 Using Python: {python_exe}")

    backend_proc = None
    frontend_proc = None

    try:
        # 1. Start Backend FastAPI Server
        print("⚡ Starting Backend (FastAPI on http://127.0.0.1:8000)...")
        backend_proc = subprocess.Popen(
            [python_exe, "-m", "uvicorn", "main:app", "--port", "8000", "--host", "127.0.0.1", "--reload"],
            cwd=BACKEND_DIR
        )

        # 2. Start Frontend Vite Server
        print("🎨 Starting Frontend (Vite on http://localhost:5173)...")
        npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
        frontend_proc = subprocess.Popen(
            [npm_cmd, "run", "dev"],
            cwd=FRONTEND_DIR,
            shell=(sys.platform == "win32")
        )

        # 3. Wait briefly for servers to spin up, then open browser
        print("🌐 Opening web browser at http://localhost:5173 in 3 seconds...")
        time.sleep(3)
        try:
            webbrowser.open("http://localhost:5173")
        except Exception:
            pass

        print("\n" + "=" * 60)
        print("  ✨ Disk Space Analyzer is READY & RUNNING!")
        print("  - Web App : http://localhost:5173")
        print("  - API Docs: http://127.0.0.1:8000/docs")
        print("  (Press Ctrl+C in this terminal to stop both servers)")
        print("=" * 60 + "\n")

        # Keep running until Ctrl+C or a process crashes
        while True:
            time.sleep(1)
            if backend_proc.poll() is not None:
                print("Backend server stopped unexpectedly.")
                break
            if frontend_proc.poll() is not None:
                print("Frontend server stopped unexpectedly.")
                break

    except KeyboardInterrupt:
        print("\n🛑 Stopping Disk Space Analyzer...")
    finally:
        print("Cleaning up processes...")
        kill_process(backend_proc)
        kill_process(frontend_proc)
        print("✅ Done! All servers stopped cleanly.")

if __name__ == "__main__":
    main()

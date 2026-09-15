# Disk Space Analyzer

[![Python Version](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React Version](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)](https://github.com/)

Disk Space Analyzer is a modern, high-performance web application designed to visualize disk and folder storage usage. Inspired by classic desktop tools like WinDirStat and TreeSize, it brings hierarchical disk space analysis to the web through an interactive Sunburst chart, modern dark-mode glassmorphism aesthetics, and native operating system integration.

---

## Key Features

- Fast Directory Scanning: Scans system folders efficiently via Python backend services.
- Depth Limit Precision: Computes the true total size of deep directory trees recursively without generating excessively nested display trees that could degrade web browser performance.
- Non-blocking I/O Architecture: Runs disk scan operations in background worker threadpools, keeping the FastAPI event loop responsive for concurrent requests and health checks.
- Direct Folder / Drive Opener: Allows opening any scanned directory or highlighting selected files directly in the native OS File Explorer (Windows Explorer, macOS Finder, or Linux file manager) without copying paths manually.
- Interactive Sunburst Visualization: Hierarchical storage visualization powered by `@nivo/sunburst` with custom interactive tooltips and node selection.
- Smart Small Node Grouping: Automatically bundles files and folders smaller than 2% of the parent folder into an "Others" category to maintain high rendering framerates.
- Human-Readable Metrics: Formats storage sizes clearly (Bytes, KB, MB, GB, TB).
- Quick Shortcuts: Pre-configured shortcuts for common drives and directories.

---

## Tech Stack

### Backend
- Language: Python 3.10+
- Framework: FastAPI (Asynchronous REST API)
- Concurrency: Starlette threadpool runner for non-blocking disk I/O
- Server: Uvicorn (ASGI server)
- Data Validation: Pydantic v2

### Frontend
- Framework: React 19 + Vite
- Visualization: `@nivo/sunburst`
- Icons: Lucide React
- HTTP Client: Axios
- Styling: Custom Vanilla CSS with Dark Slate Glassmorphism tokens

---

## Project Structure

```text
Disk_Space_Analyzer/
├── backend/
│   ├── main.py              # FastAPI endpoints, CORS, threadpool execution
│   ├── scanner.py           # Recursive disk scanner with depth precision logic
│   ├── requirements.txt     # Python dependencies
│   └── venv/                # Virtual environment (local)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DiskChart.jsx # Interactive Sunburst chart and node details bar
│   │   │   └── PathInput.jsx # Input bar with quick drive shortcuts
│   │   ├── App.jsx           # Root component, state management, toast alerts
│   │   ├── App.css           # App layout styles
│   │   ├── index.css         # Global design system, glassmorphism tokens
│   │   └── main.jsx          # React DOM entry point
│   ├── package.json
│   └── vite.config.js
├── .agents/
│   ├── rules/               # Agent rules and safety guidelines
│   └── plugins/             # Antigravity project skills and plugins
├── run.py                   # Unified launcher script (auto-starts both servers)
├── start.bat                # Windows double-click launcher
└── README.md
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:
- Python 3.10 or higher: [python.org](https://www.python.org/)
- Node.js 18 or higher: [nodejs.org](https://nodejs.org/)
- Git: [git-scm.com](https://git-scm.com/)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/Disk_Space_Analyzer.git
cd Disk_Space_Analyzer
```

---

### Step 2: Environment Setup

#### 1. Setup Backend
Open a terminal in the project root:

On Windows:
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

On macOS / Linux:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..
```

#### 2. Setup Frontend
In the project root:
```bash
cd frontend
npm install
cd ..
```

---

### Step 3: Running the Application

#### Option A: Unified Launcher (Recommended)

Run both the backend and frontend simultaneously with automatic browser launching:

- On Windows (Double-click):
  Double-click `start.bat` in the project root directory.

- Via Terminal (Cross-platform):
  ```bash
  python run.py
  ```

This unified launcher will:
1. Start the FastAPI backend server on `http://127.0.0.1:8000`.
2. Start the Vite frontend development server on `http://localhost:5173`.
3. Automatically open your default web browser to `http://localhost:5173`.
4. Gracefully terminate both servers when you press `Ctrl + C`.

---

#### Option B: Manual Startup (Separate Terminals)

If you prefer running services independently:

Terminal 1 (Backend):
```bash
cd backend
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

uvicorn main:app --reload --port 8000
```
Backend API will be live at `http://127.0.0.1:8000` (API Docs: `http://127.0.0.1:8000/docs`).

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```
Frontend web application will be accessible at `http://localhost:5173`.

---

## How to Use

1. Enter a folder or drive path in the search bar (e.g., `C:\Users` or `/home/user`). You can also click one of the quick shortcut chips.
2. Click "Scan Drive" to analyze storage usage.
3. The Sunburst chart displays storage hierarchy where ring slices correspond to directory depth.
4. Hover over any segment to inspect its size and path.
5. Click on any segment in the chart to display the selected folder bar:
   - Click "Open in File Explorer" to launch native OS File Explorer at that exact location.
   - Click "Scan this folder" to drill down and re-focus the analysis on that specific subfolder.

---

## Roadmap and Current Progress

### 1. Depth Limit Precision - [Completed]
- Full-depth size accumulation through lightweight traversal (`get_dir_size`).
- Guarantees 100% accurate total directory sizes while restricting display tree depth to keep the frontend responsive.

### 2. Blocking Event Loop Fix (Non-blocking I/O) - [Completed]
- Offloaded disk scanning tasks to FastAPI worker threadpools via `starlette.concurrency.run_in_threadpool`.
- Server event loop remains unblocked and serves concurrent requests and health checks (`/health`) without delays.

### 3. Direct Folder / Drive Opener in File Explorer - [Completed]
- Integrated `POST /open-folder` backend endpoint supporting native opening via `os.startfile` and `explorer.exe /select` on Windows, `open` on macOS, and `xdg-open` on Linux.
- Added selected node details bar, direct path launcher buttons, and interactive feedback toasts on the frontend.

### 4. Multiple View Modes - [Planned]
- Treemap View: Alternative rectangular layout similar to classic WinDirStat.
- Folder Table View: Tabular view sorted by size with drill-down breadcrumb navigation.

### 5. Configurable API URL - [Planned]
- Environment variable configuration (`VITE_API_BASE_URL`) and Vite reverse proxy routing.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

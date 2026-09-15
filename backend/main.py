from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from starlette.concurrency import run_in_threadpool
import subprocess
import sys
import os
from scanner import scan_directory

app = FastAPI(title="Disk Space Analyzer API")

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScanRequest(BaseModel):
    path: str
    max_depth: int = 4

class OpenPathRequest(BaseModel):
    path: str

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/scan")
async def scan_path(req: ScanRequest):
    if not os.path.exists(req.path):
        raise HTTPException(status_code=404, detail="Path not found")
    if not os.path.isdir(req.path):
        raise HTTPException(status_code=400, detail="Path is not a directory")
    
    # Run the scanner in a background thread pool to ensure non-blocking I/O on the main event loop
    data = await run_in_threadpool(scan_directory, req.path, req.max_depth)
    return data

@app.post("/open-folder")
async def open_folder(req: OpenPathRequest):
    if not os.path.exists(req.path):
        raise HTTPException(status_code=404, detail=f"Path not found: {req.path}")
    
    abs_path = os.path.abspath(req.path)
    try:
        if sys.platform == "win32":
            if os.path.isfile(abs_path):
                subprocess.Popen(f'explorer.exe /select,"{abs_path}"')
            else:
                os.startfile(abs_path)
        elif sys.platform == "darwin":
            subprocess.Popen(["open", abs_path])
        else:
            subprocess.Popen(["xdg-open", abs_path])
        return {"status": "success", "message": f"Opened {abs_path} in File Explorer", "path": abs_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to open in File Explorer: {str(e)}")

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
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

@app.post("/scan")
async def scan_path(req: ScanRequest):
    if not os.path.exists(req.path):
        raise HTTPException(status_code=404, detail="Path not found")
    if not os.path.isdir(req.path):
        raise HTTPException(status_code=400, detail="Path is not a directory")
    
    # Run the scanner
    data = scan_directory(req.path, req.max_depth)
    return data

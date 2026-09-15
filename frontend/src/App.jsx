import React, { useState } from 'react';
import axios from 'axios';
import { HardDrive, CheckCircle2 } from 'lucide-react';
import PathInput from './components/PathInput';
import DiskChart from './components/DiskChart';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleScan = async (path) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await axios.post('http://127.0.0.1:8000/scan', {
        path: path,
        max_depth: 4
      });
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to scan the directory. Please check the path and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFolder = async (folderPath) => {
    if (!folderPath) return;
    try {
      await axios.post('http://127.0.0.1:8000/open-folder', {
        path: folderPath
      });
      showToast(`Opening in File Explorer: ${folderPath}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to open directory in File Explorer.');
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>
          <HardDrive size={36} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
          Disk Space Analyzer
        </h1>
        <p>Beautiful, intuitive storage visualization & quick explorer launcher</p>
      </header>

      <div className="glass-panel">
        <PathInput onScan={handleScan} onOpenFolder={handleOpenFolder} loading={loading} />
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="glass-panel chart-container">
        {loading ? (
          <div className="loading-spinner">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="2" x2="12" y2="6"></line>
              <line x1="12" y1="18" x2="12" y2="22"></line>
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
              <line x1="2" y1="12" x2="6" y2="12"></line>
              <line x1="18" y1="12" x2="22" y2="12"></line>
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
            </svg>
            <p>Scanning your drive... This might take a moment depending on the size and speed of your disk.</p>
          </div>
        ) : data ? (
          <DiskChart data={data} onOpenFolder={handleOpenFolder} onScan={handleScan} />
        ) : (
          <div style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
            <p>Enter a path above and click Scan to visualize disk usage.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '8px', opacity: 0.7 }}>
              Tip: You can also click "Open Folder" or click any arc in the chart to launch File Explorer directly!
            </p>
          </div>
        )}
      </div>

      {toast && (
        <div className="toast-success">
          <CheckCircle2 size={20} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

export default App;

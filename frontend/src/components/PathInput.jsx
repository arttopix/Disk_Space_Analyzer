import React, { useState } from 'react';
import { Search, FolderOpen, HardDrive } from 'lucide-react';

const PathInput = ({ onScan, onOpenFolder, loading }) => {
  const [path, setPath] = useState('c:\\Environment_Dev');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (path.trim()) {
      onScan(path.trim());
    }
  };

  const handleOpenCurrent = () => {
    if (path.trim() && onOpenFolder) {
      onOpenFolder(path.trim());
    }
  };

  const quickPaths = [
    { label: 'C:\\', path: 'C:\\' },
    { label: 'C:\\Users', path: 'C:\\Users' },
    { label: 'C:\\Environment_Dev', path: 'c:\\Environment_Dev' },
  ];

  return (
    <div>
      <form onSubmit={handleSubmit} className="input-container">
        <input
          type="text"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="Enter absolute path (e.g., C:\Users)"
          disabled={loading}
        />
        <button type="submit" className="btn-primary" disabled={loading || !path.trim()}>
          <Search size={20} />
          {loading ? 'Scanning...' : 'Scan Drive'}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={handleOpenCurrent}
          disabled={loading || !path.trim()}
          title="Open this path directly in Windows File Explorer"
        >
          <FolderOpen size={20} />
          Open Folder
        </button>
      </form>

      <div className="quick-drives">
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginRight: '4px' }}>
          Quick shortcuts:
        </span>
        {quickPaths.map((item) => (
          <button
            key={item.label}
            type="button"
            className="quick-chip"
            onClick={() => {
              setPath(item.path);
              onScan(item.path);
            }}
            disabled={loading}
          >
            <HardDrive size={13} />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PathInput;

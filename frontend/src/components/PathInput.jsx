import React, { useState } from 'react';
import { Search } from 'lucide-react';

const PathInput = ({ onScan, loading }) => {
  const [path, setPath] = useState('c:\\Environment_Dev');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (path.trim()) {
      onScan(path.trim());
    }
  };

  return (
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
    </form>
  );
};

export default PathInput;

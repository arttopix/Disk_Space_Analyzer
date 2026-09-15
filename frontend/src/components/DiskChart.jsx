import React, { useState, useEffect } from 'react';
import { ResponsiveSunburst } from '@nivo/sunburst';
import { Folder, File, ExternalLink, Search, Layers } from 'lucide-react';

// Format bytes to human readable string
const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const CustomTooltip = ({ id, value, color, path, data }) => {
  return (
    <div className="custom-tooltip" style={{ borderLeft: `4px solid ${color}` }}>
      <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '6px' }}>{id}</div>
      <div style={{ color: 'var(--text-secondary)' }}>
        Path: <span style={{ color: 'var(--text-primary)' }}>{data?.path || path.join(' / ')}</span>
      </div>
      <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
        Size: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{formatBytes(value)}</span>
      </div>
      <div style={{ color: '#60a5fa', fontSize: '0.8rem', marginTop: '6px', opacity: 0.85 }}>
        💡 Click arc to select and open in File Explorer
      </div>
    </div>
  );
};

const DiskChart = ({ data, onOpenFolder, onScan }) => {
  const [selectedNode, setSelectedNode] = useState(null);

  // Set default selected node to the root directory when data changes
  useEffect(() => {
    if (data) {
      setSelectedNode(data);
    }
  }, [data]);

  if (!data || !data.children || data.children.length === 0) {
    return (
      <div style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
        <p>No data to display or the folder is empty.</p>
        <p style={{ marginTop: '8px' }}>
          Total Size: <span style={{ color: 'var(--text-primary)' }}>{formatBytes(data?.value || 0)}</span>
        </p>
      </div>
    );
  }

  const handleNodeClick = (node) => {
    if (node && node.data) {
      setSelectedNode(node.data);
    }
  };

  const handleOpenSelected = () => {
    if (selectedNode && selectedNode.path && onOpenFolder) {
      onOpenFolder(selectedNode.path);
    }
  };

  const handleScanSelected = () => {
    if (selectedNode && selectedNode.path && onScan && selectedNode.type === 'dir') {
      onScan(selectedNode.path);
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Selected Item Info Bar */}
      {selectedNode && (
        <div className="selected-node-bar">
          <div className="node-info">
            <div className="node-title">
              {selectedNode.type === 'file' ? (
                <File size={20} color="#38bdf8" />
              ) : selectedNode.type === 'group' ? (
                <Layers size={20} color="#c084fc" />
              ) : (
                <Folder size={20} color="#fbbf24" />
              )}
              <span>{selectedNode.name}</span>
              <span className="node-badge">{selectedNode.type}</span>
              <span style={{ color: '#38bdf8', fontWeight: 500, fontSize: '1rem' }}>
                {formatBytes(selectedNode.value)}
              </span>
            </div>
            <div className="node-path" title={selectedNode.path}>
              {selectedNode.path || 'Grouped items'}
            </div>
          </div>

          <div className="node-actions">
            {selectedNode.path && (
              <button
                type="button"
                className="btn-icon"
                onClick={handleOpenSelected}
                title="Open in Windows File Explorer"
              >
                <ExternalLink size={16} />
                Open in File Explorer
              </button>
            )}

            {selectedNode.type === 'dir' && selectedNode.path && selectedNode.path !== data.path && (
              <button
                type="button"
                className="btn-icon"
                style={{ background: 'rgba(168, 85, 247, 0.15)', borderColor: 'rgba(168, 85, 247, 0.3)', color: '#c084fc' }}
                onClick={handleScanSelected}
                title="Focus scan on this subfolder"
              >
                <Search size={16} />
                Scan this folder
              </button>
            )}
          </div>
        </div>
      )}

      {/* Sunburst Visualization */}
      <div style={{ width: '100%', height: '580px' }}>
        <ResponsiveSunburst
          data={data}
          id="name"
          value="value"
          margin={{ top: 15, right: 15, bottom: 15, left: 15 }}
          cornerRadius={4}
          borderWidth={1.5}
          borderColor="var(--bg-color)"
          colors={{ scheme: 'category10' }}
          childColor={{
            from: 'color',
            modifiers: [['brighter', 0.4]]
          }}
          enableArcLabels={true}
          arcLabelsSkipAngle={15}
          arcLabelsTextColor={{
            from: 'color',
            modifiers: [['darker', 3]]
          }}
          tooltip={({ id, value, color, path, data: nodeData }) => (
            <CustomTooltip id={id} value={value} color={color} path={path} data={nodeData} />
          )}
          onClick={handleNodeClick}
          animate={true}
          motionConfig="gentle"
          transitionMode="pushIn"
        />
      </div>
    </div>
  );
};

export default DiskChart;

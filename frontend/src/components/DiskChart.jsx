import React from 'react';
import { ResponsiveSunburst } from '@nivo/sunburst';

// Format bytes to human readable string
const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const CustomTooltip = ({ id, value, color, path }) => {
  return (
    <div className="custom-tooltip" style={{ borderLeft: `4px solid ${color}` }}>
      <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '6px' }}>{id}</div>
      <div style={{ color: 'var(--text-secondary)' }}>
        Path: <span style={{ color: 'var(--text-primary)' }}>{path.join(' / ')}</span>
      </div>
      <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
        Size: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{formatBytes(value)}</span>
      </div>
    </div>
  );
};

const DiskChart = ({ data }) => {
  if (!data || !data.children || data.children.length === 0) {
    return (
      <div style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
        <p>No data to display or the folder is empty.</p>
        <p style={{ marginTop: '8px' }}>Total Size: <span style={{ color: 'var(--text-primary)' }}>{formatBytes(data?.value || 0)}</span></p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ResponsiveSunburst
        data={data}
        id="name"
        value="value"
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        cornerRadius={4}
        borderWidth={1.5}
        borderColor="var(--bg-color)"
        colors={{ scheme: 'category10' }}
        childColor={{
            from: 'color',
            modifiers: [
                [ 'brighter', 0.4 ]
            ]
        }}
        enableArcLabels={true}
        arcLabelsSkipAngle={15}
        arcLabelsTextColor={{
            from: 'color',
            modifiers: [
                [ 'darker', 3 ]
            ]
        }}
        tooltip={({ id, value, color, path }) => (
          <CustomTooltip id={id} value={value} color={color} path={path} />
        )}
        animate={true}
        motionConfig="gentle"
        transitionMode="pushIn"
      />
    </div>
  );
};

export default DiskChart;

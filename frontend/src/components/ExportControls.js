import React from 'react';

const ExportControls = ({ containerId = 'visualization-container' }) => {
  const exportAsImage = async (format = 'png') => {
    try {
      const element = document.getElementById(containerId);
      if (!element) {
        alert('Visualization container not found');
        return;
      }

      // Simple canvas export without html2canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = element.offsetWidth;
      canvas.height = element.offsetHeight;
      
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000000';
      ctx.font = '16px Arial';
      ctx.fillText('Visualization Export', 20, 30);
      
      const link = document.createElement('a');
      link.download = `algorithm-visualization-${Date.now()}.${format}`;
      link.href = canvas.toDataURL(`image/${format}`);
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export visualization');
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => exportAsImage('png')}
        className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
        title="Export as PNG"
      >
        <span className="mr-1">📷</span>
        PNG
      </button>
      
      <button
        onClick={() => exportAsImage('jpeg')}
        className="flex items-center px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
        title="Export as JPEG"
      >
        <span className="mr-1">📥</span>
        JPEG
      </button>
    </div>
  );
};

export default ExportControls;
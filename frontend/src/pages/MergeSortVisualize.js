import React from 'react';

const MergeSortVisualize = () => {
  return (
    <div style={{
      backgroundColor: '#0a0e1a',
      color: 'white',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <a href="/sortingalgorithms" style={{
        background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
        color: 'white',
        padding: '14px 24px',
        border: 'none',
        borderRadius: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'none',
        boxShadow: '0 8px 25px rgba(124, 58, 237, 0.4)',
        display: 'inline-block',
        marginBottom: '40px'
      }}>
        ← Back to Sorting Algorithms
      </a>
      
      <h1 style={{
        fontSize: '3rem',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: '3rem',
        color: 'white'
      }}>
        Merge Sort Visualization
      </h1>
      
      <div style={{
        textAlign: 'center',
        fontSize: '1.5rem',
        color: '#94a3b8'
      }}>
        Interactive Merge Sort visualization coming soon...
      </div>
    </div>
  );
};

export default MergeSortVisualize;
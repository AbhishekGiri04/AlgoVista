import React, { useState } from 'react';

const KahnsAlgorithmVisualize = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const runKahns = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://algovista-flux.onrender.com/api/algorithms/kahns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await response.text();
      setResult(data);
    } catch (error) {
      setResult('Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{
      backgroundColor: '#0a0e1a',
      color: 'white',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <a href="/graphalgorithms" style={{
        background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '12px',
        textDecoration: 'none',
        fontWeight: '600'
      }}>
        ← Back to Graph Algorithms
      </a>

      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>
          Kahn's Algorithm Visualizer
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>
          Topological sorting using BFS approach
        </p>
      </div>

      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '30px'
      }}>
        <button
          onClick={runKahns}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          {loading ? 'Running...' : 'Run Kahn\'s Algorithm'}
        </button>

        <div style={{
          background: '#1e293b',
          borderRadius: '12px',
          padding: '20px',
          fontFamily: 'monospace',
          fontSize: '14px',
          whiteSpace: 'pre-wrap',
          minHeight: '200px'
        }}>
          {result || 'Click "Run Kahn\'s Algorithm" to see the topological sort output'}
        </div>
      </div>
    </div>
  );
};

export default KahnsAlgorithmVisualize;
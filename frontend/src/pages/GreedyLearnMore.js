import React from 'react';

const GreedyLearnMore = () => {
  const algorithms = [
    {
      name: 'Huffman Coding',
      description: 'Builds a binary tree where more frequent items have shorter codes to compress data efficiently.',
      type: 'Data Compression',
      applications: 'Data compression (ZIP files, JPEG, MP3). Reducing storage space and transmission time. Lossless compression algorithms in multimedia and file systems.',
      example: 'Compressing text files by encoding frequent characters with fewer bits.',
      gradient: 'linear-gradient(135deg, #fa709a, #fee140)'
    },
    {
      name: 'Activity Selection Problem',
      description: 'Selects the maximum number of non-overlapping activities based on start and end times.',
      type: 'Scheduling',
      applications: 'Job scheduling in operating systems. Room or conference scheduling. Planning non-overlapping tasks in project management.',
      example: 'Assigning classrooms to lectures without time conflicts.',
      gradient: 'linear-gradient(135deg, #ff6b6b, #ff5252)'
    },
    {
      name: 'Fractional Knapsack Problem',
      description: 'Selects items with the highest value-to-weight ratio to maximize total value in a knapsack; items can be broken into fractions.',
      type: 'Optimization',
      applications: 'Resource allocation in manufacturing or logistics. Budget optimization (maximizing value with limited resources). Investment or cargo loading problems.',
      example: 'Loading gold into a bag where partial amounts are allowed to maximize profit.',
      gradient: 'linear-gradient(135deg, #48dbfb, #0abde3)'
    }
  ];

  const AlgorithmCard = ({ algorithm }) => (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      color: '#1a1a1a',
      borderRadius: '20px',
      padding: '30px',
      marginBottom: '24px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.2)',
      border: `3px solid ${algorithm.gradient.includes('fa709a') ? '#fa709a' : algorithm.gradient.includes('ff6b6b') ? '#ff6b6b' : '#48dbfb'}`,
      backdropFilter: 'blur(10px)',
      transform: 'translateY(0)',
      transition: 'all 0.3s ease'
    }}>
      <h3 style={{ 
        margin: '0 0 16px', 
        fontSize: '1.6rem', 
        fontWeight: '800',
        background: algorithm.gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        {algorithm.name}
      </h3>
      <p style={{ margin: '0 0 20px', lineHeight: '1.6', fontSize: '1.05rem', color: '#2d3748' }}>
        {algorithm.description}
      </p>
      <div style={{ 
        padding: '12px 16px', 
        background: '#f7fafc', 
        borderRadius: '8px', 
        border: '1px solid #718096',
        marginBottom: '16px'
      }}>
        <strong style={{ color: '#4a5568' }}>Type:</strong> <span style={{ color: '#1a202c', fontWeight: '600' }}>{algorithm.type}</span>
      </div>
      <div style={{ 
        padding: '16px', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        borderRadius: '12px', 
        color: 'white',
        marginBottom: '12px'
      }}>
        <strong style={{ fontSize: '1.05rem' }}>Applications:</strong>
        <div style={{ marginTop: '8px', fontSize: '1rem', lineHeight: '1.5' }}>{algorithm.applications}</div>
      </div>
      <div style={{ 
        padding: '16px', 
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
        borderRadius: '12px', 
        color: 'white'
      }}>
        <strong style={{ fontSize: '1.05rem' }}>Example:</strong>
        <div style={{ marginTop: '8px', fontSize: '1rem', lineHeight: '1.5', fontStyle: 'italic' }}>{algorithm.example}</div>
      </div>
    </div>
  );

  return (
    <div style={{
      backgroundColor: '#0a0e1a',
      backgroundImage: 'linear-gradient(rgba(10, 14, 26, 0.7), rgba(10, 14, 26, 0.7)), url(https://i.ytimg.com/vi/8-3XUO30snE/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAQlMw321X3ipmncfDsZl4rdTWXzQ)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      color: 'white',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <a href="/greedyalgorithms" style={{
        position: 'fixed',
        top: '40px',
        left: '40px',
        background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
        color: 'white',
        padding: '12px 20px',
        border: 'none',
        borderRadius: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'none',
        boxShadow: '0 6px 20px rgba(124, 58, 237, 0.4)',
        zIndex: 1000
      }}>
        ← Back to Greedy Algorithms
      </a>

      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px', background: 'rgba(255, 255, 255, 0.95)', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '900',
            color: '#1a202c',
            marginBottom: '20px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            ✨ Greedy Algorithms Guide
          </h1>
          <p style={{ fontSize: '1.3rem', color: '#2d3748', maxWidth: '800px', margin: '0 auto', lineHeight: '1.7', fontWeight: '500' }}>
            Complete guide to greedy algorithms, their types, and applications
          </p>
        </div>

        {/* Definition Section */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '24px', color: '#fa709a', textAlign: 'center' }}>
            📚 Definition
          </h2>
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '20px',
            padding: '40px',
            border: '3px solid #fa709a',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', margin: 0, color: '#2d3748', fontWeight: '500', textAlign: 'center' }}>
              Greedy algorithms make a series of choices, each locally optimal, with the hope that this leads to a globally optimal solution. They are widely used in optimization problems, coding, scheduling, and resource allocation.
            </p>
          </div>
        </section>

        {/* Algorithms Section */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '24px', color: '#ed8936', textAlign: 'center' }}>
            🎁 Greedy Algorithms
          </h2>
          {algorithms.map((algorithm, index) => (
            <AlgorithmCard key={index} algorithm={algorithm} />
          ))}
        </section>

        {/* Comparison Table */}
        <section>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '30px', color: '#38b2ac', textAlign: 'center' }}>
            📋 Quick Comparison Table
          </h2>
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '20px',
            padding: '30px',
            border: '3px solid #38b2ac',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            overflowX: 'auto'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1rem' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '1.1rem' }}>Algorithm</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '1.1rem' }}>Type / Purpose</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '1.1rem' }}>Key Applications</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Huffman Coding', type: 'Data Compression', apps: 'ZIP, JPEG, MP3, reducing storage and transmission size' },
                  { name: 'Activity Selection Problem', type: 'Scheduling', apps: 'Job scheduling, classroom allocation, task management' },
                  { name: 'Fractional Knapsack', type: 'Optimization', apps: 'Resource allocation, cargo loading, budget maximization' }
                ].map((item, index) => (
                  <tr key={index} style={{ 
                    borderBottom: '2px solid #e2e8f0',
                    background: index % 2 === 0 ? '#f7fafc' : 'white',
                    transition: 'all 0.2s ease'
                  }}>
                    <td style={{ padding: '16px', fontWeight: '700', color: '#2d3748', fontSize: '1.05rem' }}>{item.name}</td>
                    <td style={{ padding: '16px', color: '#4a5568', fontWeight: '600' }}>{item.type}</td>
                    <td style={{ padding: '16px', color: '#38a169', fontWeight: '600' }}>{item.apps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GreedyLearnMore;
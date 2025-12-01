import React from 'react';

const SearchingLearnMore = () => {
  const algorithms = [
    {
      name: 'Linear Search',
      description: 'Checks each element sequentially until the target is found.',
      timeComplexity: { best: 'O(1)', worst: 'O(n)' },
      spaceComplexity: 'O(1)',
      type: 'Simple / Unsorted',
      useCase: 'Small or unsorted datasets, simple search in arrays or lists, useful in embedded systems where simplicity is key',
      example: 'Searching for a student\'s roll number in a small attendance list.',
      gradient: 'linear-gradient(135deg, #ff6b6b, #ff5252)'
    },
    {
      name: 'Binary Search',
      description: 'Works on sorted arrays by repeatedly dividing the search interval in half.',
      timeComplexity: { best: 'O(1)', worst: 'O(log n)' },
      spaceComplexity: 'O(1) iterative / O(log n) recursive',
      type: 'Divide & Conquer',
      useCase: 'Searching in databases, efficient lookups in dictionaries, indexes, or arrays',
      example: 'Finding a word in a dictionary or a record in a sorted database table.',
      gradient: 'linear-gradient(135deg, #48dbfb, #0abde3)'
    },
    {
      name: 'Jump Search',
      description: 'Jump ahead by fixed steps and then perform linear search within a block.',
      timeComplexity: { best: 'O(1)', worst: 'O(√n)' },
      spaceComplexity: 'O(1)',
      type: 'Block search',
      useCase: 'Medium-sized sorted datasets, systems where jumping reduces time compared to linear search',
      example: 'Searching in a telephone directory stored as a sorted array.',
      gradient: 'linear-gradient(135deg, #ff9f43, #ff6348)'
    },
    {
      name: 'Exponential Search',
      description: 'Finds a range where the element may exist using exponential jumps, then applies binary search.',
      timeComplexity: { best: 'O(1)', worst: 'O(log n)' },
      spaceComplexity: 'O(1)',
      type: 'Unbounded / sorted',
      useCase: 'Large sorted datasets, infinite or unbounded lists (e.g., streaming data)',
      example: 'Searching timestamps in an unbounded log file.',
      gradient: 'linear-gradient(135deg, #4834d4, #686de0)'
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
      border: `3px solid ${algorithm.gradient.includes('ff6b6b') ? '#ff6b6b' : algorithm.gradient.includes('48dbfb') ? '#48dbfb' : algorithm.gradient.includes('ff9f43') ? '#ff9f43' : '#4834d4'}`,
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
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '16px', 
        fontSize: '1rem',
        marginBottom: '16px'
      }}>
        <div style={{ padding: '8px 12px', background: '#e6fffa', borderRadius: '8px', border: '1px solid #38b2ac' }}>
          <strong style={{ color: '#2c7a7b' }}>Best:</strong> <span style={{ color: '#1a202c', fontWeight: '600' }}>{algorithm.timeComplexity.best}</span>
        </div>
        <div style={{ padding: '8px 12px', background: '#fef5e7', borderRadius: '8px', border: '1px solid #ed8936' }}>
          <strong style={{ color: '#c05621' }}>Worst:</strong> <span style={{ color: '#1a202c', fontWeight: '600' }}>{algorithm.timeComplexity.worst}</span>
        </div>
        <div style={{ padding: '8px 12px', background: '#e6f3ff', borderRadius: '8px', border: '1px solid #3182ce' }}>
          <strong style={{ color: '#2c5282' }}>Space:</strong> <span style={{ color: '#1a202c', fontWeight: '600' }}>{algorithm.spaceComplexity}</span>
        </div>
        <div style={{ padding: '8px 12px', background: '#f7fafc', borderRadius: '8px', border: '1px solid #718096' }}>
          <strong style={{ color: '#4a5568' }}>Type:</strong> <span style={{ color: '#1a202c', fontWeight: '600' }}>{algorithm.type}</span>
        </div>
      </div>
      <div style={{ 
        padding: '16px', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        borderRadius: '12px', 
        color: 'white',
        marginBottom: '12px'
      }}>
        <strong style={{ fontSize: '1.05rem' }}>Use Cases:</strong>
        <div style={{ marginTop: '8px', fontSize: '1rem', lineHeight: '1.5' }}>{algorithm.useCase}</div>
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
      backgroundImage: 'linear-gradient(rgba(10, 14, 26, 0.7), rgba(10, 14, 26, 0.7)), url(https://bitlaunch.io/blog/content/images/2021/07/markus-winkler-afW1hht0NSs-unsplash.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      color: 'white',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <a href="/searchingalgorithms" style={{
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
        ← Back to Searching Algorithms
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
            🔍 Searching Algorithms Guide
          </h1>
          <p style={{ fontSize: '1.3rem', color: '#2d3748', maxWidth: '800px', margin: '0 auto', lineHeight: '1.7', fontWeight: '500' }}>
            Complete guide to searching algorithms, their complexities, and applications
          </p>
        </div>

        {/* Definition Section */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '24px', color: '#48dbfb', textAlign: 'center' }}>
            📚 Definition
          </h2>
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '20px',
            padding: '40px',
            border: '3px solid #48dbfb',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', margin: 0, color: '#2d3748', fontWeight: '500', textAlign: 'center' }}>
              Searching algorithms are methods used to find the position of an element in a data structure, such as arrays, lists, or strings. Efficient searching is crucial for databases, real-time systems, and large-scale applications.
            </p>
          </div>
        </section>

        {/* Algorithms Section */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '24px', color: '#ed8936', textAlign: 'center' }}>
            🔍 Searching Algorithms
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
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '1.1rem' }}>Type</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '1.1rem' }}>Best Case</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '1.1rem' }}>Worst Case</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '1.1rem' }}>Space</th>
                </tr>
              </thead>
              <tbody>
                {algorithms.map((algo, index) => (
                  <tr key={index} style={{ 
                    borderBottom: '2px solid #e2e8f0',
                    background: index % 2 === 0 ? '#f7fafc' : 'white',
                    transition: 'all 0.2s ease'
                  }}>
                    <td style={{ padding: '16px', fontWeight: '700', color: '#2d3748', fontSize: '1.05rem' }}>{algo.name}</td>
                    <td style={{ padding: '16px', color: '#4a5568', fontWeight: '600' }}>{algo.type}</td>
                    <td style={{ padding: '16px', color: '#38a169', fontWeight: '600', fontFamily: 'monospace' }}>{algo.timeComplexity.best}</td>
                    <td style={{ padding: '16px', color: '#e53e3e', fontWeight: '600', fontFamily: 'monospace' }}>{algo.timeComplexity.worst}</td>
                    <td style={{ padding: '16px', color: '#3182ce', fontWeight: '600', fontFamily: 'monospace' }}>{algo.spaceComplexity}</td>
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

export default SearchingLearnMore;
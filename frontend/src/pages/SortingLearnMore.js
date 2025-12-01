import React from 'react';

const SortingLearnMore = () => {
  const comparisonAlgorithms = [
    {
      name: 'Bubble Sort',
      description: 'Repeatedly swaps adjacent elements if they are in the wrong order.',
      timeComplexity: { best: 'O(n)', worst: 'O(n²)', average: 'O(n²)' },
      spaceComplexity: 'O(1)',
      stable: 'Yes',
      inPlace: 'Yes',
      useCase: 'Small datasets, educational purposes',
      gradient: 'linear-gradient(135deg, #ff6b6b, #ff5252)'
    },
    {
      name: 'Selection Sort',
      description: 'Selects the minimum element from the unsorted portion and swaps it with the first unsorted element.',
      timeComplexity: { best: 'O(n²)', worst: 'O(n²)', average: 'O(n²)' },
      spaceComplexity: 'O(1)',
      stable: 'No',
      inPlace: 'Yes',
      useCase: 'Simple applications where memory writes are expensive',
      gradient: 'linear-gradient(135deg, #ff9f43, #ff6348)'
    },
    {
      name: 'Insertion Sort',
      description: 'Builds a sorted portion by inserting each element into its correct position.',
      timeComplexity: { best: 'O(n)', worst: 'O(n²)', average: 'O(n²)' },
      spaceComplexity: 'O(1)',
      stable: 'Yes',
      inPlace: 'Yes',
      useCase: 'Small or nearly sorted arrays, real-time systems',
      gradient: 'linear-gradient(135deg, #feca57, #ff9ff3)'
    },
    {
      name: 'Merge Sort',
      description: 'Divides the array into halves, sorts each half recursively, and merges them.',
      timeComplexity: { best: 'O(n log n)', worst: 'O(n log n)', average: 'O(n log n)' },
      spaceComplexity: 'O(n)',
      stable: 'Yes',
      inPlace: 'No',
      useCase: 'Large datasets, external sorting (files that do not fit in memory)',
      gradient: 'linear-gradient(135deg, #48dbfb, #0abde3)'
    },
    {
      name: 'Quick Sort',
      description: 'Picks a pivot, partitions the array around it, then recursively sorts partitions.',
      timeComplexity: { best: 'O(n log n)', worst: 'O(n²)', average: 'O(n log n)' },
      spaceComplexity: 'O(log n)',
      stable: 'No',
      inPlace: 'Yes',
      useCase: 'Large in-memory datasets, widely used in libraries',
      gradient: 'linear-gradient(135deg, #ff9ff3, #f368e0)'
    },
    {
      name: 'Heap Sort',
      description: 'Uses a heap data structure to repeatedly extract the max (or min) and build the sorted array.',
      timeComplexity: { best: 'O(n log n)', worst: 'O(n log n)', average: 'O(n log n)' },
      spaceComplexity: 'O(1)',
      stable: 'No',
      inPlace: 'Yes',
      useCase: 'Priority queues, in-place sorting of large datasets',
      gradient: 'linear-gradient(135deg, #4834d4, #686de0)'
    }
  ];

  const nonComparisonAlgorithms = [
    {
      name: 'Counting Sort',
      description: 'Counts occurrences of each element and calculates their position in the sorted array.',
      timeComplexity: { best: 'O(n + k)', worst: 'O(n + k)', average: 'O(n + k)' },
      spaceComplexity: 'O(n + k)',
      stable: 'Yes',
      inPlace: 'No',
      useCase: 'Sorting integers with a small range, radix sort subroutine',
      gradient: 'linear-gradient(135deg, #00d2d3, #54a0ff)'
    },
    {
      name: 'Radix Sort',
      description: 'Sorts elements digit by digit, starting from the least significant digit.',
      timeComplexity: { best: 'O(d*(n + k))', worst: 'O(d*(n + k))', average: 'O(d*(n + k))' },
      spaceComplexity: 'O(n + k)',
      stable: 'Yes',
      inPlace: 'No',
      useCase: 'Large numbers, fixed-length strings, phone numbers, IDs',
      gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a24)'
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
      border: `3px solid ${algorithm.gradient.includes('ff6b6b') ? '#ff6b6b' : algorithm.gradient.includes('48dbfb') ? '#48dbfb' : algorithm.gradient.includes('ff9f43') ? '#ff9f43' : algorithm.gradient.includes('feca57') ? '#feca57' : algorithm.gradient.includes('ff9ff3') ? '#ff9ff3' : algorithm.gradient.includes('4834d4') ? '#4834d4' : algorithm.gradient.includes('00d2d3') ? '#00d2d3' : '#ff6b6b'}`,
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
        <div style={{ padding: '8px 12px', background: algorithm.stable === 'Yes' ? '#f0fff4' : '#fed7d7', borderRadius: '8px', border: `1px solid ${algorithm.stable === 'Yes' ? '#38a169' : '#e53e3e'}` }}>
          <strong style={{ color: algorithm.stable === 'Yes' ? '#276749' : '#c53030' }}>Stable:</strong> <span style={{ color: '#1a202c', fontWeight: '600' }}>{algorithm.stable}</span>
        </div>
        <div style={{ padding: '8px 12px', background: algorithm.inPlace === 'Yes' ? '#f0fff4' : '#fed7d7', borderRadius: '8px', border: `1px solid ${algorithm.inPlace === 'Yes' ? '#38a169' : '#e53e3e'}` }}>
          <strong style={{ color: algorithm.inPlace === 'Yes' ? '#276749' : '#c53030' }}>In-Place:</strong> <span style={{ color: '#1a202c', fontWeight: '600' }}>{algorithm.inPlace}</span>
        </div>
      </div>
      <div style={{ 
        padding: '16px', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        borderRadius: '12px', 
        color: 'white'
      }}>
        <strong style={{ fontSize: '1.05rem' }}>Use Case:</strong>
        <div style={{ marginTop: '8px', fontSize: '1rem', lineHeight: '1.5' }}>{algorithm.useCase}</div>
      </div>
    </div>
  );

  return (
    <div style={{
      backgroundColor: '#0a0e1a',
      backgroundImage: 'linear-gradient(rgba(10, 14, 26, 0.7), rgba(10, 14, 26, 0.7)), url(https://www.crio.do/blog/content/images/2021/11/Quick-Sort.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      color: 'white',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <a href="/sorting-algorithms" style={{
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
        ← Back to Sorting Algorithms
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
            🚀 Sorting Algorithms Guide
          </h1>
          <p style={{ fontSize: '1.3rem', color: '#2d3748', maxWidth: '800px', margin: '0 auto', lineHeight: '1.7', fontWeight: '500' }}>
            Complete guide to sorting algorithms, their types, complexities, and use cases
          </p>
        </div>

        {/* Definition Section */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '24px', color: '#667eea', textAlign: 'center' }}>
            📚 Definition
          </h2>
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '20px',
            padding: '40px',
            border: '3px solid #667eea',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', margin: 0, color: '#2d3748', fontWeight: '500', textAlign: 'center' }}>
              Sorting algorithms are a set of instructions or procedures used to arrange elements of a list or array in a particular order, typically ascending or descending. Sorting is a fundamental operation in computer science because it enhances the efficiency of other algorithms, such as search and merge operations, and is widely used in data organization, optimization, and analysis.
            </p>
          </div>
        </section>

        {/* Importance Section */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '24px', color: '#38b2ac', textAlign: 'center' }}>
            ⭐ Importance of Sorting
          </h2>
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '20px',
            padding: '40px',
            border: '3px solid #38b2ac',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={{ padding: '20px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', borderRadius: '16px', color: 'white', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔍</div>
                <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '8px' }}>Search Efficiency</strong>
                <span style={{ fontSize: '1rem' }}>Binary search requires sorted data</span>
              </div>
              <div style={{ padding: '20px', background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', borderRadius: '16px', color: '#2d3748', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>💾</div>
                <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '8px' }}>Data Organization</strong>
                <span style={{ fontSize: '1rem' }}>Better readability and usability</span>
              </div>
              <div style={{ padding: '20px', background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', borderRadius: '16px', color: '#2d3748', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📁</div>
                <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '8px' }}>Database Operations</strong>
                <span style={{ fontSize: '1rem' }}>Essential for data processing</span>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison-Based Algorithms */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '24px', color: '#ed8936', textAlign: 'center' }}>
            ⚖️ Comparison-Based Sorting Algorithms
          </h2>
          <div style={{
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '30px',
            border: '2px solid #ed8936',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '1.2rem', color: '#2d3748', margin: 0, lineHeight: '1.7', fontWeight: '500' }}>
              These algorithms compare elements with each other to decide their order. They work on the principle of comparing two elements and swapping them if necessary.
            </p>
          </div>
          {comparisonAlgorithms.map((algorithm, index) => (
            <AlgorithmCard key={index} algorithm={algorithm} />
          ))}
        </section>

        {/* Non-Comparison-Based Algorithms */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '24px', color: '#805ad5', textAlign: 'center' }}>
            🔢 Non-Comparison-Based Sorting Algorithms
          </h2>
          <div style={{
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '30px',
            border: '2px solid #805ad5',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '1.2rem', color: '#2d3748', margin: 0, lineHeight: '1.7', fontWeight: '500' }}>
              These algorithms do not compare elements directly but sort using counting, digit positions, or other properties. They are efficient for specific data types.
            </p>
          </div>
          {nonComparisonAlgorithms.map((algorithm, index) => (
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
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '1.1rem' }}>Best Case</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '1.1rem' }}>Worst Case</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '1.1rem' }}>Stable</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '1.1rem' }}>In-Place</th>
                </tr>
              </thead>
              <tbody>
                {[...comparisonAlgorithms, ...nonComparisonAlgorithms].map((algo, index) => (
                  <tr key={index} style={{ 
                    borderBottom: '2px solid #e2e8f0',
                    background: index % 2 === 0 ? '#f7fafc' : 'white',
                    transition: 'all 0.2s ease'
                  }}>
                    <td style={{ padding: '16px', fontWeight: '700', color: '#2d3748', fontSize: '1.05rem' }}>{algo.name}</td>
                    <td style={{ padding: '16px', color: '#38a169', fontWeight: '600', fontFamily: 'monospace' }}>{algo.timeComplexity.best}</td>
                    <td style={{ padding: '16px', color: '#e53e3e', fontWeight: '600', fontFamily: 'monospace' }}>{algo.timeComplexity.worst}</td>
                    <td style={{ padding: '16px', color: algo.stable === 'Yes' ? '#38a169' : '#e53e3e', fontWeight: '600' }}>
                      {algo.stable === 'Yes' ? '✅ Yes' : '❌ No'}
                    </td>
                    <td style={{ padding: '16px', color: algo.inPlace === 'Yes' ? '#38a169' : '#e53e3e', fontWeight: '600' }}>
                      {algo.inPlace === 'Yes' ? '✅ Yes' : '❌ No'}
                    </td>
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

export default SortingLearnMore;
import React from 'react';

const StringLearnMore = () => {
  const algorithms = [
    {
      name: 'Naive String Matching',
      description: 'Compares the pattern with every possible position in the text.',
      type: 'Brute Force',
      applications: 'Searching for keywords in small text files or documents. Educational purposes to teach basic pattern matching.',
      example: 'Finding a word in a text editor or document.',
      gradient: 'linear-gradient(135deg, #ff9a9e, #fecfef)'
    },
    {
      name: 'Knuth-Morris-Pratt (KMP) Algorithm',
      description: 'Uses a preprocessing table to skip unnecessary comparisons while searching for a pattern.',
      type: 'Pattern Matching',
      applications: 'Plagiarism detection by comparing large text documents. Searching DNA or protein sequences in bioinformatics. Spam filtering and large-scale text pattern searches.',
      example: 'Finding repeated patterns in DNA sequences or large datasets.',
      gradient: 'linear-gradient(135deg, #ff6b6b, #ff5252)'
    },
    {
      name: 'Rabin-Karp Algorithm',
      description: 'Uses hashing to compare patterns efficiently; if hash matches, checks characters.',
      type: 'Hashing / Pattern',
      applications: 'Multiple pattern searching in large texts. Plagiarism detection in documents. Network intrusion detection by matching patterns in logs.',
      example: 'Detecting keywords in logs or multiple patterns in a book.',
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
      border: `3px solid ${algorithm.gradient.includes('ff9a9e') ? '#ff9a9e' : algorithm.gradient.includes('ff6b6b') ? '#ff6b6b' : '#48dbfb'}`,
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
      backgroundImage: 'linear-gradient(rgba(10, 14, 26, 0.7), rgba(10, 14, 26, 0.7)), url(https://lamphq.com/wp-content/uploads/warm-dimming-led-bulbs-948x632.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      color: 'white',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <a href="/stringalgorithms" style={{
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
        ← Back to String Algorithms
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
            📝 String Algorithms Guide
          </h1>
          <p style={{ fontSize: '1.3rem', color: '#2d3748', maxWidth: '800px', margin: '0 auto', lineHeight: '1.7', fontWeight: '500' }}>
            Complete guide to string algorithms, their types, and applications
          </p>
        </div>

        {/* Definition Section */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '24px', color: '#ff9a9e', textAlign: 'center' }}>
            📚 Definition
          </h2>
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '20px',
            padding: '40px',
            border: '3px solid #ff9a9e',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', margin: 0, color: '#2d3748', fontWeight: '500', textAlign: 'center' }}>
              String algorithms are used to process, search, and analyze textual data efficiently. They are widely used in software development, bioinformatics, cybersecurity, and text processing.
            </p>
          </div>
        </section>

        {/* Algorithms Section */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '24px', color: '#ed8936', textAlign: 'center' }}>
            📖 String Algorithms
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
                  { name: 'Naive String', type: 'Brute Force', apps: 'Small text search, education' },
                  { name: 'KMP', type: 'Pattern Matching', apps: 'DNA sequence analysis, plagiarism detection, spam filtering' },
                  { name: 'Rabin-Karp', type: 'Hashing / Pattern', apps: 'Multi-pattern search, plagiarism detection, log scanning' }
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

export default StringLearnMore;
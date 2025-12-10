import React, { useState, useEffect } from 'react';

const RabinKarpVisualize = () => {
  const [text, setText] = useState('ABCCDDAEFG');
  const [pattern, setPattern] = useState('CDD');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [patternHash, setPatternHash] = useState(0);
  const [speed, setSpeed] = useState(1000);

  const runVisualization = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://algovista-flux.onrender.com/api/rabinkarp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, pattern })
      });
      const data = await response.json();
      
      if (data.steps) {
        setSteps(data.steps);
        setMatches(data.matches || []);
        setPatternHash(data.patternHash);
        setCurrentStep(0);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const playVisualization = () => {
    setIsPlaying(true);
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, speed);
  };

  const renderVisualization = () => {
    if (!steps.length) return null;
    
    const step = steps[currentStep];
    const textChars = text.split('');
    
    return (
      <div style={{ margin: '30px 0', fontFamily: 'monospace', fontSize: '18px' }}>
        {/* Hash Information */}
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#7c3aed15',
          borderRadius: '12px',
          border: '2px solid #7c3aed'
        }}>
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
            🧮 Hash Parameters: Base = 256, Modulus = 101
          </div>
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>
            Pattern "{pattern}" hash = {patternHash} | Current window "{step.windowText}" hash = {step.windowHash}
          </div>
        </div>

        {/* Text with indices */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{ marginBottom: '5px', fontSize: '14px', color: '#64748b' }}>
            <span style={{ marginRight: '45px' }}>Index:</span>
            {textChars.map((_, i) => (
              <span key={i} style={{ 
                display: 'inline-block', 
                width: '44px', 
                textAlign: 'center',
                fontWeight: i >= step.windowIndex && i < step.windowIndex + pattern.length ? '700' : '400',
                color: i >= step.windowIndex && i < step.windowIndex + pattern.length ? '#3b82f6' : '#64748b'
              }}>
                {i}
              </span>
            ))}
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <span style={{ color: '#94a3b8', marginRight: '10px', fontSize: '16px' }}>Text:</span>
            {textChars.map((char, i) => {
              let bgColor = '#374151';
              let textColor = '#9ca3af';
              let borderColor = 'transparent';
              
              // Current window highlighting
              if (i >= step.windowIndex && i < step.windowIndex + pattern.length) {
                if (step.hashMatch) {
                  if (step.actualMatch) {
                    bgColor = '#22c55e'; // green for actual match
                    textColor = 'white';
                    borderColor = '#16a34a';
                  } else if (step.isCollision) {
                    bgColor = '#f59e0b'; // orange for collision
                    textColor = 'white';
                    borderColor = '#d97706';
                  } else {
                    bgColor = '#3b82f6'; // blue for hash match
                    textColor = 'white';
                    borderColor = '#2563eb';
                  }
                } else {
                  bgColor = '#64748b'; // grey for current window
                  textColor = 'white';
                  borderColor = '#3b82f6';
                }
              }
              
              // Highlight all found matches
              if (matches.some(match => i >= match && i < match + pattern.length)) {
                bgColor = '#22c55e';
                textColor = 'white';
                borderColor = '#16a34a';
              }
              
              return (
                <span
                  key={i}
                  style={{
                    backgroundColor: bgColor,
                    color: textColor,
                    padding: '8px 12px',
                    margin: '2px',
                    borderRadius: '6px',
                    border: `2px solid ${borderColor}`,
                    display: 'inline-block',
                    width: '20px',
                    textAlign: 'center',
                    fontWeight: '600'
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        </div>
        
        {/* Pattern Display */}
        <div style={{ marginBottom: '15px' }}>
          <span style={{ color: '#94a3b8', marginRight: '10px', fontSize: '16px' }}>Pattern:</span>
          <span style={{ marginLeft: `${step.windowIndex * 44 + 4}px` }}>
            {pattern.split('').map((char, i) => (
              <span
                key={i}
                style={{
                  backgroundColor: '#7c3aed',
                  color: 'white',
                  padding: '8px 12px',
                  margin: '2px',
                  borderRadius: '6px',
                  border: '2px solid #7c3aed',
                  display: 'inline-block',
                  width: '20px',
                  textAlign: 'center',
                  fontWeight: '600'
                }}
              >
                {char}
              </span>
            ))}
          </span>
        </div>
        
        {/* Hash Comparison */}
        <div style={{ 
          marginTop: '20px', 
          padding: '20px', 
          backgroundColor: step.actualMatch ? '#22c55e15' : step.isCollision ? '#f59e0b15' : step.hashMatch ? '#3b82f615' : '#ef444415',
          borderRadius: '12px',
          border: `2px solid ${step.actualMatch ? '#22c55e' : step.isCollision ? '#f59e0b' : step.hashMatch ? '#3b82f6' : '#ef4444'}`
        }}>
          <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>
            Window {step.windowIndex}: "{step.windowText}"
          </div>
          
          <div style={{ fontSize: '16px', color: '#e2e8f0', marginBottom: '8px' }}>
            Hash Comparison: {step.windowHash} {step.hashMatch ? '==' : '!='} {step.patternHash}
            <span style={{ 
              marginLeft: '15px', 
              padding: '4px 8px', 
              borderRadius: '4px',
              backgroundColor: step.hashMatch ? '#22c55e' : '#ef4444',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {step.hashMatch ? '✓ HASH MATCH' : '✗ HASH MISMATCH'}
            </span>
          </div>
          
          {step.hashMatch && (
            <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
              Character Verification: {step.actualMatch ? '✅ Confirmed Match' : '❌ False Positive (Collision)'}
            </div>
          )}
          
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>
            Action: {step.action} | Status: {step.status}
          </div>
        </div>
        
        {/* Rolling Hash Formula */}
        <div style={{ 
          marginTop: '15px', 
          padding: '15px', 
          backgroundColor: '#1e293b',
          borderRadius: '8px',
          border: '1px solid #374151'
        }}>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '5px' }}>
            🔄 Rolling Hash Formula: hash = (d × (old_hash - T[i] × h) + T[i+m]) % q
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Where d=256 (base), h=d^(m-1) mod q, q=101 (prime modulus)
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      backgroundColor: '#0a0e1a',
      color: 'white',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <a href="/stringalgorithms" style={{
        background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '12px',
        textDecoration: 'none',
        fontWeight: '600'
      }}>
        ← Back to String Algorithms
      </a>

      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>
          🔍 Rabin-Karp Algorithm Visualizer
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>
          Hash-based pattern matching with rolling hash optimization
        </p>
        <div style={{ fontSize: '14px', color: '#64748b', marginTop: '10px' }}>
          <span style={{ backgroundColor: '#22c55e', padding: '2px 8px', borderRadius: '4px', marginRight: '10px' }}>🟢 Match</span>
          <span style={{ backgroundColor: '#f59e0b', padding: '2px 8px', borderRadius: '4px', marginRight: '10px' }}>🟠 Collision</span>
          <span style={{ backgroundColor: '#3b82f6', padding: '2px 8px', borderRadius: '4px', marginRight: '10px' }}>🔵 Hash Match</span>
          <span style={{ backgroundColor: '#64748b', padding: '2px 8px', borderRadius: '4px' }}>⚫ Current Window</span>
        </div>
      </div>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '30px'
      }}>
        {/* Input Controls */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '250px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Text:</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value.toUpperCase())}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #374151',
                backgroundColor: '#1e293b',
                color: 'white',
                fontSize: '16px'
              }}
            />
          </div>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Pattern:</label>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value.toUpperCase())}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #374151',
                backgroundColor: '#1e293b',
                color: 'white',
                fontSize: '16px'
              }}
            />
          </div>
          <div style={{ minWidth: '150px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Speed (ms):</label>
            <input
              type="range"
              min="300"
              max="2000"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ textAlign: 'center', fontSize: '14px', color: '#94a3b8' }}>{speed}ms</div>
          </div>
        </div>

        {/* Control Buttons */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <button
            onClick={runVisualization}
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Generating...' : 'Generate Steps'}
          </button>
          
          <button
            onClick={playVisualization}
            disabled={!steps.length || isPlaying}
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {isPlaying ? 'Playing...' : 'Play'}
          </button>
          
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={!steps.length || currentStep === 0}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Previous
          </button>
          
          <button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={!steps.length || currentStep >= steps.length - 1}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Next
          </button>
        </div>

        {/* Progress */}
        {steps.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>Matches found: {matches.length} at positions [{matches.join(', ')}]</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#374151',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
                height: '100%',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}

        {/* Visualization Area */}
        <div style={{
          background: '#1e293b',
          borderRadius: '12px',
          padding: '30px',
          minHeight: '400px'
        }}>
          {steps.length > 0 ? renderVisualization() : (
            <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '18px' }}>
              Enter text and pattern, then click "Generate Steps" to start visualization
            </div>
          )}
        </div>

        {/* Preset Examples */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(34, 197, 94, 0.1)',
          borderRadius: '12px',
          border: '2px solid #22c55e'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#22c55e' }}>Try These Examples:</h3>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <button
              onClick={() => { setText('ABCCDDAEFG'); setPattern('CDD'); }}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '2px solid #22c55e',
                backgroundColor: 'transparent',
                color: '#22c55e',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Simple Match
            </button>
            <button
              onClick={() => { setText('AABAACAADAABAABA'); setPattern('AABA'); }}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '2px solid #3b82f6',
                backgroundColor: 'transparent',
                color: '#3b82f6',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Multiple Matches
            </button>
            <button
              onClick={() => { setText('ABCDEFGHIJK'); setPattern('XYZ'); }}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '2px solid #f59e0b',
                backgroundColor: 'transparent',
                color: '#f59e0b',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              No Match
            </button>
            <button
              onClick={() => { setText('GEEKSFORGEEKS'); setPattern('GEEK'); }}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '2px solid #ef4444',
                backgroundColor: 'transparent',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Hash Collisions Demo
            </button>
          </div>
        </div>

        {/* Algorithm Info */}
        <div style={{
          marginTop: '20px',
          padding: '20px',
          background: 'rgba(124, 58, 237, 0.1)',
          borderRadius: '12px',
          border: '2px solid #7c3aed'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#7c3aed' }}>Rabin-Karp Algorithm Explanation:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4 style={{ color: '#a78bfa', marginBottom: '10px' }}>How it works:</h4>
              <ul style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '14px' }}>
                <li>🧮 Compute hash of pattern and text windows</li>
                <li>🔄 Use rolling hash for O(1) window updates</li>
                <li>⚡ Compare hashes first (fast)</li>
                <li>✅ Verify characters only on hash match</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#a78bfa', marginBottom: '10px' }}>Complexity:</h4>
              <ul style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '14px' }}>
                <li><strong>Average:</strong> O(n + m) linear</li>
                <li><strong>Worst:</strong> O(n × m) with many collisions</li>
                <li><strong>Space:</strong> O(1) constant</li>
                <li><strong>Best for:</strong> Large alphabets, good hash function</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RabinKarpVisualize;
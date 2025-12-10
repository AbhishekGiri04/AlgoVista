import React, { useState, useEffect } from 'react';

const KMPVisualize = () => {
  const [text, setText] = useState('ABABDABACDABABCABAB');
  const [pattern, setPattern] = useState('ABABCABAB');
  const [lpsSteps, setLpsSteps] = useState([]);
  const [searchSteps, setSearchSteps] = useState([]);
  const [lpsArray, setLpsArray] = useState([]);
  const [currentLpsStep, setCurrentLpsStep] = useState(0);
  const [currentSearchStep, setCurrentSearchStep] = useState(0);
  const [isPlayingLps, setIsPlayingLps] = useState(false);
  const [isPlayingSearch, setIsPlayingSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [speed, setSpeed] = useState(1000);
  const [phase, setPhase] = useState('lps'); // 'lps' or 'search'

  const runVisualization = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://algovista-flux.onrender.com/api/kmp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, pattern })
      });
      const data = await response.json();
      
      if (data.lpsSteps && data.searchSteps) {
        setLpsSteps(data.lpsSteps);
        setSearchSteps(data.searchSteps);
        setLpsArray(data.lps);
        setMatches(data.matches || []);
        setCurrentLpsStep(0);
        setCurrentSearchStep(0);
        setPhase('lps');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const playLpsVisualization = () => {
    setIsPlayingLps(true);
    const interval = setInterval(() => {
      setCurrentLpsStep(prev => {
        if (prev >= lpsSteps.length - 1) {
          setIsPlayingLps(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, speed);
  };

  const playSearchVisualization = () => {
    setIsPlayingSearch(true);
    const interval = setInterval(() => {
      setCurrentSearchStep(prev => {
        if (prev >= searchSteps.length - 1) {
          setIsPlayingSearch(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, speed);
  };

  const renderLpsVisualization = () => {
    if (!lpsSteps.length) return null;
    
    const step = lpsSteps[currentLpsStep];
    const patternChars = pattern.split('');
    
    return (
      <div style={{ margin: '30px 0', fontFamily: 'monospace', fontSize: '18px' }}>
        <h3 style={{ color: '#22c55e', marginBottom: '20px' }}>🔧 Step 1: Building LPS Array</h3>
        
        {/* Pattern with indices */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{ marginBottom: '5px', fontSize: '14px', color: '#64748b' }}>
            <span style={{ marginRight: '45px' }}>Index:</span>
            {patternChars.map((_, i) => (
              <span key={i} style={{ 
                display: 'inline-block', 
                width: '44px', 
                textAlign: 'center',
                fontWeight: i === step.i || (step.len > 0 && i === step.len - 1) ? '700' : '400',
                color: i === step.i || (step.len > 0 && i === step.len - 1) ? '#3b82f6' : '#64748b'
              }}>
                {i}
              </span>
            ))}
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <span style={{ color: '#94a3b8', marginRight: '10px', fontSize: '16px' }}>Pattern:</span>
            {patternChars.map((char, i) => {
              let bgColor = '#374151';
              let textColor = '#9ca3af';
              let borderColor = 'transparent';
              
              if (i === step.i) {
                bgColor = step.isMatch ? '#22c55e' : '#ef4444';
                textColor = 'white';
                borderColor = '#3b82f6';
              } else if (step.len > 0 && i === step.len - 1) {
                bgColor = '#7c3aed';
                textColor = 'white';
                borderColor = '#7c3aed';
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
        
        {/* LPS Array */}
        <div style={{ marginBottom: '15px' }}>
          <span style={{ color: '#94a3b8', marginRight: '10px', fontSize: '16px' }}>LPS:</span>
          {lpsArray.map((value, i) => {
            let bgColor = '#1e293b';
            let textColor = '#94a3b8';
            
            if (i <= step.i) {
              bgColor = '#22c55e';
              textColor = 'white';
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
                  border: '2px solid #22c55e',
                  display: 'inline-block',
                  width: '20px',
                  textAlign: 'center',
                  fontWeight: '600'
                }}
              >
                {i <= step.i ? (i === step.i ? step.lpsValue : lpsArray[i]) : '?'}
              </span>
            );
          })}
        </div>
        
        {/* Step Details */}
        <div style={{ 
          marginTop: '20px', 
          padding: '20px', 
          backgroundColor: step.isMatch ? '#22c55e15' : '#ef444415',
          borderRadius: '12px',
          border: `2px solid ${step.isMatch ? '#22c55e' : '#ef4444'}`
        }}>
          <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>
            LPS[{step.i}] = {step.lpsValue}
          </div>
          <div style={{ fontSize: '16px', color: '#e2e8f0', marginBottom: '8px' }}>
            Comparing: P[{step.i}] = '{step.currentChar}' with P[{step.len}] = '{step.compareChar}'
            <span style={{ 
              marginLeft: '15px', 
              padding: '4px 8px', 
              borderRadius: '4px',
              backgroundColor: step.isMatch ? '#22c55e' : '#ef4444',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {step.isMatch ? '✓ MATCH' : '✗ MISMATCH'}
            </span>
          </div>
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>
            {step.action}
          </div>
        </div>
      </div>
    );
  };

  const renderSearchVisualization = () => {
    if (!searchSteps.length) return null;
    
    const step = searchSteps[currentSearchStep];
    const textChars = text.split('');
    const patternChars = pattern.split('');
    
    return (
      <div style={{ margin: '30px 0', fontFamily: 'monospace', fontSize: '18px' }}>
        <h3 style={{ color: '#3b82f6', marginBottom: '20px' }}>🔍 Step 2: Pattern Searching</h3>
        
        {/* Text with indices */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{ marginBottom: '5px', fontSize: '14px', color: '#64748b' }}>
            <span style={{ marginRight: '45px' }}>Index:</span>
            {textChars.map((_, i) => (
              <span key={i} style={{ 
                display: 'inline-block', 
                width: '44px', 
                textAlign: 'center',
                fontWeight: i === step.textIndex ? '700' : '400',
                color: i === step.textIndex ? '#3b82f6' : '#64748b'
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
              
              if (i === step.textIndex) {
                bgColor = step.isMatch ? '#22c55e' : '#ef4444';
                textColor = 'white';
                borderColor = '#3b82f6';
              }
              
              // Highlight matches
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
        
        {/* Pattern aligned with text */}
        <div style={{ marginBottom: '15px' }}>
          <span style={{ color: '#94a3b8', marginRight: '10px', fontSize: '16px' }}>Pattern:</span>
          <span style={{ marginLeft: `${(step.textIndex - step.patternIndex) * 44 + 4}px` }}>
            {patternChars.map((char, i) => {
              let bgColor = '#64748b';
              let textColor = 'white';
              let borderColor = '#7c3aed';
              
              if (i === step.patternIndex) {
                bgColor = step.isMatch ? '#22c55e' : '#ef4444';
                borderColor = step.isMatch ? '#16a34a' : '#dc2626';
              } else if (i < step.patternIndex) {
                bgColor = '#22c55e';
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
          </span>
        </div>
        
        {/* LPS Array Reference */}
        <div style={{ marginBottom: '15px' }}>
          <span style={{ color: '#94a3b8', marginRight: '10px', fontSize: '16px' }}>LPS:</span>
          {lpsArray.map((value, i) => (
            <span
              key={i}
              style={{
                backgroundColor: '#1e293b',
                color: '#94a3b8',
                padding: '8px 12px',
                margin: '2px',
                borderRadius: '6px',
                border: '2px solid #22c55e',
                display: 'inline-block',
                width: '20px',
                textAlign: 'center',
                fontWeight: '600'
              }}
            >
              {value}
            </span>
          ))}
        </div>
        
        {/* Step Details */}
        <div style={{ 
          marginTop: '20px', 
          padding: '20px', 
          backgroundColor: step.foundMatch ? '#22c55e15' : step.isMatch ? '#3b82f615' : '#ef444415',
          borderRadius: '12px',
          border: `2px solid ${step.foundMatch ? '#22c55e' : step.isMatch ? '#3b82f6' : '#ef4444'}`
        }}>
          <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>
            {step.status}
          </div>
          <div style={{ fontSize: '16px', color: '#e2e8f0', marginBottom: '8px' }}>
            Text[{step.textIndex}] = '{step.textChar}' vs Pattern[{step.patternIndex}] = '{step.patternChar}'
            <span style={{ 
              marginLeft: '15px', 
              padding: '4px 8px', 
              borderRadius: '4px',
              backgroundColor: step.isMatch ? '#22c55e' : '#ef4444',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {step.isMatch ? '✓ MATCH' : '✗ MISMATCH'}
            </span>
          </div>
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>
            Action: {step.action}
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
          ⚡ KMP Algorithm Visualizer
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>
          Knuth-Morris-Pratt pattern matching with LPS preprocessing
        </p>
        <div style={{ fontSize: '14px', color: '#64748b', marginTop: '10px' }}>
          <span style={{ backgroundColor: '#22c55e', padding: '2px 8px', borderRadius: '4px', marginRight: '10px' }}>🟢 Match</span>
          <span style={{ backgroundColor: '#ef4444', padding: '2px 8px', borderRadius: '4px', marginRight: '10px' }}>🔴 Mismatch</span>
          <span style={{ backgroundColor: '#7c3aed', padding: '2px 8px', borderRadius: '4px' }}>🟣 LPS Reference</span>
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

        {/* Phase Toggle */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
          <button
            onClick={() => setPhase('lps')}
            style={{
              background: phase === 'lps' ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'transparent',
              color: phase === 'lps' ? 'white' : '#22c55e',
              border: '2px solid #22c55e',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🔧 LPS Building
          </button>
          <button
            onClick={() => setPhase('search')}
            style={{
              background: phase === 'search' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'transparent',
              color: phase === 'search' ? 'white' : '#3b82f6',
              border: '2px solid #3b82f6',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🔍 Pattern Search
          </button>
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
          
          {phase === 'lps' && (
            <>
              <button
                onClick={playLpsVisualization}
                disabled={!lpsSteps.length || isPlayingLps}
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
                {isPlayingLps ? 'Playing...' : 'Play LPS'}
              </button>
              
              <button
                onClick={() => setCurrentLpsStep(Math.max(0, currentLpsStep - 1))}
                disabled={!lpsSteps.length || currentLpsStep === 0}
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
                onClick={() => setCurrentLpsStep(Math.min(lpsSteps.length - 1, currentLpsStep + 1))}
                disabled={!lpsSteps.length || currentLpsStep >= lpsSteps.length - 1}
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
            </>
          )}
          
          {phase === 'search' && (
            <>
              <button
                onClick={playSearchVisualization}
                disabled={!searchSteps.length || isPlayingSearch}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {isPlayingSearch ? 'Playing...' : 'Play Search'}
              </button>
              
              <button
                onClick={() => setCurrentSearchStep(Math.max(0, currentSearchStep - 1))}
                disabled={!searchSteps.length || currentSearchStep === 0}
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
                onClick={() => setCurrentSearchStep(Math.min(searchSteps.length - 1, currentSearchStep + 1))}
                disabled={!searchSteps.length || currentSearchStep >= searchSteps.length - 1}
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
            </>
          )}
        </div>

        {/* Progress */}
        {((phase === 'lps' && lpsSteps.length > 0) || (phase === 'search' && searchSteps.length > 0)) && (
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>
                {phase === 'lps' ? `LPS Step ${currentLpsStep + 1} of ${lpsSteps.length}` : `Search Step ${currentSearchStep + 1} of ${searchSteps.length}`}
              </span>
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
                width: phase === 'lps' ? 
                  `${((currentLpsStep + 1) / lpsSteps.length) * 100}%` : 
                  `${((currentSearchStep + 1) / searchSteps.length) * 100}%`,
                height: '100%',
                background: phase === 'lps' ? 
                  'linear-gradient(135deg, #22c55e, #16a34a)' : 
                  'linear-gradient(135deg, #3b82f6, #2563eb)',
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
          {phase === 'lps' && lpsSteps.length > 0 ? renderLpsVisualization() : 
           phase === 'search' && searchSteps.length > 0 ? renderSearchVisualization() : (
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
              onClick={() => { setText('ABABDABACDABABCABAB'); setPattern('ABABCABAB'); }}
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
              Classic Example
            </button>
            <button
              onClick={() => { setText('AAACAAAA'); setPattern('AAAA'); }}
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
              Repetitive Pattern
            </button>
            <button
              onClick={() => { setText('ABCABCABCABC'); setPattern('ABCABC'); }}
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
              Multiple Matches
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
          <h3 style={{ marginBottom: '15px', color: '#7c3aed' }}>KMP Algorithm Explanation:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4 style={{ color: '#a78bfa', marginBottom: '10px' }}>LPS Array:</h4>
              <ul style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '14px' }}>
                <li>🔧 Longest Proper Prefix which is also Suffix</li>
                <li>📊 Preprocessed in O(m) time</li>
                <li>🔄 Helps skip redundant comparisons</li>
                <li>💡 Key to KMP's efficiency</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#a78bfa', marginBottom: '10px' }}>Complexity:</h4>
              <ul style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '14px' }}>
                <li><strong>Time:</strong> O(n + m) linear</li>
                <li><strong>Space:</strong> O(m) for LPS array</li>
                <li><strong>Advantage:</strong> No backtracking in text</li>
                <li><strong>Best for:</strong> Large texts, repetitive patterns</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KMPVisualize;
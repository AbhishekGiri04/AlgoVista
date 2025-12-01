import React, { useState, useEffect } from 'react';

const NaiveStringVisualize = () => {
  const [text, setText] = useState('ABABABAC');
  const [pattern, setPattern] = useState('ABA');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [speed, setSpeed] = useState(800);

  const runVisualization = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/naivestring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, pattern })
      });
      const data = await response.json();
      
      if (data.steps) {
        setSteps(data.steps);
        setMatches(data.matches || []);
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

  const resetVisualization = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const renderTextWithPattern = () => {
    if (!steps.length || currentStep >= steps.length) return null;
    
    const step = steps[currentStep];
    const textChars = text.split('');
    const patternChars = pattern.split('');
    
    return (
      <div style={{ margin: '30px 0', fontFamily: 'monospace', fontSize: '20px' }}>
        {/* Index Numbers */}
        <div style={{ marginBottom: '5px', fontSize: '14px', color: '#64748b' }}>
          <span style={{ marginRight: '45px' }}>Index:</span>
          {textChars.map((_, i) => (
            <span key={i} style={{ 
              display: 'inline-block', 
              width: '44px', 
              textAlign: 'center',
              fontWeight: i >= step.alignment && i < step.alignment + pattern.length ? '700' : '400',
              color: i >= step.alignment && i < step.alignment + pattern.length ? '#3b82f6' : '#64748b'
            }}>
              {i}
            </span>
          ))}
        </div>
        
        {/* Text Display */}
        <div style={{ marginBottom: '15px' }}>
          <span style={{ color: '#94a3b8', marginRight: '10px', fontSize: '16px' }}>Text:</span>
          {textChars.map((char, i) => {
            let bgColor = '#374151'; // grey for unused
            let textColor = '#9ca3af';
            let borderColor = 'transparent';
            
            // Current alignment window
            if (i >= step.alignment && i < step.alignment + pattern.length) {
              const patternIndex = i - step.alignment;
              borderColor = '#3b82f6';
              
              if (patternIndex < step.compareIndex) {
                // Already compared - show result
                bgColor = '#22c55e'; // green for previous matches
                textColor = 'white';
              } else if (patternIndex === step.compareIndex && !step.isComplete) {
                // Currently comparing
                bgColor = step.isMatch ? '#22c55e' : '#ef4444'; // green/red for current
                textColor = 'white';
              } else {
                // Not yet compared
                bgColor = '#64748b'; // grey for pending
                textColor = 'white';
              }
            }
            
            // Complete match highlighting
            if (step.isComplete && step.foundMatch && i >= step.alignment && i < step.alignment + pattern.length) {
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
        
        {/* Pattern Display with alignment */}
        <div style={{ marginBottom: '15px' }}>
          <span style={{ color: '#94a3b8', marginRight: '10px', fontSize: '16px' }}>Pattern:</span>
          <span style={{ marginLeft: `${step.alignment * 44 + 4}px` }}>
            {patternChars.map((char, i) => {
              let bgColor = '#64748b'; // grey default
              let textColor = 'white';
              let borderColor = '#7c3aed';
              
              if (i < step.compareIndex) {
                bgColor = '#22c55e'; // green for matched
              } else if (i === step.compareIndex && !step.isComplete) {
                bgColor = step.isMatch ? '#22c55e' : '#ef4444'; // current comparison
                borderColor = step.isMatch ? '#16a34a' : '#dc2626';
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
        
        {/* Comparison Details */}
        <div style={{ 
          marginTop: '20px', 
          padding: '20px', 
          backgroundColor: step.foundMatch ? '#22c55e15' : step.isComplete ? '#ef444415' : '#3b82f615',
          borderRadius: '12px',
          border: `2px solid ${step.foundMatch ? '#22c55e' : step.isComplete ? '#ef4444' : '#3b82f6'}`
        }}>
          <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>
            Alignment {step.alignment}: {step.status}
          </div>
          {!step.isComplete && (
            <div style={{ fontSize: '16px', color: '#e2e8f0', marginBottom: '8px' }}>
              Comparing: T[{step.alignment + step.compareIndex}] = '{step.textChar}' {step.isMatch ? '==' : '!='} P[{step.compareIndex}] = '{step.patternChar}'
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
          )}
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>
            {step.isComplete ? 
              (step.foundMatch ? `✅ Pattern found! Moving to next alignment.` : `❌ Mismatch found. Moving to alignment ${step.alignment + 1}.`) :
              `Comparing character ${step.compareIndex + 1} of ${pattern.length} in pattern.`
            }
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
          🔍 Naive Pattern Matching Visualizer
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>
          Step-by-step brute force pattern matching with color-coded comparisons
        </p>
        <div style={{ fontSize: '14px', color: '#64748b', marginTop: '10px' }}>
          <span style={{ backgroundColor: '#22c55e', padding: '2px 8px', borderRadius: '4px', marginRight: '10px' }}>🟢 Match</span>
          <span style={{ backgroundColor: '#ef4444', padding: '2px 8px', borderRadius: '4px', marginRight: '10px' }}>🔴 Mismatch</span>
          <span style={{ backgroundColor: '#64748b', padding: '2px 8px', borderRadius: '4px' }}>⚫ Unused/Pending</span>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '30px'
      }}>
        {/* Input Controls */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
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
              min="200"
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
            onClick={resetVisualization}
            disabled={!steps.length}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Reset
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
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
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
          minHeight: '300px'
        }}>
          {steps.length > 0 ? renderTextWithPattern() : (
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
              onClick={() => { setText('ABABABAC'); setPattern('ABA'); }}
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
              Best Case (Multiple Matches)
            </button>
            <button
              onClick={() => { setText('AAAAAAAAAB'); setPattern('AAAAAB'); }}
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
              Worst Case (Many Comparisons)
            </button>
            <button
              onClick={() => { setText('HELLO WORLD'); setPattern('WORLD'); }}
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
              Simple Example
            </button>
            <button
              onClick={() => { setText('ABCDEFGH'); setPattern('XYZ'); }}
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
          <h3 style={{ marginBottom: '15px', color: '#7c3aed' }}>Algorithm Explanation:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4 style={{ color: '#a78bfa', marginBottom: '10px' }}>How it works:</h4>
              <ul style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '14px' }}>
                <li>🔍 Compare pattern at every text position</li>
                <li>📍 Start from left, compare character by character</li>
                <li>❌ On mismatch, shift pattern right by 1</li>
                <li>✅ Continue until pattern fully matches</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#a78bfa', marginBottom: '10px' }}>Complexity:</h4>
              <ul style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '14px' }}>
                <li><strong>Time:</strong> O(n×m) worst case</li>
                <li><strong>Space:</strong> O(1) constant</li>
                <li><strong>Best:</strong> O(n) early match</li>
                <li><strong>Worst:</strong> Pattern like "AAAAAB" in "AAAA..."</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NaiveStringVisualize;
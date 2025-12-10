import React, { useState, useEffect } from 'react';

const LongestCommonSubsequenceVisualize = () => {
  const [stringX, setStringX] = useState('ABCBDAB');
  const [stringY, setStringY] = useState('BDCAB');
  const [steps, setSteps] = useState([]);
  const [dpTable, setDpTable] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lcsString, setLcsString] = useState('');
  const [lcsLength, setLcsLength] = useState(0);
  const [speed, setSpeed] = useState(800);

  const runVisualization = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://algovista-flux.onrender.com/api/lcs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stringX, stringY })
      });
      const data = await response.json();
      
      if (data.steps) {
        setSteps(data.steps);
        setDpTable(data.dpTable);
        setLcsString(data.lcsString);
        setLcsLength(data.lcsLength);
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

  const renderDPTable = () => {
    if (!dpTable.length || !steps.length) return null;
    
    const step = steps[currentStep];
    const m = stringX.length;
    const n = stringY.length;
    
    return (
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#3b82f6', marginBottom: '15px' }}>📊 DP Table</h3>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n + 2}, 1fr)`, gap: '2px', maxWidth: '600px' }}>
          {/* Header row */}
          <div style={{ padding: '8px', fontWeight: '600', textAlign: 'center' }}></div>
          <div style={{ padding: '8px', fontWeight: '600', textAlign: 'center', color: '#64748b' }}>ε</div>
          {stringY.split('').map((char, j) => (
            <div key={j} style={{ padding: '8px', fontWeight: '600', textAlign: 'center', color: '#3b82f6' }}>
              {char}
            </div>
          ))}
          
          {/* Table rows */}
          {dpTable.map((row, i) => (
            <React.Fragment key={i}>
              <div style={{ padding: '8px', fontWeight: '600', textAlign: 'center', color: i === 0 ? '#64748b' : '#22c55e' }}>
                {i === 0 ? 'ε' : stringX[i-1]}
              </div>
              {row.map((cell, j) => {
                const isCurrent = step.i === i && step.j === j;
                const isProcessed = (i * (n + 1) + j) <= (step.i * (n + 1) + step.j);
                
                return (
                  <div
                    key={j}
                    style={{
                      padding: '8px',
                      textAlign: 'center',
                      border: '2px solid',
                      borderColor: isCurrent ? '#3b82f6' : isProcessed ? '#22c55e' : '#374151',
                      borderRadius: '6px',
                      backgroundColor: isCurrent ? '#3b82f615' : isProcessed ? '#22c55e15' : '#1e293b',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    {cell}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderStringComparison = () => {
    if (!steps.length) return null;
    
    const step = steps[currentStep];
    
    return (
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#22c55e', marginBottom: '15px' }}>🔤 Character Comparison</h3>
        
        {/* String X */}
        <div style={{ marginBottom: '10px' }}>
          <span style={{ color: '#94a3b8', marginRight: '10px', fontSize: '16px' }}>X:</span>
          {stringX.split('').map((char, i) => {
            const isCurrent = step.i > 0 && i === step.i - 1;
            
            return (
              <span
                key={i}
                style={{
                  backgroundColor: isCurrent ? '#22c55e' : '#374151',
                  color: 'white',
                  padding: '8px 12px',
                  margin: '2px',
                  borderRadius: '6px',
                  border: isCurrent ? '2px solid #16a34a' : '2px solid transparent',
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
        
        {/* String Y */}
        <div style={{ marginBottom: '15px' }}>
          <span style={{ color: '#94a3b8', marginRight: '10px', fontSize: '16px' }}>Y:</span>
          {stringY.split('').map((char, j) => {
            const isCurrent = step.j > 0 && j === step.j - 1;
            
            return (
              <span
                key={j}
                style={{
                  backgroundColor: isCurrent ? '#3b82f6' : '#374151',
                  color: 'white',
                  padding: '8px 12px',
                  margin: '2px',
                  borderRadius: '6px',
                  border: isCurrent ? '2px solid #2563eb' : '2px solid transparent',
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
    );
  };

  const renderVisualization = () => {
    if (!steps.length) return null;
    
    const step = steps[currentStep];
    
    return (
      <div style={{ margin: '30px 0', fontFamily: 'monospace', fontSize: '16px' }}>
        {/* Current Step Info */}
        <div style={{ 
          marginBottom: '20px', 
          padding: '20px', 
          backgroundColor: step.isMatch ? '#22c55e15' : '#3b82f615',
          borderRadius: '12px',
          border: `2px solid ${step.isMatch ? '#22c55e' : '#3b82f6'}`
        }}>
          <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>
            DP[{step.i}][{step.j}] = {step.dpValue}
          </div>
          
          {step.i > 0 && step.j > 0 && (
            <div style={{ fontSize: '16px', color: '#e2e8f0', marginBottom: '8px' }}>
              Comparing: X[{step.i-1}] = '{step.charX}' with Y[{step.j-1}] = '{step.charY}'
              <span style={{ 
                marginLeft: '15px', 
                padding: '4px 8px', 
                borderRadius: '4px',
                backgroundColor: step.isMatch ? '#22c55e' : '#ef4444',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {step.isMatch ? '✓ MATCH' : '✗ NO MATCH'}
              </span>
            </div>
          )}
          
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>
            Action: {step.action}
          </div>
        </div>

        {/* String Comparison */}
        {renderStringComparison()}

        {/* DP Table */}
        {renderDPTable()}

        {/* Recurrence Formula */}
        <div style={{ 
          marginTop: '15px', 
          padding: '15px', 
          backgroundColor: '#1e293b',
          borderRadius: '8px',
          border: '1px solid #374151'
        }}>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '5px' }}>
            🧮 Recurrence: If X[i-1] == Y[j-1] → DP[i][j] = 1 + DP[i-1][j-1]
          </div>
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>
            Else → DP[i][j] = max(DP[i-1][j], DP[i][j-1])
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
      <a href="/dynamicprogramming" style={{
        background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '12px',
        textDecoration: 'none',
        fontWeight: '600'
      }}>
        ← Back to Dynamic Programming
      </a>

      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>
          🧬 LCS Visualizer
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>
          Longest Common Subsequence using Dynamic Programming
        </p>
        <div style={{ fontSize: '14px', color: '#64748b', marginTop: '10px' }}>
          <span style={{ backgroundColor: '#22c55e', padding: '2px 8px', borderRadius: '4px', marginRight: '10px' }}>🟢 Match</span>
          <span style={{ backgroundColor: '#3b82f6', padding: '2px 8px', borderRadius: '4px', marginRight: '10px' }}>🔵 Current</span>
          <span style={{ backgroundColor: '#374151', padding: '2px 8px', borderRadius: '4px' }}>⚫ Processed</span>
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
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>String X:</label>
            <input
              type="text"
              value={stringX}
              onChange={(e) => setStringX(e.target.value.toUpperCase())}
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
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>String Y:</label>
            <input
              type="text"
              value={stringY}
              onChange={(e) => setStringY(e.target.value.toUpperCase())}
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
            {loading ? 'Computing...' : 'Compute LCS'}
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

        {/* Result Summary */}
        {lcsString && (
          <div style={{ 
            marginBottom: '30px', 
            padding: '20px', 
            backgroundColor: '#22c55e15',
            borderRadius: '12px',
            border: '2px solid #22c55e'
          }}>
            <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: '#22c55e' }}>
              🏆 LCS Found!
            </div>
            <div style={{ fontSize: '16px', marginBottom: '8px' }}>
              Longest Common Subsequence: "{lcsString}"
            </div>
            <div style={{ fontSize: '16px', color: '#94a3b8' }}>
              Length: {lcsLength}
            </div>
          </div>
        )}

        {/* Progress */}
        {steps.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>Filling DP table...</span>
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
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
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
              Enter two strings and click "Compute LCS" to start visualization
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
              onClick={() => { setStringX('ABCBDAB'); setStringY('BDCAB'); }}
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
              onClick={() => { setStringX('AGGTAB'); setStringY('GXTXAYB'); }}
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
              Complex Case
            </button>
            <button
              onClick={() => { setStringX('ABCD'); setStringY('ACBDX'); }}
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
              Simple Case
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
          <h3 style={{ marginBottom: '15px', color: '#7c3aed' }}>LCS Algorithm Explanation:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4 style={{ color: '#a78bfa', marginBottom: '10px' }}>Dynamic Programming:</h4>
              <ul style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '14px' }}>
                <li>🎯 DP[i][j] = LCS length of X[0..i-1] and Y[0..j-1]</li>
                <li>✅ If chars match: DP[i][j] = 1 + DP[i-1][j-1]</li>
                <li>❌ If no match: DP[i][j] = max(DP[i-1][j], DP[i][j-1])</li>
                <li>🔄 Build table bottom-up</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#a78bfa', marginBottom: '10px' }}>Complexity:</h4>
              <ul style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '14px' }}>
                <li><strong>Time:</strong> O(m × n)</li>
                <li><strong>Space:</strong> O(m × n)</li>
                <li><strong>Applications:</strong> DNA analysis, diff tools</li>
                <li><strong>Optimal:</strong> Guarantees longest subsequence</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LongestCommonSubsequenceVisualize;
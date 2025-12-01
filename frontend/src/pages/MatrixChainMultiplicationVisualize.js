import React, { useState, useEffect } from 'react';

const MatrixChainMultiplicationVisualize = () => {
  const [dimensions, setDimensions] = useState([10, 30, 5, 60]);
  const [matrices, setMatrices] = useState([]);
  const [steps, setSteps] = useState([]);
  const [dpTable, setDpTable] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [minCost, setMinCost] = useState(0);
  const [optimalParens, setOptimalParens] = useState('');
  const [speed, setSpeed] = useState(1000);

  const runVisualization = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/matrixchain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dimensions })
      });
      const data = await response.json();
      
      if (data.steps) {
        setMatrices(data.matrices);
        setSteps(data.steps);
        setDpTable(data.dpTable);
        setMinCost(data.minCost);
        setOptimalParens(data.optimalParenthesization);
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

  const addMatrix = () => {
    setDimensions([...dimensions, 10]);
  };

  const removeMatrix = () => {
    if (dimensions.length > 3) {
      setDimensions(dimensions.slice(0, -1));
    }
  };

  const updateDimension = (index, value) => {
    const newDimensions = [...dimensions];
    newDimensions[index] = parseInt(value) || 1;
    setDimensions(newDimensions);
  };

  const renderMatricesInput = () => (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ color: '#3b82f6', marginBottom: '15px' }}>📐 Matrix Dimensions</h3>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        {dimensions.slice(0, -1).map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ color: '#22c55e', fontWeight: '600' }}>M{i+1}:</span>
            <input
              type="number"
              value={dimensions[i]}
              onChange={(e) => updateDimension(i, e.target.value)}
              style={{
                width: '50px',
                padding: '4px',
                borderRadius: '4px',
                border: '1px solid #374151',
                backgroundColor: '#1e293b',
                color: 'white',
                textAlign: 'center'
              }}
            />
            <span style={{ color: '#94a3b8' }}>×</span>
            <input
              type="number"
              value={dimensions[i+1]}
              onChange={(e) => updateDimension(i+1, e.target.value)}
              style={{
                width: '50px',
                padding: '4px',
                borderRadius: '4px',
                border: '1px solid #374151',
                backgroundColor: '#1e293b',
                color: 'white',
                textAlign: 'center'
              }}
            />
          </div>
        ))}
        
        <button
          onClick={addMatrix}
          disabled={dimensions.length >= 6}
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid #22c55e',
            backgroundColor: 'transparent',
            color: '#22c55e',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          + Matrix
        </button>
        
        <button
          onClick={removeMatrix}
          disabled={dimensions.length <= 3}
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid #ef4444',
            backgroundColor: 'transparent',
            color: '#ef4444',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          - Matrix
        </button>
      </div>
    </div>
  );

  const renderDPTable = () => {
    if (!dpTable.length || !steps.length) return null;
    
    const step = steps[currentStep];
    const n = matrices.length;
    
    return (
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#7c3aed', marginBottom: '15px' }}>📊 DP Table</h3>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n + 1}, 1fr)`, gap: '2px', maxWidth: '500px' }}>
          {/* Header */}
          <div style={{ padding: '8px', fontWeight: '600', textAlign: 'center' }}></div>
          {matrices.map((matrix, j) => (
            <div key={j} style={{ padding: '8px', fontWeight: '600', textAlign: 'center', color: '#3b82f6' }}>
              {matrix.name}
            </div>
          ))}
          
          {/* Table rows */}
          {dpTable.map((row, i) => (
            <React.Fragment key={i}>
              <div style={{ padding: '8px', fontWeight: '600', textAlign: 'center', color: '#22c55e' }}>
                {matrices[i].name}
              </div>
              {row.map((cell, j) => {
                const isCurrent = step.i === i && step.j === j;
                const isProcessed = i <= j && (i < step.i || (i === step.i && j <= step.j));
                
                return (
                  <div
                    key={j}
                    style={{
                      padding: '8px',
                      textAlign: 'center',
                      border: '2px solid',
                      borderColor: isCurrent ? '#7c3aed' : isProcessed ? '#22c55e' : '#374151',
                      borderRadius: '6px',
                      backgroundColor: isCurrent ? '#7c3aed15' : isProcessed ? '#22c55e15' : '#1e293b',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '12px'
                    }}
                  >
                    {i <= j ? cell : '-'}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
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
          backgroundColor: '#7c3aed15',
          borderRadius: '12px',
          border: '2px solid #7c3aed'
        }}>
          <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>
            Computing DP[{step.i}][{step.j}] - Chain Length {step.chainLength}
          </div>
          
          <div style={{ fontSize: '16px', color: '#e2e8f0', marginBottom: '8px' }}>
            Subchain: {matrices[step.i].name} to {matrices[step.j].name}
          </div>
          
          <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
            {step.action}
          </div>
          
          <div style={{ fontSize: '16px', fontWeight: '600' }}>
            Cost: {step.cost} | Current Min: {step.minCost}
          </div>
        </div>

        {/* Matrix Chain Visualization */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#22c55e', marginBottom: '10px' }}>🔗 Matrix Chain</h4>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {matrices.map((matrix, i) => {
              const isInRange = i >= step.i && i <= step.j;
              const isSplit = i === step.k;
              
              return (
                <React.Fragment key={i}>
                  <div
                    style={{
                      padding: '10px 15px',
                      borderRadius: '8px',
                      backgroundColor: isInRange ? (isSplit ? '#f59e0b' : '#22c55e') : '#374151',
                      color: 'white',
                      fontWeight: '600',
                      border: isInRange ? '2px solid #16a34a' : '2px solid transparent'
                    }}
                  >
                    {matrix.name}<br/>
                    <span style={{ fontSize: '12px' }}>{matrix.rows}×{matrix.cols}</span>
                  </div>
                  {i < matrices.length - 1 && (
                    <span style={{ color: '#94a3b8', fontSize: '20px' }}>×</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          
          {step.k !== undefined && (
            <div style={{ marginTop: '10px', fontSize: '14px', color: '#94a3b8' }}>
              Split at k={step.k}: ({matrices[step.i].name}...{matrices[step.k].name}) × ({matrices[step.k+1].name}...{matrices[step.j].name})
            </div>
          )}
        </div>

        {/* DP Table */}
        {renderDPTable()}

        {/* Algorithm Formula */}
        <div style={{ 
          marginTop: '15px', 
          padding: '15px', 
          backgroundColor: '#1e293b',
          borderRadius: '8px',
          border: '1px solid #374151'
        }}>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '5px' }}>
            🧮 Formula: DP[i][j] = min(DP[i][k] + DP[k+1][j] + p[i] × p[k+1] × p[j+1])
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Where p[i] × p[k+1] × p[j+1] is the cost of multiplying two resulting matrices
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
          🔗 Matrix Chain Multiplication
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>
          Find optimal parenthesization to minimize scalar multiplications
        </p>
        <div style={{ fontSize: '14px', color: '#64748b', marginTop: '10px' }}>
          <span style={{ backgroundColor: '#22c55e', padding: '2px 8px', borderRadius: '4px', marginRight: '10px' }}>🟢 In Range</span>
          <span style={{ backgroundColor: '#f59e0b', padding: '2px 8px', borderRadius: '4px', marginRight: '10px' }}>🟠 Split Point</span>
          <span style={{ backgroundColor: '#7c3aed', padding: '2px 8px', borderRadius: '4px' }}>🟣 Current</span>
        </div>
      </div>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '30px'
      }}>
        {/* Matrix Input */}
        {renderMatricesInput()}

        {/* Speed Control */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Speed (ms):</label>
          <input
            type="range"
            min="500"
            max="3000"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            style={{ width: '200px' }}
          />
          <span style={{ marginLeft: '10px', fontSize: '14px', color: '#94a3b8' }}>{speed}ms</span>
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
            {loading ? 'Computing...' : 'Find Optimal Order'}
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
        {optimalParens && (
          <div style={{ 
            marginBottom: '30px', 
            padding: '20px', 
            backgroundColor: '#22c55e15',
            borderRadius: '12px',
            border: '2px solid #22c55e'
          }}>
            <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: '#22c55e' }}>
              🏆 Optimal Solution Found!
            </div>
            <div style={{ fontSize: '16px', marginBottom: '8px' }}>
              Optimal Parenthesization: {optimalParens}
            </div>
            <div style={{ fontSize: '16px', color: '#94a3b8' }}>
              Minimum Scalar Multiplications: {minCost.toLocaleString()}
            </div>
          </div>
        )}

        {/* Progress */}
        {steps.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>Computing optimal splits...</span>
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
                background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
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
              Set matrix dimensions and click "Find Optimal Order" to start visualization
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
              onClick={() => setDimensions([10, 30, 5, 60])}
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
              Classic (3 matrices)
            </button>
            <button
              onClick={() => setDimensions([1, 2, 3, 4, 5])}
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
              Sequential (4 matrices)
            </button>
            <button
              onClick={() => setDimensions([40, 20, 30, 10, 30])}
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
              Complex (4 matrices)
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
          <h3 style={{ marginBottom: '15px', color: '#7c3aed' }}>Matrix Chain Multiplication:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4 style={{ color: '#a78bfa', marginBottom: '10px' }}>Problem:</h4>
              <ul style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '14px' }}>
                <li>🔗 Find optimal way to parenthesize matrix chain</li>
                <li>⚡ Minimize total scalar multiplications</li>
                <li>🎯 Different orders give different costs</li>
                <li>📊 Use DP to find optimal split points</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#a78bfa', marginBottom: '10px' }}>Complexity:</h4>
              <ul style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '14px' }}>
                <li><strong>Time:</strong> O(n³)</li>
                <li><strong>Space:</strong> O(n²)</li>
                <li><strong>Applications:</strong> Graphics, scientific computing</li>
                <li><strong>Optimal:</strong> Guarantees minimum cost</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatrixChainMultiplicationVisualize;
import React, { useState, useEffect } from 'react';

const TravellingSalesmanProblemVisualize = () => {
  const [distanceMatrix, setDistanceMatrix] = useState([
    [0, 10, 15, 20],
    [10, 0, 35, 25],
    [15, 35, 0, 30],
    [20, 25, 30, 0]
  ]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [minCost, setMinCost] = useState(0);
  const [bestPath, setBestPath] = useState([]);
  const [speed, setSpeed] = useState(1000);
  const [n, setN] = useState(4);

  const runVisualization = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://algovista-flux.onrender.com/api/tsp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ distanceMatrix })
      });
      const data = await response.json();
      
      if (data.steps) {
        setSteps(data.steps.reverse()); // Reverse to show forward progression
        setMinCost(data.minCost);
        setBestPath(data.bestPath);
        setN(data.n);
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

  const updateMatrixSize = (newSize) => {
    const newMatrix = Array(newSize).fill().map(() => Array(newSize).fill(0));
    
    // Copy existing values
    for (let i = 0; i < Math.min(newSize, distanceMatrix.length); i++) {
      for (let j = 0; j < Math.min(newSize, distanceMatrix[0].length); j++) {
        newMatrix[i][j] = distanceMatrix[i][j];
      }
    }
    
    // Fill new positions with random values
    for (let i = 0; i < newSize; i++) {
      for (let j = 0; j < newSize; j++) {
        if (i !== j && newMatrix[i][j] === 0) {
          const randomDist = Math.floor(Math.random() * 50) + 10;
          newMatrix[i][j] = randomDist;
          newMatrix[j][i] = randomDist; // Symmetric
        }
      }
    }
    
    setDistanceMatrix(newMatrix);
    setN(newSize);
  };

  const renderDistanceMatrix = () => (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ color: '#3b82f6', marginBottom: '15px' }}>📊 Distance Matrix</h3>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n + 1}, 1fr)`, gap: '2px', maxWidth: '400px' }}>
        <div style={{ padding: '8px', fontWeight: '600', textAlign: 'center' }}></div>
        {Array.from({ length: n }, (_, i) => (
          <div key={i} style={{ padding: '8px', fontWeight: '600', textAlign: 'center', color: '#3b82f6' }}>
            {String.fromCharCode(65 + i)}
          </div>
        ))}
        
        {distanceMatrix.map((row, i) => (
          <React.Fragment key={i}>
            <div style={{ padding: '8px', fontWeight: '600', textAlign: 'center', color: '#3b82f6' }}>
              {String.fromCharCode(65 + i)}
            </div>
            {row.map((cell, j) => (
              <input
                key={j}
                type="number"
                value={cell}
                onChange={(e) => {
                  const newMatrix = [...distanceMatrix];
                  const value = parseInt(e.target.value) || 0;
                  newMatrix[i][j] = value;
                  if (i !== j) newMatrix[j][i] = value; // Keep symmetric
                  setDistanceMatrix(newMatrix);
                }}
                style={{
                  padding: '6px',
                  textAlign: 'center',
                  border: '1px solid #374151',
                  borderRadius: '4px',
                  backgroundColor: i === j ? '#374151' : '#1e293b',
                  color: 'white',
                  fontSize: '12px',
                  width: '50px'
                }}
                disabled={i === j}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderVisualization = () => {
    if (!steps.length) return null;
    
    const step = steps[currentStep];
    
    return (
      <div style={{ margin: '30px 0', fontFamily: 'monospace', fontSize: '16px' }}>
        {/* Bitmask Visualization */}
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#7c3aed15',
          borderRadius: '12px',
          border: '2px solid #7c3aed'
        }}>
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
            🎯 DP State: mask = {step.mask} (binary: {step.maskBinary})
          </div>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
            Current city: {String.fromCharCode(65 + step.currentCity)} | Cost: {step.cost}
          </div>
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>
            Visited cities: {step.maskBinary.split('').map((bit, i) => 
              bit === '1' ? String.fromCharCode(65 + (n - 1 - i)) : ''
            ).filter(Boolean).join(', ')}
          </div>
        </div>

        {/* Cities Visualization */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            {Array.from({ length: n }, (_, i) => {
              const isVisited = (step.mask >> i) & 1;
              const isCurrent = i === step.currentCity;
              
              return (
                <div
                  key={i}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: '700',
                    backgroundColor: isCurrent ? '#22c55e' : isVisited ? '#3b82f6' : '#64748b',
                    color: 'white',
                    border: isCurrent ? '3px solid #16a34a' : '2px solid transparent'
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              );
            })}
          </div>
          
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>
            🟢 Current | 🔵 Visited | ⚫ Unvisited
          </div>
        </div>

        {/* Path Visualization */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>
            🛣️ Current Path: {step.path.map(city => String.fromCharCode(65 + city)).join(' → ')}
          </div>
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>
            Path cost calculation: {step.path.slice(0, -1).map((city, i) => {
              if (i === step.path.length - 2) return '';
              const nextCity = step.path[i + 1];
              return `${String.fromCharCode(65 + city)}→${String.fromCharCode(65 + nextCity)}(${distanceMatrix[city][nextCity]})`;
            }).filter(Boolean).join(' + ')}
          </div>
        </div>

        {/* Step Details */}
        <div style={{ 
          marginTop: '20px', 
          padding: '20px', 
          backgroundColor: step.isComplete ? '#22c55e15' : '#3b82f615',
          borderRadius: '12px',
          border: `2px solid ${step.isComplete ? '#22c55e' : '#3b82f6'}`
        }}>
          <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>
            {step.action}
          </div>
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>
            {step.isComplete ? 
              `✅ Complete tour found with cost ${step.cost}` :
              `🔄 Exploring subproblems from city ${String.fromCharCode(65 + step.currentCity)}`
            }
          </div>
        </div>

        {/* DP Formula */}
        <div style={{ 
          marginTop: '15px', 
          padding: '15px', 
          backgroundColor: '#1e293b',
          borderRadius: '8px',
          border: '1px solid #374151'
        }}>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '5px' }}>
            🧮 DP Formula: DP[mask][i] = min(DP[mask^(1&lt;&lt;i)][j] + dist[j][i])
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Where mask represents visited cities, i is current city
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
      <a href="/branchandbound" style={{
        background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '12px',
        textDecoration: 'none',
        fontWeight: '600'
      }}>
        ← Back to Branch & Bound
      </a>

      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>
          🧭 TSP Visualizer (DP + Bitmask)
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>
          Travelling Salesman Problem using Dynamic Programming with Bitmasking
        </p>
        <div style={{ fontSize: '14px', color: '#64748b', marginTop: '10px' }}>
          <span style={{ backgroundColor: '#22c55e', padding: '2px 8px', borderRadius: '4px', marginRight: '10px' }}>🟢 Current</span>
          <span style={{ backgroundColor: '#3b82f6', padding: '2px 8px', borderRadius: '4px', marginRight: '10px' }}>🔵 Visited</span>
          <span style={{ backgroundColor: '#64748b', padding: '2px 8px', borderRadius: '4px' }}>⚫ Unvisited</span>
        </div>
      </div>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '30px'
      }}>
        {/* Controls */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Cities:</label>
            <select
              value={n}
              onChange={(e) => updateMatrixSize(parseInt(e.target.value))}
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: '2px solid #374151',
                backgroundColor: '#1e293b',
                color: 'white'
              }}
            >
              <option value={3}>3 Cities</option>
              <option value={4}>4 Cities</option>
              <option value={5}>5 Cities</option>
            </select>
          </div>
          
          <div style={{ minWidth: '150px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Speed (ms):</label>
            <input
              type="range"
              min="500"
              max="3000"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ textAlign: 'center', fontSize: '14px', color: '#94a3b8' }}>{speed}ms</div>
          </div>
        </div>

        {/* Distance Matrix */}
        {renderDistanceMatrix()}

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
            {loading ? 'Solving...' : 'Solve TSP'}
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
        {bestPath.length > 0 && (
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
              Best Path: {bestPath.map(city => String.fromCharCode(65 + city)).join(' → ')}
            </div>
            <div style={{ fontSize: '16px', color: '#94a3b8' }}>
              Minimum Cost: {minCost}
            </div>
          </div>
        )}

        {/* Progress */}
        {steps.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>Exploring DP states...</span>
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
              Set up your distance matrix and click "Solve TSP" to start visualization
            </div>
          )}
        </div>

        {/* Algorithm Info */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(124, 58, 237, 0.1)',
          borderRadius: '12px',
          border: '2px solid #7c3aed'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#7c3aed' }}>TSP Algorithm Explanation:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4 style={{ color: '#a78bfa', marginBottom: '10px' }}>Dynamic Programming:</h4>
              <ul style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '14px' }}>
                <li>🎯 DP[mask][i] = min cost to visit cities in mask, end at i</li>
                <li>🔢 Bitmask represents visited cities (1=visited, 0=not)</li>
                <li>🔄 Try all unvisited cities from current position</li>
                <li>📊 Memoization avoids recomputing subproblems</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#a78bfa', marginBottom: '10px' }}>Complexity:</h4>
              <ul style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '14px' }}>
                <li><strong>Time:</strong> O(n² × 2ⁿ)</li>
                <li><strong>Space:</strong> O(n × 2ⁿ)</li>
                <li><strong>Practical for:</strong> n ≤ 20 cities</li>
                <li><strong>Optimal:</strong> Guarantees shortest tour</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravellingSalesmanProblemVisualize;
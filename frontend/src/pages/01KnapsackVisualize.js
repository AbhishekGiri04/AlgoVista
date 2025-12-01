import React, { useState, useEffect } from 'react';

const ZeroOneKnapsackVisualize = () => {
  const [items, setItems] = useState([
    { value: 60, weight: 10 },
    { value: 100, weight: 20 },
    { value: 120, weight: 30 }
  ]);
  const [capacity, setCapacity] = useState(50);
  const [steps, setSteps] = useState([]);
  const [dpTable, setDpTable] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [maxValue, setMaxValue] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [speed, setSpeed] = useState(600);

  const runVisualization = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/knapsack01', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, capacity })
      });
      const data = await response.json();
      
      if (data.steps) {
        setSteps(data.steps);
        setDpTable(data.dpTable);
        setMaxValue(data.maxValue);
        setTotalWeight(data.totalWeight);
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

  const addItem = () => {
    setItems([...items, { value: 50, weight: 10 }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = parseInt(value) || 0;
    setItems(newItems);
  };

  const renderItemsInput = () => (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ color: '#3b82f6', marginBottom: '15px' }}>🎒 Items Configuration</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '80px 80px 80px 60px', gap: '10px', marginBottom: '15px' }}>
        <div style={{ fontWeight: '600', color: '#94a3b8' }}>Item</div>
        <div style={{ fontWeight: '600', color: '#94a3b8' }}>Value</div>
        <div style={{ fontWeight: '600', color: '#94a3b8' }}>Weight</div>
        <div style={{ fontWeight: '600', color: '#94a3b8' }}>Action</div>
        
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <div style={{ 
              padding: '8px', 
              textAlign: 'center', 
              backgroundColor: '#22c55e', 
              color: 'white', 
              borderRadius: '4px',
              fontWeight: '600'
            }}>
              {index + 1}
            </div>
            <input
              type="number"
              value={item.value}
              onChange={(e) => updateItem(index, 'value', e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: '2px solid #374151',
                backgroundColor: '#1e293b',
                color: 'white',
                textAlign: 'center'
              }}
            />
            <input
              type="number"
              value={item.weight}
              onChange={(e) => updateItem(index, 'weight', e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: '2px solid #374151',
                backgroundColor: '#1e293b',
                color: 'white',
                textAlign: 'center'
              }}
            />
            <button
              onClick={() => removeItem(index)}
              disabled={items.length <= 1}
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: items.length > 1 ? '#ef4444' : '#64748b',
                color: 'white',
                cursor: items.length > 1 ? 'pointer' : 'not-allowed'
              }}
            >
              ✕
            </button>
          </React.Fragment>
        ))}
      </div>
      
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <button
          onClick={addItem}
          disabled={items.length >= 6}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '2px solid #22c55e',
            backgroundColor: 'transparent',
            color: '#22c55e',
            cursor: 'pointer'
          }}
        >
          + Add Item
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontWeight: '600' }}>Capacity:</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(parseInt(e.target.value) || 1)}
            style={{
              width: '80px',
              padding: '8px',
              borderRadius: '6px',
              border: '2px solid #374151',
              backgroundColor: '#1e293b',
              color: 'white',
              textAlign: 'center'
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderDPTable = () => {
    if (!dpTable.length || !steps.length) return null;
    
    const step = steps[currentStep];
    const n = items.length;
    
    return (
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#7c3aed', marginBottom: '15px' }}>📊 DP Table</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${Math.min(capacity + 2, 12)}, 1fr)`, 
          gap: '2px', 
          maxWidth: '800px',
          fontSize: '12px'
        }}>
          {/* Header */}
          <div style={{ padding: '6px', fontWeight: '600', textAlign: 'center' }}>i\\w</div>
          {Array.from({ length: Math.min(capacity + 1, 11) }, (_, w) => (
            <div key={w} style={{ padding: '6px', fontWeight: '600', textAlign: 'center', color: '#3b82f6' }}>
              {w}
            </div>
          ))}
          
          {/* Table rows */}
          {dpTable.slice(0, n + 1).map((row, i) => (
            <React.Fragment key={i}>
              <div style={{ padding: '6px', fontWeight: '600', textAlign: 'center', color: '#22c55e' }}>
                {i}
              </div>
              {row.slice(0, Math.min(capacity + 1, 11)).map((cell, w) => {
                const isCurrent = step.i === i && step.w === w;
                const isProcessed = (i < step.i) || (i === step.i && w <= step.w);
                
                return (
                  <div
                    key={w}
                    style={{
                      padding: '6px',
                      textAlign: 'center',
                      border: '2px solid',
                      borderColor: isCurrent ? '#7c3aed' : isProcessed ? '#22c55e' : '#374151',
                      borderRadius: '4px',
                      backgroundColor: isCurrent ? '#7c3aed15' : isProcessed ? '#22c55e15' : '#1e293b',
                      color: 'white',
                      fontWeight: '600'
                    }}
                  >
                    {cell}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        {capacity > 10 && (
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '5px' }}>
            Showing first 11 columns (0-10). Full table has {capacity + 1} columns.
          </div>
        )}
      </div>
    );
  };

  const renderKnapsackVisualization = () => {
    if (!steps.length) return null;
    
    const step = steps[currentStep];
    const selectedItems = items.filter((_, i) => 
      steps.some(s => s.i === i + 1 && s.decision === 'Take item')
    );
    
    return (
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#22c55e', marginBottom: '15px' }}>🎒 Knapsack Contents</h3>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          {items.map((item, i) => {
            const isCurrentItem = step.i === i + 1;
            const isSelected = items.find((_, idx) => idx === i)?.selected;
            
            return (
              <div
                key={i}
                style={{
                  padding: '15px',
                  borderRadius: '12px',
                  backgroundColor: isCurrentItem ? '#7c3aed' : isSelected ? '#22c55e' : '#374151',
                  color: 'white',
                  fontWeight: '600',
                  border: isCurrentItem ? '3px solid #a78bfa' : '2px solid transparent',
                  minWidth: '80px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '16px' }}>Item {i + 1}</div>
                <div style={{ fontSize: '12px', marginTop: '5px' }}>
                  V: {item.value}<br/>W: {item.weight}
                </div>
              </div>
            );
          })}
          
          <div style={{ 
            padding: '15px', 
            borderRadius: '12px', 
            backgroundColor: '#1e293b',
            border: '2px dashed #64748b',
            minWidth: '100px',
            textAlign: 'center',
            color: '#94a3b8'
          }}>
            <div style={{ fontSize: '16px' }}>Capacity</div>
            <div style={{ fontSize: '14px', marginTop: '5px' }}>
              {totalWeight}/{capacity}
            </div>
          </div>
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
          backgroundColor: step.canTake ? '#3b82f615' : '#ef444415',
          borderRadius: '12px',
          border: `2px solid ${step.canTake ? '#3b82f6' : '#ef4444'}`
        }}>
          <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>
            DP[{step.i}][{step.w}] = {step.dpValue}
          </div>
          
          <div style={{ fontSize: '16px', color: '#e2e8f0', marginBottom: '8px' }}>
            Item {step.i}: Value = {step.itemValue}, Weight = {step.itemWeight}
          </div>
          
          {step.canTake ? (
            <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
              Take: {step.takeValue} vs Skip: {step.skipValue}
            </div>
          ) : (
            <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
              Item too heavy for current capacity {step.w}
            </div>
          )}
          
          <div style={{ fontSize: '16px', fontWeight: '600' }}>
            Decision: {step.decision}
          </div>
        </div>

        {/* Knapsack Visualization */}
        {renderKnapsackVisualization()}

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
            🧮 Recurrence: If weight[i-1] ≤ w → DP[i][w] = max(value[i-1] + DP[i-1][w-weight[i-1]], DP[i-1][w])
          </div>
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>
            Else → DP[i][w] = DP[i-1][w]
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
          🎒 0/1 Knapsack Visualizer
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>
          Maximize value without exceeding weight capacity using Dynamic Programming
        </p>
        <div style={{ fontSize: '14px', color: '#64748b', marginTop: '10px' }}>
          <span style={{ backgroundColor: '#22c55e', padding: '2px 8px', borderRadius: '4px', marginRight: '10px' }}>🟢 Selected</span>
          <span style={{ backgroundColor: '#7c3aed', padding: '2px 8px', borderRadius: '4px', marginRight: '10px' }}>🟣 Current</span>
          <span style={{ backgroundColor: '#374151', padding: '2px 8px', borderRadius: '4px' }}>⚫ Available</span>
        </div>
      </div>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '30px'
      }}>
        {/* Items Input */}
        {renderItemsInput()}

        {/* Speed Control */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Speed (ms):</label>
          <input
            type="range"
            min="200"
            max="2000"
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
            {loading ? 'Computing...' : 'Solve Knapsack'}
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
        {maxValue > 0 && (
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
              Maximum Value: {maxValue}
            </div>
            <div style={{ fontSize: '16px', color: '#94a3b8' }}>
              Total Weight: {totalWeight}/{capacity}
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
              Configure items and capacity, then click "Solve Knapsack" to start visualization
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
              onClick={() => { setItems([{value:60,weight:10},{value:100,weight:20},{value:120,weight:30}]); setCapacity(50); }}
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
              onClick={() => { setItems([{value:10,weight:5},{value:40,weight:4},{value:30,weight:6},{value:50,weight:3}]); setCapacity(10); }}
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
              Multiple Items
            </button>
            <button
              onClick={() => { setItems([{value:20,weight:1},{value:30,weight:2},{value:40,weight:3}]); setCapacity(5); }}
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
              Small Capacity
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
          <h3 style={{ marginBottom: '15px', color: '#7c3aed' }}>0/1 Knapsack Algorithm:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4 style={{ color: '#a78bfa', marginBottom: '10px' }}>Problem:</h4>
              <ul style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '14px' }}>
                <li>🎒 Select items to maximize value within weight limit</li>
                <li>🔢 Each item: take it (1) or leave it (0)</li>
                <li>⚖️ Cannot exceed knapsack capacity</li>
                <li>🎯 Find optimal subset of items</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#a78bfa', marginBottom: '10px' }}>Complexity:</h4>
              <ul style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '14px' }}>
                <li><strong>Time:</strong> O(n × W)</li>
                <li><strong>Space:</strong> O(n × W) or O(W) optimized</li>
                <li><strong>Applications:</strong> Resource allocation, budgeting</li>
                <li><strong>Optimal:</strong> Guarantees maximum value</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZeroOneKnapsackVisualize;
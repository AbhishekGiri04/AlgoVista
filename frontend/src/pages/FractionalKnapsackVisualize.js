import React, { useState } from 'react';

const FractionalKnapsackVisualize = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [capacity, setCapacity] = useState(50);
  const [items, setItems] = useState([
    { value: 60, weight: 10 },
    { value: 100, weight: 20 },
    { value: 120, weight: 30 }
  ]);

  const runFractionalKnapsack = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/fractionalknapsack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, capacity })
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error: ' + error.message);
    }
    setLoading(false);
  };

  const addItem = () => {
    setItems([...items, { value: 10, weight: 5 }]);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = parseInt(value) || 0;
    setItems(newItems);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div style={{
      backgroundColor: '#0a0e1a',
      color: 'white',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <a href="/greedyalgorithms" style={{
        background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '12px',
        textDecoration: 'none',
        fontWeight: '600'
      }}>
        ← Back to Greedy Algorithms
      </a>

      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>
          Fractional Knapsack Visualizer
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>
          Maximize value with weight constraint
        </p>
      </div>

      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '30px'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px' }}>Knapsack Capacity:</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: '#1e293b',
                color: 'white',
                width: '120px',
                fontSize: '16px'
              }}
            />
          </div>
          
          <h3 style={{ marginBottom: '20px' }}>Items (Value, Weight)</h3>
          
          {items.map((item, index) => (
            <div key={index} style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '10px',
              alignItems: 'center'
            }}>
              <span style={{ minWidth: '60px' }}>Item {index + 1}:</span>
              <input
                type="number"
                value={item.value}
                onChange={(e) => updateItem(index, 'value', e.target.value)}
                placeholder="Value"
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#1e293b',
                  color: 'white',
                  width: '80px'
                }}
              />
              <span>value,</span>
              <input
                type="number"
                value={item.weight}
                onChange={(e) => updateItem(index, 'weight', e.target.value)}
                placeholder="Weight"
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#1e293b',
                  color: 'white',
                  width: '80px'
                }}
              />
              <span>weight</span>
              <span style={{ color: '#10b981', marginLeft: '10px' }}>
                Ratio: {item.weight > 0 ? (item.value / item.weight).toFixed(2) : '0'}
              </span>
              <button
                onClick={() => removeItem(index)}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Remove
              </button>
            </div>
          ))}
          
          <button
            onClick={addItem}
            style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Add Item
          </button>
        </div>
        <button
          onClick={runFractionalKnapsack}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          {loading ? 'Running...' : 'Run Fractional Knapsack'}
        </button>

        <div style={{
          background: '#1e293b',
          borderRadius: '12px',
          padding: '20px',
          fontFamily: 'monospace',
          fontSize: '14px',
          whiteSpace: 'pre-wrap',
          minHeight: '200px'
        }}>
          {result || 'Set capacity, add items and click "Run Fractional Knapsack" to see the optimal solution'}
        </div>
      </div>
    </div>
  );
};

export default FractionalKnapsackVisualize;
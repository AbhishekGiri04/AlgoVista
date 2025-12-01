import React, { useState } from 'react';

const ActivitySelectionVisualize = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState([
    { start: 1, finish: 4 },
    { start: 3, finish: 5 },
    { start: 0, finish: 6 },
    { start: 5, finish: 7 },
    { start: 8, finish: 9 },
    { start: 5, finish: 9 }
  ]);

  const runActivitySelection = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/activityselection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activities })
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error: ' + error.message);
    }
    setLoading(false);
  };

  const addActivity = () => {
    setActivities([...activities, { start: 0, finish: 1 }]);
  };

  const updateActivity = (index, field, value) => {
    const newActivities = [...activities];
    newActivities[index][field] = parseInt(value) || 0;
    setActivities(newActivities);
  };

  const removeActivity = (index) => {
    setActivities(activities.filter((_, i) => i !== index));
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
          Activity Selection Visualizer
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>
          Maximum non-overlapping activities selection
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
          <h3 style={{ marginBottom: '20px' }}>Input Activities (Start Time, Finish Time)</h3>
          
          {activities.map((activity, index) => (
            <div key={index} style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '10px',
              alignItems: 'center'
            }}>
              <span style={{ minWidth: '80px' }}>Activity {index + 1}:</span>
              <input
                type="number"
                value={activity.start}
                onChange={(e) => updateActivity(index, 'start', e.target.value)}
                placeholder="Start"
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#1e293b',
                  color: 'white',
                  width: '80px'
                }}
              />
              <span>to</span>
              <input
                type="number"
                value={activity.finish}
                onChange={(e) => updateActivity(index, 'finish', e.target.value)}
                placeholder="Finish"
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#1e293b',
                  color: 'white',
                  width: '80px'
                }}
              />
              <button
                onClick={() => removeActivity(index)}
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
            onClick={addActivity}
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
            Add Activity
          </button>
        </div>
        <button
          onClick={runActivitySelection}
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
          {loading ? 'Running...' : 'Run Activity Selection'}
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
          {result || 'Add activities and click "Run Activity Selection" to see the optimal solution'}
        </div>
      </div>
    </div>
  );
};

export default ActivitySelectionVisualize;
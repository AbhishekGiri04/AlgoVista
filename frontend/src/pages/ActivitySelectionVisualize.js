import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ActivitySelectionVisualize = () => {
  const [activities, setActivities] = useState([
    { id: 1, start: 1, end: 4, name: 'A1' },
    { id: 2, start: 3, end: 5, name: 'A2' },
    { id: 3, start: 0, end: 6, name: 'A3' },
    { id: 4, start: 5, end: 7, name: 'A4' },
    { id: 5, start: 8, end: 9, name: 'A5' },
    { id: 6, start: 5, end: 9, name: 'A6' }
  ]);

  const [selected, setSelected] = useState([]);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [rejected, setRejected] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [log, setLog] = useState([]);

  useEffect(() => {
    reset();
  }, []);

  const reset = () => {
    setSelected([]);
    setCurrentActivity(null);
    setRejected([]);
    setIsRunning(false);
    setIsPaused(false);
    setLog(['Algorithm initialized', 'Activities sorted by end time']);
  };

  const runActivitySelection = async () => {
    setIsRunning(true);
    setIsPaused(false);
    
    const sorted = [...activities].sort((a, b) => a.end - b.end);
    const newLog = [...log];
    const selectedActs = [];
    const rejectedActs = [];
    let lastEnd = -1;

    newLog.push(`Sorted order: ${sorted.map(a => a.name).join(', ')}`);
    setLog([...newLog]);
    await new Promise(resolve => setTimeout(resolve, speed));

    for (const activity of sorted) {
      while (isPaused) await new Promise(resolve => setTimeout(resolve, 100));

      setCurrentActivity(activity);
      newLog.push(`Considering ${activity.name} [${activity.start}, ${activity.end}]`);
      setLog([...newLog]);
      await new Promise(resolve => setTimeout(resolve, speed));

      if (activity.start >= lastEnd) {
        selectedActs.push(activity);
        lastEnd = activity.end;
        setSelected([...selectedActs]);
        newLog.push(`✓ Selected ${activity.name} (no overlap)`);
      } else {
        rejectedActs.push(activity);
        setRejected([...rejectedActs]);
        newLog.push(`✗ Rejected ${activity.name} (overlaps with previous)`);
      }
      
      setLog([...newLog]);
      await new Promise(resolve => setTimeout(resolve, speed));
    }

    setCurrentActivity(null);
    setIsRunning(false);
    newLog.push(`Total selected: ${selectedActs.length} activities`);
    setLog([...newLog]);
  };

  const togglePause = () => setIsPaused(!isPaused);

  const getActivityColor = (activity) => {
    if (currentActivity?.id === activity.id) return '#F59E0B';
    if (selected.some(a => a.id === activity.id)) return '#10B981';
    if (rejected.some(a => a.id === activity.id)) return '#EF4444';
    return '#6B7280';
  };

  const maxTime = Math.max(...activities.map(a => a.end));

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc, #f1f5f9, #e2e8f0)',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <a href="/greedyalgorithms" style={{
        background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
        color: 'white',
        padding: '14px 24px',
        border: 'none',
        borderRadius: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'none',
        boxShadow: '0 8px 25px rgba(124, 58, 237, 0.4)',
        display: 'inline-block',
        marginBottom: '40px'
      }}>
        ← Back to Greedy Algorithms
      </a>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem', color: '#1e293b' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Activity Selection Visualizer</h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Maximum non-overlapping activities using greedy approach</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Left Panel */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937' }}>Timeline Visualization</h2>
            
            <div style={{
              background: '#fff',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              height: '400px',
              marginBottom: '1.5rem',
              border: '2px solid #e5e7eb'
            }}>
              <svg width="100%" height="100%" viewBox="0 0 600 350">
                {/* Timeline axis */}
                <line x1="50" y1="320" x2="550" y2="320" stroke="#374151" strokeWidth="2" />
                {Array.from({ length: maxTime + 1 }, (_, i) => (
                  <g key={i}>
                    <line x1={50 + (i * 500 / maxTime)} y1="315" x2={50 + (i * 500 / maxTime)} y2="325" stroke="#374151" strokeWidth="2" />
                    <text x={50 + (i * 500 / maxTime)} y="340" textAnchor="middle" className="text-xs fill-gray-600">{i}</text>
                  </g>
                ))}

                {/* Activities */}
                {activities.map((activity, idx) => {
                  const x = 50 + (activity.start * 500 / maxTime);
                  const width = ((activity.end - activity.start) * 500 / maxTime);
                  const y = 50 + idx * 40;
                  const color = getActivityColor(activity);

                  return (
                    <g key={activity.id}>
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height="30"
                        fill={color}
                        stroke="#1F2937"
                        strokeWidth="2"
                        rx="4"
                      />
                      <text x={x + width / 2} y={y + 20} textAnchor="middle" className="text-sm font-bold fill-white">
                        {activity.name}
                      </text>
                      <text x="30" y={y + 20} textAnchor="end" className="text-xs fill-gray-600">
                        [{activity.start},{activity.end}]
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
              <button
                onClick={runActivitySelection}
                disabled={isRunning}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: isRunning ? 'not-allowed' : 'pointer',
                  opacity: isRunning ? 0.5 : 1
                }}
              >
                {isRunning ? 'Running...' : 'Start Selection'}
              </button>
              {isRunning && (
                <button
                  onClick={togglePause}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {isPaused ? '▶ Resume' : '⏸ Pause'}
                </button>
              )}
              <button
                onClick={reset}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Reset
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '600' }}>Speed:</label>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  style={{ width: '100px' }}
                />
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{speed}ms</span>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Progress</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#10b981', fontWeight: '600' }}>✓ Selected: {selected.length}</span>
                  <span style={{ color: '#ef4444', fontWeight: '600' }}>✗ Rejected: {rejected.length}</span>
                </div>
                <div style={{ width: '100%', background: '#e5e7eb', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${((selected.length + rejected.length) / activities.length) * 100}%`,
                      background: 'linear-gradient(90deg, #10b981, #059669)',
                      height: '100%',
                      borderRadius: '9999px',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>
            </div>

            {selected.length > 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Selected Activities</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selected.map((activity) => (
                    <div key={activity.id} style={{
                      padding: '0.75rem',
                      background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                      borderLeft: '4px solid #10b981',
                      borderRadius: '0.5rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 'bold', color: '#065f46' }}>{activity.name}</span>
                        <span style={{ color: '#047857' }}>[{activity.start}, {activity.end}]</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Activities List</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      background: selected.some(a => a.id === activity.id) ? '#d1fae5' :
                                 rejected.some(a => a.id === activity.id) ? '#fee2e2' :
                                 currentActivity?.id === activity.id ? '#fef3c7' :
                                 '#f9fafb',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <span style={{ fontWeight: '600', color: '#1f2937' }}>{activity.name}</span>
                    <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Start: {activity.start}, End: {activity.end}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Algorithm Log</h3>
              <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <style>{`
                  div::-webkit-scrollbar {
                    width: 6px;
                  }
                  div::-webkit-scrollbar-track {
                    background: rgba(148, 163, 184, 0.1);
                    border-radius: 10px;
                  }
                  div::-webkit-scrollbar-thumb {
                    background: rgba(148, 163, 184, 0.4);
                    border-radius: 10px;
                  }
                  div::-webkit-scrollbar-thumb:hover {
                    background: rgba(148, 163, 184, 0.6);
                  }
                `}</style>
                {log.map((entry, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      background: entry.includes('✓') ? '#d1fae5' :
                                 entry.includes('✗') ? '#fee2e2' :
                                 '#f3f4f6',
                      color: entry.includes('✓') ? '#065f46' :
                             entry.includes('✗') ? '#991b1b' :
                             '#374151',
                      borderLeft: '3px solid #3b82f6'
                    }}
                  >
                    {entry}
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Algorithm Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Time Complexity:</span>
                  <span style={{ fontWeight: '600', color: '#3b82f6' }}>O(n log n)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Space Complexity:</span>
                  <span style={{ fontWeight: '600', color: '#3b82f6' }}>O(n)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Approach:</span>
                  <span style={{ fontWeight: '600', color: '#10b981' }}>Greedy (earliest finish)</span>
                </div>
                <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280', fontWeight: '600' }}>Use Case:</span>
                  <p style={{ color: '#374151', marginTop: '0.25rem' }}>Scheduling, resource allocation, meeting rooms</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitySelectionVisualize;
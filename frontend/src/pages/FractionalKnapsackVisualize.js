import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const FractionalKnapsackVisualize = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Item A', weight: 10, value: 60 },
    { id: 2, name: 'Item B', weight: 20, value: 100 },
    { id: 3, name: 'Item C', weight: 30, value: 120 },
    { id: 4, name: 'Item D', weight: 15, value: 90 }
  ]);

  const [capacity, setCapacity] = useState(50);
  const [knapsack, setKnapsack] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [remainingCapacity, setRemainingCapacity] = useState(capacity);
  const [totalValue, setTotalValue] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [log, setLog] = useState([]);

  useEffect(() => {
    reset();
  }, [capacity]);

  const reset = () => {
    setKnapsack([]);
    setCurrentItem(null);
    setRemainingCapacity(capacity);
    setTotalValue(0);
    setIsRunning(false);
    setIsPaused(false);
    setLog(['Algorithm initialized', `Knapsack capacity: ${capacity}`, 'Items sorted by value/weight ratio']);
  };

  const runFractionalKnapsack = async () => {
    setIsRunning(true);
    setIsPaused(false);
    
    const sorted = [...items]
      .map(item => ({ ...item, ratio: item.value / item.weight }))
      .sort((a, b) => b.ratio - a.ratio);

    const newLog = [...log];
    newLog.push(`Sorted by ratio: ${sorted.map(i => `${i.name}(${i.ratio.toFixed(2)})`).join(', ')}`);
    setLog([...newLog]);
    await new Promise(resolve => setTimeout(resolve, speed));

    let remaining = capacity;
    let value = 0;
    const selected = [];

    for (const item of sorted) {
      while (isPaused) await new Promise(resolve => setTimeout(resolve, 100));

      setCurrentItem(item);
      newLog.push(`Considering ${item.name}: weight=${item.weight}, value=${item.value}, ratio=${item.ratio.toFixed(2)}`);
      setLog([...newLog]);
      await new Promise(resolve => setTimeout(resolve, speed));

      if (remaining >= item.weight) {
        selected.push({ ...item, fraction: 1, takenWeight: item.weight, takenValue: item.value });
        remaining -= item.weight;
        value += item.value;
        newLog.push(`✓ Added full ${item.name} (100%)`);
      } else if (remaining > 0) {
        const fraction = remaining / item.weight;
        const takenValue = item.value * fraction;
        selected.push({ ...item, fraction, takenWeight: remaining, takenValue });
        value += takenValue;
        newLog.push(`✓ Added ${(fraction * 100).toFixed(1)}% of ${item.name}`);
        remaining = 0;
      } else {
        newLog.push(`✗ Skipped ${item.name} (no capacity left)`);
      }

      setKnapsack([...selected]);
      setRemainingCapacity(remaining);
      setTotalValue(value);
      setLog([...newLog]);
      await new Promise(resolve => setTimeout(resolve, speed));

      if (remaining === 0) break;
    }

    setCurrentItem(null);
    setIsRunning(false);
    newLog.push(`Final value: ${value.toFixed(2)}, Used capacity: ${capacity - remaining}/${capacity}`);
    setLog([...newLog]);
  };

  const togglePause = () => setIsPaused(!isPaused);

  const getItemColor = (item) => {
    if (currentItem?.id === item.id) return '#F59E0B';
    if (knapsack.some(k => k.id === item.id)) return '#10B981';
    return '#6B7280';
  };

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
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px'
          }}>
            Fractional Knapsack Visualizer
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#1e293b' }}>Maximize value with weight constraint using greedy approach</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937' }}>Knapsack Visualization</h2>
            
            <div style={{
              background: '#fff',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              minHeight: '400px',
              marginBottom: '1.5rem',
              border: '2px solid #e5e7eb'
            }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Capacity Used</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>{capacity - remainingCapacity}/{capacity}</span>
                </div>
                <div style={{ width: '100%', background: '#e5e7eb', borderRadius: '9999px', height: '32px', position: 'relative', overflow: 'hidden' }}>
                  {knapsack.map((item, idx) => {
                    const prevWidth = knapsack.slice(0, idx).reduce((sum, k) => sum + (k.takenWeight / capacity) * 100, 0);
                    const width = (item.takenWeight / capacity) * 100;
                    return (
                      <div
                        key={item.id}
                        style={{
                          position: 'absolute',
                          height: '100%',
                          background: 'linear-gradient(90deg, #10b981, #059669)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          left: `${prevWidth}%`,
                          width: `${width}%`
                        }}
                      >
                        {item.name}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {items.map((item) => {
                  const ratio = item.value / item.weight;
                  const inKnapsack = knapsack.find(k => k.id === item.id);
                  return (
                    <div
                      key={item.id}
                      style={{
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        border: '2px solid',
                        borderColor: currentItem?.id === item.id ? '#f59e0b' : inKnapsack ? '#10b981' : '#e5e7eb',
                        background: currentItem?.id === item.id ? '#fef3c7' : inKnapsack ? '#d1fae5' : 'white'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#1f2937' }}>{item.name}</span>
                        <span style={{ fontSize: '0.875rem', background: '#fef3c7', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', color: '#92400e' }}>Ratio: {ratio.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280' }}>
                        <span>Weight: {item.weight}</span>
                        <span>Value: {item.value}</span>
                      </div>
                      {inKnapsack && (
                        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#059669' }}>
                          ✓ {(inKnapsack.fraction * 100).toFixed(1)}% taken (Value: {inKnapsack.takenValue.toFixed(2)})
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Knapsack Capacity:</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                disabled={isRunning}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  color: '#000',
                  fontWeight: '600'
                }}
                min="1"
              />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
              <button
                onClick={runFractionalKnapsack}
                disabled={isRunning}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: isRunning ? 'not-allowed' : 'pointer',
                  opacity: isRunning ? 0.5 : 1
                }}
              >
                {isRunning ? 'Running...' : 'Start Algorithm'}
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
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Result Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ padding: '1rem', background: 'linear-gradient(135deg, #fef3c7, #fde68a)', borderRadius: '0.5rem' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#92400e' }}>{totalValue.toFixed(2)}</div>
                  <div style={{ fontSize: '0.875rem', color: '#78350f' }}>Total Value</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>{capacity - remainingCapacity}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Weight Used</div>
                  </div>
                  <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>{remainingCapacity}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Remaining</div>
                  </div>
                </div>
              </div>
            </div>

            {knapsack.length > 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Selected Items</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {knapsack.map((item) => (
                    <div key={item.id} style={{
                      padding: '0.75rem',
                      background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                      borderLeft: '4px solid #10b981',
                      borderRadius: '0.5rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', color: '#065f46' }}>{item.name}</span>
                        <span style={{ fontSize: '0.875rem', color: '#047857' }}>{(item.fraction * 100).toFixed(1)}%</span>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#047857', marginTop: '0.25rem' }}>
                        Weight: {item.takenWeight.toFixed(2)} | Value: {item.takenValue.toFixed(2)}
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
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Value/Weight Ratios</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[...items]
                  .map(item => ({ ...item, ratio: item.value / item.weight }))
                  .sort((a, b) => b.ratio - a.ratio)
                  .map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                      <span style={{ fontWeight: '600', color: '#1f2937' }}>{item.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '96px', background: '#e5e7eb', borderRadius: '9999px', height: '8px' }}>
                          <div
                            style={{
                              background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                              height: '8px',
                              borderRadius: '9999px',
                              width: `${(item.ratio / Math.max(...items.map(i => i.value / i.weight))) * 100}%`
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#d97706', width: '48px', textAlign: 'right' }}>{item.ratio.toFixed(2)}</span>
                      </div>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', maxHeight: '192px', overflowY: 'auto', fontSize: '0.875rem' }}>
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
                      background: entry.includes('✓') ? '#d1fae5' : entry.includes('✗') ? '#fee2e2' : '#f3f4f6',
                      color: entry.includes('✓') ? '#065f46' : entry.includes('✗') ? '#991b1b' : '#374151',
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
                  <span style={{ fontWeight: '600', color: '#10b981' }}>Greedy (max value/weight ratio)</span>
                </div>
                <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280', fontWeight: '600' }}>Use Case:</span>
                  <p style={{ color: '#374151', marginTop: '0.25rem' }}>Resource allocation, optimization</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FractionalKnapsackVisualize;
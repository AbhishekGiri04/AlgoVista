import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ZeroOneKnapsackVisualize = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1', weight: 2, value: 12 },
    { id: 2, name: 'Item 2', weight: 1, value: 10 },
    { id: 3, name: 'Item 3', weight: 3, value: 20 },
    { id: 4, name: 'Item 4', weight: 2, value: 15 }
  ]);

  const [capacity, setCapacity] = useState(5);
  const [dp, setDp] = useState([]);
  const [selected, setSelected] = useState([]);
  const [maxValue, setMaxValue] = useState(0);
  const [currentCell, setCurrentCell] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [log, setLog] = useState([]);

  useEffect(() => {
    reset();
  }, [capacity, items]);

  const reset = () => {
    const n = items.length;
    const table = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));
    setDp(table);
    setSelected([]);
    setMaxValue(0);
    setCurrentCell(null);
    setIsRunning(false);
    setIsPaused(false);
    setLog(['Algorithm initialized', `Capacity: ${capacity}`, `Items: ${n}`]);
  };

  const runKnapsack = async () => {
    setIsRunning(true);
    setIsPaused(false);
    
    const n = items.length;
    const table = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));
    const newLog = [...log];

    for (let i = 1; i <= n; i++) {
      const item = items[i - 1];
      
      for (let w = 0; w <= capacity; w++) {
        while (isPaused) await new Promise(resolve => setTimeout(resolve, 100));

        setCurrentCell({ i, w });

        if (item.weight <= w) {
          const include = table[i - 1][w - item.weight] + item.value;
          const exclude = table[i - 1][w];
          
          if (include > exclude) {
            table[i][w] = include;
            newLog.push(`✓ [${i}][${w}] Include ${item.name}: ${include} > ${exclude}`);
          } else {
            table[i][w] = exclude;
            newLog.push(`✗ [${i}][${w}] Exclude ${item.name}: ${exclude} ≥ ${include}`);
          }
        } else {
          table[i][w] = table[i - 1][w];
          newLog.push(`⊗ [${i}][${w}] ${item.name} too heavy (${item.weight} > ${w})`);
        }

        setDp(table.map(row => [...row]));
        setLog([...newLog]);
        await new Promise(resolve => setTimeout(resolve, speed));
      }
    }

    // Backtrack to find selected items
    let w = capacity;
    const selectedItems = [];
    for (let i = n; i > 0; i--) {
      if (table[i][w] !== table[i - 1][w]) {
        selectedItems.push(items[i - 1]);
        w -= items[i - 1].weight;
      }
    }

    setSelected(selectedItems);
    setMaxValue(table[n][capacity]);
    setCurrentCell(null);
    setIsRunning(false);
    newLog.push(`Maximum value: ${table[n][capacity]}`);
    newLog.push(`Selected: ${selectedItems.map(item => item.name).join(', ')}`);
    setLog([...newLog]);
  };

  const togglePause = () => setIsPaused(!isPaused);

  const getCellColor = (i, w) => {
    if (currentCell?.i === i && currentCell?.w === w) return 'bg-yellow-200 border-yellow-500';
    if (dp[i] && dp[i][w] > 0) return 'bg-green-100 border-green-400';
    return 'bg-white border-gray-300';
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc, #f1f5f9, #e2e8f0)',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Inter, sans-serif',
      color: '#1e293b'
    }}>
      <a href="/dynamicprogramming" style={{
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
        ← Back to Dynamic Programming
      </a>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '30px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 12px',
            textAlign: 'center'
          }}>
            0/1 Knapsack Visualizer
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#1e293b',
            textAlign: 'center',
            margin: '0'
          }}>
            Maximum value without exceeding weight using dynamic programming
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">DP Table</h2>
            
            <div className="overflow-x-auto mb-4">
              {dp.length > 0 && (
                <table className="border-collapse text-xs">
                  <thead>
                    <tr>
                      <th className="border p-2 bg-gray-100">W</th>
                      {Array.from({ length: capacity + 1 }, (_, w) => (
                        <th key={w} className="border p-2 bg-gray-100 font-bold">{w}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dp.map((row, i) => (
                      <tr key={i}>
                        <td className="border p-2 bg-gray-100 font-bold">
                          {i === 0 ? '∅' : items[i - 1].name}
                        </td>
                        {row.map((val, w) => (
                          <td
                            key={w}
                            className={`border p-2 text-center font-semibold transition-all ${getCellColor(i, w)}`}
                          >
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Knapsack Capacity:</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                disabled={isRunning}
                className="w-full px-4 py-2 border rounded-lg"
                min="1"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={runKnapsack} disabled={isRunning} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50">
                {isRunning ? 'Running...' : 'Start 0/1 Knapsack'}
              </button>
              {isRunning && <button onClick={togglePause} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">{isPaused ? 'Resume' : 'Pause'}</button>}
              <button onClick={reset} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Reset</button>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Speed:</label>
                <input type="range" min="200" max="1200" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-20" />
              </div>
              <a href="/dynamicprogramming" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">← Back</a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {maxValue > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Optimal Solution</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Maximum Value:</div>
                    <div className="text-3xl font-bold text-green-600">{maxValue}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Total Weight:</div>
                    <div className="text-xl font-bold text-gray-800">
                      {selected.reduce((sum, item) => sum + item.weight, 0)} / {capacity}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Items</h3>
              <div className="space-y-2">
                {items.map((item) => {
                  const isSelected = selected.some(s => s.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded border-2 ${
                        isSelected ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{item.name}</span>
                        {isSelected && <span className="text-green-600 font-bold">✓ Selected</span>}
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>Weight: {item.weight}</span>
                        <span>Value: {item.value}</span>
                        <span>Ratio: {(item.value / item.weight).toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">DP Recurrence</h3>
              <div className="p-4 bg-gray-50 rounded font-mono text-xs">
                <div className="mb-2">if (weight[i] &lt;= w):</div>
                <div className="ml-4 text-green-600">dp[i][w] = max(</div>
                <div className="ml-8">dp[i-1][w],</div>
                <div className="ml-8">dp[i-1][w-weight[i]] + value[i]</div>
                <div className="ml-4 text-green-600">)</div>
                <div className="mt-2">else:</div>
                <div className="ml-4 text-green-600">dp[i][w] = dp[i-1][w]</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Algorithm Log</h3>
              <div className="space-y-1 max-h-64 overflow-y-auto text-sm">
                {log.map((entry, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded ${
                      entry.includes('✓') ? 'text-green-700 bg-green-50' :
                      entry.includes('✗') ? 'text-red-700 bg-red-50' :
                      entry.includes('⊗') ? 'text-gray-600 bg-gray-50' :
                      'text-gray-700'
                    }`}
                  >
                    {entry}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Algorithm Info</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Time Complexity:</strong> O(n × W)</p>
                <p><strong>Space Complexity:</strong> O(n × W)</p>
                <p><strong>Approach:</strong> Dynamic Programming</p>
                <p><strong>Use Case:</strong> Resource allocation, budgeting</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ZeroOneKnapsackVisualize;
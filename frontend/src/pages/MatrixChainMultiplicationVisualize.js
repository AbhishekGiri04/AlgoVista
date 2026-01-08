import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MatrixChainMultiplicationVisualize = () => {
  const [dimensions, setDimensions] = useState([10, 20, 30, 40, 30]);
  const [dp, setDp] = useState([]);
  const [bracket, setBracket] = useState([]);
  const [minCost, setMinCost] = useState(0);
  const [optimalOrder, setOptimalOrder] = useState('');
  const [currentCell, setCurrentCell] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [log, setLog] = useState([]);

  useEffect(() => {
    reset();
  }, [dimensions]);

  const reset = () => {
    const n = dimensions.length - 1;
    const table = Array(n).fill(0).map(() => Array(n).fill(0));
    const br = Array(n).fill(0).map(() => Array(n).fill(0));
    setDp(table);
    setBracket(br);
    setMinCost(0);
    setOptimalOrder('');
    setCurrentCell(null);
    setIsRunning(false);
    setIsPaused(false);
    setLog(['Algorithm initialized', `Matrices: ${n}`, `Dimensions: ${dimensions.join(' × ')}`]);
  };

  const printOptimal = (br, i, j) => {
    if (i === j) {
      return `M${i + 1}`;
    }
    return `(${printOptimal(br, i, br[i][j])} × ${printOptimal(br, br[i][j] + 1, j)})`;
  };

  const runMatrixChain = async () => {
    setIsRunning(true);
    setIsPaused(false);
    
    const n = dimensions.length - 1;
    const table = Array(n).fill(0).map(() => Array(n).fill(0));
    const br = Array(n).fill(0).map(() => Array(n).fill(0));
    const newLog = [...log];

    // Chain length
    for (let len = 2; len <= n; len++) {
      for (let i = 0; i < n - len + 1; i++) {
        const j = i + len - 1;
        table[i][j] = Infinity;

        for (let k = i; k < j; k++) {
          while (isPaused) await new Promise(resolve => setTimeout(resolve, 100));

          setCurrentCell({ i, j, k });
          
          const cost = table[i][k] + table[k + 1][j] + dimensions[i] * dimensions[k + 1] * dimensions[j + 1];
          
          newLog.push(`[${i}][${j}] k=${k}: cost = ${table[i][k]} + ${table[k + 1][j]} + ${dimensions[i]}×${dimensions[k + 1]}×${dimensions[j + 1]} = ${cost}`);
          setLog([...newLog]);
          await new Promise(resolve => setTimeout(resolve, speed));

          if (cost < table[i][j]) {
            table[i][j] = cost;
            br[i][j] = k;
            newLog.push(`✓ Updated [${i}][${j}] = ${cost}, split at k=${k}`);
            setLog([...newLog]);
          }

          setDp(table.map(row => [...row]));
          setBracket(br.map(row => [...row]));
        }
      }
    }

    const optimal = printOptimal(br, 0, n - 1);
    setMinCost(table[0][n - 1]);
    setOptimalOrder(optimal);
    setCurrentCell(null);
    setIsRunning(false);
    newLog.push(`Minimum cost: ${table[0][n - 1]}`);
    newLog.push(`Optimal order: ${optimal}`);
    setLog([...newLog]);
  };

  const togglePause = () => setIsPaused(!isPaused);

  const getCellColor = (i, j) => {
    if (i > j) return 'bg-gray-100 border-gray-200';
    if (currentCell?.i === i && currentCell?.j === j) return 'bg-yellow-200 border-yellow-500';
    if (dp[i] && dp[i][j] > 0 && dp[i][j] !== Infinity) return 'bg-purple-100 border-purple-400';
    return 'bg-white border-gray-300';
  };

  const matrices = dimensions.slice(0, -1).map((dim, idx) => ({
    name: `M${idx + 1}`,
    rows: dim,
    cols: dimensions[idx + 1]
  }));

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
            background: 'linear-gradient(135deg, #a855f7, #9333ea)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 12px',
            textAlign: 'center'
          }}>
            Matrix Chain Multiplication Visualizer
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#1e293b',
            textAlign: 'center',
            margin: '0'
          }}>
            Find optimal multiplication order using dynamic programming
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">DP Cost Table</h2>
            
            <div className="overflow-x-auto mb-4">
              {dp.length > 0 && (
                <table className="border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 bg-gray-100 text-xs"></th>
                      {matrices.map((m, idx) => (
                        <th key={idx} className="border p-2 bg-gray-100 font-bold text-xs">{m.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dp.map((row, i) => (
                      <tr key={i}>
                        <td className="border p-2 bg-gray-100 font-bold text-xs">{matrices[i].name}</td>
                        {row.map((val, j) => (
                          <td
                            key={j}
                            className={`border p-3 text-center font-semibold text-xs transition-all ${getCellColor(i, j)}`}
                          >
                            {i > j ? '-' : val === Infinity ? '∞' : val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Matrix Dimensions (space-separated):</label>
              <input
                type="text"
                value={dimensions.join(' ')}
                onChange={(e) => setDimensions(e.target.value.split(' ').map(Number).filter(n => !isNaN(n)))}
                disabled={isRunning}
                className="w-full px-4 py-2 border rounded-lg font-mono"
                placeholder="10 20 30 40 30"
              />
              <div className="text-xs text-gray-500 mt-1">
                Example: "10 20 30 40" creates M1(10×20), M2(20×30), M3(30×40)
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={runMatrixChain} disabled={isRunning || dimensions.length < 2} className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50">
                {isRunning ? 'Running...' : 'Start Algorithm'}
              </button>
              {isRunning && <button onClick={togglePause} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">{isPaused ? 'Resume' : 'Pause'}</button>}
              <button onClick={reset} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Reset</button>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Speed:</label>
                <input type="range" min="200" max="1500" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-20" />
              </div>
              <a href="/dynamicprogramming" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">← Back</a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {optimalOrder && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Optimal Solution</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Minimum Cost:</div>
                    <div className="text-3xl font-bold text-purple-600">{minCost}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">Optimal Parenthesization:</div>
                    <div className="text-lg font-mono text-purple-700 break-all">{optimalOrder}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Matrix Chain</h3>
              <div className="space-y-2">
                {matrices.map((matrix, idx) => (
                  <div key={idx} className="p-3 bg-purple-50 rounded flex justify-between items-center">
                    <span className="font-bold text-purple-700">{matrix.name}</span>
                    <span className="text-sm text-gray-600">{matrix.rows} × {matrix.cols}</span>
                  </div>
                ))}
              </div>
            </div>

            {currentCell && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Computation</h3>
                <div className="p-3 bg-yellow-50 rounded text-sm">
                  <p>Computing: M{currentCell.i + 1} to M{currentCell.j + 1}</p>
                  <p>Split at: k = {currentCell.k}</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">DP Recurrence</h3>
              <div className="p-4 bg-gray-50 rounded font-mono text-xs">
                <div className="mb-2">dp[i][j] = min(</div>
                <div className="ml-4">dp[i][k] + dp[k+1][j]</div>
                <div className="ml-4">+ p[i] × p[k+1] × p[j+1]</div>
                <div>)</div>
                <div className="mt-2 text-gray-600">for all k: i ≤ k &lt; j</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Algorithm Log</h3>
              <div className="space-y-1 max-h-64 overflow-y-auto text-sm">
                {log.map((entry, idx) => (
                  <div key={idx} className={`p-2 rounded ${entry.includes('✓') ? 'text-green-700 bg-green-50' : 'text-gray-700'}`}>
                    {entry}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Algorithm Info</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Time Complexity:</strong> O(n³)</p>
                <p><strong>Space Complexity:</strong> O(n²)</p>
                <p><strong>Approach:</strong> Dynamic Programming</p>
                <p><strong>Use Case:</strong> Optimization, compiler design</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MatrixChainMultiplicationVisualize;
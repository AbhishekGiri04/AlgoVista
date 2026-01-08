import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LongestCommonSubsequenceVisualize = () => {
  const [text1, setText1] = useState('ABCDGH');
  const [text2, setText2] = useState('AEDFHR');
  const [dp, setDp] = useState([]);
  const [lcs, setLcs] = useState('');
  const [currentCell, setCurrentCell] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [log, setLog] = useState([]);

  useEffect(() => {
    reset();
  }, [text1, text2]);

  const reset = () => {
    const m = text1.length;
    const n = text2.length;
    const table = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
    setDp(table);
    setLcs('');
    setCurrentCell(null);
    setIsRunning(false);
    setIsPaused(false);
    setLog(['Algorithm initialized', `Text 1: ${text1}`, `Text 2: ${text2}`]);
  };

  const runLCS = async () => {
    setIsRunning(true);
    setIsPaused(false);
    
    const m = text1.length;
    const n = text2.length;
    const table = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
    const newLog = [...log];

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        while (isPaused) await new Promise(resolve => setTimeout(resolve, 100));

        setCurrentCell({ i, j });
        
        if (text1[i - 1] === text2[j - 1]) {
          table[i][j] = table[i - 1][j - 1] + 1;
          newLog.push(`✓ Match: ${text1[i - 1]} at [${i}][${j}] → ${table[i][j]}`);
        } else {
          table[i][j] = Math.max(table[i - 1][j], table[i][j - 1]);
          newLog.push(`No match at [${i}][${j}] → max(${table[i - 1][j]}, ${table[i][j - 1]}) = ${table[i][j]}`);
        }

        setDp(table.map(row => [...row]));
        setLog([...newLog]);
        await new Promise(resolve => setTimeout(resolve, speed));
      }
    }

    // Backtrack to find LCS
    let i = m, j = n;
    const result = [];
    
    while (i > 0 && j > 0) {
      if (text1[i - 1] === text2[j - 1]) {
        result.unshift(text1[i - 1]);
        i--;
        j--;
      } else if (table[i - 1][j] > table[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }

    const lcsStr = result.join('');
    setLcs(lcsStr);
    setCurrentCell(null);
    setIsRunning(false);
    newLog.push(`LCS found: "${lcsStr}" (length: ${lcsStr.length})`);
    setLog([...newLog]);
  };

  const togglePause = () => setIsPaused(!isPaused);

  const getCellColor = (i, j) => {
    if (currentCell?.i === i && currentCell?.j === j) return 'bg-yellow-200 border-yellow-500';
    if (dp[i] && dp[i][j] > 0) return 'bg-blue-100 border-blue-400';
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
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 12px',
            textAlign: 'center'
          }}>
            Longest Common Subsequence Visualizer
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#1e293b',
            textAlign: 'center',
            margin: '0'
          }}>
            Find longest common sequence using dynamic programming
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">DP Table</h2>
            
            <div className="overflow-x-auto mb-4">
              {dp.length > 0 && (
                <table className="border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 bg-gray-100 text-xs"></th>
                      <th className="border p-2 bg-gray-100 text-xs">ε</th>
                      {text2.split('').map((char, idx) => (
                        <th key={idx} className="border p-2 bg-gray-100 font-bold">{char}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dp.map((row, i) => (
                      <tr key={i}>
                        <td className="border p-2 bg-gray-100 font-bold text-xs">
                          {i === 0 ? 'ε' : text1[i - 1]}
                        </td>
                        {row.map((val, j) => (
                          <td
                            key={j}
                            className={`border p-3 text-center font-semibold transition-all ${getCellColor(i, j)}`}
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

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Text 1:</label>
                <input
                  type="text"
                  value={text1}
                  onChange={(e) => setText1(e.target.value.toUpperCase())}
                  disabled={isRunning}
                  className="w-full px-4 py-2 border rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Text 2:</label>
                <input
                  type="text"
                  value={text2}
                  onChange={(e) => setText2(e.target.value.toUpperCase())}
                  disabled={isRunning}
                  className="w-full px-4 py-2 border rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={runLCS} disabled={isRunning} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">
                {isRunning ? 'Running...' : 'Start LCS'}
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
            {lcs && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">LCS Result</h3>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 font-mono text-center mb-2">{lcs}</div>
                  <div className="text-sm text-gray-600 text-center">Length: {lcs.length}</div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Input Strings</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500 mb-1">Text 1:</div>
                  <div className="flex gap-1">
                    {text1.split('').map((char, idx) => (
                      <div key={idx} className={`w-10 h-10 flex items-center justify-center font-bold rounded ${lcs.includes(char) ? 'bg-blue-200 text-blue-800' : 'bg-gray-200'}`}>
                        {char}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500 mb-1">Text 2:</div>
                  <div className="flex gap-1">
                    {text2.split('').map((char, idx) => (
                      <div key={idx} className={`w-10 h-10 flex items-center justify-center font-bold rounded ${lcs.includes(char) ? 'bg-blue-200 text-blue-800' : 'bg-gray-200'}`}>
                        {char}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">DP Recurrence</h3>
              <div className="p-4 bg-gray-50 rounded font-mono text-sm">
                <div className="mb-2">if (text1[i] == text2[j]):</div>
                <div className="ml-4 text-blue-600">dp[i][j] = dp[i-1][j-1] + 1</div>
                <div className="mt-2">else:</div>
                <div className="ml-4 text-blue-600">dp[i][j] = max(dp[i-1][j], dp[i][j-1])</div>
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
                <p><strong>Time Complexity:</strong> O(m × n)</p>
                <p><strong>Space Complexity:</strong> O(m × n)</p>
                <p><strong>Approach:</strong> Dynamic Programming</p>
                <p><strong>Use Case:</strong> Diff tools, DNA sequencing</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LongestCommonSubsequenceVisualize;
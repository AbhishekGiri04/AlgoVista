import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const FloydWarshallAlgorithmVisualize = () => {
  const [vertices] = useState(['A', 'B', 'C', 'D']);
  const [matrix, setMatrix] = useState([]);
  const [currentK, setCurrentK] = useState(-1);
  const [currentI, setCurrentI] = useState(-1);
  const [currentJ, setCurrentJ] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [log, setLog] = useState([]);

  useEffect(() => {
    reset();
  }, []);

  const reset = () => {
    const INF = 999;
    const initial = [
      [0, 3, INF, 7],
      [8, 0, 2, INF],
      [5, INF, 0, 1],
      [2, INF, INF, 0]
    ];
    setMatrix(initial);
    setCurrentK(-1);
    setCurrentI(-1);
    setCurrentJ(-1);
    setIsRunning(false);
    setIsPaused(false);
    setLog(['Algorithm initialized', 'Matrix represents edge weights']);
  };

  const runFloydWarshall = async () => {
    setIsRunning(true);
    setIsPaused(false);
    
    const dist = matrix.map(row => [...row]);
    const newLog = [...log];
    const n = vertices.length;

    for (let k = 0; k < n; k++) {
      setCurrentK(k);
      newLog.push(`--- Using vertex ${vertices[k]} as intermediate ---`);
      setLog([...newLog]);
      await new Promise(resolve => setTimeout(resolve, speed));

      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          while (isPaused) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }

          setCurrentI(i);
          setCurrentJ(j);
          await new Promise(resolve => setTimeout(resolve, speed / 2));

          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
            newLog.push(`✓ Updated [${vertices[i]}][${vertices[j]}] = ${dist[i][j]}`);
            setMatrix(dist.map(row => [...row]));
            setLog([...newLog]);
          }
        }
      }
    }

    setCurrentK(-1);
    setCurrentI(-1);
    setCurrentJ(-1);
    setIsRunning(false);
    newLog.push('Algorithm completed!');
    setLog([...newLog]);
  };

  const togglePause = () => setIsPaused(!isPaused);

  const getCellColor = (i, j) => {
    if (i === currentI && j === currentJ) return 'bg-yellow-200 border-yellow-500';
    if (i === currentK || j === currentK) return 'bg-blue-100 border-blue-400';
    if (i === currentI || j === currentJ) return 'bg-purple-100 border-purple-300';
    return 'bg-white border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">Floyd-Warshall Algorithm</h1>
          <p className="text-indigo-600">All pairs shortest paths</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Distance Matrix</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 bg-gray-100"></th>
                    {vertices.map(v => <th key={v} className="border p-2 bg-gray-100 font-bold">{v}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((row, i) => (
                    <tr key={i}>
                      <td className="border p-2 bg-gray-100 font-bold">{vertices[i]}</td>
                      {row.map((val, j) => (
                        <td key={j} className={`border p-3 text-center font-semibold transition-all ${getCellColor(i, j)}`}>
                          {val === 999 ? '∞' : val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              <button onClick={runFloydWarshall} disabled={isRunning} className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50">
                {isRunning ? 'Running...' : 'Start Floyd-Warshall'}
              </button>
              {isRunning && (
                <button onClick={togglePause} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
              )}
              <button onClick={reset} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Reset</button>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Speed:</label>
                <input type="range" min="200" max="1500" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-20" />
              </div>
              <a href="/graphalgorithms" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">← Back</a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Current State</h3>
              {currentK >= 0 && (
                <div className="space-y-2 text-sm">
                  <p>Intermediate vertex: <span className="font-bold text-blue-600">{vertices[currentK]}</span></p>
                  {currentI >= 0 && currentJ >= 0 && (
                    <p>Checking: <span className="font-bold text-purple-600">[{vertices[currentI]}][{vertices[currentJ]}]</span></p>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Algorithm Log</h3>
              <div className="space-y-1 max-h-80 overflow-y-auto text-sm">
                {log.map((entry, index) => (
                  <div key={index} className={`p-2 rounded ${entry.includes('✓') ? 'text-green-700 bg-green-50' : entry.includes('---') ? 'text-blue-700 bg-blue-50 font-semibold' : 'text-gray-700'}`}>
                    {entry}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Algorithm Info</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Time Complexity:</strong> O(V³)</p>
                <p><strong>Space Complexity:</strong> O(V²)</p>
                <p><strong>Approach:</strong> Dynamic Programming</p>
                <p><strong>Use Case:</strong> All pairs shortest paths</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FloydWarshallAlgorithmVisualize;
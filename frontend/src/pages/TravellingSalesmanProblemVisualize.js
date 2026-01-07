import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TravellingSalesmanProblemVisualize = () => {
  const [cities, setCities] = useState([
    { id: 0, x: 150, y: 150, name: 'A' },
    { id: 1, x: 350, y: 100, name: 'B' },
    { id: 2, x: 400, y: 300, name: 'C' },
    { id: 3, x: 200, y: 350, name: 'D' },
    { id: 4, x: 100, y: 250, name: 'E' }
  ]);

  const [distances, setDistances] = useState([]);
  const [bestPath, setBestPath] = useState([]);
  const [bestCost, setBestCost] = useState(Infinity);
  const [currentPath, setCurrentPath] = useState([]);
  const [currentCost, setCurrentCost] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [log, setLog] = useState([]);
  const [explored, setExplored] = useState(0);

  useEffect(() => {
    calculateDistances();
  }, [cities]);

  const calculateDistances = () => {
    const n = cities.length;
    const dist = Array(n).fill(0).map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          const dx = cities[i].x - cities[j].x;
          const dy = cities[i].y - cities[j].y;
          dist[i][j] = Math.sqrt(dx * dx + dy * dy);
        }
      }
    }
    
    setDistances(dist);
    reset();
  };

  const reset = () => {
    setBestPath([]);
    setBestCost(Infinity);
    setCurrentPath([]);
    setCurrentCost(0);
    setIsRunning(false);
    setIsPaused(false);
    setExplored(0);
    setLog(['Algorithm initialized', `Cities: ${cities.length}`, 'Using branch and bound approach']);
  };

  const tspBranchBound = async (path, visited, cost, newLog) => {
    if (path.length === cities.length) {
      const returnCost = cost + distances[path[path.length - 1]][path[0]];
      setCurrentPath([...path, path[0]]);
      setCurrentCost(returnCost);
      
      if (returnCost < bestCost) {
        setBestPath([...path, path[0]]);
        setBestCost(returnCost);
        newLog.push(`✓ New best path found: ${returnCost.toFixed(2)}`);
      }
      
      setExplored(prev => prev + 1);
      setLog([...newLog]);
      await new Promise(resolve => setTimeout(resolve, speed));
      return;
    }

    for (let i = 0; i < cities.length; i++) {
      while (isPaused) await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!visited[i]) {
        const newCost = path.length > 0 ? cost + distances[path[path.length - 1]][i] : 0;
        
        if (newCost < bestCost) {
          const newPath = [...path, i];
          const newVisited = [...visited];
          newVisited[i] = true;
          
          setCurrentPath(newPath);
          setCurrentCost(newCost);
          newLog.push(`Exploring: ${newPath.map(idx => cities[idx].name).join('→')} (cost: ${newCost.toFixed(2)})`);
          setLog([...newLog]);
          await new Promise(resolve => setTimeout(resolve, speed / 2));
          
          await tspBranchBound(newPath, newVisited, newCost, newLog);
        }
      }
    }
  };

  const runTSP = async () => {
    setIsRunning(true);
    setIsPaused(false);
    setBestCost(Infinity);
    
    const newLog = [...log];
    const visited = Array(cities.length).fill(false);
    visited[0] = true;
    
    await tspBranchBound([0], visited, 0, newLog);
    
    setCurrentPath([]);
    setIsRunning(false);
    newLog.push(`Algorithm completed!`);
    newLog.push(`Best path: ${bestPath.map(idx => cities[idx].name).join('→')}`);
    newLog.push(`Total distance: ${bestCost.toFixed(2)}`);
    setLog([...newLog]);
  };

  const togglePause = () => setIsPaused(!isPaused);

  const getEdgeColor = (from, to) => {
    if (bestPath.length > 0) {
      for (let i = 0; i < bestPath.length - 1; i++) {
        if ((bestPath[i] === from && bestPath[i + 1] === to) || 
            (bestPath[i] === to && bestPath[i + 1] === from)) {
          return '#10B981';
        }
      }
    }
    if (currentPath.length > 0) {
      for (let i = 0; i < currentPath.length - 1; i++) {
        if ((currentPath[i] === from && currentPath[i + 1] === to) || 
            (currentPath[i] === to && currentPath[i + 1] === from)) {
          return '#F59E0B';
        }
      }
    }
    return '#E5E7EB';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-cyan-800 mb-2">Travelling Salesman Problem (TSP)</h1>
          <p className="text-cyan-600">Find shortest route visiting all cities using branch and bound</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">City Map</h2>
            
            <div className="relative bg-gray-50 rounded-lg p-4 h-96">
              <svg width="100%" height="100%" viewBox="0 0 500 400">
                {/* All edges (light) */}
                {cities.map((city1, i) => 
                  cities.slice(i + 1).map((city2, j) => {
                    const idx2 = i + j + 1;
                    return (
                      <line
                        key={`${i}-${idx2}`}
                        x1={city1.x}
                        y1={city1.y}
                        x2={city2.x}
                        y2={city2.y}
                        stroke={getEdgeColor(i, idx2)}
                        strokeWidth={getEdgeColor(i, idx2) === '#E5E7EB' ? 1 : 3}
                        opacity={getEdgeColor(i, idx2) === '#E5E7EB' ? 0.3 : 1}
                      />
                    );
                  })
                )}

                {/* Cities */}
                {cities.map((city, idx) => (
                  <g key={city.id}>
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r="20"
                      fill={idx === 0 ? '#06B6D4' : currentPath.includes(idx) ? '#FCD34D' : '#E5E7EB'}
                      stroke="#0E7490"
                      strokeWidth="3"
                    />
                    <text
                      x={city.x}
                      y={city.y + 5}
                      textAnchor="middle"
                      className="text-sm font-bold"
                      fill="#374151"
                    >
                      {city.name}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={runTSP} disabled={isRunning} className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50">
                {isRunning ? 'Running...' : 'Start TSP'}
              </button>
              {isRunning && <button onClick={togglePause} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">{isPaused ? 'Resume' : 'Pause'}</button>}
              <button onClick={reset} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Reset</button>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Speed:</label>
                <input type="range" min="200" max="1500" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-20" />
              </div>
              <a href="/branchandbound" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">← Back</a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {bestPath.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Best Solution</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-cyan-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Shortest Distance:</div>
                    <div className="text-3xl font-bold text-cyan-600">{bestCost.toFixed(2)}</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">Best Path:</div>
                    <div className="flex flex-wrap gap-2">
                      {bestPath.map((idx, i) => (
                        <React.Fragment key={i}>
                          <span className="px-3 py-1 bg-green-500 text-white rounded font-semibold">
                            {cities[idx].name}
                          </span>
                          {i < bestPath.length - 1 && <span className="text-gray-400">→</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentPath.length > 0 && isRunning && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Exploration</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-yellow-50 rounded">
                    <div className="text-sm text-gray-600">Current Path:</div>
                    <div className="font-mono text-yellow-700">
                      {currentPath.map(idx => cities[idx].name).join(' → ')}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-sm text-gray-600">Current Cost:</div>
                    <div className="font-bold text-gray-800">{currentCost.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-gray-600">Cities</div>
                  <div className="text-xl font-bold text-gray-800">{cities.length}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-gray-600">Paths Explored</div>
                  <div className="text-xl font-bold text-gray-800">{explored}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Cities</h3>
              <div className="space-y-2">
                {cities.map((city, idx) => (
                  <div
                    key={city.id}
                    className={`p-2 rounded flex justify-between ${
                      idx === 0 ? 'bg-cyan-100' :
                      bestPath.includes(idx) ? 'bg-green-50' :
                      'bg-gray-50'
                    }`}
                  >
                    <span className="font-bold">{city.name}</span>
                    <span className="text-sm text-gray-600">
                      {idx === 0 ? '(Start)' : `(${city.x}, ${city.y})`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Algorithm Log</h3>
              <div className="space-y-1 max-h-64 overflow-y-auto text-sm">
                {log.slice(-20).map((entry, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded ${
                      entry.includes('✓') ? 'text-green-700 bg-green-50' :
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
                <p><strong>Time Complexity:</strong> O(n!)</p>
                <p><strong>Space Complexity:</strong> O(n)</p>
                <p><strong>Approach:</strong> Branch and Bound</p>
                <p><strong>Use Case:</strong> Route optimization, logistics</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TravellingSalesmanProblemVisualize;
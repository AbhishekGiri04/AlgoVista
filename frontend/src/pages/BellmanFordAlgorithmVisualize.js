import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BellmanFordAlgorithmVisualize = () => {
  const [vertices, setVertices] = useState([
    { id: 0, x: 150, y: 200, label: 'A' },
    { id: 1, x: 300, y: 100, label: 'B' },
    { id: 2, x: 300, y: 300, label: 'C' },
    { id: 3, x: 450, y: 200, label: 'D' }
  ]);

  const [edges] = useState([
    { from: 0, to: 1, weight: 4, id: 'AB' },
    { from: 0, to: 2, weight: 5, id: 'AC' },
    { from: 1, to: 3, weight: 3, id: 'BD' },
    { from: 2, to: 1, weight: -6, id: 'CB' },
    { from: 2, to: 3, weight: 2, id: 'CD' }
  ]);

  const [startVertex, setStartVertex] = useState(0);
  const [distances, setDistances] = useState({});
  const [currentEdge, setCurrentEdge] = useState(null);
  const [relaxedEdges, setRelaxedEdges] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [iteration, setIteration] = useState(0);
  const [hasNegativeCycle, setHasNegativeCycle] = useState(false);
  const [log, setLog] = useState([]);

  useEffect(() => {
    reset();
  }, [startVertex]);

  const reset = () => {
    const dist = {};
    vertices.forEach(v => dist[v.id] = v.id === startVertex ? 0 : Infinity);
    setDistances(dist);
    setCurrentEdge(null);
    setRelaxedEdges([]);
    setIsRunning(false);
    setIsPaused(false);
    setIteration(0);
    setHasNegativeCycle(false);
    setLog(['Algorithm initialized', `Starting from vertex ${vertices[startVertex].label}`]);
  };

  const runBellmanFord = async () => {
    setIsRunning(true);
    setIsPaused(false);
    
    const dist = { ...distances };
    const newLog = [...log];
    const relaxed = [];

    // Relax edges V-1 times
    for (let i = 0; i < vertices.length - 1; i++) {
      if (!isRunning) break;
      
      setIteration(i + 1);
      newLog.push(`--- Iteration ${i + 1} ---`);
      setLog([...newLog]);

      for (const edge of edges) {
        while (isPaused) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        setCurrentEdge(edge);
        await new Promise(resolve => setTimeout(resolve, speed));

        if (dist[edge.from] !== Infinity && dist[edge.from] + edge.weight < dist[edge.to]) {
          dist[edge.to] = dist[edge.from] + edge.weight;
          relaxed.push(edge);
          newLog.push(`✓ Relaxed ${edge.id}: distance to ${vertices[edge.to].label} = ${dist[edge.to]}`);
          setDistances({ ...dist });
          setRelaxedEdges([...relaxed]);
          setLog([...newLog]);
        } else {
          newLog.push(`✗ No relaxation for ${edge.id}`);
          setLog([...newLog]);
        }

        await new Promise(resolve => setTimeout(resolve, speed / 2));
      }
      setCurrentEdge(null);
    }

    // Check for negative cycle
    newLog.push('--- Checking for negative cycles ---');
    setLog([...newLog]);
    
    for (const edge of edges) {
      if (dist[edge.from] !== Infinity && dist[edge.from] + edge.weight < dist[edge.to]) {
        setHasNegativeCycle(true);
        newLog.push('⚠️ Negative cycle detected!');
        setLog([...newLog]);
        setIsRunning(false);
        return;
      }
    }

    newLog.push('✓ No negative cycles found');
    newLog.push('Algorithm completed!');
    setLog([...newLog]);
    setIsRunning(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const getEdgeColor = (edge) => {
    if (currentEdge?.id === edge.id) return '#F59E0B';
    if (relaxedEdges.some(e => e.id === edge.id)) return '#10B981';
    if (edge.weight < 0) return '#EF4444';
    return '#6B7280';
  };

  const getEdgeWidth = (edge) => {
    if (currentEdge?.id === edge.id) return 3;
    if (relaxedEdges.some(e => e.id === edge.id)) return 3;
    return 2;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-red-800 mb-2">
            Bellman-Ford Algorithm
          </h1>
          <p className="text-red-600">Shortest path with negative weight detection</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Graph Visualization</h2>

            <div className="relative bg-gray-50 rounded-lg p-4 h-96">
              <svg width="100%" height="100%" viewBox="0 0 600 400">
                {edges.map((edge) => {
                  const fromVertex = vertices[edge.from];
                  const toVertex = vertices[edge.to];
                  const midX = (fromVertex.x + toVertex.x) / 2;
                  const midY = (fromVertex.y + toVertex.y) / 2;
                  const angle = Math.atan2(toVertex.y - fromVertex.y, toVertex.x - fromVertex.x);
                  const arrowX = toVertex.x - 25 * Math.cos(angle);
                  const arrowY = toVertex.y - 25 * Math.sin(angle);
                  
                  return (
                    <g key={edge.id}>
                      <defs>
                        <marker
                          id={`arrow-${edge.id}`}
                          markerWidth="10"
                          markerHeight="10"
                          refX="9"
                          refY="3"
                          orient="auto"
                          markerUnits="strokeWidth"
                        >
                          <path d="M0,0 L0,6 L9,3 z" fill={getEdgeColor(edge)} />
                        </marker>
                      </defs>
                      <line
                        x1={fromVertex.x}
                        y1={fromVertex.y}
                        x2={arrowX}
                        y2={arrowY}
                        stroke={getEdgeColor(edge)}
                        strokeWidth={getEdgeWidth(edge)}
                        markerEnd={`url(#arrow-${edge.id})`}
                      />
                      <circle
                        cx={midX}
                        cy={midY}
                        r="14"
                        fill="white"
                        stroke={getEdgeColor(edge)}
                        strokeWidth="2"
                      />
                      <text
                        x={midX}
                        y={midY + 4}
                        textAnchor="middle"
                        className="text-xs font-bold"
                        fill={getEdgeColor(edge)}
                      >
                        {edge.weight}
                      </text>
                    </g>
                  );
                })}

                {vertices.map((vertex) => (
                  <g key={vertex.id}>
                    <circle
                      cx={vertex.x}
                      cy={vertex.y}
                      r="22"
                      fill={vertex.id === startVertex ? '#FEE2E2' : '#E5E7EB'}
                      stroke={vertex.id === startVertex ? '#DC2626' : '#6B7280'}
                      strokeWidth="3"
                    />
                    <text
                      x={vertex.x}
                      y={vertex.y - 5}
                      textAnchor="middle"
                      className="text-sm font-bold"
                      fill="#374151"
                    >
                      {vertex.label}
                    </text>
                    <text
                      x={vertex.x}
                      y={vertex.y + 10}
                      textAnchor="middle"
                      className="text-xs"
                      fill="#DC2626"
                    >
                      {distances[vertex.id] === Infinity ? '∞' : distances[vertex.id]}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <select
                value={startVertex}
                onChange={(e) => setStartVertex(Number(e.target.value))}
                disabled={isRunning}
                className="px-4 py-2 border rounded-lg"
              >
                {vertices.map((v) => (
                  <option key={v.id} value={v.id}>Start: {v.label}</option>
                ))}
              </select>

              <button
                onClick={runBellmanFord}
                disabled={isRunning}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                {isRunning ? 'Running...' : 'Start Bellman-Ford'}
              </button>
              
              {isRunning && (
                <button
                  onClick={togglePause}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
              )}
              
              <button
                onClick={reset}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Reset
              </button>
              
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Speed:</label>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-20"
                />
              </div>
              
              <a
                href="/graphalgorithms"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                ← Back
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Iteration</span>
                    <span>{iteration}/{vertices.length - 1}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(iteration / (vertices.length - 1)) * 100}%` }}
                    />
                  </div>
                </div>
                {hasNegativeCycle && (
                  <div className="p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm">
                    ⚠️ Negative cycle detected!
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Distance Table</h3>
              <div className="space-y-2">
                {vertices.map((vertex) => (
                  <div key={vertex.id} className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium">{vertex.label}</span>
                    <span className={`font-bold ${distances[vertex.id] === Infinity ? 'text-gray-400' : 'text-red-600'}`}>
                      {distances[vertex.id] === Infinity ? '∞' : distances[vertex.id]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Algorithm Log</h3>
              <div className="space-y-1 max-h-64 overflow-y-auto text-sm">
                {log.map((entry, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded ${
                      entry.includes('✓') ? 'text-green-700 bg-green-50' :
                      entry.includes('✗') ? 'text-gray-600 bg-gray-50' :
                      entry.includes('⚠️') ? 'text-red-700 bg-red-50' :
                      entry.includes('---') ? 'text-blue-700 bg-blue-50 font-semibold' :
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
                <p><strong>Time Complexity:</strong> O(V × E)</p>
                <p><strong>Space Complexity:</strong> O(V)</p>
                <p><strong>Approach:</strong> Dynamic Programming</p>
                <p><strong>Use Case:</strong> Negative weights, cycle detection</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BellmanFordAlgorithmVisualize;
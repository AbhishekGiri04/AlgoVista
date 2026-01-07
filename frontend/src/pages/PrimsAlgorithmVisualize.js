import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const PrimsAlgorithmVisualize = () => {
  const [vertices, setVertices] = useState([
    { id: 0, x: 150, y: 100, label: 'A' },
    { id: 1, x: 350, y: 100, label: 'B' },
    { id: 2, x: 250, y: 200, label: 'C' },
    { id: 3, x: 150, y: 300, label: 'D' },
    { id: 4, x: 350, y: 300, label: 'E' }
  ]);

  const [edges] = useState([
    { from: 0, to: 1, weight: 4, id: 'AB' },
    { from: 0, to: 2, weight: 2, id: 'AC' },
    { from: 1, to: 2, weight: 1, id: 'BC' },
    { from: 1, to: 4, weight: 5, id: 'BE' },
    { from: 2, to: 3, weight: 3, id: 'CD' },
    { from: 2, to: 4, weight: 6, id: 'CE' },
    { from: 3, to: 4, weight: 2, id: 'DE' }
  ]);

  const [startVertex, setStartVertex] = useState(0);
  const [mstEdges, setMstEdges] = useState([]);
  const [visitedVertices, setVisitedVertices] = useState(new Set());
  const [currentEdge, setCurrentEdge] = useState(null);
  const [candidateEdges, setCandidateEdges] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [step, setStep] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [log, setLog] = useState([]);

  useEffect(() => {
    reset();
  }, []);

  const reset = () => {
    setMstEdges([]);
    setVisitedVertices(new Set());
    setCurrentEdge(null);
    setCandidateEdges([]);
    setIsRunning(false);
    setIsPaused(false);
    setStep(0);
    setTotalWeight(0);
    setLog(['Algorithm initialized', `Starting from vertex ${vertices[startVertex].label}`]);
  };

  const runPrims = async () => {
    setIsRunning(true);
    setIsPaused(false);
    
    const visited = new Set([startVertex]);
    const newMstEdges = [];
    const newLog = [...log];
    let weight = 0;

    setVisitedVertices(new Set(visited));
    newLog.push(`✓ Added vertex ${vertices[startVertex].label} to MST`);
    setLog([...newLog]);

    await new Promise(resolve => setTimeout(resolve, speed));

    while (visited.size < vertices.length) {
      if (!isRunning) break;
      
      while (isPaused) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Find all candidate edges
      const candidates = edges.filter(edge => 
        (visited.has(edge.from) && !visited.has(edge.to)) ||
        (visited.has(edge.to) && !visited.has(edge.from))
      );

      setCandidateEdges(candidates);
      newLog.push(`Found ${candidates.length} candidate edges`);
      setLog([...newLog]);

      await new Promise(resolve => setTimeout(resolve, speed / 2));

      if (candidates.length === 0) break;

      // Find minimum weight edge
      const minEdge = candidates.reduce((min, edge) => 
        edge.weight < min.weight ? edge : min
      );

      setCurrentEdge(minEdge);
      newLog.push(`→ Considering edge ${minEdge.id} (weight: ${minEdge.weight})`);
      setLog([...newLog]);

      await new Promise(resolve => setTimeout(resolve, speed));

      // Add edge to MST
      const newVertex = visited.has(minEdge.from) ? minEdge.to : minEdge.from;
      visited.add(newVertex);
      newMstEdges.push(minEdge);
      weight += minEdge.weight;

      setVisitedVertices(new Set(visited));
      setMstEdges([...newMstEdges]);
      setTotalWeight(weight);
      setCurrentEdge(null);
      setCandidateEdges([]);
      
      newLog.push(`✓ Added edge ${minEdge.id} and vertex ${vertices[newVertex].label} to MST`);
      setLog([...newLog]);
      setStep(visited.size);

      await new Promise(resolve => setTimeout(resolve, speed));
    }

    setIsRunning(false);
    newLog.push(`MST completed! Total weight: ${weight}`);
    setLog([...newLog]);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const getEdgeColor = (edge) => {
    if (mstEdges.some(mst => mst.id === edge.id)) return '#8B5CF6';
    if (currentEdge?.id === edge.id) return '#F59E0B';
    if (candidateEdges.some(c => c.id === edge.id)) return '#EC4899';
    return '#6B7280';
  };

  const getEdgeWidth = (edge) => {
    if (mstEdges.some(mst => mst.id === edge.id)) return 4;
    if (currentEdge?.id === edge.id) return 3;
    return 2;
  };

  const getVertexColor = (vertex) => {
    if (visitedVertices.has(vertex.id)) return { fill: '#DDD6FE', stroke: '#7C3AED' };
    return { fill: '#E5E7EB', stroke: '#6B7280' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-purple-800 mb-2">
            Prim's Algorithm - Minimum Spanning Tree
          </h1>
          <p className="text-purple-600">Greedy MST construction from starting vertex</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visualization Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Graph Visualization</h2>
              <div className="text-sm text-gray-600">
                MST Weight: <span className="font-bold text-purple-600">{totalWeight}</span>
              </div>
            </div>

            <div className="relative bg-gray-50 rounded-lg p-4 h-96">
              <svg width="100%" height="100%" viewBox="0 0 500 400">
                {/* Edges */}
                {edges.map((edge) => {
                  const fromVertex = vertices[edge.from];
                  const toVertex = vertices[edge.to];
                  const midX = (fromVertex.x + toVertex.x) / 2;
                  const midY = (fromVertex.y + toVertex.y) / 2;
                  
                  return (
                    <g key={edge.id}>
                      <motion.line
                        x1={fromVertex.x}
                        y1={fromVertex.y}
                        x2={toVertex.x}
                        y2={toVertex.y}
                        stroke={getEdgeColor(edge)}
                        strokeWidth={getEdgeWidth(edge)}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <circle
                        cx={midX}
                        cy={midY}
                        r="12"
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

                {/* Vertices */}
                {vertices.map((vertex) => {
                  const colors = getVertexColor(vertex);
                  return (
                    <g key={vertex.id}>
                      <motion.circle
                        cx={vertex.x}
                        cy={vertex.y}
                        r="20"
                        fill={colors.fill}
                        stroke={colors.stroke}
                        strokeWidth="3"
                        whileHover={{ scale: 1.1 }}
                      />
                      <text
                        x={vertex.x}
                        y={vertex.y + 5}
                        textAnchor="middle"
                        className="text-sm font-bold"
                        fill={colors.stroke}
                      >
                        {vertex.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Controls */}
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
                onClick={runPrims}
                disabled={isRunning}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
              >
                {isRunning ? 'Running...' : 'Start Prim\'s'}
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

          {/* Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Progress */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Vertices Added</span>
                    <span>{step}/{vertices.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(step / vertices.length) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  MST Edges: <span className="font-bold text-purple-600">{mstEdges.length}</span>
                </div>
              </div>
            </div>

            {/* Candidate Edges */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Candidate Edges</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {candidateEdges.length === 0 ? (
                  <div className="text-sm text-gray-500 italic">No candidates</div>
                ) : (
                  candidateEdges.map((edge) => (
                    <div
                      key={edge.id}
                      className={`p-2 rounded text-sm ${
                        currentEdge?.id === edge.id
                          ? 'bg-yellow-100 border-l-4 border-yellow-500'
                          : 'bg-pink-50'
                      }`}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{edge.id}</span>
                        <span className="text-gray-600">Weight: {edge.weight}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Algorithm Log */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Algorithm Log</h3>
              <div className="space-y-1 max-h-48 overflow-y-auto text-sm">
                {log.map((entry, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded ${
                      entry.includes('✓') ? 'text-green-700 bg-green-50' :
                      entry.includes('→') ? 'text-yellow-700 bg-yellow-50' :
                      'text-gray-700'
                    }`}
                  >
                    {entry}
                  </div>
                ))}
              </div>
            </div>

            {/* Algorithm Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Algorithm Info</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Time Complexity:</strong> O(E log V)</p>
                <p><strong>Space Complexity:</strong> O(V)</p>
                <p><strong>Approach:</strong> Greedy with Priority Queue</p>
                <p><strong>Use Case:</strong> Network design, clustering</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PrimsAlgorithmVisualize;
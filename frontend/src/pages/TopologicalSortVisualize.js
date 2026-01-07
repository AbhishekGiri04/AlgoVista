import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TopologicalSortVisualize = () => {
  const [vertices] = useState([
    { id: 0, x: 100, y: 100, label: 'A' },
    { id: 1, x: 250, y: 100, label: 'B' },
    { id: 2, x: 400, y: 100, label: 'C' },
    { id: 3, x: 175, y: 250, label: 'D' },
    { id: 4, x: 325, y: 250, label: 'E' }
  ]);

  const [edges] = useState([
    { from: 0, to: 1 }, { from: 0, to: 3 },
    { from: 1, to: 2 }, { from: 1, to: 4 },
    { from: 3, to: 4 }, { from: 4, to: 2 }
  ]);

  const [visited, setVisited] = useState(new Set());
  const [stack, setStack] = useState([]);
  const [result, setResult] = useState([]);
  const [currentVertex, setCurrentVertex] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [log, setLog] = useState([]);

  useEffect(() => {
    reset();
  }, []);

  const reset = () => {
    setVisited(new Set());
    setStack([]);
    setResult([]);
    setCurrentVertex(null);
    setIsRunning(false);
    setIsPaused(false);
    setLog(['Algorithm initialized', 'Using DFS-based approach']);
  };

  const getAdjList = () => {
    const adj = {};
    vertices.forEach(v => adj[v.id] = []);
    edges.forEach(e => adj[e.from].push(e.to));
    return adj;
  };

  const dfs = async (v, vis, stk, adj, newLog) => {
    vis.add(v);
    setVisited(new Set(vis));
    setCurrentVertex(v);
    newLog.push(`Visiting vertex ${vertices[v].label}`);
    setLog([...newLog]);
    await new Promise(resolve => setTimeout(resolve, speed));

    for (const neighbor of adj[v]) {
      while (isPaused) await new Promise(resolve => setTimeout(resolve, 100));
      if (!vis.has(neighbor)) {
        await dfs(neighbor, vis, stk, adj, newLog);
      }
    }

    stk.push(v);
    setStack([...stk]);
    newLog.push(`Added ${vertices[v].label} to stack`);
    setLog([...newLog]);
    await new Promise(resolve => setTimeout(resolve, speed / 2));
  };

  const runTopologicalSort = async () => {
    setIsRunning(true);
    setIsPaused(false);
    
    const vis = new Set();
    const stk = [];
    const adj = getAdjList();
    const newLog = [...log];

    for (const vertex of vertices) {
      if (!vis.has(vertex.id)) {
        await dfs(vertex.id, vis, stk, adj, newLog);
      }
    }

    const res = stk.reverse();
    setResult(res);
    setCurrentVertex(null);
    setIsRunning(false);
    newLog.push(`Topological Order: ${res.map(id => vertices[id].label).join(' → ')}`);
    setLog([...newLog]);
  };

  const togglePause = () => setIsPaused(!isPaused);

  const getVertexColor = (v) => {
    if (v.id === currentVertex) return { fill: '#FEF3C7', stroke: '#F59E0B' };
    if (visited.has(v.id)) return { fill: '#DBEAFE', stroke: '#3B82F6' };
    return { fill: '#E5E7EB', stroke: '#6B7280' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">Topological Sort</h1>
          <p className="text-blue-600">Order vertices linearly using DFS</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">DAG Visualization</h2>
            
            <div className="relative bg-gray-50 rounded-lg p-4 h-96">
              <svg width="100%" height="100%" viewBox="0 0 500 350">
                {edges.map((edge, idx) => {
                  const from = vertices[edge.from];
                  const to = vertices[edge.to];
                  const angle = Math.atan2(to.y - from.y, to.x - from.x);
                  const endX = to.x - 25 * Math.cos(angle);
                  const endY = to.y - 25 * Math.sin(angle);
                  return (
                    <g key={idx}>
                      <defs>
                        <marker id={`arrow-${idx}`} markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                          <path d="M0,0 L0,6 L9,3 z" fill="#6B7280" />
                        </marker>
                      </defs>
                      <line x1={from.x} y1={from.y} x2={endX} y2={endY} stroke="#6B7280" strokeWidth="2" markerEnd={`url(#arrow-${idx})`} />
                    </g>
                  );
                })}
                {vertices.map((v) => {
                  const colors = getVertexColor(v);
                  return (
                    <g key={v.id}>
                      <circle cx={v.x} cy={v.y} r="22" fill={colors.fill} stroke={colors.stroke} strokeWidth="3" />
                      <text x={v.x} y={v.y + 5} textAnchor="middle" className="text-sm font-bold" fill="#374151">{v.label}</text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={runTopologicalSort} disabled={isRunning} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">
                {isRunning ? 'Running...' : 'Start Topological Sort'}
              </button>
              {isRunning && <button onClick={togglePause} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">{isPaused ? 'Resume' : 'Pause'}</button>}
              <button onClick={reset} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Reset</button>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Speed:</label>
                <input type="range" min="200" max="2000" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-20" />
              </div>
              <a href="/graphalgorithms" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">← Back</a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {result.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Topological Order</h3>
                <div className="flex flex-wrap gap-2">
                  {result.map((id, idx) => (
                    <React.Fragment key={id}>
                      <span className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold">{vertices[id].label}</span>
                      {idx < result.length - 1 && <span className="text-gray-400 text-2xl">→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">DFS Stack</h3>
              <div className="space-y-2">
                {stack.length === 0 ? <div className="text-gray-500 italic">Stack empty</div> : 
                  stack.slice().reverse().map((id, idx) => (
                    <div key={idx} className="p-2 bg-blue-100 rounded text-center font-semibold">{vertices[id].label}</div>
                  ))
                }
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Algorithm Log</h3>
              <div className="space-y-1 max-h-64 overflow-y-auto text-sm">
                {log.map((entry, idx) => (
                  <div key={idx} className="p-2 rounded text-gray-700">{entry}</div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Algorithm Info</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Time Complexity:</strong> O(V + E)</p>
                <p><strong>Space Complexity:</strong> O(V)</p>
                <p><strong>Approach:</strong> DFS-based</p>
                <p><strong>Use Case:</strong> Task scheduling, dependencies</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TopologicalSortVisualize;
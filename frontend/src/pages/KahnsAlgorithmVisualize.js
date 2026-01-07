import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const KahnsAlgorithmVisualize = () => {
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

  const [inDegree, setInDegree] = useState({});
  const [queue, setQueue] = useState([]);
  const [result, setResult] = useState([]);
  const [currentVertex, setCurrentVertex] = useState(null);
  const [processed, setProcessed] = useState(new Set());
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [log, setLog] = useState([]);

  useEffect(() => {
    reset();
  }, []);

  const reset = () => {
    const deg = {};
    vertices.forEach(v => deg[v.id] = 0);
    edges.forEach(e => deg[e.to]++);
    setInDegree(deg);
    setQueue([]);
    setResult([]);
    setCurrentVertex(null);
    setProcessed(new Set());
    setIsRunning(false);
    setIsPaused(false);
    setLog(['Algorithm initialized', 'Calculated in-degrees', 'Using BFS-based approach']);
  };

  const getAdjList = () => {
    const adj = {};
    vertices.forEach(v => adj[v.id] = []);
    edges.forEach(e => adj[e.from].push(e.to));
    return adj;
  };

  const runKahns = async () => {
    setIsRunning(true);
    setIsPaused(false);
    
    const deg = { ...inDegree };
    const q = vertices.filter(v => deg[v.id] === 0).map(v => v.id);
    const res = [];
    const adj = getAdjList();
    const newLog = [...log];

    setQueue([...q]);
    newLog.push(`Initial queue: ${q.map(id => vertices[id].label).join(', ')}`);
    setLog([...newLog]);
    await new Promise(resolve => setTimeout(resolve, speed));

    while (q.length > 0) {
      while (isPaused) await new Promise(resolve => setTimeout(resolve, 100));

      const curr = q.shift();
      setQueue([...q]);
      setCurrentVertex(curr);
      res.push(curr);
      setResult([...res]);
      
      newLog.push(`Dequeued ${vertices[curr].label}`);
      setLog([...newLog]);
      await new Promise(resolve => setTimeout(resolve, speed));

      for (const neighbor of adj[curr]) {
        deg[neighbor]--;
        setInDegree({ ...deg });
        newLog.push(`Reduced in-degree of ${vertices[neighbor].label} to ${deg[neighbor]}`);
        setLog([...newLog]);

        if (deg[neighbor] === 0) {
          q.push(neighbor);
          setQueue([...q]);
          newLog.push(`Added ${vertices[neighbor].label} to queue`);
          setLog([...newLog]);
        }
        await new Promise(resolve => setTimeout(resolve, speed / 2));
      }

      processed.add(curr);
      setProcessed(new Set(processed));
      setCurrentVertex(null);
    }

    setIsRunning(false);
    newLog.push(`Topological Order: ${res.map(id => vertices[id].label).join(' → ')}`);
    setLog([...newLog]);
  };

  const togglePause = () => setIsPaused(!isPaused);

  const getVertexColor = (v) => {
    if (v.id === currentVertex) return { fill: '#FEF3C7', stroke: '#F59E0B' };
    if (processed.has(v.id)) return { fill: '#D1FAE5', stroke: '#10B981' };
    if (queue.includes(v.id)) return { fill: '#DBEAFE', stroke: '#3B82F6' };
    return { fill: '#E5E7EB', stroke: '#6B7280' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-teal-800 mb-2">Kahn's Algorithm</h1>
          <p className="text-teal-600">Topological sort using BFS and in-degrees</p>
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
                      <text x={v.x} y={v.y - 5} textAnchor="middle" className="text-sm font-bold" fill="#374151">{v.label}</text>
                      <text x={v.x} y={v.y + 10} textAnchor="middle" className="text-xs" fill="#DC2626">deg:{inDegree[v.id]}</text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={runKahns} disabled={isRunning} className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50">
                {isRunning ? 'Running...' : 'Start Kahn\'s'}
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
                      <span className="px-4 py-2 bg-teal-500 text-white rounded-lg font-semibold">{vertices[id].label}</span>
                      {idx < result.length - 1 && <span className="text-gray-400 text-2xl">→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">BFS Queue</h3>
              <div className="flex gap-2">
                {queue.length === 0 ? <div className="text-gray-500 italic">Queue empty</div> : 
                  queue.map((id, idx) => (
                    <div key={idx} className="px-4 py-2 bg-blue-100 rounded font-semibold">{vertices[id].label}</div>
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
                <p><strong>Approach:</strong> BFS with in-degree</p>
                <p><strong>Use Case:</strong> Task scheduling, build systems</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default KahnsAlgorithmVisualize;
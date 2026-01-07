import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const KosarajusAlgorithmVisualize = () => {
  const [vertices] = useState([
    { id: 0, x: 150, y: 100, label: 'A' },
    { id: 1, x: 350, y: 100, label: 'B' },
    { id: 2, x: 250, y: 200, label: 'C' },
    { id: 3, x: 150, y: 300, label: 'D' },
    { id: 4, x: 350, y: 300, label: 'E' }
  ]);

  const [edges] = useState([
    { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 0 },
    { from: 1, to: 3 }, { from: 3, to: 4 }, { from: 4, to: 3 }
  ]);

  const [stack, setStack] = useState([]);
  const [sccs, setSccs] = useState([]);
  const [currentVertex, setCurrentVertex] = useState(null);
  const [visited, setVisited] = useState(new Set());
  const [phase, setPhase] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [log, setLog] = useState([]);

  useEffect(() => {
    reset();
  }, []);

  const reset = () => {
    setStack([]);
    setSccs([]);
    setCurrentVertex(null);
    setVisited(new Set());
    setPhase(0);
    setIsRunning(false);
    setIsPaused(false);
    setLog(['Algorithm initialized', 'Phase 1: Fill order using DFS', 'Phase 2: Process reversed graph']);
  };

  const getAdjList = () => {
    const adj = {};
    vertices.forEach(v => adj[v.id] = []);
    edges.forEach(e => adj[e.from].push(e.to));
    return adj;
  };

  const getReversedAdjList = () => {
    const adj = {};
    vertices.forEach(v => adj[v.id] = []);
    edges.forEach(e => adj[e.to].push(e.from));
    return adj;
  };

  const dfs1 = async (v, vis, stk, adj, newLog) => {
    vis.add(v);
    setVisited(new Set(vis));
    setCurrentVertex(v);
    newLog.push(`Phase 1: Visiting ${vertices[v].label}`);
    setLog([...newLog]);
    await new Promise(resolve => setTimeout(resolve, speed));

    for (const neighbor of adj[v]) {
      while (isPaused) await new Promise(resolve => setTimeout(resolve, 100));
      if (!vis.has(neighbor)) {
        await dfs1(neighbor, vis, stk, adj, newLog);
      }
    }

    stk.push(v);
    setStack([...stk]);
    newLog.push(`Added ${vertices[v].label} to stack`);
    setLog([...newLog]);
  };

  const dfs2 = async (v, vis, scc, adj, newLog) => {
    vis.add(v);
    scc.push(v);
    setVisited(new Set(vis));
    setCurrentVertex(v);
    newLog.push(`Phase 2: Adding ${vertices[v].label} to current SCC`);
    setLog([...newLog]);
    await new Promise(resolve => setTimeout(resolve, speed));

    for (const neighbor of adj[v]) {
      while (isPaused) await new Promise(resolve => setTimeout(resolve, 100));
      if (!vis.has(neighbor)) {
        await dfs2(neighbor, vis, scc, adj, newLog);
      }
    }
  };

  const runKosaraju = async () => {
    setIsRunning(true);
    setIsPaused(false);
    
    const newLog = [...log];
    const adj = getAdjList();
    const revAdj = getReversedAdjList();
    
    // Phase 1
    setPhase(1);
    const vis1 = new Set();
    const stk = [];
    
    for (const vertex of vertices) {
      if (!vis1.has(vertex.id)) {
        await dfs1(vertex.id, vis1, stk, adj, newLog);
      }
    }

    newLog.push('--- Phase 1 Complete ---');
    setLog([...newLog]);
    await new Promise(resolve => setTimeout(resolve, speed));

    // Phase 2
    setPhase(2);
    setVisited(new Set());
    const vis2 = new Set();
    const allSccs = [];

    while (stk.length > 0) {
      const v = stk.pop();
      setStack([...stk]);
      
      if (!vis2.has(v)) {
        const scc = [];
        await dfs2(v, vis2, scc, revAdj, newLog);
        allSccs.push(scc);
        setSccs([...allSccs]);
        newLog.push(`Found SCC: {${scc.map(id => vertices[id].label).join(', ')}}`);
        setLog([...newLog]);
        await new Promise(resolve => setTimeout(resolve, speed));
      }
    }

    setCurrentVertex(null);
    setIsRunning(false);
    newLog.push(`Total SCCs found: ${allSccs.length}`);
    setLog([...newLog]);
  };

  const togglePause = () => setIsPaused(!isPaused);

  const getSccColor = (vId) => {
    const colors = ['#DBEAFE', '#FEE2E2', '#D1FAE5', '#FEF3C7', '#E9D5FF'];
    const idx = sccs.findIndex(scc => scc.includes(vId));
    return idx >= 0 ? colors[idx % colors.length] : '#E5E7EB';
  };

  const getVertexColor = (v) => {
    if (v.id === currentVertex) return { fill: '#FEF3C7', stroke: '#F59E0B' };
    if (sccs.length > 0) return { fill: getSccColor(v.id), stroke: '#374151' };
    if (visited.has(v.id)) return { fill: '#DBEAFE', stroke: '#3B82F6' };
    return { fill: '#E5E7EB', stroke: '#6B7280' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-violet-800 mb-2">Kosaraju's Algorithm</h1>
          <p className="text-violet-600">Find strongly connected components</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Directed Graph</h2>
            
            <div className="relative bg-gray-50 rounded-lg p-4 h-96">
              <svg width="100%" height="100%" viewBox="0 0 500 400">
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
              <button onClick={runKosaraju} disabled={isRunning} className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 disabled:opacity-50">
                {isRunning ? 'Running...' : 'Start Kosaraju\'s'}
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
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Phase</h3>
              <div className="text-2xl font-bold text-violet-600">
                {phase === 0 ? 'Not Started' : phase === 1 ? 'Phase 1: Fill Stack' : 'Phase 2: Find SCCs'}
              </div>
            </div>

            {sccs.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Strongly Connected Components</h3>
                <div className="space-y-2">
                  {sccs.map((scc, idx) => (
                    <div key={idx} className="p-3 rounded" style={{ backgroundColor: getSccColor(scc[0]) }}>
                      <span className="font-semibold">SCC {idx + 1}:</span> {scc.map(id => vertices[id].label).join(', ')}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">DFS Stack</h3>
              <div className="space-y-2">
                {stack.length === 0 ? <div className="text-gray-500 italic">Stack empty</div> : 
                  stack.slice().reverse().map((id, idx) => (
                    <div key={idx} className="p-2 bg-violet-100 rounded text-center font-semibold">{vertices[id].label}</div>
                  ))
                }
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Algorithm Log</h3>
              <div className="space-y-1 max-h-64 overflow-y-auto text-sm">
                {log.map((entry, idx) => (
                  <div key={idx} className={`p-2 rounded ${entry.includes('---') ? 'bg-violet-100 font-semibold' : 'text-gray-700'}`}>{entry}</div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Algorithm Info</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Time Complexity:</strong> O(V + E)</p>
                <p><strong>Space Complexity:</strong> O(V)</p>
                <p><strong>Approach:</strong> Two-pass DFS</p>
                <p><strong>Use Case:</strong> Graph connectivity analysis</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default KosarajusAlgorithmVisualize;
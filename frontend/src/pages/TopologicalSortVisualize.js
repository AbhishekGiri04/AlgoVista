import React, { useState, useEffect } from 'react';

const TopologicalSortVisualize = () => {
  const [graph, setGraph] = useState({
    vertices: ['A', 'B', 'C', 'D', 'E'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'D' },
      { from: 'B', to: 'C' },
      { from: 'B', to: 'E' },
      { from: 'D', to: 'E' },
      { from: 'E', to: 'C' }
    ]
  });

  const [visited, setVisited] = useState(new Set());
  const [stack, setStack] = useState([]);
  const [result, setResult] = useState([]);
  const [currentVertex, setCurrentVertex] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [log, setLog] = useState([]);
  const [newVertex, setNewVertex] = useState('');
  const [fromVertex, setFromVertex] = useState('');
  const [toVertex, setToVertex] = useState('');

  const getVertexPosition = (index, total) => {
    const angle = (index * 2 * Math.PI) / total - Math.PI / 2;
    const radius = 35;
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return { x, y };
  };

  useEffect(() => {
    reset();
  }, []);

  const addToLog = (message) => {
    setLog(prev => [message, ...prev.slice(0, 14)]);
  };

  const reset = () => {
    setVisited(new Set());
    setStack([]);
    setResult([]);
    setCurrentVertex(null);
    setIsRunning(false);
    setLog(['Algorithm initialized', 'Using DFS-based approach']);
  };

  const getAdjList = () => {
    const adj = {};
    graph.vertices.forEach(v => adj[v] = []);
    graph.edges.forEach(e => adj[e.from].push(e.to));
    return adj;
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const dfs = async (v, vis, stk, adj) => {
    vis.add(v);
    setVisited(new Set(vis));
    setCurrentVertex(v);
    addToLog(`Visiting vertex ${v}`);
    await sleep(speed);

    for (const neighbor of adj[v]) {
      if (!vis.has(neighbor)) {
        await dfs(neighbor, vis, stk, adj);
      }
    }

    stk.push(v);
    setStack([...stk]);
    addToLog(`Added ${v} to stack`);
    await sleep(speed / 2);
  };

  const runTopologicalSort = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    const vis = new Set();
    const stk = [];
    const adj = getAdjList();

    for (const vertex of graph.vertices) {
      if (!vis.has(vertex)) {
        await dfs(vertex, vis, stk, adj);
      }
    }

    const res = stk.reverse();
    setResult(res);
    setCurrentVertex(null);
    setIsRunning(false);
    addToLog(`Topological Order: ${res.join(' → ')}`);
  };

  const addVertex = () => {
    const vertex = newVertex.trim().toUpperCase();
    if (!vertex) {
      alert('Please enter a vertex name');
      return;
    }
    if (graph.vertices.includes(vertex)) {
      alert('Vertex already exists!');
      return;
    }
    setGraph(prev => ({
      ...prev,
      vertices: [...prev.vertices, vertex]
    }));
    addToLog(`Added vertex ${vertex}`);
    setNewVertex('');
    reset();
  };

  const removeVertex = () => {
    const vertex = newVertex.trim().toUpperCase();
    if (!graph.vertices.includes(vertex)) {
      alert('Vertex not found!');
      return;
    }
    setGraph(prev => ({
      vertices: prev.vertices.filter(v => v !== vertex),
      edges: prev.edges.filter(e => e.from !== vertex && e.to !== vertex)
    }));
    addToLog(`Removed vertex ${vertex}`);
    setNewVertex('');
    reset();
  };

  const addEdge = () => {
    const from = fromVertex.trim().toUpperCase();
    const to = toVertex.trim().toUpperCase();
    
    if (!from || !to) {
      alert('Please enter both vertices');
      return;
    }
    if (!graph.vertices.includes(from) || !graph.vertices.includes(to)) {
      alert('One or both vertices do not exist!');
      return;
    }
    if (graph.edges.some(e => e.from === from && e.to === to)) {
      alert('Edge already exists!');
      return;
    }
    
    setGraph(prev => ({
      ...prev,
      edges: [...prev.edges, { from, to }]
    }));
    addToLog(`Added edge ${from} → ${to}`);
    setFromVertex('');
    setToVertex('');
    reset();
  };

  const removeEdge = () => {
    const from = fromVertex.trim().toUpperCase();
    const to = toVertex.trim().toUpperCase();
    
    if (!from || !to) {
      alert('Please enter both vertices');
      return;
    }
    
    setGraph(prev => ({
      ...prev,
      edges: prev.edges.filter(e => !(e.from === from && e.to === to))
    }));
    addToLog(`Removed edge ${from} → ${to}`);
    setFromVertex('');
    setToVertex('');
    reset();
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc, #f1f5f9, #e2e8f0)',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Inter, sans-serif',
      color: '#1e293b'
    }}>
      <a href="/graphalgorithms" style={{
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
        ← Back to Graph Algorithms
      </a>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '30px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 12px'
          }}>
            Topological Sort
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#1e293b', margin: '0' }}>
            Order vertices linearly using DFS
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '24px',
            padding: '40px',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '20px' }}>
              DAG Visualization
            </h2>

            <div style={{ position: 'relative', background: '#f8fafc', borderRadius: '12px', padding: '20px', height: '500px' }}>
              <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="#64748b" />
                  </marker>
                </defs>

                {graph.edges.map((edge, idx) => {
                  const fromIdx = graph.vertices.indexOf(edge.from);
                  const toIdx = graph.vertices.indexOf(edge.to);
                  const fromPos = getVertexPosition(fromIdx, graph.vertices.length);
                  const toPos = getVertexPosition(toIdx, graph.vertices.length);
                  
                  const dx = toPos.x - fromPos.x;
                  const dy = toPos.y - fromPos.y;
                  const angle = Math.atan2(dy, dx);
                  const arrowOffset = 6;
                  const endX = toPos.x - (arrowOffset * Math.cos(angle));
                  const endY = toPos.y - (arrowOffset * Math.sin(angle));
                  
                  return (
                    <line
                      key={idx}
                      x1={`${fromPos.x}%`}
                      y1={`${fromPos.y}%`}
                      x2={`${endX}%`}
                      y2={`${endY}%`}
                      stroke="#64748b"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                  );
                })}

                {graph.vertices.map((vertex, idx) => {
                  const pos = getVertexPosition(idx, graph.vertices.length);
                  const isCurrent = vertex === currentVertex;
                  const isVisited = visited.has(vertex);
                  return (
                    <g key={vertex}>
                      <circle
                        cx={`${pos.x}%`}
                        cy={`${pos.y}%`}
                        r="30"
                        fill={isCurrent ? '#fef3c7' : isVisited ? '#dbeafe' : '#e5e7eb'}
                        stroke={isCurrent ? '#f59e0b' : isVisited ? '#3b82f6' : '#6b7280'}
                        strokeWidth="3"
                      />
                      <text
                        x={`${pos.x}%`}
                        y={`${pos.y}%`}
                        textAnchor="middle"
                        dy="6"
                        style={{ fontSize: '18px', fontWeight: '700', fill: '#374151' }}
                      >
                        {vertex}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '20px' }}>
              <button
                onClick={runTopologicalSort}
                disabled={isRunning}
                style={{
                  padding: '12px 24px',
                  background: isRunning ? '#94a3b8' : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: isRunning ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
              >
                {isRunning ? 'Running...' : 'Start Topological Sort'}
              </button>
              
              <button
                onClick={reset}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #64748b, #475569)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(100, 116, 139, 0.3)'
                }}
              >
                Reset
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <label style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>Speed:</label>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  style={{ width: '120px' }}
                />
                <span style={{ fontSize: '14px', color: '#64748b' }}>{speed}ms</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {result.length > 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '16px',
                padding: '24px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
              }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Topological Order</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                  {result.map((vertex, idx) => (
                    <React.Fragment key={vertex}>
                      <span style={{
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                        color: 'white',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>
                        {vertex}
                      </span>
                      {idx < result.length - 1 && <span style={{ color: '#94a3b8', fontSize: '20px' }}>→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: '24px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>DFS Stack</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {stack.length === 0 ? (
                  <div style={{ fontSize: '14px', color: '#94a3b8', fontStyle: 'italic' }}>Stack empty</div>
                ) : (
                  stack.slice().reverse().map((vertex, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px',
                        background: '#dbeafe',
                        borderRadius: '8px',
                        textAlign: 'center',
                        fontWeight: '600',
                        color: '#1e40af'
                      }}
                    >
                      {vertex}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: '24px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Add/Remove Vertex</h3>
              <input
                type="text"
                value={newVertex}
                onChange={(e) => setNewVertex(e.target.value)}
                placeholder="Vertex (e.g., F)"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  marginBottom: '12px'
                }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={addVertex} style={{
                  flex: 1,
                  padding: '10px',
                  background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>Add</button>
                <button onClick={removeVertex} style={{
                  flex: 1,
                  padding: '10px',
                  background: 'linear-gradient(135deg, #64748b, #475569)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>Remove</button>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: '24px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Add/Remove Edge</h3>
              <input
                type="text"
                value={fromVertex}
                onChange={(e) => setFromVertex(e.target.value)}
                placeholder="From (e.g., A)"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  marginBottom: '8px'
                }}
              />
              <input
                type="text"
                value={toVertex}
                onChange={(e) => setToVertex(e.target.value)}
                placeholder="To (e.g., B)"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  marginBottom: '12px'
                }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={addEdge} style={{
                  flex: 1,
                  padding: '10px',
                  background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>Add</button>
                <button onClick={removeEdge} style={{
                  flex: 1,
                  padding: '10px',
                  background: 'linear-gradient(135deg, #64748b, #475569)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>Remove</button>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: '24px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Algorithm Log</h3>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {log.map((entry, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '8px 12px',
                      marginBottom: '6px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      background: entry.includes('Visiting') ? '#dbeafe' : 
                                 entry.includes('Added') ? '#e0e7ff' : '#f1f5f9',
                      color: entry.includes('Visiting') ? '#1e40af' : 
                             entry.includes('Added') ? '#4338ca' : '#475569'
                    }}
                  >
                    {entry}
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: '24px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Algorithm Info</h3>
              <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.8' }}>
                <p style={{ margin: '0 0 8px' }}><strong>Time Complexity:</strong> O(V + E)</p>
                <p style={{ margin: '0 0 8px' }}><strong>Space Complexity:</strong> O(V)</p>
                <p style={{ margin: '0 0 8px' }}><strong>Approach:</strong> DFS-based</p>
                <p style={{ margin: '0' }}><strong>Use Case:</strong> Task scheduling, dependencies</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopologicalSortVisualize;

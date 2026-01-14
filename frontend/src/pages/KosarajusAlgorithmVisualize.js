import React, { useState, useEffect } from 'react';

const KosarajusAlgorithmVisualize = () => {
  const [graph, setGraph] = useState({
    vertices: ['A', 'B', 'C', 'D', 'E'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
      { from: 'B', to: 'D' },
      { from: 'D', to: 'E' },
      { from: 'E', to: 'D' }
    ]
  });

  const [stack, setStack] = useState([]);
  const [sccs, setSccs] = useState([]);
  const [currentVertex, setCurrentVertex] = useState(null);
  const [visited, setVisited] = useState(new Set());
  const [phase, setPhase] = useState('Not Started');
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
    setStack([]);
    setSccs([]);
    setCurrentVertex(null);
    setVisited(new Set());
    setPhase('Not Started');
    setIsRunning(false);
    setLog(['Algorithm initialized', 'Phase 1: Fill order using DFS', 'Phase 2: Process reversed graph']);
  };

  const getAdjList = () => {
    const adj = {};
    graph.vertices.forEach(v => adj[v] = []);
    graph.edges.forEach(e => adj[e.from].push(e.to));
    return adj;
  };

  const getReverseAdjList = () => {
    const adj = {};
    graph.vertices.forEach(v => adj[v] = []);
    graph.edges.forEach(e => adj[e.to].push(e.from));
    return adj;
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const dfs1 = async (v, vis, stk, adj) => {
    vis.add(v);
    setVisited(new Set(vis));
    setCurrentVertex(v);
    addToLog(`Phase 1: Visiting ${v}`);
    await sleep(speed);

    for (const neighbor of adj[v]) {
      if (!vis.has(neighbor)) {
        await dfs1(neighbor, vis, stk, adj);
      }
    }

    stk.push(v);
    setStack([...stk]);
    addToLog(`Phase 1: Added ${v} to stack`);
    await sleep(speed / 2);
  };

  const dfs2 = async (v, vis, scc, adj) => {
    vis.add(v);
    scc.push(v);
    setVisited(new Set(vis));
    setCurrentVertex(v);
    addToLog(`Phase 2: Visiting ${v}`);
    await sleep(speed);

    for (const neighbor of adj[v]) {
      if (!vis.has(neighbor)) {
        await dfs2(neighbor, vis, scc, adj);
      }
    }
  };

  const runKosarajus = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    const adj = getAdjList();
    const revAdj = getReverseAdjList();
    
    // Phase 1: Fill stack with finish times
    setPhase('Phase 1: DFS on original graph');
    addToLog('--- Starting Phase 1 ---');
    const vis1 = new Set();
    const stk = [];

    for (const vertex of graph.vertices) {
      if (!vis1.has(vertex)) {
        await dfs1(vertex, vis1, stk, adj);
      }
    }

    setCurrentVertex(null);
    addToLog('Phase 1 completed');
    await sleep(speed);

    // Phase 2: Process vertices in reverse finish order
    setPhase('Phase 2: DFS on reversed graph');
    addToLog('--- Starting Phase 2 ---');
    const vis2 = new Set();
    const allSccs = [];

    while (stk.length > 0) {
      const v = stk.pop();
      setStack([...stk]);
      
      if (!vis2.has(v)) {
        const scc = [];
        await dfs2(v, vis2, scc, revAdj);
        allSccs.push(scc);
        setSccs([...allSccs]);
        addToLog(`Found SCC: {${scc.join(', ')}}`);
        await sleep(speed);
      }
    }

    setCurrentVertex(null);
    setVisited(new Set());
    setPhase('Completed');
    setIsRunning(false);
    addToLog(`Total SCCs found: ${allSccs.length}`);
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

  const getSccColor = (vertex) => {
    const sccIndex = sccs.findIndex(scc => scc.includes(vertex));
    if (sccIndex === -1) return null;
    const colors = ['#dbeafe', '#fce7f3', '#fef3c7', '#d1fae5', '#e9d5ff'];
    return colors[sccIndex % colors.length];
  };

  const getSccBorder = (vertex) => {
    const sccIndex = sccs.findIndex(scc => scc.includes(vertex));
    if (sccIndex === -1) return null;
    const colors = ['#3b82f6', '#ec4899', '#f59e0b', '#10b981', '#a855f7'];
    return colors[sccIndex % colors.length];
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
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 12px'
          }}>
            Kosaraju's Algorithm
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#1e293b', margin: '0' }}>
            Find strongly connected components
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
              Directed Graph
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
                  const sccColor = getSccColor(vertex);
                  const sccBorder = getSccBorder(vertex);
                  
                  return (
                    <g key={vertex}>
                      <circle
                        cx={`${pos.x}%`}
                        cy={`${pos.y}%`}
                        r="30"
                        fill={isCurrent ? '#fef3c7' : sccColor || '#e5e7eb'}
                        stroke={isCurrent ? '#f59e0b' : sccBorder || '#6b7280'}
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
                onClick={runKosarajus}
                disabled={isRunning}
                style={{
                  padding: '12px 24px',
                  background: isRunning ? '#94a3b8' : 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: isRunning ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                }}
              >
                {isRunning ? 'Running...' : "Start Kosaraju's"}
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
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: '24px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Current Phase</h3>
              <div style={{
                padding: '12px',
                background: phase.includes('Phase 1') ? '#dbeafe' : phase.includes('Phase 2') ? '#fce7f3' : phase === 'Completed' ? '#d1fae5' : '#f1f5f9',
                borderRadius: '8px',
                textAlign: 'center',
                fontWeight: '600',
                color: phase.includes('Phase 1') ? '#1e40af' : phase.includes('Phase 2') ? '#be185d' : phase === 'Completed' ? '#059669' : '#64748b'
              }}>
                {phase}
              </div>
            </div>

            {sccs.length > 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '16px',
                padding: '24px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
              }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>
                  SCCs Found ({sccs.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {sccs.map((scc, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 12px',
                        background: ['#dbeafe', '#fce7f3', '#fef3c7', '#d1fae5', '#e9d5ff'][idx % 5],
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '14px',
                        color: '#1e293b'
                      }}
                    >
                      SCC {idx + 1}: {'{' + scc.join(', ') + '}'}
                    </div>
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
                        background: '#e9d5ff',
                        borderRadius: '8px',
                        textAlign: 'center',
                        fontWeight: '600',
                        color: '#7c3aed'
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
                  background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
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
                  background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
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
                      background: entry.includes('Phase 1') ? '#dbeafe' : 
                                 entry.includes('Phase 2') ? '#fce7f3' : 
                                 entry.includes('Found SCC') ? '#d1fae5' : 
                                 entry.includes('---') ? '#e9d5ff' : '#f1f5f9',
                      color: entry.includes('Phase 1') ? '#1e40af' : 
                             entry.includes('Phase 2') ? '#be185d' : 
                             entry.includes('Found SCC') ? '#059669' : 
                             entry.includes('---') ? '#7c3aed' : '#475569',
                      fontWeight: entry.includes('---') || entry.includes('Found SCC') ? '600' : '400'
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
                <p style={{ margin: '0 0 8px' }}><strong>Approach:</strong> Two-pass DFS</p>
                <p style={{ margin: '0' }}><strong>Use Case:</strong> Graph connectivity analysis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KosarajusAlgorithmVisualize;

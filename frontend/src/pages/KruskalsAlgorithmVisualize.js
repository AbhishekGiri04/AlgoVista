import React, { useState, useEffect } from 'react';

const KruskalsAlgorithmVisualize = () => {
  const [graph, setGraph] = useState({
    vertices: ['A', 'B', 'C', 'D', 'E'],
    edges: [
      { from: 'A', to: 'B', weight: 4 },
      { from: 'A', to: 'C', weight: 2 },
      { from: 'B', to: 'C', weight: 1 },
      { from: 'B', to: 'E', weight: 5 },
      { from: 'C', to: 'D', weight: 3 },
      { from: 'C', to: 'E', weight: 6 },
      { from: 'D', to: 'E', weight: 2 }
    ]
  });

  const [sortedEdges, setSortedEdges] = useState([]);
  const [mstEdges, setMstEdges] = useState([]);
  const [currentEdge, setCurrentEdge] = useState(null);
  const [parent, setParent] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [step, setStep] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [log, setLog] = useState([]);
  const [newVertex, setNewVertex] = useState('');
  const [fromVertex, setFromVertex] = useState('');
  const [toVertex, setToVertex] = useState('');
  const [edgeWeight, setEdgeWeight] = useState('1');

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
    setLog(prev => [message, ...prev.slice(0, 9)]);
  };

  const reset = () => {
    const sorted = [...graph.edges].sort((a, b) => a.weight - b.weight);
    setSortedEdges(sorted);
    setMstEdges([]);
    setCurrentEdge(null);
    const initialParent = {};
    graph.vertices.forEach(v => initialParent[v] = v);
    setParent(initialParent);
    setIsRunning(false);
    setStep(0);
    setTotalWeight(0);
    setLog(['Algorithm initialized', 'Edges sorted by weight']);
  };

  const find = (parentMap, x) => {
    if (parentMap[x] !== x) {
      parentMap[x] = find(parentMap, parentMap[x]);
    }
    return parentMap[x];
  };

  const union = (parentMap, x, y) => {
    const rootX = find(parentMap, x);
    const rootY = find(parentMap, y);
    parentMap[rootX] = rootY;
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const runKruskals = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    const newParent = {...parent};
    const newMstEdges = [];
    let weight = 0;

    addToLog('Starting Kruskal\'s algorithm');

    for (let i = 0; i < sortedEdges.length; i++) {
      const edge = sortedEdges[i];
      setCurrentEdge(edge);
      setStep(i + 1);
      
      await sleep(speed);
      
      const rootFrom = find(newParent, edge.from);
      const rootTo = find(newParent, edge.to);

      if (rootFrom !== rootTo) {
        union(newParent, edge.from, edge.to);
        newMstEdges.push(edge);
        weight += edge.weight;
        addToLog(`Added edge ${edge.from}-${edge.to} (weight: ${edge.weight})`);
        
        setMstEdges([...newMstEdges]);
        setTotalWeight(weight);
        setParent({...newParent});
      } else {
        addToLog(`Rejected edge ${edge.from}-${edge.to} (creates cycle)`);
      }
      
      await sleep(speed / 2);
    }

    setCurrentEdge(null);
    setIsRunning(false);
    addToLog(`MST completed! Total weight: ${weight}`);
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
    const weight = parseInt(edgeWeight) || 1;
    
    if (!from || !to) {
      alert('Please enter both vertices');
      return;
    }
    if (!graph.vertices.includes(from) || !graph.vertices.includes(to)) {
      alert('One or both vertices do not exist!');
      return;
    }
    if (graph.edges.some(e => (e.from === from && e.to === to) || (e.from === to && e.to === from))) {
      alert('Edge already exists!');
      return;
    }
    
    setGraph(prev => ({
      ...prev,
      edges: [...prev.edges, { from, to, weight }]
    }));
    addToLog(`Added edge ${from} - ${to} (weight: ${weight})`);
    setFromVertex('');
    setToVertex('');
    setEdgeWeight('1');
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
      edges: prev.edges.filter(e => !((e.from === from && e.to === to) || (e.from === to && e.to === from)))
    }));
    addToLog(`Removed edge ${from} - ${to}`);
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
            background: 'linear-gradient(135deg, #10b981, #059669)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 12px'
          }}>
            Kruskal's Algorithm - Minimum Spanning Tree
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#1e293b', margin: '0' }}>
            Union-Find based MST construction
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                Graph Visualization
              </h2>
              <div style={{ fontSize: '14px', color: '#64748b' }}>
                MST Weight: <span style={{ fontWeight: '700', color: '#10b981' }}>{totalWeight}</span>
              </div>
            </div>

            <div style={{ position: 'relative', background: '#f8fafc', borderRadius: '12px', padding: '20px', height: '500px' }}>
              <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                {graph.edges.map((edge, idx) => {
                  const fromIdx = graph.vertices.indexOf(edge.from);
                  const toIdx = graph.vertices.indexOf(edge.to);
                  const fromPos = getVertexPosition(fromIdx, graph.vertices.length);
                  const toPos = getVertexPosition(toIdx, graph.vertices.length);
                  const midX = (fromPos.x + toPos.x) / 2;
                  const midY = (fromPos.y + toPos.y) / 2;
                  const isMST = mstEdges.some(e => (e.from === edge.from && e.to === edge.to) || (e.from === edge.to && e.to === edge.from));
                  const isCurrent = currentEdge && ((currentEdge.from === edge.from && currentEdge.to === edge.to) || (currentEdge.from === edge.to && currentEdge.to === edge.from));
                  
                  return (
                    <g key={idx}>
                      <line
                        x1={`${fromPos.x}%`}
                        y1={`${fromPos.y}%`}
                        x2={`${toPos.x}%`}
                        y2={`${toPos.y}%`}
                        stroke={isMST ? '#10b981' : isCurrent ? '#f59e0b' : '#cbd5e1'}
                        strokeWidth={isMST ? '3' : isCurrent ? '3' : '2'}
                      />
                      <circle
                        cx={`${midX}%`}
                        cy={`${midY}%`}
                        r="14"
                        fill="white"
                        stroke={isMST ? '#10b981' : isCurrent ? '#f59e0b' : '#94a3b8'}
                        strokeWidth="2"
                      />
                      <text
                        x={`${midX}%`}
                        y={`${midY}%`}
                        textAnchor="middle"
                        dy="4"
                        style={{ fontSize: '12px', fontWeight: '700', fill: isMST ? '#10b981' : isCurrent ? '#f59e0b' : '#64748b' }}
                      >
                        {edge.weight}
                      </text>
                    </g>
                  );
                })}

                {graph.vertices.map((vertex, idx) => {
                  const pos = getVertexPosition(idx, graph.vertices.length);
                  return (
                    <g key={vertex}>
                      <circle
                        cx={`${pos.x}%`}
                        cy={`${pos.y}%`}
                        r="30"
                        fill="#d1fae5"
                        stroke="#10b981"
                        strokeWidth="3"
                      />
                      <text
                        x={`${pos.x}%`}
                        y={`${pos.y}%`}
                        textAnchor="middle"
                        dy="6"
                        style={{ fontSize: '18px', fontWeight: '700', fill: '#059669' }}
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
                onClick={runKruskals}
                disabled={isRunning}
                style={{
                  padding: '12px 24px',
                  background: isRunning ? '#94a3b8' : 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: isRunning ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
              >
                {isRunning ? 'Running...' : 'Start'}
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
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Progress</h3>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
                  <span>Edges Processed</span>
                  <span>{step}/{sortedEdges.length}</span>
                </div>
                <div style={{ width: '100%', background: '#e2e8f0', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${sortedEdges.length > 0 ? (step / sortedEdges.length) * 100 : 0}%`,
                      background: 'linear-gradient(90deg, #10b981, #059669)',
                      height: '100%',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>
                MST Edges: <span style={{ fontWeight: '700', color: '#10b981' }}>{mstEdges.length}</span>
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
                  background: 'linear-gradient(135deg, #10b981, #059669)',
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
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
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
                  marginBottom: '8px'
                }}
              />
              <input
                type="number"
                value={edgeWeight}
                onChange={(e) => setEdgeWeight(e.target.value)}
                placeholder="Weight"
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
                  background: 'linear-gradient(135deg, #10b981, #059669)',
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
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
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
                      background: entry.includes('Added') ? '#d1fae5' : entry.includes('Rejected') ? '#fee2e2' : '#f1f5f9',
                      color: entry.includes('Added') ? '#059669' : entry.includes('Rejected') ? '#dc2626' : '#475569'
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
                <p style={{ margin: '0 0 8px' }}><strong>Time:</strong> O(E log E)</p>
                <p style={{ margin: '0 0 8px' }}><strong>Space:</strong> O(V)</p>
                <p style={{ margin: '0 0 8px' }}><strong>Approach:</strong> Greedy + Union-Find</p>
                <p style={{ margin: '0' }}><strong>Use:</strong> Network design</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KruskalsAlgorithmVisualize;
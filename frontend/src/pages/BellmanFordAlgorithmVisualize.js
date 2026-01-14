import React, { useState, useEffect } from 'react';

const BellmanFordAlgorithmVisualize = () => {
  const [graph, setGraph] = useState({
    vertices: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B', weight: 4 },
      { from: 'A', to: 'C', weight: 5 },
      { from: 'B', to: 'D', weight: 3 },
      { from: 'C', to: 'B', weight: -6 },
      { from: 'C', to: 'D', weight: 2 }
    ]
  });

  const [startVertex, setStartVertex] = useState('A');
  const [distances, setDistances] = useState({});
  const [currentEdge, setCurrentEdge] = useState(null);
  const [relaxedEdges, setRelaxedEdges] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [iteration, setIteration] = useState(0);
  const [hasNegativeCycle, setHasNegativeCycle] = useState(false);
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
  }, [startVertex]);

  const addToLog = (message) => {
    setLog(prev => [message, ...prev.slice(0, 14)]);
  };

  const reset = () => {
    const dist = {};
    graph.vertices.forEach(v => dist[v] = v === startVertex ? 0 : Infinity);
    setDistances(dist);
    setCurrentEdge(null);
    setRelaxedEdges([]);
    setIsRunning(false);
    setIteration(0);
    setHasNegativeCycle(false);
    setLog(['Algorithm initialized', `Starting from vertex ${startVertex}`]);
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const runBellmanFord = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    const dist = { ...distances };
    const relaxed = [];

    for (let i = 0; i < graph.vertices.length - 1; i++) {
      setIteration(i + 1);
      addToLog(`--- Iteration ${i + 1} ---`);

      for (const edge of graph.edges) {
        setCurrentEdge(edge);
        await sleep(speed);

        if (dist[edge.from] !== Infinity && dist[edge.from] + edge.weight < dist[edge.to]) {
          dist[edge.to] = dist[edge.from] + edge.weight;
          relaxed.push(edge);
          addToLog(`Relaxed ${edge.from}-${edge.to}: distance to ${edge.to} = ${dist[edge.to]}`);
          setDistances({ ...dist });
          setRelaxedEdges([...relaxed]);
        } else {
          addToLog(`No relaxation for ${edge.from}-${edge.to}`);
        }

        await sleep(speed / 2);
      }
      setCurrentEdge(null);
    }

    addToLog('--- Checking for negative cycles ---');
    
    for (const edge of graph.edges) {
      if (dist[edge.from] !== Infinity && dist[edge.from] + edge.weight < dist[edge.to]) {
        setHasNegativeCycle(true);
        addToLog('Negative cycle detected!');
        setIsRunning(false);
        return;
      }
    }

    addToLog('No negative cycles found');
    addToLog('Algorithm completed!');
    setIsRunning(false);
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
    if (startVertex === vertex) setStartVertex(graph.vertices[0]);
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
    if (graph.edges.some(e => e.from === from && e.to === to)) {
      alert('Edge already exists!');
      return;
    }
    
    setGraph(prev => ({
      ...prev,
      edges: [...prev.edges, { from, to, weight }]
    }));
    addToLog(`Added edge ${from} → ${to} (weight: ${weight})`);
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
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 12px'
          }}>
            Bellman-Ford Algorithm
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#1e293b', margin: '0' }}>
            Shortest path with negative weight detection
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
              Graph Visualization
            </h2>

            <div style={{ position: 'relative', background: '#f8fafc', borderRadius: '12px', padding: '20px', height: '500px' }}>
              <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="#64748b" />
                  </marker>
                  <marker id="arrowhead-current" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="#f59e0b" />
                  </marker>
                  <marker id="arrowhead-relaxed" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="#10b981" />
                  </marker>
                  <marker id="arrowhead-negative" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="#ef4444" />
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
                  const distance = Math.sqrt(dx * dx + dy * dy);
                  const arrowOffset = 6;
                  const endX = toPos.x - (arrowOffset * Math.cos(angle));
                  const endY = toPos.y - (arrowOffset * Math.sin(angle));
                  
                  const midX = (fromPos.x + toPos.x) / 2;
                  const midY = (fromPos.y + toPos.y) / 2;
                  
                  const isRelaxed = relaxedEdges.some(e => e.from === edge.from && e.to === edge.to);
                  const isCurrent = currentEdge && currentEdge.from === edge.from && currentEdge.to === edge.to;
                  const isNegative = edge.weight < 0;
                  
                  let strokeColor = '#cbd5e1';
                  let markerEnd = 'url(#arrowhead)';
                  
                  if (isCurrent) {
                    strokeColor = '#f59e0b';
                    markerEnd = 'url(#arrowhead-current)';
                  } else if (isRelaxed) {
                    strokeColor = '#10b981';
                    markerEnd = 'url(#arrowhead-relaxed)';
                  } else if (isNegative) {
                    strokeColor = '#ef4444';
                    markerEnd = 'url(#arrowhead-negative)';
                  }
                  
                  return (
                    <g key={idx}>
                      <line
                        x1={`${fromPos.x}%`}
                        y1={`${fromPos.y}%`}
                        x2={`${endX}%`}
                        y2={`${endY}%`}
                        stroke={strokeColor}
                        strokeWidth={isCurrent || isRelaxed ? '3' : '2'}
                        markerEnd={markerEnd}
                      />
                      <circle
                        cx={`${midX}%`}
                        cy={`${midY}%`}
                        r="14"
                        fill="white"
                        stroke={strokeColor}
                        strokeWidth="2"
                      />
                      <text
                        x={`${midX}%`}
                        y={`${midY}%`}
                        textAnchor="middle"
                        dy="4"
                        style={{ fontSize: '12px', fontWeight: '700', fill: strokeColor }}
                      >
                        {edge.weight}
                      </text>
                    </g>
                  );
                })}

                {graph.vertices.map((vertex, idx) => {
                  const pos = getVertexPosition(idx, graph.vertices.length);
                  const isStart = vertex === startVertex;
                  return (
                    <g key={vertex}>
                      <circle
                        cx={`${pos.x}%`}
                        cy={`${pos.y}%`}
                        r="30"
                        fill={isStart ? '#fee2e2' : '#e5e7eb'}
                        stroke={isStart ? '#dc2626' : '#6b7280'}
                        strokeWidth="3"
                      />
                      <text
                        x={`${pos.x}%`}
                        y={`${pos.y}%`}
                        textAnchor="middle"
                        dy="-6"
                        style={{ fontSize: '16px', fontWeight: '700', fill: '#374151' }}
                      >
                        {vertex}
                      </text>
                      <text
                        x={`${pos.x}%`}
                        y={`${pos.y}%`}
                        textAnchor="middle"
                        dy="10"
                        style={{ fontSize: '13px', fontWeight: '600', fill: '#dc2626' }}
                      >
                        {distances[vertex] === Infinity ? '∞' : distances[vertex]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '20px' }}>
              <select
                value={startVertex}
                onChange={(e) => setStartVertex(e.target.value)}
                disabled={isRunning}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: isRunning ? 'not-allowed' : 'pointer',
                  background: 'white'
                }}
              >
                {graph.vertices.map((v) => (
                  <option key={v} value={v}>Start: {v}</option>
                ))}
              </select>

              <button
                onClick={runBellmanFord}
                disabled={isRunning}
                style={{
                  padding: '12px 24px',
                  background: isRunning ? '#94a3b8' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: isRunning ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                }}
              >
                {isRunning ? 'Running...' : 'Start Bellman-Ford'}
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
                  <span>Iteration</span>
                  <span>{iteration}/{graph.vertices.length - 1}</span>
                </div>
                <div style={{ width: '100%', background: '#e2e8f0', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${graph.vertices.length > 1 ? (iteration / (graph.vertices.length - 1)) * 100 : 0}%`,
                      background: 'linear-gradient(90deg, #ef4444, #dc2626)',
                      height: '100%',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>
              {hasNegativeCycle && (
                <div style={{
                  padding: '12px',
                  background: '#fee2e2',
                  borderLeft: '4px solid #ef4444',
                  color: '#dc2626',
                  fontSize: '14px',
                  borderRadius: '8px',
                  fontWeight: '600'
                }}>
                  ⚠️ Negative cycle detected!
                </div>
              )}
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: '24px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Distance Table</h3>
              <div>
                {graph.vertices.map((vertex) => (
                  <div key={vertex} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    marginBottom: '6px'
                  }}>
                    <span style={{ fontWeight: '600', color: '#1e293b' }}>{vertex}</span>
                    <span style={{
                      fontWeight: '700',
                      color: distances[vertex] === Infinity ? '#94a3b8' : '#ef4444'
                    }}>
                      {distances[vertex] === Infinity ? '∞' : distances[vertex]}
                    </span>
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
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Add/Remove Vertex</h3>
              <input
                type="text"
                value={newVertex}
                onChange={(e) => setNewVertex(e.target.value)}
                placeholder="Vertex (e.g., E)"
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
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
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
                  marginBottom: '8px'
                }}
              />
              <input
                type="number"
                value={edgeWeight}
                onChange={(e) => setEdgeWeight(e.target.value)}
                placeholder="Weight (can be negative)"
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
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
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
                      background: entry.includes('Relaxed') ? '#d1fae5' : 
                                 entry.includes('No relaxation') ? '#f1f5f9' : 
                                 entry.includes('Negative cycle') ? '#fee2e2' : 
                                 entry.includes('---') ? '#dbeafe' : '#f8fafc',
                      color: entry.includes('Relaxed') ? '#059669' : 
                             entry.includes('Negative cycle') ? '#dc2626' : 
                             entry.includes('---') ? '#1e40af' : '#475569',
                      fontWeight: entry.includes('---') ? '600' : '400'
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
                <p style={{ margin: '0 0 8px' }}><strong>Time Complexity:</strong> O(V × E)</p>
                <p style={{ margin: '0 0 8px' }}><strong>Space Complexity:</strong> O(V)</p>
                <p style={{ margin: '0 0 8px' }}><strong>Approach:</strong> Dynamic Programming</p>
                <p style={{ margin: '0' }}><strong>Use Case:</strong> Negative weights, cycle detection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BellmanFordAlgorithmVisualize;

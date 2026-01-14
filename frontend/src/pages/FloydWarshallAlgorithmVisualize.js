import React, { useState, useEffect } from 'react';

const FloydWarshallAlgorithmVisualize = () => {
  const [graph, setGraph] = useState({
    vertices: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B', weight: 3 },
      { from: 'A', to: 'D', weight: 7 },
      { from: 'B', to: 'A', weight: 8 },
      { from: 'B', to: 'C', weight: 2 },
      { from: 'C', to: 'A', weight: 5 },
      { from: 'C', to: 'D', weight: 1 },
      { from: 'D', to: 'A', weight: 2 }
    ]
  });

  const [matrix, setMatrix] = useState([]);
  const [currentK, setCurrentK] = useState(-1);
  const [currentI, setCurrentI] = useState(-1);
  const [currentJ, setCurrentJ] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [log, setLog] = useState([]);
  const [newVertex, setNewVertex] = useState('');
  const [fromVertex, setFromVertex] = useState('');
  const [toVertex, setToVertex] = useState('');
  const [edgeWeight, setEdgeWeight] = useState('1');

  const INF = 999;

  useEffect(() => {
    reset();
  }, [graph]);

  const addToLog = (message) => {
    setLog(prev => [message, ...prev.slice(0, 14)]);
  };

  const buildMatrix = () => {
    const n = graph.vertices.length;
    const mat = Array(n).fill(null).map(() => Array(n).fill(INF));
    
    for (let i = 0; i < n; i++) {
      mat[i][i] = 0;
    }
    
    graph.edges.forEach(edge => {
      const fromIdx = graph.vertices.indexOf(edge.from);
      const toIdx = graph.vertices.indexOf(edge.to);
      if (fromIdx !== -1 && toIdx !== -1) {
        mat[fromIdx][toIdx] = edge.weight;
      }
    });
    
    return mat;
  };

  const reset = () => {
    setMatrix(buildMatrix());
    setCurrentK(-1);
    setCurrentI(-1);
    setCurrentJ(-1);
    setIsRunning(false);
    setLog(['Algorithm initialized', 'Matrix represents edge weights']);
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const runFloydWarshall = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    const dist = matrix.map(row => [...row]);
    const n = graph.vertices.length;

    for (let k = 0; k < n; k++) {
      setCurrentK(k);
      addToLog(`--- Using vertex ${graph.vertices[k]} as intermediate ---`);
      await sleep(speed);

      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          setCurrentI(i);
          setCurrentJ(j);
          await sleep(speed / 2);

          if (dist[i][k] !== INF && dist[k][j] !== INF && dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
            addToLog(`Updated [${graph.vertices[i]}][${graph.vertices[j]}] = ${dist[i][j]}`);
            setMatrix(dist.map(row => [...row]));
          }
        }
      }
    }

    setCurrentK(-1);
    setCurrentI(-1);
    setCurrentJ(-1);
    setIsRunning(false);
    addToLog('Algorithm completed!');
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
  };

  const getCellColor = (i, j) => {
    if (i === currentI && j === currentJ) return { background: '#fef3c7', border: '2px solid #f59e0b' };
    if (i === currentK || j === currentK) return { background: '#dbeafe', border: '2px solid #3b82f6' };
    if (i === currentI || j === currentJ) return { background: '#e9d5ff', border: '2px solid #a855f7' };
    return { background: 'white', border: '1px solid #e2e8f0' };
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
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 12px'
          }}>
            Floyd-Warshall Algorithm
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#1e293b', margin: '0' }}>
            All pairs shortest paths
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
              Distance Matrix
            </h2>

            <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #e2e8f0', padding: '12px', background: '#f8fafc', fontWeight: '700' }}></th>
                    {graph.vertices.map(v => (
                      <th key={v} style={{ border: '1px solid #e2e8f0', padding: '12px', background: '#f8fafc', fontWeight: '700', color: '#1e293b' }}>
                        {v}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((row, i) => (
                    <tr key={i}>
                      <td style={{ border: '1px solid #e2e8f0', padding: '12px', background: '#f8fafc', fontWeight: '700', color: '#1e293b' }}>
                        {graph.vertices[i]}
                      </td>
                      {row.map((val, j) => (
                        <td key={j} style={{
                          ...getCellColor(i, j),
                          padding: '12px',
                          textAlign: 'center',
                          fontWeight: '600',
                          fontSize: '15px',
                          transition: 'all 0.3s ease',
                          color: val === INF ? '#94a3b8' : '#1e293b'
                        }}>
                          {val === INF ? '∞' : val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <button
                onClick={runFloydWarshall}
                disabled={isRunning}
                style={{
                  padding: '12px 24px',
                  background: isRunning ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: isRunning ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                }}
              >
                {isRunning ? 'Running...' : 'Start Floyd-Warshall'}
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
                  max="1500"
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
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Current State</h3>
              {currentK >= 0 ? (
                <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.8' }}>
                  <p style={{ margin: '0 0 8px' }}>
                    Intermediate vertex: <span style={{ fontWeight: '700', color: '#3b82f6' }}>{graph.vertices[currentK]}</span>
                  </p>
                  {currentI >= 0 && currentJ >= 0 && (
                    <p style={{ margin: '0' }}>
                      Checking: <span style={{ fontWeight: '700', color: '#a855f7' }}>[{graph.vertices[currentI]}][{graph.vertices[currentJ]}]</span>
                    </p>
                  )}
                </div>
              ) : (
                <p style={{ fontSize: '14px', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>Not running</p>
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
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
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
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
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
              <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                {log.map((entry, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '8px 12px',
                      marginBottom: '6px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      background: entry.includes('Updated') ? '#dbeafe' : 
                                 entry.includes('---') ? '#e9d5ff' : '#f1f5f9',
                      color: entry.includes('Updated') ? '#1e40af' : 
                             entry.includes('---') ? '#7c3aed' : '#475569',
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
                <p style={{ margin: '0 0 8px' }}><strong>Time Complexity:</strong> O(V³)</p>
                <p style={{ margin: '0 0 8px' }}><strong>Space Complexity:</strong> O(V²)</p>
                <p style={{ margin: '0 0 8px' }}><strong>Approach:</strong> Dynamic Programming</p>
                <p style={{ margin: '0' }}><strong>Use Case:</strong> All pairs shortest paths</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloydWarshallAlgorithmVisualize;

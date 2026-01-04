import React, { useState } from 'react';

const GraphVisualize = () => {
  const [vertices, setVertices] = useState(['A', 'B', 'C', 'D', 'E']);
  const [edges, setEdges] = useState([
    { from: 'A', to: 'B', weight: 2 },
    { from: 'A', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 3 },
    { from: 'C', to: 'D', weight: 1 },
    { from: 'D', to: 'E', weight: 2 }
  ]);
  const [vertex1, setVertex1] = useState('');
  const [vertex2, setVertex2] = useState('');
  const [weight, setWeight] = useState('1');
  const [startVertex, setStartVertex] = useState('');
  const [highlightVertices, setHighlightVertices] = useState([]);
  const [highlightEdges, setHighlightEdges] = useState([]);
  const [operationLog, setOperationLog] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const addToLog = (op, details) => {
    const timestamp = new Date().toLocaleTimeString();
    setOperationLog(prev => [{
      id: Date.now(),
      operation: op,
      details,
      timestamp
    }, ...prev.slice(0, 9)]);
  };

  const addVertex = () => {
    if (!vertex1.trim() || vertices.includes(vertex1.toUpperCase())) return;
    
    const newVertex = vertex1.toUpperCase();
    setVertices(prev => [...prev, newVertex]);
    addToLog('ADD_VERTEX', `Added vertex ${newVertex}`);
    setVertex1('');
  };

  const removeVertex = () => {
    if (!vertex1.trim() || !vertices.includes(vertex1.toUpperCase())) return;
    
    const vertexToRemove = vertex1.toUpperCase();
    setVertices(prev => prev.filter(v => v !== vertexToRemove));
    setEdges(prev => prev.filter(e => e.from !== vertexToRemove && e.to !== vertexToRemove));
    addToLog('REMOVE_VERTEX', `Removed vertex ${vertexToRemove} and its edges`);
    setVertex1('');
  };

  const addEdge = () => {
    if (!vertex1.trim() || !vertex2.trim()) return;
    
    const v1 = vertex1.toUpperCase();
    const v2 = vertex2.toUpperCase();
    
    if (!vertices.includes(v1) || !vertices.includes(v2)) return;
    if (edges.some(e => (e.from === v1 && e.to === v2) || (e.from === v2 && e.to === v1))) return;
    
    const newEdge = { from: v1, to: v2, weight: parseInt(weight) || 1 };
    setEdges(prev => [...prev, newEdge]);
    addToLog('ADD_EDGE', `Added edge ${v1}-${v2} (weight: ${newEdge.weight})`);
    setVertex1('');
    setVertex2('');
    setWeight('1');
  };

  const removeEdge = () => {
    if (!vertex1.trim() || !vertex2.trim()) return;
    
    const v1 = vertex1.toUpperCase();
    const v2 = vertex2.toUpperCase();
    
    setEdges(prev => prev.filter(e => 
      !((e.from === v1 && e.to === v2) || (e.from === v2 && e.to === v1))
    ));
    addToLog('REMOVE_EDGE', `Removed edge ${v1}-${v2}`);
    setVertex1('');
    setVertex2('');
  };

  const bfsTraversal = async () => {
    if (!startVertex.trim() || !vertices.includes(startVertex.toUpperCase())) return;
    
    setIsAnimating(true);
    const start = startVertex.toUpperCase();
    const visited = new Set();
    const queue = [start];
    const result = [];
    
    while (queue.length > 0) {
      const current = queue.shift();
      if (!visited.has(current)) {
        visited.add(current);
        result.push(current);
        
        setHighlightVertices([current]);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Find neighbors
        const neighbors = edges
          .filter(e => e.from === current || e.to === current)
          .map(e => e.from === current ? e.to : e.from)
          .filter(v => !visited.has(v));
        
        queue.push(...neighbors);
      }
    }
    
    setHighlightVertices([]);
    addToLog('BFS', `Traversal: [${result.join(' → ')}]`);
    setIsAnimating(false);
    setStartVertex('');
  };

  const dfsTraversal = async () => {
    if (!startVertex.trim() || !vertices.includes(startVertex.toUpperCase())) return;
    
    setIsAnimating(true);
    const start = startVertex.toUpperCase();
    const visited = new Set();
    const result = [];
    
    const dfs = async (vertex) => {
      visited.add(vertex);
      result.push(vertex);
      
      setHighlightVertices([vertex]);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const neighbors = edges
        .filter(e => e.from === vertex || e.to === vertex)
        .map(e => e.from === vertex ? e.to : e.from)
        .filter(v => !visited.has(v));
      
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          await dfs(neighbor);
        }
      }
    };
    
    await dfs(start);
    setHighlightVertices([]);
    addToLog('DFS', `Traversal: [${result.join(' → ')}]`);
    setIsAnimating(false);
    setStartVertex('');
  };

  const clearGraph = () => {
    setVertices([]);
    setEdges([]);
    setHighlightVertices([]);
    setHighlightEdges([]);
    addToLog('CLEAR', 'Cleared entire graph');
  };

  const getVertexStyle = (vertex) => ({
    width: '50px',
    height: '50px',
    background: highlightVertices.includes(vertex)
      ? 'linear-gradient(135deg, #10b981, #34d399)'
      : 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '16px',
    boxShadow: highlightVertices.includes(vertex)
      ? '0 8px 25px rgba(16, 185, 129, 0.4)'
      : '0 6px 20px rgba(59, 130, 246, 0.3)',
    transform: highlightVertices.includes(vertex) ? 'scale(1.2)' : 'scale(1)',
    transition: 'all 0.4s ease',
    margin: '5px'
  });

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a, #1e293b, #334155)',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Inter, sans-serif',
      color: 'white'
    }}>
      <a href="/datastructures" style={{
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
        ← Back to Data Structures
      </a>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '30px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 12px'
          }}>
            🌐 3D Graph Visualizer
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#94a3b8', margin: '0' }}>
            🌐 Graph Structure (V={vertices.length}, E={edges.length})
          </p>
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#64748b' }}>
            Vertices: {vertices.length} | Edges: {edges.length} | Type: Undirected
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '24px',
            padding: '40px',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              marginBottom: '30px',
              color: '#e2e8f0'
            }}>
              🌐 Graph Structure (V={vertices.length}, E={edges.length})
            </h2>

            {/* Graph Visualization */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '16px',
              padding: '30px',
              marginBottom: '30px',
              minHeight: '300px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {vertices.length > 0 ? (
                <>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                    justifyContent: 'center',
                    marginBottom: '30px'
                  }}>
                    {vertices.map(vertex => (
                      <div key={vertex} style={getVertexStyle(vertex)}>
                        {vertex}
                      </div>
                    ))}
                  </div>
                  
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '15px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#cbd5e1'
                  }}>
                    <div><strong>Edges:</strong></div>
                    {edges.length > 0 ? edges.map((edge, idx) => (
                      <div key={idx} style={{ margin: '5px 0' }}>
                        {edge.from} ↔ {edge.to} (weight: {edge.weight})
                      </div>
                    )) : (
                      <div style={{ fontStyle: 'italic', color: '#64748b' }}>No edges</div>
                    )}
                  </div>
                </>
              ) : (
                <div style={{
                  color: '#64748b',
                  fontSize: '18px',
                  fontStyle: 'italic'
                }}>
                  Graph is empty - add vertices to begin
                </div>
              )}
            </div>

            {/* Graph Operations */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '25px'
            }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                fontWeight: '600', 
                marginBottom: '20px',
                color: '#e2e8f0'
              }}>
                🌐 Graph Operations
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <input
                  type="text"
                  value={vertex1}
                  onChange={(e) => setVertex1(e.target.value)}
                  placeholder="Vertex 1"
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px'
                  }}
                />
                <input
                  type="text"
                  value={vertex2}
                  onChange={(e) => setVertex2(e.target.value)}
                  placeholder="Vertex 2"
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px'
                  }}
                />
              </div>

              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Weight"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '14px',
                  marginBottom: '20px'
                }}
              />

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#10b981', marginBottom: '12px', fontSize: '16px' }}>⭕ Vertex Operations</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    onClick={addVertex}
                    disabled={isAnimating}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      fontWeight: '600',
                      cursor: isAnimating ? 'not-allowed' : 'pointer',
                      opacity: isAnimating ? 0.6 : 1,
                      fontSize: '12px'
                    }}
                  >
                    ➕ Add Vertex
                  </button>
                  <button
                    onClick={removeVertex}
                    disabled={isAnimating}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: 'white',
                      fontWeight: '600',
                      cursor: isAnimating ? 'not-allowed' : 'pointer',
                      opacity: isAnimating ? 0.6 : 1,
                      fontSize: '12px'
                    }}
                  >
                    ❌ Remove Vertex
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#06b6d4', marginBottom: '12px', fontSize: '16px' }}>➡️ Edge Operations</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    onClick={addEdge}
                    disabled={isAnimating}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                      color: 'white',
                      fontWeight: '600',
                      cursor: isAnimating ? 'not-allowed' : 'pointer',
                      opacity: isAnimating ? 0.6 : 1,
                      fontSize: '12px'
                    }}
                  >
                    ➕ Add Edge
                  </button>
                  <button
                    onClick={removeEdge}
                    disabled={isAnimating}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: 'white',
                      fontWeight: '600',
                      cursor: isAnimating ? 'not-allowed' : 'pointer',
                      opacity: isAnimating ? 0.6 : 1,
                      fontSize: '12px'
                    }}
                  >
                    ❌ Remove Edge
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#8b5cf6', marginBottom: '12px', fontSize: '16px' }}>🔄 Traversals</h4>
                <input
                  type="text"
                  value={startVertex}
                  onChange={(e) => setStartVertex(e.target.value)}
                  placeholder="Start vertex"
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '8px',
                    borderRadius: '8px',
                    border: '2px solid rgba(139, 92, 246, 0.2)',
                    background: 'rgba(30, 41, 59, 0.8)',
                    color: 'white',
                    fontSize: '14px'
                  }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    onClick={bfsTraversal}
                    disabled={isAnimating}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                      color: 'white',
                      fontWeight: '600',
                      cursor: isAnimating ? 'not-allowed' : 'pointer',
                      opacity: isAnimating ? 0.6 : 1,
                      fontSize: '12px'
                    }}
                  >
                    BFS (Queue)
                  </button>
                  <button
                    onClick={dfsTraversal}
                    disabled={isAnimating}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #ec4899, #db2777)',
                      color: 'white',
                      fontWeight: '600',
                      cursor: isAnimating ? 'not-allowed' : 'pointer',
                      opacity: isAnimating ? 0.6 : 1,
                      fontSize: '12px'
                    }}
                  >
                    DFS (Stack)
                  </button>
                </div>
              </div>

              <button
                onClick={clearGraph}
                disabled={isAnimating}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                  color: 'white',
                  fontWeight: '600',
                  cursor: isAnimating ? 'not-allowed' : 'pointer',
                  opacity: isAnimating ? 0.6 : 1
                }}
              >
                🧹 Clear Graph
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '25px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px', color: '#e2e8f0' }}>
                ⚡ Performance
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  { op: 'Add Vertex', complexity: 'O(1)' },
                  { op: 'Add Edge', complexity: 'O(1)' },
                  { op: 'BFS/DFS', complexity: 'O(V+E)' },
                  { op: 'Space', complexity: 'O(V+E)' }
                ].map(({ op, complexity }) => (
                  <div key={op} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>{op}:</span>
                    <span style={{ fontWeight: '600', color: '#60a5fa' }}>{complexity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '25px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              flex: 1
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px', color: '#e2e8f0' }}>
                📝 Operation Log
              </h3>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {operationLog.length > 0 ? operationLog.map((log) => (
                  <div key={log.id} style={{
                    padding: '12px',
                    marginBottom: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}>
                    <div style={{ 
                      fontWeight: '600', 
                      color: log.operation.includes('VERTEX') ? '#10b981' :
                             log.operation.includes('EDGE') ? '#06b6d4' :
                             log.operation.includes('BFS') || log.operation.includes('DFS') ? '#8b5cf6' :
                             log.operation === 'CLEAR' ? '#64748b' : '#f59e0b'
                    }}>
                      {log.operation}
                    </div>
                    <div style={{ color: '#cbd5e1', marginTop: '4px' }}>
                      {log.details}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '10px', marginTop: '4px' }}>
                      {log.timestamp}
                    </div>
                  </div>
                )) : (
                  <div style={{ color: '#64748b', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
                    No operations yet. Try adding vertices!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualize;
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

return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc, #f1f5f9, #e2e8f0)',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Inter, sans-serif',
      color: '#1e293b'
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
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '30px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #4834d4, #686de0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 12px',
            textAlign: 'center'
          }}>
            Graph Visualizer
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#1e293b',
            textAlign: 'center',
            margin: '0'
          }}>
            Interactive visualization of graph data structure
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '24px',
            padding: '40px',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto'
          }}>
            <style>{`
              div::-webkit-scrollbar {
                width: 6px;
              }
              div::-webkit-scrollbar-track {
                background: rgba(148, 163, 184, 0.1);
                border-radius: 10px;
              }
              div::-webkit-scrollbar-thumb {
                background: rgba(148, 163, 184, 0.4);
                border-radius: 10px;
              }
              div::-webkit-scrollbar-thumb:hover {
                background: rgba(148, 163, 184, 0.6);
              }
            `}</style>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              marginBottom: '30px',
              color: '#1e293b'
            }}>
              Graph Structure (V={vertices.length}, E={edges.length})
            </h2>

            {/* Graph Visualization */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))',
              borderRadius: '16px',
              padding: '30px',
              marginBottom: '30px',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(148, 163, 184, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {vertices.length > 0 ? (
                <>
                  {/* Visual Graph with Circular Layout */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '350px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px'
                  }}>
                    {/* Draw edges first (behind vertices) */}
                    <svg style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none'
                    }}>
                      {edges.map((edge, idx) => {
                        const fromIdx = vertices.indexOf(edge.from);
                        const toIdx = vertices.indexOf(edge.to);
                        const totalVertices = vertices.length;
                        
                        let x1, y1, x2, y2;
                        
                        if (totalVertices === 1) {
                          x1 = y1 = x2 = y2 = 50;
                        } else {
                          const angle1 = (fromIdx * 2 * Math.PI) / totalVertices - Math.PI / 2;
                          const angle2 = (toIdx * 2 * Math.PI) / totalVertices - Math.PI / 2;
                          const radius = 35;
                          x1 = 50 + radius * Math.cos(angle1);
                          y1 = 50 + radius * Math.sin(angle1);
                          x2 = 50 + radius * Math.cos(angle2);
                          y2 = 50 + radius * Math.sin(angle2);
                        }
                        
                        return (
                          <g key={idx}>
                            <line
                              x1={`${x1}%`}
                              y1={`${y1}%`}
                              x2={`${x2}%`}
                              y2={`${y2}%`}
                              stroke="rgba(59, 130, 246, 0.4)"
                              strokeWidth="2"
                            />
                            <text
                              x={`${(x1 + x2) / 2}%`}
                              y={`${(y1 + y2) / 2}%`}
                              fill="#3b82f6"
                              fontSize="12"
                              fontWeight="600"
                              textAnchor="middle"
                              dy="-5"
                            >
                              {edge.weight}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                    
                    {/* Draw vertices in circular layout */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%'
                    }}>
                      {vertices.map((vertex, idx) => {
                        const totalVertices = vertices.length;
                        let x, y;
                        
                        if (totalVertices === 1) {
                          // Center single vertex
                          x = 50;
                          y = 50;
                        } else {
                          // Circular layout for multiple vertices
                          const angle = (idx * 2 * Math.PI) / totalVertices - Math.PI / 2;
                          const radius = 35; // Percentage-based radius
                          x = 50 + radius * Math.cos(angle);
                          y = 50 + radius * Math.sin(angle);
                        }
                        
                        const isHighlighted = highlightVertices.includes(vertex);
                        
                        return (
                          <div
                            key={vertex}
                            style={{
                              position: 'absolute',
                              left: `calc(${x}% - 25px)`,
                              top: `calc(${y}% - 25px)`,
                              width: '50px',
                              height: '50px',
                              background: isHighlighted
                                ? 'linear-gradient(135deg, #10b981, #34d399)'
                                : 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                              border: '2px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: '700',
                              fontSize: '18px',
                              boxShadow: isHighlighted
                                ? '0 8px 25px rgba(16, 185, 129, 0.4)'
                                : '0 6px 20px rgba(59, 130, 246, 0.3)',
                              transform: isHighlighted ? 'scale(1.2)' : 'scale(1)',
                              transition: 'all 0.4s ease',
                              zIndex: 10
                            }}
                          >
                            {vertex}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Edge List */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    padding: '15px 20px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    color: '#475569',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    width: '100%',
                    maxWidth: '600px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                  }}>
                    <div style={{ fontWeight: '700', marginBottom: '8px', color: '#1e293b' }}>Edges ({edges.length}):</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {edges.length > 0 ? edges.map((edge, idx) => (
                        <span key={idx} style={{
                          background: 'linear-gradient(135deg, #dbeafe, #e0e7ff)',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#3b82f6',
                          border: '1px solid rgba(59, 130, 246, 0.2)'
                        }}>
                          {edge.from} - {edge.to} (w: {edge.weight})
                        </span>
                      )) : (
                        <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>No edges yet</span>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '40px'
                }}>
                  <div style={{
                    fontSize: '48px',
                    marginBottom: '16px'
                  }}>🔵</div>
                  <div style={{
                    color: '#64748b',
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    Graph is Empty
                  </div>
                  <div style={{
                    color: '#94a3b8',
                    fontSize: '14px'
                  }}>
                    Add vertices to start building your graph
                  </div>
                </div>
              )}
            </div>

            {/* Graph Operations */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '16px',
              padding: '25px',
              border: '1px solid rgba(148, 163, 184, 0.2)'
            }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                fontWeight: '600', 
                marginBottom: '20px',
                color: '#1e293b'
              }}>
                Graph Operations
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
                    border: '2px solid #e5e7eb',
                    background: '#fff',
                    color: '#1e293b',
                    fontSize: '14px',
                    outline: 'none'
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
                    border: '2px solid #e5e7eb',
                    background: '#fff',
                    color: '#1e293b',
                    fontSize: '14px',
                    outline: 'none'
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
                  border: '2px solid #e5e7eb',
                  background: '#fff',
                  color: '#1e293b',
                  fontSize: '14px',
                  marginBottom: '20px',
                  outline: 'none'
                }}
              />

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#10b981', marginBottom: '12px', fontSize: '16px' }}>Vertex Operations</h4>
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
                    Add Vertex
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
                    Remove Vertex
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#06b6d4', marginBottom: '12px', fontSize: '16px' }}>Edge Operations</h4>
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
                    Add Edge
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
                    Remove Edge
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#8b5cf6', marginBottom: '12px', fontSize: '16px' }}>Traversals</h4>
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
                    border: '2px solid #e5e7eb',
                    background: '#fff',
                    color: '#1e293b',
                    fontSize: '14px',
                    outline: 'none'
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
                    BFS
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
                    DFS
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
                Clear Graph
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '16px',
              padding: '25px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px', color: '#1e293b' }}>
                Performance
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  { op: 'Add Vertex', complexity: 'O(1)' },
                  { op: 'Add Edge', complexity: 'O(1)' },
                  { op: 'BFS/DFS', complexity: 'O(V+E)' },
                  { op: 'Space', complexity: 'O(V+E)' }
                ].map(({ op, complexity }) => (
                  <div key={op} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>{op}:</span>
                    <span style={{ fontWeight: '600', color: '#3b82f6' }}>{complexity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '16px',
              padding: '25px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              maxHeight: '500px',
              overflow: 'hidden'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px', color: '#1e293b' }}>
                Operation Log
              </h3>
              <div style={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'hidden' }}>
                {operationLog.length > 0 ? operationLog.map((log) => (
                  <div key={log.id} style={{
                    padding: '12px',
                    marginBottom: '8px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    wordBreak: 'break-word'
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
                    <div style={{ color: '#475569', marginTop: '4px' }}>
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
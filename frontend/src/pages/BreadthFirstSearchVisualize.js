import React, { useState, useEffect } from 'react';

const BreadthFirstSearchVisualize = () => {
  const [graph, setGraph] = useState({
    vertices: ['A', 'B', 'C', 'D', 'E', 'F'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'B', to: 'D' },
      { from: 'B', to: 'E' },
      { from: 'C', to: 'F' },
      { from: 'D', to: 'E' }
    ]
  });
  
  const [startVertex, setStartVertex] = useState('A');
  const [currentVertex, setCurrentVertex] = useState(null);
  const [visitedVertices, setVisitedVertices] = useState(new Set());
  const [queue, setQueue] = useState([]);
  const [traversalPath, setTraversalPath] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [operationLog, setOperationLog] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [newVertex, setNewVertex] = useState('');
  const [fromVertex, setFromVertex] = useState('');
  const [toVertex, setToVertex] = useState('');

  const addToLog = (operation, details) => {
    const timestamp = new Date().toLocaleTimeString();
    setOperationLog(prev => [{
      id: Date.now(),
      operation,
      details,
      timestamp
    }, ...prev.slice(0, 9)]);
  };

  const getAdjacencyList = () => {
    const adjList = {};
    graph.vertices.forEach(vertex => {
      adjList[vertex] = [];
    });
    
    graph.edges.forEach(edge => {
      adjList[edge.from].push(edge.to);
      adjList[edge.to].push(edge.from);
    });
    
    return adjList;
  };

  const resetVisualization = () => {
    setCurrentVertex(null);
    setVisitedVertices(new Set());
    setQueue([]);
    setTraversalPath([]);
    setIsRunning(false);
    setCurrentStep(0);
    setTotalSteps(0);
    setCurrentLevel(0);
    addToLog('RESET', 'BFS visualization reset');
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const performBFS = async () => {
    if (isRunning) return;

    resetVisualization();
    setIsRunning(true);
    
    const adjList = getAdjacencyList();
    const visited = new Set();
    const bfsQueue = [startVertex];
    const path = [];
    let stepCount = 0;
    let level = 0;
    
    addToLog('START', `Starting BFS from vertex ${startVertex}`);
    setQueue([startVertex]);
    setTotalSteps(graph.vertices.length);
    setCurrentLevel(0);

    while (bfsQueue.length > 0) {
      const current = bfsQueue.shift();
      setCurrentVertex(current);
      setQueue([...bfsQueue]);
      setCurrentStep(++stepCount);
      
      addToLog('DEQUEUE', `Dequeued ${current} from queue`);
      await sleep(speed);

      if (!visited.has(current)) {
        visited.add(current);
        path.push(current);
        setVisitedVertices(new Set(visited));
        setTraversalPath([...path]);
        
        addToLog('VISIT', `Visited vertex ${current} at level ${level}`);
        await sleep(speed);

        const neighbors = adjList[current] || [];
        const unvisitedNeighbors = neighbors.filter(neighbor => 
          !visited.has(neighbor) && !bfsQueue.includes(neighbor)
        );
        
        for (const neighbor of unvisitedNeighbors) {
          bfsQueue.push(neighbor);
          addToLog('ENQUEUE', `Enqueued ${neighbor} to queue`);
        }
        
        setQueue([...bfsQueue]);
        await sleep(speed / 2);
      }
      
      if (bfsQueue.length > 0) {
        level++;
        setCurrentLevel(level);
      }
    }

    setCurrentVertex(null);
    setIsRunning(false);
    addToLog('COMPLETE', `BFS completed! Path: ${path.join(' → ')}`);
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
    addToLog('ADD_VERTEX', `Added vertex ${vertex}`);
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
    addToLog('REMOVE_VERTEX', `Removed vertex ${vertex}`);
    setNewVertex('');
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
    if (graph.edges.some(e => (e.from === from && e.to === to) || (e.from === to && e.to === from))) {
      alert('Edge already exists!');
      return;
    }
    
    setGraph(prev => ({
      ...prev,
      edges: [...prev.edges, { from, to }]
    }));
    addToLog('ADD_EDGE', `Added edge ${from} - ${to}`);
    setFromVertex('');
    setToVertex('');
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
    addToLog('REMOVE_EDGE', `Removed edge ${from} - ${to}`);
    setFromVertex('');
    setToVertex('');
  };

  const getVertexStyle = (vertex) => {
    let backgroundColor = '#64748b'; // Default gray
    let borderColor = '#475569';
    let transform = 'scale(1)';
    let boxShadow = '0 4px 12px rgba(100, 116, 139, 0.3)';

    if (vertex === currentVertex) {
      backgroundColor = '#10b981'; // Green for current
      borderColor = '#059669';
      transform = 'scale(1.2)';
      boxShadow = '0 8px 25px rgba(16, 185, 129, 0.5)';
    } else if (visitedVertices.has(vertex)) {
      backgroundColor = '#3b82f6'; // Blue for visited
      borderColor = '#2563eb';
      boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
    } else if (queue.includes(vertex)) {
      backgroundColor = '#f59e0b'; // Orange for in queue
      borderColor = '#d97706';
      boxShadow = '0 6px 20px rgba(245, 158, 11, 0.4)';
    }

    return {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor,
      border: `3px solid ${borderColor}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: '700',
      fontSize: '18px',
      transform,
      boxShadow,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      margin: '10px'
    };
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
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 12px'
          }}>
            Breadth First Search (BFS)
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#1e293b', margin: '0' }}>
            Explore graph level by level using queue-based traversal
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
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              marginBottom: '30px',
              color: '#1e293b'
            }}>
              Graph Visualization
            </h2>

            {/* Progress Bar */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '30px',
              border: '1px solid rgba(148, 163, 184, 0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#64748b', fontSize: '14px' }}>Progress</span>
                <span style={{ color: '#3b82f6', fontSize: '14px', fontWeight: '600' }}>
                  {currentStep}/{totalSteps} vertices | Level: {currentLevel}
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: '#e5e7eb',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>

            {/* Graph Display */}
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '30px',
              marginBottom: '30px',
              minHeight: '400px',
              position: 'relative',
              border: '2px solid #e5e7eb'
            }}>
              <div style={{
                position: 'relative',
                width: '100%',
                height: '350px'
              }}>
                {/* SVG for edges */}
                <svg style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%'
                }}>
                  {graph.edges.map((edge, idx) => {
                    const fromIdx = graph.vertices.indexOf(edge.from);
                    const toIdx = graph.vertices.indexOf(edge.to);
                    const totalVertices = graph.vertices.length;
                    
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
                      <line
                        key={idx}
                        x1={`${x1}%`}
                        y1={`${y1}%`}
                        x2={`${x2}%`}
                        y2={`${y2}%`}
                        stroke="#cbd5e1"
                        strokeWidth="3"
                      />
                    );
                  })}
                </svg>
                
                {/* Vertices */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%'
                }}>
                  {graph.vertices.map((vertex, idx) => {
                    const totalVertices = graph.vertices.length;
                    let x, y;
                    
                    if (totalVertices === 1) {
                      x = 50;
                      y = 50;
                    } else {
                      const angle = (idx * 2 * Math.PI) / totalVertices - Math.PI / 2;
                      const radius = 35;
                      x = 50 + radius * Math.cos(angle);
                      y = 50 + radius * Math.sin(angle);
                    }
                    
                    return (
                      <div
                        key={vertex}
                        style={{
                          ...getVertexStyle(vertex),
                          position: 'absolute',
                          left: `calc(${x}% - 30px)`,
                          top: `calc(${y}% - 30px)`,
                          margin: 0
                        }}
                      >
                        {vertex}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div style={{
                background: '#f9fafb',
                padding: '15px',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#374151',
                border: '1px solid #e5e7eb',
                marginTop: '20px'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '8px' }}>Edges:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {graph.edges.map((edge, idx) => (
                    <span key={idx} style={{
                      background: 'rgba(6, 182, 212, 0.2)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#06b6d4'
                    }}>
                      {edge.from} ↔ {edge.to}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '16px',
              padding: '25px',
              border: '1px solid rgba(148, 163, 184, 0.2)'
            }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                fontWeight: '600', 
                marginBottom: '20px',
                color: '#1f2937'
              }}>
                Graph Operations
              </h3>
              
              {/* Vertex Operations */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#374151', fontWeight: '600' }}>
                  Vertex Name
                </label>
                <input
                  type="text"
                  value={newVertex}
                  onChange={(e) => setNewVertex(e.target.value)}
                  placeholder="e.g., G"
                  disabled={isRunning}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb',
                    background: '#fff',
                    fontSize: '14px',
                    marginBottom: '8px'
                  }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    onClick={addVertex}
                    disabled={isRunning}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      fontWeight: '600',
                      cursor: isRunning ? 'not-allowed' : 'pointer',
                      opacity: isRunning ? 0.6 : 1,
                      fontSize: '12px'
                    }}
                  >
                    Add Vertex
                  </button>
                  <button
                    onClick={removeVertex}
                    disabled={isRunning}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: 'white',
                      fontWeight: '600',
                      cursor: isRunning ? 'not-allowed' : 'pointer',
                      opacity: isRunning ? 0.6 : 1,
                      fontSize: '12px'
                    }}
                  >
                    Remove Vertex
                  </button>
                </div>
              </div>

              {/* Edge Operations */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#374151', fontWeight: '600' }}>
                  Edge (From - To)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    value={fromVertex}
                    onChange={(e) => setFromVertex(e.target.value)}
                    placeholder="From"
                    disabled={isRunning}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      background: '#fff',
                      fontSize: '14px'
                    }}
                  />
                  <input
                    type="text"
                    value={toVertex}
                    onChange={(e) => setToVertex(e.target.value)}
                    placeholder="To"
                    disabled={isRunning}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      background: '#fff',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    onClick={addEdge}
                    disabled={isRunning}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      fontWeight: '600',
                      cursor: isRunning ? 'not-allowed' : 'pointer',
                      opacity: isRunning ? 0.6 : 1,
                      fontSize: '12px'
                    }}
                  >
                    Add Edge
                  </button>
                  <button
                    onClick={removeEdge}
                    disabled={isRunning}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: 'white',
                      fontWeight: '600',
                      cursor: isRunning ? 'not-allowed' : 'pointer',
                      opacity: isRunning ? 0.6 : 1,
                      fontSize: '12px'
                    }}
                  >
                    Remove Edge
                  </button>
                </div>
              </div>

              <h3 style={{ 
                fontSize: '1.2rem', 
                fontWeight: '600', 
                marginBottom: '20px',
                marginTop: '30px',
                color: '#1f2937'
              }}>
                BFS Controls
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#374151' }}>
                    Start Vertex
                  </label>
                  <select
                    value={startVertex}
                    onChange={(e) => setStartVertex(e.target.value)}
                    disabled={isRunning}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      background: 'white',
                      color: '#1f2937',
                      fontSize: '14px'
                    }}
                  >
                    {graph.vertices.map(vertex => (
                      <option key={vertex} value={vertex}>{vertex}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#374151' }}>
                    Speed (ms)
                  </label>
                  <input
                    type="range"
                    min="200"
                    max="2000"
                    step="200"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    disabled={isRunning}
                    style={{ width: '100%' }}
                  />
                  <div style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    {speed}ms
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={performBFS}
                  disabled={isRunning}
                  style={{
                    background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: isRunning ? 'not-allowed' : 'pointer',
                    opacity: isRunning ? 0.6 : 1
                  }}
                >
                  {isRunning ? 'Running...' : 'Start BFS'}
                </button>
                
                <button
                  onClick={resetVisualization}
                  style={{
                    background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* BFS Queue */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: '25px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px', color: '#1f2937' }}>
                BFS Queue
              </h3>
              <div style={{ minHeight: '120px' }}>
                {queue.length === 0 ? (
                  <div style={{ color: '#64748b', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
                    Queue is empty
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '12px', color: '#06b6d4', marginBottom: '8px', textAlign: 'center' }}>
                      FRONT → REAR
                    </div>
                    {queue.map((vertex, index) => (
                      <div
                        key={`${vertex}-${index}`}
                        style={{
                          padding: '10px',
                          background: index === 0 
                            ? 'linear-gradient(135deg, #06b6d4, #0891b2)' 
                            : 'rgba(6, 182, 212, 0.3)',
                          borderRadius: '8px',
                          textAlign: 'center',
                          fontWeight: '600',
                          fontSize: '14px',
                          color: index === 0 ? 'white' : '#1f2937'
                        }}
                      >
                        {vertex} {index === 0 && '(FRONT)'}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Traversal Path */}
            {traversalPath.length > 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '16px',
                padding: '25px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px', color: '#1f2937' }}>
                  Traversal Path
                </h3>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  alignItems: 'center'
                }}>
                  {traversalPath.map((vertex, index) => (
                    <React.Fragment key={index}>
                      <span style={{
                        background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        {vertex}
                      </span>
                      {index < traversalPath.length - 1 && (
                        <span style={{ color: '#64748b' }}>→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Algorithm Info */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: '25px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px', color: '#1f2937' }}>
                Algorithm Info
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  { label: 'Time Complexity', value: 'O(V + E)' },
                  { label: 'Space Complexity', value: 'O(V)' },
                  { label: 'Data Structure', value: 'Queue' },
                  { label: 'Type', value: 'Level-wise Traversal' }
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>{label}:</span>
                    <span style={{ fontWeight: '600', color: '#06b6d4' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Operation Log */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: '25px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              flex: 1
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px', color: '#1f2937' }}>
                Operation Log
              </h3>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {operationLog.length > 0 ? operationLog.map((log) => (
                  <div key={log.id} style={{
                    padding: '10px',
                    marginBottom: '8px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    fontSize: '12px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontWeight: '600', color: '#06b6d4' }}>
                      {log.operation}
                    </div>
                    <div style={{ color: '#374151', marginTop: '4px' }}>
                      {log.details}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '10px', marginTop: '4px' }}>
                      {log.timestamp}
                    </div>
                  </div>
                )) : (
                  <div style={{ color: '#64748b', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
                    No operations yet. Start BFS to see logs!
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

export default BreadthFirstSearchVisualize;
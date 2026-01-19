import React, { useState, useEffect } from 'react';

const DijkstrasAlgorithmVisualize = () => {
  const [graph, setGraph] = useState({
    vertices: ['A', 'B', 'C', 'D', 'E'],
    edges: [
      { from: 'A', to: 'B', weight: 4 },
      { from: 'A', to: 'C', weight: 2 },
      { from: 'B', to: 'C', weight: 1 },
      { from: 'B', to: 'D', weight: 5 },
      { from: 'C', to: 'D', weight: 8 },
      { from: 'C', to: 'E', weight: 10 },
      { from: 'D', to: 'E', weight: 2 }
    ]
  });
  
  const [startVertex, setStartVertex] = useState('A');
  const [endVertex, setEndVertex] = useState('E');
  const [currentVertex, setCurrentVertex] = useState(null);
  const [visitedVertices, setVisitedVertices] = useState(new Set());
  const [distances, setDistances] = useState({});
  const [previousVertices, setPreviousVertices] = useState({});
  const [shortestPath, setShortestPath] = useState([]);
  const [priorityQueue, setPriorityQueue] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [operationLog, setOperationLog] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [newVertex, setNewVertex] = useState('');
  const [fromVertex, setFromVertex] = useState('');
  const [toVertex, setToVertex] = useState('');
  const [edgeWeight, setEdgeWeight] = useState('1');

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
      adjList[edge.from].push({ vertex: edge.to, weight: edge.weight });
      adjList[edge.to].push({ vertex: edge.from, weight: edge.weight });
    });
    
    return adjList;
  };

  const resetVisualization = () => {
    setCurrentVertex(null);
    setVisitedVertices(new Set());
    setDistances({});
    setPreviousVertices({});
    setShortestPath([]);
    setPriorityQueue([]);
    setIsRunning(false);
    setCurrentStep(0);
    setTotalSteps(0);
    setIsComplete(false);
    addToLog('RESET', 'Dijkstra\'s algorithm reset');
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const performDijkstra = async () => {
    if (isRunning) return;

    resetVisualization();
    setIsRunning(true);
    
    const adjList = getAdjacencyList();
    const dist = {};
    const prev = {};
    const visited = new Set();
    const pq = [];
    let stepCount = 0;
    
    graph.vertices.forEach(vertex => {
      dist[vertex] = vertex === startVertex ? 0 : Infinity;
      prev[vertex] = null;
      pq.push({ vertex, distance: dist[vertex] });
    });
    
    setDistances({...dist});
    setPreviousVertices({...prev});
    setPriorityQueue([...pq]);
    setTotalSteps(graph.vertices.length);
    
    addToLog('INIT', `Starting Dijkstra from ${startVertex} to ${endVertex}`);
    await sleep(speed);

    while (pq.length > 0) {
      pq.sort((a, b) => a.distance - b.distance);
      const current = pq.shift();
      
      if (!current || visited.has(current.vertex)) continue;
      
      setCurrentVertex(current.vertex);
      setPriorityQueue([...pq]);
      setCurrentStep(++stepCount);
      
      addToLog('SELECT', `Selected ${current.vertex} with distance ${current.distance}`);
      await sleep(speed);

      visited.add(current.vertex);
      setVisitedVertices(new Set(visited));
      
      addToLog('VISIT', `Visited ${current.vertex}`);
      
      if (current.vertex === endVertex) {
        const path = [];
        let curr = endVertex;
        while (curr !== null) {
          path.unshift(curr);
          curr = prev[curr];
        }
        setShortestPath(path);
        setIsComplete(true);
        addToLog('COMPLETE', `Shortest path found: ${path.join(' → ')} (Distance: ${dist[endVertex]})`);
        break;
      }

      const neighbors = adjList[current.vertex] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.vertex)) {
          const newDist = dist[current.vertex] + neighbor.weight;
          if (newDist < dist[neighbor.vertex]) {
            dist[neighbor.vertex] = newDist;
            prev[neighbor.vertex] = current.vertex;
            
            const pqIndex = pq.findIndex(item => item.vertex === neighbor.vertex);
            if (pqIndex !== -1) {
              pq[pqIndex].distance = newDist;
            }
            
            addToLog('UPDATE', `Updated ${neighbor.vertex}: distance = ${newDist}`);
          }
        }
      }
      
      setDistances({...dist});
      setPreviousVertices({...prev});
      setPriorityQueue([...pq]);
      await sleep(speed);
    }

    setCurrentVertex(null);
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
    addToLog('ADD_EDGE', `Added edge ${from} - ${to} (weight: ${weight})`);
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
      edges: prev.edges.filter(e => !((e.from === from && e.to === to) || (e.from === to && e.to === from)))
    }));
    addToLog('REMOVE_EDGE', `Removed edge ${from} - ${to}`);
    setFromVertex('');
    setToVertex('');
  };

  const getVertexStyle = (vertex) => {
    let backgroundColor = '#64748b';
    let borderColor = '#475569';
    let transform = 'scale(1)';
    let boxShadow = '0 4px 12px rgba(100, 116, 139, 0.3)';

    if (vertex === currentVertex) {
      backgroundColor = '#f59e0b';
      borderColor = '#d97706';
      transform = 'scale(1.2)';
      boxShadow = '0 8px 25px rgba(245, 158, 11, 0.5)';
    } else if (shortestPath.includes(vertex)) {
      backgroundColor = '#10b981';
      borderColor = '#059669';
      boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
    } else if (visitedVertices.has(vertex)) {
      backgroundColor = '#3b82f6';
      borderColor = '#2563eb';
      boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
    } else if (vertex === startVertex) {
      backgroundColor = '#8b5cf6';
      borderColor = '#7c3aed';
      boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
    } else if (vertex === endVertex) {
      backgroundColor = '#ef4444';
      borderColor = '#dc2626';
      boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)';
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
      margin: '10px',
      position: 'relative'
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
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 12px'
          }}>
            Dijkstra's Algorithm
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#1e293b', margin: '0' }}>
            Find shortest paths using priority queue and greedy approach
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
              Weighted Graph Visualization
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
                <span style={{ color: '#f59e0b', fontSize: '14px', fontWeight: '600' }}>
                  {currentStep}/{totalSteps} vertices | {isComplete ? `Distance: ${distances[endVertex]}` : 'Computing...'}
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
                  background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
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
                    
                    const isInPath = shortestPath.includes(edge.from) && shortestPath.includes(edge.to) && 
                                     Math.abs(shortestPath.indexOf(edge.from) - shortestPath.indexOf(edge.to)) === 1;
                    
                    return (
                      <g key={idx}>
                        <line
                          x1={`${x1}%`}
                          y1={`${y1}%`}
                          x2={`${x2}%`}
                          y2={`${y2}%`}
                          stroke={isInPath ? '#10b981' : '#cbd5e1'}
                          strokeWidth="3"
                        />
                        <text
                          x={`${(x1 + x2) / 2}%`}
                          y={`${(y1 + y2) / 2}%`}
                          fill="#f59e0b"
                          fontSize="14"
                          fontWeight="700"
                          textAnchor="middle"
                        >
                          {edge.weight}
                        </text>
                      </g>
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
                      <div key={vertex} style={{ position: 'relative' }}>
                        <div
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
                        {distances[vertex] !== undefined && distances[vertex] !== Infinity && (
                          <div style={{
                            position: 'absolute',
                            left: `calc(${x}% - 10px)`,
                            top: `calc(${y}% - 40px)`,
                            background: '#f59e0b',
                            color: 'white',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: '700',
                            zIndex: 20
                          }}>
                            {distances[vertex]}
                          </div>
                        )}
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
                <div style={{ fontWeight: '600', marginBottom: '8px' }}>Weighted Edges:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {graph.edges.map((edge, idx) => {
                    const isInPath = shortestPath.includes(edge.from) && shortestPath.includes(edge.to) && 
                                     Math.abs(shortestPath.indexOf(edge.from) - shortestPath.indexOf(edge.to)) === 1;
                    return (
                      <span key={idx} style={{
                        background: isInPath ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.2)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: isInPath ? '#10b981' : '#f59e0b'
                      }}>
                        {edge.from} ↔ {edge.to} ({edge.weight})
                      </span>
                    );
                  })}
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
                  placeholder="e.g., F"
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
                <input
                  type="number"
                  value={edgeWeight}
                  onChange={(e) => setEdgeWeight(e.target.value)}
                  placeholder="Weight"
                  disabled={isRunning}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb',
                    background: '#fff',
                    fontSize: '14px',
                    marginBottom: '8px'
                  }}
                />
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
                Dijkstra Controls
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
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
                    End Vertex
                  </label>
                  <select
                    value={endVertex}
                    onChange={(e) => setEndVertex(e.target.value)}
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
                  onClick={performDijkstra}
                  disabled={isRunning}
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
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
                  {isRunning ? 'Running...' : 'Find Shortest Path'}
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
            {/* Priority Queue */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: '25px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px', color: '#1f2937' }}>
                Priority Queue
              </h3>
              <div style={{ minHeight: '120px' }}>
                {priorityQueue.length === 0 ? (
                  <div style={{ color: '#64748b', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
                    Queue is empty
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {priorityQueue
                      .sort((a, b) => a.distance - b.distance)
                      .slice(0, 5)
                      .map((item, index) => (
                      <div
                        key={`${item.vertex}-${index}`}
                        style={{
                          padding: '10px',
                          background: index === 0 
                            ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                            : 'rgba(245, 158, 11, 0.3)',
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: index === 0 ? 'white' : '#1f2937'
                        }}
                      >
                        <span>{item.vertex}</span>
                        <span>{item.distance === Infinity ? '∞' : item.distance}</span>
                        {index === 0 && <span style={{ fontSize: '12px' }}>(MIN)</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Distance Table */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: '25px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px', color: '#1f2937' }}>
                Distances
              </h3>
              <div style={{ display: 'grid', gap: '8px' }}>
                {graph.vertices.map(vertex => (
                  <div key={vertex} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: vertex === currentVertex ? 'rgba(245, 158, 11, 0.3)' : '#f9fafb',
                    borderRadius: '6px',
                    fontSize: '14px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <span style={{ fontWeight: '600' }}>{vertex}:</span>
                    <span style={{ 
                      color: distances[vertex] === Infinity ? '#64748b' : '#f59e0b',
                      fontWeight: '600'
                    }}>
                      {distances[vertex] === undefined ? '-' : 
                       distances[vertex] === Infinity ? '∞' : distances[vertex]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shortest Path */}
            {shortestPath.length > 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '16px',
                padding: '25px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px', color: '#1f2937' }}>
                  Shortest Path
                </h3>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  alignItems: 'center'
                }}>
                  {shortestPath.map((vertex, index) => (
                    <React.Fragment key={index}>
                      <span style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        {vertex}
                      </span>
                      {index < shortestPath.length - 1 && (
                        <span style={{ color: '#64748b' }}>→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div style={{ 
                  marginTop: '10px', 
                  fontSize: '14px', 
                  color: '#10b981',
                  fontWeight: '600'
                }}>
                  Total Distance: {distances[endVertex]}
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
                  { label: 'Time Complexity', value: 'O((V+E) log V)' },
                  { label: 'Space Complexity', value: 'O(V)' },
                  { label: 'Data Structure', value: 'Priority Queue' },
                  { label: 'Type', value: 'Shortest Path' }
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>{label}:</span>
                    <span style={{ fontWeight: '600', color: '#f59e0b' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Operation Log */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: '20px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              height: '400px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>
                Operation Log
              </h3>
              <div style={{ 
                flex: 1,
                overflowY: 'auto',
                paddingRight: '8px'
              }}>
                {operationLog.length > 0 ? operationLog.map((log) => (
                  <div key={log.id} style={{
                    padding: '8px 10px',
                    marginBottom: '6px',
                    background: '#f9fafb',
                    borderRadius: '6px',
                    fontSize: '11px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '3px'
                    }}>
                      <span style={{
                        fontWeight: '700',
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: log.operation.includes('SELECT') ? '#10b981' :
                               log.operation.includes('UPDATE') ? '#f59e0b' :
                               log.operation.includes('VISIT') ? '#06b6d4' :
                               log.operation === 'COMPLETE' ? '#10b981' : '#64748b',
                        color: 'white'
                      }}>
                        {log.operation}
                      </span>
                      <span style={{ color: '#94a3b8', fontSize: '9px' }}>
                        {log.timestamp}
                      </span>
                    </div>
                    <div style={{ color: '#475569', fontSize: '11px', lineHeight: '1.4' }}>
                      {log.details}
                    </div>
                  </div>
                )) : (
                  <div style={{ 
                    color: '#94a3b8', 
                    fontStyle: 'italic', 
                    textAlign: 'center', 
                    padding: '40px 20px',
                    fontSize: '12px'
                  }}>
                    No operations yet. Start Dijkstra to see logs!
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

export default DijkstrasAlgorithmVisualize;
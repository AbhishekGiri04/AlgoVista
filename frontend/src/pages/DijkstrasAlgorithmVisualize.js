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
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [operationLog, setOperationLog] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const addToLog = (operation, details, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setOperationLog(prev => [{
      id: Date.now(),
      operation,
      details,
      timestamp,
      type
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
    setIsPaused(false);
    setCurrentStep(0);
    setTotalSteps(0);
    setIsComplete(false);
    addToLog('RESET', 'Dijkstra\'s algorithm reset', 'info');
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const performDijkstra = async () => {
    if (isRunning && !isPaused) return;
    
    if (isPaused) {
      setIsPaused(false);
      return;
    }

    resetVisualization();
    setIsRunning(true);
    
    const adjList = getAdjacencyList();
    const dist = {};
    const prev = {};
    const visited = new Set();
    const pq = [];
    let stepCount = 0;
    
    // Initialize distances
    graph.vertices.forEach(vertex => {
      dist[vertex] = vertex === startVertex ? 0 : Infinity;
      prev[vertex] = null;
      pq.push({ vertex, distance: dist[vertex] });
    });
    
    setDistances({...dist});
    setPreviousVertices({...prev});
    setPriorityQueue([...pq]);
    setTotalSteps(graph.vertices.length);
    
    addToLog('INIT', `Starting Dijkstra from ${startVertex} to ${endVertex}`, 'success');
    await sleep(speed);

    while (pq.length > 0 && isRunning) {
      if (isPaused) {
        await new Promise(resolve => {
          const checkPause = () => {
            if (!isPaused) resolve();
            else setTimeout(checkPause, 100);
          };
          checkPause();
        });
      }

      // Sort priority queue by distance
      pq.sort((a, b) => a.distance - b.distance);
      const current = pq.shift();
      
      if (!current || visited.has(current.vertex)) continue;
      
      setCurrentVertex(current.vertex);
      setPriorityQueue([...pq]);
      setCurrentStep(++stepCount);
      
      addToLog('SELECT', `Selected ${current.vertex} with distance ${current.distance}`, 'info');
      await sleep(speed);

      visited.add(current.vertex);
      setVisitedVertices(new Set(visited));
      
      addToLog('VISIT', `Visited ${current.vertex}`, 'success');
      
      if (current.vertex === endVertex) {
        // Reconstruct shortest path
        const path = [];
        let curr = endVertex;
        while (curr !== null) {
          path.unshift(curr);
          curr = prev[curr];
        }
        setShortestPath(path);
        setIsComplete(true);
        addToLog('COMPLETE', `Shortest path found: ${path.join(' → ')} (Distance: ${dist[endVertex]})`, 'success');
        break;
      }

      // Update distances to neighbors
      const neighbors = adjList[current.vertex] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.vertex)) {
          const newDist = dist[current.vertex] + neighbor.weight;
          if (newDist < dist[neighbor.vertex]) {
            dist[neighbor.vertex] = newDist;
            prev[neighbor.vertex] = current.vertex;
            
            // Update priority queue
            const pqIndex = pq.findIndex(item => item.vertex === neighbor.vertex);
            if (pqIndex !== -1) {
              pq[pqIndex].distance = newDist;
            }
            
            addToLog('UPDATE', `Updated ${neighbor.vertex}: distance = ${newDist}`, 'warning');
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

  const pauseResume = () => {
    setIsPaused(!isPaused);
    addToLog(isPaused ? 'RESUME' : 'PAUSE', `Dijkstra ${isPaused ? 'resumed' : 'paused'}`, 'warning');
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
      background: 'linear-gradient(135deg, #0f172a, #1e293b, #334155)',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Inter, sans-serif',
      color: 'white'
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
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 12px'
          }}>
            Dijkstra's Algorithm
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#94a3b8', margin: '0' }}>
            Find shortest paths using priority queue and greedy approach
          </p>
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
              Weighted Graph Visualization
            </h2>

            {/* Progress Bar */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '30px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#94a3b8', fontSize: '14px' }}>Progress</span>
                <span style={{ color: '#f59e0b', fontSize: '14px', fontWeight: '600' }}>
                  {currentStep}/{totalSteps} vertices | {isComplete ? `Distance: ${distances[endVertex]}` : 'Computing...'}
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
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
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                justifyContent: 'center',
                marginBottom: '30px'
              }}>
                {graph.vertices.map(vertex => (
                  <div key={vertex} style={{ position: 'relative' }}>
                    <div style={getVertexStyle(vertex)}>
                      {vertex}
                    </div>
                    {distances[vertex] !== undefined && distances[vertex] !== Infinity && (
                      <div style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        background: '#f59e0b',
                        color: 'white',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: '700'
                      }}>
                        {distances[vertex]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '15px',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#cbd5e1',
                maxWidth: '600px'
              }}>
                <div><strong>Weighted Edges:</strong></div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                  {graph.edges.map((edge, idx) => (
                    <span key={idx} style={{
                      background: shortestPath.includes(edge.from) && shortestPath.includes(edge.to) && 
                                 Math.abs(shortestPath.indexOf(edge.from) - shortestPath.indexOf(edge.to)) === 1
                        ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.2)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {edge.from} ↔ {edge.to} ({edge.weight})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Controls */}
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
                Dijkstra Controls
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#cbd5e1' }}>
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
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px'
                    }}
                  >
                    {graph.vertices.map(vertex => (
                      <option key={vertex} value={vertex}>{vertex}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#cbd5e1' }}>
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
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px'
                    }}
                  >
                    {graph.vertices.map(vertex => (
                      <option key={vertex} value={vertex}>{vertex}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#cbd5e1' }}>
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
                  <div style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                    {speed}ms
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={performDijkstra}
                  disabled={isRunning && !isPaused}
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: (isRunning && !isPaused) ? 'not-allowed' : 'pointer',
                    opacity: (isRunning && !isPaused) ? 0.6 : 1
                  }}
                >
                  {isRunning ? (isPaused ? '▶️ Resume' : '🔄 Running') : '▶️ Find Shortest Path'}
                </button>
                
                {isRunning && (
                  <button
                    onClick={pauseResume}
                    style={{
                      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {isPaused ? '▶️ Resume' : '⏸️ Pause'}
                  </button>
                )}
                
                <button
                  onClick={resetVisualization}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  🔄 Reset
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Priority Queue */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '25px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px', color: '#e2e8f0' }}>
                🏆 Priority Queue
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
                          fontWeight: '600'
                        }}
                      >
                        <span>{item.vertex}</span>
                        <span>{item.distance === Infinity ? '∞' : item.distance}</span>
                        {index === 0 && <span style={{ fontSize: '12px' }}>← MIN</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Distance Table */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '25px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px', color: '#e2e8f0' }}>
                📏 Distances
              </h3>
              <div style={{ display: 'grid', gap: '8px' }}>
                {graph.vertices.map(vertex => (
                  <div key={vertex} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: vertex === currentVertex ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '6px',
                    fontSize: '14px'
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
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '25px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px', color: '#e2e8f0' }}>
                  🛤️ Shortest Path
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
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '25px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px', color: '#e2e8f0' }}>
                ⚡ Algorithm Info
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  { label: 'Time Complexity', value: 'O((V+E) log V)' },
                  { label: 'Space Complexity', value: 'O(V)' },
                  { label: 'Data Structure', value: 'Priority Queue' },
                  { label: 'Type', value: 'Shortest Path' }
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>{label}:</span>
                    <span style={{ fontWeight: '600', color: '#f59e0b' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Operation Log */}
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
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {operationLog.length > 0 ? operationLog.map((log) => (
                  <div key={log.id} style={{
                    padding: '10px',
                    marginBottom: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}>
                    <div style={{ 
                      fontWeight: '600', 
                      color: log.type === 'success' ? '#10b981' :
                             log.type === 'warning' ? '#f59e0b' :
                             log.type === 'error' ? '#ef4444' : '#f59e0b'
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
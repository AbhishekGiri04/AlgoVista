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
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [operationLog, setOperationLog] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);

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
    setIsPaused(false);
    setCurrentStep(0);
    setTotalSteps(0);
    setCurrentLevel(0);
    addToLog('RESET', 'BFS visualization reset', 'info');
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const performBFS = async () => {
    if (isRunning && !isPaused) return;
    
    if (isPaused) {
      setIsPaused(false);
      return;
    }

    resetVisualization();
    setIsRunning(true);
    
    const adjList = getAdjacencyList();
    const visited = new Set();
    const bfsQueue = [startVertex];
    const path = [];
    let stepCount = 0;
    let level = 0;
    
    addToLog('START', `Starting BFS from vertex ${startVertex}`, 'success');
    setQueue([startVertex]);
    setTotalSteps(graph.vertices.length);
    setCurrentLevel(0);

    while (bfsQueue.length > 0 && isRunning) {
      if (isPaused) {
        await new Promise(resolve => {
          const checkPause = () => {
            if (!isPaused) resolve();
            else setTimeout(checkPause, 100);
          };
          checkPause();
        });
      }

      const current = bfsQueue.shift();
      setCurrentVertex(current);
      setQueue([...bfsQueue]);
      setCurrentStep(++stepCount);
      
      addToLog('DEQUEUE', `Dequeued ${current} from queue`, 'info');
      await sleep(speed);

      if (!visited.has(current)) {
        visited.add(current);
        path.push(current);
        setVisitedVertices(new Set(visited));
        setTraversalPath([...path]);
        
        addToLog('VISIT', `Visited vertex ${current} at level ${level}`, 'success');
        await sleep(speed);

        // Add unvisited neighbors to queue
        const neighbors = adjList[current] || [];
        const unvisitedNeighbors = neighbors.filter(neighbor => 
          !visited.has(neighbor) && !bfsQueue.includes(neighbor)
        );
        
        for (const neighbor of unvisitedNeighbors) {
          bfsQueue.push(neighbor);
          addToLog('ENQUEUE', `Enqueued ${neighbor} to queue`, 'info');
        }
        
        setQueue([...bfsQueue]);
        await sleep(speed / 2);
      }
      
      // Update level for next iteration
      if (bfsQueue.length > 0) {
        level++;
        setCurrentLevel(level);
      }
    }

    setCurrentVertex(null);
    setIsRunning(false);
    addToLog('COMPLETE', `BFS completed! Path: ${path.join(' → ')}`, 'success');
  };

  const pauseResume = () => {
    setIsPaused(!isPaused);
    addToLog(isPaused ? 'RESUME' : 'PAUSE', `BFS ${isPaused ? 'resumed' : 'paused'}`, 'warning');
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
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 12px'
          }}>
            Breadth First Search (BFS)
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#94a3b8', margin: '0' }}>
            Explore graph level by level using queue-based traversal
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
              Graph Visualization
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
                <span style={{ color: '#60a5fa', fontSize: '14px', fontWeight: '600' }}>
                  {currentStep}/{totalSteps} vertices | Level: {currentLevel}
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
                  background: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
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
                color: '#cbd5e1',
                maxWidth: '600px'
              }}>
                <div><strong>Edges:</strong></div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                  {graph.edges.map((edge, idx) => (
                    <span key={idx} style={{
                      background: 'rgba(6, 182, 212, 0.2)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {edge.from} ↔ {edge.to}
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
                BFS Controls
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
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
                  onClick={performBFS}
                  disabled={isRunning && !isPaused}
                  style={{
                    background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
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
                  {isRunning ? (isPaused ? '▶️ Resume' : '🔄 Running') : '▶️ Start BFS'}
                </button>
                
                {isRunning && (
                  <button
                    onClick={pauseResume}
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
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
            {/* BFS Queue */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '25px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px', color: '#e2e8f0' }}>
                🚶 BFS Queue
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
                          fontSize: '14px'
                        }}
                      >
                        {vertex} {index === 0 && '← FRONT'}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Traversal Path */}
            {traversalPath.length > 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '25px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px', color: '#e2e8f0' }}>
                  🛤️ Traversal Path
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
                  { label: 'Time Complexity', value: 'O(V + E)' },
                  { label: 'Space Complexity', value: 'O(V)' },
                  { label: 'Data Structure', value: 'Queue' },
                  { label: 'Type', value: 'Level-wise Traversal' }
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>{label}:</span>
                    <span style={{ fontWeight: '600', color: '#06b6d4' }}>{value}</span>
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
                             log.type === 'error' ? '#ef4444' : '#06b6d4'
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
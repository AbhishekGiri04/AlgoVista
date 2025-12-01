import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

class DijkstraGraph {
  constructor() {
    this.vertices = new Map();
    this.adjacencyList = new Map();
  }
  
  addVertex(vertex, x, y) {
    if (!this.vertices.has(vertex)) {
      this.vertices.set(vertex, { id: vertex, x, y, z: 0 });
      this.adjacencyList.set(vertex, []);
      return true;
    }
    return false;
  }
  
  addEdge(vertex1, vertex2, weight) {
    if (this.vertices.has(vertex1) && this.vertices.has(vertex2)) {
      this.adjacencyList.get(vertex1).push({ to: vertex2, weight });
      this.adjacencyList.get(vertex2).push({ to: vertex1, weight });
      return true;
    }
    return false;
  }
  
  getVertices() {
    return Array.from(this.vertices.values());
  }
  
  getEdges() {
    const edges = [];
    const processed = new Set();
    
    for (let [vertex, adjacents] of this.adjacencyList) {
      for (let adjacent of adjacents) {
        const edgeKey = [vertex, adjacent.to].sort().join('-');
        if (!processed.has(edgeKey)) {
          edges.push({
            from: vertex,
            to: adjacent.to,
            weight: adjacent.weight,
            fromPos: this.vertices.get(vertex),
            toPos: this.vertices.get(adjacent.to)
          });
          processed.add(edgeKey);
        }
      }
    }
    return edges;
  }
  
  getNeighbors(vertex) {
    return this.adjacencyList.get(vertex) || [];
  }
}

const DijkstraNode = ({ position, vertex, status, distance, isSource }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      if (status === 'current') {
        meshRef.current.scale.setScalar(1.4 + Math.sin(state.clock.elapsedTime * 8) * 0.1);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });
  
  const getColor = () => {
    if (isSource) return '#8b5cf6'; // Purple for source
    switch (status) {
      case 'current': return '#10b981'; // Green for current
      case 'visited': return '#3b82f6'; // Blue for visited
      case 'unvisited': return '#64748b'; // Gray for unvisited
      default: return '#64748b';
    }
  };
  
  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color={getColor()} />
      </mesh>
      <Text
        position={[0, 0, 0.7]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {vertex.id}
      </Text>
      <Text
        position={[0, -1.2, 0]}
        fontSize={0.3}
        color={distance === Infinity ? '#ef4444' : '#10b981'}
        anchorX="center"
        anchorY="middle"
      >
        {distance === Infinity ? '∞' : distance}
      </Text>
      {isSource && (
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.25}
          color="#8b5cf6"
          anchorX="center"
          anchorY="middle"
        >
          SOURCE
        </Text>
      )}
    </group>
  );
};

const DijkstraEdge = ({ edge, isRelaxing, isSkipped, isShortestPath }) => {
  const meshRef = useRef();
  const { fromPos, toPos, weight } = edge;
  
  const start = [fromPos.x, fromPos.y, fromPos.z];
  const end = [toPos.x, toPos.y, toPos.z];
  const midpoint = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2, (start[2] + end[2]) / 2];
  const direction = [end[0] - start[0], end[1] - start[1], end[2] - start[2]];
  const length = Math.sqrt(direction[0] ** 2 + direction[1] ** 2 + direction[2] ** 2);
  
  useFrame((state) => {
    if (meshRef.current && isRelaxing) {
      meshRef.current.material.opacity = 0.8 + Math.sin(state.clock.elapsedTime * 8) * 0.2;
    }
  });
  
  const getColor = () => {
    if (isShortestPath) return '#8b5cf6'; // Purple for shortest path
    if (isRelaxing) return '#f59e0b'; // Orange for relaxing
    if (isSkipped) return '#ef4444'; // Red for skipped
    return '#64748b'; // Gray default
  };
  
  return (
    <group>
      <mesh ref={meshRef} position={midpoint}>
        <boxGeometry args={[isShortestPath ? 0.12 : 0.08, length, isShortestPath ? 0.12 : 0.08]} />
        <meshStandardMaterial 
          color={getColor()} 
          transparent
          opacity={isRelaxing ? 0.9 : 1}
        />
      </mesh>
      <Text
        position={[midpoint[0], midpoint[1] + 0.5, midpoint[2]]}
        fontSize={0.25}
        color="#f59e0b"
        anchorX="center"
        anchorY="middle"
      >
        {weight}
      </Text>
    </group>
  );
};

const DijkstrasAlgorithmVisualize = () => {
  const [graph] = useState(() => {
    const g = new DijkstraGraph();
    // Create example graph: A-B(4), A-C(2), B-C(5), C-D(3)
    g.addVertex('A', -2, 1);
    g.addVertex('B', 2, 1);
    g.addVertex('C', -1, -1);
    g.addVertex('D', 1, -2);
    
    g.addEdge('A', 'B', 4);
    g.addEdge('A', 'C', 2);
    g.addEdge('B', 'C', 5);
    g.addEdge('C', 'D', 3);
    
    return g;
  });
  
  const [vertices] = useState(() => graph.getVertices());
  const [edges] = useState(() => graph.getEdges());
  const [sourceVertex, setSourceVertex] = useState('A');
  const [isRunning, setIsRunning] = useState(false);
  const [distances, setDistances] = useState({});
  const [visited, setVisited] = useState(new Set());
  const [currentNode, setCurrentNode] = useState(null);
  const [priorityQueue, setPriorityQueue] = useState([]);
  const [relaxingEdge, setRelaxingEdge] = useState(null);
  const [skippedEdge, setSkippedEdge] = useState(null);
  const [shortestPaths, setShortestPaths] = useState(new Set());
  const [operationLog, setOperationLog] = useState([]);
  const [dijkstraComplete, setDijkstraComplete] = useState(false);
  const [step, setStep] = useState(0);
  
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setOperationLog(prev => [...prev.slice(-5), { message, type, timestamp }]);
  };
  
  const resetDijkstra = () => {
    setIsRunning(false);
    setDistances({});
    setVisited(new Set());
    setCurrentNode(null);
    setPriorityQueue([]);
    setRelaxingEdge(null);
    setSkippedEdge(null);
    setShortestPaths(new Set());
    setDijkstraComplete(false);
    setStep(0);
    setOperationLog([]);
    addLog('Dijkstra Reset - Ready to start', 'info');
  };
  
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  const performDijkstra = async () => {
    if (isRunning) return;
    
    resetDijkstra();
    setIsRunning(true);
    
    // Initialize distances
    const dist = {};
    const pq = [];
    const visitedSet = new Set();
    const previous = {};
    
    vertices.forEach(v => {
      dist[v.id] = v.id === sourceVertex ? 0 : Infinity;
      if (v.id === sourceVertex) {
        pq.push({ vertex: v.id, distance: 0 });
      }
    });
    
    setDistances({...dist});
    setPriorityQueue([...pq]);
    addLog(`Initialize: ${sourceVertex} = 0, others = ∞`, 'success');
    
    await sleep(1500);
    
    while (pq.length > 0) {
      // Sort priority queue by distance (min-heap simulation)
      pq.sort((a, b) => a.distance - b.distance);
      const current = pq.shift();
      
      if (visitedSet.has(current.vertex)) continue;
      
      setCurrentNode(current.vertex);
      setPriorityQueue([...pq]);
      addLog(`Processing ${current.vertex} (distance: ${current.distance})`, 'info');
      
      await sleep(1000);
      
      // Mark as visited
      visitedSet.add(current.vertex);
      setVisited(new Set(visitedSet));
      
      // Get neighbors
      const neighbors = graph.getNeighbors(current.vertex);
      
      for (let neighbor of neighbors) {
        if (visitedSet.has(neighbor.to)) continue;
        
        const newDistance = dist[current.vertex] + neighbor.weight;
        
        // Highlight edge being processed
        setRelaxingEdge({ from: current.vertex, to: neighbor.to });
        addLog(`Relaxing edge ${current.vertex}→${neighbor.to} (weight: ${neighbor.weight})`, 'info');
        
        await sleep(800);
        
        if (newDistance < dist[neighbor.to]) {
          // Update distance (relaxation)
          dist[neighbor.to] = newDistance;
          previous[neighbor.to] = current.vertex;
          setDistances({...dist});
          
          // Add to priority queue
          pq.push({ vertex: neighbor.to, distance: newDistance });
          setPriorityQueue([...pq]);
          
          addLog(`Updated ${neighbor.to}: ${dist[neighbor.to]} (via ${current.vertex})`, 'success');
        } else {
          // Skip edge (no improvement)
          setSkippedEdge({ from: current.vertex, to: neighbor.to });
          addLog(`No improvement for ${neighbor.to}: ${newDistance} ≥ ${dist[neighbor.to]}`, 'warning');
          
          await sleep(500);
          setSkippedEdge(null);
        }
        
        setRelaxingEdge(null);
        await sleep(300);
      }
      
      await sleep(500);
    }
    
    // Build shortest path tree
    const pathEdges = new Set();
    vertices.forEach(v => {
      if (previous[v.id]) {
        pathEdges.add([previous[v.id], v.id].sort().join('-'));
      }
    });
    setShortestPaths(pathEdges);
    
    setCurrentNode(null);
    setDijkstraComplete(true);
    addLog('Dijkstra Complete! Shortest paths found.', 'success');
    
    // Log final distances
    vertices.forEach(v => {
      if (v.id !== sourceVertex) {
        addLog(`${sourceVertex} → ${v.id}: ${dist[v.id]}`, 'info');
      }
    });
    
    setIsRunning(false);
  };
  
  const getNodeStatus = (vertex) => {
    if (vertex.id === currentNode) return 'current';
    if (visited.has(vertex.id)) return 'visited';
    return 'unvisited';
  };
  
  const isEdgeRelaxing = (edge) => {
    return relaxingEdge && 
           ((relaxingEdge.from === edge.from && relaxingEdge.to === edge.to) ||
            (relaxingEdge.from === edge.to && relaxingEdge.to === edge.from));
  };
  
  const isEdgeSkipped = (edge) => {
    return skippedEdge && 
           ((skippedEdge.from === edge.from && skippedEdge.to === edge.to) ||
            (skippedEdge.from === edge.to && skippedEdge.to === edge.from));
  };
  
  const isEdgeInShortestPath = (edge) => {
    const edgeKey = [edge.from, edge.to].sort().join('-');
    return shortestPaths.has(edgeKey);
  };
  
  return (
    <div style={{
      backgroundColor: '#0a0e1a',
      color: 'white',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <a href="/graphalgorithms" style={{
        background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
        color: 'white',
        padding: '12px 20px',
        border: 'none',
        borderRadius: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'none',
        boxShadow: '0 6px 20px rgba(124, 58, 237, 0.4)',
        display: 'inline-block',
        marginBottom: '20px'
      }}>
        ← Back to Graph Algorithms
      </a>
      
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, #8b5cf6, #f59e0b)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        🚀 Dijkstra's Shortest Path Visualizer
      </h1>
      
      <div style={{ display: 'flex', gap: '20px', height: '80vh' }}>
        <div style={{ 
          flex: 2, 
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))', 
          borderRadius: '16px', 
          overflow: 'hidden',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 10,
            background: 'rgba(0, 0, 0, 0.7)',
            padding: '12px 16px',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            🚀 Dijkstra's Algorithm - Shortest Path Finding
          </div>
          
          <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            
            {vertices.map((vertex) => (
              <DijkstraNode
                key={vertex.id}
                position={[vertex.x, vertex.y, vertex.z]}
                vertex={vertex}
                status={getNodeStatus(vertex)}
                distance={distances[vertex.id] || (vertex.id === sourceVertex ? 0 : Infinity)}
                isSource={vertex.id === sourceVertex}
              />
            ))}
            
            {edges.map((edge, index) => (
              <DijkstraEdge
                key={`${edge.from}-${edge.to}-${index}`}
                edge={edge}
                isRelaxing={isEdgeRelaxing(edge)}
                isSkipped={isEdgeSkipped(edge)}
                isShortestPath={isEdgeInShortestPath(edge)}
              />
            ))}
            
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          </Canvas>
          
          {dijkstraComplete && (
            <div style={{
              position: 'absolute',
              top: '60px',
              left: '20px',
              right: '20px',
              background: 'rgba(139, 92, 246, 0.9)',
              padding: '12px',
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              🎉 Shortest Paths Found! Purple edges show the shortest path tree.
            </div>
          )}
          
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            right: '20px',
            background: 'rgba(0, 0, 0, 0.8)',
            padding: '16px',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>Source: </span>
              <span style={{ color: '#8b5cf6', fontWeight: '600', fontSize: '16px' }}>{sourceVertex}</span>
            </div>
            <div>
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>Current: </span>
              <span style={{ color: '#10b981', fontWeight: '600', fontSize: '16px' }}>
                {currentNode || 'None'}
              </span>
            </div>
            <div>
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>Visited: </span>
              <span style={{ color: '#3b82f6', fontWeight: '600', fontSize: '16px' }}>
                {visited.size}/{vertices.length}
              </span>
            </div>
          </div>
        </div>
        
        <div style={{ 
          flex: 1, 
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))', 
          borderRadius: '24px', 
          padding: '24px',
          border: '1px solid rgba(139, 92, 246, 0.2)'
        }}>
          <h3 style={{ color: 'white', fontSize: '1.4rem', fontWeight: '700', marginBottom: '24px' }}>
            🚀 Dijkstra Controls
          </h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>
              Source Vertex
            </label>
            <select
              value={sourceVertex}
              onChange={(e) => setSourceVertex(e.target.value)}
              disabled={isRunning}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid rgba(139, 92, 246, 0.2)',
                background: 'rgba(30, 41, 59, 0.8)',
                color: 'white',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              {vertices.map(v => (
                <option key={v.id} value={v.id}>{v.id}</option>
              ))}
            </select>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <motion.button
              onClick={performDijkstra}
              disabled={isRunning}
              whileHover={{ scale: isRunning ? 1 : 1.05 }}
              style={{
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: isRunning ? 'linear-gradient(135deg, #6b7280, #4b5563)' : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                color: 'white',
                fontWeight: '600',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              {isRunning ? '🔄 Running' : '▶️ Start'}
            </motion.button>
            
            <motion.button
              onClick={resetDijkstra}
              whileHover={{ scale: 1.05 }}
              style={{
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🔄 Reset
            </motion.button>
          </div>
          
          {/* Priority Queue */}
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '20px',
            border: '1px solid rgba(245, 158, 11, 0.2)'
          }}>
            <h4 style={{ color: '#f59e0b', marginBottom: '12px', fontSize: '16px' }}>📊 Priority Queue</h4>
            <div style={{ minHeight: '60px' }}>
              {priorityQueue.length === 0 ? (
                <div style={{ color: '#64748b', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>
                  Queue is empty
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {priorityQueue
                    .sort((a, b) => a.distance - b.distance)
                    .map((item, index) => (
                    <div
                      key={`${item.vertex}-${index}`}
                      style={{
                        padding: '6px 10px',
                        background: index === 0 ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'rgba(245, 158, 11, 0.3)',
                        borderRadius: '6px',
                        textAlign: 'center',
                        fontWeight: '600',
                        fontSize: '12px',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{item.vertex}</span>
                      <span>{item.distance}</span>
                      {index === 0 && <span>← MIN</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Distance Table */}
          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '20px',
            border: '1px solid rgba(139, 92, 246, 0.2)'
          }}>
            <h4 style={{ color: '#8b5cf6', marginBottom: '12px', fontSize: '16px' }}>📏 Distances</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {vertices.map(v => (
                <div
                  key={v.id}
                  style={{
                    padding: '8px',
                    background: v.id === sourceVertex ? 'rgba(139, 92, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)',
                    borderRadius: '6px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  {v.id}: {distances[v.id] === undefined ? '∞' : distances[v.id] === Infinity ? '∞' : distances[v.id]}
                </div>
              ))}
            </div>
          </div>
          
          {/* Algorithm Info */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '20px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <h4 style={{ color: '#10b981', marginBottom: '12px', fontSize: '16px' }}>⚡ Algorithm Info</h4>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Time Complexity:</span><span style={{ color: '#10b981' }}>O(V²)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>With Min-Heap:</span><span style={{ color: '#f59e0b' }}>O((V+E)logV)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Space:</span><span style={{ color: '#3b82f6' }}>O(V)</span>
              </div>
            </div>
          </div>
          
          {/* Operation Log */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            padding: '16px',
            borderRadius: '12px',
            maxHeight: '180px',
            overflowY: 'auto'
          }}>
            <h4 style={{ color: '#10b981', marginBottom: '12px', fontSize: '16px' }}>📝 Operation Log</h4>
            <AnimatePresence>
              {operationLog.length === 0 ? (
                <div style={{ color: '#64748b', fontStyle: 'italic', textAlign: 'center', padding: '10px 0' }}>
                  No operations yet. Start Dijkstra to see logs!
                </div>
              ) : (
                operationLog.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                      padding: '6px 8px',
                      fontSize: '11px',
                      color: log.type === 'success' ? '#10b981' : 
                             log.type === 'warning' ? '#f59e0b' : '#e2e8f0',
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                      marginBottom: '4px'
                    }}
                  >
                    {log.message}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DijkstrasAlgorithmVisualize;
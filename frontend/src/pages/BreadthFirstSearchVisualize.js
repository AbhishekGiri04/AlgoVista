import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

class BFSGraph {
  constructor() {
    this.vertices = new Map();
    this.adjacencyList = new Map();
  }
  
  addVertex(vertex, x, y, level = 0) {
    if (!this.vertices.has(vertex)) {
      this.vertices.set(vertex, { id: vertex, x, y, z: 0, level });
      this.adjacencyList.set(vertex, []);
      return true;
    }
    return false;
  }
  
  addEdge(vertex1, vertex2) {
    if (this.vertices.has(vertex1) && this.vertices.has(vertex2)) {
      this.adjacencyList.get(vertex1).push(vertex2);
      this.adjacencyList.get(vertex2).push(vertex1);
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
        const edgeKey = [vertex, adjacent].sort().join('-');
        if (!processed.has(edgeKey)) {
          edges.push({
            from: vertex,
            to: adjacent,
            fromPos: this.vertices.get(vertex),
            toPos: this.vertices.get(adjacent)
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

const BFSNode = ({ position, vertex, status, level, isLevelHighlight }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      if (status === 'current') {
        meshRef.current.scale.setScalar(1.4 + Math.sin(state.clock.elapsedTime * 8) * 0.1);
      } else if (isLevelHighlight) {
        meshRef.current.scale.setScalar(1.1);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });
  
  const getColor = () => {
    switch (status) {
      case 'current': return '#10b981';
      case 'visited': return '#3b82f6';
      case 'queued': return '#f59e0b';
      case 'unvisited': return '#64748b';
      default: return '#64748b';
    }
  };
  
  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color={getColor()} />
      </mesh>
      <Text
        position={[0, 0, 0.6]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {vertex.id}
      </Text>
    </group>
  );
};

const BFSEdge = ({ edge, isActive }) => {
  const { fromPos, toPos } = edge;
  const start = [fromPos.x, fromPos.y, fromPos.z];
  const end = [toPos.x, toPos.y, toPos.z];
  const midpoint = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2, (start[2] + end[2]) / 2];
  const direction = [end[0] - start[0], end[1] - start[1], end[2] - start[2]];
  const length = Math.sqrt(direction[0] ** 2 + direction[1] ** 2 + direction[2] ** 2);
  
  return (
    <mesh position={midpoint}>
      <boxGeometry args={[0.08, length, 0.08]} />
      <meshStandardMaterial color={isActive ? '#10b981' : '#64748b'} />
    </mesh>
  );
};

const BreadthFirstSearchVisualize = () => {
  const [graph] = useState(() => {
    const g = new BFSGraph();
    g.addVertex('A', -2, 1, 0);
    g.addVertex('B', 0, 1, 1);
    g.addVertex('C', -2, -1, 1);
    g.addVertex('D', 2, 1, 2);
    g.addVertex('E', 0, -1, 2);
    
    g.addEdge('A', 'B');
    g.addEdge('A', 'C');
    g.addEdge('B', 'D');
    g.addEdge('B', 'E');
    g.addEdge('C', 'E');
    
    return g;
  });
  
  const [vertices] = useState(() => graph.getVertices());
  const [edges] = useState(() => graph.getEdges());
  const [startVertex, setStartVertex] = useState('A');
  const [isRunning, setIsRunning] = useState(false);
  const [visitedNodes, setVisitedNodes] = useState(new Set());
  const [currentNode, setCurrentNode] = useState(null);
  const [queue, setQueue] = useState([]);
  const [traversalPath, setTraversalPath] = useState([]);
  const [operationLog, setOperationLog] = useState([]);
  const [bfsComplete, setBfsComplete] = useState(false);
  
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setOperationLog(prev => [...prev.slice(-4), { message, type, timestamp }]);
  };
  
  const resetBFS = () => {
    setIsRunning(false);
    setVisitedNodes(new Set());
    setCurrentNode(null);
    setQueue([]);
    setTraversalPath([]);
    setBfsComplete(false);
    setOperationLog([]);
    addLog('BFS Reset - Ready to start', 'info');
  };
  
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  const performBFS = async () => {
    if (isRunning) return;
    
    resetBFS();
    setIsRunning(true);
    
    const visited = new Set();
    const bfsQueue = [];
    const path = [];
    
    addLog(`Starting BFS from vertex ${startVertex}`, 'success');
    
    bfsQueue.push(startVertex);
    setQueue([startVertex]);
    
    while (bfsQueue.length > 0) {
      const current = bfsQueue.shift();
      setQueue([...bfsQueue]);
      setCurrentNode(current);
      
      await sleep(1000);
      
      visited.add(current);
      path.push(current);
      setVisitedNodes(new Set(visited));
      setTraversalPath([...path]);
      
      addLog(`Visit ${current}`, 'success');
      
      const neighbors = graph.getNeighbors(current);
      for (let neighbor of neighbors) {
        if (!visited.has(neighbor) && !bfsQueue.includes(neighbor)) {
          bfsQueue.push(neighbor);
          addLog(`Enqueue ${neighbor}`, 'info');
        }
      }
      
      setQueue([...bfsQueue]);
      await sleep(500);
    }
    
    setCurrentNode(null);
    setBfsComplete(true);
    addLog(`BFS Complete! Path: ${path.join(' → ')}`, 'success');
    setIsRunning(false);
  };
  
  const getNodeStatus = (vertex) => {
    if (vertex.id === currentNode) return 'current';
    if (visitedNodes.has(vertex.id)) return 'visited';
    return 'unvisited';
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
        background: 'linear-gradient(135deg, #06b6d4, #10b981)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        🌐 Breadth First Search (BFS) Visualizer
      </h1>
      
      <div style={{ display: 'flex', gap: '20px', height: '80vh' }}>
        <div style={{ 
          flex: 2, 
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))', 
          borderRadius: '16px', 
          overflow: 'hidden',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          position: 'relative'
        }}>
          <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            
            {vertices.map((vertex) => (
              <BFSNode
                key={vertex.id}
                position={[vertex.x, vertex.y, vertex.z]}
                vertex={vertex}
                status={getNodeStatus(vertex)}
                level={vertex.level}
              />
            ))}
            
            {edges.map((edge, index) => (
              <BFSEdge
                key={`${edge.from}-${edge.to}-${index}`}
                edge={edge}
                isActive={false}
              />
            ))}
            
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          </Canvas>
          
          {traversalPath.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              background: 'rgba(6, 182, 212, 0.9)',
              padding: '12px',
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              BFS Path: {traversalPath.join(' → ')}
            </div>
          )}
        </div>
        
        <div style={{ 
          flex: 1, 
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))', 
          borderRadius: '24px', 
          padding: '24px',
          border: '1px solid rgba(6, 182, 212, 0.2)'
        }}>
          <h3 style={{ color: 'white', fontSize: '1.4rem', fontWeight: '700', marginBottom: '24px' }}>
            🌐 BFS Controls
          </h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>
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
                border: '2px solid rgba(6, 182, 212, 0.2)',
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
              onClick={performBFS}
              disabled={isRunning}
              whileHover={{ scale: isRunning ? 1 : 1.05 }}
              style={{
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: isRunning ? 'linear-gradient(135deg, #6b7280, #4b5563)' : 'linear-gradient(135deg, #06b6d4, #0891b2)',
                color: 'white',
                fontWeight: '600',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              {isRunning ? '🔄 Running' : '▶️ Start BFS'}
            </motion.button>
            
            <motion.button
              onClick={resetBFS}
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
          
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '20px',
            border: '1px solid rgba(245, 158, 11, 0.2)'
          }}>
            <h4 style={{ color: '#f59e0b', marginBottom: '12px', fontSize: '16px' }}>🗂️ BFS Queue</h4>
            <div style={{ minHeight: '60px' }}>
              {queue.length === 0 ? (
                <div style={{ color: '#64748b', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>
                  Queue is empty
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {queue.map((node, index) => (
                    <div
                      key={`${node}-${index}`}
                      style={{
                        padding: '8px 12px',
                        background: index === 0 ? 'linear-gradient(135deg, #06b6d4, #0891b2)' : 'rgba(245, 158, 11, 0.3)',
                        borderRadius: '6px',
                        textAlign: 'center',
                        fontWeight: '600',
                        fontSize: '14px',
                        minWidth: '40px'
                      }}
                    >
                      {node} {index === 0 && '← FRONT'}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            padding: '16px',
            borderRadius: '12px',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            <h4 style={{ color: '#10b981', marginBottom: '12px', fontSize: '16px' }}>📝 Operation Log</h4>
            <AnimatePresence>
              {operationLog.length === 0 ? (
                <div style={{ color: '#64748b', fontStyle: 'italic', textAlign: 'center', padding: '10px 0' }}>
                  No operations yet. Start BFS to see logs!
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
                      color: log.type === 'success' ? '#10b981' : '#e2e8f0',
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

export default BreadthFirstSearchVisualize;
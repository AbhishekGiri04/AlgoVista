import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Box, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

class Graph {
  constructor() {
    this.vertices = new Map();
    this.adjacencyList = new Map();
  }
  
  addVertex(vertex) {
    if (!this.vertices.has(vertex)) {
      this.vertices.set(vertex, {
        id: vertex,
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 6,
        z: (Math.random() - 0.5) * 4
      });
      this.adjacencyList.set(vertex, []);
      return true;
    }
    return false;
  }
  
  addEdge(vertex1, vertex2, weight = 1) {
    if (this.vertices.has(vertex1) && this.vertices.has(vertex2)) {
      if (!this.adjacencyList.get(vertex1).find(edge => edge.to === vertex2)) {
        this.adjacencyList.get(vertex1).push({ to: vertex2, weight });
        this.adjacencyList.get(vertex2).push({ to: vertex1, weight });
        return true;
      }
    }
    return false;
  }
  
  removeVertex(vertex) {
    if (this.vertices.has(vertex)) {
      // Remove all edges connected to this vertex
      for (let [v, edges] of this.adjacencyList) {
        this.adjacencyList.set(v, edges.filter(edge => edge.to !== vertex));
      }
      this.vertices.delete(vertex);
      this.adjacencyList.delete(vertex);
      return true;
    }
    return false;
  }
  
  removeEdge(vertex1, vertex2) {
    if (this.vertices.has(vertex1) && this.vertices.has(vertex2)) {
      this.adjacencyList.set(vertex1, 
        this.adjacencyList.get(vertex1).filter(edge => edge.to !== vertex2)
      );
      this.adjacencyList.set(vertex2, 
        this.adjacencyList.get(vertex2).filter(edge => edge.to !== vertex1)
      );
      return true;
    }
    return false;
  }
  
  bfs(startVertex) {
    if (!this.vertices.has(startVertex)) return [];
    
    const visited = new Set();
    const queue = [startVertex];
    const result = [];
    
    while (queue.length > 0) {
      const vertex = queue.shift();
      if (!visited.has(vertex)) {
        visited.add(vertex);
        result.push(vertex);
        
        for (let edge of this.adjacencyList.get(vertex)) {
          if (!visited.has(edge.to)) {
            queue.push(edge.to);
          }
        }
      }
    }
    return result;
  }
  
  dfs(startVertex, visited = new Set(), result = []) {
    if (!this.vertices.has(startVertex)) return [];
    
    visited.add(startVertex);
    result.push(startVertex);
    
    for (let edge of this.adjacencyList.get(startVertex)) {
      if (!visited.has(edge.to)) {
        this.dfs(edge.to, visited, result);
      }
    }
    return result;
  }
  
  getVertices() {
    return Array.from(this.vertices.values());
  }
  
  getEdges() {
    const edges = [];
    const processed = new Set();
    
    for (let [vertex, adjacents] of this.adjacencyList) {
      for (let edge of adjacents) {
        const edgeKey = [vertex, edge.to].sort().join('-');
        if (!processed.has(edgeKey)) {
          edges.push({
            from: vertex,
            to: edge.to,
            weight: edge.weight,
            fromPos: this.vertices.get(vertex),
            toPos: this.vertices.get(edge.to)
          });
          processed.add(edgeKey);
        }
      }
    }
    return edges;
  }
}

const GraphVertex = ({ position, vertex, isNew, isDeleting, isTraversing, isStart }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      if (isNew) {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 8) * 0.1);
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 4) * 0.2;
      } else if (isDeleting) {
        meshRef.current.scale.setScalar(Math.max(0.1, 1 - (state.clock.elapsedTime % 2)));
      } else if (isTraversing) {
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 5) * 0.2;
        meshRef.current.scale.setScalar(1.2);
      } else {
        meshRef.current.scale.setScalar(hovered ? 1.2 : 1);
        meshRef.current.position.y = position[1];
        meshRef.current.rotation.y = 0;
      }
    }
  });
  
  const getColor = () => {
    if (isNew) return '#10b981'; // Green for new
    if (isDeleting) return '#ef4444'; // Red for deleting
    if (isTraversing) return '#f59e0b'; // Yellow for traversing
    if (isStart) return '#8b5cf6'; // Purple for start
    return '#3b82f6'; // Blue default
  };
  
  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial 
          color={getColor()} 
          transparent 
          opacity={isDeleting ? 0.5 : 1}
        />
      </mesh>
      
      <Text
        position={[0, 0, 0.5]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {vertex.id}
      </Text>
    </group>
  );
};

const GraphEdge = ({ edge, isTraversing }) => {
  const meshRef = useRef();
  const { from, to, weight, fromPos, toPos } = edge;
  
  const start = [fromPos.x, fromPos.y, fromPos.z];
  const end = [toPos.x, toPos.y, toPos.z];
  const midpoint = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2, (start[2] + end[2]) / 2];
  
  const direction = [end[0] - start[0], end[1] - start[1], end[2] - start[2]];
  const length = Math.sqrt(direction[0] ** 2 + direction[1] ** 2 + direction[2] ** 2);
  
  useFrame((state) => {
    if (meshRef.current && isTraversing) {
      meshRef.current.material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 6) * 0.3;
    }
  });
  
  return (
    <group>
      <mesh ref={meshRef} position={midpoint}>
        <boxGeometry args={[0.05, length, 0.05]} />
        <meshStandardMaterial 
          color={isTraversing ? '#f59e0b' : '#64748b'} 
          transparent
          opacity={isTraversing ? 0.8 : 0.6}
        />
      </mesh>
      
      {weight > 1 && (
        <Text
          position={midpoint}
          fontSize={0.2}
          color="#f59e0b"
          anchorX="center"
          anchorY="middle"
        >
          {weight}
        </Text>
      )}
    </group>
  );
};

const GraphVisualize = () => {
  const [graph] = useState(() => {
    const g = new Graph();
    ['A', 'B', 'C', 'D', 'E'].forEach(v => g.addVertex(v));
    g.addEdge('A', 'B', 2);
    g.addEdge('A', 'C', 1);
    g.addEdge('B', 'D', 3);
    g.addEdge('C', 'D', 1);
    g.addEdge('D', 'E', 2);
    return g;
  });
  
  const [vertices, setVertices] = useState(() => graph.getVertices());
  const [edges, setEdges] = useState(() => graph.getEdges());
  const [inputVertex, setInputVertex] = useState('');
  const [inputVertex2, setInputVertex2] = useState('');
  const [inputWeight, setInputWeight] = useState('1');
  const [startVertex, setStartVertex] = useState('');
  const [currentOperation, setCurrentOperation] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [operationLog, setOperationLog] = useState([]);
  const [newVertex, setNewVertex] = useState(null);
  const [deletingVertex, setDeletingVertex] = useState(null);
  const [traversingVertices, setTraversingVertices] = useState([]);
  const [traversalResult, setTraversalResult] = useState([]);
  
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setOperationLog(prev => [...prev.slice(-4), { message, type, timestamp }]);
  };
  
  const updateGraphDisplay = () => {
    setVertices(graph.getVertices());
    setEdges(graph.getEdges());
  };
  
  const addVertex = async () => {
    if (!inputVertex || isAnimating) return;
    
    setIsAnimating(true);
    setCurrentOperation(`Adding vertex ${inputVertex}...`);
    
    const success = graph.addVertex(inputVertex);
    if (success) {
      setNewVertex(inputVertex);
      updateGraphDisplay();
      addLog(`✅ Added vertex ${inputVertex} (O(1))`, 'success');
    } else {
      addLog(`❌ Vertex ${inputVertex} already exists`, 'error');
    }
    
    setTimeout(() => {
      setNewVertex(null);
      setCurrentOperation('');
      setIsAnimating(false);
    }, 1500);
    
    setInputVertex('');
  };
  
  const removeVertex = async () => {
    if (!inputVertex || isAnimating) return;
    
    setIsAnimating(true);
    setCurrentOperation(`Removing vertex ${inputVertex}...`);
    
    setDeletingVertex(inputVertex);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const success = graph.removeVertex(inputVertex);
    if (success) {
      updateGraphDisplay();
      addLog(`❌ Removed vertex ${inputVertex} (O(V+E))`, 'warning');
    } else {
      addLog(`❌ Vertex ${inputVertex} not found`, 'error');
    }
    
    setDeletingVertex(null);
    
    setTimeout(() => {
      setCurrentOperation('');
      setIsAnimating(false);
    }, 500);
    
    setInputVertex('');
  };
  
  const addEdge = () => {
    if (!inputVertex || !inputVertex2 || isAnimating) return;
    
    const weight = parseInt(inputWeight) || 1;
    const success = graph.addEdge(inputVertex, inputVertex2, weight);
    
    if (success) {
      updateGraphDisplay();
      addLog(`✅ Added edge ${inputVertex}-${inputVertex2} (weight: ${weight}) (O(1))`, 'success');
    } else {
      addLog(`❌ Cannot add edge ${inputVertex}-${inputVertex2}`, 'error');
    }
    
    setInputVertex('');
    setInputVertex2('');
    setInputWeight('1');
  };
  
  const removeEdge = () => {
    if (!inputVertex || !inputVertex2 || isAnimating) return;
    
    const success = graph.removeEdge(inputVertex, inputVertex2);
    
    if (success) {
      updateGraphDisplay();
      addLog(`❌ Removed edge ${inputVertex}-${inputVertex2} (O(1))`, 'warning');
    } else {
      addLog(`❌ Edge ${inputVertex}-${inputVertex2} not found`, 'error');
    }
    
    setInputVertex('');
    setInputVertex2('');
  };
  
  const performBFS = async () => {
    if (!startVertex || isAnimating) return;
    
    setIsAnimating(true);
    setCurrentOperation('BFS Traversal...');
    
    const result = graph.bfs(startVertex);
    setTraversalResult(result);
    
    for (let i = 0; i < result.length; i++) {
      setTraversingVertices([result[i]]);
      addLog(`🔄 BFS Visiting: ${result[i]}`, 'info');
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    setTraversingVertices([]);
    addLog(`✅ BFS: [${result.join(' → ')}] (O(V+E))`, 'success');
    setCurrentOperation('');
    setIsAnimating(false);
  };
  
  const performDFS = async () => {
    if (!startVertex || isAnimating) return;
    
    setIsAnimating(true);
    setCurrentOperation('DFS Traversal...');
    
    const result = graph.dfs(startVertex);
    setTraversalResult(result);
    
    for (let i = 0; i < result.length; i++) {
      setTraversingVertices([result[i]]);
      addLog(`🔄 DFS Visiting: ${result[i]}`, 'info');
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    setTraversingVertices([]);
    addLog(`✅ DFS: [${result.join(' → ')}] (O(V+E))`, 'success');
    setCurrentOperation('');
    setIsAnimating(false);
  };
  
  const clearGraph = () => {
    if (isAnimating) return;
    graph.vertices.clear();
    graph.adjacencyList.clear();
    updateGraphDisplay();
    setTraversalResult([]);
    addLog('🧹 Graph cleared', 'info');
  };
  
  return (
    <div style={{
      backgroundColor: '#0a0e1a',
      color: 'white',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <a href="/datastructures" style={{
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
        ← Back to Data Structures
      </a>
      
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        🌐 3D Graph Visualizer
      </h1>
      
      <div style={{ display: 'flex', gap: '20px', height: '80vh' }}>
        {/* 3D Visualization */}
        <div style={{ 
          flex: 2, 
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))', 
          borderRadius: '16px', 
          overflow: 'hidden',
          border: '1px solid rgba(6, 182, 212, 0.2)',
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
            🌐 Graph Structure (V={vertices.length}, E={edges.length})
          </div>
          
          <Canvas camera={{ position: [0, 2, 12], fov: 60 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.3} />
            
            {/* Graph Vertices */}
            {vertices.map((vertex) => {
              const isNew = newVertex === vertex.id;
              const isDeleting = deletingVertex === vertex.id;
              const isTraversing = traversingVertices.includes(vertex.id);
              const isStart = startVertex === vertex.id;
              
              return (
                <GraphVertex
                  key={vertex.id}
                  position={[vertex.x, vertex.y, vertex.z]}
                  vertex={vertex}
                  isNew={isNew}
                  isDeleting={isDeleting}
                  isTraversing={isTraversing}
                  isStart={isStart}
                />
              );
            })}
            
            {/* Graph Edges */}
            {edges.map((edge, index) => {
              const isTraversing = traversingVertices.includes(edge.from) || traversingVertices.includes(edge.to);
              
              return (
                <GraphEdge
                  key={`${edge.from}-${edge.to}-${index}`}
                  edge={edge}
                  isTraversing={isTraversing}
                />
              );
            })}
            
            {/* Empty Graph Message */}
            {vertices.length === 0 && (
              <Text
                position={[0, 0, 0]}
                fontSize={0.5}
                color="#64748b"
                anchorX="center"
                anchorY="middle"
              >
                Empty Graph
              </Text>
            )}
            
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          </Canvas>
          
          {/* Graph Stats */}
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
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>Vertices: </span>
              <span style={{ color: 'white', fontWeight: '600', fontSize: '16px' }}>{vertices.length}</span>
            </div>
            <div>
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>Edges: </span>
              <span style={{ color: '#06b6d4', fontWeight: '600', fontSize: '16px' }}>{edges.length}</span>
            </div>
            <div>
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>Type: </span>
              <span style={{ color: '#8b5cf6', fontWeight: '600', fontSize: '16px' }}>Undirected</span>
            </div>
          </div>
          
          {/* Traversal Result */}
          {traversalResult.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '60px',
              left: '20px',
              right: '20px',
              background: 'rgba(6, 182, 212, 0.9)',
              padding: '12px',
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              Traversal: {traversalResult.join(' → ')}
            </div>
          )}
        </div>
        
        {/* Control Panel */}
        <div style={{ 
          flex: 1, 
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))', 
          borderRadius: '24px', 
          padding: '24px',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>🌐</div>
            <h3 style={{ 
              color: 'white', 
              fontSize: '1.4rem',
              fontWeight: '700',
              margin: 0
            }}>Graph Operations</h3>
          </div>
          
          {/* Current Operation */}
          {currentOperation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                padding: '16px',
                borderRadius: '16px',
                marginBottom: '24px',
                textAlign: 'center',
                fontWeight: '600'
              }}
            >
              {currentOperation}
            </motion.div>
          )}
          
          {/* Input Fields */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Vertex 1"
                value={inputVertex}
                onChange={(e) => setInputVertex(e.target.value.toUpperCase())}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: '2px solid rgba(6, 182, 212, 0.2)',
                  background: 'rgba(30, 41, 59, 0.8)',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <input
                type="text"
                placeholder="Vertex 2"
                value={inputVertex2}
                onChange={(e) => setInputVertex2(e.target.value.toUpperCase())}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: '2px solid rgba(6, 182, 212, 0.2)',
                  background: 'rgba(30, 41, 59, 0.8)',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
            <input
              type="number"
              placeholder="Weight (optional)"
              value={inputWeight}
              onChange={(e) => setInputWeight(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '2px solid rgba(6, 182, 212, 0.2)',
                background: 'rgba(30, 41, 59, 0.8)',
                color: 'white',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          
          {/* Vertex Operations */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#10b981', marginBottom: '12px', fontSize: '16px' }}>⭕ Vertex Operations</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <motion.button
                onClick={addVertex}
                disabled={isAnimating}
                whileHover={{ scale: isAnimating ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
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
              </motion.button>
              
              <motion.button
                onClick={removeVertex}
                disabled={isAnimating}
                whileHover={{ scale: isAnimating ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
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
              </motion.button>
            </div>
          </div>
          
          {/* Edge Operations */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#06b6d4', marginBottom: '12px', fontSize: '16px' }}>➡️ Edge Operations</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <motion.button
                onClick={addEdge}
                disabled={isAnimating}
                whileHover={{ scale: isAnimating ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
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
              </motion.button>
              
              <motion.button
                onClick={removeEdge}
                disabled={isAnimating}
                whileHover={{ scale: isAnimating ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
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
              </motion.button>
            </div>
          </div>
          
          {/* Traversal Operations */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#8b5cf6', marginBottom: '12px', fontSize: '16px' }}>🔄 Traversals</h4>
            <input
              type="text"
              placeholder="Start vertex"
              value={startVertex}
              onChange={(e) => setStartVertex(e.target.value.toUpperCase())}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '8px',
                borderRadius: '8px',
                border: '2px solid rgba(139, 92, 246, 0.2)',
                background: 'rgba(30, 41, 59, 0.8)',
                color: 'white',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <motion.button
                onClick={performBFS}
                disabled={isAnimating}
                whileHover={{ scale: isAnimating ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
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
              </motion.button>
              
              <motion.button
                onClick={performDFS}
                disabled={isAnimating}
                whileHover={{ scale: isAnimating ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
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
              </motion.button>
            </div>
          </div>
          
          {/* Clear Button */}
          <motion.button
            onClick={clearGraph}
            disabled={isAnimating}
            whileHover={{ scale: isAnimating ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #6b7280, #4b5563)',
              color: 'white',
              fontWeight: '600',
              cursor: isAnimating ? 'not-allowed' : 'pointer',
              opacity: isAnimating ? 0.6 : 1,
              marginBottom: '20px'
            }}
          >
            🧹 Clear Graph
          </motion.button>
          
          {/* Performance Table */}
          <div style={{
            background: 'rgba(6, 182, 212, 0.1)',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '20px',
            border: '1px solid rgba(6, 182, 212, 0.2)'
          }}>
            <h4 style={{ color: '#06b6d4', marginBottom: '12px', fontSize: '16px' }}>⚡ Performance</h4>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span>Add Vertex:</span><span style={{ color: '#10b981' }}>O(1)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span>Add Edge:</span><span style={{ color: '#06b6d4' }}>O(1)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span>BFS/DFS:</span><span style={{ color: '#8b5cf6' }}>O(V+E)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Space:</span><span style={{ color: '#f59e0b' }}>O(V+E)</span>
              </div>
            </div>
          </div>
          
          {/* Operation Log */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            padding: '16px',
            borderRadius: '12px',
            maxHeight: '150px',
            overflowY: 'auto'
          }}>
            <h4 style={{ color: '#10b981', marginBottom: '12px', fontSize: '16px' }}>📝 Operation Log</h4>
            <AnimatePresence>
              {operationLog.length === 0 ? (
                <div style={{ color: '#64748b', fontStyle: 'italic', textAlign: 'center', padding: '10px 0' }}>
                  No operations yet. Try adding vertices!
                </div>
              ) : (
                operationLog.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    style={{
                      padding: '4px 6px',
                      fontSize: '10px',
                      color: log.type === 'error' ? '#ef4444' : 
                             log.type === 'success' ? '#10b981' :
                             log.type === 'warning' ? '#f59e0b' : '#e2e8f0',
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                      marginBottom: '2px',
                      borderRadius: '4px',
                      background: 'rgba(255, 255, 255, 0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{log.message}</span>
                      <span style={{ color: '#64748b', fontSize: '8px' }}>{log.timestamp}</span>
                    </div>
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

export default GraphVisualize;
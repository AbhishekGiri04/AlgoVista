import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Box, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
  }
  
  insert(value) {
    this.root = this._insertNode(this.root, value);
  }
  
  _insertNode(node, value) {
    if (!node) return new TreeNode(value);
    
    if (value < node.value) {
      node.left = this._insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = this._insertNode(node.right, value);
    }
    return node;
  }
  
  delete(value) {
    this.root = this._deleteNode(this.root, value);
  }
  
  _deleteNode(node, value) {
    if (!node) return null;
    
    if (value < node.value) {
      node.left = this._deleteNode(node.left, value);
    } else if (value > node.value) {
      node.right = this._deleteNode(node.right, value);
    } else {
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      
      const minRight = this._findMin(node.right);
      node.value = minRight.value;
      node.right = this._deleteNode(node.right, minRight.value);
    }
    return node;
  }
  
  _findMin(node) {
    while (node.left) node = node.left;
    return node;
  }
  
  inorder(node = this.root, result = []) {
    if (node) {
      this.inorder(node.left, result);
      result.push(node.value);
      this.inorder(node.right, result);
    }
    return result;
  }
  
  preorder(node = this.root, result = []) {
    if (node) {
      result.push(node.value);
      this.preorder(node.left, result);
      this.preorder(node.right, result);
    }
    return result;
  }
  
  postorder(node = this.root, result = []) {
    if (node) {
      this.postorder(node.left, result);
      this.postorder(node.right, result);
      result.push(node.value);
    }
    return result;
  }
  
  levelOrder() {
    if (!this.root) return [];
    const result = [];
    const queue = [this.root];
    
    while (queue.length > 0) {
      const node = queue.shift();
      result.push(node.value);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    return result;
  }
  
  toArray() {
    const result = [];
    const traverse = (node, x = 0, y = 0, level = 0) => {
      if (node) {
        result.push({ value: node.value, x, y, level });
        const offset = Math.pow(2, Math.max(0, 3 - level));
        traverse(node.left, x - offset, y - 1.5, level + 1);
        traverse(node.right, x + offset, y - 1.5, level + 1);
      }
    };
    traverse(this.root);
    return result;
  }
}

const TreeNodeComponent = ({ position, value, isRoot, isNew, isDeleting, isTraversing, hasLeft, hasRight }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      if (isNew) {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 8) * 0.1);
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 4) * 0.2;
      } else if (isDeleting) {
        meshRef.current.scale.setScalar(Math.max(0.1, 1 - (state.clock.elapsedTime % 2)));
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 6) * 0.3;
      } else if (isTraversing) {
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 5) * 0.2;
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
    if (isRoot) return '#8b5cf6'; // Purple for root
    return '#3b82f6'; // Blue default
  };
  
  return (
    <group position={position}>
      {/* Node Sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial 
          color={getColor()} 
          transparent 
          opacity={isDeleting ? 0.5 : 1}
        />
      </mesh>
      
      {/* Value Text */}
      <Text
        position={[0, 0, 0.6]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>
      
      {/* Root Label */}
      {isRoot && (
        <Text
          position={[0, 1, 0]}
          fontSize={0.25}
          color="#8b5cf6"
          anchorX="center"
          anchorY="middle"
        >
          ROOT
        </Text>
      )}
    </group>
  );
};

const TreeEdge = ({ start, end }) => {
  const points = [start, end];
  const direction = [end[0] - start[0], end[1] - start[1], end[2] - start[2]];
  const length = Math.sqrt(direction[0] ** 2 + direction[1] ** 2 + direction[2] ** 2);
  const midpoint = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2, (start[2] + end[2]) / 2];
  
  return (
    <mesh position={midpoint}>
      <boxGeometry args={[0.05, length, 0.05]} />
      <meshStandardMaterial color="#64748b" />
    </mesh>
  );
};

const TreeVisualize = () => {
  const [bst] = useState(() => {
    const tree = new BST();
    [50, 30, 70, 20, 40, 60, 80].forEach(val => tree.insert(val));
    return tree;
  });
  const [treeNodes, setTreeNodes] = useState(() => bst.toArray());
  const [inputValue, setInputValue] = useState('');
  const [currentOperation, setCurrentOperation] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [operationLog, setOperationLog] = useState([]);
  const [newNodeValue, setNewNodeValue] = useState(null);
  const [deletingValue, setDeletingValue] = useState(null);
  const [traversingValues, setTraversingValues] = useState([]);
  const [traversalResult, setTraversalResult] = useState([]);
  
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setOperationLog(prev => [...prev.slice(-4), { message, type, timestamp }]);
  };
  
  const updateTreeDisplay = () => {
    setTreeNodes(bst.toArray());
  };
  
  const insertNode = async () => {
    if (!inputValue || isAnimating) return;
    
    const value = parseInt(inputValue);
    setIsAnimating(true);
    setCurrentOperation(`Inserting ${value}...`);
    
    bst.insert(value);
    setNewNodeValue(value);
    updateTreeDisplay();
    
    addLog(`✅ Inserted ${value} (O(log n))`, 'success');
    
    setTimeout(() => {
      setNewNodeValue(null);
      setCurrentOperation('');
      setIsAnimating(false);
    }, 1500);
    
    setInputValue('');
  };
  
  const deleteNode = async () => {
    if (!inputValue || isAnimating) return;
    
    const value = parseInt(inputValue);
    setIsAnimating(true);
    setCurrentOperation(`Deleting ${value}...`);
    
    setDeletingValue(value);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    bst.delete(value);
    updateTreeDisplay();
    setDeletingValue(null);
    
    addLog(`❌ Deleted ${value} (O(log n))`, 'warning');
    
    setTimeout(() => {
      setCurrentOperation('');
      setIsAnimating(false);
    }, 500);
    
    setInputValue('');
  };
  
  const performTraversal = async (type) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentOperation(`${type} traversal...`);
    
    let result = [];
    switch (type) {
      case 'Inorder':
        result = bst.inorder();
        break;
      case 'Preorder':
        result = bst.preorder();
        break;
      case 'Postorder':
        result = bst.postorder();
        break;
      case 'Level Order':
        result = bst.levelOrder();
        break;
    }
    
    setTraversalResult(result);
    
    for (let i = 0; i < result.length; i++) {
      setTraversingValues([result[i]]);
      addLog(`🔄 Visiting: ${result[i]}`, 'info');
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    
    setTraversingValues([]);
    addLog(`✅ ${type}: [${result.join(', ')}] (O(n))`, 'success');
    setCurrentOperation('');
    setIsAnimating(false);
  };
  
  const clearTree = () => {
    if (isAnimating) return;
    bst.root = null;
    updateTreeDisplay();
    setTraversalResult([]);
    addLog('🧹 Tree cleared', 'info');
  };
  
  const getTreeHeight = () => {
    const calculateHeight = (node) => {
      if (!node) return 0;
      return 1 + Math.max(calculateHeight(node.left), calculateHeight(node.right));
    };
    return calculateHeight(bst.root);
  };
  
  const getTreeSize = () => {
    const calculateSize = (node) => {
      if (!node) return 0;
      return 1 + calculateSize(node.left) + calculateSize(node.right);
    };
    return calculateSize(bst.root);
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
        background: 'linear-gradient(135deg, #10b981, #8b5cf6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        🌲 3D Binary Search Tree Visualizer
      </h1>
      
      <div style={{ display: 'flex', gap: '20px', height: '80vh' }}>
        {/* 3D Visualization */}
        <div style={{ 
          flex: 2, 
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))', 
          borderRadius: '16px', 
          overflow: 'hidden',
          border: '1px solid rgba(16, 185, 129, 0.2)',
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
            🌲 Binary Search Tree (BST)
          </div>
          
          <Canvas camera={{ position: [0, 2, 12], fov: 60 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.3} />
            
            {/* Tree Nodes */}
            {treeNodes.map((node, index) => {
              const isRoot = node.level === 0;
              const isNew = newNodeValue === node.value;
              const isDeleting = deletingValue === node.value;
              const isTraversing = traversingValues.includes(node.value);
              
              return (
                <TreeNodeComponent
                  key={`${node.value}-${index}`}
                  position={[node.x, node.y, 0]}
                  value={node.value}
                  isRoot={isRoot}
                  isNew={isNew}
                  isDeleting={isDeleting}
                  isTraversing={isTraversing}
                />
              );
            })}
            
            {/* Tree Edges */}
            {treeNodes.map((node, index) => {
              const edges = [];
              const parentNode = treeNodes.find(n => {
                if (n.level === node.level - 1) {
                  const leftChild = treeNodes.find(c => c.level === node.level && c.x < n.x);
                  const rightChild = treeNodes.find(c => c.level === node.level && c.x > n.x);
                  return (leftChild && leftChild.value === node.value) || (rightChild && rightChild.value === node.value);
                }
                return false;
              });
              
              if (parentNode) {
                edges.push(
                  <TreeEdge
                    key={`edge-${parentNode.value}-${node.value}`}
                    start={[parentNode.x, parentNode.y, 0]}
                    end={[node.x, node.y, 0]}
                  />
                );
              }
              
              return edges;
            })}
            
            {/* Empty Tree Message */}
            {treeNodes.length === 0 && (
              <Text
                position={[0, 0, 0]}
                fontSize={0.5}
                color="#64748b"
                anchorX="center"
                anchorY="middle"
              >
                Empty Tree
              </Text>
            )}
            
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          </Canvas>
          
          {/* Tree Stats */}
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
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>Nodes: </span>
              <span style={{ color: 'white', fontWeight: '600', fontSize: '16px' }}>{getTreeSize()}</span>
            </div>
            <div>
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>Height: </span>
              <span style={{ color: '#10b981', fontWeight: '600', fontSize: '16px' }}>{getTreeHeight()}</span>
            </div>
            <div>
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>Root: </span>
              <span style={{ color: '#8b5cf6', fontWeight: '600', fontSize: '16px' }}>
                {bst.root ? bst.root.value : 'NULL'}
              </span>
            </div>
          </div>
          
          {/* Traversal Result */}
          {traversalResult.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '60px',
              left: '20px',
              right: '20px',
              background: 'rgba(16, 185, 129, 0.9)',
              padding: '12px',
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              Result: [{traversalResult.join(', ')}]
            </div>
          )}
        </div>
        
        {/* Control Panel */}
        <div style={{ 
          flex: 1, 
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))', 
          borderRadius: '24px', 
          padding: '24px',
          border: '1px solid rgba(16, 185, 129, 0.2)',
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
              background: 'linear-gradient(135deg, #10b981, #8b5cf6)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>🌲</div>
            <h3 style={{ 
              color: 'white', 
              fontSize: '1.4rem',
              fontWeight: '700',
              margin: 0
            }}>BST Operations</h3>
          </div>
          
          {/* Current Operation */}
          {currentOperation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'linear-gradient(135deg, #10b981, #8b5cf6)',
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
          
          {/* Input */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              color: '#94a3b8', 
              fontSize: '14px', 
              fontWeight: '500',
              marginBottom: '8px'
            }}>Node Value</label>
            <input
              type="number"
              placeholder="Enter value"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '12px',
                border: '2px solid rgba(16, 185, 129, 0.2)',
                background: 'rgba(30, 41, 59, 0.8)',
                color: 'white',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>
          
          {/* Basic Operations */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            {[
              { onClick: insertNode, bg: 'linear-gradient(135deg, #10b981, #059669)', icon: '➕', text: 'Insert' },
              { onClick: deleteNode, bg: 'linear-gradient(135deg, #ef4444, #dc2626)', icon: '❌', text: 'Delete' },
            ].map((btn, i) => (
              <motion.button
                key={i}
                onClick={btn.onClick}
                disabled={isAnimating}
                whileHover={{ scale: isAnimating ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: btn.bg,
                  color: 'white',
                  fontWeight: '600',
                  cursor: isAnimating ? 'not-allowed' : 'pointer',
                  opacity: isAnimating ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '14px'
                }}
              >
                <span>{btn.icon}</span>
                {btn.text}
              </motion.button>
            ))}
          </div>
          
          {/* Traversal Operations */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#f59e0b', marginBottom: '12px', fontSize: '16px' }}>🔄 Traversals</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { type: 'Inorder', desc: 'L-R-Rt' },
                { type: 'Preorder', desc: 'Rt-L-R' },
                { type: 'Postorder', desc: 'L-R-Rt' },
                { type: 'Level Order', desc: 'BFS' }
              ].map((traversal, i) => (
                <motion.button
                  key={i}
                  onClick={() => performTraversal(traversal.type)}
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
                    fontSize: '11px',
                    textAlign: 'center'
                  }}
                >
                  {traversal.type}
                  <div style={{ fontSize: '9px', opacity: 0.8 }}>{traversal.desc}</div>
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Clear Button */}
          <motion.button
            onClick={clearTree}
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
            🧹 Clear Tree
          </motion.button>
          
          {/* Performance Table */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '20px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <h4 style={{ color: '#10b981', marginBottom: '12px', fontSize: '16px' }}>⚡ Performance</h4>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span>Insert:</span><span style={{ color: '#10b981' }}>O(log n)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span>Delete:</span><span style={{ color: '#ef4444' }}>O(log n)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span>Search:</span><span style={{ color: '#3b82f6' }}>O(log n)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Traversal:</span><span style={{ color: '#f59e0b' }}>O(n)</span>
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
                  No operations yet. Try inserting nodes!
                </div>
              ) : (
                operationLog.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    style={{
                      padding: '6px 8px',
                      fontSize: '11px',
                      color: log.type === 'error' ? '#ef4444' : 
                             log.type === 'success' ? '#10b981' :
                             log.type === 'warning' ? '#f59e0b' : '#e2e8f0',
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                      marginBottom: '4px',
                      borderRadius: '4px',
                      background: 'rgba(255, 255, 255, 0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{log.message}</span>
                      <span style={{ color: '#64748b', fontSize: '9px' }}>{log.timestamp}</span>
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

export default TreeVisualize;
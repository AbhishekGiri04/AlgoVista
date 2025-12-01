import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Box, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

const LinkedListNode = ({ position, value, index, isHead, isNew, isDeleting, isTraversing, hasNext }) => {
  const meshRef = useRef();
  const arrowRef = useRef();
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
        meshRef.current.scale.setScalar(hovered ? 1.1 : 1);
        meshRef.current.position.y = position[1];
        meshRef.current.rotation.y = 0;
      }
    }
    
    if (arrowRef.current && hasNext) {
      arrowRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.1;
    }
  });
  
  const getColor = () => {
    if (isNew) return '#10b981'; // Green for new
    if (isDeleting) return '#ef4444'; // Red for deleting
    if (isTraversing) return '#f59e0b'; // Yellow for traversing
    if (isHead) return '#8b5cf6'; // Purple for head
    return '#3b82f6'; // Blue default
  };
  
  return (
    <group position={position}>
      {/* Node Box */}
      <Box
        ref={meshRef}
        args={[1.5, 1, 1]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={getColor()} 
          transparent 
          opacity={isDeleting ? 0.5 : 1}
        />
      </Box>
      
      {/* Data Value */}
      <Text
        position={[0, 0, 0.6]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>
      
      {/* Head Label */}
      {isHead && (
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.3}
          color="#8b5cf6"
          anchorX="center"
          anchorY="middle"
        >
          HEAD
        </Text>
      )}
      
      {/* Next Pointer Arrow */}
      {hasNext && (
        <group>
          <mesh ref={arrowRef} position={[1.2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.15, 0.6, 8]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
          <mesh position={[0.9, 0, 0]}>
            <boxGeometry args={[0.6, 0.05, 0.05]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
        </group>
      )}
      
      {/* NULL indicator for last node */}
      {!hasNext && (
        <Text
          position={[1.2, 0, 0]}
          fontSize={0.25}
          color="#ef4444"
          anchorX="center"
          anchorY="middle"
        >
          NULL
        </Text>
      )}
    </group>
  );
};

const LinkedListVisualize = () => {
  const [linkedList, setLinkedList] = useState([10, 20, 30]);
  const [inputValue, setInputValue] = useState('');
  const [inputPosition, setInputPosition] = useState('');
  const [currentOperation, setCurrentOperation] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [operationLog, setOperationLog] = useState([]);
  const [newNodeIndex, setNewNodeIndex] = useState(-1);
  const [deletingIndex, setDeletingIndex] = useState(-1);
  const [traversingIndex, setTraversingIndex] = useState(-1);
  
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setOperationLog(prev => [...prev.slice(-4), { message, type, timestamp }]);
  };
  
  const insertAtFirst = async () => {
    if (!inputValue || isAnimating) return;
    
    setIsAnimating(true);
    setCurrentOperation('Inserting at first...');
    
    const value = parseInt(inputValue);
    const newList = [value, ...linkedList];
    
    setNewNodeIndex(0);
    setLinkedList(newList);
    
    addLog(`✅ Inserted ${value} at first (O(1))`, 'success');
    
    setTimeout(() => {
      setNewNodeIndex(-1);
      setCurrentOperation('');
      setIsAnimating(false);
    }, 1500);
    
    setInputValue('');
  };
  
  const insertAtLast = async () => {
    if (!inputValue || isAnimating) return;
    
    setIsAnimating(true);
    setCurrentOperation('Inserting at last...');
    
    const value = parseInt(inputValue);
    const newList = [...linkedList, value];
    
    setNewNodeIndex(linkedList.length);
    setLinkedList(newList);
    
    addLog(`✅ Inserted ${value} at last (O(n))`, 'success');
    
    setTimeout(() => {
      setNewNodeIndex(-1);
      setCurrentOperation('');
      setIsAnimating(false);
    }, 1500);
    
    setInputValue('');
  };
  
  const insertAtPosition = async () => {
    if (!inputValue || !inputPosition || isAnimating) return;
    
    const value = parseInt(inputValue);
    const position = parseInt(inputPosition);
    
    if (position < 0 || position > linkedList.length) {
      addLog(`❌ Invalid position ${position}`, 'error');
      return;
    }
    
    setIsAnimating(true);
    setCurrentOperation(`Inserting at position ${position}...`);
    
    const newList = [...linkedList];
    newList.splice(position, 0, value);
    
    setNewNodeIndex(position);
    setLinkedList(newList);
    
    addLog(`✅ Inserted ${value} at position ${position} (O(n))`, 'success');
    
    setTimeout(() => {
      setNewNodeIndex(-1);
      setCurrentOperation('');
      setIsAnimating(false);
    }, 1500);
    
    setInputValue('');
    setInputPosition('');
  };
  
  const removeFirst = async () => {
    if (isAnimating || linkedList.length === 0) return;
    
    setIsAnimating(true);
    setCurrentOperation('Removing first node...');
    
    const removedValue = linkedList[0];
    setDeletingIndex(0);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newList = linkedList.slice(1);
    setLinkedList(newList);
    setDeletingIndex(-1);
    
    addLog(`❌ Removed ${removedValue} from first (O(1))`, 'warning');
    
    setTimeout(() => {
      setCurrentOperation('');
      setIsAnimating(false);
    }, 500);
  };
  
  const removeLast = async () => {
    if (isAnimating || linkedList.length === 0) return;
    
    setIsAnimating(true);
    setCurrentOperation('Removing last node...');
    
    const removedValue = linkedList[linkedList.length - 1];
    setDeletingIndex(linkedList.length - 1);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newList = linkedList.slice(0, -1);
    setLinkedList(newList);
    setDeletingIndex(-1);
    
    addLog(`❌ Removed ${removedValue} from last (O(n))`, 'warning');
    
    setTimeout(() => {
      setCurrentOperation('');
      setIsAnimating(false);
    }, 500);
  };
  
  const removeAtPosition = async () => {
    if (!inputPosition || isAnimating) return;
    
    const position = parseInt(inputPosition);
    
    if (position < 0 || position >= linkedList.length) {
      addLog(`❌ Invalid position ${position}`, 'error');
      return;
    }
    
    setIsAnimating(true);
    setCurrentOperation(`Removing at position ${position}...`);
    
    const removedValue = linkedList[position];
    setDeletingIndex(position);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newList = linkedList.filter((_, i) => i !== position);
    setLinkedList(newList);
    setDeletingIndex(-1);
    
    addLog(`❌ Removed ${removedValue} from position ${position} (O(n))`, 'warning');
    
    setTimeout(() => {
      setCurrentOperation('');
      setIsAnimating(false);
    }, 500);
    
    setInputPosition('');
  };
  
  const traverseList = async () => {
    if (isAnimating || linkedList.length === 0) return;
    
    setIsAnimating(true);
    setCurrentOperation('Traversing linked list...');
    
    for (let i = 0; i < linkedList.length; i++) {
      setTraversingIndex(i);
      addLog(`🔄 Visiting node ${i}: ${linkedList[i]}`, 'info');
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    setTraversingIndex(-1);
    addLog(`✅ Traversal complete (O(n))`, 'success');
    setCurrentOperation('');
    setIsAnimating(false);
  };
  
  const clearList = () => {
    if (isAnimating) return;
    setLinkedList([]);
    addLog('🧹 Linked list cleared', 'info');
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
        background: 'linear-gradient(135deg, #f59e0b, #8b5cf6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        🔗 3D Linked List Visualizer
      </h1>
      
      <div style={{ display: 'flex', gap: '20px', height: '80vh' }}>
        {/* 3D Visualization */}
        <div style={{ 
          flex: 2, 
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))', 
          borderRadius: '16px', 
          overflow: 'hidden',
          border: '1px solid rgba(245, 158, 11, 0.2)',
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
            🔗 Dynamic Linked List Structure
          </div>
          
          <Canvas camera={{ position: [0, 3, 10], fov: 60 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.3} />
            
            {/* Linked List Nodes */}
            {linkedList.map((value, index) => {
              const xPos = (index - (linkedList.length - 1) / 2) * 2.5;
              return (
                <LinkedListNode
                  key={`${index}-${value}`}
                  position={[xPos, 0, 0]}
                  value={value}
                  index={index}
                  isHead={index === 0}
                  isNew={newNodeIndex === index}
                  isDeleting={deletingIndex === index}
                  isTraversing={traversingIndex === index}
                  hasNext={index < linkedList.length - 1}
                />
              );
            })}
            
            {/* Empty List Message */}
            {linkedList.length === 0 && (
              <Text
                position={[0, 0, 0]}
                fontSize={0.5}
                color="#64748b"
                anchorX="center"
                anchorY="middle"
              >
                Empty Linked List
              </Text>
            )}
            
            <Text
              position={[0, -2.5, 0]}
              fontSize={0.3}
              color="#f59e0b"
              anchorX="center"
              anchorY="middle"
            >
              Dynamic Memory Allocation
            </Text>
            
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          </Canvas>
          
          {/* List Status */}
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
              <span style={{ color: 'white', fontWeight: '600', fontSize: '16px' }}>{linkedList.length}</span>
            </div>
            <div>
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>Head: </span>
              <span style={{ color: '#8b5cf6', fontWeight: '600', fontSize: '16px' }}>
                {linkedList.length > 0 ? linkedList[0] : 'NULL'}
              </span>
            </div>
            <div>
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>Tail: </span>
              <span style={{ color: '#f59e0b', fontWeight: '600', fontSize: '16px' }}>
                {linkedList.length > 0 ? linkedList[linkedList.length - 1] : 'NULL'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Control Panel */}
        <div style={{ 
          flex: 1, 
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))', 
          borderRadius: '24px', 
          padding: '24px',
          border: '1px solid rgba(245, 158, 11, 0.2)',
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
              background: 'linear-gradient(135deg, #f59e0b, #8b5cf6)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>🔗</div>
            <h3 style={{ 
              color: 'white', 
              fontSize: '1.4rem',
              fontWeight: '700',
              margin: 0
            }}>Linked List Operations</h3>
          </div>
          
          {/* Current Operation */}
          {currentOperation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #8b5cf6)',
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
          <div style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                color: '#94a3b8', 
                fontSize: '14px', 
                fontWeight: '500',
                marginBottom: '8px'
              }}>Value</label>
              <input
                type="number"
                placeholder="Enter value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '2px solid rgba(245, 158, 11, 0.2)',
                  background: 'rgba(30, 41, 59, 0.8)',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{ 
                display: 'block', 
                color: '#94a3b8', 
                fontSize: '14px', 
                fontWeight: '500',
                marginBottom: '8px'
              }}>Position (optional)</label>
              <input
                type="number"
                placeholder="Enter position"
                value={inputPosition}
                onChange={(e) => setInputPosition(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '2px solid rgba(245, 158, 11, 0.2)',
                  background: 'rgba(30, 41, 59, 0.8)',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
          
          {/* Insert Operations */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#10b981', marginBottom: '12px', fontSize: '16px' }}>➕ Insert Operations</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              {[
                { onClick: insertAtFirst, text: 'First', complexity: 'O(1)' },
                { onClick: insertAtLast, text: 'Last', complexity: 'O(n)' }
              ].map((btn, i) => (
                <motion.button
                  key={i}
                  onClick={btn.onClick}
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
                  {btn.text} {btn.complexity}
                </motion.button>
              ))}
            </div>
            <motion.button
              onClick={insertAtPosition}
              disabled={isAnimating}
              whileHover={{ scale: isAnimating ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: '100%',
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
              Insert at Position O(n)
            </motion.button>
          </div>
          
          {/* Remove Operations */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#ef4444', marginBottom: '12px', fontSize: '16px' }}>❌ Remove Operations</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              {[
                { onClick: removeFirst, text: 'First', complexity: 'O(1)' },
                { onClick: removeLast, text: 'Last', complexity: 'O(n)' }
              ].map((btn, i) => (
                <motion.button
                  key={i}
                  onClick={btn.onClick}
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
                  {btn.text} {btn.complexity}
                </motion.button>
              ))}
            </div>
            <motion.button
              onClick={removeAtPosition}
              disabled={isAnimating}
              whileHover={{ scale: isAnimating ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: '100%',
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
              Remove at Position O(n)
            </motion.button>
          </div>
          
          {/* Other Operations */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <motion.button
              onClick={traverseList}
              disabled={isAnimating}
              whileHover={{ scale: isAnimating ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                fontWeight: '600',
                cursor: isAnimating ? 'not-allowed' : 'pointer',
                opacity: isAnimating ? 0.6 : 1,
                fontSize: '12px'
              }}
            >
              🔄 Traverse O(n)
            </motion.button>
            
            <motion.button
              onClick={clearList}
              disabled={isAnimating}
              whileHover={{ scale: isAnimating ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                color: 'white',
                fontWeight: '600',
                cursor: isAnimating ? 'not-allowed' : 'pointer',
                opacity: isAnimating ? 0.6 : 1,
                fontSize: '12px'
              }}
            >
              🧹 Clear
            </motion.button>
          </div>
          
          {/* Performance Table */}
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '20px',
            border: '1px solid rgba(245, 158, 11, 0.2)'
          }}>
            <h4 style={{ color: '#f59e0b', marginBottom: '12px', fontSize: '16px' }}>⚡ Performance</h4>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span>Insert First:</span><span style={{ color: '#10b981' }}>O(1)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span>Insert Last:</span><span style={{ color: '#f59e0b' }}>O(n)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span>Remove First:</span><span style={{ color: '#10b981' }}>O(1)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span>Remove Last:</span><span style={{ color: '#f59e0b' }}>O(n)</span>
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

export default LinkedListVisualize;
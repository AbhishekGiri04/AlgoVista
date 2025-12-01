import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Box, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

const QueueBox = ({ position, value, index, isFront, isRear, isEnqueuing, isDequeuing, isPeeking }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      if (isEnqueuing) {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 8) * 0.1);
        meshRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 6) * 0.1;
      } else if (isDequeuing) {
        meshRef.current.scale.setScalar(Math.max(0.1, 1 - (state.clock.elapsedTime % 2)));
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 8) * 0.2;
      } else if (isPeeking) {
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 5) * 0.15;
      } else {
        meshRef.current.scale.setScalar(hovered ? 1.1 : 1);
        meshRef.current.position.x = position[0];
        meshRef.current.position.y = position[1];
      }
    }
  });
  
  const getColor = () => {
    if (isEnqueuing) return '#10b981'; // Green for enqueue
    if (isDequeuing) return '#ef4444'; // Red for dequeue
    if (isPeeking) return '#f59e0b'; // Yellow for peek
    if (isFront) return '#8b5cf6'; // Purple for front
    if (isRear) return '#06b6d4'; // Cyan for rear
    return '#3b82f6'; // Blue default
  };
  
  return (
    <group position={position}>
      <Box
        ref={meshRef}
        args={[1.5, 1, 1]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={getColor()} 
          transparent 
          opacity={isDequeuing ? 0.5 : 1}
        />
      </Box>
      <Text
        position={[0, 0, 0.6]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>
      {isFront && (
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.25}
          color="#8b5cf6"
          anchorX="center"
          anchorY="middle"
        >
          FRONT
        </Text>
      )}
      {isRear && (
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.25}
          color="#06b6d4"
          anchorX="center"
          anchorY="middle"
        >
          REAR
        </Text>
      )}
    </group>
  );
};

const QueuePointer = ({ position, label, color = '#f59e0b' }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    }
  });
  
  return (
    <group>
      <mesh ref={meshRef} position={[position[0], position[1] + 1.5, position[2]]}>
        <coneGeometry args={[0.15, 0.5, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text
        position={[position[0], position[1] + 2.2, position[2]]}
        fontSize={0.25}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
};

const QueueVisualize = () => {
  const [queue, setQueue] = useState([10, 20, 30]);
  const [maxSize] = useState(8);
  const [inputValue, setInputValue] = useState('');
  const [currentOperation, setCurrentOperation] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [operationLog, setOperationLog] = useState([]);
  const [enqueuingIndex, setEnqueuingIndex] = useState(-1);
  const [dequeuingIndex, setDequeuingIndex] = useState(-1);
  const [peekingIndex, setPeekingIndex] = useState(-1);
  const [errorMessage, setErrorMessage] = useState('');
  
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setOperationLog(prev => [...prev.slice(-4), { message, type, timestamp }]);
  };
  
  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };
  
  const enqueueElement = async () => {
    if (!inputValue || isAnimating) return;
    
    if (queue.length >= maxSize) {
      showError('Queue Overflow! Maximum size reached.');
      addLog('❌ Queue Overflow - Cannot enqueue more elements', 'error');
      return;
    }
    
    setIsAnimating(true);
    setCurrentOperation('Enqueuing element...');
    
    const value = parseInt(inputValue);
    const newQueue = [...queue, value];
    
    // Animation
    setEnqueuingIndex(queue.length);
    setQueue(newQueue);
    
    addLog(`✅ Enqueued ${value} to rear (Size: ${newQueue.length})`, 'success');
    
    setTimeout(() => {
      setEnqueuingIndex(-1);
      setCurrentOperation('');
      setIsAnimating(false);
    }, 1500);
    
    setInputValue('');
  };
  
  const dequeueElement = async () => {
    if (isAnimating) return;
    
    if (queue.length === 0) {
      showError('Queue Underflow! Queue is empty.');
      addLog('❌ Queue Underflow - Cannot dequeue from empty queue', 'error');
      return;
    }
    
    setIsAnimating(true);
    setCurrentOperation('Dequeuing element...');
    
    const dequeuedValue = queue[0];
    setDequeuingIndex(0);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newQueue = queue.slice(1);
    setQueue(newQueue);
    setDequeuingIndex(-1);
    
    addLog(`❌ Dequeued ${dequeuedValue} from front (Size: ${newQueue.length})`, 'warning');
    
    setTimeout(() => {
      setCurrentOperation('');
      setIsAnimating(false);
    }, 500);
  };
  
  const peekFront = async () => {
    if (isAnimating) return;
    
    if (queue.length === 0) {
      showError('Queue is empty! Nothing to peek.');
      addLog('❌ Cannot peek - Queue is empty', 'error');
      return;
    }
    
    setIsAnimating(true);
    setCurrentOperation('Peeking front element...');
    
    const frontValue = queue[0];
    setPeekingIndex(0);
    
    addLog(`👁️ Peeked front element: ${frontValue}`, 'info');
    
    setTimeout(() => {
      setPeekingIndex(-1);
      setCurrentOperation('');
      setIsAnimating(false);
    }, 2000);
  };
  
  const checkEmpty = () => {
    const isEmpty = queue.length === 0;
    if (isEmpty) {
      showError('Queue is Empty!');
      addLog('💭 Queue is empty (isEmpty: true)', 'info');
    } else {
      addLog(`💭 Queue is not empty (Size: ${queue.length})`, 'info');
    }
  };
  
  const checkFull = () => {
    const isFull = queue.length >= maxSize;
    if (isFull) {
      showError('Queue is Full!');
      addLog('💭 Queue is full (isFull: true)', 'warning');
    } else {
      addLog(`💭 Queue is not full (${queue.length}/${maxSize})`, 'info');
    }
  };
  
  const clearQueue = () => {
    if (isAnimating) return;
    setQueue([]);
    addLog('🧹 Queue cleared', 'info');
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
        background: 'linear-gradient(135deg, #06b6d4, #10b981)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        🌍 3D Queue Operations Visualizer
      </h1>
      
      {/* Error Message */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            style={{
              position: 'fixed',
              top: '100px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '12px',
              fontWeight: '600',
              zIndex: 1000,
              boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4)'
            }}
          >
            ⚠️ {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>
      
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
            🌍 FIFO Queue Structure
          </div>
          
          <Canvas camera={{ position: [0, 3, 8], fov: 60 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.3} />
            
            {/* Queue Base */}
            <mesh position={[0, -1.5, 0]}>
              <boxGeometry args={[queue.length * 1.8 + 1, 0.2, 1.5]} />
              <meshStandardMaterial color="#1e293b" transparent opacity={0.4} />
            </mesh>
            
            {/* Queue Elements */}
            {queue.map((value, index) => {
              const xPos = (index - (queue.length - 1) / 2) * 1.8;
              return (
                <QueueBox
                  key={`${index}-${value}`}
                  position={[xPos, 0, 0]}
                  value={value}
                  index={index}
                  isFront={index === 0}
                  isRear={index === queue.length - 1}
                  isEnqueuing={enqueuingIndex === index}
                  isDequeuing={dequeuingIndex === index}
                  isPeeking={peekingIndex === index}
                />
              );
            })}
            
            {/* Front Pointer */}
            {queue.length > 0 && (
              <QueuePointer 
                position={[(0 - (queue.length - 1) / 2) * 1.8, 0, 0]} 
                label="FRONT" 
                color="#8b5cf6"
              />
            )}
            
            {/* Rear Pointer */}
            {queue.length > 0 && (
              <QueuePointer 
                position={[((queue.length - 1) - (queue.length - 1) / 2) * 1.8, 0, 0]} 
                label="REAR" 
                color="#06b6d4"
              />
            )}
            
            {/* Direction Arrow */}
            <mesh position={[0, -2.5, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.2, 1, 8]} />
              <meshStandardMaterial color="#10b981" />
            </mesh>
            
            <Text
              position={[0, -3.2, 0]}
              fontSize={0.3}
              color="#06b6d4"
              anchorX="center"
              anchorY="middle"
            >
              FIFO (First In, First Out)
            </Text>
            
            <Text
              position={[-2, -2.5, 0]}
              fontSize={0.25}
              color="#8b5cf6"
              anchorX="center"
              anchorY="middle"
            >
              Dequeue
            </Text>
            
            <Text
              position={[2, -2.5, 0]}
              fontSize={0.25}
              color="#06b6d4"
              anchorX="center"
              anchorY="middle"
            >
              Enqueue
            </Text>
            
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          </Canvas>
          
          {/* Queue Status */}
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
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>Queue Size: </span>
              <span style={{ color: 'white', fontWeight: '600', fontSize: '16px' }}>{queue.length}/{maxSize}</span>
            </div>
            <div>
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>Front: </span>
              <span style={{ color: '#8b5cf6', fontWeight: '600', fontSize: '16px' }}>
                {queue.length > 0 ? queue[0] : 'Empty'}
              </span>
            </div>
            <div>
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>Rear: </span>
              <span style={{ color: '#06b6d4', fontWeight: '600', fontSize: '16px' }}>
                {queue.length > 0 ? queue[queue.length - 1] : 'Empty'}
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
              background: 'linear-gradient(135deg, #06b6d4, #10b981)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>🌍</div>
            <h3 style={{ 
              color: 'white', 
              fontSize: '1.4rem',
              fontWeight: '700',
              margin: 0
            }}>Queue Operations</h3>
          </div>
          
          {/* Current Operation */}
          {currentOperation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #10b981)',
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
            }}>Enqueue Value</label>
            <input
              type="number"
              placeholder="Enter value to enqueue"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '12px',
                border: '2px solid rgba(6, 182, 212, 0.2)',
                background: 'rgba(30, 41, 59, 0.8)',
                color: 'white',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>
          
          {/* Operation Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            {[
              { onClick: enqueueElement, bg: 'linear-gradient(135deg, #10b981, #059669)', icon: '➡️', text: 'Enqueue' },
              { onClick: dequeueElement, bg: 'linear-gradient(135deg, #ef4444, #dc2626)', icon: '⬅️', text: 'Dequeue' },
              { onClick: peekFront, bg: 'linear-gradient(135deg, #f59e0b, #d97706)', icon: '👁️', text: 'Peek' },
              { onClick: clearQueue, bg: 'linear-gradient(135deg, #6b7280, #4b5563)', icon: '🧹', text: 'Clear' }
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
          
          {/* Check Operations */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <motion.button
              onClick={checkEmpty}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '12px',
                borderRadius: '12px',
                border: '2px solid #3b82f6',
                background: 'rgba(59, 130, 246, 0.1)',
                color: '#3b82f6',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              isEmpty?
            </motion.button>
            
            <motion.button
              onClick={checkFull}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '12px',
                borderRadius: '12px',
                border: '2px solid #f59e0b',
                background: 'rgba(245, 158, 11, 0.1)',
                color: '#f59e0b',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              isFull?
            </motion.button>
          </div>
          
          {/* Performance Table */}
          <div style={{
            background: 'rgba(6, 182, 212, 0.1)',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '20px',
            border: '1px solid rgba(6, 182, 212, 0.2)'
          }}>
            <h4 style={{ color: '#06b6d4', marginBottom: '12px', fontSize: '16px' }}>⚡ Performance</h4>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Enqueue:</span><span style={{ color: '#10b981' }}>O(1)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Dequeue:</span><span style={{ color: '#ef4444' }}>O(1)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Peek:</span><span style={{ color: '#f59e0b' }}>O(1)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Space:</span><span style={{ color: '#3b82f6' }}>O(n)</span>
              </div>
            </div>
          </div>
          
          {/* Operation Log */}
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
                  No operations yet. Try enqueuing elements!
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
                      fontSize: '12px',
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
                      <span style={{ color: '#64748b', fontSize: '10px' }}>{log.timestamp}</span>
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

export default QueueVisualize;
import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Box, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

const ArrayBox = ({ position, value, index, isHighlighted, isNew, isDeleting, color = '#3b82f6' }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      if (isHighlighted) {
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.2;
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 4) * 0.1;
      } else {
        meshRef.current.rotation.y = 0;
        meshRef.current.position.y = position[1];
      }
      
      if (isNew) {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 6) * 0.1);
      } else {
        meshRef.current.scale.setScalar(hovered ? 1.1 : 1);
      }
    }
  });
  
  const boxColor = isHighlighted ? '#10b981' : isNew ? '#f59e0b' : isDeleting ? '#ef4444' : color;
  
  return (
    <group position={position}>
      <Box
        ref={meshRef}
        args={[1.5, 1, 1]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial color={boxColor} transparent opacity={isDeleting ? 0.3 : 1} />
      </Box>
      <Text
        position={[0, 0, 0.6]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {value}
      </Text>
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.25}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        [{index}]
      </Text>
    </group>
  );
};

const ArrayPointer = ({ position, label, color = '#f59e0b' }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + 2 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }
  });
  
  return (
    <group>
      <mesh ref={meshRef} position={[position[0], position[1] + 2, position[2]]}>
        <coneGeometry args={[0.2, 0.8, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text
        position={[position[0], position[1] + 3, position[2]]}
        fontSize={0.3}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
};

const ArrayVisualize = () => {
  const [array, setArray] = useState([10, 20, 30, 40, 50]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [newIndex, setNewIndex] = useState(-1);
  const [deletingIndex, setDeletingIndex] = useState(-1);
  const [currentOperation, setCurrentOperation] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [inputIndex, setInputIndex] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [operationLog, setOperationLog] = useState([]);
  const [pointerPosition, setPointerPosition] = useState(-1);
  const [arraySize, setArraySize] = useState(10);
  
  const addLog = (message) => {
    setOperationLog(prev => [...prev.slice(-4), message]);
  };
  
  const insertElement = async () => {
    if (!inputValue || isAnimating) return;
    setIsAnimating(true);
    setCurrentOperation('Inserting element...');
    
    const value = parseInt(inputValue);
    const index = inputIndex ? parseInt(inputIndex) : array.length;
    
    if (index < 0 || index > array.length) {
      addLog(`❌ Invalid index ${index}`);
      setIsAnimating(false);
      return;
    }
    
    // Highlight insertion point
    setHighlightedIndex(index);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Insert element
    const newArray = [...array];
    newArray.splice(index, 0, value);
    setArray(newArray);
    setNewIndex(index);
    setHighlightedIndex(-1);
    
    addLog(`✅ Inserted ${value} at index ${index}`);
    
    // Reset animations
    setTimeout(() => {
      setNewIndex(-1);
      setCurrentOperation('');
      setIsAnimating(false);
    }, 1500);
    
    setInputValue('');
    setInputIndex('');
  };
  
  const deleteElement = async () => {
    if (!inputIndex || isAnimating || array.length === 0) return;
    setIsAnimating(true);
    setCurrentOperation('Deleting element...');
    
    const index = parseInt(inputIndex);
    
    if (index < 0 || index >= array.length) {
      addLog(`❌ Invalid index ${index}`);
      setIsAnimating(false);
      return;
    }
    
    // Highlight element to delete
    setHighlightedIndex(index);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mark for deletion
    setDeletingIndex(index);
    setHighlightedIndex(-1);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Remove element
    const deletedValue = array[index];
    const newArray = array.filter((_, i) => i !== index);
    setArray(newArray);
    setDeletingIndex(-1);
    
    addLog(`❌ Deleted ${deletedValue} from index ${index}`);
    
    setTimeout(() => {
      setCurrentOperation('');
      setIsAnimating(false);
    }, 500);
    
    setInputIndex('');
  };
  
  const searchElement = async () => {
    if (!searchValue || isAnimating) return;
    setIsAnimating(true);
    setCurrentOperation('Searching element...');
    
    const target = parseInt(searchValue);
    let found = false;
    
    // Linear search animation
    for (let i = 0; i < array.length; i++) {
      setHighlightedIndex(i);
      setPointerPosition(i);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      if (array[i] === target) {
        found = true;
        addLog(`🔍 Found ${target} at index ${i}`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        break;
      }
    }
    
    if (!found) {
      addLog(`❌ ${target} not found in array`);
    }
    
    setHighlightedIndex(-1);
    setPointerPosition(-1);
    setCurrentOperation('');
    setIsAnimating(false);
    setSearchValue('');
  };
  
  const traverseArray = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentOperation('Traversing array...');
    
    for (let i = 0; i < array.length; i++) {
      setHighlightedIndex(i);
      setPointerPosition(i);
      addLog(`🔁 Visiting index ${i}: ${array[i]}`);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    setHighlightedIndex(-1);
    setPointerPosition(-1);
    addLog(`✅ Traversal complete`);
    setCurrentOperation('');
    setIsAnimating(false);
  };
  
  const resizeArray = () => {
    if (isAnimating) return;
    setCurrentOperation('Resizing array...');
    
    const newSize = Math.max(5, Math.min(15, arraySize));
    if (newSize > array.length) {
      // Expand array
      const newArray = [...array];
      while (newArray.length < newSize) {
        newArray.push(0);
      }
      setArray(newArray);
      addLog(`📈 Expanded array to size ${newSize}`);
    } else if (newSize < array.length) {
      // Shrink array
      const newArray = array.slice(0, newSize);
      setArray(newArray);
      addLog(`📉 Shrunk array to size ${newSize}`);
    }
    
    setTimeout(() => setCurrentOperation(''), 1000);
  };
  
  const updateElement = async () => {
    if (!inputValue || !inputIndex || isAnimating) return;
    setIsAnimating(true);
    setCurrentOperation('Updating element...');
    
    const index = parseInt(inputIndex);
    const newValue = parseInt(inputValue);
    
    if (index < 0 || index >= array.length) {
      addLog(`❌ Invalid index ${index}`);
      setIsAnimating(false);
      return;
    }
    
    // Highlight element to update
    setHighlightedIndex(index);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const oldValue = array[index];
    const newArray = [...array];
    newArray[index] = newValue;
    setArray(newArray);
    setNewIndex(index);
    
    addLog(`✏️ Updated index ${index}: ${oldValue} → ${newValue}`);
    
    setTimeout(() => {
      setHighlightedIndex(-1);
      setNewIndex(-1);
      setCurrentOperation('');
      setIsAnimating(false);
    }, 1500);
    
    setInputValue('');
    setInputIndex('');
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
        background: 'linear-gradient(135deg, #3b82f6, #10b981)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        🧩 3D Array Operations Visualizer
      </h1>
      
      <div style={{ display: 'flex', gap: '20px', height: '80vh' }}>
        {/* 3D Visualization */}
        <div style={{ 
          flex: 2, 
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))', 
          borderRadius: '16px', 
          overflow: 'hidden',
          border: '1px solid rgba(59, 130, 246, 0.2)',
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
            🧩 3D Array Visualization
          </div>
          
          <Canvas 
            camera={{ position: [0, 3, 8], fov: 75 }}
            style={{ width: '100%', height: '100%' }}
          >
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.3} />
            
            {/* Array Elements */}
            {array.map((value, index) => {
              const xPos = (index - (array.length - 1) / 2) * 1.8;
              return (
                <ArrayBox
                  key={`${index}-${value}-${array.length}`}
                  position={[xPos, 0, 0]}
                  value={value}
                  index={index}
                  isHighlighted={highlightedIndex === index}
                  isNew={newIndex === index}
                  isDeleting={deletingIndex === index}
                />
              );
            })}
            
            {/* Pointer */}
            {pointerPosition >= 0 && (
              <ArrayPointer
                position={[(pointerPosition - (array.length - 1) / 2) * 1.8, 0, 0]}
                label="PTR"
              />
            )}
            
            {/* Memory Layout Base */}
            <mesh position={[0, -1.5, 0]}>
              <boxGeometry args={[array.length * 1.8 + 0.5, 0.1, 1.5]} />
              <meshStandardMaterial color="#1e293b" transparent opacity={0.4} />
            </mesh>
            
            {/* Memory Address Labels */}
            {array.map((_, index) => {
              const xPos = (index - (array.length - 1) / 2) * 1.8;
              return (
                <Text
                  key={`addr-${index}`}
                  position={[xPos, -2.2, 0]}
                  fontSize={0.2}
                  color="#64748b"
                  anchorX="center"
                  anchorY="middle"
                >
                  0x{(1000 + index * 4).toString(16)}
                </Text>
              );
            })}
            
            <Text
              position={[0, -2.8, 0]}
              fontSize={0.3}
              color="#3b82f6"
              anchorX="center"
              anchorY="middle"
            >
              Contiguous Memory Layout
            </Text>
            
            <OrbitControls 
              enablePan={true} 
              enableZoom={true} 
              enableRotate={true}
              maxDistance={15}
              minDistance={3}
            />
          </Canvas>
          
          {/* Array Display */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            right: '20px',
            background: 'rgba(0, 0, 0, 0.8)',
            padding: '16px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto'
          }}>
            <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600', minWidth: 'fit-content' }}>Array:</span>
            {array.map((value, index) => (
              <div
                key={index}
                style={{
                  minWidth: '40px',
                  height: '40px',
                  background: highlightedIndex === index ? '#10b981' : 
                             newIndex === index ? '#f59e0b' :
                             deletingIndex === index ? '#ef4444' : '#3b82f6',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease'
                }}
              >
                {value}
              </div>
            ))}
          </div>
        </div>
        
        {/* Modern Control Panel */}
        <div style={{ 
          flex: 1, 
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))', 
          borderRadius: '24px', 
          padding: '24px',
          border: '1px solid rgba(59, 130, 246, 0.2)',
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
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>🎮</div>
            <h3 style={{ 
              color: 'white', 
              fontSize: '1.4rem',
              fontWeight: '700',
              margin: 0,
              background: 'linear-gradient(135deg, #3b82f6, #10b981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Array Operations</h3>
          </div>
          
          {/* Status Display */}
          {currentOperation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                padding: '16px',
                borderRadius: '16px',
                marginBottom: '24px',
                textAlign: 'center',
                fontWeight: '600',
                boxShadow: '0 8px 25px rgba(124, 58, 237, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '4px' }}>Current Operation</div>
              <div style={{ fontSize: '16px' }}>{currentOperation}</div>
            </motion.div>
          )}
          
          {/* Modern Input Section */}
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
                  border: '2px solid rgba(59, 130, 246, 0.2)',
                  background: 'rgba(30, 41, 59, 0.8)',
                  color: 'white',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)'}
              />
            </div>
            <div>
              <label style={{ 
                display: 'block', 
                color: '#94a3b8', 
                fontSize: '14px', 
                fontWeight: '500',
                marginBottom: '8px'
              }}>Index (optional)</label>
              <input
                type="number"
                placeholder="Enter index"
                value={inputIndex}
                onChange={(e) => setInputIndex(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '2px solid rgba(59, 130, 246, 0.2)',
                  background: 'rgba(30, 41, 59, 0.8)',
                  color: 'white',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)'}
              />
            </div>
          </div>
          
          {/* Modern Operation Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            {[
              { onClick: insertElement, bg: 'linear-gradient(135deg, #10b981, #059669)', icon: '➕', text: 'Insert' },
              { onClick: deleteElement, bg: 'linear-gradient(135deg, #ef4444, #dc2626)', icon: '🗑️', text: 'Delete' },
              { onClick: updateElement, bg: 'linear-gradient(135deg, #f59e0b, #d97706)', icon: '✏️', text: 'Update' },
              { onClick: traverseArray, bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', icon: '🔄', text: 'Traverse' }
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
                  fontSize: '14px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ fontSize: '16px' }}>{btn.icon}</span>
                {btn.text}
              </motion.button>
            ))}
          </div>
          
          {/* Search Section */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              color: '#94a3b8', 
              fontSize: '14px', 
              fontWeight: '500',
              marginBottom: '8px'
            }}>Search Element</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                placeholder="Search value"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                style={{
                  flex: 1,
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '2px solid rgba(59, 130, 246, 0.2)',
                  background: 'rgba(30, 41, 59, 0.8)',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
              <motion.button 
                onClick={searchElement} 
                disabled={isAnimating}
                whileHover={{ scale: isAnimating ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '14px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                  color: 'white',
                  fontWeight: '600',
                  cursor: isAnimating ? 'not-allowed' : 'pointer',
                  opacity: isAnimating ? 0.6 : 1,
                  fontSize: '16px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                }}
              >
                🔍
              </motion.button>
            </div>
          </div>
          
          {/* Resize Section */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              color: '#94a3b8', 
              fontSize: '14px', 
              fontWeight: '500',
              marginBottom: '8px'
            }}>Array Size: {arraySize}</label>
            <input
              type="range"
              min="5"
              max="15"
              value={arraySize}
              onChange={(e) => setArraySize(parseInt(e.target.value))}
              style={{ 
                width: '100%', 
                marginBottom: '12px',
                accentColor: '#3b82f6'
              }}
            />
            <motion.button 
              onClick={resizeArray} 
              disabled={isAnimating}
              whileHover={{ scale: isAnimating ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #ec4899, #db2777)',
                color: 'white',
                fontWeight: '600',
                cursor: isAnimating ? 'not-allowed' : 'pointer',
                opacity: isAnimating ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
              }}
            >
              <span>🧱</span> Resize to {arraySize}
            </motion.button>
          </div>
          
          {/* Array Info Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))',
            padding: '20px',
            borderRadius: '16px',
            marginBottom: '24px',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '20px' }}>📊</span>
              <h4 style={{ color: '#3b82f6', margin: 0, fontWeight: '600' }}>Array Statistics</h4>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
                <div style={{ color: '#94a3b8', fontSize: '12px' }}>Size</div>
                <div style={{ color: 'white', fontWeight: '600', fontSize: '18px' }}>{array.length}</div>
              </div>
              <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                <div style={{ color: '#94a3b8', fontSize: '12px' }}>Memory</div>
                <div style={{ color: 'white', fontWeight: '600', fontSize: '18px' }}>{array.length * 4}B</div>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '12px', padding: '8px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px' }}>
              <div style={{ color: '#94a3b8', fontSize: '12px' }}>Access Time</div>
              <div style={{ color: '#f59e0b', fontWeight: '600', fontSize: '16px' }}>O(1)</div>
            </div>
          </div>
          
          {/* Operation Log */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8))',
            padding: '20px',
            borderRadius: '16px',
            maxHeight: '200px',
            overflowY: 'auto',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '20px' }}>📝</span>
              <h4 style={{ color: '#10b981', margin: 0, fontWeight: '600' }}>Operation Log</h4>
            </div>
            <div style={{ minHeight: '60px' }}>
              <AnimatePresence>
                {operationLog.length === 0 ? (
                  <div style={{ 
                    color: '#64748b', 
                    fontStyle: 'italic', 
                    textAlign: 'center',
                    padding: '20px 0'
                  }}>
                    No operations yet. Start by inserting elements!
                  </div>
                ) : (
                  operationLog.map((log, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      style={{
                        padding: '8px 12px',
                        fontSize: '14px',
                        color: '#e2e8f0',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        marginBottom: '4px',
                        background: 'rgba(255, 255, 255, 0.02)'
                      }}
                    >
                      {log}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArrayVisualize;
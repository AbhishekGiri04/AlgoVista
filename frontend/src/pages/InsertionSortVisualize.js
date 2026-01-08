import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InsertionSortVisualize = () => {
  const [array, setArray] = useState([5, 3, 8, 4, 2]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const runInsertionSort = () => {
    setLoading(true);
    const arr = [...array];
    const steps = [];
    
    steps.push({ arr: [...arr], type: 'start', i: 0, j: -1, keyIdx: -1 });
    
    for (let i = 1; i < arr.length; i++) {
      const key = arr[i];
      steps.push({ arr: [...arr], type: 'key_selected', i, j: i, keyIdx: i });
      
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        steps.push({ arr: [...arr], type: 'compare', i, j, keyIdx: i });
        arr[j + 1] = arr[j];
        steps.push({ arr: [...arr], type: 'shift', i, j, keyIdx: i });
        j--;
      }
      
      arr[j + 1] = key;
      steps.push({ arr: [...arr], type: 'insert', i, j: j + 1, keyIdx: j + 1 });
    }
    
    steps.push({ arr: [...arr], type: 'done', i: arr.length, j: -1, keyIdx: -1 });
    
    setSteps(steps);
    setCurrentStep(0);
    setLoading(false);
  };

  const play = () => {
    if (steps.length === 0) return;
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          clearInterval(intervalRef.current);
          return prev;
        }
        return prev + 1;
      });
    }, speed);
  };

  const pause = () => {
    setIsPlaying(false);
    clearInterval(intervalRef.current);
  };

  const reset = () => {
    pause();
    setCurrentStep(0);
  };

  const addElement = () => {
    const newValue = Math.floor(Math.random() * 100) + 1;
    setArray([...array, newValue]);
  };

  const removeElement = (index) => {
    setArray(array.filter((_, i) => i !== index));
  };

  const updateElement = (index, value) => {
    const newArray = [...array];
    newArray[index] = parseInt(value) || 0;
    setArray(newArray);
  };

  const generateRandom = () => {
    const size = Math.floor(Math.random() * 6) + 5;
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const currentStepData = steps[currentStep] || { arr: array, type: 'start', i: -1, j: -1, keyIdx: -1 };
  const maxValue = Math.max(...(currentStepData.arr || array));

  const getBarColor = (index, value) => {
    const { i, j, keyIdx, type } = currentStepData;
    
    // Key element being inserted (blue) - highest priority
    if (index === keyIdx && keyIdx !== -1) {
      return 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
    }
    
    // Currently comparing (yellow)
    if (index === j && type === 'compare') {
      return 'linear-gradient(135deg, #f59e0b, #d97706)';
    }
    
    // Shifting elements (red)
    if (index === j && type === 'shift') {
      return 'linear-gradient(135deg, #ef4444, #dc2626)';
    }
    
    // Element being inserted into position (cyan)
    if (index === j && type === 'insert') {
      return 'linear-gradient(135deg, #06b6d4, #0891b2)';
    }
    
    // Sorted portion (green) - check last to avoid conflicts
    if (index <= i && type !== 'key_selected' && index !== keyIdx) {
      return 'linear-gradient(135deg, #10b981, #059669)';
    }
    
    // Default unsorted (purple/indigo gradient based on height)
    const intensity = value / maxValue;
    if (intensity > 0.7) return 'linear-gradient(135deg, #8b5cf6, #7c3aed)';
    if (intensity > 0.4) return 'linear-gradient(135deg, #6366f1, #4f46e5)';
    return 'linear-gradient(135deg, #6b7280, #4b5563)';
  };

  const getStepDescription = () => {
    const { type, i, j, keyIdx } = currentStepData;
    
    switch (type) {
      case 'start':
        return 'Starting Insertion Sort - Building sorted portion from left to right';
      case 'key_selected':
        return `Selected key element at position ${keyIdx} to insert into sorted portion`;
      case 'compare':
        return `Comparing key with element at position ${j}`;
      case 'shift':
        return `Shifting element at position ${j} to the right to make space`;
      case 'insert':
        return `Inserting key element at position ${j}`;
      case 'done':
        return 'Insertion Sort completed! Array is now sorted';
      default:
        return 'Insertion Sort in progress...';
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc, #f1f5f9, #e2e8f0)',
      color: '#1e293b',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <a href="/sortingalgorithms" style={{
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
        ← Back to Sorting Algorithms
      </a>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '24px',
        padding: '40px',
        marginBottom: '30px',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: '0 0 12px',
          textAlign: 'center'
        }}>
          Insertion Sort Visualization
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#1e293b',
          textAlign: 'center',
          margin: '0'
        }}>
          Interactive visualization of comparison-based sorting algorithm
        </p>
      </div>

      {/* Controls */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '24px',
        padding: '40px',
        marginBottom: '40px',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ 
            marginBottom: '20px', 
            fontSize: '1.5rem', 
            fontWeight: '700',
            color: '#1e293b'
          }}>Array Elements</h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', 
            gap: '15px', 
            marginBottom: '25px',
            maxWidth: '800px'
          }}>
            {array.map((value, index) => (
              <motion.div 
                key={index} 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                style={{ 
                  position: 'relative',
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '16px',
                  padding: '4px',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              >
                <input
                  type="number"
                  value={value}
                  onChange={(e) => updateElement(index, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'transparent',
                    color: '#1e293b',
                    textAlign: 'center',
                    fontSize: '16px',
                    fontWeight: '600',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={() => removeElement(index)}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    border: 'none',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
                  }}
                >
                  ×
                </button>
              </motion.div>
            ))}
          </div>
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addElement} 
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '15px',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>+</span> Add Element
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateRandom} 
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '15px',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Generate Random
            </motion.button>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          alignItems: 'center', 
          flexWrap: 'wrap',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.6)',
          borderRadius: '16px',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
        }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={runInsertionSort}
            disabled={loading}
            style={{
              background: loading 
                ? 'linear-gradient(135deg, #6b7280, #4b5563)'
                : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '16px',
              fontSize: '18px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading 
                ? 'none'
                : '0 10px 30px rgba(59, 130, 246, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              minWidth: '200px',
              justifyContent: 'center'
            }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%'
                  }}
                />
                Processing...
              </>
            ) : (
              <>
                Start Insertion Sort
              </>
            )}
          </motion.button>

          {steps.length > 0 && (
            <>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isPlaying ? pause : play} 
                style={{
                  background: isPlaying 
                    ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                    : 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '14px 24px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '15px',
                  boxShadow: isPlaying 
                    ? '0 8px 25px rgba(239, 68, 68, 0.3)'
                    : '0 8px 25px rgba(16, 185, 129, 0.3)'
                }}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={reset} 
                style={{
                  background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                  color: 'white',
                  border: 'none',
                  padding: '14px 24px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '15px',
                  boxShadow: '0 8px 25px rgba(107, 114, 128, 0.3)'
                }}
              >
                Reset
              </motion.button>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px',
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '12px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
              }}>
                <label style={{ fontWeight: '600', color: '#475569' }}>Speed:</label>
                <input
                  type="range"
                  min="300"
                  max="1500"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  style={{ 
                    width: '120px',
                    accentColor: '#3b82f6'
                  }}
                />
                <span style={{ 
                  color: '#64748b', 
                  fontSize: '14px',
                  minWidth: '60px'
                }}>{speed}ms</span>
              </div>

              <div style={{ 
                color: '#64748b',
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '12px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
              }}>
                Step {currentStep + 1} / {steps.length}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Visualization */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '24px',
        padding: '50px',
        minHeight: '500px',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          height: '350px',
          gap: '12px',
          padding: '30px',
          position: 'relative',
          zIndex: 1
        }}>
          <AnimatePresence>
            {(currentStepData.arr || array).map((value, index) => (
              <motion.div
                key={`${index}-${value}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  height: `${(value / maxValue) * 250}px`
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30,
                  layout: { duration: 0.5 }
                }}
                style={{
                  width: '60px',
                  background: getBarColor(index, value),
                  borderRadius: '12px 12px 6px 6px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  color: '#1e293b',
                  fontWeight: '700',
                  fontSize: '16px',
                  paddingTop: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <span style={{ 
                  textShadow: '0 0 8px rgba(0,0,0,0.8), 2px 2px 4px rgba(255,255,255,0.9)',
                  zIndex: 2,
                  position: 'relative',
                  color: 'white',
                  fontWeight: '800'
                }}>
                  {value}
                </span>
                
                {/* Special highlighting for active elements */}
                {(currentStepData.keyIdx === index || currentStepData.j === index) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      position: 'absolute',
                      inset: '-4px',
                      background: currentStepData.keyIdx === index 
                        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.5), rgba(29, 78, 216, 0.5))'
                        : currentStepData.type === 'shift'
                        ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.5), rgba(220, 38, 38, 0.5))'
                        : 'linear-gradient(135deg, rgba(245, 158, 11, 0.5), rgba(217, 119, 6, 0.5))',
                      borderRadius: '12px',
                      filter: 'blur(8px)',
                      zIndex: -1
                    }}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          marginTop: '30px',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 1
        }}>
          {[
            { color: 'linear-gradient(135deg, #10b981, #059669)', label: 'Sorted' },
            { color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', label: 'Key Element' },
            { color: 'linear-gradient(135deg, #f59e0b, #d97706)', label: 'Comparing' },
            { color: 'linear-gradient(135deg, #ef4444, #dc2626)', label: 'Shifting' },
            { color: 'linear-gradient(135deg, #06b6d4, #0891b2)', label: 'Inserting' },
            { color: 'linear-gradient(135deg, #6366f1, #4f46e5)', label: 'Unsorted' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '12px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                background: item.color,
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }} />
              <span style={{ 
                fontSize: '15px', 
                color: '#475569',
                fontWeight: '600'
              }}>{item.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Step Information */}
        {steps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: 'center',
              marginTop: '40px',
              padding: '30px',
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '20px',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              position: 'relative',
              zIndex: 1,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <h3 style={{ 
              marginBottom: '15px', 
              color: '#1e293b',
              fontSize: '1.5rem',
              fontWeight: '700'
            }}>
              Current Operation: <motion.span 
                animate={{ 
                  color: currentStepData.type === 'shift' ? '#ef4444' : 
                        currentStepData.type === 'key_selected' ? '#3b82f6' :
                        currentStepData.type === 'compare' ? '#f59e0b' : 
                        currentStepData.type === 'insert' ? '#06b6d4' : '#10b981'
                }}
                style={{ fontWeight: '800' }}
              >
                {currentStepData.type.toUpperCase().replace('_', ' ')}
              </motion.span>
            </h3>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ 
                color: '#64748b', 
                fontSize: '18px',
                fontWeight: '500',
                lineHeight: '1.6'
              }}
            >
              {getStepDescription()}
            </motion.p>
          </motion.div>
        )}
      </div>

      {/* Algorithm Analysis Section */}
      <div style={{
        maxWidth: '1400px',
        margin: '40px auto 0',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px'
      }}>
        {/* Time Complexity Chart */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '24px',
          padding: '40px',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            marginBottom: '25px', 
            color: '#1e293b',
            fontSize: '1.5rem',
            fontWeight: '700',
            textAlign: 'center'
          }}>Time Complexity Analysis</h3>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-around', 
            alignItems: 'end', 
            height: '200px', 
            marginBottom: '25px',
            padding: '20px 0'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '12px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '14px'
              }}>O(n)</div>
              <span style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', fontWeight: '600' }}>Best Case</span>
              <span style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>Already sorted</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '60px',
                height: '120px',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                borderRadius: '12px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '12px'
              }}>O(n²)</div>
              <span style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', fontWeight: '600' }}>Average Case</span>
              <span style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>Random order</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '60px',
                height: '160px',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                borderRadius: '12px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '12px'
              }}>O(n²)</div>
              <span style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', fontWeight: '600' }}>Worst Case</span>
              <span style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>Reverse sorted</span>
            </div>
          </div>
          
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <h4 style={{ color: '#1d4ed8', marginBottom: '10px', fontSize: '16px', fontWeight: '600' }}>Performance Insights</h4>
            <ul style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: 0, paddingLeft: '20px' }}>
              <li>Adaptive - efficient for nearly sorted data</li>
              <li>Online - can sort data as it's received</li>
              <li>Stable - maintains relative order of equal elements</li>
              <li>Best case: only n-1 comparisons needed</li>
            </ul>
          </div>
        </div>

        {/* Space Complexity Chart */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '24px',
          padding: '40px',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            marginBottom: '25px', 
            color: '#1e293b',
            fontSize: '1.5rem',
            fontWeight: '700',
            textAlign: 'center'
          }}>Space Complexity Analysis</h3>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'end', 
            height: '200px', 
            marginBottom: '25px',
            padding: '20px 0'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                borderRadius: '12px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '16px'
              }}>O(1)</div>
              <span style={{ fontSize: '14px', color: '#64748b', textAlign: 'center', fontWeight: '600' }}>Constant Space</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>In-place sorting</span>
            </div>
          </div>
          
          <div style={{
            background: 'rgba(6, 182, 212, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(6, 182, 212, 0.2)'
          }}>
            <h4 style={{ color: '#0891b2', marginBottom: '10px', fontSize: '16px', fontWeight: '600' }}>Memory Usage</h4>
            <ul style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: 0, paddingLeft: '20px' }}>
              <li>Only uses constant extra memory</li>
              <li>Shifts elements within the original array</li>
              <li>No additional data structures required</li>
              <li>Memory efficient for any dataset size</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Algorithm Explanation Section */}
      <div style={{
        maxWidth: '1400px',
        margin: '40px auto 0',
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '24px',
        padding: '50px',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ 
          textAlign: 'center',
          marginBottom: '40px', 
          color: '#1e293b',
          fontSize: '2rem',
          fontWeight: '800'
        }}>How Insertion Sort Works</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px', marginBottom: '40px' }}>
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '16px',
            padding: '25px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              borderRadius: '50%',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: '700'
            }}>1</div>
            <h4 style={{ color: '#1d4ed8', marginBottom: '15px', fontSize: '18px', fontWeight: '700' }}>Pick Key Element</h4>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>Select the next element from the unsorted portion as the key to insert</p>
          </div>
          
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            borderRadius: '16px',
            padding: '25px',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: '50%',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: '700'
            }}>2</div>
            <h4 style={{ color: '#d97706', marginBottom: '15px', fontSize: '18px', fontWeight: '700' }}>Shift Elements</h4>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>Move larger elements in the sorted portion to the right to make space</p>
          </div>
          
          <div style={{
            background: 'rgba(6, 182, 212, 0.1)',
            borderRadius: '16px',
            padding: '25px',
            border: '1px solid rgba(6, 182, 212, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              borderRadius: '50%',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: '700'
            }}>3</div>
            <h4 style={{ color: '#0891b2', marginBottom: '15px', fontSize: '18px', fontWeight: '700' }}>Insert Key</h4>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>Place the key element in its correct position within the sorted portion</p>
          </div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1))',
          borderRadius: '16px',
          padding: '30px',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <h4 style={{ color: '#1d4ed8', marginBottom: '20px', fontSize: '20px', fontWeight: '700', textAlign: 'center' }}>Like Sorting Playing Cards</h4>
          <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.8', textAlign: 'center', margin: 0 }}>
            Insertion Sort works exactly like how you would sort playing cards in your hand. You pick up cards one by one 
            and insert each card into its correct position among the cards you've already sorted. The left portion 
            (sorted cards) grows with each insertion, while the right portion (unsorted cards) shrinks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsertionSortVisualize;
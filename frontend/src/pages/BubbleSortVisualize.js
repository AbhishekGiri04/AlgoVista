import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BubbleSortVisualize = () => {
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const runBubbleSort = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://algovista-flux.onrender.com/api/bubblesort/visualize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ array })
      });
      const data = await response.json();
      if (data.steps) {
        setSteps(data.steps);
        setCurrentStep(0);
      }
    } catch (error) {
      console.error('Error:', error);
    }
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

  const currentStepData = steps[currentStep] || { arr: array, type: 'start', i: -1, j: -1 };
  const maxValue = Math.max(...(currentStepData.arr || array));

  const getBarColor = (index, value) => {
    const { i, j, type } = currentStepData;
    
    if (type === 'swap' && (index === i || index === j)) {
      return 'linear-gradient(135deg, #ef4444, #dc2626)'; // Red for swap
    }
    if (type === 'compare' && (index === i || index === j)) {
      return 'linear-gradient(135deg, #f59e0b, #d97706)'; // Orange for compare
    }
    if (type === 'done') {
      return 'linear-gradient(135deg, #10b981, #059669)'; // Green for sorted
    }
    
    // Default colors for non-active elements
    const intensity = value / maxValue;
    if (intensity > 0.7) return 'linear-gradient(135deg, #8b5cf6, #7c3aed)';
    if (intensity > 0.4) return 'linear-gradient(135deg, #64748b, #475569)';
    return 'linear-gradient(135deg, #94a3b8, #64748b)';
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc, #f1f5f9, #e2e8f0)',
      color: '#1e293b',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: '800', 
          color: '#1e293b',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          Bubble Sort Visualization
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#64748b', textAlign: 'center' }}>
          Experience Bubble Sort in stunning visualization
        </p>
      </motion.div>

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
        {/* Array Input */}
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
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                color: 'white',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '15px',
                boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Generate Random
            </motion.button>
          </div>
        </div>

        {/* Visualization Controls */}
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
            onClick={runBubbleSort}
            disabled={loading}
            style={{
              background: loading 
                ? 'linear-gradient(135deg, #6b7280, #4b5563)'
                : 'linear-gradient(135deg, #06b6d4, #0891b2)',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '16px',
              fontSize: '18px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading 
                ? 'none'
                : '0 10px 30px rgba(6, 182, 212, 0.4)',
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
                Start Bubble Sort
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
                  min="100"
                  max="1000"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  style={{ 
                    width: '120px',
                    accentColor: '#06b6d4'
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
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)',
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
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: 0,
                  height: `${(value / maxValue) * 280}px`
                }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 25,
                  layout: { duration: 0.4 }
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
                {/* Shimmer effect */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatDelay: 3,
                    ease: 'easeInOut'
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    pointerEvents: 'none'
                  }}
                />
                
                <span style={{ 
                  textShadow: '2px 2px 4px rgba(255,255,255,0.8)',
                  zIndex: 2,
                  position: 'relative'
                }}>
                  {value}
                </span>
                
                {/* Enhanced glow effect for active elements */}
                {(currentStepData.i === index || currentStepData.j === index) && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{
                        position: 'absolute',
                        inset: '-6px',
                        background: currentStepData.type === 'swap' 
                          ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.6), rgba(220, 38, 38, 0.6))'
                          : 'linear-gradient(135deg, rgba(245, 158, 11, 0.6), rgba(217, 119, 6, 0.6))',
                        borderRadius: '16px',
                        filter: 'blur(12px)',
                        zIndex: -1
                      }}
                    />
                    <motion.div
                      animate={{ 
                        boxShadow: [
                          '0 0 20px rgba(245, 158, 11, 0.5)',
                          '0 0 40px rgba(245, 158, 11, 0.8)',
                          '0 0 20px rgba(245, 158, 11, 0.5)'
                        ]
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                      style={{
                        position: 'absolute',
                        inset: '-2px',
                        borderRadius: '14px',
                        border: '2px solid rgba(245, 158, 11, 0.8)',
                        pointerEvents: 'none'
                      }}
                    />
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Color Legend */}
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
            { color: 'linear-gradient(135deg, #f59e0b, #d97706)', label: 'Comparing' },
            { color: 'linear-gradient(135deg, #ef4444, #dc2626)', label: 'Swapping' },
            { color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', label: 'High Values' }
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

        {/* Enhanced Step Information */}
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
                  color: currentStepData.type === 'swap' ? '#ef4444' : 
                        currentStepData.type === 'compare' ? '#f59e0b' : '#10b981'
                }}
                style={{ fontWeight: '800' }}
              >
                {currentStepData.type.toUpperCase()}
              </motion.span>
            </h3>
            {currentStepData.i >= 0 && currentStepData.j >= 0 && (
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
                {currentStepData.type === 'compare' 
                  ? `Comparing elements at positions ${currentStepData.i} and ${currentStepData.j}`
                  : `Swapping elements at positions ${currentStepData.i} and ${currentStepData.j}`
                }
              </motion.p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BubbleSortVisualize;
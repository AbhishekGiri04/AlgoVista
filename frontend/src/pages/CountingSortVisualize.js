import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CountingSortVisualize = () => {
  const [array, setArray] = useState([4, 2, 2, 8, 3, 3, 1]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const runCountingSort = async () => {
    setLoading(true);
    const clientSteps = generateCountingSortSteps([...array]);
    setSteps(clientSteps);
    setCurrentStep(0);
    setLoading(false);
  };

  const generateCountingSortSteps = (arr) => {
    const steps = [];
    const max = Math.max(...arr);
    const count = new Array(max + 1).fill(0);
    
    steps.push({ arr: [...arr], count: [...count], type: 'start', description: 'Starting Counting Sort' });
    
    // Count occurrences
    for (let i = 0; i < arr.length; i++) {
      count[arr[i]]++;
      steps.push({
        arr: [...arr],
        count: [...count],
        type: 'count',
        counting: i,
        value: arr[i],
        description: `Counting ${arr[i]} at position ${i}`
      });
    }
    
    steps.push({ arr: [...arr], count: [...count], type: 'counted', description: 'All elements counted' });
    
    // Build output array
    const output = new Array(arr.length);
    let outputIndex = 0;
    
    for (let i = 0; i <= max; i++) {
      while (count[i] > 0) {
        output[outputIndex] = i;
        count[i]--;
        steps.push({
          arr: [...arr],
          output: [...output],
          count: [...count],
          type: 'place',
          placing: outputIndex,
          value: i,
          description: `Placing ${i} at position ${outputIndex}`
        });
        outputIndex++;
      }
    }
    
    steps.push({ arr: output, output, count, type: 'done', description: 'Counting Sort completed!' });
    return steps;
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
    const newValue = Math.floor(Math.random() * 10) + 1;
    setArray([...array, newValue]);
  };

  const removeElement = (index) => {
    setArray(array.filter((_, i) => i !== index));
  };

  const updateElement = (index, value) => {
    const newArray = [...array];
    newArray[index] = Math.max(0, Math.min(20, parseInt(value) || 0));
    setArray(newArray);
  };

  const generateRandom = () => {
    const size = Math.floor(Math.random() * 6) + 5;
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 10) + 1);
    setArray(newArray);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const currentStepData = steps[currentStep] || { arr: array, type: 'start' };
  const maxValue = Math.max(...(currentStepData.arr || array));

  const getBarColor = (index, value) => {
    const { type, counting, placing } = currentStepData;
    
    if (type === 'done') {
      return 'linear-gradient(135deg, #10b981, #059669)';
    }
    
    if (type === 'count' && index === counting) {
      return 'linear-gradient(135deg, #f59e0b, #d97706)';
    }
    
    if (type === 'place' && index === placing) {
      return 'linear-gradient(135deg, #06b6d4, #0891b2)';
    }
    
    const intensity = value / maxValue;
    if (intensity > 0.7) return 'linear-gradient(135deg, #6366f1, #4f46e5)';
    if (intensity > 0.4) return 'linear-gradient(135deg, #6b7280, #4b5563)';
    return 'linear-gradient(135deg, #374151, #1f2937)';
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
          Counting Sort Visualization
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#64748b', textAlign: 'center' }}>
          Non-Comparison Based Integer Sorting
        </p>
      </motion.div>

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
          }}>Array Elements (0-20)</h3>
          
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
                  min="0"
                  max="20"
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
            onClick={runCountingSort}
            disabled={loading}
            style={{
              background: loading 
                ? 'linear-gradient(135deg, #6b7280, #4b5563)'
                : 'linear-gradient(135deg, #8b5cf6, #f59e0b)',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '16px',
              fontSize: '18px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading 
                ? 'none'
                : '0 10px 30px rgba(139, 92, 246, 0.4)',
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
                Start Counting Sort
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
                  min="400"
                  max="1600"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  style={{ 
                    width: '120px',
                    accentColor: '#8b5cf6'
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
            {(currentStepData.output || currentStepData.arr || array).map((value, index) => (
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
                  layout: { duration: 0.6 }
                }}
                style={{
                  width: '50px',
                  background: getBarColor(index, value),
                  borderRadius: '8px 8px 4px 4px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  paddingBottom: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  border: '2px solid rgba(255,255,255,0.1)'
                }}
              >
                <span style={{ 
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  zIndex: 1
                }}>
                  {value}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {steps.length > 0 && currentStepData.count && (
          <div style={{
            marginTop: '30px',
            padding: '30px',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '20px',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            position: 'relative',
            zIndex: 1,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ 
              marginBottom: '20px', 
              textAlign: 'center',
              color: '#1e293b',
              fontSize: '1.5rem',
              fontWeight: '700'
            }}>Count Array</h3>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '5px',
              flexWrap: 'wrap'
            }}>
              {currentStepData.count.map((count, index) => (
                <motion.div 
                  key={index} 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    padding: '12px 16px',
                    background: count > 0 
                      ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' 
                      : 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
                    borderRadius: '12px',
                    textAlign: 'center',
                    minWidth: '50px',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div style={{ 
                    fontSize: '12px', 
                    color: count > 0 ? 'rgba(255, 255, 255, 0.8)' : '#64748b',
                    fontWeight: '500'
                  }}>{index}</div>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold',
                    color: count > 0 ? 'white' : '#1e293b'
                  }}>{count}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

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
            { color: 'linear-gradient(135deg, #f59e0b, #d97706)', label: 'Counting' },
            { color: 'linear-gradient(135deg, #06b6d4, #0891b2)', label: 'Placing' },
            { color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', label: 'Count Array' }
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
                  color: currentStepData.type === 'count' ? '#f59e0b' : 
                        currentStepData.type === 'place' ? '#06b6d4' : '#10b981'
                }}
                style={{ fontWeight: '800' }}
              >
                {currentStepData.type.toUpperCase()}
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
              {currentStepData.description || 'Counting Sort in progress...'}
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
            {[{label: 'Best', height: 80}, {label: 'Average', height: 80}, {label: 'Worst', height: 80}].map((item, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: '60px',
                  height: `${item.height}px`,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  borderRadius: '12px',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '11px'
                }}>O(n + k)</div>
                <span style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', fontWeight: '600' }}>{item.label} Case</span>
              </div>
            ))}
          </div>
          
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <h4 style={{ color: '#059669', marginBottom: '10px', fontSize: '16px', fontWeight: '600' }}>Performance Insights</h4>
            <ul style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: 0, paddingLeft: '20px' }}>
              <li>Linear time complexity O(n + k)</li>
              <li>k is the range of input values</li>
              <li>Efficient when k is small relative to n</li>
              <li>Non-comparison based algorithm</li>
            </ul>
          </div>
        </div>

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
                height: '120px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                borderRadius: '12px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '16px'
              }}>O(k)</div>
              <span style={{ fontSize: '14px', color: '#64748b', textAlign: 'center', fontWeight: '600' }}>Linear Space</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>Count array</span>
            </div>
          </div>
          
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(245, 158, 11, 0.2)'
          }}>
            <h4 style={{ color: '#d97706', marginBottom: '10px', fontSize: '16px', fontWeight: '600' }}>Memory Usage</h4>
            <ul style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: 0, paddingLeft: '20px' }}>
              <li>Requires O(k) extra space for counting</li>
              <li>k is the range of input values</li>
              <li>Additional output array of size n</li>
              <li>Not suitable for large value ranges</li>
            </ul>
          </div>
        </div>
      </div>

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
        }}>How Counting Sort Works</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px', marginBottom: '40px' }}>
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
            }}>1</div>
            <h4 style={{ color: '#d97706', marginBottom: '15px', fontSize: '18px', fontWeight: '700' }}>Count Occurrences</h4>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>Count how many times each value appears in the input array</p>
          </div>
          
          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '16px',
            padding: '25px',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              borderRadius: '50%',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: '700'
            }}>2</div>
            <h4 style={{ color: '#7c3aed', marginBottom: '15px', fontSize: '18px', fontWeight: '700' }}>Calculate Positions</h4>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>Transform counts into starting positions for each value in output</p>
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
            <h4 style={{ color: '#0891b2', marginBottom: '15px', fontSize: '18px', fontWeight: '700' }}>Place Elements</h4>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>Place each element in its correct position in the output array</p>
          </div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(139, 92, 246, 0.1))',
          borderRadius: '16px',
          padding: '30px',
          border: '1px solid rgba(245, 158, 11, 0.2)'
        }}>
          <h4 style={{ color: '#d97706', marginBottom: '20px', fontSize: '20px', fontWeight: '700', textAlign: 'center' }}>Non-Comparison Based Sorting</h4>
          <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.8', textAlign: 'center', margin: 0 }}>
            Unlike comparison-based algorithms, Counting Sort doesn't compare elements. Instead, it counts occurrences 
            of each distinct element and uses this information to determine positions. This approach achieves linear 
            time complexity but requires knowing the range of possible values in advance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CountingSortVisualize;
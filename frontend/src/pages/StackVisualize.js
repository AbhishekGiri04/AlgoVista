import React, { useState, useEffect } from 'react';

const StackVisualize = () => {
  const [stack, setStack] = useState([10, 20, 30]);
  const [pushValue, setPushValue] = useState('');
  const [maxSize] = useState(8);
  const [highlightIndex, setHighlightIndex] = useState(null);
  const [operationLog, setOperationLog] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const addToLog = (op, details) => {
    const timestamp = new Date().toLocaleTimeString();
    setOperationLog(prev => [{
      id: Date.now(),
      operation: op,
      details,
      timestamp
    }, ...prev.slice(0, 9)]);
  };

  const animateOperation = (callback, duration = 600) => {
    setIsAnimating(true);
    setTimeout(() => {
      callback();
      setIsAnimating(false);
    }, duration);
  };

  const pushElement = () => {
    if (!pushValue.trim() || stack.length >= maxSize) return;
    
    const newValue = parseInt(pushValue);
    animateOperation(() => {
      setStack(prev => [...prev, newValue]);
      addToLog('PUSH', `Added ${newValue} to top of stack`);
      setPushValue('');
    });
  };

  const popElement = () => {
    if (stack.length === 0) return;
    
    const poppedValue = stack[stack.length - 1];
    animateOperation(() => {
      setStack(prev => prev.slice(0, -1));
      addToLog('POP', `Removed ${poppedValue} from top of stack`);
    });
  };

  const traverseStack = () => {
    if (stack.length === 0) {
      addToLog('TRAVERSE', 'Stack is empty - nothing to traverse');
      return;
    }
    
    let currentIndex = stack.length - 1;
    const traverse = () => {
      if (currentIndex >= 0) {
        setHighlightIndex(currentIndex);
        currentIndex--;
        setTimeout(traverse, 600);
      } else {
        setHighlightIndex(null);
        addToLog('TRAVERSE', `Traversed all ${stack.length} elements from top to bottom`);
      }
    };
    traverse();
  };

  const peekElement = () => {
    if (stack.length === 0) {
      addToLog('PEEK', 'Stack is empty - no top element');
      return;
    }
    
    const topValue = stack[stack.length - 1];
    setHighlightIndex(stack.length - 1);
    addToLog('PEEK', `Top element is ${topValue}`);
    setTimeout(() => setHighlightIndex(null), 1500);
  };

  const clearStack = () => {
    if (stack.length === 0) return;
    
    animateOperation(() => {
      setStack([]);
      addToLog('CLEAR', 'Cleared all elements from stack');
    });
  };

  const checkEmpty = () => {
    const isEmpty = stack.length === 0;
    addToLog('IS_EMPTY', isEmpty ? 'Stack is empty' : 'Stack is not empty');
  };

  const checkFull = () => {
    const isFull = stack.length >= maxSize;
    addToLog('IS_FULL', isFull ? 'Stack is full' : `Stack has ${maxSize - stack.length} free spaces`);
  };

  const getStackElementStyle = (index) => {
    const isTop = index === stack.length - 1;
    const isHighlighted = highlightIndex === index;
    const baseStyle = {
      width: '120px',
      height: '50px',
      background: isHighlighted
        ? 'linear-gradient(135deg, #10b981, #34d399)' 
        : isTop 
        ? 'linear-gradient(135deg, #f59e0b, #fbbf24)'
        : 'linear-gradient(135deg, #3b82f6, #60a5fa)',
      border: '2px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: '700',
      fontSize: '16px',
      boxShadow: isHighlighted
        ? '0 8px 25px rgba(16, 185, 129, 0.4), inset 0 2px 4px rgba(255,255,255,0.2)'
        : isTop
        ? '0 6px 20px rgba(245, 158, 11, 0.3), inset 0 2px 4px rgba(255,255,255,0.1)'
        : '0 4px 15px rgba(59, 130, 246, 0.3), inset 0 2px 4px rgba(255,255,255,0.1)',
      transform: isHighlighted 
        ? 'scale(1.1) translateZ(20px) rotateX(10deg)' 
        : isTop
        ? 'translateZ(10px) rotateX(5deg)'
        : 'rotateX(3deg)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      marginBottom: '4px',
      position: 'relative',
      transformStyle: 'preserve-3d',
      perspective: '1000px'
    };
    return baseStyle;
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc, #f1f5f9, #e2e8f0)',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Inter, sans-serif',
      color: '#1e293b'
    }}>
      <a href="/datastructures" style={{
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
        ← Back to Data Structures
      </a>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
            background: 'linear-gradient(135deg, #a8edea, #fed6e3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 12px',
            textAlign: 'center'
          }}>
            Stack Visualizer
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#1e293b',
            textAlign: 'center',
            margin: '0'
          }}>
            Interactive visualization of LIFO (Last-In-First-Out) stack operations
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
          {/* Main Visualization */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '24px',
            padding: '40px',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto'
          }}>
            <style>{`
              div::-webkit-scrollbar {
                width: 6px;
              }
              div::-webkit-scrollbar-track {
                background: rgba(148, 163, 184, 0.1);
                border-radius: 10px;
              }
              div::-webkit-scrollbar-thumb {
                background: rgba(148, 163, 184, 0.4);
                border-radius: 10px;
              }
              div::-webkit-scrollbar-thumb:hover {
                background: rgba(148, 163, 184, 0.6);
              }
            `}</style>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              marginBottom: '30px',
              color: '#1e293b'
            }}>
              LIFO Stack Structure
            </h2>

            {/* Stack Info */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '30px',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '12px',
              border: '1px solid rgba(148, 163, 184, 0.2)'
            }}>
              <div>
                <span style={{ color: '#64748b' }}>Stack Size: </span>
                <span style={{ fontWeight: '700', color: '#3b82f6' }}>{stack.length}/{maxSize}</span>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Top Element: </span>
                <span style={{ fontWeight: '700', color: '#f59e0b' }}>
                  {stack.length > 0 ? stack[stack.length - 1] : 'None'}
                </span>
              </div>
            </div>

            {/* Stack Visualization */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '16px',
              padding: '30px',
              marginBottom: '30px',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'center',
              border: '1px solid rgba(148, 163, 184, 0.2)'
            }}>
              {stack.length > 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px'
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: '#64748b',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}>
                    TOP
                  </div>
                  {stack.slice().reverse().map((value, reverseIndex) => {
                    const originalIndex = stack.length - 1 - reverseIndex;
                    return (
                      <div key={originalIndex} style={getStackElementStyle(originalIndex)}>
                        <div style={{ textAlign: 'center' }}>
                          <div>{value}</div>
                        </div>
                      </div>
                    );
                  })}
                  <div style={{
                    width: '120px',
                    height: '4px',
                    background: 'linear-gradient(135deg, #64748b, #475569)',
                    borderRadius: '2px',
                    marginTop: '10px'
                  }} />
                  <div style={{
                    fontSize: '14px',
                    color: '#64748b',
                    marginTop: '8px',
                    fontWeight: '600'
                  }}>
                    BOTTOM
                  </div>
                </div>
              ) : (
                <div style={{
                  color: '#64748b',
                  fontSize: '18px',
                  fontStyle: 'italic',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: '#64748b',
                    marginBottom: '20px',
                    fontWeight: '600'
                  }}>
                    TOP
                  </div>
                  Stack is empty
                  <div style={{
                    width: '120px',
                    height: '4px',
                    background: 'linear-gradient(135deg, #64748b, #475569)',
                    borderRadius: '2px',
                    margin: '20px auto 10px'
                  }} />
                  <div style={{
                    fontSize: '14px',
                    color: '#64748b',
                    fontWeight: '600'
                  }}>
                    BOTTOM
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '16px',
              padding: '25px',
              border: '1px solid rgba(148, 163, 184, 0.2)'
            }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                fontWeight: '600', 
                marginBottom: '20px',
                color: '#1e293b'
              }}>
                Stack Operations
              </h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#475569', fontWeight: '600' }}>
                  Push Value
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="number"
                    value={pushValue}
                    onChange={(e) => setPushValue(e.target.value)}
                    placeholder="Enter value to push"
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      background: '#fff',
                      color: '#1e293b',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={pushElement}
                    disabled={isAnimating || stack.length >= maxSize}
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: (isAnimating || stack.length >= maxSize) ? 'not-allowed' : 'pointer',
                      opacity: (isAnimating || stack.length >= maxSize) ? 0.6 : 1
                    }}
                  >
                    Push
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Pop', action: popElement, color: '#ef4444', disabled: stack.length === 0 },
                  { label: 'Peek', action: peekElement, color: '#f59e0b', disabled: false },
                  { label: 'Traverse', action: traverseStack, color: '#10b981', disabled: stack.length === 0 },
                  { label: 'Clear', action: clearStack, color: '#06b6d4', disabled: stack.length === 0 },
                  { label: 'isEmpty', action: checkEmpty, color: '#8b5cf6', disabled: false },
                  { label: 'isFull', action: checkFull, color: '#ec4899', disabled: false }
                ].map(({ label, action, color, disabled }) => (
                  <button
                    key={label}
                    onClick={action}
                    disabled={isAnimating || disabled}
                    style={{
                      background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: (isAnimating || disabled) ? 'not-allowed' : 'pointer',
                      opacity: (isAnimating || disabled) ? 0.6 : 1,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Performance */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '16px',
              padding: '25px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px', color: '#1e293b' }}>
                Performance
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  { op: 'Push', complexity: 'O(1)' },
                  { op: 'Pop', complexity: 'O(1)' },
                  { op: 'Peek', complexity: 'O(1)' },
                  { op: 'Space', complexity: 'O(n)' }
                ].map(({ op, complexity }) => (
                  <div key={op} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>{op}:</span>
                    <span style={{ fontWeight: '600', color: '#3b82f6' }}>{complexity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Operation Log */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '16px',
              padding: '25px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              maxHeight: '500px',
              overflow: 'hidden'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px', color: '#1e293b' }}>
                Operation Log
              </h3>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {operationLog.length > 0 ? operationLog.map((log) => (
                  <div key={log.id} style={{
                    padding: '12px',
                    marginBottom: '8px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                  }}>
                    <div style={{ 
                      fontWeight: '600', 
                      color: log.operation === 'PUSH' ? '#10b981' :
                             log.operation === 'POP' ? '#ef4444' :
                             log.operation === 'PEEK' ? '#06b6d4' :
                             log.operation === 'CLEAR' ? '#64748b' : '#8b5cf6'
                    }}>
                      {log.operation}
                    </div>
                    <div style={{ color: '#475569', marginTop: '4px' }}>
                      {log.details}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '10px', marginTop: '4px' }}>
                      {log.timestamp}
                    </div>
                  </div>
                )) : (
                  <div style={{ color: '#64748b', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
                    No operations yet. Try pushing elements!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StackVisualize;
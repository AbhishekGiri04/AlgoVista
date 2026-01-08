import React, { useState } from 'react';

const QueueVisualize = () => {
  const [queue, setQueue] = useState([10, 20, 30]);
  const [enqueueValue, setEnqueueValue] = useState('');
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

  const enqueueElement = () => {
    if (!enqueueValue.trim() || queue.length >= maxSize) return;
    
    const newValue = parseInt(enqueueValue);
    animateOperation(() => {
      setQueue(prev => [...prev, newValue]);
      addToLog('ENQUEUE', `Added ${newValue} to rear of queue`);
      setEnqueueValue('');
    });
  };

  const dequeueElement = () => {
    if (queue.length === 0) return;
    
    const dequeuedValue = queue[0];
    animateOperation(() => {
      setQueue(prev => prev.slice(1));
      addToLog('DEQUEUE', `Removed ${dequeuedValue} from front of queue`);
    });
  };

  const peekElement = () => {
    if (queue.length === 0) {
      addToLog('PEEK', 'Queue is empty - no front element');
      return;
    }
    
    const frontValue = queue[0];
    setHighlightIndex(0);
    addToLog('PEEK', `Front element is ${frontValue}`);
    setTimeout(() => setHighlightIndex(null), 1500);
  };

  const traverseQueue = () => {
    if (queue.length === 0) {
      addToLog('TRAVERSE', 'Queue is empty - nothing to traverse');
      return;
    }
    
    let currentIndex = 0;
    const traverse = () => {
      if (currentIndex < queue.length) {
        setHighlightIndex(currentIndex);
        currentIndex++;
        setTimeout(traverse, 600);
      } else {
        setHighlightIndex(null);
        addToLog('TRAVERSE', `Traversed all ${queue.length} elements from front to rear`);
      }
    };
    traverse();
  };

  const clearQueue = () => {
    if (queue.length === 0) return;
    
    animateOperation(() => {
      setQueue([]);
      addToLog('CLEAR', 'Cleared all elements from queue');
    });
  };

  const checkEmpty = () => {
    const isEmpty = queue.length === 0;
    addToLog('IS_EMPTY', isEmpty ? 'Queue is empty' : 'Queue is not empty');
  };

  const checkFull = () => {
    const isFull = queue.length >= maxSize;
    addToLog('IS_FULL', isFull ? 'Queue is full' : `Queue has ${maxSize - queue.length} free spaces`);
  };

  const getQueueElementStyle = (index) => {
    const isFront = index === 0;
    const isRear = index === queue.length - 1;
    const isHighlighted = highlightIndex === index;
    
    const baseStyle = {
      width: '80px',
      height: '60px',
      background: isHighlighted
        ? 'linear-gradient(135deg, #10b981, #34d399)' 
        : isFront 
        ? 'linear-gradient(135deg, #06b6d4, #0891b2)'
        : isRear
        ? 'linear-gradient(135deg, #f59e0b, #d97706)'
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
        : isFront
        ? '0 6px 20px rgba(6, 182, 212, 0.3), inset 0 2px 4px rgba(255,255,255,0.1)'
        : isRear
        ? '0 6px 20px rgba(245, 158, 11, 0.3), inset 0 2px 4px rgba(255,255,255,0.1)'
        : '0 4px 15px rgba(59, 130, 246, 0.3), inset 0 2px 4px rgba(255,255,255,0.1)',
      transform: isHighlighted 
        ? 'scale(1.1) translateZ(15px) rotateY(10deg)' 
        : isFront
        ? 'translateZ(8px) rotateY(5deg)'
        : isRear
        ? 'translateZ(8px) rotateY(-5deg)'
        : 'rotateY(2deg)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      marginRight: index < queue.length - 1 ? '8px' : '0',
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
        {/* Header */}
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '800',
          color: '#1e293b',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          Queue Operations Visualizer
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#64748b', textAlign: 'center', marginBottom: '40px' }}>
          Interactive visualization of FIFO (First-In-First-Out) queue operations
        </p>

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
              FIFO Queue Structure
            </h2>

            {/* Queue Info */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '20px',
              marginBottom: '30px',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '12px',
              border: '1px solid rgba(148, 163, 184, 0.2)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ color: '#64748b', display: 'block' }}>Queue Size</span>
                <span style={{ fontWeight: '700', color: '#3b82f6', fontSize: '1.2rem' }}>{queue.length}/{maxSize}</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ color: '#64748b', display: 'block' }}>Front</span>
                <span style={{ fontWeight: '700', color: '#06b6d4', fontSize: '1.2rem' }}>
                  {queue.length > 0 ? queue[0] : 'None'}
                </span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ color: '#64748b', display: 'block' }}>Rear</span>
                <span style={{ fontWeight: '700', color: '#f59e0b', fontSize: '1.2rem' }}>
                  {queue.length > 0 ? queue[queue.length - 1] : 'None'}
                </span>
              </div>
            </div>

            {/* Queue Visualization */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '16px',
              padding: '40px',
              marginBottom: '30px',
              minHeight: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(148, 163, 184, 0.2)'
            }}>
              {queue.length > 0 ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0px'
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: '#06b6d4',
                    marginRight: '15px',
                    fontWeight: '600'
                  }}>
                    FRONT
                  </div>
                  {queue.map((value, index) => (
                    <div key={index} style={getQueueElementStyle(index)}>
                      <div style={{ textAlign: 'center' }}>
                        <div>{value}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{
                    fontSize: '14px',
                    color: '#f59e0b',
                    marginLeft: '15px',
                    fontWeight: '600'
                  }}>
                    REAR
                  </div>
                </div>
              ) : (
                <div style={{
                  color: '#64748b',
                  fontSize: '18px',
                  fontStyle: 'italic',
                  textAlign: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                      fontSize: '14px',
                      color: '#06b6d4',
                      fontWeight: '600'
                    }}>
                      FRONT
                    </div>
                    <div>Queue is empty</div>
                    <div style={{
                      fontSize: '14px',
                      color: '#f59e0b',
                      fontWeight: '600'
                    }}>
                      REAR
                    </div>
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
                Queue Operations
              </h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#475569', fontWeight: '600' }}>
                  Enqueue Value
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="number"
                    value={enqueueValue}
                    onChange={(e) => setEnqueueValue(e.target.value)}
                    placeholder="Enter value to enqueue"
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
                    onClick={enqueueElement}
                    disabled={isAnimating || queue.length >= maxSize}
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: (isAnimating || queue.length >= maxSize) ? 'not-allowed' : 'pointer',
                      opacity: (isAnimating || queue.length >= maxSize) ? 0.6 : 1
                    }}
                  >
                    Enqueue
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Dequeue', action: dequeueElement, color: '#ef4444', disabled: queue.length === 0 },
                  { label: 'Peek', action: peekElement, color: '#f59e0b', disabled: false },
                  { label: 'Traverse', action: traverseQueue, color: '#10b981', disabled: queue.length === 0 },
                  { label: 'Clear', action: clearQueue, color: '#06b6d4', disabled: queue.length === 0 },
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
                  { op: 'Enqueue', complexity: 'O(1)' },
                  { op: 'Dequeue', complexity: 'O(1)' },
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
                      color: log.operation === 'ENQUEUE' ? '#10b981' :
                             log.operation === 'DEQUEUE' ? '#ef4444' :
                             log.operation === 'PEEK' ? '#06b6d4' :
                             log.operation === 'TRAVERSE' ? '#8b5cf6' :
                             log.operation === 'CLEAR' ? '#64748b' : '#f59e0b'
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
                    No operations yet. Try enqueuing elements!
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

export default QueueVisualize;
import React, { useState } from 'react';

const LinkedListVisualize = () => {
  const [linkedList, setLinkedList] = useState([10, 20, 30]);
  const [value, setValue] = useState('');
  const [position, setPosition] = useState('');
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

  const insertFirst = () => {
    if (!value.trim()) return;
    const newValue = parseInt(value);
    animateOperation(() => {
      setLinkedList(prev => [newValue, ...prev]);
      addToLog('INSERT_FIRST', `Added ${newValue} at head`);
      setValue('');
    });
  };

  const insertLast = () => {
    if (!value.trim()) return;
    const newValue = parseInt(value);
    animateOperation(() => {
      setLinkedList(prev => [...prev, newValue]);
      addToLog('INSERT_LAST', `Added ${newValue} at tail`);
      setValue('');
    });
  };

  const insertAt = () => {
    if (!value.trim() || position === '') return;
    const newValue = parseInt(value);
    const pos = Math.max(0, Math.min(parseInt(position), linkedList.length));
    animateOperation(() => {
      const newList = [...linkedList];
      newList.splice(pos, 0, newValue);
      setLinkedList(newList);
      addToLog('INSERT_AT', `Added ${newValue} at position ${pos}`);
      setValue('');
      setPosition('');
    });
  };

  const removeFirst = () => {
    if (linkedList.length === 0) return;
    const removedValue = linkedList[0];
    animateOperation(() => {
      setLinkedList(prev => prev.slice(1));
      addToLog('REMOVE_FIRST', `Removed ${removedValue} from head`);
    });
  };

  const removeLast = () => {
    if (linkedList.length === 0) return;
    const removedValue = linkedList[linkedList.length - 1];
    animateOperation(() => {
      setLinkedList(prev => prev.slice(0, -1));
      addToLog('REMOVE_LAST', `Removed ${removedValue} from tail`);
    });
  };

  const traverseList = () => {
    if (linkedList.length === 0) {
      addToLog('TRAVERSE', 'List is empty - nothing to traverse');
      return;
    }
    
    let currentIndex = 0;
    const traverse = () => {
      if (currentIndex < linkedList.length) {
        setHighlightIndex(currentIndex);
        currentIndex++;
        setTimeout(traverse, 800);
      } else {
        setHighlightIndex(null);
        addToLog('TRAVERSE', `Traversed all ${linkedList.length} nodes`);
      }
    };
    traverse();
  };

  const getNodeStyle = (index) => {
    const isHead = index === 0;
    const isTail = index === linkedList.length - 1;
    const isHighlighted = highlightIndex === index;
    
    return {
      minWidth: '80px',
      height: '60px',
      background: isHighlighted
        ? 'linear-gradient(135deg, #10b981, #34d399)'
        : isHead
        ? 'linear-gradient(135deg, #ef4444, #f87171)'
        : isTail
        ? 'linear-gradient(135deg, #8b5cf6, #a78bfa)'
        : 'linear-gradient(135deg, #3b82f6, #60a5fa)',
      border: '3px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: '700',
      fontSize: '16px',
      boxShadow: isHighlighted
        ? '0 15px 35px rgba(16, 185, 129, 0.5), inset 0 3px 6px rgba(255,255,255,0.3)'
        : '0 10px 25px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)',
      transform: isHighlighted
        ? 'translateZ(30px) rotateX(15deg) rotateY(10deg) scale(1.1)'
        : `translateZ(${index * 5}px) rotateX(10deg) rotateY(${index * 2}deg)`,
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      transformStyle: 'preserve-3d',
      perspective: '1000px',
      flexShrink: 0
    };
  };

  const getArrowStyle = (index) => {
    return {
      width: '40px',
      height: '4px',
      background: 'linear-gradient(90deg, #64748b, #94a3b8)',
      position: 'relative',
      transform: `translateZ(${index * 5 + 2}px) rotateY(${index * 2}deg)`,
      transition: 'all 0.5s ease',
      transformStyle: 'preserve-3d',
      '::after': {
        content: '""',
        position: 'absolute',
        right: '-8px',
        top: '-4px',
        width: '0',
        height: '0',
        borderLeft: '8px solid #94a3b8',
        borderTop: '6px solid transparent',
        borderBottom: '6px solid transparent'
      }
    };
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
            background: 'linear-gradient(135deg, #e8d5c4, #f4e4bc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 12px',
            textAlign: 'center'
          }}>
            Linked List Visualizer
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#1e293b',
            textAlign: 'center',
            margin: '0'
          }}>
            Interactive 3D visualization of dynamic node-based data structure
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', alignItems: 'start' }}>
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
              3D Linked List Structure
            </h2>

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
                <span style={{ color: '#64748b' }}>List Size: </span>
                <span style={{ fontWeight: '700', color: '#3b82f6' }}>{linkedList.length}</span>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Head: </span>
                <span style={{ fontWeight: '700', color: '#ef4444' }}>
                  {linkedList.length > 0 ? linkedList[0] : 'NULL'}
                </span>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Tail: </span>
                <span style={{ fontWeight: '700', color: '#8b5cf6' }}>
                  {linkedList.length > 0 ? linkedList[linkedList.length - 1] : 'NULL'}
                </span>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '16px',
              padding: '50px 30px',
              marginBottom: '30px',
              height: '200px',
              maxHeight: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              perspective: '1200px',
              transformStyle: 'preserve-3d',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              overflowX: 'auto',
              overflowY: 'hidden'
            }}>
              {linkedList.length > 0 ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0px',
                  transformStyle: 'preserve-3d',
                  transform: 'rotateX(10deg) rotateY(5deg)',
                  minWidth: 'max-content'
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#ef4444',
                    marginRight: '15px',
                    fontWeight: '600',
                    transform: 'translateZ(10px)'
                  }}>
                    HEAD
                  </div>
                  {linkedList.map((value, index) => (
                    <React.Fragment key={index}>
                      <div style={getNodeStyle(index)}>
                        <div style={{ textAlign: 'center' }}>
                          <div>{value}</div>
                          <div style={{
                            position: 'absolute',
                            bottom: '-25px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '10px',
                            color: '#94a3b8'
                          }}>
                            [{index}]
                          </div>
                        </div>
                      </div>
                      {index < linkedList.length - 1 && (
                        <div style={{
                          width: '40px',
                          height: '4px',
                          background: 'linear-gradient(90deg, #64748b, #94a3b8)',
                          position: 'relative',
                          transform: `translateZ(${index * 5 + 2}px) rotateY(${index * 2}deg)`,
                          transition: 'all 0.5s ease',
                          transformStyle: 'preserve-3d',
                          margin: '0 5px'
                        }}>
                          <div style={{
                            position: 'absolute',
                            right: '-8px',
                            top: '-4px',
                            width: '0',
                            height: '0',
                            borderLeft: '8px solid #94a3b8',
                            borderTop: '6px solid transparent',
                            borderBottom: '6px solid transparent'
                          }} />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                  <div style={{
                    fontSize: '12px',
                    color: '#64748b',
                    marginLeft: '15px',
                    fontWeight: '600',
                    transform: 'translateZ(10px)'
                  }}>
                    NULL
                  </div>
                </div>
              ) : (
                <div style={{
                  color: '#64748b',
                  fontSize: '18px',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  transform: 'translateZ(20px)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ color: '#ef4444', fontWeight: '600' }}>HEAD</div>
                    <div>List is empty</div>
                    <div style={{ color: '#64748b', fontWeight: '600' }}>NULL</div>
                  </div>
                </div>
              )}
            </div>

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
                Linked List Operations
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#475569', fontWeight: '600' }}>
                    Value
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Enter value"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      background: '#fff',
                      color: '#1e293b',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#475569', fontWeight: '600' }}>
                    Position (for insert at)
                  </label>
                  <input
                    type="number"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Position"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      background: '#fff',
                      color: '#1e293b',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Insert First', action: insertFirst, color: '#ef4444' },
                  { label: 'Insert Last', action: insertLast, color: '#8b5cf6' },
                  { label: 'Insert At', action: insertAt, color: '#10b981' },
                  { label: 'Remove First', action: removeFirst, color: '#f59e0b', disabled: linkedList.length === 0 },
                  { label: 'Remove Last', action: removeLast, color: '#06b6d4', disabled: linkedList.length === 0 },
                  { label: 'Traverse', action: traverseList, color: '#ec4899', disabled: linkedList.length === 0 }
                ].map(({ label, action, color, disabled }) => (
                  <button
                    key={label}
                    onClick={action}
                    disabled={isAnimating || disabled}
                    style={{
                      background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                      color: 'white',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: (isAnimating || disabled) ? 'not-allowed' : 'pointer',
                      opacity: (isAnimating || disabled) ? 0.6 : 1
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                  { op: 'Insert First', complexity: 'O(1)' },
                  { op: 'Insert Last', complexity: 'O(n)' },
                  { op: 'Insert At', complexity: 'O(n)' },
                  { op: 'Remove', complexity: 'O(n)' },
                  { op: 'Search', complexity: 'O(n)' },
                  { op: 'Space', complexity: 'O(n)' }
                ].map(({ op, complexity }) => (
                  <div key={op} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>{op}:</span>
                    <span style={{ fontWeight: '600', color: '#3b82f6', fontSize: '13px' }}>{complexity}</span>
                  </div>
                ))}
              </div>
            </div>

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
                      color: log.operation.includes('INSERT') ? '#10b981' :
                             log.operation.includes('REMOVE') ? '#ef4444' :
                             log.operation === 'TRAVERSE' ? '#06b6d4' : '#8b5cf6'
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
                    No operations yet. Try inserting nodes!
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

export default LinkedListVisualize;
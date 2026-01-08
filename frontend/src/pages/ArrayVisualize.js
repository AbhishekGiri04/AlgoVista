import React, { useState, useEffect, useRef } from 'react';

const ArrayVisualize = () => {
  const [array, setArray] = useState([10, 20, 30, 40, 50]);
  const [value, setValue] = useState('');
  const [index, setIndex] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(null);
  const [operation, setOperation] = useState('');
  const [operationLog, setOperationLog] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [arraySize, setArraySize] = useState(10);
  const animationRef = useRef(null);

  const addToLog = (op, details) => {
    const timestamp = new Date().toLocaleTimeString();
    setOperationLog(prev => [{
      id: Date.now(),
      operation: op,
      details,
      timestamp
    }, ...prev.slice(0, 9)]);
  };

  const animateOperation = (callback, duration = 800) => {
    setIsAnimating(true);
    setTimeout(() => {
      callback();
      setIsAnimating(false);
    }, duration);
  };

  const insertElement = () => {
    if (!value.trim()) return;
    
    const newValue = parseInt(value);
    const insertIndex = index === '' ? array.length : Math.max(0, Math.min(parseInt(index), array.length));
    
    animateOperation(() => {
      const newArray = [...array];
      newArray.splice(insertIndex, 0, newValue);
      setArray(newArray);
      addToLog('INSERT', `Added ${newValue} at index ${insertIndex}`);
      setValue('');
      setIndex('');
    });
  };

  const deleteElement = () => {
    if (index === '' || array.length === 0) return;
    
    const deleteIndex = Math.max(0, Math.min(parseInt(index), array.length - 1));
    const deletedValue = array[deleteIndex];
    
    animateOperation(() => {
      const newArray = [...array];
      newArray.splice(deleteIndex, 1);
      setArray(newArray);
      addToLog('DELETE', `Removed ${deletedValue} from index ${deleteIndex}`);
      setIndex('');
    });
  };

  const updateElement = () => {
    if (!value.trim() || index === '' || array.length === 0) return;
    
    const updateIndex = Math.max(0, Math.min(parseInt(index), array.length - 1));
    const newValue = parseInt(value);
    const oldValue = array[updateIndex];
    
    animateOperation(() => {
      const newArray = [...array];
      newArray[updateIndex] = newValue;
      setArray(newArray);
      addToLog('UPDATE', `Changed index ${updateIndex}: ${oldValue} → ${newValue}`);
      setValue('');
      setIndex('');
    });
  };

  const searchElement = () => {
    if (!searchValue.trim()) return;
    
    const searchVal = parseInt(searchValue);
    const foundIndex = array.indexOf(searchVal);
    
    if (foundIndex !== -1) {
      setHighlightIndex(foundIndex);
      addToLog('SEARCH', `Found ${searchVal} at index ${foundIndex}`);
      setTimeout(() => setHighlightIndex(null), 2000);
    } else {
      addToLog('SEARCH', `${searchVal} not found in array`);
    }
    setSearchValue('');
  };

  const traverseArray = () => {
    let currentIndex = 0;
    const traverse = () => {
      if (currentIndex < array.length) {
        setHighlightIndex(currentIndex);
        currentIndex++;
        setTimeout(traverse, 500);
      } else {
        setHighlightIndex(null);
        addToLog('TRAVERSE', `Visited all ${array.length} elements`);
      }
    };
    traverse();
  };

  const resizeArray = () => {
    const newSize = Math.max(1, Math.min(20, arraySize));
    if (newSize > array.length) {
      const newArray = [...array, ...Array(newSize - array.length).fill(0)];
      setArray(newArray);
      addToLog('RESIZE', `Expanded array to size ${newSize}`);
    } else if (newSize < array.length) {
      const newArray = array.slice(0, newSize);
      setArray(newArray);
      addToLog('RESIZE', `Reduced array to size ${newSize}`);
    }
  };

  const getElementStyle = (idx) => {
    const baseStyle = {
      width: '60px',
      height: '60px',
      background: highlightIndex === idx 
        ? 'linear-gradient(135deg, #10b981, #34d399)' 
        : 'linear-gradient(135deg, #3b82f6, #60a5fa)',
      border: '2px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: '700',
      fontSize: '16px',
      boxShadow: highlightIndex === idx 
        ? '0 8px 25px rgba(16, 185, 129, 0.4), inset 0 2px 4px rgba(255,255,255,0.2)' 
        : '0 6px 20px rgba(59, 130, 246, 0.3), inset 0 2px 4px rgba(255,255,255,0.1)',
      transform: highlightIndex === idx 
        ? 'scale(1.1) translateY(-5px) rotateX(15deg) rotateY(5deg)' 
        : 'scale(1) rotateX(10deg) rotateY(2deg)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      cursor: 'pointer',
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
          Array Operations Visualizer
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#64748b', textAlign: 'center', marginBottom: '40px' }}>
          Interactive visualization of array data structure operations
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
              Array Visualization
            </h2>

            {/* Array Display */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '16px',
              padding: '30px',
              marginBottom: '30px',
              minHeight: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(148, 163, 184, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                perspective: '1000px',
                transformStyle: 'preserve-3d'
              }}>
                {array.length > 0 ? array.map((val, idx) => (
                  <div key={idx} style={{ position: 'relative', marginBottom: '30px' }}>
                    <div style={getElementStyle(idx)}>
                      <div style={{ textAlign: 'center' }}>
                        <div>{val}</div>
                      </div>
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: '#64748b',
                      fontWeight: '600',
                      position: 'absolute',
                      bottom: '-24px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      whiteSpace: 'nowrap'
                    }}>
                      [{idx}]
                    </div>
                  </div>
                )) : (
                  <div style={{
                    color: '#64748b',
                    fontSize: '18px',
                    fontStyle: 'italic'
                  }}>
                    Array is empty
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '16px',
              padding: '25px',
              marginBottom: '20px',
              border: '1px solid rgba(148, 163, 184, 0.2)'
            }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                fontWeight: '600', 
                marginBottom: '20px',
                color: '#1e293b'
              }}>
                Array Operations
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
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
                    Index (optional)
                  </label>
                  <input
                    type="number"
                    value={index}
                    onChange={(e) => setIndex(e.target.value)}
                    placeholder="Enter index"
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

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Insert', action: insertElement, color: '#10b981' },
                  { label: 'Delete', action: deleteElement, color: '#ef4444' },
                  { label: 'Update', action: updateElement, color: '#f59e0b' },
                  { label: 'Traverse', action: traverseArray, color: '#8b5cf6' }
                ].map(({ label, action, color }) => (
                  <button
                    key={label}
                    onClick={action}
                    disabled={isAnimating}
                    style={{
                      background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: isAnimating ? 'not-allowed' : 'pointer',
                      opacity: isAnimating ? 0.6 : 1,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '16px',
              padding: '25px',
              border: '1px solid rgba(148, 163, 184, 0.2)'
            }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                fontWeight: '600', 
                marginBottom: '15px',
                color: '#1e293b'
              }}>
                Search Element
              </h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="number"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search value"
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
                  onClick={searchElement}
                  style={{
                    background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Array Stats */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '16px',
              padding: '25px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px', color: '#1e293b' }}>
                Array Size: {array.length}
              </h3>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
                <input
                  type="number"
                  value={arraySize}
                  onChange={(e) => setArraySize(parseInt(e.target.value) || 1)}
                  min="1"
                  max="20"
                  style={{
                    width: '80px',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '2px solid #e5e7eb',
                    background: '#fff',
                    color: '#1e293b',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={resizeArray}
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Resize to {arraySize}
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '16px',
              padding: '25px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px', color: '#1e293b' }}>
                Array Statistics
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Size</span>
                  <span style={{ fontWeight: '600', color: '#1e293b' }}>{array.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Memory</span>
                  <span style={{ fontWeight: '600', color: '#1e293b' }}>{array.length * 4}B</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Access Time</span>
                  <span style={{ fontWeight: '600', color: '#1e293b' }}>O(1)</span>
                </div>
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
              flex: 1
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px', color: '#1e293b' }}>
                Operation Log
              </h3>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {operationLog.length > 0 ? operationLog.map((log) => (
                  <div key={log.id} style={{
                    padding: '10px',
                    marginBottom: '8px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                  }}>
                    <div style={{ fontWeight: '600', color: '#3b82f6' }}>
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
                    No operations yet. Start by inserting elements!
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

export default ArrayVisualize;
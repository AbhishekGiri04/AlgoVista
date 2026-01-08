import React, { useState, useRef, useEffect } from 'react';

class TreeNode {
  constructor(value, id) {
    this.value = value;
    this.id = id;
    this.left = null;
    this.right = null;
  }
}

const TreeVisualize = () => {
  const [root, setRoot] = useState(null);
  const [value, setValue] = useState('');
  const [bulkValues, setBulkValues] = useState('');
  const [activePath, setActivePath] = useState([]);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [visited, setVisited] = useState([]);
  const [traversalOrder, setTraversalOrder] = useState([]);
  const [traversalType, setTraversalType] = useState('inorder');
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(800);
  const [stepMode, setStepMode] = useState(false);
  const [operationLog, setOperationLog] = useState([]);
  const idCounter = useRef(1);
  const nextResolver = useRef(null);

  const addToLog = (operation, details) => {
    const timestamp = new Date().toLocaleTimeString();
    setOperationLog(prev => [{
      id: Date.now(),
      operation,
      details,
      timestamp
    }, ...prev.slice(0, 9)]);
  };

  const makeNode = (val) => {
    return new TreeNode(val, idCounter.current++);
  };

  const cloneTree = (node) => {
    if (!node) return null;
    const newNode = new TreeNode(node.value, node.id);
    newNode.left = cloneTree(node.left);
    newNode.right = cloneTree(node.right);
    return newNode;
  };

  const insertBST = (root, value) => {
    const steps = [];
    if (!root) {
      const newRoot = makeNode(value);
      steps.push({ type: 'create', nodeId: newRoot.id, value, description: `Created root node with value ${value}` });
      return { rootAfter: newRoot, steps };
    }

    const newRoot = cloneTree(root);
    let current = newRoot;
    const path = [];

    while (true) {
      path.push(current.id);
      steps.push({ type: 'focus', nodeId: current.id, value: current.value, description: `Comparing ${value} with ${current.value}` });

      if (value === current.value) {
        steps.push({ type: 'duplicate', nodeId: current.id, value, description: `Value ${value} already exists` });
        return { rootAfter: newRoot, steps };
      }

      if (value < current.value) {
        if (current.left) {
          current = current.left;
        } else {
          current.left = makeNode(value);
          steps.push({ type: 'insert', nodeId: current.left.id, value, description: `Inserted ${value} as left child` });
          return { rootAfter: newRoot, steps };
        }
      } else {
        if (current.right) {
          current = current.right;
        } else {
          current.right = makeNode(value);
          steps.push({ type: 'insert', nodeId: current.right.id, value, description: `Inserted ${value} as right child` });
          return { rootAfter: newRoot, steps };
        }
      }
    }
  };

  const searchBST = (root, value) => {
    const steps = [];
    let current = root;

    while (current) {
      steps.push({ type: 'focus', nodeId: current.id, value: current.value, description: `Comparing ${value} with ${current.value}` });
      
      if (value === current.value) {
        steps.push({ type: 'found', nodeId: current.id, value, description: `Found ${value}!` });
        return { found: true, steps };
      }
      
      current = value < current.value ? current.left : current.right;
    }

    steps.push({ type: 'notfound', nodeId: -1, value, description: `Value ${value} not found` });
    return { found: false, steps };
  };

  const waitForNextClick = () => {
    return new Promise((resolve) => {
      nextResolver.current = resolve;
    });
  };

  const handleNext = () => {
    if (nextResolver.current) {
      nextResolver.current();
      nextResolver.current = null;
    }
  };

  const runWithSteps = async (steps, postApply) => {
    setIsAnimating(true);
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      if (step.type === 'focus') {
        setActiveNodeId(step.nodeId);
        setActivePath(prev => prev.includes(step.nodeId) ? prev : [...prev, step.nodeId]);
      } else if (step.type === 'visit' || step.type === 'process') {
        setVisited(prev => prev.includes(step.nodeId) ? prev : [...prev, step.nodeId]);
      }

      if (stepMode) {
        await waitForNextClick();
      } else {
        await new Promise(resolve => setTimeout(resolve, animationSpeed));
      }
    }
    
    if (postApply) postApply();
    setIsAnimating(false);
  };

  const resetHighlights = () => {
    setActivePath([]);
    setActiveNodeId(null);
    setVisited([]);
    setTraversalOrder([]);
  };

  const insertNode = async () => {
    if (!value.trim()) return;
    const numValue = parseInt(value);
    if (isNaN(numValue)) return;

    resetHighlights();
    const { rootAfter, steps } = insertBST(root, numValue);
    
    await runWithSteps(steps, () => {
      setRoot(rootAfter);
      addToLog('INSERT', `Inserted ${numValue} into BST`);
    });
    
    setValue('');
  };

  const searchNode = async () => {
    if (!value.trim() || !root) return;
    const numValue = parseInt(value);
    if (isNaN(numValue)) return;

    resetHighlights();
    const { found, steps } = searchBST(root, numValue);
    
    await runWithSteps(steps, () => {
      addToLog('SEARCH', found ? `Found ${numValue}` : `${numValue} not found`);
    });
  };

  const traverseTree = async (type) => {
    if (!root) return;
    
    resetHighlights();
    setTraversalType(type);
    
    const sequence = [];
    const orderValues = [];
    
    const pushVisit = (node) => {
      if (!node) return;
      sequence.push({ type: 'visit', nodeId: node.id, value: node.value });
      orderValues.push(node.value);
    };

    const inorder = (node) => {
      if (!node) return;
      sequence.push({ type: 'focus', nodeId: node.id, value: node.value });
      inorder(node.left);
      pushVisit(node);
      inorder(node.right);
    };

    const preorder = (node) => {
      if (!node) return;
      sequence.push({ type: 'focus', nodeId: node.id, value: node.value });
      pushVisit(node);
      preorder(node.left);
      preorder(node.right);
    };

    const postorder = (node) => {
      if (!node) return;
      sequence.push({ type: 'focus', nodeId: node.id, value: node.value });
      postorder(node.left);
      postorder(node.right);
      pushVisit(node);
    };

    const levelOrder = (node) => {
      const queue = [node];
      while (queue.length) {
        const current = queue.shift();
        sequence.push({ type: 'focus', nodeId: current.id, value: current.value });
        pushVisit(current);
        if (current.left) queue.push(current.left);
        if (current.right) queue.push(current.right);
      }
    };

    if (type === 'inorder') inorder(root);
    else if (type === 'preorder') preorder(root);
    else if (type === 'postorder') postorder(root);
    else if (type === 'levelorder') levelOrder(root);

    setTraversalOrder(orderValues);
    await runWithSteps(sequence, () => {
      addToLog(type.toUpperCase(), `Traversal: [${orderValues.join(', ')}]`);
    });
  };

  const insertBulkNodes = () => {
    if (!bulkValues.trim()) return;
    
    const values = bulkValues.split(/[,\s]+/).map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    let currentRoot = root;
    
    values.forEach(val => {
      const { rootAfter } = insertBST(currentRoot, val);
      currentRoot = rootAfter;
    });
    
    setRoot(currentRoot);
    addToLog('BULK_INSERT', `Inserted ${values.length} nodes: [${values.join(', ')}]`);
    setBulkValues('');
  };

  const clearTree = () => {
    setRoot(null);
    resetHighlights();
    addToLog('CLEAR', 'Cleared entire tree');
  };

  const layoutTree = (root) => {
    if (!root) return { nodes: [], links: [], viewBox: [0, 0, 100, 100] };

    const nodes = [];
    const links = [];
    let minX = 0, maxX = 0, minY = 0, maxY = 0;

    const calculatePositions = (node, x, y, level, spacing) => {
      if (!node) return;

      nodes.push({ id: node.id, value: node.value, x, y });
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);

      const childSpacing = spacing / 2;
      const childY = y + 80;

      if (node.left) {
        const leftX = x - childSpacing;
        links.push({ source: { id: node.id, x, y }, target: { id: node.left.id, x: leftX, y: childY } });
        calculatePositions(node.left, leftX, childY, level + 1, childSpacing);
      }

      if (node.right) {
        const rightX = x + childSpacing;
        links.push({ source: { id: node.id, x, y }, target: { id: node.right.id, x: rightX, y: childY } });
        calculatePositions(node.right, rightX, childY, level + 1, childSpacing);
      }
    };

    calculatePositions(root, 0, 0, 0, 200);

    const padding = 50;
    const viewBox = [minX - padding, minY - padding, maxX - minX + 2 * padding, maxY - minY + 2 * padding];

    return { nodes, links, viewBox };
  };

  const layout = layoutTree(root);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && !event.shiftKey) insertNode();
      if ((event.key === 'n' || event.key === 'N') && stepMode) handleNext();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stepMode, value, root]);

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
            background: 'linear-gradient(135deg, #ff9ff3, #f368e0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 12px',
            textAlign: 'center'
          }}>
            Tree Visualizer
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#1e293b',
            textAlign: 'center',
            margin: '0'
          }}>
            Interactive BST with step-by-step animations and real-time C++ execution
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
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
            {/* Tree Visualization */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '16px',
              padding: '30px',
              marginBottom: '30px',
              minHeight: '400px',
              position: 'relative',
              border: '1px solid rgba(148, 163, 184, 0.2)'
            }}>
              {root ? (
                <svg
                  style={{ width: '100%', height: '400px' }}
                  viewBox={layout.viewBox.join(' ')}
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Edges */}
                  {layout.links.map((link, index) => (
                    <line
                      key={index}
                      x1={link.source.x}
                      y1={link.source.y}
                      x2={link.target.x}
                      y2={link.target.y}
                      stroke="#64748b"
                      strokeWidth="2"
                    />
                  ))}
                  
                  {/* Nodes */}
                  {layout.nodes.map((node) => {
                    const isActive = node.id === activeNodeId;
                    const inPath = activePath.includes(node.id);
                    const isVisited = visited.includes(node.id);
                    
                    return (
                      <g key={node.id} transform={`translate(${node.x},${node.y})`}>
                        <circle
                          r="25"
                          fill={isActive ? '#10b981' : inPath ? '#3b82f6' : isVisited ? '#8b5cf6' : '#1e293b'}
                          stroke={isActive ? '#34d399' : inPath ? '#60a5fa' : isVisited ? '#a78bfa' : '#475569'}
                          strokeWidth="3"
                          style={{
                            filter: isActive ? 'drop-shadow(0 0 10px #10b981)' : 'none',
                            transition: 'all 0.3s ease'
                          }}
                        />
                        <text
                          textAnchor="middle"
                          dy="6"
                          fill="white"
                          fontSize="14"
                          fontWeight="600"
                        >
                          {node.value}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: '#64748b',
                  fontSize: '18px',
                  fontStyle: 'italic'
                }}>
                  Tree is empty - insert nodes to begin
                </div>
              )}
            </div>

            {/* Controls */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '20px'
            }}>
              {/* Insert Operations */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(148, 163, 184, 0.2)'
              }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px', color: '#1e293b' }}>
                  Insert Operations
                </h3>
                
                <div style={{ marginBottom: '15px' }}>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Enter value"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      background: '#fff',
                      color: '#1e293b',
                      fontSize: '14px',
                      marginBottom: '10px',
                      outline: 'none'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={insertNode}
                      disabled={isAnimating}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: isAnimating ? 'not-allowed' : 'pointer',
                        opacity: isAnimating ? 0.6 : 1
                      }}
                    >
                      Insert
                    </button>
                    <button
                      onClick={searchNode}
                      disabled={isAnimating || !root}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        color: 'white',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: (isAnimating || !root) ? 'not-allowed' : 'pointer',
                        opacity: (isAnimating || !root) ? 0.6 : 1
                      }}
                    >
                      Search
                    </button>
                  </div>
                </div>

                <textarea
                  value={bulkValues}
                  onChange={(e) => setBulkValues(e.target.value)}
                  placeholder="Bulk insert: 50,30,70,20,40"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb',
                    background: '#fff',
                    color: '#1e293b',
                    fontSize: '12px',
                    resize: 'none',
                    rows: 2,
                    marginBottom: '10px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={insertBulkNodes}
                  disabled={isAnimating}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    color: 'white',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: isAnimating ? 'not-allowed' : 'pointer',
                    opacity: isAnimating ? 0.6 : 1
                  }}
                >
                  Bulk Insert
                </button>
              </div>

              {/* Traversal Operations */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(148, 163, 184, 0.2)'
              }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px', color: '#1e293b' }}>
                  Tree Traversals
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '15px' }}>
                  {[
                    { key: 'inorder', label: 'Inorder', color: '#3b82f6' },
                    { key: 'preorder', label: 'Preorder', color: '#8b5cf6' },
                    { key: 'postorder', label: 'Postorder', color: '#f59e0b' },
                    { key: 'levelorder', label: 'Level Order', color: '#06b6d4' }
                  ].map(({ key, label, color }) => (
                    <button
                      key={key}
                      onClick={() => traverseTree(key)}
                      disabled={isAnimating || !root}
                      style={{
                        background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: (isAnimating || !root) ? 'not-allowed' : 'pointer',
                        opacity: (isAnimating || !root) ? 0.6 : 1
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569' }}>
                    <input
                      type="checkbox"
                      checked={stepMode}
                      onChange={(e) => setStepMode(e.target.checked)}
                    />
                    Step-by-step mode
                  </label>
                </div>

                {!stepMode && (
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#475569', marginBottom: '5px' }}>
                      Animation Speed: {animationSpeed}ms
                    </label>
                    <input
                      type="range"
                      min="200"
                      max="1500"
                      step="100"
                      value={animationSpeed}
                      onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                )}

                {stepMode && (
                  <button
                    onClick={handleNext}
                    disabled={!isAnimating}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: 'white',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: !isAnimating ? 'not-allowed' : 'pointer',
                      opacity: !isAnimating ? 0.6 : 1,
                      marginBottom: '10px'
                    }}
                  >
                    Next Step (N)
                  </button>
                )}

                <button
                  onClick={clearTree}
                  disabled={isAnimating}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #64748b, #475569)',
                    color: 'white',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: isAnimating ? 'not-allowed' : 'pointer',
                    opacity: isAnimating ? 0.6 : 1
                  }}
                >
                  Clear Tree
                </button>
              </div>
            </div>

            {/* Traversal Results */}
            {traversalOrder.length > 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(148, 163, 184, 0.2)'
              }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px', color: '#1e293b' }}>
                  {traversalType.charAt(0).toUpperCase() + traversalType.slice(1)} Traversal Result
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {traversalOrder.map((value, index) => (
                    <React.Fragment key={index}>
                      <span style={{
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        {value}
                      </span>
                      {index < traversalOrder.length - 1 && (
                        <span style={{ color: '#64748b', alignSelf: 'center' }}>→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Legend */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '16px',
              padding: '20px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px', color: '#1e293b' }}>
                Legend
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { color: '#10b981', label: 'Current Node' },
                  { color: '#3b82f6', label: 'Active Path' },
                  { color: '#8b5cf6', label: 'Visited Node' },
                  { color: '#1e293b', label: 'Regular Node' }
                ].map(({ color, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: color,
                      border: '2px solid rgba(255,255,255,0.3)'
                    }} />
                    <span style={{ fontSize: '12px', color: '#475569' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Operation Log */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '16px',
              padding: '20px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              maxHeight: '500px',
              overflow: 'hidden'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px', color: '#1e293b' }}>
                Operation Log
              </h3>
              <div style={{ maxHeight: '300px', overflowY: 'auto', overflowX: 'hidden' }}>
                {operationLog.length > 0 ? operationLog.map((log) => (
                  <div key={log.id} style={{
                    padding: '10px',
                    marginBottom: '8px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    wordBreak: 'break-word'
                  }}>
                    <div style={{ 
                      fontWeight: '600', 
                      color: log.operation === 'INSERT' ? '#10b981' :
                             log.operation === 'SEARCH' ? '#3b82f6' :
                             log.operation.includes('ORDER') ? '#8b5cf6' :
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

export default TreeVisualize;
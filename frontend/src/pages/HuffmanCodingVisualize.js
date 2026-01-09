import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const HuffmanCodingVisualize = () => {
  const [inputText, setInputText] = useState('ABRACADABRA');
  const [frequencies, setFrequencies] = useState({});
  const [huffmanCodes, setHuffmanCodes] = useState({});
  const [tree, setTree] = useState(null);
  const [encodedText, setEncodedText] = useState('');
  const [compressionRatio, setCompressionRatio] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [log, setLog] = useState([]);
  const [currentNodes, setCurrentNodes] = useState([]);

  useEffect(() => {
    reset();
  }, []);

  const reset = () => {
    const freq = {};
    for (const char of inputText) {
      freq[char] = (freq[char] || 0) + 1;
    }
    setFrequencies(freq);
    setHuffmanCodes({});
    setTree(null);
    setEncodedText('');
    setCompressionRatio(0);
    setIsRunning(false);
    setIsPaused(false);
    setCurrentNodes([]);
    setLog(['Algorithm initialized', `Input: ${inputText}`, `Unique characters: ${Object.keys(freq).length}`]);
  };

  const buildHuffmanTree = async () => {
    setIsRunning(true);
    setIsPaused(false);
    
    const newLog = [...log];
    const nodes = Object.entries(frequencies).map(([char, freq]) => ({
      char,
      freq,
      left: null,
      right: null
    }));

    nodes.sort((a, b) => a.freq - b.freq);
    setCurrentNodes([...nodes]);
    newLog.push('Created leaf nodes for each character');
    setLog([...newLog]);
    await new Promise(resolve => setTimeout(resolve, speed));

    while (nodes.length > 1) {
      while (isPaused) await new Promise(resolve => setTimeout(resolve, 100));

      nodes.sort((a, b) => a.freq - b.freq);
      const left = nodes.shift();
      const right = nodes.shift();

      newLog.push(`Merging: ${left.char || 'node'}(${left.freq}) + ${right.char || 'node'}(${right.freq})`);
      setLog([...newLog]);

      const parent = {
        char: null,
        freq: left.freq + right.freq,
        left,
        right
      };

      nodes.push(parent);
      setCurrentNodes([...nodes]);
      await new Promise(resolve => setTimeout(resolve, speed));
    }

    const root = nodes[0];
    setTree(root);
    newLog.push('Huffman tree constructed');
    setLog([...newLog]);

    // Generate codes
    const codes = {};
    const generateCodes = (node, code = '') => {
      if (node.char) {
        codes[node.char] = code || '0';
        return;
      }
      if (node.left) generateCodes(node.left, code + '0');
      if (node.right) generateCodes(node.right, code + '1');
    };
    generateCodes(root);
    setHuffmanCodes(codes);

    // Encode text
    const encoded = inputText.split('').map(c => codes[c]).join('');
    setEncodedText(encoded);

    const originalBits = inputText.length * 8;
    const compressedBits = encoded.length;
    const ratio = ((1 - compressedBits / originalBits) * 100).toFixed(2);
    setCompressionRatio(ratio);

    newLog.push('Generated Huffman codes');
    newLog.push(`Compression: ${originalBits} bits → ${compressedBits} bits (${ratio}% saved)`);
    setLog([...newLog]);
    setIsRunning(false);
  };

  const togglePause = () => setIsPaused(!isPaused);

  const renderTree = (node, x = 800, y = 120, offset = 280, nodeId = 'root') => {
    if (!node) return null;
    
    return (
      <g key={nodeId}>
        {node.left && (
          <>
            <line x1={x} y1={y} x2={x - offset} y2={y + 140} stroke="#6B7280" strokeWidth="2" />
            <text x={x - offset / 2 - 10} y={y + 75} style={{ fontSize: '14px', fontWeight: 'bold', fill: '#2563eb' }}>0</text>
            {renderTree(node.left, x - offset, y + 140, offset * 0.45, `${nodeId}-left`)}
          </>
        )}
        {node.right && (
          <>
            <line x1={x} y1={y} x2={x + offset} y2={y + 140} stroke="#6B7280" strokeWidth="2" />
            <text x={x + offset / 2 + 5} y={y + 75} style={{ fontSize: '14px', fontWeight: 'bold', fill: '#dc2626' }}>1</text>
            {renderTree(node.right, x + offset, y + 140, offset * 0.45, `${nodeId}-right`)}
          </>
        )}
        <circle cx={x} cy={y} r="35" fill={node.char ? '#10B981' : '#3B82F6'} stroke="#1F2937" strokeWidth="2" />
        {node.char ? (
          <text x={x} y={y + 5} textAnchor="middle" style={{ fontSize: '18px', fontWeight: 'bold', fill: 'white' }}>
            {node.char}
          </text>
        ) : (
          <text x={x} y={y + 5} textAnchor="middle" style={{ fontSize: '16px', fontWeight: 'bold', fill: 'white' }}>
            {node.freq}
          </text>
        )}
        <text x={x} y={y - 45} textAnchor="middle" style={{ fontSize: '14px', fontWeight: '600', fill: '#1f2937' }}>
          Freq: {node.freq}
        </text>
      </g>
    );
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc, #f1f5f9, #e2e8f0)',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <a href="/greedyalgorithms" style={{
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
        ← Back to Greedy Algorithms
      </a>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px'
          }}>
            Huffman Coding Visualizer
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#1e293b' }}>Data Compression using Binary Trees</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Left Panel */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            maxWidth: '100%',
            overflow: 'hidden'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937' }}>Huffman Tree Visualization</h2>
            
            <div style={{
              background: '#fff',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              height: '500px',
              marginBottom: '1.5rem',
              border: '2px solid #e5e7eb',
              overflowX: 'auto',
              overflowY: 'auto'
            }}>
              <style>{`
                div::-webkit-scrollbar {
                  width: 6px;
                  height: 6px;
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
              {tree ? (
                <svg width="1600" height="800" style={{ display: 'block' }}>
                  {renderTree(tree)}
                </svg>
              ) : (
                <div style={{ color: '#9ca3af', fontSize: '1.1rem', fontStyle: 'italic' }}>
                  Build tree to visualize
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Input Text:
              </label>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value.toUpperCase())}
                disabled={isRunning}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  color: '#000',
                  fontWeight: '600'
                }}
                placeholder="Enter text to compress"
              />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
              <button
                onClick={reset}
                disabled={isRunning}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: isRunning ? 'not-allowed' : 'pointer',
                  opacity: isRunning ? 0.5 : 1
                }}
              >
                Calculate Frequencies
              </button>
              <button
                onClick={buildHuffmanTree}
                disabled={isRunning || Object.keys(frequencies).length === 0}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: (isRunning || Object.keys(frequencies).length === 0) ? 'not-allowed' : 'pointer',
                  opacity: (isRunning || Object.keys(frequencies).length === 0) ? 0.5 : 1
                }}
              >
                {isRunning ? 'Building...' : 'Build Huffman Tree'}
              </button>
              {isRunning && (
                <button
                  onClick={togglePause}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {isPaused ? '▶ Resume' : '⏸ Pause'}
                </button>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '600' }}>Speed:</label>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  style={{ width: '100px' }}
                />
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{speed}ms</span>
              </div>
            </div>

            {encodedText && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                borderRadius: '0.75rem',
                border: '2px solid #3b82f6'
              }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#1e40af' }}>Compression Result</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Original</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>{inputText.length * 8} bits</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Compressed</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>{encodedText.length} bits</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Saved</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>{compressionRatio}%</p>
                  </div>
                </div>
                <div style={{ padding: '0.75rem', background: 'white', borderRadius: '0.5rem', overflow: 'hidden' }}>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Encoded Text:</p>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all', color: '#1f2937', overflowWrap: 'break-word' }}>{encodedText}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Character Frequencies */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Character Frequencies</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {Object.entries(frequencies).map(([char, freq]) => (
                  <div key={char} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: '#f9fafb',
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>{char}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, marginLeft: '1rem' }}>
                      <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${(freq / inputText.length) * 100}%`,
                          background: 'linear-gradient(90deg, #10b981, #059669)',
                          height: '100%',
                          borderRadius: '9999px'
                        }} />
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', minWidth: '30px', textAlign: 'right' }}>{freq}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Huffman Codes */}
            {Object.keys(huffmanCodes).length > 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Huffman Codes</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {Object.entries(huffmanCodes).map(([char, code]) => (
                    <div key={char} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.75rem',
                      background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                      borderRadius: '0.5rem',
                      border: '1px solid #10b981'
                    }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#065f46' }}>{char}</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: '600', color: '#047857' }}>{code}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Algorithm Log */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Algorithm Log</h3>
              <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                {log.map((entry, idx) => (
                  <div key={idx} style={{
                    padding: '0.5rem 0.75rem',
                    background: '#f3f4f6',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    color: '#374151',
                    borderLeft: '3px solid #3b82f6'
                  }}>
                    {entry}
                  </div>
                ))}
              </div>
            </div>

            {/* Algorithm Info */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Algorithm Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Time Complexity:</span>
                  <span style={{ fontWeight: '600', color: '#3b82f6' }}>O(n log n)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Space Complexity:</span>
                  <span style={{ fontWeight: '600', color: '#3b82f6' }}>O(n)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Approach:</span>
                  <span style={{ fontWeight: '600', color: '#10b981' }}>Greedy + Priority Queue</span>
                </div>
                <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280', fontWeight: '600' }}>Use Case:</span>
                  <p style={{ color: '#374151', marginTop: '0.25rem' }}>Data compression, file encoding, network transmission</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HuffmanCodingVisualize;
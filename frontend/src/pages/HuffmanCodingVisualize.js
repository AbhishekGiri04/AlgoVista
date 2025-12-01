import React, { useState, useEffect } from 'react';

const HuffmanCodingVisualize = () => {
  const [text, setText] = useState('ABCDEF');
  const [frequencies, setFrequencies] = useState({});
  const [steps, setSteps] = useState([]);
  const [codes, setCodes] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [originalBits, setOriginalBits] = useState(0);
  const [compressedBits, setCompressedBits] = useState(0);
  const [compressionRatio, setCompressionRatio] = useState(0);
  const [speed, setSpeed] = useState(1200);

  const runVisualization = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/huffman', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      
      if (data.steps) {
        setFrequencies(data.frequencies);
        setSteps(data.steps);
        setCodes(data.codes);
        setOriginalBits(data.originalBits);
        setCompressedBits(data.compressedBits);
        setCompressionRatio(data.compressionRatio);
        setCurrentStep(0);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const playVisualization = () => {
    setIsPlaying(true);
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, speed);
  };

  const renderFrequencyTable = () => (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ color: '#3b82f6', marginBottom: '15px' }}>📊 Character Frequencies</h3>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {Object.entries(frequencies).map(([char, freq]) => (
          <div
            key={char}
            style={{
              padding: '10px 15px',
              borderRadius: '8px',
              backgroundColor: '#22c55e',
              color: 'white',
              fontWeight: '600',
              textAlign: 'center',
              minWidth: '60px'
            }}
          >
            <div style={{ fontSize: '18px' }}>{char}</div>
            <div style={{ fontSize: '12px' }}>freq: {freq}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHuffmanCodes = () => {
    if (!Object.keys(codes).length) return null;
    
    return (
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#7c3aed', marginBottom: '15px' }}>🔤 Huffman Codes</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
          {Object.entries(codes)
            .sort((a, b) => a[1].length - b[1].length)
            .map(([char, code]) => (
            <div
              key={char}
              style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#7c3aed',
                color: 'white',
                fontWeight: '600',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '18px' }}>{char}</div>
              <div style={{ fontSize: '14px', fontFamily: 'monospace' }}>{code}</div>
              <div style={{ fontSize: '10px', color: '#c4b5fd' }}>{code.length} bits</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderVisualization = () => {
    if (!steps.length) return null;
    
    const step = steps[currentStep];
    
    return (
      <div style={{ margin: '30px 0', fontFamily: 'monospace', fontSize: '16px' }}>
        {/* Current Step Info */}
        <div style={{ 
          marginBottom: '20px', 
          padding: '20px', 
          backgroundColor: '#22c55e15',
          borderRadius: '12px',
          border: '2px solid #22c55e'
        }}>
          <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>
            Step {step.stepNum}: Building Huffman Tree
          </div>
          
          <div style={{ fontSize: '16px', color: '#e2e8f0', marginBottom: '8px' }}>
            Merging: {step.leftChar}({step.leftFreq}) + {step.rightChar}({step.rightFreq}) = *({step.mergedFreq})
          </div>
          
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>
            {step.action}
          </div>
        </div>

        {/* Tree Building Visualization */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#f59e0b', marginBottom: '10px' }}>🌳 Tree Construction</h4>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Left Node */}
            <div style={{
              padding: '15px',
              borderRadius: '12px',
              backgroundColor: '#ef4444',
              color: 'white',
              fontWeight: '600',
              textAlign: 'center',
              minWidth: '80px'
            }}>
              <div style={{ fontSize: '16px' }}>{step.leftChar}</div>
              <div style={{ fontSize: '12px' }}>freq: {step.leftFreq}</div>
            </div>
            
            <span style={{ fontSize: '24px', color: '#94a3b8' }}>+</span>
            
            {/* Right Node */}
            <div style={{
              padding: '15px',
              borderRadius: '12px',
              backgroundColor: '#3b82f6',
              color: 'white',
              fontWeight: '600',
              textAlign: 'center',
              minWidth: '80px'
            }}>
              <div style={{ fontSize: '16px' }}>{step.rightChar}</div>
              <div style={{ fontSize: '12px' }}>freq: {step.rightFreq}</div>
            </div>
            
            <span style={{ fontSize: '24px', color: '#94a3b8' }}>=</span>
            
            {/* Merged Node */}
            <div style={{
              padding: '15px',
              borderRadius: '12px',
              backgroundColor: '#22c55e',
              color: 'white',
              fontWeight: '600',
              textAlign: 'center',
              minWidth: '80px',
              border: '3px solid #16a34a'
            }}>
              <div style={{ fontSize: '16px' }}>*</div>
              <div style={{ fontSize: '12px' }}>freq: {step.mergedFreq}</div>
            </div>
          </div>
        </div>

        {/* Algorithm Explanation */}
        <div style={{ 
          marginTop: '15px', 
          padding: '15px', 
          backgroundColor: '#1e293b',
          borderRadius: '8px',
          border: '1px solid #374151'
        }}>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '5px' }}>
            🧮 Greedy Strategy: Always merge two nodes with lowest frequencies
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Left child → 0, Right child → 1. Leaf nodes contain characters and their codes.
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      backgroundColor: '#0a0e1a',
      color: 'white',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <a href="/greedyalgorithms" style={{
        background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '12px',
        textDecoration: 'none',
        fontWeight: '600'
      }}>
        ← Back to Greedy Algorithms
      </a>

      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>
          🗜️ Huffman Coding Visualizer
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>
          Optimal prefix-free binary encoding using greedy tree construction
        </p>
        <div style={{ fontSize: '14px', color: '#64748b', marginTop: '10px' }}>
          <span style={{ backgroundColor: '#ef4444', padding: '2px 8px', borderRadius: '4px', marginRight: '10px' }}>🔴 Left Node</span>
          <span style={{ backgroundColor: '#3b82f6', padding: '2px 8px', borderRadius: '4px', marginRight: '10px' }}>🔵 Right Node</span>
          <span style={{ backgroundColor: '#22c55e', padding: '2px 8px', borderRadius: '4px' }}>🟢 Merged</span>
        </div>
      </div>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '30px'
      }}>
        {/* Input Control */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Input Text:</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value.toUpperCase())}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #374151',
              backgroundColor: '#1e293b',
              color: 'white',
              fontSize: '16px'
            }}
            placeholder="Enter text to encode..."
          />
        </div>

        {/* Speed Control */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Speed (ms):</label>
          <input
            type="range"
            min="500"
            max="3000"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            style={{ width: '200px' }}
          />
          <span style={{ marginLeft: '10px', fontSize: '14px', color: '#94a3b8' }}>{speed}ms</span>
        </div>

        {/* Control Buttons */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <button
            onClick={runVisualization}
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Encoding...' : 'Generate Huffman Codes'}
          </button>
          
          <button
            onClick={playVisualization}
            disabled={!steps.length || isPlaying}
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {isPlaying ? 'Playing...' : 'Play'}
          </button>
          
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={!steps.length || currentStep === 0}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Previous
          </button>
          
          <button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={!steps.length || currentStep >= steps.length - 1}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Next
          </button>
        </div>

        {/* Compression Stats */}
        {originalBits > 0 && (
          <div style={{ 
            marginBottom: '30px', 
            padding: '20px', 
            backgroundColor: '#22c55e15',
            borderRadius: '12px',
            border: '2px solid #22c55e'
          }}>
            <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: '#22c55e' }}>
              🗜️ Compression Results
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '16px', marginBottom: '5px' }}>Original Size</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>{originalBits} bits</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>8 bits per character</div>
              </div>
              <div>
                <div style={{ fontSize: '16px', marginBottom: '5px' }}>Compressed Size</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#22c55e' }}>{compressedBits} bits</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Variable length codes</div>
              </div>
              <div>
                <div style={{ fontSize: '16px', marginBottom: '5px' }}>Compression Ratio</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}>{(compressionRatio * 100).toFixed(1)}%</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Space saved: {((1 - compressionRatio) * 100).toFixed(1)}%</div>
              </div>
            </div>
          </div>
        )}

        {/* Frequency Table */}
        {Object.keys(frequencies).length > 0 && renderFrequencyTable()}

        {/* Huffman Codes */}
        {renderHuffmanCodes()}

        {/* Progress */}
        {steps.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>Building Huffman tree...</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#374151',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
                height: '100%',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}

        {/* Visualization Area */}
        <div style={{
          background: '#1e293b',
          borderRadius: '12px',
          padding: '30px',
          minHeight: '400px'
        }}>
          {steps.length > 0 ? renderVisualization() : (
            <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '18px' }}>
              Enter text and click "Generate Huffman Codes" to start visualization
            </div>
          )}
        </div>

        {/* Preset Examples */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(34, 197, 94, 0.1)',
          borderRadius: '12px',
          border: '2px solid #22c55e'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#22c55e' }}>Try These Examples:</h3>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setText('AAAAABBBCCDDEEF')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '2px solid #22c55e',
                backgroundColor: 'transparent',
                color: '#22c55e',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Varied Frequencies
            </button>
            <button
              onClick={() => setText('HELLO WORLD')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '2px solid #3b82f6',
                backgroundColor: 'transparent',
                color: '#3b82f6',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Common Text
            </button>
            <button
              onClick={() => setText('ABCDEFGHIJKLMNOP')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '2px solid #f59e0b',
                backgroundColor: 'transparent',
                color: '#f59e0b',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Equal Frequencies
            </button>
          </div>
        </div>

        {/* Algorithm Info */}
        <div style={{
          marginTop: '20px',
          padding: '20px',
          background: 'rgba(124, 58, 237, 0.1)',
          borderRadius: '12px',
          border: '2px solid #7c3aed'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#7c3aed' }}>Huffman Coding Algorithm:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4 style={{ color: '#a78bfa', marginBottom: '10px' }}>Greedy Approach:</h4>
              <ul style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '14px' }}>
                <li>🏗️ Build min-heap of character frequencies</li>
                <li>🔄 Repeatedly merge two lowest frequency nodes</li>
                <li>🌳 Create binary tree (left=0, right=1)</li>
                <li>📝 Assign codes by tree traversal</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#a78bfa', marginBottom: '10px' }}>Properties:</h4>
              <ul style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '14px' }}>
                <li><strong>Time:</strong> O(n log n)</li>
                <li><strong>Optimal:</strong> Minimum average code length</li>
                <li><strong>Prefix-free:</strong> No code is prefix of another</li>
                <li><strong>Applications:</strong> ZIP, JPEG, MP3 compression</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HuffmanCodingVisualize;
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

  const renderTree = (node, x = 250, y = 50, offset = 80) => {
    if (!node) return null;
    
    return (
      <g key={`${x}-${y}`}>
        {node.left && (
          <>
            <line x1={x} y1={y} x2={x - offset} y2={y + 60} stroke="#6B7280" strokeWidth="2" />
            <text x={x - offset / 2 - 10} y={y + 35} className="text-xs fill-blue-600 font-bold">0</text>
            {renderTree(node.left, x - offset, y + 60, offset / 2)}
          </>
        )}
        {node.right && (
          <>
            <line x1={x} y1={y} x2={x + offset} y2={y + 60} stroke="#6B7280" strokeWidth="2" />
            <text x={x + offset / 2 + 5} y={y + 35} className="text-xs fill-red-600 font-bold">1</text>
            {renderTree(node.right, x + offset, y + 60, offset / 2)}
          </>
        )}
        <circle cx={x} cy={y} r="20" fill={node.char ? '#10B981' : '#3B82F6'} stroke="#1F2937" strokeWidth="2" />
        <text x={x} y={y - 5} textAnchor="middle" className="text-xs font-bold fill-white">
          {node.char || 'N'}
        </text>
        <text x={x} y={y + 8} textAnchor="middle" className="text-xs fill-white">
          {node.freq}
        </text>
      </g>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">Huffman Coding</h1>
          <p className="text-green-600">Data compression using binary trees</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Huffman Tree</h2>
            
            <div className="relative bg-gray-50 rounded-lg p-4 h-96 overflow-auto">
              {tree ? (
                <svg width="500" height="350">
                  {renderTree(tree)}
                </svg>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Build tree to visualize
                </div>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Input Text:</label>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value.toUpperCase())}
                disabled={isRunning}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter text"
              />
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={reset} disabled={isRunning} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50">
                Calculate Frequencies
              </button>
              <button onClick={buildHuffmanTree} disabled={isRunning || Object.keys(frequencies).length === 0} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50">
                {isRunning ? 'Building...' : 'Build Huffman Tree'}
              </button>
              {isRunning && <button onClick={togglePause} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">{isPaused ? 'Resume' : 'Pause'}</button>}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Speed:</label>
                <input type="range" min="200" max="2000" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-20" />
              </div>
              <a href="/greedyalgorithms" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">← Back</a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Character Frequencies</h3>
              <div className="space-y-2">
                {Object.entries(frequencies).map(([char, freq]) => (
                  <div key={char} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-bold text-lg">{char}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(freq / inputText.length) * 100}%` }} />
                      </div>
                      <span className="text-sm text-gray-600">{freq}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {Object.keys(huffmanCodes).length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Huffman Codes</h3>
                <div className="space-y-2">
                  {Object.entries(huffmanCodes).map(([char, code]) => (
                    <div key={char} className="flex justify-between p-2 bg-green-50 rounded">
                      <span className="font-bold">{char}</span>
                      <span className="font-mono text-green-700">{code}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {encodedText && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Compression Result</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Original: {inputText.length * 8} bits</p>
                    <p className="text-sm text-gray-600">Compressed: {encodedText.length} bits</p>
                    <p className="text-lg font-bold text-green-600">Saved: {compressionRatio}%</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500 mb-1">Encoded:</p>
                    <p className="font-mono text-xs break-all">{encodedText}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Algorithm Log</h3>
              <div className="space-y-1 max-h-48 overflow-y-auto text-sm">
                {log.map((entry, idx) => (
                  <div key={idx} className="p-2 rounded text-gray-700">{entry}</div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Algorithm Info</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Time Complexity:</strong> O(n log n)</p>
                <p><strong>Space Complexity:</strong> O(n)</p>
                <p><strong>Approach:</strong> Greedy with Priority Queue</p>
                <p><strong>Use Case:</strong> Data compression, encoding</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HuffmanCodingVisualize;
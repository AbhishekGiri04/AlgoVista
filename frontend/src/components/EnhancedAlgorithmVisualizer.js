import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, BarChart3 } from 'lucide-react';
import { generateRandomArray, validateArray } from '../utils/sortingHelpers';
import { bubbleSortWithVisualization } from '../algorithms/bubbleSort';
import { ALGORITHM_INFO } from '../data/algorithmInfo';

const EnhancedAlgorithmVisualizer = ({ algorithm = 'bubbleSort' }) => {
  const [array, setArray] = useState(() => generateRandomArray(20));
  const [colorArray, setColorArray] = useState(() => new Array(20).fill('#3b82f6'));
  const [isRunning, setIsRunning] = useState(false);
  const [arraySize, setArraySize] = useState(20);
  const [delay, setDelay] = useState(100);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0, time: 0 });
  const [customInput, setCustomInput] = useState('');
  
  const stopRef = useRef(false);
  const algorithmInfo = ALGORITHM_INFO.sorting[algorithm] || ALGORITHM_INFO.sorting.bubbleSort;

  const updateStats = useCallback((newStats) => {
    setStats(prev => ({ ...prev, ...newStats }));
  }, []);

  const generateNewArray = () => {
    const newArray = generateRandomArray(arraySize);
    setArray(newArray);
    setColorArray(new Array(arraySize).fill('#3b82f6'));
    setStats({ comparisons: 0, swaps: 0, time: 0 });
  };

  const handleCustomArray = () => {
    try {
      const customArray = customInput.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
      if (validateArray(customArray)) {
        setArray(customArray);
        setArraySize(customArray.length);
        setColorArray(new Array(customArray.length).fill('#3b82f6'));
        setStats({ comparisons: 0, swaps: 0, time: 0 });
        setCustomInput('');
      }
    } catch (error) {
      alert('Invalid array format. Use comma-separated numbers.');
    }
  };

  const startVisualization = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    stopRef.current = false;
    setStats({ comparisons: 0, swaps: 0, time: 0 });
    
    const startTime = Date.now();
    
    try {
      await bubbleSortWithVisualization(
        array,
        setArray,
        setColorArray,
        delay,
        stopRef,
        updateStats
      );
      
      if (!stopRef.current) {
        updateStats({ time: Date.now() - startTime });
      }
    } catch (error) {
      console.log('Visualization stopped');
    } finally {
      setIsRunning(false);
    }
  };

  const stopVisualization = () => {
    stopRef.current = true;
    setIsRunning(false);
  };

  const maxHeight = Math.max(...array);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{algorithmInfo.name} Visualizer</h2>
        <p className="text-gray-600">{algorithmInfo.description}</p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Array Size: {arraySize}
            </label>
            <input
              type="range"
              min="10"
              max="50"
              value={arraySize}
              onChange={(e) => setArraySize(parseInt(e.target.value))}
              disabled={isRunning}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Speed: {delay}ms
            </label>
            <input
              type="range"
              min="50"
              max="500"
              value={delay}
              onChange={(e) => setDelay(parseInt(e.target.value))}
              disabled={isRunning}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Array
            </label>
            <input
              type="text"
              placeholder="e.g., 64,34,25,12,22,11,90"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              disabled={isRunning}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={handleCustomArray}
              disabled={isRunning || !customInput}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <button
            onClick={isRunning ? stopVisualization : startVisualization}
            className={`flex items-center justify-center px-4 py-2 rounded-md text-white font-medium ${
              isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isRunning ? <Pause className="mr-2" size={16} /> : <Play className="mr-2" size={16} />}
            {isRunning ? 'Stop' : 'Start'}
          </button>
          
          <button
            onClick={generateNewArray}
            disabled={isRunning}
            className="flex items-center justify-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
          >
            <RotateCcw className="mr-2" size={16} />
            Generate New
          </button>
        </div>
      </div>

      {/* Visualization */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-end justify-center space-x-1" style={{ height: '300px' }}>
          {array.map((value, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center"
              style={{ width: `${Math.max(800 / array.length, 20)}px` }}
            >
              <motion.div
                className="rounded-t-md flex items-end justify-center text-xs font-bold text-white"
                style={{
                  height: `${(value / maxHeight) * 250}px`,
                  backgroundColor: colorArray[index],
                  minHeight: '20px'
                }}
                animate={{ height: `${(value / maxHeight) * 250}px` }}
                transition={{ duration: 0.3 }}
              >
                {array.length <= 25 && (
                  <span className="mb-1">{value}</span>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <BarChart3 className="text-blue-500 mr-2" size={20} />
            <div>
              <p className="text-sm text-gray-600">Comparisons</p>
              <p className="text-xl font-bold text-blue-600">{stats.comparisons}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center">
            <BarChart3 className="text-orange-500 mr-2" size={20} />
            <div>
              <p className="text-sm text-gray-600">Swaps</p>
              <p className="text-xl font-bold text-orange-600">{stats.swaps}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <BarChart3 className="text-green-500 mr-2" size={20} />
            <div>
              <p className="text-sm text-gray-600">Time</p>
              <p className="text-xl font-bold text-green-600">{stats.time}ms</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <BarChart3 className="text-purple-500 mr-2" size={20} />
            <div>
              <p className="text-sm text-gray-600">Array Size</p>
              <p className="text-xl font-bold text-purple-600">{array.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Algorithm Complexity</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Time Complexity:</span>
            <p className="text-gray-600">{algorithmInfo.timeComplexity}</p>
          </div>
          <div>
            <span className="font-medium">Space Complexity:</span>
            <p className="text-gray-600">{algorithmInfo.spaceComplexity}</p>
          </div>
          <div>
            <span className="font-medium">Best Case:</span>
            <p className="text-gray-600">{algorithmInfo.bestCase}</p>
          </div>
          <div>
            <span className="font-medium">Stable:</span>
            <p className="text-gray-600">{algorithmInfo.stable}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAlgorithmVisualizer;
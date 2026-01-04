import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Code, Info, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import EnhancedAlgorithmVisualizer from '../components/EnhancedAlgorithmVisualizer';
import CodeExplanation from '../components/CodeExplanation';
import ExportControls from '../components/ExportControls';

const EnhancedBubbleSortVisualize = () => {
  const [showCodeExplanation, setShowCodeExplanation] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/sortingalgorithms"
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="mr-2" size={20} />
                Back to Sorting
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Bubble Sort Visualization</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCodeExplanation(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                <Code className="mr-2" size={16} />
                View Code
              </button>
              <ExportControls containerId="bubble-sort-container" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Visualization */}
          <div className="lg:col-span-3">
            <motion.div
              id="bubble-sort-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <EnhancedAlgorithmVisualizer algorithm="bubbleSort" />
            </motion.div>
          </div>

          {/* Information Panel */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Algorithm Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <Info className="text-blue-500 mr-2" size={20} />
                  <h3 className="text-lg font-semibold">How it Works</h3>
                </div>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <strong>Step 1:</strong> Compare adjacent elements in the array
                  </p>
                  <p>
                    <strong>Step 2:</strong> If they are in wrong order, swap them
                  </p>
                  <p>
                    <strong>Step 3:</strong> Continue until no more swaps are needed
                  </p>
                  <p>
                    <strong>Step 4:</strong> The largest element "bubbles up" to the end
                  </p>
                </div>
              </div>

              {/* Color Legend */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Color Legend</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                    <span>Unsorted elements</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                    <span>Comparing elements</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                    <span>Swapping elements</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                    <span>Sorted elements</span>
                  </div>
                </div>
              </div>

              {/* Complexity Analysis */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Complexity Analysis</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Best Case:</span>
                    <span className="text-green-600">O(n)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Average Case:</span>
                    <span className="text-yellow-600">O(n²)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Worst Case:</span>
                    <span className="text-red-600">O(n²)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Space:</span>
                    <span className="text-blue-600">O(1)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Stable:</span>
                    <span className="text-green-600">Yes</span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-purple-800">💡 Tips</h3>
                <ul className="text-sm text-purple-700 space-y-2">
                  <li>• Try different array sizes to see performance impact</li>
                  <li>• Use custom arrays to test specific scenarios</li>
                  <li>• Observe how sorted elements accumulate from right to left</li>
                  <li>• Notice the optimization: inner loop reduces each pass</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Code Explanation Modal */}
      <CodeExplanation
        algorithm="bubbleSort"
        isVisible={showCodeExplanation}
        onClose={() => setShowCodeExplanation(false)}
      />
    </div>
  );
};

export default EnhancedBubbleSortVisualize;
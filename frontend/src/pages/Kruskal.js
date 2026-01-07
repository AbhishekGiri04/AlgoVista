import React from 'react';
import { motion } from 'framer-motion';

const Kruskal = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-orange-800 mb-4">
            Kruskal's Algorithm - Minimum Spanning Tree
          </h1>
          <p className="text-orange-600 mb-8">
            Choose how you'd like to explore Kruskal's Algorithm
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Interactive Visualizer</h2>
            <p className="text-gray-600 mb-6">
              Step-by-step visualization with Union-Find operations, edge sorting, and MST construction
            </p>
            <a
              href="/kruskalsalgorithmvisualize"
              className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
            >
              Start Visualization
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">💻</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Code Implementation</h2>
            <p className="text-gray-600 mb-6">
              Complete C++ implementation with Union-Find data structure and detailed explanations
            </p>
            <a
              href="/kruskalsalgorithmcode"
              className="inline-block px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              View Code
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center"
        >
          <a
            href="/graphalgorithms"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
          >
            ← Back to Graph Algorithms
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Kruskal;
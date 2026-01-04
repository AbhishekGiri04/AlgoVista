import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Search, 
  GitBranch, 
  Layers, 
  Code, 
  TrendingUp, 
  Download,
  Play,
  BookOpen,
  Zap
} from 'lucide-react';

const AlgorithmShowcase = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const algorithmCategories = [
    {
      id: 'sorting',
      name: 'Sorting Algorithms',
      icon: BarChart3,
      color: 'bg-blue-500',
      description: 'Visualize sorting algorithms with step-by-step execution',
      algorithms: [
        { name: 'Enhanced Bubble Sort', path: '/enhanced-bubblesort', complexity: 'O(n²)', features: ['Step-by-step', 'Performance stats', 'Code view'] },
        { name: 'Quick Sort', path: '/quicksortvisualize', complexity: 'O(n log n)', features: ['Pivot selection', 'Partitioning', 'Recursion'] },
        { name: 'Merge Sort', path: '/mergesortvisualize', complexity: 'O(n log n)', features: ['Divide & conquer', 'Stable sort', 'Memory usage'] },
        { name: 'Heap Sort', path: '/heapsortvisualize', complexity: 'O(n log n)', features: ['Heap property', 'In-place', 'Tree structure'] }
      ]
    },
    {
      id: 'searching',
      name: 'Search Algorithms',
      icon: Search,
      color: 'bg-green-500',
      description: 'Interactive search algorithm demonstrations',
      algorithms: [
        { name: 'Binary Search', path: '/binarysearchvisualize', complexity: 'O(log n)', features: ['Divide & conquer', 'Sorted arrays', 'Logarithmic'] },
        { name: 'Linear Search', path: '/linearsearchvisualize', complexity: 'O(n)', features: ['Sequential', 'Simple', 'Any order'] },
        { name: 'Jump Search', path: '/jumpsearchvisualize', complexity: 'O(√n)', features: ['Block jumping', 'Optimal step', 'Sorted arrays'] }
      ]
    },
    {
      id: 'graph',
      name: 'Graph Algorithms',
      icon: GitBranch,
      color: 'bg-purple-500',
      description: 'Graph traversal and shortest path algorithms',
      algorithms: [
        { name: 'Dijkstra\'s Algorithm', path: '/dijkstrasalgorithmvisualize', complexity: 'O(V²)', features: ['Shortest path', 'Weighted graphs', 'Greedy approach'] },
        { name: 'BFS Traversal', path: '/breadthfirstsearchvisualize', complexity: 'O(V+E)', features: ['Level-order', 'Queue-based', 'Shortest path'] },
        { name: 'DFS Traversal', path: '/depthfirstsearchvisualize', complexity: 'O(V+E)', features: ['Stack-based', 'Recursive', 'Path finding'] }
      ]
    },
    {
      id: 'datastructures',
      name: 'Data Structures',
      icon: Layers,
      color: 'bg-orange-500',
      description: 'Interactive data structure operations',
      algorithms: [
        { name: 'Stack Operations', path: '/stackvisualize', complexity: 'O(1)', features: ['LIFO', 'Push/Pop', 'Memory stack'] },
        { name: 'Queue Operations', path: '/queuevisualize', complexity: 'O(1)', features: ['FIFO', 'Enqueue/Dequeue', 'Circular queue'] },
        { name: 'Linked List', path: '/linkedlistvisualize', complexity: 'O(n)', features: ['Dynamic size', 'Insertion/Deletion', 'Memory pointers'] }
      ]
    }
  ];

  const features = [
    {
      icon: Play,
      title: 'Interactive Visualization',
      description: 'Step-by-step algorithm execution with real-time updates'
    },
    {
      icon: Code,
      title: 'Code Implementation',
      description: 'View pseudocode and implementations in multiple languages'
    },
    {
      icon: TrendingUp,
      title: 'Performance Analytics',
      description: 'Track comparisons, swaps, and execution time'
    },
    {
      icon: Download,
      title: 'Export Capabilities',
      description: 'Save visualizations as images and export performance data'
    },
    {
      icon: BookOpen,
      title: 'Algorithm Complexity',
      description: 'Detailed time and space complexity analysis'
    },
    {
      icon: Zap,
      title: 'Responsive Design',
      description: 'Optimized for desktop, tablet, and mobile devices'
    }
  ];

  const filteredCategories = selectedCategory === 'all' 
    ? algorithmCategories 
    : algorithmCategories.filter(cat => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <motion.h1 
              className="text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Algorithm Visualization Platform
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Interactive learning platform with enhanced visualizations, performance analytics, 
              and comprehensive algorithm implementations
            </motion.p>
          </div>
        </div>
      </div>

      {/* Quick Access Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link 
            to="/algorithm-dashboard"
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            <TrendingUp className="mb-4" size={32} />
            <h3 className="text-xl font-semibold mb-2">Performance Dashboard</h3>
            <p className="text-blue-100">Compare algorithm performance and analytics</p>
          </Link>

          <Link 
            to="/enhanced-bubblesort"
            className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
          >
            <Play className="mb-4" size={32} />
            <h3 className="text-xl font-semibold mb-2">Enhanced Visualizer</h3>
            <p className="text-green-100">Try our enhanced bubble sort with full features</p>
          </Link>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <Code className="mb-4" size={32} />
            <h3 className="text-xl font-semibold mb-2">50+ Algorithms</h3>
            <p className="text-purple-100">Comprehensive collection with code examples</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <feature.icon className="text-blue-500 mb-4" size={24} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Categories
            </button>
            {algorithmCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Algorithm Categories */}
        <div className="space-y-12">
          {filteredCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
            >
              <div className="flex items-center mb-6">
                <div className={`p-3 ${category.color} rounded-lg mr-4`}>
                  <category.icon className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.algorithms.map((algorithm, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                    whileHover={{ y: -5 }}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{algorithm.name}</h3>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          {algorithm.complexity}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {algorithm.features.map((feature, featureIndex) => (
                            <span
                              key={featureIndex}
                              className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Link
                        to={algorithm.path}
                        className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      >
                        <Play className="mr-2" size={16} />
                        Visualize
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmShowcase;
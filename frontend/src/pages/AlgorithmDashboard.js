import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, Zap, Award } from 'lucide-react';

const AlgorithmDashboard = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('comparisons');

  useEffect(() => {
    // Simulate performance data
    const data = [
      { name: 'Bubble Sort', comparisons: 190, swaps: 85, time: 245, size: 20 },
      { name: 'Selection Sort', comparisons: 190, swaps: 19, time: 180, size: 20 },
      { name: 'Insertion Sort', comparisons: 95, swaps: 45, time: 120, size: 20 },
      { name: 'Merge Sort', comparisons: 64, swaps: 56, time: 85, size: 20 },
      { name: 'Quick Sort', comparisons: 58, swaps: 32, time: 75, size: 20 }
    ];
    setPerformanceData(data);
  }, []);

  const getMetricColor = (metric) => {
    const colors = {
      comparisons: '#3b82f6',
      swaps: '#f59e0b',
      time: '#10b981'
    };
    return colors[metric] || '#6b7280';
  };

  const getMetricLabel = (metric) => {
    const labels = {
      comparisons: 'Comparisons',
      swaps: 'Swaps',
      time: 'Time (ms)'
    };
    return labels[metric] || metric;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Algorithm Performance Dashboard</h1>
          <p className="text-gray-600">Compare algorithm performance across different metrics</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Algorithms</p>
                <p className="text-2xl font-bold text-gray-900">25+</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Clock className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Execution</p>
                <p className="text-2xl font-bold text-gray-900">141ms</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Zap className="text-yellow-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Best Performer</p>
                <p className="text-2xl font-bold text-gray-900">Quick Sort</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Award className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Most Stable</p>
                <p className="text-2xl font-bold text-gray-900">Merge Sort</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Performance Comparison</h2>
            <div className="flex space-x-2">
              {['comparisons', 'swaps', 'time'].map((metric) => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedMetric === metric
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getMetricLabel(metric)}
                </button>
              ))}
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="space-y-4">
            {performanceData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-32 text-sm font-medium text-gray-700">{item.name}</div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-4 relative">
                    <div
                      className="h-4 rounded-full transition-all duration-500"
                      style={{
                        width: `${(item[selectedMetric] / Math.max(...performanceData.map(d => d[selectedMetric]))) * 100}%`,
                        backgroundColor: getMetricColor(selectedMetric)
                      }}
                    />
                  </div>
                </div>
                <div className="w-16 text-sm font-medium text-gray-900 text-right">
                  {item[selectedMetric]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Algorithm Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sorting Algorithms</h3>
            <div className="space-y-2">
              {['Bubble Sort', 'Quick Sort', 'Merge Sort', 'Heap Sort', 'Insertion Sort'].map((algo) => (
                <div key={algo} className="flex items-center justify-between py-2">
                  <span className="text-gray-700">{algo}</span>
                  <span className="text-sm text-gray-500">O(n²)</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Algorithms</h3>
            <div className="space-y-2">
              {['Linear Search', 'Binary Search', 'Jump Search', 'Exponential Search'].map((algo) => (
                <div key={algo} className="flex items-center justify-between py-2">
                  <span className="text-gray-700">{algo}</span>
                  <span className="text-sm text-gray-500">O(log n)</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Graph Algorithms</h3>
            <div className="space-y-2">
              {['BFS', 'DFS', 'Dijkstra', 'Bellman-Ford', 'Floyd-Warshall'].map((algo) => (
                <div key={algo} className="flex items-center justify-between py-2">
                  <span className="text-gray-700">{algo}</span>
                  <span className="text-sm text-gray-500">O(V+E)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmDashboard;
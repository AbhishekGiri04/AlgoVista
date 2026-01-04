import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ALGORITHM_PSEUDOCODE } from '../data/algorithmInfo';

const CodeExplanation = ({ algorithm, isVisible, onClose }) => {
  const [activeTab, setActiveTab] = useState('pseudocode');

  if (!isVisible) return null;

  const codeExamples = {
    bubbleSort: {
      javascript: `function bubbleSort(arr) {
    const n = arr.length;
    let comparisons = 0, swaps = 0;
    
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            comparisons++;
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swaps++;
            }
        }
    }
    
    return { arr, comparisons, swaps };
}`,
      python: `def bubble_sort(arr):
    n = len(arr)
    comparisons = 0
    swaps = 0
    
    for i in range(n - 1):
        for j in range(n - i - 1):
            comparisons += 1
            if arr[j] > arr[j + 1]:
                # Swap elements
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swaps += 1
    
    return arr, comparisons, swaps`,
      cpp: `#include <vector>
#include <iostream>

void bubbleSort(std::vector<int>& arr) {
    int n = arr.size();
    int comparisons = 0, swaps = 0;
    
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            comparisons++;
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                std::swap(arr[j], arr[j + 1]);
                swaps++;
            }
        }
    }
}`
    }
  };

  const pseudocode = ALGORITHM_PSEUDOCODE[algorithm] || 'Pseudocode not available';
  const code = codeExamples[algorithm] || codeExamples.bubbleSort;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <span className="mr-2">💻</span>
            <h3 className="text-lg font-semibold">Algorithm Implementation</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <span>×</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('pseudocode')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'pseudocode'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span className="inline mr-2">📚</span>
            Pseudocode
          </button>
          <button
            onClick={() => setActiveTab('javascript')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'javascript'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            JavaScript
          </button>
          <button
            onClick={() => setActiveTab('python')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'python'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Python
          </button>
          <button
            onClick={() => setActiveTab('cpp')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'cpp'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            C++
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {activeTab === 'pseudocode' ? (
            <pre className="bg-gray-50 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap">
              {pseudocode}
            </pre>
          ) : (
            <SyntaxHighlighter
              language={activeTab}
              style={tomorrow}
              customStyle={{
                margin: 0,
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              {code[activeTab]}
            </SyntaxHighlighter>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <p className="text-sm text-gray-600">
            This implementation shows the core algorithm logic with performance tracking.
            The visualization adds color coding and step-by-step execution for educational purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CodeExplanation;
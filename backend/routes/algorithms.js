const express = require('express');
const router = express.Router();
const runCpp = require('../utils/runCpp');

// Stack Operations
router.post('/stack/push', (req, res) => {
  const { value } = req.body;
  runCpp('Stack/stack_exec', `push ${value}`, (result) => {
    res.json(result);
  });
});

router.post('/stack/pop', (req, res) => {
  runCpp('Stack/stack_exec', 'pop', (result) => {
    res.json(result);
  });
});

router.get('/stack/display', (req, res) => {
  runCpp('Stack/stack_exec', 'display', (result) => {
    res.json(result);
  });
});

// Queue Operations
router.post('/queue/enqueue', (req, res) => {
  const { value } = req.body;
  runCpp('Queue/queue_exec', `enqueue ${value}`, (result) => {
    res.json(result);
  });
});

router.post('/queue/dequeue', (req, res) => {
  runCpp('Queue/queue_exec', 'dequeue', (result) => {
    res.json(result);
  });
});

router.get('/queue/display', (req, res) => {
  runCpp('Queue/queue_exec', 'display', (result) => {
    res.json(result);
  });
});

// LinkedList Operations
router.post('/linkedlist/insert', (req, res) => {
  const { value } = req.body;
  runCpp('LinkedList/linkedlist_exec', `insert ${value}`, (result) => {
    res.json(result);
  });
});

router.post('/linkedlist/delete', (req, res) => {
  const { value } = req.body;
  runCpp('LinkedList/linkedlist_exec', `delete ${value}`, (result) => {
    res.json(result);
  });
});

router.get('/linkedlist/display', (req, res) => {
  runCpp('LinkedList/linkedlist_exec', 'display', (result) => {
    res.json(result);
  });
});

// Tree Operations
router.post('/tree/insert', (req, res) => {
  const { value } = req.body;
  runCpp('Tree/tree_exec', `insert ${value}`, (result) => {
    res.json(result);
  });
});

router.get('/tree/inorder', (req, res) => {
  runCpp('Tree/tree_exec', 'inorder', (result) => {
    res.json(result);
  });
});

router.get('/tree/preorder', (req, res) => {
  runCpp('Tree/tree_exec', 'preorder', (result) => {
    res.json(result);
  });
});

router.get('/tree/postorder', (req, res) => {
  runCpp('Tree/tree_exec', 'postorder', (result) => {
    res.json(result);
  });
});

// Graph Data Structure Operations
router.post('/graph/display', (req, res) => {
  const { vertices, edges } = req.body;
  const edgesStr = edges.map(e => `${e.from},${e.to}`).join(';');
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/DataStructures/Graph/Graph');
  const child = spawn(execPath, [vertices.toString(), 'display', edgesStr]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json({
        operation: 'display',
        vertices: vertices,
        edges: edges,
        ...result,
        success: true
      });
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

router.post('/graph/dfs', (req, res) => {
  const { vertices, edges, start } = req.body;
  const edgesStr = edges.map(e => `${e.from},${e.to}`).join(';');
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/DataStructures/Graph/Graph');
  const child = spawn(execPath, [vertices.toString(), 'DFS', edgesStr, start.toString()]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json({
        operation: 'DFS',
        vertices: vertices,
        edges: edges,
        start: start,
        ...result,
        success: true
      });
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

router.post('/graph/bfs', (req, res) => {
  const { vertices, edges, start } = req.body;
  const edgesStr = edges.map(e => `${e.from},${e.to}`).join(';');
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/DataStructures/Graph/Graph');
  const child = spawn(execPath, [vertices.toString(), 'BFS', edgesStr, start.toString()]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json({
        operation: 'BFS',
        vertices: vertices,
        edges: edges,
        start: start,
        ...result,
        success: true
      });
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

// Graph Algorithms
router.post('/graph/prims', (req, res) => {
  const { vertices, edges } = req.body;
  const edgesStr = edges.map(e => `${e.from},${e.to},${e.weight}`).join(';');
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/GraphAlgorithms/Prims/Prims');
  const child = spawn(execPath, [vertices.toString(), edgesStr]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json(result);
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

router.post('/graph/kruskal', (req, res) => {
  const { vertices, edges } = req.body;
  const edgesStr = edges.map(e => `${e.from},${e.to},${e.weight}`).join(';');
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/GraphAlgorithms/Kruskal/Kruskal');
  const child = spawn(execPath, [vertices.toString(), edgesStr]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json(result);
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

router.post('/graph/dijkstra', (req, res) => {
  const { vertices, edges, source } = req.body;
  const edgesStr = edges.map(e => `${e.from},${e.to},${e.weight}`).join(';');
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/GraphAlgorithms/Dijkstra/Dijkstra');
  const child = spawn(execPath, [vertices.toString(), edgesStr, source.toString()]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json(result);
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

// Additional Graph Algorithms
router.post('/algorithms/dfs', (req, res) => {
  const { vertices, edges, start } = req.body;
  const edgesStr = edges.map(e => `${e.from},${e.to}`).join(';');
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/GraphAlgorithms/DFS/DFS');
  const child = spawn(execPath, [vertices.toString(), edgesStr, start.toString()]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json({
        ...result,
        vertices: vertices,
        edges: edges,
        success: true
      });
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

router.post('/algorithms/bfs', (req, res) => {
  const { vertices, edges, start } = req.body;
  const edgesStr = edges.map(e => `${e.from},${e.to}`).join(';');
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/GraphAlgorithms/BFS/BFS');
  const child = spawn(execPath, [vertices.toString(), edgesStr, start.toString()]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json({
        ...result,
        vertices: vertices,
        edges: edges,
        success: true
      });
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

router.post('/algorithms/bellmanford', (req, res) => {
  const { vertices, edges, start } = req.body;
  const edgesStr = edges.map(e => `${e.from},${e.to},${e.weight}`).join(';');
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/GraphAlgorithms/BellmanFord/BellmanFord');
  const child = spawn(execPath, [vertices.toString(), edgesStr, start.toString()]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json(result);
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

router.post('/algorithms/floydwarshall', (req, res) => {
  const { vertices, edges } = req.body;
  const edgesStr = edges.map(e => `${e.from},${e.to},${e.weight}`).join(';');
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/GraphAlgorithms/FloydWarshall/FloydWarshall');
  const child = spawn(execPath, [vertices.toString(), edgesStr]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json(result);
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

router.post('/algorithms/topologicalsort', (req, res) => {
  const { vertices, edges } = req.body;
  const edgesStr = edges.map(e => `${e.from},${e.to}`).join(';');
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/GraphAlgorithms/TopologicalSort/TopologicalSort');
  const child = spawn(execPath, [vertices.toString(), edgesStr]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json(result);
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

router.post('/algorithms/kahns', (req, res) => {
  const { vertices, edges } = req.body;
  const edgesStr = edges.map(e => `${e.from},${e.to}`).join(';');
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/GraphAlgorithms/Kahns/Kahns');
  const child = spawn(execPath, [vertices.toString(), edgesStr]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json(result);
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

router.post('/algorithms/kosaraju', (req, res) => {
  const { vertices, edges } = req.body;
  const edgesStr = edges.map(e => `${e.from},${e.to}`).join(';');
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/GraphAlgorithms/Kosaraju/Kosaraju');
  const child = spawn(execPath, [vertices.toString(), edgesStr]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json(result);
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

// Bubble Sort Visualization
router.post('/bubblesort/steps', (req, res) => {
  const { array } = req.body;
  const arrayStr = array.join(',');
  runCpp('Sorting/BubbleSort/bubble_sort_steps_exec', arrayStr, (result) => {
    try {
      const parsed = JSON.parse(result);
      res.json(parsed);
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: result });
    }
  });
});

// Bubble Sort Visualization with full steps
router.post('/bubblesort/visualize', (req, res) => {
  const { array } = req.body;
  const arrayStr = array.join(',');
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/Sorting/BubbleSort/BubbleSort');
  const child = spawn(execPath, [arrayStr]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json({
        algorithm: 'Bubble Sort',
        input: array,
        ...result,
        success: true
      });
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

// Selection Sort Visualization
router.post('/selectionsort/visualize', (req, res) => {
  const { array } = req.body;
  const arrayStr = array.join(',');
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/Sorting/SelectionSort/SelectionSort');
  const child = spawn(execPath, [arrayStr]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json({
        algorithm: 'Selection Sort',
        input: array,
        ...result,
        success: true
      });
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

// Radix Sort Visualization
router.post('/radixsort/visualize', (req, res) => {
  const { array } = req.body;
  const arrayStr = array.join(',');
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/Sorting/RadixSort/RadixSort');
  const child = spawn(execPath, [arrayStr]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json({
        algorithm: 'Radix Sort',
        input: array,
        ...result,
        success: true
      });
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

// Counting Sort Visualization
router.post('/countingsort/visualize', (req, res) => {
  const { array } = req.body;
  const arrayStr = array.join(',');
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/Sorting/CountingSort/CountingSort');
  const child = spawn(execPath, [arrayStr]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json({
        algorithm: 'Counting Sort',
        input: array,
        ...result,
        success: true
      });
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

// Heap Sort Visualization
router.post('/heapsort/visualize', (req, res) => {
  const { array } = req.body;
  const arrayStr = array.join(',');
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/Sorting/HeapSort/HeapSort');
  const child = spawn(execPath, [arrayStr]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json({
        algorithm: 'Heap Sort',
        input: array,
        ...result,
        success: true
      });
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

// Quick Sort Visualization
router.post('/quicksort/visualize', (req, res) => {
  const { array } = req.body;
  const arrayStr = array.join(',');
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/Sorting/QuickSort/QuickSort');
  const child = spawn(execPath, [arrayStr]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json({
        algorithm: 'Quick Sort',
        input: array,
        ...result,
        success: true
      });
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

// Merge Sort Visualization
router.post('/mergesort/visualize', (req, res) => {
  const { array } = req.body;
  const arrayStr = array.join(',');
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/Sorting/MergeSort/MergeSort');
  const child = spawn(execPath, [arrayStr]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json({
        algorithm: 'Merge Sort',
        input: array,
        ...result,
        success: true
      });
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

// Insertion Sort Visualization
router.post('/insertionsort/visualize', (req, res) => {
  const { array } = req.body;
  const arrayStr = array.join(',');
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/Sorting/InsertionSort/InsertionSort');
  const child = spawn(execPath, [arrayStr]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json({
        algorithm: 'Insertion Sort',
        input: array,
        ...result,
        success: true
      });
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

// Linear Search
router.post('/linearsearch', (req, res) => {
  const { array, target } = req.body;
  const arrayStr = array.join(',');
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/Searching/LinearSearch/LinearSearch');
  const child = spawn(execPath, [arrayStr, target.toString()]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json({
        algorithm: 'Linear Search',
        array: array,
        target: target,
        ...result,
        success: true
      });
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

// Linear Search Algorithm
router.post('/algorithms/linearsearch', (req, res) => {
  const { array, target } = req.body;
  
  const steps = [];
  let found = false;
  let foundIndex = -1;
  
  for (let i = 0; i < array.length; i++) {
    const step = {
      stepNumber: i + 1,
      index: i,
      value: array[i],
      status: array[i] === target ? 'found' : 'checking',
      comparison: `arr[${i}] ${array[i] === target ? '==' : '!='} ${target} ${array[i] === target ? '✓' : '✗'}`
    };
    steps.push(step);
    
    if (array[i] === target) {
      found = true;
      foundIndex = i;
      break;
    }
  }
  
  const result = {
    algorithm: 'Linear Search',
    array: array,
    target: target,
    found: found,
    foundIndex: foundIndex,
    totalComparisons: steps.length,
    steps: steps,
    result: {
      message: found ? `Target ${target} found at index ${foundIndex}` : `Target ${target} not found in array`,
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)'
    }
  };
  
  res.json(result);
});

// Array Operations
router.post('/array/insert', (req, res) => {
  const { array, value, index } = req.body;
  const newArray = [...array];
  const insertIndex = index !== undefined ? index : array.length;
  
  if (insertIndex < 0 || insertIndex > array.length) {
    return res.json({ error: 'Invalid index', array });
  }
  
  newArray.splice(insertIndex, 0, value);
  
  res.json({
    success: true,
    array: newArray,
    operation: 'insert',
    value: value,
    index: insertIndex,
    message: `Inserted ${value} at index ${insertIndex}`
  });
});

router.post('/array/delete', (req, res) => {
  const { array, index } = req.body;
  
  if (index < 0 || index >= array.length) {
    return res.json({ error: 'Invalid index', array });
  }
  
  const newArray = [...array];
  const deletedValue = newArray.splice(index, 1)[0];
  
  res.json({
    success: true,
    array: newArray,
    operation: 'delete',
    deletedValue: deletedValue,
    index: index,
    message: `Deleted ${deletedValue} from index ${index}`
  });
});

router.post('/array/search', (req, res) => {
  const { array, value } = req.body;
  const steps = [];
  let foundIndex = -1;
  
  for (let i = 0; i < array.length; i++) {
    steps.push({
      index: i,
      value: array[i],
      comparing: value,
      found: array[i] === value
    });
    
    if (array[i] === value) {
      foundIndex = i;
      break;
    }
  }
  
  res.json({
    success: true,
    array: array,
    operation: 'search',
    searchValue: value,
    foundIndex: foundIndex,
    steps: steps,
    message: foundIndex >= 0 ? `Found ${value} at index ${foundIndex}` : `${value} not found`
  });
});

router.post('/array/update', (req, res) => {
  const { array, index, value } = req.body;
  
  if (index < 0 || index >= array.length) {
    return res.json({ error: 'Invalid index', array });
  }
  
  const newArray = [...array];
  const oldValue = newArray[index];
  newArray[index] = value;
  
  res.json({
    success: true,
    array: newArray,
    operation: 'update',
    index: index,
    oldValue: oldValue,
    newValue: value,
    message: `Updated index ${index}: ${oldValue} → ${value}`
  });
});

// Stack Operations
router.post('/stack/push', (req, res) => {
  const { stack, value, maxSize = 8 } = req.body;
  
  if (stack.length >= maxSize) {
    return res.json({ 
      error: 'Stack Overflow', 
      message: 'Cannot push - stack is full',
      stack: stack 
    });
  }
  
  const newStack = [...stack, value];
  
  res.json({
    success: true,
    stack: newStack,
    operation: 'push',
    value: value,
    size: newStack.length,
    message: `Pushed ${value} to stack`,
    performance: { timeComplexity: 'O(1)', spaceComplexity: 'O(1)' }
  });
});

router.post('/stack/pop', (req, res) => {
  const { stack } = req.body;
  
  if (stack.length === 0) {
    return res.json({ 
      error: 'Stack Underflow', 
      message: 'Cannot pop - stack is empty',
      stack: stack 
    });
  }
  
  const newStack = [...stack];
  const poppedValue = newStack.pop();
  
  res.json({
    success: true,
    stack: newStack,
    operation: 'pop',
    poppedValue: poppedValue,
    size: newStack.length,
    message: `Popped ${poppedValue} from stack`,
    performance: { timeComplexity: 'O(1)', spaceComplexity: 'O(1)' }
  });
});

router.post('/stack/peek', (req, res) => {
  const { stack } = req.body;
  
  if (stack.length === 0) {
    return res.json({ 
      error: 'Stack Empty', 
      message: 'Cannot peek - stack is empty',
      stack: stack 
    });
  }
  
  const topValue = stack[stack.length - 1];
  
  res.json({
    success: true,
    stack: stack,
    operation: 'peek',
    topValue: topValue,
    size: stack.length,
    message: `Top element is ${topValue}`,
    performance: { timeComplexity: 'O(1)', spaceComplexity: 'O(1)' }
  });
});

router.post('/stack/isEmpty', (req, res) => {
  const { stack } = req.body;
  const isEmpty = stack.length === 0;
  
  res.json({
    success: true,
    stack: stack,
    operation: 'isEmpty',
    isEmpty: isEmpty,
    size: stack.length,
    message: isEmpty ? 'Stack is empty' : 'Stack is not empty',
    performance: { timeComplexity: 'O(1)', spaceComplexity: 'O(1)' }
  });
});

router.post('/stack/isFull', (req, res) => {
  const { stack, maxSize = 8 } = req.body;
  const isFull = stack.length >= maxSize;
  
  res.json({
    success: true,
    stack: stack,
    operation: 'isFull',
    isFull: isFull,
    size: stack.length,
    maxSize: maxSize,
    message: isFull ? 'Stack is full' : `Stack has ${maxSize - stack.length} free spaces`,
    performance: { timeComplexity: 'O(1)', spaceComplexity: 'O(1)' }
  });
});

router.get('/stack/display', (req, res) => {
  const { stack = [] } = req.query;
  
  res.json({
    success: true,
    stack: Array.isArray(stack) ? stack : [],
    operation: 'display',
    size: stack.length,
    message: stack.length > 0 ? `Stack contains ${stack.length} elements` : 'Stack is empty',
    performance: { timeComplexity: 'O(n)', spaceComplexity: 'O(1)' }
  });
});

// Queue Operations
router.post('/queue/enqueue', (req, res) => {
  const { queue, value, maxSize = 8 } = req.body;
  
  if (queue.length >= maxSize) {
    return res.json({ 
      error: 'Queue Overflow', 
      message: 'Cannot enqueue - queue is full',
      queue: queue 
    });
  }
  
  const newQueue = [...queue, value];
  
  res.json({
    success: true,
    queue: newQueue,
    operation: 'enqueue',
    value: value,
    size: newQueue.length,
    front: newQueue[0],
    rear: newQueue[newQueue.length - 1],
    message: `Enqueued ${value} to rear`,
    performance: { timeComplexity: 'O(1)', spaceComplexity: 'O(1)' }
  });
});

router.post('/queue/dequeue', (req, res) => {
  const { queue } = req.body;
  
  if (queue.length === 0) {
    return res.json({ 
      error: 'Queue Underflow', 
      message: 'Cannot dequeue - queue is empty',
      queue: queue 
    });
  }
  
  const newQueue = [...queue];
  const dequeuedValue = newQueue.shift();
  
  res.json({
    success: true,
    queue: newQueue,
    operation: 'dequeue',
    dequeuedValue: dequeuedValue,
    size: newQueue.length,
    front: newQueue.length > 0 ? newQueue[0] : null,
    rear: newQueue.length > 0 ? newQueue[newQueue.length - 1] : null,
    message: `Dequeued ${dequeuedValue} from front`,
    performance: { timeComplexity: 'O(1)', spaceComplexity: 'O(1)' }
  });
});

router.post('/queue/peek', (req, res) => {
  const { queue } = req.body;
  
  if (queue.length === 0) {
    return res.json({ 
      error: 'Queue Empty', 
      message: 'Cannot peek - queue is empty',
      queue: queue 
    });
  }
  
  const frontValue = queue[0];
  
  res.json({
    success: true,
    queue: queue,
    operation: 'peek',
    frontValue: frontValue,
    size: queue.length,
    message: `Front element is ${frontValue}`,
    performance: { timeComplexity: 'O(1)', spaceComplexity: 'O(1)' }
  });
});

router.post('/queue/isEmpty', (req, res) => {
  const { queue } = req.body;
  const isEmpty = queue.length === 0;
  
  res.json({
    success: true,
    queue: queue,
    operation: 'isEmpty',
    isEmpty: isEmpty,
    size: queue.length,
    message: isEmpty ? 'Queue is empty' : 'Queue is not empty',
    performance: { timeComplexity: 'O(1)', spaceComplexity: 'O(1)' }
  });
});

router.post('/queue/isFull', (req, res) => {
  const { queue, maxSize = 8 } = req.body;
  const isFull = queue.length >= maxSize;
  
  res.json({
    success: true,
    queue: queue,
    operation: 'isFull',
    isFull: isFull,
    size: queue.length,
    maxSize: maxSize,
    message: isFull ? 'Queue is full' : `Queue has ${maxSize - queue.length} free spaces`,
    performance: { timeComplexity: 'O(1)', spaceComplexity: 'O(1)' }
  });
});

router.get('/queue/display', (req, res) => {
  const { queue = [] } = req.query;
  
  res.json({
    success: true,
    queue: Array.isArray(queue) ? queue : [],
    operation: 'display',
    size: queue.length,
    front: queue.length > 0 ? queue[0] : null,
    rear: queue.length > 0 ? queue[queue.length - 1] : null,
    message: queue.length > 0 ? `Queue contains ${queue.length} elements` : 'Queue is empty',
    performance: { timeComplexity: 'O(n)', spaceComplexity: 'O(1)' }
  });
});

// Linked List Operations
router.post('/linkedlist/insertFirst', (req, res) => {
  const { linkedList, value } = req.body;
  const newList = [value, ...linkedList];
  
  res.json({
    success: true,
    linkedList: newList,
    operation: 'insertFirst',
    value: value,
    size: newList.length,
    head: newList[0],
    message: `Inserted ${value} at first position`,
    performance: { timeComplexity: 'O(1)', spaceComplexity: 'O(1)' }
  });
});

router.post('/linkedlist/insertLast', (req, res) => {
  const { linkedList, value } = req.body;
  const newList = [...linkedList, value];
  
  res.json({
    success: true,
    linkedList: newList,
    operation: 'insertLast',
    value: value,
    size: newList.length,
    head: newList[0],
    tail: newList[newList.length - 1],
    message: `Inserted ${value} at last position`,
    performance: { timeComplexity: 'O(n)', spaceComplexity: 'O(1)' }
  });
});

router.post('/linkedlist/insertAt', (req, res) => {
  const { linkedList, value, position } = req.body;
  
  if (position < 0 || position > linkedList.length) {
    return res.json({ 
      error: 'Invalid Position', 
      message: `Position ${position} is out of bounds`,
      linkedList: linkedList 
    });
  }
  
  const newList = [...linkedList];
  newList.splice(position, 0, value);
  
  res.json({
    success: true,
    linkedList: newList,
    operation: 'insertAt',
    value: value,
    position: position,
    size: newList.length,
    message: `Inserted ${value} at position ${position}`,
    performance: { timeComplexity: 'O(n)', spaceComplexity: 'O(1)' }
  });
});

router.post('/linkedlist/removeFirst', (req, res) => {
  const { linkedList } = req.body;
  
  if (linkedList.length === 0) {
    return res.json({ 
      error: 'Empty List', 
      message: 'Cannot remove from empty linked list',
      linkedList: linkedList 
    });
  }
  
  const newList = linkedList.slice(1);
  const removedValue = linkedList[0];
  
  res.json({
    success: true,
    linkedList: newList,
    operation: 'removeFirst',
    removedValue: removedValue,
    size: newList.length,
    head: newList.length > 0 ? newList[0] : null,
    message: `Removed ${removedValue} from first position`,
    performance: { timeComplexity: 'O(1)', spaceComplexity: 'O(1)' }
  });
});

router.post('/linkedlist/removeLast', (req, res) => {
  const { linkedList } = req.body;
  
  if (linkedList.length === 0) {
    return res.json({ 
      error: 'Empty List', 
      message: 'Cannot remove from empty linked list',
      linkedList: linkedList 
    });
  }
  
  const newList = linkedList.slice(0, -1);
  const removedValue = linkedList[linkedList.length - 1];
  
  res.json({
    success: true,
    linkedList: newList,
    operation: 'removeLast',
    removedValue: removedValue,
    size: newList.length,
    tail: newList.length > 0 ? newList[newList.length - 1] : null,
    message: `Removed ${removedValue} from last position`,
    performance: { timeComplexity: 'O(n)', spaceComplexity: 'O(1)' }
  });
});

router.post('/linkedlist/removeAt', (req, res) => {
  const { linkedList, position } = req.body;
  
  if (position < 0 || position >= linkedList.length) {
    return res.json({ 
      error: 'Invalid Position', 
      message: `Position ${position} is out of bounds`,
      linkedList: linkedList 
    });
  }
  
  const newList = [...linkedList];
  const removedValue = newList.splice(position, 1)[0];
  
  res.json({
    success: true,
    linkedList: newList,
    operation: 'removeAt',
    removedValue: removedValue,
    position: position,
    size: newList.length,
    message: `Removed ${removedValue} from position ${position}`,
    performance: { timeComplexity: 'O(n)', spaceComplexity: 'O(1)' }
  });
});

router.post('/linkedlist/traverse', (req, res) => {
  const { linkedList } = req.body;
  const traversalSteps = linkedList.map((value, index) => ({
    position: index,
    value: value,
    isHead: index === 0,
    isTail: index === linkedList.length - 1,
    next: index < linkedList.length - 1 ? linkedList[index + 1] : null
  }));
  
  res.json({
    success: true,
    linkedList: linkedList,
    operation: 'traverse',
    steps: traversalSteps,
    size: linkedList.length,
    message: `Traversed linked list with ${linkedList.length} nodes`,
    performance: { timeComplexity: 'O(n)', spaceComplexity: 'O(1)' }
  });
});

router.get('/linkedlist/display', (req, res) => {
  const { linkedList = [] } = req.query;
  
  res.json({
    success: true,
    linkedList: Array.isArray(linkedList) ? linkedList : [],
    operation: 'display',
    size: linkedList.length,
    head: linkedList.length > 0 ? linkedList[0] : null,
    tail: linkedList.length > 0 ? linkedList[linkedList.length - 1] : null,
    message: linkedList.length > 0 ? `Linked list contains ${linkedList.length} nodes` : 'Linked list is empty',
    performance: { timeComplexity: 'O(n)', spaceComplexity: 'O(1)' }
  });
});

// Enhanced Binary Search Tree Operations with Step-by-Step Visualization
router.post('/tree/insert', (req, res) => {
  const { value } = req.body;
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/DataStructures/Tree/Tree');
  const child = spawn(execPath, ['insert', value.toString()]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json({
        algorithm: 'BST Insert',
        operation: 'insert',
        value: value,
        ...result,
        success: true
      });
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

router.post('/tree/search', (req, res) => {
  const { value } = req.body;
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/DataStructures/Tree/Tree');
  const child = spawn(execPath, ['search', value.toString()]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json({
        algorithm: 'BST Search',
        operation: 'search',
        value: value,
        ...result,
        success: true
      });
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

router.post('/tree/delete', (req, res) => {
  const { tree, value } = req.body;
  
  const deleteNode = (nodes, val) => {
    return nodes.filter(node => node.value !== val);
  };
  
  const newTree = deleteNode(tree || [], value);
  
  res.json({
    success: true,
    tree: newTree,
    operation: 'delete',
    deletedValue: value,
    size: newTree.length,
    message: `Deleted ${value} from BST`,
    performance: { timeComplexity: 'O(log n)', spaceComplexity: 'O(1)' }
  });
});

router.post('/tree/inorder', (req, res) => {
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/DataStructures/Tree/Tree');
  const child = spawn(execPath, ['inorder']);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json({
        algorithm: 'BST Inorder Traversal',
        operation: 'inorder',
        ...result,
        success: true
      });
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

router.post('/tree/preorder', (req, res) => {
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/DataStructures/Tree/Tree');
  const child = spawn(execPath, ['preorder']);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json({
        algorithm: 'BST Preorder Traversal',
        operation: 'preorder',
        ...result,
        success: true
      });
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

router.post('/tree/postorder', (req, res) => {
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/DataStructures/Tree/Tree');
  const child = spawn(execPath, ['postorder']);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json({
        algorithm: 'BST Postorder Traversal',
        operation: 'postorder',
        ...result,
        success: true
      });
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

router.post('/tree/levelorder', (req, res) => {
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/DataStructures/Tree/Tree');
  const child = spawn(execPath, ['levelorder']);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json({
        algorithm: 'BST Level Order Traversal',
        operation: 'levelorder',
        ...result,
        success: true
      });
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

router.get('/tree/display', (req, res) => {
  const { tree = [] } = req.query;
  
  const calculateHeight = (nodes) => {
    return nodes.length > 0 ? Math.ceil(Math.log2(nodes.length + 1)) : 0;
  };
  
  res.json({
    success: true,
    tree: Array.isArray(tree) ? tree : [],
    operation: 'display',
    size: tree.length,
    height: calculateHeight(tree),
    message: tree.length > 0 ? `BST contains ${tree.length} nodes` : 'BST is empty',
    performance: { timeComplexity: 'O(n)', spaceComplexity: 'O(1)' }
  });
});

// Exponential Search
router.post('/exponentialsearch', (req, res) => {
  const { array, target } = req.body;
  const arrayStr = array.join(',');
  
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/Searching/ExponentialSearch/ExponentialSearch');
  const child = spawn(execPath, [arrayStr, target.toString()]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json(result);
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
});

// Jump Search
router.post('/jumpsearch', (req, res) => {
  const { array, target } = req.body;
  const arrayStr = array.join(',');
  
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/Searching/JumpSearch/JumpSearch');
  const child = spawn(execPath, [arrayStr, target.toString()]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json(result);
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
});

// Binary Search
router.post('/binarysearch', (req, res) => {
  const { array, target } = req.body;
  const arrayStr = array.join(',');
  
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/Searching/BinarySearch/BinarySearch');
  const child = spawn(execPath, [arrayStr, target.toString()]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json(result);
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
});

// Naive String Matching
router.post('/naivestring', (req, res) => {
  const { text, pattern } = req.body;
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/StringAlgorithms/NaiveString/NaiveString');
  const child = spawn(execPath, [text, pattern]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json(result);
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

// KMP String Matching
router.post('/kmp', (req, res) => {
  const { text, pattern } = req.body;
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/StringAlgorithms/KMP/KMP');
  const child = spawn(execPath, [text, pattern]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json(result);
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

// Rabin-Karp String Matching
router.post('/rabinkarp', (req, res) => {
  const { text, pattern } = req.body;
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/StringAlgorithms/RabinKarp/RabinKarp');
  const child = spawn(execPath, [text, pattern]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json(result);
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

// TSP (Travelling Salesman Problem)
router.post('/tsp', (req, res) => {
  const { distanceMatrix } = req.body;
  const { spawn } = require('child_process');
  const path = require('path');
  
  // Format: "4;0,10,15,20;10,0,35,25;15,35,0,30;20,25,30,0"
  let matrixStr = `${distanceMatrix.length}`;
  for (let i = 0; i < distanceMatrix.length; i++) {
    matrixStr += `;${distanceMatrix[i].join(',')}`;
  }
  
  const execPath = path.join(__dirname, '../../algorithms/BranchAndBound/TSP/TSP');
  const child = spawn(execPath, [matrixStr]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json(result);
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

// Job Scheduling
router.post('/jobscheduling', (req, res) => {
  const { jobs } = req.body;
  const { spawn } = require('child_process');
  const path = require('path');
  
  // Format: "5;A,2,100;B,1,19;C,2,27;D,1,25;E,3,15"
  let jobsStr = `${jobs.length}`;
  for (const job of jobs) {
    jobsStr += `;${job.id},${job.deadline},${job.profit}`;
  }
  
  const execPath = path.join(__dirname, '../../algorithms/BranchAndBound/JobScheduling/JobScheduling');
  const child = spawn(execPath, [jobsStr]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json(result);
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

// LCS (Longest Common Subsequence)
router.post('/lcs', (req, res) => {
  const { stringX, stringY } = req.body;
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/DynamicProgramming/LCS/LCS');
  const child = spawn(execPath, [stringX, stringY]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json(result);
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

// Matrix Chain Multiplication
router.post('/matrixchain', (req, res) => {
  const { dimensions } = req.body;
  const { spawn } = require('child_process');
  const path = require('path');
  
  const dimsStr = dimensions.join(',');
  
  const execPath = path.join(__dirname, '../../algorithms/DynamicProgramming/MatrixChainMultiplication/MatrixChainMultiplication');
  const child = spawn(execPath, [dimsStr]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json(result);
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

// 0/1 Knapsack
router.post('/knapsack01', (req, res) => {
  const { items, capacity } = req.body;
  const { spawn } = require('child_process');
  const path = require('path');
  
  // Format: "4;60,10;100,20;120,30;80,15"
  let itemsStr = `${items.length}`;
  for (const item of items) {
    itemsStr += `;${item.value},${item.weight}`;
  }
  
  const execPath = path.join(__dirname, '../../algorithms/DynamicProgramming/Knapsack01/Knapsack01');
  const child = spawn(execPath, [capacity.toString(), itemsStr]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json(result);
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

// Huffman Coding
router.post('/huffman', (req, res) => {
  const { text } = req.body;
  const { spawn } = require('child_process');
  const path = require('path');
  
  const execPath = path.join(__dirname, '../../algorithms/GreedyAlgorithms/HuffmanCoding/HuffmanCoding');
  const child = spawn(execPath, [text]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json(result);
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

// Activity Selection
router.post('/activityselection', (req, res) => {
  const { activities } = req.body;
  const { spawn } = require('child_process');
  const path = require('path');
  
  // Format: "6;1,3;2,5;0,6;5,7;8,9;5,9"
  let activitiesStr = `${activities.length}`;
  for (const activity of activities) {
    activitiesStr += `;${activity.start},${activity.finish}`;
  }
  
  const execPath = path.join(__dirname, '../../algorithms/GreedyAlgorithms/ActivitySelection/ActivitySelection');
  const child = spawn(execPath, [activitiesStr]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json(result);
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

// Fractional Knapsack
router.post('/fractionalknapsack', (req, res) => {
  const { items, capacity } = req.body;
  const { spawn } = require('child_process');
  const path = require('path');
  
  // Format: "3;60,10;100,20;120,30"
  let itemsStr = `${items.length}`;
  for (const item of items) {
    itemsStr += `;${item.value},${item.weight}`;
  }
  
  const execPath = path.join(__dirname, '../../algorithms/GreedyAlgorithms/FractionalKnapsack/FractionalKnapsack');
  const child = spawn(execPath, [capacity.toString(), itemsStr]);
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json(result);
    } catch (e) {
      res.json({ error: 'Failed to parse result', raw: output });
    }
  });
  
  child.on('error', (err) => {
    res.json({ error: 'Execution failed', message: err.message });
  });
});

module.exports = router;
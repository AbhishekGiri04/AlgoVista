import React, { useState } from 'react';

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

const Tree = () => {
  const [root, setRoot] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [traversalOutput, setTraversalOutput] = useState('');
  const [highlightedNodes, setHighlightedNodes] = useState(new Set());

  const insertNode = (node, value) => {
    if (!node) return new TreeNode(value);
    if (value < node.value) node.left = insertNode(node.left, value);
    else node.right = insertNode(node.right, value);
    return node;
  };

  const deleteNodeRecursive = (node, value) => {
    if (!node) return null;
    if (value < node.value) node.left = deleteNodeRecursive(node.left, value);
    else if (value > node.value) node.right = deleteNodeRecursive(node.right, value);
    else {
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      let minLargerNode = node.right;
      while (minLargerNode.left) minLargerNode = minLargerNode.left;
      node.value = minLargerNode.value;
      node.right = deleteNodeRecursive(node.right, minLargerNode.value);
    }
    return node;
  };

  const insert = () => {
    const val = parseInt(inputValue);
    if (!isNaN(val)) {
      setRoot(insertNode(root, val));
      setInputValue('');
    }
  };

  const deleteNode = () => {
    const val = parseInt(inputValue);
    if (!isNaN(val)) {
      setRoot(deleteNodeRecursive(root, val));
      setInputValue('');
    }
  };

  const inOrderTraversal = (node, res) => {
    if (!node) return;
    inOrderTraversal(node.left, res);
    res.push(node.value);
    inOrderTraversal(node.right, res);
  };

  const preOrderTraversal = (node, res) => {
    if (!node) return;
    res.push(node.value);
    preOrderTraversal(node.left, res);
    preOrderTraversal(node.right, res);
  };

  const postOrderTraversal = (node, res) => {
    if (!node) return;
    postOrderTraversal(node.left, res);
    postOrderTraversal(node.right, res);
    res.push(node.value);
  };

  const highlightTraversal = (path) => {
    let i = 0;
    const highlightNext = () => {
      if (i >= path.length) {
        setHighlightedNodes(new Set());
        return;
      }
      setHighlightedNodes(new Set([path[i]]));
      i++;
      setTimeout(highlightNext, 900);
    };
    highlightNext();
  };

  const inOrder = () => {
    const result = [];
    inOrderTraversal(root, result);
    setTraversalOutput('Inorder: ' + result.join(' '));
    highlightTraversal(result);
  };

  const preOrder = () => {
    const result = [];
    preOrderTraversal(root, result);
    setTraversalOutput('Preorder: ' + result.join(' '));
    highlightTraversal(result);
  };

  const postOrder = () => {
    const result = [];
    postOrderTraversal(root, result);
    setTraversalOutput('Postorder: ' + result.join(' '));
    highlightTraversal(result);
  };

  const renderTreeLevels = () => {
    if (!root) return [];
    const queue = [{ node: root, level: 0 }];
    const levels = [];

    while (queue.length) {
      const { node, level } = queue.shift();
      if (!levels[level]) levels[level] = [];
      if (node) {
        levels[level].push(node.value);
        queue.push({ node: node.left, level: level + 1 });
        queue.push({ node: node.right, level: level + 1 });
      } else {
        levels[level].push(null);
      }
    }
    return levels;
  };

  const levels = renderTreeLevels();

  return (
    <div style={{
      background: '#0e0e0e',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <a href="/datastructures" style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '10px',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'none',
        boxShadow: '0 8px 25px rgba(124, 58, 237, 0.4)'
      }}>
        ← Back
      </a>

      <h1 style={{ color: '#00e676' }}>Binary Tree Visualizer 🌲</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
          style={{
            padding: '10px',
            margin: '5px',
            fontSize: '16px',
            borderRadius: '6px',
            border: 'none',
            background: '#222',
            color: 'white',
            border: '1px solid #00e676'
          }}
        />
        <button onClick={insert} style={{
          padding: '10px',
          margin: '5px',
          fontSize: '16px',
          borderRadius: '6px',
          border: 'none',
          background: 'linear-gradient(145deg, #00bcd4, #008c9e)',
          color: 'white',
          boxShadow: '0 0 10px #00ffff',
          cursor: 'pointer'
        }}>
          Insert
        </button>
        <button onClick={deleteNode} style={{
          padding: '10px',
          margin: '5px',
          fontSize: '16px',
          borderRadius: '6px',
          border: 'none',
          background: 'linear-gradient(145deg, #00bcd4, #008c9e)',
          color: 'white',
          boxShadow: '0 0 10px #00ffff',
          cursor: 'pointer'
        }}>
          Delete
        </button>
        <br />
        <button onClick={inOrder} style={{
          padding: '10px',
          margin: '5px',
          fontSize: '16px',
          borderRadius: '6px',
          border: 'none',
          background: 'linear-gradient(145deg, #00bcd4, #008c9e)',
          color: 'white',
          boxShadow: '0 0 10px #00ffff',
          cursor: 'pointer'
        }}>
          Inorder
        </button>
        <button onClick={preOrder} style={{
          padding: '10px',
          margin: '5px',
          fontSize: '16px',
          borderRadius: '6px',
          border: 'none',
          background: 'linear-gradient(145deg, #00bcd4, #008c9e)',
          color: 'white',
          boxShadow: '0 0 10px #00ffff',
          cursor: 'pointer'
        }}>
          Preorder
        </button>
        <button onClick={postOrder} style={{
          padding: '10px',
          margin: '5px',
          fontSize: '16px',
          borderRadius: '6px',
          border: 'none',
          background: 'linear-gradient(145deg, #00bcd4, #008c9e)',
          color: 'white',
          boxShadow: '0 0 10px #00ffff',
          cursor: 'pointer'
        }}>
          Postorder
        </button>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: '30px',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {levels.map((level, levelIndex) => (
          <div key={levelIndex} style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '15px 0'
          }}>
            {level.map((value, nodeIndex) => (
              value !== null ? (
                <div
                  key={`${levelIndex}-${nodeIndex}`}
                  style={{
                    background: highlightedNodes.has(value) 
                      ? '#ffeb3b' 
                      : 'linear-gradient(145deg, #2196F3, #0d47a1)',
                    padding: '15px',
                    borderRadius: '50%',
                    margin: '0 15px',
                    color: highlightedNodes.has(value) ? 'black' : 'white',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    boxShadow: highlightedNodes.has(value) 
                      ? '0 0 20px #ffff00' 
                      : '0 0 15px cyan',
                    transform: highlightedNodes.has(value) ? 'scale(1.3)' : 'scale(1)',
                    transition: 'all 0.3s ease',
                    zIndex: highlightedNodes.has(value) ? 10 : 1
                  }}
                >
                  {value}
                </div>
              ) : (
                <div key={`${levelIndex}-${nodeIndex}`} style={{ width: '50px' }} />
              )
            ))}
          </div>
        ))}
      </div>

      {traversalOutput && (
        <div style={{
          marginTop: '20px',
          fontSize: '20px',
          color: '#ff9800'
        }}>
          {traversalOutput}
        </div>
      )}
    </div>
  );
};

export default Tree;
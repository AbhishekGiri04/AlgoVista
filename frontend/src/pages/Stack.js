import React, { useState, useEffect } from 'react';

const Stack = () => {
  const [stack, setStack] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [traverseOutput, setTraverseOutput] = useState([]);
  const [isTraversing, setIsTraversing] = useState(false);

  const pushStack = () => {
    if (inputValue.trim() === '') {
      alert('Please enter a value to push.');
      return;
    }
    setStack([...stack, inputValue.trim()]);
    setInputValue('');
  };

  const popStack = () => {
    if (stack.length === 0) {
      alert('Stack is empty.');
      return;
    }
    setStack(stack.slice(0, -1));
  };

  const traverseStack = () => {
    if (stack.length === 0) {
      alert('Stack is empty.');
      return;
    }
    
    setIsTraversing(true);
    setTraverseOutput([]);
    let i = 0;
    
    const interval = setInterval(() => {
      if (i >= stack.length) {
        clearInterval(interval);
        setHighlightIndex(-1);
        setIsTraversing(false);
        return;
      }
      
      setHighlightIndex(i);
      setTraverseOutput(prev => [...prev, stack[stack.length - 1 - i]]);
      i++;
    }, 600);
  };

  return (
    <div style={{
      backgroundColor: '#0e0e0e',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      color: 'white',
      textAlign: 'center',
      padding: '20px',
      minHeight: '100vh'
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

      <h1 style={{
        color: '#2196f3',
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '20px',
        textShadow: '0 1px 2px rgba(0, 255, 255, 0.2)'
      }}>
        Stack Visualizer 📚
      </h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
          style={{
            padding: '10px',
            margin: '8px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '6px',
            background: '#2c2c2c',
            color: 'white',
            border: '1px solid #2196f3'
          }}
        />
        <button onClick={pushStack} style={{
          padding: '10px',
          margin: '8px',
          fontSize: '16px',
          border: 'none',
          borderRadius: '6px',
          background: '#1e88e5',
          color: 'white',
          boxShadow: '0 0 10px #2196f3',
          cursor: 'pointer'
        }}>
          Push
        </button>
        <button onClick={popStack} style={{
          padding: '10px',
          margin: '8px',
          fontSize: '16px',
          border: 'none',
          borderRadius: '6px',
          background: '#1e88e5',
          color: 'white',
          boxShadow: '0 0 10px #2196f3',
          cursor: 'pointer'
        }}>
          Pop
        </button>
        <button onClick={traverseStack} style={{
          padding: '10px',
          margin: '8px',
          fontSize: '16px',
          border: 'none',
          borderRadius: '6px',
          background: '#1e88e5',
          color: 'white',
          boxShadow: '0 0 10px #2196f3',
          cursor: 'pointer'
        }}>
          Traverse
        </button>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          width: '200px',
          height: '15px',
          background: '#4facfe',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
          boxShadow: '0 0 15px #4facfe',
          marginBottom: '-10px',
          zIndex: 10,
          position: 'relative'
        }} />
        
        <div style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          alignItems: 'center',
          justifyContent: 'flex-end',
          height: '400px',
          margin: '0 auto',
          width: '200px',
          padding: '15px',
          border: '2px solid #4facfe',
          borderRadius: '0 0 10px 10px',
          boxShadow: '0 0 25px #4facfe',
          background: 'linear-gradient(to top, #121212, #1c1c1c)',
          perspective: '1000px',
          position: 'relative',
          zIndex: 1
        }}>
          {stack.map((value, index) => (
            <div
              key={index}
              style={{
                width: '120px',
                height: '50px',
                margin: '8px',
                background: (stack.length - 1 - index) === highlightIndex 
                  ? 'linear-gradient(145deg, #4facfe, #2196f3)' 
                  : 'linear-gradient(145deg, #2196F3, #0d47a1)',
                borderRadius: '10px',
                lineHeight: '50px',
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'white',
                boxShadow: (stack.length - 1 - index) === highlightIndex 
                  ? '0 0 30px #4facfe, 0 0 60px #2196f3' 
                  : '0 0 20px #2196f3, 0 0 40px #2196f3',
                transform: (stack.length - 1 - index) === highlightIndex 
                  ? 'scale(1.15) rotateX(0deg) rotateY(0deg)' 
                  : 'rotateX(20deg) rotateY(10deg)',
                transition: 'transform 0.4s ease, box-shadow 0.4s ease'
              }}
            >
              {value}
            </div>
          ))}
        </div>
      </div>

      {isTraversing && (
        <div style={{
          marginTop: '30px',
          padding: '10px',
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#ffeb3b'
        }}>
          Traversing Stack (LIFO Order):
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '20px',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            {traverseOutput.map((value, index) => (
              <div
                key={index}
                style={{
                  width: '120px',
                  height: '50px',
                  margin: '10px',
                  background: 'linear-gradient(145deg, #ff5722, #e64a19)',
                  borderRadius: '10px',
                  lineHeight: '50px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: 'white',
                  animation: 'jump 0.5s ease',
                  boxShadow: '0 0 20px #ff5722, 0 0 40px #ff5722'
                }}
              >
                {value}
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes jump {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.1); }
          100% { transform: translateY(0px) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Stack;
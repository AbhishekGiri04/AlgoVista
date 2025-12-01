import React, { useState } from 'react';

const LinkedList = () => {
  const [list, setList] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [position, setPosition] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const insertAtStart = () => {
    if (inputValue.trim() === '') {
      alert('Enter a value');
      return;
    }
    setList([inputValue.trim(), ...list]);
    setInputValue('');
  };

  const insertAtEnd = () => {
    if (inputValue.trim() === '') {
      alert('Enter a value');
      return;
    }
    setList([...list, inputValue.trim()]);
    setInputValue('');
  };

  const insertAtPosition = () => {
    const val = inputValue.trim();
    const pos = parseInt(position);
    if (val === '') {
      alert('Enter a value');
      return;
    }
    if (isNaN(pos) || pos < 0 || pos > list.length) {
      alert('Invalid position');
      return;
    }
    const newList = [...list];
    newList.splice(pos, 0, val);
    setList(newList);
    setInputValue('');
    setPosition('');
  };

  const deleteFromStart = () => {
    if (list.length === 0) {
      alert('List is empty');
      return;
    }
    setList(list.slice(1));
  };

  const deleteFromEnd = () => {
    if (list.length === 0) {
      alert('List is empty');
      return;
    }
    setList(list.slice(0, -1));
  };

  const deleteAtPosition = () => {
    const pos = parseInt(position);
    if (isNaN(pos) || pos < 0 || pos >= list.length) {
      alert('Invalid position');
      return;
    }
    const newList = [...list];
    newList.splice(pos, 1);
    setList(newList);
    setPosition('');
  };

  const traverse = () => {
    if (list.length === 0) {
      alert('List is empty');
      return;
    }
    let index = 0;
    const interval = setInterval(() => {
      if (index >= list.length) {
        clearInterval(interval);
        setHighlightIndex(-1);
        return;
      }
      setHighlightIndex(index);
      index++;
    }, 700);
  };

  return (
    <div style={{
      backgroundColor: '#101820',
      color: '#fff',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
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
        color: '#00e6e6',
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '20px',
        textShadow: '0 1px 2px rgba(0, 255, 255, 0.2)'
      }}>
        Linked List Visualizer ⛓️💥
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
            borderRadius: '6px',
            border: 'none',
            background: '#2c2c2c',
            color: 'white'
          }}
        />
        <input
          type="number"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="Index (optional)"
          style={{
            padding: '10px',
            margin: '8px',
            fontSize: '16px',
            borderRadius: '6px',
            border: 'none',
            background: '#2c2c2c',
            color: 'white'
          }}
        />
        <br />
        
        <button onClick={insertAtStart} style={{
          background: 'linear-gradient(45deg, #00e6e6, #00bcd4)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '16px',
          padding: '10px 18px',
          margin: '6px',
          transition: 'all 0.3s ease',
          boxShadow: '0 0 10px rgba(0,255,255,0.3)',
          cursor: 'pointer'
        }}>
          Insert Start
        </button>
        <button onClick={insertAtEnd} style={{
          background: 'linear-gradient(45deg, #00e6e6, #00bcd4)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '16px',
          padding: '10px 18px',
          margin: '6px',
          transition: 'all 0.3s ease',
          boxShadow: '0 0 10px rgba(0,255,255,0.3)',
          cursor: 'pointer'
        }}>
          Insert End
        </button>
        <button onClick={insertAtPosition} style={{
          background: 'linear-gradient(45deg, #00e6e6, #00bcd4)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '16px',
          padding: '10px 18px',
          margin: '6px',
          transition: 'all 0.3s ease',
          boxShadow: '0 0 10px rgba(0,255,255,0.3)',
          cursor: 'pointer'
        }}>
          Insert Anywhere
        </button>
        <br />
        <button onClick={deleteFromStart} style={{
          background: 'linear-gradient(45deg, #ff5252, #ff1744)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '16px',
          padding: '10px 18px',
          margin: '6px',
          transition: 'all 0.3s ease',
          boxShadow: '0 0 10px rgba(255,82,82,0.3)',
          cursor: 'pointer'
        }}>
          Delete Start
        </button>
        <button onClick={deleteFromEnd} style={{
          background: 'linear-gradient(45deg, #ff5252, #ff1744)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '16px',
          padding: '10px 18px',
          margin: '6px',
          transition: 'all 0.3s ease',
          boxShadow: '0 0 10px rgba(255,82,82,0.3)',
          cursor: 'pointer'
        }}>
          Delete End
        </button>
        <button onClick={deleteAtPosition} style={{
          background: 'linear-gradient(45deg, #ff5252, #ff1744)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '16px',
          padding: '10px 18px',
          margin: '6px',
          transition: 'all 0.3s ease',
          boxShadow: '0 0 10px rgba(255,82,82,0.3)',
          cursor: 'pointer'
        }}>
          Delete At
        </button>
        <br />
        <button onClick={traverse} style={{
          background: 'linear-gradient(45deg, #ab47bc, #7b1fa2)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '16px',
          padding: '10px 18px',
          margin: '6px',
          transition: 'all 0.3s ease',
          boxShadow: '0 0 10px rgba(171,71,188,0.3)',
          cursor: 'pointer'
        }}>
          Traverse
        </button>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap',
        marginTop: '30px',
        perspective: '1000px'
      }}>
        {list.map((value, index) => (
          <React.Fragment key={index}>
            <div style={{
              width: '100px',
              height: '60px',
              background: index === highlightIndex 
                ? '#00e676' 
                : 'linear-gradient(145deg, #00bcd4, #008c9e)',
              color: 'white',
              fontSize: '20px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              boxShadow: index === highlightIndex 
                ? '0 0 20px #00ff80' 
                : '0 0 20px #00ffff',
              transform: index === highlightIndex 
                ? 'scale(1.2) rotateX(10deg)' 
                : 'rotateX(15deg) rotateY(15deg)',
              transition: 'transform 0.3s ease'
            }}>
              {value}
            </div>
            {index < list.length - 1 && (
              <div style={{
                fontSize: '30px',
                color: '#00ffff',
                animation: 'blink 1s infinite alternate'
              }}>
                →
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <style>{`
        @keyframes blink {
          from { opacity: 0.4; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LinkedList;
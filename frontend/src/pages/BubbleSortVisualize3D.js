import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const BubbleSortVisualize3D = () => {
  const mountRef = useRef(null);
  const [inputArray, setInputArray] = useState('5,3,8,1,2,9,4');
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });
  const [currentArray, setCurrentArray] = useState([]);
  const [speed, setSpeed] = useState(300);
  
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const barsRef = useRef([]);
  const animationRef = useRef(null);
  const sortingRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 25, 50);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 30, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Grid
    const grid = new THREE.GridHelper(100, 20, 0x1e293b, 0x1e293b);
    scene.add(grid);

    // Controls
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Simple orbit
      camera.position.x = Math.cos(mouseX * 0.5) * 50;
      camera.position.z = Math.sin(mouseX * 0.5) * 50;
      camera.lookAt(0, 0, 0);
      
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('mousemove', onMouseMove);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const createBars = (array) => {
    // Clear existing bars
    barsRef.current.forEach(bar => {
      sceneRef.current.remove(bar);
      bar.geometry.dispose();
      bar.material.dispose();
    });
    barsRef.current = [];

    const spacing = 3;
    const offset = (array.length - 1) * spacing / 2;

    array.forEach((value, index) => {
      const geometry = new THREE.BoxGeometry(1.5, value, 1.5);
      const material = new THREE.MeshStandardMaterial({ 
        color: 0x3b82f6,
        metalness: 0.3,
        roughness: 0.4
      });
      
      const bar = new THREE.Mesh(geometry, material);
      bar.position.set(index * spacing - offset, value / 2, 0);
      bar.castShadow = true;
      bar.receiveShadow = true;
      
      sceneRef.current.add(bar);
      barsRef.current.push(bar);
    });
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const highlightBars = async (i, j, color, duration = 300) => {
    const originalMaterials = [
      barsRef.current[i].material,
      barsRef.current[j].material
    ];
    
    const highlightMaterial = new THREE.MeshStandardMaterial({ 
      color: color,
      metalness: 0.3,
      roughness: 0.4
    });
    
    barsRef.current[i].material = highlightMaterial;
    barsRef.current[j].material = highlightMaterial;
    
    await sleep(duration);
    
    barsRef.current[i].material = originalMaterials[0];
    barsRef.current[j].material = originalMaterials[1];
  };

  const swapBars = async (i, j, duration = 400) => {
    const barA = barsRef.current[i];
    const barB = barsRef.current[j];
    
    const startPosA = barA.position.x;
    const startPosB = barB.position.x;
    
    const steps = 20;
    for (let step = 1; step <= steps; step++) {
      const t = step / steps;
      barA.position.x = startPosA + (startPosB - startPosA) * t;
      barB.position.x = startPosB + (startPosA - startPosB) * t;
      await sleep(duration / steps);
    }
    
    // Swap references
    [barsRef.current[i], barsRef.current[j]] = [barsRef.current[j], barsRef.current[i]];
  };

  const bubbleSortSteps = (arr) => {
    const steps = [];
    const array = [...arr];
    const n = array.length;
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({ type: 'compare', i: j, j: j + 1 });
        if (array[j] > array[j + 1]) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          steps.push({ type: 'swap', i: j, j: j + 1 });
        }
      }
    }
    return steps;
  };

  const visualizeBubbleSort = async () => {
    try {
      setIsRunning(true);
      setIsPaused(false);
      setStats({ comparisons: 0, swaps: 0 });
      
      const array = inputArray.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
      setCurrentArray([...array]);
      createBars(array);
      
      const steps = bubbleSortSteps(array);
      let comparisons = 0, swaps = 0;
      
      sortingRef.current = async () => {
        for (const step of steps) {
          if (!isRunning) break;
          
          while (isPaused) {
            await sleep(100);
          }
          
          if (step.type === 'compare') {
            comparisons++;
            setStats(prev => ({ ...prev, comparisons }));
            await highlightBars(step.i, step.j, 0xfacc15, speed * 0.6);
          } else if (step.type === 'swap') {
            swaps++;
            setStats(prev => ({ ...prev, swaps }));
            await highlightBars(step.i, step.j, 0xef4444, speed * 0.4);
            
            // Update array state
            setCurrentArray(prev => {
              const newArr = [...prev];
              [newArr[step.i], newArr[step.j]] = [newArr[step.j], newArr[step.i]];
              return newArr;
            });
            
            await swapBars(step.i, step.j, speed);
          }
        }
        
        // Mark all as done
        barsRef.current.forEach(bar => {
          bar.material = new THREE.MeshStandardMaterial({ 
            color: 0x22c55e,
            metalness: 0.3,
            roughness: 0.4
          });
        });
        
        setIsRunning(false);
      };
      
      await sortingRef.current();
      
    } catch (error) {
      console.error('Error:', error);
      setIsRunning(false);
    }
  };
  
  const pauseSort = () => {
    setIsPaused(!isPaused);
  };
  
  const stopSort = () => {
    setIsRunning(false);
    setIsPaused(false);
    const array = inputArray.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    createBars(array);
    setStats({ comparisons: 0, swaps: 0 });
  };

  const generateRandom = () => {
    const size = 8;
    const randomArray = Array.from({ length: size }, () => Math.floor(Math.random() * 15) + 1);
    setInputArray(randomArray.join(','));
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '20px',
        borderRadius: '10px',
        color: 'white',
        fontFamily: 'Inter, sans-serif',
        minWidth: '300px'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#3b82f6', fontSize: '20px', fontWeight: '700' }}>🔮 3D Bubble Sort Visualizer</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
            Enter Numbers (comma-separated):
          </label>
          <input
            type="text"
            value={inputArray}
            onChange={(e) => setInputArray(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #374151',
              fontSize: '14px',
              color: '#000000',
              background: '#f9fafb',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            placeholder="e.g. 5,3,8,1,2,9,4"
            disabled={isRunning}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#374151'}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
            Speed: <span style={{ color: '#fbbf24' }}>{speed}ms</span>
          </label>
          <input
            type="range"
            min="50"
            max="1000"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            disabled={isRunning}
            style={{ width: '100%' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' }}>
          <button
            onClick={visualizeBubbleSort}
            disabled={isRunning}
            style={{
              padding: '12px 16px',
              background: isRunning ? '#6b7280' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.2s'
            }}
          >
            {isRunning ? '🔄 Sorting...' : '▶️ Start Sort'}
          </button>
          
          {isRunning && (
            <button
              onClick={pauseSort}
              style={{
                padding: '12px 16px',
                background: isPaused ? '#10b981' : '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              {isPaused ? '▶️ Resume' : '⏸️ Pause'}
            </button>
          )}
          
          <button
            onClick={stopSort}
            disabled={!isRunning}
            style={{
              padding: '12px 16px',
              background: isRunning ? '#ef4444' : '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isRunning ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            ⏹️ Stop
          </button>
          
          <button
            onClick={generateRandom}
            disabled={isRunning}
            style={{
              padding: '12px 16px',
              background: isRunning ? '#6b7280' : 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
          >
            🎲 Random
          </button>
        </div>
        
        <div style={{ 
          background: 'rgba(0, 0, 0, 0.3)', 
          padding: '12px', 
          borderRadius: '8px', 
          marginBottom: '15px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600' }}>
            <div>Comparisons: <span style={{ color: '#fbbf24' }}>{stats.comparisons}</span></div>
            <div>Swaps: <span style={{ color: '#ef4444' }}>{stats.swaps}</span></div>
          </div>
        </div>
        
        {currentArray.length > 0 && (
          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '12px', color: '#d1d5db', marginBottom: '5px' }}>Current Array:</div>
            <div style={{ 
              background: 'rgba(0, 0, 0, 0.3)', 
              padding: '8px', 
              borderRadius: '6px', 
              fontSize: '13px',
              fontFamily: 'monospace',
              color: '#22c55e'
            }}>
              [{currentArray.join(', ')}]
            </div>
          </div>
        )}
        
        <div style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center' }}>
          💡 Move mouse to orbit camera • 🎯 Watch bars animate in real-time
        </div>
      </div>
      
      <a 
        href="/sortingalgorithms"
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
          color: 'white',
          padding: '12px 20px',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600'
        }}
      >
        ← Back to Sorting
      </a>
    </div>
  );
};

export default BubbleSortVisualize3D;
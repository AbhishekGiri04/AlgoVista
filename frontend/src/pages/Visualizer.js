import React from 'react';
import { motion } from 'framer-motion';

const Visualizer = () => {
  const categories = [
    {
      icon: <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>,
      title: 'Sorting Algorithms',
      description: 'Bubble, Selection, Insertion, Merge, Quick, Heap, Counting, Radix',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      shadowColor: 'rgba(102, 126, 234, 0.4)',
      link: '/sortingalgorithms'
    },
    {
      icon: <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/></svg>,
      title: 'Searching Algorithms',
      description: 'Linear, Binary, Jump, Exponential',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      shadowColor: 'rgba(240, 147, 251, 0.4)',
      link: '/searchingalgorithms'
    },
    {
      icon: <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd"/></svg>,
      title: 'Data Structures',
      description: 'Array, Stack, Queue, Linked List, Tree, Graph',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      shadowColor: 'rgba(79, 172, 254, 0.4)',
      link: '/datastructures'
    },
    {
      icon: <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>,
      title: 'Graph Algorithms',
      description: 'DFS, BFS, Dijkstra, Kruskal, Prim\'s, Bellman-Ford, Floyd-Warshall, Topological Sort, Kahn\'s, Kosaraju\'s',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      shadowColor: 'rgba(67, 233, 123, 0.4)',
      link: '/graphalgorithms'
    },
    {
      icon: <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/></svg>,
      title: 'Greedy Algorithms',
      description: 'Huffman Coding, Activity Selection, Fractional Knapsack',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      shadowColor: 'rgba(250, 112, 154, 0.4)',
      link: '/greedyalgorithms'
    },
    {
      icon: <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/></svg>,
      title: 'Dynamic Programming',
      description: 'Longest Common Subsequence (LCS), Matrix Chain Multiplication, 0/1 Knapsack',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      shadowColor: 'rgba(168, 237, 234, 0.4)',
      link: '/dynamicprogramming'
    },
    {
      icon: <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>,
      title: 'Branch and Bound',
      description: 'Travelling Salesman Problem (TSP), Job Scheduling',
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      shadowColor: 'rgba(255, 236, 210, 0.4)',
      link: '/branchandbound'
    },
    {
      icon: <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd"/></svg>,
      title: 'String Algorithms',
      description: 'Naive String, KMP, Rabin-Karp',
      gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      shadowColor: 'rgba(255, 154, 158, 0.4)',
      link: '/stringalgorithms'
    }
  ];

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{
      backgroundImage: 'url(https://static.vecteezy.com/system/resources/previews/006/950/499/non_2x/abstract-technology-background-hi-tech-communication-concept-futuristic-innovation-background-vector.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Serene natural background */}
      <div className="absolute inset-0">
        {/* Soft drifting clouds */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`cloud-${i}`}
            className="absolute opacity-20"
            style={{
              left: `${Math.random() * 120 - 20}%`,
              top: `${Math.random() * 60 + 10}%`,
              width: `${Math.random() * 150 + 100}px`,
              height: `${Math.random() * 60 + 40}px`,
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '50px',
              filter: 'blur(20px)'
            }}
            animate={{
              x: [0, 200],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 30 + Math.random() * 20,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear"
            }}
          />
        ))}
        
        {/* Gentle rain drops */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`rain-${i}`}
            className="absolute w-0.5 h-8 bg-gradient-to-b from-cyan-400/40 to-transparent rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-10%'
            }}
            animate={{
              y: ['0vh', '110vh'],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
          />
        ))}
        
        {/* Water ripples */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`ripple-${i}`}
            className="absolute border border-blue-400/20 rounded-full"
            style={{
              left: '50%',
              top: '70%',
              transform: 'translate(-50%, -50%)'
            }}
            animate={{
              width: ['0px', `${200 + i * 100}px`],
              height: ['0px', `${200 + i * 100}px`],
              opacity: [0.5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 1,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 container mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-black mb-20 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            Algorithm Visualization Platform
          </h1>
        
          <div className="mb-24 flex justify-center" style={{ perspective: '1000px' }}>
            <div style={{
              width: '250px',
              height: '250px',
              position: 'relative',
              transformStyle: 'preserve-3d',
              animation: 'rotateCube 20s infinite linear'
            }}>
              {[
                { text: 'VISUALIZE', color: '#1e1e2f' },
                { text: 'LEARN', color: '#1e1e2f' },
                { text: 'PRACTICE', color: '#1e1e2f' },
                { text: 'MASTER', color: '#1e1e2f' },
                { text: 'IDEATE', color: '#1e1e2f' },
                { text: 'EXPLORE', color: '#1e1e2f' }
              ].map((face, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  width: '250px',
                  height: '250px',
                  background: face.color,
                  border: '3px solid #61dafb',
                  borderRadius: '15px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  color: '#61dafb',
                  boxShadow: '0 0 20px #61dafb',
                  textAlign: 'center',
                  transform: [
                    'rotateY(0deg) translateZ(125px)',
                    'rotateY(90deg) translateZ(125px)',
                    'rotateY(180deg) translateZ(125px)',
                    'rotateY(-90deg) translateZ(125px)',
                    'rotateX(90deg) translateZ(125px)',
                    'rotateX(-90deg) translateZ(125px)'
                  ][i]
                }}>
                  {face.text}
                </div>
              ))}
            </div>
          </div>
          
          <style>{`
            @keyframes rotateCube {
              from { transform: rotateX(0deg) rotateY(0deg); }
              to { transform: rotateX(360deg) rotateY(360deg); }
            }
          `}</style>
        
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Choose a category to explore interactive algorithm visualizations
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl w-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className="relative overflow-hidden rounded-2xl p-8 text-center cursor-pointer backdrop-blur-md border border-white/10"
              style={{
                background: category.gradient,
                boxShadow: `0 10px 20px ${category.shadowColor.replace('0.4', '0.2')}`
              }}
              whileHover={{ 
                y: -5, 
                scale: 1.01,
                boxShadow: `0 15px 30px ${category.shadowColor.replace('0.4', '0.3')}`
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              onClick={() => window.location.href = category.link}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
              
              <motion.div 
                className="mb-6 relative z-10 flex justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {category.icon}
              </motion.div>
              
              <h3 className="text-2xl font-bold mb-4 text-white relative z-10 drop-shadow-lg">
                {category.title}
              </h3>
              
              <p className="text-gray-800 text-sm leading-relaxed relative z-10 font-medium mb-6">
                {category.description}
              </p>
              
              {/* Innovative Action Buttons */}
              <div className="flex flex-col gap-3 justify-center relative z-10">
                <motion.button
                  className="group relative px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-bold text-xs overflow-hidden shadow-lg"
                  whileHover={{ 
                    scale: 1.08,
                    boxShadow: "0 20px 40px rgba(6, 182, 212, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = category.link;
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative">
                    Visualize
                  </span>
                </motion.button>
                
                <motion.button
                  className="group relative px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full text-white font-bold text-xs overflow-hidden shadow-lg"
                  whileHover={{ 
                    scale: 1.08,
                    boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const learnLinks = {
                      'Sorting Algorithms': '/learn/sorting',
                      'Searching Algorithms': '/learn/searching',
                      'Data Structures': '/learn/datastructures',
                      'Graph Algorithms': '/learn/graph',
                      'Greedy Algorithms': '/learn/greedy',
                      'Dynamic Programming': '/learn/dynamic',
                      'Branch and Bound': '/learn/branch',
                      'String Algorithms': '/learn/string'
                    };
                    window.location.href = learnLinks[category.title] || '/learn';
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative">
                    Learn More
                  </span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Visualizer;
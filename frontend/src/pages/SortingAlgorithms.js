import React from 'react';

const SortingAlgorithms = () => {
  const algorithms = [
    {
      name: 'Bubble Sort',
      description: 'Simple comparison-based sorting',
      gradient: 'linear-gradient(135deg, #a8edea, #fed6e3)',
      shadowColor: 'rgba(168, 237, 234, 0.4)',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      bestCase: 'O(n)',
      worstCase: 'O(n²)',
      stable: true,
      inPlace: true,
      details: {
        overview: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in wrong order',
        advantages: ['Simple implementation', 'No additional memory space needed', 'Stable sorting algorithm', 'Can detect if list is already sorted'],
        disadvantages: ['Poor time complexity O(n²)', 'More writes compared to selection sort', 'Not suitable for large datasets', 'Many unnecessary comparisons'],
        useCases: ['Educational purposes', 'Small datasets (n < 50)', 'Nearly sorted data', 'When simplicity is preferred over efficiency']
      }
    },
    {
      name: 'Selection Sort',
      description: 'Find minimum and swap',
      gradient: 'linear-gradient(135deg, #ff9f43, #ff6348)',
      shadowColor: 'rgba(255, 159, 67, 0.4)',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      bestCase: 'O(n²)',
      worstCase: 'O(n²)',
      stable: false,
      inPlace: true,
      details: {
        overview: 'Finds the minimum element and places it at the beginning, then repeats for remaining elements',
        advantages: ['Simple implementation', 'In-place sorting algorithm', 'Minimum number of swaps', 'Performance not affected by initial order'],
        disadvantages: ['Poor time complexity O(n²)', 'Not stable', 'Not adaptive', 'Many comparisons even for sorted data'],
        useCases: ['Small datasets', 'When memory write is costly', 'When simplicity matters', 'Auxiliary memory is limited']
      }
    },
    {
      name: 'Insertion Sort',
      description: 'Insert elements in sorted position',
      gradient: 'linear-gradient(135deg, #feca57, #ff9ff3)',
      shadowColor: 'rgba(254, 202, 87, 0.4)',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      bestCase: 'O(n)',
      worstCase: 'O(n²)',
      stable: true,
      inPlace: true,
      details: {
        overview: 'Builds the final sorted array one item at a time by inserting each element into its correct position',
        advantages: ['Efficient for small datasets', 'Adaptive - efficient for nearly sorted data', 'Stable sorting algorithm', 'In-place sorting'],
        disadvantages: ['Inefficient for large datasets', 'More writes than selection sort', 'O(n²) comparisons and writes', 'Not suitable for large arrays'],
        useCases: ['Small arrays (n < 50)', 'Nearly sorted data', 'Online algorithm - can sort as it receives data', 'Hybrid algorithms (Timsort, Introsort)']
      }
    },
    {
      name: 'Merge Sort',
      description: 'Divide and conquer approach',
      gradient: 'linear-gradient(135deg, #e8d5c4, #f4e4bc)',
      shadowColor: 'rgba(232, 213, 196, 0.4)',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      bestCase: 'O(n log n)',
      worstCase: 'O(n log n)',
      stable: true,
      inPlace: false,
      details: {
        overview: 'Divides array into halves, recursively sorts them, then merges the sorted halves back together',
        advantages: ['Guaranteed O(n log n) time complexity', 'Stable sorting algorithm', 'Predictable performance', 'Good for large datasets'],
        disadvantages: ['Requires O(n) extra space', 'Not in-place', 'Slower than quicksort in practice', 'Not adaptive'],
        useCases: ['Large datasets', 'When stable sort is required', 'External sorting', 'Linked lists sorting']
      }
    },
    {
      name: 'Quick Sort',
      description: 'Pivot-based efficient sorting',
      gradient: 'linear-gradient(135deg, #ff9ff3, #f368e0)',
      shadowColor: 'rgba(255, 159, 243, 0.4)',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(log n)',
      bestCase: 'O(n log n)',
      worstCase: 'O(n²)',
      stable: false,
      inPlace: true,
      details: {
        overview: 'Selects a pivot element and partitions array around it, then recursively sorts the partitions',
        advantages: ['Fast average case O(n log n)', 'In-place sorting', 'Cache efficient', 'Widely used in practice'],
        disadvantages: ['Worst case O(n²)', 'Not stable', 'Poor performance on sorted data', 'Recursive - can cause stack overflow'],
        useCases: ['General purpose sorting', 'Large datasets', 'When average case performance matters', 'System libraries (C++ STL)']
      }
    },
    {
      name: 'Heap Sort',
      description: 'Binary heap-based sorting',
      gradient: 'linear-gradient(135deg, #4834d4, #686de0)',
      shadowColor: 'rgba(72, 52, 212, 0.4)',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(1)',
      bestCase: 'O(n log n)',
      worstCase: 'O(n log n)',
      stable: false,
      inPlace: true,
      details: {
        overview: 'Builds a max heap from the array, then repeatedly extracts the maximum element to build sorted array',
        advantages: ['Guaranteed O(n log n) time', 'In-place sorting', 'Not recursive', 'Good worst-case performance'],
        disadvantages: ['Not stable', 'Poor cache performance', 'Slower than quicksort in practice', 'Complex implementation'],
        useCases: ['When consistent O(n log n) is needed', 'Memory constrained environments', 'Real-time systems', 'Priority queue implementation']
      }
    },
    {
      name: 'Counting Sort',
      description: 'Non-comparison integer sorting',
      gradient: 'linear-gradient(135deg, #d4b5f7, #e8c5e8)',
      shadowColor: 'rgba(212, 181, 247, 0.4)',
      timeComplexity: 'O(n + k)',
      spaceComplexity: 'O(k)',
      bestCase: 'O(n + k)',
      worstCase: 'O(n + k)',
      stable: true,
      inPlace: false,
      details: {
        overview: 'Counts occurrences of each element, then uses this information to place elements in correct positions',
        advantages: ['Linear time complexity O(n + k)', 'Stable sorting algorithm', 'Not comparison-based', 'Efficient for small range of integers'],
        disadvantages: ['Only works with integers', 'Requires extra space O(k)', 'Not suitable for large ranges', 'Not in-place'],
        useCases: ['Integer arrays with small range', 'Counting frequencies', 'Radix sort subroutine', 'When range k is small']
      }
    },
    {
      name: 'Radix Sort',
      description: 'Digit by digit sorting',
      gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
      shadowColor: 'rgba(255, 107, 107, 0.4)',
      timeComplexity: 'O(d × n)',
      spaceComplexity: 'O(n + k)',
      bestCase: 'O(d × n)',
      worstCase: 'O(d × n)',
      stable: true,
      inPlace: false,
      details: {
        overview: 'Sorts integers by processing individual digits, using counting sort as subroutine for each digit position',
        advantages: ['Linear time for fixed-width integers', 'Stable sorting algorithm', 'Not comparison-based', 'Good for large datasets'],
        disadvantages: ['Only works with integers/strings', 'Requires extra space', 'Not in-place', 'Performance depends on number of digits'],
        useCases: ['Large integer arrays', 'Fixed-width data', 'String sorting', 'When comparison is expensive']
      }
    }
  ];

  return (
    <div style={{
      backgroundColor: '#0a0e1a',
      backgroundImage: 'linear-gradient(rgba(10, 14, 26, 0.7), rgba(10, 14, 26, 0.7)), url(https://thumbs.dreamstime.com/b/family-hierarchy-happy-caucasian-parents-little-daughter-standing-together-measuring-each-other-s-height-hand-posing-over-308307823.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      color: 'white',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      margin: 0,
      padding: 0,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <a href="/visualizer" style={{
        position: 'absolute',
        top: '40px',
        left: '40px',
        background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
        color: 'white',
        padding: '14px 24px',
        border: 'none',
        borderRadius: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'none',
        boxShadow: '0 8px 25px rgba(124, 58, 237, 0.4)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        fontSize: '0.95rem'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 12px 35px rgba(124, 58, 237, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 8px 25px rgba(124, 58, 237, 0.4)';
      }}>
        ← Back to Dashboard
      </a>
      
      <div style={{
        textAlign: 'center',
        marginTop: '120px',
        marginBottom: '60px'
      }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: '20px',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
        }}>
        </div>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.02em',
          marginBottom: '1rem'
        }}>
          Sorting Algorithms
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#94a3b8',
          fontWeight: '400',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Explore different sorting techniques and their complexities
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '30px',
        maxWidth: '1000px',
        padding: '0 40px 80px',
        width: '100%'
      }}>
        {algorithms.map((algorithm, index) => (
          <div
            key={index}
            style={{
              background: algorithm.gradient,
              borderRadius: '20px',
              padding: '35px 25px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              boxShadow: `0 4px 15px ${algorithm.shadowColor.replace('0.4', '0.2')}`,
              transform: 'translateY(0) scale(1)',

              border: 'none',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px) scale(1.01)';
              e.target.style.boxShadow = `0 8px 20px ${algorithm.shadowColor.replace('0.4', '0.3')}`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = `0 4px 15px ${algorithm.shadowColor.replace('0.4', '0.2')}`;
            }}
          >

            
            <h3 style={{ 
              margin: '0 0 8px', 
              fontSize: '1.6rem', 
              fontWeight: '800',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              {algorithm.name}
            </h3>
            
            <p style={{ 
              fontSize: '1rem', 
              opacity: 0.95, 
              margin: '0 0 12px',
              fontWeight: '500',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
              color: 'black'
            }}>
              {algorithm.description}
            </p>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: '12px 0',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#2d3748'
            }}>
              <span>Time: {algorithm.timeComplexity}</span>
              <span>Space: {algorithm.spaceComplexity}</span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              margin: '12px 0',
              fontSize: '0.75rem'
            }}>
              {algorithm.stable && (
                <span style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#065f46',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontWeight: '600'
                }}>Stable</span>
              )}
              {algorithm.inPlace && (
                <span style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#1e40af',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontWeight: '600'
                }}>In-place</span>
              )}
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              alignItems: 'center'
            }}>
              <button 
                onClick={() => window.location.href = `/${algorithm.name.toLowerCase().replace(/\s+/g, '')}visualize`}
                style={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                border: 'none',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '120px',
                boxShadow: '0 10px 20px rgba(6, 182, 212, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.08)';
                e.target.style.boxShadow = '0 20px 40px rgba(6, 182, 212, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 10px 20px rgba(6, 182, 212, 0.2)';
              }}>
                Visualize
              </button>
              
              <button 
                onClick={() => window.location.href = `/${algorithm.name.toLowerCase().replace(/\s+/g, '')}code`}
                style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                border: 'none',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '120px',
                boxShadow: '0 10px 20px rgba(139, 92, 246, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.08)';
                e.target.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 10px 20px rgba(139, 92, 246, 0.2)';
              }}>
                Code
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SortingAlgorithms;
import { COLOR, createBaseColors, markAllSorted, sleep } from '../utils/sortingHelpers';

export async function bubbleSortWithVisualization(
  arr, 
  setArray, 
  setColorArray, 
  delay, 
  stopRef, 
  updateStats
) {
  const a = [...arr];
  const n = a.length;
  let comparisons = 0, swaps = 0;

  for (let i = 0; i < n - 1; i++) {
    if (stopRef.current) throw new Error("Stopped");
    
    for (let j = 0; j < n - i - 1; j++) {
      if (stopRef.current) throw new Error("Stopped");
      
      comparisons++;
      
      // Highlight comparing elements
      const colors = createBaseColors(n);
      colors[j] = COLOR.comparing;
      colors[j + 1] = COLOR.comparing;
      
      // Mark already sorted elements
      for (let k = n - i; k < n; k++) {
        colors[k] = COLOR.sorted;
      }
      
      setColorArray([...colors]);
      await sleep(delay);
      
      if (a[j] > a[j + 1]) {
        // Swap elements
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swaps++;
        setArray([...a]);
        
        // Highlight swapping
        const swapColors = createBaseColors(n);
        swapColors[j] = COLOR.swapping;
        swapColors[j + 1] = COLOR.swapping;
        
        // Mark sorted elements
        for (let k = n - i; k < n; k++) {
          swapColors[k] = COLOR.sorted;
        }
        
        setColorArray([...swapColors]);
        await sleep(delay);
      }
      
      updateStats({ comparisons, swaps, time: 0 });
    }
    
    // Mark the newly sorted element
    const passColors = createBaseColors(n);
    for (let k = n - i - 1; k < n; k++) {
      passColors[k] = COLOR.sorted;
    }
    setColorArray([...passColors]);
  }
  
  markAllSorted(n, setColorArray);
  return 0;
}
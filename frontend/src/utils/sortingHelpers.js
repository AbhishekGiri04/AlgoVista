// Sorting visualization utilities
export const COLOR = {
  default: '#3b82f6',
  comparing: '#ef4444',
  swapping: '#f59e0b',
  sorted: '#10b981',
  pivot: '#8b5cf6',
  selected: '#ec4899'
};

export const createBaseColors = (length) => 
  new Array(length).fill(COLOR.default);

export const markAllSorted = (length, setColorArray) => {
  setColorArray(new Array(length).fill(COLOR.sorted));
};

export const sleep = (ms) => 
  new Promise(resolve => setTimeout(resolve, ms));

export const generateRandomArray = (size, min = 10, max = 200) =>
  Array.from({ length: size }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  );

export const validateArray = (arr) => {
  if (!Array.isArray(arr)) return false;
  if (arr.length < 2 || arr.length > 100) return false;
  return arr.every(num => typeof num === 'number' && !isNaN(num));
};
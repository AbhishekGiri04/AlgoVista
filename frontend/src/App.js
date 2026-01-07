import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LoadingPage from './LoadingPage';
import Home from './pages/Home';
import Visualizer from './pages/Visualizer';
import About from './pages/About';
import DataStructures from './pages/DataStructures';
import GraphAlgorithms from './pages/GraphAlgorithms';
import SortingAlgorithms from './pages/SortingAlgorithms';
import SortingLearnMore from './pages/SortingLearnMore';
import SearchingLearnMore from './pages/SearchingLearnMore';
import DataStructuresLearnMore from './pages/DataStructuresLearnMore';
import GraphLearnMore from './pages/GraphLearnMore';
import GreedyLearnMore from './pages/GreedyLearnMore';
import DynamicLearnMore from './pages/DynamicLearnMore';
import BranchLearnMore from './pages/BranchLearnMore';
import StringLearnMore from './pages/StringLearnMore';
import GreedyAlgorithms from './pages/GreedyAlgorithms';
import DynamicProgramming from './pages/DynamicProgramming';
import BranchAndBound from './pages/BranchAndBound';
import StringAlgorithms from './pages/StringAlgorithms';
import SearchingAlgorithms from './pages/SearchingAlgorithms';
import StackVisualizer from './components/StackVisualizer';
import Stack from './pages/Stack';
import Queue from './pages/Queue';
import LinkedList from './pages/LinkedList';
import Tree from './pages/Tree';
import Dijkstra from './pages/Dijkstra';
import Kruskal from './pages/Kruskal';
import Prims from './pages/Prims';
import BubbleSortVisualize from './pages/BubbleSortVisualize';
import BubbleSortCode from './pages/BubbleSortCode';
import SelectionSortVisualize from './pages/SelectionSortVisualize';
import SelectionSortCode from './pages/SelectionSortCode';
import InsertionSortVisualize from './pages/InsertionSortVisualize';
import InsertionSortCode from './pages/InsertionSortCode';
import MergeSortVisualize from './pages/MergeSortVisualize';
import MergeSortCode from './pages/MergeSortCode';
import QuickSortVisualize from './pages/QuickSortVisualize';
import QuickSortCode from './pages/QuickSortCode';
import HeapSortVisualize from './pages/HeapSortVisualize';
import HeapSortCode from './pages/HeapSortCode';
import CountingSortVisualize from './pages/CountingSortVisualize';
import CountingSortCode from './pages/CountingSortCode';
import RadixSortVisualize from './pages/RadixSortVisualize';
import RadixSortCode from './pages/RadixSortCode';
import LinearSearchVisualize from './pages/LinearSearchVisualize';
import LinearSearchCode from './pages/LinearSearchCode';
import BinarySearchVisualize from './pages/BinarySearchVisualize';
import BinarySearchCode from './pages/BinarySearchCode';
import JumpSearchVisualize from './pages/JumpSearchVisualize';
import JumpSearchCode from './pages/JumpSearchCode';
import ExponentialSearchVisualize from './pages/ExponentialSearchVisualize';
import ExponentialSearchCode from './pages/ExponentialSearchCode';
import ArrayVisualize from './pages/ArrayVisualize';
import ArrayCode from './pages/ArrayCode';
import StackVisualize from './pages/StackVisualize';
import StackCode from './pages/StackCode';
import QueueVisualize from './pages/QueueVisualize';
import QueueCode from './pages/QueueCode';
import LinkedListVisualize from './pages/LinkedListVisualize';
import LinkedListCode from './pages/LinkedListCode';
import TreeVisualize from './pages/TreeVisualize';
import TreeCode from './pages/TreeCode';
import GraphVisualize from './pages/GraphVisualize';
import GraphCode from './pages/GraphCode';
import DepthFirstSearchVisualize from './pages/DepthFirstSearchVisualize';
import DepthFirstSearchCode from './pages/DepthFirstSearchCode';
import BreadthFirstSearchVisualize from './pages/BreadthFirstSearchVisualize';
import BreadthFirstSearchCode from './pages/BreadthFirstSearchCode';
import DijkstrasAlgorithmVisualize from './pages/DijkstrasAlgorithmVisualize';
import DijkstrasAlgorithmCode from './pages/DijkstrasAlgorithmCode';
import KruskalsAlgorithmVisualize from './pages/KruskalsAlgorithmVisualize';
import KruskalsAlgorithmCode from './pages/KruskalsAlgorithmCode';
import PrimsAlgorithmVisualize from './pages/PrimsAlgorithmVisualize';
import PrimsAlgorithmCode from './pages/PrimsAlgorithmCode';
import BellmanFordAlgorithmVisualize from './pages/BellmanFordAlgorithmVisualize';
import BellmanFordAlgorithmCode from './pages/BellmanFordAlgorithmCode';
import FloydWarshallAlgorithmVisualize from './pages/FloydWarshallAlgorithmVisualize';
import FloydWarshallAlgorithmCode from './pages/FloydWarshallAlgorithmCode';
import TopologicalSortVisualize from './pages/TopologicalSortVisualize';
import TopologicalSortCode from './pages/TopologicalSortCode';
import KahnsAlgorithmVisualize from './pages/KahnsAlgorithmVisualize';
import KahnsAlgorithmCode from './pages/KahnsAlgorithmCode';
import KosarajusAlgorithmVisualize from './pages/KosarajusAlgorithmVisualize';
import KosarajusAlgorithmCode from './pages/KosarajusAlgorithmCode';
import HuffmanCodingVisualize from './pages/HuffmanCodingVisualize';
import HuffmanCodingCode from './pages/HuffmanCodingCode';
import ActivitySelectionVisualize from './pages/ActivitySelectionVisualize';
import ActivitySelectionCode from './pages/ActivitySelectionCode';
import FractionalKnapsackVisualize from './pages/FractionalKnapsackVisualize';
import FractionalKnapsackCode from './pages/FractionalKnapsackCode';
import LongestCommonSubsequenceVisualize from './pages/LongestCommonSubsequenceVisualize';
import LongestCommonSubsequenceCode from './pages/LongestCommonSubsequenceCode';
import MatrixChainMultiplicationVisualize from './pages/MatrixChainMultiplicationVisualize';
import MatrixChainMultiplicationCode from './pages/MatrixChainMultiplicationCode';
import ZeroOneKnapsackVisualize from './pages/01KnapsackVisualize';
import ZeroOneKnapsackCode from './pages/01KnapsackCode';
import TravellingSalesmanProblemVisualize from './pages/TravellingSalesmanProblemVisualize';
import TravellingSalesmanProblemCode from './pages/TravellingSalesmanProblemCode';
import JobSchedulingVisualize from './pages/JobSchedulingVisualize';
import JobSchedulingCode from './pages/JobSchedulingCode';
import NaiveStringVisualize from './pages/NaiveStringVisualize';
import NaiveStringCode from './pages/NaiveStringCode';
import KMPVisualize from './pages/KMPVisualize';
import KMPCode from './pages/KMPCode';
import RabinKarpVisualize from './pages/RabinKarpVisualize';
import RabinKarpCode from './pages/RabinKarpCode';
import BubbleSortVisualize3D from './pages/BubbleSortVisualize3D';

const AppContent = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(() => {
    // Show loading on page refresh or first load
    const perfEntries = performance.getEntriesByType('navigation');
    const isRefresh = perfEntries.length > 0 && perfEntries[0].type === 'reload';
    const isFirstLoad = !sessionStorage.getItem('appLoaded');
    return isRefresh || isFirstLoad;
  });

  const handleLoadingComplete = () => {
    setIsLoading(false);
    sessionStorage.setItem('appLoaded', 'true');
    navigate('/', { replace: true });
  };

  // Clear the flag when navigating (not refreshing)
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('loadingShown');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  if (isLoading) {
    return <LoadingPage onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/visualizer" element={<Visualizer />} />
      <Route path="/about" element={<About />} />
      <Route path="/datastructures" element={<DataStructures />} />
      <Route path="/graphalgorithms" element={<GraphAlgorithms />} />
      <Route path="/sortingalgorithms" element={<SortingAlgorithms />} />
      <Route path="/sorting-algorithms" element={<SortingAlgorithms />} />
      <Route path="/learn/sorting" element={<SortingLearnMore />} />
      <Route path="/learn/searching" element={<SearchingLearnMore />} />
      <Route path="/learn/datastructures" element={<DataStructuresLearnMore />} />
      <Route path="/learn/graph" element={<GraphLearnMore />} />
      <Route path="/learn/greedy" element={<GreedyLearnMore />} />
      <Route path="/learn/dynamic" element={<DynamicLearnMore />} />
      <Route path="/learn/branch" element={<BranchLearnMore />} />
      <Route path="/learn/string" element={<StringLearnMore />} />
      <Route path="/greedyalgorithms" element={<GreedyAlgorithms />} />
      <Route path="/dynamicprogramming" element={<DynamicProgramming />} />
      <Route path="/branchandbound" element={<BranchAndBound />} />
      <Route path="/stringalgorithms" element={<StringAlgorithms />} />
      <Route path="/searchingalgorithms" element={<SearchingAlgorithms />} />
      <Route path="/stack" element={<Stack />} />
      <Route path="/queue" element={<Queue />} />
      <Route path="/linkedlist" element={<LinkedList />} />
      <Route path="/tree" element={<Tree />} />
      <Route path="/dijkstra" element={<DijkstrasAlgorithmVisualize />} />
      <Route path="/kruskal" element={<KruskalsAlgorithmVisualize />} />
      <Route path="/prims" element={<PrimsAlgorithmVisualize />} />
      <Route path="/bubblesortvisualize" element={<BubbleSortVisualize />} />
      <Route path="/bubblesortcode" element={<BubbleSortCode />} />
      <Route path="/selectionsortvisualize" element={<SelectionSortVisualize />} />
      <Route path="/selectionsortcode" element={<SelectionSortCode />} />
      <Route path="/insertionsortvisualize" element={<InsertionSortVisualize />} />
      <Route path="/insertionsortcode" element={<InsertionSortCode />} />
      <Route path="/mergesortvisualize" element={<MergeSortVisualize />} />
      <Route path="/mergesortcode" element={<MergeSortCode />} />
      <Route path="/quicksortvisualize" element={<QuickSortVisualize />} />
      <Route path="/quicksortcode" element={<QuickSortCode />} />
      <Route path="/heapsortvisualize" element={<HeapSortVisualize />} />
      <Route path="/heapsortcode" element={<HeapSortCode />} />
      <Route path="/countingsortvisualize" element={<CountingSortVisualize />} />
      <Route path="/countingsortcode" element={<CountingSortCode />} />
      <Route path="/radixsortvisualize" element={<RadixSortVisualize />} />
      <Route path="/radixsortcode" element={<RadixSortCode />} />
      <Route path="/linearsearchvisualize" element={<LinearSearchVisualize />} />
      <Route path="/linearsearchcode" element={<LinearSearchCode />} />
      <Route path="/binarysearchvisualize" element={<BinarySearchVisualize />} />
      <Route path="/binarysearchcode" element={<BinarySearchCode />} />
      <Route path="/jumpsearchvisualize" element={<JumpSearchVisualize />} />
      <Route path="/jumpsearchcode" element={<JumpSearchCode />} />
      <Route path="/exponentialsearchvisualize" element={<ExponentialSearchVisualize />} />
      <Route path="/exponentialsearchcode" element={<ExponentialSearchCode />} />
      <Route path="/arrayvisualize" element={<ArrayVisualize />} />
      <Route path="/arraycode" element={<ArrayCode />} />
      <Route path="/stackvisualize" element={<StackVisualize />} />
      <Route path="/stackcode" element={<StackCode />} />
      <Route path="/queuevisualize" element={<QueueVisualize />} />
      <Route path="/queuecode" element={<QueueCode />} />
      <Route path="/linkedlistvisualize" element={<LinkedListVisualize />} />
      <Route path="/linkedlistcode" element={<LinkedListCode />} />
      <Route path="/treevisualize" element={<TreeVisualize />} />
      <Route path="/treecode" element={<TreeCode />} />
      <Route path="/graphvisualize" element={<GraphVisualize />} />
      <Route path="/graphcode" element={<GraphCode />} />
      <Route path="/depthfirstsearchvisualize" element={<DepthFirstSearchVisualize />} />
      <Route path="/depthfirstsearchcode" element={<DepthFirstSearchCode />} />
      <Route path="/breadthfirstsearchvisualize" element={<BreadthFirstSearchVisualize />} />
      <Route path="/breadthfirstsearchcode" element={<BreadthFirstSearchCode />} />
      <Route path="/dijkstrasalgorithmvisualize" element={<DijkstrasAlgorithmVisualize />} />
      <Route path="/dijkstrasalgorithmcode" element={<DijkstrasAlgorithmCode />} />
      <Route path="/kruskalsalgorithmvisualize" element={<KruskalsAlgorithmVisualize />} />
      <Route path="/kruskalsalgorithmcode" element={<KruskalsAlgorithmCode />} />
      <Route path="/primsalgorithmvisualize" element={<PrimsAlgorithmVisualize />} />
      <Route path="/primsalgorithmcode" element={<PrimsAlgorithmCode />} />
      <Route path="/bellmanfordalgorithmvisualize" element={<BellmanFordAlgorithmVisualize />} />
      <Route path="/bellmanfordalgorithmcode" element={<BellmanFordAlgorithmCode />} />
      <Route path="/floydwarshallalgorithmvisualize" element={<FloydWarshallAlgorithmVisualize />} />
      <Route path="/floydwarshallalgorithmcode" element={<FloydWarshallAlgorithmCode />} />
      <Route path="/topologicalsortvisualize" element={<TopologicalSortVisualize />} />
      <Route path="/topologicalsortcode" element={<TopologicalSortCode />} />
      <Route path="/kahnsalgorithmvisualize" element={<KahnsAlgorithmVisualize />} />
      <Route path="/kahnsalgorithmcode" element={<KahnsAlgorithmCode />} />
      <Route path="/kosarajusalgorithmvisualize" element={<KosarajusAlgorithmVisualize />} />
      <Route path="/kosarajusalgorithmcode" element={<KosarajusAlgorithmCode />} />
      <Route path="/huffmancodingvisualize" element={<HuffmanCodingVisualize />} />
      <Route path="/huffmancodingcode" element={<HuffmanCodingCode />} />
      <Route path="/activityselectionvisualize" element={<ActivitySelectionVisualize />} />
      <Route path="/activityselectioncode" element={<ActivitySelectionCode />} />
      <Route path="/fractionalknapsackvisualize" element={<FractionalKnapsackVisualize />} />
      <Route path="/fractionalknapsackcode" element={<FractionalKnapsackCode />} />
      <Route path="/longestcommonsubsequencevisualize" element={<LongestCommonSubsequenceVisualize />} />
      <Route path="/longestcommonsubsequencecode" element={<LongestCommonSubsequenceCode />} />
      <Route path="/matrixchainmultiplicationvisualize" element={<MatrixChainMultiplicationVisualize />} />
      <Route path="/matrixchainmultiplicationcode" element={<MatrixChainMultiplicationCode />} />
      <Route path="/01knapsackvisualize" element={<ZeroOneKnapsackVisualize />} />
      <Route path="/01knapsackcode" element={<ZeroOneKnapsackCode />} />
      <Route path="/travellingsalesmanproblemvisualize" element={<TravellingSalesmanProblemVisualize />} />
      <Route path="/travellingsalesmanproblemcode" element={<TravellingSalesmanProblemCode />} />
      <Route path="/jobschedulingvisualize" element={<JobSchedulingVisualize />} />
      <Route path="/jobschedulingcode" element={<JobSchedulingCode />} />
      <Route path="/naivestringvisualize" element={<NaiveStringVisualize />} />
      <Route path="/naivestringcode" element={<NaiveStringCode />} />
      <Route path="/kmpvisualize" element={<KMPVisualize />} />
      <Route path="/kmpcode" element={<KMPCode />} />
      <Route path="/rabinkarpvisualize" element={<RabinKarpVisualize />} />
      <Route path="/rabinkarpcode" element={<RabinKarpCode />} />
      <Route path="/bubblesort3d" element={<BubbleSortVisualize3D />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
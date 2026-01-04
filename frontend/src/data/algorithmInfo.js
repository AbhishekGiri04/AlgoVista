export const ALGORITHM_INFO = {
  sorting: {
    bubbleSort: {
      name: "Bubble Sort",
      description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      bestCase: "O(n)",
      stable: "Yes"
    },
    quickSort: {
      name: "Quick Sort",
      description: "Divides array into partitions around a pivot element and recursively sorts the partitions.",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(log n)",
      bestCase: "O(n log n)",
      stable: "No"
    },
    mergeSort: {
      name: "Merge Sort",
      description: "Divides array into halves, sorts them separately, then merges the sorted halves.",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(n)",
      bestCase: "O(n log n)",
      stable: "Yes"
    }
  },
  searching: {
    linearSearch: {
      name: "Linear Search",
      description: "Sequentially checks each element until the target is found or the list ends.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      bestCase: "O(1)",
      stable: "N/A"
    },
    binarySearch: {
      name: "Binary Search",
      description: "Repeatedly divides sorted array in half to locate the target element.",
      timeComplexity: "O(log n)",
      spaceComplexity: "O(1)",
      bestCase: "O(1)",
      stable: "N/A"
    }
  }
};

export const ALGORITHM_PSEUDOCODE = {
  bubbleSort: `
ALGORITHM BubbleSort(A)
INPUT: Array A of n elements
OUTPUT: Sorted array A

FOR i = 0 to n-2 DO
    FOR j = 0 to n-i-2 DO
        IF A[j] > A[j+1] THEN
            SWAP A[j] and A[j+1]
        END IF
    END FOR
END FOR
RETURN A`,
  
  quickSort: `
ALGORITHM QuickSort(A, low, high)
INPUT: Array A, indices low and high
OUTPUT: Sorted array A

IF low < high THEN
    pivot = Partition(A, low, high)
    QuickSort(A, low, pivot-1)
    QuickSort(A, pivot+1, high)
END IF`,

  binarySearch: `
ALGORITHM BinarySearch(A, target)
INPUT: Sorted array A, target value
OUTPUT: Index of target or -1

left = 0
right = length(A) - 1

WHILE left <= right DO
    mid = (left + right) / 2
    IF A[mid] = target THEN
        RETURN mid
    ELSE IF A[mid] < target THEN
        left = mid + 1
    ELSE
        right = mid - 1
    END IF
END WHILE
RETURN -1`
};
export type AlgorithmType = 'binary-search' | 'bubble-sort' | 'quick-sort' | 'tree-traversal' | 'graph-traversal' | 'bst-operations';

export interface AlgorithmData {
  id: AlgorithmType;
  title: string;
  category: string;
  description: string;
  pseudoCode: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  steps: string[];
  examples: {
    label: string;
    data: any;
  }[];
}

export const ALGORITHMS: Record<AlgorithmType, AlgorithmData> = {
  'binary-search': {
    id: 'binary-search',
    title: 'Binary Search',
    category: 'Searching',
    description: 'Binary search is an efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item, until you\'ve narrowed down the possible locations to just one.',
    pseudoCode: `function binarySearch(arr, target):
  low = 0
  high = arr.length - 1
  
  while low <= high:
    mid = floor((low + high) / 2)
    if arr[mid] == target:
      return mid
    else if arr[mid] < target:
      low = mid + 1
    else:
      high = mid - 1
      
  return -1`,
    timeComplexity: {
      best: 'O(1)',
      average: 'O(log n)',
      worst: 'O(log n)',
    },
    spaceComplexity: 'O(1)',
    steps: [
      'Initialize low = 0 and high = length - 1',
      'Calculate mid = floor((low + high) / 2)',
      'If arr[mid] equals target, element found!',
      'If arr[mid] < target, search the right half (low = mid + 1)',
      'If arr[mid] > target, search the left half (high = mid - 1)',
      'Repeat until low > high'
    ],
    examples: [
      { label: 'Standard', data: { array: [2, 5, 7, 9, 12, 18, 21, 25, 30, 35, 40], target: 12 } },
      { label: 'Target at Start', data: { array: [2, 5, 7, 9, 12, 18, 21], target: 2 } },
      { label: 'Target at End', data: { array: [2, 5, 7, 9, 12, 18, 21], target: 21 } },
      { label: 'Not Found', data: { array: [2, 5, 7, 9, 12, 18, 21], target: 10 } }
    ]
  },
  'bubble-sort': {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    category: 'Sorting',
    description: 'Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in the wrong order. This process is repeated until the list is sorted.',
    pseudoCode: `function bubbleSort(arr):
  n = arr.length
  for i from 0 to n-1:
    for j from 0 to n-i-1:
      if arr[j] > arr[j+1]:
        swap(arr[j], arr[j+1])`,
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    steps: [
      'Start from the first element',
      'Compare current element with the next one',
      'If current > next, swap them',
      'Move to the next pair',
      'At the end of each pass, the largest element "bubbles up" to its correct position',
      'Repeat for all elements'
    ],
    examples: [
      { label: 'Random', data: [45, 12, 89, 34, 67, 23, 56, 78, 90, 11] },
      { label: 'Reversed', data: [90, 80, 70, 60, 50, 40, 30, 20, 10] },
      { label: 'Nearly Sorted', data: [10, 20, 30, 50, 40, 60, 70, 80, 90] },
      { label: 'Small', data: [5, 2, 9, 1] }
    ]
  },
  'quick-sort': {
    id: 'quick-sort',
    title: 'Quick Sort',
    category: 'Sorting',
    description: 'QuickSort is a Divide and Conquer algorithm. It picks an element as a pivot and partitions the given array around the picked pivot.',
    pseudoCode: `function quickSort(arr, low, high):
  if low < high:
    pivotIndex = partition(arr, low, high)
    quickSort(arr, low, pivotIndex - 1)
    quickSort(arr, pivotIndex + 1, high)

function partition(arr, low, high):
  pivot = arr[high]
  i = low - 1
  for j from low to high-1:
    if arr[j] < pivot:
      i++
      swap(arr[i], arr[j])
  swap(arr[i+1], arr[high])
  return i + 1`,
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(log n)',
    steps: [
      'Pick a pivot element (usually the last element)',
      'Partition the array: elements < pivot to the left, > pivot to the right',
      'Recursively apply to the left subarray',
      'Recursively apply to the right subarray',
      'Combine results'
    ],
    examples: [
      { label: 'Random', data: [45, 12, 89, 34, 67, 23, 56, 78, 90, 11] },
      { label: 'Already Sorted', data: [10, 20, 30, 40, 50, 60, 70, 80, 90] },
      { label: 'Reversed', data: [90, 80, 70, 60, 50, 40, 30, 20, 10] }
    ]
  },
  'tree-traversal': {
    id: 'tree-traversal',
    title: 'Tree Traversal',
    category: 'Trees',
    description: 'Tree traversal (also known as tree search) is a form of graph traversal and refers to the process of visiting each node in a tree data structure, exactly once.',
    pseudoCode: `// Inorder (Left, Root, Right)
function inorder(node):
  if node == null: return
  inorder(node.left)
  visit(node)
  inorder(node.right)

// Preorder (Root, Left, Right)
function preorder(node):
  if node == null: return
  visit(node)
  preorder(node.left)
  preorder(node.right)

// Postorder (Left, Right, Root)
function postorder(node):
  if node == null: return
  postorder(node.left)
  postorder(node.right)
  visit(node)`,
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n)',
      worst: 'O(n)',
    },
    spaceComplexity: 'O(h) where h is height',
    steps: [
      'Start at the root node',
      'Follow the specific order (Inorder, Preorder, or Postorder)',
      'Visit each node exactly once',
      'Use recursion or a stack to keep track of nodes'
    ],
    examples: [
      { 
        label: 'Balanced', 
        data: {
          id: 1, value: 10, x: 0, y: 0,
          left: {
            id: 2, value: 5, x: -80, y: 60,
            left: { id: 4, value: 2, x: -120, y: 120 },
            right: { id: 5, value: 7, x: -40, y: 120 }
          },
          right: {
            id: 3, value: 15, x: 80, y: 60,
            left: { id: 6, value: 12, x: 40, y: 120 },
            right: { id: 7, value: 20, x: 120, y: 120 }
          }
        }
      },
      { 
        label: 'Left Skewed', 
        data: {
          id: 1, value: 10, x: 80, y: 0,
          left: {
            id: 2, value: 5, x: 40, y: 60,
            left: {
              id: 3, value: 2, x: 0, y: 120,
              left: { id: 4, value: 1, x: -40, y: 180 }
            }
          }
        }
      },
      { 
        label: 'Right Skewed', 
        data: {
          id: 1, value: 10, x: -80, y: 0,
          right: {
            id: 2, value: 15, x: -40, y: 60,
            right: {
              id: 3, value: 20, x: 0, y: 120,
              right: { id: 4, value: 25, x: 40, y: 180 }
            }
          }
        }
      }
    ]
  },
  'bst-operations': {
    id: 'bst-operations',
    title: 'BST Operations',
    category: 'Trees',
    description: 'A Binary Search Tree (BST) is a node-based binary tree data structure which has the following properties: The left subtree of a node contains only nodes with keys lesser than the node’s key. The right subtree of a node contains only nodes with keys greater than the node’s key.',
    pseudoCode: `function insert(root, val):
  if root is null: return Node(val)
  if val < root.val: root.left = insert(root.left, val)
  else: root.right = insert(root.right, val)
  return root

function delete(root, val):
  if root is null: return null
  if val < root.val: root.left = delete(root.left, val)
  else if val > root.val: root.right = delete(root.right, val)
  else:
    if root.left is null: return root.right
    if root.right is null: return root.left
    temp = findMin(root.right)
    root.val = temp.val
    root.right = delete(root.right, temp.val)
  return root`,
    timeComplexity: {
      best: 'O(log n)',
      average: 'O(log n)',
      worst: 'O(n)',
    },
    spaceComplexity: 'O(h)',
    steps: [
      'Insertion: Find the correct leaf position based on value comparisons.',
      'Deletion (Leaf): Simply remove the node.',
      'Deletion (1 Child): Replace node with its child.',
      'Deletion (2 Children): Replace with inorder successor (min in right subtree).'
    ],
    examples: [
      { label: 'Empty', data: [] },
      { label: 'Small Tree', data: [10, 5, 15] },
      { label: 'Balanced', data: [20, 10, 30, 5, 15, 25, 35] }
    ]
  },
  'graph-traversal': {
    id: 'graph-traversal',
    title: 'Graph Traversal',
    category: 'Graphs',
    description: 'Graph traversal refers to the process of visiting each vertex in a graph. The two most common methods are Breadth-First Search (BFS) and Depth-First Search (DFS).',
    pseudoCode: `// BFS (Queue based)
function BFS(startNode):
  queue = [startNode]
  visited = {startNode}
  while queue is not empty:
    node = queue.dequeue()
    visit(node)
    for neighbor in node.neighbors:
      if neighbor not in visited:
        visited.add(neighbor)
        queue.enqueue(neighbor)

// DFS (Stack/Recursion based)
function DFS(node, visited = {}):
  visited.add(node)
  visit(node)
  for neighbor in node.neighbors:
    if neighbor not in visited:
      DFS(neighbor, visited)`,
    timeComplexity: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)',
    },
    spaceComplexity: 'O(V)',
    steps: [
      'Start from a source vertex',
      'BFS: Explore neighbors level by level using a Queue',
      'DFS: Explore as far as possible along each branch before backtracking using a Stack/Recursion',
      'Keep track of visited nodes to avoid cycles'
    ],
    examples: [
      { 
        label: 'Standard', 
        data: [
          { id: 0, x: 0, y: -80, neighbors: [1, 2] },
          { id: 1, x: -100, y: 0, neighbors: [0, 3, 4] },
          { id: 2, x: 100, y: 0, neighbors: [0, 5] },
          { id: 3, x: -120, y: 100, neighbors: [1] },
          { id: 4, x: -40, y: 100, neighbors: [1, 5] },
          { id: 5, x: 80, y: 100, neighbors: [2, 4] },
        ]
      },
      { 
        label: 'Cycle', 
        data: [
          { id: 0, x: -80, y: -80, neighbors: [1, 3] },
          { id: 1, x: 80, y: -80, neighbors: [0, 2] },
          { id: 2, x: 80, y: 80, neighbors: [1, 3] },
          { id: 3, x: -80, y: 80, neighbors: [2, 0] },
        ]
      },
      { 
        label: 'Disconnected', 
        data: [
          { id: 0, x: -100, y: -50, neighbors: [1] },
          { id: 1, x: -100, y: 50, neighbors: [0] },
          { id: 2, x: 100, y: -50, neighbors: [3] },
          { id: 3, x: 100, y: 50, neighbors: [2] },
        ]
      }
    ]
  }
};

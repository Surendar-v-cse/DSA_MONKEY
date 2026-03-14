import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../UI/NeoComponents';
import { Plus, Trash2, RotateCcw } from 'lucide-react';

interface BSTNode {
  value: number;
  left?: BSTNode;
  right?: BSTNode;
  id: string;
}

interface PositionedNode extends BSTNode {
  x: number;
  y: number;
}

interface VisualizerProps {
  isPlaying: boolean;
  speed: number;
  step: number;
  setStep: (step: number) => void;
  data?: number[];
}

export default function BSTVisualizer({ isPlaying, speed, step, setStep, data }: VisualizerProps) {
  const [root, setRoot] = useState<BSTNode | undefined>();
  const [inputValue, setInputValue] = useState<string>('');
  const [message, setMessage] = useState<string>('Enter a value to insert into the BST');
  const [highlightNode, setHighlightNode] = useState<string | null>(null);

  // Helper to create a new node
  const createNode = (value: number): BSTNode => ({
    value,
    id: Math.random().toString(36).substr(2, 9),
  });

  // BST Insertion
  const insert = (node: BSTNode | undefined, value: number): BSTNode => {
    if (!node) return createNode(value);
    if (value < node.value) {
      node.left = insert(node.left, value);
    } else if (value > node.value) {
      node.right = insert(node.right, value);
    }
    return node;
  };

  const reset = useCallback(() => {
    setRoot(undefined);
    setStep(0);
    setMessage('Ready');
    
    if (data) {
      let newRoot: BSTNode | undefined = undefined;
      data.forEach(val => {
        newRoot = insert(newRoot, val);
      });
      setRoot(newRoot);
    }
  }, [setStep, data]);

  useEffect(() => {
    reset();
  }, [data, reset]);

  useEffect(() => {
    if (step === 0) reset();
  }, [step, reset]);

  // BST Deletion
  const findMin = (node: BSTNode): BSTNode => {
    let current = node;
    while (current.left) current = current.left;
    return current;
  };

  const remove = (node: BSTNode | undefined, value: number): BSTNode | undefined => {
    if (!node) return undefined;

    if (value < node.value) {
      node.left = remove(node.left, value);
    } else if (value > node.value) {
      node.right = remove(node.right, value);
    } else {
      // Node found
      if (!node.left && !node.right) return undefined;
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      // Two children
      const temp = findMin(node.right);
      node.value = temp.value;
      node.right = remove(node.right, temp.value);
    }
    return node;
  };

  const handleInsert = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    
    // Deep clone to trigger state update
    const newRoot = root ? JSON.parse(JSON.stringify(root)) : undefined;
    setRoot(insert(newRoot, val));
    setInputValue('');
    setMessage(`Inserted ${val}`);
    setHighlightNode(null);
  };

  const handleDelete = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    
    const newRoot = root ? JSON.parse(JSON.stringify(root)) : undefined;
    setRoot(remove(newRoot, val));
    setInputValue('');
    setMessage(`Deleted ${val}`);
    setHighlightNode(null);
  };

  const handleReset = () => {
    setRoot(undefined);
    setMessage('Tree cleared');
  };

  // Calculate positions for visualization
  const getPositions = useCallback(() => {
    const positions: PositionedNode[] = [];
    const levelHeight = 60;
    
    const traverse = (node: BSTNode | undefined, x: number, y: number, offset: number) => {
      if (!node) return;
      
      positions.push({ ...node, x, y });
      
      if (node.left) {
        traverse(node.left, x - offset, y + levelHeight, offset / 2);
      }
      if (node.right) {
        traverse(node.right, x + offset, y + levelHeight, offset / 2);
      }
    };

    traverse(root, 0, 0, 100);
    return positions;
  }, [root]);

  const positionedNodes = useMemo(() => getPositions(), [getPositions]);

  return (
    <div className="w-full h-full flex flex-col items-center gap-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 bg-white border-4 border-black p-4 shadow-neo-sm z-10">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Value"
          className="neo-input w-24"
          onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
        />
        <Button variant="accent" size="sm" onClick={handleInsert} className="flex items-center gap-2">
          <Plus size={16} /> Insert
        </Button>
        <Button variant="outline" size="sm" onClick={handleDelete} className="flex items-center gap-2">
          <Trash2 size={16} /> Delete
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw size={16} />
        </Button>
      </div>

      {/* Visualization */}
      <div className="flex-1 w-full flex items-center justify-center bg-neo-gray/30 border-4 border-black border-dashed relative overflow-hidden">
        <svg width="100%" height="100%" viewBox="-250 -20 500 300" className="overflow-visible">
          <AnimatePresence>
            {/* Render Edges first */}
            {positionedNodes.map(node => (
              <React.Fragment key={`edge-${node.id}`}>
                {node.left && (
                  <motion.line
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    x1={node.x} y1={node.y}
                    x2={positionedNodes.find(n => n.id === node.left?.id)?.x || node.x}
                    y2={positionedNodes.find(n => n.id === node.left?.id)?.y || node.y}
                    stroke="black" strokeWidth="3"
                  />
                )}
                {node.right && (
                  <motion.line
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    x1={node.x} y1={node.y}
                    x2={positionedNodes.find(n => n.id === node.right?.id)?.x || node.x}
                    y2={positionedNodes.find(n => n.id === node.right?.id)?.y || node.y}
                    stroke="black" strokeWidth="3"
                  />
                )}
              </React.Fragment>
            ))}

            {/* Render Nodes */}
            {positionedNodes.map(node => (
              <motion.g
                key={node.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="20"
                  className="fill-white stroke-black stroke-[3]"
                />
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dy=".3em"
                  className="font-display font-black text-xs pointer-events-none"
                >
                  {node.value}
                </text>
              </motion.g>
            ))}
          </AnimatePresence>
        </svg>

        {/* Empty State */}
        {!root && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="font-mono text-gray-400 uppercase tracking-widest animate-pulse">
              [ Tree is empty ]
            </p>
          </div>
        )}
      </div>

      {/* Status */}
      <div className="w-full bg-neo-black p-3 border-4 border-black shadow-neo-sm">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-neo-green" />
          <p className="font-mono text-neo-green text-xs uppercase tracking-wider">
            {`LOG: ${message}`}
          </p>
        </div>
      </div>
    </div>
  );
}

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

  const createNode = (value: number): BSTNode => ({
    value,
    id: Math.random().toString(36).substr(2, 9),
  });

  const insert = (node: BSTNode | undefined, value: number): BSTNode => {
    if (!node) return createNode(value);
    if (value < node.value) node.left = insert(node.left, value);
    else if (value > node.value) node.right = insert(node.right, value);
    return node;
  };

  const reset = useCallback(() => {
    setRoot(undefined);
    setStep(0);
    setMessage('Ready');
    if (data) {
      let newRoot: BSTNode | undefined = undefined;
      data.forEach(val => { newRoot = insert(newRoot, val); });
      setRoot(newRoot);
    }
  }, [setStep, data]);

  useEffect(() => { reset(); }, [data, reset]);
  useEffect(() => { if (step === 0) reset(); }, [step, reset]);

  const findMin = (node: BSTNode): BSTNode => {
    let current = node;
    while (current.left) current = current.left;
    return current;
  };

  const remove = (node: BSTNode | undefined, value: number): BSTNode | undefined => {
    if (!node) return undefined;
    if (value < node.value) node.left = remove(node.left, value);
    else if (value > node.value) node.right = remove(node.right, value);
    else {
      if (!node.left && !node.right) return undefined;
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      const temp = findMin(node.right!);
      node.value = temp.value;
      node.right = remove(node.right, temp.value);
    }
    return node;
  };

  const handleInsert = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    const newRoot = root ? JSON.parse(JSON.stringify(root)) : undefined;
    setRoot(insert(newRoot, val));
    setInputValue('');
    setMessage(`Inserted ${val}`);
  };

  const handleDelete = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    const newRoot = root ? JSON.parse(JSON.stringify(root)) : undefined;
    setRoot(remove(newRoot, val));
    setInputValue('');
    setMessage(`Deleted ${val}`);
  };

  const handleReset = () => {
    setRoot(undefined);
    setMessage('Tree cleared');
  };

  const getPositions = useCallback(() => {
    const positions: PositionedNode[] = [];
    const levelHeight = 55;
    const traverse = (node: BSTNode | undefined, x: number, y: number, offset: number) => {
      if (!node) return;
      positions.push({ ...node, x, y });
      if (node.left) traverse(node.left, x - offset, y + levelHeight, offset / 2);
      if (node.right) traverse(node.right, x + offset, y + levelHeight, offset / 2);
    };
    traverse(root, 0, 0, 90);
    return positions;
  }, [root]);

  const positionedNodes = useMemo(() => getPositions(), [getPositions]);

  return (
    <div className="w-full h-full flex flex-col items-center gap-3 sm:gap-6">

      {/* Controls — wrap on mobile */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 bg-white border-2 sm:border-4 border-black p-2 sm:p-4 shadow-neo-xs sm:shadow-neo-sm z-10 w-full sm:w-auto justify-center">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Value"
          className="neo-input w-20 sm:w-24 text-sm"
          onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
        />
        <Button variant="accent" size="sm" onClick={handleInsert} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
          <Plus size={14} /> Insert
        </Button>
        <Button variant="outline" size="sm" onClick={handleDelete} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
          <Trash2 size={14} /> Delete
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw size={14} />
        </Button>
      </div>

      {/* SVG Tree */}
      <div className="flex-1 w-full flex items-center justify-center bg-neo-gray/30 border-2 sm:border-4 border-black border-dashed relative overflow-hidden min-h-[160px] sm:min-h-[220px]">
        <svg
          viewBox="-220 -25 440 260"
          className="w-full h-full max-h-[200px] sm:max-h-[280px] overflow-visible"
          preserveAspectRatio="xMidYMid meet"
        >
          <AnimatePresence>
            {/* Edges */}
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
                    stroke="black" strokeWidth="2.5"
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
                    stroke="black" strokeWidth="2.5"
                  />
                )}
              </React.Fragment>
            ))}

            {/* Nodes */}
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
                  cx={node.x} cy={node.y} r="18"
                  className="fill-white stroke-black stroke-[2.5]"
                />
                <text
                  x={node.x} y={node.y}
                  textAnchor="middle" dy=".35em"
                  fontSize="10"
                  fontWeight="900"
                  className="pointer-events-none"
                >
                  {node.value}
                </text>
              </motion.g>
            ))}
          </AnimatePresence>
        </svg>

        {!root && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="font-mono text-gray-400 text-xs uppercase tracking-widest animate-pulse">
              [ Tree is empty ]
            </p>
          </div>
        )}
      </div>

      {/* Status */}
      <div className="w-full bg-neo-black p-2 sm:p-3 border-2 sm:border-4 border-black shadow-neo-xs sm:shadow-neo-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-2 h-2 rounded-full bg-neo-green shrink-0" />
          <p className="font-mono text-neo-green text-[10px] sm:text-xs uppercase tracking-wider truncate">
            {`LOG: ${message}`}
          </p>
        </div>
      </div>
    </div>
  );
}
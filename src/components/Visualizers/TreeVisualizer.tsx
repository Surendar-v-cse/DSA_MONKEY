import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';

interface VisualizerProps {
  isPlaying: boolean;
  speed: number;
  step: number;
  setStep: (step: number) => void;
  data?: TreeNode;
}

interface TreeNode {
  id: number;
  value: number;
  left?: TreeNode;
  right?: TreeNode;
  x: number;
  y: number;
}

const DEFAULT_TREE: TreeNode = {
  id: 1, value: 10, x: 0, y: 0,
  left: {
    id: 2, value: 5, x: -80, y: 60,
    left: { id: 4, value: 2, x: -120, y: 120 },
    right: { id: 5, value: 7, x: -40, y: 120 },
  },
  right: {
    id: 3, value: 15, x: 80, y: 60,
    left: { id: 6, value: 12, x: 40, y: 120 },
    right: { id: 7, value: 20, x: 120, y: 120 },
  },
};

export default function TreeVisualizer({ isPlaying, speed, step, setStep, data }: VisualizerProps) {
  const currentTree = data || DEFAULT_TREE;
  const [traversalType, setTraversalType] = useState<'inorder' | 'preorder' | 'postorder'>('inorder');
  const [visitedNodes, setVisitedNodes] = useState<number[]>([]);
  const [currentNode, setCurrentNode] = useState<number | null>(null);
  const [traversalOrder, setTraversalOrder] = useState<{ id: number; action: string }[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [currentAction, setCurrentAction] = useState('');

  const getTraversalOrder = useCallback((type: string, tree: TreeNode) => {
    const order: { id: number; action: string }[] = [];
    const traverse = (node?: TreeNode) => {
      if (!node) return;
      if (type === 'preorder') order.push({ id: node.id, action: `Visit Root: ${node.value}` });
      if (node.left) {
        order.push({ id: node.id, action: `Go Left from ${node.value}` });
        traverse(node.left);
        order.push({ id: node.id, action: `Back to ${node.value} from Left` });
      } else {
        order.push({ id: node.id, action: `${node.value} has no Left child` });
      }
      if (type === 'inorder') order.push({ id: node.id, action: `Visit Root: ${node.value}` });
      if (node.right) {
        order.push({ id: node.id, action: `Go Right from ${node.value}` });
        traverse(node.right);
        order.push({ id: node.id, action: `Back to ${node.value} from Right` });
      } else {
        order.push({ id: node.id, action: `${node.value} has no Right child` });
      }
      if (type === 'postorder') order.push({ id: node.id, action: `Visit Root: ${node.value}` });
    };
    traverse(tree);
    return order;
  }, []);

  const reset = useCallback(() => {
    setVisitedNodes([]);
    setCurrentNode(null);
    setIsDone(false);
    setStep(0);
    setCurrentAction('Ready to start traversal');
    setTraversalOrder(getTraversalOrder(traversalType, currentTree));
  }, [traversalType, getTraversalOrder, setStep, currentTree]);

  useEffect(() => { reset(); }, [traversalType, reset, data]);
  useEffect(() => { if (step === 0) reset(); }, [step, reset]);

  useEffect(() => {
    if (!isPlaying || isDone) return;
    const timer = setTimeout(() => {
      if (step < traversalOrder.length) {
        const nextStep = traversalOrder[step];
        setCurrentNode(nextStep.id);
        setCurrentAction(nextStep.action);
        if (nextStep.action.startsWith('Visit')) {
          setVisitedNodes(prev => [...prev, nextStep.id]);
        }
        setStep(step + 1);
      } else {
        setIsDone(true);
        setCurrentNode(null);
        setCurrentAction('Traversal Complete');
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [isPlaying, isDone, speed, step, traversalOrder, setStep]);

  const renderNode = (node: TreeNode) => {
    const isActive = currentNode === node.id;
    const isVisited = visitedNodes.includes(node.id);

    return (
      <g key={node.id}>
        {node.left && (
          <line
            x1={node.x} y1={node.y}
            x2={node.left.x} y2={node.left.y}
            stroke="black" strokeWidth="3"
          />
        )}
        {node.right && (
          <line
            x1={node.x} y1={node.y}
            x2={node.right.x} y2={node.right.y}
            stroke="black" strokeWidth="3"
          />
        )}
        <motion.g
          initial={false}
          animate={{ scale: isActive ? 1.2 : 1 }}
          style={{ transformOrigin: `${node.x}px ${node.y}px` }}
        >
          <circle
            cx={node.x} cy={node.y} r="22"
            className={`stroke-black stroke-[3] transition-colors ${isActive ? 'fill-neo-yellow' : isVisited ? 'fill-neo-green' : 'fill-white'}`}
          />
          <text
            x={node.x} y={node.y}
            textAnchor="middle" dy=".35em"
            fontSize="11"
            fontWeight="900"
            className="pointer-events-none"
          >
            {node.value}
          </text>
        </motion.g>
        {node.left && renderNode(node.left)}
        {node.right && renderNode(node.right)}
      </g>
    );
  };

  return (
    <div className="w-full h-full flex flex-col items-center gap-3 sm:gap-8">
      {/* Traversal type buttons */}
      <div className="flex gap-1 sm:gap-4 bg-white border-2 sm:border-4 border-black p-1 sm:p-2 shadow-neo-xs sm:shadow-neo-sm">
        {(['inorder', 'preorder', 'postorder'] as const).map(type => (
          <button
            key={type}
            onClick={() => setTraversalType(type)}
            className={`
              px-2 sm:px-4 py-1 font-mono font-bold text-[9px] sm:text-xs uppercase border-2 border-black transition-all
              ${traversalType === type ? 'bg-neo-blue text-white shadow-neo-xs -translate-y-0.5 sm:-translate-y-1' : 'bg-white hover:bg-gray-100'}
            `}
          >
            {type}
          </button>
        ))}
      </div>

      {/* SVG — scales to container */}
      <div className="flex-1 w-full flex items-center justify-center">
        <svg
          viewBox="-160 -30 320 190"
          className="w-full h-full max-h-[220px] sm:max-h-[300px] overflow-visible"
          preserveAspectRatio="xMidYMid meet"
        >
          {renderNode(currentTree)}
        </svg>
      </div>

      {/* Status bar */}
      <div className="w-full bg-neo-black p-2 sm:p-4 border-2 sm:border-4 border-black shadow-neo-xs sm:shadow-neo-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-2 h-2 rounded-full bg-neo-green animate-pulse shrink-0" />
          <p className="font-mono text-neo-green text-[10px] sm:text-sm uppercase tracking-wider truncate">
            {`ACTION: ${currentAction}`}
          </p>
        </div>
        <div className="mt-1 flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {visitedNodes.map((id, idx) => {
            const findVal = (n: TreeNode): number | undefined => {
              if (n.id === id) return n.value;
              return (n.left && findVal(n.left)) || (n.right && findVal(n.right));
            };
            return (
              <div key={idx} className="bg-neo-green border-2 border-black px-1.5 py-0.5 text-[9px] sm:text-[10px] font-black shrink-0">
                {findVal(currentTree)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
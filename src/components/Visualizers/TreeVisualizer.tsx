import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  id: 1, value: 10,
  x: 0, y: 0,
  left: {
    id: 2, value: 5,
    x: -80, y: 60,
    left: { id: 4, value: 2, x: -120, y: 120 },
    right: { id: 5, value: 7, x: -40, y: 120 }
  },
  right: {
    id: 3, value: 15,
    x: 80, y: 60,
    left: { id: 6, value: 12, x: 40, y: 120 },
    right: { id: 7, value: 20, x: 120, y: 120 }
  }
};

export default function TreeVisualizer({ isPlaying, speed, step, setStep, data }: VisualizerProps) {
  const currentTree = data || DEFAULT_TREE;
  const [traversalType, setTraversalType] = useState<'inorder' | 'preorder' | 'postorder'>('inorder');
  const [visitedNodes, setVisitedNodes] = useState<number[]>([]);
  const [currentNode, setCurrentNode] = useState<number | null>(null);
  const [traversalOrder, setTraversalOrder] = useState<{id: number, action: string}[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [currentAction, setCurrentAction] = useState('');

  const getTraversalOrder = useCallback((type: string, tree: TreeNode) => {
    const order: {id: number, action: string}[] = [];
    const traverse = (node?: TreeNode) => {
      if (!node) return;
      
      if (type === 'preorder') {
        order.push({ id: node.id, action: `Visit Root: ${node.value}` });
      }
      
      if (node.left) {
        order.push({ id: node.id, action: `Go Left from ${node.value}` });
        traverse(node.left);
        order.push({ id: node.id, action: `Back to ${node.value} from Left` });
      } else {
        order.push({ id: node.id, action: `${node.value} has no Left child` });
      }

      if (type === 'inorder') {
        order.push({ id: node.id, action: `Visit Root: ${node.value}` });
      }

      if (node.right) {
        order.push({ id: node.id, action: `Go Right from ${node.value}` });
        traverse(node.right);
        order.push({ id: node.id, action: `Back to ${node.value} from Right` });
      } else {
        order.push({ id: node.id, action: `${node.value} has no Right child` });
      }

      if (type === 'postorder') {
        order.push({ id: node.id, action: `Visit Root: ${node.value}` });
      }
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

  useEffect(() => {
    reset();
  }, [traversalType, reset, data]);

  useEffect(() => {
    if (step === 0) reset();
  }, [step, reset]);

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
        {/* Lines to children */}
        {node.left && (
          <line 
            x1={node.x} y1={node.y} 
            x2={node.left.x} y2={node.left.y} 
            stroke="black" strokeWidth="4" 
            className={isActive && traversalOrder[step-1]?.action.includes('Left') ? 'stroke-neo-blue' : 'stroke-black'}
          />
        )}
        {node.right && (
          <line 
            x1={node.x} y1={node.y} 
            x2={node.right.x} y2={node.right.y} 
            stroke="black" strokeWidth="4" 
            className={isActive && traversalOrder[step-1]?.action.includes('Right') ? 'stroke-neo-blue' : 'stroke-black'}
          />
        )}
        
        {/* Node Circle */}
        <motion.g
          initial={false}
          animate={{
            scale: isActive ? 1.2 : 1,
          }}
          style={{ transformOrigin: `${node.x}px ${node.y}px` }}
        >
          <circle
            cx={node.x} cy={node.y} r="25"
            className={`
              border-4 stroke-black stroke-[4] transition-colors
              ${isActive ? 'fill-neo-yellow' : isVisited ? 'fill-neo-green' : 'fill-white'}
            `}
          />
          <text
            x={node.x} y={node.y}
            textAnchor="middle" dy=".3em"
            className="font-display font-black text-sm pointer-events-none"
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
    <div className="w-full h-full flex flex-col items-center gap-8">
      <div className="flex gap-4 bg-white border-4 border-black p-2 shadow-neo-sm">
        {(['inorder', 'preorder', 'postorder'] as const).map(type => (
          <button
            key={type}
            onClick={() => setTraversalType(type)}
            className={`
              px-4 py-1 font-mono font-bold text-xs uppercase border-2 border-black transition-all
              ${traversalType === type ? 'bg-neo-blue text-white shadow-neo-sm -translate-y-1' : 'bg-white hover:bg-gray-100'}
            `}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="flex-1 w-full flex items-center justify-center">
        <svg width="400" height="300" viewBox="-200 -20 400 200" className="overflow-visible">
          {renderNode(currentTree)}
        </svg>
      </div>

      <div className="w-full bg-neo-black p-4 border-4 border-black shadow-neo-sm">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-neo-green animate-pulse" />
          <p className="font-mono text-neo-green text-sm uppercase tracking-wider">
            {`ACTION: ${currentAction}`}
          </p>
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {visitedNodes.map((id, idx) => {
            const findVal = (n: TreeNode): number | undefined => {
              if (n.id === id) return n.value;
              return (n.left && findVal(n.left)) || (n.right && findVal(n.right));
            };
            return (
              <div key={idx} className="bg-neo-green border-2 border-black px-2 py-1 text-[10px] font-black shrink-0">
                {findVal(currentTree)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

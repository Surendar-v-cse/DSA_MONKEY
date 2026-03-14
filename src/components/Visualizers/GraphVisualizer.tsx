import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';

interface VisualizerProps {
  isPlaying: boolean;
  speed: number;
  step: number;
  setStep: (step: number) => void;
  data?: Node[];
}

interface Node {
  id: number;
  x: number;
  y: number;
  neighbors: number[];
}

const DEFAULT_GRAPH: Node[] = [
  { id: 0, x: 0, y: -80, neighbors: [1, 2] },
  { id: 1, x: -100, y: 0, neighbors: [0, 3, 4] },
  { id: 2, x: 100, y: 0, neighbors: [0, 5] },
  { id: 3, x: -120, y: 100, neighbors: [1] },
  { id: 4, x: -40, y: 100, neighbors: [1, 5] },
  { id: 5, x: 80, y: 100, neighbors: [2, 4] },
];

export default function GraphVisualizer({ isPlaying, speed, step, setStep, data }: VisualizerProps) {
  const currentGraph = data || DEFAULT_GRAPH;
  const [traversalType, setTraversalType] = useState<'bfs' | 'dfs'>('bfs');
  const [visitedNodes, setVisitedNodes] = useState<number[]>([]);
  const [currentNode, setCurrentNode] = useState<number | null>(null);
  const [traversalOrder, setTraversalOrder] = useState<number[]>([]);
  const [isDone, setIsDone] = useState(false);

  const getTraversalOrder = useCallback((type: 'bfs' | 'dfs', graph: Node[]) => {
    const order: number[] = [];
    const visited = new Set<number>();
    
    if (type === 'bfs') {
      const queue = [0];
      visited.add(0);
      while (queue.length > 0) {
        const nodeIdx = queue.shift()!;
        order.push(nodeIdx);
        const node = graph[nodeIdx];
        for (const neighbor of node.neighbors) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
    } else {
      const dfs = (nodeIdx: number) => {
        visited.add(nodeIdx);
        order.push(nodeIdx);
        const node = graph[nodeIdx];
        for (const neighbor of node.neighbors) {
          if (!visited.has(neighbor)) {
            dfs(neighbor);
          }
        }
      };
      dfs(0);
    }
    return order;
  }, []);

  const reset = useCallback(() => {
    setVisitedNodes([]);
    setCurrentNode(null);
    setIsDone(false);
    setStep(0);
    setTraversalOrder(getTraversalOrder(traversalType, currentGraph));
  }, [traversalType, getTraversalOrder, setStep, currentGraph]);

  useEffect(() => {
    reset();
  }, [data, traversalType, reset]);

  useEffect(() => {
    reset();
  }, [traversalType, reset]);

  useEffect(() => {
    if (step === 0) reset();
  }, [step, reset]);

  useEffect(() => {
    if (!isPlaying || isDone) return;

    const timer = setTimeout(() => {
      if (step < traversalOrder.length) {
        const nextNodeId = traversalOrder[step];
        setCurrentNode(nextNodeId);
        setVisitedNodes(prev => [...prev, nextNodeId]);
        setStep(step + 1);
      } else {
        setIsDone(true);
        setCurrentNode(null);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, isDone, speed, step, traversalOrder, setStep]);

  return (
    <div className="w-full h-full flex flex-col items-center gap-8">
      <div className="flex gap-4 bg-white border-4 border-black p-2 shadow-neo-sm">
        {(['bfs', 'dfs'] as const).map(type => (
          <button
            key={type}
            onClick={() => setTraversalType(type)}
            className={`
              px-4 py-1 font-mono font-bold text-xs uppercase border-2 border-black transition-all
              ${traversalType === type ? 'bg-neo-blue text-white shadow-neo-sm -translate-y-1' : 'bg-white hover:bg-gray-100'}
            `}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex-1 w-full flex items-center justify-center">
        <svg width="400" height="300" viewBox="-200 -120 400 240" className="overflow-visible">
          {/* Edges */}
          {currentGraph.map(node => (
            node.neighbors.map(neighborIdx => {
              const neighbor = currentGraph[neighborIdx];
              if (neighborIdx < node.id) return null; // Avoid double lines
              return (
                <line
                  key={`${node.id}-${neighborIdx}`}
                  x1={node.x} y1={node.y}
                  x2={neighbor.x} y2={neighbor.y}
                  stroke="black" strokeWidth="4"
                  strokeDasharray={visitedNodes.includes(node.id) && visitedNodes.includes(neighborIdx) ? "0" : "8 4"}
                  className="transition-all duration-500"
                />
              );
            })
          ))}

          {/* Nodes */}
          {currentGraph.map(node => {
            const isActive = currentNode === node.id;
            const isVisited = visitedNodes.includes(node.id);

            return (
              <motion.g
                key={node.id}
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
                  {node.id}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      <div className="w-full bg-neo-black p-4 border-4 border-black shadow-neo-sm">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-neo-green animate-pulse" />
          <p className="font-mono text-neo-green text-sm uppercase tracking-wider">
            {`VISITED: ${visitedNodes.join(' → ')}`}
          </p>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';

interface VisualizerProps {
  isPlaying: boolean;
  speed: number;
  step: number;
  setStep: (step: number) => void;
  data?: number[];
}

const DEFAULT_DATA = [45, 12, 89, 34, 67, 23, 56, 78, 90, 11];

export default function QuickSortVisualizer({ isPlaying, speed, step, setStep, data }: VisualizerProps) {
  const [array, setArray] = useState([...(data || DEFAULT_DATA)]);
  const [pivotIdx, setPivotIdx] = useState(-1);
  const [comparingIdx, setComparingIdx] = useState<[number, number]>([-1, -1]);
  const [sortedIdxs, setSortedIdxs] = useState<Set<number>>(new Set());
  const [isDone, setIsDone] = useState(false);
  const [status, setStatus] = useState('Ready');
  
  const generatorRef = useRef<Generator | null>(null);

  // QuickSort Generator to allow stepping
  function* quickSortGenerator(arr: number[], low: number, high: number): Generator {
    if (low < high) {
      const p = yield* partition(arr, low, high);
      yield* quickSortGenerator(arr, low, p - 1);
      yield* quickSortGenerator(arr, p + 1, high);
    } else if (low === high) {
      setSortedIdxs(prev => new Set([...prev, low]));
    }
  }

  function* partition(arr: number[], low: number, high: number): Generator<any, number> {
    const pivot = arr[high];
    setPivotIdx(high);
    setStatus(`Picking pivot: ${pivot}`);
    yield;

    let i = low - 1;
    for (let j = low; j < high; j++) {
      setComparingIdx([i + 1, j]);
      setStatus(`Comparing ${arr[j]} with pivot ${pivot}`);
      yield;
      
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        setStatus(`Swapping ${arr[i]} and ${arr[j]}`);
        yield;
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    setSortedIdxs(prev => new Set([...prev, i + 1]));
    setStatus(`Pivot ${pivot} in correct position`);
    yield;
    
    return i + 1;
  }

  const reset = useCallback(() => {
    const newArr = [...(data || DEFAULT_DATA)];
    setArray(newArr);
    setPivotIdx(-1);
    setComparingIdx([-1, -1]);
    setSortedIdxs(new Set());
    setIsDone(false);
    setStatus('Ready');
    setStep(0);
    generatorRef.current = quickSortGenerator(newArr, 0, newArr.length - 1);
  }, [setStep, data]);

  useEffect(() => {
    reset();
  }, [data, reset]);

  useEffect(() => {
    if (step === 0) reset();
  }, [step, reset]);

  useEffect(() => {
    if (!isPlaying || isDone || !generatorRef.current) return;

    const timer = setTimeout(() => {
      const result = generatorRef.current?.next();
      if (result?.done) {
        setIsDone(true);
        setPivotIdx(-1);
        setComparingIdx([-1, -1]);
        setStatus('Sorting Complete');
      }
      setStep(step + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, isDone, speed, step, setStep]);

  const maxVal = Math.max(...(data || DEFAULT_DATA));

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-6 sm:gap-12">
      <div className="flex items-end justify-center gap-1 sm:gap-2 h-48 sm:h-64 w-full px-2">
        {array.map((val, idx) => {
          const isPivot = idx === pivotIdx;
          const isComparing = comparingIdx.includes(idx);
          const isSorted = sortedIdxs.has(idx) || isDone;
          const height = (val / maxVal) * 100;

          return (
            <div key={idx} className="flex flex-col items-center gap-1 sm:gap-2 flex-1 min-w-[12px] max-w-[60px]">
              <motion.div
                layout
                className={`
                  w-full border-2 sm:border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-neo-sm transition-colors relative
                  ${isPivot ? 'bg-neo-yellow' : isComparing ? 'bg-neo-red text-white' : isSorted ? 'bg-neo-green' : 'bg-neo-blue'}
                `}
                style={{ height: `${height}%` }}
                animate={{
                  scale: isPivot || isComparing ? 1.1 : 1,
                  y: isPivot ? -5 : 0,
                }}
              >
                <div className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 font-mono font-bold text-[8px] sm:text-xs">
                  {val}
                </div>
              </motion.div>
              <span className="font-mono text-[8px] sm:text-[10px] text-gray-400 hidden xs:block">{idx}</span>
            </div>
          );
        })}
      </div>

      <div className="w-full bg-neo-black p-3 sm:p-4 border-4 border-black shadow-neo-sm">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-neo-yellow animate-pulse" />
          <p className="font-mono text-neo-yellow text-xs sm:text-sm uppercase tracking-wider truncate">
            {`STATUS: ${status}`}
          </p>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[8px] sm:text-[10px] font-mono text-neo-white/50">
          <span>PIVOT_INDEX: {pivotIdx === -1 ? 'N/A' : pivotIdx}</span>
          <span>SORTED_COUNT: {sortedIdxs.size}</span>
          <span>ARRAY_SIZE: {array.length}</span>
        </div>
      </div>
    </div>
  );
}

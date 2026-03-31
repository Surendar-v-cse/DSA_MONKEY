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
    setStatus(`Pivot: ${pivot}`);
    yield;

    let i = low - 1;
    for (let j = low; j < high; j++) {
      setComparingIdx([i + 1, j]);
      setStatus(`Compare ${arr[j]} vs pivot ${pivot}`);
      yield;
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        setStatus(`Swap ${arr[i]} ↔ ${arr[j]}`);
        yield;
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    setSortedIdxs(prev => new Set([...prev, i + 1]));
    setStatus(`Pivot ${pivot} placed`);
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

  useEffect(() => { reset(); }, [data, reset]);
  useEffect(() => { if (step === 0) reset(); }, [step, reset]);

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
    <div className="w-full flex flex-col items-center gap-6 sm:gap-12 px-1">
      {/* Bars */}
      <div className="flex items-end justify-center gap-1 sm:gap-2 h-36 sm:h-52 md:h-64 w-full">
        {array.map((val, idx) => {
          const isPivot = idx === pivotIdx;
          const isComparing = comparingIdx.includes(idx);
          const isSorted = sortedIdxs.has(idx) || isDone;
          const height = (val / maxVal) * 100;

          return (
            <div key={idx} className="flex flex-col items-center gap-1 flex-1 max-w-[36px] sm:max-w-[50px] md:max-w-[60px]">
              <motion.div
                layout
                className={`
                  w-full border-2 sm:border-4 border-black shadow-neo-xs sm:shadow-neo-sm transition-colors relative
                  ${isPivot ? 'bg-neo-yellow' : isComparing ? 'bg-neo-red text-white' : isSorted ? 'bg-neo-green' : 'bg-neo-blue'}
                `}
                style={{ height: `${height}%` }}
                animate={{ scale: isPivot || isComparing ? 1.1 : 1, y: isPivot ? -6 : 0 }}
              >
                <div className="absolute -top-5 sm:-top-7 left-1/2 -translate-x-1/2 font-mono font-bold text-[9px] sm:text-xs">
                  {val}
                </div>
              </motion.div>
              <span className="font-mono text-[8px] sm:text-[10px] text-gray-400">{idx}</span>
            </div>
          );
        })}
      </div>

      {/* Status bar */}
      <div className="w-full bg-neo-black p-2 sm:p-4 border-2 sm:border-4 border-black shadow-neo-xs sm:shadow-neo-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-2 h-2 rounded-full bg-neo-yellow animate-pulse shrink-0" />
          <p className="font-mono text-neo-yellow text-[10px] sm:text-sm uppercase tracking-wider truncate">
            {`STATUS: ${status}`}
          </p>
        </div>
        <div className="mt-1 flex flex-wrap gap-2 sm:gap-4 text-[9px] sm:text-[10px] font-mono text-neo-white/50">
          <span>PIVOT: {pivotIdx === -1 ? 'N/A' : pivotIdx}</span>
          <span>SORTED: {sortedIdxs.size}</span>
          <span>SIZE: {array.length}</span>
        </div>
      </div>
    </div>
  );
}
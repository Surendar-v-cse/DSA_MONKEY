import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface VisualizerProps {
  isPlaying: boolean;
  speed: number;
  step: number;
  setStep: (step: number) => void;
  data?: number[];
}

const DEFAULT_DATA = [45, 12, 89, 34, 67, 23, 56, 78, 90, 11];

export default function BubbleSortVisualizer({ isPlaying, speed, step, setStep, data }: VisualizerProps) {
  const [array, setArray] = useState([...(data || DEFAULT_DATA)]);
  const [comparing, setComparing] = useState<[number, number]>([-1, -1]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const reset = useCallback(() => {
    setArray([...(data || DEFAULT_DATA)]);
    setComparing([-1, -1]);
    setSorted([]);
    setI(0);
    setJ(0);
    setIsDone(false);
    setStep(0);
  }, [setStep, data]);

  useEffect(() => {
    reset();
  }, [data, reset]);

  useEffect(() => {
    if (step === 0) reset();
  }, [step, reset]);

  useEffect(() => {
    if (!isPlaying || isDone) return;

    const timer = setTimeout(() => {
      const n = array.length;
      
      if (i < n) {
        if (j < n - i - 1) {
          setComparing([j, j + 1]);
          
          if (array[j] > array[j + 1]) {
            const newArray = [...array];
            [newArray[j], newArray[j + 1]] = [newArray[j + 1], newArray[j]];
            setArray(newArray);
          }
          
          setJ(j + 1);
        } else {
          setSorted(prev => [...prev, n - i - 1]);
          setI(i + 1);
          setJ(0);
          setComparing([-1, -1]);
        }
      } else {
        setIsDone(true);
        setComparing([-1, -1]);
      }
      
      setStep(step + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, array, i, j, isDone, speed, step, setStep]);

  const maxVal = Math.max(...(data || DEFAULT_DATA));

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-12">
      <div className="flex items-end justify-center gap-2 h-64 w-full">
        {array.map((val, idx) => {
          const isComparing = comparing.includes(idx);
          const isSorted = sorted.includes(idx) || isDone;
          const height = (val / maxVal) * 100;

          return (
            <div key={idx} className="flex flex-col items-center gap-2 flex-1 max-w-[60px]">
              <motion.div
                layout
                className={`
                  w-full border-4 border-black shadow-neo-sm transition-colors relative
                  ${isComparing ? 'bg-neo-yellow' : isSorted ? 'bg-neo-green' : 'bg-neo-blue'}
                `}
                style={{ height: `${height}%` }}
                animate={{
                  scale: isComparing ? 1.05 : 1,
                }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-mono font-bold text-xs">
                  {val}
                </div>
              </motion.div>
              <span className="font-mono text-[10px] text-gray-400">{idx}</span>
            </div>
          );
        })}
      </div>

      <div className="w-full bg-neo-black p-4 border-4 border-black shadow-neo-sm">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-neo-blue animate-pulse" />
          <p className="font-mono text-neo-blue text-sm uppercase tracking-wider">
            {isDone ? 'SORTING COMPLETE' : `COMPARING INDEX ${j} AND ${j + 1}`}
          </p>
        </div>
        <div className="mt-2 flex gap-4 text-[10px] font-mono text-neo-white/50">
          <span>PASS: {i + 1}</span>
          <span>COMPARISONS: {j}</span>
          <span>ARRAY_SIZE: {array.length}</span>
        </div>
      </div>
    </div>
  );
}

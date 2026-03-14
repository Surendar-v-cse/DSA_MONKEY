import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface VisualizerProps {
  isPlaying: boolean;
  speed: number;
  step: number;
  setStep: (step: number) => void;
  data?: { array: number[], target: number };
}

const DEFAULT_DATA = { array: [2, 5, 7, 9, 12, 18, 21, 25, 30, 35, 40], target: 12 };

export default function BinarySearchVisualizer({ isPlaying, speed, step, setStep, data }: VisualizerProps) {
  const currentData = data || DEFAULT_DATA;
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(currentData.array.length - 1);
  const [mid, setMid] = useState(-1);
  const [found, setFound] = useState(false);
  const [status, setStatus] = useState('Initializing...');

  const reset = useCallback(() => {
    setLow(0);
    setHigh(currentData.array.length - 1);
    setMid(-1);
    setFound(false);
    setStep(0);
    setStatus('Ready to search for ' + currentData.target);
  }, [setStep, currentData]);

  useEffect(() => {
    reset();
  }, [data, reset]);

  useEffect(() => {
    if (step === 0) reset();
  }, [step, reset]);

  useEffect(() => {
    if (!isPlaying || found || low > high) return;

    const timer = setTimeout(() => {
      const currentMid = Math.floor((low + high) / 2);
      setMid(currentMid);

      if (currentData.array[currentMid] === currentData.target) {
        setFound(true);
        setStatus(`Found ${currentData.target} at index ${currentMid}!`);
      } else if (currentData.array[currentMid] < currentData.target) {
        setLow(currentMid + 1);
        setStatus(`${currentData.array[currentMid]} < ${currentData.target}, searching right half.`);
      } else {
        setHigh(currentMid - 1);
        setStatus(`${currentData.array[currentMid]} > ${currentData.target}, searching left half.`);
      }
      
      setStep(step + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, low, high, found, speed, step, setStep, currentData]);

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-12">
      <div className="flex flex-wrap justify-center gap-4">
        {currentData.array.map((val, idx) => {
          const isLow = idx === low;
          const isHigh = idx === high;
          const isMid = idx === mid;
          const isExcluded = idx < low || idx > high;
          const isFound = found && idx === mid;

          return (
            <div key={idx} className="flex flex-col items-center gap-2">
              <motion.div
                layout
                className={`
                  w-14 h-14 flex items-center justify-center border-4 border-black font-display font-black text-xl shadow-neo-sm transition-colors
                  ${isFound ? 'bg-neo-green text-black' : isMid ? 'bg-neo-yellow text-black' : isExcluded ? 'bg-gray-100 text-gray-300 border-gray-300 shadow-none' : 'bg-white'}
                `}
                animate={{
                  scale: isMid ? 1.1 : 1,
                  y: isMid ? -10 : 0,
                }}
              >
                {val}
              </motion.div>
              <div className="h-6 flex flex-col items-center">
                {isLow && <span className="text-[10px] font-mono font-bold text-neo-blue">LOW</span>}
                {isMid && <span className="text-[10px] font-mono font-bold text-neo-yellow">MID</span>}
                {isHigh && <span className="text-[10px] font-mono font-bold text-neo-red">HIGH</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full bg-neo-black p-4 border-4 border-black shadow-neo-sm">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-neo-green animate-pulse" />
          <p className="font-mono text-neo-green text-sm uppercase tracking-wider">
            {`STATUS: ${status}`}
          </p>
        </div>
        <div className="mt-2 flex gap-4 text-[10px] font-mono text-neo-white/50">
          <span>LOW: {low}</span>
          <span>HIGH: {high}</span>
          <span>MID: {mid === -1 ? 'N/A' : mid}</span>
          <span>TARGET: {currentData.target}</span>
        </div>
      </div>
    </div>
  );
}


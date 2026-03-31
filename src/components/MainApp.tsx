import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Panel, Button, Badge } from './UI/NeoComponents';
import { ALGORITHMS, AlgorithmType } from '@/src/data/algorithms';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  Settings2,
  Cpu,
  Terminal,
  Info,
  Code2,
  Activity,
  Menu,
  X,
} from 'lucide-react';

import BinarySearchVisualizer from './Visualizers/BinarySearchVisualizer';
import BubbleSortVisualizer from './Visualizers/BubbleSortVisualizer';
import QuickSortVisualizer from './Visualizers/QuickSortVisualizer';
import TreeVisualizer from './Visualizers/TreeVisualizer';
import GraphVisualizer from './Visualizers/GraphVisualizer';
import BSTVisualizer from './Visualizers/BSTVisualizer';
import Logo from './Logo';

interface MainAppProps {
  onBack?: () => void;
}

export default function MainApp({ onBack }: MainAppProps) {
  const [activeAlgo, setActiveAlgo] = useState<AlgorithmType>('binary-search');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [step, setStep] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(0);

  const algo = ALGORITHMS[activeAlgo];
  const currentExample = algo.examples?.[selectedExampleIndex];

  // Close sidebar on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleReset = () => {
    setIsPlaying(false);
    setStep(0);
  };

  const handleSelectAlgo = (id: AlgorithmType) => {
    setActiveAlgo(id);
    setSelectedExampleIndex(0);
    handleReset();
    setIsSidebarOpen(false); // auto-close on mobile
  };

  const visualizers: Record<AlgorithmType, React.ReactNode> = {
    'binary-search': <BinarySearchVisualizer isPlaying={isPlaying} speed={speed} step={step} setStep={setStep} data={currentExample?.data} />,
    'bubble-sort': <BubbleSortVisualizer isPlaying={isPlaying} speed={speed} step={step} setStep={setStep} data={currentExample?.data} />,
    'quick-sort': <QuickSortVisualizer isPlaying={isPlaying} speed={speed} step={step} setStep={setStep} data={currentExample?.data} />,
    'tree-traversal': <TreeVisualizer isPlaying={isPlaying} speed={speed} step={step} setStep={setStep} data={currentExample?.data} />,
    'bst-operations': <BSTVisualizer isPlaying={isPlaying} speed={speed} step={step} setStep={setStep} data={currentExample?.data} />,
    'graph-traversal': <GraphVisualizer isPlaying={isPlaying} speed={speed} step={step} setStep={setStep} data={currentExample?.data} />,
  };

  return (
    <div className="flex h-screen w-full flex-col bg-neo-gray overflow-hidden">

      {/* ── Header ── */}
      <header className="flex h-12 md:h-16 items-center justify-between border-b-4 border-black bg-white px-3 md:px-6 z-20 shrink-0">
        <div className="flex items-center gap-2 md:gap-3">
          {/* Hamburger — mobile only */}
          <button
            className="md:hidden p-1.5 border-2 border-black bg-white shadow-neo-xs active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack} className="p-1.5">
              <ChevronLeft size={18} />
            </Button>
          )}

          <Logo />
          <h1 className="text-base md:text-2xl font-display font-black tracking-tighter">
            DSA<span className="text-neo-blue">MONKEY</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex items-center gap-2 font-mono text-xs font-black uppercase">
            <span className="text-neo-green animate-pulse">●</span>
            SYSTEM_STATUS:{' '}
            <span className="bg-neo-green px-2 py-0.5 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              OPTIMAL
            </span>
          </div>
          <Button variant="dark" size="sm" className="hidden sm:flex items-center gap-2 py-1.5 px-3 text-xs">
            <Terminal size={14} />
            v1.0.5_STABLE
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">

        {/* ── Backdrop overlay (mobile only) ── */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-10 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* ── Sidebar ── */}
        <aside className={`
          fixed md:relative top-0 left-0 z-20 md:z-auto
          h-full w-64 md:w-72
          border-r-4 border-black bg-white
          transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          mt-12 md:mt-0
        `}>
          <div className="flex h-full flex-col">
            <div className="p-3 md:p-4 border-b-4 border-black bg-neo-yellow">
              <h2 className="text-xs md:text-sm font-display font-bold uppercase tracking-widest flex items-center gap-2">
                <Settings2 size={16} />
                Algorithms
              </h2>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 md:space-y-6">
              {Object.entries(
                Object.values(ALGORITHMS).reduce((acc, curr) => {
                  const category = curr.category;
                  if (!acc[category]) acc[category] = [];
                  acc[category].push(curr);
                  return acc;
                }, {} as Record<string, typeof ALGORITHMS[AlgorithmType][]>)
              ).map(([category, algos]) => (
                <div key={category} className="space-y-1 md:space-y-2">
                  <h3 className="text-[10px] font-mono font-black text-white bg-neo-black px-2 py-1 border-b-2 border-neo-pink uppercase tracking-[0.2em]">
                    {category}
                  </h3>
                  <div className="space-y-1">
                    {algos.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => handleSelectAlgo(a.id as AlgorithmType)}
                        className={`
                          w-full text-left px-3 py-2 font-display font-bold text-xs md:text-sm uppercase transition-all border-2
                          ${activeAlgo === a.id
                            ? 'bg-neo-blue text-white border-black shadow-neo-sm translate-x-[-2px] translate-y-[-2px]'
                            : 'bg-white text-black border-transparent hover:border-black hover:bg-gray-50'
                          }
                        `}
                      >
                        {a.title}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            <div className="p-3 md:p-4 border-t-4 border-black bg-neo-gray">
              <div className="text-[10px] font-mono font-bold uppercase text-gray-500">
                Created for Digital Lab 2026
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
          <div className="flex-1 p-2 sm:p-4 flex flex-col gap-2 sm:gap-4 overflow-y-auto">

            {/* ── Title + Controls row ── */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">

              {/* Algorithm title + examples */}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-black uppercase tracking-tight truncate">
                  {algo.title}
                </h2>
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                  <Badge color="bg-neo-blue text-white">{algo.category}</Badge>
                  {algo.examples && (
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="text-[10px] font-mono font-bold uppercase text-gray-500">Ex:</span>
                      {algo.examples.map((ex, idx) => (
                        <button
                          key={ex.label}
                          onClick={() => { setSelectedExampleIndex(idx); handleReset(); }}
                          className={`
                            px-2 py-0.5 text-[10px] font-mono font-bold border-2 border-black transition-all
                            ${selectedExampleIndex === idx
                              ? 'bg-neo-yellow text-black shadow-neo-xs'
                              : 'bg-white hover:bg-gray-100'}
                          `}
                        >
                          {ex.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Speed + Play/Reset controls */}
              <div className="flex items-center gap-2 sm:gap-4 bg-white border-2 sm:border-4 border-black p-2 sm:p-3 shadow-neo-xs sm:shadow-neo-sm shrink-0">
                <div className="flex flex-col gap-1 min-w-[100px] sm:min-w-[120px]">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] sm:text-[10px] font-mono font-black uppercase">Speed</span>
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold text-neo-blue">{(1100 - speed) / 10}ms</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="100"
                    value={1100 - speed}
                    onChange={(e) => setSpeed(1100 - parseInt(e.target.value))}
                    className="w-full h-2 bg-neo-gray border border-black appearance-none cursor-pointer accent-neo-blue"
                  />
                </div>
                <div className="h-8 w-px bg-black" />
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant={isPlaying ? 'outline' : 'accent'}
                    size="sm"
                    className="px-2 sm:px-4 py-1.5 sm:py-2"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-2 sm:px-4 py-1.5 sm:py-2"
                    onClick={handleReset}
                  >
                    <RotateCcw size={16} />
                  </Button>
                </div>
              </div>
            </div>

            {/* ── Visualizer + Info panel ── */}
            <div className="flex flex-col lg:flex-row gap-2 sm:gap-4 flex-1 min-h-0">

              {/* Visualizer */}
              <Panel title="Neural Visualization Matrix" className="flex-[3] bg-white relative overflow-hidden min-h-[260px] sm:min-h-[320px]">
                <div className="h-full w-full flex items-center justify-center">
                  {visualizers[activeAlgo]}
                </div>
              </Panel>

              {/* Info Panel — scrolls below on mobile */}
              <div className="flex-1 flex flex-col gap-2 sm:gap-4 overflow-y-auto lg:overflow-y-auto lg:pr-2">

                <Panel title="Algorithm Insights" className="bg-white border-2 sm:border-4 border-black shadow-neo-xs sm:shadow-neo-sm">
                  <div className="space-y-4">
                    <div className="p-3 bg-neo-yellow/10 border-2 sm:border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center gap-2 mb-1">
                        <Info className="text-neo-blue" size={16} strokeWidth={3} />
                        <span className="text-[10px] font-mono font-black uppercase">Core_Logic</span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold leading-relaxed">{algo.description}</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3">
                      <div className="bg-neo-blue text-white p-3 border-2 sm:border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
                        <div>
                          <div className="text-[9px] sm:text-[10px] font-mono font-black text-white/70 uppercase">Avg_Complexity</div>
                          <div className="text-lg sm:text-2xl font-black font-mono tracking-tighter">{algo.timeComplexity.average}</div>
                        </div>
                        <Activity className="text-white/30" size={24} strokeWidth={3} />
                      </div>
                      <div className="bg-neo-green text-black p-3 border-2 sm:border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
                        <div>
                          <div className="text-[9px] sm:text-[10px] font-mono font-black text-black/50 uppercase">Space_Usage</div>
                          <div className="text-lg sm:text-2xl font-black font-mono tracking-tighter">{algo.spaceComplexity}</div>
                        </div>
                        <Cpu className="text-black/30" size={24} strokeWidth={3} />
                      </div>
                    </div>

                    {algo.steps && (
                      <div className="space-y-2">
                        <div className="text-[10px] font-mono font-black uppercase text-neo-black/40 tracking-widest">Execution_Steps</div>
                        <div className="space-y-1 sm:space-y-2">
                          {algo.steps.map((s, i) => (
                            <div key={i} className="flex gap-2 sm:gap-3 items-start p-2 border-2 border-black bg-white hover:bg-neo-pink/5 transition-colors">
                              <span className="bg-neo-pink text-white text-[10px] font-mono font-black px-1.5 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
                                {String(i + 1).padStart(2, '0')}
                              </span>
                              <p className="text-[10px] sm:text-xs font-black leading-tight uppercase">{s}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Panel>

                <Panel title="Source Code" className="bg-neo-black text-neo-green font-mono text-xs sm:text-sm border-2 sm:border-4 border-black shadow-neo-xs sm:shadow-neo-sm">
                  <div className="flex items-center gap-2 mb-3 text-neo-pink border-b border-neo-pink/20 pb-2">
                    <Code2 size={14} strokeWidth={3} />
                    <span className="font-black text-xs">ALGO_SOURCE.TXT</span>
                  </div>
                  <pre className="whitespace-pre-wrap leading-relaxed text-[10px] sm:text-xs overflow-x-auto">
                    {algo.pseudoCode}
                  </pre>
                </Panel>

                <Panel title="Case Analysis" className="bg-white border-2 sm:border-4 border-black shadow-neo-xs sm:shadow-neo-sm">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs p-2 bg-neo-green/10 border-2 border-black">
                      <span className="font-black uppercase tracking-tighter">Best</span>
                      <code className="bg-neo-green text-black px-2 py-0.5 border-2 border-black font-black">{algo.timeComplexity.best}</code>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2 bg-neo-blue/10 border-2 border-black">
                      <span className="font-black uppercase tracking-tighter">Average</span>
                      <code className="bg-neo-blue text-white px-2 py-0.5 border-2 border-black font-black">{algo.timeComplexity.average}</code>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2 bg-neo-red/10 border-2 border-black">
                      <span className="font-black uppercase tracking-tighter">Worst</span>
                      <code className="bg-neo-red text-white px-2 py-0.5 border-2 border-black font-black">{algo.timeComplexity.worst}</code>
                    </div>
                  </div>
                </Panel>

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
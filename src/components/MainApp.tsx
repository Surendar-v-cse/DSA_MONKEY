import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Panel, Button, Badge } from './UI/NeoComponents';
import { ALGORITHMS, AlgorithmType } from '@/src/data/algorithms';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Settings2,
  Cpu,
  Terminal,
  Info,
  Code2,
  Activity,
  Menu,
  X
} from 'lucide-react';

// Visualizer Components (Placeholders for now)
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

  const handleReset = () => {
    setIsPlaying(false);
    setStep(0);
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
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b-4 border-black bg-white px-4 sm:px-6 z-30">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 min-h-[40px] min-w-[40px]"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          
          {onBack && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onBack}
              className="hidden sm:flex p-1.5"
            >
              <ChevronLeft size={20} />
            </Button>
          )}
          <div className="scale-75 sm:scale-100 origin-left">
            <Logo />
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-black tracking-tighter">
            DSA<span className="text-neo-blue">MONKEY</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 font-mono text-xs font-black uppercase">
            <span className="text-neo-green animate-pulse">●</span> SYSTEM_STATUS: <span className="bg-neo-green px-2 py-0.5 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">OPTIMAL</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] font-black uppercase bg-neo-black text-white px-2 py-1 border-2 border-black">
            <Terminal size={12} />
            v1.0.5
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Overlay for Mobile */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-black/50 z-20 md:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside className={`
          absolute md:relative z-20 h-full w-72 border-r-4 border-black bg-white transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 lg:w-72 overflow-hidden'}
        `}>
          <div className="flex h-full flex-col">
            <div className="p-4 border-b-4 border-black bg-neo-yellow">
              <h2 className="text-sm font-display font-bold uppercase tracking-widest flex items-center gap-2">
                <Settings2 size={18} />
                Algorithms
              </h2>
            </div>
            
            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
              {Object.entries(Object.values(ALGORITHMS).reduce((acc, curr) => {
                const category = curr.category;
                if (!acc[category]) acc[category] = [];
                acc[category].push(curr);
                return acc;
              }, {} as Record<string, typeof ALGORITHMS[AlgorithmType][]>)).map(([category, algos]) => (
                <div key={category} className="space-y-2">
                  <h3 className="text-[10px] font-mono font-black text-white bg-neo-black px-2 py-1 border-b-2 border-neo-pink uppercase tracking-[0.2em]">
                    {category}
                  </h3>
                  <div className="space-y-1">
                    {algos.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => {
                          setActiveAlgo(a.id as AlgorithmType);
                          setSelectedExampleIndex(0);
                          handleReset();
                        }}
                        className={`
                          w-full text-left px-3 py-2 font-display font-bold text-sm uppercase transition-all border-2
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

            <div className="p-4 border-t-4 border-black bg-neo-gray">
              <div className="text-[10px] font-mono font-bold uppercase text-gray-500">
                Created for Digital Lab 2026
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] overflow-y-auto">
          {/* Visualization Area */}
          <div className="flex-1 p-3 sm:p-4 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-full">
                  <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight">
                    {algo.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <Badge color="bg-neo-blue text-white">{algo.category}</Badge>
                    {algo.examples && (
                      <div className="flex flex-wrap items-center gap-1 sm:ml-4">
                        <span className="text-[10px] font-mono font-bold uppercase text-gray-500 w-full sm:w-auto">Examples:</span>
                        {algo.examples.map((ex, idx) => (
                          <button
                            key={ex.label}
                            onClick={() => {
                              setSelectedExampleIndex(idx);
                              handleReset();
                            }}
                            className={`
                              px-2 py-1 text-[10px] font-mono font-bold border-2 border-black transition-all min-h-[24px]
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
              </div>

              <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 bg-white border-4 border-black p-3 shadow-neo-sm">
                <div className="flex flex-col gap-1 px-1 min-w-[140px] flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-black uppercase">Exec_Speed</span>
                    <span className="text-[10px] font-mono font-bold text-neo-blue">{(1100 - speed) / 10}ms</span>
                  </div>
                  <input 
                    type="range" 
                    min="100" 
                    max="1000" 
                    step="100"
                    value={1100 - speed}
                    onChange={(e) => setSpeed(1100 - parseInt(e.target.value))}
                    className="w-full h-2 bg-neo-gray border-2 border-black appearance-none cursor-pointer accent-neo-blue"
                  />
                </div>
                <div className="hidden xs:block h-10 w-1 bg-black" />
                <div className="flex items-center gap-2">
                  <Button 
                    variant={isPlaying ? 'outline' : 'accent'} 
                    size="sm" 
                    className="flex-1 xs:flex-none px-4"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 xs:flex-none px-4"
                    onClick={handleReset}
                  >
                    <RotateCcw size={20} />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              {/* Visualizer Canvas */}
              <Panel title="Neural Visualization Matrix" className="lg:flex-[3] bg-white relative min-h-[300px] sm:min-h-[400px]">
                <div className="h-full w-full flex items-center justify-center overflow-auto p-4">
                  {visualizers[activeAlgo]}
                </div>
              </Panel>

              {/* Info Panel */}
              <div className="lg:flex-1 flex flex-col gap-4 lg:max-w-[400px]">
                <Panel title="Algorithm Insights" className="bg-white border-4 border-black shadow-neo-sm">
                  <div className="space-y-6">
                    <div className="p-4 bg-neo-yellow/10 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="text-neo-blue" size={18} strokeWidth={3} />
                        <span className="text-xs font-mono font-black uppercase">Core_Logic</span>
                      </div>
                      <p className="text-sm font-bold leading-relaxed">
                        {algo.description}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div className="bg-neo-blue text-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
                        <div>
                          <div className="text-[10px] font-mono font-black text-white/70 uppercase">Avg_Complexity</div>
                          <div className="text-2xl font-black font-mono tracking-tighter">{algo.timeComplexity.average}</div>
                        </div>
                        <Activity className="text-white/30" size={32} strokeWidth={3} />
                      </div>
                      
                      <div className="bg-neo-green text-black p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
                        <div>
                          <div className="text-[10px] font-mono font-black text-black/50 uppercase">Space_Usage</div>
                          <div className="text-2xl font-black font-mono tracking-tighter">{algo.spaceComplexity}</div>
                        </div>
                        <Cpu className="text-black/30" size={32} strokeWidth={3} />
                      </div>
                    </div>

                    {algo.steps && (
                      <div className="space-y-3">
                        <div className="text-[10px] font-mono font-black uppercase text-neo-black/40 tracking-widest">Execution_Steps</div>
                        <div className="space-y-2">
                          {algo.steps.map((s, i) => (
                            <div key={i} className="flex gap-3 items-start group p-2 border-2 border-black bg-white hover:bg-neo-pink/5 transition-colors">
                              <span className="bg-neo-pink text-white text-[10px] font-mono font-black px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                {String(i + 1).padStart(2, '0')}
                              </span>
                              <p className="text-xs font-black leading-tight uppercase">{s}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Panel>

                <Panel title="Source Code" className="bg-neo-black text-neo-green font-mono text-sm border-4 border-black shadow-neo-sm">
                  <div className="flex items-center gap-2 mb-4 text-neo-pink border-b border-neo-pink/20 pb-2">
                    <Code2 size={16} strokeWidth={3} />
                    <span className="font-black">ALGO_SOURCE.TXT</span>
                  </div>
                  <pre className="whitespace-pre-wrap leading-relaxed">
                    {algo.pseudoCode}
                  </pre>
                </Panel>

                <Panel title="Case Analysis" className="bg-white border-4 border-black shadow-neo-sm">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm p-2 bg-neo-green/10 border-2 border-black">
                      <span className="font-black uppercase tracking-tighter">Best_Case</span>
                      <code className="bg-neo-green text-black px-2 py-0.5 border-2 border-black font-black">{algo.timeComplexity.best}</code>
                    </div>
                    <div className="flex items-center justify-between text-sm p-2 bg-neo-blue/10 border-2 border-black">
                      <span className="font-black uppercase tracking-tighter">Average_Case</span>
                      <code className="bg-neo-blue text-white px-2 py-0.5 border-2 border-black font-black">{algo.timeComplexity.average}</code>
                    </div>
                    <div className="flex items-center justify-between text-sm p-2 bg-neo-red/10 border-2 border-black">
                      <span className="font-black uppercase tracking-tighter">Worst_Case</span>
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

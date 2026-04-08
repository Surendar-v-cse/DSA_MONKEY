import React from 'react';
import { motion } from 'motion/react';
import Logo from '../Logo';
import { Button } from '../UI/NeoComponents';
import { ArrowRight, Sparkles, Terminal, Activity } from 'lucide-react';

export default function IntroScene({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="relative h-screen w-full bg-neo-pink flex flex-col items-center justify-center overflow-hidden">
      {/* Decorative Background Elements - Hidden on small mobile */}
      <div className="hidden sm:block absolute top-10 left-10 w-40 h-40 border-8 border-black bg-neo-blue -rotate-12" />
      <div className="hidden sm:block absolute bottom-20 right-10 w-56 h-56 border-8 border-black bg-neo-green rotate-12" />
      <div className="hidden sm:block absolute top-1/4 right-1/4 w-24 h-24 border-8 border-black bg-neo-yellow rounded-full -rotate-45" />
      <div className="hidden sm:block absolute bottom-1/4 left-1/4 w-32 h-32 border-8 border-black bg-neo-orange rotate-45" />
      
      {/* Main Content Card */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 12 }}
        className="relative z-10 bg-white border-4 sm:border-8 border-black p-6 sm:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-2xl w-full mx-4"
      >
        <div className="flex flex-col items-center text-center gap-6 sm:gap-8">
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="scale-[1.5] sm:scale-[2] mb-2 sm:mb-4"
          >
            <Logo />
          </motion.div>
          
          <div className="space-y-2">
            <h1 className="text-5xl sm:text-7xl font-display font-black uppercase tracking-tighter leading-none">
              DSA <span className="text-neo-blue">MONKEY</span>
            </h1>
            <p className="font-mono text-xs sm:text-sm font-bold uppercase bg-neo-yellow inline-block px-2 py-1 border-2 border-black rotate-1">
              Master the algorithms. Feed the brain.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <div className="border-4 border-black p-4 bg-neo-blue/10 text-left transform -rotate-1">
              <Terminal size={24} className="mb-2 text-neo-blue" />
              <h3 className="font-bold text-xs uppercase">Interactive</h3>
              <p className="text-[10px] font-medium leading-tight">Real-time visualizations of complex data structures.</p>
            </div>
            <div className="border-4 border-black p-4 bg-neo-green/10 text-left transform rotate-1">
              <Activity size={24} className="mb-2 text-neo-green" />
              <h3 className="font-bold text-xs uppercase">Step-by-Step</h3>
              <p className="text-[10px] font-medium leading-tight">Break down complex logic into manageable chunks.</p>
            </div>
          </div>

          <Button 
            onClick={onComplete}
            variant="dark"
            className="w-full py-4 sm:py-6 text-xl sm:text-2xl group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-4">
              ENTER_SYSTEM.EXE
              <ArrowRight className="group-hover:translate-x-4 transition-transform duration-300" strokeWidth={3} />
            </span>
          </Button>
        </div>
      </motion.div>

      {/* Footer Micro-details - Adjusted for mobile */}
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 font-mono text-[8px] sm:text-[10px] font-bold uppercase">
        © 2026 MONKEY_LABS
      </div>
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 font-mono text-[8px] sm:text-[10px] font-bold uppercase">
        v1.0.5_STABLE
      </div>
    </div>
  );
}

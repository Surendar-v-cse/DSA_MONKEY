import React from 'react'
import { motion } from 'framer-motion'
import Logo from '../Logo'
import { Button } from '../UI/NeoComponents'
import { ArrowRight, Terminal, Activity } from 'lucide-react'

type IntroSceneProps = {
  onComplete: () => void
}

export default function IntroScene({ onComplete }: IntroSceneProps) {
  return (
    <div className="relative h-screen w-full bg-pink-500 flex flex-col items-center justify-center overflow-hidden">

      <div className="absolute top-4 left-4 w-16 h-16 sm:w-28 sm:h-28 md:w-40 md:h-40 border-4 sm:border-8 border-black bg-blue-500 -rotate-12" />
      <div className="absolute bottom-10 right-4 w-20 h-20 sm:w-36 sm:h-36 md:w-56 md:h-56 border-4 sm:border-8 border-black bg-green-500 rotate-12" />
      <div className="absolute top-1/4 right-1/4 w-10 h-10 sm:w-16 sm:h-16 md:w-24 md:h-24 border-4 sm:border-8 border-black bg-yellow-400 rounded-full -rotate-45 hidden sm:block" />
      <div className="absolute bottom-1/4 left-1/4 w-12 h-12 sm:w-20 sm:h-20 md:w-32 md:h-32 border-4 sm:border-8 border-black bg-orange-500 rotate-45 hidden sm:block" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12 }}
        className="relative z-10 bg-white border-4 sm:border-8 border-black p-6 sm:p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-2xl w-full mx-3 sm:mx-4"
      >
        <div className="flex flex-col items-center text-center gap-5 sm:gap-8">

          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="scale-[1.5] sm:scale-[2] mb-2 sm:mb-4"
          >
            <Logo />
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
              DSA <span className="text-blue-500">MONKEY</span>
            </h1>
            <p className="font-mono text-[10px] sm:text-sm font-bold uppercase bg-yellow-400 inline-block px-2 py-1 border-2 border-black rotate-1">
              Master the algorithms. Feed the brain.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full">
            <div className="border-2 sm:border-4 border-black p-3 sm:p-4 bg-blue-500/10 text-left -rotate-1">
              <Terminal size={18} className="mb-1 sm:mb-2 text-blue-500" />
              <h3 className="font-bold text-[10px] sm:text-xs uppercase">Interactive</h3>
              <p className="text-[9px] sm:text-[10px] font-medium leading-tight hidden sm:block">
                Real-time visualizations of complex data structures.
              </p>
            </div>
            <div className="border-2 sm:border-4 border-black p-3 sm:p-4 bg-green-500/10 text-left rotate-1">
              <Activity size={18} className="mb-1 sm:mb-2 text-green-500" />
              <h3 className="font-bold text-[10px] sm:text-xs uppercase">Step-by-Step</h3>
              <p className="text-[9px] sm:text-[10px] font-medium leading-tight hidden sm:block">
                Break down complex logic into manageable chunks.
              </p>
            </div>
          </div>

          <Button
            onClick={onComplete}
            className="w-full py-4 sm:py-6 text-base sm:text-2xl group relative overflow-hidden bg-black text-white border-4 border-black"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-4">
              ENTER_SYSTEM.EXE
              <ArrowRight className="group-hover:translate-x-4 transition-transform duration-300" strokeWidth={3} />
            </span>
          </Button>

        </div>
      </motion.div>

      <div className="absolute bottom-3 left-3 font-mono text-[8px] sm:text-[10px] font-bold uppercase">
        © 2026 MONKEY_LABS // ALL_RIGHTS_RESERVED
      </div>
      <div className="absolute bottom-3 right-3 font-mono text-[8px] sm:text-[10px] font-bold uppercase">
        STABLE_BUILD_V1.0.5
      </div>
    </div>
  )
}
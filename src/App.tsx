/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import IntroScene from './components/Intro/IntroScene';
import MainApp from './components/MainApp';

export default function App() {
  const [showApp, setShowApp] = useState(false);

  // Handle the case where user might want to skip intro or for development
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 's' && e.ctrlKey) {
        setShowApp(true);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <AnimatePresence mode="wait">
        {!showApp ? (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <IntroScene onComplete={() => setShowApp(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-screen w-full"
          >
            <MainApp onBack={() => setShowApp(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}


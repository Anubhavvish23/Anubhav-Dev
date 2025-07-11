import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Coffee, Info, Zap } from 'lucide-react';

const isDesktopOrTablet = () => typeof window !== 'undefined' && window.innerWidth > 640;

const EasterEggs = () => {
  const [enabled, setEnabled] = useState(isDesktopOrTablet());
  const [typedKeys, setTypedKeys] = useState<string[]>([]);
  const [showSecret, setShowSecret] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [showInfo, setShowInfo] = useState(true);
  const [showHello, setShowHello] = useState(false);
  const [mouseHint, setMouseHint] = useState(false);

  // Update enabled state on resize
  useEffect(() => {
    const handleResize = () => setEnabled(isDesktopOrTablet());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Only run effects if enabled (not on phone)
  useEffect(() => {
    if (!enabled) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      setTypedKeys(prev => {
        const newKeys = [...prev, e.key.toUpperCase()].slice(-6);
        if (newKeys.join('') === 'EASTER') {
          setShowSecret(true);
          setTimeout(() => setShowSecret(false), 5000);
          return [];
        }
        return newKeys;
      });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const handleDblClick = () => {
      setShowHearts(true);
      setTimeout(() => setShowHearts(false), 3000);
    };
    window.addEventListener('dblclick', handleDblClick);
    return () => window.removeEventListener('dblclick', handleDblClick);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() < 0.02) {
        const newParticle = {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY
        };
        setParticles(prev => [...prev.slice(-10), newParticle]);
        setTimeout(() => {
          setParticles(prev => prev.filter(p => p.id !== newParticle.id));
        }, 2000);
      }
      setMouseHint(false);
    };
    setMouseHint(true);
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    let typed = '';
    const handleKeyPress = (e: KeyboardEvent) => {
      typed += e.key;
      if (typed.toLowerCase().includes('hello')) {
        setShowHello(true);
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
          document.body.style.filter = '';
          setShowHello(false);
        }, 3000);
        typed = '';
      }
      if (typed.length > 20) {
        typed = typed.slice(-10);
      }
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [enabled]);

  useEffect(() => {
    // Check localStorage for 'easterEggInfoDisabled'
    if (typeof window !== 'undefined' && localStorage.getItem('easterEggInfoDisabled') === 'true') {
      setShowInfo(false);
    }
  }, []);

  const triggerRandomEgg = () => {
    if (!enabled) return;
    const eggs = [
      () => { setShowSecret(true); setTimeout(() => setShowSecret(false), 5000); },
      () => { setShowHearts(true); setTimeout(() => setShowHearts(false), 3000); },
      () => { setShowHello(true); document.body.style.filter = 'hue-rotate(180deg)'; setTimeout(() => { document.body.style.filter = ''; setShowHello(false); }, 3000); }
    ];
    eggs[Math.floor(Math.random() * eggs.length)]();
  };

  if (!enabled) return null;

  return (
    <>
      {/* Info Box with Hints */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-lg flex items-center gap-3 text-sm"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
          >
            <Info className="w-5 h-5 text-blue-500" />
            <div>
              <div><b>Try these fun surprises:</b></div>
              <ul className="list-disc pl-5">
                <li>Type <b>EASTER</b> anywhere</li>
                <li>Double-click anywhere</li>
                <li>Move your mouse around</li>
                <li>Type <b>hello</b> for a color effect</li>
                <li>Click the coffee cup</li>
              </ul>
            </div>
            <button className="ml-4 text-xs text-blue-500 hover:underline" onClick={() => setShowInfo(false)}>Hide</button>
            <button
              className="ml-2 text-xs text-red-500 hover:underline"
              onClick={() => {
                setShowInfo(false);
                if (typeof window !== 'undefined') {
                  localStorage.setItem('easterEggInfoDisabled', 'true');
                }
              }}
            >
              Don't show again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mouse move hint (desktop only) */}
      <AnimatePresence>
        {mouseHint && (
          <motion.div
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 bg-blue-50 dark:bg-slate-700/80 px-3 py-1 rounded-full text-xs text-blue-700 dark:text-blue-200 shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            Move your mouse for a sparkle trail!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Konami (EASTER) Code Secret */}
      <AnimatePresence>
        {showSecret && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSecret(false)}
          >
            <motion.div
              className="relative text-center space-y-4 bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl px-6 py-8 max-w-xs w-full mx-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 200 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-2 right-2 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 text-2xl text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => setShowSecret(false)}
                aria-label="Close popup"
                tabIndex={0}
              >
                &times;
              </button>
              <motion.div
                className="text-6xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                🥚
              </motion.div>
              <h2 className="title text-4xl font-bold">Easter Egg Unlocked!</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">You typed EASTER!</p>
              <div className="flex justify-center gap-2">
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.1
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hearts Animation (double click) */}
      <AnimatePresence>
        {showHearts && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto"
            onClick={() => setShowHearts(false)}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 text-3xl text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={e => { e.stopPropagation(); setShowHearts(false); }}
              aria-label="Close popup"
              tabIndex={0}
            >
              &times;
            </button>
            <div onClick={e => e.stopPropagation()} className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-red-500 text-2xl"
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: window.innerHeight + 50,
                    scale: 0
                  }}
                  animate={{
                    y: -50,
                    scale: [0, 1, 0],
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.1,
                    ease: 'easeOut'
                  }}
                >
                  <Heart fill="currentColor" />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Mouse Trail Particles */}
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="fixed pointer-events-none z-30"
            style={{ left: particle.x, top: particle.y }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 2 }}
          >
            <Sparkles className="w-4 h-4 text-blue-500" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Hello color effect */}
      <AnimatePresence>
        {showHello && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHello(false)}
          >
            <motion.div
              className="relative text-center space-y-4 bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl px-6 py-8 max-w-xs w-full mx-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 200 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-2 right-2 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 text-2xl text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => setShowHello(false)}
                aria-label="Close popup"
                tabIndex={0}
              >
                &times;
              </button>
              <motion.div
                className="text-6xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                🌈
              </motion.div>
              <h2 className="title text-4xl font-bold">Color Surprise!</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">You typed hello!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Coffee Button */}
      <motion.button
        className="fixed bottom-20 left-8 z-30 p-3 glass rounded-full opacity-80 hover:opacity-100 transition-opacity duration-300"
        whileHover={{ scale: 1.2, rotate: 15 }}
        whileTap={{ scale: 0.8 }}
        onClick={() => {
          const messages = [
            "☕ Thanks for the coffee!",
            "🚀 Caffeine boost activated!",
            "💻 Coding powers increased!",
            "⚡ Energy level: Maximum!"
          ];
          alert(messages[Math.floor(Math.random() * messages.length)]);
        }}
        aria-label="Coffee Easter Egg"
      >
        <Coffee className="w-6 h-6 text-amber-600" />
      </motion.button>

      {/* Try Me! Button */}
      <motion.button
        className="fixed bottom-20 right-8 z-30 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={triggerRandomEgg}
        aria-label="Try a random Easter Egg!"
      >
        <Zap className="w-6 h-6" />
      </motion.button>
    </>
  );
};

export default EasterEggs;
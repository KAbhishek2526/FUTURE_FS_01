'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

export default function Overlay() {
  const { scrollYProgress } = useScroll();

  // Section 1: Intro (0% to 20%)
  const y1 = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);

  // Section 2: Expertise (20% to 50%)
  const y2 = useTransform(scrollYProgress, [0.2, 0.35, 0.5], [50, 0, -50]);
  const opacity2 = useTransform(scrollYProgress, [0.2, 0.35, 0.5], [0, 1, 0]);

  // Section 3: Vision (50% to 80%)
  const y3 = useTransform(scrollYProgress, [0.5, 0.65, 0.8], [50, 0, -50]);
  const opacity3 = useTransform(scrollYProgress, [0.5, 0.65, 0.8], [0, 1, 0]);

  // Section 4: Call to action / Scroll to continue (80% to 100%)
  const y4 = useTransform(scrollYProgress, [0.8, 0.9, 1], [50, 0, 0]);
  const opacity4 = useTransform(scrollYProgress, [0.8, 0.9, 1], [0, 1, 1]);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 flex flex-col items-center justify-center">
      
      {/* Section 1 */}
      <motion.div
        style={{ y: y1, opacity: opacity1 }}
        className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-center">
          Abhishek K.
        </h1>
        <p className="text-xl md:text-2xl mt-4 text-white/70 font-light">
          Creative Developer.
        </p>
      </motion.div>

      {/* Section 2 */}
      <motion.div
        style={{ y: y2, opacity: opacity2 }}
        className="fixed inset-0 flex flex-col items-start justify-center px-10 md:px-24 pointer-events-none"
      >
        <h2 className="text-4xl md:text-6xl font-semibold max-w-2xl leading-tight">
          I build high-performance
          <br className="hidden md:block"/> digital experiences.
        </h2>
      </motion.div>

      {/* Section 3 */}
      <motion.div
        style={{ y: y3, opacity: opacity3 }}
        className="fixed inset-0 flex flex-col items-end justify-center px-10 md:px-24 pointer-events-none text-right"
      >
        <h2 className="text-4xl md:text-6xl font-semibold max-w-2xl leading-tight">
          Bridging design <br className="hidden md:block"/> and engineering.
        </h2>
      </motion.div>
      
      {/* Section 4 */}
      <motion.div
        style={{ y: y4, opacity: opacity4 }}
        className="fixed inset-0 flex flex-col items-center justify-end pb-[10vh] pointer-events-none"
      >
        <p className="text-sm uppercase tracking-widest text-white/50 animate-pulse">
          Scroll to discover
        </p>
      </motion.div>
      
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.1 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16); // Center of 32px ring
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over interactive elements
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('hover-glow')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  // Dot offset: 32px ring, 8px dot. To center: 16 - 4 = 12px offset from the ring's top-left
  const dotX = useTransform(cursorX, x => x + 12);
  const dotY = useTransform(cursorY, y => y + 12);

  return (
    <>
      {/* Outer Glow Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-blue-500/60 pointer-events-none z-[9999] hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          scale: isHovering ? 2.5 : 1,
          backgroundColor: isHovering ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0)',
          borderColor: isHovering ? 'rgba(59, 130, 246, 0)' : 'rgba(59, 130, 246, 0.6)',
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {isHovering && (
           <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-30" />
        )}
      </motion.div>
      
      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-blue-400 rounded-full pointer-events-none z-[10000] hidden md:block shadow-[0_0_10px_rgba(59,130,246,0.9)]"
        style={{
          x: dotX,
          y: dotY,
        }}
        animate={{
          opacity: isHovering ? 0 : 1,
          scale: isHovering ? 0 : 1
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}

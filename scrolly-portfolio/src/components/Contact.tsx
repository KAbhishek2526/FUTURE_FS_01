'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, Copy, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "kokkiligaaddaabhishek2006@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="relative z-20 bg-[#121212] py-40 px-6 md:px-12 lg:px-24 border-t border-white/5 overflow-hidden">
      {/* Background glow behind contact */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2 
          className="text-5xl md:text-7xl font-bold tracking-tighter mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          Let&apos;s work <span className="text-blue-500">together.</span>
        </motion.h2>
        
        <motion.p 
          className="text-white/60 text-lg md:text-xl font-light mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Whether you have a specific project in mind, need technical advice, 
          or just want to say hello—I&apos;m always open to discussing new opportunities.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Email Copy Button */}
          <button 
            onClick={handleCopy}
            className="glass flex items-center gap-3 px-8 py-4 rounded-full hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden group glow-blue w-full sm:w-auto"
          >
            <Mail className="text-blue-400 group-hover:text-blue-300 transition-colors" size={20} />
            <span className="text-white/90 font-medium tracking-wide">Copy Email</span>
            
            <AnimatePresence>
              {copied && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 bg-blue-600 flex items-center justify-center gap-2 rounded-full"
                >
                  <CheckCircle2 size={18} className="text-white" />
                  <span className="text-white font-medium">Copied!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/KAbhishek2526" 
              target="_blank" rel="noreferrer"
              className="w-14 h-14 rounded-full glass flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:scale-110 active:scale-95 transition-all duration-300 glow-blue"
            >
              <Github size={22} />
            </a>
            <a 
              href="https://linkedin.com/in/" 
              target="_blank" rel="noreferrer"
              className="w-14 h-14 rounded-full glass flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:scale-110 active:scale-95 transition-all duration-300 glow-blue"
            >
              <Linkedin size={22} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

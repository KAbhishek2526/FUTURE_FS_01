'use client';

import { motion } from 'framer-motion';
import { MonitorSmartphone, LayoutGrid, Bot } from 'lucide-react';
import { premiumEase } from '@/lib/animations';

const services = [
  {
    icon: <MonitorSmartphone size={32} className="text-blue-500" />,
    title: 'Custom Web Development',
    desc: 'Building blazing-fast, scalable web applications with Next.js, React, and TypeScript. Focused on high performance and clean code architecture.',
  },
  {
    icon: <LayoutGrid size={32} className="text-purple-400" />,
    title: 'Responsive UI Design',
    desc: 'Crafting pixel-perfect, aesthetic interfaces that look beautiful and function seamlessly across all modern devices and screen sizes.',
  },
  {
    icon: <Bot size={32} className="text-emerald-400" />,
    title: 'AI Integration',
    desc: 'Enhancing digital experiences by seamlessly integrating LLMs and modern AI capabilities directly into the core product workflow.',
  },
];

export default function Services() {
  return (
    <section id="services" className="relative z-20 bg-[#121212] py-32 px-6 md:px-12 lg:px-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center flex flex-col items-center">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            My Expertise
          </motion.h2>
          <motion.p 
            className="text-white/60 text-lg md:text-xl max-w-2xl font-light"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Specialized solutions designed to elevate your brand&apos;s digital presence.
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: premiumEase } }
              }}
              className="glass p-10 rounded-3xl group flex flex-col items-center text-center transform duration-300 hover-glow block"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                {service.icon}
              </div>
              <h3 className="text-2xl font-medium mb-4 text-white/90">
                {service.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed font-light group-hover:text-white/70 transition-colors">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

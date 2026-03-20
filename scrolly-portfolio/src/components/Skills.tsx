'use client';

import { motion } from 'framer-motion';

const skills = [
  "HTML5", "CSS3", "JavaScript", "TypeScript",
  "React", "Next.js", "Tailwind CSS", "Framer Motion",
  "Node.js", "Git & GitHub", "AI Integration", "Performance Setup"
];

export default function Skills() {
  return (
    <section id="skills" className="relative z-20 bg-[#0a0a0a] py-32 px-6 md:px-12 lg:px-24 border-t border-white/5">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="text-blue-500 font-semibold tracking-[0.2em] uppercase text-sm mb-4">Capabilities</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white/90">
            Tech Stack
          </h2>
        </motion.div>

        <motion.div 
          className="flex flex-wrap justify-center gap-4 md:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.05 }
            }
          }}
        >
          {skills.map((skill) => (
            <motion.div
              key={skill}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
              }}
              className="glass px-6 py-3 rounded-full text-white/80 font-medium hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 glow-blue cursor-default"
            >
              {skill}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

import Navbar from '@/components/Navbar';
import ScrollyCanvas from '@/components/ScrollyCanvas';
import Intro from '@/components/Intro';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Services from '@/components/Services';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="relative bg-[#0a0a0a]">
      <Navbar />
      
      <div id="home" className="relative">
        <ScrollyCanvas />
      </div>

      <Intro />
      <About />
      <Skills />
      <Projects />
      <Services />
      <Contact />
      <Footer />
    </main>
  );
}

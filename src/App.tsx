import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SpaceBackground from './components/SpaceBackground';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import SkillsSection from './sections/SkillsSection';
import ProjectsSection from './sections/ProjectsSection';
import AchievementsSection from './sections/AchievementsSection';
import ContactSection from './sections/ContactSection';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  // Initialize Lenis smooth scroll synced with GSAP ScrollTrigger
  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    (window as any).__lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tickerUpdate = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerUpdate);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerUpdate);
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#020408] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 3D Space Background Scene Across The ENTIRE Website */}
      <SpaceBackground />

      {/* Interactive Cursor Follower */}
      <CustomCursor />

      {/* Fixed Continuous Header Navigation */}
      <Navbar />

      {/* ONE Continuous Scrolling Page with all 6 sections in exact order */}
      <main className="relative z-10 flex flex-col">
        {/* Section 1: Home / Hero with 3D Computer Workstation */}
        <HeroSection />

        {/* Section 2: About Me */}
        <AboutSection />

        {/* Section 3: Skills */}
        <SkillsSection />

        {/* Section 4: Projects (AI Skill Twin & Disaster Management) */}
        <ProjectsSection />

        {/* Section 5: Achievements */}
        <AchievementsSection />

        {/* Section 6: Contact */}
        <ContactSection />
      </main>

      {/* Shared Space-themed Footer */}
      <Footer />
    </div>
  );
}

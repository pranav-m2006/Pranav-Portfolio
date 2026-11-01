import { useRef, useState, useCallback } from 'react';
import { 
  ArrowRight, 
  Github, 
  Linkedin, 
  Sparkles, 
  Terminal, 
  ChevronDown,
  Code2,
  BrainCircuit,
  GraduationCap
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Workstation3D from '../components/Workstation3D';
import { PERSONAL_INFO } from '../data/portfolioData';

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);

  // Interactive Cursor-responsive Lighting for the Name
  const [nameLight, setNameLight] = useState({ x: 50, y: 50, active: false });

  const handleNameMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setNameLight({ x, y, active: true });
  }, []);

  const handleNameMouseLeave = useCallback(() => {
    setNameLight((prev) => ({ ...prev, active: false }));
  }, []);

  useGSAP(
    () => {
      // 1. Initial Orchestrated Entrance Sequence
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-badge-anim', {
        y: -25,
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
      })
      .from('.hero-name-word', {
        y: 60,
        opacity: 0,
        rotateX: 25,
        stagger: 0.15,
        duration: 1.1,
        ease: 'power4.out',
        clearProps: 'transform,opacity',
      }, '-=0.5')
      .from('.hero-role-anim', {
        y: 30,
        opacity: 0,
        duration: 0.85,
        clearProps: 'transform,opacity',
      }, '-=0.6')
      .from('.hero-desc-anim', {
        y: 25,
        opacity: 0,
        duration: 0.8,
        clearProps: 'transform,opacity',
      }, '-=0.5')
      .from('.hero-actions-anim button', {
        y: 25,
        opacity: 0,
        scale: 0.96,
        stagger: 0.12,
        duration: 0.75,
        clearProps: 'transform,opacity',
      }, '-=0.5')
      .from('.hero-meta-anim', {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.65,
        clearProps: 'transform,opacity',
      }, '-=0.4')
      .from('.hero-3d-scene', {
        scale: 0.92,
        opacity: 0,
        x: 35,
        duration: 1.1,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      }, '-=0.8');

      // 2. GSAP Scroll Parallax: Smooth depth translation while KEEPING 100% VISIBILITY
      gsap.to('.hero-3d-scene', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
        y: 60,
        scale: 0.96,
        ease: 'none',
      });

      gsap.to(leftContentRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
        y: 35,
        ease: 'none',
      });
    },
    { scope: containerRef }
  );

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 85;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navOffset;

      if ((window as any).__lenis) {
        (window as any).__lenis.scrollTo(offsetPosition, { duration: 1.2 });
      } else {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-[100dvh] flex flex-col justify-center pt-28 pb-16 px-6 sm:px-10 lg:px-14 z-10"
      aria-label="Home and 3D Developer Workstation Showcase"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
        {/* LEFT COLUMN: Editorial Name Design, Role & Action CTAs (6 cols) */}
        <div ref={leftContentRef} className="lg:col-span-6 space-y-7 sm:space-y-8">
          
          {/* Status Badge */}
          <div className="hero-badge-anim inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 font-mono text-xs uppercase tracking-wider shadow-glow-sm backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-glow-cyan" />
            <span>Available for Full-Time Roles &bull; 2026</span>
          </div>

          {/* MAIN VISUAL IDENTITY: EDITORIAL NAME DESIGN */}
          <div
            className="hero-name-anim relative group rounded-3xl p-2 -ml-2 select-none"
            onMouseMove={handleNameMouseMove}
            onMouseLeave={handleNameMouseLeave}
          >
            {/* Subtle Cursor-Responsive Backlight Beam */}
            <div
              className="pointer-events-none absolute -inset-4 rounded-3xl transition-opacity duration-500"
              style={{
                opacity: nameLight.active ? 0.35 : 0.08,
                background: `radial-gradient(circle 280px at ${nameLight.x}% ${nameLight.y}%, rgba(0, 240, 255, 0.45), rgba(139, 92, 246, 0.2), transparent 75%)`,
              }}
            />

            <h1 className="relative font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold tracking-tight leading-none text-white whitespace-nowrap select-none">
              <span className="hero-name-word inline-block transition-transform duration-300 hover:scale-[1.01]">
                Pranav
              </span>{' '}
              <span className="hero-name-word inline-block bg-gradient-to-r from-cyan-300 via-sky-200 to-violet-400 bg-clip-text text-transparent drop-shadow-sm transition-transform duration-300 hover:scale-[1.02]">
                M.
              </span>
            </h1>
          </div>

          {/* SOPHISTICATED ROLE PRESENTATION */}
          <div className="hero-role-anim space-y-2">
            <div className="flex flex-wrap items-center gap-2.5 font-heading text-lg sm:text-2xl font-bold tracking-tight text-slate-100">
              <span className="text-white whitespace-nowrap">Frontend Developer</span>
              <span className="text-cyan-400 font-mono text-sm">&bull;</span>
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-300 bg-clip-text text-transparent whitespace-nowrap">
                AI/ML Practitioner
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-slate-400 tracking-wide">
              <span>B.E. Computer Science</span>
              <span>/</span>
              <span className="text-cyan-300">SNS College of Engineering</span>
              <span>/</span>
              <span className="text-emerald-400">CGPA 8.00</span>
            </div>
          </div>

          {/* Concise, Natural Bio Statement */}
          <p className="hero-desc-anim text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl font-normal">
            Specialized in engineering high-fidelity web experiences, component architectures, and pragmatic AI/ML integrations. Building software focused on predictable execution, clarity, and real-world impact.
          </p>

          {/* Larger, High-Utility Action Buttons */}
          <div className="hero-actions-anim flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => scrollToSection('projects')}
              className="px-7 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-sm sm:text-base tracking-wide flex items-center gap-2.5 transition-all shadow-glow-cyan hover:scale-[1.03] active:scale-95 cursor-pointer"
            >
              <span>Explore My Projects</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('about')}
              className="px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-cyan-500/50 text-white font-semibold text-sm sm:text-base tracking-wide transition-all hover:scale-[1.03] active:scale-95 cursor-pointer backdrop-blur-md"
            >
              About Me
            </button>
          </div>

          {/* Verified Social Profiles & Education Highlights */}
          <div className="hero-meta-anim pt-5 border-t border-white/[0.08] flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-md"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-md"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            <div className="text-xs font-mono text-slate-400 space-y-1">
              <div className="text-slate-200 font-semibold flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <span>SNS College of Engineering (B.E. CST)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span>Internships: Thrivels &bull; CodSoft &bull; InternPe</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D DEVELOPER SEATED AT WORKSTATION (6 cols) */}
        <div className="hero-3d-scene lg:col-span-6 h-[480px] sm:h-[560px] lg:h-[620px] relative rounded-3xl bg-gradient-to-b from-slate-900/50 via-slate-900/30 to-slate-950/70 border border-white/[0.1] shadow-2xl overflow-hidden group backdrop-blur-md">
          {/* Workstation Header HUD Tag */}
          <div className="absolute top-4 left-4 z-10 font-mono text-[11px] text-cyan-400/90 tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>3D Workspace // Active Developer Scene</span>
          </div>

          {/* Render the 3D Workstation with Seated Working Developer */}
          <Workstation3D className="w-full h-full" enableControls={true} />
        </div>
      </div>

      {/* Down Scroll Indicator */}
      <div className="hidden sm:flex justify-center pt-8">
        <button
          type="button"
          onClick={() => scrollToSection('about')}
          aria-label="Scroll to About Me section"
          className="group flex flex-col items-center gap-1.5 text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer"
        >
          <span className="font-mono text-[11px] uppercase tracking-widest text-slate-400 group-hover:text-cyan-400">
            Scroll to Explore
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce text-cyan-400/80" />
        </button>
      </div>
    </section>
  );
}

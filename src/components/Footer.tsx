import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
    <footer className="border-t border-white/[0.08] bg-[#020408]/90 backdrop-blur-md pt-16 pb-12 px-6 md:px-12 relative overflow-hidden z-10">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center font-mono font-bold text-sm shadow-glow-sm">
                <span className="text-cyan-400">P</span>
                <span className="text-violet-400">M</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-white font-display">
                PRANAV M.
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Frontend Developer &amp; AI/ML Practitioner specializing in high-fidelity interactive web systems, intelligent application architectures, and applied machine learning models.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-white/10 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for Collaborative Engineering</span>
            </div>
          </div>

          {/* Quick Page Links (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Continuous Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <button
                type="button"
                onClick={() => scrollToSection('home')}
                className="text-left text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
              >
                01 // Home
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('about')}
                className="text-left text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
              >
                02 // About
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('skills')}
                className="text-left text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
              >
                03 // Skills
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('projects')}
                className="text-left text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
              >
                04 // Projects
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('achievements')}
                className="text-left text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
              >
                05 // Honors
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('contact')}
                className="text-left text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
              >
                06 // Contact
              </button>
            </div>
          </div>

          {/* Verified Social & Email (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Verified Profiles
            </h4>
            <div className="flex flex-col space-y-2 text-sm">
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-slate-400 hover:text-white group p-2.5 rounded-lg bg-slate-900/60 border border-white/[0.05] hover:border-cyan-500/30 transition-all hover:scale-[1.02]"
              >
                <span className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-cyan-400" />
                  <span>GitHub</span>
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </a>

              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-slate-400 hover:text-white group p-2.5 rounded-lg bg-slate-900/60 border border-white/[0.05] hover:border-cyan-500/30 transition-all hover:scale-[1.02]"
              >
                <span className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-cyan-400" />
                  <span>LinkedIn</span>
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </a>

              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="flex items-center justify-between text-slate-400 hover:text-white group p-2.5 rounded-lg bg-slate-900/60 border border-white/[0.05] hover:border-cyan-500/30 transition-all hover:scale-[1.02]"
              >
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-violet-400" />
                  <span>Direct Email</span>
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-violet-400 transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span>&copy; {currentYear} {PERSONAL_INFO.name}</span>
            <span>&bull;</span>
            <span>All rights reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <span>3D Space &amp; Workstation Engine</span>
            <span>&bull;</span>
            <span className="text-cyan-400 font-semibold">{PERSONAL_INFO.college}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

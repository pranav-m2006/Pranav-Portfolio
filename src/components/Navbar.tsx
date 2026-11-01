import { useState, useEffect } from 'react';
import { Github, Linkedin, Menu, X, ArrowUpRight, Cpu } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface NavSectionItem {
  name: string;
  id: string;
  number: string;
}

const NAV_SECTIONS: NavSectionItem[] = [
  { name: 'Home', id: 'home', number: '01' },
  { name: 'About', id: 'about', number: '02' },
  { name: 'Skills', id: 'skills', number: '03' },
  { name: 'Projects', id: 'projects', number: '04' },
  { name: 'Achievements', id: 'achievements', number: '05' },
  { name: 'Contact', id: 'contact', number: '06' },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Smooth scroll handler
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 85;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navOffset;

      // Check if global Lenis instance is available
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

  // Active section tracking with IntersectionObserver
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    NAV_SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#03060E]/85 backdrop-blur-md border-b border-white/[0.08] py-3.5 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Monogram Brand Identity */}
        <button
          type="button"
          onClick={() => scrollToSection('home')}
          className="group flex items-center gap-3 text-left focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg outline-none"
          aria-label="Scroll to Home"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 group-hover:border-cyan-400/50 flex items-center justify-center font-mono font-bold text-white transition-all shadow-glow-sm">
            <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors">P</span>
            <span className="text-violet-400 group-hover:text-violet-300 transition-colors">M</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors font-display">
              PRANAV M.
            </span>
            <span className="font-mono text-[10px] text-slate-400 tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              AI // DEV
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links (All 6 Sections on Continuous Single Page) */}
        <nav
          className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-slate-900/80 border border-white/10 backdrop-blur-md shadow-xl"
          aria-label="Main Navigation"
        >
          {NAV_SECTIONS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-white border border-cyan-500/40 shadow-glow-sm font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span className={`font-mono text-[10px] ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
                  {item.number}
                </span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Desktop Social & Contact Links */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pranav M. on GitHub"
            className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/40 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pranav M. on LinkedIn"
            className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/40 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <button
            type="button"
            onClick={() => scrollToSection('contact')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-400/40 text-cyan-300 hover:text-white text-xs font-mono font-semibold tracking-wide flex items-center gap-1.5 transition-all shadow-glow-sm hover:border-cyan-400 cursor-pointer hover:scale-105 active:scale-95"
          >
            <span>CONNECT</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
          className="md:hidden p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-cyan-400 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#03060E]/98 border-b border-slate-800 px-6 py-6 space-y-4 backdrop-blur-xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-1">
            {NAV_SECTIONS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 border border-cyan-500/40 text-cyan-300 font-semibold shadow-glow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  <span>{item.name}</span>
                  <span className="font-mono text-xs text-slate-500">{item.number}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold"
            >
              GET IN TOUCH
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

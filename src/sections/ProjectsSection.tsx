import { useState, useRef } from 'react';
import { 
  Github, 
  ExternalLink, 
  AlertTriangle, 
  Workflow, 
  Users, 
  CheckCircle2, 
  CloudRain, 
  X,
  Code2,
  Cpu,
  ChevronDown,
  ChevronUp,
  Layers
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import CardTilt from '../components/CardTilt';
import { PROJECTS, ProjectItem } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [expandedApproach, setExpandedApproach] = useState<{ [key: string]: boolean }>({
    'ai-skill-twin': false,
    'disaster-management': false,
  });
  const [modalProject, setModalProject] = useState<ProjectItem | null>(null);

  useGSAP(
    () => {
      // 1. Projects Section Header Entrance
      gsap.from('.projects-header-reveal', {
        scrollTrigger: {
          trigger: '.projects-header-reveal',
          start: 'top 85%',
          once: true,
        },
        y: 40,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'all',
      });

      // 2. Project Card 1 (AI Skill Twin) Progressive Perspective Entrance
      gsap.from('.project-card-1', {
        scrollTrigger: {
          trigger: '.project-card-1',
          start: 'top 82%',
          once: true,
        },
        y: 60,
        opacity: 0,
        scale: 0.98,
        duration: 0.95,
        ease: 'power3.out',
        clearProps: 'all',
      });

      // Subtle Scroll Parallax on Project 1 Preview Window
      gsap.to('.project-preview-1', {
        scrollTrigger: {
          trigger: '.project-card-1',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
        y: -35,
        ease: 'none',
      });

      // 3. Project Card 2 (Disaster Management) Progressive Entrance
      gsap.from('.project-card-2', {
        scrollTrigger: {
          trigger: '.project-card-2',
          start: 'top 82%',
          once: true,
        },
        y: 60,
        opacity: 0,
        scale: 0.98,
        duration: 0.95,
        ease: 'power3.out',
        clearProps: 'all',
      });

      // Subtle Scroll Parallax on Project 2 Weather Window
      gsap.to('.project-preview-2', {
        scrollTrigger: {
          trigger: '.project-card-2',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
        y: -35,
        ease: 'none',
      });
    },
    { scope: sectionRef }
  );

  // Smooth scroll to Technical Approach panel accounting for sticky navbar
  const handleToggleTechnicalApproach = (projectId: string) => {
    const isCurrentlyExpanded = !!expandedApproach[projectId];
    const willBeExpanded = !isCurrentlyExpanded;

    setExpandedApproach((prev) => ({
      ...prev,
      [projectId]: willBeExpanded,
    }));

    if (willBeExpanded) {
      setTimeout(() => {
        const targetElement = document.getElementById(`technical-approach-${projectId}`);
        if (targetElement) {
          const navOffset = 90;
          const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - navOffset;

          if ((window as any).__lenis) {
            (window as any).__lenis.scrollTo(offsetPosition, { duration: 1.0 });
          } else {
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            });
          }

          // Recalculate ScrollTrigger positions after expanding content
          ScrollTrigger.refresh();
        }
      }, 100);
    } else {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    }
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-24 sm:py-32 px-6 sm:px-10 lg:px-14 z-10 border-t border-white/[0.08]"
      aria-label="Production Projects Showcase"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* ===================== SECTION HEADER ===================== */}
        <div className="projects-header-reveal border-b border-white/[0.08] pb-10 space-y-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-400 font-mono text-xs uppercase tracking-wider backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>04 // Selected Engineering Projects</span>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-heading leading-[1.08]">
            Production Case Studies
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-3xl leading-relaxed">
            Detailed engineering breakdowns of my primary software projects—built for tangible utility, rigorous logic, and practical real-world impact. Inspect features, architecture, and live repositories.
          </p>
        </div>

        {/* ===================== PROJECT 01: AI SKILL TWIN ===================== */}
        {PROJECTS[0] && (
          <article
            id="ai-skill-twin-card"
            className="project-card-1 p-8 sm:p-12 lg:p-14 rounded-3xl bg-slate-900/80 border border-white/[0.09] shadow-2xl relative overflow-hidden backdrop-blur-md hover:border-cyan-500/40 transition-all space-y-8"
            aria-label="Case Study: AI Skill Twin"
          >
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              {/* Left Column: Visual Showcase & Workflow (6 cols) */}
              <div className="lg:col-span-6 space-y-6">
                {/* Genuine App Preview Window */}
                <div className="project-preview-1 rounded-2xl overflow-hidden border border-white/10 bg-slate-950 shadow-2xl group">
                  <div className="px-5 py-3.5 bg-slate-950/90 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                      <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                      <span className="ml-2.5 font-mono text-xs text-slate-400 hidden sm:inline">
                        ai-skill-twin.vercel.app
                      </span>
                    </div>
                    <span className="font-mono text-xs px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Verified Live App
                    </span>
                  </div>

                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                    <img
                      src={PROJECTS[0].previewImage}
                      alt={PROJECTS[0].previewAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Workflow Architecture Grid */}
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-white/[0.08] space-y-3.5">
                  <div className="font-mono text-xs uppercase tracking-wider text-cyan-400 flex items-center gap-2 font-bold">
                    <Workflow className="w-4 h-4" />
                    <span>System Execution Flow</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PROJECTS[0].workflow.map((item) => (
                      <div key={item.step} className="p-3.5 rounded-xl bg-slate-900/90 border border-white/5 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-cyan-400 font-bold">{item.step}</span>
                          <span className="text-xs sm:text-sm text-white font-semibold">{item.title}</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Problem, Features, Technologies, & Actions (6 cols) */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest font-bold">
                      PROJECT {PROJECTS[0].number}
                    </span>
                    <span className="text-slate-600">//</span>
                    <span className="font-mono text-xs text-slate-400 uppercase">
                      {PROJECTS[0].category}
                    </span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-heading">
                    {PROJECTS[0].title}
                  </h3>
                  <p className="text-sm sm:text-base text-cyan-300 font-medium mt-1">
                    {PROJECTS[0].badge}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {PROJECTS[0].overview}
                </p>

                {/* Problem & Target User Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-white/[0.07] space-y-1.5">
                    <div className="font-mono text-xs uppercase text-amber-400 flex items-center gap-1.5 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Identified Gap</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {PROJECTS[0].problem}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/80 border border-white/[0.07] space-y-1.5">
                    <div className="font-mono text-xs uppercase text-cyan-400 flex items-center gap-1.5 font-bold">
                      <Users className="w-3.5 h-3.5" />
                      <span>Target Users</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {PROJECTS[0].targetUsers}
                    </p>
                  </div>
                </div>

                {/* Key Verified Implemented Features */}
                <div className="space-y-2.5">
                  <div className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-bold">
                    Key Implemented Capabilities
                  </div>
                  {PROJECTS[0].features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Technologies Actually Used */}
                <div className="space-y-2">
                  <div className="font-mono text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Verified Tech Stack
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {PROJECTS[0].technologies.map((tech) => (
                      <span
                        key={tech.name}
                        className="px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 font-mono text-xs text-slate-200"
                      >
                        <span className="text-cyan-400 font-bold mr-1">#</span>
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons: Live Demo, GitHub, and Functional Technical Approach */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <a
                    href={PROJECTS[0].liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs sm:text-sm tracking-wide flex items-center gap-2 transition-all shadow-glow-cyan hover:scale-[1.03] active:scale-95 cursor-pointer"
                  >
                    <span>Launch Live Application</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <a
                    href={PROJECTS[0].githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-white/10 hover:border-cyan-400/50 text-white font-mono text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Github className="w-4 h-4" />
                    <span>View on GitHub</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleToggleTechnicalApproach(PROJECTS[0].id)}
                    className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-cyan-500/30 hover:border-cyan-400/60 font-mono text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-glow-sm"
                  >
                    <span>Technical Approach</span>
                    {expandedApproach[PROJECTS[0].id] ? (
                      <ChevronUp className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-cyan-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* EXPANDABLE IN-PLACE TECHNICAL APPROACH BREAKDOWN */}
            {expandedApproach[PROJECTS[0].id] && (
              <div
                id={`technical-approach-${PROJECTS[0].id}`}
                className="pt-8 border-t border-white/10 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider font-bold">
                    <Cpu className="w-4 h-4" />
                    <span>AI Skill Twin // Architectural Specification</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleTechnicalApproach(PROJECTS[0].id)}
                    className="text-slate-400 hover:text-white text-xs font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <span>Collapse View</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Architecture & Engineering Methodology */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
                    <h5 className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-bold">
                      Data Pipeline &amp; Parsing Layer
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Built with a modular frontend architecture consuming structured AI roadmap schemas. Handles dynamic course state tracking, asynchronous resume text extraction, and skill cluster mapping.
                    </p>
                    <div className="text-xs font-mono text-slate-400 pt-1 space-y-1">
                      <div>&bull; State Engine: React context &amp; local persistence</div>
                      <div>&bull; LLM Bridge: Prompt-engineered schema returns</div>
                      <div>&bull; Visualization: Responsive SVG roadmap hierarchy</div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
                    <h5 className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-bold">
                      Verified Implemented Capabilities
                    </h5>
                    <div className="space-y-1.5 text-xs sm:text-sm text-slate-300">
                      {PROJECTS[0].features.map((c, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Technology Roles Matrix */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
                  <h5 className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-bold">
                    Component Implementation Roles
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {PROJECTS[0].technologies.map((t) => (
                      <div key={t.name} className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                        <div className="font-mono text-xs text-white font-bold">{t.name}</div>
                        <div className="text-xs text-cyan-400">{t.category}</div>
                        <div className="text-xs text-slate-400 leading-relaxed">{t.purpose}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </article>
        )}

        {/* ===================== PROJECT 02: DISASTER MANAGEMENT SYSTEM ===================== */}
        {PROJECTS[1] && (
          <article
            id="disaster-management-card"
            className="project-card-2 p-8 sm:p-12 lg:p-14 rounded-3xl bg-slate-900/80 border border-white/[0.09] shadow-2xl relative overflow-hidden backdrop-blur-md hover:border-sky-500/40 transition-all space-y-8"
            aria-label="Case Study: Disaster Management System"
          >
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              {/* Left Column: Visual Showcase & Workflow (6 cols) */}
              <div className="lg:col-span-6 space-y-6">
                {/* Weather Intelligence Window */}
                <div className="project-preview-2 rounded-2xl overflow-hidden border border-white/10 bg-slate-950 shadow-2xl group">
                  <div className="px-5 py-3.5 bg-slate-950/90 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CloudRain className="w-4 h-4 text-sky-400" />
                      <span className="font-mono text-xs text-slate-300 font-bold">
                        Meteorological Risk Engine
                      </span>
                    </div>
                    <span className="font-mono text-xs px-3 py-1 rounded-full bg-slate-900 text-sky-300 border border-sky-500/30 flex items-center gap-1.5 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                      Local ML Runtime
                    </span>
                  </div>

                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                    <img
                      src={PROJECTS[1].previewImage}
                      alt={PROJECTS[1].previewAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Workflow Pipeline Grid */}
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-white/[0.08] space-y-3.5">
                  <div className="font-mono text-xs uppercase tracking-wider text-sky-400 flex items-center gap-2 font-bold">
                    <Workflow className="w-4 h-4" />
                    <span>Hazard Prediction &amp; Advisory Workflow</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PROJECTS[1].workflow.map((item) => (
                      <div key={item.step} className="p-3.5 rounded-xl bg-slate-900/90 border border-white/5 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-sky-400 font-bold">{item.step}</span>
                          <span className="text-xs sm:text-sm text-white font-semibold">{item.title}</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Specs & Strict GitHub Action */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs text-sky-400 uppercase tracking-widest font-bold">
                      PROJECT {PROJECTS[1].number}
                    </span>
                    <span className="text-slate-600">//</span>
                    <span className="font-mono text-xs text-slate-400 uppercase">
                      {PROJECTS[1].category}
                    </span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-heading">
                    {PROJECTS[1].title}
                  </h3>
                  <p className="text-sm sm:text-base text-sky-300 font-medium mt-1">
                    {PROJECTS[1].badge}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {PROJECTS[1].overview}
                </p>

                {/* Gap & Beneficiaries Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-white/[0.07] space-y-1.5">
                    <div className="font-mono text-xs uppercase text-amber-400 flex items-center gap-1.5 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Identified Hazard Gap</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {PROJECTS[1].problem}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/80 border border-white/[0.07] space-y-1.5">
                    <div className="font-mono text-xs uppercase text-sky-400 flex items-center gap-1.5 font-bold">
                      <Users className="w-3.5 h-3.5" />
                      <span>Target Beneficiaries</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {PROJECTS[1].targetUsers}
                    </p>
                  </div>
                </div>

                {/* Key Features */}
                <div className="space-y-2.5">
                  <div className="font-mono text-xs uppercase tracking-wider text-sky-400 font-bold">
                    Key Meteorological Capabilities
                  </div>
                  {PROJECTS[1].features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Verified Tech Stack */}
                <div className="space-y-2">
                  <div className="font-mono text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Verified Tech Stack
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {PROJECTS[1].technologies.map((tech) => (
                      <span
                        key={tech.name}
                        className="px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 font-mono text-xs text-slate-200"
                      >
                        <span className="text-sky-400 font-bold mr-1">#</span>
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons: Strict GitHub + Technical Approach (Strictly NO Live Demo) */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <a
                    href={PROJECTS[1].githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm tracking-wide flex items-center gap-2 transition-all shadow-glow-cyan hover:scale-[1.03] active:scale-95 cursor-pointer"
                  >
                    <Github className="w-4 h-4" />
                    <span>View Repository on GitHub</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleToggleTechnicalApproach(PROJECTS[1].id)}
                    className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-300 hover:text-white border border-sky-500/30 hover:border-sky-400/60 font-mono text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-glow-sm"
                  >
                    <span>Technical Approach</span>
                    {expandedApproach[PROJECTS[1].id] ? (
                      <ChevronUp className="w-4 h-4 text-sky-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-sky-400" />
                    )}
                  </button>

                  <span className="px-3 py-2 rounded-lg bg-slate-950 border border-white/10 font-mono text-xs text-slate-400">
                    Local Environment &bull; Verified Git Project
                  </span>
                </div>
              </div>
            </div>

            {/* EXPANDABLE IN-PLACE TECHNICAL APPROACH BREAKDOWN */}
            {expandedApproach[PROJECTS[1].id] && (
              <div
                id={`technical-approach-${PROJECTS[1].id}`}
                className="pt-8 border-t border-white/10 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2 text-sky-400 font-mono text-xs uppercase tracking-wider font-bold">
                    <Cpu className="w-4 h-4" />
                    <span>Disaster Management // Architecture &amp; ML Pipeline</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleTechnicalApproach(PROJECTS[1].id)}
                    className="text-slate-400 hover:text-white text-xs font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <span>Collapse View</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
                    <h5 className="font-mono text-xs uppercase tracking-wider text-sky-400 font-bold">
                      Telemetry Ingestion &amp; Classification
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Accepts live or historical sensor inputs including precipitation rate, wind speed, barometric pressure, and regional elevation. Classifies severe weather anomalies and generates graded risk advisories.
                    </p>
                    <div className="text-xs font-mono text-slate-400 pt-1 space-y-1">
                      <div>&bull; Algorithm: Supervised classification on climatic metrics</div>
                      <div>&bull; Output: Categorical threat ratings (Low, Moderate, Severe)</div>
                      <div>&bull; Action: Automated safety protocol recommendations</div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
                    <h5 className="font-mono text-xs uppercase tracking-wider text-sky-400 font-bold">
                      Deployment &amp; Runtime Boundaries
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Architected as a local runtime service to guarantee zero dependency on external cloud uptime during severe environmental network degradations.
                    </p>
                    <div className="space-y-1.5 text-xs sm:text-sm text-slate-300">
                      {PROJECTS[1].features.map((c, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Technology Matrix */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
                  <h5 className="font-mono text-xs uppercase tracking-wider text-sky-400 font-bold">
                    Component Implementation Roles
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {PROJECTS[1].technologies.map((t) => (
                      <div key={t.name} className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                        <div className="font-mono text-xs text-white font-bold">{t.name}</div>
                        <div className="text-xs text-sky-400">{t.category}</div>
                        <div className="text-xs text-slate-400 leading-relaxed">{t.purpose}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </article>
        )}

      </div>
    </section>
  );
}

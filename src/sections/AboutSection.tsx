import { useRef } from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  BrainCircuit, 
  Code2, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import CardTilt from '../components/CardTilt';
import { PERSONAL_INFO, EXPERIENCES, EDUCATION } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // 1. Header & Narrative Bio Entrance
      gsap.from('.about-header-reveal', {
        scrollTrigger: {
          trigger: '.about-header-reveal',
          start: 'top 85%',
          once: true,
        },
        y: 40,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'all',
      });

      gsap.from('.about-bio-reveal > *', {
        scrollTrigger: {
          trigger: '.about-bio-reveal',
          start: 'top 85%',
          once: true,
        },
        y: 35,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'all',
      });

      // 2. Core Pillars Staggered Entrance
      gsap.from('.about-pillar-card', {
        scrollTrigger: {
          trigger: '.about-pillars-group',
          start: 'top 85%',
          once: true,
        },
        y: 45,
        opacity: 0,
        scale: 0.96,
        stagger: 0.15,
        duration: 0.75,
        ease: 'power2.out',
        clearProps: 'all',
      });

      // 3. Internship Work History Cards Entrance
      gsap.from('.about-exp-card', {
        scrollTrigger: {
          trigger: '.about-exp-group',
          start: 'top 85%',
          once: true,
        },
        y: 45,
        opacity: 0,
        stagger: 0.16,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'all',
      });

      // 4. Education & Academic Credentials Cards Entrance
      gsap.from('.about-edu-card', {
        scrollTrigger: {
          trigger: '.about-edu-group',
          start: 'top 85%',
          once: true,
        },
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'all',
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 sm:py-32 px-6 sm:px-10 lg:px-14 z-10 border-t border-white/[0.08]"
      aria-label="About Me, Engineering Background and Experience"
    >
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* ===================== SECTION HEADER & EDITORIAL BIO ===================== */}
        <div className="space-y-10">
          <div className="about-header-reveal space-y-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900 border border-violet-500/30 text-violet-300 font-mono text-xs uppercase tracking-wider backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-pulse" />
              <span>02 // Profile &amp; Background</span>
            </div>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-heading leading-[1.08]">
              Engineering Interfaces with{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-400 bg-clip-text text-transparent">
                Precision &amp; Applied AI.
              </span>
            </h2>
          </div>

          <div className="about-bio-reveal grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-7 space-y-6 text-slate-300 text-base sm:text-lg lg:text-xl leading-relaxed">
              <p>
                I am <strong className="text-white font-semibold whitespace-nowrap">{PERSONAL_INFO.name}</strong>, a Computer Science and Technology student at{' '}
                <strong className="text-cyan-400 font-semibold">{PERSONAL_INFO.college}</strong> with a concentrated focus on modern frontend engineering, component systems, and practical AI/ML integrations.
              </p>
              <p className="text-slate-400 text-base sm:text-lg">
                Rather than treating artificial intelligence and frontend architecture as disconnected fields, I focus on integrating them: taking predictive machine learning algorithms and wrapping them in clean, responsive, human-respectful web interfaces.
              </p>
              <p className="text-slate-400 text-base sm:text-lg">
                Whether architecting dynamic career roadmaps for students in <em>AI Skill Twin</em> or modeling meteorological disaster risks in the <em>Disaster Management System</em>, I build software that addresses real problems with predictable execution.
              </p>
            </div>

            {/* Quick Metadata Spec Panel */}
            <CardTilt className="lg:col-span-5 p-8 sm:p-9 rounded-3xl bg-slate-900/80 border border-white/[0.09] space-y-4 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Discipline</span>
                <span className="text-sm sm:text-base font-semibold text-white">Frontend &amp; Applied AI/ML</span>
              </div>
              <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Institution</span>
                <span className="text-sm sm:text-base font-semibold text-cyan-400">{PERSONAL_INFO.college}</span>
              </div>
              <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Academic Record</span>
                <span className="text-sm sm:text-base font-semibold text-white">CGPA {PERSONAL_INFO.cgpa} / 10</span>
              </div>
              <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Location</span>
                <span className="text-sm sm:text-base font-semibold text-slate-300">{PERSONAL_INFO.location}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Internships</span>
                <span className="text-xs sm:text-sm font-mono text-violet-300 font-semibold">Thrivels &bull; CodSoft &bull; InternPe</span>
              </div>
            </CardTilt>
          </div>
        </div>

        {/* ===================== CORE ARCHITECTURAL PILLARS ===================== */}
        <div className="about-pillars-group space-y-8">
          <div>
            <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1.5 font-bold">
              Engineering Mindset
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-heading">
              Core Architectural Pillars
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardTilt className="about-pillar-card p-8 sm:p-9 rounded-3xl bg-slate-900/75 border border-white/[0.08] space-y-4 hover:border-cyan-500/40 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-glow-sm">
                <Code2 className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white font-heading">Modern Frontend Engineering</h4>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Prioritizing clean TypeScript types, reusable component structures, responsive layouts without layout shifts, and respectful micro-interactions.
              </p>
            </CardTilt>

            <CardTilt className="about-pillar-card p-8 sm:p-9 rounded-3xl bg-slate-900/75 border border-white/[0.08] space-y-4 hover:border-violet-500/40 transition-all shadow-xl" glowColor="rgba(139, 92, 246, 0.16)">
              <div className="w-12 h-12 rounded-2xl bg-violet-950/80 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-glow-violet">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white font-heading">Applied AI/ML Integration</h4>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Grounding machine learning in tangible problems: from weather telemetry classification models to LLM-powered curriculum and resume parsing pipelines.
              </p>
            </CardTilt>

            <CardTilt className="about-pillar-card p-8 sm:p-9 rounded-3xl bg-slate-900/75 border border-white/[0.08] space-y-4 hover:border-emerald-500/40 transition-all shadow-xl" glowColor="rgba(16, 185, 129, 0.16)">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Cpu className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white font-heading">Empirical Discipline</h4>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Sharpened through competitive hackathons, published patents, and continuous algorithmic problem-solving on LeetCode.
              </p>
            </CardTilt>
          </div>
        </div>

        {/* ===================== INTERNSHIP EXPERIENCE ===================== */}
        <div className="about-exp-group space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1.5 font-bold">
                Work History
              </span>
              <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-heading">
                Web Development Internships
              </h3>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Verified Experience Records
            </div>
          </div>

          <div className="space-y-6">
            {EXPERIENCES.map((exp) => (
              <CardTilt
                key={exp.company}
                className="about-exp-card p-8 sm:p-9 rounded-3xl bg-slate-900/80 border border-white/[0.09] hover:border-cyan-500/40 transition-all space-y-5 shadow-2xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="text-2xl font-bold text-white font-heading">
                        {exp.company}
                      </h4>
                      {exp.isCurrent && (
                        <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold">
                          Current Internship
                        </span>
                      )}
                    </div>
                    <p className="text-cyan-400 font-semibold text-sm sm:text-base mt-1">{exp.role}</p>
                  </div>

                  <div className="flex items-center gap-5 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                {/* Responsibilities */}
                <div className="space-y-2.5">
                  {exp.responsibilities.map((resp, rIdx) => (
                    <div key={rIdx} className="flex items-start gap-3 text-sm sm:text-base text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-1" />
                      <span className="leading-relaxed">{resp}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {exp.techPills.map((pill) => (
                    <span
                      key={pill}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 font-mono text-xs text-slate-200"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </CardTilt>
            ))}
          </div>
        </div>

        {/* ===================== EDUCATION ===================== */}
        <div className="about-edu-group space-y-8">
          <div>
            <span className="font-mono text-xs text-violet-400 uppercase tracking-widest block mb-1.5 font-bold">
              Academic Foundation
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-heading">
              Education &amp; Credentials
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {EDUCATION.map((edu) => (
              <CardTilt
                key={edu.institution}
                className="about-edu-card p-8 sm:p-9 rounded-3xl bg-slate-900/80 border border-white/[0.09] flex flex-col justify-between space-y-5 shadow-2xl hover:border-violet-500/40 transition-all"
                glowColor="rgba(139, 92, 246, 0.15)"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center text-cyan-400 shadow-md">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white block">
                        {edu.score}
                      </span>
                      <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">
                        {edu.scoreLabel}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-2xl font-bold text-white font-heading">
                      {edu.institution}
                    </h4>
                    <p className="text-base text-slate-300 font-medium mt-1">
                      {edu.degree}
                    </p>
                    <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-2">
                      <span>{edu.period}</span>
                      <span>&bull;</span>
                      <span>{edu.location}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-white/[0.08]">
                    {edu.highlights.map((hl, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-400">
                        <span className="text-cyan-400 font-bold">&rsaquo;</span>
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardTilt>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

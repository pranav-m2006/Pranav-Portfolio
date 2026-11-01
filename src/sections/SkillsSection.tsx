import { useState, useRef } from 'react';
import { 
  Code2, 
  Layout, 
  Server, 
  BrainCircuit, 
  Wrench, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import CardTilt from '../components/CardTilt';
import { SKILL_CATEGORIES } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategoryKey, setActiveCategoryKey] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<{
    name: string;
    description: string;
    tag: string;
    categoryTitle: string;
  } | null>({
    name: SKILL_CATEGORIES[0].items[0].name,
    description: SKILL_CATEGORIES[0].items[0].description,
    tag: SKILL_CATEGORIES[0].items[0].tag,
    categoryTitle: SKILL_CATEGORIES[0].title,
  });

  useGSAP(
    () => {
      // 1. Header Entrance
      gsap.from('.skills-header-reveal', {
        scrollTrigger: {
          trigger: '.skills-header-reveal',
          start: 'top 85%',
          once: true,
        },
        y: 40,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'all',
      });

      // 2. Filter Pills Stagger
      gsap.from('.skills-pills-reveal button', {
        scrollTrigger: {
          trigger: '.skills-pills-reveal',
          start: 'top 85%',
          once: true,
        },
        y: 25,
        opacity: 0,
        scale: 0.95,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power2.out',
        clearProps: 'all',
      });

      // 3. Category Cards Staggered Cascade
      gsap.from('.skills-category-card', {
        scrollTrigger: {
          trigger: '.skills-cards-container',
          start: 'top 85%',
          once: true,
        },
        y: 50,
        opacity: 0,
        scale: 0.97,
        stagger: 0.16,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'all',
      });

      // 4. Side Telemetry Inspector Entrance
      gsap.from('.skills-inspector-reveal', {
        scrollTrigger: {
          trigger: '.skills-inspector-reveal',
          start: 'top 85%',
          once: true,
        },
        x: 45,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'all',
      });
    },
    { scope: sectionRef }
  );

  const getCategoryIcon = (key: string) => {
    switch (key) {
      case 'languages':
        return <Code2 className="w-5 h-5 text-cyan-400" />;
      case 'frontend':
        return <Layout className="w-5 h-5 text-violet-400" />;
      case 'backend':
        return <Server className="w-5 h-5 text-sky-400" />;
      case 'aiml':
        return <BrainCircuit className="w-5 h-5 text-emerald-400" />;
      case 'tools':
        return <Wrench className="w-5 h-5 text-amber-400" />;
      default:
        return <Layers className="w-5 h-5 text-cyan-400" />;
    }
  };

  const filteredCategories =
    activeCategoryKey === 'all'
      ? SKILL_CATEGORIES
      : SKILL_CATEGORIES.filter((c) => c.categoryKey === activeCategoryKey);

  const scrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) {
      const navOffset = 85;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
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
      id="skills"
      ref={sectionRef}
      className="relative py-24 sm:py-32 px-6 sm:px-10 lg:px-14 z-10 border-t border-white/[0.08]"
      aria-label="Technical Skills and Specializations"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* ===================== HEADER ===================== */}
        <div className="space-y-6 border-b border-white/[0.08] pb-10">
          <div className="skills-header-reveal space-y-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-400 font-mono text-xs uppercase tracking-wider backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>03 // Core Capabilities &amp; Tooling</span>
            </div>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-heading leading-[1.08]">
              Technical Stack &amp; Specializations
            </h2>
            <p className="text-base sm:text-lg text-slate-400 max-w-3xl leading-relaxed">
              Proficiencies categorized by engineering discipline. Every skill is grounded in concrete repository implementations, competitive programming, and internship deliverables—without inflated score bars or fabricated percentages.
            </p>
          </div>

          {/* Interactive Filter Pills */}
          <div className="skills-pills-reveal flex flex-wrap gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setActiveCategoryKey('all')}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeCategoryKey === 'all'
                  ? 'bg-cyan-400 text-slate-950 shadow-glow-cyan font-bold scale-105'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-white/10 hover:border-cyan-500/40 backdrop-blur-md'
              }`}
            >
              <span>ALL DISCIPLINES</span>
              <span className="text-[11px] opacity-80">
                ({SKILL_CATEGORIES.reduce((acc, c) => acc + c.items.length, 0)})
              </span>
            </button>

            {SKILL_CATEGORIES.map((cat) => (
              <button
                key={cat.categoryKey}
                type="button"
                onClick={() => setActiveCategoryKey(cat.categoryKey)}
                className={`px-5 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeCategoryKey === cat.categoryKey
                    ? 'bg-slate-800 text-cyan-300 border border-cyan-400/60 shadow-glow-sm font-bold scale-105'
                    : 'bg-slate-900/90 text-slate-400 hover:text-white border border-white/10 hover:border-cyan-500/40 backdrop-blur-md'
                }`}
              >
                {getCategoryIcon(cat.categoryKey)}
                <span>{cat.title}</span>
                <span className="text-[11px] text-slate-500">({cat.items.length})</span>
              </button>
            ))}
          </div>
        </div>

        {/* ===================== SKILL PANELS & DETAIL INSPECTOR ===================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Categorized Grids (8 cols) */}
          <div className="skills-cards-container lg:col-span-8 space-y-10">
            {filteredCategories.map((category) => (
              <CardTilt
                key={category.categoryKey}
                className="skills-category-card p-8 sm:p-9 rounded-3xl bg-slate-900/75 border border-white/[0.09] space-y-6 shadow-2xl backdrop-blur-md"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10 shadow-sm">
                      {getCategoryIcon(category.categoryKey)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white font-heading">
                        {category.title}
                      </h3>
                      <p className="text-sm text-slate-400 mt-0.5">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {category.items.map((skill) => {
                    const isSelected = selectedSkill?.name === skill.name;
                    return (
                      <div
                        key={skill.name}
                        onClick={() =>
                          setSelectedSkill({
                            ...skill,
                            categoryTitle: category.title,
                          })
                        }
                        className={`p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                          isSelected
                            ? 'bg-slate-800/90 border-cyan-400/70 shadow-glow-sm ring-1 ring-cyan-400/40 scale-[1.02]'
                            : 'bg-slate-950/80 border-white/[0.07] hover:border-cyan-500/40 hover:bg-slate-900 hover:scale-[1.01]'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {skill.name}
                            </span>
                            <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-md bg-slate-900 border border-white/10 text-cyan-300 font-medium">
                              {skill.tag}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            {skill.description}
                          </p>
                        </div>

                        <div className="pt-2.5 mt-2 flex items-center justify-between text-xs font-mono text-slate-400 border-t border-white/[0.04]">
                          <span className="text-cyan-400/90 group-hover:text-cyan-300 flex items-center gap-1 font-semibold">
                            <span>Inspect Spec</span>
                            <span>&rarr;</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardTilt>
            ))}
          </div>

          {/* Interactive Skill Inspector Side Panel (4 cols) */}
          <div className="skills-inspector-reveal lg:col-span-4 sticky top-28 space-y-6">
            <CardTilt className="p-8 sm:p-9 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/35 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest flex items-center gap-2 font-bold">
                  <Cpu className="w-4 h-4" />
                  Skill Telemetry Inspector
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {selectedSkill ? (
                <div className="space-y-5">
                  <div>
                    <span className="font-mono text-xs text-slate-400 uppercase">
                      {selectedSkill.categoryTitle}
                    </span>
                    <h4 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-heading">
                      {selectedSkill.name}
                    </h4>
                    <div className="inline-block mt-2.5 px-3 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold">
                      Architectural Role: {selectedSkill.tag}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="font-mono text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      Applied Implementation Scope
                    </div>
                    <p className="p-4 rounded-2xl bg-slate-950/90 border border-white/[0.08] text-xs sm:text-sm leading-relaxed text-slate-300">
                      {selectedSkill.description}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/90 border border-white/[0.08] space-y-2.5">
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
                      Grounding Verifications
                    </div>
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Used in real repository codebases</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Zero simulated proficiency bars</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Evaluated through technical projects</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400">Click any skill to inspect details.</p>
              )}

              <button
                type="button"
                onClick={scrollToProjects}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-glow-cyan cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <span>SEE SKILLS IN PROJECTS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </CardTilt>
          </div>
        </div>

      </div>
    </section>
  );
}

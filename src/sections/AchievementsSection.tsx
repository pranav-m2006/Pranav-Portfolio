import { useRef } from 'react';
import { 
  Trophy, 
  Award, 
  Flame, 
  FileText, 
  CheckCircle2, 
  Medal,
  Calendar,
  Sparkles
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import CardTilt from '../components/CardTilt';
import { ACHIEVEMENTS } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

export default function AchievementsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // 1. Achievements Section Header Entrance
      gsap.from('.achieve-header-reveal', {
        scrollTrigger: {
          trigger: '.achieve-header-reveal',
          start: 'top 85%',
          once: true,
        },
        y: 40,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'all',
      });

      // 2. HackMatrix Spotlight Podium Card Entrance
      gsap.from('.achieve-spotlight-card', {
        scrollTrigger: {
          trigger: '.achieve-spotlight-card',
          start: 'top 85%',
          once: true,
        },
        y: 50,
        opacity: 0,
        scale: 0.97,
        duration: 0.95,
        ease: 'power3.out',
        clearProps: 'all',
      });

      // 3. 3-Card Milestone Grid Staggered Cascade
      gsap.from('.achieve-grid-card', {
        scrollTrigger: {
          trigger: '.achieve-grid-container',
          start: 'top 85%',
          once: true,
        },
        y: 45,
        opacity: 0,
        scale: 0.97,
        stagger: 0.16,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'all',
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="achievements"
      ref={sectionRef}
      className="relative py-24 sm:py-32 px-6 sm:px-10 lg:px-14 z-10 border-t border-white/[0.08]"
      aria-label="Honors, Hackathons and Milestones"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* ===================== HEADER ===================== */}
        <div className="achieve-header-reveal space-y-4 border-b border-white/[0.08] pb-10">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-400 font-mono text-xs uppercase tracking-wider backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>05 // Honors &amp; Verified Milestones</span>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-heading leading-[1.08]">
            Honors, Hackathons &amp; Patents
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-3xl leading-relaxed">
            Tangible engineering milestones earned through competitive programming, nationwide hackathon judging, intellectual property patents, and algorithmic problem-solving.
          </p>
        </div>

        {/* ===================== 1. FEATURED SPOTLIGHT: HACKMATRIX PODIUM FINISH ===================== */}
        <CardTilt
          className="achieve-spotlight-card p-8 sm:p-12 lg:p-14 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 shadow-2xl relative overflow-hidden backdrop-blur-md hover:border-cyan-400/50 transition-all"
          aria-label="Podium Award: HackMatrix"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/90 border border-cyan-500/40 font-mono text-xs text-cyan-300 font-bold uppercase tracking-wider">
                <Trophy className="w-4 h-4 text-cyan-400" />
                <span>Podium Finish // Cash Prize &amp; Official Trophy</span>
              </div>

              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-heading">
                HackMatrix Hackathon — 3rd Place Winner
              </h3>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Secured 3rd place overall in an intensive national-level competitive hackathon. Designed, coded, and demonstrated an end-to-end software system under time-constrained sprint conditions, assessed by industry evaluators for technical architecture, feasibility, and user value.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm font-mono text-slate-400">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>National Hackathon Evaluation</span>
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Cash Prize &amp; Official Trophy Awarded</span>
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Sprint Demo &amp; Code Defense</span>
                </span>
              </div>
            </div>

            {/* Metric Trophy Display (4 cols) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-8 rounded-3xl bg-slate-950/80 border border-cyan-500/30 text-center space-y-3 shadow-2xl backdrop-blur-md">
              <div className="w-16 h-16 rounded-2xl bg-cyan-950/90 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-glow-cyan">
                <Medal className="w-9 h-9" />
              </div>
              <div className="text-4xl sm:text-5xl font-black font-mono text-white">
                3rd Place
              </div>
              <div className="font-mono text-xs uppercase tracking-wider text-cyan-300 font-semibold">
                Cash Prize &bull; Official Trophy
              </div>
              <div className="text-xs text-slate-400 border-t border-white/10 pt-2 w-full">
                Judged across nationwide technical submissions
              </div>
            </div>
          </div>
        </CardTilt>

        {/* ===================== 2. THREE-CARD BALANCED MILESTONE GRID ===================== */}
        <div className="achieve-grid-container grid grid-cols-1 md:grid-cols-3 gap-7">
          {/* Milestone 1: SIH Finalist */}
          <CardTilt
            className="achieve-grid-card p-8 sm:p-9 rounded-3xl bg-slate-900/80 border border-white/[0.09] space-y-5 shadow-2xl hover:border-violet-500/40 transition-all flex flex-col justify-between"
            glowColor="rgba(139, 92, 246, 0.15)"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-violet-950/80 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-glow-violet">
                  <Award className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs text-violet-300 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 font-semibold">
                  National Stage
                </span>
              </div>

              <div>
                <h4 className="text-2xl font-bold text-white font-heading">
                  Smart India Hackathon (SIH) 2025
                </h4>
                <p className="text-sm font-semibold text-violet-300 mt-1 font-mono">
                  National Finalist
                </p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Selected among thousands of nationwide participants to compete in the final round of India&apos;s premier national software innovation hackathon, solving pressing governance challenges.
              </p>
            </div>

            <div className="pt-3 border-t border-white/[0.06] text-xs font-mono text-slate-400">
              Validated nationwide hackathon qualification
            </div>
          </CardTilt>

          {/* Milestone 2: Published Patents */}
          <CardTilt
            className="achieve-grid-card p-8 sm:p-9 rounded-3xl bg-slate-900/80 border border-white/[0.09] space-y-5 shadow-2xl hover:border-cyan-500/40 transition-all flex flex-col justify-between"
            glowColor="rgba(0, 240, 255, 0.15)"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-glow-cyan">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs text-cyan-300 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 font-semibold">
                  Official IPR
                </span>
              </div>

              <div>
                <h4 className="text-2xl font-bold text-white font-heading">
                  2 Published Technology Patents
                </h4>
                <p className="text-sm font-semibold text-cyan-300 mt-1 font-mono">
                  Indian Patent Journal Publication
                </p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Co-authored and successfully published two technological patent specifications in the official Indian Patent Office Journal, reflecting genuine intellectual property development.
              </p>
            </div>

            <div className="pt-3 border-t border-white/[0.06] text-xs font-mono text-slate-400">
              Published &bull; Intellectual Property India
            </div>
          </CardTilt>

          {/* Milestone 3: 100-Day Problem Solving Streak */}
          <CardTilt
            className="achieve-grid-card p-8 sm:p-9 rounded-3xl bg-slate-900/80 border border-white/[0.09] space-y-5 shadow-2xl hover:border-amber-500/40 transition-all flex flex-col justify-between"
            glowColor="rgba(245, 158, 11, 0.15)"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Flame className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs text-amber-300 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 font-semibold">
                  Consistency
                </span>
              </div>

              <div>
                <h4 className="text-2xl font-bold text-white font-heading">
                  100-Day Problem Solving Streak
                </h4>
                <p className="text-sm font-semibold text-amber-300 mt-1 font-mono">
                  LeetCode &amp; Competitive Platforms
                </p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Completed an unbroken 100-day daily problem-solving regimen covering data structures, dynamic programming, graph theory, and algorithmic complexity optimization.
              </p>
            </div>

            <div className="pt-3 border-t border-white/[0.06] text-xs font-mono text-slate-400">
              Demonstrated discipline in algorithmic thinking
            </div>
          </CardTilt>
        </div>

      </div>
    </section>
  );
}

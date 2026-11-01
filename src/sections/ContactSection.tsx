import { useState, useRef } from 'react';
import { 
  Mail, 
  Github, 
  Linkedin, 
  Copy, 
  Check, 
  ArrowUpRight, 
  Send, 
  MapPin,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import CardTilt from '../components/CardTilt';
import { PERSONAL_INFO } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formFeedback, setFormFeedback] = useState<string | null>(null);

  useGSAP(
    () => {
      // 1. Contact Header Entrance
      gsap.from('.contact-header-reveal', {
        scrollTrigger: {
          trigger: '.contact-header-reveal',
          start: 'top 85%',
          once: true,
        },
        y: 40,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'all',
      });

      // 2. Direct Channels Card Entrance (from left)
      gsap.from('.contact-channels-card', {
        scrollTrigger: {
          trigger: '.contact-channels-card',
          start: 'top 85%',
          once: true,
        },
        x: -40,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'all',
      });

      // 3. Dispatch Form Card Entrance (from right)
      gsap.from('.contact-form-card', {
        scrollTrigger: {
          trigger: '.contact-form-card',
          start: 'top 85%',
          once: true,
        },
        x: 40,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'all',
      });
    },
    { scope: sectionRef }
  );

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
      setFormFeedback('Please fill out all required fields.');
      return;
    }

    const mailtoSubject = encodeURIComponent(formState.subject || `Portfolio Inquiry from ${formState.name}`);
    const mailtoBody = encodeURIComponent(
      `Name: ${formState.name}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`
    );
    const mailtoUrl = `mailto:${PERSONAL_INFO.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

    window.location.href = mailtoUrl;
    setFormFeedback('Dispatching to your email client. Thank you for connecting!');
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-24 sm:py-32 px-6 sm:px-10 lg:px-14 z-10 border-t border-white/[0.08]"
      aria-label="Contact and Social Channels"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* ===================== HEADER ===================== */}
        <div className="contact-header-reveal border-b border-white/[0.08] pb-10 space-y-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900 border border-violet-500/30 text-violet-400 font-mono text-xs uppercase tracking-wider backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-pulse" />
            <span>06 // Connect &amp; Collaborate</span>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-heading leading-[1.08]">
            Let&rsquo;s Build Something Significant.
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
            Interested in frontend architecture, applied AI/ML engineering, or potential internship opportunities? Reach out directly via email or verified professional channels.
          </p>
        </div>

        {/* ===================== TWO-COLUMN CONTACT LAYOUT ===================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Connect Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-7">
            <CardTilt className="contact-channels-card p-8 sm:p-9 rounded-3xl bg-slate-900/80 border border-white/[0.09] space-y-6 shadow-2xl backdrop-blur-md">
              <div>
                <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-1 font-bold">
                  Direct Institutional Email
                </span>
                <p className="text-xs sm:text-sm text-slate-400">
                  Click to copy my institutional email address or open your mail client:
                </p>
              </div>

              {/* Email Copy Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2.5 rounded-xl bg-slate-900 text-cyan-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs sm:text-sm text-white truncate select-all font-medium">
                    {PERSONAL_INFO.email}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 shrink-0 transition-colors cursor-pointer hover:scale-105 active:scale-95"
                  aria-label="Copy email address"
                  title="Copy email"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>

              {copied && (
                <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Email address copied to clipboard!</span>
                </div>
              )}

              {/* Verified Professional Links */}
              <div className="space-y-3 pt-2">
                <span className="font-mono text-xs text-slate-400 uppercase tracking-wider block font-semibold">
                  Verified Networks
                </span>

                <div className="space-y-2.5">
                  <a
                    href={PERSONAL_INFO.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-950 border border-white/10 hover:border-cyan-500/40 flex items-center justify-between group transition-all cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-900 text-slate-300 group-hover:text-cyan-400 transition-colors">
                        <Github className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                          GitHub
                        </div>
                        <div className="text-xs font-mono text-slate-500">
                          pranav-m2006
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>

                  <a
                    href={PERSONAL_INFO.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-950 border border-white/10 hover:border-cyan-500/40 flex items-center justify-between group transition-all cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-900 text-slate-300 group-hover:text-cyan-400 transition-colors">
                        <Linkedin className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                          LinkedIn
                        </div>
                        <div className="text-xs font-mono text-slate-500">
                          pranav-m-23153a32b
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>

              {/* Geographic Context */}
              <div className="pt-2 border-t border-white/[0.08] flex items-center gap-2.5 text-xs font-mono text-slate-400">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Tamil Nadu, India &bull; Open to Remote &amp; On-Site Work</span>
              </div>
            </CardTilt>
          </div>

          {/* Right Column: Direct Dispatch Message Form (7 cols) */}
          <div className="lg:col-span-7">
            <CardTilt className="contact-form-card p-8 sm:p-10 lg:p-12 rounded-3xl bg-slate-900/80 border border-white/[0.09] space-y-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5 text-white font-heading font-bold text-xl sm:text-2xl">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                  <span>Send a Direct Message</span>
                </div>
                <span className="font-mono text-xs text-slate-400">Mail Dispatch Protocol</span>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="block text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
                      Your Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="e.g. Alex Mercer"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="block text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
                      Your Email <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="alex@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-subject" className="block text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    placeholder="Project Inquiry / Full-Time Engineering Role"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="block text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
                    Message <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Describe your project, team opportunity, or inquiry..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 text-sm focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                  />
                </div>

                {formFeedback && (
                  <div className="p-3.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono text-xs flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{formFeedback}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 transition-all shadow-glow-cyan hover:scale-[1.02] active:scale-95 cursor-pointer mt-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Dispatch Message via Email</span>
                </button>
              </form>
            </CardTilt>
          </div>
        </div>

      </div>
    </section>
  );
}

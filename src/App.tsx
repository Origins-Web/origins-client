import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Terminal, 
  Code2, 
  Cpu, 
  Zap, 
  Layout, 
  Search, 
  Server, 
  ShieldCheck, 
  ArrowRight, 
  Moon, 
  Sun,
  CheckCircle2,
  Box,
  Layers,
  Database,
  Globe,
  Smartphone,
  BrainCircuit,
  Rocket,
  GitBranch,
  HelpCircle,
  MessageSquare,
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BarChart3,
  ShoppingCart,
  Activity,
  Star,
  Quote,
  X,
  Check
} from 'lucide-react';
import ClientDashboard from './ClientDashboard';
import InternalOps from './InternalOp';

const SCOPE_DATA: Record<string, { title: string; price: string; description: string; deliverables: string[] }> = {
  'The Digital Presence': {
    title: 'The Digital Presence',
    price: '$450',
    description: 'A high-performance, SEO-optimized landing page designed to convert visitors into leads.',
    deliverables: [
      'Next.js 14 App Router Architecture',
      'Responsive Tailwind CSS Styling',
      'Framer Motion Animations',
      'SEO Metadata & OpenGraph Setup',
      'Contact Form with Email Routing (Resend/Nodemailer)',
      'Google Analytics 4 Integration',
      'Vercel Deployment Pipeline',
      '14 Days of Support'
    ]
  },
  'Origins MVP': {
    title: 'Origins MVP',
    price: '$1,850',
    description: 'A complete SaaS foundation with authentication, database, and payments, ready for your business logic.',
    deliverables: [
      'Full Stack Next.js Application',
      'Authentication (Clerk or NextAuth)',
      'Database Schema & Setup (PostgreSQL/Prisma)',
      'Stripe Payment Gateway Integration',
      'Admin Dashboard with Charts',
      'User Profile Management',
      'Docker Containerization',
      'CI/CD Pipeline Setup',
      '30 Days of Priority Support'
    ]
  },
  'Vision Basic': {
    title: 'Vision Basic',
    price: '$1,200',
    description: 'A dedicated computer vision pipeline for object detection or classification tasks.',
    deliverables: [
      'Custom Model Training (YOLOv8 / ResNet)',
      'Python FastAPI Backend',
      'React Frontend Visualizer',
      'Real-time Inference API',
      'Accuracy & Performance Reports',
      'Dataset Preprocessing Scripts',
      'GPU Cloud Deployment Guide',
      'API Documentation (Swagger UI)'
    ]
  }
};

const REVIEWS_DATA = [
  {
    name: "Alex V.",
    role: "Founder, FinStack",
    quote: "The Origins team didn't just write code; they architected a solution. The Forge Engine cut our dev time in half. We launched our MVP in 3 weeks.",
    stars: 5
  },
  {
    name: "Dr. Sarah Chen",
    role: "Research Lead, UniLab",
    quote: "We needed a custom computer vision model for our lab. Origins translated our research papers into a deployable API. Extremely professional.",
    stars: 5
  },
  {
    name: "Marcus J.",
    role: "CTO, RetailFlow",
    quote: "No outsourcing, no bloat. Just clean, typed code. It's refreshing to work with an agency that actually understands software engineering.",
    stars: 5
  }
];

const OriginsLanding = () => {
  const [theme, setTheme] = useState('dark');
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedScope, setSelectedScope] = useState<string | null>(null);
  const [showClientPortal, setShowClientPortal] = useState(false);

  // Theme toggle handler
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.className = newTheme === 'dark' ? 'dark' : 'light';
  };

  // Scroll spy for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    document.querySelectorAll('section').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Smooth scroll handler
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      setIsMobileMenuOpen(false);
    }
  };

  if (showClientPortal) {
    return <ClientDashboard />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans selection:bg-orange-500/30 ${theme === 'dark' ? 'bg-[#050505] text-slate-400' : 'bg-slate-50 text-slate-600'}`}>

      {/* Scope Modal Overlay */}
      {selectedScope && SCOPE_DATA[selectedScope] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200 ${theme === 'dark' ? 'bg-[#0A0A0A] border border-white/10' : 'bg-white'}`}>
             <button 
                onClick={() => setSelectedScope(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-500/10 transition-colors"
             >
               <X size={24} className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} />
             </button>

             <div className="mb-8">
               <div className="text-[#FF6B00] font-bold tracking-widest text-xs uppercase mb-2">Scope of Work</div>
               <h2 className={`text-3xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{SCOPE_DATA[selectedScope].title}</h2>
               <div className="text-xl text-[#FF6B00] font-bold mb-4">{SCOPE_DATA[selectedScope].price} <span className="text-sm text-slate-500 font-normal text-base">/ Fixed Price</span></div>
               <p className="text-slate-500 leading-relaxed">{SCOPE_DATA[selectedScope].description}</p>
             </div>

             <div className={`p-6 rounded-2xl mb-8 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'}`}>
                <h3 className={`font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  <Layers size={18} className="text-[#FF6B00]" />
                  Deliverables
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SCOPE_DATA[selectedScope].deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-slate-500">
                      <Check size={16} className="text-[#FF6B00] shrink-0 mt-0.5" />
                      {item}
                    </div>
                  ))}
                </div>
             </div>

             <div className="flex gap-4">
                <button 
                  onClick={() => { setSelectedScope(null); scrollToSection('contact'); }}
                  className="flex-1 py-4 bg-[#FF6B00] text-white font-bold rounded-xl hover:bg-[#FF6B00]/90 transition-all shadow-lg shadow-orange-500/20"
                >
                  Book Discovery Call
                </button>
                <button 
                  onClick={() => setSelectedScope(null)}
                  className={`px-6 py-4 font-bold rounded-xl transition-all border ${theme === 'dark' ? 'border-white/10 hover:bg-white/5 text-white' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                >
                  Close
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Theme Toggle & Mobile Menu Button */}
      <div className="fixed bottom-6 right-6 z-50 flex gap-4">
        <button 
          onClick={toggleTheme}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#FF6B00] text-white shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:scale-110 transition-all active:scale-95"
        >
          {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
        </button>


      </div>

      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* Sidebar Navigation (Desktop) */}
        <aside className={`hidden lg:flex flex-col w-72 h-screen sticky top-0 border-r backdrop-blur-2xl p-8 transition-colors z-40 ${theme === 'dark' ? 'border-white/5 bg-black/20' : 'border-slate-200 bg-white/80'}`}>
          <div 
            onClick={() => scrollToSection('hero')} 
            className="flex items-center gap-3 mb-14 group cursor-pointer"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-[#FF6B00]/20 rounded-full blur group-hover:bg-[#FF6B00]/40 transition"></div>
              <div className="relative h-10 w-10 bg-black rounded-lg border border-[#FF6B00]/30 flex items-center justify-center">
                <span className="text-[#FF6B00] font-black text-xl">O</span>
              </div>
            </div>
            <span className={`text-2xl font-black tracking-tighter uppercase transition-colors ${theme === 'dark' ? 'text-white group-hover:text-[#FF6B00]' : 'text-slate-900 group-hover:text-[#FF6B00]'}`}>
              Origins
            </span>
          </div>

          <nav className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
            <NavGroup title="Core">
              <NavLink active={activeSection === 'hero'} onClick={() => scrollToSection('hero')}>Mission Control</NavLink>
              <NavLink active={activeSection === 'value-props'} onClick={() => scrollToSection('value-props')}>Value Protocol</NavLink>
              <NavLink active={activeSection === 'workflow'} onClick={() => scrollToSection('workflow')}>The Pipeline</NavLink>
            </NavGroup>

            <NavGroup title="Services">
              <NavLink active={activeSection === 'services'} onClick={() => scrollToSection('services')}>Development Packages</NavLink>
              <NavLink active={activeSection === 'work'} onClick={() => scrollToSection('work')}>Deployments</NavLink>
              <NavLink active={activeSection === 'reviews'} onClick={() => scrollToSection('reviews')}>Client Reviews</NavLink>
              <NavLink active={activeSection === 'forge'} onClick={() => scrollToSection('forge')}>Forge Engine</NavLink>
            </NavGroup>

            <NavGroup title="Ecosystem">
              <NavLink active={activeSection === 'stack'} onClick={() => scrollToSection('stack')}>Tech Stack</NavLink>
              <NavLink active={activeSection === 'clients'} onClick={() => scrollToSection('clients')}>Target Sectors</NavLink>
              <NavLink active={activeSection === 'faq'} onClick={() => scrollToSection('faq')}>System FAQ</NavLink>
            </NavGroup>
          </nav>

          <div className="mt-auto pt-8 border-t border-white/5">
             <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">System Status</div>
             <div className="flex items-center gap-2 text-xs font-mono text-emerald-500">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                All Systems Operational
             </div>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className={`lg:hidden flex items-center justify-between p-6 border-b sticky top-0 z-40 backdrop-blur-xl ${theme === 'dark' ? 'border-white/5 bg-[#050505]/80' : 'border-slate-200 bg-white/80'}`}>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-black rounded border border-[#FF6B00]/30 flex items-center justify-center">
                <span className="text-[#FF6B00] font-bold">O</span>
            </div>
            <span className={`text-xl font-black uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Origins</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
            <div className={`w-6 h-0.5 mb-1.5 rounded-full bg-slate-400 transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
            <div className={`w-6 h-0.5 mb-1.5 rounded-full bg-slate-400 transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-0.5 rounded-full bg-slate-400 transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className={`lg:hidden fixed inset-0 z-30 pt-24 px-6 pb-6 overflow-y-auto ${theme === 'dark' ? 'bg-[#050505]' : 'bg-slate-50'}`}>
             <nav className="space-y-6">
                <MobileNavLink onClick={() => scrollToSection('hero')}>Mission Control</MobileNavLink>
                <MobileNavLink onClick={() => scrollToSection('value-props')}>Value Props</MobileNavLink>
                <MobileNavLink onClick={() => scrollToSection('workflow')}>How it Works</MobileNavLink>
                <MobileNavLink onClick={() => scrollToSection('services')}>Services & Pricing</MobileNavLink>
                <MobileNavLink onClick={() => scrollToSection('work')}>Selected Work</MobileNavLink>
                <MobileNavLink onClick={() => scrollToSection('reviews')}>Client Reviews</MobileNavLink>
                <MobileNavLink onClick={() => scrollToSection('forge')}>Forge Engine</MobileNavLink>
                <MobileNavLink onClick={() => scrollToSection('stack')}>Tech Stack</MobileNavLink>
                <MobileNavLink onClick={() => scrollToSection('faq')}>FAQ</MobileNavLink>
             </nav>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-12 lg:p-20 overflow-hidden">
          
          {/* Hero Section */}
          <section id="hero" className="min-h-[80vh] flex flex-col justify-center mb-32 scroll-mt-32">
            <FadeIn>
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-[#FF6B00] text-[11px] font-bold mb-8 tracking-widest uppercase w-fit">
                <Zap size={12} className="fill-current" />
                Productized Development Service
              </div>

              <h1 className={`text-5xl md:text-7xl font-black mb-8 tracking-[-0.04em] leading-[1.1] transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                From Source Code to <br/>
                <span className="text-[#FF6B00]">Business Solution.</span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-500 max-w-2xl leading-relaxed font-medium mb-10">
                We are a specialized firm of Computer Science engineers. No outsourcing. No bloat. Just enterprise-grade code shipped at startup speed.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="group relative w-full sm:w-auto px-8 py-4 bg-[#FF6B00] text-white font-bold rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(255,107,0,0.2)] hover:shadow-[0_20px_40px_rgba(255,107,0,0.4)] hover:-translate-y-1 transition-all active:scale-95 inline-flex items-center justify-center"
                >
                  <span className="relative flex items-center gap-3">
                    <Terminal size={18} />
                    Get an MVP Estimate
                  </span>
                </button>
                
                <div className="flex items-center gap-4 text-sm font-mono text-slate-500">
                   <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                          <div key={i} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${theme === 'dark' ? 'border-[#050505] bg-slate-800 text-white' : 'border-slate-50 bg-slate-200 text-slate-700'}`}>
                             Dev
                          </div>
                      ))}
                   </div>
                   <span>Internal Team Only</span>
                </div>
              </div>

            </FadeIn>
          </section>

          {/* Value Props */}
          <section id="value-props" className="mb-40 scroll-mt-24">
             <SectionHeader title="Core Values" subtitle="The Source of Truth" theme={theme} />
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FadeIn delay={100}>
                  <ValueCard 
                    theme={theme}
                    icon={<ShieldCheck className="text-[#FF6B00]" size={24} />}
                    title="No Outsourcing"
                    desc="100% internal execution. Our engineers are vetted Computer Science graduates, ensuring direct communication and code accountability."
                  />
                </FadeIn>
                <FadeIn delay={200}>
                  <ValueCard 
                    theme={theme}
                    icon={<Layers className="text-[#FF6B00]" size={24} />}
                    title="Modern Stack"
                    desc="We don't use legacy tech. We build on the bleeding edge with Next.js App Router, TypeScript, and PyTorch for longevity."
                  />
                </FadeIn>
                <FadeIn delay={300}>
                  <ValueCard 
                    theme={theme}
                    icon={<Code2 className="text-[#FF6B00]" size={24} />}
                    title="Cost-Effective"
                    desc="By leveraging our proprietary Forge Engine, we deliver enterprise-grade architecture at accessible startup fixed-pricing."
                  />
                </FadeIn>
             </div>
          </section>

          {/* Workflow / Pipeline Section */}
          <section id="workflow" className="mb-40 scroll-mt-24">
             <SectionHeader title="The Pipeline" subtitle="Engagement Protocol" theme={theme} />
             
             <div className="relative">
                {/* Connector Line */}
                <div className={`absolute top-0 bottom-0 left-8 md:left-1/2 w-0.5 ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'} -translate-x-1/2 hidden md:block`}></div>
                
                <div className="space-y-12 relative z-10">
                   <FadeIn delay={100}>
                     <WorkflowStep 
                        theme={theme}
                        number="01"
                        title="Blueprint Discovery"
                        subtitle="Days 1-2"
                        desc="We analyze your requirements and map them to our pre-built architectural modules. No lengthy consulting—just pure logic mapping."
                        align="left"
                        icon={<Search size={20} />}
                     />
                   </FadeIn>
                   <FadeIn delay={300}>
                     <WorkflowStep 
                        theme={theme}
                        number="02"
                        title="Forge Execution"
                        subtitle="Days 3-14"
                        desc="The Origins Forge Engine scaffolds 70% of the codebase instantly. Our engineers then manually craft the unique 30% business logic."
                        align="right"
                        icon={<GitBranch size={20} />}
                     />
                   </FadeIn>
                   <FadeIn delay={500}>
                     <WorkflowStep 
                        theme={theme}
                        number="03"
                        title="Deploy & Handover"
                        subtitle="Day 15"
                        desc="Full source code transfer via GitHub. CI/CD pipelines set up on Vercel or Railway. You own the IP, we provide the documentation."
                        align="left"
                        icon={<Rocket size={20} />}
                     />
                   </FadeIn>
                </div>
             </div>
          </section>

          {/* Services Menu */}
          <section id="services" className="mb-40 scroll-mt-24">
            <SectionHeader title="The Menu" subtitle="Fixed-Price Packages" theme={theme} />

            {/* Category A */}
            <div className="mb-16">
              <h3 className={`text-xl font-bold mb-8 flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                <Globe className="text-[#FF6B00]" />
                Category A: Web & Mobile Architecture
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <FadeIn delay={100}>
                   <ServiceCard 
                      theme={theme}
                      title="The Digital Presence"
                      price="$450"
                      timeline="1 Week"
                      features={['Next.js Landing Page', 'SEO Optimization', 'Contact Forms', 'CMS Integration']}
                      onOpenScope={() => setSelectedScope('The Digital Presence')}
                   />
                 </FadeIn>
                 <FadeIn delay={200}>
                   <ServiceCard 
                      theme={theme}
                      title="Origins MVP"
                      price="$1,850"
                      timeline="3-4 Weeks"
                      highlight
                      features={['Full Stack App', 'Auth & Database', 'Admin Dashboard', 'Payment Integration', 'Docker Deployment']}
                      onOpenScope={() => setSelectedScope('Origins MVP')}
                   />
                 </FadeIn>
              </div>
            </div>

            {/* Category B */}
            <div>
              <h3 className={`text-xl font-bold mb-8 flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                <BrainCircuit className="text-[#FF6B00]" />
                Category B: AI & Computer Vision
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <FadeIn delay={100}>
                   <ServiceCard 
                      theme={theme}
                      title="Vision Basic"
                      price="$1,200"
                      timeline="2 Weeks"
                      features={['Object Detection Model', 'Python FastAPI Backend', 'React Frontend Visualizer', 'Accuracy Reports']}
                      onOpenScope={() => setSelectedScope('Vision Basic')}
                   />
                 </FadeIn>
                 <FadeIn delay={200}>
                   <div className={`p-8 rounded-3xl border border-dashed flex items-center justify-center h-full ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-300 bg-slate-100'}`}>
                      <div className="text-center">
                         <h4 className="font-bold text-lg mb-2">Custom Enterprise AI</h4>
                         <p className="text-sm text-slate-500">Contact for custom LLM & Neural Net architecture</p>
                      </div>
                   </div>
                 </FadeIn>
              </div>
            </div>
          </section>

          {/* New Selected Works Section */}
          <section id="work" className="mb-40 scroll-mt-24">
             <SectionHeader title="Sample Designs" subtitle="Selected Deployments" theme={theme} />
             
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <FadeIn delay={0}>
                  <PortfolioCard 
                     theme={theme}
                     title="FinStack"
                     tag="SaaS Dashboard"
                     tech={['Next.js', 'Postgres', 'Tremor']}
                     uiType="dashboard"
                  />
                </FadeIn>
                <FadeIn delay={100}>
                  <PortfolioCard 
                     theme={theme}
                     title="VisionAI Health"
                     tag="Computer Vision"
                     tech={['FastAPI', 'PyTorch', 'React']}
                     uiType="ai"
                  />
                </FadeIn>
                <FadeIn delay={200}>
                  <PortfolioCard 
                     theme={theme}
                     title="ShopScale"
                     tag="E-Commerce"
                     tech={['Shopify', 'Hydrogen', 'Tailwind']}
                     uiType="commerce"
                  />
                </FadeIn>
             </div>
          </section>

          {/* New Reviews Section */}
          <section id="reviews" className="mb-40 scroll-mt-24">
             <SectionHeader title="Feedback Loop" subtitle="Client Reviews" theme={theme} />
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {REVIEWS_DATA.map((review, i) => (
                  <FadeIn delay={i * 100} key={i}>
                    <div className={`p-8 rounded-3xl border h-full flex flex-col ${theme === 'dark' ? 'bg-[#0A0A0A] border-white/5' : 'bg-white border-slate-200'}`}>
                       <div className="flex gap-1 text-[#FF6B00] mb-4">
                          {[...Array(review.stars)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                       </div>
                       <div className="flex-1 mb-6 relative">
                          <Quote className="absolute -top-2 -left-2 opacity-10 text-[#FF6B00]" size={40} />
                          <p className={`relative z-10 text-sm italic leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                            "{review.quote}"
                          </p>
                       </div>
                       <div>
                          <div className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{review.name}</div>
                          <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">{review.role}</div>
                       </div>
                    </div>
                  </FadeIn>
                ))}
             </div>
          </section>

          {/* Forge Engine */}
          <section id="forge" className="mb-40 scroll-mt-24">
            <SectionHeader title="The Advantage" subtitle="Origins Forge Engine" theme={theme} />
            
            <FadeIn>
              <div className={`relative overflow-hidden rounded-3xl p-8 md:p-12 border transition-all duration-500 ${theme === 'dark' ? 'bg-[#0A0A0A] border-white/10 shadow-2xl shadow-orange-900/10' : 'bg-white border-slate-200 shadow-xl'}`}>
                 <div className="absolute top-0 right-0 p-32 bg-[#FF6B00] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
                 
                 <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
                    <div className="flex-1">
                       <div className="inline-flex items-center gap-2 text-[#FF6B00] font-mono text-xs font-bold mb-4 uppercase tracking-widest">
                          <Rocket size={14} />
                          Proprietary Technology
                       </div>
                       <h3 className={`text-3xl md:text-4xl font-black mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          Code at the Speed of Thought.
                       </h3>
                       <p className="text-slate-500 leading-relaxed mb-8">
                          Most agencies reinvent the wheel for every client. We don't. We built the 
                          <strong className="text-[#FF6B00]"> Origins Forge Engine</strong>—a Python-powered automated toolchain 
                          that scaffolds 70% of standard application architecture instantly.
                       </p>
                       
                       <div className="flex items-center gap-8">
                          <div>
                             <div className="text-4xl font-black text-[#FF6B00] mb-1">400%</div>
                             <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Faster Delivery</div>
                          </div>
                          <div className="h-12 w-px bg-slate-700/20"></div>
                          <div>
                             <div className="text-4xl font-black text-[#FF6B00] mb-1">0%</div>
                             <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Tech Debt</div>
                          </div>
                       </div>
                    </div>

                    <div className="flex-1 w-full">
                       <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-[#050505]">
                          <div className="flex items-center px-4 py-2 border-b border-white/5 bg-white/5 gap-2">
                             <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                             <div className="ml-auto text-[10px] text-slate-600 font-mono">forge-engine — bash — 80x24</div>
                          </div>
                          <div className="p-6 font-mono text-xs md:text-sm overflow-x-auto">
                             <div className="text-emerald-500 mb-2">$ origins init --client="NewVenture"</div>
                             <div className="text-slate-400 mb-1">{'>'} Detecting Architecture Requirements...</div>
                             <div className="text-slate-400 mb-1">{'>'} Scaffolding Next.js App Router... <span className="text-emerald-500">Done (0.4s)</span></div>
                             <div className="text-slate-400 mb-1">{'>'} Injecting Tailwind Design System... <span className="text-emerald-500">Done (0.2s)</span></div>
                             <div className="text-slate-400 mb-1">{'>'} Configuring Prisma & PostgreSQL... <span className="text-emerald-500">Done (0.8s)</span></div>
                             <div className="text-slate-400 mb-4">{'>'} Generating API Types (TypeScript)... <span className="text-emerald-500">Done (0.3s)</span></div>
                             <div className="text-[#FF6B00] animate-pulse">{'>'} Waiting for engineer input..._</div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </FadeIn>
          </section>

          {/* Tech Stack */}
          <section id="stack" className="mb-40 scroll-mt-24">
            <SectionHeader title="The Arsenal" subtitle="Modern Technology Stack" theme={theme} />
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
               {['React', 'Next.js', 'Tailwind', 'TypeScript', 'Node.js', 'Python', 'MongoDB', 'Postgres', 'PyTorch', 'TensorFlow'].map((tech, i) => (
                  <FadeIn delay={i * 50} key={tech}>
                    <div className={`group flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-[#FF6B00]/30' : 'bg-white border-slate-200 hover:shadow-lg'}`}>
                       <div className="mb-3 text-[#FF6B00] group-hover:scale-110 transition-transform">
                          {tech === 'React' && <Code2 size={28} />}
                          {tech === 'Next.js' && <Box size={28} />}
                          {tech === 'Tailwind' && <Layout size={28} />}
                          {tech === 'TypeScript' && <Code2 size={28} />}
                          {tech === 'Node.js' && <Server size={28} />}
                          {tech === 'Python' && <Terminal size={28} />}
                          {tech === 'MongoDB' && <Database size={28} />}
                          {tech === 'Postgres' && <Database size={28} />}
                          {tech === 'PyTorch' && <BrainCircuit size={28} />}
                          {tech === 'TensorFlow' && <Cpu size={28} />}
                       </div>
                       <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400 group-hover:text-white' : 'text-slate-600 group-hover:text-black'}`}>{tech}</span>
                    </div>
                  </FadeIn>
               ))}
            </div>
          </section>

          {/* Target Clients */}
          <section id="clients" className="mb-40 scroll-mt-24">
             <SectionHeader title="Who We Serve" subtitle="Ideal Partners" theme={theme} />
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <FadeIn delay={100}>
                 <ClientCard 
                    theme={theme}
                    title="Non-Technical Founders"
                    desc="You have the vision, we have the code. We translate your business logic into a scalable MVP without you writing a single line."
                 />
               </FadeIn>
               <FadeIn delay={200}>
                 <ClientCard 
                    theme={theme}
                    title="University Labs"
                    desc="We help researchers operationalize algorithms. From Jupyter Notebooks to deployed APIs used by real users."
                 />
               </FadeIn>
               <FadeIn delay={300}>
                 <ClientCard 
                    theme={theme}
                    title="SMEs & Local Biz"
                    desc="Digital transformation for established businesses. Automate workflows and modernize legacy customer portals."
                 />
               </FadeIn>
             </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="mb-40 scroll-mt-24">
             <SectionHeader title="System Query" subtitle="FAQ" theme={theme} />
             
             <div className="max-w-3xl mx-auto space-y-4">
               {[
                 {
                   q: "Do you really not outsource anything?",
                   a: "Correct. Every line of code is written by our internal team of Computer Science engineers. We do not white-label or subcontract. You have direct access to the engineer building your product."
                 },
                 {
                   q: "What happens after the product is delivered?",
                   a: "We provide a 30-day warranty period for bug fixes. After that, you can choose to manage it yourself (you own the code) or sign up for one of our maintenance retainer packages."
                 },
                 {
                   q: "Can I scale the MVP later?",
                   a: "Absolutely. We build with 'Scale-First' architecture (Next.js, Postgres, Docker). The code is modular and typed, meaning any developer can pick it up and extend it without rewriting."
                 },
                 {
                   q: "How are your prices so low for this quality?",
                   a: "Automation. Our 'Origins Forge Engine' handles the repetitive 70% of setup (Auth, DB, API structure). You only pay for the 30% of unique business logic we write manually."
                 }
               ].map((item, i) => (
                 <FadeIn key={i} delay={i * 100}>
                   <div className={`rounded-2xl border overflow-hidden transition-all ${theme === 'dark' ? 'bg-[#0A0A0A] border-white/5' : 'bg-white border-slate-200'}`}>
                      <button 
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex items-center justify-between p-6 text-left"
                      >
                         <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{item.q}</span>
                         {openFaq === i ? <ChevronUp className="text-[#FF6B00]" /> : <ChevronDown className="text-slate-500" />}
                      </button>
                      {openFaq === i && (
                        <div className="px-6 pb-6 text-slate-500 leading-relaxed text-sm animate-in fade-in slide-in-from-top-2">
                          {item.a}
                        </div>
                      )}
                   </div>
                 </FadeIn>
               ))}
             </div>
          </section>

          {/* Contact / Final CTA */}
          <section id="contact" className="mb-20 scroll-mt-24">
             <FadeIn>
               <div className={`relative rounded-[2.5rem] p-12 overflow-hidden text-center ${theme === 'dark' ? 'bg-gradient-to-br from-[#0A0A0A] to-[#111] border border-white/10' : 'bg-slate-900 text-white'}`}>
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FF6B00] rounded-full blur-[100px] opacity-30"></div>
                  
                  <div className="relative z-10 max-w-2xl mx-auto">
                     <div className="inline-flex items-center gap-2 text-[#FF6B00] font-mono text-xs font-bold mb-6 uppercase tracking-widest">
                        <MessageSquare size={14} />
                        Ready to Deploy?
                     </div>
                     <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
                        Initialize your <span className="text-[#FF6B00]">Project.</span>
                     </h2>
                     <p className="text-slate-400 text-lg mb-10">
                        Slots for the "Origins MVP" package are limited to 4 per month to ensure quality. Secure your blueprint session today.
                     </p>
                     
                     <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-4 bg-[#FF6B00] text-white font-bold rounded-xl hover:bg-[#FF6B00]/90 transition-colors shadow-lg shadow-orange-500/20">
                           Book Discovery Call
                        </button>
                        <button className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10">
                           View GitHub Profile
                        </button>
                     </div>
                  </div>
               </div>
             </FadeIn>
          </section>

          {/* Footer */}
          <footer className={`pt-24 border-t flex flex-col md:flex-row justify-between items-center gap-10 opacity-60 ${theme === 'dark' ? 'border-white/5' : 'border-slate-200'}`}>
            <div className="flex items-center gap-4">
              <div className="h-6 w-6 rounded bg-[#FF6B00] flex items-center justify-center text-[10px] text-white font-bold">O</div>
              <span 
                onClick={() => setShowClientPortal(true)}
                className={`text-[11px] font-bold tracking-[0.3em] uppercase ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'} cursor-pointer hover:text-[#FF6B00] transition-colors`}
              >
                Origins Engineering
              </span>
            </div>
            <div className={`text-[11px] font-bold tracking-widest flex flex-wrap justify-center gap-10 uppercase ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              <a href="#" className="hover:text-[#FF6B00] transition">GitHub</a>
              <a href="#" className="hover:text-[#FF6B00] transition">Twitter</a>
              <a href="#" className="hover:text-[#FF6B00] transition">Contact</a>
              <span className="text-slate-500">© 2026 Origins</span>
            </div>
          </footer>

        </main>
      </div>
      
      {/* Global Styles for Scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #FF6B00; border-radius: 10px; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
};

// --- Sub-components for cleanliness ---

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const NavGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mb-8">
    <h4 className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-4 px-4">{title}</h4>
    <ul className="space-y-1">{children}</ul>
  </div>
);

const NavLink = ({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) => (
  <li>
    <button 
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-300 relative group overflow-hidden ${
        active 
          ? 'text-[#FF6B00] font-bold bg-[#FF6B00]/5' 
          : 'hover:text-[#FF6B00] dark:text-slate-400 text-slate-600 hover:bg-[#FF6B00]/5'
      }`}
    >
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-[#FF6B00] rounded-r-full shadow-[0_0_10px_#FF6B00]"></div>
      )}
      {children}
    </button>
  </li>
);

const MobileNavLink = ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => (
    <button onClick={onClick} className="block w-full text-left text-2xl font-bold p-4 border-b border-white/5 hover:text-[#FF6B00] transition-colors dark:text-white text-slate-900">
        {children}
    </button>
);

const SectionHeader = ({ title, subtitle, theme }: { title: string, subtitle: string, theme: string }) => (
    <div className="flex items-center gap-6 mb-12">
        <h2 className={`text-3xl font-bold tracking-tight transition-colors whitespace-nowrap ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {subtitle} <span className="text-slate-500 text-lg font-normal ml-2 hidden sm:inline-block">/ {title}</span>
        </h2>
        <div className={`h-[1px] flex-1 ${theme === 'dark' ? 'bg-gradient-to-r from-white/10 to-transparent' : 'bg-slate-200'}`}></div>
    </div>
);

const PortfolioCard = ({ theme, title, tag, tech, uiType }: any) => (
  <div className={`group relative rounded-3xl overflow-hidden border transition-all duration-500 hover:-translate-y-2 ${
      theme === 'dark' ? 'bg-[#0A0A0A] border-white/5 hover:border-[#FF6B00]/30' : 'bg-white border-slate-200 shadow-xl'
  }`}>
      {/* UI Mockup Area */}
      <div className={`h-48 relative overflow-hidden ${theme === 'dark' ? 'bg-[#111]' : 'bg-slate-100'}`}>
         {/* Abstract UI Elements based on type */}
         <div className="absolute inset-0 p-6 flex flex-col gap-3 opacity-50 group-hover:opacity-80 transition-opacity duration-500 scale-95 group-hover:scale-100 origin-bottom">
            {uiType === 'dashboard' && (
              <>
                <div className="flex gap-4">
                  <div className={`w-1/3 h-20 rounded-xl ${theme === 'dark' ? 'bg-[#222]' : 'bg-white'}`}></div>
                  <div className={`w-1/3 h-20 rounded-xl ${theme === 'dark' ? 'bg-[#222]' : 'bg-white'}`}></div>
                  <div className={`w-1/3 h-20 rounded-xl ${theme === 'dark' ? 'bg-[#FF6B00]/20' : 'bg-orange-100'}`}></div>
                </div>
                <div className={`flex-1 rounded-xl w-full ${theme === 'dark' ? 'bg-[#222]' : 'bg-white'}`}></div>
              </>
            )}
            {uiType === 'ai' && (
              <div className="flex items-center justify-center h-full">
                 <div className="relative">
                    <div className="absolute inset-0 bg-[#FF6B00] blur-2xl opacity-20 animate-pulse"></div>
                    <BrainCircuit size={64} className={theme === 'dark' ? 'text-slate-700' : 'text-slate-300'} />
                 </div>
              </div>
            )}
            {uiType === 'commerce' && (
              <div className="grid grid-cols-2 gap-3 h-full">
                 <div className={`rounded-lg ${theme === 'dark' ? 'bg-[#222]' : 'bg-white'}`}></div>
                 <div className={`rounded-lg ${theme === 'dark' ? 'bg-[#222]' : 'bg-white'}`}></div>
                 <div className={`rounded-lg ${theme === 'dark' ? 'bg-[#222]' : 'bg-white'}`}></div>
                 <div className={`rounded-lg ${theme === 'dark' ? 'bg-[#FF6B00]/20' : 'bg-orange-100'}`}></div>
              </div>
            )}
         </div>
      </div>

      <div className="p-8">
         <div className="text-[10px] font-bold tracking-widest text-[#FF6B00] uppercase mb-2">{tag}</div>
         <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
         <div className="flex flex-wrap gap-2 mb-6">
            {tech.map((t: string) => (
               <span key={t} className={`text-[10px] px-2 py-1 rounded border ${
                  theme === 'dark' ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-600'
               }`}>
                 {t}
               </span>
            ))}
         </div>
         <div className="flex items-center text-xs font-bold gap-2 group-hover:gap-3 transition-all cursor-pointer">
            <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>View Case Study</span>
            <ExternalLink size={12} className="text-[#FF6B00]" />
         </div>
      </div>
  </div>
);

const ValueCard = ({ theme, icon, title, desc }: any) => (
    <div className={`p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${theme === 'dark' ? 'bg-[#0A0A0A] border-white/5 hover:border-[#FF6B00]/30' : 'bg-white border-slate-200 shadow-lg hover:shadow-xl'}`}>
        <div className="mb-6 p-3 bg-[#FF6B00]/10 w-fit rounded-xl border border-[#FF6B00]/20">
            {icon}
        </div>
        <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
);

const ServiceCard = ({ theme, title, price, timeline, features, highlight, onOpenScope }: any) => (
    <div className={`relative p-8 rounded-3xl border flex flex-col h-full transition-all duration-300 hover:-translate-y-1 ${
        theme === 'dark' 
            ? 'bg-[#0A0A0A] border-white/5 hover:border-[#FF6B00]/30' 
            : 'bg-white border-slate-200 shadow-lg hover:shadow-xl'
    } ${highlight ? 'ring-1 ring-[#FF6B00]' : ''}`}>
        
        {highlight && (
            <div className="absolute -top-3 left-8 px-3 py-1 bg-[#FF6B00] text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                Most Popular
            </div>
        )}

        <div className="mb-6">
            <h4 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{title}</h4>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#FF6B00]">{price}</span>
                <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Fixed Price</span>
            </div>
        </div>

        <div className="flex-1 mb-8">
            <div className="text-xs font-mono text-slate-500 mb-6 flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               ETA: {timeline}
            </div>
            <ul className="space-y-4">
                {features.map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-500">
                        <CheckCircle2 size={16} className="text-[#FF6B00] shrink-0 mt-0.5" />
                        {f}
                    </li>
                ))}
            </ul>
        </div>

        <button 
          onClick={onOpenScope}
          className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${
            theme === 'dark' 
                ? 'bg-white/5 hover:bg-white/10 text-white' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
        }`}>
            View Scope
        </button>
    </div>
);

const ClientCard = ({ theme, title, desc }: any) => (
    <div className={`group p-8 rounded-3xl border transition-all duration-300 ${
        theme === 'dark' ? 'bg-[#0A0A0A] border-white/5' : 'bg-white border-slate-200'
    }`}>
        <div className="mb-4 text-[#FF6B00] opacity-50 group-hover:opacity-100 transition-opacity">
            <Search size={32} />
        </div>
        <h3 className={`text-lg font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
);

const WorkflowStep = ({ theme, number, title, subtitle, desc, align, icon }: any) => (
  <div className={`relative flex flex-col md:flex-row gap-8 md:gap-16 items-start md:items-center ${align === 'right' ? 'md:flex-row-reverse text-left md:text-right' : 'text-left'}`}>
      
      {/* Icon Bubble */}
      <div className={`absolute left-0 md:left-1/2 top-0 -translate-x-1/2 hidden md:flex w-10 h-10 rounded-full border-4 z-10 items-center justify-center transition-colors ${
          theme === 'dark' 
            ? 'bg-[#050505] border-[#0A0A0A] text-[#FF6B00]' 
            : 'bg-white border-slate-100 text-[#FF6B00]'
      }`}>
          <div className="w-3 h-3 rounded-full bg-[#FF6B00]"></div>
      </div>

      <div className={`flex-1 ${align === 'right' ? 'md:pl-12' : 'md:pr-12'}`}>
         <div className="flex items-center gap-3 mb-2 md:justify-end">
             {align === 'right' && <div className="text-[#FF6B00]">{icon}</div>}
             <span className="text-5xl font-black text-[#FF6B00]/20">{number}</span>
             {align !== 'right' && <div className="text-[#FF6B00]">{icon}</div>}
         </div>
      </div>

      <div className="flex-1">
          <div className={`p-8 rounded-3xl border transition-all hover:border-[#FF6B00]/30 ${
             theme === 'dark' ? 'bg-[#0A0A0A] border-white/5' : 'bg-white border-slate-200'
          }`}>
             <div className="text-xs font-mono text-[#FF6B00] mb-2">{subtitle}</div>
             <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
             <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
          </div>
      </div>
  </div>
);

const root = createRoot(document.getElementById('root')!);
root.render(<OriginsLanding />);

export default OriginsLanding;
import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Activity, 
  GitCommit, 
  GitBranch, 
  Server, 
  Shield, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Layout,
  LogOut,
  Settings,
  ChevronRight,
  RefreshCw,
  Box,
  Lock,
  Zap,
  MessageSquare,
  Send,
  Plus,
  FileText,
  User,
  X,
  CreditCard,
  Cpu,
  GitPullRequest,
  Calendar,
  Download,
  ExternalLink,
  AlertTriangle,
  PlayCircle,
  StopCircle
} from 'lucide-react';

// --- Mock Data ---
const MOCK_COMMITS = [
  { id: 'a1b2c3d', msg: 'feat(auth): implement clerk webhooks', time: '2m ago', author: 'Origins Forge' },
  { id: 'e5f6g7h', msg: 'fix(db): optimize prisma schema relations', time: '15m ago', author: 'Dev_01' },
  { id: 'i8j9k0l', msg: 'chore(deps): update tailwindcss to v4', time: '1h ago', author: 'Dev_02' },
  { id: 'm1n2o3p', msg: 'feat(ui): add dashboard skeleton loader', time: '3h ago', author: 'Origins Forge' },
];

const MILESTONES = [
  { id: 1, title: 'Blueprint Architecture', status: 'completed', date: 'Oct 24' },
  { id: 2, title: 'Database & Auth Setup', status: 'completed', date: 'Oct 26' },
  { id: 3, title: 'Core Business Logic', status: 'active', date: 'In Progress' },
  { id: 4, title: 'UI/UX Polish', status: 'pending', date: 'Est. Nov 10' },
  { id: 5, title: 'Production Launch', status: 'pending', date: 'Est. Nov 15' },
];

const MOCK_PRS = [
  { id: 101, title: "feat: add stripe webhooks", author: "Dev_01", status: "open", branch: "feat/stripe", comments: 4 },
  { id: 102, title: "fix: mobile responsiveness on safari", author: "Dev_02", status: "merged", branch: "fix/mobile", comments: 2 },
  { id: 103, title: "chore: upgrade next.js to v14.1", author: "Origins Forge", status: "open", branch: "chore/upgrade", comments: 0 },
];

const MOCK_DEPLOYMENTS = [
  { id: "d-8821", commit: "a1b2c3d", env: "Production", status: "success", time: "2h ago", duration: "4m 12s", version: "v1.2.4" },
  { id: "d-8820", commit: "e5f6g7h", env: "Staging", status: "success", time: "5h ago", duration: "3m 45s", version: "v1.2.4-beta" },
  { id: "d-8819", commit: "bad1dea", env: "Preview", status: "failed", time: "1d ago", duration: "1m 20s", version: "pr-102" },
];

const MOCK_INVOICES = [
  { id: "INV-2024-001", desc: "Phase 1: Blueprint & Architecture", amount: "$1,850.00", date: "Oct 20, 2025", status: "paid" },
  { id: "INV-2024-002", desc: "Phase 2: Core Development Milestone", amount: "$2,200.00", date: "Nov 01, 2025", status: "pending" },
];

const INITIAL_MESSAGES = [
  { id: 1, text: 'System: Secure WebSocket connection established (wss://origins-forge.io/v2/chat).', sender: 'system', time: '10:00 AM' },
  { id: 2, text: 'Hello! I see the new auth commits. Is the user profile schema finalized?', sender: 'me', time: '10:05 AM' },
  { id: 3, text: 'Yes, we just pushed the migration. You can see the `Profile` model in the schema viewer now.', sender: 'pm', time: '10:06 AM', name: 'Sarah (Tech Lead)' },
];

export default function ClientDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  if (!isAuthenticated) {
    return (
      <AuthScreen 
        mode={authMode} 
        setMode={setAuthMode} 
        onLogin={() => setIsAuthenticated(true)} 
      />
    );
  }

  return <DashboardLayout onLogout={() => setIsAuthenticated(false)} />;
}

// --- Auth Component ---
const AuthScreen = ({ mode, setMode, onLogin }: any) => {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-400 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF6B00] rounded-full blur-[150px] opacity-10 animate-pulse"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 text-[#FF6B00] mb-4">
             <div className="h-8 w-8 rounded bg-[#FF6B00] flex items-center justify-center text-white font-bold text-lg">O</div>
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Client Portal</h1>
          <p className="text-slate-500">Monitor your build in real-time.</p>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
           <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest mb-2 block">Email Access Key</label>
                <div className="relative">
                  <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input type="email" placeholder="client@company.com" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-[#FF6B00] transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest mb-2 block">Passphrase</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input type="password" placeholder="••••••••••••" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-[#FF6B00] transition-colors" />
                </div>
              </div>
              <button onClick={onLogin} className="w-full py-4 bg-[#FF6B00] text-white font-bold rounded-xl hover:bg-[#FF6B00]/90 transition-all shadow-lg shadow-orange-500/20 mt-4 flex items-center justify-center gap-2 group">
                {mode === 'login' ? 'Initialize Session' : 'Create Account'}
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
           <div className="mt-6 text-center text-xs">
              <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="hover:text-white transition-colors">
                {mode === 'login' ? "Don't have a project? Request Access" : "Already initialized? Login"}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Dashboard Layout ---
const DashboardLayout = ({ onLogout }: { onLogout: () => void }) => {
  const [progress, setProgress] = useState(68);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('live');

  // Simulation Effects
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSyncing(true);
      setTimeout(() => {
        setProgress(p => Math.min(p + 1, 99));
        setIsSyncing(false);
      }, 2000);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-400 font-sans flex overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-20 lg:w-72 border-r border-white/5 bg-[#080808] flex flex-col justify-between p-4 z-20 transition-all duration-300">
         <div>
            <div className="h-10 w-10 bg-[#FF6B00] rounded-xl flex items-center justify-center text-white font-bold text-xl mb-12 mx-auto lg:mx-0">O</div>
            
            <nav className="space-y-2">
               <NavItem icon={<Activity />} label="Live Status" active={activeTab === 'live'} onClick={() => setActiveTab('live')} />
               <NavItem icon={<GitBranch />} label="Repository" active={activeTab === 'repo'} onClick={() => setActiveTab('repo')} />
               <NavItem icon={<Box />} label="Deployments" active={activeTab === 'deploy'} onClick={() => setActiveTab('deploy')} />
               <NavItem icon={<FileText />} label="Invoices" active={activeTab === 'invoice'} onClick={() => setActiveTab('invoice')} />
            </nav>

            {/* Project Manager Card (Sidebar) */}
            <div className="hidden lg:block mt-12 bg-white/5 rounded-2xl p-4 border border-white/5">
                <div className="text-[10px] uppercase font-bold text-slate-500 mb-3 tracking-widest">Project Lead</div>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B00] to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">SC</div>
                    <div>
                        <div className="text-white font-bold text-sm">Sarah Chen</div>
                        <div className="text-xs text-emerald-500 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setIsChatOpen(true)}
                        className="flex-1 py-2 bg-[#FF6B00]/10 text-[#FF6B00] hover:bg-[#FF6B00]/20 text-xs font-bold rounded-lg transition-colors border border-[#FF6B00]/20 flex items-center justify-center gap-2"
                    >
                        <MessageSquare size={14} /> Message
                    </button>
                    <button 
                        className="px-3 py-2 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white text-xs font-bold rounded-lg transition-colors border border-white/5"
                        title="Schedule Sync"
                    >
                        <Calendar size={14} />
                    </button>
                </div>
            </div>
         </div>
         
         <div className="space-y-2">
            <button className="w-full p-3 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-colors flex items-center justify-center lg:justify-start gap-3">
                <Settings size={20} />
                <span className="hidden lg:block text-sm font-bold">Settings</span>
            </button>
            <button onClick={onLogout} className="w-full p-3 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-colors flex items-center justify-center lg:justify-start gap-3">
                <LogOut size={20} />
                <span className="hidden lg:block text-sm font-bold">Disconnect</span>
            </button>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
         <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#FF6B00]/5 to-transparent pointer-events-none"></div>

         <div className="p-6 lg:p-12 max-w-7xl mx-auto pb-32">
            
            {/* Contextual Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
               <div>
                  <div className="flex items-center gap-3 mb-2">
                     <h1 className="text-3xl font-black text-white">FinStack MVP</h1>
                     <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        Active Build
                     </span>
                  </div>
                  <p className="text-sm text-slate-500 font-mono">ID: a8f-22-9x • Next.js 14 • PostgreSQL</p>
               </div>

               <div className="flex items-center gap-4">
                  {activeTab === 'live' && (
                      <>
                        <div className="text-right hidden md:block">
                            <div className="text-xs font-bold uppercase text-slate-500 tracking-widest mb-1">Last Push</div>
                            <div className="text-white font-mono text-sm">2 mins ago</div>
                        </div>
                        <button className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors relative">
                            <RefreshCw size={18} className={isSyncing ? 'animate-spin text-[#FF6B00]' : ''} />
                        </button>
                      </>
                  )}
                  <button 
                    onClick={() => setIsRequestModalOpen(true)}
                    className="h-12 px-6 rounded-xl bg-[#FF6B00] text-white font-bold hover:bg-[#FF6B00]/90 transition-colors shadow-lg shadow-orange-500/20 flex items-center gap-2"
                  >
                     <Plus size={18} />
                     <span className="hidden sm:inline">Request Feature</span>
                  </button>
               </div>
            </header>

            {/* Dynamic Content Switching */}
            {activeTab === 'live' && <LiveStatusView progress={progress} isSyncing={isSyncing} />}
            {activeTab === 'repo' && <RepositoryView />}
            {activeTab === 'deploy' && <DeploymentsView />}
            {activeTab === 'invoice' && <InvoicesView />}

         </div>
      </main>

      {/* Overlays */}
      <ChatWidget isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
      {isRequestModalOpen && <RequestFeatureModal onClose={() => setIsRequestModalOpen(false)} />}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}</style>
    </div>
  );
};

// --- VIEW COMPONENTS ---

const LiveStatusView = ({ progress, isSyncing }: any) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Progress Circle Card */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-[#FF6B00]/20 transition-colors">
        <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="relative h-48 w-48 flex-shrink-0">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle className="text-white/5 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                    <circle className="text-[#FF6B00] progress-ring__circle stroke-current transition-all duration-1000 ease-out" strokeWidth="8" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * progress) / 100}></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-white">{progress}%</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF6B00] animate-pulse">Forging</span>
                </div>
            </div>
            <div className="flex-1 w-full">
                <h3 className="text-xl font-bold text-white mb-2">Phase 3: Core Logic</h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                    Engineers are currently wiring up the Stripe Connect webhooks and finalizing the user dashboard charts. Database schema migration is complete.
                </p>
                <div className="space-y-3">
                    <ProgressBar label="Frontend" percent={82} />
                    <ProgressBar label="Backend API" percent={65} />
                </div>
            </div>
        </div>
        </div>

        {/* Deployment Status */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 flex flex-col justify-between">
            <div>
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Server size={18} className="text-[#FF6B00]" />
                Infrastructure
                </h3>
                <div className="space-y-4">
                <DeployItem name="Vercel (Frontend)" status="healthy" latency="42ms" />
                <DeployItem name="Railway (Backend)" status="healthy" latency="89ms" />
                <DeployItem name="Neon (Postgres)" status="syncing" latency="120ms" />
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/5">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-slate-500">Resource Usage</span>
                    <Cpu size={14} className="text-slate-500" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-xs text-slate-500 mb-1">CPU</div>
                        <div className="text-white font-mono">12%</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-xs text-slate-500 mb-1">RAM</div>
                        <div className="text-white font-mono">512MB</div>
                    </div>
                </div>
                </div>
            </div>
        </div>

        {/* Forge Engine Terminal */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-3xl p-1 overflow-hidden flex flex-col h-[320px]">
        <div className="bg-white/5 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Terminal size={14} className="text-slate-500" />
                <span className="text-xs font-mono font-bold text-slate-400">origins-forge — watch — main</span>
            </div>
            <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
            </div>
        </div>
        <div className="p-6 font-mono text-sm overflow-y-auto custom-scrollbar flex-1">
            <div className="space-y-4">
                {isSyncing && (
                    <div className="text-[#FF6B00] animate-pulse flex items-center gap-2">
                    <Zap size={12} fill="currentColor" />
                    <span>Incoming push event detected...</span>
                    </div>
                )}
                {MOCK_COMMITS.map((commit) => (
                    <div key={commit.id} className="flex gap-4 group">
                    <div className="text-slate-600 w-20 shrink-0">{commit.id}</div>
                    <div className="flex-1">
                        <span className="text-slate-300 group-hover:text-white transition-colors">{commit.msg}</span>
                    </div>
                    <div className="text-slate-600 text-xs w-24 text-right flex flex-col items-end">
                        <span>{commit.time}</span>
                        <span className="text-[10px] text-[#FF6B00] opacity-0 group-hover:opacity-100 transition-opacity">{commit.author}</span>
                    </div>
                    </div>
                ))}
            </div>
        </div>
        </div>

        {/* Milestones List */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 overflow-y-auto h-[320px] custom-scrollbar">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#FF6B00]" />
                Milestones
            </h3>
            <div className="space-y-6 relative">
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/10"></div>
                {MILESTONES.map((m) => (
                    <div key={m.id} className="relative pl-8">
                    <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-[#0A0A0A] z-10 ${
                        m.status === 'completed' ? 'border-[#FF6B00] text-[#FF6B00]' : 
                        m.status === 'active' ? 'border-white text-white animate-pulse' : 'border-slate-700'
                    }`}>
                        {m.status === 'completed' && <div className="w-2 h-2 bg-current rounded-full" />}
                        {m.status === 'active' && <div className="w-2 h-2 bg-current rounded-full" />}
                    </div>
                    <div>
                        <div className={`text-sm font-bold ${m.status === 'pending' ? 'text-slate-500' : 'text-white'}`}>{m.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{m.date}</div>
                    </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const RepositoryView = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
        {/* Repo Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
                <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Active Branches</div>
                <div className="text-3xl font-black text-white">4</div>
                <div className="text-xs text-emerald-500 mt-2 flex items-center gap-1"><GitBranch size={12}/> main, dev, feat/stripe</div>
            </div>
            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
                <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Open PRs</div>
                <div className="text-3xl font-black text-white">2</div>
                <div className="text-xs text-[#FF6B00] mt-2 flex items-center gap-1"><GitPullRequest size={12}/> Needs Review</div>
            </div>
            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
                <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Total Commits</div>
                <div className="text-3xl font-black text-white">284</div>
                <div className="text-xs text-slate-500 mt-2 flex items-center gap-1"><Clock size={12}/> Last commit 2m ago</div>
            </div>
        </div>

        {/* PR List */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2"><GitPullRequest size={18} className="text-[#FF6B00]" /> Active Pull Requests</h3>
            </div>
            <div className="divide-y divide-white/5">
                {MOCK_PRS.map((pr) => (
                    <div key={pr.id} className="p-6 hover:bg-white/5 transition-colors flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold tracking-wider ${
                                    pr.status === 'merged' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                }`}>{pr.status}</span>
                                <span className="text-white font-bold text-sm">{pr.title}</span>
                            </div>
                            <div className="text-xs text-slate-500 font-mono">#{pr.id} opened by {pr.author} • {pr.branch}</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-slate-500 text-xs">
                                <MessageSquare size={12} /> {pr.comments}
                            </div>
                            <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                                <ExternalLink size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const DeploymentsView = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2"><Box size={18} className="text-[#FF6B00]" /> Deployment History</h3>
                <div className="flex gap-2">
                    <span className="flex items-center gap-1 text-xs text-emerald-500"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Success</span>
                    <span className="flex items-center gap-1 text-xs text-red-500"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Failed</span>
                </div>
            </div>
            <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-slate-500 text-xs uppercase tracking-wider font-bold">
                    <tr>
                        <th className="p-6">Status</th>
                        <th className="p-6">Commit</th>
                        <th className="p-6">Environment</th>
                        <th className="p-6">Version</th>
                        <th className="p-6">Duration</th>
                        <th className="p-6 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                    {MOCK_DEPLOYMENTS.map((deploy) => (
                        <tr key={deploy.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-6">
                                {deploy.status === 'success' ? (
                                    <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold uppercase">
                                        <CheckCircle2 size={12} /> Ready
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold uppercase">
                                        <AlertTriangle size={12} /> Error
                                    </span>
                                )}
                            </td>
                            <td className="p-6 font-mono text-slate-500">{deploy.commit}</td>
                            <td className="p-6">
                                <span className={`text-xs font-bold px-2 py-1 rounded ${
                                    deploy.env === 'Production' ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-800 text-slate-400'
                                }`}>{deploy.env}</span>
                            </td>
                            <td className="p-6 font-mono text-xs">{deploy.version}</td>
                            <td className="p-6 text-slate-500">{deploy.duration}</td>
                            <td className="p-6 text-right">
                                <button className="text-slate-500 hover:text-white transition-colors">
                                    <ExternalLink size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const InvoicesView = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 flex items-center justify-between">
                <div>
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Outstanding Balance</div>
                    <div className="text-4xl font-black text-white">$2,200.00</div>
                    <div className="text-xs text-slate-500 mt-2">Due Nov 01, 2025</div>
                </div>
                <div className="h-12 w-12 rounded-full bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00]">
                    <CreditCard size={24} />
                </div>
            </div>
            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 flex items-center justify-between">
                <div>
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Total Paid</div>
                    <div className="text-4xl font-black text-white">$1,850.00</div>
                    <div className="text-xs text-emerald-500 mt-2">All previous invoices settled</div>
                </div>
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <CheckCircle2 size={24} />
                </div>
            </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden">
             <div className="p-6 border-b border-white/5">
                <h3 className="font-bold text-white flex items-center gap-2"><FileText size={18} className="text-[#FF6B00]" /> Invoice History</h3>
            </div>
            <div className="divide-y divide-white/5">
                {MOCK_INVOICES.map((inv) => (
                    <div key={inv.id} className="p-6 hover:bg-white/5 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className={`mt-1 p-2 rounded-lg ${inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                <FileText size={20} />
                            </div>
                            <div>
                                <div className="text-white font-bold">{inv.desc}</div>
                                <div className="text-xs text-slate-500 font-mono mt-1">{inv.id} • Issued {inv.date}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <div className="text-white font-bold text-lg">{inv.amount}</div>
                                <div className={`text-[10px] uppercase font-bold tracking-widest ${inv.status === 'paid' ? 'text-emerald-500' : 'text-yellow-500'}`}>
                                    {inv.status}
                                </div>
                            </div>
                            <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors" title="Download PDF">
                                <Download size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// --- MODALS & WIDGETS ---

const RequestFeatureModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
        <div className="bg-[#0F0F0F] w-full max-w-lg rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <Plus className="text-[#FF6B00]" size={18} />
                    New Scope Request
                </h3>
                <button onClick={onClose} className="text-slate-500 hover:text-white">
                    <X size={20} />
                </button>
            </div>
            <div className="p-6 space-y-4">
                <div className="p-4 bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-xl text-xs text-[#FF6B00] leading-relaxed">
                    Note: New scope requests are evaluated by the technical lead and may impact the delivery timeline.
                </div>
                <div>
                    <label className="text-xs font-bold uppercase text-slate-500 tracking-widest block mb-2">Feature Title</label>
                    <input type="text" placeholder="e.g., Add Dark Mode Toggle" className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-[#FF6B00] outline-none" />
                </div>
                <div>
                    <label className="text-xs font-bold uppercase text-slate-500 tracking-widest block mb-2">Description</label>
                    <textarea rows={4} placeholder="Describe the functionality..." className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-[#FF6B00] outline-none"></textarea>
                </div>
                <div className="flex gap-3">
                    <button className="flex-1 py-3 bg-[#FF6B00] text-white font-bold rounded-xl hover:bg-[#FF6B00]/90 transition-colors">Submit Request</button>
                    <button onClick={onClose} className="px-6 py-3 border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-colors">Cancel</button>
                </div>
            </div>
        </div>
    </div>
);

const ChatWidget = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) => {
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        
        const newMessage = { id: Date.now(), text: inputValue, sender: 'me', time: 'Now' };
        setMessages(prev => [...prev, newMessage]);
        setInputValue("");

        setTimeout(() => {
            const reply = { 
                id: Date.now() + 1, 
                text: "Thanks for the update. I'll pass this to the backend team immediately.", 
                sender: 'pm', 
                time: 'Just now', 
                name: 'Sarah (Tech Lead)' 
            };
            setMessages(prev => [...prev, reply]);
        }, 1500);
    };

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-[#FF6B00] rounded-full shadow-[0_0_20px_rgba(255,107,0,0.3)] flex items-center justify-center text-white z-40 hover:scale-110 transition-transform"
            >
                <MessageSquare size={24} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#050505]"></span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] bg-[#0F0F0F] rounded-2xl border border-white/10 shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="p-4 bg-[#111] border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B00] to-purple-600 flex items-center justify-center text-white text-xs font-bold">SC</div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#111] rounded-full"></div>
                    </div>
                    <div>
                        <div className="text-white text-sm font-bold">Origins Support</div>
                        <div className="text-[10px] text-emerald-500 flex items-center gap-1">
                            <Zap size={8} fill="currentColor" /> Live Socket
                        </div>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                    <X size={18} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0A0A0A] custom-scrollbar">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                        {msg.sender === 'system' ? (
                            <div className="w-full text-center my-2">
                                <span className="text-[10px] text-emerald-500 font-mono bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">{msg.text}</span>
                            </div>
                        ) : (
                            <>
                                {msg.sender === 'pm' && <span className="text-[10px] text-slate-500 mb-1 ml-1">{msg.name}</span>}
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                                    msg.sender === 'me' 
                                        ? 'bg-[#FF6B00] text-white rounded-br-none' 
                                        : 'bg-white/10 text-slate-200 rounded-bl-none'
                                }`}>
                                    {msg.text}
                                </div>
                                <span className="text-[10px] text-slate-600 mt-1 mx-1">{msg.time}</span>
                            </>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-[#111] border-t border-white/5">
                <div className="relative">
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..." 
                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white text-sm focus:outline-none focus:border-[#FF6B00] transition-colors"
                    />
                    <button 
                        onClick={handleSend}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#FF6B00] rounded-lg text-white hover:bg-[#FF6B00]/90 transition-colors"
                    >
                        <Send size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Helper Components ---

const NavItem = ({ icon, label, active, onClick }: any) => (
   <button onClick={onClick} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
      active ? 'bg-white/10 text-white font-bold' : 'text-slate-500 hover:text-white hover:bg-white/5'
   }`}>
      {React.cloneElement(icon, { size: 20 })}
      <span className="hidden lg:block text-sm">{label}</span>
   </button>
);

const DeployItem = ({ name, status, latency }: any) => (
   <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
      <div className="flex items-center gap-3">
         <div className={`w-2 h-2 rounded-full ${status === 'healthy' ? 'bg-emerald-500' : 'bg-yellow-500 animate-pulse'}`}></div>
         <span className="text-sm font-medium text-slate-300">{name}</span>
      </div>
      <span className="text-xs font-mono text-slate-500">{latency}</span>
   </div>
);

const ProgressBar = ({ label, percent }: { label: string, percent: number }) => (
    <div>
        <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-1">
            <span>{label}</span>
            <span className="text-white">{percent}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-[#FF6B00]" style={{ width: `${percent}%` }}></div>
        </div>
    </div>
);
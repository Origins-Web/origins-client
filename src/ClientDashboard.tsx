/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { 
  Terminal, Activity, GitBranch, Server, CheckCircle2, 
  LogOut, Settings, RefreshCw, Box, Lock, Zap, 
  MessageSquare, Plus, FileText, Download, Send, X, AlertTriangle, Loader2
} from 'lucide-react';

// --- Types ---
type ProjectData = {
  id: string;
  name: string;
  status: string;
  progress: number;
  health: string;
  plan: string;
  next_milestone: string;
  client_email: string;
  // Leader Info
  lead_name: string;
  lead_email: string;
};

type InvoiceData = {
  id: string;
  amount: string;
  status: string;
  date: string;
  description: string;
};

type Message = {
  id: string;
  content: string;
  sender_role: 'admin' | 'client';
  created_at: string;
};

// --- MOCK DATA (For graphs/tables only) ---
const MOCK_COMMITS = [
  { id: 'a1b2c3d', msg: 'feat(auth): implement clerk webhooks', time: '2m ago', author: 'Origins Forge' },
  { id: 'e5f6g7h', msg: 'fix(db): optimize prisma schema relations', time: '15m ago', author: 'Dev_01' },
];

const MOCK_DEPLOYMENTS = [
  { id: "d-8821", commit: "a1b2c3d", env: "Production", status: "success", time: "2h ago", duration: "4m 12s", version: "v1.2.4" },
  { id: "d-8820", commit: "e5f6g7h", env: "Staging", status: "success", time: "5h ago", duration: "3m 45s", version: "v1.2.4-beta" },
];

export default function ClientDashboard() {
  const [session, setSession] = useState<any>(null);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user.email) fetchClientProject(session.user.email);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user.email) fetchClientProject(session.user.email);
      else {
        setProject(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchClientProject = async (email: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('client_email', email)
        .single();
      if (error) throw error;
      setProject(data);
    } catch (error) {
      console.log("No active project found.");
    } finally {
      setLoading(false);
    }
  };

  // Realtime Listener for Project Updates (Slider)
  useEffect(() => {
    if (!project?.id) return;
    const channel = supabase.channel('project-updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'projects', filter: `id=eq.${project.id}` }, (payload) => {
        setProject(payload.new as ProjectData);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [project?.id]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProject(null);
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-[#FF6B00]"><Loader2 className="animate-spin mb-4" size={32} /><p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Establishing Secure Connection...</p></div>;
  if (!session) return <AuthScreen />;
  if (!project) return <NoProjectScreen onLogout={handleLogout} userEmail={session.user.email} />;

  return <DashboardLayout project={project} onLogout={handleLogout} />;
}

// --- AUTH COMPONENT ---
const AuthScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const handleAuth = async () => {
    setLoading(true);
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert("Check your email for the confirmation link.");
      else alert("Account created! Please wait for an admin to link your project.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-400 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF6B00] rounded-full blur-[150px] opacity-10 animate-pulse"></div>
      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 text-[#FF6B00] mb-4"><div className="h-8 w-8 rounded bg-[#FF6B00] flex items-center justify-center text-white font-bold text-lg">O</div></div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Client Portal</h1>
          <p className="text-slate-500">Secure Client Access</p>
        </div>
        <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
           <div className="space-y-4">
              <div><label className="text-xs font-bold uppercase tracking-widest mb-2 block">Email Access Key</label><div className="relative"><Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} /><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="client@company.com" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-[#FF6B00] transition-colors" /></div></div>
              <div><label className="text-xs font-bold uppercase tracking-widest mb-2 block">Passphrase</label><div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} /><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••••••" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-[#FF6B00] transition-colors" /></div></div>
              <button onClick={handleAuth} disabled={loading} className="w-full py-4 bg-[#FF6B00] text-white font-bold rounded-xl hover:bg-[#FF6B00]/90 transition-all shadow-lg shadow-orange-500/20 mt-4 flex items-center justify-center gap-2 group">{loading ? <Loader2 className="animate-spin" /> : (mode === 'login' ? 'Initialize Session' : 'Create Account')}</button>
           </div>
           <div className="mt-6 text-center text-xs space-y-4">
              <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="hover:text-white transition-colors">{mode === 'login' ? "Don't have a project? Request Access" : "Already initialized? Login"}</button>
              <div className="pt-6 border-t border-white/5"><button onClick={() => navigate('/command')} className="group flex items-center justify-center gap-2 mx-auto text-[10px] uppercase font-bold tracking-widest text-slate-600 hover:text-[#FF6B00] transition-colors"><Terminal size={12} className="group-hover:text-[#FF6B00] transition-colors" />Are you a dev?</button></div>
           </div>
        </div>
      </div>
    </div>
  );
};

const NoProjectScreen = ({ onLogout, userEmail }: { onLogout: () => void, userEmail: string }) => (
  <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-slate-400 p-6">
    <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6"><AlertTriangle size={32} className="text-yellow-500" /></div>
    <h2 className="text-white font-bold text-2xl mb-2">No Active Project Found</h2>
    <p className="max-w-md text-center mb-8 leading-relaxed">You are logged in as <span className="text-white font-mono bg-white/10 px-1 rounded">{userEmail}</span>, but there are no projects linked to this email address.</p>
    <button onClick={onLogout} className="px-8 py-3 bg-white/10 border border-white/10 rounded-xl text-white font-bold hover:bg-white/20 transition-colors">Disconnect Session</button>
  </div>
);

const DashboardLayout = ({ project, onLogout }: { project: ProjectData, onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState('live');
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-400 font-sans flex overflow-hidden">
      <aside className="w-20 lg:w-72 border-r border-white/5 bg-[#080808] flex flex-col justify-between p-4 z-20">
         <div>
            <div className="h-10 w-10 bg-[#FF6B00] rounded-xl flex items-center justify-center text-white font-bold text-xl mb-12 mx-auto lg:mx-0">O</div>
            <nav className="space-y-2">
               <NavItem icon={<Activity />} label="Live Status" active={activeTab === 'live'} onClick={() => setActiveTab('live')} />
               <NavItem icon={<GitBranch />} label="Repository" active={activeTab === 'repo'} onClick={() => setActiveTab('repo')} />
               <NavItem icon={<Box />} label="Deployments" active={activeTab === 'deploy'} onClick={() => setActiveTab('deploy')} />
               <NavItem icon={<FileText />} label="Invoices" active={activeTab === 'invoice'} onClick={() => setActiveTab('invoice')} />
            </nav>

            {/* DYNAMIC LEADER CARD */}
            <div className="hidden lg:block mt-12 bg-white/5 rounded-2xl p-4 border border-white/5">
                <div className="text-[10px] uppercase font-bold text-slate-500 mb-3 tracking-widest">Project Lead</div>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B00] to-purple-600 flex items-center justify-center text-white font-bold shadow-lg text-xs">
                        {project.lead_name ? project.lead_name.split(' ').map((n:any) => n[0]).join('').substring(0,2) : 'TL'}
                    </div>
                    <div>
                        <div className="text-white font-bold text-sm">{project.lead_name || 'Assigned Lead'}</div>
                        <div className="text-xs text-emerald-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online</div>
                    </div>
                </div>
                <button onClick={() => setIsChatOpen(true)} className="w-full py-2 bg-[#FF6B00]/10 text-[#FF6B00] hover:bg-[#FF6B00]/20 text-xs font-bold rounded-lg transition-colors border border-[#FF6B00]/20 flex items-center justify-center gap-2"><MessageSquare size={14} /> Message</button>
            </div>
         </div>
         <div className="space-y-2">
            <button className="w-full p-3 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-colors flex items-center justify-center lg:justify-start gap-3"><Settings size={20} /><span className="hidden lg:block text-sm font-bold">Settings</span></button>
            <button onClick={onLogout} className="w-full p-3 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-colors flex items-center justify-center lg:justify-start gap-3"><LogOut size={20} /><span className="hidden lg:block text-sm font-bold">Disconnect</span></button>
         </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
         <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#FF6B00]/5 to-transparent pointer-events-none"></div>
         <div className="p-6 lg:p-12 max-w-7xl mx-auto pb-32">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
               <div>
                  <div className="flex items-center gap-3 mb-2">
                     <h1 className="text-3xl font-black text-white">{project.name}</h1>
                     <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border flex items-center gap-2 ${project.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}><div className={`w-1.5 h-1.5 rounded-full animate-pulse ${project.status === 'active' ? 'bg-emerald-500' : 'bg-yellow-500'}`}></div>{project.status} Build</span>
                  </div>
                  <p className="text-sm text-slate-500 font-mono">Plan: {project.plan} • ID: {project.id.slice(0,8)}</p>
               </div>
               <div className="flex items-center gap-4">
                  <div className="text-right hidden md:block"><div className="text-xs font-bold uppercase text-slate-500 tracking-widest mb-1">Last Push</div><div className="text-white font-mono text-sm">2 mins ago</div></div>
                  <button className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"><RefreshCw size={18} /></button>
                  <button className="h-12 px-6 rounded-xl bg-[#FF6B00] text-white font-bold hover:bg-[#FF6B00]/90 transition-colors shadow-lg shadow-orange-500/20 flex items-center gap-2"><Plus size={18} /><span className="hidden sm:inline">Request Feature</span></button>
               </div>
            </header>
            {activeTab === 'live' && <LiveStatusView project={project} />}
            {activeTab === 'repo' && <RepositoryView />}
            {activeTab === 'deploy' && <DeploymentsView />}
            {activeTab === 'invoice' && <InvoicesView projectId={project.id} />}
         </div>
      </main>
      
      {/* REALTIME CHAT WIDGET */}
      <ChatWidget isOpen={isChatOpen} setIsOpen={setIsChatOpen} project={project} />
      
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }`}</style>
    </div>
  );
};

// --- REALTIME CHAT WIDGET ---
const ChatWidget = ({ isOpen, setIsOpen, project }: { isOpen: boolean, setIsOpen: (v: boolean) => void, project: ProjectData }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    // 1. Fetch & Subscribe to Messages
    useEffect(() => {
        if (!isOpen) return;

        // Fetch History
        const fetchMessages = async () => {
            const { data } = await supabase
                .from('messages')
                .select('*')
                .eq('project_id', project.id)
                .order('created_at', { ascending: true });
            if (data) setMessages(data);
        };
        fetchMessages();

        // Subscribe to New Messages
        const channel = supabase.channel('chat-room')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `project_id=eq.${project.id}` }, (payload) => {
                setMessages(prev => [...prev, payload.new as Message]);
                scrollToBottom();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [isOpen, project.id]);

    const scrollToBottom = () => { setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100); };
    useEffect(() => { scrollToBottom(); }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;
        
        // Optimistic Update
        const tempMsg: Message = { id: 'temp', content: inputValue, sender_role: 'client', created_at: new Date().toISOString() };
        setMessages(prev => [...prev, tempMsg]);
        const msgToSend = inputValue;
        setInputValue("");

        // Send to Supabase
        await supabase.from('messages').insert({
            project_id: project.id,
            content: msgToSend,
            sender_role: 'client'
        });
    };

    if (!isOpen) {
        return (
            <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 w-14 h-14 bg-[#FF6B00] rounded-full shadow-[0_0_20px_rgba(255,107,0,0.3)] flex items-center justify-center text-white z-40 hover:scale-110 transition-transform">
                <MessageSquare size={24} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#050505] animate-pulse"></span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] bg-[#0F0F0F] rounded-2xl border border-white/10 shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="p-4 bg-[#111] border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="relative"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B00] to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        {project.lead_name ? project.lead_name.charAt(0) : 'S'}
                    </div><div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#111] rounded-full"></div></div>
                    <div><div className="text-white text-sm font-bold">{project.lead_name || 'Support'}</div><div className="text-[10px] text-emerald-500 flex items-center gap-1"><Zap size={8} fill="currentColor" /> Live Socket</div></div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0A0A0A] custom-scrollbar">
                {messages.length === 0 && <div className="text-center text-slate-600 text-xs mt-10">Start a secure conversation with {project.lead_name}.</div>}
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.sender_role === 'client' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.sender_role === 'client' ? 'bg-[#FF6B00] text-white rounded-br-none' : 'bg-white/10 text-slate-200 rounded-bl-none'}`}>{msg.content}</div>
                        <span className="text-[10px] text-slate-600 mt-1 mx-1">{new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-[#111] border-t border-white/5">
                <div className="relative">
                    <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white text-sm focus:outline-none focus:border-[#FF6B00] transition-colors" />
                    <button onClick={handleSend} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#FF6B00] rounded-lg text-white hover:bg-[#FF6B00]/90 transition-colors"><Send size={14} /></button>
                </div>
            </div>
        </div>
    );
};

// --- View Components (Same as before) ---
const LiveStatusView = ({ project }: { project: ProjectData }) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-[#FF6B00]/20 transition-colors">
        <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="relative h-48 w-48 flex-shrink-0">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100"><circle className="text-white/5 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle><circle className="text-[#FF6B00] progress-ring__circle stroke-current transition-all duration-1000 ease-out" strokeWidth="8" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * project.progress) / 100}></circle></svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-4xl font-black text-white">{project.progress}%</span><span className="text-[10px] uppercase font-bold tracking-widest text-[#FF6B00] animate-pulse">Forging</span></div>
            </div>
            <div className="flex-1 w-full"><h3 className="text-xl font-bold text-white mb-2">Phase: {project.next_milestone}</h3><p className="text-sm text-slate-500 mb-6 leading-relaxed">Engineers are currently working on your build. Database and API architecture are being scaffolded according to the blueprint.</p><div className="space-y-3"><ProgressBar label="Frontend" percent={Math.min(project.progress + 10, 100)} /><ProgressBar label="Backend API" percent={project.progress} /></div></div>
        </div>
        </div>
        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 flex flex-col justify-between">
            <div>
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Server size={18} className="text-[#FF6B00]" /> Infrastructure</h3>
                <div className="space-y-4"><DeployItem name="Vercel (Frontend)" status="healthy" latency="42ms" /><DeployItem name="Railway (Backend)" status="healthy" latency="89ms" /><DeployItem name="Neon (Postgres)" status="syncing" latency="120ms" /></div>
            </div>
        </div>
    </div>
);

const InvoicesView = ({ projectId }: { projectId: string }) => {
    const [invoices, setInvoices] = useState<InvoiceData[]>([]);
    useEffect(() => { const fetchInvoices = async () => { const { data } = await supabase.from('invoices').select('*').eq('project_id', projectId); if (data) setInvoices(data); }; fetchInvoices(); }, [projectId]);
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-white/5"><h3 className="font-bold text-white flex items-center gap-2"><FileText size={18} className="text-[#FF6B00]" /> Invoice History</h3></div>
                <div className="divide-y divide-white/5">
                    {invoices.length === 0 ? <div className="p-8 text-center text-slate-500">No invoices found.</div> : invoices.map((inv) => (
                        <div key={inv.id} className="p-6 flex justify-between items-center"><div className="flex items-center gap-4"><FileText size={20} className="text-slate-500" /><div><div className="text-white font-bold">{inv.description}</div><div className="text-xs text-slate-500">{inv.date}</div></div></div><div className="text-right"><div className="text-white font-bold">{inv.amount}</div><div className="text-[10px] uppercase text-emerald-500">{inv.status}</div></div></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Mock views
const RepositoryView = () => (<div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 space-y-4"><h3 className="font-bold text-white">Latest Commits</h3>{MOCK_COMMITS.map(c => <div key={c.id} className="flex gap-4 text-sm"><span className="font-mono text-slate-600">{c.id}</span><span className="text-slate-300">{c.msg}</span></div>)}</div>);
const DeploymentsView = () => (<div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden"><div className="p-6 border-b border-white/5 font-bold text-white">Deployments</div>{MOCK_DEPLOYMENTS.map(d => <div key={d.id} className="p-4 flex justify-between text-sm border-b border-white/5 last:border-0"><span className="text-white">{d.env}</span><span className="text-slate-500">{d.time}</span></div>)}</div>);
const NavItem = ({ icon, label, active, onClick }: any) => (<button onClick={onClick} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${active ? 'bg-white/10 text-white font-bold' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>{React.cloneElement(icon, { size: 20 })}<span className="hidden lg:block text-sm">{label}</span></button>);
const DeployItem = ({ name, status, latency }: any) => (<div className="flex justify-between p-3 rounded-xl bg-white/5 border border-white/5"><div className="flex gap-3 items-center"><div className={`w-2 h-2 rounded-full ${status === 'healthy' ? 'bg-emerald-500' : 'bg-yellow-500'}`}></div><span className="text-sm text-slate-300">{name}</span></div><span className="text-xs font-mono text-slate-500">{latency}</span></div>);
const ProgressBar = ({ label, percent }: any) => (<div><div className="flex justify-between text-xs font-bold uppercase mb-1"><span>{label}</span><span>{percent}%</span></div><div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-[#FF6B00]" style={{ width: `${percent}%` }}></div></div></div>);

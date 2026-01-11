/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react'; // <--- Added useRef here
import { 
  Terminal, Activity, Plus, Server, 
  User, Settings, MessageSquare, 
  Lock, ShieldCheck, ChevronRight, LogOut, X, Loader2, AlertOctagon,
  Layout, AlertTriangle, Send, FileText, Zap, ShieldAlert, Briefcase,
  UserCog, KeyRound, Users, DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { argon2id } from 'hash-wasm';

// --- Types ---
type ClientProject = {
  id: string;
  name: string;
  client_name: string;
  client_email: string;
  plan: 'MVP' | 'Landing' | 'Vision';
  status: 'active' | 'pending' | 'maintenance';
  progress: number;
  health: 'healthy' | 'warning' | 'critical';
  next_milestone: string;
  // New Fields
  lead_name: string;
  lead_email: string;
  budget: string;
  tech_stack: string[];
};

type UserProfile = {
  id: string;
  email: string;
  role: 'admin' | 'client';
  full_name?: string;
  job_title?: string;
};

// --- AUTH COMPONENT ---
const DevAuthScreen = ({ onLogin }: { onLogin: () => void }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessKey, setAccessKey] = useState(''); 
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 🔒 Stored Argon2 Hash
  const STORED_HASH = "$argon2id$v=19$m=65536,t=3,p=4$8Us7xohW4tWs8X/747dzjg$DtCbX44fuylcbyHjiJNn/G1sWwu64DxNYeIaUl8DZrg";

  const handleAuth = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isSignUp) {
        // 1. Verify Hash Key
        const isValid = await argon2id.verify({
          password: accessKey,
          hash: STORED_HASH,
        });

        if (!isValid) throw new Error("INVALID ROOT KEY: Cryptographic verification failed.");

        // 2. Sign Up
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              role: 'admin',
              full_name: fullName
            }
          }
        });
        
        if (error) throw error;
        alert('Clearance Granted. You may now login.');
        setIsSignUp(false); 

      } else {
        // 3. Login
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        if (!authData.user) throw new Error('No user found');

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .maybeSingle(); // Changed to maybeSingle to prevent 406 if profile missing

        if (profileError) throw profileError;

        if (profileData?.role !== 'admin') {
          await supabase.auth.signOut();
          throw new Error('ACCESS DENIED: Insufficient clearance level.');
        } 
        
        onLogin();
      }

    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-400 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#FF6B00] rounded-full blur-[150px] opacity-10 animate-pulse"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 text-[#FF6B00] mb-4">
             <div className="h-8 w-8 rounded bg-[#FF6B00] flex items-center justify-center text-white font-bold">
                <Terminal size={18} />
             </div>
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Origins Command</h1>
          <p className="text-slate-500">Restricted Access. Level 4 Clearance.</p>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
           <div className="space-y-4">
              
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-500 font-bold animate-pulse">
                  {errorMsg.includes('DENIED') || errorMsg.includes('INVALID') ? <ShieldAlert size={14} /> : <AlertOctagon size={14} />}
                  {errorMsg}
                </div>
              )}

              {isSignUp && (
                <>
                  <div className="animate-in slide-in-from-left-4 fade-in duration-300">
                    <label className="text-xs font-bold uppercase tracking-widest mb-2 block text-[#FF6B00]">Root Hash Key</label>
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF6B00]" size={16} />
                      <input type="password" value={accessKey} onChange={(e) => setAccessKey(e.target.value)} placeholder="ENTER-KEY-PHRASE" className="w-full bg-[#FF6B00]/5 border border-[#FF6B00]/30 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-[#FF6B00] transition-colors font-mono tracking-wider" />
                    </div>
                  </div>
                  <div className="animate-in slide-in-from-right-4 fade-in duration-300 delay-75">
                    <label className="text-xs font-bold uppercase tracking-widest mb-2 block text-slate-500">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                      <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Alex V." className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-[#FF6B00] transition-colors" />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-bold uppercase tracking-widest mb-2 block text-slate-500">Operative Email</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@origins.dev" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-[#FF6B00] transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest mb-2 block text-slate-500">Passphrase</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-[#FF6B00] transition-colors" />
                </div>
              </div>

              <button onClick={handleAuth} disabled={loading} className="w-full py-4 bg-[#FF6B00] text-white font-bold rounded-xl hover:bg-[#FF6B00]/90 transition-all shadow-lg shadow-orange-500/20 mt-4 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>{isSignUp ? 'Generate Credentials' : 'Initialize Session'} <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
           </div>

           <div className="mt-6 text-center text-xs space-y-4">
              <button onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(null); }} className="hover:text-white transition-colors">
                {isSignUp ? 'Already have an ID? Login' : 'New Operative? Create Dev Account'}
              </button>
              <div className="pt-6 border-t border-white/5">
                <button onClick={() => navigate('/portal')} className="group flex items-center justify-center gap-2 mx-auto text-[10px] uppercase font-bold tracking-widest text-slate-600 hover:text-[#FF6B00] transition-colors">
                   <Layout size={12} className="group-hover:text-[#FF6B00] transition-colors" /> Return to Client Portal
                </button>
              </div>
           </div>
        </div>
        <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-[10px] text-slate-600 border border-white/5 bg-white/5 px-3 py-1 rounded-full">
                <ShieldCheck size={10} className="text-emerald-500" />
                <span>Encrypted Connection (TLS 1.3)</span>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- ONBOARDING MODAL ---
const OnboardingModal = ({ userId, onComplete }: { userId: string, onComplete: () => void }) => {
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!fullName.trim()) return alert("Name is required");
    setLoading(true);
    
    const { error } = await supabase.from('profiles').update({ full_name: fullName, job_title: jobTitle || 'Administrator' }).eq('id', userId);
    setLoading(false);
    
    if (error) {
      console.error("Profile Update Error:", error);
      alert(`Update Failed: ${error.message}`);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#0A0A0A] w-full max-w-md border border-white/10 rounded-3xl p-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B00] rounded-full blur-[80px] opacity-20"></div>
         <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6"><User size={24} className="text-white" /></div>
            <h2 className="text-2xl font-black text-white mb-2">Identify Yourself</h2>
            <p className="text-sm text-slate-500 mb-8">This is your first login. Please set your display profile for the command center.</p>
            <div className="space-y-6">
               <div><label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">Full Name</label><input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. Alex V." className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#FF6B00] outline-none transition-colors" /></div>
               <div><label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">Role / Title</label><input value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g. Senior Engineer" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#FF6B00] outline-none transition-colors" /></div>
               <button onClick={handleSave} disabled={loading} className="w-full py-4 bg-[#FF6B00] text-white font-bold rounded-xl hover:bg-[#FF6B00]/90 transition-colors flex items-center justify-center gap-2">{loading ? <Loader2 className="animate-spin" size={20} /> : 'Confirm Identity'}</button>
            </div>
         </div>
      </div>
    </div>
  );
};

// --- NEW PROJECT MODAL ---
const NewProjectModal = ({ onClose, onCreated }: { onClose: () => void, onCreated: () => void }) => {
  const [formData, setFormData] = useState({ 
    name: '', client_name: '', client_email: '', plan: 'MVP',
    lead_name: '', lead_email: '', budget: '', tech_stack: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const stackArray = formData.tech_stack.split(',').map(s => s.trim()).filter(s => s);

    const { error } = await supabase.from('projects').insert([{
      name: formData.name,
      client_name: formData.client_name,
      client_email: formData.client_email, 
      plan: formData.plan,
      lead_name: formData.lead_name,
      lead_email: formData.lead_email,
      budget: formData.budget,
      tech_stack: stackArray,
      status: 'pending',
      progress: 0,
      next_milestone: 'Kickoff Call'
    }]);
    
    setLoading(false);
    if (error) alert(error.message);
    else {
      onCreated();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0F0F0F] w-full max-w-2xl rounded-2xl border border-white/10 p-8 animate-in zoom-in-95 overflow-y-auto max-h-[90vh]">
         <div className="flex justify-between items-center mb-8"><h3 className="text-white font-bold flex items-center gap-2 text-xl"><Plus size={24} className="text-[#FF6B00]" /> Initialize Engagement</h3><button onClick={onClose} className="text-slate-500 hover:text-white"><X size={24} /></button></div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <h4 className="text-[#FF6B00] text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4"><User size={14} /> Client Details</h4>
                <div><label className="block text-xs font-bold uppercase mb-2 text-slate-500">Project Name</label><input className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-[#FF6B00] outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. RetailFlow V2" /></div>
                <div><label className="block text-xs font-bold uppercase mb-2 text-slate-500">Client Name</label><input className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-[#FF6B00] outline-none" value={formData.client_name} onChange={e => setFormData({...formData, client_name: e.target.value})} placeholder="e.g. Marcus Jones" /></div>
                <div><label className="block text-xs font-bold uppercase mb-2 text-slate-500">Client Email (Access Key)</label><input className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-[#FF6B00] outline-none" value={formData.client_email} onChange={e => setFormData({...formData, client_email: e.target.value})} placeholder="client@company.com" /></div>
                <div><label className="block text-xs font-bold uppercase mb-2 text-slate-500">Plan Type</label><select className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-[#FF6B00] outline-none" value={formData.plan} onChange={e => setFormData({...formData, plan: e.target.value as any})}><option value="MVP">MVP ($1,850)</option><option value="Landing">Landing ($450)</option><option value="Vision">Vision AI ($1,200)</option></select></div>
            </div>
            <div className="space-y-4">
                <h4 className="text-[#FF6B00] text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4"><Users size={14} /> Assignment & Tech</h4>
                <div><label className="block text-xs font-bold uppercase mb-2 text-slate-500">Project Leader Name</label><input className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-[#FF6B00] outline-none" value={formData.lead_name} onChange={e => setFormData({...formData, lead_name: e.target.value})} placeholder="e.g. Sarah Chen" /></div>
                <div><label className="block text-xs font-bold uppercase mb-2 text-slate-500">Leader Email (For Contact)</label><input className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-[#FF6B00] outline-none" value={formData.lead_email} onChange={e => setFormData({...formData, lead_email: e.target.value})} placeholder="sarah@origins.dev" /></div>
                <div className="flex gap-4"><div className="flex-1"><label className="block text-xs font-bold uppercase mb-2 text-slate-500">Budget</label><div className="relative"><DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input className="w-full bg-black border border-white/10 rounded-xl p-3 pl-8 text-white focus:border-[#FF6B00] outline-none" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} placeholder="5,000" /></div></div></div>
                <div><label className="block text-xs font-bold uppercase mb-2 text-slate-500">Tech Stack (Comma Separated)</label><input className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-[#FF6B00] outline-none" value={formData.tech_stack} onChange={e => setFormData({...formData, tech_stack: e.target.value})} placeholder="Next.js, Supabase, Tailwind" /></div>
            </div>
         </div>
         <div className="mt-8 pt-6 border-t border-white/10 flex justify-end gap-4">
            <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white transition-colors">Cancel</button>
            <button onClick={handleSubmit} disabled={loading} className="px-8 py-3 bg-[#FF6B00] text-white font-bold rounded-xl hover:bg-[#FF6B00]/90 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20">{loading ? <Loader2 className="animate-spin" size={18} /> : 'Initialize Engagement'}</button>
         </div>
      </div>
    </div>
  );
};

// --- MAIN PORTAL ---
export default function DevClientPortal() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [clients, setClients] = useState<ClientProject[]>([]); 
  const [selectedClient, setSelectedClient] = useState<ClientProject | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if(session) fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if(session) fetchProfile(session.user.id);
    });

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearInterval(timer);
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (data) {
      setProfile(data);
      if (data.role === 'admin' && !data.full_name) {
        setShowOnboarding(true);
      }
    }
  };

  const fetchProjects = async () => {
    setLoadingProjects(true);
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (!error) {
      setClients(data || []);
      if (data && data.length > 0) {
         if (!selectedClient) setSelectedClient(data[0]);
         else {
            const exists = data.find(p => p.id === selectedClient.id);
            setSelectedClient(exists || data[0]);
         }
      }
    }
    setLoadingProjects(false);
  };

  useEffect(() => {
    if (session) fetchProjects();
  }, [session]);

  if (!session) return <DevAuthScreen onLogin={() => {}} />;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-400 font-mono flex flex-col overflow-hidden selection:bg-[#FF6B00]/30 animate-in fade-in duration-700">
      
      {showOnboarding && session && (
        <OnboardingModal userId={session.user.id} onComplete={() => { setShowOnboarding(false); fetchProfile(session.user.id); }} />
      )}

      <header className="h-14 border-b border-white/10 bg-[#0A0A0A] flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-gradient-to-br from-[#FF6B00] to-red-600 rounded flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(255,107,0,0.3)]"><Terminal size={18} /></div>
          <div><div className="text-white font-bold tracking-widest text-sm uppercase">Origins Portal</div><div className="text-[10px] text-slate-500 font-mono">Client Interaction Layer v2.1</div></div>
        </div>
        <div className="flex items-center gap-6">
           <div className="hidden md:flex items-center gap-2 text-xs bg-white/5 px-3 py-1.5 rounded-full border border-white/5"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div><span className="text-emerald-500 font-bold uppercase">Socket Active</span><span className="text-slate-600 border-l border-white/10 pl-2 ml-2">{currentTime.toLocaleTimeString()} UTC</span></div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3">
                {profile && !profile.full_name && !showOnboarding && (
                   <button onClick={() => setShowOnboarding(true)} className="animate-pulse bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 px-3 py-1.5 rounded-lg flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide hover:bg-yellow-500/20 transition-colors"><UserCog size={12} /> Setup Identity</button>
                )}
                <div className="text-right hidden sm:block">
                    <div className="text-white text-xs font-bold">{profile?.full_name || session.user.email}</div>
                    <div className="text-[10px] text-slate-500 flex items-center justify-end gap-1">{profile?.job_title ? <Briefcase size={10} /> : null} {profile?.job_title || 'Authenticated User'}</div>
                </div>
                <div className="h-8 w-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-white text-xs font-bold relative">
                    {profile?.full_name ? profile.full_name.split(' ').map((n:string) => n[0]).join('').substring(0,2).toUpperCase() : session.user.email?.charAt(0).toUpperCase()}
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0A0A0A] rounded-full"></div>
                </div>
             </div>
             <button onClick={() => supabase.auth.signOut()} className="hover:text-white transition-colors"><LogOut size={16} /></button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-white/10 bg-[#080808] flex flex-col">
          <div className="p-4">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-4">Active Projects</div>
            {loadingProjects ? <div className="text-center py-10"><Loader2 className="animate-spin mx-auto text-[#FF6B00]" /></div> : (
              <div className="space-y-2">
                {clients.map(client => (
                  <button key={client.id} onClick={() => setSelectedClient(client)} className={`w-full text-left p-3 rounded-xl border transition-all relative overflow-hidden group ${selectedClient?.id === client.id ? 'bg-[#FF6B00]/10 border-[#FF6B00]/50 text-white' : 'bg-transparent border-transparent hover:bg-white/5 text-slate-500'}`}>
                     {selectedClient?.id === client.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6B00]"></div>}
                     <div className="font-bold text-sm mb-1">{client.name}</div>
                     <div className="text-[10px] opacity-70 mb-2">{client.client_name}</div>
                     <div className="flex items-center gap-2 text-[10px]">
                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-current" style={{ width: `${client.progress}%` }}></div></div>
                        <span>{client.progress}%</span>
                     </div>
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => setShowNewProjectModal(true)} className="w-full mt-4 py-3 border border-dashed border-white/10 rounded-xl text-xs font-bold text-slate-600 hover:text-white hover:border-white/20 transition-colors flex items-center justify-center gap-2"><Plus size={14} /> New Engagement</button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col bg-[#050505] relative">
           {selectedClient ? (
             <>
               <div className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#0A0A0A]">
                  <div className="flex items-center gap-4">
                    <h1 className="text-xl font-black text-white">{selectedClient.name}</h1>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${selectedClient.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>{selectedClient.status}</span>
                  </div>
                  <div className="flex gap-1">
                    <TabButton label="Controls" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<Settings size={14} />} />
                    <TabButton label="Comms" active={activeTab === 'comms'} onClick={() => setActiveTab('comms')} icon={<MessageSquare size={14} />} />
                  </div>
               </div>
               
               {activeTab === 'overview' && (
                 <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl">
                          <div className="flex items-center justify-between mb-4"><span className="text-slate-500 text-xs uppercase font-bold tracking-widest">Global Progress</span><Activity size={16} className="text-[#FF6B00]" /></div>
                          <div className="text-4xl font-black text-white mb-6">{selectedClient.progress}%</div>
                          <input type="range" min="0" max="100" value={selectedClient.progress} onChange={(e) => { const val = parseInt(e.target.value); setSelectedClient({...selectedClient, progress: val}); supabase.from('projects').update({ progress: val }).eq('id', selectedClient.id).then(({ error }) => { if (error) console.error(error); }); }} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FF6B00]" />
                          <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-mono"><span>Kickoff</span><span>Launch</span></div>
                       </div>
                       <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl">
                          <div className="flex items-center justify-between mb-4"><span className="text-slate-500 text-xs uppercase font-bold tracking-widest">Current Milestone</span><Server size={16} className="text-emerald-500" /></div>
                          <div className="text-lg font-bold text-white mb-1">{selectedClient.next_milestone}</div>
                          <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-white transition-colors border border-white/5 mt-4">Update Milestone</button>
                       </div>
                    </div>
                 </div>
               )}

               {activeTab === 'comms' && <CommsPanel client={selectedClient} />}
             </>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-600 gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-700"><Terminal size={32} /></div>
                <p>Select an active engagement to initialize command protocol.</p>
             </div>
           )}
        </main>
      </div>
      {showNewProjectModal && <NewProjectModal onClose={() => setShowNewProjectModal(false)} onCreated={() => fetchProjects()} />}
    </div>
  );
}

// --- COMMS PANEL (REALTIME) ---
const CommsPanel = ({ client }: { client: ClientProject }) => {
   const [messages, setMessages] = useState<any[]>([]);
   const [input, setInput] = useState('');
   const scrollRef = useRef<HTMLDivElement>(null); // Fixed: useRef is now imported

   useEffect(() => {
      // 1. Fetch History
      const fetchHistory = async () => {
         const { data } = await supabase.from('messages').select('*').eq('project_id', client.id).order('created_at', { ascending: true });
         if (data) setMessages(data);
      };
      fetchHistory();

      // 2. Realtime Subscription
      const channel = supabase.channel(`dev-chat-${client.id}`)
         .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `project_id=eq.${client.id}` }, (payload) => {
            setMessages(prev => [...prev, payload.new]);
            setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
         })
         .subscribe();

      return () => { supabase.removeChannel(channel); };
   }, [client.id]);

   const sendMessage = async () => {
      if(!input.trim()) return;
      // Send to DB
      await supabase.from('messages').insert({
         project_id: client.id,
         content: input,
         sender_role: 'admin' // Dev is Admin
      });
      setInput('');
   };

   return (
      <div className="flex flex-col h-full bg-[#080808]">
         <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.length === 0 && <div className="text-center text-slate-600 text-xs mt-10">No messages yet. Start the conversation.</div>}
            {messages.map((msg, idx) => (
               <div key={idx} className={`flex flex-col ${msg.sender_role === 'admin' ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1">
                     <span className="text-xs font-bold text-slate-400">{msg.sender_role === 'admin' ? 'Me' : client.client_name}</span>
                     <span className="text-[10px] text-slate-600">{new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.sender_role === 'admin' ? 'bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-none'}`}>{msg.content}</div>
               </div>
            ))}
            <div ref={scrollRef} />
         </div>
         <div className="p-4 bg-[#0A0A0A] border-t border-white/10">
            <div className="relative">
               <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder={`Message ${client.client_name}...`} className="w-full bg-[#111] border border-white/10 rounded-xl py-4 pl-6 pr-14 text-white focus:outline-none focus:border-[#FF6B00] transition-colors" />
               <button onClick={sendMessage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#FF6B00] text-white rounded-lg hover:bg-[#FF6B00]/90 transition-colors"><Send size={16} /></button>
            </div>
         </div>
      </div>
   );
};

const TabButton = ({ label, active, onClick, icon }: any) => (
   <button onClick={onClick} className={`relative px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all ${active ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>{icon}{label}</button>
);

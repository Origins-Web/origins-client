import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Activity, 
  Server, 
  GitCommit, 
  Users, 
  AlertTriangle, 
  Terminal, 
  Cpu, 
  Database, 
  Lock, 
  Eye, 
  Zap, 
  Command, 
  Search, 
  LayoutGrid, 
  List, 
  CheckCircle, 
  XCircle, 
  Play, 
  Hash, 
  MessageSquare, 
  Mic, 
  Headphones, 
  Settings, 
  Phone, 
  Video, 
  Smile, 
  Paperclip, 
  MoreVertical, 
  AtSign,
  Plus
} from 'lucide-react';

// --- MOCK DATA ---
const SQUADS = [
  { id: 'SQ-ALPHA', project: 'FinStack MVP', lead: 'Sarah C.', status: 'nominal', cpu: 45, mem: 62, active_devs: 3 },
  { id: 'SQ-BETA', project: 'VisionAI Health', lead: 'Marcus J.', status: 'warning', cpu: 92, mem: 88, active_devs: 2 },
  { id: 'SQ-GAMMA', project: 'RetailFlow', lead: 'Alex V.', status: 'nominal', cpu: 22, mem: 30, active_devs: 4 },
];

const LIVE_LOGS = [
  { id: 101, time: '14:32:01', type: 'info', msg: '[Forge-CLI] Scaffolding new module: "Stripe Connect" for FinStack' },
  { id: 102, time: '14:32:15', type: 'success', msg: '[CI/CD] Build #8821 passed (Production) - 42ms' },
  { id: 103, time: '14:33:40', type: 'warning', msg: '[Monitor] High memory usage detected on VisionAI_Container_04' },
  { id: 104, time: '14:34:12', type: 'error', msg: '[Auth] Failed login attempt from IP 192.168.1.1 (RetailFlow Admin)' },
  { id: 105, time: '14:35:00', type: 'info', msg: '[Git] @dev_02 pushed to branch "feat/dark-mode"' },
];

const ENGINEERS = [
  { id: 1, name: 'Sarah Chen', role: 'Tech Lead', status: 'coding', task: 'Reviewing PR #102', efficiency: 94, avatar: 'SC' },
  { id: 2, name: 'Marcus J.', role: 'Senior Dev', status: 'debugging', task: 'Fixing memory leak in worker', efficiency: 88, avatar: 'MJ' },
  { id: 3, name: 'David K.', role: 'Frontend', status: 'idle', task: 'Awaiting specs', efficiency: 100, avatar: 'DK' },
  { id: 4, name: 'Elena R.', role: 'Backend', status: 'coding', task: 'API Schema Migration', efficiency: 91, avatar: 'ER' },
];

const CHANNELS = [
  { id: 'mission-control', label: 'mission-control', type: 'text' },
  { id: 'forge-updates', label: 'forge-updates', type: 'text' },
  { id: 'dev-ops', label: 'dev-ops', type: 'text' },
  { id: 'incidents', label: 'incidents', type: 'alert' },
];

const MOCK_MESSAGES = [
  { id: 1, user: 'Sarah Chen', time: '10:42 AM', content: 'Deployment to **SQ-ALPHA** is green. Monitoring latency now.', role: 'Tech Lead', avatar: 'SC' },
  { id: 2, user: 'System', time: '10:43 AM', content: 'Alert: High CPU usage detected on container `vision-ai-worker-01`', role: 'Bot', isSystem: true },
  { id: 3, user: 'Marcus J.', time: '10:45 AM', content: 'I see it. It’s the image processing queue. Scaling up the worker pool manually.', role: 'Senior Dev', avatar: 'MJ' },
  { id: 4, user: 'Marcus J.', time: '10:45 AM', content: 'Scaling complete. Replicas increased to 5.', role: 'Senior Dev', avatar: 'MJ' },
];

export default function InternalOps() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-400 font-mono selection:bg-[#FF6B00]/30 flex flex-col">
      
      {/* Top Bar */}
      <header className="h-14 border-b border-white/10 bg-[#0A0A0A] flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="h-6 w-6 bg-[#FF6B00] flex items-center justify-center text-black font-bold text-xs rounded">
            <Command size={14} />
          </div>
          <span className="text-white font-bold tracking-widest text-sm uppercase">Origins Command // Internal</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-emerald-500 font-bold">SYSTEM ONLINE</span>
          </div>
          <div className="text-xs text-slate-500">
            {currentTime.toISOString().split('T')[0]} <span className="text-white">{currentTime.toLocaleTimeString()}</span> UTC
          </div>
          <div className="h-8 w-8 rounded bg-white/10 flex items-center justify-center text-white">
            <Users size={16} />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 bg-[#080808] flex flex-col">
          <div className="p-4 space-y-1">
            <NavButton icon={<LayoutGrid />} label="Mission Control" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <NavButton icon={<MessageSquare />} label="Neural Link" active={activeTab === 'comms'} onClick={() => setActiveTab('comms')} badge="3" />
            <NavButton icon={<Terminal />} label="Forge Terminal" active={activeTab === 'forge'} onClick={() => setActiveTab('forge')} />
            <NavButton icon={<Database />} label="Data Lake" active={activeTab === 'data'} onClick={() => setActiveTab('data')} />
            <NavButton icon={<Lock />} label="Security Audit" active={activeTab === 'sec'} onClick={() => setActiveTab('sec')} />
          </div>
          
          <div className="mt-auto p-4 border-t border-white/10">
            <div className="text-[10px] uppercase font-bold text-slate-600 mb-3 tracking-widest">Resource Usage</div>
            <div className="space-y-3">
              <ResourceBar label="Cluster CPU" percent={42} color="bg-emerald-500" />
              <ResourceBar label="Memory" percent={78} color="bg-[#FF6B00]" />
              <ResourceBar label="Storage" percent={24} color="bg-blue-500" />
            </div>
          </div>
        </aside>

        {/* Main Content Switcher */}
        {activeTab === 'comms' ? (
          <CommsInterface />
        ) : (
          <main className="flex-1 overflow-y-auto bg-[#050505] p-6">
            <DashboardOverview viewMode={viewMode} setViewMode={setViewMode} />
          </main>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
      `}</style>
    </div>
  );
}

// ==========================================
// NEW: NEURAL LINK (Chat/Comms Interface)
// ==========================================

const CommsInterface = () => {
  return (
    <div className="flex-1 flex overflow-hidden bg-[#0A0A0A]">
      
      {/* Channel Sidebar */}
      <div className="w-60 bg-[#080808] border-r border-white/5 flex flex-col">
        <div className="p-4 border-b border-white/5">
          <div className="font-bold text-white text-sm">Origins HQ</div>
          <div className="text-[10px] text-emerald-500 flex items-center gap-1 mt-1">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            Voice Connected
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
          <div className="mb-6">
            <div className="flex items-center justify-between px-2 mb-2 group cursor-pointer text-slate-500 hover:text-white transition-colors">
              <div className="text-[10px] uppercase font-bold tracking-widest">Text Channels</div>
              <PlusButton />
            </div>
            <div className="space-y-0.5">
              {CHANNELS.map(ch => (
                <div key={ch.id} className={`group flex items-center px-2 py-1.5 rounded cursor-pointer ${ch.id === 'mission-control' ? 'bg-white/10 text-white' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}>
                  <Hash size={14} className="mr-2 opacity-50" />
                  <span className="text-sm font-medium">{ch.label}</span>
                  {ch.type === 'alert' && <div className="ml-auto w-1.5 h-1.5 bg-red-500 rounded-full"></div>}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between px-2 mb-2 group cursor-pointer text-slate-500 hover:text-white transition-colors">
              <div className="text-[10px] uppercase font-bold tracking-widest">Direct Messages</div>
              <PlusButton />
            </div>
            <div className="space-y-0.5">
              {ENGINEERS.map(eng => (
                <div key={eng.id} className="group flex items-center px-2 py-1.5 rounded cursor-pointer text-slate-500 hover:bg-white/5 hover:text-slate-300">
                  <div className="relative mr-3">
                    <div className="w-4 h-4 rounded bg-[#FF6B00] flex items-center justify-center text-[8px] text-white font-bold">{eng.avatar}</div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-black ${eng.status === 'coding' ? 'bg-blue-500' : eng.status === 'debugging' ? 'bg-yellow-500' : 'bg-slate-500'}`}></div>
                  </div>
                  <span className="text-sm font-medium opacity-80">{eng.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Voice Controls */}
        <div className="p-3 bg-[#050505] border-t border-white/5">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-xs font-bold text-emerald-500">Voice Connected</span>
            </div>
            <div className="text-[10px] text-slate-500">12ms</div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-white/10 hover:bg-white/20 p-2 rounded text-white transition-colors flex justify-center">
              <Mic size={16} />
            </button>
            <button className="flex-1 bg-white/10 hover:bg-white/20 p-2 rounded text-white transition-colors flex justify-center">
              <Headphones size={16} />
            </button>
            <button className="flex-1 bg-white/10 hover:bg-white/20 p-2 rounded text-white transition-colors flex justify-center">
              <Settings size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0A0A0A]">
        {/* Chat Header */}
        <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-[#0A0A0A]">
          <div className="flex items-center gap-2">
            <Hash size={20} className="text-slate-500" />
            <h2 className="text-white font-bold">mission-control</h2>
            <div className="h-4 w-px bg-white/10 mx-2"></div>
            <span className="text-xs text-slate-500 truncate">Central command feed for all active deployments</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <Phone size={18} className="hover:text-white cursor-pointer" />
            <Video size={18} className="hover:text-white cursor-pointer" />
            <div className="relative">
              <Search size={18} className="hover:text-white cursor-pointer" />
            </div>
            <Users size={18} className="hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {MOCK_MESSAGES.map((msg, i) => (
            <div key={msg.id} className={`group flex gap-4 ${msg.isSystem ? 'bg-white/5 p-3 rounded-lg border border-white/5 border-l-2 border-l-[#FF6B00]' : ''}`}>
              {!msg.isSystem && (
                <div className="w-10 h-10 rounded-lg bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00] font-bold shrink-0 mt-0.5">
                  {msg.avatar}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`font-bold hover:underline cursor-pointer ${msg.isSystem ? 'text-[#FF6B00]' : 'text-white'}`}>{msg.user}</span>
                  {!msg.isSystem && <span className="text-[10px] bg-white/10 px-1.5 rounded text-slate-400">{msg.role}</span>}
                  <span className="text-[10px] text-slate-600">{msg.time}</span>
                </div>
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {msg.content.includes('```') ? (
                    <div className="mt-2 bg-black rounded-lg p-3 border border-white/10 font-mono text-xs text-emerald-400">
                      {msg.content.replace(/```bash|```/g, '')}
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* New Message Indicator */}
          <div className="flex items-center gap-4 py-4 opacity-50">
            <div className="h-px bg-red-500/50 flex-1"></div>
            <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">New Messages</span>
            <div className="h-px bg-red-500/50 flex-1"></div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 pt-0">
          <div className="bg-[#151515] rounded-xl p-2 border border-white/10 focus-within:border-[#FF6B00]/50 transition-colors">
            <textarea 
              rows={1}
              className="w-full bg-transparent text-white text-sm px-3 py-2 focus:outline-none resize-none placeholder:text-slate-600 font-mono"
              placeholder="Message #mission-control..."
            />
            <div className="flex items-center justify-between px-2 pt-2 border-t border-white/5">
              <div className="flex gap-2 text-slate-500">
                <button className="hover:text-white hover:bg-white/10 p-1.5 rounded transition-colors"><Plus size={16} /></button>
                <button className="hover:text-white hover:bg-white/10 p-1.5 rounded transition-colors"><Terminal size={16} /></button>
                <button className="hover:text-white hover:bg-white/10 p-1.5 rounded transition-colors"><AtSign size={16} /></button>
              </div>
              <div className="flex gap-2 text-slate-500">
                <button className="hover:text-white hover:bg-white/10 p-1.5 rounded transition-colors"><Mic size={16} /></button>
                <button className="bg-[#FF6B00] text-white p-1.5 rounded hover:bg-[#FF6B00]/80 transition-colors"><Zap size={16} fill="currentColor" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Member List (Right Sidebar) */}
      <div className="w-60 bg-[#080808] border-l border-white/5 hidden xl:flex flex-col p-4 custom-scrollbar overflow-y-auto">
        <div className="mb-6">
          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-3">Online — 3</div>
          <div className="space-y-1">
            {ENGINEERS.filter(e => e.status !== 'idle').map(eng => (
              <div key={eng.id} className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer opacity-100">
                <div className="relative">
                  <div className="w-8 h-8 rounded bg-[#FF6B00]/20 flex items-center justify-center text-xs text-[#FF6B00] font-bold">{eng.avatar}</div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-black ${eng.status === 'coding' ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{eng.name}</div>
                  <div className="text-[10px] text-slate-500">{eng.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-3">Offline — 1</div>
          <div className="space-y-1">
            {ENGINEERS.filter(e => e.status === 'idle').map(eng => (
              <div key={eng.id} className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer opacity-50">
                <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center text-xs text-white font-bold grayscale">{eng.avatar}</div>
                <div>
                  <div className="text-sm font-bold text-white">{eng.name}</div>
                  <div className="text-[10px] text-slate-500">Away</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

// ==========================================
// EXISTING OVERVIEW COMPONENT (Refactored)
// ==========================================

const DashboardOverview = ({ viewMode, setViewMode }: any) => {
  return (
    <>
      {/* HUD Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Projects" value="12" sub="+2 this week" icon={<Activity className="text-[#FF6B00]" />} />
        <StatCard label="Deployments (24h)" value="148" sub="98.6% Success Rate" icon={<Server className="text-emerald-500" />} />
        <StatCard label="Open Incidents" value="1" sub="Sev-3 (Low)" icon={<AlertTriangle className="text-yellow-500" />} />
        <StatCard label="Revenue MTD" value="$42.5k" sub="105% of Goal" icon={<Zap className="text-white" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Squad/Project Matrix */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Active Squads */}
          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Users size={16} className="text-[#FF6B00]" /> Active Squads
              </h3>
              <div className="flex gap-2">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-slate-600'}`}><LayoutGrid size={14} /></button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-slate-600'}`}><List size={14} /></button>
              </div>
            </div>
            
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
              {SQUADS.map(squad => (
                <div key={squad.id} className="bg-black border border-white/10 p-4 rounded-lg hover:border-[#FF6B00]/50 transition-colors group">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] text-slate-500 font-bold">{squad.id}</span>
                    {squad.status === 'nominal' 
                      ? <CheckCircle size={14} className="text-emerald-500" />
                      : <AlertTriangle size={14} className="text-yellow-500 animate-pulse" />
                    }
                  </div>
                  <div className="text-white font-bold mb-1 truncate">{squad.project}</div>
                  <div className="text-xs text-slate-500 mb-4">Lead: {squad.lead}</div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px]">
                      <span>Load</span>
                      <span className={squad.cpu > 80 ? 'text-red-500' : 'text-emerald-500'}>{squad.cpu}%</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${squad.cpu > 80 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${squad.cpu}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-[10px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-white flex items-center gap-1">
                      <Terminal size={10} /> Shell
                    </button>
                    <button className="text-[10px] text-[#FF6B00] flex items-center gap-1">
                      View <Eye size={10} />
                    </button>
                  </div>
                </div>
              ))}
              
              {/* New Project Placeholder */}
              <button className="border border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center p-4 hover:bg-white/5 transition-colors text-slate-600 hover:text-white group">
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:bg-[#FF6B00] group-hover:text-black transition-colors">
                  <Play size={18} />
                </div>
                <span className="text-xs font-bold uppercase">Initialize Squad</span>
              </button>
            </div>
          </div>

          {/* Engineer Roster */}
          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden flex-1">
             <div className="p-4 border-b border-white/10 bg-white/5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Cpu size={16} className="text-[#FF6B00]" /> Engineering Unit Status
                </h3>
             </div>
             <table className="w-full text-left text-xs">
                <thead className="text-slate-500 border-b border-white/5">
                  <tr>
                    <th className="p-3 pl-4">Engineer</th>
                    <th className="p-3">Current Task</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right pr-4">Efficiency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {ENGINEERS.map((eng, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 pl-4">
                        <div className="font-bold text-white">{eng.name}</div>
                        <div className="text-[10px] text-slate-500">{eng.role}</div>
                      </td>
                      <td className="p-3 font-mono text-slate-400">{eng.task}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          eng.status === 'coding' ? 'bg-blue-500/20 text-blue-400' :
                          eng.status === 'debugging' ? 'bg-red-500/20 text-red-400' :
                          'bg-slate-700 text-slate-400'
                        }`}>
                          {eng.status}
                        </span>
                      </td>
                      <td className="p-3 text-right pr-4 text-emerald-500 font-mono">{eng.efficiency}%</td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        </div>

        {/* Live Feed / Terminal */}
        <div className="bg-black border border-white/10 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity size={16} className="text-[#FF6B00]" /> Live Telemetry
            </h3>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500/20"></div>
              <div className="w-2 h-2 rounded-full bg-green-500/20"></div>
            </div>
          </div>
          
          <div className="flex-1 p-4 font-mono text-[10px] overflow-y-auto space-y-3 custom-scrollbar">
            {LIVE_LOGS.map(log => (
              <div key={log.id} className="flex gap-3">
                <span className="text-slate-600 shrink-0">{log.time}</span>
                <span className={`${
                  log.type === 'error' ? 'text-red-500' : 
                  log.type === 'warning' ? 'text-yellow-500' : 
                  log.type === 'success' ? 'text-emerald-500' : 
                  'text-slate-300'
                }`}>
                  {log.msg}
                </span>
              </div>
            ))}
            <div className="animate-pulse text-[#FF6B00] flex gap-2">
              <span>_</span>
            </div>
          </div>

          <div className="p-3 bg-[#111] border-t border-white/10">
            <input 
              type="text" 
              placeholder="Enter system command..." 
              className="w-full bg-black border border-white/10 rounded p-2 text-xs text-white focus:border-[#FF6B00] outline-none font-mono"
            />
          </div>
        </div>
      </div>
    </>
  );
};

// --- Component Helpers ---

const NavButton = ({ icon, label, active, onClick, badge }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-bold transition-all relative ${
      active ? 'bg-[#FF6B00] text-white' : 'text-slate-500 hover:bg-white/5 hover:text-white'
    }`}
  >
    {React.cloneElement(icon, { size: 16 })}
    <span className="flex-1 text-left">{label}</span>
    {badge && (
      <span className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] text-white">
        {badge}
      </span>
    )}
  </button>
);

const PlusButton = () => (
  <button className="text-slate-600 hover:text-white transition-colors">
    <Plus size={12} />
  </button>
);

const ResourceBar = ({ label, percent, color }: any) => (
  <div>
    <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 mb-1">
      <span>{label}</span>
      <span>{percent}%</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${percent}%` }}></div>
    </div>
  </div>
);

const StatCard = ({ label, value, sub, icon }: any) => (
  <div className="bg-[#0A0A0A] border border-white/10 p-4 rounded-xl">
    <div className="flex justify-between items-start mb-2">
      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">{label}</span>
      {icon}
    </div>
    <div className="text-2xl font-black text-white">{value}</div>
    <div className="text-[10px] text-emerald-500 mt-1">{sub}</div>
  </div>
);

const root = createRoot(document.getElementById('root')!);
root.render(<InternalOps />);
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Mail, Users, Map, Database, LogOut, Lock, BookOpen, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import logoImg from '../assets/logo.png'; 

export default function Sidebar() {
  const location = useLocation();
  const { user, role, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme(); 
  
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  // 1. Estado inicial como 'true' para começar sempre recolhida
  const [isCollapsed, setIsCollapsed] = useState(true); 

  // Modifique esta parte no topo do componente Sidebar
  const items = [
    { path: '/', label: 'Minhas Anotações', icon: <BookOpen size={20} /> },
    { path: '/ibge', label: 'Base IBGE', icon: <Database size={20} /> },
  ];

  const handleLogout = () => {
    setIsLoggingOut(true); 
    setTimeout(() => { signOut(); }, 1500);
  };

  return (
    <>
      <style>{`
        @keyframes disconnect-progress { 0% { width: 0%; opacity: 1; } 80% { width: 100%; opacity: 1; } 100% { width: 100%; opacity: 0; } }
        .animate-disconnect { animation: disconnect-progress 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        @keyframes led-continuous { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .animate-led-continuous { animation: led-continuous 2s linear infinite; }
      `}</style>

      {/* ANIMAÇÃO DE SAÍDA */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[9999] bg-[#09090b] flex flex-col items-center justify-center animate-in fade-in duration-500">
          <div className="absolute inset-0 opacity-[0.04] mix-blend-screen pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/20 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>

          <div className="relative mb-6 group animate-in zoom-in-50 duration-500">
             <div className="absolute inset-0 bg-red-500 blur-2xl opacity-30 animate-pulse"></div>
             <div className="relative z-10 bg-white/5 border border-white/10 p-5 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.3)]">
               <Lock size={48} className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
             </div>
          </div>

          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 tracking-widest uppercase mb-2 drop-shadow-md animate-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
            Sessão Encerrada
          </h2>
          <p style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-red-500 text-[10px] mb-10 tracking-widest uppercase drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-in slide-in-from-bottom-2 duration-500 delay-200 fill-mode-both">
            Desconectando Workspace...
          </p>

          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden relative">
             <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_15px_#ef4444] animate-disconnect"></div>
          </div>
        </div>
      )}

      {/* BARRA LATERAL */}
      <div 
        // 2. Controlar expansão com o cursor (onMouseEnter e onMouseLeave)
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
        className={`bg-[#09090b]/90 backdrop-blur-xl border-r border-white/5 flex flex-col justify-between p-6 z-50 shadow-2xl h-screen transition-all duration-500 ease-in-out relative shrink-0
        ${isCollapsed ? 'w-24 px-4' : 'w-72'}`}
      >
        
        <div>
          <div className={`mb-10 flex flex-col transition-all duration-500 ${isCollapsed ? 'items-center mt-2' : 'items-center md:items-start px-2'}`}>
            
            <Link to="/" className={`relative group cursor-pointer transition-all duration-500 hover:scale-105 drop-shadow-2xl block z-50 
              ${isCollapsed ? 'w-16 mb-6' : 'w-48 mb-2'}`}>
                
               <div className="absolute -inset-4 rounded-full bg-[#5C2EE9] blur-[30px] opacity-0 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none"></div>
               
               <img 
                 src={logoImg} 
                 alt="Consolida Logo" 
                 className={`w-full h-auto object-contain brightness-0 invert opacity-90 transition-opacity duration-500 relative z-10 ${!isCollapsed && 'group-hover:opacity-20'}`} 
               />

               {!isCollapsed && (
                 <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden pointer-events-none" style={{ WebkitMaskImage: `url(${logoImg})`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'left center' }}>
                   <div className="absolute top-0 bottom-0 left-0 flex w-[200%] animate-led-continuous">
                      <div className="w-1/2 relative h-full">
                         <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-transparent via-[#b39afe] to-transparent skew-x-[-15deg] shadow-[0_0_30px_#9d7aff]"></div>
                      </div>
                      <div className="w-1/2 relative h-full">
                         <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-transparent via-[#b39afe] to-transparent skew-x-[-15deg] shadow-[0_0_30px_#9d7aff]"></div>
                      </div>
                   </div>
                   <img src={logoImg} alt="" className="relative z-10 w-full h-auto object-contain brightness-0 invert mix-blend-overlay opacity-80" />
                 </div>
               )}
            </Link>

            <div className={`flex items-center gap-2 overflow-hidden transition-all duration-500 ${isCollapsed ? 'justify-center opacity-0 w-0 h-0' : 'px-1 opacity-100 h-auto'}`}>
              <div className="h-1.5 w-1.5 rounded-full bg-[#5C2EE9] animate-pulse shadow-[0_0_10px_#5C2EE9]"></div>
              <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase whitespace-nowrap">Workspace</p>
            </div>
          </div>

          <nav className="space-y-3">
            {items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}
                  className={`relative flex items-center px-4 py-3.5 rounded-xl text-xs font-bold uppercase transition-all duration-300 group overflow-hidden 
                  ${isCollapsed ? 'justify-center' : 'gap-4'}
                  ${isActive ? 'text-white bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(92,46,233,0.15)]' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300 border border-transparent'}`}>
                  
                  <div className={`absolute inset-0 bg-gradient-to-r from-[#5C2EE9]/20 to-transparent opacity-0 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'group-hover:opacity-50'}`}></div>
                  
                  <span className={`relative z-10 transition-colors shrink-0 ${isActive ? 'text-[#5C2EE9]' : 'text-gray-500 group-hover:text-white'}`} title={isCollapsed ? item.label : ""}>
                    {item.icon}
                  </span>
                  
                  {/* 3. Remoção do "hidden" para animar suavemente a largura e opacidade do texto */}
                  <span className={`relative z-10 tracking-wide whitespace-nowrap overflow-hidden transition-all duration-500 ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'}`}>
                    {item.label}
                  </span>
                  
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-[#5C2EE9] rounded-r-full shadow-[0_0_10px_#5C2EE9]"></div>}
                </Link>
              )
            })}
          </nav>
        </div>
        
        <div className="flex flex-col gap-2">
           {/* GESTÃO DE EQUIPE (Apenas Admins) */}
           {role === 'admin' && (
              <Link to="/team" className={`relative flex items-center px-4 py-3.5 rounded-xl text-xs font-bold uppercase transition-all duration-300 group overflow-hidden mb-2 border border-primary/20 bg-primary/5
                  ${isCollapsed ? 'justify-center' : 'gap-4'}
                  ${location.pathname === '/team' ? 'text-white bg-primary/20 shadow-[0_0_20px_rgba(92,46,233,0.3)]' : 'text-gray-400 hover:bg-primary/10 hover:text-white'}`}>
                  
                  <span className={`relative z-10 transition-colors shrink-0 ${location.pathname === '/team' ? 'text-primary' : 'text-primary/70 group-hover:text-primary'}`} title={isCollapsed ? "Gestão Equipe" : ""}>
                    <Users size={20} />
                  </span>
                  
                  <span className={`relative z-10 tracking-wide whitespace-nowrap overflow-hidden transition-all duration-500 ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'}`}>
                    Gestão Equipe
                  </span>
              </Link>
           )}

           <div className="border-t border-white/10 pt-4 flex flex-col items-center">
              
              {/* DADOS DO USUÁRIO */}
              <div className={`flex items-center w-full mb-4 overflow-hidden transition-all duration-500 ${isCollapsed ? 'justify-center' : 'gap-3 px-2'}`}>
                 <div className="w-8 h-8 rounded-full border border-white/10 shrink-0 bg-[#5C2EE9]/20 flex items-center justify-center text-[#5C2EE9] font-bold text-xs uppercase transition-transform duration-500 hover:scale-110">
                    {user?.email?.charAt(0) || 'U'}
                 </div>
                 
                 <div className={`overflow-hidden transition-all duration-500 ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[150px] opacity-100'}`}>
                     <p className="text-xs font-bold text-white truncate w-full">{user?.email?.split('@')[0]}</p>
                     <p className="text-[10px] text-gray-500 truncate w-full">{user?.email}</p>
                 </div>
              </div>

              {/* BOTÃO DE SAIR */}
              <button 
                onClick={handleLogout} 
                title={isCollapsed ? "Sair do Sistema" : ""}
                className={`flex items-center justify-center text-red-500/80 hover:text-red-400 text-xs font-bold uppercase py-3 rounded-xl hover:bg-red-500/10 transition-all group overflow-hidden
                ${isCollapsed ? 'w-10 px-0' : 'w-full px-4 gap-3'}`}
               >
                 <LogOut size={18} className="group-hover:scale-110 transition-transform shrink-0"/> 
                 <span className={`whitespace-nowrap overflow-hidden transition-all duration-500 ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[150px] opacity-100'}`}>
                   Sair do Sistema
                 </span>
              </button>
           </div>
        </div>
      </div>
    </>
  );
}

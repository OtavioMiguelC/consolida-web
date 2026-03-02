import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert, UserCheck, Shield, Ban } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TeamManagement() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    const { data, error } = await supabase.from('profiles').select('*').order('email');
    if (data) setProfiles(data);
  };

  const updateRole = async (userId, newRole) => {
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    if (!error) {
      toast.success('Cargo atualizado com sucesso!', { style: { background: '#121212', color: '#fff', border: '1px solid #10b981' }});
      fetchProfiles();
    }
  };

  const toggleBan = async (userId, currentStatus) => {
    const isBanning = !currentStatus;
    const confirmMessage = isBanning 
      ? "Tem certeza que deseja BANIR este usuário? Ele perderá o acesso ao sistema." 
      : "Deseja restaurar o acesso deste usuário?";
      
    if (!window.confirm(confirmMessage)) return;

    const { error } = await supabase.from('profiles').update({ is_banned: isBanning }).eq('id', userId);
    
    if (!error) {
      toast.success(isBanning ? 'Usuário banido do sistema.' : 'Acesso restaurado.', {
        icon: isBanning ? '🚫' : '✅',
        style: { background: '#121212', color: '#fff', border: isBanning ? '1px solid #ef4444' : '1px solid #10b981' }
      });
      fetchProfiles();
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative z-10 animate-in fade-in duration-500">
      
      {/* CABEÇALHO */}
      <header>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Gestão de Equipe</h1>
        <p className="text-gray-400 mt-2 font-light">Valide acessos, mude cargos e gerencie a segurança do sistema.</p>
      </header>

      {/* CONTAINER GLASSMORPHISM */}
      <div className="relative bg-[#121212]/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
        
        {/* Luzes de fundo */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#5C2EE9]/10 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#09090b]/40 border-b border-white/10">
              <tr>
                <th className="px-6 py-5 font-bold text-gray-400 uppercase tracking-wider text-xs">Usuário (E-mail)</th>
                <th className="px-6 py-5 font-bold text-gray-400 uppercase tracking-wider text-xs">Cargo</th>
                <th className="px-6 py-5 font-bold text-gray-400 uppercase tracking-wider text-xs text-center">Alterar Cargo</th>
                <th className="px-6 py-5 font-bold text-gray-400 uppercase tracking-wider text-xs text-center">Status / Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-transparent">
              {profiles.map(profile => {
                const isMe = profile.id === user?.id;

                return (
                  <tr key={profile.id} className={`transition-colors hover:bg-white/5 ${profile.is_banned ? 'opacity-40 grayscale' : ''}`}>
                    
                    {/* EMAIL */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg
                          ${profile.role === 'admin' ? 'bg-[#5C2EE9] shadow-[#5C2EE9]/20' : 'bg-gray-600 shadow-gray-600/20'}
                          ${profile.is_banned ? 'bg-red-500 shadow-red-500/20' : ''}
                        `}>
                          {profile.email.charAt(0).toUpperCase()}
                        </div>
                        <span className={`font-medium ${profile.is_banned ? 'text-red-400 line-through' : 'text-gray-200'}`}>
                          {profile.email} {isMe && <span className="ml-2 text-[10px] bg-[#5C2EE9]/20 text-[#5C2EE9] px-2 py-0.5 rounded-full border border-[#5C2EE9]/30">Você</span>}
                        </span>
                      </div>
                    </td>

                    {/* CARGO ATUAL */}
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit
                        ${profile.role === 'admin' ? 'bg-[#5C2EE9]/20 text-[#5C2EE9] border border-[#5C2EE9]/30' : 'bg-gray-500/20 text-gray-300 border border-transparent'}`}>
                        {profile.role === 'admin' ? <Shield size={12}/> : <UserCheck size={12}/>}
                        {profile.role.toUpperCase()}
                      </span>
                    </td>

                    {/* ALTERAR CARGO */}
                    <td className="px-6 py-4 text-center">
                      <select 
                        value={profile.role}
                        onChange={(e) => updateRole(profile.id, e.target.value)}
                        disabled={isMe || profile.is_banned}
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        className="bg-[#09090b]/50 border border-white/10 rounded-xl px-3 py-2 text-[13px] text-gray-200 outline-none focus:border-[#5C2EE9] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors hover:border-white/30"
                      >
                        <option value="user">Usuário</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </td>

                    {/* BOTÃO DE BANIR */}
                    <td className="px-6 py-4 flex justify-center items-center">
                      <button 
                        onClick={() => toggleBan(profile.id, profile.is_banned)}
                        disabled={isMe}
                        title={profile.is_banned ? "Restaurar Acesso" : "Banir Usuário"}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg
                          ${profile.is_banned 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white shadow-emerald-500/10' 
                            : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white shadow-red-500/10'
                          }
                        `}
                      >
                        {profile.is_banned ? (
                          <><UserCheck size={16} /> Restaurar</>
                        ) : (
                          <><Ban size={16} /> Banir</>
                        )}
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Search, Copy, RefreshCw, Database, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase'; 

const normalizar = (texto) => {
  if (!texto) return "";
  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/['.-]/g, " ")          
    .toUpperCase()
    .trim();
};

export default function Ibge() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setIsLoading(true);
    try {
      const { data: ibgeData, error } = await supabase
        .from('ibge_municipios')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;
      setData(ibgeData || []);
    } catch (error) {
      console.error("Erro ao carregar banco:", error);
      toast.error('Erro ao carregar base do banco.', { style: { background: '#121212', color: '#fff' }});
    } finally {
      setIsLoading(false);
    }
  };

  const sincronizarAPI = async () => {
    setIsSyncing(true);
    const toastId = toast.loading('Baixando dados do IBGE...', { style: { background: '#121212', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }});

    try {
      const res = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/municipios");
      if (!res.ok) throw new Error("Falha ao comunicar com a API do IBGE.");
      
      const municipiosApi = await res.json();
      toast.loading('Processando e salvando no banco...', { id: toastId });

      const dadosFormatados = municipiosApi.map(m => {
        const uf = m.microrregiao?.mesorregiao?.UF?.sigla || "";
        return {
          id: m.id,
          nome: String(m.nome || "").toUpperCase(),
          uf: uf.toUpperCase(),
          nome_norm: normalizar(m.nome)
        };
      }).filter(m => m.uf !== ""); 

      const BATCH_SIZE = 1000;
      for (let i = 0; i < dadosFormatados.length; i += BATCH_SIZE) {
        const lote = dadosFormatados.slice(i, i + BATCH_SIZE);
        const { error } = await supabase.from('ibge_municipios').upsert(lote, { onConflict: 'id' });
        if (error) throw error;
      }

      toast.success('Base sincronizada com sucesso!', { id: toastId, style: { border: '1px solid #10b981', background: '#121212', color: '#fff' }});
      
      await carregarDados();

    } catch (error) {
      console.error("Erro na Sincronização:", error);
      toast.error('Erro ao sincronizar com IBGE.', { id: toastId, style: { border: '1px solid #ef4444', background: '#121212', color: '#fff' }});
    } finally {
      setIsSyncing(false);
    }
  };

  const copiar = (id) => {
      navigator.clipboard.writeText(id);
      toast.success(`Código ${id} copiado!`, { style: { background: '#121212', color: '#fff', border: '1px solid #10b981' } });
  }

  const termoBusca = normalizar(search);
  const filtered = data.filter(i => 
    i.nome_norm?.includes(termoBusca) || 
    i.uf?.includes(termoBusca) || 
    String(i.id).includes(termoBusca)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative z-10 animate-in fade-in duration-500">
      
      {/* CSS Customizado injetado apenas para esta tela */}
      <style>{`
        .glass-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .glass-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .glass-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(92, 46, 233, 0.3);
          border-radius: 10px;
        }
        .glass-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(92, 46, 233, 0.8);
        }
      `}</style>

      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
         <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Base IBGE</h1>
            <p className="text-gray-400 mt-2 font-light">Consulta rápida de códigos de municípios integrados ao Supabase.</p>
         </div>
         <button 
            onClick={sincronizarAPI}
            disabled={isSyncing}
            className="text-xs font-bold text-[#5C2EE9] bg-[#5C2EE9]/10 border border-[#5C2EE9]/20 hover:bg-[#5C2EE9]/20 hover:border-[#5C2EE9]/50 px-5 py-3 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(92,46,233,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
         >
            <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} /> 
            {isSyncing ? "Sincronizando..." : "Sincronizar API Gov"}
         </button>
      </div>

      <div className="relative group">
         <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5C2EE9] to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
         <div className="relative flex items-center bg-[#121212]/60 backdrop-blur-xl rounded-2xl border border-white/10 p-2 shadow-xl">
            <Search className="text-gray-400 ml-4" size={20}/>
            <input 
                value={search} onChange={e=>setSearch(e.target.value)}
                className="w-full bg-transparent p-3 text-white outline-none placeholder-gray-500 ml-2 text-lg font-light" 
                placeholder="Pesquisar Cidade, UF ou Código IBGE..."
            />
         </div>
      </div>

      <div className="relative bg-[#121212]/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] flex flex-col">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] pointer-events-none"></div>

         <div className="relative z-20 bg-[#09090b]/40 backdrop-blur-md border-b border-white/10 pr-[8px]">
             <table className="w-full text-left text-sm table-fixed">
                <thead className="text-gray-400 text-xs uppercase tracking-wider">
                    <tr>
                        <th className="p-6 font-semibold w-[25%]"><div className="flex items-center gap-2"><Database size={14} className="text-[#5C2EE9]"/> Código</div></th>
                        <th className="p-6 font-semibold w-[45%]">Município</th>
                        <th className="p-6 font-semibold w-[15%]">UF</th>
                        <th className="p-6 font-semibold text-center w-[15%]">Ação</th>
                    </tr>
                </thead>
             </table>
         </div>

         <div className="relative z-10 overflow-y-auto max-h-[500px] glass-scrollbar">
             <table className="w-full text-left text-sm table-fixed">
                <tbody className="divide-y divide-white/5">
                    {isLoading ? (
                        <tr><td colSpan="4" className="p-20 text-center text-[#5C2EE9]"><Loader2 className="animate-spin mx-auto mb-4" size={32}/><span className="text-gray-400 font-mono text-xs uppercase tracking-widest">Carregando Banco de Dados...</span></td></tr>
                    ) : filtered.length === 0 ? (
                        <tr><td colSpan="4" className="p-10 text-center text-gray-500">Nenhum município encontrado. Clique em Sincronizar se a base estiver vazia.</td></tr>
                    ) : (
                        filtered.map(item => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-6 text-emerald-400 font-bold text-[15px] w-[25%]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{item.id}</td>
                                <td className="p-6 font-medium text-gray-200 w-[45%] truncate" title={item.nome}>{item.nome}</td>
                                <td className="p-6 text-gray-400 w-[15%]">
                                    <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-xs">{item.uf}</span>
                                </td>
                                <td className="p-6 text-center w-[15%]">
                                    <button onClick={()=>copiar(item.id)} className="p-2.5 bg-white/5 border border-white/10 hover:bg-[#5C2EE9] hover:border-[#5C2EE9] rounded-lg text-gray-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-lg inline-flex" title="Copiar">
                                        <Copy size={16}/>
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
             </table>
         </div>
      </div>
    </div>
  );
}
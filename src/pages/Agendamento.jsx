import React, { useState, useRef, useEffect } from 'react';
import { Database, Play, Terminal, Loader2 } from 'lucide-react';

export default function Agendamento() {
  const [log, setLog] = useState(['> Sistema pronto...', '> Aguardando arquivos...']);
  const [baseFile, setBaseFile] = useState(null);
  const [modeloFile, setModeloFile] = useState(null);
  const [textoNFs, setTextoNFs] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Referência para rolar o console automaticamente para baixo
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  const run = async () => {
    if (!baseFile) {
      setLog(prev => [...prev, '> ERRO: Selecione a Base de Dados.']);
      return;
    }
    if (!modeloFile) {
      setLog(prev => [...prev, '> ERRO: Selecione o Modelo de Ocorrência.']);
      return;
    }
    if (!textoNFs.trim()) {
      setLog(prev => [...prev, '> ERRO: Cole as NFs e Datas para processamento.']);
      return;
    }

    setIsLoading(true);
    setLog(prev => [...prev, '> Iniciando Agendamento...', '> Carregando base e enviando para o servidor...']);

    try {
      const formData = new FormData();
      formData.append('base', baseFile);
      formData.append('modelo', modeloFile);
      formData.append('texto_input', textoNFs);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/agendamento/processar`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.detail || 'Falha no processamento da API.');
      }

      setLog(prev => [...prev, '> Processando lote na nuvem...', '> Gerando arquivo final...']);

      // Baixar o Excel retornado pelo Backend
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const ts = new Date().getTime();
      a.download = `Agendamento_CONSOLIDA_${ts}.xlsx`;
      
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setLog(prev => [...prev, '> Concluído com sucesso. Arquivo transferido!']);
    } catch (error) {
      setLog(prev => [...prev, `> ERRO CRÍTICO: ${error.message}`]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-white">Agendamento TMS</h1>
            <p className="text-gray-400">Processamento em lote via Python (Servidor Nuvem).</p>
          </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna de Configuração */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#18181b]/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl">
                <h3 className="flex items-center gap-2 font-bold mb-6 text-[#5C2EE9]">
                    <Database size={18}/> Arquivos de Entrada
                </h3>
                <div className="space-y-4">
                    <FileInput 
                        label="Base de Dados (Excel/CSV)" 
                        accept=".xlsx, .xls, .csv" 
                        onChange={(e) => setBaseFile(e.target.files[0])} 
                    />
                    <FileInput 
                        label="Modelo de Ocorrência" 
                        accept=".xlsx, .xls" 
                        onChange={(e) => setModeloFile(e.target.files[0])} 
                    />
                </div>
            </div>
            
            <button 
                onClick={run} 
                disabled={isLoading}
                className="w-full group relative overflow-hidden bg-[#5C2EE9] hover:bg-[#4c25c9] disabled:bg-[#331c77] disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(92,46,233,0.3)] hover:shadow-[0_0_30px_rgba(92,46,233,0.5)]"
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} fill="currentColor"/>} 
                    {isLoading ? 'PROCESSANDO...' : 'Iniciar Processamento'}
                </span>
            </button>
        </div>

        {/* Coluna de Input e Log */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex-1 bg-[#18181b]/60 backdrop-blur-md p-1 rounded-2xl border border-white/5">
                 <textarea 
                    value={textoNFs}
                    onChange={(e) => setTextoNFs(e.target.value)}
                    placeholder="Cole aqui: NF + DATA (ex: 12345 25/10/2023)" 
                    className="w-full h-40 bg-transparent text-gray-300 p-4 outline-none resize-none font-mono text-sm placeholder-gray-600 focus:bg-white/5 rounded-xl transition-colors custom-scrollbar"
                 ></textarea>
                 <style>{`
                    .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(92, 46, 233, 0.5); }
                `}</style>
            </div>

            <div className="flex-1 bg-[#09090b] border border-white/10 rounded-2xl p-4 font-mono text-xs shadow-inner overflow-hidden flex flex-col min-h-[150px]">
                 <div className="flex items-center gap-2 text-gray-500 mb-2 border-b border-white/5 pb-2 shrink-0">
                    <Terminal size={14}/>
                    <span>Console Output</span>
                 </div>
                 <div className="overflow-y-auto space-y-1 text-green-500 pr-2 custom-scrollbar">
                    {log.map((l, i) => (
                        <div key={i} className={l.includes('ERRO') ? 'text-red-500' : 'animate-in fade-in'}>
                            {l}
                        </div>
                    ))}
                    <div ref={logEndRef} />
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
}

const FileInput = ({ label, onChange, accept }) => (
    <div className="relative group">
        <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block group-hover:text-[#5C2EE9] transition-colors">{label}</label>
        <input 
          type="file" 
          onChange={onChange}
          accept={accept}
          className="block w-full text-xs text-gray-400 
          file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 
          file:text-xs file:font-bold file:bg-[#27272a] file:text-white 
          hover:file:bg-[#5C2EE9] hover:file:text-white transition-all cursor-pointer
          bg-[#09090b]/50 border border-white/10 rounded-xl p-1"
        />
    </div>
);

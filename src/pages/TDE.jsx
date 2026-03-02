import React, { useState } from 'react';
import { FileSpreadsheet, Settings, Play, LayoutList } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TDE() { 
  const [template, setTemplate] = useState(null);
  const [limite, setLimite] = useState('500');
  const [dados, setDados] = useState('');

  const handleProcessar = () => {
    if (!template) {
      toast.error('Selecione o modelo do Excel primeiro.', { style: { background: '#121212', color: '#fff', border: '1px solid #ef4444' } });
      return;
    }
    if (!dados.trim()) {
      toast.error('Cole os dados para processamento.', { style: { background: '#121212', color: '#fff', border: '1px solid #ef4444' } });
      return;
    }

    toast.success('Arquivos TDE sendo gerados em background!', { style: { background: '#121212', color: '#fff', border: '1px solid #10b981' } });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative z-10 animate-in fade-in duration-500">
      
      {/* Cabeçalho */}
      <div>
         <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Cadastro TDE (Pessoas)</h1>
         <p className="text-gray-400 mt-2 font-light">Geração de arquivos em lote separados por valor, a partir de um modelo original.</p>
      </div>

      {/* Container Principal Glassmorphism (Sempre Dark) */}
      <div className="relative bg-[#121212]/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
         {/* Luzes de fundo */}
         <div className="absolute -top-20 -right-20 w-72 h-72 bg-emerald-500/10 blur-[100px] pointer-events-none"></div>
         <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#5C2EE9]/10 blur-[100px] pointer-events-none"></div>

         <div className="relative z-10 space-y-6">
            
            {/* Linha 1: Configurações (Arquivo e Limite) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                {/* Seleção do Arquivo de Template */}
                <div className="md:col-span-2">
                    <label className="text-[10px] text-gray-400 font-bold uppercase mb-2 flex items-center gap-2 ml-1">
                        <span className="text-[#5C2EE9]"><FileSpreadsheet size={16}/></span> Modelo de TDE (Excel)
                    </label>
                    <label className="flex items-center gap-3 bg-[#09090b]/40 border border-white/10 hover:border-emerald-500/50 hover:bg-[#09090b]/80 px-5 py-3.5 rounded-xl text-sm font-medium cursor-pointer transition-all text-gray-400 hover:text-white group w-full">
                        <FileSpreadsheet size={18} className="text-emerald-500 group-hover:scale-110 transition-transform"/> 
                        <span className="truncate" style={{ fontFamily: template ? "'JetBrains Mono', monospace" : "inherit" }}>
                            {template ? template.name : "Selecione pessoa (1).xlsx..."}
                        </span>
                        <input 
                            type="file" 
                            accept=".xlsx, .xls"
                            className="hidden" 
                            onChange={e => setTemplate(e.target.files[0])}
                        />
                    </label>
                </div>

                {/* Limite de Linhas */}
                <div>
                    <GlassInput 
                        icon={<Settings size={16}/>} 
                        label="Linhas por arquivo" 
                        type="number" 
                        val={limite} 
                        onChange={e => setLimite(e.target.value)} 
                    />
                </div>
            </div>

            <hr className="border-white/5" />

            {/* Linha 2: Área de Texto (Dados) */}
            <div>
                <GlassTextArea 
                    icon={<LayoutList size={16}/>}
                    label="Cole os dados (CNPJ + Tipo + Razão Social + Valor)"
                    val={dados}
                    onChange={e => setDados(e.target.value)}
                    placeholder="00.000.000/0001-00    J    EMPRESA EXEMPLO LTDA    R$ 1.500,00&#10;11.111.111/0001-11    J    OUTRA EMPRESA S.A.      R$ 1.500,00"
                />
            </div>

         </div>
      </div>

      {/* Botão de Ação Inferior */}
      <div className="sticky bottom-8 z-50 animate-in slide-in-from-bottom-4 duration-500">
        <button 
            onClick={handleProcessar} 
            className="w-full bg-gradient-to-r from-[#5C2EE9] to-blue-600 hover:from-[#4b24c4] hover:to-blue-500 py-5 rounded-2xl font-black uppercase text-lg text-white shadow-[0_10px_40px_rgba(92,46,233,0.4)] flex justify-center gap-3 items-center transition-all hover:-translate-y-1"
        >
            <Play size={24} className="fill-white" /> Processar Arquivos TDE
        </button>
      </div>

    </div>
  );
}

// Componentes UI Reaproveitáveis (Travados no visual Dark)
const GlassInput = ({ label, type = "text", val, onChange, icon }) => (
    <div className="w-full">
        <label className="text-[10px] text-gray-400 font-bold uppercase mb-2 flex items-center gap-2 ml-1">
            {icon && <span className="text-[#5C2EE9]">{icon}</span>} {label}
        </label>
        <input 
            type={type} value={val || ''} onChange={onChange} 
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
            className="w-full bg-[#09090b]/40 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-emerald-400 outline-none focus:border-[#5C2EE9] focus:bg-[#09090b]/80 focus:shadow-[0_0_15px_rgba(92,46,233,0.2)] transition-all placeholder-gray-600" 
        />
    </div>
);

const GlassTextArea = ({ label, val, onChange, icon, placeholder }) => (
    <div className="w-full h-full">
        <label className="text-[10px] text-gray-400 font-bold uppercase mb-2 flex items-center gap-2 ml-1">
            {icon && <span className="text-[#5C2EE9]">{icon}</span>} {label}
        </label>
        <textarea 
            value={val || ''} 
            onChange={onChange}
            placeholder={placeholder}
            rows={10}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
            className="w-full bg-[#09090b]/40 border border-white/10 rounded-xl px-4 py-4 text-[13px] text-emerald-400 outline-none focus:border-[#5C2EE9] focus:bg-[#09090b]/80 focus:shadow-[0_0_15px_rgba(92,46,233,0.2)] transition-all placeholder-gray-600 resize-y custom-scrollbar" 
        />
        <style>{`
            .custom-scrollbar::-webkit-scrollbar { width: 8px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(92, 46, 233, 0.5); }
        `}</style>
    </div>
);
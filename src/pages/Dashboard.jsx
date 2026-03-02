import React, { useState } from 'react';
import { Clock, MapPinned, Route, RefreshCw, Calendar, FileSpreadsheet, ChevronDown, UploadCloud, Settings2, Play, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [expandedId, setExpandedId] = useState(null);

  // Estados: Ferramenta "Criar Região"
  const [regiaoOpcao, setRegiaoOpcao] = useState('1');
  const [regiaoNome, setRegiaoNome] = useState('');
  const [regiaoCnpj, setRegiaoCnpj] = useState('');
  const [regiaoBase, setRegiaoBase] = useState(null);
  const [regiaoModelo, setRegiaoModelo] = useState(null);

  // Estados: Ferramenta "Gerar Rotas"
  const [rotasCnpj, setRotasCnpj] = useState('');
  const [rotasNome, setRotasNome] = useState('');
  const [rotasDesc, setRotasDesc] = useState('');
  const [rotasIbge, setRotasIbge] = useState('');
  const [rotasModelo, setRotasModelo] = useState(null);

  // Estados: Ferramenta "Preencher Prazos"
  const [prazosDestino, setPrazosDestino] = useState(null);
  const [prazosBase, setPrazosBase] = useState(null);

  // Estados: Ferramenta "Preencher IBGE"
  const [ibgeFile, setIbgeFile] = useState(null);

  // ESTADOS DE LOADING (Animação dos Botões)
  const [loadingIbge, setLoadingIbge] = useState(false);
  const [loadingPrazos, setLoadingPrazos] = useState(false);
  const [loadingRegiao, setLoadingRegiao] = useState(false);
  const [loadingRotas, setLoadingRotas] = useState(false);
  const [loadingSN, setLoadingSN] = useState(false);
  const [loadingSTQQS, setLoadingSTQQS] = useState(false);

  const toggleCard = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // 1. Ferramentas Simples
  const processSingleFile = async (e, endpoint, downloadName, setLoading) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const toastId = toast.loading(`A processar ${file.name}...`, { style: { background: '#121212', color: '#fff' }});
    
    try {
      const formData = new FormData();
      formData.append('arquivo', file);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ferramentas/${endpoint}`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Erro na resposta da API');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Ficheiro processado com sucesso!', { id: toastId, style: { border: '1px solid #10b981', background: '#121212', color: '#fff' }});
    } catch (error) {
      toast.error('Erro ao processar ficheiro.', { id: toastId, style: { border: '1px solid #ef4444', background: '#121212', color: '#fff' } });
    } finally {
      setLoading(false);
      e.target.value = null; 
    }
  };

  // 2. Preencher IBGE
  const handlePreencherIbge = async () => {
    if (!ibgeFile) {
        toast.error('Anexe a planilha de destino primeiro.', { style: { background: '#121212', color: '#fff', border: '1px solid #ef4444' }});
        return;
    }

    setLoadingIbge(true);
    const toastId = toast.loading("A pesquisar códigos IBGE na nuvem...", { style: { background: '#121212', color: '#fff' }});
    
    try {
        const formData = new FormData();
        formData.append('arquivo', ibgeFile);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ferramentas/preencher-ibge`, { method: 'POST', body: formData });
        if (!response.ok) throw new Error('Erro na API');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "Base_IBGE_Preenchida.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();

        toast.success('Códigos IBGE preenchidos!', { id: toastId, style: { border: '1px solid #10b981', background: '#121212', color: '#fff' }});
    } catch (e) {
        toast.error('Falha no processamento.', { id: toastId, style: { border: '1px solid #ef4444', background: '#121212', color: '#fff' }});
    } finally {
        setLoadingIbge(false);
    }
  };

  // 3. Preencher Prazos e Frequência
  const handlePreencherPrazos = async () => {
    if (!prazosDestino || !prazosBase) {
        toast.error('Anexe a Planilha de Destino e a Base de Prazos.', { style: { background: '#121212', color: '#fff', border: '1px solid #ef4444' }});
        return;
    }

    setLoadingPrazos(true);
    const toastId = toast.loading("A cruzar dados de prazos...", { style: { background: '#121212', color: '#fff' }});
    
    try {
        const formData = new FormData();
        formData.append('destino', prazosDestino);
        formData.append('base', prazosBase);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ferramentas/preencher-prazos`, { method: 'POST', body: formData });
        if (!response.ok) throw new Error('Erro na API');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "Destino_Prazos_Atualizados.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();

        toast.success('Prazos atualizados com sucesso!', { id: toastId, style: { border: '1px solid #10b981', background: '#121212', color: '#fff' }});
    } catch (e) {
        toast.error('Falha no cruzamento de dados.', { id: toastId, style: { border: '1px solid #ef4444', background: '#121212', color: '#fff' }});
    } finally {
        setLoadingPrazos(false);
    }
  };

  // 4. Criar Região
  const handleCriarRegiao = async () => {
    if (!regiaoCnpj || !regiaoBase || !regiaoModelo) {
        toast.error('Preencha o CNPJ e anexe os dois ficheiros.', { style: { background: '#121212', color: '#fff', border: '1px solid #ef4444' }});
        return;
    }

    setLoadingRegiao(true);
    const toastId = toast.loading("A criar regiões...", { style: { background: '#121212', color: '#fff' }});
    
    try {
        const formData = new FormData();
        formData.append('base', regiaoBase);
        formData.append('modelo', regiaoModelo);
        formData.append('escolha', regiaoOpcao);
        formData.append('cnpj', regiaoCnpj);
        formData.append('nome_transportadora', regiaoNome);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ferramentas/criar-regiao`, { method: 'POST', body: formData });
        if (!response.ok) throw new Error('Erro na API');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "Modelo_Regioes_Preenchido.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();

        toast.success('Regiões criadas!', { id: toastId, style: { border: '1px solid #10b981', background: '#121212', color: '#fff' }});
    } catch (e) {
        toast.error('Falha no processamento.', { id: toastId, style: { border: '1px solid #ef4444', background: '#121212', color: '#fff' }});
    } finally {
        setLoadingRegiao(false);
    }
  };

  // 5. Gerar Rotas
  const handleGerarRotas = async () => {
    if (!rotasCnpj || !rotasIbge || !rotasModelo) {
        toast.error('CNPJ, IBGE Origem e Modelo são obrigatórios.', { style: { background: '#121212', color: '#fff', border: '1px solid #ef4444' }});
        return;
    }

    setLoadingRotas(true);
    const toastId = toast.loading("A gerar rotas...", { style: { background: '#121212', color: '#fff' }});
    
    try {
        const formData = new FormData();
        formData.append('modelo', rotasModelo);
        formData.append('cnpj', rotasCnpj);
        formData.append('nome_transportadora', rotasNome);
        formData.append('descricao', rotasDesc);
        formData.append('ibge_origem', rotasIbge);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ferramentas/gerar-rotas`, { method: 'POST', body: formData });
        if (!response.ok) throw new Error('Erro na API');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "Rotas_Geradas.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();

        toast.success('Rotas geradas com sucesso!', { id: toastId, style: { border: '1px solid #10b981', background: '#121212', color: '#fff' }});
    } catch (e) {
        toast.error('Falha ao gerar rotas.', { id: toastId, style: { border: '1px solid #ef4444', background: '#121212', color: '#fff' }});
    } finally {
        setLoadingRotas(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 relative z-10">
      
      <style>{`
        @keyframes border-glow-spin { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-magic-border { background-size: 200% 200%; animation: border-glow-spin 3s linear infinite; }
        
        @keyframes loading-bar { 0% { transform: translateX(-150%); } 100% { transform: translateX(250%); } }
        .animate-loading-bar { animation: loading-bar 1.5s ease-in-out infinite; }
        
        /* Custom scrollbar para os cartões abertos */
        .glass-scroll::-webkit-scrollbar { width: 4px; }
        .glass-scroll::-webkit-scrollbar-track { background: transparent; }
        .glass-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
      `}</style>

      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 drop-shadow-sm">Ferramentas Logísticas</h1>
          <p className="text-white/50 mt-2 font-light tracking-wide">Workspace com integração cloud em tempo real.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* === PREENCHER PRAZOS E FREQUÊNCIA === */}
        <GlassCard 
          id="prazos" title="Prazos e Frequência" desc="Cruza base de dados com tabela padrão."
          icon={<Clock size={22} className="text-white drop-shadow-md"/>} color="blue"
          isExpanded={expandedId === 'prazos'} onToggle={() => toggleCard('prazos')}
        >
             <div className="grid grid-cols-2 gap-3 h-20 mb-4">
                <UploadBtn label="Planilha Destino" file={prazosDestino} onChange={(e) => setPrazosDestino(e.target.files[0])} />
                <UploadBtn label="Base de Prazos" file={prazosBase} onChange={(e) => setPrazosBase(e.target.files[0])} />
             </div>
             <ActionBtn label="Processar Prazos" onClick={handlePreencherPrazos} color="blue" isLoading={loadingPrazos} />
        </GlassCard>

        {/* === PREENCHER IBGE === */}
        <GlassCard 
          id="ibge" title="Preencher IBGE" desc="Cruza Cidades e preenche códigos IBGE."
          icon={<FileSpreadsheet size={22} className="text-white drop-shadow-md"/>} color="emerald"
          isExpanded={expandedId === 'ibge'} onToggle={() => toggleCard('ibge')}
        >
             <div className="h-20 mb-4">
                <UploadBtn label="Planilha Destino (Base)" file={ibgeFile} onChange={(e) => setIbgeFile(e.target.files[0])} />
             </div>
             <ActionBtn label="Preencher IBGE" onClick={handlePreencherIbge} color="emerald" isLoading={loadingIbge} />
        </GlassCard>

        {/* === CRIAR REGIÃO === */}
        <GlassCard 
          id="regiao" title="Criar Região" desc="Estruturação CEP/KM."
          icon={<MapPinned size={22} className="text-white drop-shadow-md"/>} color="purple"
          isExpanded={expandedId === 'regiao'} onToggle={() => toggleCard('regiao')}
        >
             <div className="space-y-3 mb-4">
               <GlassSelect 
                 value={regiaoOpcao} onChange={(e) => setRegiaoOpcao(e.target.value)}
                 options={[{value: '1', label: "Opção 1: Faixa de Km"}, {value: '2', label: "Opção 2: Prazos"}, {value: '3', label: "Opção 3: Frete"}]} 
               />
               <GlassInput placeholder="CNPJ da Transportadora" value={regiaoCnpj} onChange={(e) => setRegiaoCnpj(e.target.value)} />
               <GlassInput placeholder="Nome Transp. (Opcional)" value={regiaoNome} onChange={(e) => setRegiaoNome(e.target.value)} />
             </div>
             <div className="grid grid-cols-2 gap-3 h-16 mb-2">
                <UploadBtn label="Base Prazos" file={regiaoBase} onChange={(e) => setRegiaoBase(e.target.files[0])} />
                <UploadBtn label="Modelo Reg." file={regiaoModelo} onChange={(e) => setRegiaoModelo(e.target.files[0])} />
             </div>
             <ActionBtn label="Criar Regiões" onClick={handleCriarRegiao} color="purple" isLoading={loadingRegiao} />
        </GlassCard>

        {/* === GERAR ROTAS === */}
        <GlassCard 
          id="rotas" title="Gerar Rotas" desc="Roteirização Logística (Excel)."
          icon={<Route size={22} className="text-white drop-shadow-md"/>} color="orange"
          isExpanded={expandedId === 'rotas'} onToggle={() => toggleCard('rotas')}
        >
             <div className="space-y-3 mb-4">
               <GlassInput placeholder="CNPJ da Transportadora" value={rotasCnpj} onChange={(e) => setRotasCnpj(e.target.value)} />
               <GlassInput placeholder="Nome da Transportadora" value={rotasNome} onChange={(e) => setRotasNome(e.target.value)} />
               <GlassInput placeholder="Código IBGE Origem" value={rotasIbge} onChange={(e) => setRotasIbge(e.target.value)} />
               <GlassInput placeholder="Descrição Adicional" value={rotasDesc} onChange={(e) => setRotasDesc(e.target.value)} />
             </div>
             <div className="h-16 mb-4">
                <UploadBtn label="Modelo de Regiões" file={rotasModelo} onChange={(e) => setRotasModelo(e.target.files[0])} />
             </div>
             <ActionBtn label="Gerar Rotas" onClick={handleGerarRotas} color="orange" isLoading={loadingRotas} />
        </GlassCard>

        {/* === CONVERTER S/N === */}
        <GlassCard 
          id="sn" title="Converter S/N" desc="Normalização Booleana automática."
          icon={<RefreshCw size={22} className="text-white drop-shadow-md"/>} color="cyan"
          isExpanded={expandedId === 'sn'} onToggle={() => toggleCard('sn')}
        >
            <div className="h-24">
                <UploadBtn 
                  label={loadingSN ? "A Processar..." : "Anexar Excel para Processar"} 
                  onChange={(e) => processSingleFile(e, 'converter-sn', 'Frequencia_Convertida_SN.xlsx', setLoadingSN)} 
                />
            </div>
        </GlassCard>

        {/* === CONVERTER STQQS === */}
        <GlassCard 
          id="stqqs" title="Converter STQQS" desc="Parsing de string semanal."
          icon={<Calendar size={22} className="text-white drop-shadow-md"/>} color="pink"
          isExpanded={expandedId === 'stqqs'} onToggle={() => toggleCard('stqqs')}
        >
            <div className="h-24">
                <UploadBtn 
                  label={loadingSTQQS ? "A Processar..." : "Anexar Excel para Processar"} 
                  onChange={(e) => processSingleFile(e, 'converter-stqqs', 'Frequencia_Convertida_STQQS.xlsx', setLoadingSTQQS)} 
                />
            </div>
        </GlassCard>

      </div>
    </div>
  );
}

// ==========================================
// COMPONENTES "LIQUID GLASS" (ESTILO APPLE)
// ==========================================

function GlassCard({ title, desc, icon, color, children, isExpanded, onToggle }) {
  const styles = {
    blue: { glow: "bg-blue-500", iconBox: "from-blue-500 to-indigo-600", border: "from-blue-400/50 via-indigo-500/50 to-blue-600/50", text: "text-blue-300" },
    emerald: { glow: "bg-emerald-500", iconBox: "from-emerald-400 to-teal-600", border: "from-emerald-400/50 via-teal-500/50 to-emerald-600/50", text: "text-emerald-300" },
    purple: { glow: "bg-purple-500", iconBox: "from-purple-500 to-fuchsia-600", border: "from-purple-400/50 via-fuchsia-500/50 to-purple-600/50", text: "text-purple-300" },
    orange: { glow: "bg-orange-500", iconBox: "from-orange-400 to-red-500", border: "from-orange-400/50 via-red-500/50 to-orange-600/50", text: "text-orange-300" },
    cyan: { glow: "bg-cyan-500", iconBox: "from-cyan-400 to-blue-500", border: "from-cyan-400/50 via-blue-500/50 to-cyan-600/50", text: "text-cyan-300" },
    pink: { glow: "bg-pink-500", iconBox: "from-pink-400 to-rose-600", border: "from-pink-400/50 via-rose-500/50 to-pink-600/50", text: "text-pink-300" },
  };
  const theme = styles[color] || styles.blue;

  return (
    <div onClick={onToggle} className={`group relative w-full rounded-[28px] p-[1px] transition-all duration-500 ease-out cursor-pointer shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
      ${isExpanded ? `bg-gradient-to-r ${theme.border} animate-magic-border shadow-[0_15px_50px_rgba(0,0,0,0.6)] -translate-y-1` : 'bg-white/[0.05] hover:bg-white/[0.1] hover:-translate-y-1'}
    `}>
      <div className="relative w-full h-full bg-black/30 backdrop-blur-[40px] backdrop-saturate-[150%] rounded-[27px] overflow-hidden flex flex-col">
        <div className={`absolute -top-16 -right-16 w-56 h-56 rounded-full ${theme.glow} opacity-10 blur-[80px] pointer-events-none transition-all duration-700 ease-in-out group-hover:opacity-30 group-hover:scale-125 ${isExpanded && 'opacity-40'}`}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none rounded-[27px]"></div>

        <div className="relative z-10 flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br ${theme.iconBox} shadow-[0_4px_15px_rgba(0,0,0,0.3)] border border-white/20 transform transition-all duration-500 ease-out ${isExpanded ? 'scale-110 rotate-3' : 'group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]'}`}>
              {icon}
            </div>
            <div className="flex flex-col">
              <h3 className="text-[17px] font-bold text-white/90 tracking-wide transition-colors group-hover:text-white drop-shadow-sm">{title}</h3>
              <span className={`text-[11px] font-medium transition-colors duration-300 ${isExpanded ? theme.text : 'text-white/40 group-hover:text-white/60'}`}>{desc}</span>
            </div>
          </div>
          <div className={`p-2 rounded-full backdrop-blur-md border transition-all duration-300 ${isExpanded ? 'bg-white/10 border-white/20 rotate-180 text-white shadow-inner' : 'bg-black/20 border-white/5 text-white/40 group-hover:bg-white/5 group-hover:text-white'}`}>
            <ChevronDown size={18} strokeWidth={2.5}/>
          </div>
        </div>

        <div className={`relative z-10 px-6 transition-all duration-500 ease-in-out overflow-hidden glass-scroll ${isExpanded ? 'max-h-[600px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5"></div>
          <div onClick={(e) => e.stopPropagation()} className="relative">
             {children}
          </div>
        </div>
      </div>
    </div>
  );
}

const GlassInput = ({ ...props }) => (
  <input 
    {...props} 
    style={{ fontFamily: "'JetBrains Mono', monospace" }} 
    className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 text-[13px] text-white placeholder-white/30 outline-none focus:border-white/40 focus:bg-white/5 focus:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all mb-2 shadow-inner" 
  />
);

const GlassSelect = ({ options, ...props }) => (
  <div className="relative mb-2">
    <select {...props} style={{ fontFamily: "'JetBrains Mono', monospace" }} className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 text-[13px] text-white outline-none focus:border-white/40 focus:bg-white/5 appearance-none cursor-pointer shadow-inner">
      {options.map((opt, i) => <option value={opt.value} key={i} className="bg-[#121212] text-white">{opt.label}</option>)}
    </select>
    <Settings2 size={16} className="absolute right-4 top-3.5 text-white/40 pointer-events-none"/>
  </div>
);

const UploadBtn = ({ label, onChange, file }) => (
  <label className={`group relative block w-full cursor-pointer overflow-hidden rounded-2xl h-full backdrop-blur-md border transition-all duration-300 shadow-inner ${file ? 'border-emerald-400/40 bg-emerald-500/10' : 'border-white/10 bg-black/20 hover:border-white/30 hover:bg-white/5'}`}>
    <div className="relative h-full py-4 px-2 flex flex-col items-center justify-center gap-2">
        <UploadCloud size={22} className={`${file ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'text-white/30 group-hover:text-white/70'} transition-all duration-300`}/>
        <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className={`text-[10px] font-bold uppercase tracking-widest text-center mt-1 truncate w-full px-2 ${file ? 'text-emerald-300' : 'text-white/40 group-hover:text-white/80'} transition-colors`}>
            {file ? file.name : label}
        </span>
    </div>
    <input type="file" className="hidden" onChange={onChange} />
  </label>
);

const ActionBtn = ({ label, onClick, color, isLoading }) => {
  const glowColors = {
    blue: "hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] bg-blue-500/20 text-blue-300 border-blue-500/30",
    emerald: "hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    purple: "hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] bg-purple-500/20 text-purple-300 border-purple-500/30",
    orange: "hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] bg-orange-500/20 text-orange-300 border-orange-500/30",
  };
  
  const baseStyle = glowColors[color] || "bg-white/5 text-white border-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]";
  const hoverStyle = isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-white/10 hover:border-white/40 hover:text-white";

  return (
    <button 
      onClick={onClick} 
      disabled={isLoading}
      className={`relative overflow-hidden w-full mt-4 backdrop-blur-md border font-bold uppercase tracking-widest text-[11px] py-3.5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${baseStyle} ${hoverStyle}`}
    >
       {/* Barra de Loading Animada */}
       {isLoading && (
          <div className="absolute inset-0 w-full h-full pointer-events-none">
             <div className="h-full bg-white/20 animate-loading-bar w-[40%] rounded-full blur-sm"></div>
          </div>
       )}
       
       <div className="relative z-10 flex items-center gap-2">
         {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Play size={14} fill="currentColor"/>} 
         {isLoading ? 'A PROCESSAR...' : label}
       </div>
    </button>
  );
};

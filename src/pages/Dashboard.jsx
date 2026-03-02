import React, { useState } from 'react';
import { Clock, MapPinned, Route, RefreshCw, Calendar, FileSpreadsheet, ChevronDown, UploadCloud, Settings2, Play } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [expandedId, setExpandedId] = useState(null);

  // Estados para a Ferramenta "Criar Região"
  const [regiaoOpcao, setRegiaoOpcao] = useState('1');
  const [regiaoNome, setRegiaoNome] = useState('');
  const [regiaoCnpj, setRegiaoCnpj] = useState('');
  const [regiaoBase, setRegiaoBase] = useState(null);
  const [regiaoModelo, setRegiaoModelo] = useState(null);

  // Estados para a Ferramenta "Gerar Rotas"
  const [rotasCnpj, setRotasCnpj] = useState('');
  const [rotasNome, setRotasNome] = useState('');
  const [rotasDesc, setRotasDesc] = useState('');
  const [rotasIbge, setRotasIbge] = useState('');
  const [rotasModelo, setRotasModelo] = useState(null);

  const toggleCard = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // 1. Função para Ferramentas Simples (Apenas 1 Ficheiro - S/N e STQQS)
  const processSingleFile = async (e, endpoint, downloadName) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading(`A processar ${file.name}...`, { style: { background: '#121212', color: '#fff' }});
    
    try {
      const formData = new FormData();
      formData.append('arquivo', file);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ferramentas/${endpoint}`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Erro na resposta da API');

      // Transferir Ficheiro
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Ficheiro convertido com sucesso!', { id: toastId, style: { border: '1px solid #10b981', background: '#121212', color: '#fff' }});
    } catch (error) {
      toast.error('Erro ao converter ficheiro.', { id: toastId, style: { border: '1px solid #ef4444', background: '#121212', color: '#fff' } });
    }
    e.target.value = null; // Reset do input
  };

  // 2. Função para "Criar Região"
  const handleCriarRegiao = async () => {
    if (!regiaoCnpj || !regiaoBase || !regiaoModelo) {
        toast.error('Preencha o CNPJ e anexe os dois ficheiros.', { style: { background: '#121212', color: '#fff', border: '1px solid #ef4444' }});
        return;
    }

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
    }
  };

  // 3. Função para "Gerar Rotas"
  const handleGerarRotas = async () => {
    if (!rotasCnpj || !rotasIbge || !rotasModelo) {
        toast.error('CNPJ, IBGE Origem e Modelo são obrigatórios.', { style: { background: '#121212', color: '#fff', border: '1px solid #ef4444' }});
        return;
    }

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
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      
      <style>{`
        @keyframes border-glow-spin { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-magic-border { background-size: 200% 200%; animation: border-glow-spin 3s linear infinite; }
      `}</style>

      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Dashboard de Ferramentas</h1>
          <p className="text-gray-400 mt-2 font-light">Selecione uma ferramenta abaixo para configurar e executar.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* === CRIAR REGIÃO === */}
        <GlassCard 
          id="regiao" title="Criar Região" desc="Estruturação CEP/KM."
          icon={<MapPinned size={24} className="text-white"/>} color="purple"
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
             <div className="grid grid-cols-2 gap-3">
                <UploadBtn label="Base Prazos" file={regiaoBase} onChange={(e) => setRegiaoBase(e.target.files[0])} />
                <UploadBtn label="Modelo Reg." file={regiaoModelo} onChange={(e) => setRegiaoModelo(e.target.files[0])} />
             </div>
             <ActionBtn label="Criar Regiões" onClick={handleCriarRegiao} />
        </GlassCard>

        {/* === GERAR ROTAS === */}
        <GlassCard 
          id="rotas" title="Gerar Rotas" desc="Roteirização Logística (Excel)."
          icon={<Route size={24} className="text-white"/>} color="orange"
          isExpanded={expandedId === 'rotas'} onToggle={() => toggleCard('rotas')}
        >
             <div className="space-y-3 mb-4">
               <GlassInput placeholder="CNPJ da Transportadora" value={rotasCnpj} onChange={(e) => setRotasCnpj(e.target.value)} />
               <GlassInput placeholder="Nome da Transportadora" value={rotasNome} onChange={(e) => setRotasNome(e.target.value)} />
               <GlassInput placeholder="Código IBGE Origem" value={rotasIbge} onChange={(e) => setRotasIbge(e.target.value)} />
               <GlassInput placeholder="Descrição Adicional" value={rotasDesc} onChange={(e) => setRotasDesc(e.target.value)} />
             </div>
             <div className="h-16 mb-2">
                <UploadBtn label="Modelo de Regiões" file={rotasModelo} onChange={(e) => setRotasModelo(e.target.files[0])} />
             </div>
             <ActionBtn label="Gerar Rotas" onClick={handleGerarRotas} />
        </GlassCard>

        {/* === CONVERTER S/N === */}
        <GlassCard 
          id="sn" title="Converter S/N" desc="Normalização Booleana automática."
          icon={<RefreshCw size={24} className="text-white"/>} color="cyan"
          isExpanded={expandedId === 'sn'} onToggle={() => toggleCard('sn')}
        >
            <div className="h-24">
                <UploadBtn label="Anexar Excel para Processar" onChange={(e) => processSingleFile(e, 'converter-sn', 'Frequencia_Convertida_SN.xlsx')} />
            </div>
        </GlassCard>

        {/* === CONVERTER STQQS === */}
        <GlassCard 
          id="stqqs" title="Converter STQQS" desc="Parsing de string semanal."
          icon={<Calendar size={24} className="text-white"/>} color="pink"
          isExpanded={expandedId === 'stqqs'} onToggle={() => toggleCard('stqqs')}
        >
            <div className="h-24">
                <UploadBtn label="Anexar Excel para Processar" onChange={(e) => processSingleFile(e, 'converter-stqqs', 'Frequencia_Convertida_STQQS.xlsx')} />
            </div>
        </GlassCard>

        {/* Ferramentas em Desenvolvimento / Mock */}
        <GlassCard 
          id="prazos" title="Prazos e Frequência" desc="Brevemente: Integração Nuvem."
          icon={<Clock size={24} className="text-white"/>} color="blue"
          isExpanded={expandedId === 'prazos'} onToggle={() => toggleCard('prazos')}
        >
            <p className="text-sm text-gray-400 text-center py-4">API em construção para esta ferramenta.</p>
        </GlassCard>

        <GlassCard 
          id="ibge" title="Preencher IBGE" desc="Brevemente: Integração Nuvem."
          icon={<FileSpreadsheet size={24} className="text-white"/>} color="emerald"
          isExpanded={expandedId === 'ibge'} onToggle={() => toggleCard('ibge')}
        >
            <p className="text-sm text-gray-400 text-center py-4">A usar base de dados local na aba "Base IBGE".</p>
        </GlassCard>

      </div>
    </div>
  );
}

// ==========================================
// COMPONENTES UI REAPROVEITÁVEIS
// ==========================================

function GlassCard({ title, desc, icon, color, children, isExpanded, onToggle }) {
  const styles = {
    blue: { glow: "bg-blue-600", iconBox: "from-blue-500 to-indigo-600", magicBorder: "from-blue-500 via-indigo-400 to-blue-600", text: "text-blue-400" },
    emerald: { glow: "bg-emerald-600", iconBox: "from-emerald-500 to-green-600", magicBorder: "from-emerald-500 via-green-400 to-emerald-600", text: "text-emerald-400" },
    purple: { glow: "bg-purple-600", iconBox: "from-purple-500 to-fuchsia-600", magicBorder: "from-purple-500 via-pink-400 to-purple-600", text: "text-purple-400" },
    orange: { glow: "bg-orange-600", iconBox: "from-orange-500 to-red-600", magicBorder: "from-orange-500 via-yellow-400 to-orange-600", text: "text-orange-400" },
    cyan: { glow: "bg-cyan-600", iconBox: "from-cyan-500 to-blue-600", magicBorder: "from-cyan-500 via-teal-400 to-cyan-600", text: "text-cyan-400" },
    pink: { glow: "bg-pink-600", iconBox: "from-pink-500 to-rose-600", magicBorder: "from-pink-500 via-rose-400 to-pink-600", text: "text-pink-400" },
  };
  const theme = styles[color] || styles.blue;

  return (
    <div onClick={onToggle} className={`group relative w-full rounded-3xl p-[1px] transition-all duration-500 ease-out cursor-pointer overflow-hidden shadow-2xl ${isExpanded ? `bg-gradient-to-r ${theme.magicBorder} animate-magic-border shadow-[0_0_30px_rgba(0,0,0,0.5)]` : 'bg-white/10 hover:bg-white/20 hover:-translate-y-2'}`}>
      <div className="relative w-full h-full bg-[#121212]/80 backdrop-blur-3xl rounded-[23px] overflow-hidden">
        <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full ${theme.glow} opacity-20 blur-[80px] pointer-events-none transition-all duration-700 ease-in-out group-hover:opacity-40 group-hover:scale-125`}></div>

        <div className="relative z-10 flex items-center justify-between p-6">
          <div className="flex items-center gap-5">
            <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${theme.iconBox} shadow-lg transform transition-all duration-500 ease-out ${isExpanded ? 'scale-110 rotate-3 shadow-lg shadow-black/20' : 'group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]'}`}>
              {icon}
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-white tracking-wide group-hover:text-white transition-colors">{title}</h3>
              <span className={`text-xs font-medium transition-colors duration-300 ${isExpanded ? theme.text : 'text-gray-500 group-hover:text-gray-400'}`}>{desc}</span>
            </div>
          </div>
          <div className={`p-2 rounded-full border border-white/5 bg-white/5 transition-all duration-300 ${isExpanded ? 'bg-white/10 rotate-180 text-white' : 'group-hover:bg-white/10 text-gray-500 group-hover:text-white'}`}>
            <ChevronDown size={20} />
          </div>
        </div>

        <div className={`relative z-10 px-6 transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5"></div>
          <div onClick={(e) => e.stopPropagation()}>{children}</div>
        </div>
      </div>
    </div>
  );
}

const GlassInput = ({ ...props }) => (
  <input 
    {...props} 
    style={{ fontFamily: "'JetBrains Mono', monospace" }} 
    className="w-full bg-[#09090b]/50 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-emerald-400 placeholder-gray-600 outline-none focus:border-white/30 focus:bg-[#09090b]/90 focus:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all mb-2" 
  />
);

const GlassSelect = ({ options, ...props }) => (
  <div className="relative mb-2">
    <select {...props} style={{ fontFamily: "'JetBrains Mono', monospace" }} className="w-full bg-[#09090b]/50 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-emerald-400 outline-none focus:border-white/30 appearance-none cursor-pointer">
      {options.map((opt, i) => <option value={opt.value} key={i}>{opt.label}</option>)}
    </select>
    <Settings2 size={16} className="absolute right-4 top-3.5 text-gray-600 pointer-events-none"/>
  </div>
);

const UploadBtn = ({ label, onChange, file }) => (
  <label className={`group relative block w-full cursor-pointer overflow-hidden rounded-xl h-full ${file ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/20 bg-[#09090b]/70'} border border-dashed transition-all duration-300 hover:border-white/50 hover:bg-[#09090b]/90`}>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
    <div className="relative h-full py-4 px-2 flex flex-col items-center justify-center gap-2">
        <UploadCloud size={20} className={`${file ? 'text-emerald-500' : 'text-gray-500 group-hover:text-[#5C2EE9]'} transition-colors duration-300`}/>
        <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className={`text-[10px] font-bold uppercase tracking-widest text-center mt-1 truncate w-full px-2 ${file ? 'text-emerald-400' : 'text-[#a1a1aa] group-hover:text-white'} transition-colors`}>
            {file ? file.name : label}
        </span>
    </div>
    <input type="file" className="hidden" onChange={onChange} />
  </label>
);

const ActionBtn = ({ label, onClick }) => (
  <button onClick={onClick} className="w-full mt-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-widest py-3 rounded-xl transition-all flex items-center justify-center gap-2">
     <Play size={14} fill="currentColor"/> {label}
  </button>
);

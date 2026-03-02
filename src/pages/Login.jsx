import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, ArrowRight, Loader2, Eye, EyeOff, UserPlus } from 'lucide-react';
import logoImg from '../assets/logo.png'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // ESTADOS DE ANIMAÇÃO E MODO
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); 
  const [isRegistering, setIsRegistering] = useState(false); // NOVO: Controle de modo
  
  // Pegamos o signIn e o signUp do contexto
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    
    try {
      if (isRegistering) {
        await signUp(email, password);
        setIsSuccess(true); 
        setTimeout(() => { navigate('/'); }, 1500);
      } else {
        await signIn(email, password);
        setIsSuccess(true); 
        setTimeout(() => { navigate('/'); }, 1500);
      }
    } catch (err) {
      // O Supabase retorna mensagens em inglês por padrão, podemos traduzir algumas comuns
      let msg = err.message;
      if (msg.includes('Invalid login credentials')) msg = 'E-mail ou senha incorretos.';
      if (msg.includes('User already registered')) msg = 'Este e-mail já está em uso.';
      if (msg.includes('Password should be at least')) msg = 'A senha deve ter pelo menos 6 caracteres.';
      
      setError(msg);
      setIsLoggingIn(false);
    } 
  }

  const handleExpand = () => {
    if (!isExpanded && !isSuccess) {
      setIsExpanded(true);
    }
  };

  const toggleMode = (e) => {
    e.preventDefault();
    setIsRegistering(!isRegistering);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] relative overflow-hidden" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      
      <style>{`
        @keyframes float-purple { 0% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30vw, 20vh) scale(1.2); } 66% { transform: translate(-10vw, 40vh) scale(0.9); } 100% { transform: translate(0, 0) scale(1); } }
        @keyframes float-blue { 0% { transform: translate(0, 0) scale(1); } 33% { transform: translate(-30vw, -20vh) scale(1.1); } 66% { transform: translate(20vw, -30vh) scale(1.3); } 100% { transform: translate(0, 0) scale(1); } }
        @keyframes cyber-progress { 0% { width: 0%; opacity: 1; } 80% { width: 100%; opacity: 1; } 100% { width: 100%; opacity: 0; } }
        @keyframes led-continuous { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }

        .animate-float-purple { animation: float-purple 25s infinite ease-in-out; }
        .animate-float-blue { animation: float-blue 30s infinite ease-in-out; }
        .animate-progress { animation: cyber-progress 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .animate-led-continuous { animation: led-continuous 2.5s linear infinite; }
      `}</style>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] z-0"></div>
      <div className="absolute inset-0 opacity-[0.04] mix-blend-screen z-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/40 rounded-full blur-[120px] animate-float-purple z-0 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px] animate-float-blue z-0 pointer-events-none"></div>

      <div 
        onClick={handleExpand}
        className={`relative z-10 w-full max-w-md p-8 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl ring-1 ring-white/5 transition-all duration-700 ease-in-out flex flex-col items-center
          ${isSuccess ? 'scale-105 border-[#5C2EE9]/30 shadow-[0_0_50px_rgba(92,46,233,0.2)]' : 'shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]'}
          ${!isExpanded && !isSuccess ? 'cursor-pointer hover:bg-white/[0.05] hover:scale-105 hover:shadow-[0_20px_40px_rgba(92,46,233,0.15)] group py-12' : ''}
        `}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

        {!isSuccess ? (
          <>
            <div className="flex flex-col items-center relative z-10 w-full">
              <div className="relative w-56 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                 <img src={logoImg} alt="Consolida" className={`w-full h-auto object-contain brightness-0 invert transition-opacity duration-700 ${!isExpanded ? 'opacity-80 group-hover:opacity-40' : 'opacity-50'}`} />
                 <div className={`absolute inset-0 z-10 overflow-hidden transition-opacity duration-700 ${!isExpanded ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`} style={{ WebkitMaskImage: `url(${logoImg})`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }}>
                   <div className="absolute top-0 bottom-0 left-0 flex w-[200%] animate-led-continuous">
                      <div className="w-1/2 relative h-full">
                         <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-transparent via-[#7b4dff] to-transparent skew-x-[-15deg] shadow-[0_0_20px_#5C2EE9]"></div>
                      </div>
                      <div className="w-1/2 relative h-full">
                         <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-transparent via-[#7b4dff] to-transparent skew-x-[-15deg] shadow-[0_0_20px_#5C2EE9]"></div>
                      </div>
                   </div>
                   <img src={logoImg} alt="" className="relative z-10 w-full h-auto object-contain brightness-0 invert mix-blend-overlay opacity-30" />
                 </div>
              </div>

              <div className={`flex items-center gap-2 transition-all duration-500 ${!isExpanded ? 'mt-8 opacity-60 group-hover:opacity-100' : 'mt-4 opacity-100'}`}>
                <div className={`h-1.5 w-1.5 rounded-full bg-[#5C2EE9] shadow-[0_0_10px_#5C2EE9] ${!isExpanded ? 'animate-ping' : 'animate-pulse'}`}></div>
                <p className="text-gray-300 text-[10px] font-bold tracking-[0.2em] uppercase drop-shadow-md">
                  {isExpanded ? 'Acesso Restrito' : (isRegistering ? 'Criar Novo Acesso' : 'Sessão Segura')}
                </p>
              </div>
            </div>

            <div className={`w-full transition-all duration-700 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[500px] opacity-100 mt-8' : 'max-h-0 opacity-0 mt-0 pointer-events-none'}`}>
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10 w-full">
                {error && (
                  <div className="p-3 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-xl text-red-300 text-xs text-center font-medium animate-in slide-in-from-top-2 shadow-lg">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1 drop-shadow-md">E-mail Corporativo</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-white transition-colors" size={18} />
                    <input 
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl py-3 pl-12 pr-4 text-[13px] text-white outline-none focus:border-white/30 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all placeholder-gray-500"
                      placeholder="nome@exemplo.com" required disabled={!isExpanded || isLoggingIn}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1 drop-shadow-md">Senha</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-white transition-colors" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white outline-none focus:border-white/30 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all placeholder-gray-500"
                      placeholder="••••••••" required disabled={!isExpanded || isLoggingIn}
                    />
                    <button 
                      type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-gray-400 hover:text-white transition-colors focus:outline-none"
                      disabled={!isExpanded || isLoggingIn}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" disabled={!isExpanded || isLoggingIn}
                  className="w-full mt-4 bg-gradient-to-r from-[#5C2EE9]/90 to-[#7b4dff]/90 hover:from-[#5C2EE9] hover:to-[#7b4dff] backdrop-blur-md border border-white/10 text-white py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(92,46,233,0.3)] hover:shadow-[0_10px_40px_rgba(92,46,233,0.6)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-1"
                >
                  {isLoggingIn ? <Loader2 className="animate-spin" size={20} /> : (isRegistering ? <>Cadastrar <UserPlus size={18} /></> : <>Entrar no Sistema <ArrowRight size={18} /></>)}
                </button>

                {/* BOTÃO DE TROCAR MODO (LOGIN / CADASTRO) */}
                <div className="text-center mt-4">
                  <button 
                    type="button"
                    onClick={toggleMode}
                    className="text-xs text-gray-400 hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5"
                  >
                    {isRegistering ? 'Já tem uma conta? Faça Login' : 'Não tem acesso? Solicite Cadastro'}
                  </button>
                </div>

              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 animate-in fade-in duration-500">
             <div className="relative mb-8 group animate-in slide-in-from-bottom-10 duration-700 ease-out">
                <div className="absolute inset-0 bg-[#5C2EE9] blur-[40px] opacity-30 animate-pulse"></div>
                <img src={logoImg} alt="Consolida" className="w-56 relative z-10 object-contain brightness-0 invert drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]" />
             </div>
             <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-2 drop-shadow-md animate-in slide-in-from-bottom-5 fade-in duration-700 delay-150 fill-mode-both">Bem-vindo</h2>
             <p className="text-[#5C2EE9] text-[10px] font-mono mb-10 tracking-widest uppercase animate-in slide-in-from-bottom-2 fade-in duration-700 delay-300 fill-mode-both drop-shadow-[0_0_8px_rgba(92,46,233,0.8)]">Inicializando Workspace...</p>
             <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#5C2EE9] to-[#9d7aff] shadow-[0_0_15px_#5C2EE9] animate-progress"></div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-[#09090b] text-white relative overflow-hidden font-sans">
      
      {/* Estilos de Animação Globais (Copiados do Login) */}
      <style>{`
        @keyframes float-purple { 0% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30vw, 20vh) scale(1.2); } 66% { transform: translate(-10vw, 40vh) scale(0.9); } 100% { transform: translate(0, 0) scale(1); } }
        @keyframes float-blue { 0% { transform: translate(0, 0) scale(1); } 33% { transform: translate(-30vw, -20vh) scale(1.1); } 66% { transform: translate(20vw, -30vh) scale(1.3); } 100% { transform: translate(0, 0) scale(1); } }
        .animate-float-purple { animation: float-purple 25s infinite ease-in-out; }
        .animate-float-blue { animation: float-blue 30s infinite ease-in-out; }
      `}</style>

      {/* Grid de Fundo e Ruído (Textura) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] z-0 pointer-events-none"></div>
      <div className="absolute inset-0 opacity-[0.04] mix-blend-screen z-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      {/* Luzes Flutuantes (Glow) */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px] animate-float-purple z-0 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-float-blue z-0 pointer-events-none"></div>
      
      <Sidebar />
      
      {/* O z-20 aqui garante que o conteúdo fica acima das luzes de fundo */}
      <main className="flex-1 overflow-y-auto p-8 relative z-20">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

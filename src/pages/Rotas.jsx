import React, { useState } from 'react';
import { Route, MapPin } from 'lucide-react';

export default function Rotas() {
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col animate-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Calculadora de Rotas Pro</h1>
        <p className="text-gray-400 mt-1">Roteirização e cálculo de distância exata.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Painel Esquerdo: Inputs */}
        <div className="w-full lg:w-80 glass-dark rounded-2xl p-6 flex flex-col shrink-0">
          <div className="space-y-4 flex-1">
            <div>
              <label className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <MapPin size={16} className="text-primary"/> Origem
              </label>
              <input 
                type="text" 
                value={origem}
                onChange={(e) => setOrigem(e.target.value)}
                placeholder="Ex: Blumenau, SC"
                className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary"
              />
            </div>
            
            <div>
              <label className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <MapPin size={16} className="text-red-500"/> Destino
              </label>
              <input 
                type="text" 
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                placeholder="Ex: São Paulo, SP"
                className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary"
              />
            </div>

            <button className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold tracking-widest mt-6 shadow-lg transition-all hover:-translate-y-1">
              TRAÇAR ROTA
            </button>
          </div>

          <div className="pt-6 border-t border-white/10 text-center">
            <h2 className="text-4xl font-bold text-white mb-1">--- km</h2>
            <p className="text-sm text-gray-400">Tempo estimado: ---</p>
          </div>
        </div>

        {/* Painel Direito: Mapa */}
        <div className="flex-1 glass border border-white/10 rounded-2xl overflow-hidden relative flex items-center justify-center bg-[#0F0F0F]">
          {/* Futuramente, você pode usar a biblioteca 'react-leaflet' aqui */}
          <div className="text-center opacity-50">
            <Route size={48} className="mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400 font-medium">O Mapa será renderizado aqui.</p>
            <p className="text-xs text-gray-600">Recomendado: react-leaflet + OpenStreetMap</p>
          </div>
        </div>
      </div>
    </div>
  );
}
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext'; // Importação do controle de Tema
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Páginas do Sistema
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace';
import TeamManagement from './pages/TeamManagement';
import Agendamento from './pages/Agendamento';
import TDE from './pages/TDE';
import IBGE from './pages/IBGE';
import Rotas from './pages/Rotas';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Rota Pública */}
            <Route path="/login" element={<Login />} />
            
            {/* Rotas Privadas (Protegidas) */}
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              {/* O Dashboard agora é a tela inicial (substituiu o Tools) */}
              <Route index element={<Dashboard />} />
              <Route path="workspace" element={<Workspace />} />
              
              {/* Rota restrita apenas para Administradores */}
              <Route path="team" element={<PrivateRoute requireAdmin={true}><TeamManagement /></PrivateRoute>} />
              
              {/* Demais Ferramentas */}
              <Route path="agendamento" element={<Agendamento />} />
              <Route path="tde" element={<TDE />} />
              <Route path="ibge" element={<IBGE />} />
              <Route path="rotas" element={<Rotas />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}